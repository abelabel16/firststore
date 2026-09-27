"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MarkCompleteButton({
  lessonId,
  completed,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function toggle() {
    setPending(true);
    setError(false);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, complete: !completed }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={toggle}
        disabled={pending}
        variant={completed ? "secondary" : "primary"}
      >
        {pending ? "Saving…" : completed ? "✓ Completed — undo" : "Mark Complete"}
      </Button>
      {error && (
        <span className="text-xs text-danger" role="alert">
          Couldn&rsquo;t save — try again.
        </span>
      )}
    </div>
  );
}
