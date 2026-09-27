import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo />
      <p className="mt-8 text-sm text-ink-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        The link may be old or mistyped. Everything important is one click away.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Back to home
      </Link>
    </div>
  );
}
