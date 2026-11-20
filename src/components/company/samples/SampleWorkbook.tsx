"use client";

import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { FileSpreadsheet, Highlighter } from "lucide-react";
import { useHoverIntent, useTabs } from "@/components/interactive/useTabs";
import { cx } from "@/lib/utils";
import s from "./samples.module.css";

export type Swatch = "fixtures" | "waste" | "vent" | "water" | "storm" | "equipment" | "fire";
export type SheetRow = {
  cells: string[];
  /** Source keys this line came from (P-101, spec, gap...); lit in the rail when the line is picked. */
  refs: string[];
  swatch?: Swatch;
  /** Readout pieces; the first is the line itself. Joined with ", " for the live region. */
  parts: string[];
  /** Material list only: Net, Allowance, Order, Buy as, each with its unit. */
  math?: [string, string, string, string];
};
/** A workbook tab under the sheet, a real view of the same lines: the columns it lights, or the lines it keeps lit. */
export type SheetTab = { label: string; cols?: number[]; rows?: number[] };
export type Sheet = {
  /** The content block's id: the panel keeps it, so links to the old sections still land here. */
  id: string;
  tab: string;
  /** Server-rendered: the block's h2 (id `${id}-h`, which names the panel's section) and intro. */
  head: ReactNode;
  note: ReactNode;
  caption: string;
  columns: string[];
  /** Right-aligned (numeric) columns. */
  right: boolean[];
  /** Phones: this column moves under the line's name, so the rest keep their width. */
  sub?: number;
  /** None when the sheet has no second view to switch to: a strip of tabs that do nothing reads as broken. */
  sheetTabs?: SheetTab[];
  rows: SheetRow[];
  sources: { key: string; label: string; sub?: string }[];
  /** Readout before a pick, and the hidden words around a line's name on its button. */
  hint: string;
  frame: [string, string];
};

type Pick = { sheet: number; row: number };
type Hover = ReturnType<typeof useHoverIntent>;
const NAV_KEYS = ["ArrowLeft", "ArrowRight", "Home", "End"];
const NEWS_MS = 5000; // how long an announcement stays in the live region (so browse mode reads it once)
const MATH = ["Net", "Allowance", "Order", "Buy as"];
/** Keeps sheet numbers, hyphenated words and sizes whole ("P-101", "hard-drawn", "2 in."), so a narrow cell never splits one. */
const keep = (text: string) =>
  text.split(/(\S*-\S*|\d+ in\.)/).map((part, k) => (k % 2 ? <span key={k} className={s.nw}>{part}</span> : part));
/** What a tab picked by click, tap or key says: the lines it keeps lit, or the columns it lights. */
function viewSay(sh: Sheet, t: SheetTab) {
  if (t.rows) return `${t.label}: ${t.rows.length} of ${sh.rows.length} lines`;
  const cols = (t.cols ?? []).map((c) => sh.columns[c]);
  return `${t.label}: ${cols.join(" and ")} ${cols.length > 1 ? "columns" : "column"}`;
}

/**
 * One file's sheet: the table and, when it has them, its workbook tabs. A tab is a view of the same lines (its columns
 * tinted, or the lines outside it faded while the picked line stays lit), so a switch never moves a row or changes the
 * height. Resting the mouse on a tab switches it silently; a click, a tap or an arrow key also says the view.
 */
function SheetGrid({ sh, picked, hover, onLine, onHoverLine }: {
  sh: Sheet;
  picked: number | null;
  hover: Hover;
  onLine: (row: number) => void;
  onHoverLine: (row: number) => boolean | void;
}) {
  const tabs = sh.sheetTabs ?? [];
  const panelId = useId();
  const v = useTabs(Math.max(tabs.length, 1), { panelIds: tabs.map(() => panelId) });
  const [news, setNews] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  // On a phone the tab strip scrolls sideways: keep the picked tab in view (the home demo's rule).
  useEffect(() => {
    const bar = stripRef.current;
    const tab = bar?.children[v.active] as HTMLElement | undefined;
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    if (tab.offsetLeft < bar.scrollLeft || tab.offsetLeft + tab.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollTo({ left: tab.offsetLeft - 12 });
    }
  }, [v.active]);
  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, v.active]);

  const view = tabs.length ? tabs[v.active] : undefined;
  const focus = (c: number) => (view?.cols?.includes(c) ? "" : undefined);
  const swatches = sh.rows.some((r) => r.swatch); // then a line without one keeps an empty slot, so labels align
  const tabProps = (k: number) => {
    const p = v.getTabProps(k);
    return {
      ...p,
      onClick: () => {
        v.select(k);
        setNews(true);
      },
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (NAV_KEYS.includes(e.key)) setNews(true);
        p.onKeyDown(e);
      },
      onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
        if (k === v.active) return hover.leave();
        hover.enter(e, () => {
          setNews(false);
          v.select(k);
        });
      },
      onPointerMove: hover.move,
      onPointerLeave: hover.leave,
    };
  };
  const box = view ? v.getPanelProps(v.active) : { role: "group" as const, "aria-label": sh.caption, tabIndex: 0 };

  return (
    <div className={cx("sheet", s.sheet)}>
      <div className={cx("sheet-bar", s.sheetBar)}>
        <span>Illustrative layout. Figures are examples, not project data.</span>
      </div>
      <div className="sheet-scroll" {...box}>
        <table className={s.table}>
          <caption>{sh.caption}</caption>
          <thead>
            <tr>
              <th className="rn" scope="col">
                <span className="sr-only">Row</span>
              </th>
              {sh.columns.map((h, c) => (
                <th key={h} scope="col" className={cx(sh.right[c] && "r", c === sh.sub && s.subCol)} data-focus={focus(c)}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sh.rows.map((r, ri) => (
              <tr
                key={r.cells[0]}
                data-on={picked === ri ? "" : undefined}
                data-off={view?.rows && !view.rows.includes(ri) ? "" : undefined}
                onPointerEnter={(e) => hover.enter(e, () => onHoverLine(ri))}
                onPointerMove={hover.move}
                onPointerLeave={hover.leave}
              >
                <td className="rn">{ri + 1}</td>
                <td className={s.lineCell} data-focus={focus(0)}>
                  <button type="button" className={s.line} onClick={() => onLine(ri)}>
                    {swatches && <i className={cx("swatch sm", !r.swatch && s.blank)} data-c={r.swatch} aria-hidden="true" />}
                    <span>
                      <span className="sr-only">{sh.frame[0]} </span>
                      {keep(r.cells[0] ?? "")}
                      {sh.frame[1] && <span className="sr-only"> {sh.frame[1]}</span>}
                    </span>
                  </button>
                  {sh.sub !== undefined && <small className={s.lineSub}>{keep(r.cells[sh.sub] ?? "")}</small>}
                </td>
                {r.cells.slice(1).map((cell, c) => (
                  <td key={c} className={cx(sh.right[c + 1] && "r", c + 1 === sh.sub && s.subCol)} data-focus={focus(c + 1)}>
                    {keep(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {view && (
        <>
          <div ref={stripRef} className={cx("sheet-tabs", s.tabs)} {...v.tablistProps} aria-label="Workbook tabs">
            {tabs.map((t, k) => (
              <button key={t.label} {...tabProps(k)} className={s.tab}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {news ? viewSay(sh, view) : ""}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * The sample workbook (the home demo's workbook, fed by the page's three sample tables): file tabs switch the sheet,
 * and picking a line (resting the mouse on it, a tap, or Enter on its button) lights the plan sheets it came from, or
 * builds its order quantity on the material list. Panels stack in one grid cell and the readout reserves its longest
 * answer, so a pick never changes the window's height, and no pick scrolls the page: below 1024 the readout (which
 * names the lit sheets) sticks above the call bar while the table is on screen (samples.module.css). Only clicks, taps
 * and keys reach the live region. Each file is its own section, named by its h2.
 */
export function SampleWorkbook({ sheets }: { sheets: Sheet[] }) {
  const ids = sheets.map((x) => x.id);
  const { active, select, tablistProps, getTabProps, getPanelProps } = useTabs(sheets.length, { panelIds: ids });
  const hover = useHoverIntent();
  const [pick, setPick] = useState<Pick | null>(null);
  const [news, setNews] = useState(false); // the last pick was a click, tap or key: say it
  const win = useRef<HTMLDivElement>(null);
  const idList = ids.join(" ");

  // A link to one of the sheets (#sample-plumbing-material-list) opens that file and brings the window into view.
  useEffect(() => {
    const open = () => {
      const i = idList.split(" ").indexOf(window.location.hash.slice(1));
      if (i < 0) return;
      select(i);
      setPick(null);
      win.current?.scrollIntoView({ block: "start" });
    };
    const t = window.setTimeout(open, 0); // after hydration, so the browser's own jump has happened
    window.addEventListener("hashchange", open);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", open);
    };
  }, [idList, select]);

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, pick]);

  /** A sheet's picked line: the visitor's pick, else the material list's first line, so its math shows on arrival (unannounced). */
  const lineOf = (i: number) => (pick?.sheet === i ? pick.row : sheets[i]?.rows.some((r) => r.math) ? 0 : null);
  const picked = lineOf(active);
  const row = picked === null ? null : sheets[active]?.rows[picked];

  const openFile = (i: number, focus = false) => {
    setPick(null);
    setNews(false);
    select(i, focus);
  };
  const clickLine = (sheet: number, r: number) => {
    setNews(true);
    setPick({ sheet, row: r });
  };
  // a hover pick changes the view silently, and returns false when it changed nothing (for the hover-intent guard)
  const hoverLine = (sheet: number, r: number) => {
    if (lineOf(sheet) === r) return false;
    setNews(false);
    setPick({ sheet, row: r });
  };

  return (
    <div ref={win} className={s.window}>
      <div className={s.winBar}>
        <span className={cx("sheet-dots", s.dots)} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div {...tablistProps} aria-label="Sample files" className={s.files}>
          {sheets.map((sh, i) => {
            const t = getTabProps(i);
            return (
              <button
                key={sh.id}
                {...t}
                className={s.file}
                onClick={() => openFile(i)}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                  if (NAV_KEYS.includes(e.key)) setPick(null);
                  t.onKeyDown(e);
                }}
                onPointerEnter={(e) => {
                  if (i === active) return hover.leave();
                  hover.enter(e, () => openFile(i));
                }}
                onPointerMove={hover.move}
                onPointerLeave={hover.leave}
              >
                <FileSpreadsheet size={16} aria-hidden="true" />
                {sh.tab}
                <span className={s.ext} aria-hidden="true">
                  .xlsx
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={s.panels}>
        {sheets.map((sh, i) => {
          const { hidden, ...panel } = getPanelProps(i);
          const mine = i === active ? row : null;
          const lit = new Set(mine?.refs);
          return (
            <section key={sh.id} {...panel} aria-labelledby={`${sh.id}-h`} inert={hidden} className={s.panel}>
              <div className={s.head}>{sh.head}</div>

              <div className={s.rail}>
                {sh.rows.some((r) => r.math) ? (
                  <>
                    <p className={s.railLabel}>How the order is built</p>
                    <div className={s.math} data-on={mine ? "" : undefined}>
                      {MATH.map((label, k) => (
                        <Fragment key={label}>
                          {k === 1 && (
                            <span className={s.op} aria-hidden="true">
                              +
                            </span>
                          )}
                          {k === 2 && (
                            <span className={s.op} aria-hidden="true">
                              =
                            </span>
                          )}
                          <span className={s.box} data-k={k === 3 ? "buy" : undefined}>
                            <small>{label}</small>
                            <b>{mine?.math?.[k] ?? ""}</b>
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className={s.railLabel}>Source sheets</p>
                    <ul className={s.sources} role="list">
                      {sh.sources.map((src) => (
                        <li key={src.key} className={s.src} data-lit={lit.has(src.key) ? "" : undefined} data-dim={mine && !lit.has(src.key) ? "" : undefined}>
                          <b>{src.label}</b>
                          {src.sub && <small>{src.sub}</small>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* the sheet and its readout share a box below 1024, so the sticky readout rides over the table only */}
              <div className={s.lane}>
                <SheetGrid sh={sh} picked={i === active ? picked : null} hover={hover} onLine={(r) => clickLine(i, r)} onHoverLine={(r) => hoverLine(i, r)} />

                <p className={s.readout} data-readout="">
                  <Highlighter size={18} aria-hidden="true" />
                  <span key={mine ? mine.cells[0] : "hint"} className={s.say}>
                    {mine
                      ? mine.parts.map((p, k) => (
                          <Fragment key={k}>
                            {k > 0 && (
                              <span className={s.sep} aria-hidden="true">
                                {" · "}
                              </span>
                            )}
                            {k === 0 ? <strong>{keep(p)}</strong> : keep(p)}
                          </Fragment>
                        ))
                      : sh.hint}
                  </span>
                </p>
              </div>
              <div className={s.note}>{sh.note}</div>
            </section>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {news && row ? row.parts.join(", ") : ""}
      </p>
    </div>
  );
}
