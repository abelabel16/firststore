"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Order, VipSession } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { site } from "@/config/site";

export default function VipProfilePage() {
  const auth = useAuth();
  const [sessions, setSessions] = useState<VipSession[] | null>(null);
  const [vipOrder, setVipOrder] = useState<Order | null>(null);

  const email = auth.session?.user.email;
  useEffect(() => {
    if (!email || !auth.configured) return;
    const supabase = getSupabase();
    supabase
      .from("vip_sessions")
      .select("*")
      .order("number", { ascending: true })
      .then(({ data }) => setSessions((data as VipSession[]) ?? []));
    supabase
      .from("orders")
      .select("*")
      .eq("product", "vip")
      .eq("status", "paid")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setVipOrder((data as Order | null) ?? null));
  }, [email, auth.configured]);

  if (auth.loading || !auth.profile || sessions === null) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">VIP Profile</h1>
        <p className="mt-1 text-sm text-ink-soft">Your membership, sessions, and settings.</p>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Membership</h2>
        <dl className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-soft">Name</dt>
            <dd className="text-sm font-medium text-ink">{auth.profile.name || "not set"}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-soft">Email</dt>
            <dd className="truncate text-sm font-medium text-ink">{auth.profile.email}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-soft">Plan</dt>
            <dd>
              <Badge tone="accent">{site.mentorship.name}</Badge>
            </dd>
          </div>
          {vipOrder && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-ink-soft">Member since</dt>
              <dd className="text-sm font-medium text-ink">
                {formatDate(vipOrder.paid_at ?? vipOrder.created_at)}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Sessions</h2>
        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">
            No sessions yet ,{" "}
            <Link href="/vip/book" className="font-medium text-accent hover:text-accent-strong">
              book your first one
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <Link
                    href={`/vip/session/?id=${s.id}`}
                    className="text-sm font-medium text-ink hover:text-accent"
                  >
                    Session {s.number}
                  </Link>
                  <p className="text-xs text-ink-faint">
                    {s.date} at {s.time}
                  </p>
                </div>
                <Badge tone={s.status === "completed" ? "good" : "accent"}>
                  {s.status === "completed" ? "Completed" : "Upcoming"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Account settings</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          To change your email, transfer access, or delete your account,{" "}
          <Link href="/contact" className="font-medium text-accent hover:text-accent-strong">
            contact support
          </Link>{" "}
         , we handle verified requests within two business days.
        </p>
      </Card>
    </div>
  );
}
