import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  // `ANALYZE_MAPS=1 npx next build --webpack` emits browser source maps so the
  // chunks in out/_next/static/chunks can be attributed to modules (see
  // docs/seo/2026-09-24-performance-pass.md). Off by default: the maps would
  // otherwise be deployed with the site.
  productionBrowserSourceMaps: process.env.ANALYZE_MAPS === "1",

  experimental: {
    // Per-module imports for icon/primitive barrels. lucide-react is already
    // on Next's built-in list; it is named here so the intent is explicit.
    // radix-ui is the umbrella package components/ui/* import from.
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // NOTE: redirects() and headers() do not execute at runtime when output: "export"
  // is set — Next.js produces purely static HTML. All redirects/headers for production
  // live in firebase.json so the Firebase CDN handles them at the edge.
};

export default nextConfig;
