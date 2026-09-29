import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CheckList } from "@/components/ui/check-list";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { site } from "@/config/site";
import { courseIncludes } from "@/content/offer";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { NextSteps, TrustStrip } from "@/components/checkout/checkout-extras";

export const metadata: Metadata = { title: "Course Checkout" };

export default function CourseCheckoutPage() {
  return (
    <Container className="max-w-5xl py-8 sm:py-14">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          You&rsquo;re one step away.
        </h1>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          One-time payment. Everything delivered to your email.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[6fr_5fr]">
        {/* Pay first: order line, price, and the form */}
        <Card className="p-6 sm:p-8">
          <div className="mb-6 border-b border-line pb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Your order
            </p>
            <p className="mt-1.5 text-lg font-semibold text-ink">{site.course.name}</p>
            <div className="mt-3">
              <Price
                amount={site.course.price}
                referencePrice={site.course.referencePrice}
                discountLabel={site.course.discountLabel}
              />
            </div>
          </div>
          <CheckoutForm product="course" />
        </Card>

        {/* The explanation, after the form */}
        <div className="space-y-4 lg:sticky lg:top-8">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              What&rsquo;s included
            </p>
            <p className="mt-1.5 text-sm text-ink-soft">
              Every step, from starting with little money to your first orders.
            </p>
            <CheckList items={courseIncludes} className="mt-4" />
          </Card>
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
