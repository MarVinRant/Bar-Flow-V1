create index if not exists subscriptions_establishment_idx on public.subscriptions(establishment_id, created_at desc);
create index if not exists subscriptions_plan_idx on public.subscriptions(plan_slug);
