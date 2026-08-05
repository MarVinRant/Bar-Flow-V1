-- Cardápio público: somente estabelecimentos, menus e itens publicados.
drop policy if exists "public can read published establishments" on public.establishments;
create policy "public can read published establishments" on public.establishments
  for select to anon using (deleted_at is null);

drop policy if exists "public can read published menus" on public.menus;
create policy "public can read published menus" on public.menus
  for select to anon using (status = 'published');

drop policy if exists "public can read available published menu items" on public.menu_items;
create policy "public can read available published menu items" on public.menu_items
  for select to anon using (available = true and exists (
    select 1 from public.menus m where m.id = menu_id and m.status = 'published'
  ));

drop policy if exists "public can read items in published menus" on public.private_items;
create policy "public can read items in published menus" on public.private_items
  for select to anon using (deleted_at is null and exists (
    select 1 from public.menu_items mi
    join public.menus m on m.id = mi.menu_id
    where mi.private_item_id = private_items.id and mi.available = true and m.status = 'published'
  ));
