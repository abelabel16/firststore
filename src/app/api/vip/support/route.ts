import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createTicket } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.entitlements.includes("vip")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: { subject?: string; message?: string; storeUrl?: string; productUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.subject?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Please add a subject and your question." }, { status: 400 });
  }

  createTicket({
    email: user.email,
    name: user.name,
    source: "vip",
    subject: body.subject,
    message: body.message,
    storeUrl: body.storeUrl,
    productUrl: body.productUrl,
  });
  return NextResponse.json({ ok: true });
}
