"use client";

/**
 * First-party, anonymous visit tracking into our own Supabase (page_views).
 *
 * Each page view sends a 'view' row. When the visitor leaves that page (route
 * change, tab hidden, or tab closed) a 'leave' row with the same view_id
 * records visible time on the page and how much of the page they saw.
 * trackEvent() records actions such as clicking Pay.
 *
 * No cookies, no IP, no names: a random visitor id (localStorage), a random
 * session id (sessionStorage), and what the browser reports about itself.
 * The owner's own browsers are never tracked. Failures are ignored; analytics
 * must never break the site.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** The owner's tools and login pages are never tracked. */
const UNTRACKED = ["/admin", "/login", "/welcome", "/verify-email", "/forgot-access"];
const OWNER_FLAG = "vf_owner";
const SESSION_IDLE_MS = 30 * 60 * 1000;

/** Stop tracking this browser; called when an admin opens the admin panel. */
export function markOwnerBrowser(): void {
  try {
    localStorage.setItem(OWNER_FLAG, "1");
  } catch {
    // storage blocked
  }
}

function isOwnerBrowser(): boolean {
  try {
    // ?owner=1 excludes a device without logging in; ?owner=0 undoes it.
    const flag = new URLSearchParams(location.search).get("owner");
    if (flag === "1") localStorage.setItem(OWNER_FLAG, "1");
    if (flag === "0") localStorage.removeItem(OWNER_FLAG);
    return localStorage.getItem(OWNER_FLAG) === "1";
  } catch {
    return false;
  }
}

export function shouldTrack(path: string): boolean {
  if (!url || !anonKey || isOwnerBrowser()) return false;
  // Local builds talk to the live database; never let testing count as visits.
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return false;
  return !UNTRACKED.some((p) => path === p || path.startsWith(`${p}/`));
}

function storedId(storage: Storage, key: string): string {
  let id = storage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    storage.setItem(key, id);
  }
  return id;
}

/** A visit ends after 30 idle minutes, even if the tab stays open. */
function sessionId(): string {
  const now = Date.now();
  const last = Number(sessionStorage.getItem("vf_sid_at") ?? 0);
  if (now - last > SESSION_IDLE_MS) sessionStorage.removeItem("vf_sid");
  sessionStorage.setItem("vf_sid_at", String(now));
  return storedId(sessionStorage, "vf_sid");
}

/** Where the visit came from, kept for the whole visit: ?utm_source= or ?ref=. */
function campaignSource(): string | null {
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get("utm_source") ?? params.get("ref") ?? params.get("src");
  if (fromUrl) sessionStorage.setItem("vf_src", fromUrl.slice(0, 60));
  return sessionStorage.getItem("vf_src");
}

function describeBrowser(ua: string): { device: string; os: string; browser: string } {
  const device = /iPad|Tablet/i.test(ua) ? "Tablet" : /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop";
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  // In-app browsers first: they usually hide the referrer, so the app name is
  // often the only sign of where a visitor came from.
  const browser = /musical_ly|TikTok|BytedanceWebview/i.test(ua)
    ? "TikTok app"
    : /Instagram/.test(ua)
      ? "Instagram app"
      : /FBAN|FBAV|FB_IAB/.test(ua)
        ? "Facebook app"
        : /Telegram/i.test(ua)
          ? "Telegram app"
          : /Edg\//.test(ua)
            ? "Edge"
            : /OPR\/|Opera/.test(ua)
              ? "Opera"
              : /SamsungBrowser/.test(ua)
                ? "Samsung"
                : /CriOS|Chrome\//.test(ua)
                  ? "Chrome"
                  : /FxiOS|Firefox\//.test(ua)
                    ? "Firefox"
                    : /Safari\//.test(ua)
                      ? "Safari"
                      : "Other";
  return { device, os, browser };
}

function context() {
  return {
    visitor: storedId(localStorage, "vf_vid"),
    session: sessionId(),
    ...describeBrowser(navigator.userAgent),
    tz: (Intl.DateTimeFormat().resolvedOptions().timeZone ?? "").slice(0, 64) || null,
    lang: (navigator.language ?? "").slice(0, 20) || null,
    utm_source: campaignSource(),
  };
}

function send(row: Record<string, unknown>): void {
  try {
    void fetch(`${url}/rest/v1/page_views`, {
      method: "POST",
      keepalive: true, // lets the final 'leave' row survive the tab closing
      headers: {
        apikey: anonKey!,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    }).catch(() => {});
  } catch {
    // never surface analytics errors
  }
}

/** Share of the page the visitor has seen so far, 0 to 100. */
function seenPct(): number {
  const height = document.documentElement.scrollHeight;
  if (height <= 0) return 100;
  return Math.min(100, Math.round(((scrollY + innerHeight) / height) * 100));
}

/** Record a page view; returns a function to call when the view ends. */
export function startView(path: string): () => void {
  try {
    const ctx = context();
    const viewId = crypto.randomUUID();
    send({
      id: viewId,
      kind: "view",
      path: path.slice(0, 200),
      referrer: (document.referrer || "").slice(0, 500) || null,
      ...ctx,
    });

    let visibleMs = 0;
    let visibleSince: number | null = document.visibilityState === "visible" ? performance.now() : null;
    let maxSeen = seenPct();
    let lastSent = "";

    const pause = () => {
      if (visibleSince !== null) {
        visibleMs += performance.now() - visibleSince;
        visibleSince = null;
      }
    };
    // Send totals so far; skipped when nothing changed since the last send.
    const flush = () => {
      const duration = Math.round(visibleMs);
      const key = `${duration}:${maxSeen}`;
      if (key === lastSent) return;
      lastSent = key;
      send({
        kind: "leave",
        view_id: viewId,
        path: path.slice(0, 200),
        visitor: ctx.visitor,
        session: ctx.session,
        duration_ms: Math.min(duration, 86400000),
        scroll_pct: maxSeen,
      });
    };

    const onScroll = () => {
      maxSeen = Math.max(maxSeen, seenPct());
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pause();
        flush();
      } else {
        visibleSince = performance.now();
      }
    };
    const onPageHide = () => {
      pause();
      flush();
    };

    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    addEventListener("pagehide", onPageHide);

    return () => {
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("pagehide", onPageHide);
      pause();
      flush();
    };
  } catch {
    return () => {};
  }
}

/** Record an action on the current page, e.g. trackEvent("checkout_click"). */
export function trackEvent(event: string): void {
  try {
    const path = location.pathname;
    if (!shouldTrack(path)) return;
    send({ kind: "event", event: event.slice(0, 40), path: path.slice(0, 200), ...context() });
  } catch {
    // ignore
  }
}
