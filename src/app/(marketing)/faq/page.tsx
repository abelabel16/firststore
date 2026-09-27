import type { Metadata } from "next";
import Link from "next/link";
import { Narrow } from "@/components/ui/container";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FinalCta } from "@/components/site/final-cta";
import { faqCategories } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Honest answers about the course, the VIP Accelerator, payments, access, and what results to realistically expect.",
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
            Straight answers, including the uncomfortable ones about results.
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
            </Link>{" "}
           , we reply to every message.
          </p>
        </Narrow>
      </section>

      <FinalCta />
    </>
  );
}
