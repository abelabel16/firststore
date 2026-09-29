import { modules } from "@/content/course";

/**
 * The course topics as a numbered list. `compact` shows titles only, for the
 * hero; the full version adds each module's one-line summary.
 */
export function CurriculumList({ compact }: { compact?: boolean }) {
  return (
    <ol data-curriculum className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {modules.map((m) => (
        <li key={m.id} className={`flex gap-4 px-5 ${compact ? "py-3" : "py-4 sm:px-6"}`}>
          <span className="w-6 shrink-0 pt-px text-sm font-semibold tabular-nums text-accent">
            {m.number}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink sm:text-base">{m.title}</p>
            {!compact && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{m.summary}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
