import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "VIP Onboarding" };

export default async function VipOnboardingPage() {
  const user = await requireEntitlement("vip");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Let&rsquo;s set up your mentorship.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Your answers go straight to your mentor and shape your first session and action plan.
          Five minutes here saves an hour later.
        </p>
        {user.vipOnboarding && (
          <Badge tone="good" className="mt-3">
            Already completed — submitting again updates your answers
          </Badge>
        )}
      </div>
      <Card className="p-5 sm:p-8">
        <OnboardingForm defaultName={user.name} defaultEmail={user.email} />
      </Card>
    </div>
  );
}
