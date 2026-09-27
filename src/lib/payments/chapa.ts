import { site } from "@/config/site";
import type { Order } from "@/lib/db";
import type { PaymentProvider, VerifyResult } from "./types";

/**
 * Chapa (https://chapa.co) — Ethiopian NBE-licensed payment gateway.
 * Accepts telebirr, CBE Birr, local bank cards, and international
 * Visa/Mastercard. Docs: https://developer.chapa.co
 *
 * Required env:
 *   CHAPA_SECRET_KEY      — from dashboard.chapa.co → Settings → API
 *   CHAPA_WEBHOOK_SECRET  — the secret you set for webhooks (optional but recommended)
 *   CHAPA_CURRENCY        — usually "ETB"
 *   CHAPA_AMOUNT_COURSE / CHAPA_AMOUNT_VIP — amounts in CHAPA_CURRENCY
 */

const API_BASE = "https://api.chapa.co/v1";

function secretKey(): string {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) throw new Error("CHAPA_SECRET_KEY is not set");
  return key;
}

function chargeAmount(order: Order): { amount: string; currency: string } {
  const currency = process.env.CHAPA_CURRENCY ?? "ETB";
  const amount =
    order.product === "course"
      ? process.env.CHAPA_AMOUNT_COURSE ?? String(order.amountUsd)
      : process.env.CHAPA_AMOUNT_VIP ?? String(order.amountUsd);
  return { amount, currency };
}

export const chapaProvider: PaymentProvider = {
  name: "chapa",

  async createCheckout(order: Order): Promise<{ checkoutUrl: string }> {
    const { amount, currency } = chargeAmount(order);
    const [firstName, ...rest] = order.name.split(" ");
    const res = await fetch(`${API_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        email: order.email,
        first_name: firstName,
        last_name: rest.join(" ") || firstName,
        tx_ref: order.txRef,
        callback_url: `${site.url}/api/payment/webhook`,
        return_url: `${site.url}/payment/success?tx_ref=${order.txRef}`,
        customization: {
          title: site.name,
          description:
            order.product === "course" ? site.course.name : site.mentorship.name,
        },
      }),
    });
    const json = (await res.json()) as {
      status: string;
      data?: { checkout_url?: string };
      message?: unknown;
    };
    if (json.status !== "success" || !json.data?.checkout_url) {
      throw new Error(`Chapa initialize failed: ${JSON.stringify(json.message)}`);
    }
    return { checkoutUrl: json.data.checkout_url };
  },

  async verify(order: Order): Promise<VerifyResult> {
    const res = await fetch(`${API_BASE}/transaction/verify/${order.txRef}`, {
      headers: { Authorization: `Bearer ${secretKey()}` },
    });
    if (!res.ok) return "pending";
    const json = (await res.json()) as {
      status: string;
      data?: { status?: string };
    };
    if (json.status === "success" && json.data?.status === "success") return "paid";
    if (json.data?.status === "failed") return "failed";
    return "pending";
  },
};
