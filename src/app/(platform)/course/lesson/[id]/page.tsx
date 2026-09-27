import { allLessons } from "@/content/course";
import { LessonContent } from "./lesson-content";

/** Pre-render every lesson page at build time (static export). */
export function generateStaticParams() {
  return allLessons.map((l) => ({ id: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonContent id={id} />;
}
