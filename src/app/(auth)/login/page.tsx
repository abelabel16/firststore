import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

const errorMessages: Record<string, string> = {
  expired: "That login link has expired or was already used. Request a new one below.",
  "no-account":
    "We couldn't find a purchase under that email. Use the exact email from your checkout, or contact support.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Log in</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Enter the email you purchased with. We&rsquo;ll send you a login link — no password
        needed.
      </p>
      {errorMessage && (
        <p className="mt-4 rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="mt-5">
        <LoginForm />
      </div>
      <p className="mt-5 text-center text-xs text-ink-faint">
        Haven&rsquo;t purchased yet?{" "}
        <Link href="/course" className="font-medium text-accent hover:text-accent-strong">
          See the course
        </Link>
      </p>
    </Card>
  );
}
