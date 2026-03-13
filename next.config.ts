import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark native packages as external so Turbopack doesn't try to bundle them
  serverExternalPackages: ["sweph", "pdfkit"],

  // Fix turbopack root directory detection (avoid lockfile confusion)
  turbopack: {
    root: process.cwd(),
  },

  // Standardize URL behavior - no trailing slashes
  trailingSlash: false,

  // Serve .well-known directory for TWA Digital Asset Links
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },

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
