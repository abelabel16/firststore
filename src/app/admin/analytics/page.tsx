"use client";

import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/ui/skeleton";
import { AnalyticsView, type AnalyticsRow } from "@/components/admin/analytics-view";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";

export default function AdminAnalyticsPage() {
  const auth = useAuth();
  const [rows, setRows] = useState<AnalyticsRow[] | null>(null);
  const [paidOrders, setPaidOrders] = useState(0);

  useEffect(() => {
    if (!auth.profile?.is_admin) return;
    const supabase = getSupabase();
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    supabase
      .from("page_views")
      .select(
        "id, kind, view_id, path, referrer, visitor, session, event, duration_ms, scroll_pct, device, os, browser, tz, utm_source, created_at"
      )
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(20000)
      .then(({ data }) => setRows((data as AnalyticsRow[]) ?? []));
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid")
      .gte("created_at", since)
      .then(({ count }) => setPaidOrders(count ?? 0));
  }, [auth.profile?.is_admin]);

  if (auth.loading || rows === null) return <PageSkeleton />;
  return <AnalyticsView rows={rows} paidOrders={paidOrders} />;
}
