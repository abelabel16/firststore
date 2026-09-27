"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import type { VipSession } from "@/lib/types";
import { BookingForm } from "./booking-form";

export default function BookPage() {
  const auth = useAuth();
  const [sessions, setSessions] = useState<VipSession[] | null>(null);

  const email = auth.session?.user.email;
  useEffect(() => {
    if (!email || !auth.configured) return;
    getSupabase()
      .from("vip_sessions")
      .select("*")
      .then(({ data }) => setSessions((data as VipSession[]) ?? []));
  }, [email, auth.configured]);

  if (auth.loading || !email || sessions === null) return <PageSkeleton />;

  const upcoming = sessions.find((s) => s.status === "upcoming");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Book your 1-to-1 session
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Pick a time that works for you. After booking, add your preparation — store URL, product
          URL, questions — so the session goes straight to what matters.
        </p>
      </div>

      {upcoming && (
        <Card className="p-4">
          <p className="text-sm text-ink-soft">
            You already have a session on{" "}
            <strong className="text-ink">
              {upcoming.date} at {upcoming.time}
            </strong>
            .{" "}
            <Link
              href={`/vip/session/?id=${upcoming.id}`}
              className="font-medium text-accent hover:text-accent-strong"
            >
              View it →
            </Link>
          </p>
        </Card>
      )}

      <Card className="p-5 sm:p-8">
        <BookingForm email={email} existingCount={sessions.length} />
      </Card>
    </div>
  );
}
