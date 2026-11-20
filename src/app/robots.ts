import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * Production allows crawling (minus the API and the post-form thank-you page) and lists the sitemap.
 * Every other environment (local, preview, staging) disallows everything. This mirrors the robots meta
 * tag in the root layout and the X-Robots-Tag header in next.config.ts, so all three agree.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE.isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
