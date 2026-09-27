"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (the site is a static export — all data access
 * happens from the browser, secured by Row Level Security in Supabase).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!url || !anonKey) {
      throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).");
    }
    client = createClient(url, anonKey);
  }
  return client;
}

/** Base URL of the Supabase Edge Functions (payments). */
export function functionsUrl(name: string): string {
  return `${url}/functions/v1/${name}`;
}
