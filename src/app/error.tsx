"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Something went wrong.</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        An unexpected error occurred. Your data is safe — try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
