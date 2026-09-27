import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "good" | "warn" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-ink-soft",
  accent: "bg-accent-soft text-accent-strong",
  good: "bg-good-soft text-good",
  warn: "bg-amber-50 text-warn",
  danger: "bg-danger-soft text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
