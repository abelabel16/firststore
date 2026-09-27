import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updated="September 2026"
      intro={`This page says plainly what ${site.name} is and is not. We'd rather over-communicate this than have anyone buy with the wrong expectations.`}
      sections={[
        {
          heading: "This is education, not a financial outcome",
          paragraphs: [
            "Our course and VIP Accelerator teach a process for researching products, building an online store, creating content, and testing ideas. Completing either product does not guarantee that your store will make money, or that it will make any specific amount.",
          ],
        },
        {
          heading: "Results vary, a lot",
          paragraphs: [
            "Outcomes depend on the products you choose, the effort and budget you put in, your market, timing, and factors nobody controls. Many first stores are not profitable. We think a first store is best treated as structured learning: some students go on to build stores that work, others conclude the model isn't for them, both are legitimate outcomes of honest experimentation.",
          ],
        },
        {
          heading: "Building a store involves real costs",
          paragraphs: [
            "Beyond our course, running a store involves costs paid to other companies: store platform subscriptions, product samples, and any advertising you choose to run. Budget for these deliberately. The Foundations module covers realistic budgeting in detail.",
          ],
        },
        {
          heading: "Any demos are demos",
          paragraphs: [
            "Interface previews and examples shown on this site illustrate how the course platform and teaching materials work. They are illustrations and demonstrations, never evidence of anyone's earnings.",
          ],
        },
        {
          heading: "Not professional advice",
          paragraphs: [
            "Nothing in our materials is financial, legal, or tax advice. For decisions in those areas, consult a qualified professional in your jurisdiction.",
          ],
        },
        {
          heading: "Questions",
          paragraphs: [
            `If anything about what you're buying is unclear, email ${site.supportEmail} before purchasing. We'd rather answer questions up front than refund confusion later.`,
          ],
        },
      ]}
    />
  );
}
