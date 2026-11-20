import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDE_ART, StripUse, type StripName } from "@/components/illustrations/strips";
import { Section, SectionHead } from "@/components/ui/Section";
import { GUIDES } from "@/content/guides";
import { HUBS } from "@/content/hubs";
import type { GuideMeta, SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";
import { GuideFilter } from "./GuideFilter";
import { GuideSprite } from "./GuideSprite";
import { keepHyphenated } from "../StepCards";
import s from "./guides-hub.module.css";
import rp from "./reading-paths.module.css";

const fail = (msg: string): never => {
  throw new Error(`guides hub: ${msg}`);
};
/** Each guide's drafted strip comes from GUIDE_ART (the guides family owns the mapping). */
const art = (slug: string): StripName => GUIDE_ART[slug] ?? fail(`no strip in GUIDE_ART for ${slug}`);
const guide = (slug: string) => GUIDES.find((g) => g.meta.slug === slug)?.meta ?? fail(`no guide ${slug}`);
const catKey = (c: GuideMeta["category"]) => c.toLowerCase().replace(/\s+/g, "-");
/** The guide's own standfirst, else the first sentence of its description. */
const blurb = (m: GuideMeta) => m.lead ?? m.description.split(/(?<=\.)\s/)[0];
/** Filter order on the shelf. */
const CATEGORIES: GuideMeta["category"][] = ["How-to", "Estimating", "Buying guide", "Reference"];

function Meta({ m }: { m: GuideMeta }) {
  return (
    <p className={s.meta}>
      <span className="hr-badge">{m.category}</span>{" "}
      <span className={cx("hr-badge soft", s.time)}>{m.readingMinutes} min read</span>
    </p>
  );
}

const Go = () => (
  <span className={s.go} aria-hidden="true">
    Read the guide <span className={s.goIcon} />
  </span>
);

/**
 * A guide as a whole-card link in the home guide-card language: its drafted strip, category and read time, the title
 * (h3, or p where a heading would not fit the outline), its standfirst and "Read the guide". The strip is a copy of a
 * StripSprite symbol, so the page needs <StripSprite> with this guide's strip once.
 */
export function GuideCard({ meta: m, as: T = "h3", className }: { meta: GuideMeta; as?: "h3" | "p"; className?: string }) {
  return (
    <div className={cx("hr-card lift", s.card, className)}>
      <div className={s.band}>
        <StripUse name={art(m.slug)} className={s.art} flowClass={s.flow} />
      </div>
      <div className={s.body}>
        <Meta m={m} />
        <T className={s.title}>
          <Link href={`/guides/${m.slug}`} className={s.stretch}>
            {m.h1}
          </Link>
        </T>
        <p className={s.blurb}>{keepHyphenated(blurb(m))}</p>
        <Go />
      </div>
    </div>
  );
}

/** Hero card: the first guide on the shelf, labelled "Start here". */
export function FeaturedGuide() {
  const m = GUIDES[0]?.meta ?? fail("no guides");
  return (
    <div className={cx("hr-card lift", s.card, s.featured)}>
      <div className={s.band}>
        <StripUse name={art(m.slug)} className={s.art} flowClass={s.flow} />
      </div>
      <div className={s.body}>
        <p className={s.start}>Start here</p>
        <Meta m={m} />
        <p className={s.title}>
          <Link href={`/guides/${m.slug}`} className={s.stretch}>
            {m.h1}
          </Link>
        </p>
        <p className={s.blurb}>{keepHyphenated(blurb(m))}</p>
        <Go />
      </div>
    </div>
  );
}

/** Two reading routes through the overview paragraph's guides, in its order, each ending at the hand-off. */
const ROUTES: { label: string; c: SystemColor; end: string; stops: [label: string, slug: string][] }[] = [
  {
    label: "Doing it yourself",
    c: "cold",
    end: "Hand it off",
    stops: [
      ["Takeoff basics", "how-to-do-a-plumbing-takeoff"],
      ["Price a job", "how-to-estimate-a-plumbing-job"],
      ["Before bid day", "plumbing-estimating-mistakes"],
      ["Before you submit", "plumbing-bid-checklist"],
    ],
  },
  {
    label: "Weighing an outside service",
    c: "hot",
    end: "Send the plans",
    stops: [
      ["Compare", "plumbing-takeoff-services-vs-software"],
      ["Check the cost", "plumbing-takeoff-service-cost"],
    ],
  },
];

/**
 * Section #overview: the paragraph, then its six guides as two pipe routes (cold for doing it yourself, hot for
 * weighing a service). Stops are links; hovering or focusing one lights its fitting and sends water along its route.
 * Fails the build if the routes stop following the paragraph's links, in order.
 */
export function ReadingPaths() {
  const intro = HUBS.guides.intro ?? fail("no overview copy");
  if (intro.paragraphs.length !== 1) fail("the reading paths head holds exactly one intro paragraph");
  const para = intro.paragraphs[0];
  const linked = [...para.matchAll(/\]\(\/guides\/([^)#\s]+)\)/g)].map((m) => m[1]);
  const routed = ROUTES.flatMap((r) => r.stops.map(([, slug]) => slug));
  if (linked.join() !== routed.join()) fail(`the routes must follow the overview's guide links in order (${linked.join(", ")})`);
  return (
    <Section id="overview" tone="alt">
      <SectionHead id="overview" kicker="Reading paths" h2={intro.h2} intro={para} />
      <div className={rp.routes}>
        {ROUTES.map((r, ri) => (
          <div key={r.label} className={rp.route} data-c={r.c}>
            <p id={`route-${ri}`} className={rp.routeLabel}>
              {r.label}
            </p>
            <ol className={rp.stops} aria-labelledby={`route-${ri}`}>
              {r.stops.map(([label, slug]) => {
                const m = guide(slug);
                return (
                  <li key={slug} className={rp.stop}>
                    <span className={rp.fit} aria-hidden="true" />
                    <span className={rp.stopLabel}>{label}</span>
                    <Link href={`/guides/${slug}`} className={rp.stopTitle}>
                      {m.h1}
                    </Link>
                    <span className={rp.stopMeta}>{`${m.category} · ${m.readingMinutes} min`}</span>
                  </li>
                );
              })}
              <li className={cx(rp.stop, rp.end)}>
                <span className={rp.fit} aria-hidden="true" />
                <span className={rp.stopLabel}>{r.end}</span>
                <Link href="/contact#request-a-quote" className={rp.stopTitle}>
                  Get a fixed quote
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            </ol>
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * Section #all: the type filter beside the head, then every guide in GUIDES order (the ItemList follows the same
 * array). The strips render once, as a sprite, and each card shows a copy.
 */
export function GuideShelf() {
  const { list } = HUBS.guides;
  const counts = CATEGORIES.map((c) => ({ key: catKey(c), label: c, count: GUIDES.filter((g) => g.meta.category === c).length }));
  if (counts.reduce((n, c) => n + c.count, 0) !== GUIDES.length) fail("a guide has a category the filter does not list");
  return (
    <Section id="all" tone="light">
      <GuideSprite names={[...new Set(GUIDES.map((g) => art(g.meta.slug)))]} />
      <GuideFilter
        chips={[{ key: "all", label: "All", count: GUIDES.length }, ...counts]}
        total={GUIDES.length}
        head={<SectionHead id="all" kicker="Browse the guides" h2={list.h2} intro={list.intro} />}
      >
        <ul className={s.grid} role="list">
          {GUIDES.map((g) => (
            <li key={g.meta.slug} data-cat={catKey(g.meta.category)} className="hr-reveal">
              <GuideCard meta={g.meta} />
            </li>
          ))}
        </ul>
      </GuideFilter>
    </Section>
  );
}
