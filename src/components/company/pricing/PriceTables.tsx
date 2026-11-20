import Link from "next/link";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { PRICE_ROWS, priceLabel } from "@/content/pricing";
import type { Tone } from "@/content/types";
import { cx } from "@/lib/utils";
import { PER_PROJECT } from "./content";
import s from "./pricing.module.css";

/** Same column widths in every table (30/16/26/28 %), so prices and delivery times line up from one group to the next. */
const COLS = [s.c0, s.c1, s.c2, s.c3];

/**
 * Price tables, built straight from PRICE_ROWS so the published prices live in one place: one section and one h2, each
 * group a captioned table framed as a card (the home pricing card's tag, here on a thin CSS motif strip). Captions are
 * not headings. Under 720px each row becomes a small card, which is why the cells carry explicit ARIA roles.
 */
export function PriceTables({ tone = "light" }: { tone?: Tone }) {
  const { id, h2, intro, note, head, groups } = PER_PROJECT;
  return (
    <Section id={id} tone={tone}>
      <SectionHead id={id} kicker="Every service, every price" h2={h2} intro={intro} layout="split" />
      <div className={s.groups}>
        {groups.map(({ group, caption }) => {
          const rows = PRICE_ROWS.filter((r) => r.group === group);
          if (!rows.length) return null;
          return (
            <div key={group} className={cx("hr-card", s.group)}>
              <table className={s.prices} role="table">
                <caption>
                  <span className={s.capRow}>
                    <span className={s.tag}>{caption}</span>
                    <span className={s.motif} data-m={group} aria-hidden="true" />
                  </span>
                </caption>
                <colgroup>
                  {COLS.map((c) => (
                    <col key={c} className={c} />
                  ))}
                </colgroup>
                <thead role="rowgroup">
                  <tr role="row">
                    {head.map((h) => (
                      <th key={h} scope="col" role="columnheader">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {rows.map((r) => (
                    <tr key={r.href} role="row">
                      <th scope="row" role="rowheader">
                        <Link href={r.href} className={s.svc}>
                          {r.service}
                        </Link>
                      </th>
                      <td role="cell">
                        <span className="hr-badge">{priceLabel(r)}</span>
                      </td>
                      <td role="cell">
                        <span className={cx("hr-badge soft", s.when)}>{r.delivery}</span>
                      </td>
                      <td role="cell" className={s.cBest}>
                        {r.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <p className={s.note}>
        <Rich text={note} />
      </p>
    </Section>
  );
}
