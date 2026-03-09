import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark native packages as external so Turbopack doesn't try to bundle them
  serverExternalPackages: ["sweph", "pdfkit"],

  // Standardize URL behavior - no trailing slashes
  trailingSlash: false,

  // Redirect routes to product page sections
  async redirects() {
    return [
      { source: '/numerology', destination: '/product#numerology', permanent: true },
      { source: '/vastu-shastra', destination: '/product#vastu', permanent: true },
      { source: '/tarot-reading', destination: '/product#tarot', permanent: true },
      { source: '/blog/', destination: '/blog', permanent: true },
    ];
  },
};

export default nextConfig;
