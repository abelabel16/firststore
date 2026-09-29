import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/config/site";
import { AnalyticsTracker } from "@/components/site/analytics-tracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Build your first dropshipping store`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | Build your first dropshipping store`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Build your first dropshipping store`,
    description: site.description,
  },
};

/**
 * Content Security Policy. GitHub Pages cannot set HTTP headers, so this
 * ships as a meta tag (React hoists it into <head>). 'unsafe-inline' is
 * required by Next.js hydration scripts; everything external is limited to
 * Supabase (data) and https frames (lesson video embeds).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co",
  "frame-src https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* GitHub Pages already 301s http→https; this catches stale http tabs
            and old links instantly on the client as well. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(location.protocol==='http:'&&location.hostname!=='localhost'){location.replace(location.href.replace('http://','https://'))}",
          }}
        />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
