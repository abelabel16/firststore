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
        a: "Yes. It assumes no prior experience, Module 1 starts with how the business model works. If you've already started a store, you can jump to the modules you need.",
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
        a: "Beyond the course, plan for a store subscription, product samples, and a small testing budget. The Foundations module walks through a realistic budget in detail, most students should expect a few hundred dollars to test properly. Anyone telling you it's free is not being honest.",
      },
    ],
  },
  {
    title: "Mentorship",
    items: [
      {
        q: "How does mentorship work?",
        a: "After purchase you complete a short onboarding so your mentor understands your situation. You then get access to the private community, book your 1-to-1 session, and receive a personalized action plan. Between sessions you get direct feedback on your store, products, and content.",
      },
      {
        q: "Is the course included with mentorship?",
        a: "Yes. VIP mentorship includes full course access.",
      },
      {
        q: "How does the private group work?",
        a: "It's a small private community of active mentorship clients. You can ask questions, share what you're working on, and see feedback given to others. Access is verified against your purchase.",
      },
      {
        q: "What's the difference between the course and mentorship?",
        a: "The course teaches the process; mentorship applies it to your specific store with direct feedback. If you learn well on your own, start with the course. If you want someone reviewing your actual decisions, mentorship is the upgrade.",
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
        a: "Cards and local payment methods, depending on your region. The available options are shown at checkout.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, see the refund policy for the exact terms. In short: if the course isn't for you, contact support within the stated window and we'll sort it out.",
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
        a: "Check spam first. If nothing has arrived within 24 hours, message us on Telegram at @netro_s or email support from the address you purchased with, and we'll resend your access right away.",
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
        a: "No, and you should be skeptical of anyone who guarantees it. This is education: we teach a real process for researching, building, and testing an online store. Your results depend on your execution, your product choices, your budget, and factors outside anyone's control. Many stores fail; the course exists to make your attempts smarter, not to promise an outcome.",
      },
      {
        q: "How long until I see results?",
        a: "There's no honest universal answer. Building and launching a first store typically takes a few weeks of part-time work; finding a product that works can take multiple tests. Treat your first store as learning, not as a payday.",
      },
      {
        q: "Do you show student income proof?",
        a: "No. Income screenshots are easy to fake and even real ones are cherry-picked, so we don't use them to sell. Judge the course by its curriculum, which is public on this site.",
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
