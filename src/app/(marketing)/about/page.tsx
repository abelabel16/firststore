import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Narrow } from "@/components/ui/container";
import { CreatorIntro } from "@/components/site/creator-intro";
import { CurriculumList } from "@/components/site/curriculum-list";
import { creator } from "@/content/creator";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Vibrant Flacon, creator of The Dropshipping Course.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <Narrow className="py-14 sm:py-20">
          <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Meet {creator.name}
          </h1>
          <div className="mt-8">
            <CreatorIntro variant="full" />
          </div>
        </Narrow>
      </section>

      <section className="py-14 sm:py-20">
        <Narrow>
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            What I teach
          </h2>
          <div className="mx-auto mt-6 max-w-2xl">
            <CurriculumList compact />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/course" size="lg" className="w-full sm:w-auto">
                See the course, {formatUsd(site.course.price)}
              </ButtonLink>
              <p className="text-sm text-ink-soft">
                Questions? Message{" "}
                <a
                  href={site.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:text-accent-strong"
                >
                  {site.telegram}
                </a>{" "}
                on Telegram.
              </p>
            </div>
          </div>
        </Narrow>
      </section>
    </>
  );
}
