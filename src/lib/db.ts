import fs from "fs";
import path from "path";

/**
 * Simple JSON-file data store.
 *
 * This keeps the project runnable with zero external services. Every access
 * goes through this module, so swapping it for Postgres/Prisma/SQLite later
 * means reimplementing only this file — page and API code won't change.
 *
 * Records created by the seed are marked `seeded: true` so mock data is
 * always distinguishable from real data.
 */

export type Product = "course" | "vip";
export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  txRef: string;
  email: string;
  name: string;
  product: Product;
  amountUsd: number;
  status: OrderStatus;
  provider: string;
  createdAt: string;
  paidAt?: string;
  seeded?: boolean;
}

export interface VipOnboarding {
  hasStore: string;
  selling: string;
  stage: string;
  strugglingWith: string;
  goal: string;
  biggestProblem: string;
  completedAt: string;
}

export interface VipSession {
  id: string;
  email: string;
  number: number;
  date: string;
  time: string;
  status: "upcoming" | "completed";
  prep: { storeUrl: string; productUrl: string; questions: string };
  actionPlan: string[];
  createdAt: string;
  seeded?: boolean;
}

export interface SupportTicket {
  id: string;
  email: string;
  name?: string;
  source: "contact" | "vip";
  subject: string;
  message: string;
  storeUrl?: string;
  productUrl?: string;
  status: "open" | "closed";
  reply?: string;
  createdAt: string;
  seeded?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  entitlements: Product[];
  completedLessons: string[];
  vipOnboarding?: VipOnboarding;
  communityAccess: boolean;
  adminNotes?: string;
  createdAt: string;
  seeded?: boolean;
}

interface Database {
  users: User[];
  orders: Order[];
  sessions: VipSession[];
  tickets: SupportTicket[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function seedDatabase(): Database {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
  return {
    users: [
      {
        id: "usr_demo1",
        email: "demo-student@example.com",
        name: "Demo Student",
        entitlements: ["course"],
        completedLessons: ["l-1-1", "l-1-2", "l-1-3", "l-2-1", "l-2-2"],
        communityAccess: false,
        createdAt: daysAgo(12),
        seeded: true,
      },
      {
        id: "usr_demo2",
        email: "demo-vip@example.com",
        name: "Demo VIP Client",
        entitlements: ["course", "vip"],
        completedLessons: ["l-1-1", "l-1-2"],
        communityAccess: true,
        vipOnboarding: {
          hasStore: "Yes, one test store",
          selling: "Home fitness accessories",
          stage: "First store built, no consistent sales yet",
          strugglingWith: "Product selection and content that converts",
          goal: "Get to a validated product with repeatable content",
          biggestProblem: "Choosing between too many product ideas",
          completedAt: daysAgo(8),
        },
        createdAt: daysAgo(9),
        seeded: true,
      },
    ],
    orders: [
      {
        id: "ord_demo1",
        txRef: "demo-tx-course-1",
        email: "demo-student@example.com",
        name: "Demo Student",
        product: "course",
        amountUsd: 19,
        status: "paid",
        provider: "mock",
        createdAt: daysAgo(12),
        paidAt: daysAgo(12),
        seeded: true,
      },
      {
        id: "ord_demo2",
        txRef: "demo-tx-vip-1",
        email: "demo-vip@example.com",
        name: "Demo VIP Client",
        product: "vip",
        amountUsd: 499,
        status: "paid",
        provider: "mock",
        createdAt: daysAgo(9),
        paidAt: daysAgo(9),
        seeded: true,
      },
    ],
    sessions: [
      {
        id: "ses_demo1",
        email: "demo-vip@example.com",
        number: 1,
        date: daysAgo(-3).slice(0, 10),
        time: "15:00",
        status: "upcoming",
        prep: {
          storeUrl: "https://demo-store.example.com",
          productUrl: "https://demo-store.example.com/products/resistance-bands",
          questions: "Is my product page clear enough? Which of my 3 product ideas should I test first?",
        },
        actionPlan: [],
        createdAt: daysAgo(2),
        seeded: true,
      },
    ],
    tickets: [
      {
        id: "tkt_demo1",
        email: "demo-vip@example.com",
        source: "vip",
        subject: "Feedback on my product page",
        message: "Could you review my product page copy? I'm not sure the offer is clear.",
        storeUrl: "https://demo-store.example.com",
        status: "open",
        createdAt: daysAgo(1),
        seeded: true,
      },
    ],
  };
}

function readDb(): Database {
  if (!fs.existsSync(DB_PATH)) {
    const seeded = seedDatabase();
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Database;
}

function writeDb(db: Database): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ── Users ────────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return readDb().users.find((u) => u.email === normalized);
}

export function upsertUser(email: string, name?: string): User {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  let user = db.users.find((u) => u.email === normalized);
  if (!user) {
    user = {
      id: newId("usr"),
      email: normalized,
      name: name?.trim() || normalized.split("@")[0],
      entitlements: [],
      completedLessons: [],
      communityAccess: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else if (name?.trim()) {
    user.name = name.trim();
  }
  writeDb(db);
  return user;
}

export function updateUser(email: string, patch: Partial<User>): User | undefined {
  const db = readDb();
  const user = db.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return undefined;
  Object.assign(user, patch);
  writeDb(db);
  return user;
}

export function grantEntitlement(email: string, product: Product): User {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  let user = db.users.find((u) => u.email === normalized);
  if (!user) {
    user = {
      id: newId("usr"),
      email: normalized,
      name: normalized.split("@")[0],
      entitlements: [],
      completedLessons: [],
      communityAccess: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  }
  if (!user.entitlements.includes(product)) user.entitlements.push(product);
  // VIP includes course access.
  if (product === "vip") {
    if (!user.entitlements.includes("course")) user.entitlements.push("course");
    user.communityAccess = true;
  }
  writeDb(db);
  return user;
}

export function toggleLessonComplete(email: string, lessonId: string, complete: boolean): User | undefined {
  const db = readDb();
  const user = db.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user) return undefined;
  const has = user.completedLessons.includes(lessonId);
  if (complete && !has) user.completedLessons.push(lessonId);
  if (!complete && has) user.completedLessons = user.completedLessons.filter((l) => l !== lessonId);
  writeDb(db);
  return user;
}

export function listUsers(): User[] {
  return readDb().users.slice().reverse();
}

// ── Orders ───────────────────────────────────────────────────────────────

export function createOrder(input: {
  email: string;
  name: string;
  product: Product;
  amountUsd: number;
  provider: string;
}): Order {
  const db = readDb();
  const order: Order = {
    id: newId("ord"),
    txRef: newId("tx"),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    product: input.product,
    amountUsd: input.amountUsd,
    status: "pending",
    provider: input.provider,
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  writeDb(db);
  return order;
}

export function findOrderByTxRef(txRef: string): Order | undefined {
  return readDb().orders.find((o) => o.txRef === txRef);
}

export function setOrderStatus(txRef: string, status: OrderStatus): Order | undefined {
  const db = readDb();
  const order = db.orders.find((o) => o.txRef === txRef);
  if (!order) return undefined;
  order.status = status;
  if (status === "paid") order.paidAt = new Date().toISOString();
  writeDb(db);
  return order;
}

export function listOrders(): Order[] {
  return readDb().orders.slice().reverse();
}

export function listOrdersByEmail(email: string): Order[] {
  const normalized = email.trim().toLowerCase();
  return readDb()
    .orders.filter((o) => o.email === normalized)
    .reverse();
}

// ── VIP sessions ─────────────────────────────────────────────────────────

export function createSession(input: {
  email: string;
  date: string;
  time: string;
}): VipSession {
  const db = readDb();
  const existing = db.sessions.filter((s) => s.email === input.email.trim().toLowerCase());
  const session: VipSession = {
    id: newId("ses"),
    email: input.email.trim().toLowerCase(),
    number: existing.length + 1,
    date: input.date,
    time: input.time,
    status: "upcoming",
    prep: { storeUrl: "", productUrl: "", questions: "" },
    actionPlan: [],
    createdAt: new Date().toISOString(),
  };
  db.sessions.push(session);
  writeDb(db);
  return session;
}

export function findSession(id: string): VipSession | undefined {
  return readDb().sessions.find((s) => s.id === id);
}

export function updateSession(id: string, patch: Partial<VipSession>): VipSession | undefined {
  const db = readDb();
  const session = db.sessions.find((s) => s.id === id);
  if (!session) return undefined;
  Object.assign(session, patch);
  writeDb(db);
  return session;
}

export function listSessionsByEmail(email: string): VipSession[] {
  const normalized = email.trim().toLowerCase();
  return readDb().sessions.filter((s) => s.email === normalized);
}

export function listSessions(): VipSession[] {
  return readDb().sessions.slice().reverse();
}

// ── Support tickets ──────────────────────────────────────────────────────

export function createTicket(input: {
  email: string;
  name?: string;
  source: "contact" | "vip";
  subject: string;
  message: string;
  storeUrl?: string;
  productUrl?: string;
}): SupportTicket {
  const db = readDb();
  const ticket: SupportTicket = {
    id: newId("tkt"),
    email: input.email.trim().toLowerCase(),
    name: input.name?.trim(),
    source: input.source,
    subject: input.subject.trim(),
    message: input.message.trim(),
    storeUrl: input.storeUrl?.trim() || undefined,
    productUrl: input.productUrl?.trim() || undefined,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  db.tickets.push(ticket);
  writeDb(db);
  return ticket;
}

export function listTickets(): SupportTicket[] {
  return readDb().tickets.slice().reverse();
}

export function listTicketsByEmail(email: string): SupportTicket[] {
  const normalized = email.trim().toLowerCase();
  return readDb()
    .tickets.filter((t) => t.email === normalized)
    .reverse();
}

export function updateTicket(id: string, patch: Partial<SupportTicket>): SupportTicket | undefined {
  const db = readDb();
  const ticket = db.tickets.find((t) => t.id === id);
  if (!ticket) return undefined;
  Object.assign(ticket, patch);
  writeDb(db);
  return ticket;
}
