"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabaseConfigured } from "@/lib/supabase";
import { formatUsd, site } from "@/config/site";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">Business configuration at a glance.</p>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Business</h2>
        <dl className="mt-4 divide-y divide-line">
          {[
            ["Brand name", site.name],
            ["Support email", site.supportEmail],
            [
              "Course price",
              `${formatUsd(site.course.price)}${site.course.referencePrice ? ` (reference ${formatUsd(site.course.referencePrice)})` : ""}`,
            ],
            ["Mentorship price", formatUsd(site.mentorship.price)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-sm text-ink-soft">{label}</dt>
              <dd className="text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Edit these in <code className="rounded bg-paper px-1">src/config/site.ts</code>, then
          push, GitHub Actions redeploys the site. The reference price must reflect a genuine
          original price; set it to null otherwise.
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Backend (Supabase)</h2>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-ink-soft">Connection</span>
          <Badge tone={supabaseConfigured ? "good" : "warn"}>
            {supabaseConfigured ? "connected" : "not configured"}
          </Badge>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          Auth, database, and payment functions run in Supabase. Payment settings (Chapa keys,
          demo mode) live in the Supabase dashboard under Edge Functions → Secrets.
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Course content</h2>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          Modules, lessons, and video URLs are versioned with the code in{" "}
          <code className="rounded bg-paper px-1">src/content/course.ts</code>. Changes deploy
          with the next push.
        </p>
      </Card>
    </div>
  );
}
