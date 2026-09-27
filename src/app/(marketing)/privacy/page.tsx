import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 2026"
      intro={`This policy explains what data ${site.name} collects, why, and what we do with it. Short version: we collect what's needed to sell you a product and give you access to it — nothing more.`}
      sections={[
        {
          heading: "1. What we collect",
          paragraphs: [
            "When you purchase, we collect your name and email address, plus your order details (product, amount, payment status). Payment card details are handled entirely by our payment provider and never touch our servers.",
            "If you use the mentorship program, we also store the information you provide in onboarding, session preparation, and support requests — this exists so your mentor can actually help you.",
            "If you contact us, we keep the message so we can reply and resolve the issue.",
          ],
        },
        {
          heading: "2. What we use it for",
          paragraphs: [
            "Providing access to your purchase, sending transactional emails (receipts, login links, session confirmations), providing mentorship services, and responding to support requests. We do not sell your data, and we don't send marketing email you didn't ask for.",
          ],
        },
        {
          heading: "3. Who we share it with",
          paragraphs: [
            "Only the service providers needed to run the product: our payment provider (to process your payment) and our email provider (to deliver transactional emails). Each receives only what it needs.",
          ],
        },
        {
          heading: "4. Cookies",
          paragraphs: [
            "We use one essential cookie: your login session. There are no advertising or cross-site tracking cookies on this site.",
          ],
        },
        {
          heading: "5. Retention and deletion",
          paragraphs: [
            "We keep your account data for as long as you have access to a product. You can request a copy of your data or ask us to delete your account at any time by emailing us — note that deleting your account removes your access.",
          ],
        },
        {
          heading: "6. Contact",
          paragraphs: [`Privacy questions or requests: ${site.supportEmail}.`],
        },
      ]}
    />
  );
}
