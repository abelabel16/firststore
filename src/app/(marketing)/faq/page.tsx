import type { Metadata } from "next";
import Link from "next/link";
import { Narrow } from "@/components/ui/container";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FinalCta } from "@/components/site/final-cta";
import { faqCategories } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about the course, the VIP Accelerator, payments, delivery, and what results to expect.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <Narrow className="py-14 text-center sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-ink-soft">
            The course, VIP, payments, delivery, and results.
          </p>
        </Narrow>
      </section>

      <section className="py-14 sm:py-20">
        <Narrow className="space-y-12">
          {faqCategories.map((cat) => (
            <div key={cat.title}>
              <h2 className="mb-4 text-lg font-semibold text-ink">{cat.title}</h2>
              <FaqAccordion items={cat.items} />
            </div>
          ))}
          <p className="text-center text-sm text-ink-soft">
            Didn&rsquo;t find your answer?{" "}
            <Link href="/contact" className="font-medium text-accent hover:text-accent-strong">
              Contact us
            </Link>
            .
          </p>
        </Narrow>
      </section>

      <FinalCta />
    </>
  );
}
