"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Order, Product } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { formatUsd, site } from "@/config/site";

export default function AdminDashboardPage() {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [entitlements, setEntitlements] = useState<{ email: string; product: Product }[]>([]);

  useEffect(() => {
    if (!auth.profile?.is_admin) return;
    const supabase = getSupabase();
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
    supabase
      .from("entitlements")
      .select("email, product")
      .then(({ data }) => setEntitlements((data as { email: string; product: Product }[]) ?? []));
  }, [auth.profile?.is_admin]);

  if (auth.loading || orders === null) return <PageSkeleton />;

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + o.amount_usd, 0);
  const courseStudents = new Set(
    entitlements.filter((e) => e.product === "course").map((e) => e.email)
  ).size;
  const vipClients = new Set(
    entitlements.filter((e) => e.product === "vip").map((e) => e.email)
  ).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-ink-soft">How {site.name} is doing.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatUsd(revenue)} hint={`${paid.length} paid orders`} />
        <StatCard label="Orders" value={String(orders.length)} hint="All statuses" />
        <StatCard label="Course students" value={String(courseStudents)} />
        <StatCard label="VIP clients" value={String(vipClients)} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Recent purchases</h2>
        <DataTable
          headers={["Customer", "Product", "Amount", "Status", "Date"]}
          emptyMessage="No orders yet."
          rows={orders.slice(0, 8).map((o) => [
            <span key="c">
              {o.name}
              <span className="block text-xs text-ink-faint">{o.email}</span>
            </span>,
            o.product === "course" ? "Course" : "VIP Mentorship",
            formatUsd(o.amount_usd),
            <Badge key="s" tone={o.status === "paid" ? "good" : o.status === "failed" ? "danger" : "warn"}>
              {o.status}
            </Badge>,
            formatDateTime(o.created_at),
          ])}
        />
      </section>
    </div>
  );
}
