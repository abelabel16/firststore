import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-12 sm:items-center sm:py-16">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="py-6">
        <p className="text-center text-xs text-ink-faint">
          Trouble logging in?{" "}
          <Link href="/forgot-access" className="underline hover:text-ink-soft">
            Request access help
          </Link>
        </p>
      </footer>
    </div>
  );
}
