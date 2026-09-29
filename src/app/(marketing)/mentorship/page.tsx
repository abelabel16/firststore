import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Narrow } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { faqByIds } from "@/content/faq";
import { vipDetails } from "@/content/offer";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "VIP Accelerator",
  description:
    "The full dropshipping course plus deep-dive guides, store and product audit systems, templates, a private Telegram chat, and priority support. One-time payment.",
};

const steps = [
  { n: "1", title: "Pay once", text: "A secure card checkout run by Whop. No subscription." },
  { n: "2", title: "Get the course", text: "The full course arrives at your purchase email within 24 hours." },
  {
    n: "3",
    title: "Join the VIP chat",
    text: `Message ${site.telegram} on Telegram with your purchase email. You'll be added to the private VIP chat, where the VIP materials are shared.`,
  },
];

const vipFaq = faqByIds("vip-what", "vip-delivery", "vip-vs-course");

export default function VipPage() {
  return (
    <>
      {/* HERO: darker and more premium than the course page */}
      <section className="bg-ink">
        <Narrow className="py-16 text-center sm:py-24">
          <p className="mb-4 text-sm font-medium text-zinc-400">{site.mentorship.name}</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl text-balance">
            The complete system.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            Everything in the course, plus audit systems, templates, deeper guides, and a private
            Telegram chat with Vibrant Flacon.
          </p>
          <div className="mt-8">
            <span className="text-4xl font-semibold tracking-tight text-white">
              {formatUsd(site.mentorship.price)}
            </span>
            <p className="mt-1 text-sm text-zinc-500">One-time payment. Course included.</p>
          </div>
          <div className="mt-8">
            <ButtonLink href="/checkout/mentorship" variant="inverse" size="lg" className="w-full sm:w-auto">
              Get VIP access
            </ButtonLink>
          </div>
        </Narrow>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading title="Everything in VIP" />
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vipDetails.map((item) => (
              <Card key={item.title} className="p-5">
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-soft">
            Just getting started?{" "}
            <Link href="/course" className="font-medium text-accent hover:text-accent-strong">
              The {formatUsd(site.course.price)} course
            </Link>{" "}
            has every step on its own.
          </p>
        </Container>
      </section>

      {/* HOW YOU GET IT */}
      <section className="border-t border-line bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading title="How you get it" />
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-bold tabular-nums text-accent-strong">
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <Narrow>
          <SectionHeading title="Common questions" />
          <FaqAccordion items={vipFaq} />
        </Narrow>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-line bg-ink py-16 sm:py-24">
        <Narrow className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build with the complete system.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
            {formatUsd(site.mentorship.price)}, one time. Course included.
          </p>
          <div className="mt-8">
            <ButtonLink href="/checkout/mentorship" variant="inverse" size="lg" className="w-full sm:w-auto">
              Get VIP access
            </ButtonLink>
          </div>
        </Narrow>
      </section>
    </>
  );
}
