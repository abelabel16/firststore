"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { resources } from "@/content/resources";

export default function VipResourcesPage() {
  const premium = resources.filter((r) => r.vipOnly);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          VIP resources
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          The advanced material used inside mentorship — yours to keep.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {premium.map((r) => (
          <Card key={r.id} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold text-ink">{r.title}</h2>
              <Badge tone="accent">{r.type}</Badge>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{r.description}</p>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-ink-soft">
        The standard course materials are in the{" "}
        <Link href="/resources" className="font-medium text-accent hover:text-accent-strong">
          course library
        </Link>
        .
      </p>
    </div>
  );
}
