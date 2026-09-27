"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Order } from "@/lib/types";
import { progressPercent } from "@/content/course";
import { formatDate } from "@/lib/utils";
import { formatUsd, site } from "@/config/site";

export default function ProfilePage() {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const email = auth.session?.user.email;
  useEffect(() => {
    if (!email || !auth.configured) return;
    getSupabase()
      .from("orders")
      .select("*")
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [email, auth.configured]);

  if (auth.loading || !auth.profile) return <PageSkeleton />;

  const percent = progressPercent(auth.profile.completed_lessons);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-ink-soft">Your account, progress, and purchases.</p>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Account</h2>
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
            <dt className="text-sm text-ink-soft">Access</dt>
            <dd className="flex gap-2">
              {auth.entitlements.map((e) => (
                <Badge key={e} tone={e === "vip" ? "accent" : "neutral"}>
                  {e === "vip" ? "VIP Mentorship" : "Course"}
                </Badge>
              ))}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Course progress</h2>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
            <span>Overall</span>
            <span className="font-medium text-ink">{percent}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Purchases</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">No purchases on record for this email.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {o.product === "course" ? site.course.name : site.mentorship.name}
                  </p>
                  <p className="text-xs text-ink-faint">{formatDate(o.paid_at ?? o.created_at)}</p>
                </div>
                <span className="text-sm font-medium text-ink">{formatUsd(o.amount_usd)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Account settings</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Your access is tied to your email, so there&rsquo;s no password to manage. To change
          your email or delete your account (and its data),{" "}
          <Link href="/contact" className="font-medium text-accent hover:text-accent-strong">
            contact support
          </Link>{" "}
         , we verify the request and handle it for you.
        </p>
      </Card>
    </div>
  );
}
