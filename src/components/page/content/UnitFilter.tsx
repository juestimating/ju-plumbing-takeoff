"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CountUp } from "@/components/interactive/CountUp";
import { useHoverIntent } from "@/components/interactive/useTabs";
import s from "./scope.module.css";

const NEWS_MS = 5000; // how long an announcement stays in the live region (home demo value)

export type UnitOption = { value: string; label: string; desc?: string; n: number };

/**
 * The scope board's count and unit filter: native radios as chips (All, then each unit with what it means as its
 * description). Resting the mouse on a chip checks it, as a click, a tap or the arrow keys do. The checked radio is the
 * only state the board reads: CSS :has() shows its count ("n of N line items", every count stacked in one cell, so a
 * pick moves nothing) and dims the rows it leaves out, so a pick made before hydration still shows right. The polite
 * live region speaks after a click, tap or key only.
 */
export function UnitFilter({ name, ask, total, label, of, options }: { name: string; ask: string; total: number; label: string; of: string; options: UnitOption[] }) {
  const hover = useHoverIntent();
  const id = useId();
  const radios = useRef<(HTMLInputElement | null)[]>([]);
  const [said, setSaid] = useState<number | null>(null); // the last click, tap or key pick, for the live region
  const counts = options.map((o, i) => (i === 0 ? `${total} ${label}` : `${o.n} ${of} ${total} ${label}`));

  useEffect(() => {
    if (said === null) return;
    const t = window.setTimeout(() => setSaid(null), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [said]);

  return (
    <>
      <p className={s.total}>
        {options.map((o, i) => (
          <span key={o.value} className={s.v} data-for={o.value}>
            <span className={s.n}>{i === 0 ? <CountUp value={total} /> : o.n}</span> {i === 0 ? label : `${of} ${total} ${label}`}
          </span>
        ))}
      </p>
      <div className={s.filter}>
        <p id={`${id}-ask`} className={s.ask}>
          {ask}
        </p>
        <div className={s.chips} role="radiogroup" aria-labelledby={`${id}-ask`}>
          {options.map((o, i) => (
            <label
              key={o.value}
              className={s.chip}
              onPointerEnter={(e) => {
                if (radios.current[i]?.checked) return hover.leave();
                hover.enter(e, () => {
                  const r = radios.current[i];
                  if (!r || r.checked) return false;
                  r.checked = true; // silent: no change event, so nothing is announced
                  setSaid(null);
                });
              }}
              onPointerMove={hover.move}
              onPointerLeave={hover.leave}
            >
              <input
                ref={(el) => {
                  radios.current[i] = el;
                }}
                className="sr-only"
                type="radio"
                name={name}
                value={o.value}
                defaultChecked={i === 0}
                onChange={() => setSaid(i)}
                aria-describedby={o.desc ? `${id}-${i}` : undefined}
              />
              <span className={s.code}>{o.label}</span>
              {o.desc && (
                <span id={`${id}-${i}`} className={s.desc} aria-hidden="true">
                  {o.desc}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {said === null ? "" : counts[said]}
      </p>
    </>
  );
}
