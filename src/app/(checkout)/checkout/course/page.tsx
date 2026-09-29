import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { formatUsd, site } from "@/config/site";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { NextSteps, TrustStrip } from "@/components/checkout/checkout-extras";

export const metadata: Metadata = { title: "Course Checkout" };

const included = [
  "All 8 modules, 29 video lessons",
  "Product research & launch checklists",
  "Templates and decision frameworks",
  "Complete resource library",
  "Every future update, free",
];

export default function CourseCheckoutPage() {
  return (
    <Container className="max-w-5xl py-10 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          You&rsquo;re one step away.
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          One-time payment. Everything delivered to your email.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[5fr_6fr]">
        {/* Order summary */}
        <div className="space-y-4 lg:sticky lg:top-8">
          <Card className="overflow-hidden">
            <div className="border-b border-line bg-paper px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Your order
              </p>
              <p className="mt-1.5 text-lg font-semibold text-ink">{site.course.name}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                The complete process, from first idea to launched store.
              </p>
            </div>
            <div className="p-6">
              <Price
                amount={site.cardPayments ? site.course.price : site.course.cryptoPrice}
                referencePrice={site.course.referencePrice}
                discountLabel={
                  site.cardPayments ? site.course.discountLabel : site.course.cryptoDiscountLabel
                }
              />
              <p className="mt-1.5 text-xs text-ink-faint">
                {site.cardPayments
                  ? `Card price. Pay with crypto for ${formatUsd(site.course.cryptoPrice)}.`
                  : `Crypto price. Card price ${formatUsd(site.course.price)}, coming soon.`}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-good-soft text-good" aria-hidden="true">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5.5l2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          <NextSteps />
          <TrustStrip />
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <CheckoutForm product="course" />
        </Card>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-ink-faint">
        By purchasing you agree to our terms and refund policy. This is education, results are
        not guaranteed.
      </p>
    </Container>
  );
}
