export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Loading" role="status">
      <div className="h-8 w-56 rounded-lg bg-zinc-100" />
      <div className="h-32 rounded-2xl bg-zinc-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-2xl bg-zinc-100" />
        <div className="h-40 rounded-2xl bg-zinc-100" />
      </div>
    </div>
  );
}
