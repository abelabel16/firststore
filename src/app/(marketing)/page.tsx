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
    text: "29 focused lessons across 8 modules — most under 15 minutes, built to be applied immediately.",
  },
  {
    title: "Checklists",
    text: "Product research, store launch, supplier vetting, and pre-launch checklists you'll actually reuse.",
  },
  {
    title: "Templates",
    text: "Margin calculators, content shot lists, and store page structures — fill in, don't start from zero.",
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
    text: "Apply each module to your own store as you go — research real products, build real pages, make real content.",
  },
  {
    n: "3",
    title: "Test & improve",
    text: "Launch, look at real data, and iterate. You're learning a process for making good decisions — not buying a guaranteed outcome.",
  },
];

const mentorshipPoints = [
  { title: "Store review", text: "A structured audit of your store — layout, copy, trust, and checkout." },
  { title: "Product review", text: "Direct feedback on your product choices before you spend on testing." },
  { title: "Content feedback", text: "Your videos reviewed against a clear rubric: hook, pacing, clarity, CTA." },
  { title: "Action plan", text: "A personalized, written plan after every session — you always know the next step." },
  { title: "Private group", text: "A small community of active clients sharing real work and real feedback." },
  { title: "Session planning", text: "Prep before each 1-to-1 call so the time goes to your hardest problems." },
];

/* ── Hero visual: a hand-drawn illustration of the course dashboard.
     Pure UI mockup, labeled as such — never presented as earnings. ── */
function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-lg select-none">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-xs font-bold tracking-tight">
            {site.name.toLowerCase()}
            <span className="text-accent">.</span>
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-ink-soft">
            Course preview
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-ink-soft">
              <span className="font-medium text-ink">Module 2 · Product Research</span>
              <span>38% complete</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-[38%] rounded-full bg-accent" />
            </div>
          </div>
          {[
            { t: "Where product ideas come from", done: true },
            { t: "Reading demand signals", done: true },
            { t: "Evaluating the competition", done: false },
            { t: "The product scoring checklist", done: false },
          ].map((l) => (
            <div
              key={l.t}
              className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                  l.done ? "bg-good text-white" : "border border-line text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={`text-xs ${l.done ? "text-ink-faint line-through" : "text-ink"}`}>
                {l.t}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="absolute -bottom-6 -right-2 hidden w-44 p-3 sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
          Product score
        </p>
        <p className="mt-1 text-lg font-semibold text-ink">7.5 / 10</p>
        <p className="mt-0.5 text-[10px] leading-snug text-ink-soft">
          Demand ✓ · Margin ✓ · Competition high
        </p>
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
              fundamentals of running a real online store — step by step, without the hype.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/checkout/course" size="lg" className="w-full sm:w-auto">
                Start Learning — {formatUsd(site.course.price)}
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

            {/* VIP card */}
            <Card className="flex flex-col border-ink bg-ink p-6 text-white sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  VIP Mentorship
                </p>
                <Badge className="bg-zinc-800 text-zinc-300">Premium</Badge>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold tracking-tight">
                  {formatUsd(site.mentorship.price)}
                </span>
                <p className="mt-1 text-xs text-zinc-500">One-time payment. Course included.</p>
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
              <ButtonLink
                href="/mentorship"
                className="mt-8 w-full bg-white text-ink hover:bg-zinc-200"
              >
                Explore Mentorship
              </ButtonLink>
            </Card>
          </div>
        </Container>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Curriculum"
            title="What you'll learn"
            description="Eight modules covering the complete process — from understanding the model to operating a launched store."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-zinc-300"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-semibold text-accent">{m.number}</span>
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
            description="Tangible materials — no “secret methods”, no vague promises. This is what's inside."
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
            description="You're learning how to research, build, and test — the outcome depends on your execution, and that's the honest truth."
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center sm:text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold text-accent-strong">
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* COURSE PREVIEW */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Inside the platform"
            title="A clean place to learn"
            description="Your dashboard tracks progress through every module. Lessons, resources, and checklists in one place — built mobile-first."
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            <PreviewPanel
              label="Course dashboard"
              lines={["Welcome back 👋", "Continue: Module 3 · Store Setup", "31% complete"]}
              bars={[100, 100, 31, 0]}
            />
            <PreviewPanel
              label="Lesson player"
              lines={["Reading demand signals", "14 min · Module 2", "Resources attached"]}
              video
            />
            <PreviewPanel
              label="Curriculum"
              lines={["01 Foundations ✓", "02 Product Research ▶", "03 Store Setup", "04 Suppliers"]}
            />
            <PreviewPanel
              label="Resource library"
              lines={["Product Research Checklist", "Store Launch Checklist", "Content Angle Framework"]}
            />
          </div>
          <p className="mt-6 text-center text-xs text-ink-faint">
            Interface previews of the actual course platform.
          </p>
        </Container>
      </section>

      {/* MENTORSHIP PREVIEW */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="VIP Mentorship"
            title="Learning alone vs. building with support"
            description="The course teaches the process. Mentorship applies it to your store — with someone experienced reviewing your actual decisions."
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
          <SectionHeading
            eyebrow="FAQ"
            title="Honest answers to real questions"
          />
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
        dark ? "bg-zinc-800 text-good" : "bg-good-soft text-good"
      }`}
      aria-hidden="true"
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
        <path d="M1.5 5.5l2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PreviewPanel({
  label,
  lines,
  bars,
  video,
}: {
  label: string;
  lines: string[];
  bars?: number[];
  video?: boolean;
}) {
  return (
    <Card aria-hidden="true" className="select-none overflow-hidden">
      <div className="border-b border-line px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      </div>
      <div className="space-y-2.5 p-4">
        {video && (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="white" aria-hidden="true">
                <path d="M0 0l12 7-12 7z" />
              </svg>
            </span>
          </div>
        )}
        {lines.map((line) => (
          <p key={line} className="text-xs text-ink-soft first:font-medium first:text-ink">
            {line}
          </p>
        ))}
        {bars && (
          <div className="flex gap-1.5 pt-1">
            {bars.map((b, i) => (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-accent" style={{ width: `${b}%` }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
