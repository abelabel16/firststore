import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { toggleLessonComplete } from "@/lib/db";
import { findLesson } from "@/content/course";

/** Marks a lesson complete/incomplete for the logged-in course customer. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.entitlements.includes("course")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: { lessonId?: string; complete?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.lessonId || !findLesson(body.lessonId)) {
    return NextResponse.json({ error: "Unknown lesson." }, { status: 400 });
  }

  toggleLessonComplete(user.email, body.lessonId, body.complete !== false);
  return NextResponse.json({ ok: true });
}
