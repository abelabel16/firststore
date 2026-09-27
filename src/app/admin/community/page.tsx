import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listUsers } from "@/lib/db";
import { toggleCommunityAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin — Community" };

export default function AdminCommunityPage() {
  const vipClients = listUsers().filter((u) => u.entitlements.includes("vip"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Community access
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Grant or revoke private community access for VIP clients. Access is checked server-side
          on every visit to the community page.
        </p>
      </div>

      {vipClients.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-soft">No VIP clients yet.</p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {vipClients.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {u.name}
                    {u.seeded && (
                      <Badge className="ml-2" tone="warn">
                        demo
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-ink-faint">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={u.communityAccess ? "good" : "neutral"}>
                    {u.communityAccess ? "Access granted" : "No access"}
                  </Badge>
                  <form action={toggleCommunityAction}>
                    <input type="hidden" name="email" value={u.email} />
                    <button
                      type="submit"
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-zinc-50 hover:text-ink"
                    >
                      {u.communityAccess ? "Revoke" : "Grant"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
