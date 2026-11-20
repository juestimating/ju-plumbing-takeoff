import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { BLOCK_COPY } from "@/content/template-blocks";
import type { TableBlock } from "@/content/types";
import s from "./handoff.module.css";

const C = BLOCK_COPY.handoff;
const OWNER = /^(we|you|your)\b/i;

/**
 * "Your part, our part": the bid package table with each "Who supplies it" clause on its own line and a JU or You
 * pill by its first word. The pills repeat what the clause says, so screen readers skip them. Rows become cards on
 * phones (explicit table roles keep the semantics when the display changes).
 */
export function HandoffTable({ b, kicker, owner }: { b: TableBlock; kicker?: string; owner: number }) {
  // The joining semicolon stays on its clause (and the space after it in the text), so the cell still reads as the
  // one sentence the content wrote: "We complete it;" over "you sign".
  const clauses = (cell: string) => {
    const parts = cell.split("; ");
    return parts.map((part, i) => {
      const m = OWNER.exec(part);
      if (!m) throw new Error(`HandoffTable ${b.id}: "${part}" does not start with We, You or Your`);
      return { text: i < parts.length - 1 ? `${part};` : part, joined: i < parts.length - 1, ju: m[1].toLowerCase() === "we" };
    });
  };
  return (
    <Section id={b.id} tone={b.tone}>
      <div className={s.head}>
        <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} />
        <p className={s.legend} aria-hidden="true">
          <span className={s.pill} data-ju="">
            {C.ju}
          </span>{" "}
          {C.juText}
          <span className={s.sep}>·</span>
          <span className={s.pill}>{C.you}</span> {C.youText}
        </p>
      </div>
      <div className={s.frame}>
        <table className={s.table} role="table">
          <caption>{b.caption}</caption>
          <thead role="rowgroup">
            <tr role="row">
              {b.head.map((h) => (
                <th key={h} role="columnheader" scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {b.rows.map((r) => (
              <tr key={r[0]} role="row">
                {r.map((cell, k) =>
                  k === 0 ? (
                    <th key={k} role="rowheader" scope="row">
                      <Rich text={cell} />
                    </th>
                  ) : (
                    <td key={k} role="cell" data-label={b.head[k]}>
                      {k === owner ? (
                        <ul className={s.clauses}>
                          {clauses(cell).map((c) => (
                            <li key={c.text}>
                              <span className={s.pill} data-ju={c.ju ? "" : undefined} aria-hidden="true">
                                {c.ju ? C.ju : C.you}
                              </span>
                              <span>
                                <Rich text={c.text} />
                              </span>
                              {c.joined && " "}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Rich text={cell} />
                      )}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.note && (
        <p className="tbl-note">
          <Rich text={b.note} />
        </p>
      )}
    </Section>
  );
}
