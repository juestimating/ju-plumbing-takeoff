"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import type { SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";
import { useHoverIntent, useTabs } from "./useTabs";
import s from "./hover-tabs.module.css";

export type HoverTabItem = {
  /** Unique. */
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Number badge, e.g. "01" (decorative: the tab's position is announced anyway). */
  num?: string;
  /** Tints the icon tile in the system color. */
  color?: SystemColor;
  /** Small extra on its own line under the label (a price badge), so every row lines up. */
  aside?: ReactNode;
  /** Server-rendered; every panel stays in the HTML. */
  panel: ReactNode;
};

export type HoverTabsProps = {
  items: HoverTabItem[];
  /** The tablist's accessible name when there is no visible `ask`. */
  label: string;
  /** Visible question above the tabs; the tablist is labelled by it. */
  ask?: string;
  /** vertical: a list beside the card from 1024px, a sideways chip row below. horizontal: wrapping chips above the card. */
  orientation?: "vertical" | "horizontal";
  /** Width below which a vertical list becomes the chip row: 1024 (default) or 0 (a vertical list at every width,
   *  stacked above the card below 1024px). Other values are not styled. */
  chipsBelow?: 0 | 1024;
  /** Width from which a vertical list sits beside the card: 1024 (default) or 900. 900 applies only with chipsBelow 0
   *  (the stacked list below it); ponytail: add a 900px chip-row breakpoint if a chip-row user ever needs it. */
  sideFrom?: 900 | 1024;
  tone?: "light" | "dark";
  initial?: number;
  className?: string;
  panelClassName?: string;
};

const NEWS_MS = 5000; // how long an announcement stays in the live region (so browse mode reads it once)

/**
 * Hover-intent tabs, generalized from the home system explorer. Resting the mouse on a tab opens it, as a click, a tap
 * or the arrow keys do (Up/Down too when vertical, Home/End). Every panel is in the HTML and they stack in one grid
 * cell: inactive ones are inert and invisible, so the card keeps its tallest panel's height and a pick never moves
 * the page. Only clicks, taps and keys reach the live region; hover picks change the view silently.
 * The root is its own hover scope: a keyboard user working inside it is never overridden by a resting mouse.
 * Styling hooks for families: `className` on the root (--ht-list sets the list column width), `[role="tab"]`,
 * `[data-ht-card]` (the frame around the panels) and `panelClassName` on every panel.
 */
export function HoverTabs({
  items, label, ask, orientation = "vertical", chipsBelow = 1024, sideFrom = 1024, tone = "light", initial = 0, className,
  panelClassName,
}: HoverTabsProps) {
  const vertical = orientation === "vertical";
  const { active, select, tablistProps, getTabProps, getPanelProps } = useTabs(items.length, { vertical, initial });
  const hover = useHoverIntent();
  const askId = useId();
  const row = useRef<HTMLDivElement>(null);
  const byHover = useRef(false);
  const [news, setNews] = useState(false); // the last pick was a click, tap or key: say it in the live region
  const keys = vertical ? ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"] : ["ArrowLeft", "ArrowRight", "Home", "End"];

  // Chip row only: slide the picked chip toward the middle of the row. Scrolls the row sideways, never the page.
  // Not for a hover pick: the chip is already under the pointer, and sliding it away would be disorienting.
  useEffect(() => {
    if (byHover.current) {
      byHover.current = false;
      return;
    }
    const el = row.current;
    const tab = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !tab || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2 });
  }, [active]);

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, active]);

  const pick = (i: number) => {
    setNews(true);
    select(i);
  };
  const hoverPick = (i: number) => {
    byHover.current = true;
    setNews(false);
    select(i);
  };

  const name = ask ? { "aria-labelledby": askId } : { "aria-label": label };

  return (
    <div
      className={cx(s.root, "hr-reveal", className)}
      style={{ "--ht-n": items.length } as CSSProperties}
      data-orient={orientation}
      data-tone={tone}
      data-chips={vertical && chipsBelow === 0 ? "0" : undefined}
      data-side={vertical && chipsBelow === 0 && sideFrom === 900 ? "900" : undefined}
      data-hover-scope=""
    >
      {ask && (
        <p id={askId} className={s.ask}>
          {ask}
        </p>
      )}
      <div {...tablistProps} {...name} ref={row} className={s.tabs}>
        {items.map((it, i) => {
          const tab = getTabProps(i);
          return (
            <button
              key={it.key}
              {...tab}
              className={s.tab}
              data-c={it.color}
              onClick={() => pick(i)}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                if (keys.includes(e.key)) setNews(true);
                tab.onKeyDown(e);
              }}
              onPointerEnter={(e) => {
                if (i === active) return hover.leave();
                hover.enter(e, () => hoverPick(i));
              }}
              onPointerMove={hover.move}
              onPointerLeave={hover.leave}
            >
              {it.num && (
                <span className={s.num} aria-hidden="true">
                  {it.num}
                </span>
              )}
              {it.icon && <span className={s.tabIcon}>{it.icon}</span>}
              <span className={s.text}>
                <span className={s.tabLabel}>{it.label}</span>
                {it.aside && <span className={s.aside}>{it.aside}</span>}
              </span>
              {vertical && <span className={s.tabArrow} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className={s.card} data-ht-card="">
        <div className={s.panels}>
          {items.map((it, i) => {
            const { hidden, ...panel } = getPanelProps(i);
            return (
              <div key={it.key} {...panel} inert={hidden} className={cx(s.panel, panelClassName)}>
                {it.panel}
              </div>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {news ? items[active]?.label : ""}
      </p>
    </div>
  );
}
