"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export function OnboardingForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    const required = ["hasStore", "selling", "stage", "strugglingWith", "goal", "biggestProblem"];
    if (required.some((f) => !data[f]?.trim())) {
      setError("Please answer every question — it all helps your mentor help you.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/vip/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      router.push("/vip");
      router.refresh();
    } catch {
      setError("Something went wrong saving your answers. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">About you</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="name">
            <Input id="name" name="name" defaultValue={defaultName} autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor="email" hint="Your access email (read-only).">
            <Input id="email" name="email" defaultValue={defaultEmail} readOnly className="bg-paper" />
          </Field>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
          Your business
        </p>
        <Field label="Do you already have a store?" htmlFor="hasStore">
          <Select id="hasStore" name="hasStore" defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            <option>No, starting from zero</option>
            <option>Yes, but not launched yet</option>
            <option>Yes, launched with no consistent sales</option>
            <option>Yes, launched with some sales</option>
          </Select>
        </Field>
        <Field label="What are you selling (or planning to sell)?" htmlFor="selling">
          <Input id="selling" name="selling" placeholder="e.g. home fitness accessories, or “not sure yet”" />
        </Field>
        <Field label="What stage are you at?" htmlFor="stage">
          <Textarea id="stage" name="stage" placeholder="Where you are right now — research, building, testing…" />
        </Field>
        <Field label="What are you struggling with?" htmlFor="strugglingWith">
          <Textarea id="strugglingWith" name="strugglingWith" placeholder="Be specific — this is where mentorship focuses first." />
        </Field>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Your goals</p>
        <Field label="What are you trying to accomplish?" htmlFor="goal">
          <Textarea id="goal" name="goal" placeholder="What does progress look like for you in the next 1–3 months?" />
        </Field>
        <Field label="What is your biggest current problem?" htmlFor="biggestProblem">
          <Textarea id="biggestProblem" name="biggestProblem" placeholder="The one thing that, if solved, would unblock you." />
        </Field>
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Saving…" : "Complete Onboarding"}
      </Button>
    </form>
  );
}
