/**
 * whop-webhook — Whop calls this when a card payment succeeds.
 *
 * Payloads are signed per the Standard Webhooks spec (headers webhook-id,
 * webhook-timestamp, webhook-signature). Unlike most Standard Webhooks
 * senders, Whop HMACs with the literal bytes of the secret it issued,
 * `ws_` prefix included (see verifyWebhook.ts in @whop/sdk), so the secret
 * is used as-is and never base64-decoded.
 *
 * Secrets: WHOP_WEBHOOK_SECRET, WHOP_PLAN_COURSE, WHOP_PLAN_VIP,
 *          plus the email delivery secrets used by sendAccessEmail.
 * Deploy:  supabase functions deploy whop-webhook --no-verify-jwt
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { grantEntitlements, sendAccessEmail, sendOwnerSaleAlert } from "../_shared/grant.ts";

async function hmacBase64(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = Deno.env.get("WHOP_WEBHOOK_SECRET");
  if (!secret) {
    console.error("WHOP_WEBHOOK_SECRET is not set; rejecting webhook");
    return false;
  }
  const id = req.headers.get("webhook-id") ?? "";
  const timestamp = req.headers.get("webhook-timestamp") ?? "";
  const signatureHeader = req.headers.get("webhook-signature") ?? "";
  if (!id || !timestamp || !signatureHeader) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = await hmacBase64(secret, `${id}.${timestamp}.${rawBody}`);
  // Header is a space-separated list of "v1,<base64>" entries.
  return signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1] ?? part)
    .includes(expected);
}

/** Whop amounts are a Money object ({ amount: "19.00" }) or, on older payload versions, a number. */
function toUsd(value: unknown): number | undefined {
  const raw = typeof value === "object" && value !== null ? (value as { amount?: unknown }).amount : value;
  const n = Number(raw);
  return Number.isFinite(n) && raw !== null && raw !== "" ? n : undefined;
}

interface WhopEvent {
  type?: string;
  data?: {
    id?: string;
    status?: string;
    usd_total?: unknown;
    total?: unknown;
    customer_email?: string | null;
    user?: { name?: string | null; email?: string | null } | null;
    plan?: { id?: string } | null;
    metadata?: { tx_ref?: string; product?: string } | null;
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawBody = await req.text();

  if (!(await verifySignature(req, rawBody))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: WhopEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (event.type !== "payment.succeeded") return new Response("ok");
  const data = event.data ?? {};

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Normal path: the checkout was started on our site, so the order row
  // (and the email we promised to deliver to) already exists.
  const txRef = data.metadata?.tx_ref;
  if (txRef) {
    const { data: order } = await admin.from("orders").select("*").eq("tx_ref", txRef).maybeSingle();
    if (!order) return new Response("Unknown order", { status: 404 });
    if (order.status === "paid") return new Response("ok"); // idempotent

    const amountUsd = toUsd(data.usd_total) ?? order.amount_usd;
    await admin
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), provider: "whop" })
      .eq("tx_ref", txRef);
    await grantEntitlements(admin, order.email, order.product);
    await sendAccessEmail(order.email, order.name ?? "", order.product, {
      amountUsd,
      orderRef: data.id ?? txRef,
    });
    await sendOwnerSaleAlert(order.email, order.name ?? "", order.product, amountUsd);
    return new Response("ok");
  }

  // Fallback: bought straight from a Whop page, so there is no order row yet.
  const email = (data.customer_email ?? data.user?.email ?? "").trim().toLowerCase();
  if (!email) return new Response("Missing customer email", { status: 400 });
  const name = data.user?.name ?? "";
  const planId = data.plan?.id;
  const product: "course" | "vip" | null =
    data.metadata?.product === "vip" || planId === Deno.env.get("WHOP_PLAN_VIP")
      ? "vip"
      : data.metadata?.product === "course" || planId === Deno.env.get("WHOP_PLAN_COURSE")
        ? "course"
        : null;
  if (!product) return new Response("Unknown product", { status: 400 });

  const paymentRef = `whop-${data.id ?? crypto.randomUUID()}`;
  const { data: existing } = await admin
    .from("orders")
    .select("id")
    .eq("tx_ref", paymentRef)
    .maybeSingle();
  if (existing) return new Response("ok");

  const amountUsd = toUsd(data.usd_total) ?? toUsd(data.total) ?? 0;
  await admin.from("orders").insert({
    tx_ref: paymentRef,
    email,
    name,
    product,
    amount_usd: amountUsd,
    status: "paid",
    provider: "whop",
    paid_at: new Date().toISOString(),
  });
  await grantEntitlements(admin, email, product);
  await sendAccessEmail(email, name, product, { amountUsd, orderRef: data.id });
  await sendOwnerSaleAlert(email, name, product, amountUsd);
  return new Response("ok");
});
