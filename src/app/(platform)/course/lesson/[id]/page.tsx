import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { findLesson, lessonNeighbors } from "@/content/course";
import { MarkCompleteButton } from "@/components/app/mark-complete-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const found = findLesson(id);
  return { title: found ? found.lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireEntitlement("course");
  const { id } = await params;
  const found = findLesson(id);
  if (!found) notFound();

  const { lesson, module: courseModule } = found;
  const { prev, next } = lessonNeighbors(lesson.id);
  const completed = user.completedLessons.includes(lesson.id);

  return (
    <div className="space-y-6">
      <Link href={`/course/module/${courseModule.id}`} className="text-sm text-ink-soft hover:text-ink">
        ← Module {courseModule.number} · {courseModule.title}
      </Link>

      {/* Video player */}
      <div className="overflow-hidden rounded-2xl border border-line bg-ink">
        {lesson.videoUrl ? (
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
              <svg width="16" height="18" viewBox="0 0 12 14" fill="white">
                <path d="M0 0l12 7-12 7z" />
              </svg>
            </span>
            <p className="text-sm font-medium text-white">{lesson.title}</p>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
              Sample lesson — connect your video by setting this lesson&rsquo;s{" "}
              <code className="rounded bg-white/10 px-1">videoUrl</code> in{" "}
              <code className="rounded bg-white/10 px-1">src/content/course.ts</code>.
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {lesson.title}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Module {courseModule.number} · {lesson.duration}
            </p>
          </div>
          <MarkCompleteButton lessonId={lesson.id} completed={completed} />
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
          {lesson.description}
        </p>
      </div>

      {lesson.resources.length > 0 && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink">Lesson resources</h2>
          <ul className="mt-3 space-y-2">
            {lesson.resources.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.href}
                  className="text-sm font-medium text-accent hover:text-accent-strong"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Prev / next */}
      <div className="flex items-stretch gap-3 border-t border-line pt-6">
        {prev ? (
          <Link href={`/course/lesson/${prev.id}`} className="min-w-0 flex-1">
            <Card className="h-full p-4 transition-colors hover:border-zinc-300">
              <p className="text-xs text-ink-faint">← Previous Lesson</p>
              <p className="mt-1 truncate text-sm font-medium text-ink">{prev.title}</p>
            </Card>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link href={`/course/lesson/${next.id}`} className="min-w-0 flex-1 text-right">
            <Card className="h-full p-4 transition-colors hover:border-zinc-300">
              <p className="text-xs text-ink-faint">Next Lesson →</p>
              <p className="mt-1 truncate text-sm font-medium text-ink">{next.title}</p>
            </Card>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
