import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { listOrders, listUsers } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = { title: "Admin" };

export default function AdminDashboardPage() {
  const orders = listOrders();
  const users = listUsers();

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + o.amountUsd, 0);
  const courseStudents = users.filter((u) => u.entitlements.includes("course")).length;
  const vipClients = users.filter((u) => u.entitlements.includes("vip")).length;
  const hasSeedData = orders.some((o) => o.seeded) || users.some((u) => u.seeded);

  const recent = orders.slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-ink-soft">How {site.name} is doing.</p>
        {hasSeedData && (
          <p className="mt-3 inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-warn">
            Includes seeded demo records (marked “demo”) — delete data/db.json to start clean.
          </p>
        )}
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
          rows={recent.map((o) => [
            <span key="c">
              {o.name}
              {o.seeded && (
                <Badge className="ml-2" tone="warn">
                  demo
                </Badge>
              )}
              <span className="block text-xs text-ink-faint">{o.email}</span>
            </span>,
            o.product === "course" ? "Course" : "VIP Mentorship",
            formatUsd(o.amountUsd),
            <Badge key="s" tone={o.status === "paid" ? "good" : o.status === "failed" ? "danger" : "warn"}>
              {o.status}
            </Badge>,
            formatDateTime(o.createdAt),
          ])}
        />
      </section>
    </div>
  );
}
