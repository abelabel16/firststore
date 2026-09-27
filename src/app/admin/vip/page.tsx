import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listSessions, listUsers } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { completeSessionAction, saveClientNotesAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin — VIP" };

export default function AdminVipPage() {
  const vipClients = listUsers().filter((u) => u.entitlements.includes("vip"));
  const sessions = listSessions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">VIP clients</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {vipClients.length} clients · {sessions.filter((s) => s.status === "upcoming").length}{" "}
          upcoming sessions
        </p>
      </div>

      {vipClients.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-soft">No VIP clients yet.</p>
        </Card>
      )}

      {vipClients.map((client) => {
        const clientSessions = sessions.filter((s) => s.email === client.email);
        return (
          <Card key={client.id} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-ink">
                  {client.name}
                  {client.seeded && (
                    <Badge className="ml-2" tone="warn">
                      demo
                    </Badge>
                  )}
                </h2>
                <p className="text-xs text-ink-faint">
                  {client.email} · joined {formatDate(client.createdAt)}
                </p>
              </div>
              <Badge tone={client.vipOnboarding ? "good" : "warn"}>
                {client.vipOnboarding ? "Onboarded" : "Onboarding pending"}
              </Badge>
            </div>

            {client.vipOnboarding && (
              <dl className="mt-4 grid gap-3 rounded-xl bg-paper p-4 sm:grid-cols-2">
                {[
                  ["Store", client.vipOnboarding.hasStore],
                  ["Selling", client.vipOnboarding.selling],
                  ["Stage", client.vipOnboarding.stage],
                  ["Struggling with", client.vipOnboarding.strugglingWith],
                  ["Goal", client.vipOnboarding.goal],
                  ["Biggest problem", client.vipOnboarding.biggestProblem],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm text-ink-soft">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Sessions */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-ink">Sessions</h3>
              {clientSessions.length === 0 ? (
                <p className="mt-2 text-sm text-ink-soft">None booked yet.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {clientSessions.map((s) => (
                    <div key={s.id} className="rounded-xl border border-line p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-ink">
                          Session {s.number} — {s.date} at {s.time}
                        </p>
                        <Badge tone={s.status === "completed" ? "good" : "accent"}>{s.status}</Badge>
                      </div>
                      {(s.prep.storeUrl || s.prep.productUrl || s.prep.questions) && (
                        <div className="mt-2 space-y-1 text-xs text-ink-soft">
                          {s.prep.storeUrl && <p>Store: {s.prep.storeUrl}</p>}
                          {s.prep.productUrl && <p>Product: {s.prep.productUrl}</p>}
                          {s.prep.questions && <p>Questions: {s.prep.questions}</p>}
                        </div>
                      )}
                      {s.status === "upcoming" ? (
                        <form action={completeSessionAction} className="mt-3 space-y-2">
                          <input type="hidden" name="id" value={s.id} />
                          <textarea
                            name="actionPlan"
                            placeholder="Action plan — one task per line"
                            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
                            rows={3}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
                          >
                            Mark completed &amp; send action plan
                          </button>
                        </form>
                      ) : (
                        s.actionPlan.length > 0 && (
                          <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-ink-soft">
                            {s.actionPlan.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ol>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <form action={saveClientNotesAction} className="mt-5 border-t border-line pt-4">
              <input type="hidden" name="email" value={client.email} />
              <label
                htmlFor={`notes-${client.id}`}
                className="text-xs font-semibold uppercase tracking-wider text-ink-faint"
              >
                Private notes
              </label>
              <textarea
                id={`notes-${client.id}`}
                name="notes"
                defaultValue={client.adminNotes ?? ""}
                placeholder="Only you see these."
                className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
                rows={2}
              />
              <button
                type="submit"
                className="mt-2 rounded-lg border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:bg-zinc-50 hover:text-ink"
              >
                Save notes
              </button>
            </form>
          </Card>
        );
      })}
    </div>
  );
}
