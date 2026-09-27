"use client";

import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";

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
        Your payment is confirmed. Log in with your purchase email
        {email ? (
          <>
            {" "}
            (<strong className="text-ink">{email}</strong>)
          </>
        ) : null}{" "}
        and we&rsquo;ll send you an access link.
      </p>
      <div className="mt-7">
        <ButtonLink href="/login/" size="lg" className="w-full">
          {isCourse ? "Open My Course" : "Start Onboarding"}
        </ButtonLink>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        No password needed — we email you a login link. Your access is active immediately.
      </p>
    </>
  );
}
