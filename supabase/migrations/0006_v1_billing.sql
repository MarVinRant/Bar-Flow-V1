-- Bar Flow V1: planos e assinaturas Mercado Pago.
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  monthly_amount numeric(12,2) not null,
  annual_amount numeric(12,2) not null,
  annual_discount numeric(5,4) not null default 0.15,
  mercado_pago_monthly_plan_id text,
  mercado_pago_annual_plan_id text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.business_groups(id) on delete cascade,
  establishment_id uuid references public.establishments(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_slug text not null references public.plans(slug),
  billing_cycle text not null check (billing_cycle in ('monthly','annual')),
  mercado_pago_preapproval_id text unique,
  external_reference text not null unique,
  status text not null default 'pending' check (status in ('pending','authorized','paused','canceled','past_due','expired')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  tolerance_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  external_event_id text not null unique,
  event_type text not null,
  action text,
  mercado_pago_resource_id text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.plans (slug, name, monthly_amount, annual_amount, annual_discount)
values
  ('bronze', 'Bronze', 59.90, 610.98, 0.15),
  ('silver', 'Silver', 129.90, 1324.98, 0.15),
  ('gold', 'Gold', 249.90, 2548.98, 0.15)
on conflict (slug) do update set
  name = excluded.name,
  monthly_amount = excluded.monthly_amount,
  annual_amount = excluded.annual_amount,
  annual_discount = excluded.annual_discount,
  updated_at = now();

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "authenticated users can read active plans" on public.plans;
create policy "authenticated users can read active plans" on public.plans
  for select to authenticated using (active = true or private.is_barflow_admin());

drop policy if exists "members can read own subscriptions" on public.subscriptions;
create policy "members can read own subscriptions" on public.subscriptions
  for select to authenticated using (
    user_id = (select auth.uid()) or
    exists (select 1 from public.memberships m where m.group_id = subscriptions.group_id and m.user_id = (select auth.uid()) and m.status = 'active') or
    private.is_barflow_admin()
  );

drop policy if exists "members can create own subscriptions" on public.subscriptions;
create policy "members can create own subscriptions" on public.subscriptions
  for insert to authenticated with check (
    user_id = (select auth.uid()) and exists (select 1 from public.memberships m where m.group_id = subscriptions.group_id and m.user_id = (select auth.uid()) and m.status = 'active')
  );

drop policy if exists "admins can read payment events" on public.payment_events;
create policy "admins can read payment events" on public.payment_events
  for select to authenticated using (private.is_barflow_admin());

create index if not exists subscriptions_group_idx on public.subscriptions(group_id, created_at desc);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id, status);
create index if not exists subscriptions_status_idx on public.subscriptions(status, updated_at desc);
create index if not exists payment_events_resource_idx on public.payment_events(mercado_pago_resource_id);
