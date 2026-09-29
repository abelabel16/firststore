"use client";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/use-auth";
import { site } from "@/config/site";

const norms = [
  { title: "Real work only", text: "Share actual stores, actual products, actual content. Feedback is honest and specific." },
  { title: "Small on purpose", text: "The group is limited to VIP members so the signal stays high." },
  { title: "No income bragging", text: "We talk process and decisions, not screenshots. What worked, what didn't, and why." },
];

export default function CommunityPage() {
  // The VIP layout guard + RLS enforce entitlement; community_access is the
  // per-client switch controlled from the admin area.
  const auth = useAuth();
  if (auth.loading || !auth.profile) return <PageSkeleton />;

  const hasAccess = auth.profile.community_access;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Private community
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          A small private group of VIP members: ask questions, share what
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
              message {site.telegram} on Telegram.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
