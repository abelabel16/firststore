import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/** Grant the entitlements for a paid product (VIP includes the course). */
export async function grantEntitlements(
  admin: SupabaseClient,
  email: string,
  product: "course" | "vip"
): Promise<void> {
  const rows =
    product === "vip"
      ? [
          { email, product: "vip" },
          { email, product: "course" },
        ]
      : [{ email, product: "course" }];
  await admin.from("entitlements").upsert(rows, { onConflict: "email,product" });
  if (product === "vip") {
    await admin.from("profiles").update({ community_access: true }).eq("email", email);
  }
}

/**
 * Deliver the purchase by email (the customer never needs to log in).
 *
 * Secrets used:
 *   RESEND_API_KEY     — from resend.com (without it, delivery is only logged)
 *   EMAIL_FROM         — e.g. "VibrantFlacon <access@vibrantflacon.com>"
 *   COURSE_ACCESS_URL  — where the course lives (private video hub, Drive,
 *                        Telegram channel invite, etc.)
 *   VIP_ACCESS_URL     — onboarding link/instructions for VIP clients
 *   SUPPORT_EMAIL      — shown in the email footer
 */
export async function sendAccessEmail(
  email: string,
  name: string,
  product: "course" | "vip"
): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const accessUrl =
    product === "vip"
      ? Deno.env.get("VIP_ACCESS_URL") ?? Deno.env.get("COURSE_ACCESS_URL")
      : Deno.env.get("COURSE_ACCESS_URL");
  const support = Deno.env.get("SUPPORT_EMAIL") ?? "support@vibrantflacon.com";
  const firstName = name.split(" ")[0] || "there";

  const subject =
    product === "vip" ? "Welcome to VIP, here is everything you need" : "Your course access is here";
  const intro =
    product === "vip"
      ? `Welcome to VIP, ${firstName}. Your mentorship starts now, and full course access is included.`
      : `You're in, ${firstName}. Here is your full course access.`;
  const cta =
    product === "vip" ? "Start your VIP onboarding" : "Open the course";

  const html = `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#18181b;">
    <p style="font-weight:700;font-size:16px;">vibrantflacon<span style="color:#4f46e5">.</span></p>
    <h2 style="font-size:20px;">${intro}</h2>
    ${
      accessUrl
        ? `<p><a href="${accessUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">${cta}</a></p>
           <p style="font-size:13px;color:#71717a;">Keep this email: the button above is your permanent access.</p>`
        : `<p style="font-size:14px;">Your access details will follow in a separate email shortly.</p>`
    }
    <p style="margin-top:32px;font-size:12px;color:#71717a;">
      Bought by mistake or need help? Just reply, or write to ${support}. Our refund policy is simple and honest.
    </p>
  </div>`;

  if (!apiKey) {
    // Never log full customer emails.
    console.log(`[email skipped, no RESEND_API_KEY] to=${email.slice(0, 2)}*** product=${product}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("EMAIL_FROM") ?? "VibrantFlacon <onboarding@resend.dev>",
      to: email,
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("access email failed:", res.status, await res.text());
}

/** Origins allowed to call the checkout function from a browser. */
export const allowedOrigins = [
  "https://vibrantflacon.com",
  "https://www.vibrantflacon.com",
  "https://skdksdcw68-dev.github.io",
  "https://abelabel16.github.io",
  "http://localhost:3000",
];

/** CORS headers scoped to the requesting origin when it is on the allowlist. */
export function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0],
    Vary: "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
