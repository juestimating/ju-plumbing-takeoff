import { ogImage, siteCard } from "@/lib/og";
import { SITE } from "@/lib/site";

/** Site-wide default card. Every page without its own opengraph-image (home, hubs, pricing, about...) uses it. */
export const alt = `${SITE.name}: ${SITE.tagline.toLowerCase()}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage(siteCard());
}
