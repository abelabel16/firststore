"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/use-auth";
import { getSupabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { allLessons, modules, moduleState, progressPercent } from "@/content/course";
import { formatDate } from "@/lib/utils";
import { resources } from "@/content/resources";

export default function DashboardPage() {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const email = auth.session?.user.email;
  useEffect(() => {
    if (!email || !auth.configured) return;
    getSupabase()
      .from("orders")
      .select("*")
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [email, auth.configured]);

  if (auth.loading || !auth.profile) return <PageSkeleton />;

  const completed = auth.profile.completed_lessons;
  const percent = progressPercent(completed);
  const firstName = (auth.profile.name || email || "there").split(" ")[0];
  const nextLesson = allLessons.find((l) => !completed.includes(l.id)) ?? allLessons[0];
  const nextModule = modules.find((m) => m.lessons.some((l) => l.id === nextLesson.id))!;
  const allDone = allLessons.every((l) => completed.includes(l.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Welcome back, {firstName}. 👋
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Pick up where you left off.</p>
      </div>

      {/* Continue learning */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {allDone ? "Course complete 🎉" : "Continue learning"}
            </p>
            <p className="mt-1.5 truncate text-base font-semibold text-ink">
              {nextModule.number} {nextModule.title} · {nextLesson.title}
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">{nextLesson.duration}</p>
          </div>
          <ButtonLink href={`/course/lesson/${nextLesson.id}`} className="shrink-0">
            {allDone ? "Rewatch" : "Continue"}
          </ButtonLink>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
            <span>Course progress</span>
            <span className="font-medium text-ink">{percent}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Curriculum */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Curriculum</h2>
        <div className="space-y-3">
          {modules.map((m) => {
            const state = moduleState(m, completed);
            const done = m.lessons.filter((l) => completed.includes(l.id)).length;
            const locked = state === "locked";
            const inner = (
              <div className="flex items-center gap-4 p-4 sm:p-5">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                    state === "complete"
                      ? "bg-good-soft text-good"
                      : state === "in-progress"
                        ? "bg-accent-soft text-accent-strong"
                        : locked
                          ? "bg-zinc-100 text-ink-faint"
                          : "border border-line text-ink-soft"
                  }`}
                  aria-hidden="true"
                >
                  {state === "complete" ? "✓" : state === "in-progress" ? "▶" : locked ? "🔒" : m.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${locked ? "text-ink-faint" : "text-ink"}`}>
                    {m.number} · {m.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">
                    {done}/{m.lessons.length} lessons
                    {locked && " · complete the previous module to unlock"}
                  </p>
                </div>
                {state === "complete" && <Badge tone="good">Done</Badge>}
                {state === "in-progress" && <Badge tone="accent">In progress</Badge>}
              </div>
            );
            return locked ? (
              <Card key={m.id} className="opacity-70">
                {inner}
              </Card>
            ) : (
              <Link key={m.id} href={`/course/module/${m.id}`} className="block">
                <Card className="transition-colors hover:border-zinc-300">{inner}</Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Resources + activity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Resources</h2>
          <ul className="mt-3 space-y-2">
            {resources
              .filter((r) => !r.vipOnly)
              .slice(0, 4)
              .map((r) => (
                <li key={r.id}>
                  <Link href="/resources" className="text-sm text-ink-soft hover:text-ink">
                    {r.title}
                  </Link>
                </li>
              ))}
          </ul>
          <Link
            href="/resources"
            className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-strong"
          >
            Open library →
          </Link>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">Nothing yet, start your first lesson.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {orders.map((o) => (
                <li key={o.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink-soft">
                    {o.product === "course" ? "Joined the course" : "Joined VIP mentorship"}
                  </span>
                  <span className="shrink-0 text-xs text-ink-faint">
                    {formatDate(o.paid_at ?? o.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-line pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Course updates
            </p>
            <p className="mt-1.5 text-sm text-ink-soft">
              You have the latest version of every module. Updates appear here when published.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
