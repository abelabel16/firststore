import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Narrow } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FinalCta } from "@/components/site/final-cta";
import { homeFaq } from "@/content/faq";
import { modules } from "@/content/course";
import { formatUsd, site } from "@/config/site";

const courseIncludes = [
  "Full 8-module course",
  "Templates",
  "Checklists",
  "Resources",
  "Future updates",
];

const vipIncludes = [
  "1-to-1 support",
  "Store reviews",
  "Product reviews",
  "Content feedback",
  "Personalized action plans",
  "Private group",
  "Progress support",
];

const deliverables = [
  {
    title: "Video lessons",
    text: "29 focused lessons across 8 modules. Most are under 15 minutes and built to be applied immediately.",
  },
  {
    title: "Checklists",
    text: "Product research, store launch, supplier vetting, and pre-launch checklists you'll actually reuse.",
  },
  {
    title: "Templates",
    text: "Margin calculators, content shot lists, and store page structures. Fill in, don't start from zero.",
  },
  {
    title: "Frameworks",
    text: "Decision frameworks for scoring products, reading data, and deciding to push, pivot, or drop.",
  },
  {
    title: "Resources",
    text: "A curated tool list with free alternatives, plus everything referenced in the lessons.",
  },
  {
    title: "Course updates",
    text: "Platforms change. When the course is updated, you get the new material at no extra cost.",
  },
];

const steps = [
  {
    n: "1",
    title: "Learn",
    text: "Work through the modules in order. Each one teaches a specific part of the process, from research to launch.",
  },
  {
    n: "2",
    title: "Build",
    text: "Apply each module to your own store as you go. Research real products, build real pages, make real content.",
  },
  {
    n: "3",
    title: "Test & improve",
    text: "Launch, look at real data, and iterate. You're learning a process for making good decisions, not buying a guaranteed outcome.",
  },
];

const mentorshipPoints = [
  { title: "Store review", text: "A structured audit of your store: layout, copy, trust, and checkout." },
  { title: "Product review", text: "Direct feedback on your product choices before you spend on testing." },
  { title: "Content feedback", text: "Your videos reviewed against a clear rubric: hook, pacing, clarity, CTA." },
  { title: "Action plan", text: "A personalized, written plan after every session. You always know the next step." },
  { title: "Private group", text: "A small community of active clients sharing real work and real feedback." },
  { title: "Session planning", text: "Prep before each 1-to-1 call so the time goes to your hardest problems." },
];

/* ── Hero visual: an illustration of the course experience.
     Pure UI mockup, labeled as such. Never presented as earnings. ── */
function HeroVisual() {
  const lessons = [
    { t: "Where product ideas come from", done: true },
    { t: "Reading demand signals", done: true },
    { t: "Evaluating the competition", done: false },
    { t: "The product scoring checklist", done: false },
  ];
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-lg select-none">
      <Card className="overflow-hidden shadow-lg shadow-zinc-200/60">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="text-sm font-bold tracking-tight">
            {site.name.toLowerCase()}
            <span className="text-accent">.</span>
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-strong">
            Course preview
          </span>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Module 2 · Product Research</span>
              <span className="text-sm font-semibold tabular-nums text-accent">38%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-[38%] rounded-full bg-accent" />
            </div>
          </div>
          {lessons.map((l) => (
            <div
              key={l.t}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  l.done ? "bg-good text-white" : "border-2 border-zinc-200"
                }`}
              >
                {l.done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5.5l2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`text-sm font-medium ${l.done ? "text-ink-soft" : "text-ink"}`}>
                {l.t}
              </span>
              {l.done && <span className="ml-auto text-xs font-medium text-good">Done</span>}
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3.5 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Product score
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">Demand ✓ · Margin ✓ · Competition high</p>
            </div>
            <p className="text-2xl font-bold tabular-nums">7.5<span className="text-base font-medium text-zinc-400">/10</span></p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="overflow-hidden border-b border-line bg-surface">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div className="max-w-xl">
            <Badge tone="accent" className="mb-5">
              Practical dropshipping education
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl text-balance">
              Build Your First Dropshipping Store.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              Learn how to research products, build a store, create content, and understand the
              fundamentals of running a real online store. Step by step, without the hype.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/checkout/course" size="lg" className="w-full sm:w-auto">
                Start Learning for {formatUsd(site.course.price)}
              </ButtonLink>
              <ButtonLink href="/mentorship" variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore VIP Mentorship
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-faint">
              Learn the process. Test your ideas. Make decisions using real data.
            </p>
          </div>
          <HeroVisual />
        </Container>
      </section>

      {/* TWO WAYS TO LEARN */}
      <section id="pricing" className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Two ways to learn"
            title="Choose how you want to build"
            description="Self-paced if you learn well alone. Mentorship if you want direct feedback on your actual store."
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Course card */}
            <Card className="flex flex-col p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
                Course
              </p>
              <div className="mt-4">
                <Price
                  amount={site.course.price}
                  referencePrice={site.course.referencePrice}
                  discountLabel={site.course.discountLabel}
                />
                <p className="mt-1 text-xs text-ink-faint">One-time payment. No subscription.</p>
              </div>
              <p className="mt-4 text-sm text-ink-soft">Learn the system at your own pace.</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {courseIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-ink">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/checkout/course" className="mt-8 w-full">
                Get the Course
              </ButtonLink>
            </Card>

            {/* VIP card: intentionally a plain dark panel, NOT <Card>, so its
                background can never be overridden by the Card base styles. */}
            <div className="flex flex-col rounded-2xl bg-zinc-900 p-6 text-white shadow-md sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  VIP Mentorship
                </p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  Premium
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold tracking-tight">
                  {formatUsd(site.mentorship.price)}
                </span>
                <p className="mt-1 text-xs text-zinc-400">One-time payment. Course included.</p>
              </div>
              <p className="mt-4 text-sm text-zinc-300">
                Personal guidance, direct feedback, and private support.
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {vipIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-100">
                    <CheckIcon dark />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/mentorship" variant="inverse" className="mt-8 w-full">
                Explore Mentorship
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Curriculum"
            title="What you'll learn"
            description="Eight modules covering the complete process, from understanding the model to operating a launched store."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-zinc-300"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-bold tabular-nums text-accent">{m.number}</span>
                  <h3 className="text-base font-semibold text-ink">{m.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.summary}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/course" className="text-sm font-medium text-accent hover:text-accent-strong">
              See the full curriculum →
            </Link>
          </p>
        </Container>
      </section>

      {/* WHAT YOU ACTUALLY GET */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Deliverables"
            title="What you actually get"
            description="Tangible materials. No “secret methods”, no vague promises. This is what's inside."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((d) => (
              <Card key={d.title} className="p-5">
                <h3 className="text-sm font-semibold text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="A process, not a promise"
            description="You're learning how to research, build, and test. The outcome depends on your execution, and that's the honest truth."
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center sm:text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-base font-bold tabular-nums text-accent-strong">
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* INSIDE THE COURSE */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Inside the course"
            title="What lands in your inbox"
            description="Buy once and everything arrives by email: video lessons, checklists, templates, and the full curriculum. No account or password needed."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {/* Video lesson */}
            <Card aria-hidden="true" className="select-none overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-zinc-900">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                  <svg width="14" height="16" viewBox="0 0 12 14" fill="white" aria-hidden="true">
                    <path d="M0 0l12 7-12 7z" />
                  </svg>
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-ink">Reading demand signals</p>
                <p className="mt-0.5 text-xs text-ink-soft">Video lesson · 14 min · Module 2</p>
              </div>
            </Card>

            {/* Checklist */}
            <Card aria-hidden="true" className="select-none p-4">
              <p className="text-sm font-semibold text-ink">Store Launch Checklist</p>
              <p className="mt-0.5 text-xs text-ink-soft">Included template</p>
              <ul className="mt-3 space-y-2">
                {[
                  { t: "Product page answers all customer questions", done: true },
                  { t: "Shipping times stated honestly", done: true },
                  { t: "Policies and contact page complete", done: true },
                  { t: "Checkout tested on mobile", done: false },
                  { t: "Analytics connected", done: false },
                ].map((i) => (
                  <li key={i.t} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded ${
                        i.done ? "bg-good text-white" : "border-2 border-zinc-200"
                      }`}
                    >
                      {i.done && (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5.5l2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={i.done ? "text-ink-soft" : "text-ink"}>{i.t}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Curriculum */}
            <Card aria-hidden="true" className="select-none p-4">
              <p className="text-sm font-semibold text-ink">Full curriculum</p>
              <p className="mt-0.5 text-xs text-ink-soft">8 modules · 29 lessons</p>
              <ul className="mt-3 space-y-1.5">
                {modules.slice(0, 5).map((m) => (
                  <li key={m.id} className="flex items-center gap-3 text-sm">
                    <span className="w-6 text-xs font-bold tabular-nums text-accent">{m.number}</span>
                    <span className="text-ink">{m.title}</span>
                  </li>
                ))}
                <li className="pl-9 text-xs text-ink-faint">+ 3 more modules</li>
              </ul>
            </Card>

            {/* Framework */}
            <Card aria-hidden="true" className="select-none p-4">
              <p className="text-sm font-semibold text-ink">Product scoring framework</p>
              <p className="mt-0.5 text-xs text-ink-soft">Score every idea the same way</p>
              <div className="mt-3 space-y-2.5">
                {[
                  { label: "Demand", value: 80 },
                  { label: "Margin", value: 70 },
                  { label: "Competition", value: 45 },
                  { label: "Content potential", value: 85 },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">{r.label}</span>
                      <span className="font-semibold tabular-nums text-ink-soft">{r.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${r.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <p className="mt-6 text-center text-xs text-ink-faint">
            Illustrations of the course materials.
          </p>
        </Container>
      </section>

      {/* MENTORSHIP PREVIEW */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="VIP Mentorship"
            title="Learning alone vs. building with support"
            description="The course teaches the process. Mentorship applies it to your store, with someone experienced reviewing your actual decisions."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentorshipPoints.map((p) => (
              <Card key={p.title} className="p-5">
                <h3 className="text-sm font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/mentorship" variant="secondary" size="lg">
              Explore VIP Mentorship
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Narrow>
          <SectionHeading eyebrow="FAQ" title="Honest answers to real questions" />
          <FaqAccordion items={homeFaq} />
          <p className="mt-6 text-center text-sm text-ink-soft">
            More questions?{" "}
            <Link href="/faq" className="font-medium text-accent hover:text-accent-strong">
              Read the full FAQ
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="font-medium text-accent hover:text-accent-strong">
              contact us
            </Link>
            .
          </p>
        </Narrow>
      </section>

      <FinalCta />
    </>
  );
}

function CheckIcon({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
        dark ? "bg-white/10 text-emerald-400" : "bg-good-soft text-good"
      }`}
      aria-hidden="true"
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
        <path d="M1.5 5.5l2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
