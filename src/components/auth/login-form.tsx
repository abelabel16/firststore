"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function LoginForm({ buttonLabel = "Send Login Link" }: { buttonLabel?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!supabaseConfigured) {
      setError("Login isn't available yet, the site's backend is not connected.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { error: authError } = await getSupabase().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${basePath}/welcome/`,
        },
      });
      if (authError) throw authError;
      router.push(`/verify-email/?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Couldn't send the login link. Please try again in a moment.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Email" htmlFor="email" error={error ?? undefined}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          autoFocus
        />
      </Field>
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Sending…" : buttonLabel}
      </Button>
    </form>
  );
}
