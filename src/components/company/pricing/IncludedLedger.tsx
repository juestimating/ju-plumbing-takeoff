import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { cx } from "@/lib/utils";
import { INCLUDED_AND_EXTRA } from "./content";
import s from "./pricing.module.css";

/** Status pill by the exact cell text: what is included, what is free, what is quoted on top. */
function Status({ text }: { text: string }) {
  if (text === "Included" || text === "Included, on request") {
    return (
      <span className="hr-badge soft">
        <Icon name="check" size={14} />
        {text}
      </span>
    );
  }
  if (text === "Free") return <span className="hr-badge">{text}</span>;
  return <span className={cx("hr-badge soft", text === "Quoted separately" && s.extra)}>{text}</span>;
}

/**
 * "No surprises": the includes table rendered as a receipt at every width (item, dotted leader, status pill, then what
 * it means). Still one real table with its caption; the display changes, so every cell carries its ARIA role.
 */
export function IncludedLedger() {
  const b = INCLUDED_AND_EXTRA;
  if (b.type !== "table") throw new Error("included ledger: INCLUDED_AND_EXTRA must be a table block");
  return (
    <Section id={b.id} tone="alt">
      <div className={s.ledgerGrid}>
        <SectionHead id={b.id} kicker="No surprises" h2={b.h2} intro={b.intro} />
        <div className={s.receiptShadow}>
          <div className={s.receipt}>
            <table className={s.ledger} role="table">
              <caption>{b.caption}</caption>
              <thead role="rowgroup" className="sr-only">
                <tr role="row">
                  {b.head.map((h) => (
                    <th key={h} scope="col" role="columnheader">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup">
                {b.rows.map(([item = "", price = "", means = ""]) => (
                  <tr key={item} role="row">
                    <th scope="row" role="rowheader">
                      {item}
                    </th>
                    <td role="cell">
                      <Status text={price} />
                    </td>
                    <td role="cell">
                      <Rich text={means} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}
