"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/use-auth";
import { OnboardingForm } from "./onboarding-form";

export default function VipOnboardingPage() {
  const auth = useAuth();
  if (auth.loading || !auth.profile) return <PageSkeleton />;

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
        {auth.profile.vip_onboarding && (
          <Badge tone="good" className="mt-3">
            Already completed — submitting again updates your answers
          </Badge>
        )}
      </div>
      <Card className="p-5 sm:p-8">
        <OnboardingForm
          profileId={auth.profile.id}
          defaultName={auth.profile.name}
          defaultEmail={auth.profile.email}
        />
      </Card>
    </div>
  );
}
