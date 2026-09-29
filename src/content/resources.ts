export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "Checklist" | "Template" | "Framework" | "Guide" | "Tools";
  vipOnly?: boolean;
}

export const resources: Resource[] = [
  {
    id: "r1",
    title: "Product Research Checklist",
    description: "Score every product candidate the same way: demand, competition, margins, shipping, and content potential.",
    type: "Checklist",
  },
  {
    id: "r2",
    title: "Store Launch Checklist",
    description: "Every page, policy, and setting verified before you send traffic to your store.",
    type: "Checklist",
  },
  {
    id: "r3",
    title: "Content Angle Framework",
    description: "A structured way to find the angles and hooks that make a product interesting in short-form content.",
    type: "Framework",
  },
  {
    id: "r4",
    title: "Supplier Vetting Checklist",
    description: "What to check before committing to a supplier: samples, shipping times, communication, and terms.",
    type: "Checklist",
  },
  {
    id: "r5",
    title: "Launch Checklist",
    description: "The final pre-launch sequence and the first two weeks of operating, step by step.",
    type: "Checklist",
  },
  {
    id: "r6",
    title: "Recommended Tools",
    description: "The tools we actually use for research, store building, and content, with free alternatives where they exist.",
    type: "Tools",
  },
  {
    id: "vr1",
    title: "Store Audit Checklist",
    description: "A section by section checklist for auditing your own store.",
    type: "Checklist",
    vipOnly: true,
  },
  {
    id: "vr2",
    title: "Advanced Product Validation Guide",
    description: "A deeper validation process: structured testing budgets, decision thresholds, and reading early data.",
    type: "Guide",
    vipOnly: true,
  },
  {
    id: "vr3",
    title: "Content Review Rubric",
    description: "Score your own videos on hook, pacing, clarity, and call to action.",
    type: "Framework",
    vipOnly: true,
  },
  {
    id: "vr4",
    title: "Action Plan Templates",
    description: "Weekly action plan templates for planning and tracking your tests.",
    type: "Template",
    vipOnly: true,
  },
];
