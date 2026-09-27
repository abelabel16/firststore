import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail, type Product, type User } from "@/lib/db";

/**
 * Email-based (magic link) authentication.
 *
 * - Login links carry a short-lived HMAC-signed token.
 * - Sessions are an HMAC-signed cookie: email|expiry|signature.
 * - Authorization (entitlements, admin) is ALWAYS re-checked server-side
 *   against the data store — never trust the cookie contents alone for
 *   anything beyond identity.
 */

const SESSION_COOKIE = "fs_session";
const SESSION_DAYS = 30;
const LOGIN_LINK_MINUTES = 30;

function secret(): string {
  return process.env.AUTH_SECRET ?? "dev-only-insecure-secret";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(payload: string): string {
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

function decode(token: string): string | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const payload = Buffer.from(body, "base64url").toString();
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return payload;
}

// ── Login links ──────────────────────────────────────────────────────────

export function createLoginToken(email: string): string {
  const exp = Date.now() + LOGIN_LINK_MINUTES * 60_000;
  return encode(`login|${email.trim().toLowerCase()}|${exp}`);
}

export function verifyLoginToken(token: string): string | null {
  const payload = decode(token);
  if (!payload) return null;
  const [kind, email, exp] = payload.split("|");
  if (kind !== "login" || !email || Date.now() > Number(exp)) return null;
  return email;
}

// ── Sessions ─────────────────────────────────────────────────────────────

export async function createSessionCookie(email: string): Promise<void> {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const token = encode(`session|${email.trim().toLowerCase()}|${exp}`);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 86_400,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = decode(token);
  if (!payload) return null;
  const [kind, email, exp] = payload.split("|");
  if (kind !== "session" || !email || Date.now() > Number(exp)) return null;
  return email;
}

export async function getCurrentUser(): Promise<User | null> {
  const email = await getSessionEmail();
  if (!email) return null;
  return findUserByEmail(email) ?? null;
}

// ── Guards (server-side authorization) ───────────────────────────────────

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireEntitlement(product: Product): Promise<User> {
  const user = await requireUser();
  if (!user.entitlements.includes(product)) {
    redirect(product === "vip" ? "/mentorship" : "/course");
  }
  return user;
}

export function isAdminEmail(email: string): boolean {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) redirect("/login");
  return user;
}
