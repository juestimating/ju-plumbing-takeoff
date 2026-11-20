import type { Block, FaqItem, IconName } from "@/content/types";
import { CLAIMS } from "@/lib/site";

/**
 * Copy for /pricing. Table rows and Offer JSON-LD come from PRICE_ROWS (src/content/pricing.ts),
 * so the published prices live in one place. Prose below mentions the same published prices
 * ($129, $149, $199, $349, $1,499 a month); change them here too if PRICE_ROWS ever changes.
 */

export const PRICING_PATH = "/pricing";

export const PRICING_SEO = {
  title: "Plumbing takeoff & estimating pricing | JU Plumbing Takeoff",
  description:
    "Plumbing takeoff and estimating pricing: takeoffs from $149, estimates from $199 in 24–72 hours. Fixed quote usually within 10 minutes (business hours).",
  keywords: [
    "plumbing takeoff and estimating pricing",
    "plumbing takeoff pricing",
    "plumbing estimating pricing",
    "plumbing estimate cost",
    "outsourced plumbing estimating cost",
    "plumbing takeoff service price",
  ],
};

/** The hero renders no button pair: the quote button lives in the price finder card, with the picked service. */
export const PRICING_HERO = {
  kicker: "What it costs",
  h1: "Plumbing takeoff and estimating pricing",
  lead: `Published prices: takeoffs from $149, estimates from $199, industrial estimates from $349 and a monthly package at $1,499 for 10–15 projects. Send the set and a fixed quote comes back, ${CLAIMS.quote}. Work starts only when you approve it, and files arrive in ${CLAIMS.turnaround}.`,
  note: `Fixed quote ${CLAIMS.quote}. No obligation, and an ${CLAIMS.nda}.`,
};

export const PRICING_PROOF: { icon: IconName; text: string }[] = [
  { icon: "clock", text: "Delivered in 24–72 hours" },
  { icon: "dollar", text: "Published prices from $129" },
  { icon: "receipt", text: "Fixed quote before work" },
  { icon: "shield-check", text: "Second-estimator check" },
  { icon: "lock", text: "NDA on request" },
];

/** Price tables, rendered by PriceTables from PRICE_ROWS: one table per group, the ongoing support group last. */
export const PER_PROJECT = {
  id: "per-project-prices",
  h2: "Starting prices for plumbing takeoffs, estimates and support",
  intro:
    "Every price is a starting price. A takeoff gives you quantities to price at your own rates and an estimate adds the pricing, as [plumbing takeoff vs plumbing estimate](/guides/plumbing-takeoff-vs-plumbing-estimate) explains.",
  note: "Your fixed quote replaces the starting price once we have seen the sheets, systems and deadline in your set.",
  head: ["Service", "Starting price", "Delivery", "Best for"],
  groups: [
    { group: "takeoff", caption: "Takeoffs (quantities only)" },
    { group: "estimate", caption: "Estimates (priced)" },
    { group: "bid", caption: "Bid support" },
    { group: "ongoing", caption: "Ongoing support" },
  ],
} as const;

/** The price drivers, explained once here (service pages carry the short version in their pricing section). */
export const WHAT_MOVES_PRICE: Block = {
  type: "list",
  id: "what-moves-the-price",
  tone: "dark",
  numbered: true,
  h2: "What moves the price of a plumbing takeoff or estimate",
  intro:
    "Price follows the amount of measuring in your set, not the project's dollar value: a restaurant fit-out with dense plumbing can take more effort than a large warehouse with a few fixtures. How to compare quotes is in [plumbing takeoff service cost](/guides/plumbing-takeoff-service-cost).",
  items: [
    {
      title: "Sheet count.",
      body: "More plumbing sheets mean more measuring, and we also read the architectural, structural and civil sheets for the wall types, slab depressions and site tie-ins the plumbing depends on.",
    },
    {
      title: "Systems in scope.",
      body: "Each system is measured on its own, so a set with 3 systems is a smaller file than one with all 8.",
    },
    {
      title: "Schedule-heavy or plan-heavy sets.",
      body: "Repeated rooms built on fixture schedules are counted. Runs traced by hand across a large floor plate take longer.",
    },
    {
      title: "Deadline.",
      body: `Standard delivery is ${CLAIMS.turnaround}. Rush requests are handled as capacity allows and can change the price, so send the bid date with the plans.`,
    },
  ],
};

/** The single answer on hidden costs: what the price already covers and what is quoted on top. */
export const INCLUDED_AND_EXTRA: Block = {
  type: "table",
  id: "what-every-price-includes",
  tone: "alt",
  h2: "What every price includes and what costs extra",
  intro: "Need something that is not listed? [Ask for a fixed quote](/contact) and we will say what it takes.",
  caption: "What plumbing takeoff and estimate prices include",
  head: ["Item", "Price", "What it means"],
  rows: [
    [
      "Files and the second-estimator check",
      "Included",
      "Excel workbook with live formulas, PDF summary by CSI MasterFormat division (22, plus 21, 23 and 33), marked-up plans, basis of estimate and scope-gap log, each checked by a second estimator. The [sample takeoffs](/samples) show the layout.",
    ],
    ["Revisions for addenda", "Included", "We update the lines an addendum touches, highlight what changed and reissue the file."],
    ["NDA", "Included, on request", "Signed before you send files."],
    ["Quotes and consultations", "Free", "No obligation. Work starts only when you approve the quote."],
    ["Added systems or a major redesign", "Quoted separately", "Priced before any work on them starts, so the price you approved stays the price."],
  ],
};

export const PRICING_FAQ: { id: string; h2: string; items: FaqItem[] } = {
  id: "pricing-faq",
  h2: "Pricing questions about plumbing takeoffs and estimates",
  items: [
    {
      q: "Why are your prices listed as starting prices?",
      a: "Because the work follows the set, not a price list: a tenant fit-out and a hospital wing are different amounts of measuring. The fixed quote for your plans names the price, the deliverables and the delivery date before any work begins, and it changes only if the scope does.",
    },
    {
      q: "Why do industrial plumbing estimates start at $349?",
      a: "Because the price follows the sheets and systems in scope. [Industrial plumbing estimates](/services/industrial-plumbing-estimating) start at $349, larger industrial sets have their delivery date confirmed at intake, and your fixed quote states the price and the date before any work begins.",
    },
    {
      q: "When does the monthly plumbing estimating package make sense?",
      a: "When you send 10–15 projects a month. [Monthly plumbing estimating](/services/monthly-plumbing-estimating) is $1,499 per month for that volume, and with fewer projects, per-project pricing is usually simpler. For a full bid calendar, ask about a [dedicated plumbing estimator](/services/monthly-plumbing-estimating#dedicated-plumbing-estimator), which is a custom quote.",
    },
  ],
};

export const PRICING_RELATED = {
  id: "pricing-related",
  h2: "Services and guides behind these prices",
  hrefs: [
    "/services/plumbing-takeoff",
    "/services/plumbing-estimating",
    "/guides/plumbing-takeoff-service-cost",
    "/faq",
  ],
};
