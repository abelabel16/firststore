"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/use-auth";
import { findModule, moduleState } from "@/content/course";

export function ModuleContent({ id }: { id: string }) {
  const auth = useAuth();
  if (auth.loading || !auth.profile) return <PageSkeleton />;

  const courseModule = findModule(id);
  if (!courseModule) {
    return (
      <p className="text-sm text-ink-soft">
        Module not found.{" "}
        <Link href="/dashboard" className="font-medium text-accent">
          Back to dashboard
        </Link>
      </p>
    );
  }

  const completed = auth.profile.completed_lessons;
  const state = moduleState(courseModule, completed);

  if (state === "locked") {
    return (
      <Card className="mx-auto max-w-md p-8 text-center">
        <p className="text-sm font-semibold text-ink">This module is still locked. 🔒</p>
        <p className="mt-2 text-sm text-ink-soft">
          Complete the previous module first — the course builds in order.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm font-medium text-accent">
          Back to dashboard →
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-ink-soft hover:text-ink">
          ← Dashboard
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm font-semibold text-accent">{courseModule.number}</span>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {courseModule.title}
          </h1>
          {state === "complete" && <Badge tone="good">Complete</Badge>}
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          {courseModule.detail}
        </p>
      </div>

      <div className="space-y-3">
        {courseModule.lessons.map((lesson, idx) => {
          const done = completed.includes(lesson.id);
          return (
            <Link key={lesson.id} href={`/course/lesson/${lesson.id}`} className="block">
              <Card className="flex items-center gap-4 p-4 transition-colors hover:border-zinc-300 sm:p-5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    done ? "bg-good-soft text-good" : "border border-line text-ink-soft"
                  }`}
                  aria-hidden="true"
                >
                  {done ? "✓" : idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">{lesson.description}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-faint">{lesson.duration}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
