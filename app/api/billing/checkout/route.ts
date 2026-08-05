import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MP_API = "https://api.mercadopago.com";
const PLAN_AMOUNTS: Record<string, { monthly: number; annual: number }> = {
  bronze: { monthly: 59.90, annual: 610.98 },
  silver: { monthly: 129.90, annual: 1324.98 },
  gold: { monthly: 249.90, annual: 2548.98 },
};

function serverConfig() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!url || !key || !token) return null;
  return { url, key, token };
}

export async function POST(request: NextRequest) {
  const config = serverConfig();
  const authorization = request.headers.get("authorization");
  if (!config || !authorization?.startsWith("Bearer ")) return NextResponse.json({ error: "Integração de cobrança não configurada." }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const plan = String(body.plan ?? "").toLowerCase();
  const cycle = body.cycle === "annual" ? "annual" : "monthly";
  const amount = PLAN_AMOUNTS[plan]?.[cycle];
  if (!amount) return NextResponse.json({ error: "Plano ou ciclo inválido." }, { status: 400 });

  const userClient = createClient(config.url, config.key, { global: { headers: { Authorization: authorization } } });
  const user = await userClient.auth.getUser();
  if (user.error || !user.data.user?.email) return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  const membership = await userClient.from("memberships").select("group_id,establishment_id").eq("user_id", user.data.user.id).eq("status", "active").not("group_id", "is", null).limit(1).maybeSingle();
  if (membership.error || !membership.data) return NextResponse.json({ error: "Estabelecimento não encontrado para esta conta." }, { status: 403 });

  const externalReference = `barflow_${membership.data.group_id}_${Date.now()}`;
  const origin = request.headers.get("origin") ?? process.env.PUBLIC_APP_URL ?? "https://bar-flow-jade.vercel.app";
  const notificationUrl = `${origin}/api/billing/webhook`;
  const planId = process.env[plan === "bronze" ? `MERCADO_PAGO_PLAN_BRONZE_${cycle.toUpperCase()}` : plan === "silver" ? `MERCADO_PAGO_PLAN_SILVER_${cycle.toUpperCase()}` : `MERCADO_PAGO_PLAN_GOLD_${cycle.toUpperCase()}`];
  const payload: Record<string, unknown> = {
    reason: `Bar Flow ${plan[0].toUpperCase()}${plan.slice(1)} - ${cycle === "annual" ? "anual" : "mensal"}`,
    external_reference: externalReference,
    payer_email: user.data.user.email,
    back_url: `${origin}/?billing=return`,
    notification_url: notificationUrl,
    status: "pending",
  };
  if (planId) payload.preapproval_plan_id = planId;
  else payload.auto_recurring = { frequency: 1, frequency_type: cycle === "annual" ? "years" : "months", transaction_amount: amount, currency_id: "BRL" };

  const mercadoPagoResponse = await fetch(`${MP_API}/preapproval`, { method: "POST", headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const mercadoPagoData = await mercadoPagoResponse.json().catch(() => ({}));
  if (!mercadoPagoResponse.ok || !mercadoPagoData.init_point) {
    console.error("Mercado Pago checkout failed", { status: mercadoPagoResponse.status, error: mercadoPagoData.error, message: mercadoPagoData.message, cause: mercadoPagoData.cause });
    return NextResponse.json({ error: "O Mercado Pago não conseguiu criar o checkout.", detail: mercadoPagoData.message ?? mercadoPagoData.error ?? mercadoPagoData.cause?.[0]?.description ?? `HTTP ${mercadoPagoResponse.status}` }, { status: 502 });
  }

  const subscription = await userClient.from("subscriptions").insert({ group_id: membership.data.group_id, establishment_id: membership.data.establishment_id, user_id: user.data.user.id, plan_slug: plan, billing_cycle: cycle, mercado_pago_preapproval_id: mercadoPagoData.id, external_reference: externalReference, status: mercadoPagoData.status ?? "pending" }).select("id,plan_slug,billing_cycle,status,mercado_pago_preapproval_id").single();
  if (subscription.error) {
    console.error("Local subscription registration failed", { code: subscription.error.code, message: subscription.error.message, details: subscription.error.details, hint: subscription.error.hint });
    return NextResponse.json({ error: "Checkout criado, mas não foi possível registrar a assinatura local.", detail: subscription.error.message, checkout_url: mercadoPagoData.init_point }, { status: 502 });
  }
  return NextResponse.json({ checkout_url: mercadoPagoData.init_point, subscription: subscription.data });
}
