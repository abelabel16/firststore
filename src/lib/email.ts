import { site } from "@/config/site";

/**
 * Transactional email.
 *
 * With RESEND_API_KEY set, emails are sent through Resend. Without it (local
 * development), emails are printed to the server console so the full flow is
 * testable with zero setup.
 *
 * Only transactional emails exist here — purchase receipts, access links,
 * session confirmations. No marketing sequences.
 */

interface EmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `\n━━━ EMAIL (dev console transport) ━━━\nTo: ${to}\nSubject: ${subject}\n\n${html.replace(/<[^>]+>/g, "")}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    );
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Email send failed:", res.status, await res.text());
  }
}

function layout(body: string): string {
  return `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#18181b;">
    <p style="font-weight:700;font-size:16px;letter-spacing:-0.02em;">${site.name.toLowerCase()}<span style="color:#4f46e5">.</span></p>
    ${body}
    <p style="margin-top:32px;font-size:12px;color:#71717a;">
      Questions? Reply to this email or write to ${site.supportEmail}.
    </p>
  </div>`;
}

export async function sendCoursePurchaseEmail(to: string, name: string): Promise<void> {
  const loginUrl = `${site.url}/login`;
  await sendEmail({
    to,
    subject: `Your course access — ${site.name}`,
    html: layout(`
      <h2 style="font-size:20px;">You're in, ${name}.</h2>
      <p>Your purchase of <strong>${site.course.name}</strong> is confirmed.</p>
      <p>To access your course, log in with this email address:</p>
      <p><a href="${loginUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Open my course</a></p>
      <p style="font-size:13px;color:#71717a;">Access is tied to this email (${to}). You can log in from any device.</p>
    `),
  });
}

export async function sendVipPurchaseEmail(to: string, name: string): Promise<void> {
  const onboardingUrl = `${site.url}/vip/onboarding`;
  await sendEmail({
    to,
    subject: `Welcome to VIP — ${site.name}`,
    html: layout(`
      <h2 style="font-size:20px;">Welcome to VIP, ${name}.</h2>
      <p>Your <strong>${site.mentorship.name}</strong> purchase is confirmed. Course access is included.</p>
      <p>The first step is a short onboarding so your mentor understands where you are and what you need:</p>
      <p><a href="${onboardingUrl}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Start onboarding</a></p>
      <p style="font-size:13px;color:#71717a;">Access is tied to this email (${to}).</p>
    `),
  });
}

export async function sendLoginLinkEmail(to: string, token: string): Promise<void> {
  const url = `${site.url}/api/auth/verify?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to,
    subject: `Your login link — ${site.name}`,
    html: layout(`
      <h2 style="font-size:20px;">Log in to ${site.name}</h2>
      <p>Click below to log in. This link expires in 30 minutes.</p>
      <p><a href="${url}" style="display:inline-block;background:#18181b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Log in</a></p>
      <p style="font-size:13px;color:#71717a;">If you didn't request this, you can safely ignore this email.</p>
    `),
  });
}

export async function sendSessionConfirmationEmail(
  to: string,
  date: string,
  time: string
): Promise<void> {
  await sendEmail({
    to,
    subject: `Session booked — ${site.name}`,
    html: layout(`
      <h2 style="font-size:20px;">Your session is booked.</h2>
      <p><strong>${date}</strong> at <strong>${time}</strong>.</p>
      <p>Before the session, fill in your preparation details (store URL, product URL, questions) from your VIP dashboard so we can make the most of the time.</p>
      <p><a href="${site.url}/vip" style="display:inline-block;background:#18181b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Open VIP dashboard</a></p>
    `),
  });
}
