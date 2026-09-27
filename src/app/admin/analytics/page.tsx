"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/admin/stat-card";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";

interface View {
  path: string;
  referrer: string | null;
  visitor: string | null;
  created_at: string;
}

function topCounts(items: string[], limit: number): [string, number][] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function referrerHost(ref: string | null): string {
  if (!ref) return "Direct / none";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    return host === "vibrantflacon.com" ? "Internal" : host;
  } catch {
    return "Other";
  }
}

export default function AdminAnalyticsPage() {
  const auth = useAuth();
  const [views, setViews] = useState<View[] | null>(null);
  const [paidOrders, setPaidOrders] = useState<number>(0);

  useEffect(() => {
    if (!auth.profile?.is_admin) return;
    const supabase = getSupabase();
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    supabase
      .from("page_views")
      .select("path, referrer, visitor, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20000)
      .then(({ data }) => setViews((data as View[]) ?? []));
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .gte("created_at", since)
      .then(({ count }) => setPaidOrders(count ?? 0));
  }, [auth.profile?.is_admin]);

  if (auth.loading || views === null) return <PageSkeleton />;

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const today = views.filter((v) => new Date(v.created_at) >= dayStart);
  const uniques = new Set(views.map((v) => v.visitor ?? "unknown")).size;
  const uniquesToday = new Set(today.map((v) => v.visitor ?? "unknown")).size;
  const conversion = uniques > 0 ? ((paidOrders / uniques) * 100).toFixed(2) : "0.00";

  const topPages = topCounts(views.map((v) => v.path), 8);
  const topReferrers = topCounts(
    views.filter((v) => referrerHost(v.referrer) !== "Internal").map((v) => referrerHost(v.referrer)),
    8
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Last 30 days. First-party and cookie-free, stored in your own database.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Visitors" value={String(uniques)} hint={`${uniquesToday} today`} />
        <StatCard label="Page views" value={String(views.length)} hint={`${today.length} today`} />
        <StatCard label="Paid orders" value={String(paidOrders)} />
        <StatCard label="Conversion" value={`${conversion}%`} hint="Paid orders / visitors" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Top pages</h2>
          {topPages.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">No visits recorded yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {topPages.map(([path, count]) => (
                <li key={path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-ink">{path}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-ink-soft">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Traffic sources</h2>
          {topReferrers.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">No external visits yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {topReferrers.map(([host, count]) => (
                <li key={host} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-ink">{host}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-ink-soft">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="text-xs leading-relaxed text-ink-faint">
        Note: in-app browsers (TikTok, Instagram) often hide the referrer, so social traffic can
        appear under Direct. Judge campaigns by the visitor spike after you post.
      </p>
    </div>
  );
}
