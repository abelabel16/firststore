import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Private Community" };

const norms = [
  { title: "Real work only", text: "Share actual stores, actual products, actual content. Feedback is honest and specific." },
  { title: "Small on purpose", text: "The group is limited to active mentorship clients so the signal stays high." },
  { title: "No income bragging", text: "We talk process and decisions, not screenshots. What worked, what didn't, and why." },
];

export default async function CommunityPage() {
  // Entitlement is verified server-side before any private access is exposed.
  const user = await requireEntitlement("vip");
  const hasAccess = user.communityAccess;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Private community
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          A small private group of active mentorship clients — ask questions, share what
          you&rsquo;re building, and see the feedback others get.
        </p>
      </div>

      <div className="grid gap-4">
        {norms.map((n) => (
          <Card key={n.title} className="p-5">
            <h2 className="text-sm font-semibold text-ink">{n.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{n.text}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 text-center sm:p-8">
        {hasAccess ? (
          <>
            <Badge tone="good" className="mb-3">
              Your VIP access is verified
            </Badge>
            <p className="text-sm leading-relaxed text-ink-soft">
              Your personal invite link is sent by email after onboarding. Can&rsquo;t find it?
              Ask in support and we&rsquo;ll resend it.
            </p>
            <div className="mt-5">
              <ButtonLink href="/vip/support" size="lg" className="w-full sm:w-auto">
                Join Private Community
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-ink">Community access pending</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Access is activated with your VIP membership. If you believe this is an error,
              contact {site.supportEmail}.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
