import { NextResponse } from "next/server";
import { createLoginToken, isAdminEmail } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";
import { sendLoginLinkEmail } from "@/lib/email";

/**
 * Sends a magic login link.
 * Always responds with success — whether or not the email has an account —
 * so this endpoint can't be used to probe which emails are customers.
 */
export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const user = findUserByEmail(email);
  if (user || isAdminEmail(email)) {
    await sendLoginLinkEmail(email, createLoginToken(email));
  }

  return NextResponse.json({ ok: true });
}
