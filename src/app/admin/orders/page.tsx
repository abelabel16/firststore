import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { listOrders } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { formatUsd } from "@/config/site";

export const metadata: Metadata = { title: "Admin — Orders" };

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-ink-soft">{orders.length} total.</p>
      </div>
      <DataTable
        headers={["Customer", "Email", "Product", "Amount", "Status", "Date"]}
        emptyMessage="No orders yet — they'll appear here after the first checkout."
        rows={orders.map((o) => [
          <span key="n">
            {o.name}
            {o.seeded && (
              <Badge className="ml-2" tone="warn">
                demo
              </Badge>
            )}
          </span>,
          o.email,
          o.product === "course" ? "Course" : "VIP Mentorship",
          formatUsd(o.amountUsd),
          <Badge key="s" tone={o.status === "paid" ? "good" : o.status === "failed" ? "danger" : "warn"}>
            {o.status}
          </Badge>,
          formatDateTime(o.createdAt),
        ])}
      />
    </div>
  );
}
