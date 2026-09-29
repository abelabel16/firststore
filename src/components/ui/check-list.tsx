import { cn } from "@/lib/utils";

/** A list of included items with check marks. `dark` is for zinc-900 panels. */
export function CheckList({
  items,
  dark,
  className,
}: {
  items: string[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-center gap-2.5 text-sm ${dark ? "text-zinc-100" : "text-ink"}`}
        >
          <span
            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
              dark ? "bg-white/10 text-emerald-400" : "bg-good-soft text-good"
            }`}
            aria-hidden="true"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 5.5l2.5 2.5 4.5-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
