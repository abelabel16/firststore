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
  product: "course" | "vip",
  receipt?: { amountUsd?: number; orderRef?: string }
): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const accessUrl =
    product === "vip"
      ? Deno.env.get("VIP_ACCESS_URL") ?? Deno.env.get("COURSE_ACCESS_URL")
      : Deno.env.get("COURSE_ACCESS_URL");
  const support = Deno.env.get("SUPPORT_EMAIL") ?? "support@vibrantflacon.com";
  const telegram = Deno.env.get("SUPPORT_TELEGRAM") ?? "@netro_s";
  const firstName = (name.split(" ")[0] || "there").replace(/[<>&]/g, "");

  const isVip = product === "vip";
  const productName = isVip ? "VIP Mentorship" : "The Dropshipping Course";
  const amount = receipt?.amountUsd ?? (isVip ? 499 : 19);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const subject = isVip
    ? "Welcome to VIP: your receipt and what happens next"
    : "You're in: your receipt and course access";

  const included = isVip
    ? ["1-to-1 mentorship sessions", "Store, product, and content reviews", "Personalized action plans", "Private community access", "Full course access included"]
    : ["All 8 modules, 29 video lessons", "Checklists, templates, and frameworks", "The complete resource library", "Every future course update, free"];

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;font-size:13px;color:#71717a;">${label}</td><td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:600;text-align:right;">${value}</td></tr>`;

  const html = `
  <div style="background:#f4f4f5;padding:24px 8px;">
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
    <div style="padding:28px 28px 0;">
      <p style="font-weight:700;font-size:17px;margin:0;">vibrantflacon<span style="color:#4f46e5">.</span></p>
    </div>
    <div style="padding:24px 28px;">
      <h1 style="font-size:22px;margin:0 0 8px;color:#18181b;">${isVip ? `Welcome to VIP, ${firstName}. 🤝` : `You're in, ${firstName}. 🎉`}</h1>
      <p style="font-size:14px;line-height:1.6;color:#52525b;margin:0;">
        Thank you for your purchase. ${isVip ? "Your mentorship starts now, and the full course is included." : "You just took the first real step toward your first store."}
        Here is everything you need, all in one email worth keeping.
      </p>

      <!-- Receipt -->
      <div style="margin:24px 0;border:1px solid #e4e4e7;border-radius:12px;padding:18px 20px;background:#fafafa;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;color:#a1a1aa;">YOUR RECEIPT</p>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Product", productName)}
          ${row("Amount", `$${amount} USD`)}
          ${row("Date", date)}
          ${receipt?.orderRef ? row("Order reference", receipt.orderRef) : ""}
          ${row("Payment", "One-time. No subscription, ever.")}
        </table>
        <p style="margin:10px 0 0;font-size:12px;color:#a1a1aa;">The official tax invoice from our payment provider arrives in a separate email.</p>
      </div>

      <!-- What you get -->
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1px;color:#a1a1aa;">WHAT'S INCLUDED</p>
      ${included.map((i) => `<p style="margin:0 0 6px;font-size:14px;color:#18181b;">✓&nbsp; ${i}</p>`).join("")}

      <!-- Delivery -->
      <div style="margin:24px 0;border-left:3px solid #4f46e5;padding:2px 0 2px 14px;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:#18181b;font-weight:600;">
          ${isVip ? "Your onboarding link arrives at this email address within 24 hours." : "Your course access arrives at this email address within 24 hours."}
        </p>
        <p style="margin:6px 0 0;font-size:13px;line-height:1.6;color:#52525b;">
          Usually it's much faster. If nothing lands within 24 hours, check spam first, then message us on Telegram at <strong>${telegram}</strong> or reply to this email, and we'll sort it out immediately.
        </p>
      </div>
      ${
        accessUrl
          ? `<a href="${accessUrl}" style="display:inline-block;background:#18181b;color:#ffffff;padding:13px 24px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">${isVip ? "Start VIP Onboarding" : "Open Your Course"}</a>
             <p style="margin:10px 0 0;font-size:12px;color:#a1a1aa;">This button is your permanent access. Keep this email safe.</p>`
          : ""
      }

      <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#52525b;">
        One honest reminder before you start: this is education, not a shortcut. The students who get the most out of it are the ones who treat the first store as practice, follow the process, and let real data make their decisions. Take it one module at a time, and don't skip the checklists.
      </p>
      <p style="margin:16px 0 0;font-size:14px;color:#18181b;">Let's build. 🚀<br/><span style="color:#71717a;">The ${"VibrantFlacon"} team</span></p>
    </div>
    <div style="padding:18px 28px;border-top:1px solid #e4e4e7;background:#fafafa;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#a1a1aa;">
        Questions or refunds: reply to this email, write to ${support}, or Telegram ${telegram}.
        Our refund policy is simple and honest, no fine-print games.
      </p>
    </div>
  </div>
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
