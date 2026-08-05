create extension if not exists "pgcrypto";

create table if not exists public.business_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.establishments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.business_groups(id) on delete cascade,
  name text not null,
  slug text not null unique,
  segment text not null,
  phone text,
  city text,
  address text,
  public_description text,
  public_theme text not null default 'light',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references public.business_groups(id) on delete cascade,
  establishment_id uuid references public.establishments(id) on delete cascade,
  role text not null check (role in ('owner','manager','operator','read_only','barflow_admin')),
  status text not null default 'active' check (status in ('invited','active','disabled')),
  created_at timestamptz not null default now(),
  unique (user_id, group_id, establishment_id)
);

create table if not exists public.master_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('recipe','product','preparation')),
  name text not null,
  category text not null,
  description text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.private_items (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  source_master_id uuid references public.master_items(id),
  item_type text not null check (item_type in ('recipe','product','preparation')),
  name text not null,
  category text not null,
  description text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','archived')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  menu_type text not null check (menu_type in ('menu','catalog')),
  name text not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  public_price_visible boolean not null default true,
  unavailable_behavior text not null default 'label' check (unavailable_behavior in ('hide','label')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  private_item_id uuid not null references public.private_items(id) on delete cascade,
  sort_order integer not null default 0,
  available boolean not null default true,
  public_price numeric(12,2),
  created_at timestamptz not null default now(),
  unique(menu_id, private_item_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  establishment_id uuid references public.establishments(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists establishments_group_idx on public.establishments(group_id);
create index if not exists private_items_establishment_idx on public.private_items(establishment_id) where deleted_at is null;
create index if not exists menus_establishment_idx on public.menus(establishment_id);

alter table public.business_groups enable row level security;
alter table public.establishments enable row level security;
alter table public.memberships enable row level security;
alter table public.master_items enable row level security;
alter table public.private_items enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.has_establishment_access(target_establishment uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where user_id = auth.uid()
      and establishment_id = target_establishment
      and status = 'active'
  );
$$;

create policy "members can read their establishments" on public.establishments for select using (public.has_establishment_access(id));
create policy "members can read private items" on public.private_items for select using (public.has_establishment_access(establishment_id));
create policy "members can write private items" on public.private_items for all using (public.has_establishment_access(establishment_id)) with check (public.has_establishment_access(establishment_id));
create policy "members can read menus" on public.menus for select using (public.has_establishment_access(establishment_id));
create policy "members can write menus" on public.menus for all using (public.has_establishment_access(establishment_id)) with check (public.has_establishment_access(establishment_id));
create policy "members can read menu items" on public.menu_items for select using (exists (select 1 from public.menus m where m.id = menu_id and public.has_establishment_access(m.establishment_id)));
create policy "members can write menu items" on public.menu_items for all using (exists (select 1 from public.menus m where m.id = menu_id and public.has_establishment_access(m.establishment_id))) with check (exists (select 1 from public.menus m where m.id = menu_id and public.has_establishment_access(m.establishment_id)));
create policy "authenticated users can read published master items" on public.master_items for select using (status = 'published' or exists (select 1 from public.memberships where user_id = auth.uid() and role = 'barflow_admin'));
