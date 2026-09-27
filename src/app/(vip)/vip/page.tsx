"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { VipSession } from "@/lib/types";
import { progressPercent } from "@/content/course";

export default function VipDashboardPage() {
  const auth = useAuth();
  const [sessions, setSessions] = useState<VipSession[] | null>(null);

  const email = auth.session?.user.email;
  useEffect(() => {
    if (!email || !auth.configured) return;
    getSupabase()
      .from("vip_sessions")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => setSessions((data as VipSession[]) ?? []));
  }, [email, auth.configured]);

  if (auth.loading || !auth.profile || sessions === null) return <PageSkeleton />;

  const firstName = (auth.profile.name || email || "there").split(" ")[0];
  const upcoming = sessions.find((s) => s.status === "upcoming");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const percent = progressPercent(auth.profile.completed_lessons);

  const nextStep = !auth.profile.vip_onboarding
    ? {
        title: "Complete your onboarding",
        text: "Tell your mentor where you are and what you're stuck on, it shapes everything that follows.",
        href: "/vip/onboarding",
        cta: "Complete Onboarding",
      }
    : !upcoming
      ? {
          title: "Book your next session",
          text: "Pick a time for your 1-to-1, then add your prep so the session goes deep, fast.",
          href: "/vip/book",
          cta: "Book Session",
        }
      : {
          title: "Prepare for your session",
          text: "Add your store URL, product URL, and questions so your mentor can review before the call.",
          href: `/vip/session/?id=${upcoming.id}`,
          cta: "Open Session",
        };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Welcome to VIP, {firstName}.
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Your mentorship home base.</p>
      </div>

      {/* Next step */}
      <div className="rounded-2xl bg-zinc-900 p-5 text-white shadow-md sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Next step</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold">{nextStep.title}</p>
            <p className="mt-1 max-w-md text-sm text-zinc-400">{nextStep.text}</p>
          </div>
          <ButtonLink href={nextStep.href} variant="inverse" className="shrink-0">
            {nextStep.cta}
          </ButtonLink>
        </div>
      </div>

      {/* Upcoming session */}
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-ink">Upcoming session</h2>
          {upcoming && <Badge tone="accent">Session {upcoming.number}</Badge>}
        </div>
        {upcoming ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-ink">
                {upcoming.date} at {upcoming.time}
              </p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {upcoming.store_url || upcoming.questions
                  ? "Preparation added, you're set."
                  : "No preparation added yet."}
              </p>
            </div>
            <ButtonLink
              href={`/vip/session/?id=${upcoming.id}`}
              variant="secondary"
              className="shrink-0"
            >
              View session
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft">No session booked.</p>
            <ButtonLink href="/vip/book" variant="secondary" className="shrink-0">
              Book a session
            </ButtonLink>
          </div>
        )}
      </Card>

      {/* My progress */}
      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">My progress</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold text-ink">{percent}%</p>
            <p className="text-xs text-ink-soft">Course complete</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink">{completedSessions.length}</p>
            <p className="text-xs text-ink-soft">Sessions completed</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink">
              {auth.profile.vip_onboarding ? "✓" : "…"}
            </p>
            <p className="text-xs text-ink-soft">
              Onboarding {auth.profile.vip_onboarding ? "done" : "pending"}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/vip/community", title: "Private Group", text: "Connect with other active clients." },
          { href: "/vip/support", title: "Support", text: "Ask a question, get direct feedback." },
          { href: "/vip/resources", title: "Resources", text: "Premium guides and templates." },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="block">
            <Card className="h-full p-5 transition-colors hover:border-zinc-300">
              <h3 className="text-sm font-semibold text-ink">{l.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{l.text}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
