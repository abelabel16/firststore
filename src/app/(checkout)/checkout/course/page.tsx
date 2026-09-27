import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { formatUsd, site } from "@/config/site";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout — Course" };

export default function CourseCheckoutPage() {
  return (
    <Narrow className="max-w-xl py-10 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-ink-soft">One-time payment. No subscription.</p>

      <Card className="mt-6 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Your order</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-ink">{site.course.name}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              8 modules · templates · checklists · future updates
            </p>
          </div>
          <Price
            amount={site.course.price}
            referencePrice={site.course.referencePrice}
            discountLabel={site.course.discountLabel}
          />
        </div>
      </Card>

      <Card className="mt-4 p-5 sm:p-6">
        <CheckoutForm product="course" cta={`Pay ${formatUsd(site.course.price)}`} />
      </Card>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
        By purchasing you agree to our terms and refund policy. This is education — results are
        not guaranteed.
      </p>
    </Narrow>
  );
}
