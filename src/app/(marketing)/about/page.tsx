import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Vibrant Flacon, creator of The Dropshipping Course.",
};

const principles = [
  {
    title: "Process over promises",
    text: "We teach a repeatable process, research, build, test, improve. We never promise what your results will be, because nobody honestly can.",
  },
  {
    title: "Data over opinions",
    text: "Every decision in the course is anchored to something you can measure: demand signals, margins, analytics, conversion. Guessing is the expensive way to learn.",
  },
  {
    title: "Honesty over hype",
    text: "No income screenshots, no fake urgency, no “last spots” that never run out. If a tactic needs manipulation to sell, it doesn't belong here.",
  },
  {
    title: "Small and real",
    text: "This is a focused product: one course, one advanced tier. We'd rather do two things properly than ten things loudly.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <Narrow className="py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl text-balance">
            Learn the actual process.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {site.name} exists because most dropshipping education is sold on dreams instead of
            process. We took the opposite bet: teach the real work, research, store building,
            content, testing, and let the material speak for itself.
          </p>
        </Narrow>
      </section>

      <section className="py-14 sm:py-20">
        <Narrow className="space-y-10">
          <div className="space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              Dropshipping is a real business model with real trade-offs: low startup cost, but
              thin margins and real competition. Some stores work; many don&rsquo;t. What separates
              the attempts that teach you something from the attempts that just cost you money is
              process, knowing what to test, how to read the result, and what to do next.
            </p>
            <p>
              That&rsquo;s what we built {site.name} around. The course turns the whole journey into
              eight structured modules with checklists and frameworks you can actually follow. The
              VIP Accelerator adds the advanced layer: audit systems for <em>your</em> store,{" "}
              <em>your</em> products, and <em>your</em> content, plus a community building
              alongside you.
            </p>
            <p>
              Our promise is honest education, not a financial outcome. Test your ideas. Use data.
              Improve. That&rsquo;s the whole philosophy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <Card key={p.title} className="p-5">
                <h2 className="text-sm font-semibold text-ink">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              </Card>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-base font-medium text-ink">See if it&rsquo;s for you.</p>
            <p className="max-w-md text-sm text-ink-soft">
              The full curriculum is public on the course page, judge the material before you
              spend a cent.
            </p>
            <ButtonLink href="/course" className="mt-2">
              Explore the course, {formatUsd(site.course.price)}
            </ButtonLink>
          </div>
        </Narrow>
      </section>
    </>
  );
}
