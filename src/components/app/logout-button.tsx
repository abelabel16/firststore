"use client";

import { useRouter } from "next/navigation";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    if (supabaseConfigured) await getSupabase().auth.signOut();
    router.replace("/");
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:bg-zinc-50 hover:text-ink"
    >
      Log out
    </button>
  );
}
