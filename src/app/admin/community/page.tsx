"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Product, Profile } from "@/lib/types";

export default function AdminCommunityPage() {
  const auth = useAuth();
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [vipEmails, setVipEmails] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    const supabase = getSupabase();
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProfiles((data as Profile[]) ?? []));
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

  async function toggle(profile: Profile) {
    await getSupabase()
      .from("profiles")
      .update({ community_access: !profile.community_access })
      .eq("id", profile.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Community access
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Grant or revoke private community access for VIP clients. Row Level Security enforces
          access on every request.
        </p>
      </div>

      {vipClients.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-soft">
            No VIP clients with accounts yet — clients appear after their first login.
          </p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {vipClients.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
                <div>
                  <p className="text-sm font-medium text-ink">{p.name || "—"}</p>
                  <p className="text-xs text-ink-faint">{p.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={p.community_access ? "good" : "neutral"}>
                    {p.community_access ? "Access granted" : "No access"}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => toggle(p)}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-zinc-50 hover:text-ink"
                  >
                    {p.community_access ? "Revoke" : "Grant"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
