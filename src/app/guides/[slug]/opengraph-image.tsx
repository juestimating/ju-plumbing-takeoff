import { GUIDES, getGuide } from "@/content/guides";
import { guideCard, ogImage, siteCard } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} plumbing estimating guide`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.meta.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  return ogImage(guide ? guideCard(guide.meta) : siteCard());
}
