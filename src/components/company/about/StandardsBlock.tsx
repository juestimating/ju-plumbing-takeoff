import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import type { TableBlock } from "@/content/types";
import s from "./about.module.css";

/**
 * "What we work in": the standards table drawn as a drawing's title block (heavy outer rule, field names as small
 * caps on the left). Under 720px each row stacks, label over value; the ARIA roles keep the table semantics that
 * some browsers drop once the display type changes.
 */
export function StandardsBlock({ block }: { block: TableBlock }) {
  const [areaHead = "", useHead = ""] = block.head;
  return (
    <Section id={block.id} tone="light">
      <SectionHead id={block.id} kicker="What we work in" h2={block.h2} intro={block.intro} />
      <div className={s.titleBlock}>
        <table className={s.tb} role="table">
          <caption>{block.caption}</caption>
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">
                {areaHead}
              </th>
              <th scope="col" role="columnheader">
                {useHead}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {block.rows.map(([area = "", uses = ""]) => (
              <tr key={area} role="row">
                <th scope="row" role="rowheader">
                  {area}
                </th>
                <td role="cell">
                  <Rich text={uses} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && (
        <p className="tbl-note">
          <Rich text={block.note} />
        </p>
      )}
    </Section>
  );
}
