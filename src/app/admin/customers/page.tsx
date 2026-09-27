"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/admin/data-table";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { Order, Product, Profile } from "@/lib/types";
import { progressPercent } from "@/content/course";
import { formatDate } from "@/lib/utils";
import { formatUsd } from "@/config/site";

export default function AdminCustomersPage() {
  const auth = useAuth();
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [entitlements, setEntitlements] = useState<{ email: string; product: Product }[]>([]);

  useEffect(() => {
    if (!auth.profile?.is_admin) return;
    const supabase = getSupabase();
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProfiles((data as Profile[]) ?? []));
    supabase
      .from("orders")
      .select("*")
      .eq("status", "paid")
      .then(({ data }) => setOrders((data as Order[]) ?? []));
    supabase
      .from("entitlements")
      .select("email, product")
      .then(({ data }) => setEntitlements((data as { email: string; product: Product }[]) ?? []));
  }, [auth.profile?.is_admin]);

  if (auth.loading || profiles === null) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {profiles.length} accounts · customers appear here after their first login.
        </p>
      </div>
      <DataTable
        headers={["Customer", "Access", "Progress", "Purchases", "Joined"]}
        emptyMessage="No customers yet."
        rows={profiles.map((p) => {
          const own = entitlements.filter((e) => e.email === p.email).map((e) => e.product);
          const paidOrders = orders.filter((o) => o.email === p.email);
          const spent = paidOrders.reduce((s, o) => s + o.amount_usd, 0);
          return [
            <span key="n">
              {p.name || "not set"}
              <span className="block text-xs text-ink-faint">{p.email}</span>
            </span>,
            <span key="e" className="flex flex-wrap gap-1">
              {p.is_admin && <Badge tone="accent">admin</Badge>}
              {own.length === 0 && !p.is_admin ? (
                <Badge>none</Badge>
              ) : (
                own.map((e) => (
                  <Badge key={e} tone={e === "vip" ? "accent" : "neutral"}>
                    {e}
                  </Badge>
                ))
              )}
            </span>,
            `${progressPercent(p.completed_lessons)}%`,
            <span key="p">
              {paidOrders.length} · {formatUsd(spent)}
              <span className="block text-xs text-ink-faint">
                {paidOrders.map((o) => (o.product === "course" ? "Course" : "VIP")).join(", ") || "not set"}
              </span>
            </span>,
            formatDate(p.created_at),
          ];
        })}
      />
    </div>
  );
}
