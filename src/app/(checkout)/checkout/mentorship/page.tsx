import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";
import { formatUsd, site } from "@/config/site";
import { CheckoutForm } from "@/components/checkout/checkout-form";

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

export default function MentorshipCheckoutPage() {
  return (
    <Narrow className="max-w-xl py-10 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-ink-soft">One-time payment. Everything included.</p>

      <Card className="mt-6 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Your order</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <p className="text-base font-semibold text-ink">{site.mentorship.name}</p>
          <span className="text-3xl font-semibold tracking-tight text-ink">
            {formatUsd(site.mentorship.price)}
          </span>
        </div>
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-ink-soft">
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-4 p-5 sm:p-6">
        <CheckoutForm product="vip" cta="Get VIP Access" />
      </Card>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
        By purchasing you agree to our terms and refund policy. This is education, results are
        not guaranteed.
      </p>
    </Narrow>
  );
}
