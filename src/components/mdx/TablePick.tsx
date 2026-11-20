"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useHoverIntent } from "@/components/interactive/useTabs";
import { keepTogether } from "./keep";
import { TableView, type PickRow, type PickVariant } from "./TableView";
import s from "./table-pick.module.css";

const NEWS_MS = 5000;
const end = (t: string) => (/[.?!:]$/.test(t) ? t : `${t}.`);
const a = (noun: string) => `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun.toLowerCase()}`;

/**
 * A guide table the visitor reads row by row (MdxTable's num, legend, sheet and reference variants). Point at a row
 * (hover intent), tap it, or arrow to it from its button, and the row is highlighted while the readout above the
 * table restates it from that row's own cells and column headers:
 * - num (a numbered route): "Step 3 of 10", the step, and its last column (what it produces, or the fix); the route
 *   line fills down to the picked step
 * - legend (line labels): the label drawn the way a plan draws it, a run in the system color broken by the label;
 *   the other rows' legend lines fade
 * - sheet (workbook view): a formula bar with the row's range, then the row read across; the row is outlined
 * - ref (reference table): the row's name, then its other cells under their headers
 * Every readout sits stacked in one grid cell, so a pick never changes a height. The full table is server-rendered
 * (first row picked) and reads without JS. One tab stop (roving tabindex); hover picks are silent, clicks, taps and
 * keys are announced.
 */
export function TablePick({ variant, head, headCells, rows }: { variant: PickVariant; head: string[]; headCells: ReactNode[]; rows: PickRow[] }) {
  const at = variant === "num" ? 1 : 0; // the cell that names the row (a route's first cell is only its number)
  const last = head.length - 1;
  const [pick, setPick] = useState(0);
  const [news, setNews] = useState(false);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useHoverIntent();

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, pick]);

  const choose = (i: number, announce: boolean) => {
    setPick(i);
    setNews(announce);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const from = Math.max(0, btns.current.indexOf(e.currentTarget));
    const to =
      e.key === "ArrowDown" ? Math.min(rows.length - 1, from + 1)
      : e.key === "ArrowUp" ? Math.max(0, from - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? rows.length - 1
      : e.key === "Escape" ? 0
      : null;
    if (to === null) return;
    e.preventDefault();
    choose(to, true);
    btns.current[to]?.focus();
  };

  // the readout: a route step shows its last column (what it produces); every other table its cells after the name
  const shown = variant === "num" ? [last] : head.map((_, j) => j).filter((j) => j > at);
  const pos = (r: PickRow) => (variant === "num" ? `${head[0] === "#" ? "" : `${head[0]} `}${r.text[0]} of ${rows.length}` : "");
  const say = (r: PickRow) =>
    [pos(r) && `${pos(r)},`, end(r.text[at] ?? ""), ...shown.map((j) => `${head[j]}: ${end(r.text[j] ?? "")}`)].filter(Boolean).join(" ");
  const readouts = (
    <p className={s.readout} aria-hidden="true">
      {rows.map((r, i) => (
        <span key={i} data-on={i === pick ? "" : undefined}>
          <span className={s.lead}>
            {variant === "num" && <span className={s.pos}>{pos(r)}</span>}
            {variant === "legend" && r.line ? (
              <span className={s.run} data-c={r.line[0]} data-dash={r.line[1] ? "" : undefined}>
                <i />
                <b>{r.text[0]}</b>
                <i />
              </span>
            ) : (
              <b className={s.title}>{keepTogether(r.text[at])}</b>
            )}
          </span>
          {shown.map((j) => (
            <span key={j} className={s.pair}>
              <span className={s.k}>{head[j]}</span> {keepTogether(r.text[j])}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
  const live = (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {news ? say(rows[pick]!) : ""}
    </p>
  );
  const hint =
    variant === "num" ? `Pick ${a(head[0] === "#" ? (head[1] ?? "row") : head[0]!)}`
    : variant === "legend" ? "Pick a line label"
    : variant === "sheet" ? "Pick a line"
    : "Pick a row";
  const col = String.fromCharCode(65 + last);

  return (
    <TableView
      variant={variant}
      head={head}
      headCells={headCells}
      rows={rows}
      className={variant === "sheet" ? s.sheet : s.frame}
      barEnd={<span className={s.hintBar}>{hint}</span>}
      top={
        <>
          {variant === "sheet" ?
            <div className={s.fbar}>
              <span className={s.name} aria-hidden="true">{`A${pick + 2}:${col}${pick + 2}`}</span>
              <span className={s.fx} aria-hidden="true">
                fx
              </span>
              {readouts}
            </div>
          : <div className={s.bar}>
              <span className={s.hint}>{hint}</span>
              {readouts}
            </div>
          }
          {live}
        </>
      }
      // a click anywhere on a row picks it (the whole card on phones); the button in the naming cell is the keyboard route
      rowProps={(i) => ({
        "data-on": i === pick ? "" : undefined,
        "data-done": variant === "num" && i < pick ? "" : undefined,
        onPointerEnter: (e: PointerEvent) => hover.enter(e, () => (i === pick ? false : choose(i, false))),
        onPointerMove: hover.move,
        onPointerLeave: hover.leave,
        onClick: () => choose(i, true),
      })}
      cell={(body, i, j) =>
        j !== at ? body : (
          <button
            type="button"
            ref={(el) => {
              btns.current[i] = el;
            }}
            className={s.pick}
            tabIndex={i === pick ? 0 : -1}
            aria-pressed={i === pick}
            onKeyDown={onKey}
          >
            {body}
          </button>
        )
      }
    />
  );
}
