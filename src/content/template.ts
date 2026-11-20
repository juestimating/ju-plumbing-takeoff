import type { HeroSwitcher } from "@/components/page/PageHero";
import type { JumpItem } from "@/components/page/PageJump";
import { CLAIMS, SITE } from "@/lib/site";
import { PRICE_ROWS, priceLabel } from "./pricing";
import { SERVICES, pagePath } from "./registry";
import type { Block, IconName, IllustrationName, Link, PageContent, ScopeBlock, SystemColor } from "./types";

/**
 * Template microcopy and page wiring for the 8 service pages (/services/*), read by ContentPage.
 * Page content stays in the data files; this holds only what the template writes around it, in the home voice: the
 * kicker names the visitor's question, the h2 keeps the page's keyword, prices and claims come from PRICE_ROWS and
 * CLAIMS. scripts/lint-content.mjs runs the content rules over every string here, page by page, and
 * tests/content-template.test.mjs checks the wiring against the content (ids, counts, unique h2s).
 */

const QUOTE_LINE = `Fixed quote ${CLAIMS.quote}.`;
const NDA_LINE = `No obligation, and an ${CLAIMS.nda}.`;
const [HEAD, REGIONAL] = SITE.offices.map((o) => `${o.city}, ${o.region}`);

export const COPY = {
  kicker: `A JU Estimating service, trusted by ${CLAIMS.contractors} contractors`,
  note: [QUOTE_LINE, NDA_LINE],
  noteCustom: ["Custom quote for your volume.", NDA_LINE],
  /** Under the fact card, in the NAP order (head office first). */
  offices: `A service of ${SITE.legalName}. Head office in ${HEAD}, regional office in ${REGIONAL}.`,
  sample: { label: "See a sample", href: "/samples" },
  sendPlans: "Send your plans",
  consult: "Book a 30-minute consultation",
  price: {
    kicker: "Price and turnaround",
    intro: "These are starting prices: your plans get their own fixed quote, and nothing starts until you approve it.",
    introCustom: "This service is quoted to your volume, and you see the price before anything starts.",
    label: "Starting price",
    labelCustom: "Pricing",
    quoteLine: QUOTE_LINE,
    drivers: [
      "**What moves the price:** the number of plumbing sheets, how many systems are in scope, schedule-heavy versus plan-heavy sets, and how fast you need it. **What doesn't:** the dollar value of your project.",
      "Addenda revisions are included. Added systems or a major redesign are quoted separately. Compare every service on the [pricing page](/pricing).",
    ],
    ladder: "Compare services",
    here: "You're here",
    all: "Compare every service and price",
  },
} as const;

/** Pages whose price is not a starting price keep their own intro. */
const PRICE_INTRO: Partial<Record<string, string>> = {
  "monthly-plumbing-estimating": "Every service has a published starting price, and every project gets a fixed quote before work begins.",
};

/** The topic each template h2 is built on: "How to order {a}", "More on {plural}". */
export const TOPIC: Record<string, { a: string; plural: string }> = {
  "plumbing-takeoff": { a: "a plumbing takeoff", plural: "plumbing takeoffs" },
  "plumbing-estimating": { a: "a plumbing estimate", plural: "plumbing estimates" },
  "preliminary-plumbing-estimate": { a: "a preliminary plumbing estimate", plural: "preliminary plumbing estimates" },
  "plumbing-bid-preparation": { a: "plumbing bid preparation", plural: "plumbing bid preparation" },
  "residential-plumbing-estimating": { a: "a residential plumbing estimate", plural: "residential plumbing estimates" },
  "commercial-plumbing-estimating": { a: "a commercial plumbing estimate", plural: "commercial plumbing estimates" },
  "industrial-plumbing-estimating": { a: "an industrial plumbing estimate", plural: "industrial plumbing estimates" },
  "monthly-plumbing-estimating": { a: "monthly plumbing estimating", plural: "monthly plumbing estimating" },
};

/** The hero and price-card button, the quote band h2's verb. */
export const primaryLabel = (page: PageContent) =>
  page.hero.primaryCta ?? (page.price.from === null ? "Request a custom quote" : "Get a fixed quote");

/** The form preselects the service from ?service=. */
export const quoteService = (page: PageContent) => page.slug;

/** Template h2s: unique on every page, keyword kept, no "Label: ..." catalog style. Throws for a page without a topic. */
export function h2For(page: PageContent) {
  const t = TOPIC[page.slug];
  if (!t) throw new Error(`template: no TOPIC for ${page.slug}`);
  return {
    howItWorks: `How to order ${t.a}`,
    price: `What ${t.a} costs`,
    related: `More on ${t.plural}`,
    faq: `Questions about ${t.plural}`,
    quote: `${primaryLabel(page)} for ${t.a}`,
  };
}

export const priceIntro = (page: PageContent) =>
  PRICE_INTRO[page.slug] ?? (page.price.from === null ? COPY.price.introCustom : COPY.price.intro);

/* ---------- blocks: kicker and section bar label by role, with overrides by block id ---------- */

const MEASURED = new Set(["EA", "LF", "LS", "SF", "CY"]);
/** A scope of takeoff lines (every unit is EA, LF, LS, SF or CY, alone or combined), not a list of services. */
export const isMeasured = (b: ScopeBlock) => b.items.every((i) => i.unit.split(/[/,]/).every((u) => MEASURED.has(u.trim())));

type Role = "prose" | "scope" | "scope-other" | "numbered" | "list" | "compare" | "cards" | "steps" | "sheet" | "table" | "callout" | "deliverables";

function role(b: Block): Role {
  if (b.type === "scope") return isMeasured(b) ? "scope" : "scope-other";
  if (b.type === "list") return b.numbered ? "numbered" : "list";
  if (b.type === "table") return b.variant === "sheet" ? "sheet" : "table";
  return b.type;
}

const KICKER: Record<Role, string> = {
  prose: "In plain terms",
  scope: "What we count",
  "scope-other": "What you get",
  numbered: "The method",
  list: "Before you price",
  compare: "Side by side",
  cards: "Where we work",
  steps: "From quantity to price",
  sheet: "Inside the workbook",
  table: "Your part, our part",
  callout: "Next step",
  deliverables: "What you get back",
};

const KICKER_BY_ID: Partial<Record<string, string>> = {
  "what-to-send-for-a-plumbing-estimate-before-drawings": "Before you send",
  "how-we-check-a-plumbing-bid-package": "Second estimator",
  "what-we-measure-on-a-plumbing-takeoff": "Every system",
  "dedicated-plumbing-estimator": "Full bid calendar",
  "plumbing-rough-in-estimate-by-phase": "Groundwork to trim",
  "compliance-mistakes-that-get-plumbing-bids-rejected": "What we check",
  "quantity-or-material-takeoff": "Pick your output",
  "union-open-shop-and-prevailing-wage-labor": "Your wage basis",
  "per-project-monthly-or-dedicated-estimator": "Three ways to buy",
  "hire-a-plumbing-estimator-or-outsource": "Cost and continuity",
  "low-likely-and-high-plumbing-budget-range": "The range",
  "aace-class-5-and-class-4-plumbing-estimates": "Design stage",
  "plumbing-scope-we-measure-and-process-scope-we-mark": "Where plumbing stops",
};

/** The visitor's question above a block's h2 (never repeats the h2). */
export const kickerFor = (b: Block) => KICKER_BY_ID[b.id] ?? KICKER[role(b)];

const BAR: Partial<Record<Role, string>> = {
  scope: "What we count",
  "scope-other": "What's included",
  numbered: "Method",
  list: "Scope gaps",
  compare: "Compare",
  steps: "How it's built",
  sheet: "Sample sheet",
  table: "The package",
};

const BAR_BY_ID: Partial<Record<string, string>> = {
  "dedicated-plumbing-estimator": "Dedicated estimator",
  "plumbing-rough-in-estimate-by-phase": "By phase",
  "compliance-mistakes-that-get-plumbing-bids-rejected": "Compliance",
  "quantity-or-material-takeoff": "Quantity or material",
  "union-open-shop-and-prevailing-wage-labor": "Labor",
  "per-project-monthly-or-dedicated-estimator": "Options",
  "hire-a-plumbing-estimator-or-outsource": "Hire or outsource",
  "low-likely-and-high-plumbing-budget-range": "The range",
  "aace-class-5-and-class-4-plumbing-estimates": "AACE classes",
  "plumbing-scope-we-measure-and-process-scope-we-mark": "Scope line",
  "commercial-plumbing-estimating-by-building-type": "Building types",
  "industrial-plumbing-estimating-by-facility-type": "Facility types",
  "what-you-receive-with-plumbing-bid-preparation": "Sample log",
  "what-to-send-for-a-plumbing-estimate-before-drawings": "What to send",
  "how-we-check-a-plumbing-bid-package": "Our check",
};

/**
 * "On this page" chips: every block except a first prose block (it sits right under the bar) and callouts, then the
 * template sections. A block without a bar label of its own shows its kicker.
 */
export function sectionBar(page: PageContent): JumpItem[] {
  const blocks = page.blocks
    .filter((b, i) => b.type !== "callout" && !(i === 0 && b.type === "prose"))
    .map((b) => ({ id: b.id, label: BAR_BY_ID[b.id] ?? BAR[role(b)] ?? kickerFor(b) }));
  return [
    ...blocks,
    ...(page.howItWorks !== false ? [{ id: "how-it-works", label: "How it works" }] : []),
    { id: "pricing-and-turnaround", label: "Price" },
    ...(page.faq.length ? [{ id: "frequently-asked-questions", label: "FAQ" }] : []),
  ];
}

/* ---------- hero ---------- */

const HERO_LINK: Partial<Record<string, Link>> = {
  "monthly-plumbing-estimating": { label: "See everything the package includes", href: "#what-the-monthly-package-includes" },
  "plumbing-estimating": { label: "See how an estimate is built", href: "#how-a-plumbing-estimate-is-built" },
  "preliminary-plumbing-estimate": { label: "See the low, likely and high range", href: "#low-likely-and-high-plumbing-budget-range" },
  "plumbing-bid-preparation": { label: "See what goes in the package", href: "#plumbing-bid-package-contents" },
};

/** The hero card's exit: "See all {N} line items" to the page's takeoff scope, or the page's own signature block. */
export function heroLink(page: PageContent): Link | undefined {
  const own = HERO_LINK[page.slug];
  if (own) return own;
  const scope = page.blocks.find((b): b is ScopeBlock => b.type === "scope" && isMeasured(b));
  return scope && { label: `See all ${scope.items.length} line items`, href: `#${scope.id}` };
}

/** The services you buy for one bid, in bid order, then the ongoing plan: the "What do you need?" chips and the price ladder. */
export const BID_ORDER = [
  "/services/preliminary-plumbing-estimate",
  "/services/plumbing-takeoff",
  "/services/plumbing-estimating",
  "/services/plumbing-bid-preparation",
  "/services/monthly-plumbing-estimating",
];
const ESTIMATE = "/services/plumbing-estimating";
const BRANCH = "/services/monthly-plumbing-estimating";

/** "What are you bidding?": the home hero chips that have a page of their own. */
const PROJECT_TYPES: { label: string; icon: IconName; href: string }[] = [
  { label: "Residential", icon: "home", href: "/services/residential-plumbing-estimating" },
  { label: "Commercial", icon: "building", href: "/services/commercial-plumbing-estimating" },
  { label: "Industrial", icon: "factory", href: "/services/industrial-plumbing-estimating" },
];

function service(href: string): PageContent {
  const p = SERVICES.find((x) => pagePath(x) === href);
  if (!p) throw new Error(`template: no service page at ${href}`);
  return p;
}

/** Short chip labels, so the five bid-order chips fit one row beside the card (the ask names what they are). */
const CHIP: Record<string, string> = {
  "/services/preliminary-plumbing-estimate": "Preliminary",
  "/services/plumbing-takeoff": "Takeoff",
  "/services/plumbing-estimating": "Estimate",
  "/services/plumbing-bid-preparation": "Bid prep",
  "/services/monthly-plumbing-estimating": "Monthly",
};

/** Sibling services as link chips in the hero (the current page lit). */
export function switcherFor(page: PageContent): HeroSwitcher {
  const path = pagePath(page);
  if (PROJECT_TYPES.some((t) => t.href === path)) {
    return { ask: "What are you bidding?", items: PROJECT_TYPES.map((t) => ({ ...t, current: t.href === path })) };
  }
  return {
    ask: "What do you need?",
    items: BID_ORDER.map((href) => ({ label: CHIP[href] ?? service(href).nav.label, href, icon: service(href).nav.icon, current: href === path })),
  };
}

/** Switcher siblings that share a drawing in their content get their own hero drawing, so a switch shows a change. */
const HERO_DRAWING: Partial<Record<string, IllustrationName>> = {
  "preliminary-plumbing-estimate": "fixture-schedule",
  "monthly-plumbing-estimating": "riser-isometric",
};
export const heroDrawing = (page: PageContent): IllustrationName | undefined => HERO_DRAWING[page.slug] ?? page.hero.illustration;

/** The section bar's price: "From $149 · 24–72 hours", or the price alone when the turnaround is a phrase (monthly). */
export const barPrice = (page: PageContent) =>
  /^\d/.test(page.price.turnaround) ? `${page.price.display} · ${page.price.turnaround}` : page.price.display;

/** Hero risers in the hero drawing's colors (vent draws dashed). */
const ACCENTS: Partial<Record<string, SystemColor[]>> = {
  "plumbing-takeoff": ["cold", "hot", "waste", "vent"],
  "commercial-plumbing-estimating": ["cold", "hot", "waste", "vent"],
  "industrial-plumbing-estimating": ["cold", "med"],
};
export const accentsFor = (page: PageContent): SystemColor[] => ACCENTS[page.slug] ?? ["cold", "hot", "waste"];

/* ---------- order steps and price ---------- */

/** How it works ends in a quote and consultation pair here, instead of the "Bid due this week?" banner. */
const CONSULT_ROW = new Set(["monthly-plumbing-estimating", "preliminary-plumbing-estimate"]);
export const consultRow = (page: PageContent) => CONSULT_ROW.has(page.slug);

export type LadderStop = { href: string; label: string; price: string; bestFor: string; current: boolean; branch: boolean };

/**
 * The price ladder: every service in bid order, the project-type pages standing in for the plumbing estimate on their
 * own page, the monthly plan on a branch. The page lights its own stop ("You're here").
 */
export function ladderFor(page: PageContent): { stops: LadderStop[] } {
  const path = pagePath(page);
  const own = PROJECT_TYPES.some((t) => t.href === path);
  const stops = BID_ORDER.map((h) => (h === ESTIMATE && own ? path : h)).map((href) => {
    const row = PRICE_ROWS.find((r) => r.href === href);
    if (!row) throw new Error(`template: no published price for ${href}`);
    return { href, label: service(href).nav.label, price: priceLabel(row), bestFor: row.bestFor, current: href === path, branch: href === BRANCH };
  });
  return { stops };
}
