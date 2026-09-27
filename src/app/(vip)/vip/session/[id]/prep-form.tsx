"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

export function PrepForm({
  sessionId,
  prep,
}: {
  sessionId: string;
  prep: { storeUrl: string; productUrl: string; questions: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/vip/session-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...data }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      router.refresh();
    } catch {
      setError("Couldn't save your preparation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Store URL" htmlFor="storeUrl" hint="So your mentor can review before the call.">
        <Input id="storeUrl" name="storeUrl" type="url" defaultValue={prep.storeUrl} placeholder="https://your-store.com" />
      </Field>
      <Field label="Product URL" htmlFor="productUrl">
        <Input id="productUrl" name="productUrl" type="url" defaultValue={prep.productUrl} placeholder="https://your-store.com/products/…" />
      </Field>
      <Field label="Questions" htmlFor="questions" hint="What do you want out of this session?">
        <Textarea id="questions" name="questions" defaultValue={prep.questions} placeholder="The more specific, the better." />
      </Field>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Preparation"}
        </Button>
        {saved && <span className="text-sm text-good">Saved ✓</span>}
      </div>
    </form>
  );
}
