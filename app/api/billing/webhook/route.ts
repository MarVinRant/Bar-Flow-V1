import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MP_API = "https://api.mercadopago.com";

function verifySignature(request: NextRequest, dataId: string) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id") ?? "";
  if (!secret || !signature || !dataId) return false;
  const values = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=", 2))) as { ts?: string; v1?: string };
  if (!values.ts || !values.v1) return false;
  const manifest = `id:${dataId};request-id:${requestId};ts:${values.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(values.v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const dataId = String(body?.data?.id ?? request.nextUrl.searchParams.get("data.id") ?? request.nextUrl.searchParams.get("id") ?? "");
  if (!verifySignature(request, dataId)) return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token || !supabaseUrl || !serviceRole) return NextResponse.json({ error: "Webhook não configurado no servidor." }, { status: 503 });

  const eventType = String(body.type ?? body.topic ?? "subscription");
  const action = String(body.action ?? "updated");
  const admin = createClient(supabaseUrl, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });
  const eventId = `${eventType}:${dataId}:${action}`;
  const duplicate = await admin.from("payment_events").select("id").eq("external_event_id", eventId).maybeSingle();
  if (duplicate.data) return NextResponse.json({ received: true, duplicate: true });
  const remote = await fetch(`${MP_API}/preapproval/${encodeURIComponent(dataId)}`, { headers: { Authorization: `Bearer ${token}` } });
  const subscription = await remote.json().catch(() => ({}));
  const status = subscription.status === "authorized" ? "authorized" : subscription.status === "paused" ? "paused" : subscription.status === "cancelled" || subscription.status === "canceled" ? "canceled" : subscription.status === "expired" ? "expired" : "pending";
  await admin.from("subscriptions").update({ status, current_period_end: subscription.next_payment_date ?? null, updated_at: new Date().toISOString() }).eq("mercado_pago_preapproval_id", dataId);
  await admin.from("payment_events").insert({ external_event_id: eventId, event_type: eventType, action, mercado_pago_resource_id: dataId, payload: body, processed_at: new Date().toISOString() });
  return NextResponse.json({ received: true });
}
