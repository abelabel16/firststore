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
    "A practical dropshipping course plus an advanced VIP tier. Learn product research, store setup, content, and traffic, a real process, not income promises.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: "support@vibrantflacon.com",
  telegram: "@netro_s",
  telegramUrl: "https://t.me/netro_s",

  course: {
    name: "The Dropshipping Course",
    price: 19,
    referencePrice: 199 as number | null,
    discountLabel: "90% OFF",
    // Crypto costs us less to accept, so crypto buyers pay less.
    cryptoPrice: 17.99,
    cryptoDiscountLabel: "91% OFF",
  },

  mentorship: {
    name: "VIP Accelerator",
    price: 199,
    // Digital product: no capacity constraints, so no note.
    capacityNote: null as string | null,
  },

  social: {
    tiktok: "https://tiktok.com/@yourhandle",
    instagram: "https://instagram.com/yourhandle",
    youtube: "https://youtube.com/@yourhandle",
  },
} as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
