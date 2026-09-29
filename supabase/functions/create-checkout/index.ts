/**
 * create-checkout — records an order and returns the payment URL.
 *
 * Secrets (Supabase dashboard → Edge Functions → Secrets):
 *   DEMO_PAYMENTS         "true" while testing → no real gateway, order is
 *                         marked paid immediately and clearly labeled demo.
 *   PAYMENT_GATEWAY       card gateway: "whop", "polar", "dodo" (default)
 *                         or "chapa".
 *   CARD_PAYMENTS         "on" to accept card checkouts at all.
 *   SITE_URL              canonical site origin for redirects, e.g.
 *                         https://vibrantflacon.com
 *
 *   Whop (whop.com):
 *     WHOP_API_KEY        company API key from Dashboard → Developer
 *     WHOP_PLAN_COURSE / WHOP_PLAN_VIP
 *                         plan IDs (plan_…) of the two one-time plans
 *
 *   Dodo Payments (dodopayments.com):
 *     DODO_API_KEY        from Dashboard → Developer → API Keys
 *     DODO_PRODUCT_COURSE / DODO_PRODUCT_VIP
 *                         product IDs of the two products you create in
 *                         Dashboard → Products
 *     DODO_TEST_MODE      "true" to use test.dodopayments.com
 *
 *   Chapa (legacy alternative):
 *     CHAPA_SECRET_KEY, CHAPA_CURRENCY, CHAPA_AMOUNT_COURSE, CHAPA_AMOUNT_VIP
 *
 * Deploy: supabase functions deploy create-checkout --no-verify-jwt
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { allowedOrigins, corsFor, grantEntitlements, sendAccessEmail } from "../_shared/grant.ts";

const PRICES_USD = { course: 19, vip: 199 } as const;
// Crypto is cheaper for us to accept; the course gets a crypto discount.
const CRYPTO_PRICES_USD = { course: 17.99, vip: 199 } as const;

Deno.serve(async (req) => {
  const cors = corsFor(req);
  const json = (body: unknown, status = 200): Response =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: {
    product?: string;
    name?: string;
    email?: string;
    returnOrigin?: string;
    method?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const method = body.method === "crypto" ? "crypto" : "card";

  const product = body.product === "vip" ? "vip" : body.product === "course" ? "course" : null;
  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().toLowerCase();
  if (!product || !name || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Please provide a valid name and email." }, 400);
  }

  // The redirect target must be our own site: SITE_URL when configured,
  // otherwise the caller's origin only if it is on the allowlist.
  const returnOrigin = allowedOrigins.includes(body.returnOrigin ?? "")
    ? body.returnOrigin!
    : allowedOrigins[0];
  const siteUrl = Deno.env.get("SITE_URL") ?? returnOrigin;
  const successUrl = `${siteUrl}/payment/success/?product=${product}&email=${encodeURIComponent(email)}`;

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Card payments are gated until a card gateway with working payouts is
  // live; flip CARD_PAYMENTS=on to re-enable.
  if (method === "card" && Deno.env.get("CARD_PAYMENTS") !== "on") {
    return json(
      { error: "Card payments are coming soon. Please use Crypto (USDT) for now." },
      503
    );
  }

  const chargeUsd = method === "crypto" ? CRYPTO_PRICES_USD[product] : PRICES_USD[product];
  const txRef = crypto.randomUUID();
  const demo = Deno.env.get("DEMO_PAYMENTS") === "true";
  const { error: orderError } = await admin.from("orders").insert({
    tx_ref: txRef,
    email,
    name,
    product,
    amount_usd: chargeUsd,
    provider: demo
      ? "demo"
      : method === "crypto"
        ? "crypto"
        : (Deno.env.get("PAYMENT_GATEWAY") ?? "dodo"),
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
    await sendAccessEmail(email, name, product, {
      amountUsd: PRICES_USD[product],
      orderRef: txRef,
    });
    return json({ checkoutUrl: successUrl });
  }

  // ── Crypto via NOWPayments (https://nowpayments.io) ──
  if (method === "crypto") {
    const apiKey = Deno.env.get("NOWPAYMENTS_API_KEY");
    if (!apiKey) return json({ error: "Crypto payments are not configured yet." }, 503);
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        price_amount: chargeUsd,
        price_currency: "usd",
        order_id: txRef,
        order_description:
          product === "course" ? "The Dropshipping Course" : "VIP Accelerator",
        success_url: successUrl,
        cancel_url: `${siteUrl}/payment/failed/`,
        ipn_callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/nowpayments-ipn`,
      }),
    });
    const np = (await res.json()) as { invoice_url?: string };
    if (!res.ok || !np.invoice_url) {
      console.error("nowpayments invoice failed", res.status, JSON.stringify(np));
      return json({ error: "Could not start the crypto payment. Try again shortly." }, 502);
    }
    return json({ checkoutUrl: np.invoice_url });
  }

  // ── Whop (https://docs.whop.com) ──
  if (Deno.env.get("PAYMENT_GATEWAY") === "whop") {
    const apiKey = Deno.env.get("WHOP_API_KEY");
    const planId =
      product === "course" ? Deno.env.get("WHOP_PLAN_COURSE") : Deno.env.get("WHOP_PLAN_VIP");
    if (!apiKey || !planId) return json({ error: "Payments are not configured yet." }, 503);

    const res = await fetch("https://api.whop.com/api/v1/checkout_configurations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: planId,
        redirect_url: successUrl,
        // Copied onto the payment, so the webhook can find our order.
        metadata: { tx_ref: txRef, product },
      }),
    });
    const whop = (await res.json()) as { purchase_url?: string | null };
    if (!res.ok || !whop.purchase_url) {
      console.error("whop checkout failed", res.status, JSON.stringify(whop));
      return json({ error: "The payment provider rejected the request. Try again shortly." }, 502);
    }
    return json({ checkoutUrl: new URL(whop.purchase_url, "https://whop.com").toString() });
  }

  // ── Polar (https://polar.sh/docs) ──
  if (Deno.env.get("PAYMENT_GATEWAY") === "polar") {
    const token = Deno.env.get("POLAR_ACCESS_TOKEN");
    const productId =
      product === "course"
        ? Deno.env.get("POLAR_PRODUCT_COURSE")
        : Deno.env.get("POLAR_PRODUCT_VIP");
    if (!token || !productId) return json({ error: "Payments are not configured yet." }, 503);

    const res = await fetch("https://api.polar.sh/v1/checkouts/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        products: [productId],
        customer_email: email,
        customer_name: name,
        success_url: successUrl,
        metadata: { tx_ref: txRef, product },
      }),
    });
    const polar = (await res.json()) as { url?: string };
    if (!res.ok || !polar.url) {
      console.error("polar checkout failed", res.status, JSON.stringify(polar));
      return json({ error: "The payment provider rejected the request. Try again shortly." }, 502);
    }
    return json({ checkoutUrl: polar.url });
  }

  // ── Dodo Payments (https://docs.dodopayments.com) ──
  if ((Deno.env.get("PAYMENT_GATEWAY") ?? "dodo") === "dodo") {
    const apiKey = Deno.env.get("DODO_API_KEY");
    if (!apiKey) return json({ error: "Payments are not configured yet." }, 503);
    const productId =
      product === "course"
        ? Deno.env.get("DODO_PRODUCT_COURSE")
        : Deno.env.get("DODO_PRODUCT_VIP");
    if (!productId) {
      return json(
        {
          error:
            product === "vip"
              ? "VIP checkout is opening soon. Message us on Telegram @netro_s and we'll get you in today."
              : "Payments are not configured yet.",
        },
        503
      );
    }

    const apiBase =
      Deno.env.get("DODO_TEST_MODE") === "true"
        ? "https://test.dodopayments.com"
        : "https://live.dodopayments.com";
    const res = await fetch(`${apiBase}/checkouts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { email, name },
        return_url: successUrl,
        // tx_ref links the webhook back to our order record.
        metadata: { tx_ref: txRef, product },
      }),
    });
    const dodo = (await res.json()) as { checkout_url?: string };
    if (!res.ok || !dodo.checkout_url) {
      console.error("dodo checkout failed", res.status, JSON.stringify(dodo));
      return json({ error: "The payment provider rejected the request. Try again shortly." }, 502);
    }
    return json({ checkoutUrl: dodo.checkout_url });
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
