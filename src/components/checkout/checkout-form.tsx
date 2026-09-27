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
  const [method, setMethod] = useState<"card" | "crypto">("card");
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
          method,
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
        <p className="text-sm font-medium text-ink">Payment method</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod("card")}
            aria-pressed={method === "card"}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              method === "card"
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface text-ink-soft hover:border-zinc-300 hover:text-ink"
            }`}
          >
            💳 Card
          </button>
          <button
            type="button"
            onClick={() => setMethod("crypto")}
            aria-pressed={method === "crypto"}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              method === "crypto"
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface text-ink-soft hover:border-zinc-300 hover:text-ink"
            }`}
          >
            ₮ Crypto (USDT)
          </button>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-ink-soft">
          {method === "card"
            ? "You'll be redirected to our payment provider's secure page. Card details are entered there, never on this site."
            : "You'll be redirected to a secure crypto invoice. Pay in USDT (or other supported coins); access is granted after blockchain confirmation, usually within minutes."}
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
