"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { shouldTrack, startView } from "@/lib/analytics";

/** Records each page view and, when the visitor moves on, how it went. See lib/analytics.ts. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname)) return;
    return startView(pathname);
  }, [pathname]);

  return null;
}
