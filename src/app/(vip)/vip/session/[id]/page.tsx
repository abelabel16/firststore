import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireEntitlement } from "@/lib/auth";
import { findSession } from "@/lib/db";
import { PrepForm } from "./prep-form";

export const metadata: Metadata = { title: "Session" };

const prepChecklist = [
  "Add your store and product URLs below",
  "Write down your questions — specific beats general",
  "Have your store analytics open during the call",
  "Be ready to share your screen",
];

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireEntitlement("vip");
  const { id } = await params;
  const session = findSession(id);
  // Owner check: a VIP client can only see their own sessions.
  if (!session || session.email !== user.email) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/vip" className="text-sm text-ink-soft hover:text-ink">
          ← VIP Home
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Session {session.number}
          </h1>
          <Badge tone={session.status === "completed" ? "good" : "accent"}>
            {session.status === "completed" ? "Completed" : "Upcoming"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {session.date} at {session.time}
        </p>
      </div>

      {session.status === "completed" ? (
        <Card className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">Your action plan</h2>
          {session.actionPlan.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">
              Your mentor is writing up your action plan — it will appear here shortly.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {session.actionPlan.map((task, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-semibold text-accent-strong">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink">{task}</p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      ) : (
        <>
          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-ink">Preparation checklist</h2>
            <ul className="mt-3 space-y-2">
              {prepChecklist.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-ink-soft">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Your preparation</h2>
            <PrepForm sessionId={session.id} prep={session.prep} />
          </Card>
        </>
      )}
    </div>
  );
}
