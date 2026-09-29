import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { formatUsd, site } from "@/config/site";
import { vipIncludes } from "@/content/offer";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { NextSteps, TrustStrip } from "@/components/checkout/checkout-extras";

export const metadata: Metadata = { title: "VIP Checkout" };

export default function VipCheckoutPage() {
  return (
    <Container className="max-w-5xl py-8 sm:py-14">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Welcome to the top tier.
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          One-time payment. The complete system, delivered to your email.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[6fr_5fr]">
        {/* Pay first: order line, price, and the form */}
        <Card className="p-6 sm:p-8">
          <div className="mb-6 border-b border-line pb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Your order
            </p>
            <p className="mt-1.5 text-lg font-semibold text-ink">{site.mentorship.name}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {formatUsd(site.mentorship.price)}
            </p>
            <p className="mt-1 text-xs text-ink-faint">One-time payment. Course included.</p>
          </div>
          <CheckoutForm product="vip" />
        </Card>

        {/* The explanation, after the form: dark premium panel */}
        <div className="space-y-4 lg:sticky lg:top-8">
          <div className="overflow-hidden rounded-2xl bg-zinc-900 p-6 text-white shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              What&rsquo;s included
            </p>
            <p className="mt-1.5 text-sm text-zinc-400">
              Everything in the course, plus the VIP tools and private Telegram chat.
            </p>
            <CheckList items={vipIncludes} dark className="mt-4" />
          </div>
          <NextSteps />
          <TrustStrip />
        </div>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-ink-faint">
        By purchasing you agree to our terms and refund policy. This is education, results are
        not guaranteed.
      </p>
    </Container>
  );
}
