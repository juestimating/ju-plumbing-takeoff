import { GUIDES } from "@/content/guides";
import { PRICE_ROWS } from "@/content/pricing";
import { SERVICES, pagePath } from "@/content/registry";
import type { PageContent } from "@/content/types";
import { STATIC_ROUTES } from "@/lib/routes";
import { plain } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";
import { CLAIMS, SITE, officeLine } from "@/lib/site";

/** Built once at build time. Same format as the JU Estimating site: H1, blockquote summary, then link lists. */
export const dynamic = "force-static";

/** One sentence for the entry: the first sentence of a description, link markup stripped. */
function sentence(text: string): string {
  const t = plain(text).replace(/\s+/g, " ").trim();
  const first = /^(.+?[.!?])(?=\s+[A-Z]|$)/.exec(t)?.[1] ?? t;
  return /[.!?]$/.test(first) ? first : `${first}.`;
}

const entry = (title: string, path: string, description: string) =>
  `- [${title.replace(/[[\]]/g, "")}](${absoluteUrl(path)}): ${sentence(description)}`;

const pageEntry = (p: PageContent) => entry(p.hero.h1, pagePath(p), p.seo.description);

/** Hub and company pages take their label and blurb from the route table, so they cannot drift from the site. */
const routeEntry = (path: string): string[] => {
  const r = STATIC_ROUTES.find((x) => x.path === path && !x.noindex);
  return r ? [entry(r.label, r.path, r.blurb)] : [];
};

function build(): string {
  const takeoffFrom = Math.min(...PRICE_ROWS.filter((r) => r.group === "takeoff").map((r) => r.from ?? Infinity));
  const hours = SITE.hours.map((h) => `${h.days} ${h.time}`).join(", ");
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.tagline} for plumbing contractors, general contractors, mechanical contractors, builders and developers in ${CLAIMS.states}. Fixed quotes start at $${takeoffFrom} for a takeoff, delivered in ${CLAIMS.turnaround} as unlocked Excel workbooks with live formulas, and every file is checked by a second estimator. A service of ${SITE.legalName}.`,
    "",
    "## Services",
    ...routeEntry("/services"),
    ...SERVICES.map(pageEntry),
    "",
    "## Guides",
    ...routeEntry("/guides"),
    ...GUIDES.map((g) => entry(g.meta.h1, `/guides/${g.meta.slug}`, g.meta.description)),
    "",
    "## Company",
    ...["/pricing", "/samples", "/faq", "/about", "/contact"].flatMap(routeEntry),
    "",
    "## Contact",
    `- Email: ${SITE.email}`,
    `- Phone: ${SITE.phone.display}`,
    ...SITE.offices.map((o) => `- ${o.role}: ${officeLine(o)}`),
    `- Hours: ${hours}. ${SITE.hoursNote}`,
  ];
  return `${lines.join("\n")}\n`;
}

export function GET() {
  return new Response(build(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
