import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="September 2026"
      intro={`These terms govern your use of ${site.name}, including the course, the VIP mentorship program, and this website. By purchasing or using our products you agree to these terms. We've written them to be readable — if anything is unclear, ask us at ${site.supportEmail}.`}
      sections={[
        {
          heading: "1. What we provide",
          paragraphs: [
            `${site.name} provides educational products: a self-paced video course and a 1-to-1 mentorship program. We provide instruction, materials, feedback, and support — we do not operate a store on your behalf, and we do not provide financial, legal, or tax advice.`,
          ],
        },
        {
          heading: "2. Purchases and access",
          paragraphs: [
            "Access to purchased products is tied to the email address used at checkout. Course access does not expire and includes future updates to the course. Mentorship includes the services described on the mentorship page at the time of your purchase.",
            "You may not share, resell, or redistribute your access or the course materials. Access is for one person — the purchaser.",
          ],
        },
        {
          heading: "3. No income guarantee",
          paragraphs: [
            "Our products teach a process. We make no promises or guarantees about the money you may or may not earn by applying it. Building an online store involves cost and risk, results vary widely, and many stores are not profitable. Any decision to spend money on a store, inventory, tools, or advertising is yours alone.",
          ],
        },
        {
          heading: "4. Refunds",
          paragraphs: [
            "Refunds are handled according to our Refund Policy, which forms part of these terms.",
          ],
        },
        {
          heading: "5. Acceptable use",
          paragraphs: [
            "Don't abuse the platform: no attempts to access other users' accounts or content you haven't purchased, no scraping or redistributing materials, and no disruptive or abusive behavior in the private community. We may suspend access for serious violations, with a refund where the law requires it.",
          ],
        },
        {
          heading: "6. Intellectual property",
          paragraphs: [
            `All course materials — videos, checklists, templates, and frameworks — are the property of ${site.name} and licensed to you for personal use. Using what you learn in your own business is exactly the point; republishing our materials is not permitted.`,
          ],
        },
        {
          heading: "7. Limitation of liability",
          paragraphs: [
            `To the maximum extent permitted by law, ${site.name}'s liability for any claim related to our products is limited to the amount you paid us. We are not liable for business losses arising from decisions you make while or after using our products.`,
          ],
        },
        {
          heading: "8. Changes to these terms",
          paragraphs: [
            "If we update these terms we'll change the date at the top of this page. Material changes affecting existing customers will be communicated by email.",
          ],
        },
        {
          heading: "9. Contact",
          paragraphs: [`Questions about these terms: ${site.supportEmail}.`],
        },
      ]}
    />
  );
}
