"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { functionsUrl, supabaseConfigured } from "@/lib/supabase";

/**
 * Minimal checkout: name + email. The "create-checkout" Supabase Edge
 * Function records the order and returns the payment provider's hosted
 * checkout URL; we redirect there. Card details never touch this site.
 */
export function CheckoutForm({ product, cta }: { product: "course" | "vip"; cta: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name?.trim()) nextErrors.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) nextErrors.email = "Please enter a valid email.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!supabaseConfigured) {
      setServerError("Checkout isn't live yet, the site's backend is not connected.");
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(functionsUrl("create-checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          product,
          name: data.name,
          email: data.email,
          returnOrigin: window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? ""),
        }),
      });
      const json = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !json.checkoutUrl) {
        throw new Error(json.error ?? "Could not start checkout.");
      }
      window.location.href = json.checkoutUrl;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not start checkout.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Full Name" htmlFor="name" error={errors.name}>
        <Input id="name" name="name" autoComplete="name" placeholder="Your full name" />
      </Field>
      <Field
        label="Email"
        htmlFor="email"
        error={errors.email}
        hint="Your access is delivered to this email, double-check it."
      >
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>

      <div className="rounded-xl border border-line bg-paper p-4">
        <p className="text-sm font-medium text-ink">Payment</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          You&rsquo;ll be redirected to our payment provider&rsquo;s secure page to complete the
          payment. Card and mobile-money details are entered there, never on this site.
        </p>
      </div>

      {serverError && (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Preparing secure payment…" : cta}
      </Button>
    </form>
  );
}
