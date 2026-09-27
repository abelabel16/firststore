"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { getSupabase } from "@/lib/supabase";

export function SupportForm({
  email,
  name,
  onSent,
}: {
  email: string;
  name: string;
  onSent: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.subject?.trim() || !data.message?.trim()) {
      setError("Please add a subject and your question.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: dbError } = await getSupabase().from("tickets").insert({
      email,
      name,
      source: "vip",
      subject: data.subject.trim(),
      message: data.message.trim(),
      store_url: data.storeUrl?.trim() || null,
      product_url: data.productUrl?.trim() || null,
    });
    setSubmitting(false);
    if (dbError) {
      setError("Couldn't send your question. Please try again.");
      return;
    }
    setSent(true);
    form.reset();
    onSent();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Subject" htmlFor="subject">
        <Input id="subject" name="subject" placeholder="e.g. Feedback on my product page" />
      </Field>
      <Field label="Question" htmlFor="message">
        <Textarea id="message" name="message" placeholder="What do you need feedback or help with?" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Store URL (optional)" htmlFor="storeUrl">
          <Input id="storeUrl" name="storeUrl" type="url" placeholder="https://…" />
        </Field>
        <Field label="Product URL (optional)" htmlFor="productUrl">
          <Input id="productUrl" name="productUrl" type="url" placeholder="https://…" />
        </Field>
      </div>
      <p className="text-xs text-ink-faint">
        Screenshots: paste an image link (e.g. from your store admin) into your message — direct
        uploads are coming.
      </p>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Sending…" : "Submit Question"}
        </Button>
        {sent && <span className="text-sm text-good">Sent — we&rsquo;ll reply soon ✓</span>}
      </div>
    </form>
  );
}
