-- Bar Flow V1: índices de suporte para joins e políticas RLS.
create index if not exists audit_logs_establishment_idx on public.audit_logs(establishment_id, created_at desc);
create index if not exists audit_logs_user_idx on public.audit_logs(user_id);
create index if not exists business_groups_owner_idx on public.business_groups(owner_id);
create index if not exists memberships_establishment_idx on public.memberships(establishment_id);
create index if not exists memberships_group_idx on public.memberships(group_id);
create index if not exists memberships_user_idx on public.memberships(user_id);
create index if not exists private_items_created_by_idx on public.private_items(created_by);
create index if not exists private_items_source_master_idx on public.private_items(source_master_id);
create index if not exists menu_items_private_item_idx on public.menu_items(private_item_id);
