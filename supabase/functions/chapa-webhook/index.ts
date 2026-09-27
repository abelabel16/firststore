/**
 * chapa-webhook — Chapa calls this after a payment attempt.
 *
 * The payload is never trusted on its own: the transaction is re-verified
 * against Chapa's API before any access is granted.
 *
 * Secrets: CHAPA_SECRET_KEY, CHAPA_WEBHOOK_SECRET (recommended).
 * Deploy:  supabase functions deploy chapa-webhook --no-verify-jwt
 * Then set the webhook URL in the Chapa dashboard to this function's URL.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { grantEntitlements } from "../_shared/grant.ts";

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const raw = await req.text();

  const webhookSecret = Deno.env.get("CHAPA_WEBHOOK_SECRET");
  if (webhookSecret) {
    const signature = req.headers.get("x-chapa-signature") ?? "";
    const expected = await hmacHex(webhookSecret, raw);
    if (signature !== expected) return new Response("Invalid signature", { status: 401 });
  }

  let payload: { tx_ref?: string; trx_ref?: string };
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }
  const txRef = payload.tx_ref ?? payload.trx_ref;
  if (!txRef) return new Response("Missing tx_ref", { status: 400 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: order } = await admin.from("orders").select("*").eq("tx_ref", txRef).maybeSingle();
  if (!order) return new Response("Unknown order", { status: 404 });
  if (order.status === "paid") return new Response("ok"); // idempotent

  // Verify with Chapa directly — never trust the webhook body alone.
  const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${Deno.env.get("CHAPA_SECRET_KEY")}` },
  });
  const verification = (await res.json()) as { status: string; data?: { status?: string } };

  if (verification.status === "success" && verification.data?.status === "success") {
    await admin
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("tx_ref", txRef);
    await grantEntitlements(admin, order.email, order.product);
  } else if (verification.data?.status === "failed") {
    await admin.from("orders").update({ status: "failed" }).eq("tx_ref", txRef);
  }

  return new Response("ok");
});
