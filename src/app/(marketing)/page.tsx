import Link from "next/link";
import { Container, Narrow } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { BuyBlock } from "@/components/site/buy-block";
import { CreatorIntro } from "@/components/site/creator-intro";
import { CurriculumList } from "@/components/site/curriculum-list";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FinalCta } from "@/components/site/final-cta";
import { PlanCards } from "@/components/site/plan-cards";
import { creator } from "@/content/creator";
import { faqByIds } from "@/content/faq";
import { site } from "@/config/site";

const homeFaq = faqByIds("what-you-get", "beginner", "delivery", "one-time", "refund", "guarantee");

export default function HomePage() {
  return (
    <>
      {/* HERO: the offer first, what it covers beside it */}
      <section className="border-b border-line bg-surface">
        <Container className="grid items-start gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-ink-soft">By {creator.name}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl text-balance">
              Build your first dropshipping store.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              Every step I took to build my store, and every mistake I made, in 10+ video lessons
              plus PDF guides and books.
            </p>
            <div className="mt-8">
              <BuyBlock size="lg" />
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-ink-soft">What the course covers</p>
            <CurriculumList compact />
            <Link
              href="/course"
              className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-strong"
            >
              See what each part covers
            </Link>
          </div>
        </Container>
      </section>

      {/* THE PERSON BEHIND IT */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading title={`Meet ${creator.name}`} />
          <CreatorIntro variant="full" />
        </Container>
      </section>

      {/* COURSE OR VIP */}
      <section id="plans" className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            title="Choose how you want to learn"
            description="The course has every step. VIP adds audit systems, templates, deeper guides, and a private Telegram chat."
          />
          <PlanCards vipHref="/mentorship" />
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Narrow>
          <SectionHeading title="Common questions" />
          <FaqAccordion items={homeFaq} />
          <p className="mt-6 text-center text-sm text-ink-soft">
            More questions?{" "}
            <Link href="/faq" className="font-medium text-accent hover:text-accent-strong">
              Read the full FAQ
            </Link>{" "}
            or message{" "}
            <a
              href={site.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:text-accent-strong"
            >
              {site.telegram}
            </a>{" "}
            on Telegram.
          </p>
        </Narrow>
      </section>

      <FinalCta />
    </>
  );
}
