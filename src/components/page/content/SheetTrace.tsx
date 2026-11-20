"use client";

import { useEffect, useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useHoverIntent, useTabs } from "@/components/interactive/useTabs";
import { BLOCK_COPY, type SheetView } from "@/content/template-blocks";
import { cx } from "@/lib/utils";
import s from "./sheet.module.css";

const C = BLOCK_COPY.sheet;
const NEWS_MS = 5000; // how long an announcement stays in the live region (home demo value)
const NAV_KEYS = ["ArrowLeft", "ArrowRight", "Home", "End"];
/** Columns shown as the home demo's sheet chip, and columns that say where a line came from. */
const CHIP = ["Source", "Sheet"];
const TRACED = ["Source", "Sheet", "Basis", "Priced from"];
const isNumeric = (x: string) => /^[\d,.\-–$%+()/\s]+$/.test(x.trim());
/** The column a line is named by: Item or Estimate line, else the first. */
const nameColumn = (head: string[]) => Math.max(0, head.findIndex((h) => h === "Item" || h === "Estimate line"));

/**
 * The formula bar's sentence for one line, from the line's own cells: the item (with its size), the quantity (or a
 * material list's net, allowance and order, or the low to high range), then every other column as "Head: value".
 */
function lineSentence(head: string[], row: string[]): string {
  const used = new Set<number>();
  const cell = (h: string) => {
    const i = head.indexOf(h);
    if (i < 0 || !row[i]) return undefined;
    used.add(i);
    return row[i];
  };
  const at = nameColumn(head);
  used.add(at);
  const size = cell("Size");
  const name = size ? `${row[at]}, ${size}` : row[at];
  const unit = cell("Unit");
  const u = unit ? ` ${unit}` : "";
  let measure: string | undefined;
  if (head.includes("Qty")) {
    const qty = cell("Qty");
    measure = qty && `${qty}${u}`;
  } else if (head.includes("Net")) {
    const [net, allow, order, buy] = ["Net", "Allowance", "Order", "Buy as"].map(cell);
    measure = [net && `${net}${u} net`, allow && `${allow} allowance`, order && `${order}${u} to order`, buy && `bought as ${buy}`]
      .filter(Boolean)
      .join(", ");
  } else if (head.includes("Likely")) {
    const [low, likely, high] = ["Low", "Likely", "High"].map(cell);
    measure = low && likely && high ? `${low} to ${high}${u}, likely ${likely}` : undefined;
  } else {
    const i = row.findIndex((v, k) => v && !used.has(k));
    if (i >= 0) {
      used.add(i);
      measure = row[i];
    }
  }
  const rest = head.flatMap((h, k) => (used.has(k) || !row[k] ? [] : [`${h}: ${row[k]}`]));
  return `${[measure ? `${name}: ${measure}` : name, ...rest].join(". ")}.`;
}

/**
 * The live workbook: the sample sheet with a formula bar that reads any line back as a sentence. Resting the mouse on
 * a row picks it silently; a click, a tap or Enter on its line button picks it and speaks the sentence. Views (columns
 * to focus, or rows to light by a column's value) sit above the sheet as buttons, or are the sheet's own bottom tabs.
 * Only tabs with lines behind them are drawn, and only as such a view: a sheet's other tab names are not drawn at all,
 * since a strip of tabs that do nothing reads as broken. Every row stays in the table: a view only tints or fades, and
 * the formula bar keeps its tallest sentence's height, so nothing below ever moves. Sheets of six or more columns
 * become line cards below 720px.
 */
export function SheetTrace({ caption, head, rows, tabs, view }: { caption: string; head: string[]; rows: string[][]; tabs?: string[]; view?: SheetView }) {
  const hover = useHoverIntent();
  const askId = useId();
  const panelId = useId();
  const at = nameColumn(head);
  const traced = head.some((h) => TRACED.includes(h));
  const sentences = rows.map((r) => lineSentence(head, r));
  const numeric = head.map((_, k) => rows.every((r) => isNumeric(r[k] ?? "")));

  const tabbed = view?.kind === "rows" && view.control === "tabs";
  const values = view?.kind === "rows" ? [...new Set(rows.map((r) => r[view.column]))] : [];
  const options = !view
    ? []
    : view.kind === "columns"
      ? [view.all, ...view.labels]
      : tabbed
        ? (tabs ?? []).filter((t) => t === view.all || values.includes(t))
        : [view.all, ...values];
  const v = useTabs(Math.max(options.length, 1), { panelIds: options.map(() => panelId) });
  const [line, setLine] = useState<number | null>(null);
  const [news, setNews] = useState<"" | "line" | "view">(""); // the last pick was a click, tap or key: say it

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(""), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, line, v.active]);

  const sel = options.length ? v.active : 0;
  const focus = view?.kind === "columns" && sel > 0 ? view.columns[sel - 1] : -1;
  const lit = view?.kind === "rows" && sel > 0 && options[sel] !== view.all ? options[sel] : undefined;
  const off = (r: string[]) => view?.kind === "rows" && lit !== undefined && r[view.column] !== lit;
  const status = !view
    ? ""
    : view.kind === "columns"
      ? sel === 0
        ? view.all
        : C.column.replace("{label}", options[sel])
      : C.status
          .replace("{label}", options[sel])
          .replace("{n}", String(rows.filter((r) => !off(r)).length))
          .replace("{total}", String(rows.length));
  const say = news === "line" && line !== null ? sentences[line] : news === "view" ? status : "";

  const pickLine = (i: number) => {
    setLine(i);
    setNews("line");
  };
  const hoverLine = (i: number) => {
    if (line === i) return false;
    setLine(i);
    setNews("");
  };
  const pickView = (i: number) => {
    v.select(i);
    setNews("view");
  };
  const hoverView = (i: number) => {
    if (sel === i) return false;
    v.select(i);
    setNews("");
  };
  const viewHover = (i: number) => ({
    onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
      if (i === sel) return hover.leave();
      hover.enter(e, () => hoverView(i));
    },
    onPointerMove: hover.move,
    onPointerLeave: hover.leave,
  });
  const tabProps = (i: number) => {
    const p = v.getTabProps(i);
    return {
      ...p,
      ...viewHover(i),
      onClick: () => pickView(i),
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (NAV_KEYS.includes(e.key)) setNews("view");
        p.onKeyDown(e);
      },
    };
  };
  const box = tabbed ? v.getPanelProps(v.active) : { role: "group" as const, "aria-label": caption, tabIndex: 0 };

  return (
    <div className={s.trace}>
      {view && !tabbed && (
        <div className={s.views}>
          <p id={askId} className={s.ask}>
            {view.ask}
          </p>
          <div className={s.opts} role="group" aria-labelledby={askId}>
            {options.map((o, i) => (
              <button key={o} type="button" className={s.opt} aria-pressed={sel === i} onClick={() => pickView(i)} {...viewHover(i)}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={cx("sheet", s.sheet)} data-cards={head.length >= 6 ? "" : undefined}>
        <div className="sheet-bar">
          <span className="sheet-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{C.honesty}</span>
        </div>
        <div className={s.fx}>
          <span className={s.ref} aria-hidden="true">{`${String.fromCharCode(65 + at)}${(line ?? 0) + 1}`}</span>
          <span className={s.fxMark} aria-hidden="true">
            fx
          </span>
          <p className={s.fxText}>
            <span className={s.hint} data-on={line === null ? "" : undefined}>
              {traced ? C.hintSource : C.hintFull}
            </span>
            {sentences.map((t, i) => (
              <span key={i} data-on={line === i ? "" : undefined}>
                {t}
              </span>
            ))}
          </p>
        </div>
        <div className={cx("sheet-scroll", s.scroll)} {...box}>
          <table className={s.table} role="table" data-cards={head.length >= 6 ? "" : undefined}>
            <caption>{caption}</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th className="rn" role="columnheader" scope="col">
                  <span className="sr-only">Row</span>
                </th>
                {head.map((h, k) => (
                  <th key={h} role="columnheader" scope="col" className={cx(numeric[k] && "r")} data-focus={k === focus ? "" : undefined}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {rows.map((r, i) => (
                <tr
                  key={i}
                  role="row"
                  data-on={line === i ? "" : undefined}
                  data-off={off(r) ? "" : undefined}
                  onPointerEnter={(e) => {
                    if (line === i) return hover.leave();
                    hover.enter(e, () => hoverLine(i));
                  }}
                  onPointerMove={hover.move}
                  onPointerLeave={hover.leave}
                >
                  <td className="rn" role="cell">
                    {i + 1}
                  </td>
                  {r.map((c, k) => (
                    <td
                      key={k}
                      role="cell"
                      data-label={head[k]}
                      data-focus={k === focus ? "" : undefined}
                      className={cx(numeric[k] && "r", k === at && s.name)}
                    >
                      {k === at ? (
                        <button type="button" className={s.line} onClick={() => pickLine(i)}>
                          <span className="sr-only">{traced ? C.srSource : C.srFull}</span>
                          {c}
                        </button>
                      ) : CHIP.includes(head[k]) ? (
                        <span className={s.src}>{c}</span>
                      ) : (
                        c
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tabbed && (
          <div className={cx("sheet-tabs", s.tabs)} {...v.tablistProps} aria-label={view.ask}>
            {options.map((t, i) => (
              <button key={t} {...tabProps(i)} className={s.tab}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {say}
      </p>
    </div>
  );
}
