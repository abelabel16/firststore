import { Card } from "@/components/ui/card";
import { site } from "@/config/site";

const steps = [
  { n: "1", text: "Pay securely" },
  { n: "2", text: "Everything arrives at your email within 24 hours, usually minutes" },
  { n: "3", text: "Start building" },
];

export function NextSteps() {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        What happens next
      </p>
      <ol className="mt-3 space-y-2.5">
        {steps.map((s) => (
          <li key={s.n} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold tabular-nums text-accent-strong">
              {s.n}
            </span>
            <p className="pt-0.5 text-sm leading-snug text-ink-soft">{s.text}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-2 text-xs text-ink-faint">
      <span className="flex items-center gap-1.5">
        <svg width="11" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
          <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        Secure checkout
      </span>
      <span>⚡ Email delivery</span>
      <span>↩ 14-day refunds</span>
      <span>💬 {site.telegram}</span>
    </div>
  );
}
