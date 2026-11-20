"use client";

import { useId, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHoverIntent, useTabs } from "@/components/interactive/useTabs";
import s from "./workbook.module.css";

type Row = { item: string; qty: string; unit: string };
export type WorkbookView = {
  key: "takeoff" | "estimate" | "bid";
  tab: string;
  title: string;
  badge: string;
  line: string;
  href: string;
  link: string;
};

const BID_FORM = ["Scope letter", "Alternates", "Addenda checked", "Ready to sign"];

/** Hyphenated words ("hard-drawn", "LAV-1") stay whole, so a wrapped item never ends a line on a dash. */
const keep = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, k) =>
    k % 2 ? (
      <span key={k} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );

/**
 * The services hero card: one takeoff sheet shown as a takeoff (no prices, yours to price), an estimate (the Price
 * column fills, with no figures) or a bid package (a bid form slides over the sheet). The sheet tabs along its bottom
 * edge are the tablist: hover intent, a click, a tap or the arrow keys switch the view. Everything stays in place: the
 * extra estimate line and the bid form only turn visible, and the panels stack in one grid cell, so the card never
 * changes height. The sheet's words live here, so they reach the page once.
 */
export function WorkbookSwitch({ rows, extra, views, footer }: { rows: Row[]; extra: Row; views: WorkbookView[]; footer: ReactNode }) {
  const { active, select, tablistProps, getTabProps, getPanelProps } = useTabs(views.length);
  const hover = useHoverIntent();
  const askId = useId();
  const view = views[active]?.key ?? "takeoff";
  const price = (
    <>
      <span className={s.chip} aria-hidden="true">
        $
      </span>
      <span className="sr-only">{view === "takeoff" ? "No price" : "Priced"}</span>
    </>
  );
  const line = (r: Row, className?: string) => (
    <tr key={r.item} className={className}>
      <td>{keep(r.item)}</td>
      <td className={s.r}>{r.qty}</td>
      <td>{r.unit}</td>
      <td className={s.price}>{price}</td>
    </tr>
  );

  return (
    <div className={s.card} data-view={view} data-hover-scope="">
      <div className={s.top}>
        <p id={askId} className={s.ask}>
          What do you want back?
        </p>
        <div className={s.sheet}>
          <div className={s.bar}>
            <span className={s.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={s.file}>Plumbing bid.xlsx</span>
            <span className={s.tag}>Illustrative</span>
          </div>
          <div className={s.grid}>
            <table className={s.table}>
              <caption className="sr-only">
                Illustrative takeoff lines, shown as a takeoff, an estimate or a bid package. Figures are examples, not project data.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col" className={s.r}>
                    Qty
                  </th>
                  <th scope="col">Unit</th>
                  <th scope="col" className={s.price}>
                    Price
                    <span className={s.colTag} aria-hidden="true">
                      Yours to price
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => line(r))}
                {line(extra, s.extra)}
              </tbody>
            </table>
            <div className={s.overlay}>
              <p className={s.formTitle}>Bid form</p>
              <ul className={s.formChecks}>
                {BID_FORM.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div {...tablistProps} aria-labelledby={askId} className={s.tabs}>
            {views.map((v, i) => (
              <button
                key={v.key}
                {...getTabProps(i)}
                className={s.tab}
                onPointerEnter={(e) => {
                  if (i === active) return hover.leave();
                  hover.enter(e, () => select(i));
                }}
                onPointerMove={hover.move}
                onPointerLeave={hover.leave}
              >
                {v.tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={s.body}>
        <div className={s.panels}>
          {views.map((v, i) => {
            const { hidden, ...panel } = getPanelProps(i);
            return (
              <div key={v.key} {...panel} inert={hidden} className={s.panel}>
                <div className={s.titleRow}>
                  <p className={s.title}>{v.title}</p>
                  <span className="hr-badge">{v.badge}</span>
                </div>
                <p className={s.line}>{v.line}</p>
                <Link href={v.href} className={s.explore}>
                  {v.link}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
        <p className={s.foot}>{footer}</p>
      </div>
    </div>
  );
}
