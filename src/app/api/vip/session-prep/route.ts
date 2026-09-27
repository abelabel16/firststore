import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { findSession, updateSession } from "@/lib/db";

/** Saves session preparation (store URL, product URL, questions) for the owner's session. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.entitlements.includes("vip")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: { sessionId?: string; storeUrl?: string; productUrl?: string; questions?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const session = body.sessionId ? findSession(body.sessionId) : undefined;
  if (!session || session.email !== user.email) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  updateSession(session.id, {
    prep: {
      storeUrl: body.storeUrl?.trim() ?? "",
      productUrl: body.productUrl?.trim() ?? "",
      questions: body.questions?.trim() ?? "",
    },
  });
  return NextResponse.json({ ok: true });
}
