/**
 * Central business configuration.
 * Change the brand name, prices, and support email here, everything on the
 * site reads from this file.
 *
 * NOTE ON THE REFERENCE PRICE: the crossed-out $199 must reflect a genuine
 * original/reference price for the course. If it doesn't, set
 * `course.referencePrice` to null and the UI will simply show $19.
 */
export const site = {
  name: "VibrantFlacon",
  tagline: "Build your first dropshipping store.",
  description:
    "The Dropshipping Course by Vibrant Flacon: every step from starting broke to handling orders, including the mistakes. Video lessons, PDF guides, and books.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Support runs on Telegram; the site email has no monitored inbox.
  telegram: "@netro_s",
  telegramUrl: "https://t.me/netro_s",

  course: {
    name: "The Dropshipping Course",
    price: 19,
    referencePrice: 199 as number | null,
    discountLabel: "90% OFF",
  },

  mentorship: {
    name: "VIP Accelerator",
    price: 199,
  },
} as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
