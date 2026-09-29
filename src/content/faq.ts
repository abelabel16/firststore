export interface FaqItem {
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
        q: "Is the course beginner friendly?",
        a: "Yes. It assumes no prior experience. If you've already started a store, you can jump to the modules you need.",
      },
      {
        q: "What exactly do I get?",
        a: "All eight modules of video lessons, plus the checklists, templates, and frameworks used in the lessons. You also get future updates to the course at no extra cost.",
      },
      {
        q: "How long do I have access?",
        a: "Access doesn't expire. Buy once, keep access, including updates.",
      },
      {
        q: "Do I need Shopify?",
        a: "The store setup module demonstrates with Shopify because it's the most common choice, but the process applies to WooCommerce and similar platforms too. A Shopify subscription is a separate cost paid to Shopify, not to us.",
      },
      {
        q: "How much money do I need to start?",
        a: "Beyond the course, plan for a store subscription, product samples, and a small testing budget. A few hundred dollars is a realistic range to test properly.",
      },
    ],
  },
  {
    title: "VIP Accelerator",
    items: [
      {
        q: "What is the VIP Accelerator?",
        a: "The advanced tier of the course. It includes everything in the base course plus deep-dive guides, self-serve store and product audit systems, a content review rubric, action plan templates, the private community, and priority support. It's all digital and self-paced, delivered to your email like the course.",
      },
      {
        q: "Is the course included with VIP?",
        a: "Yes. VIP includes full course access, so you never need to buy both.",
      },
      {
        q: "How does the private community work?",
        a: "It's a private group of VIP members. You can ask questions, share what you're working on, and see what others are building and testing. Access is verified against your purchase.",
      },
      {
        q: "What's the difference between the course and VIP?",
        a: "The course teaches the full process and stands on its own. VIP adds the advanced tooling around it: audit systems to diagnose your own store and products, templates that turn the process into a weekly plan, deeper guides, and the community. Start with the course if you're unsure, you can always upgrade.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "Is the $19 payment one-time?",
        a: "Yes. One payment, permanent access, no subscription, no hidden upsells at checkout.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Debit or credit card, on a secure checkout run by Whop. Your card details never touch this site.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, see the refund policy for the exact terms. In short: if the course isn't for you, message @netro_s on Telegram within 14 days for a full refund.",
      },
    ],
  },
  {
    title: "Access",
    items: [
      {
        q: "How do I access my purchase?",
        a: "Everything is sent to the email you used at checkout within 24 hours of payment, and usually much faster. No account, no password, no login. Check your spam folder if you don't see it.",
      },
      {
        q: "I didn't receive the email. What do I do?",
        a: "Check spam first. If nothing has arrived within 24 hours, message @netro_s on Telegram with the email you purchased with, and your access will be resent right away.",
      },
      {
        q: "Can I use it on my phone?",
        a: "Yes. Everything we send works on any device, and the lessons are made to watch comfortably on a phone.",
      },
    ],
  },
  {
    title: "Results",
    items: [
      {
        q: "Is income guaranteed?",
        a: "No. This is education: a process for researching, building, and testing an online store. Your results depend on your execution, your product choices, your budget, and factors outside anyone's control. Many stores fail; the course exists to make your attempts smarter, not to promise an outcome.",
      },
      {
        q: "How long until I see results?",
        a: "It varies. Building and launching a first store typically takes a few weeks of part-time work, and finding a product that works can take several tests. Treat your first store as learning, not as a payday.",
      },
    ],
  },
];

export const homeFaq: FaqItem[] = [
  faqCategories[0].items[0],
  faqCategories[2].items[0],
  faqCategories[0].items[1],
  faqCategories[0].items[2],
  faqCategories[0].items[3],
  faqCategories[0].items[4],
  faqCategories[4].items[0],
  faqCategories[1].items[0],
  faqCategories[1].items[1],
  faqCategories[1].items[2],
  faqCategories[3].items[0],
];
