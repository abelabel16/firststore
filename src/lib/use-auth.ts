"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import type { Product, Profile } from "@/lib/types";

export interface AuthState {
  /** Still resolving the session/profile. */
  loading: boolean;
  /** False when Supabase env vars are missing (site not wired up yet). */
  configured: boolean;
  session: Session | null;
  profile: Profile | null;
  entitlements: Product[];
  refresh: () => void;
}

/**
 * Client-side auth + entitlement state.
 *
 * This drives what the UI shows; the actual security boundary is Supabase
 * Row Level Security — the database refuses reads/writes the user isn't
 * entitled to, regardless of what the UI does.
 */
export function useAuth(): AuthState {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entitlements, setEntitlements] = useState<Product[]>([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    let cancelled = false;

    async function load(current: Session | null) {
      if (cancelled) return;
      setSession(current);
      if (!current?.user?.email) {
        setProfile(null);
        setEntitlements([]);
        setLoading(false);
        return;
      }
      const [profileRes, entRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", current.user.id).maybeSingle(),
        supabase.from("entitlements").select("product").eq("email", current.user.email),
      ]);
      if (cancelled) return;
      setProfile((profileRes.data as Profile | null) ?? null);
      setEntitlements(((entRes.data ?? []) as { product: Product }[]).map((r) => r.product));
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => load(s));
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [version]);

  return {
    loading,
    configured: supabaseConfigured,
    session,
    profile,
    entitlements,
    refresh: () => setVersion((v) => v + 1),
  };
}
