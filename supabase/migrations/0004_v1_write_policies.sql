-- Bar Flow V1: permissões mínimas para onboarding e operação do tenant.
-- Não concede acesso cruzado: todas as expressões dependem de auth.uid().

drop policy if exists "owners can create groups" on public.business_groups;
create policy "owners can create groups" on public.business_groups
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "owners can create establishments" on public.establishments;
create policy "owners can create establishments" on public.establishments
  for insert to authenticated
  with check (exists (
    select 1 from public.business_groups g
    where g.id = group_id and g.owner_id = (select auth.uid())
  ));

drop policy if exists "owners can update establishments" on public.establishments;
create policy "owners can update establishments" on public.establishments
  for update to authenticated
  using (private.has_establishment_access(id) or exists (
    select 1 from public.business_groups g
    where g.id = group_id and g.owner_id = (select auth.uid())
  ))
  with check (private.has_establishment_access(id) or exists (
    select 1 from public.business_groups g
    where g.id = group_id and g.owner_id = (select auth.uid())
  ));

drop policy if exists "owners can create memberships" on public.memberships;
create policy "owners can create memberships" on public.memberships
  for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (
    select 1 from public.business_groups g
    where g.id = group_id and g.owner_id = (select auth.uid())
  ));

drop policy if exists "members can create audit logs" on public.audit_logs;
create policy "members can create audit logs" on public.audit_logs
  for insert to authenticated
  with check (user_id = (select auth.uid()) and private.has_establishment_access(establishment_id));
