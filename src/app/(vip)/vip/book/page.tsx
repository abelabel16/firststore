import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { listSessionsByEmail } from "@/lib/db";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = { title: "Book a Session" };

export default async function BookPage() {
  const user = await requireEntitlement("vip");
  const upcoming = listSessionsByEmail(user.email).find((s) => s.status === "upcoming");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Book your 1-to-1 session
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Pick a time that works for you. After booking, add your preparation — store URL, product
          URL, questions — so the session goes straight to what matters.
        </p>
      </div>

      {upcoming && (
        <Card className="p-4">
          <p className="text-sm text-ink-soft">
            You already have a session on{" "}
            <strong className="text-ink">
              {upcoming.date} at {upcoming.time}
            </strong>
            .{" "}
            <Link href={`/vip/session/${upcoming.id}`} className="font-medium text-accent hover:text-accent-strong">
              View it →
            </Link>
          </p>
        </Card>
      )}

      <Card className="p-5 sm:p-8">
        <BookingForm />
      </Card>
    </div>
  );
}
