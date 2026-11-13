-- =============================================================================
-- ESQUEMA RELACIONAL NORMALIZADO — URBAN_DROP (Supabase / PostgreSQL)
-- Buenas prácticas aplicadas:
--   1. IDENTITY BIGINT Primary Keys (SQL-standard, alta localidad de índice)
--   2. Tipos óptimos: text, numeric(10,2), integer, boolean, timestamptz
--   3. Índices explícitos en todas las llaves foráneas (10-100x faster JOINs)
--   4. Row Level Security (RLS) habilitado en todas las tablas de `public`
--   5. Políticas de lectura pública (`TO anon, authenticated`) para el catálogo
-- =============================================================================

begin;

-- 1. Tabla: categorias
create table if not exists public.categorias (
  id bigint generated always as identity primary key,
  slug text not null unique,
  nombre text not null,
  icono text not null default 'fa-shirt',
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Tabla: productos
create table if not exists public.productos (
  id bigint generated always as identity primary key,
  categoria_id bigint not null references public.categorias(id) on delete restrict,
  slug text not null unique,
  nombre text not null,
  precio numeric(10,2) not null check (precio >= 0),
  etiqueta text not null,
  corte_fit text not null,
  info_modelo text not null,
  stock_disponible integer not null default 0 check (stock_disponible >= 0),
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

-- Índice en llave foránea y filtro frecuente
create index if not exists productos_categoria_id_idx on public.productos (categoria_id);
create index if not exists productos_activo_orden_idx on public.productos (activo, orden);

-- 3. Tabla: producto_imagenes
create table if not exists public.producto_imagenes (
  id bigint generated always as identity primary key,
  producto_id bigint not null references public.productos(id) on delete cascade,
  url text not null,
  alt_text text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists producto_imagenes_producto_id_idx on public.producto_imagenes (producto_id, orden);

-- 4. Tabla: producto_tallas (Matriz de tallas y medidas exactas en cm)
create table if not exists public.producto_tallas (
  id bigint generated always as identity primary key,
  producto_id bigint not null references public.productos(id) on delete cascade,
  talla text not null check (talla in ('S', 'M', 'L', 'XL')),
  medidas_cm text not null,
  stock_talla integer not null default 1 check (stock_talla >= 0),
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  unique (producto_id, talla)
);

create index if not exists producto_tallas_producto_id_idx on public.producto_tallas (producto_id, orden);

-- 5. Tabla: producto_especificaciones (Materiales y cuidados)
create table if not exists public.producto_especificaciones (
  id bigint generated always as identity primary key,
  producto_id bigint not null references public.productos(id) on delete cascade,
  descripcion text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists producto_especificaciones_producto_id_idx on public.producto_especificaciones (producto_id, orden);

-- =============================================================================
-- SEGURIDAD: ROW LEVEL SECURITY (RLS) Y PERMISOS DATA API
-- =============================================================================

alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.producto_imagenes enable row level security;
alter table public.producto_tallas enable row level security;
alter table public.producto_especificaciones enable row level security;

-- Políticas de lectura pública para el catálogo (anon y authenticated)
drop policy if exists "Lectura publica de categorias activas" on public.categorias;
create policy "Lectura publica de categorias activas"
  on public.categorias
  for select
  to anon, authenticated
  using (activo = true);

drop policy if exists "Lectura publica de productos activos" on public.productos;
drop policy if exists "Lectura publica de productos" on public.productos;
create policy "Lectura publica de productos"
  on public.productos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Lectura publica de imagenes de productos" on public.producto_imagenes;
create policy "Lectura publica de imagenes de productos"
  on public.producto_imagenes
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Lectura publica de tallas de productos" on public.producto_tallas;
create policy "Lectura publica de tallas de productos"
  on public.producto_tallas
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Lectura publica de especificaciones de productos" on public.producto_especificaciones;
create policy "Lectura publica de especificaciones de productos"
  on public.producto_especificaciones
  for select
  to anon, authenticated
  using (true);

-- Grants explícitos para acceso mediante Supabase Data API (PostgREST)
grant usage on schema public to anon, authenticated;
grant select on public.categorias to anon, authenticated;
grant select on public.productos to anon, authenticated;
grant select on public.producto_imagenes to anon, authenticated;
grant select on public.producto_tallas to anon, authenticated;
grant select on public.producto_especificaciones to anon, authenticated;

commit;
