"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useTabs } from "@/components/interactive/useTabs";
import s from "./hero.module.css";

/** Rotation interval. The progress bar along the card's bottom edge runs for the same time. */
const AUTO_MS = 6500;

/**
 * The hero's interactive island: the project-type chips (tabs) and the showcase card they drive. It returns the two
 * as siblings, so they sit straight in the hero grid between the server-rendered copy and buttons. Panels are
 * server-rendered and passed in, so only the tab logic ships to the browser.
 * Every panel stays in the DOM and they stack in one grid cell: inactive ones are inert and invisible (instead of
 * `hidden`), so the card keeps the height of its tallest panel, panels can crossfade and a rotation never moves
 * the page below.
 */
export function HeroShowcase({ ask, tabs, panels }: { ask: string; tabs: { label: string; icon: ReactNode }[]; panels: ReactNode[] }) {
  // Rotation also waits while the card is scrolled out of view, so nothing animates off screen.
  const stage = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!(e?.isIntersecting ?? true)));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const t = useTabs(tabs.length, { autoMs: AUTO_MS, paused: offscreen });
  const askId = useId();

  return (
    <>
      <div className={s.pick}>
        <p id={askId} className={s.ask}>
          {ask}
        </p>
        <div {...t.tablistProps} aria-labelledby={askId} className={s.chips} {...t.rootProps}>
          {tabs.map((tab, i) => (
            <button key={tab.label} {...t.getTabProps(i)} className={s.chip}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={s.stage} ref={stage}>
        <div className={s.card} {...t.rootProps}>
          {t.canRotate && (
            <button
              type="button"
              className={s.pause}
              onClick={t.togglePause}
              aria-label={t.userPaused ? "Play the project examples" : "Pause the project examples"}
            >
              {t.userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            </button>
          )}
          <div className={s.panels}>
            {panels.map((panel, i) => {
              const { hidden, ...panelProps } = t.getPanelProps(i);
              return (
                <div key={tabs[i]?.label ?? i} {...panelProps} inert={hidden} data-on={hidden ? undefined : ""} className={s.panel}>
                  {panel}
                </div>
              );
            })}
          </div>
          <div className={s.progress} aria-hidden="true">
            <span key={`${t.active}-${t.rotating}`} data-run={t.rotating ? "" : undefined} style={{ animationDuration: `${AUTO_MS}ms` }} />
          </div>
        </div>
      </div>
    </>
  );
}
