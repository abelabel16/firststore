import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.entitlements.includes("vip")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const required = ["hasStore", "selling", "stage", "strugglingWith", "goal", "biggestProblem"];
  for (const field of required) {
    if (!body[field]?.trim()) {
      return NextResponse.json({ error: "Please answer every question." }, { status: 400 });
    }
  }

  updateUser(user.email, {
    name: body.name?.trim() || user.name,
    vipOnboarding: {
      hasStore: body.hasStore.trim(),
      selling: body.selling.trim(),
      stage: body.stage.trim(),
      strugglingWith: body.strugglingWith.trim(),
      goal: body.goal.trim(),
      biggestProblem: body.biggestProblem.trim(),
      completedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json({ ok: true });
}
