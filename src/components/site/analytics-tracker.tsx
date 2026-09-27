"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

/**
 * First-party, privacy-friendly page-view tracking into our own Supabase.
 * No cookies, no third parties: just the path, the referrer, and a random
 * anonymous visitor id kept in localStorage to count unique visitors.
 * Failures are silently ignored; analytics must never break the site.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!supabaseConfigured || !pathname) return;
    try {
      let visitor = localStorage.getItem("vf_vid");
      if (!visitor) {
        visitor = crypto.randomUUID();
        localStorage.setItem("vf_vid", visitor);
      }
      void getSupabase()
        .from("page_views")
        .insert({
          path: pathname.slice(0, 200),
          referrer: (document.referrer || "").slice(0, 500) || null,
          visitor,
        })
        .then(() => {});
    } catch {
      // storage blocked or network down; never surface analytics errors
    }
  }, [pathname]);

  return null;
}
