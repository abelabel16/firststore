import type { Metadata } from "next";
import Link from "next/link";
import { Container, Narrow } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { PlanCards } from "@/components/site/plan-cards";
import { faqByIds } from "@/content/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "The $19 dropshipping course or the $199 VIP Accelerator. One-time payments, no subscriptions, 14-day refund.",
};

const paymentFaq = faqByIds("one-time", "payment-methods", "refund", "delivery");

export default function PricingPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">Pricing</h1>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              One-time payments, no subscriptions. Both come with a{" "}
              <Link href="/refund-policy" className="font-medium text-accent hover:text-accent-strong">
                14-day refund
              </Link>
              .
            </p>
          </div>
          <PlanCards vipHref="/checkout/mentorship" />
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Narrow>
          <SectionHeading title="Payment questions" />
          <FaqAccordion items={paymentFaq} />
          <p className="mx-auto mt-8 max-w-lg text-center text-sm leading-relaxed text-ink-soft">
            Both products are education. Results are not guaranteed, see the{" "}
            <Link href="/disclaimer" className="font-medium text-accent hover:text-accent-strong">
              disclaimer
            </Link>
            .
          </p>
        </Narrow>
      </section>
    </>
  );
}
