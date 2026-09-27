import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listTickets } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { replyToTicketAction, reopenTicketAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin — Support" };

export default function AdminSupportPage() {
  const tickets = listTickets();
  const open = tickets.filter((t) => t.status === "open");
  const closed = tickets.filter((t) => t.status === "closed");

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
              <p className="text-sm font-semibold text-ink">
                {t.subject}
                {t.seeded && (
                  <Badge className="ml-2" tone="warn">
                    demo
                  </Badge>
                )}
              </p>
              <p className="text-xs text-ink-faint">
                {t.name ? `${t.name} · ` : ""}
                {t.email} · {formatDateTime(t.createdAt)} ·{" "}
                {t.source === "vip" ? "VIP support" : "Contact form"}
              </p>
            </div>
            <Badge tone={t.status === "open" ? "warn" : "good"}>
              {t.status === "open" ? "Open" : "Answered"}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.message}</p>
          {(t.storeUrl || t.productUrl) && (
            <div className="mt-2 space-y-0.5 text-xs text-ink-soft">
              {t.storeUrl && <p>Store: {t.storeUrl}</p>}
              {t.productUrl && <p>Product: {t.productUrl}</p>}
            </div>
          )}

          {t.status === "open" ? (
            <form action={replyToTicketAction} className="mt-4 space-y-2 border-t border-line pt-4">
              <input type="hidden" name="id" value={t.id} />
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
              <form action={reopenTicketAction} className="mt-2">
                <input type="hidden" name="id" value={t.id} />
                <button
                  type="submit"
                  className="text-xs font-medium text-ink-soft underline hover:text-ink"
                >
                  Reopen
                </button>
              </form>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
