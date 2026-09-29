import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CheckList } from "@/components/ui/check-list";
import { Container, Narrow } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { BuyBlock } from "@/components/site/buy-block";
import { CreatorIntro } from "@/components/site/creator-intro";
import { CurriculumList } from "@/components/site/curriculum-list";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FinalCta } from "@/components/site/final-cta";
import { creator } from "@/content/creator";
import { faqByIds } from "@/content/faq";
import { courseIncludes } from "@/content/offer";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "The Dropshipping Course",
  description:
    "Every step Vibrant Flacon took to build a dropshipping store, and every mistake, in 10+ video lessons plus PDF guides and books. One-time payment.",
};

const courseFaq = faqByIds("what-you-get", "beginner", "shopify", "budget");

export default function CoursePage() {
  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-surface">
        <Container className="grid items-start gap-10 py-12 sm:py-20 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-ink-soft">By {creator.name}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl text-balance">
              {site.course.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              From starting with little money to handling your first orders. 10+ video lessons plus
              PDF guides and books, including every mistake I made along the way.
            </p>
            <div className="mt-8">
              <BuyBlock size="lg" />
            </div>
          </div>
          <Card className="p-6 sm:p-8">
            <p className="text-sm font-medium text-ink-soft">What you get</p>
            <CheckList items={courseIncludes} className="mt-4" />
          </Card>
        </Container>
      </section>

      {/* CURRICULUM: shown once, in full */}
      <section className="py-16 sm:py-24">
        <Narrow>
          <SectionHeading title="What the course covers" />
          <CurriculumList />
        </Narrow>
      </section>

      {/* CREATOR */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading title={`Why ${creator.name} made this`} />
          <CreatorIntro variant="short" />
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Narrow>
          <SectionHeading title="Common questions" />
          <FaqAccordion items={courseFaq} />
          <p className="mt-6 text-center text-sm text-ink-soft">
            Want the audit systems, templates, and private Telegram chat too?{" "}
            <Link href="/mentorship" className="font-medium text-accent hover:text-accent-strong">
              See VIP Accelerator
            </Link>
            .
          </p>
        </Narrow>
      </section>

      <FinalCta />
    </>
  );
}
