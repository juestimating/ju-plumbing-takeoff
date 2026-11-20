import type { ListBlock, ProseBlock, TableBlock } from "@/content/types";
import { Desk } from "@/components/company/about/Desk";
import { DeskCard } from "@/components/company/about/DeskCard";
import { Offices } from "@/components/company/about/Offices";
import { RuleExplorer } from "@/components/company/about/RuleExplorer";
import { StandardsBlock } from "@/components/company/about/StandardsBlock";
import { CtaBand } from "@/components/page/CtaBand";
import { FactCard } from "@/components/page/FactCard";
import { PageHero } from "@/components/page/PageHero";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { PRICE_ROWS } from "@/content/pricing";
import { STANDARDS } from "@/content/shared";
import { IDS, breadcrumbNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { CLAIMS, SITE } from "@/lib/site";

/** "North Canton, OH and Manassas, VA", head office first. */
const OFFICE_PLACES = SITE.offices.map((o) => `${o.city}, ${o.region}`).join(" and ");

/** Published starting price for a service page, formatted "$149". Fails the build if pricing.ts drops the row. */
function startingPrice(href: string): string {
  const from = PRICE_ROWS.find((r) => r.href === href)?.from;
  if (!from) throw new Error(`No published starting price for ${href}`);
  return `$${from.toLocaleString("en-US")}`;
}
const TAKEOFF_FROM = startingPrice("/services/plumbing-takeoff");

const TITLE = "About JU Plumbing Takeoff | JU Estimating";
const DESCRIPTION = `JU Plumbing Takeoff is the plumbing desk of ${SITE.legalName}, in ${OFFICE_PLACES}. Takeoffs from ${TAKEOFF_FROM} in ${CLAIMS.turnaround}. Get a fixed quote.`;

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/about",
  keywords: ["about JU Plumbing Takeoff", "plumbing estimating company", "plumbing takeoff company", "JU Estimating plumbing"],
});

/** Who is behind the brand. Company-wide claims are labelled as covering all trades. Its drawing is in the hero card. */
const DESK: ProseBlock = {
  type: "prose",
  id: "the-plumbing-desk-of-ju-estimating",
  h2: "The plumbing desk of JU Estimating",
  paragraphs: [
    `${SITE.legalName} is an outsourced estimating department with ${CLAIMS.years} years of estimating behind it, trusted by ${CLAIMS.contractors} contractors across all trades. JU Plumbing Takeoff is its plumbing desk: plumbing sets measured system by system, with every file checked by a second estimator.`,
    "Order a [plumbing takeoff](/services/plumbing-takeoff) to price at your own rates, or a priced [plumbing estimate](/services/plumbing-estimating) to bid with, and check either one against the drawings. To see the format first, [request a plumbing sample](/contact?service=sample-request#request-a-quote).",
  ],
};

/** The working rules. The home page links this block's id (#how-we-work-on-every-file), so keep it. */
const HOW: ListBlock = {
  type: "list",
  id: "how-we-work-on-every-file",
  tone: "dark",
  h2: "How we work on every plumbing takeoff and estimate",
  items: [
    {
      title: "Every quantity traces to a sheet.",
      body: "Each count and length points to its sheet and detail, on color-coded marked-up plans and in an Excel workbook with live formulas, so you can audit any number.",
    },
    {
      title: "A second estimator checks the file.",
      body: "Quantities, rates and totals are reviewed against the drawings before delivery, to catch a miscount before it reaches your bid.",
    },
    {
      title: "We stay inside the drawings.",
      body: "Conflicts and omissions go into the scope-gap log with their sheet reference, ready to send as RFIs, instead of being guessed. We don't design systems, size pipe or review code compliance.",
    },
    {
      title: "We state the estimate class.",
      body: `Every estimate names its AACE International class, so you know how firm the number is. ${CLAIMS.varianceLong} Those are typical ranges, not promises.`,
    },
    {
      title: "Pricing follows the project ZIP code.",
      body: "Estimates use labor and material rates for the project location, including union, open-shop and prevailing-wage labor. A takeoff carries no prices, so you apply your own.",
    },
    {
      title: "We don't compete with you.",
      body: `${CLAIMS.noCompete}. They are never shared between clients, and we sign an NDA on request.`,
    },
  ],
};

/** The two standards bodies we cite, linked once each in the table. Both URLs returned HTTP 200 on 2026-11-17. */
const STANDARD_LINKS: [name: string, url: string][] = [
  ["CSI MasterFormat", "https://www.csiresources.org/standards/masterformat"],
  ["AACE International", "https://web.aacei.org/"],
];
const withLinks = (text: string) => STANDARD_LINKS.reduce((t, [name, url]) => t.replace(name, `[${name}](${url})`), text);

const STANDARDS_TABLE: TableBlock = {
  type: "table",
  id: "standards-and-software",
  h2: "Standards and software we use on plumbing files",
  intro: "For the method itself, read [how to do a plumbing takeoff](/guides/how-to-do-a-plumbing-takeoff).",
  caption: "Standards and software behind JU Plumbing Takeoff files",
  head: ["Area", "What we use"],
  rows: STANDARDS.map((s) => [s.area, withLinks(s.uses)]),
  note: "Bluebeam, PlanSwift, On-Screen Takeoff, Trimble Accubid, QuickBooks, Sage and Procore are trademarks of their respective owners.",
};

const OFFICES_ID = "offices-and-hours";

export default function AboutPage() {
  return (
    <>
      <JsonLd
        nodes={[
          { ...webPageNode({ path: "/about", name: TITLE, description: DESCRIPTION, type: "AboutPage", modified: SITE.lastReviewed }), about: { "@id": IDS.org } },
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        kicker="Who we are"
        h1="About JU Plumbing Takeoff"
        lead={`JU Plumbing Takeoff is the plumbing desk of ${SITE.legalName}. We read your plumbing plans, measure each system in scope, price the work when you ask for an estimate, and send back files you can check, edit and bid with. We work for plumbing contractors, general contractors, mechanical contractors, builders and developers in ${CLAIMS.states}.`}
        primary={{ label: "Get a fixed quote", href: "/contact" }}
        secondary={{ label: "See plumbing services", href: "/services" }}
        note={`Fixed quote ${CLAIMS.quote}. No obligation, and an ${CLAIMS.nda}.`}
        card={<DeskCard />}
        overlap
      />
      <FactCard title={`${SITE.legalName} at a glance`} tone="light" />
      <Desk block={DESK} officesId={OFFICES_ID} />
      <RuleExplorer block={HOW} />
      <StandardsBlock block={STANDARDS_TABLE} />
      <Offices id={OFFICES_ID} kicker="Where we are" h2={`${SITE.name} offices in ${OFFICE_PLACES}`} tone="alt" />
      <RelatedLinks
        id="explore-more"
        h2="Explore plumbing takeoff services, pricing and samples"
        hrefs={["/services", "/pricing", "/samples", "/guides", "/faq"]}
        tone="light"
      />
      <CtaBand source="/about" h2="Send your next plumbing bid to JU Plumbing Takeoff" />
    </>
  );
}
