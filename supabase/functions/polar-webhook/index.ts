/**
 * polar-webhook — Polar calls this when an order is paid.
 *
 * Payloads are signed per the Standard Webhooks spec (headers webhook-id,
 * webhook-timestamp, webhook-signature). Depending on endpoint settings,
 * Polar derives the HMAC key either from the base64-decoded secret or from
 * the raw secret bytes, so verification accepts either derivation.
 *
 * Secrets: POLAR_WEBHOOK_SECRET, POLAR_PRODUCT_COURSE, POLAR_PRODUCT_VIP,
 *          plus the email delivery secrets used by sendAccessEmail.
 * Deploy:  supabase functions deploy polar-webhook --no-verify-jwt
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { grantEntitlements, sendAccessEmail, sendOwnerSaleAlert } from "../_shared/grant.ts";

function bytesToBase64(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function hmacBase64(keyBytes: Uint8Array, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return bytesToBase64(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = Deno.env.get("POLAR_WEBHOOK_SECRET");
  if (!secret) {
    console.error("POLAR_WEBHOOK_SECRET is not set; rejecting webhook");
    return false;
  }
  const id = req.headers.get("webhook-id") ?? "";
  const timestamp = req.headers.get("webhook-timestamp") ?? "";
  const signatureHeader = req.headers.get("webhook-signature") ?? "";
  if (!id || !timestamp || !signatureHeader) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const payload = `${id}.${timestamp}.${rawBody}`;
  const bare = secret.replace(/^whsec_/, "");

  const candidates: Uint8Array[] = [new TextEncoder().encode(bare)];
  try {
    candidates.push(Uint8Array.from(atob(bare), (c) => c.charCodeAt(0)));
  } catch {
    // secret isn't valid base64; raw bytes only
  }

  const given = signatureHeader.split(" ").map((part) => part.split(",")[1] ?? part);
  for (const keyBytes of candidates) {
    const expected = await hmacBase64(keyBytes, payload);
    if (given.includes(expected)) return true;
  }
  return false;
}

interface PolarEvent {
  type?: string;
  data?: {
    id?: string;
    total_amount?: number;
    product_id?: string;
    product?: { id?: string };
    customer?: { email?: string; name?: string };
    metadata?: { tx_ref?: string; product?: string };
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawBody = await req.text();

  if (!(await verifySignature(req, rawBody))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: PolarEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (event.type !== "order.paid") return new Response("ok");

  const data = event.data ?? {};
  const email = data.customer?.email?.trim().toLowerCase();
  const name = data.customer?.name ?? "";
  if (!email) return new Response("Missing customer email", { status: 400 });

  const cartId = data.product_id ?? data.product?.id;
  let product: "course" | "vip" | null =
    data.metadata?.product === "vip" ? "vip" : data.metadata?.product === "course" ? "course" : null;
  if (!product) {
    if (cartId === Deno.env.get("POLAR_PRODUCT_VIP")) product = "vip";
    else if (cartId === Deno.env.get("POLAR_PRODUCT_COURSE")) product = "course";
  }
  if (!product) return new Response("Unknown product", { status: 400 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const txRef = data.metadata?.tx_ref;
  if (txRef) {
    const { data: order } = await admin.from("orders").select("*").eq("tx_ref", txRef).maybeSingle();
    if (order?.status === "paid") return new Response("ok");
    await admin
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), provider: "polar" })
      .eq("tx_ref", txRef);
  } else {
    const paymentRef = `polar-${data.id ?? crypto.randomUUID()}`;
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
      provider: "polar",
      paid_at: new Date().toISOString(),
    });
  }

  await grantEntitlements(admin, email, product);
  await sendAccessEmail(email, name, product, {
    amountUsd: data.total_amount != null ? data.total_amount / 100 : undefined,
    orderRef: data.id ?? txRef ?? undefined,
  });
  await sendOwnerSaleAlert(email, name, product, data.total_amount != null ? data.total_amount / 100 : undefined);
  return new Response("ok");
});
