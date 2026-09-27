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
        {isCourse
          ? "Your payment is confirmed. Everything you bought is on its way to"
          : "Your payment is confirmed. Your onboarding instructions are on their way to"}{" "}
        {email ? <strong className="text-ink">{email}</strong> : "your email"}. Check your inbox,
        and the spam folder if it hasn&rsquo;t arrived within a few minutes.
      </p>
      <div className="mt-7">
        <ButtonLink href="/" size="lg" className="w-full">
          Back to Home
        </ButtonLink>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Nothing after 10 minutes? Write to {site.supportEmail} from your purchase email and we
        will resend it right away.
      </p>
    </>
  );
}
