import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { HoverTabs, type HoverTabItem } from "@/components/interactive/HoverTabs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { HUBS } from "@/content/hubs";
import { PRICE_ROWS, priceLabel, type PriceRow } from "@/content/pricing";
import { SERVICES, pagePath } from "@/content/registry";
import type { PageContent, TableBlock } from "@/content/types";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import { keepHyphenated } from "../StepCards";
import { WorkbookSwitch, type WorkbookView } from "./WorkbookSwitch";
import ic from "./icons.module.css";
import f from "./need-finder.module.css";
import s from "./services-hub.module.css";

const fail = (msg: string): never => {
  throw new Error(`services hub: ${msg}`);
};
const page = (slug: string) => SERVICES.find((p) => p.slug === slug) ?? fail(`no service page ${slug}`);
const row = (href: string) => PRICE_ROWS.find((r) => r.href === href) ?? fail(`no published price for ${href}`);
const usd = (r: PriceRow) => (r.from === null ? fail(`${r.href} has no starting price`) : `$${r.from.toLocaleString("en-US")}`);
/** Inline links and bold, or plain text with its hyphenated words kept whole. */
const prose = (text: string) => (/\[|\*\*/.test(text) ? <Rich text={text} /> : keepHyphenated(text));

const TAKEOFF = "plumbing-takeoff";
const ESTIMATE = "plumbing-estimating";
const PRELIM = "preliminary-plumbing-estimate";
const BID = "plumbing-bid-preparation";
const MONTHLY = "monthly-plumbing-estimating";

/* ---------- hero card: the workbook switch ---------- */

const VIEWS: (Omit<WorkbookView, "href" | "badge"> & { slug: string })[] = [
  { key: "takeoff", slug: TAKEOFF, tab: "Takeoff", title: "Plumbing takeoff", line: "Quantities only. You price them at your own rates.", link: "Explore the plumbing takeoff" },
  { key: "estimate", slug: ESTIMATE, tab: "Estimate", title: "Plumbing estimate", line: "The same quantities, priced with material, labor and markups.", link: "Explore plumbing estimating" },
  { key: "bid", slug: BID, tab: "Bid package", title: "Bid preparation", line: "The estimate, packaged for your signature and submission.", link: "Explore bid preparation" },
];

/** Lines of a sample sheet on a service page, found by item label. Fails the build if the block, a column or a line moves. */
function sheetLines(slug: string, block: string, cols: [item: string, qty: string, unit: string], items: string[]) {
  const t = page(slug).blocks.find((b): b is TableBlock => b.id === block && b.type === "table") ?? fail(`no table ${block} on ${slug}`);
  const [i, q, u] = cols.map((c) => (t.head.indexOf(c) < 0 ? fail(`table ${block} has no ${c} column`) : t.head.indexOf(c)));
  return items.map((item) => {
    const r = t.rows.find((x) => x[i] === item) ?? fail(`table ${block} has no line "${item}"`);
    return { item, qty: r[q] ?? fail(`no ${cols[1]} on "${item}"`), unit: r[u] ?? fail(`no ${cols[2]} on "${item}"`) };
  });
}

/** The hero card: four lines from the takeoff page's sample sheet and the estimate-only markup line from the estimating page. */
export function ServicesHeroCard() {
  const rows = sheetLines(TAKEOFF, "what-you-receive-with-a-plumbing-takeoff", ["Item", "Net", "Unit"], [
    "2 in. copper tube, hard-drawn",
    "3 in. cast iron hubless, above slab",
    "Lavatories, LAV-1",
    "Floor drains with trap primers, FD-1",
  ]);
  const [extra] = sheetLines(ESTIMATE, "sample-plumbing-estimate-sheet", ["Estimate line", "Qty", "Unit"], ["Overhead, profit, bond and tax"]);
  const prelim = pagePath(page(PRELIM));
  return (
    <WorkbookSwitch
      rows={rows}
      extra={extra}
      views={VIEWS.map(({ slug, ...v }) => {
        const href = pagePath(page(slug));
        return { ...v, href, badge: priceLabel(row(href)) };
      })}
      footer={<Rich text={`No drawings yet? A [preliminary plumbing estimate](${prelim}) from ${usd(row(prelim))} gives you a budget range first.`} />}
    />
  );
}

/* ---------- need finder ---------- */

/** The stops of a bid, and the ones each service covers. */
const STOPS = ["Budget", "Quantities", "Priced", "Bid package"] as const;
const STAGE: Record<string, (typeof STOPS)[number][]> = {
  [TAKEOFF]: ["Quantities"],
  [ESTIMATE]: ["Priced"],
  [PRELIM]: ["Budget"],
  [BID]: ["Bid package"],
  [MONTHLY]: ["Quantities", "Priced"],
};
/** "Explore ..." button names, the way a contractor says them. */
const CTA_NAME: Record<string, string> = {
  [TAKEOFF]: "the plumbing takeoff",
  [ESTIMATE]: "plumbing estimating",
  [PRELIM]: "the preliminary estimate",
  [BID]: "bid preparation",
  [MONTHLY]: "monthly estimating",
};
const BUILDING_TYPES = ["residential-plumbing-estimating", "commercial-plumbing-estimating", "industrial-plumbing-estimating"];

type Need = { need: string; answer: string; p: PageContent; href: string; price: PriceRow };

/** The overview bullets split at their first ": " into the buyer's need (the tab label) and the answer; the panel
 *  shows the whole bullet as written. The first /services link is the service. Fails the build if a bullet loses its
 *  colon or its link. */
function needs(): Need[] {
  const intro = HUBS.services.intro ?? fail("no overview copy");
  return (intro.bullets ?? fail("no need bullets")).map((b) => {
    const cut = b.indexOf(": ");
    if (cut < 0) fail(`need bullet without ": ": ${b}`);
    const href = /\]\((\/services\/[^)#\s]+)\)/.exec(b)?.[1] ?? fail(`need bullet without a /services link: ${b}`);
    const p = SERVICES.find((x) => pagePath(x) === href) ?? fail(`need bullet links to an unknown page ${href}`);
    if (!STAGE[p.slug] || !CTA_NAME[p.slug]) fail(`no bid stage or button name for ${p.slug}`);
    return { need: b.slice(0, cut), answer: b.slice(cut + 2), p, href, price: row(href) };
  });
}

/** Where the service sits in a bid: four stops on a pipe, the covered ones lit. An image with a text name. */
function BidLine({ lit, repeat }: { lit: (typeof STOPS)[number][]; repeat?: string }) {
  return (
    <div className={f.strip} role="img" aria-label={`Where it sits in a bid: ${lit.join(" and ")}${repeat ? `, ${repeat}` : ""}`}>
      <span className={f.track}>
        {STOPS.map((st) => (
          <span key={st} className={f.stop} data-on={lit.includes(st) ? "" : undefined}>
            <i className={f.fit} />
            {st}
          </span>
        ))}
      </span>
      {repeat && <span className={f.repeat}>{repeat}</span>}
    </div>
  );
}

function NeedPanel({ need, answer, p, href, price }: Need) {
  const bullets = p.hero.bullets ?? fail(`no hero bullets on ${p.slug}`);
  const dedicated = p.slug === MONTHLY ? (PRICE_ROWS.find((r) => r.href.startsWith(`${href}#`)) ?? fail("no dedicated estimator row")) : undefined;
  return (
    <div className={f.need}>
      <BidLine lit={STAGE[p.slug]!} repeat={p.slug === MONTHLY ? price.bestFor : undefined} />
      <p className={f.answer}>
        <span className={f.leadIn}>{need}:</span> <Rich text={answer} />
      </p>
      <p className={f.delivery}>
        <span className="hr-badge soft">
          <span className={ic.clock} aria-hidden="true" />
          {price.delivery}
        </span>
      </p>
      <ul className={cx("hr-checks", f.checks)}>
        {bullets.map((b) => (
          <li key={b}>{prose(b)}</li>
        ))}
      </ul>
      {p.slug === ESTIMATE && (
        <div className={f.extras}>
          <p className={f.extrasLabel}>By building type:</p>
          <ul className={f.typeChips} role="list">
            {BUILDING_TYPES.map((slug) => {
              const t = page(slug);
              const name = t.nav.label.replace(/ plumbing$/, "");
              if (name === t.nav.label) fail(`building type label "${t.nav.label}" does not end in " plumbing"`);
              return (
                <li key={slug}>
                  <Link href={pagePath(t)} className={f.typeChip}>
                    <Icon name={t.nav.icon ?? "building"} size={16} />
                    {`${name} · ${priceLabel(row(pagePath(t)))}`}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {dedicated && (
        <p className={f.extras}>
          <Link href={dedicated.href} className="arrow-link">
            {`Dedicated estimator for ${dedicated.bestFor.charAt(0).toLowerCase()}${dedicated.bestFor.slice(1)}: ${priceLabel(dedicated).toLowerCase()}`}
            <span className={ic.arrow} aria-hidden="true" />
          </Link>
        </p>
      )}
      <div className={f.ctas}>
        <ButtonLink href={href} arrow>
          Explore {CTA_NAME[p.slug]}
        </ButtonLink>
        <ButtonLink href={`/contact?service=${p.slug}`} variant="outline">
          Get a fixed quote
        </ButtonLink>
      </div>
    </div>
  );
}

/**
 * Section #overview, the need finder: the overview bullets become five needs in the buyer's words (a vertical list,
 * beside the card from 900px), and resting on one, clicking, tapping or arrowing to it shows the service it maps to:
 * the bullet as written, where it sits in a bid, delivery, three checks and the way on.
 */
export function NeedFinder() {
  const intro = HUBS.services.intro ?? fail("no overview copy");
  if (intro.paragraphs.length !== 1) fail("the finder head holds exactly one intro paragraph");
  const items: HoverTabItem[] = needs().map((n) => ({
    key: n.p.slug,
    label: n.need,
    icon: <Icon name={n.p.nav.icon ?? "wrench"} size={20} />,
    aside: <span className="hr-badge">{priceLabel(n.price)}</span>,
    panel: <NeedPanel {...n} />,
  }));
  return (
    <Section id="overview" tone="alt">
      <SectionHead id="overview" kicker="Find your service" h2={intro.h2} intro={intro.paragraphs[0]} layout="split" />
      <HoverTabs
        items={items}
        label="Find your service"
        ask="Pick the line that sounds like your bid."
        chipsBelow={0}
        sideFrom={900}
        className={f.finder}
        panelClassName={f.needPanel}
      />
    </Section>
  );
}

/* ---------- catalog ---------- */

const GROUPS = [
  { label: "For one bid", note: "In the order a bid comes together", kind: "seq", slugs: [PRELIM, TAKEOFF, ESTIMATE, BID] },
  {
    label: "By building type",
    note: "Priced estimates for homes, commercial buildings and plants",
    kind: "types",
    slugs: ["residential-plumbing-estimating", "commercial-plumbing-estimating", "industrial-plumbing-estimating"],
  },
  { label: "Ongoing", note: "For steady bid volume", kind: "wide", slugs: [MONTHLY] },
] as const;

/** Card tags by price group (the home pricing cards' words). */
const TAG: Record<PriceRow["group"], string> = { takeoff: "Takeoff", estimate: "Estimate", bid: "Bid support", ongoing: "Ongoing" };

/** The 8 service pages in the order the catalog renders them, for the ItemList. Fails if GROUPS and SERVICES drift. */
export function servicesInOrder(): PageContent[] {
  const slugs: string[] = GROUPS.flatMap((g) => [...g.slugs]);
  for (const p of SERVICES) if (slugs.filter((x) => x === p.slug).length !== 1) fail(`catalog groups must list ${p.slug} once`);
  if (slugs.length !== SERVICES.length) fail("catalog groups list a page that is not a service");
  return slugs.map(page);
}

function ServiceCard({ p, wide }: { p: PageContent; wide?: boolean }) {
  const href = pagePath(p);
  const r = row(href);
  const dedicated = wide ? PRICE_ROWS.find((x) => x.href.startsWith(`${href}#`)) : undefined;
  return (
    <div className={cx("hr-card lift", s.card)} data-wide={wide ? "" : undefined}>
      <div className={s.band} aria-hidden="true">
        <span className={s.fitting}>
          <Icon name={p.nav.icon ?? "wrench"} size={20} />
        </span>
      </div>
      <div className={s.body}>
        <div className={s.main}>
          <span className={s.tag} aria-hidden="true">
            {TAG[r.group]}
          </span>
          <h3 className={s.title}>
            <Link href={href} className={s.stretch}>
              {p.nav.label}
            </Link>
          </h3>
          <p className={s.line}>{prose(p.nav.blurb)}</p>
          {r.delivery !== CLAIMS.turnaround && (
            <p className={s.note}>
              <Icon name="clock" size={14} />
              <span>{keepHyphenated(r.delivery)}</span>
            </p>
          )}
        </div>
        <div className={s.side}>
          {dedicated && (
            <Link href={dedicated.href} className={cx("arrow-link", s.over)}>
              {`Dedicated estimator: ${priceLabel(dedicated).toLowerCase()}`}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          <div className={s.foot}>
            <span className="hr-badge">{priceLabel(r)}</span>
            <span className={s.go} aria-hidden="true">
              <span className={s.goText}>Explore</span>
              <span className={s.goIcon} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Section #all: every service as a whole-card link in three groups (the home pricing card language). The four cards
 * for one bid sit on one pipe run in bid order, then the building types, then the ongoing plan, then what moves the
 * price. The ItemList JSON-LD is built from servicesInOrder(), the same order.
 */
export function ServiceCatalog() {
  const { list } = HUBS.services;
  return (
    <Section id="all" tone="light">
      <SectionHead id="all" kicker="What it costs" h2={list.h2} intro={list.intro} center />
      <div className={s.groups}>
        {GROUPS.map((g, gi) => (
          <div key={g.label} className={s.group}>
            <p id={`catalog-group-${gi}`} className={s.groupHead}>
              <span className={s.groupLabel}>{g.label}</span>
              <span className={s.groupNote}>{g.note}</span>
            </p>
            <ul className={s.grid} data-kind={g.kind} aria-labelledby={`catalog-group-${gi}`} role="list">
              {g.slugs.map((slug) => (
                <li key={slug} className="hr-reveal">
                  <ServiceCard p={page(slug)} wide={g.kind === "wide"} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={s.drivers}>
        <span className="hr-tile sm" aria-hidden="true">
          <Scale size={20} />
        </span>
        <p className={s.driversText}>
          <Rich text="**What moves the price:** plumbing sheets, systems in scope, schedule-heavy or plan-heavy sets, and how fast you need it. **What doesn't:** your project's dollar value." />
        </p>
        <ButtonLink href="/pricing" variant="outline" arrow className={s.compare}>
          Compare every service and price
        </ButtonLink>
      </div>
    </Section>
  );
}
