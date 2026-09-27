"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { VipSession } from "@/lib/types";

const prepChecklist = [
  "Add your store and product URLs below",
  "Write down your questions, specific beats general",
  "Have your store analytics open during the call",
  "Be ready to share your screen",
];

export function SessionContent() {
  const auth = useAuth();
  const id = useSearchParams().get("id");
  const [session, setSession] = useState<VipSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.session || !auth.configured || !id) {
      if (!auth.loading) setLoaded(true);
      return;
    }
    // RLS restricts this query to the client's own sessions.
    getSupabase()
      .from("vip_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setSession((data as VipSession | null) ?? null);
        setLoaded(true);
      });
  }, [auth.session, auth.configured, auth.loading, id]);

  if (auth.loading || !loaded) return <PageSkeleton />;

  if (!session) {
    return (
      <p className="text-sm text-ink-soft">
        Session not found.{" "}
        <Link href="/vip" className="font-medium text-accent">
          Back to VIP home
        </Link>
      </p>
    );
  }

  async function savePrep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error: dbError } = await getSupabase()
      .from("vip_sessions")
      .update({
        store_url: data.storeUrl?.trim() ?? "",
        product_url: data.productUrl?.trim() ?? "",
        questions: data.questions?.trim() ?? "",
      })
      .eq("id", session.id);
    setSaving(false);
    if (dbError) setError("Couldn't save your preparation. Please try again.");
    else setSaved(true);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/vip" className="text-sm text-ink-soft hover:text-ink">
          ← VIP Home
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Session {session.number}
          </h1>
          <Badge tone={session.status === "completed" ? "good" : "accent"}>
            {session.status === "completed" ? "Completed" : "Upcoming"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {session.date} at {session.time}
        </p>
      </div>

      {session.status === "completed" ? (
        <Card className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">Your action plan</h2>
          {session.action_plan.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">
              Your mentor is writing up your action plan, it will appear here shortly.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {session.action_plan.map((task, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink">{task}</p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      ) : (
        <>
          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-ink">Preparation checklist</h2>
            <ul className="mt-3 space-y-2">
              {prepChecklist.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-ink-soft">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Your preparation</h2>
            <form onSubmit={savePrep} noValidate className="space-y-5">
              <Field label="Store URL" htmlFor="storeUrl" hint="So your mentor can review before the call.">
                <Input id="storeUrl" name="storeUrl" type="url" defaultValue={session.store_url} placeholder="https://your-store.com" />
              </Field>
              <Field label="Product URL" htmlFor="productUrl">
                <Input id="productUrl" name="productUrl" type="url" defaultValue={session.product_url} placeholder="https://your-store.com/products/…" />
              </Field>
              <Field label="Questions" htmlFor="questions" hint="What do you want out of this session?">
                <Textarea id="questions" name="questions" defaultValue={session.questions} placeholder="The more specific, the better." />
              </Field>
              {error && (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              )}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Preparation"}
                </Button>
                {saved && <span className="text-sm text-good">Saved ✓</span>}
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
