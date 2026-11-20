import type { CSSProperties, ReactNode } from "react";
import { HoverTabs } from "@/components/interactive/HoverTabs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { keepHyphenated } from "@/components/page/StepCards";
import { CLAIMS } from "@/lib/site";
import { WHAT_MOVES_PRICE } from "./content";
import s from "./drivers.module.css";

/* ---------- the four mocks: HTML and CSS on plan paper, captioned "Illustrative" ---------- */

const SHEETS: [string, boolean][] = [
  ["P-101", true],
  ["A-101", false],
  ["P-102", true],
  ["S-201", false],
  ["P-103", true],
  ["C-101", false],
];

function SheetsArt() {
  return (
    <>
      <span className={s.fan} aria-hidden="true">
        {SHEETS.map(([n, ours]) => (
          <span key={n} className={s.mini} data-ours={ours ? "" : undefined}>
            {n}
          </span>
        ))}
      </span>
      <ul className={s.legend} role="list">
        <li>
          <span className={s.key} data-ours="" aria-hidden="true" />
          Plumbing sheets we measure
        </li>
        <li>
          <span className={s.key} aria-hidden="true" />
          Sheets we read for wall types, slabs and site tie-ins
        </li>
      </ul>
    </>
  );
}

const SYSTEMS = ["cold", "hot", "waste", "vent", "storm", "gas", "fire", "med"] as const;

function SystemsArt() {
  return (
    <span className={s.rows}>
      {[3, SYSTEMS.length].map((n) => (
        <span key={n} className={s.sysRow}>
          <span className={s.sysLabel}>{n === SYSTEMS.length ? `All ${n}` : `${n} systems`}</span>
          <span className={s.sysLines} aria-hidden="true">
            {SYSTEMS.map((c, i) => (
              <i key={c} className="legend-line" data-c={c} data-off={i >= n ? "" : undefined} />
            ))}
          </span>
          <span className={s.file} style={{ "--w": n === SYSTEMS.length ? 1 : 0.5 } as CSSProperties} aria-hidden="true" />
        </span>
      ))}
    </span>
  );
}

function SetsArt() {
  return (
    <span className={s.sets}>
      <span className={s.set}>
        <span className={s.rooms} aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i key={i} />
          ))}
        </span>
        <span className={s.setLabel}>Repeated rooms, counted from schedules</span>
      </span>
      <span className={s.set}>
        <svg className={s.plate} viewBox="0 0 168 96" aria-hidden="true" focusable="false" fill="none">
          <rect x="1" y="1" width="166" height="94" rx="5" stroke="#c8d0e0" strokeWidth="2" />
          <path d="M12 84H64V52H112V24H156V12" stroke="#f5b400" strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={s.setLabel}>Runs traced across a large floor plate</span>
      </span>
    </span>
  );
}

function DeadlineArt() {
  return (
    <span className={s.week}>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
        <span key={d} className={s.day} aria-hidden="true">
          {d}
        </span>
      ))}
      <span className={s.band} data-k="std">{`Standard: ${CLAIMS.turnaround}`}</span>
      <span className={s.band} data-k="rush">
        Rush: as capacity allows
      </span>
      <span className={s.pin}>Bid date</span>
    </span>
  );
}

/** Mock by title, so a content edit that renames a driver fails the build instead of showing the wrong picture. */
const ART: [RegExp, ReactNode][] = [
  [/^Sheet/, <SheetsArt key="sheets" />],
  [/^Systems/, <SystemsArt key="systems" />],
  [/^Schedule/, <SetsArt key="sets" />],
  [/^Deadline/, <DeadlineArt key="deadline" />],
];
function artFor(title: string): ReactNode {
  const hit = ART.find(([re]) => re.test(title));
  if (!hit) throw new Error(`price drivers: no mock for "${title}"`);
  return hit[1];
}

const bare = (title: string) => title.replace(/\.$/, "");

/**
 * "Why prices differ": the drivers list as the home explorer on the demo's dark console. Resting on a factor (or a
 * tap, or the arrow keys) opens its panel: a small mock on plan paper beside the content text. Every panel stays in the
 * HTML. Under it, what does not move the price and the quote.
 */
export function PriceDrivers() {
  const b = WHAT_MOVES_PRICE;
  if (b.type !== "list") throw new Error("price drivers: WHAT_MOVES_PRICE must be a list block");
  return (
    <Section id={b.id} tone="dark">
      <SectionHead id={b.id} kicker="Why prices differ" h2={b.h2} intro={b.intro} center />
      <HoverTabs
        items={b.items.map((it, i) => ({
          key: `driver-${i}`,
          num: String(i + 1).padStart(2, "0"),
          label: keepHyphenated(bare(it.title)),
          panel: (
            <div className={s.driver}>
              <figure className={s.fig}>
                <div className={s.mock}>{artFor(it.title)}</div>
                <figcaption>Illustrative</figcaption>
              </figure>
              <div>
                <p className={s.title}>{keepHyphenated(bare(it.title))}</p>
                <p className={s.body}>
                  <Rich text={it.body} />
                </p>
              </div>
            </div>
          ),
        }))}
        label="Price factors"
        ask="Pick a factor to see why."
        tone="dark"
      />
      <div className={s.after}>
        <p className={s.strip}>
          <span className="hr-tile sm" aria-hidden="true">
            <Icon name="scale" />
          </span>
          <span>
            <Rich text="**What doesn't move it:** your project's dollar value." />
          </span>
        </p>
        <div className={s.cta}>
          <p>Your fixed quote names the price, the deliverables and the delivery date before any work begins.</p>
          <ButtonLink href="/contact" size="lg" arrow>
            Get a fixed quote
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
