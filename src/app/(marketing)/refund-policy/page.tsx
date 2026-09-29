import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="September 2026"
      intro="Both products come with a 14-day refund. Here is exactly how it works."
      sections={[
        {
          heading: "Course refunds",
          paragraphs: [
            `If the course isn't what you expected, message ${site.telegram} on Telegram within 14 days of purchase and we'll refund the full amount. We may ask what didn't work for you, but answering is optional and never a condition of the refund.`,
            "Refunds are returned to the original payment method. Depending on your bank or payment provider, the money can take several business days to appear.",
          ],
        },
        {
          heading: "VIP Accelerator refunds",
          paragraphs: [
            "Same terms as the course: message us within 14 days of purchase and we'll refund the full amount. VIP is a digital product, so there are no special conditions or exceptions.",
          ],
        },
        {
          heading: "What isn't covered",
          paragraphs: [
            "We can't refund costs you incurred elsewhere, such as store subscriptions, ads, or samples. Those are payments to other companies.",
          ],
        },
        {
          heading: "How to request a refund",
          paragraphs: [
            `Message ${site.telegram} on Telegram with the email you purchased with and the word "refund". That's it. Requests are usually processed within 2 business days.`,
          ],
        },
      ]}
    />
  );
}
