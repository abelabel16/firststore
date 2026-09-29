import type { Metadata } from "next";
import { Narrow } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about the course, the VIP Accelerator, payments, or delivery? Message Vibrant Flacon on Telegram.",
};

export default function ContactPage() {
  return (
    <section className="py-14 sm:py-20">
      <Narrow>
        <div className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-12">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Contact</h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-soft">
            Questions before buying, delivery, or refunds? Message Vibrant Flacon directly on
            Telegram.
          </p>
          <div className="mt-8">
            <ButtonLink href={site.telegramUrl} size="lg" target="_blank" rel="noopener noreferrer">
              Message on Telegram
            </ButtonLink>
          </div>
          <p className="mt-3 text-sm font-medium text-ink">{site.telegram}</p>
          <p className="mt-4 text-sm text-ink-faint">
            If you already bought, include the email you used at checkout.
          </p>
        </div>
      </Narrow>
    </section>
  );
}
