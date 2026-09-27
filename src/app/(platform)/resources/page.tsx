import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { resources } from "@/content/resources";

export const metadata: Metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const user = await requireEntitlement("course");
  const isVip = user.entitlements.includes("vip");
  const visible = resources.filter((r) => !r.vipOnly);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Resources</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Every checklist, template, and framework from the course in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((r) => (
          <Card key={r.id} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold text-ink">{r.title}</h2>
              <Badge>{r.type}</Badge>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{r.description}</p>
          </Card>
        ))}
      </div>

      {!isVip && (
        <Card className="border-dashed p-5 text-center">
          <p className="text-sm font-medium text-ink">Looking for the advanced material?</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
            Audit checklists, advanced validation guides, and action plan templates are part of{" "}
            <Link href="/mentorship" className="font-medium text-accent hover:text-accent-strong">
              VIP Mentorship
            </Link>
            .
          </p>
        </Card>
      )}
      {isVip && (
        <p className="text-center text-sm text-ink-soft">
          Your premium material lives in{" "}
          <Link href="/vip/resources" className="font-medium text-accent hover:text-accent-strong">
            VIP Resources
          </Link>
          .
        </p>
      )}
    </div>
  );
}
