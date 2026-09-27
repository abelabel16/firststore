import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * - `output: "export"` produces plain HTML/JS/CSS in ./out — no server needed.
 * - NEXT_PUBLIC_BASE_PATH is "/firststore" when served at
 *   abelabel16.github.io/firststore, and empty for a custom domain.
 * - All backend work (auth, database, payments) happens in Supabase.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // There is a stray package-lock.json in the user home directory; pin the
  // workspace root so Next.js traces files from this project only.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
