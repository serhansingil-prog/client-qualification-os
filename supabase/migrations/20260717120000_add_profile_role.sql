alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'moderator', 'admin'));

alter table public.admin_audit_log
  drop constraint admin_audit_log_action_check,
  add constraint admin_audit_log_action_check
  check (action in ('approve', 'reject', 'archive', 'role_change'));
