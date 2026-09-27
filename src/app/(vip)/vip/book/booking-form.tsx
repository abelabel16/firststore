"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIMES = ["10:00", "12:00", "15:00", "17:00"];

/** Weekdays over the next two weeks, starting tomorrow. */
function upcomingDates(): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (out.length < 10) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      out.push({
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function BookingForm() {
  const router = useRouter();
  const dates = useMemo(upcomingDates, []);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function book() {
    if (!date || !time) {
      setError("Pick a date and a time first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/vip/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time }),
      });
      const json = (await res.json()) as { sessionId?: string; error?: string };
      if (!res.ok || !json.sessionId) throw new Error(json.error);
      router.push(`/vip/session/${json.sessionId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Booking failed — try again.");
      setSubmitting(false);
    }
  }

  const chip = (selected: boolean) =>
    cn(
      "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
      selected
        ? "border-ink bg-ink text-white"
        : "border-line bg-surface text-ink-soft hover:border-zinc-300 hover:text-ink"
    );

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2.5 text-sm font-medium text-ink">Date</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {dates.map((d) => (
            <button key={d.value} type="button" onClick={() => setDate(d.value)} className={chip(date === d.value)} aria-pressed={date === d.value}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2.5 text-sm font-medium text-ink">Time</p>
        <div className="grid grid-cols-4 gap-2">
          {TIMES.map((t) => (
            <button key={t} type="button" onClick={() => setTime(t)} className={chip(time === t)} aria-pressed={time === t}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <Button onClick={book} size="lg" disabled={submitting} className="w-full">
        {submitting ? "Booking…" : "Book Session"}
      </Button>
    </div>
  );
}
