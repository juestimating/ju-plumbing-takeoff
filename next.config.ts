import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Production indexability is opt-in: only the live domain sets NEXT_PUBLIC_SITE_ENV=production
// (or Vercel's own production target). Every preview/local build is served noindex.
const isProduction =
  process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_SITE_ENV === "production";

// Fail the Vercel Production build instead of shipping a placeholder canonical host or a form that cannot send.
// VERCEL_ENV is "production" only for the Production target, so local and preview builds are not affected.
if (process.env.VERCEL_ENV === "production") {
  const problems: string[] = [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  const host = URL.canParse(siteUrl) ? new URL(siteUrl).hostname : "";
  if (!siteUrl.startsWith("https://") || !host) {
    problems.push("NEXT_PUBLIC_SITE_URL is missing or not an https origin (set it to the live domain, for example https://www.yourdomain.com)");
  } else if (/^(?:localhost|127\.0\.0\.1)$|(?:^|\.)example\.(?:com|org|net)$/i.test(host)) {
    problems.push("NEXT_PUBLIC_SITE_URL is a placeholder (localhost or example.com)");
  }
  const email = Boolean(process.env.RESEND_API_KEY?.trim() && process.env.LEAD_FROM_EMAIL?.trim());
  if (!email && !process.env.LEAD_WEBHOOK_URL?.trim()) {
    problems.push("no lead delivery channel: set RESEND_API_KEY and LEAD_FROM_EMAIL, and/or LEAD_WEBHOOK_URL");
  }
  if (problems.length) throw new Error(`Production build refused: ${problems.join("; ")}.`);
}

// Content-Security-Policy. Every page is static, so Next's inline flight-data scripts (5 to 12 per page, different on every
// page and every build) can carry neither a nonce (nonces force dynamic rendering) nor a stable hash. script-src therefore keeps
// 'unsafe-inline'; everything else is locked to this origin. GA4 hosts are added only when NEXT_PUBLIC_GA_ID is set.
// Sent in production builds only (next dev needs eval and inline scripts). CSP_REPORT_ONLY=1 sends it as Report-Only.
const ga = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "");
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${ga ? " https://www.googletagmanager.com" : ""}`,
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  `img-src 'self' data:${ga ? " https://*.google-analytics.com https://*.googletagmanager.com" : ""}`,
  "font-src 'self'",
  `connect-src 'self'${ga ? " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: process.env.CSP_REPORT_ONLY === "1" ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy", value: csp }]
    : []),
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  reactStrictMode: true,
  // A stray lockfile in the user's home dir confuses workspace-root inference.
  turbopack: { root: process.cwd() },
  // A real quote request is well under 50 KB. Next's default cap for a Server Action body is 1 MB.
  experimental: { serverActions: { bodySizeLimit: "128kb" } },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(isProduction ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
      {
        source: "/images/:path*",
        // File names under /images are not content-hashed, so no "immutable": a replaced photo must reach returning visitors.
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

// Turbopack needs plugin names as strings (functions are not serializable).
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
