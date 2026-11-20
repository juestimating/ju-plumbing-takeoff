import type { HTMLAttributes, ReactNode } from "react";
import type { SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";

export type PickVariant = "num" | "legend" | "sheet" | "ref";
export type PickRow = { cells: ReactNode[]; text: string[]; line?: [SystemColor, dash?: true] };
type RowProps = HTMLAttributes<HTMLTableRowElement> & { "data-on"?: string; "data-done"?: string };

/**
 * The markup of MdxTable's num, legend, sheet and reference tables (global classes from prose.css and sections.css).
 * Plain module without hooks: the server renders it for a static table, TablePick renders it with its readout
 * (`top`, `barEnd`), row handlers (`rowProps`) and pick buttons (`cell`).
 */
export function TableView({
  variant,
  head,
  headCells,
  rows,
  className,
  top,
  barEnd,
  rowProps,
  cell,
}: {
  variant: PickVariant;
  head: string[];
  headCells: ReactNode[];
  rows: PickRow[];
  className?: string;
  top?: ReactNode;
  barEnd?: ReactNode;
  rowProps?: (i: number) => RowProps;
  cell?: (body: ReactNode, i: number, j: number) => ReactNode;
}) {
  const picking = !!cell;
  const frame = picking ? { "data-pick": variant, "data-hover-scope": "" } : {};
  const body = (c: ReactNode, i: number, j: number) => {
    const b = variant === "num" && j === 0 ? <span className="n">{c}</span> : c;
    return cell ? cell(b, i, j) : b;
  };

  if (variant === "sheet") {
    const right = head.map((h) => /^qty$/i.test(h));
    return (
      <div className={cx("sheet tbl-sheet", className)} {...frame}>
        <div className="sheet-bar">
          <span className="sheet-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Workbook view</span>
          {barEnd}
        </div>
        {top}
        {/* with pick buttons inside, the frame is reached through them (one tab stop) and arrows still scroll it */}
        <div className="sheet-scroll" tabIndex={picking ? undefined : 0} role="group" aria-label="Table, scrolls sideways on small screens">
          <table>
            <thead>
              <tr>
                {headCells.map((c, j) => (
                  <th key={j} scope="col" className={right[j] ? "r" : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} {...rowProps?.(i)}>
                  {r.cells.map((c, j) => (
                    <td key={j} className={right[j] ? "r" : undefined}>
                      {body(c, i, j)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("tbl-wrap g-tbl", variant === "num" && "g-num", variant === "legend" && "g-legend", className)} {...frame}>
      {top}
      <table className="tbl" role="table">
        <thead role="rowgroup">
          <tr role="row">
            {headCells.map((c, j) => (
              <th key={j} scope="col" role="columnheader">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((r, i) => (
            <tr key={i} role="row" {...rowProps?.(i)}>
              {r.cells.map((c, j) => (
                <td
                  key={j}
                  role="cell"
                  data-label={head[j]}
                  data-c={variant === "legend" && j === 0 ? r.line?.[0] : undefined}
                  data-dash={variant === "legend" && j === 0 && r.line?.[1] ? "" : undefined}
                >
                  {body(c, i, j)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
