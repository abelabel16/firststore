import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Log in</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Enter the email you purchased with. We&rsquo;ll send you a login link — no password
        needed.
      </p>
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
