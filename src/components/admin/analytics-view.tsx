"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";

export interface AnalyticsRow {
  id: string;
  kind: "view" | "leave" | "event";
  view_id: string | null;
  path: string;
  referrer: string | null;
  visitor: string | null;
  session: string | null;
  event: string | null;
  duration_ms: number | null;
  scroll_pct: number | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  tz: string | null;
  utm_source: string | null;
  created_at: string;
}

interface PageVisit {
  path: string;
  at: number;
  ms: number | null;
  seen: number | null;
}

interface Visit {
  key: string;
  visitor: string;
  start: number;
  end: number;
  pages: PageVisit[];
  events: string[];
  source: string;
  device: string;
  place: string | null;
  returning: boolean;
}

const OWNER_PATHS = ["/admin", "/login", "/welcome", "/verify-email", "/forgot-access"];
const PRODUCT_PAGES = ["/course/", "/mentorship/", "/pricing/"];

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/course/": "Course page",
  "/mentorship/": "VIP page",
  "/pricing/": "Pricing",
  "/about/": "About",
  "/faq/": "FAQ",
  "/contact/": "Contact",
  "/checkout/course/": "Checkout (course)",
  "/checkout/mentorship/": "Checkout (VIP)",
  "/payment/success/": "Paid (success page)",
  "/payment/failed/": "Payment failed",
};

function normalize(path: string): string {
  if (path === "/" || path.endsWith("/")) return path;
  return `${path}/`;
}

function pageName(path: string): string {
  return PAGE_NAMES[normalize(path)] ?? path;
}

function isOwnerPath(path: string): boolean {
  return OWNER_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function sourceOf(row: AnalyticsRow): string {
  if (row.utm_source) return row.utm_source;
  if (row.browser?.endsWith(" app")) return row.browser.replace(" app", "");
  if (row.referrer) {
    try {
      const host = new URL(row.referrer).hostname.replace(/^www\./, "");
      if (host !== "vibrantflacon.com") return host;
    } catch {
      // unparsable referrer
    }
  }
  return "Direct";
}

/** "Africa/Addis_Ababa" -> "Addis Ababa (Africa)". The time zone is an approximate location. */
function placeOf(tz: string | null): string | null {
  if (!tz || !tz.includes("/")) return tz;
  const parts = tz.split("/");
  return `${parts[parts.length - 1].replace(/_/g, " ")} (${parts[0]})`;
}

function formatDuration(ms: number | null): string {
  if (ms === null) return "?";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function timeAgo(ts: number): string {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

/** Group rows into visits (one per session), dropping the owner's own browsing. */
function buildVisits(rows: AnalyticsRow[]): Visit[] {
  // Any visitor id that ever opened an owner page is the owner.
  const owners = new Set(rows.filter((r) => isOwnerPath(r.path)).map((r) => r.visitor));
  const clean = rows.filter((r) => !isOwnerPath(r.path) && !owners.has(r.visitor));

  const leaves = new Map<string, { ms: number; seen: number }>();
  for (const r of clean) {
    if (r.kind !== "leave" || !r.view_id) continue;
    const prev = leaves.get(r.view_id);
    leaves.set(r.view_id, {
      ms: Math.max(prev?.ms ?? 0, r.duration_ms ?? 0),
      seen: Math.max(prev?.seen ?? 0, r.scroll_pct ?? 0),
    });
  }

  const groups = new Map<string, AnalyticsRow[]>();
  for (const r of clean) {
    if (r.kind === "leave") continue;
    // Rows from before visit tracking have no session: group them by visitor and day.
    const key = r.session ?? `${r.visitor}|${r.created_at.slice(0, 10)}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }

  const visits: Visit[] = [];
  for (const [key, list] of groups) {
    list.sort((a, b) => a.created_at.localeCompare(b.created_at));
    const views = list.filter((r) => r.kind === "view");
    if (!views.length) continue;
    const first = views[0];
    const pages: PageVisit[] = views.map((v) => {
      const leave = leaves.get(v.id);
      return {
        path: v.path,
        at: new Date(v.created_at).getTime(),
        ms: leave ? leave.ms : null,
        seen: leave ? leave.seen : null,
      };
    });
    visits.push({
      key,
      visitor: first.visitor ?? key,
      start: pages[0].at,
      end: pages[pages.length - 1].at,
      pages,
      events: list.filter((r) => r.kind === "event" && r.event).map((r) => r.event!),
      source: sourceOf(first),
      device: [first.device, first.os, first.browser].filter(Boolean).join(" · ") || "Unknown device",
      place: placeOf(first.tz),
      returning: false,
    });
  }

  visits.sort((a, b) => a.start - b.start);
  const seen = new Set<string>();
  for (const v of visits) {
    v.returning = seen.has(v.visitor);
    seen.add(v.visitor);
  }
  return visits.reverse();
}

/** The analytics dashboard for a set of page_views rows (see lib/analytics.ts). */
export function AnalyticsView({ rows, paidOrders }: { rows: AnalyticsRow[]; paidOrders: number }) {
  const visits = buildVisits(rows);
  const visitors = new Set(visits.map((v) => v.visitor)).size;
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const visitsToday = visits.filter((v) => v.start >= dayStart.getTime()).length;
  const conversion = visitors > 0 ? ((paidOrders / visitors) * 100).toFixed(1) : "0.0";

  const reached = (test: (v: Visit) => boolean) => visits.filter(test).length;
  const funnel = [
    { label: "Visited the site", count: visits.length },
    {
      label: "Opened the course, VIP, or pricing page",
      count: reached((v) => v.pages.some((p) => PRODUCT_PAGES.includes(normalize(p.path)))),
    },
    { label: "Reached checkout", count: reached((v) => v.pages.some((p) => p.path.startsWith("/checkout/"))) },
    { label: "Clicked Pay", count: reached((v) => v.events.some((e) => e.startsWith("checkout_click"))) },
    { label: "Paid", count: paidOrders },
  ];

  // Per page: how many visits saw it, how many ended there, time and depth.
  const pageStats = new Map<string, { views: number; exits: number; ms: number[]; seen: number[] }>();
  for (const v of visits) {
    v.pages.forEach((p, i) => {
      const name = pageName(p.path);
      const s = pageStats.get(name) ?? { views: 0, exits: 0, ms: [], seen: [] };
      s.views += 1;
      if (i === v.pages.length - 1) s.exits += 1;
      if (p.ms !== null) s.ms.push(p.ms);
      if (p.seen !== null) s.seen.push(p.seen);
      pageStats.set(name, s);
    });
  }
  const pages = [...pageStats.entries()].sort((a, b) => b[1].views - a[1].views);

  const sources = new Map<string, number>();
  for (const v of visits) sources.set(v.source, (sources.get(v.source) ?? 0) + 1);
  const topSources = [...sources.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Last 30 days. Your own visits are not counted: any browser that opens this admin panel
          is excluded automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Visitors" value={String(visitors)} hint="Different people (devices)" />
        <StatCard label="Visits" value={String(visits.length)} hint={`${visitsToday} today`} />
        <StatCard label="Paid orders" value={String(paidOrders)} />
        <StatCard label="Conversion" value={`${conversion}%`} hint="Paid orders / visitors" />
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Where visits drop off</h2>
        <div className="mt-4 space-y-3">
          {funnel.map((step, i) => {
            const pct = funnel[0].count ? Math.round((step.count / funnel[0].count) * 100) : 0;
            const prev = i > 0 ? funnel[i - 1].count : null;
            const lost = prev !== null && prev > 0 ? prev - step.count : null;
            return (
              <div key={step.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink">{step.label}</span>
                  <span className="shrink-0 tabular-nums text-ink-soft">
                    <strong className="text-ink">{step.count}</strong>
                    {lost !== null && lost > 0 && <span className="ml-2 text-danger">{lost} left</span>}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-5 pb-3 sm:p-6 sm:pb-3">
          <h2 className="text-sm font-semibold text-ink">Where people leave</h2>
          <p className="mt-1 text-xs text-ink-soft">
            &ldquo;Left here&rdquo; is how many visits ended on that page. &ldquo;Saw&rdquo; is how
            much of the page people scrolled through, on average.
          </p>
        </div>
        {pages.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-ink-soft sm:px-6">No visits recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-y border-line bg-paper text-left text-xs text-ink-soft">
                  <th className="px-5 py-2 font-medium sm:px-6">Page</th>
                  <th className="px-3 py-2 text-right font-medium">Visits</th>
                  <th className="px-3 py-2 text-right font-medium">Left here</th>
                  <th className="px-3 py-2 text-right font-medium">Avg time</th>
                  <th className="px-5 py-2 text-right font-medium sm:px-6">Saw</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pages.map(([name, s]) => {
                  const ms = average(s.ms);
                  const seen = average(s.seen);
                  return (
                    <tr key={name}>
                      <td className="px-5 py-2.5 text-ink sm:px-6">{name}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink-soft">{s.views}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink">
                        {s.exits} <span className="text-ink-faint">({Math.round((s.exits / s.views) * 100)}%)</span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-ink-soft">
                        {ms === null ? "?" : formatDuration(ms)}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-ink-soft sm:px-6">
                        {seen === null ? "?" : `${Math.round(seen)}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">Recent visits</h2>
          <p className="mt-1 text-xs text-ink-soft">
            Anonymous: no names or IP addresses. Location comes from the visitor&rsquo;s time zone,
            so it is approximate.
          </p>
          {visits.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">No visits recorded yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {visits.slice(0, 40).map((v) => {
                const last = v.pages[v.pages.length - 1];
                const total = v.pages.every((p) => p.ms === null)
                  ? null
                  : v.pages.reduce((sum, p) => sum + (p.ms ?? 0), 0);
                const trail = v.pages
                  .map((p) => pageName(p.path))
                  .filter((name, i, all) => i === 0 || name !== all[i - 1]);
                const clickedPay = v.events.some((e) => e.startsWith("checkout_click"));
                return (
                  <li key={v.key} className="py-3.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                      <span className="font-medium text-ink">{timeAgo(v.start)}</span>
                      <span>·</span>
                      <span>{v.device}</span>
                      {v.place && (
                        <>
                          <span>·</span>
                          <span>{v.place}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>from {v.source}</span>
                      {v.returning && <span className="font-medium text-accent">· came back</span>}
                    </div>
                    <p className="mt-1.5 text-sm text-ink">{trail.join(" → ")}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Left on <strong className="font-medium text-ink">{pageName(last.path)}</strong>
                      {last.seen !== null && <> after seeing {last.seen}% of it</>}
                      {total !== null && <>, {formatDuration(total)} on the site</>}
                      {clickedPay && <strong className="ml-1 font-medium text-good">· clicked Pay</strong>}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-ink">Where visits come from</h2>
          {topSources.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">No visits yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {topSources.map(([source, count]) => (
                <li key={source} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-ink">{source}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-ink-soft">{count}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            Add <strong className="font-medium text-ink-soft">?ref=tiktok</strong> (or any name) to
            links you post, like vibrantflacon.com/?ref=tiktok, and those visits show up here by
            name.
          </p>
        </Card>
      </div>
    </div>
  );
}
