import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import type { User } from "@/lib/db";

export interface AppNavLink {
  href: string;
  label: string;
}

/**
 * Header for the logged-in platform (student and VIP areas).
 * Mobile-first: nav links scroll horizontally under the bar on small screens.
 */
export function AppHeader({
  user,
  links,
  homeHref,
}: {
  user: User;
  links: AppNavLink[];
  homeHref: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href={homeHref} />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Platform">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-zinc-100 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-40 truncate text-sm text-ink-faint sm:block">
            {user.email}
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:bg-zinc-50 hover:text-ink"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden"
        aria-label="Platform"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-ink-soft hover:bg-zinc-100 hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
