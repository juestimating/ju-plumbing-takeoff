"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Copy } from "lucide-react";
import { useHoverIntent } from "@/components/interactive/useTabs";
import { cx } from "@/lib/utils";
import s from "./sheet-trace.module.css";

type Row = { cells: ReactNode[]; text: string[] };

/** Column letters a row describes: "J: Quantity to buy" > ["J"], "C and D: Size, material" > ["C", "D"]. */
export const lettersOf = (label: string): string[] => /^([A-O](?:\s*(?:,|and)\s*[A-O])*)\s*:/.exec(label)?.[1]!.match(/[A-O]/g) ?? [];
/** Columns a row-5 formula reads, in order of first use: "=CEILING(ROUND(F5*(1+H5),4),I5)" > ["F", "H", "I"]. */
export const refsOf = (formula: string) => [...new Set([...formula.matchAll(/\b([A-O])5\b/g)].map((m) => m[1]!))];
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const NEWS_MS = 5000;

/**
 * Formula trace for the spreadsheet guide's column table (Excel's Trace Precedents): point at, tap or arrow to a
 * column row and the formula bar shows its row-5 formula with each reference in its own color, the rows it reads are
 * outlined in the same colors (plus a letter chip, so color is never the only cue), and the formula can be copied.
 * The table text is the MDX's own; the server HTML shows column J picked. Every formula and readout sits stacked in
 * one grid cell, so a pick never changes a height. Hover picks are silent; clicks, taps and keys are announced.
 */
export function SheetTrace({ head, rows }: { head: string[]; rows: Row[] }) {
  const fi = Math.max(0, head.findIndex((h) => /^formula/i.test(h)));
  const meta = rows.map((r, i) => {
    const letters = lettersOf(r.text[0] ?? "");
    const rule = r.text[fi] ?? "";
    const formula = rule.startsWith("=") ? rule : null;
    const name = letters.length ? letters.map((l) => `${l}5`).join(":") : `Row ${i + 1}`;
    const refs = formula ? refsOf(formula) : [];
    const say = formula
      ? refs.length
        ? `${name} reads ${refs.length > 1 ? "columns" : "column"} ${list(refs)}.`
        : `${name} has a formula that reads no other column.`
      : `${name} has a rule, not a formula.`;
    return { letters, formula, refs, name, say };
  });
  const home = Math.max(0, meta.findIndex((m) => m.letters.includes("J")));
  const [pick, setPick] = useState(home);
  const [news, setNews] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useHoverIntent();
  const m = meta[pick]!;
  const formulas = [...new Set(meta.flatMap((x) => (x.formula ? [x.formula] : [])))];

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, pick]);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(""), 3000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const choose = (i: number, announce: boolean) => {
    setPick(i);
    setNews(announce);
    setCopied("");
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const from = Math.max(0, btns.current.indexOf(e.currentTarget));
    const last = rows.length - 1;
    const to =
      e.key === "ArrowDown" ? Math.min(last, from + 1)
      : e.key === "ArrowUp" ? Math.max(0, from - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : e.key === "Escape" ? home
      : null;
    if (to === null) return;
    e.preventDefault();
    choose(to, true);
    btns.current[to]?.focus();
  };
  const copy = async () => {
    if (!m.formula) return;
    try {
      await navigator.clipboard.writeText(m.formula);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };
  const colored = (f: string) =>
    f.split(/\b([A-O]5)\b/).map((part, i) =>
      i % 2 ? (
        <b key={i} data-ref={refsOf(f).indexOf(part[0]!)}>
          {part}
        </b>
      ) : (
        part
      ),
    );

  return (
    <div className={cx("sheet", s.trace)} data-hover-scope="">
      <div className="sheet-bar">
        <span className="sheet-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>System tab, row 5</span>
      </div>
      <div className={s.top}>
        <div className={s.fbar}>
          <span className={s.name}>{m.name}</span>
          <span className={s.fx} aria-hidden="true">
            fx
          </span>
          <code className={s.formula}>
            {formulas.map((f) => (
              <span key={f} data-on={f === m.formula ? "" : undefined}>
                {colored(f)}
              </span>
            ))}
            <span className={s.none} data-on={m.formula ? undefined : ""}>
              No formula given
            </span>
          </code>
          <button type="button" className={cx("btn btn-outline btn-sm", s.copy)} disabled={!m.formula} onClick={copy}>
            <Copy size={16} aria-hidden="true" />
            <span className={s.copyText}>Copy formula</span>
          </button>
        </div>
      </div>
      <p className={s.readout}>
        {meta.map((x, i) => (
          <span key={i} data-on={i === pick ? "" : undefined}>
            {x.say}
          </span>
        ))}
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {news ? m.say : ""}
      </p>
      <p className="sr-only" role="status">
        {copied === "ok" ? "Formula copied" : copied === "fail" ? "Copy did not work. Select the formula and copy it." : ""}
      </p>
      <table className={s.table} role="table">
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
          {rows.map((r, i) => {
            const ref = i === pick ? -1 : m.refs.findIndex((l) => meta[i]!.letters.includes(l));
            return (
              <tr
                key={i}
                role="row"
                data-on={i === pick ? "" : undefined}
                data-ref={ref >= 0 ? ref : undefined}
                onPointerEnter={(e) => hover.enter(e, () => (i === pick ? false : choose(i, false)))}
                onPointerMove={hover.move}
                onPointerLeave={hover.leave}
              >
                <td role="cell" data-label={head[0]}>
                  <button
                    type="button"
                    ref={(el) => {
                      btns.current[i] = el;
                    }}
                    className={s.pick}
                    tabIndex={i === pick ? 0 : -1}
                    aria-pressed={i === pick}
                    onClick={() => choose(i, true)}
                    onKeyDown={onKey}
                  >
                    <span className={s.chip} aria-hidden="true">
                      {ref >= 0 ? m.refs[ref] : ""}
                    </span>
                    <span>{r.cells[0]}</span>
                  </button>
                </td>
                {r.cells.slice(1).map((c, j) => (
                  <td key={j} role="cell" data-label={head[j + 1]}>
                    {c}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
