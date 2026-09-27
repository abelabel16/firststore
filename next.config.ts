import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // There is a stray package-lock.json in the user home directory; pin the
  // workspace root so Next.js traces files from this project only.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
