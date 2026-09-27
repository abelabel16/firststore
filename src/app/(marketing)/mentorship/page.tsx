import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Narrow } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "VIP Mentorship",
  description:
    "1-to-1 dropshipping mentorship: store reviews, product reviews, content feedback, personalized action plans, and a private community. Course included.",
};

const included = [
  { title: "1-to-1 mentorship", text: "Private sessions focused entirely on your store and your decisions." },
  { title: "Store reviews", text: "Structured audits of your store, layout, copy, trust elements, checkout." },
  { title: "Product reviews", text: "Feedback on product candidates before you spend money testing them." },
  { title: "Content feedback", text: "Your short-form videos reviewed against a clear rubric." },
  { title: "Personalized action plans", text: "A written plan after every session so the next step is always clear." },
  { title: "Direct support", text: "Ask questions between sessions and get real answers, not canned replies." },
  { title: "Private community", text: "A small group of active clients sharing real work and feedback." },
  { title: "Progress check-ins", text: "Regular check-ins so you stay accountable to your own plan." },
  { title: "Full course access", text: "The complete $19 course is included with mentorship." },
];

const forWho = [
  { title: "You want direct feedback", text: "You'd rather have an experienced eye on your actual store than guess what's wrong." },
  { title: "You're stuck on a specific problem", text: "Product choice, weak conversion, content that doesn't land, targeted help beats generic advice." },
  { title: "You want structured accountability", text: "A written plan and someone checking in on it keeps you moving." },
  { title: "You prefer personalized guidance", text: "Courses teach the general case. Mentorship deals with your case." },
];

const steps = [
  { n: "1", title: "Purchase", text: "Complete checkout. You'll receive onboarding instructions by email immediately." },
  { n: "2", title: "Complete onboarding", text: "A short questionnaire about your store, your stage, and what you're stuck on." },
  { n: "3", title: "Join the private community", text: "Get access to the private group of active mentorship clients." },
  { n: "4", title: "Book your session", text: "Pick a time that works for you and add your prep, store URL, product, questions." },
  { n: "5", title: "Get your action plan", text: "After the session you receive a written, personalized plan." },
  { n: "6", title: "Continue with support", text: "Work the plan with direct support, feedback, and progress check-ins." },
];

export default function MentorshipPage() {
  return (
    <>
      {/* HERO, deliberately darker/more premium than the course page */}
      <section className="bg-ink">
        <Narrow className="py-16 text-center sm:py-28">
          <Badge className="mb-5 bg-zinc-800 text-zinc-300">VIP Mentorship</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl text-balance">
            Don&rsquo;t Figure It Out Alone.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            Get direct guidance, feedback, and structured support while you build.
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
          {site.mentorship.capacityNote && (
            <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-zinc-500">
              {site.mentorship.capacityNote}
            </p>
          )}
        </Narrow>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What's included"
            title="Everything in VIP"
            description="One price, one tier, everything included. No upsells inside."
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
          <SectionHeading
            eyebrow="Who it's for"
            title="Mentorship is for people who…"
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {forWho.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="text-sm font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-lg text-center text-sm text-ink-soft">
            If you learn well on your own, the{" "}
            <Link href="/course" className="font-medium text-accent hover:text-accent-strong">
              {formatUsd(site.course.price)} course
            </Link>{" "}
            may be all you need, mentorship is for when you want a second pair of eyes on your
            actual work.
          </p>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="How it works" title="From purchase to progress" />
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
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold text-accent">
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
            Build with someone in your corner.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            {formatUsd(site.mentorship.price)}, one time. Everything included.
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
