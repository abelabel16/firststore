"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Ticket } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { SupportForm } from "./support-form";

export default function VipSupportPage() {
  const auth = useAuth();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  const email = auth.session?.user.email;
  const load = useCallback(() => {
    if (!email) return;
    getSupabase()
      .from("tickets")
      .select("*")
      .eq("source", "vip")
      .order("created_at", { ascending: false })
      .then(({ data }) => setTickets((data as Ticket[]) ?? []));
  }, [email]);

  useEffect(() => {
    if (auth.configured) load();
  }, [auth.configured, load]);

  if (auth.loading || !auth.profile || tickets === null) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Private support
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Ask anything between sessions, store questions, product doubts, content feedback. Your
          mentor reads and answers every request.
        </p>
      </div>

      <Card className="p-5 sm:p-8">
        <SupportForm email={auth.profile.email} name={auth.profile.name} onSent={load} />
      </Card>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Your requests</h2>
        {tickets.length === 0 ? (
          <Card className="p-5 text-center">
            <p className="text-sm text-ink-soft">No requests yet, ask your first question above.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Card key={t.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{t.subject}</p>
                  <Badge tone={t.status === "open" ? "warn" : "good"}>
                    {t.status === "open" ? "Awaiting reply" : "Answered"}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t.message}</p>
                {t.reply && (
                  <div className="mt-3 rounded-lg bg-accent-soft p-3">
                    <p className="text-xs font-semibold text-accent-strong">Mentor reply</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">{t.reply}</p>
                  </div>
                )}
                <p className="mt-2 text-xs text-ink-faint">{formatDate(t.created_at)}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
