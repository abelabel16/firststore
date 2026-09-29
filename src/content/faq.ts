export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    title: "Course",
    items: [
      {
        id: "beginner",
        q: "Is the course beginner friendly?",
        a: "Yes. It starts from zero and assumes no prior experience. If you've already started a store, you can jump to the parts you need.",
      },
      {
        id: "what-you-get",
        q: "What exactly do I get?",
        a: "10+ video lessons plus PDF guides and books. They cover every step, from starting with little money to finding products, building the store, suppliers, content, and handling orders, including the mistakes along the way.",
      },
      {
        id: "access-length",
        q: "How long do I have access?",
        a: "There's no time limit. Buy once and keep what you receive.",
      },
      {
        id: "shopify",
        q: "Do I need Shopify?",
        a: "You need an online store platform. Shopify is the most common choice. Its subscription is a separate cost paid to the platform, not to us.",
      },
      {
        id: "budget",
        q: "How much money do I need to start?",
        a: "Beyond the course, plan for a store subscription, product samples, and a small testing budget. A few hundred dollars is a realistic range to test properly.",
      },
    ],
  },
  {
    title: "VIP Accelerator",
    items: [
      {
        id: "vip-what",
        q: "What is the VIP Accelerator?",
        a: "The advanced tier. It includes the full course plus deep-dive guides, store and product audit systems, a content review rubric, action plan templates, a private VIP Telegram chat, and priority support. Everything is digital and self-paced.",
      },
      {
        id: "vip-course",
        q: "Is the course included with VIP?",
        a: "Yes. VIP includes the full course, so you never need to buy both.",
      },
      {
        id: "vip-delivery",
        q: "How do I get the VIP materials?",
        a: "After you pay, message @netro_s on Telegram with your purchase email. You'll be added to the private VIP chat, where the VIP materials are shared.",
      },
      {
        id: "vip-vs-course",
        q: "What's the difference between the course and VIP?",
        a: "The course teaches every step and stands on its own. VIP adds the tools around it: audit systems for your own store and products, templates that turn the process into a weekly plan, deeper guides, and the private chat. Start with the course if you're unsure; you can upgrade later.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        id: "one-time",
        q: "Is the $19 payment one-time?",
        a: "Yes. One payment, no subscription, no upsells at checkout.",
      },
      {
        id: "payment-methods",
        q: "What payment methods do you accept?",
        a: "Debit or credit card, on a secure checkout run by Whop. Your card details never touch this site.",
      },
      {
        id: "refund",
        q: "Can I get a refund?",
        a: "Yes. If the course isn't for you, message @netro_s on Telegram within 14 days for a full refund. See the refund policy for details.",
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        id: "delivery",
        q: "How do I get the course after paying?",
        a: "Everything is sent to the email you used at checkout within 24 hours of payment, usually much faster. No account, no password, no login. Check your spam folder if you don't see it.",
      },
      {
        id: "no-email",
        q: "I didn't receive the email. What do I do?",
        a: "Check spam first. If nothing has arrived within 24 hours, message @netro_s on Telegram with the email you purchased with, and your access will be resent right away.",
      },
      {
        id: "phone",
        q: "Can I use it on my phone?",
        a: "Yes. The videos, PDFs, and books all work on a phone.",
      },
    ],
  },
  {
    title: "Results",
    items: [
      {
        id: "guarantee",
        q: "Is income guaranteed?",
        a: "No. This is education: the steps for researching, building, and testing an online store. Your results depend on your execution, your product choices, your budget, and factors outside anyone's control. Many stores fail; the course exists to make your attempts smarter, not to promise an outcome.",
      },
      {
        id: "how-long",
        q: "How long until I see results?",
        a: "It varies. Building and launching a first store typically takes a few weeks of part-time work, and finding a product that works can take several tests. Treat your first store as learning, not as a payday.",
      },
    ],
  },
];

const byId = new Map(faqCategories.flatMap((c) => c.items).map((i) => [i.id, i]));

/** Pick FAQ items by id, in the order given. Unknown ids fail the build. */
export function faqByIds(...ids: string[]): FaqItem[] {
  return ids.map((id) => {
    const item = byId.get(id);
    if (!item) throw new Error(`faq.ts: unknown FAQ id "${id}"`);
    return item;
  });
}
