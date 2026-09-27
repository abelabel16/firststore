import { chapaProvider } from "./chapa";
import { mockProvider } from "./mock";
import type { PaymentProvider } from "./types";

export type { PaymentProvider, VerifyResult } from "./types";

export function getPaymentProvider(): PaymentProvider {
  switch (process.env.PAYMENT_PROVIDER) {
    case "chapa":
      return chapaProvider;
    default:
      return mockProvider;
  }
}
