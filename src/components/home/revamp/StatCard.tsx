import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import type { IconName } from "@/content/types";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import { CountUp } from "@/components/interactive/CountUp";
import s from "./hero.module.css";

/** The number inside a claim ("500+" is 500, "all 50 states" is 50), so the card follows CLAIMS. */
const n = (claim: string) => Number(claim.match(/\d+/)?.[0] ?? 0);

const FACTS: { icon: IconName; value: ReactNode; label: string }[] = [
  { icon: "users", value: <CountUp value={n(CLAIMS.contractors)} suffix="+" />, label: "Contractors served" },
  { icon: "clock", value: CLAIMS.turnaround.split(" ")[0], label: "Hours, standard delivery" },
  { icon: "calendar", value: <CountUp value={n(CLAIMS.years)} suffix="+" />, label: "Years estimating" },
  { icon: "map-pin", value: <CountUp value={n(CLAIMS.states)} />, label: "States covered" },
];

/** White fact card that overlaps the bottom of the hero. Company-wide figures, labeled as such. Not a section with an h2. */
export function StatCard() {
  return (
    <section aria-label="JU Estimating at a glance" className={s.band}>
      <Container>
        <div className={s.facts}>
          <div className={s.factsIntro}>
            <p className={s.factsTitle}>Why contractors choose JU</p>
            <p className={s.factsNote}>Company-wide figures for JU Estimating, all trades</p>
          </div>
          <dl className={s.factsList}>
            {FACTS.map((f) => (
              <div key={f.label} className={s.fact}>
                <dt>
                  <span className={cx("hr-tile sm", s.tile)} aria-hidden="true">
                    <Icon name={f.icon} />
                  </span>
                  {f.label}
                </dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
