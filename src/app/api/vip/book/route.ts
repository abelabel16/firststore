import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createSession } from "@/lib/db";
import { sendSessionConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.entitlements.includes("vip")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: { date?: string; time?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date) || !body.time || !/^\d{2}:\d{2}$/.test(body.time)) {
    return NextResponse.json({ error: "Please choose a date and time." }, { status: 400 });
  }
  if (new Date(`${body.date}T${body.time}:00`) < new Date()) {
    return NextResponse.json({ error: "Please choose a time in the future." }, { status: 400 });
  }

  const session = createSession({ email: user.email, date: body.date, time: body.time });
  await sendSessionConfirmationEmail(user.email, body.date, body.time);
  return NextResponse.json({ ok: true, sessionId: session.id });
}
