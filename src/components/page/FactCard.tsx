import type { ReactNode } from "react";
import { CountUp } from "@/components/interactive/CountUp";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import type { IconName, Tone } from "@/content/types";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import { keepHyphenated } from "./StepCards";
import s from "./fact-card.module.css";

export type Fact = { icon: IconName; value?: ReactNode; text: string };

/** The number inside a claim ("500+" is 500, "all 50 states" is 50), so the card follows CLAIMS. */
const n = (claim: string) => Number(claim.match(/\d+/)?.[0] ?? 0);

/** The home fact card's company figures. CountUp only ever counts these allowed claims. */
export const COMPANY_FACTS: Fact[] = [
  { icon: "users", value: <CountUp value={n(CLAIMS.contractors)} suffix="+" />, text: "Contractors served" },
  { icon: "clock", value: CLAIMS.turnaround.split(" ")[0], text: "Hours, standard delivery" },
  { icon: "calendar", value: <CountUp value={n(CLAIMS.years)} suffix="+" />, text: "Years estimating" },
  { icon: "map-pin", value: <CountUp value={n(CLAIMS.states)} />, text: "States covered" },
];

/**
 * White fact card that rides over the bottom of the hero (the home StatCard look). Not a section with an h2: the title
 * is a <p> and names the section. Without `facts` it shows the company figures with their honest scope note.
 * `tone` is the band color: match the section that follows, so the card floats into it. With `overlap` (default) the
 * PageHero before it reserves room on its own (see pagehero.module.css).
 */
export function FactCard({
  title = "Why contractors choose JU", note, facts, tone = "alt", overlap = true, after,
}: { title?: string; note?: ReactNode; facts?: Fact[]; tone?: Tone; overlap?: boolean; after?: ReactNode }) {
  const list = facts ?? COMPANY_FACTS;
  const line = note ?? (facts ? undefined : "Company-wide figures for JU Estimating, all trades");
  const textOnly = list.every((f) => f.value === undefined);
  return (
    <section aria-label={title} className={s.band} data-tone={tone} data-overlap={overlap ? "" : undefined}>
      <Container>
        <div className={s.card} data-kind={textOnly ? "text" : "value"}>
          <div className={s.intro}>
            <p className={s.title}>{title}</p>
            {line && <p className={s.note}>{line}</p>}
          </div>
          <ul className={s.list} role="list">
            {list.map((f) => (
              <li key={f.text} className={s.fact} data-text={f.value === undefined ? "" : undefined}>
                <span className={cx("hr-tile sm", s.tile)} aria-hidden="true">
                  <Icon name={f.icon} />
                </span>
                {f.value !== undefined && <span className={s.value}>{f.value}</span>}
                <span className={s.text}>{keepHyphenated(f.text)}</span>
              </li>
            ))}
          </ul>
        </div>
        {after && <div className={s.after}>{after}</div>}
      </Container>
    </section>
  );
}
