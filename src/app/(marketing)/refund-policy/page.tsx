import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="September 2026"
      intro="We'd rather refund you than have you feel tricked. Here is exactly how refunds work, no fine-print games."
      sections={[
        {
          heading: "Course refunds",
          paragraphs: [
            `If the course isn't what you expected, email ${site.supportEmail} within 14 days of purchase and we'll refund the full amount. We may ask what didn't work for you, honest feedback helps us improve, but answering is optional and never a condition of the refund.`,
            "Refunds are returned to the original payment method. Depending on your bank or payment provider, the money can take several business days to appear.",
          ],
        },
        {
          heading: "Mentorship refunds",
          paragraphs: [
            "Because mentorship involves reserved personal time, the terms are slightly different: you can request a full refund within 7 days of purchase as long as your first 1-to-1 session hasn't taken place. After your first session, refunds are handled case by case, if the program genuinely isn't serving you, contact us and we'll find a fair resolution, which may be a partial refund.",
          ],
        },
        {
          heading: "What we don't do",
          paragraphs: [
            "We don't refuse refunds on technicalities, and we don't make you jump through hoops. We also can't refund costs you incurred elsewhere (store subscriptions, ads, samples), those are payments to other companies and decisions you made in your own business.",
          ],
        },
        {
          heading: "How to request a refund",
          paragraphs: [
            `Email ${site.supportEmail} from the address you purchased with, and include the word "refund" in the subject. That's it. We usually process requests within 2 business days.`,
          ],
        },
      ]}
    />
  );
}
