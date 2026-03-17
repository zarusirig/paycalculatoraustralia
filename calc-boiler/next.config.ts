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

  async redirects() {
    return [
      // Common misspellings
      { source: "/pay-calculater/", destination: "/", permanent: true },
      { source: "/pay-calcualtor/", destination: "/", permanent: true },
      { source: "/superannuation-calcualtor/", destination: "/superannuation-calculator/", permanent: true },
      // Alternative URL patterns
      { source: "/calculator/", destination: "/", permanent: true },
      { source: "/tax/", destination: "/tax-brackets/", permanent: true },
      { source: "/super/", destination: "/superannuation-calculator/", permanent: true },
      // Financial year redirects
      { source: "/tax-brackets-2024-25/", destination: "/tax-brackets/", permanent: true },
      { source: "/tax-brackets-2025-26/", destination: "/tax-brackets/", permanent: true },
    ];
  },
};

export default nextConfig;
