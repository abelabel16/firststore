import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Narrow } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "VIP Accelerator",
  description:
    "The advanced tier of the dropshipping course: deep-dive guides, store and product audit systems, premium templates, private community, and priority support. Course included.",
};

const included = [
  { title: "The full course, included", text: "All 8 modules and 29 lessons of the base course come with VIP." },
  { title: "Advanced deep-dive guides", text: "Go further on validation, testing budgets, and reading early data with structured decision thresholds." },
  { title: "Store audit system", text: "The complete audit checklist: review your own store the way a professional would, section by section." },
  { title: "Product audit system", text: "A structured scoring system for judging product candidates before you spend money on testing." },
  { title: "Content review rubric", text: "Score your own videos on hook, pacing, clarity, and call to action, then fix exactly what's weak." },
  { title: "Action plan templates", text: "Weekly planning templates that turn the process into a schedule you actually follow." },
  { title: "Private community", text: "A private group of serious VIP builders sharing real stores, real tests, and real feedback." },
  { title: "Priority support", text: "Your questions answered first, by email or in the community." },
  { title: "Lifetime updates", text: "Every future addition to the VIP material is included, free." },
];

const forWho = [
  { title: "You want the complete system", text: "The course teaches the process; VIP adds the audit tools and frameworks to execute it precisely." },
  { title: "You want to self-diagnose", text: "The audit systems show you what's wrong with a store, a product, or a video, without guessing." },
  { title: "You want structure", text: "Templates and weekly plans keep you moving instead of wondering what to do next." },
  { title: "You want to build with others", text: "The private community means you're not building in a vacuum." },
];

const steps = [
  { n: "1", title: "Purchase", text: "One payment, no subscription. Checkout takes a minute." },
  { n: "2", title: "Check your email", text: "Everything arrives at your purchase email within 24 hours, usually much faster: course, VIP materials, and your community invite." },
  { n: "3", title: "Build with the system", text: "Work through the modules, run the audits on your own store, and share your progress in the community." },
];

export default function VipPage() {
  return (
    <>
      {/* HERO: deliberately darker and more premium than the course page */}
      <section className="bg-ink">
        <Narrow className="py-16 text-center sm:py-28">
          <p className="mb-4 text-sm font-medium text-zinc-400">
            VIP Accelerator
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl text-balance">
            The Complete System.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            Everything in the course, plus the advanced guides, audit systems, and private
            community that turn a process into a machine.
          </p>
          <div className="mt-10">
            <span className="text-5xl font-semibold tracking-tight text-white">
              {formatUsd(site.mentorship.price)}
            </span>
            <p className="mt-2 text-sm text-zinc-500">One-time payment · Course included</p>
          </div>
          <div className="mt-8">
            <ButtonLink href="/checkout/mentorship" variant="inverse" size="lg" className="w-full sm:w-auto">
              Get VIP Access
            </ButtonLink>
          </div>
        </Narrow>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            title="Everything in VIP"
            description="One price, everything included, delivered straight to your email."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((i) => (
              <Card key={i.title} className="p-5">
                <h3 className="text-sm font-semibold text-ink">{i.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{i.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* WHO IT'S FOR */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading title="VIP is for people who…" />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {forWho.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="text-sm font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-lg text-center text-sm text-ink-soft">
            Just getting started? The{" "}
            <Link href="/course" className="font-medium text-accent hover:text-accent-strong">
              {formatUsd(site.course.price)} course
            </Link>{" "}
            covers the full process on its own. VIP is the upgrade when you want the advanced
            tooling around it.
          </p>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading title="From purchase to building" />
          <div className="mx-auto max-w-2xl">
            <ol className="space-y-0">
              {steps.map((s, idx) => (
                <li key={s.n} className="relative flex gap-5 pb-8 last:pb-0">
                  {idx < steps.length - 1 && (
                    <span
                      className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px bg-line"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-base font-bold tabular-nums text-accent">
                    {s.n}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-line bg-ink py-16 sm:py-24">
        <Narrow className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build with the complete system.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            {formatUsd(site.mentorship.price)}, one time. Everything included, delivered by email.
          </p>
          <div className="mt-8">
            <ButtonLink href="/checkout/mentorship" variant="inverse" size="lg" className="w-full sm:w-auto">
              Get VIP Access
            </ButtonLink>
          </div>
        </Narrow>
      </section>
    </>
  );
}
