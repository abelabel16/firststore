import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";
import { findOrderByTxRef, setOrderStatus } from "@/lib/db";
import { fulfillOrder } from "@/lib/fulfillment";
import { getPaymentProvider } from "@/lib/payments";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Payment Successful" };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tx_ref?: string }>;
}) {
  const { tx_ref } = await searchParams;
  const order = tx_ref ? findOrderByTxRef(tx_ref) : undefined;

  if (!order) {
    return (
      <Narrow className="max-w-md py-16 text-center">
        <h1 className="text-xl font-semibold text-ink">We couldn&rsquo;t find that order</h1>
        <p className="mt-2 text-sm text-ink-soft">
          If you completed a payment, your access email is on its way. Otherwise contact{" "}
          {site.supportEmail}.
        </p>
      </Narrow>
    );
  }

  // Server-side verification with the payment provider — the return URL alone
  // is never treated as proof of payment.
  if (order.status === "pending") {
    const result = await getPaymentProvider().verify(order);
    if (result === "paid") {
      await fulfillOrder(order);
    } else if (result === "failed") {
      setOrderStatus(order.txRef, "failed");
    }
  }

  const current = findOrderByTxRef(order.txRef)!;
  if (current.status === "failed") redirect("/payment/failed");

  if (current.status === "pending") {
    return (
      <Narrow className="max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold text-ink">Payment processing…</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Your payment hasn&rsquo;t been confirmed by the payment provider yet. This usually takes
          under a minute — refresh this page, or check your email for your access instructions.
        </p>
        <p className="mt-6 text-xs text-ink-faint">
          Still pending after a few minutes? Contact {site.supportEmail}.
        </p>
      </Narrow>
    );
  }

  const isCourse = current.product === "course";

  return (
    <Narrow className="max-w-md py-12 sm:py-20">
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-good-soft" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 12l5 5 9-11" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          {isCourse ? "You’re in. 🎉" : "Welcome to VIP. 🤝"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {isCourse
            ? "Your course access instructions have been sent to your email."
            : "Your onboarding instructions have been sent to your email."}
        </p>
        <p className="mt-1 text-sm font-medium text-ink">{current.email}</p>
        <div className="mt-7">
          <ButtonLink
            href={isCourse ? "/login" : "/login?next=/vip/onboarding"}
            size="lg"
            className="w-full"
          >
            {isCourse ? "Open My Course" : "Start Onboarding"}
          </ButtonLink>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Log in with the email above — we&rsquo;ll send you a login link. No password needed.
        </p>
      </Card>
    </Narrow>
  );
}
