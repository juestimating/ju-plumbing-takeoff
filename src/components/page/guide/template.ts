import { PRICE_ROWS } from "@/content/pricing";
import type { GuideMeta, SystemColor } from "@/content/types";
import { CLAIMS } from "@/lib/site";

/**
 * Template copy for the 11 guide pages (guides SPEC 6). The MDX stays untouched: these are the section headings and
 * labels the template writes around it. Every heading is unique site-wide and keeps the guide's keyword. This file
 * must not import the guides themselves: the MDX components read H2_SYSTEMS, and the guides import those components.
 */
export type GuideTemplate = {
  /** Hand it off (#related-services) h2. */
  related: string;
  /** FAQ h2. */
  faq: string;
  /** Quote band h2. */
  band: string;
  /** The curated next guide (Read next). */
  next: string;
  /** Checklist guides: list items get tick boxes. */
  ticks?: true;
};

export const GUIDE_TEMPLATE: Record<string, GuideTemplate> = {
  "how-to-do-a-plumbing-takeoff": {
    related: "Hand the plumbing takeoff to an estimator",
    faq: "Questions about how to do a plumbing takeoff",
    band: "Send your plans and skip the plumbing takeoff",
    next: "plumbing-takeoff-checklist",
  },
  "plumbing-takeoff-checklist": {
    related: "Plumbing takeoff services that cover this checklist",
    faq: "Questions about the plumbing takeoff checklist",
    band: "A plumbing takeoff checklist, worked on your plans",
    next: "how-to-estimate-a-plumbing-job",
    ticks: true,
  },
  "how-to-estimate-a-plumbing-job": {
    related: "Hand the plumbing estimate to an estimator",
    faq: "Questions about how to estimate a plumbing job",
    band: "Send your plans for a priced plumbing estimate",
    next: "plumbing-estimating-mistakes",
  },
  "plumbing-takeoff-vs-plumbing-estimate": {
    related: "Plumbing takeoff and estimate services, priced up front",
    faq: "Questions about plumbing takeoff vs estimate",
    band: "Send your plans for a plumbing takeoff or an estimate",
    next: "plumbing-takeoff-service-cost",
  },
  "plumbing-takeoff-services-vs-software": {
    related: "Plumbing takeoff services checked by a second estimator",
    faq: "Questions about plumbing takeoff software vs service",
    band: "Try a plumbing takeoff service on your next set",
    next: "plumbing-takeoff-service-cost",
  },
  "plumbing-takeoff-service-cost": {
    related: "Plumbing takeoff cost, service by service",
    faq: "Questions about plumbing takeoff cost",
    band: "Get a fixed plumbing takeoff cost for your set",
    next: "plumbing-takeoff-services-vs-software",
  },
  "how-to-read-plumbing-plans": {
    related: "Hand your plumbing plans to an estimator",
    faq: "Questions about how to read plumbing plans",
    band: "Send your plumbing plans and we read the set",
    next: "how-to-do-a-plumbing-takeoff",
  },
  "plumbing-estimating-mistakes": {
    related: "Catch plumbing estimating mistakes with a second estimator",
    faq: "Questions about plumbing estimating mistakes",
    band: "Send your plans before plumbing estimating mistakes reach the bid",
    next: "plumbing-bid-checklist",
  },
  "plumbing-pipe-waste-and-fitting-allowances": {
    related: "Material takeoffs that show the plumbing waste factor",
    faq: "Questions about the plumbing waste factor",
    band: "Get the plumbing waste factor applied to your plans",
    next: "plumbing-estimating-spreadsheet",
  },
  "plumbing-bid-checklist": {
    related: "Hand the plumbing bid package to an estimator",
    faq: "Questions about the plumbing bid checklist",
    band: "Send your plans and get the plumbing bid package assembled",
    next: "plumbing-estimating-spreadsheet",
    ticks: true,
  },
  "plumbing-estimating-spreadsheet": {
    related: "Start from a finished plumbing estimating spreadsheet",
    faq: "Questions about the plumbing estimating spreadsheet",
    band: "Send your plans and get a plumbing estimating spreadsheet back",
    next: "how-to-estimate-a-plumbing-job",
  },
};

// Fails the build if two template headings repeat, or a guide points Read next at itself.
const strings = Object.values(GUIDE_TEMPLATE).flatMap((t) => [t.related, t.faq, t.band]);
if (new Set(strings.map((x) => x.toLowerCase())).size !== strings.length) throw new Error("guide template: a heading repeats");
for (const [slug, t] of Object.entries(GUIDE_TEMPLATE)) if (t.next === slug) throw new Error(`guide template: ${slug} reads next itself`);

export function templateFor(slug: string): GuideTemplate {
  const t = GUIDE_TEMPLATE[slug];
  if (!t) throw new Error(`guide template: no entry for ${slug}`);
  return t;
}

/** Article h2s that name plumbing systems draw the systems' legend lines instead of the amber rule (keyed by heading id). */
export const H2_SYSTEMS: Record<string, SystemColor[]> = {
  "sanitary-waste-and-vent-piping-what-to-measure": ["waste", "vent"],
  "domestic-hot-cold-and-recirculation-water-items": ["cold", "hot"],
  "storm-drainage-and-roof-drain-items-to-take-off": ["storm"],
  "gas-medical-gas-and-fire-sprinkler-piping-items": ["gas", "med", "fire"],
  "underground-piping-and-site-connection-items": ["waste"],
};

export const CATEGORY_KICKER: Record<GuideMeta["category"], string> = {
  "How-to": "How-to guide",
  Estimating: "Estimating guide",
  "Buying guide": "Buying guide",
  Reference: "Estimator's reference",
};

export const HANDOFF_INTRO = `Send the plans and we take it from there: a fixed quote first, delivery in ${CLAIMS.turnaround} and a second estimator on every file.`;

/** The hand-off offer (hero card and sidebar card), set by the guide's first related service. */
export type Offer = { title: string; price: string; href: string };

const OFFERS: Record<string, [skip: string, noun: string]> = {
  "/services/plumbing-takeoff": ["Skip the takeoff.", "Takeoffs"],
  "/services/plumbing-estimating": ["Skip the estimate.", "Estimates"],
  "/services/plumbing-bid-preparation": ["Skip the bid paperwork.", "Bid preparation"],
};

/** Throws on a service without an offer line or a published price, so a stale price can never ship. */
export function offerFor(href: string): Offer {
  const offer = OFFERS[href];
  const from = PRICE_ROWS.find((r) => r.href === href)?.from;
  if (!offer || from == null) throw new Error(`guide template: no hand-off offer for ${href}`);
  return {
    title: `${offer[0]} Send us the plans.`,
    price: `${offer[1]} from $${from.toLocaleString("en-US")}`,
    href: `/contact?service=${href.slice("/services/".length)}`,
  };
}
