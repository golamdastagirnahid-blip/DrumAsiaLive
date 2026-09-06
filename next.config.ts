import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    // Canonical non-www choice — everything lives on www-free host.
    // (Final hostname is TBD pending the PRIORITY-ZERO domain advisory; see /docs/OPEN-QUESTIONS.md.)
    return [];
  },
  eslint: {
    // ESLint runs in CI (see eslint.config.mjs); do not fail `next build` on
    // editor-level nits while the site is still under construction.
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
