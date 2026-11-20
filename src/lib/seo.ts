import type { Metadata } from "next";
import { SITE } from "./site";

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

type MetaInput = {
  /** FINAL title (30-60 chars). Used verbatim. */
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/services/plumbing-takeoff". */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  published?: string;
  modified?: string;
  noindex?: boolean;
};

/**
 * Routes that ship their own opengraph-image file (the [slug] sections). Setting `images` on them would override that
 * per-page card. Every other page sets its own openGraph object, which hides the root card unless it is passed here.
 */
const OWN_OG_IMAGE = /^\/(?:services|guides)\/[^/]+$/;

/** One call per page. Canonical, Open Graph, Twitter and robots stay consistent everywhere. */
export function buildMetadata(o: MetaInput): Metadata {
  const url = absoluteUrl(o.path);
  return {
    title: { absolute: o.title },
    description: o.description,
    keywords: o.keywords,
    alternates: { canonical: url },
    // Omit the key on indexable pages: Next merges page metadata key by key, and `robots: undefined` would replace
    // the root layout's robots (index/follow plus the googlebot preview limits) with null.
    ...(o.noindex && { robots: { index: false, follow: false } }),
    openGraph: {
      type: o.type ?? "website",
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      title: o.title,
      description: o.description,
      ...(o.type === "article" && { publishedTime: o.published, modifiedTime: o.modified }),
      ...(!OWN_OG_IMAGE.test(o.path) && {
        images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` }],
      }),
    },
    twitter: { card: "summary_large_image", title: o.title, description: o.description },
  };
}
