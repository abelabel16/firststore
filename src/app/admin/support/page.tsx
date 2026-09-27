"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Ticket } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function AdminSupportPage() {
  const auth = useAuth();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  const load = useCallback(() => {
    getSupabase()
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setTickets((data as Ticket[]) ?? []));
  }, []);

  useEffect(() => {
    if (auth.profile?.is_admin) load();
  }, [auth.profile?.is_admin, load]);

  if (auth.loading || tickets === null) return <PageSkeleton />;

  const open = tickets.filter((t) => t.status === "open");
  const closed = tickets.filter((t) => t.status === "closed");

  async function reply(ticketId: string, text: string) {
    if (!text.trim()) return;
    await getSupabase()
      .from("tickets")
      .update({ reply: text.trim(), status: "closed" })
      .eq("id", ticketId);
    load();
  }

  async function reopen(ticketId: string) {
    await getSupabase().from("tickets").update({ status: "open" }).eq("id", ticketId);
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Support</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {open.length} open · {closed.length} answered
        </p>
      </div>

      {tickets.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-soft">No messages yet.</p>
        </Card>
      )}

      {[...open, ...closed].map((t) => (
        <Card key={t.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-ink">{t.subject}</p>
              <p className="text-xs text-ink-faint">
                {t.name ? `${t.name} · ` : ""}
                {t.email} · {formatDateTime(t.created_at)} ·{" "}
                {t.source === "vip" ? "VIP support" : "Contact form"}
              </p>
            </div>
            <Badge tone={t.status === "open" ? "warn" : "good"}>
              {t.status === "open" ? "Open" : "Answered"}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.message}</p>
          {(t.store_url || t.product_url) && (
            <div className="mt-2 space-y-0.5 text-xs text-ink-soft">
              {t.store_url && <p>Store: {t.store_url}</p>}
              {t.product_url && <p>Product: {t.product_url}</p>}
            </div>
          )}

          {t.status === "open" ? (
            <form
              className="mt-4 space-y-2 border-t border-line pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                reply(t.id, String(new FormData(e.currentTarget).get("reply") ?? ""));
              }}
            >
              <textarea
                name="reply"
                placeholder="Write your reply…"
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
                rows={3}
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
              >
                Send reply &amp; close
              </button>
            </form>
          ) : (
            <div className="mt-4 border-t border-line pt-4">
              {t.reply && (
                <div className="rounded-lg bg-accent-soft p-3">
                  <p className="text-xs font-semibold text-accent-strong">Your reply</p>
                  <p className="mt-1 text-sm text-ink">{t.reply}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => reopen(t.id)}
                className="mt-2 text-xs font-medium text-ink-soft underline hover:text-ink"
              >
                Reopen
              </button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
