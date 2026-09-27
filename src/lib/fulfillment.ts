import { grantEntitlement, setOrderStatus, type Order } from "@/lib/db";
import { sendCoursePurchaseEmail, sendVipPurchaseEmail } from "@/lib/email";

/**
 * Fulfill a paid order: mark it paid, grant the entitlement, and send the
 * access email. Idempotent — safe to call from both the webhook and the
 * return-URL verification without double-granting.
 */
export async function fulfillOrder(order: Order): Promise<void> {
  if (order.status === "paid") return;
  setOrderStatus(order.txRef, "paid");
  grantEntitlement(order.email, order.product);
  if (order.product === "course") {
    await sendCoursePurchaseEmail(order.email, order.name);
  } else {
    await sendVipPurchaseEmail(order.email, order.name);
  }
}
