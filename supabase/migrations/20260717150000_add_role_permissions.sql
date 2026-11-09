create table if not exists public.role_permissions (
  role text not null check (role in ('user', 'moderator', 'admin')),
  permission text not null check (permission in ('multi_sector_demo', 'multi_sector_guide')),
  enabled boolean not null default false,
  primary key (role, permission)
);

insert into public.role_permissions (role, permission, enabled) values
  ('user', 'multi_sector_demo', false),
  ('moderator', 'multi_sector_demo', true),
  ('admin', 'multi_sector_demo', true),
  ('user', 'multi_sector_guide', false),
  ('moderator', 'multi_sector_guide', true),
  ('admin', 'multi_sector_guide', true)
on conflict (role, permission) do nothing;

alter table public.role_permissions enable row level security;

create policy role_permissions_select_all on public.role_permissions
  for select to authenticated using (true);
