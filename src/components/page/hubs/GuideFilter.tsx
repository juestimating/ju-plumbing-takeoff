"use client";

import { useId, useState, type ReactNode } from "react";
import s from "./guides-hub.module.css";

export type FilterChip = { key: string; label: string; count: number };

/**
 * The guide shelf's type filter: toggle buttons in a labelled group. A click shows one type (CSS hides the other cards,
 * so screen readers match what is shown); clicking the pressed type or "All" shows every guide again. A resting mouse
 * only previews (CSS fades the other types; the grid never moves). The count line is a polite live region and changes
 * on clicks only. Without JS every guide stays visible.
 */
export function GuideFilter({ chips, total, head, children }: { chips: FilterChip[]; total: number; head: ReactNode; children: ReactNode }) {
  const [on, setOn] = useState("all");
  const showId = useId();
  const picked = chips.find((c) => c.key === on && c.key !== "all");
  const line = picked ? `Showing ${picked.count} of ${total} guides: ${picked.label}` : `Showing all ${total} guides`;
  return (
    <div className={s.shelf} data-filter={on}>
      <div className={s.top}>
        {head}
        <div className={s.filter}>
          <p id={showId} className={s.show}>
            Show
          </p>
          <div role="group" aria-labelledby={showId} className={s.chips}>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                className={s.chip}
                data-k={c.key}
                aria-pressed={on === c.key}
                onClick={() => setOn(c.key === "all" || c.key === on ? "all" : c.key)}
              >
                {c.label} <span className={s.count}>{c.count}</span>
              </button>
            ))}
          </div>
          <p className={s.live} aria-live="polite">
            {line}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
