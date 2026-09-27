/**
 * create-checkout — records an order and returns the payment URL.
 *
 * Secrets (Supabase dashboard → Edge Functions → Secrets):
 *   DEMO_PAYMENTS        "true" while testing → no real gateway, order is
 *                        marked paid immediately and clearly labeled demo.
 *   CHAPA_SECRET_KEY     Chapa secret key (live mode).
 *   CHAPA_CURRENCY       usually "ETB".
 *   CHAPA_AMOUNT_COURSE / CHAPA_AMOUNT_VIP  amounts in CHAPA_CURRENCY.
 *   SITE_URL             canonical site origin for redirects, e.g.
 *                        https://abelabel16.github.io/firststore
 *
 * Deploy: supabase functions deploy create-checkout --no-verify-jwt
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, grantEntitlements, sendAccessEmail } from "../_shared/grant.ts";

const PRICES_USD = { course: 19, vip: 499 } as const;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: { product?: string; name?: string; email?: string; returnOrigin?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const product = body.product === "vip" ? "vip" : body.product === "course" ? "course" : null;
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!product || !name || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Please provide a valid name and email." }, 400);
  }

  const siteUrl = Deno.env.get("SITE_URL") ?? body.returnOrigin ?? "";
  const successUrl = `${siteUrl}/payment/success/?product=${product}&email=${encodeURIComponent(email)}`;

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const txRef = crypto.randomUUID();
  const demo = Deno.env.get("DEMO_PAYMENTS") === "true";
  const { error: orderError } = await admin.from("orders").insert({
    tx_ref: txRef,
    email,
    name,
    product,
    amount_usd: PRICES_USD[product],
    provider: demo ? "demo" : "chapa",
  });
  if (orderError) {
    console.error("order insert failed", orderError);
    return json({ error: "Could not start checkout. Please try again." }, 500);
  }

  // ── Demo mode: no real money, grant access immediately ──
  if (demo) {
    await admin
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("tx_ref", txRef);
    await grantEntitlements(admin, email, product);
    await sendAccessEmail(email, name, product);
    return json({ checkoutUrl: successUrl });
  }

  // ── Chapa (https://developer.chapa.co) ──
  const secretKey = Deno.env.get("CHAPA_SECRET_KEY");
  if (!secretKey) return json({ error: "Payments are not configured yet." }, 503);

  const amount =
    product === "course"
      ? (Deno.env.get("CHAPA_AMOUNT_COURSE") ?? String(PRICES_USD.course))
      : (Deno.env.get("CHAPA_AMOUNT_VIP") ?? String(PRICES_USD.vip));
  const [firstName, ...rest] = name.split(" ");

  const res = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      currency: Deno.env.get("CHAPA_CURRENCY") ?? "ETB",
      email,
      first_name: firstName,
      last_name: rest.join(" ") || firstName,
      tx_ref: txRef,
      callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/chapa-webhook`,
      return_url: successUrl,
    }),
  });
  const chapa = (await res.json()) as {
    status: string;
    data?: { checkout_url?: string };
    message?: unknown;
  };
  if (chapa.status !== "success" || !chapa.data?.checkout_url) {
    console.error("chapa initialize failed", chapa.message);
    return json({ error: "The payment provider rejected the request. Try again shortly." }, 502);
  }
  return json({ checkoutUrl: chapa.data.checkout_url });
});
