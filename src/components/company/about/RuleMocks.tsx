import type { ReactNode } from "react";
import { keepHyphenated } from "@/components/page/StepCards";
import { Icon } from "@/components/ui/Icon";
import type { SystemColor } from "@/content/types";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./about.module.css";

/*
 * One small proof mock per working rule, in rule order: the piece of a real file the rule shows up in. Decoration
 * (RuleExplorer hides them from screen readers and labels them "Illustrative example"); every word comes from the
 * rule itself, the claims or the home demo's illustrative sheet P-101.
 */

/** ±5–10% and ±15–30%, read from the claim so the mock follows it. */
const [TIGHT = "", WIDE = ""] = CLAIMS.varianceLong.match(/±[\d–]+%/g) ?? [];

const ROWS: { line: string; qty: string; unit: string; c: SystemColor | "fixtures" }[] = [
  { line: "Sanitary waste, 4 in. PVC DWV", qty: "30", unit: "LF", c: "waste" },
  { line: "Vent, 2 in. PVC DWV", qty: "15", unit: "LF", c: "vent" },
  { line: "Water closets, WC-1", qty: "3", unit: "EA", c: "fixtures" },
];

/** Rule 1: workbook lines, each naming its sheet; the first one picked. */
const traces = (
  <div className={s.mockRows}>
    <p className={s.mockHead}>
      <span>Line item</span>
      <span>Source</span>
      <span>Qty</span>
    </p>
    {ROWS.map((r, i) => (
      <p key={r.line} className={s.mockRow} data-on={i === 0 ? "" : undefined}>
        <span className={s.mockLine}>
          <i className="swatch sm" data-c={r.c} />
          {r.line}
        </span>
        <span className={s.src}>P-101</span>
        <span className={s.qty}>
          {r.qty} {r.unit}
        </span>
      </p>
    ))}
  </div>
);

/** Rule 2: the second estimator's review, signed off. */
const review = (
  <div className={s.mockReview}>
    <p className={s.mockTitle}>Second-estimator review</p>
    <p className={s.ticks}>
      <span>Quantities</span>
      <span>Rates</span>
      <span>Totals</span>
    </p>
    <p className={s.mockNote}>Reviewed against the drawings before delivery</p>
    <span className={cx(s.stamp, s.stampSm)}>
      <b>Checked</b>
      <small>Second estimator</small>
    </span>
  </div>
);

/** Rule 3: the scope-gap log, gaps sent as RFIs instead of guessed. */
const gaps = (
  <div>
    <p className={s.mockTitle}>Scope-gap log</p>
    <ul className={s.gapList}>
      <li>
        <span className={s.src}>P-601</span>
        <span>Fixture tag missing from the schedule</span>
        <span className={s.rfi}>Send as RFI</span>
      </li>
      <li>
        <span className={s.src}>P-102</span>
        <span>Pipe left unsized</span>
        <span className={s.rfi}>Send as RFI</span>
      </li>
    </ul>
    <p className={s.chipRow}>
      <span className="hr-badge soft">Logged, not guessed</span>
    </p>
  </div>
);

/** Rule 4: the basis of estimate names the class; two typical ranges around the number. */
const classes = (
  <div>
    <p className={s.mockTitle}>Basis of estimate</p>
    <p className={s.mockNote}>Estimate class: stated (AACE International)</p>
    <div className={s.ranges}>
      <p className={s.range} data-kind="tight">
        <span className={s.bar} />
        <span>
          <b>{TIGHT}</b> {keepHyphenated("construction-document estimates")}
        </span>
      </p>
      <p className={s.range} data-kind="wide">
        <span className={s.bar} />
        <span>
          <b>{WIDE}</b> conceptual budgets
        </span>
      </p>
    </div>
    <p className={s.mockFoot}>Typical ranges, not promises</p>
  </div>
);

/** Rule 5: estimates priced for the project ZIP code; a takeoff carries no prices. */
const zip = (
  <div>
    <p className={s.mockTitle}>
      <Icon name="map-pin" size={16} />
      Project ZIP code
    </p>
    <p className={s.chipRow}>
      <span className="hr-badge soft">Union</span>
      <span className="hr-badge soft">Open-shop</span>
      <span className="hr-badge soft">Prevailing wage</span>
    </p>
    <p className={s.mockSplit}>Takeoff: no prices, you apply your own</p>
  </div>
);

/** Rule 6: the NDA, signed on request before anything moves; JU doesn't bid or build. */
const nda = (
  <div className={s.mockNda}>
    <p className={s.mockTitle}>
      <Icon name="lock" size={16} />
      NDA
    </p>
    <p className={s.mockNote}>Signed on request, before any files move</p>
    <span className={s.ndaLines} />
    <p className={s.chipRow}>
      <span className="hr-badge soft">We don&apos;t bid</span>
      <span className="hr-badge soft">We don&apos;t build</span>
    </p>
  </div>
);

export const RULE_MOCKS: ReactNode[] = [traces, review, gaps, classes, zip, nda];
