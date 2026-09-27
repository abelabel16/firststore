import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { listOrdersByEmail, listUsers } from "@/lib/db";
import { progressPercent } from "@/content/course";
import { formatDate } from "@/lib/utils";
import { formatUsd } from "@/config/site";

export const metadata: Metadata = { title: "Admin — Customers" };

export default function AdminCustomersPage() {
  const users = listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-ink-soft">{users.length} total.</p>
      </div>
      <DataTable
        headers={["Customer", "Access", "Progress", "Purchases", "Joined"]}
        emptyMessage="No customers yet."
        rows={users.map((u) => {
          const paidOrders = listOrdersByEmail(u.email).filter((o) => o.status === "paid");
          const spent = paidOrders.reduce((s, o) => s + o.amountUsd, 0);
          return [
            <span key="n">
              {u.name}
              {u.seeded && (
                <Badge className="ml-2" tone="warn">
                  demo
                </Badge>
              )}
              <span className="block text-xs text-ink-faint">{u.email}</span>
            </span>,
            <span key="e" className="flex flex-wrap gap-1">
              {u.entitlements.length === 0 ? (
                <Badge>none</Badge>
              ) : (
                u.entitlements.map((e) => (
                  <Badge key={e} tone={e === "vip" ? "accent" : "neutral"}>
                    {e}
                  </Badge>
                ))
              )}
            </span>,
            `${progressPercent(u.completedLessons)}%`,
            <span key="p">
              {paidOrders.length} · {formatUsd(spent)}
              <span className="block text-xs text-ink-faint">
                {paidOrders.map((o) => (o.product === "course" ? "Course" : "VIP")).join(", ") || "—"}
              </span>
            </span>,
            formatDate(u.createdAt),
          ];
        })}
      />
    </div>
  );
}
