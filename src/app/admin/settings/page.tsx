import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatUsd, site } from "@/config/site";

export const metadata: Metadata = { title: "Admin — Settings" };

function EnvStatus({ name, set }: { name: string; set: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <code className="text-xs text-ink-soft">{name}</code>
      <Badge tone={set ? "good" : "warn"}>{set ? "configured" : "not set"}</Badge>
    </div>
  );
}

export default function AdminSettingsPage() {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";

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
            ["Site URL", site.url],
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
          Edit these in <code className="rounded bg-paper px-1">src/config/site.ts</code> and
          redeploy. The reference price must reflect a genuine original price — set it to null
          otherwise.
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Payments</h2>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-ink-soft">Active provider</span>
          <Badge tone={provider === "mock" ? "warn" : "good"}>
            {provider === "mock" ? "mock (demo — no real payments)" : provider}
          </Badge>
        </div>
        <div className="mt-2 divide-y divide-line border-t border-line">
          <EnvStatus name="CHAPA_SECRET_KEY" set={Boolean(process.env.CHAPA_SECRET_KEY)} />
          <EnvStatus name="CHAPA_WEBHOOK_SECRET" set={Boolean(process.env.CHAPA_WEBHOOK_SECRET)} />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Email</h2>
        <div className="divide-y divide-line">
          <EnvStatus name="RESEND_API_KEY" set={Boolean(process.env.RESEND_API_KEY)} />
          <EnvStatus name="EMAIL_FROM" set={Boolean(process.env.EMAIL_FROM)} />
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Without a key, emails print to the server console (development mode).
        </p>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Security</h2>
        <div className="divide-y divide-line">
          <EnvStatus
            name="AUTH_SECRET"
            set={Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET !== "change-me-to-a-long-random-string")}
          />
          <EnvStatus name="ADMIN_EMAILS" set={Boolean(process.env.ADMIN_EMAILS)} />
        </div>
      </Card>
    </div>
  );
}
