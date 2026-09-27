"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { site } from "@/config/site";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name?.trim()) nextErrors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) nextErrors.email = "Please enter a valid email.";
    if (!data.subject?.trim()) nextErrors.subject = "Please enter a subject.";
    if (!data.message?.trim() || data.message.trim().length < 10)
      nextErrors.message = "Please write a message (at least 10 characters).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      if (!supabaseConfigured) throw new Error("not configured");
      const { error } = await getSupabase().from("tickets").insert({
        email: data.email.trim().toLowerCase(),
        name: data.name.trim(),
        source: "contact",
        subject: data.subject.trim(),
        message: data.message.trim(),
      });
      if (error) throw error;
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-good-soft p-8 text-center">
        <p className="text-base font-semibold text-ink">Message sent.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Thanks for reaching out, we reply to every message, usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" placeholder="Your name" />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </Field>
      </div>
      <Field label="Subject" htmlFor="subject" error={errors.subject}>
        <Input id="subject" name="subject" placeholder="What's this about?" />
      </Field>
      <Field label="Message" htmlFor="message" error={errors.message}>
        <Textarea id="message" name="message" placeholder="How can we help?" />
      </Field>
      {status === "error" && (
        <p className="text-sm text-danger" role="alert">
          Something went wrong sending your message. Please email us directly at {site.supportEmail}.
        </p>
      )}
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
