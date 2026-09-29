import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger" | "inverse" | "outlineDark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-zinc-700 shadow-sm",
  accent: "bg-accent text-white hover:bg-accent-strong shadow-sm",
  secondary: "bg-surface text-ink border border-line hover:border-zinc-300 hover:bg-zinc-50",
  ghost: "text-ink-soft hover:text-ink hover:bg-zinc-100",
  danger: "bg-danger text-white hover:bg-red-700",
  /* For dark backgrounds. Never stack color overrides via className:
     conflicting utilities resolve by stylesheet order, not class order. */
  inverse: "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm",
  outlineDark: "border border-zinc-600 text-white hover:bg-zinc-800",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  target,
  rel,
}: CommonProps & { href: string; target?: string; rel?: string }) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
