"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/admin/data-table";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Order } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { formatUsd } from "@/config/site";

export default function AdminOrdersPage() {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!auth.profile?.is_admin) return;
    getSupabase()
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [auth.profile?.is_admin]);

  if (auth.loading || orders === null) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-ink-soft">{orders.length} total.</p>
      </div>
      <DataTable
        headers={["Customer", "Email", "Product", "Amount", "Status", "Date"]}
        emptyMessage="No orders yet, they'll appear here after the first checkout."
        rows={orders.map((o) => [
          o.name,
          o.email,
          o.product === "course" ? "Course" : "VIP Mentorship",
          formatUsd(o.amount_usd),
          <Badge key="s" tone={o.status === "paid" ? "good" : o.status === "failed" ? "danger" : "warn"}>
            {o.status}
          </Badge>,
          formatDateTime(o.created_at),
        ])}
      />
    </div>
  );
}
