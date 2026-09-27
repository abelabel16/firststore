import { NextResponse } from "next/server";
import { createTicket } from "@/lib/db";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, subject, message } = body;
  if (
    !name?.trim() ||
    !email ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !subject?.trim() ||
    !message?.trim()
  ) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  createTicket({ email, name, source: "contact", subject, message });
  return NextResponse.json({ ok: true });
}
