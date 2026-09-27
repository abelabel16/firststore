"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { updateSession, updateTicket, updateUser, findUserByEmail } from "@/lib/db";

/**
 * Admin mutations as server actions.
 * Every action re-verifies admin authorization server-side — never rely on
 * the admin UI being hidden.
 */

export async function replyToTicketAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const reply = String(formData.get("reply") ?? "").trim();
  if (id && reply) {
    updateTicket(id, { reply, status: "closed" });
    revalidatePath("/admin/support");
  }
}

export async function reopenTicketAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    updateTicket(id, { status: "open" });
    revalidatePath("/admin/support");
  }
}

export async function toggleCommunityAction(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "");
  const user = findUserByEmail(email);
  if (user) {
    updateUser(email, { communityAccess: !user.communityAccess });
    revalidatePath("/admin/community");
  }
}

export async function completeSessionAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const plan = String(formData.get("actionPlan") ?? "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
  if (id) {
    updateSession(id, { status: "completed", actionPlan: plan });
    revalidatePath("/admin/vip");
  }
}

export async function saveClientNotesAction(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (email) {
    updateUser(email, { adminNotes: notes });
    revalidatePath("/admin/vip");
  }
}
