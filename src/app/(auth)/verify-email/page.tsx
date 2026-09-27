import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Check your email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <Card className="p-6 text-center sm:p-8">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft" aria-hidden="true">
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <rect x="1" y="1" width="18" height="14" rx="2" stroke="#4f46e5" strokeWidth="1.5" />
          <path d="M1.5 2.5L10 9l8.5-6.5" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink">Check your email</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        If {email ? <strong className="text-ink">{email}</strong> : "your email"} has an account,
        a login link is on its way. It expires in 30 minutes.
      </p>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Nothing arriving? Check spam, or{" "}
        <Link href="/login" className="underline hover:text-ink-soft">
          request a new link
        </Link>
        .
      </p>
    </Card>
  );
}
