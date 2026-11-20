import type { FaqItem, IconName, IllustrationName, SystemColor } from "@/content/types";
import { PRICE_ROWS } from "@/content/pricing";
import { CLAIMS, SITE } from "@/lib/site";

/**
 * Home page copy and data used outside the section components. Claims come from CLAIMS and every price from
 * PRICE_ROWS, so nothing here can drift from the published numbers. Strings accept [text](/path) links and
 * **bold** (rendered by Rich).
 */

/** "$149" for a published row. Throws at build time if a row disappears, so a stale price can never ship. */
export function usd(href: string): string {
  const row = PRICE_ROWS.find((r) => r.href === href);
  if (!row || row.from === null) throw new Error(`home: no published price for ${href}`);
  return `$${row.from.toLocaleString("en-US")}`;
}

const TAKEOFF = "/services/plumbing-takeoff";
const ESTIMATE = "/services/plumbing-estimating";
const PRELIM = "/services/preliminary-plumbing-estimate";
const INDUSTRIAL = "/services/industrial-plumbing-estimating";
const MONTHLY = "/services/monthly-plumbing-estimating";

/* ---------- metadata ---------- */

export const HOME_TITLE = "Plumbing takeoff & estimating services | JU Plumbing Takeoff";
export const HOME_DESCRIPTION = `Plumbing takeoff and estimating services from ${usd(TAKEOFF)}: marked-up plans and an Excel workbook in ${CLAIMS.turnaround}, checked by a second estimator. Get a fixed quote.`;
export const HOME_KEYWORDS = [
  "plumbing takeoff and estimating services",
  "plumbing takeoff services",
  "plumbing estimating services",
  "plumbing takeoff",
  "plumbing estimator",
  "plumbing takeoff for contractors",
];

/** Price-card tags on the home pricing section. */
export const GROUP_LABEL = { takeoff: "Takeoff", estimate: "Estimate", bid: "Bid support", ongoing: "Ongoing" } as const;

/* ---------- system explorer ---------- */

/** Every system is ordered as a plumbing takeoff, so each explorer panel shows the takeoff's published price. */
export const SYSTEM_PRICE = `From ${usd(TAKEOFF)}`;

/** The explorer's systems in tab order: tab, drawing, summary and the first lines of what we count, with their units. */
export const HOME_SYSTEMS: { key: string; label: string; blurb: string; icon: IconName; color: SystemColor; drawing: IllustrationName; counts: [label: string, unit: string][] }[] = [
  {
    key: "dwv",
    label: "Sanitary waste and vent",
    blurb: "Drain, waste and vent pipe, fittings, cleanouts and stack heights.",
    icon: "waves",
    color: "waste",
    drawing: "dwv-isometric",
    counts: [["Sanitary waste pipe by size and material", "LF"], ["Vent pipe by size and material", "LF"], ["Stacks and vertical runs, floor by floor", "LF"], ["Fittings by type and size", "EA"], ["Cleanouts by type and size", "EA"]],
  },
  {
    key: "water",
    label: "Domestic water",
    blurb: "Hot, cold and recirculation piping, valves, insulation and hangers.",
    icon: "droplets",
    color: "cold",
    drawing: "riser-isometric",
    counts: [["Cold water pipe by size and material", "LF"], ["Hot water pipe by size and material", "LF"], ["Hot water recirculation (return) pipe", "LF"], ["Backflow assemblies and meter connections", "EA"], ["Pipe insulation by pipe size and thickness", "LF"]],
  },
  {
    key: "storm",
    label: "Storm drainage",
    blurb: "Roof drains, overflow drains, leaders and horizontal storm piping.",
    icon: "waves",
    color: "storm",
    drawing: "storm-roof",
    counts: [["Roof drains by type and size, controlled-flow included", "EA"], ["Overflow (secondary) drains", "EA"], ["Vertical leaders by size and material", "LF"], ["Horizontal storm pipe by size and material", "LF"], ["Overflow piping by size and material", "LF"]],
  },
  {
    key: "gas",
    label: "Fuel gas piping",
    blurb: "Natural gas and propane piping, valves, regulators and meter connections.",
    icon: "flame",
    color: "gas",
    drawing: "gas-manifold",
    counts: [["Black steel pipe, aboveground, by size", "LF"], ["CSST by size and run", "LF"], ["Polyethylene pipe, underground", "LF"], ["Appliance connections by equipment tag", "EA"], ["Regulators and their vent lines", "EA"]],
  },
  {
    key: "med",
    label: "Medical gas",
    blurb: "Oxygen, vacuum and medical air with zone valves and outlets.",
    icon: "stethoscope",
    color: "med",
    drawing: "medical-gas-zone",
    counts: [["Outlets and inlets by gas and room type", "EA"], ["Medical gas copper tube, by gas and size", "LF"], ["Zone valve boxes", "EA"], ["Master, area and local alarm panels", "EA"], ["Source equipment connections", "EA"]],
  },
  {
    key: "fire",
    label: "Fire sprinkler",
    blurb: "Heads, mains, branch lines, risers and hangers.",
    icon: "siren",
    color: "fire",
    drawing: "sprinkler-layout",
    counts: [["Sprinkler heads by type, K-factor and finish", "EA"], ["Mains and cross mains by size", "LF"], ["Branch lines by size", "LF"], ["Riser assemblies", "EA"], ["Hangers and seismic bracing", "EA"]],
  },
  {
    key: "underground",
    label: "Underground plumbing",
    blurb: "Under-slab and site sanitary, storm and water lines by trench depth.",
    icon: "layers",
    color: "waste",
    drawing: "underground-plan",
    counts: [["Under-slab sanitary and storm pipe by size, material and depth band", "LF"], ["Trench excavation by depth band", "CY"], ["Bedding, backfill and compaction", "CY"], ["Building sewer and site laterals", "LF"], ["Manholes, catch basins and tanks", "EA"]],
  },
  {
    key: "fixtures",
    label: "Fixtures and equipment",
    blurb: "Fixtures by tag and equipment by mark, with carriers, trim and connections.",
    icon: "list-checks",
    color: "cold",
    drawing: "restroom-plan",
    counts: [["Water closets and urinals", "EA"], ["Water heaters, storage and tankless", "EA"], ["Lavatories, sinks and mop sinks", "EA"], ["Water heater piping package", "EA"], ["Grease, oil and sand interceptors", "EA"]],
  },
];

/* ---------- guides ---------- */

export const GUIDES_HEAD = {
  id: "plumbing-estimating-guides",
  h2: "Plumbing estimating guides to read before your next bid",
  intro:
    "Plain-language guides on measuring, pricing and bidding plumbing work. Read the method first, and hand the job off when the hours run out. Browse [all plumbing estimating guides](/guides).",
  /** Title and reading time come from each guide's own meta; the blurb is written for the home page. */
  items: [
    {
      slug: "how-to-do-a-plumbing-takeoff",
      blurb: "The method in working order: prepare the set, count fixtures first, follow the risers, then reconcile and check.",
    },
    {
      slug: "plumbing-takeoff-vs-plumbing-estimate",
      blurb: "What each one contains, how quantity and material takeoffs differ, and which you need for the bid in front of you.",
    },
    {
      slug: "plumbing-takeoff-service-cost",
      blurb: "How these services are priced, how to compare two quotes and how to cost a takeoff done in-house.",
    },
  ],
};

/* ---------- FAQ (also emitted as FAQPage JSON-LD, so keep each answer self-contained) ---------- */

export const HOME_FAQ: FaqItem[] = [
  {
    q: "What is a plumbing takeoff?",
    a: "A plumbing takeoff is the measured list of everything the plumbing drawings call for. Fixtures are counted from the schedule, pipe is measured by size and material, and valves, hangers, insulation and equipment are totaled in the units your crews and suppliers use. It carries quantities and no prices, so you can price it at your own rates, and each line should name the sheet it came from.",
  },
  {
    q: "Should I order a plumbing takeoff or a plumbing estimate?",
    a: `Order a takeoff when you have your own labor units and supplier pricing and only need the quantities, from ${usd(TAKEOFF)}. Order an estimate when you want a priced number with labor, material, equipment and markups, from ${usd(ESTIMATE)}, for example to carry a plumbing package or check a subcontractor's bid. If you are not sure which fits, our guide to [plumbing takeoff vs plumbing estimate](/guides/plumbing-takeoff-vs-plumbing-estimate) walks through the choice.`,
  },
  {
    q: "What plans and documents do I send to get a takeoff quote?",
    a: "Send the plumbing sheets, the fixture and equipment schedules, the plumbing specification sections and every addendum issued so far. Add civil sheets when site utilities are in scope and architectural sheets for wall types and ceiling heights. [Send your plans](/contact) and tell us the bid date. If anything is missing, we say so when we send the fixed quote, before work begins.",
  },
  {
    q: "How long does a plumbing takeoff take?",
    a: `Standard delivery is ${CLAIMS.turnaround} once you approve the quote. A fixed quote usually arrives within 10 minutes during business hours. A tight bid date is worth mentioning up front, because rush requests are handled as capacity allows and can change the price.`,
  },
  {
    q: "What do plumbing takeoff and estimating services cost?",
    a: `Starting prices are published: a preliminary estimate from ${usd(PRELIM)}, a takeoff from ${usd(TAKEOFF)}, a plumbing estimate from ${usd(ESTIMATE)} and an industrial estimate from ${usd(INDUSTRIAL)}. The monthly package is ${usd(MONTHLY)} a month for 10–15 projects. Every project gets a fixed quote first, and the price follows sheet count, systems in scope, schedule-heavy or plan-heavy sets and rush, not the dollar value of the project. See the [pricing page](/pricing) for every service.`,
  },
  {
    q: "How accurate are outsourced plumbing estimates?",
    a: `${CLAIMS.varianceLong} The range depends on how complete the drawings are. Every estimate states its AACE International class, every quantity traces to a sheet and detail, and a second estimator checks each file. Gaps and conflicts in the drawings go into a scope-gap log instead of being guessed at.`,
  },
  {
    q: "Which file formats do you accept, and what do I get back?",
    a: "You can send PDF, DWG, DXF or ZIP files, or a Dropbox, Google Drive or plan-room link. You get back an Excel workbook with live formulas, a PDF summary organized by CSI MasterFormat, marked-up plans color-coded by system, a basis of estimate and a scope-gap log. CSV and PDF exports are available, the data imports to QuickBooks, Sage and Procore, and we can fill in your own bid sheet or template.",
  },
  {
    q: "Do you estimate trades other than plumbing?",
    a: "Yes, through our parent company, JU Estimating (juestimating.com), though not on this site. This site covers plumbing and the piping that often sits beside it on a bid: fuel gas, medical gas, fire sprinkler and underground utilities. For HVAC, electrical and other trades, JU Estimating prices those scopes with the same second-estimator check and Excel deliverables, so one team can cover a full mechanical, electrical and plumbing package.",
  },
  {
    q: "Should I hire a freelance estimator or use an estimating company?",
    a: "It comes down to who checks the work and who covers a busy week. A freelance estimator is often one person, so ask who reviews the quantities and what happens if they are unavailable during bid week. With us, a second estimator checks every file and every quantity names its sheet. An NDA is available before you send plans, and revisions for addenda are included. Whoever you choose, ask for a sample file first.",
  },
  {
    q: "Will you sign an NDA, and are my plans kept confidential?",
    a: "Yes. We sign an NDA on request, before you send any files, so ask for it when you request your quote. We don't bid or build construction work, which means we are never competing with you for the job, and plans and pricing are never shared between clients.",
  },
  {
    q: "Do you work in my state, and is pricing local?",
    a: `Yes. We work with plumbing contractors, general contractors and builders in ${CLAIMS.states}, and most projects are handled entirely online. Labor and material pricing follows the project ZIP code, including union, open-shop and prevailing-wage labor. Our head office is in North Canton, OH, our regional office is in Manassas, VA, and an estimator can be reached at ${SITE.phone.display} or ${SITE.email}.`,
  },
];
