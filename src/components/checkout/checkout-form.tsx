"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { functionsUrl, supabaseConfigured } from "@/lib/supabase";
import { formatUsd, site } from "@/config/site";

/**
 * Minimal checkout: name + email. The "create-checkout" Supabase Edge
 * Function records the order and returns the payment provider's hosted
 * checkout URL; we redirect there. Card details never touch this site.
 */
export function CheckoutForm({ product }: { product: "course" | "vip"; cta?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const payAmount = product === "course" ? site.course.price : site.mentorship.price;
  const ctaLabel =
    product === "vip" ? `Get VIP Access · ${formatUsd(payAmount)}` : `Pay ${formatUsd(payAmount)}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    // Phone keyboards often append a space after an autocompleted email.
    data.email = (data.email ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (!data.name?.trim()) nextErrors.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) nextErrors.email = "Please enter a valid email.";
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
          method: "card",
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

      {serverError && (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Preparing secure payment…" : ctaLabel}
      </Button>
      <p className="text-center text-xs leading-relaxed text-ink-faint">
        💳 You&rsquo;ll pay by card on a secure checkout run by Whop. Your card details never
        touch this site.
      </p>
    </form>
  );
}
