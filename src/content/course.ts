/**
 * Course curriculum: the eight topics the recorded course covers, as
 * confirmed by the owner. The course ships as 10+ videos plus PDF guides and
 * books, delivered by email, so there is no per-lesson list or runtime here.
 *
 * The unlinked platform pages (src/app/(platform)) still render modules and
 * lessons, so each module carries a single lesson that mirrors it.
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string | null;
  resources: { label: string; href: string }[];
}

export interface Module {
  id: string;
  number: string;
  title: string;
  summary: string;
  detail: string;
  lessons: Lesson[];
}

const outline: { title: string; summary: string }[] = [
  { title: "Starting from zero", summary: "How dropshipping works, and how to start when you don't have much money." },
  { title: "Finding products", summary: "How to find and choose products worth testing." },
  { title: "Building your store", summary: "Setting up the store, product pages, and policies." },
  { title: "Suppliers and shipping", summary: "Finding suppliers, ordering samples, and handling shipping times." },
  { title: "Content and TikTok", summary: "Making videos and getting organic traffic on TikTok and Instagram." },
  { title: "Paid ads: what failed", summary: "The ads I ran, why they failed, and what I would do differently." },
  { title: "Orders and customers", summary: "Processing orders, customer service, and refunds." },
  { title: "Every mistake I made", summary: "The mistakes and failures along the way, so you can skip them." },
];

export const modules: Module[] = outline.map((m, i) => ({
  id: `m${i + 1}`,
  number: String(i + 1).padStart(2, "0"),
  title: m.title,
  summary: m.summary,
  detail: m.summary,
  lessons: [
    {
      id: `l-${i + 1}-1`,
      title: m.title,
      description: m.summary,
      duration: "",
      videoUrl: null,
      resources: [],
    },
  ],
}));

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export function findModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function findLesson(id: string): { lesson: Lesson; module: Module } | undefined {
  for (const m of modules) {
    const lesson = m.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, module: m };
  }
  return undefined;
}

export function lessonNeighbors(id: string): { prev: Lesson | null; next: Lesson | null } {
  const idx = allLessons.findIndex((l) => l.id === id);
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  };
}

export function progressPercent(completedLessons: string[]): number {
  if (allLessons.length === 0) return 0;
  const done = allLessons.filter((l) => completedLessons.includes(l.id)).length;
  return Math.round((done / allLessons.length) * 100);
}

export type ModuleState = "complete" | "in-progress" | "available" | "locked";

/** Modules unlock sequentially: a module is available once the previous one is complete. */
export function moduleState(module: Module, completedLessons: string[]): ModuleState {
  const idx = modules.findIndex((m) => m.id === module.id);
  const doneCount = module.lessons.filter((l) => completedLessons.includes(l.id)).length;
  if (doneCount === module.lessons.length) return "complete";
  if (doneCount > 0) return "in-progress";
  if (idx === 0) return "available";
  const prev = modules[idx - 1];
  const prevDone = prev.lessons.every((l) => completedLessons.includes(l.id));
  return prevDone ? "available" : "locked";
}
