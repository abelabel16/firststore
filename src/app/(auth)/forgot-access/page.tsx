import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { site } from "@/config/site";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Recover access" };

export default function ForgotAccessPage() {
  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Recover your access</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        There are no passwords here, access is tied to your purchase email. Enter it below and
        we&rsquo;ll send a fresh login link.
      </p>
      <div className="mt-5">
        <LoginForm buttonLabel="Send New Login Link" />
      </div>
      <div className="mt-5 rounded-lg bg-paper p-3">
        <p className="text-xs leading-relaxed text-ink-soft">
          <strong className="text-ink">Lost access to that email?</strong>{" "}
          <Link href="/contact" className="underline hover:text-ink">
            Contact support
          </Link>{" "}
          or write to {site.supportEmail}, we&rsquo;ll verify your purchase and move your access.
        </p>
      </div>
    </Card>
  );
}
