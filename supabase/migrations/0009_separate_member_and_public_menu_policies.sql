-- Mantém o cardápio público legível por visitantes e usuários autenticados,
-- sem executar as políticas privadas de membros para o papel anon.
drop policy if exists "members can read their establishments" on public.establishments;
create policy "members can read their establishments" on public.establishments
  for select to authenticated using (private.has_establishment_access(id));

drop policy if exists "members can read menus" on public.menus;
create policy "members can read menus" on public.menus
  for select to authenticated using (private.has_establishment_access(establishment_id));

drop policy if exists "members can write menus" on public.menus;
create policy "members can write menus" on public.menus
  for all to authenticated
  using (private.has_establishment_access(establishment_id))
  with check (private.has_establishment_access(establishment_id));

drop policy if exists "members can read menu items" on public.menu_items;
create policy "members can read menu items" on public.menu_items
  for select to authenticated using (exists (
    select 1 from public.menus m
    where m.id = menu_id and private.has_establishment_access(m.establishment_id)
  ));

drop policy if exists "members can write menu items" on public.menu_items;
create policy "members can write menu items" on public.menu_items
  for all to authenticated
  using (exists (
    select 1 from public.menus m
    where m.id = menu_id and private.has_establishment_access(m.establishment_id)
  ))
  with check (exists (
    select 1 from public.menus m
    where m.id = menu_id and private.has_establishment_access(m.establishment_id)
  ));

drop policy if exists "members can read private items" on public.private_items;
create policy "members can read private items" on public.private_items
  for select to authenticated using (private.has_establishment_access(establishment_id));

drop policy if exists "members can write private items" on public.private_items;
create policy "members can write private items" on public.private_items
  for all to authenticated
  using (private.has_establishment_access(establishment_id))
  with check (private.has_establishment_access(establishment_id));
