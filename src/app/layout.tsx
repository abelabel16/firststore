import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, Learn Dropshipping the Real Way`,
    template: `%s, ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name}, Learn Dropshipping the Real Way`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, Learn Dropshipping the Real Way`,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
