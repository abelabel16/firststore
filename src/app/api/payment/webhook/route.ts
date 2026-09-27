import crypto from "crypto";
import { NextResponse } from "next/server";
import { findOrderByTxRef, setOrderStatus } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";
import { getPaymentProvider } from "@/lib/payments";

/**
 * Payment webhook (Chapa).
 *
 * Defense in depth:
 * 1. If CHAPA_WEBHOOK_SECRET is set, the x-chapa-signature header is verified.
 * 2. Regardless of the webhook payload, the payment status is re-verified
 *    directly with the gateway before any entitlement is granted.
 */
export async function POST(req: Request) {
  const raw = await req.text();

  const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers.get("x-chapa-signature") ?? "";
    const expected = crypto.createHmac("sha256", webhookSecret).update(raw).digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  }

  let payload: { tx_ref?: string; trx_ref?: string };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const txRef = payload.tx_ref ?? payload.trx_ref;
  if (!txRef) return NextResponse.json({ error: "Missing tx_ref." }, { status: 400 });

  const order = findOrderByTxRef(txRef);
  if (!order) return NextResponse.json({ error: "Unknown order." }, { status: 404 });

  if (order.status === "pending") {
    const result = await getPaymentProvider().verify(order);
    if (result === "paid") await fulfillOrder(order);
    else if (result === "failed") setOrderStatus(order.txRef, "failed");
  }

  return NextResponse.json({ received: true });
}
