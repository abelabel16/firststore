import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/app/logout-button";

export interface AppNavLink {
  href: string;
  label: string;
}

/**
 * Header for the logged-in platform (student and VIP areas).
 * Mobile-first: nav links scroll horizontally under the bar on small screens.
 */
export function AppHeader({
  email,
  links,
  homeHref,
}: {
  email: string;
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
          <span className="hidden max-w-40 truncate text-sm text-ink-faint sm:block">{email}</span>
          <LogoutButton />
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
