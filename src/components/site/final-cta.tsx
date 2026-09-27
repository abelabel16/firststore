import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatUsd, site } from "@/config/site";

export function FinalCta() {
  return (
    <section className="border-t border-line bg-ink">
      <Container className="py-16 text-center sm:py-24">
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
          Ready to build your first store?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
          One-time payment. Permanent access. A real process you can follow.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink
            href="/checkout/course"
            size="lg"
            className="w-full bg-white text-ink hover:bg-zinc-200 sm:w-auto"
          >
            Start Learning for {formatUsd(site.course.price)}
          </ButtonLink>
          <ButtonLink
            href="/mentorship"
            size="lg"
            className="w-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 sm:w-auto"
          >
            Explore VIP Mentorship
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
