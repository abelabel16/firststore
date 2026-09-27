/**
 * nowpayments-ipn — NOWPayments calls this as a crypto payment progresses.
 *
 * Verification per their spec: the JSON payload's keys are sorted
 * recursively, HMAC-SHA512'd with the IPN secret, and compared (hex)
 * against the x-nowpayments-sig header.
 *
 * Access is granted when payment_status reaches "confirmed" or "finished"
 * (idempotent, so receiving both is fine). The customer identity comes from
 * our own order row via order_id (= tx_ref), never from the payload.
 *
 * Secrets: NOWPAYMENTS_IPN_SECRET, plus the email delivery secrets.
 * Deploy:  supabase functions deploy nowpayments-ipn --no-verify-jwt
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { grantEntitlements, sendAccessEmail, sendOwnerSaleAlert } from "../_shared/grant.ts";

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

async function hmacSha512Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface IpnPayload {
  payment_status?: string;
  order_id?: string;
  payment_id?: number | string;
  price_amount?: number;
  actually_paid?: number;
  pay_currency?: string;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = Deno.env.get("NOWPAYMENTS_IPN_SECRET");
  if (!secret) {
    console.error("NOWPAYMENTS_IPN_SECRET is not set; rejecting IPN");
    return new Response("Not configured", { status: 500 });
  }

  const rawBody = await req.text();
  let payload: IpnPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  const given = req.headers.get("x-nowpayments-sig") ?? "";
  const expected = await hmacSha512Hex(secret, JSON.stringify(sortKeysDeep(payload)));
  if (!given || given.toLowerCase() !== expected.toLowerCase()) {
    return new Response("Invalid signature", { status: 401 });
  }

  const status = payload.payment_status ?? "";
  const txRef = payload.order_id;
  if (!txRef) return new Response("Missing order_id", { status: 400 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Customer has sent funds; the blockchain is confirming. Surface that in
  // admin without granting access yet.
  if (["confirming", "partially_paid", "sending"].includes(status)) {
    await admin
      .from("orders")
      .update({ status: "confirming" })
      .eq("tx_ref", txRef)
      .eq("status", "pending");
    return new Response("ok");
  }
  if (["failed", "expired", "refunded"].includes(status)) {
    await admin
      .from("orders")
      .update({ status: "failed" })
      .eq("tx_ref", txRef)
      .neq("status", "paid");
    return new Response("ok");
  }
  if (!["confirmed", "finished"].includes(status)) return new Response("ok");

  const { data: order } = await admin.from("orders").select("*").eq("tx_ref", txRef).maybeSingle();
  if (!order) return new Response("Unknown order", { status: 404 });
  if (order.status === "paid") return new Response("ok"); // idempotent

  await admin
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), provider: "crypto" })
    .eq("tx_ref", txRef);
  await grantEntitlements(admin, order.email, order.product);
  await sendAccessEmail(order.email, order.name ?? "", order.product, {
    amountUsd: order.amount_usd,
    orderRef: txRef,
  });
  await sendOwnerSaleAlert(order.email, order.name ?? "", order.product, order.amount_usd);
  return new Response("ok");
});
