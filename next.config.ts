import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark native packages as external so Turbopack doesn't try to bundle them
  serverExternalPackages: ["sweph", "pdfkit"],
};

export default nextConfig;
