"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { SystemColor } from "@/content/types";
import { useHoverIntent, useTabs } from "@/components/interactive/useTabs";
import s from "./systems.module.css";

type Item = { key: string; label: string; color: SystemColor; icon: ReactNode; media: ReactNode; panel: ReactNode };

/**
 * The system explorer's interactive island: a vertical tab list beside the panel on desktop, the same buttons as a
 * sideways-scrolling chip row below 1024px. Resting the mouse on a system opens it, as a click or tap does.
 * Up/Down and Left/Right both move. No auto-rotation.
 * Every panel's text stays in the HTML; only the open panel mounts its drawing (`media`), in the same render that
 * shows the panel, so the box never jumps and the drawing's draw-in plays as it mounts.
 */
export function SystemTabs({ items }: { items: Item[] }) {
  const { active, select, tablistProps, getTabProps, getPanelProps } = useTabs(items.length, { vertical: true });
  const hover = useHoverIntent();
  const row = useRef<HTMLDivElement>(null);
  const byHover = useRef(false);

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

  return (
    <div className={`${s.explorer} hr-reveal`}>
      <div {...tablistProps} aria-label="Plumbing systems" ref={row} className={s.tabs}>
        {items.map((it, i) => (
          <button
            key={it.key}
            {...getTabProps(i)}
            className={s.tab}
            data-c={it.color}
            onPointerEnter={(e) => {
              if (i === active) return hover.leave();
              hover.enter(e, () => {
                byHover.current = true;
                select(i);
              });
            }}
            onPointerMove={hover.move}
            onPointerLeave={hover.leave}
          >
            <span className={s.tabIcon}>{it.icon}</span>
            <span className={s.tabLabel}>{it.label}</span>
            <ArrowRight size={18} className={s.tabArrow} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={s.panels}>
        {items.map((it, i) => (
          <div key={it.key} {...getPanelProps(i)} className={s.panel}>
            <div className={s.body} data-c={it.color}>
              {i === active && it.media}
              {it.panel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
