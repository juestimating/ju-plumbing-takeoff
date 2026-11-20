import { SERVICES, getPage } from "@/content/registry";
import { ogImage, pageCard, siteCard } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} plumbing service with starting price and turnaround`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPage((await params).slug);
  return ogImage(page ? pageCard(page) : siteCard());
}
