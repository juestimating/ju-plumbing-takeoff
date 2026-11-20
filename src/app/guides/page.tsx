import { HubPage } from "@/components/page/HubPage";
import { FeaturedGuide, GuideShelf, ReadingPaths } from "@/components/page/hubs/GuidesHub";
import { GUIDES } from "@/content/guides";
import { HUBS } from "@/content/hubs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ ...HUBS.guides.seo, path: "/guides" });

/** The ItemList is the shelf: every guide in GUIDES order, named by its h1. */
export default function GuidesHub() {
  return (
    <HubPage group="guides" items={GUIDES.map((g) => ({ name: g.meta.h1, path: `/guides/${g.meta.slug}` }))} heroCard={<FeaturedGuide />}>
      <ReadingPaths />
      <GuideShelf />
    </HubPage>
  );
}
