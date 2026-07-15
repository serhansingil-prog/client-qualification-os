alter table public.profiles add column if not exists archived boolean not null default false;

alter table public.profiles
  add constraint profiles_no_archive_pending check (not (archived and status = 'pending'));

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action text not null check (action in ('approve', 'reject', 'archive')),
  target_user_id uuid not null,
  target_email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;
