import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Narrow } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { modules } from "@/content/course";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "The Dropshipping Course",
  description:
    "An 8-module, self-paced dropshipping course: product research, store setup, suppliers, content, traffic, and launch. One-time payment.",
};

const audience = [
  {
    title: "Complete beginners",
    text: "You've never built a store. The course starts from zero, how the model works, what it costs, what to expect.",
  },
  {
    title: "Stuck starters",
    text: "You started a store but stalled, on product choice, content, or traffic. The module structure lets you fix the specific gap.",
  },
  {
    title: "Side-project builders",
    text: "You have a few hours a week. Lessons are short and sequential so progress survives a busy schedule.",
  },
];

const notList = [
  {
    title: "No guaranteed income",
    text: "Nobody can guarantee your store makes money, your results depend on your products, execution, and budget.",
  },
  {
    title: "No overnight wealth promises",
    text: "Building and validating a store takes weeks of real work. Anyone promising faster is selling you a fantasy.",
  },
  {
    title: "No fake proof",
    text: "No income screenshots, no “student results” we can't verify. Judge the course by its curriculum, it's all public on this page.",
  },
  {
    title: "No magic formula",
    text: "There's no secret method. There's a process: research, build, test, read the data, improve. That's what we teach.",
  },
];

const included = [
  { title: "29 video lessons", text: "Across 8 modules, most under 15 minutes." },
  { title: "5 working checklists", text: "Research, store launch, suppliers, content, and launch." },
  { title: "Templates", text: "Margin calculator, shot lists, page structures." },
  { title: "Decision frameworks", text: "Product scoring and push/pivot/drop calls." },
  { title: "Tool list", text: "What we use, with free alternatives." },
  { title: "All future updates", text: "The course evolves; your access includes updates." },
];

function PriceBlock({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "text-center"}>
      <Price
        amount={site.course.price}
        referencePrice={site.course.referencePrice}
        discountLabel={site.course.discountLabel}
        size={compact ? "md" : "lg"}
      />
    </div>
  );
}

export default function CoursePage() {
  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-surface">
        <Narrow className="py-16 text-center sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
            Start Learning Dropshipping for {formatUsd(site.course.price)}.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            The complete process, product research, store setup, suppliers, content, traffic, and
            launch, in one structured course.
          </p>
          <div className="mt-8 flex justify-center">
            <PriceBlock />
          </div>
          <div className="mt-8">
            <ButtonLink href="/checkout/course" size="lg" className="w-full sm:w-auto">
              Get Instant Access
            </ButtonLink>
            <p className="mt-3 text-sm text-ink-faint">One-time payment. No subscription.</p>
          </div>
        </Narrow>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Curriculum"
            title="What you'll learn"
            description="Eight modules, in the order you'll actually need them."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {modules.map((m) => (
              <Card key={m.id} className="p-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-semibold text-accent">{m.number}</span>
                  <h3 className="text-base font-semibold text-ink">{m.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.summary}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* INSIDE THE COURSE */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Inside the course"
            title="Every module, in detail"
            description="Exactly what each module contains, no mystery boxes."
          />
          <div className="mx-auto max-w-3xl space-y-4">
            {modules.map((m) => (
              <Card key={m.id} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-semibold text-accent">{m.number}</span>
                    <h3 className="text-base font-semibold text-ink">{m.title}</h3>
                  </div>
                  <span className="text-xs text-ink-faint">{m.lessons.length} lessons</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.detail}</p>
                <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                  {m.lessons.map((l) => (
                    <li key={l.id} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-ink">{l.title}</span>
                      <span className="shrink-0 text-xs text-ink-faint">{l.duration}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* BUILT FOR BEGINNERS */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Who it's for"
            title="Built for beginners"
            description="You don't need experience, a big budget, or a business background."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
            {audience.map((a) => (
              <Card key={a.title} className="p-5">
                <h3 className="text-sm font-semibold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* WHAT THIS COURSE IS NOT */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Honesty first"
            title="What this course is not"
            description="This course is about learning, experimentation, execution, and understanding, not shortcuts."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {notList.map((n) => (
              <div key={n.title} className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger-soft text-danger" aria-hidden="true">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  {n.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{n.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Included" title="Everything in the box" />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((i) => (
              <Card key={i.title} className="p-5">
                <h3 className="text-sm font-semibold text-ink">{i.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{i.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FINAL PRICE CARD */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Narrow>
          <Card className="p-8 text-center sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
              {site.course.name}
            </p>
            <div className="mt-6 flex justify-center">
              <PriceBlock />
            </div>
            <p className="mt-3 text-sm text-ink-faint">
              One-time payment · Permanent access · Future updates included
            </p>
            <div className="mt-8">
              <ButtonLink href="/checkout/course" size="lg" className="w-full sm:w-auto">
                Get Instant Access
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-ink-faint">
              Education only, no income guarantees. See our refund policy and disclaimer.
            </p>
          </Card>
        </Narrow>
      </section>
    </>
  );
}
