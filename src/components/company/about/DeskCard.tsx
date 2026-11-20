import { DrawingFigure } from "@/components/illustrations/DrawingFigure";
import { Icon } from "@/components/ui/Icon";
import { PROOF_ITEMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./about.module.css";

/** The two promises the stamp stands for, worded as in the proof items. */
const PROMISES = PROOF_ITEMS.filter((p) => p.icon === "shield-check" || p.icon === "lock");

/**
 * Hero card for /about, the plumbing desk: the marked-up plan on its paper with the honesty strip, an inspection-style
 * "Checked" stamp over the sheet (decorative) and the two promises every file carries. The page's only drawing.
 */
export function DeskCard() {
  return (
    <div className={s.desk}>
      <div className={s.deskSheet}>
        <DrawingFigure name="plan-markup" className={s.deskFig} />
        <span className={s.stamp} aria-hidden="true">
          <b>Checked</b>
          <small>Second estimator</small>
        </span>
      </div>
      <ul className={s.deskBadges} role="list">
        {PROMISES.map((p) => (
          <li key={p.text} className={cx("hr-badge soft", s.deskBadge)}>
            <Icon name={p.icon} size={15} />
            {p.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
