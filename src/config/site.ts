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
    "A practical dropshipping course and 1-to-1 mentorship. Learn product research, store setup, content, and traffic, a real process, not income promises.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: "support@vibrantflacon.com",
  telegram: "@netro_s",
  telegramUrl: "https://t.me/netro_s",

  course: {
    name: "The Dropshipping Course",
    price: 19,
    referencePrice: 199 as number | null,
    discountLabel: "90% OFF",
  },

  mentorship: {
    name: "VIP Mentorship",
    price: 499,
    // If you genuinely cap the number of active mentorship clients, describe
    // it here truthfully (e.g. "Limited to 10 active clients so every store
    // gets real attention"). Leave null to show nothing.
    capacityNote:
      "Mentorship is intentionally kept small so every client gets real attention." as
        | string
        | null,
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
