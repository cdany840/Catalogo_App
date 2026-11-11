-- =============================================================================
-- AUTENTICACIÓN JWT & AUDITORÍA OWASP TOP 10 (2025) — URBAN_DROP (Supabase)
-- Controles implementados:
--   - A01:2025 Broken Access Control: Autorización basada en `app_metadata.role`
--     dentro del JWT firmado (nunca `user_metadata`), políticas RLS con `(select auth.uid())`.
--   - A02:2025 Cryptographic Failures: Hash bcrypt (`bf`, cost 10) en `auth.users`.
--   - A07:2025 Identification & Authentication Failures: Registro de intentos y bloqueos.
--   - A09:2025 Security Logging & Monitoring: Tabla `public.auth_audit_logs` con RLS.
-- =============================================================================

begin;

create table if not exists public.auth_audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  email_masked text not null,
  event_type text not null check (event_type in ('LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'RATE_LIMIT_LOCK', 'TOKEN_VERIFIED')),
  ip_hint text default 'client-web',
  user_agent text,
  jwt_jti text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists auth_audit_logs_user_id_idx on public.auth_audit_logs (user_id);
create index if not exists auth_audit_logs_created_at_idx on public.auth_audit_logs (created_at desc);

alter table public.auth_audit_logs enable row level security;

create policy "Registro de eventos de auditoria auth"
  on public.auth_audit_logs
  for insert
  to anon, authenticated
  with check (
    event_type in ('LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'RATE_LIMIT_LOCK', 'TOKEN_VERIFIED')
    and char_length(email_masked) <= 120
  );

create policy "Lectura de auditoria propia para usuario autenticado"
  on public.auth_audit_logs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

grant insert on public.auth_audit_logs to anon, authenticated;
grant select on public.auth_audit_logs to authenticated;

create policy "Admin puede actualizar productos via JWT app_metadata"
  on public.productos
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin_drop')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin_drop');

commit;
