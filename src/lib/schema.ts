import { SITE } from "./site";
import { absoluteUrl } from "./seo";
import type { FaqItem } from "@/content/types";

export type Node = Record<string, unknown>;

const id = (frag: string) => `${SITE.url}/#${frag}`;
type Office = (typeof SITE.offices)[number];
/** One ProfessionalService node per office, as Google's local guidance asks: #office-north-canton, #office-manassas. */
const officeId = (o: Office) => id(`office-${o.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
/** org = the brand, site = the WebSite, biz = the head office node (kept for callers that still link to it; prefer org). */
export const IDS = { org: id("organization"), site: id("website"), biz: officeId(SITE.offices[0]) };

const postal = (o: Office) => ({
  "@type": "PostalAddress",
  streetAddress: o.street,
  addressLocality: o.city,
  addressRegion: o.region,
  postalCode: o.postalCode,
  addressCountry: o.country,
});

const hours = SITE.hours.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: h.schema.dayOfWeek,
  opens: h.schema.opens,
  closes: h.schema.closes,
}));

/** One Organization, the WebSite and one ProfessionalService per office. Emitted once, in the root layout, so every page has them. */
export function siteNodes(): Node[] {
  return [
    {
      "@type": "Organization",
      "@id": IDS.org,
      name: SITE.name,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/logo.png"),
      email: SITE.email,
      telephone: SITE.phone.tel,
      // The LLC behind this brand. The @id is the Organization the main site declares, so the two sites read as one company.
      parentOrganization: { "@type": "Organization", "@id": `${SITE.parentUrl}/#organization`, name: SITE.legalName, url: SITE.parentUrl },
      location: SITE.offices.map((o) => ({ "@id": officeId(o) })),
    },
    {
      "@type": "WebSite",
      "@id": IDS.site,
      url: absoluteUrl("/"),
      name: SITE.name,
      description: `${SITE.tagline} for plumbing contractors, general contractors and builders.`,
      inLanguage: "en-US",
      publisher: { "@id": IDS.org },
    },
    // Head office (OH) first, regional office (VA) second, on every page. Do not reduce to one.
    ...SITE.offices.map((o) => ({
      "@type": "ProfessionalService",
      "@id": officeId(o),
      name: SITE.name,
      disambiguatingDescription: o.role,
      url: absoluteUrl("/contact"),
      image: absoluteUrl("/logo.png"),
      telephone: SITE.phone.tel,
      email: SITE.email,
      address: postal(o),
      areaServed: { "@type": "Country", name: "United States" },
      openingHoursSpecification: hours,
      parentOrganization: { "@id": IDS.org },
    })),
  ];
}

export function breadcrumbNode(items: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

type PageType = "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";

export function webPageNode(o: {
  path: string;
  name: string;
  description: string;
  type?: PageType;
  modified?: string;
}): Node {
  return {
    "@type": o.type ?? "WebPage",
    "@id": `${absoluteUrl(o.path)}#webpage`,
    url: absoluteUrl(o.path),
    name: o.name,
    description: o.description,
    inLanguage: "en-US",
    isPartOf: { "@id": IDS.site },
    ...(o.modified && { dateModified: o.modified }),
  };
}

export function serviceNode(o: {
  path: string;
  name: string;
  description: string;
  serviceType: string;
  from: number | null;
}): Node {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(o.path)}#service`,
    name: o.name,
    description: o.description,
    serviceType: o.serviceType,
    url: absoluteUrl(o.path),
    provider: { "@id": IDS.org },
    areaServed: { "@type": "Country", name: "United States" },
    ...(o.from !== null && {
      offers: {
        "@type": "Offer",
        url: absoluteUrl(o.path),
        priceCurrency: "USD",
        priceSpecification: { "@type": "PriceSpecification", minPrice: o.from, priceCurrency: "USD" },
      },
    }),
  };
}

/** Strip inline markup ([text](url), **bold**) so JSON-LD text matches what a reader sees. */
export const plain = (s: string) =>
  s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

export function faqNode(items: FaqItem[]): Node | null {
  if (!items.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: plain(f.q),
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
}

export function articleNode(o: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  keywords?: string[];
  /** Absolute image URL. Defaults to the guide's own opengraph-image route. */
  image?: string;
}): Node {
  // Name and url inline: the full Organization sits in the root layout's script block, and Google does not promise to resolve an @id across blocks.
  const org = { "@type": "Organization", "@id": IDS.org, name: SITE.name, url: absoluteUrl("/") };
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(o.path)}#article`,
    headline: o.headline,
    description: o.description,
    image: [o.image ?? absoluteUrl(`${o.path}/opengraph-image`)],
    mainEntityOfPage: { "@id": `${absoluteUrl(o.path)}#webpage` },
    datePublished: o.published,
    dateModified: o.modified,
    author: org,
    publisher: { ...org, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    inLanguage: "en-US",
    ...(o.keywords?.length && { keywords: o.keywords.join(", ") }),
  };
}

export function itemListNode(items: { name: string; path: string }[]): Node {
  return {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}
