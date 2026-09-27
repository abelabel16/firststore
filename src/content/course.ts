/**
 * Course curriculum.
 *
 * This is the sample curriculum used across the marketing site and the course
 * platform. Replace lesson titles/descriptions and video URLs with your real
 * content. Lesson `videoUrl` accepts any embeddable URL (YouTube unlisted,
 * Vimeo, Bunny Stream, etc.).
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

export const modules: Module[] = [
  {
    id: "m1",
    number: "01",
    title: "Foundations",
    summary: "How dropshipping actually works, the model, the economics, and what realistically goes wrong.",
    detail:
      "The business model explained without hype: unit economics, margins, what a supplier does, what you're responsible for, and the honest failure modes so you can avoid them.",
    lessons: [
      { id: "l-1-1", title: "How the dropshipping model works", description: "The full order flow from customer to supplier, and where you fit in.", duration: "9 min", videoUrl: null, resources: [] },
      { id: "l-1-2", title: "Unit economics: margins, fees, and break-even", description: "A simple spreadsheet mindset for whether a product can be profitable.", duration: "12 min", videoUrl: null, resources: [{ label: "Margin calculator template", href: "/resources" }] },
      { id: "l-1-3", title: "What realistically goes wrong (and why)", description: "The common failure points, product choice, shipping times, weak content, before you hit them.", duration: "10 min", videoUrl: null, resources: [] },
      { id: "l-1-4", title: "Setting a realistic budget and timeline", description: "What it costs to test properly and how long validation usually takes.", duration: "8 min", videoUrl: null, resources: [] },
    ],
  },
  {
    id: "m2",
    number: "02",
    title: "Product Research",
    summary: "A repeatable process for finding and evaluating products using real demand signals.",
    detail:
      "How to generate product ideas, read demand signals, evaluate competition, and score candidates with a consistent checklist instead of guessing.",
    lessons: [
      { id: "l-2-1", title: "Where product ideas come from", description: "Systematic sources for ideas: marketplaces, ad libraries, communities.", duration: "11 min", videoUrl: null, resources: [] },
      { id: "l-2-2", title: "Reading demand signals", description: "Search trends, ad engagement, and marketplace data, what each signal actually tells you.", duration: "14 min", videoUrl: null, resources: [] },
      { id: "l-2-3", title: "Evaluating the competition", description: "How to study competing stores and decide if there's room for you.", duration: "12 min", videoUrl: null, resources: [] },
      { id: "l-2-4", title: "The product scoring checklist", description: "Score every candidate the same way so decisions are comparable.", duration: "9 min", videoUrl: null, resources: [{ label: "Product research checklist", href: "/resources" }] },
    ],
  },
  {
    id: "m3",
    number: "03",
    title: "Store Setup",
    summary: "Build a clean, trustworthy store, structure, product pages, policies, and checkout.",
    detail:
      "Step-by-step store build: theme and structure, product pages that answer real customer questions, trust elements, policies, and a checkout that doesn't leak sales.",
    lessons: [
      { id: "l-3-1", title: "Store structure and theme setup", description: "A minimal store layout that looks professional on day one.", duration: "15 min", videoUrl: null, resources: [] },
      { id: "l-3-2", title: "Product pages that answer questions", description: "Copy and layout: what customers need to know before they buy.", duration: "13 min", videoUrl: null, resources: [] },
      { id: "l-3-3", title: "Trust: policies, contact, and shipping clarity", description: "The trust elements customers check before entering card details.", duration: "10 min", videoUrl: null, resources: [{ label: "Store launch checklist", href: "/resources" }] },
      { id: "l-3-4", title: "Payments, taxes, and checkout basics", description: "Getting the boring-but-critical settings right.", duration: "11 min", videoUrl: null, resources: [] },
    ],
  },
  {
    id: "m4",
    number: "04",
    title: "Suppliers",
    summary: "Find reliable suppliers, evaluate quality, and set up fulfillment that doesn't burn customers.",
    detail:
      "How to source suppliers, order samples, judge quality and shipping times, and set up a fulfillment flow you can actually stand behind.",
    lessons: [
      { id: "l-4-1", title: "Finding and comparing suppliers", description: "Where to look and what to compare beyond price.", duration: "12 min", videoUrl: null, resources: [{ label: "Supplier vetting checklist", href: "/resources" }] },
      { id: "l-4-2", title: "Samples: judging quality before you sell", description: "Why samples are non-negotiable and what to check when they arrive.", duration: "8 min", videoUrl: null, resources: [] },
      { id: "l-4-3", title: "Shipping times and customer expectations", description: "Setting honest expectations that prevent refunds and chargebacks.", duration: "9 min", videoUrl: null, resources: [] },
    ],
  },
  {
    id: "m5",
    number: "05",
    title: "Content Creation",
    summary: "Plan, shoot, and edit short-form product content that explains and demonstrates.",
    detail:
      "The content system: angles and hooks, filming product demos with a phone, editing basics, and building a repeatable content pipeline.",
    lessons: [
      { id: "l-5-1", title: "Content angles: how to talk about a product", description: "Finding the angles that make a product interesting to a stranger.", duration: "13 min", videoUrl: null, resources: [{ label: "Content angle framework", href: "/resources" }] },
      { id: "l-5-2", title: "Filming demos with just a phone", description: "Lighting, framing, and shot lists for product videos.", duration: "14 min", videoUrl: null, resources: [] },
      { id: "l-5-3", title: "Editing for short-form platforms", description: "Pacing, captions, and hooks in the first two seconds.", duration: "12 min", videoUrl: null, resources: [] },
      { id: "l-5-4", title: "Building a content pipeline", description: "Producing consistently without burning out.", duration: "9 min", videoUrl: null, resources: [] },
    ],
  },
  {
    id: "m6",
    number: "06",
    title: "Traffic",
    summary: "Get your content in front of people, organic short-form first, paid basics second.",
    detail:
      "How distribution actually works: organic posting strategy, reading your analytics, and the fundamentals of paid traffic once organic gives you signal.",
    lessons: [
      { id: "l-6-1", title: "Organic short-form strategy", description: "Posting cadence, platform differences, and what to expect early on.", duration: "13 min", videoUrl: null, resources: [] },
      { id: "l-6-2", title: "Reading your analytics", description: "Which numbers matter, which are vanity, and what to change based on them.", duration: "11 min", videoUrl: null, resources: [] },
      { id: "l-6-3", title: "Paid traffic fundamentals", description: "When paid makes sense, and how to structure a first small test.", duration: "15 min", videoUrl: null, resources: [] },
    ],
  },
  {
    id: "m7",
    number: "07",
    title: "Optimization",
    summary: "Use data from real visitors to improve the store, the content, and the offer.",
    detail:
      "The improvement loop: interpreting store analytics, fixing conversion leaks, iterating content, and deciding when to push, pivot, or drop a product.",
    lessons: [
      { id: "l-7-1", title: "Store analytics: finding the leak", description: "Where visitors drop off and what each drop-off usually means.", duration: "12 min", videoUrl: null, resources: [] },
      { id: "l-7-2", title: "Iterating product pages and offers", description: "Structured changes instead of random tweaks.", duration: "10 min", videoUrl: null, resources: [] },
      { id: "l-7-3", title: "Push, pivot, or drop: making the call", description: "A decision framework for what to do after a test.", duration: "11 min", videoUrl: null, resources: [] },
    ],
  },
  {
    id: "m8",
    number: "08",
    title: "Launch",
    summary: "Put it all together: a structured launch plan and how to operate week to week.",
    detail:
      "The complete launch sequence, the first two weeks of operating, handling orders and customer service, and planning your next test.",
    lessons: [
      { id: "l-8-1", title: "The launch checklist", description: "Everything verified before you turn traffic on.", duration: "10 min", videoUrl: null, resources: [{ label: "Launch checklist", href: "/resources" }] },
      { id: "l-8-2", title: "The first two weeks", description: "A week-by-week operating plan after launch.", duration: "12 min", videoUrl: null, resources: [] },
      { id: "l-8-3", title: "Orders, customer service, and refunds", description: "Handling the operational side without losing your evenings.", duration: "11 min", videoUrl: null, resources: [] },
      { id: "l-8-4", title: "Planning your next test", description: "Turning what you learned into a better second attempt.", duration: "8 min", videoUrl: null, resources: [] },
    ],
  },
];

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
