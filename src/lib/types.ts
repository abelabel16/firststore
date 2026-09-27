export type Product = "course" | "vip";

export interface VipOnboarding {
  hasStore: string;
  selling: string;
  stage: string;
  strugglingWith: string;
  goal: string;
  biggestProblem: string;
  completedAt: string;
}

/** Row in public.profiles (one per auth user, created by trigger). */
export interface Profile {
  id: string;
  email: string;
  name: string;
  completed_lessons: string[];
  community_access: boolean;
  is_admin: boolean;
  vip_onboarding: VipOnboarding | null;
  admin_notes: string | null;
  created_at: string;
}

/** Row in public.orders (written by the payment Edge Function). */
export interface Order {
  id: string;
  tx_ref: string;
  email: string;
  name: string;
  product: Product;
  amount_usd: number;
  status: "pending" | "paid" | "failed";
  provider: string;
  created_at: string;
  paid_at: string | null;
}

/** Row in public.vip_sessions. */
export interface VipSession {
  id: string;
  email: string;
  number: number;
  date: string;
  time: string;
  status: "upcoming" | "completed";
  store_url: string;
  product_url: string;
  questions: string;
  action_plan: string[];
  created_at: string;
}

/** Row in public.tickets. */
export interface Ticket {
  id: string;
  email: string;
  name: string | null;
  source: "contact" | "vip";
  subject: string;
  message: string;
  store_url: string | null;
  product_url: string | null;
  status: "open" | "closed";
  reply: string | null;
  created_at: string;
}
