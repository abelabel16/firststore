import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";
import { findOrderByTxRef } from "@/lib/db";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = { title: "Demo Payment" };

/**
 * Demo payment gateway — used only when PAYMENT_PROVIDER=mock.
 * Clearly labeled: nothing here is a real payment, and nothing pretends to be.
 */
export default async function DemoPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ tx_ref?: string }>;
}) {
  const { tx_ref } = await searchParams;
  const order = tx_ref ? findOrderByTxRef(tx_ref) : undefined;

  if (!order) {
    return (
      <Narrow className="max-w-md py-16 text-center">
        <h1 className="text-xl font-semibold text-ink">Order not found</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This demo payment link is invalid or expired. Start checkout again.
        </p>
      </Narrow>
    );
  }

  const productName = order.product === "course" ? site.course.name : site.mentorship.name;

  return (
    <Narrow className="max-w-md py-10 sm:py-16">
      <Badge tone="warn" className="mb-4">
        Demo gateway — no real payment happens here
      </Badge>
      <Card className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          Simulated payment
        </p>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-base font-semibold text-ink">{productName}</p>
          <p className="text-2xl font-semibold text-ink">{formatUsd(order.amountUsd)}</p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">{order.email}</p>
        <p className="mt-4 rounded-lg bg-paper p-3 text-xs leading-relaxed text-ink-soft">
          This site is running with the development payment provider. In production this step is
          replaced by your real payment provider&rsquo;s hosted checkout (e.g. Chapa). Choose an
          outcome to simulate:
        </p>
        <div className="mt-5 grid gap-3">
          <form action="/api/payment/demo" method="POST">
            <input type="hidden" name="tx_ref" value={order.txRef} />
            <input type="hidden" name="result" value="success" />
            <button
              type="submit"
              className="w-full rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Simulate successful payment
            </button>
          </form>
          <form action="/api/payment/demo" method="POST">
            <input type="hidden" name="tx_ref" value={order.txRef} />
            <input type="hidden" name="result" value="fail" />
            <button
              type="submit"
              className="w-full rounded-xl border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-zinc-50"
            >
              Simulate failed payment
            </button>
          </form>
        </div>
      </Card>
    </Narrow>
  );
}
