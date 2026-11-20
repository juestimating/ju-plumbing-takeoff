import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

/** The company pages are rewritten rarely; every other page is re-checked when prices, turnaround or copy change. */
const frequency = (path: string): "monthly" | "yearly" => (path === "/about" || path === "/contact" ? "yearly" : "monthly");

/**
 * Indexable routes only: legal and draft pages are excluded upstream by indexableRoutes().
 * lastModified is each page's own review date ("YYYY-MM-DD"), never the build time, so the file
 * stays identical between deploys unless a page was actually edited.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: r.updated,
    changeFrequency: frequency(r.path),
    priority: r.priority,
  }));
}
