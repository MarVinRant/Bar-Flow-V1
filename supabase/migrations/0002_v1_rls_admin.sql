-- Bar Flow V1: policies complementares para tenant e painel interno.
create or replace function public.is_barflow_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where user_id = auth.uid() and role = 'barflow_admin' and status = 'active'
  );
$$;

revoke all on function public.is_barflow_admin() from public;
grant execute on function public.is_barflow_admin() to authenticated;

drop policy if exists "members can read own groups" on public.business_groups;
create policy "members can read own groups" on public.business_groups for select to authenticated
using (owner_id = (select auth.uid()) or exists (select 1 from public.memberships m where m.group_id = id and m.user_id = (select auth.uid()) and m.status = 'active') or public.is_barflow_admin());

drop policy if exists "members can read memberships" on public.memberships;
create policy "members can read memberships" on public.memberships for select to authenticated
using (user_id = (select auth.uid()) or public.is_barflow_admin());

drop policy if exists "admins can read all establishments" on public.establishments;
create policy "admins can read all establishments" on public.establishments for select to authenticated
using (public.is_barflow_admin());

drop policy if exists "admins can read all master items" on public.master_items;
create policy "admins can read all master items" on public.master_items for select to authenticated
using (public.is_barflow_admin());

drop policy if exists "admins can read audit logs" on public.audit_logs;
create policy "admins can read audit logs" on public.audit_logs for select to authenticated
using (public.is_barflow_admin() or public.has_establishment_access(establishment_id));

drop policy if exists "admins can read all groups" on public.business_groups;
create policy "admins can read all groups" on public.business_groups for select to authenticated
using (public.is_barflow_admin());

drop policy if exists "admins can read all memberships" on public.memberships;
create policy "admins can read all memberships" on public.memberships for select to authenticated
using (public.is_barflow_admin());
