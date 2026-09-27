"use client";

import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";

export function SuccessContent() {
  const params = useSearchParams();
  const isCourse = params.get("product") !== "vip";
  const email = params.get("email");

  return (
    <>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
        {isCourse ? "You’re in. 🎉" : "Welcome to VIP. 🤝"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Your payment is confirmed.{" "}
        {isCourse ? "Your course will be sent to" : "Your onboarding will be sent to"}{" "}
        {email ? <strong className="text-ink">{email}</strong> : "your email"}{" "}
        <strong className="text-ink">within 24 hours</strong>, and usually much faster.
      </p>
      <div className="mt-5 rounded-xl bg-paper p-4 text-left">
        <p className="text-sm font-medium text-ink">Didn&rsquo;t receive it?</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Check your spam folder first. Still nothing after 24 hours? Message us on Telegram at{" "}
          <a
            href={site.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:text-accent-strong"
          >
            {site.telegram}
          </a>{" "}
          or email {site.supportEmail} and we&rsquo;ll fix it right away.
        </p>
      </div>
      <div className="mt-6">
        <ButtonLink href="/" size="lg" className="w-full">
          Back to Home
        </ButtonLink>
      </div>
    </>
  );
}
