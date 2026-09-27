import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatUsd, site } from "@/config/site";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { NextSteps, TrustStrip } from "@/components/checkout/checkout-extras";

export const metadata: Metadata = { title: "VIP Checkout" };

const included = [
  "The full course, all 8 modules",
  "Advanced deep-dive guides",
  "Store & product audit systems",
  "Content review rubric",
  "Action plan templates",
  "Private community access",
  "Priority support & lifetime updates",
];

export default function VipCheckoutPage() {
  return (
    <Container className="max-w-5xl py-10 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Welcome to the top tier.
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          One-time payment. The complete system, delivered to your email.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[5fr_6fr]">
        {/* Order summary, dark premium panel */}
        <div className="space-y-4 lg:sticky lg:top-8">
          <div className="overflow-hidden rounded-2xl bg-zinc-900 text-white shadow-md">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Your order
                </p>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">
                  Premium
                </span>
              </div>
              <p className="mt-1.5 text-lg font-semibold">{site.mentorship.name}</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                Everything in the course, plus the advanced system around it.
              </p>
            </div>
            <div className="p-6">
              <span className="text-4xl font-semibold tracking-tight">
                {formatUsd(site.mentorship.price)}
              </span>
              <p className="mt-1.5 text-xs text-zinc-500">One-time payment. Course included.</p>
              <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-100">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-400" aria-hidden="true">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5.5l2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <NextSteps />
          <TrustStrip />
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <CheckoutForm product="vip" />
        </Card>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-ink-faint">
        By purchasing you agree to our terms and refund policy. This is education, results are
        not guaranteed.
      </p>
    </Container>
  );
}
