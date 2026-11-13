-- =============================================================================
-- MIGRACIÓN: Slugs dinámicos aleatorios en public.productos y soporte "Agotado"
-- =============================================================================

begin;

-- 1. Función segura para generar slugs dinámicos con sufijo aleatorio criptográfico
create or replace function public.generate_product_slug(base_name text)
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  cleaned text;
  rand_suffix text;
begin
  cleaned := translate(
    lower(coalesce(base_name, '')),
    'áéíóúüñàèìòùâêîôû',
    'aeiouunaeiouaeiou'
  );
  cleaned := regexp_replace(cleaned, '[^a-z0-9]+', '-', 'g');
  cleaned := regexp_replace(cleaned, '^-+|-+$', '', 'g');
  if cleaned = '' then
    cleaned := 'drop';
  end if;
  cleaned := left(cleaned, 48);
  cleaned := regexp_replace(cleaned, '-+$', '', 'g');
  rand_suffix := substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  return cleaned || '-' || rand_suffix;
end;
$$;

-- 2. Agregar columna slug a public.productos
alter table public.productos
  add column if not exists slug text;

-- 3. Backfill de slugs aleatorios para productos existentes
update public.productos
set slug = public.generate_product_slug(nombre)
where slug is null or btrim(slug) = '';

-- 4. Restricciones NOT NULL y UNIQUE (índice B-tree único para lookups O(log N))
alter table public.productos
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'productos_slug_key'
      and conrelid = 'public.productos'::regclass
  ) then
    alter table public.productos
      add constraint productos_slug_key unique (slug);
  end if;
end;
$$;

-- 5. Trigger BEFORE INSERT para generar slug aleatorio automático si no se envía
create or replace function public.set_productos_default_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.slug is null or btrim(new.slug) = '' then
    new.slug := public.generate_product_slug(new.nombre);
  else
    new.slug := lower(regexp_replace(btrim(new.slug), '[^a-z0-9-]+', '-', 'g'));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_productos_default_slug on public.productos;
create trigger trg_productos_default_slug
  before insert or update on public.productos
  for each row
  execute function public.set_productos_default_slug();

-- 6. Permitir lectura pública de productos por slug incluso si activo = false
--    para mostrar estado "Agotado" y productos relacionados en /p/[slug] sin 404.
drop policy if exists "Lectura publica de productos activos" on public.productos;
drop policy if exists "Lectura publica de productos" on public.productos;
create policy "Lectura publica de productos"
  on public.productos
  for select
  to anon, authenticated
  using (true);

commit;
