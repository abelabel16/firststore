import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { createSessionCookie, isAdminEmail, verifyLoginToken } from "@/lib/auth";
import { findUserByEmail, upsertUser } from "@/lib/db";

/** Login-link landing: verifies the token, starts a session, and routes the user. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const email = verifyLoginToken(token);

  if (!email) {
    return NextResponse.redirect(`${site.url}/login?error=expired`);
  }

  // Admins may not have a purchase record; create their user on first login.
  const user = findUserByEmail(email) ?? (isAdminEmail(email) ? upsertUser(email) : null);
  if (!user) {
    return NextResponse.redirect(`${site.url}/login?error=no-account`);
  }

  await createSessionCookie(email);

  let destination = "/dashboard";
  if (isAdminEmail(email)) destination = "/admin";
  else if (user.entitlements.includes("vip")) {
    destination = user.vipOnboarding ? "/vip" : "/vip/onboarding";
  }
  return NextResponse.redirect(`${site.url}${destination}`);
}
