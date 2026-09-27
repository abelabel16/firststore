/**
 * dodo-webhook — Dodo Payments calls this after every payment event.
 *
 * Signatures follow the Standard Webhooks spec: HMAC-SHA256 over
 * "{webhook-id}.{webhook-timestamp}.{raw body}" using the base64-decoded
 * secret (the part after "whsec_"), compared against the "v1,<sig>" values
 * in the webhook-signature header. Unsigned/invalid requests are rejected,
 * so a verified payload can be trusted as authentic.
 *
 * Secrets: DODO_WEBHOOK_SECRET (from Dashboard → Developer → Webhooks),
 *          plus the email delivery secrets used by sendAccessEmail.
 * Deploy:  supabase functions deploy dodo-webhook --no-verify-jwt
 * Then set the webhook URL in the Dodo dashboard to this function's URL.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { grantEntitlements, sendAccessEmail } from "../_shared/grant.ts";

function base64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function bytesToBase64(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = Deno.env.get("DODO_WEBHOOK_SECRET");
  if (!secret) {
    console.error("DODO_WEBHOOK_SECRET is not set; rejecting webhook");
    return false;
  }
  const id = req.headers.get("webhook-id") ?? "";
  const timestamp = req.headers.get("webhook-timestamp") ?? "";
  const signatureHeader = req.headers.get("webhook-signature") ?? "";
  if (!id || !timestamp || !signatureHeader) return false;

  // Reject stale deliveries (replay protection): older than 5 minutes.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const keyBytes = base64ToBytes(secret.replace(/^whsec_/, ""));
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${timestamp}.${rawBody}`)
  );
  const expected = bytesToBase64(signed);

  return signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1] ?? "")
    .some((sig) => sig === expected);
}

interface DodoEvent {
  type?: string;
  data?: {
    payment_id?: string;
    total_amount?: number;
    customer?: { email?: string; name?: string };
    product_cart?: { product_id?: string; quantity?: number }[];
    metadata?: { tx_ref?: string; product?: string };
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawBody = await req.text();

  if (!(await verifySignature(req, rawBody))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: DodoEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  // Only successful payments grant access.
  if (event.type !== "payment.succeeded") return new Response("ok");

  const data = event.data ?? {};
  const email = data.customer?.email?.trim().toLowerCase();
  const name = data.customer?.name ?? "";
  if (!email) return new Response("Missing customer email", { status: 400 });

  // Resolve the product: prefer the metadata we set at checkout creation,
  // then fall back to matching the cart against our configured product IDs.
  let product: "course" | "vip" | null =
    data.metadata?.product === "vip" ? "vip" : data.metadata?.product === "course" ? "course" : null;
  if (!product) {
    const cartIds = (data.product_cart ?? []).map((p) => p.product_id);
    if (cartIds.includes(Deno.env.get("DODO_PRODUCT_VIP") ?? "__none__")) product = "vip";
    else if (cartIds.includes(Deno.env.get("DODO_PRODUCT_COURSE") ?? "__none__")) product = "course";
  }
  if (!product) return new Response("Unknown product", { status: 400 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Idempotency: match our order via tx_ref when present, otherwise record
  // the payment fresh (e.g. a payment link shared outside the site).
  const txRef = data.metadata?.tx_ref;
  if (txRef) {
    const { data: order } = await admin.from("orders").select("*").eq("tx_ref", txRef).maybeSingle();
    if (order?.status === "paid") return new Response("ok");
    await admin
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), provider: "dodo" })
      .eq("tx_ref", txRef);
  } else {
    const paymentRef = `dodo-${data.payment_id ?? crypto.randomUUID()}`;
    const { data: existing } = await admin
      .from("orders")
      .select("id")
      .eq("tx_ref", paymentRef)
      .maybeSingle();
    if (existing) return new Response("ok");
    await admin.from("orders").insert({
      tx_ref: paymentRef,
      email,
      name,
      product,
      amount_usd: (data.total_amount ?? 0) / 100,
      status: "paid",
      provider: "dodo",
      paid_at: new Date().toISOString(),
    });
  }

  await grantEntitlements(admin, email, product);
  await sendAccessEmail(email, name, product, {
    amountUsd: data.total_amount != null ? data.total_amount / 100 : undefined,
    orderRef: data.payment_id ?? txRef ?? undefined,
  });
  return new Response("ok");
});
