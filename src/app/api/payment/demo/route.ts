import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { findOrderByTxRef, setOrderStatus } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";

/**
 * Completes a DEMO payment (PAYMENT_PROVIDER=mock only).
 * Disabled entirely when a real provider is configured.
 */
export async function POST(req: Request) {
  if ((process.env.PAYMENT_PROVIDER ?? "mock") !== "mock") {
    return NextResponse.json({ error: "Demo payments are disabled." }, { status: 403 });
  }

  const form = await req.formData();
  const txRef = String(form.get("tx_ref") ?? "");
  const result = String(form.get("result") ?? "");

  const order = findOrderByTxRef(txRef);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (result === "success") {
    await fulfillOrder(order);
    return NextResponse.redirect(`${site.url}/payment/success?tx_ref=${order.txRef}`, 303);
  }

  setOrderStatus(order.txRef, "failed");
  return NextResponse.redirect(`${site.url}/payment/failed`, 303);
}
