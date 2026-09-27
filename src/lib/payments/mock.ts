import type { Order } from "@/lib/db";
import { findOrderByTxRef } from "@/lib/db";
import type { PaymentProvider, VerifyResult } from "./types";

/**
 * Mock provider for local development.
 *
 * Redirects to /payment/demo — a page clearly labeled as a demo gateway with
 * "simulate success" / "simulate failure" buttons. No real money moves, and
 * nothing pretends otherwise.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createCheckout(order: Order): Promise<{ checkoutUrl: string }> {
    return { checkoutUrl: `/payment/demo?tx_ref=${order.txRef}` };
  },

  async verify(order: Order): Promise<VerifyResult> {
    return findOrderByTxRef(order.txRef)?.status ?? "pending";
  },
};
