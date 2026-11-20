/**
 * Block views of the 8 service pages (src/components/page/content/*): the template microcopy they print and the
 * per-block wiring, keyed by block id. Plain data with type imports only, so the content linter can read it. Page
 * content stays in src/content/services; the views check this wiring against the content they render and throw at
 * build time when the two no longer match (a renamed column, a reworded quote, a missing price).
 */
import type { IconName, Link, Tone } from "./types";

/** Fixed strings of the block views. Units: what each measurement unit means, in the scope board's unit filter. */
export const BLOCK_COPY = {
  scope: {
    count: "line items",
    units: { EA: "counted each", LF: "measured by length", SF: "measured by area", CY: "measured by volume", LS: "lump sum" },
    note: "Fixed quote usually within 10 minutes during business hours.",
    ask: "Filter by unit",
    all: "All",
    of: "of",
  },
  gap: { ask: "Pick a gap", log: "Scope-gap log", count: "Gap", footer: "Scope-gap log:" },
  equation: "What an estimate adds",
  build: { caption: "Not to scale", ask: "Pick a step" },
  compare: { or: "or", plansCaption: "Illustrative bid calendars, not client data.", fits: "Fits" },
  timeline: { here: "You're here" },
  handoff: { ju: "JU", juText: "we do it", you: "You", youText: "you do it" },
  sheet: {
    honesty: "Illustrative layout. Figures are examples, not project data.",
    hintSource: "Pick a line to see where it came from.",
    hintFull: "Pick a line to read it in full.",
    srSource: "Show source of ",
    srFull: "Read in full: ",
    status: "{label}: {n} of {total} lines",
    column: "{label} column",
    sampleAsk: "Want to open a full file before you order?",
    sample: { label: "See a sample file", href: "/samples" },
  },
} as const;

/** Blocks that run on navy instead of their content tone, so no page runs more than about three light sections. */
export const TONE: Partial<Record<string, Tone>> = {
  "how-a-plumbing-estimate-is-built": "dark",
  "dedicated-plumbing-estimator": "dark",
};

/** Service lists (not measured scope) shown as a role: a card for who does the work beside the duties. The other
 *  service lists are the package grid. */
export const SCOPE_ROLE: Partial<Record<string, { title: string; badge: string; icon: IconName }>> = {
  "dedicated-plumbing-estimator": { title: "One named estimator", badge: "Custom quote", icon: "users" },
};

/** Compare blocks whose view is not the default (vs for two columns, trio for three). */
export type CompareView = "vs" | "trio" | "qto-mto" | "plans" | "range" | "meter" | "marked";
export const COMPARE_VIEW: Partial<Record<string, CompareView>> = {
  "quantity-or-material-takeoff": "qto-mto",
  "per-project-monthly-or-dedicated-estimator": "plans",
  "low-likely-and-high-plumbing-budget-range": "range",
  "aace-class-5-and-class-4-plumbing-estimates": "meter",
  "plumbing-scope-we-measure-and-process-scope-we-mark": "marked",
};

/** A role tile on each trio card, one icon per column. */
export const TRIO_ICONS: Partial<Record<string, IconName[]>> = {
  "union-open-shop-and-prevailing-wage-labor": ["users", "hard-hat", "scale"],
};

/**
 * The quantity or material takeoff strip: one line of the page's own sheet (`sheet`, row `row`; the Sheet column is
 * left out for width), shown as each output. `quote` must appear in that output's compare card (column `col`); `cta`
 * is the quote button under the readout while that output is picked.
 */
export const QTO_MTO: Partial<Record<string, { sheet: string; row: number; ask: string; stop: string; modes: { key: "qto" | "mto"; label: string; col: number; quote: string; cta: string }[] }>> = {
  "quantity-or-material-takeoff": {
    sheet: "what-you-receive-with-a-plumbing-takeoff",
    row: 0,
    ask: "Show this line as",
    stop: "Stops at Net",
    modes: [
      { key: "qto", label: "Quantity takeoff", col: 0, quote: "If the plans show 400 LF of 2 in. copper, the sheet says 400 LF.", cta: "Get a fixed quote for a quantity takeoff" },
      { key: "mto", label: "Material takeoff", col: 1, quote: "400 LF plus a 20 LF allowance is 420 LF, or 21 sticks of 20 ft.", cta: "Get a fixed quote for a material takeoff" },
    ],
  },
};

/**
 * Plan cards: a bid calendar per card (filled days out of 20) and the "How often do you bid?" fit switch. Each
 * card's first point must start with "Suits": the switch reads it back as the answer, with that card's route under it
 * (a quote for the service slug, "" for the general form, or the template's 30-minute consultation).
 */
export type FitRoute = { label: string; service: string } | { consult: true };
export const FIT: Partial<Record<string, { question: string; hint: string; options: string[]; calendars: number[]; routes: FitRoute[] }>> = {
  "per-project-monthly-or-dedicated-estimator": {
    question: "How often do you bid?",
    hint: "Pick how often you bid to see which option fits.",
    options: ["Uneven or seasonal", "Most weeks", "A full calendar"],
    calendars: [3, 12, 20],
    routes: [
      { label: "Get a fixed quote", service: "" },
      { label: "Get a fixed quote", service: "monthly-plumbing-estimating" },
      { consult: true },
    ],
  },
};

/**
 * Low, likely and high cards as a picker: the ask and the case labels are the page's "Which case?" sheet view
 * (`sheet`, a columns view), so both controls name the cases alike; `more` links to that sheet. The pick reads back
 * the last sentence of the case's own text.
 */
export const RANGE: Partial<Record<string, { sheet: string; more: string }>> = {
  "low-likely-and-high-plumbing-budget-range": {
    sheet: "illustrative-low-likely-and-high-plumbing-quantities",
    more: "See all three cases in the workbook",
  },
};

/** AACE class meter above the class cards: lit classes must be the cards' own classes. */
export const CLASS_METER: Partial<Record<string, { label: string; classes: number[]; lit?: boolean }[]>> = {
  "aace-class-5-and-class-4-plumbing-estimates": [
    { label: "Preliminary estimate", classes: [5, 4], lit: true },
    { label: "Need drawings to measure", classes: [3, 2, 1] },
  ],
};

/** Steps blocks shown as the estimate build: one band per step, bottom to top. */
export const STEPS_BUILD: Partial<Record<string, string[]>> = {
  "how-a-plumbing-estimate-is-built": ["Quantities", "Material", "Labor", "Equipment and subcontracts", "Project costs", "Markups", "Basis and check"],
};

/** Dark gap lists that log something other than scope gaps. `count` prefixes "01 of 06" (empty: the number alone). */
export const GAP_LOG: Partial<Record<string, { ask: string; log: string; count: string; footer: string }>> = {
  "compliance-mistakes-that-get-plumbing-bids-rejected": {
    ask: "Pick a mistake",
    log: "Bid compliance check",
    count: "",
    footer: "Checked against the instructions to bidders",
  },
};

/**
 * Sheet views. `columns`: focus one column (the header names must match `labels`). `rows`: light the rows whose
 * `column` holds the picked value (values in order of first appearance; `tabs` = the sheet's own bottom tabs).
 */
export type SheetView =
  | { kind: "columns"; ask: string; columns: number[]; labels: string[]; all: string }
  | { kind: "rows"; ask: string; column: number; all: string; control: "segmented" | "tabs" };
export const SHEET_VIEW: Partial<Record<string, SheetView>> = {
  "illustrative-low-likely-and-high-plumbing-quantities": { kind: "columns", ask: "Which case?", columns: [2, 3, 4], labels: ["Low", "Likely", "High"], all: "All three" },
  "illustrative-residential-plumbing-takeoff-quantities": { kind: "rows", ask: "Workbook tabs", column: 0, all: "Summary", control: "tabs" },
};

/** Sheets with no sample file to offer after them (there is no bid package sample). */
export const SHEET_NO_SAMPLE = ["what-you-receive-with-plumbing-bid-preparation"];

/**
 * The plumbing artifact beside a prose block that has no drawing of its own. `adds` must appear in the page's hero
 * lead; prices come from the published price rows (`from`, `to`, span `href`s).
 */
export type ProseExtra =
  | { kind: "equation"; from: string; to: string; adds: string[] }
  | { kind: "timeline"; stops: string[]; spans: { from: number; to: number; href: string; current?: boolean }[] }
  | { kind: "check"; label?: string; cta?: Link };
export const PROSE_EXTRA: Partial<Record<string, ProseExtra>> = {
  "outsourced-plumbing-estimating": {
    kind: "equation",
    from: "/services/plumbing-takeoff",
    to: "/services/plumbing-estimating",
    adds: ["material priced for the project ZIP code", "labor", "equipment", "subcontractors", "markups"],
  },
  "plumbing-budget-before-drawings": {
    kind: "timeline",
    stops: ["Program and sketches", "Schematic design", "Construction drawings"],
    spans: [
      { from: 0, to: 1, href: "/services/preliminary-plumbing-estimate", current: true },
      { from: 2, to: 2, href: "/services/plumbing-estimating" },
    ],
  },
  "what-to-send-for-a-plumbing-estimate-before-drawings": {
    kind: "check",
    cta: { label: "Send what you have", href: "/contact?service=preliminary-plumbing-estimate" },
  },
  "how-we-check-a-plumbing-bid-package": { kind: "check", label: "Checked against the instructions to bidders" },
};
