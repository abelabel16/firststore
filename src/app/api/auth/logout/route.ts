import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  return NextResponse.redirect(`${site.url}/`, 303);
}
