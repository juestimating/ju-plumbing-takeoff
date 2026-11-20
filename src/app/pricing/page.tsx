import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { ProofBar } from "@/components/page/ProofBar";
import { FaqSection } from "@/components/page/Faq";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { IncludedLedger } from "@/components/company/pricing/IncludedLedger";
import { PriceDrivers } from "@/components/company/pricing/PriceDrivers";
import { PriceFinder } from "@/components/company/pricing/PriceFinder";
import { PriceTables } from "@/components/company/pricing/PriceTables";
import {
  PRICING_FAQ, PRICING_HERO, PRICING_PATH, PRICING_PROOF, PRICING_RELATED, PRICING_SEO,
} from "@/components/company/pricing/content";
import s from "@/components/company/pricing/finder.module.css";
import { PRICE_ROWS } from "@/content/pricing";
import { IDS, breadcrumbNode, faqNode, webPageNode, type Node } from "@/lib/schema";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";

export const metadata = buildMetadata({ ...PRICING_SEO, path: PRICING_PATH });

/** Offer catalog built from PRICE_ROWS: one Offer per service, with the published starting price as minPrice. */
function offerCatalogNode(): Node {
  return {
    "@type": "OfferCatalog",
    "@id": `${absoluteUrl(PRICING_PATH)}#catalog`,
    name: "Plumbing takeoff and estimating services",
    url: absoluteUrl(PRICING_PATH),
    itemListElement: PRICE_ROWS.map((r) => ({
      "@type": "Offer",
      name: r.service,
      description: r.display ? `${r.display}. ${r.bestFor}.` : `${r.bestFor}.`,
      url: absoluteUrl(r.href),
      priceCurrency: "USD",
      ...(r.from !== null && {
        priceSpecification: { "@type": "PriceSpecification", minPrice: r.from, priceCurrency: "USD" },
      }),
      itemOffered: {
        "@type": "Service",
        name: r.service,
        url: absoluteUrl(r.href),
        provider: { "@id": IDS.org },
        areaServed: { "@type": "Country", name: "United States" },
      },
    })),
  };
}

/**
 * "What will mine cost?": pick a need in the hero and read its starting price, compare every price, see what moves it,
 * check what is included, then quote it. The quote button sits in the price finder, with the picked service.
 */
export default function PricingPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path: PRICING_PATH, name: PRICING_SEO.title, description: PRICING_SEO.description, modified: SITE.lastReviewed }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Pricing", path: PRICING_PATH },
          ]),
          offerCatalogNode(),
          faqNode(PRICING_FAQ.items),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        kicker={PRICING_HERO.kicker}
        h1={PRICING_HERO.h1}
        lead={PRICING_HERO.lead}
        note={PRICING_HERO.note}
        extra={
          <Link href="/samples" className={cx("arrow-link", s.sampleLink)}>
            See a sample file first <ArrowRight size={18} aria-hidden="true" />
          </Link>
        }
        card={<PriceFinder />}
      />
      <ProofBar items={PRICING_PROOF} tone="light" />
      <PriceTables tone="light" />
      <PriceDrivers />
      <IncludedLedger />
      <RelatedLinks id={PRICING_RELATED.id} h2={PRICING_RELATED.h2} hrefs={PRICING_RELATED.hrefs} tone="light" />
      <FaqSection id={PRICING_FAQ.id} h2={PRICING_FAQ.h2} items={PRICING_FAQ.items} tone="alt" updated={SITE.lastReviewed} />
      <CtaBand source={PRICING_PATH} h2="Get a fixed price for your plumbing takeoff or estimate" />
    </>
  );
}
