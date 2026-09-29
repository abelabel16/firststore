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

/* ────────────────────────── email building blocks ──────────────────────────
   Gmail/Outlook-safe HTML: tables for structure, inline styles only. */

const BRAND = "#4f46e5";
const INK = "#18181b";

function emailShell(inner: string, preheader: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f4f4f5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e4e4e7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<tr><td style="background:${INK};padding:22px 32px;">
  <span style="font-size:19px;font-weight:800;letter-spacing:-0.3px;color:#ffffff;">vibrantflacon</span><span style="font-size:19px;font-weight:800;color:${BRAND};">.</span>
</td></tr>
${inner}
</table>
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding:18px 12px;text-align:center;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#a1a1aa;line-height:1.6;">
  VibrantFlacon · vibrantflacon.com
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function button(href: string, label: string, bg = INK): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
  <td style="border-radius:12px;background:${bg};">
    <a href="${href}" style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${label}</a>
  </td></tr></table>`;
}

function detailRow(label: string, value: string, last = false): string {
  return `<tr>
    <td style="padding:11px 0;font-size:13px;color:#71717a;${last ? "" : "border-bottom:1px solid #f0f0f2;"}">${label}</td>
    <td align="right" style="padding:11px 0;font-size:13px;font-weight:700;color:${INK};${last ? "" : "border-bottom:1px solid #f0f0f2;"}">${value}</td>
  </tr>`;
}

/* ───────────────────────── customer access email ───────────────────────── */

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
  const telegram = Deno.env.get("SUPPORT_TELEGRAM") ?? "@netro_s";
  const firstName = (name.split(" ")[0] || "there").replace(/[<>&]/g, "");

  const isVip = product === "vip";
  const productName = isVip ? "VIP Accelerator" : "The Dropshipping Course";
  const amount = receipt?.amountUsd ?? (isVip ? 199 : 19);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const subject = isVip
    ? "Welcome to VIP: your receipt and access"
    : "You're in: your receipt and course access";

  const included = isVip
    ? ["The full course, all 8 modules", "Advanced deep-dive guides", "Store &amp; product audit systems", "Content review rubric + action plan templates", "Private community access", "Priority support and lifetime updates"]
    : ["Every video lesson in the course", "Every future course update, free"];

  const inner = `
<tr><td style="padding:34px 32px 8px;">
  <h1 style="margin:0;font-size:24px;line-height:1.3;color:${INK};font-weight:800;">${isVip ? `Welcome to VIP, ${firstName}. 🤝` : `You're in, ${firstName}. 🎉`}</h1>
  <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#52525b;">
    Thank you for your purchase. ${isVip ? "You now own the complete system, course included." : "You just took the first real step toward your first store."} Keep this email: everything you need is right here.
  </p>
</td></tr>
<tr><td style="padding:22px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #ececee;border-radius:14px;">
    <tr><td style="padding:20px 22px;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:1.6px;color:#a1a1aa;">RECEIPT</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Product", productName)}
        ${detailRow("Amount", `$${amount} USD`)}
        ${detailRow("Date", date)}
        ${receipt?.orderRef ? detailRow("Order reference", receipt.orderRef.slice(0, 18)) : ""}
        ${detailRow("Payment", "One-time. Never a subscription.", true)}
      </table>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:24px 32px 0;">
  <p style="margin:0 0 10px;font-size:10px;font-weight:800;letter-spacing:1.6px;color:#a1a1aa;">WHAT'S INCLUDED</p>
  ${included.map((i) => `<p style="margin:0 0 8px;font-size:14px;color:${INK};"><span style="color:#059669;font-weight:800;">✓</span>&nbsp;&nbsp;${i}</p>`).join("")}
</td></tr>
<tr><td style="padding:22px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="border-left:3px solid ${BRAND};padding:4px 0 4px 16px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:${INK};line-height:1.5;">Your ${isVip ? "VIP access" : "course"} arrives at this email within 24 hours.</p>
      <p style="margin:6px 0 0;font-size:13px;line-height:1.7;color:#52525b;">Usually much faster. Nothing after 24 hours? Check spam, then message <strong>${telegram}</strong> on Telegram with this email address and it will be resent right away.</p>
    </td>
  </tr></table>
</td></tr>
${accessUrl ? `<tr><td align="center" style="padding:28px 32px 4px;">${button(accessUrl, isVip ? "Open Your VIP Access" : "Open Your Course")}<p style="margin:10px 0 0;font-size:11px;color:#a1a1aa;">This button is your permanent access.</p></td></tr>` : ""}
<tr><td style="padding:26px 32px 6px;">
  <p style="margin:0;font-size:13px;line-height:1.8;color:#52525b;">Before you start: go one module at a time and let real data make your decisions.</p>
  <p style="margin:14px 0 0;font-size:14px;color:${INK};font-weight:600;">Let's build. 🚀<br/><span style="font-weight:400;color:#71717a;">Vibrant Flacon</span></p>
</td></tr>
<tr><td style="padding:20px 32px 26px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="border-top:1px solid #ececee;padding-top:16px;font-size:11.5px;line-height:1.7;color:#a1a1aa;">
      Questions or refunds: message ${telegram} on Telegram. 14-day refund policy.
    </td>
  </tr></table>
</td></tr>`;

  const html = emailShell(inner, `Your ${productName} receipt and access details.`);

  if (!apiKey) {
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

/* ─────────────────────────── owner sale alert ─────────────────────────── */

export async function sendOwnerSaleAlert(
  buyerEmail: string,
  buyerName: string,
  product: "course" | "vip",
  amountUsd?: number
): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const owner = Deno.env.get("OWNER_EMAIL");
  if (!apiKey || !owner) return;
  const productName = product === "vip" ? "VIP Accelerator" : "The Dropshipping Course";
  const amount = amountUsd ?? (product === "vip" ? 199 : 19);
  const time = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  });

  const inner = `
<tr><td align="center" style="padding:38px 32px 0;">
  <p style="margin:0;font-size:13px;font-weight:800;letter-spacing:2px;color:#059669;">NEW SALE 🎉</p>
  <p style="margin:10px 0 0;font-size:46px;font-weight:800;letter-spacing:-1px;color:${INK};">$${amount}</p>
  <p style="margin:6px 0 0;font-size:15px;color:#52525b;">${productName}</p>
</td></tr>
<tr><td style="padding:26px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #ececee;border-radius:14px;">
    <tr><td style="padding:18px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Buyer", buyerName ? buyerName.replace(/[<>&]/g, "") : "No name given")}
        ${detailRow("Email", buyerEmail)}
        ${detailRow("Time", `${time} (Addis)`, true)}
      </table>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:22px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="border-left:3px solid ${BRAND};padding:4px 0 4px 16px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:${INK};">Your move: deliver within 24 hours.</p>
      <p style="margin:5px 0 0;font-size:13px;line-height:1.7;color:#52525b;">Send the ${product === "vip" ? "VIP materials and community invite" : "course materials"} to <strong>${buyerEmail}</strong>. Their receipt was already sent automatically.</p>
    </td>
  </tr></table>
</td></tr>
<tr><td align="center" style="padding:28px 32px 34px;">
  ${button("https://vibrantflacon.com/login/", "Open Admin Panel", BRAND)}
</td></tr>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("EMAIL_FROM") ?? "VibrantFlacon <onboarding@resend.dev>",
      to: owner,
      subject: `🎉 $${amount} sale: ${productName}`,
      html: emailShell(inner, `${buyerEmail} just bought ${productName}.`),
    }),
  }).catch((e) => console.error("owner alert failed", e));
}

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
