import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 2026"
      intro={`This policy explains what data ${site.name} collects, why, and what we do with it. Short version: we collect what's needed to sell you a product and give you access to it, nothing more.`}
      sections={[
        {
          heading: "1. What we collect",
          paragraphs: [
            "When you purchase, we collect your name and email address, plus your order details (product, amount, payment status). Payment card details are handled entirely by our payment provider and never touch our servers.",
            "If you contact us, we keep the message so we can reply and resolve the issue.",
          ],
        },
        {
          heading: "2. What we use it for",
          paragraphs: [
            "Providing access to your purchase, sending transactional emails (receipts and access emails), and responding to support requests. We do not sell your data, and we don't send marketing email you didn't ask for.",
          ],
        },
        {
          heading: "3. Who we share it with",
          paragraphs: [
            "Only the service providers needed to run the product: our payment provider Whop (to process your payment), our email provider (to deliver transactional emails), and our database host (to store orders and support messages). Each receives only what it needs.",
          ],
        },
        {
          heading: "4. Cookies and visit counts",
          paragraphs: [
            "This site sets no cookies. To understand how the site is used, it records anonymous visit data in our own database: the pages you view, how long you stay and how far you scroll, whether you click Pay, your device type, operating system and browser, your browser's language and time zone, and the site or link that sent you. A random visitor ID in your browser's local storage connects the pages of one visit. None of this is linked to your name, email, or IP address, and there is no advertising or cross-site tracking.",
          ],
        },
        {
          heading: "5. Retention and deletion",
          paragraphs: [
            "We keep your order details and support messages for as long as you have access to a product. You can request a copy of your data, or ask us to delete it, at any time by messaging us on Telegram.",
          ],
        },
        {
          heading: "6. Contact",
          paragraphs: [`Privacy questions or requests: message ${site.telegram} on Telegram.`],
        },
      ]}
    />
  );
}
