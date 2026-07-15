create table if not exists public.evaluations (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evaluations_user_id_idx on public.evaluations (user_id);

alter table public.evaluations enable row level security;

create policy "evaluations_select_own" on public.evaluations
  for select using (auth.uid() = user_id);

create policy "evaluations_insert_own" on public.evaluations
  for insert with check (auth.uid() = user_id);

create policy "evaluations_update_own" on public.evaluations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "evaluations_delete_own" on public.evaluations
  for delete using (auth.uid() = user_id);

create table if not exists public.agency_settings (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.agency_settings enable row level security;

create policy "agency_settings_select_own" on public.agency_settings
  for select using (auth.uid() = user_id);

create policy "agency_settings_insert_own" on public.agency_settings
  for insert with check (auth.uid() = user_id);

create policy "agency_settings_update_own" on public.agency_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
