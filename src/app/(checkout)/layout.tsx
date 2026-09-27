import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { site } from "@/config/site";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <span className="flex items-center gap-1.5 text-xs text-ink-faint">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Secure checkout
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line py-6">
        <p className="text-center text-xs text-ink-faint">
          Questions?{" "}
          <Link href="/contact" className="underline hover:text-ink-soft">
            Contact support
          </Link>{" "}
          · {site.supportEmail}
        </p>
      </footer>
    </div>
  );
}
