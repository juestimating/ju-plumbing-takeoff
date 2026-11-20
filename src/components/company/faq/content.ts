import type { FaqItem } from "@/content/types";
import { CLAIMS, SITE } from "@/lib/site";

/**
 * Copy for /faq: five groups, 18 questions, one FAQPage JSON-LD that contains every question.
 * The single home for policy answers every page shares (what to send, price and quotes, turnaround,
 * accuracy and checks, files and revisions, NDA), so service pages link here instead of
 * repeating them. Payment terms, refund and cancellation rules are not confirmed by the client yet,
 * so nothing here states them.
 */

export const FAQ_PATH = "/faq";

export const FAQ_SEO = {
  title: "Plumbing takeoff & estimating FAQ | JU Plumbing Takeoff",
  description:
    "Plumbing takeoff and estimating FAQ: pricing from $129, delivery in 24–72 hours, plus accuracy, files, revisions and NDAs. Can't find yours? Ask us.",
  keywords: [
    "plumbing takeoff and estimating faq",
    "plumbing takeoff questions",
    "plumbing estimating questions",
    "outsourced plumbing estimating faq",
    "plumbing takeoff service questions",
  ],
};

export const FAQ_HERO = {
  kicker: "Straight answers",
  h1: "Plumbing takeoff and estimating FAQ",
  lead: `Contractors and builders ask the same questions before they send plans: what it costs, how fast it comes back, how accurate it is, which files to send and who sees them. Not covered here? [Contact us](/contact) or call [${SITE.phone.display}](tel:${SITE.phone.tel}).`,
  primary: { label: "Get a fixed quote", href: "/contact" },
  secondary: { label: "See pricing", href: "/pricing" },
  /** The amber button's reassurance line (the home hero note). */
  note: `Fixed quote ${CLAIMS.quote}. No obligation, and an ${CLAIMS.nda}.`,
};

export type FaqGroup = {
  id: string;
  /** Short label for the jump links in the hero. */
  chip: string;
  h2: string;
  items: FaqItem[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "getting-started",
    chip: "Getting started",
    h2: "Getting started with plumbing takeoff and estimating services",
    items: [
      {
        q: "What do I need to send to get a quote?",
        a: "Send the plumbing sheets, fixture and equipment schedules, specification sections and addenda, plus civil sheets if site utilities are in scope, with the systems you want and the bid date. Attach PDF, DWG, DXF or ZIP files, or share a Dropbox, Google Drive or plan-room link.",
      },
      {
        q: "Can you work from incomplete or early plumbing drawings?",
        a: "Yes. We measure what the drawings show, list what is missing in the scope-gap log and state our assumptions. When the design is too early to measure, a [preliminary plumbing estimate](/services/preliminary-plumbing-estimate) from $129 gives a low, likely and high budget range instead.",
      },
      {
        q: "Do you cover gas, medical gas and fire sprinkler piping?",
        a: "Yes, when they are in your scope. Each is measured as its own plumbing system, with the pipe, valves, outlets or heads the drawings show. Fire sprinkler is its own trade in many markets, so tell us whether you carry it.",
      },
      {
        q: "Do you work with plumbing contractors in every state?",
        a: "Yes. We work with contractors in all 50 states, and most projects are handled entirely online, so you can send plans from anywhere. Our head office is in North Canton, OH and our regional office is in Manassas, VA.",
      },
    ],
  },
  {
    id: "pricing-and-turnaround",
    chip: "Pricing and turnaround",
    h2: "Pricing, quotes and turnaround for plumbing takeoffs",
    items: [
      {
        q: "How much do plumbing takeoff and estimating services cost?",
        a: "Plumbing takeoffs start at $149 and plumbing estimates at $199. The price follows the sheets, systems and deadline in your set, not the project's dollar value, and the [pricing page](/pricing) lists the starting price of every service.",
      },
      {
        q: "Are quotes free, and do I have to accept one?",
        a: `Yes, quotes and consultations are free, with no obligation. A fixed quote with the price, the deliverables and the delivery date comes back ${CLAIMS.quote}. It is one price for the project, not an hourly rate, and work starts only when you approve it.`,
      },
      {
        q: "Do I need a monthly plan, or can I order one project at a time?",
        a: "One at a time is fine: every service is available per project at its published starting price. [Monthly plumbing estimating](/services/monthly-plumbing-estimating) at $1,499 a month for 10–15 projects is optional, and a [dedicated plumbing estimator](/services/monthly-plumbing-estimating#dedicated-plumbing-estimator) on a custom quote covers a full bid calendar.",
      },
      {
        q: "How fast can I get a plumbing takeoff or estimate back?",
        a: `Standard delivery is ${CLAIMS.turnaround}. The clock starts when we have a complete set and you have approved the quote. If sheets are missing, we say so when we review the set, and larger or phased projects get a confirmed delivery date in the quote.`,
      },
      {
        q: "Can you meet a tight bid date?",
        a: "Usually. Send the deadline with the plans and the quote confirms the date. Rush requests are handled as capacity allows and can change the price, and if we cannot meet a date, you hear it before you approve, not after.",
      },
    ],
  },
  {
    id: "accuracy-and-quality",
    chip: "Accuracy and checks",
    h2: "Accuracy and quality checks on plumbing estimates",
    items: [
      {
        q: "How accurate are your plumbing estimates?",
        a: `${CLAIMS.varianceLong} The range follows how complete the design is, so every estimate states its [AACE International](https://web.aacei.org/) estimate class and our assumptions. These are typical results, not a promise for any one project.`,
      },
      {
        q: "How do you check a plumbing takeoff before it is delivered?",
        a: "A second estimator reviews every file against the drawings. Fixture and equipment counts are matched to the plans, and every quantity traces to its sheet and detail. Conflicts and omissions, such as a fixture tag missing from the schedule or pipe left unsized, go into the scope-gap log, ready to send as RFIs, instead of being guessed. The [sample takeoffs](/samples) show how that looks.",
      },
      {
        q: "Do you use my labor rates, or yours?",
        a: "Either. Estimate pricing follows the project ZIP code, including union, open-shop and prevailing-wage labor, or uses your own rates. A takeoff carries no prices, so you apply your own labor units and supplier quotes. Tell us which you want when you request the quote.",
      },
      {
        q: "Does a takeoff include design, pipe sizing or code review?",
        a: "No. We measure and price from the drawings as issued, and we do not provide engineering, architectural, legal or code-compliance services. Pipe sizing, system design and code compliance stay with the engineer of record and the governing code. For gas, medical gas and fire sprinkler, hydraulic calculations and testing are outside a takeoff too.",
      },
    ],
  },
  {
    id: "files-and-revisions",
    chip: "Files and revisions",
    h2: "Files, software and revisions for plumbing takeoffs",
    items: [
      {
        q: "What files do I receive with a plumbing takeoff or estimate?",
        a: "An Excel workbook with live formulas, not a locked PDF, plus a PDF summary by [CSI MasterFormat](https://www.csiresources.org/standards/masterformat) division (22, plus 21, 23 and 33 where plumbing crews work), color-coded marked-up plans, a basis of estimate and a scope-gap log. We measure in Bluebeam Revu, PlanSwift or On-Screen Takeoff and estimate in Trimble Accubid, with CSV and PDF exports for QuickBooks, Sage and Procore.",
      },
      {
        q: "Can you fill in my own bid sheet or estimating template?",
        a: "Yes. Send your bid sheet or template and we fill it in instead of ours, so the numbers drop into the way you already bid. The [plumbing estimating spreadsheet](/guides/plumbing-estimating-spreadsheet) guide shows how a good workbook is laid out.",
      },
      {
        q: "Are revisions included if an addendum is issued?",
        a: "Yes. Send each addendum as it is issued: we update the lines it touches, highlight what changed and reissue the file. An added system or a redesign is new scope, quoted separately before work on it starts.",
      },
    ],
  },
  {
    id: "confidentiality",
    chip: "Confidentiality",
    h2: "Confidentiality and NDAs for plumbing plans",
    items: [
      {
        q: "Will you sign an NDA before I send plans?",
        a: "Yes. We sign an NDA on request, before any files move, and it is included in the price. Check the NDA box on the quote form, and tell us if the owner already requires one for the bid documents.",
      },
      {
        q: "Do you compete with plumbing contractors for work?",
        a: "No. We're an estimating company: we don't bid or build construction work, and we don't install plumbing. Your plans, rates and templates are never shared between clients, and the decision to bid, the markup and the final number stay with you.",
      },
    ],
  },
];

export const FAQ_ALL_ITEMS: FaqItem[] = FAQ_GROUPS.flatMap((g) => g.items);

export const FAQ_RELATED = {
  id: "faq-related",
  h2: "Services and guides for more detail",
  hrefs: [
    "/services/plumbing-takeoff",
    "/services/plumbing-estimating",
    "/guides/plumbing-takeoff-service-cost",
    "/guides/plumbing-takeoff-vs-plumbing-estimate",
  ],
};
