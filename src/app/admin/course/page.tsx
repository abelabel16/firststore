import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/content/course";
import { resources } from "@/content/resources";

export const metadata: Metadata = { title: "Admin — Course" };

export default function AdminCoursePage() {
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const withVideo = modules.flatMap((m) => m.lessons).filter((l) => l.videoUrl).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Course</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {modules.length} modules · {totalLessons} lessons · {withVideo} with videos connected
        </p>
      </div>

      <Card className="p-4">
        <p className="text-sm leading-relaxed text-ink-soft">
          Course content is versioned with the code in{" "}
          <code className="rounded bg-paper px-1.5 py-0.5 text-xs">src/content/course.ts</code>.
          Edit titles, descriptions, and video URLs there and deploy — every student gets the
          update instantly, and the change history lives in git.
        </p>
      </Card>

      <div className="space-y-4">
        {modules.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-accent">{m.number}</span>
                <h2 className="text-base font-semibold text-ink">{m.title}</h2>
              </div>
              <span className="text-xs text-ink-faint">{m.lessons.length} lessons</span>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {m.lessons.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{l.title}</p>
                    <p className="text-xs text-ink-faint">
                      {l.id} · {l.duration}
                      {l.resources.length > 0 && ` · ${l.resources.length} resource(s)`}
                    </p>
                  </div>
                  <Badge tone={l.videoUrl ? "good" : "warn"}>
                    {l.videoUrl ? "video connected" : "no video"}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-ink">Resources</h2>
        <ul className="mt-3 divide-y divide-line">
          {resources.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <p className="text-sm text-ink">{r.title}</p>
              <span className="flex gap-1.5">
                <Badge>{r.type}</Badge>
                {r.vipOnly && <Badge tone="accent">VIP</Badge>}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
