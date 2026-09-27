import type { Order } from "@/lib/db";

export type VerifyResult = "paid" | "failed" | "pending";

/**
 * Payment provider abstraction.
 *
 * The site never talks to a gateway directly — checkout and verification go
 * through this interface, so switching providers (Chapa → Paddle → anything)
 * only requires a new implementation file and an env change.
 */
export interface PaymentProvider {
  name: string;
  /** Create a hosted checkout for the order; the user is redirected to the URL. */
  createCheckout(order: Order): Promise<{ checkoutUrl: string }>;
  /** Verify the payment status of an order with the gateway (server-side). */
  verify(order: Order): Promise<VerifyResult>;
}
