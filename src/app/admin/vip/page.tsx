"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Product, Profile, VipSession } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminVipPage() {
  const auth = useAuth();
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [sessions, setSessions] = useState<VipSession[]>([]);
  const [vipEmails, setVipEmails] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    const supabase = getSupabase();
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProfiles((data as Profile[]) ?? []));
    supabase
      .from("vip_sessions")
      .select("*")
      .order("number", { ascending: true })
      .then(({ data }) => setSessions((data as VipSession[]) ?? []));
    supabase
      .from("entitlements")
      .select("email, product")
      .then(({ data }) =>
        setVipEmails(
          new Set(
            ((data as { email: string; product: Product }[]) ?? [])
              .filter((e) => e.product === "vip")
              .map((e) => e.email)
          )
        )
      );
  }, []);

  useEffect(() => {
    if (auth.profile?.is_admin) load();
  }, [auth.profile?.is_admin, load]);

  if (auth.loading || profiles === null) return <PageSkeleton />;

  const vipClients = profiles.filter((p) => vipEmails.has(p.email));

  async function completeSession(sessionId: string, planText: string) {
    const plan = planText
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    await getSupabase()
      .from("vip_sessions")
      .update({ status: "completed", action_plan: plan })
      .eq("id", sessionId);
    load();
  }

  async function saveNotes(profileId: string, notes: string) {
    await getSupabase().from("profiles").update({ admin_notes: notes }).eq("id", profileId);
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">VIP clients</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {vipClients.length} clients with accounts ·{" "}
          {sessions.filter((s) => s.status === "upcoming").length} upcoming sessions
        </p>
      </div>

      {vipClients.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-soft">
            No VIP clients yet, they appear here after their first login.
          </p>
        </Card>
      )}

      {vipClients.map((client) => {
        const clientSessions = sessions.filter((s) => s.email === client.email);
        const ob = client.vip_onboarding;
        return (
          <Card key={client.id} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-ink">{client.name || client.email}</h2>
                <p className="text-xs text-ink-faint">
                  {client.email} · joined {formatDate(client.created_at)}
                </p>
              </div>
              <Badge tone={ob ? "good" : "warn"}>{ob ? "Onboarded" : "Onboarding pending"}</Badge>
            </div>

            {ob && (
              <dl className="mt-4 grid gap-3 rounded-xl bg-paper p-4 sm:grid-cols-2">
                {[
                  ["Store", ob.hasStore],
                  ["Selling", ob.selling],
                  ["Stage", ob.stage],
                  ["Struggling with", ob.strugglingWith],
                  ["Goal", ob.goal],
                  ["Biggest problem", ob.biggestProblem],
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
                          Session {s.number}, {s.date} at {s.time}
                        </p>
                        <Badge tone={s.status === "completed" ? "good" : "accent"}>{s.status}</Badge>
                      </div>
                      {(s.store_url || s.product_url || s.questions) && (
                        <div className="mt-2 space-y-1 text-xs text-ink-soft">
                          {s.store_url && <p>Store: {s.store_url}</p>}
                          {s.product_url && <p>Product: {s.product_url}</p>}
                          {s.questions && <p>Questions: {s.questions}</p>}
                        </div>
                      )}
                      {s.status === "upcoming" ? (
                        <form
                          className="mt-3 space-y-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const plan = String(new FormData(e.currentTarget).get("actionPlan") ?? "");
                            completeSession(s.id, plan);
                          }}
                        >
                          <textarea
                            name="actionPlan"
                            placeholder="Action plan, one task per line"
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
                        s.action_plan.length > 0 && (
                          <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-ink-soft">
                            {s.action_plan.map((t, i) => (
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
            <form
              className="mt-5 border-t border-line pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const notes = String(new FormData(e.currentTarget).get("notes") ?? "");
                saveNotes(client.id, notes);
              }}
            >
              <label
                htmlFor={`notes-${client.id}`}
                className="text-xs font-semibold uppercase tracking-wider text-ink-faint"
              >
                Private notes
              </label>
              <textarea
                id={`notes-${client.id}`}
                name="notes"
                defaultValue={client.admin_notes ?? ""}
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
