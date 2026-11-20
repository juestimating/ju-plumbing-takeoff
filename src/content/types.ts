/**
 * Content contracts. Every service page and guide is plain data that
 * conforms to these types. The templates (src/components/page/*) turn data into HTML, so the
 * heading hierarchy, internal linking and JSON-LD are consistent by construction:
 *   - the hero renders the ONE <h1>
 *   - every block renders ONE <h2> (its `h2` field), sub-items render <h3> where noted
 *   - nothing else on the page is a heading
 *
 * Inline markup allowed in ANY string field: [link text](/internal-path) and **bold**.
 */

export type IconName =
  | "phone" | "mail" | "arrow-right" | "check" | "clock" | "shield-check" | "file-spreadsheet"
  | "file-text" | "file-check" | "ruler" | "layers" | "search" | "users" | "upload" | "wrench"
  | "droplets" | "flame" | "building" | "factory" | "hospital" | "warehouse" | "home"
  | "calculator" | "clipboard-check" | "hard-hat" | "waves" | "gauge" | "map-pin" | "download"
  | "lock" | "dollar" | "timer" | "pencil-ruler" | "boxes" | "package" | "receipt" | "list-checks"
  | "alert" | "info" | "hammer" | "cog" | "thermometer" | "zap" | "graduation-cap" | "hotel"
  | "utensils" | "stethoscope" | "siren" | "handshake" | "file-search" | "scale" | "eye"
  | "briefcase" | "calendar" | "message" | "target" | "trending-up" | "network" | "table";

/** Plumbing drawing color conventions used for chips and diagrams. Never the only signal. */
export type SystemColor = "cold" | "hot" | "waste" | "vent" | "storm" | "gas" | "fire" | "med";

export type IllustrationName =
  | "plan-markup"
  | "riser-isometric"
  | "dwv-isometric"
  | "underground-plan"
  | "fixture-schedule"
  | "equipment-room"
  | "storm-roof"
  | "gas-manifold"
  | "medical-gas-zone"
  | "sprinkler-layout"
  | "takeoff-sheet"
  | "bid-package"
  | "restroom-plan"
  | "house-rough-in"
  | "process-piping";

export type Tone = "light" | "alt" | "dark";

export type Link = { label: string; href: string };

export type ImageRef = { src: string; alt: string; width: number; height: number };

export type FaqItem = { q: string; a: string };

type BlockBase = {
  /** Unique within the page. Becomes the section anchor, e.g. #what-we-measure. */
  id: string;
  /** Rendered as the section <h2>. Descriptive and keyword-led, sentence case. */
  h2: string;
  tone?: Tone;
  intro?: string;
};

/** Paragraphs plus an optional bullet list, with an optional illustration or photo beside it. */
export type ProseBlock = BlockBase & {
  type: "prose";
  paragraphs: string[];
  bullets?: string[];
  illustration?: IllustrationName;
  image?: ImageRef;
};

/** "What we measure": each item is a row with the unit the trade buys/installs in (LF, EA, SF...). `color` draws the
 *  row's legend line in that system's color. */
export type ScopeBlock = BlockBase & {
  type: "scope";
  items: { label: string; unit: string; note?: string; color?: SystemColor }[];
  illustration?: IllustrationName;
  image?: ImageRef;
  footnote?: string;
};

/** Grid of cards. Card titles render as <h3>. `href` makes the whole card a link. */
export type CardsBlock = BlockBase & {
  type: "cards";
  columns?: 2 | 3 | 4;
  cards: { title: string; body: string; href?: string; tag?: string; color?: SystemColor; icon?: IconName }[];
};

/** Side-by-side comparison (e.g. quantity takeoff vs priced estimate). Column titles render as <h3>. */
export type CompareBlock = BlockBase & {
  type: "compare";
  columns: { title: string; body: string; points?: string[]; footer?: string }[];
};

/** Numbered or bulleted items with a bold lead-in (cost drivers, scope gaps, mistakes). No sub-headings. */
export type ListBlock = BlockBase & {
  type: "list";
  numbered?: boolean;
  items: { title: string; body: string }[];
};

/** Process steps. Step titles render as <h3>. */
export type StepsBlock = BlockBase & {
  type: "steps";
  steps: { title: string; body: string }[];
  cta?: Link;
};

/** Data table. variant "sheet" styles it like the Excel deliverable (illustrative samples only). */
export type TableBlock = BlockBase & {
  type: "table";
  caption: string;
  head: string[];
  rows: string[][];
  note?: string;
  variant?: "plain" | "sheet";
  sheetTabs?: string[];
};

/** What the client receives. Item titles render as <h3>. */
export type DeliverablesBlock = BlockBase & {
  type: "deliverables";
  items: { title: string; body: string; icon?: IconName }[];
  cta?: Link;
};

/** Highlighted note with an optional call to action. `h2` is required here too. */
export type CalloutBlock = BlockBase & {
  type: "callout";
  body: string;
  cta?: Link;
};

export type Block =
  | ProseBlock
  | ScopeBlock
  | CardsBlock
  | CompareBlock
  | ListBlock
  | StepsBlock
  | TableBlock
  | DeliverablesBlock
  | CalloutBlock;

/** A service page (/services/<slug>). */
export type PageContent = {
  slug: string;
  group: "services";
  /** Used in menus, hub cards and related-link lists. */
  nav: { label: string; blurb: string; icon?: IconName; color?: SystemColor };
  seo: {
    /** FINAL <title>. 30-60 chars. Primary keyword first. Append " | JU Plumbing Takeoff" only if it fits in 60. */
    title: string;
    /** 130-158 chars. Primary keyword, the concrete offer (price, turnaround) and a nudge to act. */
    description: string;
    keywords: string[];
  };
  hero: {
    /** The ONE <h1>. Primary keyword, natural phrasing. */
    h1: string;
    /** 1-3 sentences, 40-75 words. Plain language, specific, no hype. */
    lead: string;
    primaryCta?: string;
    secondaryCta?: Link;
    illustration?: IllustrationName;
    image?: ImageRef;
    /** Three short facts shown in the hero card under the price. */
    bullets?: string[];
    /** Replaces the default line under the hero buttons (the short quote promise, "No obligation..."). */
    note?: string;
  };
  price: {
    /** Numeric starting price in USD, or null for custom quotes. */
    from: number | null;
    /** e.g. "per project" or "per month". */
    unit?: string;
    /** Display string, e.g. "From $149". */
    display: string;
    /** "24–72 hours" prints as "Delivered in 24–72 hours". Any value that does not start with a digit prints as written. */
    turnaround: string;
    /** Short qualifier shown under the turnaround, e.g. "Larger sets are confirmed at intake." */
    note?: string;
  };
  /**
   * Replaces the shared "How a plumbing takeoff order works" steps on pages whose process differs. `false` leaves the
   * section out, for pages that already walk through their own process in a block (monthly, dedicated).
   */
  howItWorks?: false | { h2: string; intro: string; steps: { title: string; body: string }[] };
  /** Replaces the default "What moves the price" copy in the pricing section. */
  pricing?: { paragraphs: string[]; bullets?: string[] };
  /** schema.org Service.serviceType. */
  serviceType: string;
  blocks: Block[];
  /** 8-10 real questions a buyer asks. Answers 40-110 words, self-contained. */
  faq: FaqItem[];
  /** Internal hrefs, e.g. "/services/plumbing-estimating". 4-8 entries. */
  related: string[];
  /** ISO date (YYYY-MM-DD) of the last substantive edit. Drives sitemap lastmod and "Last reviewed". */
  updated: string;
};

/** Every guide is an .mdx file that exports `meta`. The MDX body must NOT contain an H1. */
export type GuideMeta = {
  slug: string;
  /** FINAL <title>, 30-60 chars. */
  title: string;
  /** 130-158 chars. */
  description: string;
  /** Optional standfirst under the h1. One or two sentences, must not repeat the h1. Falls back to `description`. */
  lead?: string;
  /** The ONE <h1> (rendered by the layout, not in the MDX body). */
  h1: string;
  category: "How-to" | "Estimating" | "Buying guide" | "Reference";
  keywords: string[];
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  /** Internal hrefs: 2-4 service pages this guide should push readers toward. */
  related: string[];
  /** Optional: only if the guide visibly renders the same Q&A in a FAQ section. */
  faq?: FaqItem[];
};

/** Copy for the two hub pages (/services, /guides). The cards come from the registry. */
export type HubContent = {
  seo: { title: string; description: string; keywords: string[] };
  hero: { h1: string; lead: string };
  /** Optional explanatory section above the card grid. */
  intro?: { h2: string; paragraphs: string[]; bullets?: string[] };
  list: { h2: string; intro?: string };
  faq: FaqItem[];
  related: string[];
  updated: string;
};
