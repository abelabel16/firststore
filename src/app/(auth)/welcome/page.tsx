"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/use-auth";

/**
 * Landing page for magic-link logins. supabase-js picks the session out of
 * the URL automatically; this page then routes the user to the right area.
 */
export default function WelcomePage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading || !auth.configured) return;
    if (!auth.session) return; // token still being processed; auth state change will re-run
    if (auth.profile?.is_admin) router.replace("/admin/");
    else if (auth.entitlements.includes("vip")) {
      router.replace(auth.profile?.vip_onboarding ? "/vip/" : "/vip/onboarding/");
    } else if (auth.entitlements.includes("course")) router.replace("/dashboard/");
    else router.replace("/course/");
  }, [auth, router]);

  return (
    <div className="w-full">
      <p className="mb-6 text-center text-sm text-ink-soft">Logging you in…</p>
      <PageSkeleton />
    </div>
  );
}
