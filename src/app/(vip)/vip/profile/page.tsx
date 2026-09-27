import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { listOrdersByEmail, listSessionsByEmail } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "VIP Profile" };

export default async function VipProfilePage() {
  const user = await requireEntitlement("vip");
  const sessions = listSessionsByEmail(user.email);
  const vipOrder = listOrdersByEmail(user.email).find(
    (o) => o.product === "vip" && o.status === "paid"
  );

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
            <dd className="text-sm font-medium text-ink">{user.name}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-soft">Email</dt>
            <dd className="truncate text-sm font-medium text-ink">{user.email}</dd>
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
                {formatDate(vipOrder.paidAt ?? vipOrder.createdAt)}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Sessions</h2>
        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">
            No sessions yet —{" "}
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
                    href={`/vip/session/${s.id}`}
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
          — we handle verified requests within two business days.
        </p>
      </Card>
    </div>
  );
}
