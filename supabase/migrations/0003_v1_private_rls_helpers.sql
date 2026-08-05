-- Move helpers SECURITY DEFINER para schema não exposto à Data API.
create schema if not exists private;

create or replace function private.has_establishment_access(target_establishment uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where user_id = auth.uid() and establishment_id = target_establishment and status = 'active'
  );
$$;

create or replace function private.is_barflow_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where user_id = auth.uid() and role = 'barflow_admin' and status = 'active'
  );
$$;

revoke all on function private.has_establishment_access(uuid) from public, anon, authenticated;
revoke all on function private.is_barflow_admin() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.has_establishment_access(uuid) to authenticated;
grant execute on function private.is_barflow_admin() to authenticated;
revoke all on function public.has_establishment_access(uuid) from public, anon, authenticated;
revoke all on function public.is_barflow_admin() from public, anon, authenticated;

drop policy if exists "members can read their establishments" on public.establishments;
create policy "members can read their establishments" on public.establishments for select using (private.has_establishment_access(id));
drop policy if exists "admins can read all establishments" on public.establishments;
create policy "admins can read all establishments" on public.establishments for select to authenticated using (private.is_barflow_admin());

drop policy if exists "members can read private items" on public.private_items;
create policy "members can read private items" on public.private_items for select using (private.has_establishment_access(establishment_id));
drop policy if exists "members can write private items" on public.private_items;
create policy "members can write private items" on public.private_items for all using (private.has_establishment_access(establishment_id)) with check (private.has_establishment_access(establishment_id));

drop policy if exists "members can read menus" on public.menus;
create policy "members can read menus" on public.menus for select using (private.has_establishment_access(establishment_id));
drop policy if exists "members can write menus" on public.menus;
create policy "members can write menus" on public.menus for all using (private.has_establishment_access(establishment_id)) with check (private.has_establishment_access(establishment_id));

drop policy if exists "members can read menu items" on public.menu_items;
create policy "members can read menu items" on public.menu_items for select using (exists (select 1 from public.menus m where m.id = menu_id and private.has_establishment_access(m.establishment_id)));
drop policy if exists "members can write menu items" on public.menu_items;
create policy "members can write menu items" on public.menu_items for all using (exists (select 1 from public.menus m where m.id = menu_id and private.has_establishment_access(m.establishment_id))) with check (exists (select 1 from public.menus m where m.id = menu_id and private.has_establishment_access(m.establishment_id)));

drop policy if exists "authenticated users can read published master items" on public.master_items;
create policy "authenticated users can read published master items" on public.master_items for select using (status = 'published' or private.is_barflow_admin());
drop policy if exists "admins can read all master items" on public.master_items;
create policy "admins can read all master items" on public.master_items for select to authenticated using (private.is_barflow_admin());

drop policy if exists "members can read own groups" on public.business_groups;
create policy "members can read own groups" on public.business_groups for select to authenticated using (owner_id = (select auth.uid()) or exists (select 1 from public.memberships m where m.group_id = id and m.user_id = (select auth.uid()) and m.status = 'active') or private.is_barflow_admin());
drop policy if exists "admins can read all groups" on public.business_groups;
create policy "admins can read all groups" on public.business_groups for select to authenticated using (private.is_barflow_admin());

drop policy if exists "members can read memberships" on public.memberships;
create policy "members can read memberships" on public.memberships for select to authenticated using (user_id = (select auth.uid()) or private.is_barflow_admin());
drop policy if exists "admins can read all memberships" on public.memberships;
create policy "admins can read all memberships" on public.memberships for select to authenticated using (private.is_barflow_admin());

drop policy if exists "admins can read audit logs" on public.audit_logs;
create policy "admins can read audit logs" on public.audit_logs for select to authenticated using (private.is_barflow_admin() or private.has_establishment_access(establishment_id));
