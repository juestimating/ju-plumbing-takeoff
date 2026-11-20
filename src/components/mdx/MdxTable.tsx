import { Children, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from "react";
import type { SystemColor } from "@/content/types";
import { keepTogether } from "./keep";
import { textOf } from "./Mdx";
import { SheetTrace } from "./SheetTrace";
import { TablePick } from "./TablePick";
import { TableView, type PickVariant } from "./TableView";

type El = ReactElement<{ children?: ReactNode }>;
const els = (node: ReactNode): El[] => Children.toArray(node).filter((c): c is El => isValidElement(c));
const hasLink = (node: ReactNode): boolean =>
  Array.isArray(node) ? node.some(hasLink)
  : isValidElement<{ href?: string; children?: ReactNode }>(node) && (node.props.href !== undefined || hasLink(node.props.children));

/** Line labels on the how-to-read table, drawn as legend lines in the system color (vent and return dashed). */
const LEGEND: Record<string, [SystemColor, dash?: true]> = {
  "W or SAN": ["waste"],
  V: ["vent", true],
  CW: ["cold"],
  HW: ["hot"],
  HWR: ["hot", true],
  "SD or ST": ["storm"],
  G: ["gas"],
};

/**
 * MDX table, styled by its own shape (server-side, text unchanged):
 * - a "Formula..." column: the formula trace (SheetTrace)
 * - first header "Step" or "#": numbered route; first header "Label": line-label legend
 * - 5 or more columns: Excel workbook view, scrolling sideways on phones with the first column pinned
 * - otherwise a reference table that never scrolls and stacks into labeled cards below 640px
 * The four non-formula variants (TableView markup) let the visitor pick a row and read it in a readout (TablePick).
 * The stacked variants carry ARIA table roles, because some browsers drop table semantics when display changes.
 * Ranges like "24–72 hours" stay on one line in every cell. An unexpected structure renders the plain scrolling table.
 */
export function MdxTable({ children }: ComponentProps<"table">) {
  const parts = els(children);
  const headRow = els(parts.find((p) => p.type === "thead")?.props.children)[0];
  const headCells = headRow ? els(headRow.props.children).map((th) => th.props.children) : [];
  const head = headCells.map((c) => textOf(c).trim());
  const rows = els(parts.find((p) => p.type === "tbody")?.props.children).map((tr) =>
    els(tr.props.children).map((td) => keepTogether(td.props.children)),
  );
  if (!head.length || !rows.length || rows.some((r) => r.length !== head.length)) {
    return (
      <div className="tbl-wrap" tabIndex={0} role="group" aria-label="Table, scrolls sideways on small screens">
        <table className="tbl">{children}</table>
      </div>
    );
  }
  const data = rows.map((cells) => ({ cells, text: cells.map((c) => textOf(c).trim()) }));
  if (head.some((h) => /^formula/i.test(h))) return <SheetTrace head={head} rows={data} />;
  const variant: PickVariant =
    /^(step|#)$/i.test(head[0]!) ? "num"
    : head[0] === "Label" ? "legend"
    : head.length >= 5 ? "sheet"
    : "ref";
  const at = variant === "num" ? 1 : 0;
  const props = { variant, head, headCells, rows: variant === "legend" ? data.map((r) => ({ ...r, line: LEGEND[r.text[0]!] })) : data };
  // a link in the naming column would sit inside the pick button, so that table stays static (and server-only)
  return rows.length > 1 && !rows.some((r) => hasLink(r[at])) ? <TablePick {...props} /> : <TableView {...props} />;
}
