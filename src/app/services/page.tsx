import { HubPage } from "@/components/page/HubPage";
import { NeedFinder, ServiceCatalog, ServicesHeroCard, servicesInOrder } from "@/components/page/hubs/ServicesHub";
import { HUBS } from "@/content/hubs";
import { pagePath } from "@/content/registry";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ ...HUBS.services.seo, path: "/services" });

/** The ItemList follows the catalog's rendered order (servicesInOrder), not the registry order. */
export default function ServicesHub() {
  return (
    <HubPage group="services" items={servicesInOrder().map((p) => ({ name: p.nav.label, path: pagePath(p) }))} heroCard={<ServicesHeroCard />}>
      <NeedFinder />
      <ServiceCatalog />
    </HubPage>
  );
}
