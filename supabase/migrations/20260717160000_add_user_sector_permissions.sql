create table if not exists public.user_sector_permissions (
  user_id uuid not null references auth.users(id) on delete cascade,
  sector text not null check (sector in ('automation', 'ads', 'real_estate')),
  is_default boolean not null default false,
  primary key (user_id, sector)
);

alter table public.user_sector_permissions enable row level security;

create policy user_sector_permissions_select_own on public.user_sector_permissions
  for select using (auth.uid() = user_id);
