import type { Block, FaqItem } from "@/content/types";
import { CLAIMS } from "@/lib/site";

/**
 * Copy for /samples. The three previews are ILLUSTRATIVE layouts with arbitrary round figures:
 * no dollar amounts, no labor hours, no real project data. Real JU plumbing samples (client details
 * removed) are requested through /contact; this page never claims downloadable files.
 */

export const SAMPLES_PATH = "/samples";

export const SAMPLES_SEO = {
  title: "Sample plumbing takeoffs & estimates | JU Plumbing Takeoff",
  description:
    "See a sample plumbing takeoff and estimate: a tab per system, sheet references, marked-up plans. Takeoffs from $149 in 24–72 hours. Request a sample today.",
  keywords: [
    "sample plumbing takeoff",
    "plumbing takeoff example",
    "sample plumbing estimate",
    "plumbing takeoff spreadsheet",
    "plumbing estimate example",
  ],
};

export const SAMPLES_HERO = {
  kicker: "See it before you order",
  h1: "Sample plumbing takeoffs and estimates",
  lead: "A sample plumbing takeoff shows what you receive before you send a plan: an Excel workbook with a tab for each system, line detail with sheet references, marked-up plans color-coded by system, and a basis of estimate with a scope-gap log. The previews below are illustrative layouts, and real plumbing samples with client details removed are available on request.",
  primary: { label: "Request a plumbing sample", href: "/contact?service=sample-request#request-a-quote" },
  secondary: { label: "See pricing", href: "/pricing" },
  note: `Fixed quote ${CLAIMS.quote}. No obligation, and an ${CLAIMS.nda}.`,
  card: {
    label: "Plumbing takeoff",
    price: "From $149",
    turnaround: CLAIMS.turnaround,
    bullets: [
      "Excel workbook with live formulas",
      "Marked-up plans, color-coded by system",
      "Basis of estimate and scope-gap log",
    ],
  },
};

/**
 * The three illustrative previews: a quantities tab, a material list and an estimate summary. `sheetTabs` are real
 * views of the sheet, so list only tabs the sheet's own lines stand behind: Workbook.tsx gives each one the columns or
 * the lines it lights and fails the build for a tab without one.
 */
export const SAMPLE_FIXTURES_DWV: Block = {
  type: "table",
  id: "sample-fixture-count-and-dwv-takeoff",
  tone: "alt",
  variant: "sheet",
  h2: "Sample fixture count and DWV pipe takeoff",
  intro:
    "Fixtures are counted from the schedule and matched to the plans, then pipe is measured by size and material: the tab a sanitary waste and vent takeoff produces, fed by the plumbing fixture takeoff.",
  caption: "Fixture count and DWV pipe takeoff, illustrative example",
  head: ["Item", "Size and material", "Sheet reference", "Qty", "Unit"],
  rows: [
    ["Water closet, WC-1", "Floor mounted, flush valve", "P-601, P-101 to P-103", "30", "EA"],
    ["Lavatory, LAV-1", "Wall hung", "P-601, P-101 to P-103", "30", "EA"],
    ["Urinal, UR-1", "Wall hung, flush valve", "P-601, P-101 to P-103", "10", "EA"],
    ["Floor drain, FD-1", "With trap primer", "P-601, P-101", "10", "EA"],
    ["Sanitary drain, above slab", "4 in. hubless cast iron", "P-101 to P-103, P-501", "400", "LF"],
    ["Sanitary branch, above slab", "3 in. hubless cast iron", "P-101 to P-103", "200", "LF"],
    ["Vent piping", "2 in. hubless cast iron", "P-101 to P-103, P-501", "300", "LF"],
    ["Cleanouts, CO", "2 in. to 4 in.", "P-101 to P-103", "20", "EA"],
  ],
  note: "Tags and sheet numbers vary by project. A real DWV tab keeps above-slab and below-slab pipe apart.",
};

export const SAMPLE_MATERIAL_LIST: Block = {
  type: "table",
  id: "sample-plumbing-material-list",
  variant: "sheet",
  h2: "Sample plumbing material list: net, allowance and order",
  intro:
    "A [plumbing material takeoff](/services/plumbing-takeoff#quantity-or-material-takeoff) turns measured quantities into a list to order from, with net, allowance and order quantity side by side.",
  caption: "Plumbing material list, illustrative example (quantities only)",
  head: ["Item", "Net", "Allowance", "Order", "Unit", "Buy as"],
  rows: [
    ["2 in. copper tube, hard-drawn", "400", "20", "420", "LF", "21 sticks of 20 ft"],
    ["3 in. cast iron, hubless", "200", "10", "210", "LF", "21 lengths of 10 ft"],
    ["2 in. copper 90-degree elbows", "60", "6", "66", "EA", "66 each"],
    ["3 in. hubless couplings", "80", "8", "88", "EA", "88 each"],
    ["2 in. ball valves", "12", "0", "12", "EA", "12 each"],
    ["Clevis hangers, 2 in.", "100", "0", "100", "EA", "100 each"],
    ["Floor drains, FD-1", "10", "0", "10", "EA", "10 each"],
  ],
  sheetTabs: ["Order list", "Net quantities", "Allowances"],
  note: "Allowances are examples: yours come from your own history or from assumptions stated in the file, as [plumbing pipe waste and fitting allowances](/guides/plumbing-pipe-waste-and-fitting-allowances) explains.",
};

export const SAMPLE_ESTIMATE_SUMMARY: Block = {
  type: "table",
  id: "sample-plumbing-estimate-summary",
  tone: "alt",
  variant: "sheet",
  h2: "Sample plumbing estimate summary with a basis column",
  intro:
    "An estimate adds pricing columns to the same quantities: material at the project ZIP code, labor, equipment, subcontractors and markups. This extract shows only quantity and basis; the method is on [plumbing estimating services](/services/plumbing-estimating).",
  caption: "Plumbing estimate summary, illustrative example (quantities and basis only)",
  head: ["System", "Qty", "Unit", "Basis"],
  rows: [
    ["Plumbing fixtures, all tags", "100", "EA", "Counted from schedule P-601, matched to plans"],
    ["Sanitary waste and vent, above slab", "900", "LF", "Measured from plans and riser diagram P-501"],
    ["Domestic hot, cold and recirculation", "1,600", "LF", "Measured from plans and riser diagram P-501"],
    ["Storm drainage pipe", "300", "LF", "Measured from roof plan P-301"],
    ["Water heaters and pumps", "4", "EA", "Counted from equipment schedule P-601"],
    ["Testing and disinfection", "1", "LS", "Called for in the specification"],
    ["Fire sprinkler", "-", "n/a", "Excluded: separate trade, logged in the scope-gap log"],
    ["Excavation and backfill", "-", "n/a", "Excluded: by others, per the civil sheets"],
  ],
  sheetTabs: ["Summary", "Fixtures and DWV", "Domestic water", "Storm", "Equipment"],
  note: "A real summary lists every system in scope, with the exclusions and the [AACE International](https://web.aacei.org/) estimate class stated in the basis of estimate.",
};

/** One request callout. The button opens the quote form with the sample option selected; nothing claims a downloadable file. */
export const REQUEST_A_SAMPLE: Block = {
  type: "callout",
  id: "request-a-plumbing-sample",
  h2: "Request a plumbing sample that matches your project",
  body: "Real plumbing samples have client names, addresses and identifying details removed. Tell us the project type and whether you want a takeoff, a material list or an estimate, and we send the closest match we can share. We may not have a sample for every project type, so you get the nearest one.",
  cta: { label: "Request a plumbing sample", href: "/contact?service=sample-request#request-a-quote" },
};

export const SAMPLES_FAQ: { id: string; h2: string; items: FaqItem[] } = {
  id: "sample-faq",
  h2: "Questions about sample plumbing takeoffs",
  items: [
    {
      q: "Are the sample plumbing takeoffs on this page real projects?",
      a: "No. The 3 previews above are illustrative layouts with round example figures, so no client's project is shown. The real samples we send have client names, addresses and identifying details removed, and any prices in them reflect that project's location and date, not current rates.",
    },
    {
      q: "Will my plumbing takeoff look exactly like these samples?",
      a: "The structure will: a summary tab, a tab for each system, line detail with sheet references, marked-up plans and a basis of estimate. If you send your own bid sheet or template, we fill that in instead, and the lines, sizes and quantities come from your drawings, not the examples.",
    },
    {
      q: "Can I test you on one live project first?",
      a: "Yes. Start with one project, or one system such as domestic water or waste and vent, and judge the file. The quote is fixed before any work starts, with no obligation if you do not approve it, and the [pricing page](/pricing) lists every starting price.",
    },
  ],
};

export const SAMPLES_RELATED = {
  id: "samples-related",
  h2: "Plumbing services and guides behind the samples",
  hrefs: ["/services/plumbing-takeoff", "/services/plumbing-estimating", "/guides/plumbing-estimating-spreadsheet"],
};
