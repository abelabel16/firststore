import type { Metadata } from "next";
import { Narrow } from "@/components/ui/container";
import { site } from "@/config/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about the course, the VIP Accelerator, payments, or access? Get in touch.",
};

export default function ContactPage() {
  return (
    <section className="py-14 sm:py-20">
      <Narrow>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Contact us
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-ink-soft">
            Questions before buying, access issues, refunds, we answer everything.
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Support email:{" "}
            <a
              href={`mailto:${site.supportEmail}`}
              className="font-medium text-accent hover:text-accent-strong"
            >
              {site.supportEmail}
            </a>{" "}
            · Telegram:{" "}
            <a
              href={site.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:text-accent-strong"
            >
              {site.telegram}
            </a>
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <ContactForm />
        </div>
      </Narrow>
    </section>
  );
}
