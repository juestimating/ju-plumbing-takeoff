import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { BLOCK_COPY, SHEET_NO_SAMPLE, SHEET_VIEW } from "@/content/template-blocks";
import type { TableBlock } from "@/content/types";
import { SheetTrace } from "./SheetTrace";
import s from "./sheet.module.css";

const C = BLOCK_COPY.sheet;

/** "Inside the workbook": the live sample sheet, the content's note and the sample file route. */
export function SheetSection({ b, kicker }: { b: TableBlock; kicker?: string }) {
  const view = SHEET_VIEW[b.id];
  if (view?.kind === "columns" && view.columns.some((c, i) => b.head[c] !== view.labels[i])) {
    throw new Error(`SheetSection ${b.id}: columns ${view.columns.join(", ")} are no longer ${view.labels.join(", ")}`);
  }
  if (view?.kind === "rows") {
    if (!b.head[view.column]) throw new Error(`SheetSection ${b.id}: no column ${view.column} to light rows by`);
    const missing = view.control === "tabs" ? [view.all, ...b.rows.map((r) => r[view.column])].filter((t) => !b.sheetTabs?.includes(t)) : [];
    if (missing.length) throw new Error(`SheetSection ${b.id}: no workbook tab for ${[...new Set(missing)].join(", ")}`);
  }
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} center />
      <SheetTrace caption={b.caption} head={b.head} rows={b.rows} tabs={b.sheetTabs} view={view} />
      {b.note && (
        <p className="tbl-note">
          <Rich text={b.note} />
        </p>
      )}
      {!SHEET_NO_SAMPLE.includes(b.id) && (
        <div className={s.sample}>
          <p>{C.sampleAsk}</p>
          <ButtonLink href={C.sample.href} variant="outline" arrow>
            {C.sample.label}
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}
