import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, honest pricing: the $19 self-paced course or the $199 VIP Accelerator. One-time payments, no subscriptions, 14-day refund policy.",
};

const courseIncludes = [
  "Full 8-module course, 29 video lessons",
  "Checklists and templates",
  "Complete resource library",
  "Future updates included",
];

const vipIncludes = [
  "Everything in the course",
  "Advanced deep-dive guides",
  "Store & product audit systems",
  "Content review rubric",
  "Action plan templates",
  "Private community",
  "Priority support",
];

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

export default function PricingPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">Pricing</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Two products, one-time payments, no subscriptions. Both are delivered by email and
            covered by our{" "}
            <Link href="/refund-policy" className="font-medium text-accent hover:text-accent-strong">
              14-day refund policy
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Course */}
          <Card className="flex flex-col p-6 sm:p-8">
            <p className="text-sm font-medium text-ink-soft">
              {site.course.name}
            </p>
            <div className="mt-4">
              <Price
                amount={site.course.price}
                referencePrice={site.course.referencePrice}
                discountLabel={site.course.discountLabel}
              />
              <p className="mt-1 text-xs text-ink-faint">One-time payment. No subscription.</p>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              The complete process, self-paced: research, build, launch.
            </p>
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

          {/* VIP */}
          <div className="flex flex-col rounded-2xl bg-zinc-900 p-6 text-white shadow-md sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">
                {site.mentorship.name}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-semibold tracking-tight">
                {formatUsd(site.mentorship.price)}
              </span>
              <p className="mt-1 text-xs text-zinc-400">One-time payment. Course included.</p>
            </div>
            <p className="mt-4 text-sm text-zinc-300">
              The complete system: advanced guides, audits, templates, and community.
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {vipIncludes.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-100">
                  <CheckIcon dark />
                  {item}
                </li>
              ))}
            </ul>
            <ButtonLink href="/checkout/mentorship" variant="inverse" className="mt-8 w-full">
              Get VIP Access
            </ButtonLink>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed text-ink-soft">
          Both products are education about a real business process. Results are not guaranteed,
          see our{" "}
          <Link href="/disclaimer" className="font-medium text-accent hover:text-accent-strong">
            disclaimer
          </Link>
          . Questions before buying?{" "}
          <Link href="/contact" className="font-medium text-accent hover:text-accent-strong">
            Contact us
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
