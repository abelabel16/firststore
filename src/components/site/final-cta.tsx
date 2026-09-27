import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatUsd, site } from "@/config/site";

export function FinalCta() {
  return (
    <section className="border-t border-line bg-zinc-900">
      <Container className="py-16 text-center sm:py-24">
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
          Ready to build your first store?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
          One payment. Everything delivered to your email. A real process you can follow.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/checkout/course" variant="inverse" size="lg" className="w-full sm:w-auto">
            Start Learning for {formatUsd(site.course.price)}
          </ButtonLink>
          <ButtonLink href="/mentorship" variant="outlineDark" size="lg" className="w-full sm:w-auto">
            Explore VIP Mentorship
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
