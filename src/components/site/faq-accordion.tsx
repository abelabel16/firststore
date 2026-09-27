import type { FaqItem } from "@/content/faq";

/** Accessible FAQ accordion built on native <details> — no JavaScript needed. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((item) => (
        <details key={item.q} className="faq group px-5 py-4 sm:px-6">
          <summary className="flex items-center justify-between gap-4 text-left text-sm font-medium text-ink sm:text-base">
            {item.q}
            <span
              className="faq-chevron flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-ink-soft"
              aria-hidden="true"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 pr-8 text-sm leading-relaxed text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
