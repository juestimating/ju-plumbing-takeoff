"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useHoverIntent } from "@/components/interactive/useTabs";
import { cx } from "@/lib/utils";
import s from "./compare.module.css";

const NEWS_MS = 5000; // how long an announcement stays in the live region (home demo value)

/**
 * One pick among the cards below, as native radios. look "switch": "How often do you bid?" in the home segmented look
 * with no default pick (no bias). look "range": the low, likely and high markers on a line, Likely checked, and resting
 * the mouse on a marker checks it too (hover intent). The checked radio is the only state the view reads: CSS :has()
 * rings the matching card and shows that card's own line under the control, beside the route for that pick (`routes`,
 * `rest` before any pick) or a shared next step (`next`), so a pick made before hydration still shows right. Lines and
 * routes are stacked in one cell each, so nothing below moves. The polite live region speaks after a click, tap or key,
 * never after a hover.
 */
export function CompareFit({
  name, question, hint, options, lines, routes, rest, next, initial, look = "switch", children,
}: {
  name: string;
  question: string;
  hint?: string;
  options: string[];
  lines: string[];
  routes?: ReactNode[];
  rest?: ReactNode;
  next?: ReactNode;
  initial?: number;
  look?: "switch" | "range";
  children: ReactNode;
}) {
  const [said, setSaid] = useState<number | null>(null); // the last click, tap or key pick, for the live region
  const hover = useHoverIntent();
  const askId = useId();
  const radios = useRef<(HTMLInputElement | null)[]>([]);
  const range = look === "range";

  useEffect(() => {
    if (said === null) return;
    const t = window.setTimeout(() => setSaid(null), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [said]);

  return (
    <div className={s.fit} data-look={look}>
      <div className={s.switchRow}>
        <p id={askId} className={s.ask}>
          {question}
        </p>
        <div className={range ? s.marks : cx(s.toggle, s.three)} role="radiogroup" aria-labelledby={askId}>
          {!range && <span className={s.thumb} aria-hidden="true" />}
          {options.map((o, i) => (
            <label
              key={o}
              className={range ? s.mark : s.seg}
              onPointerEnter={
                range
                  ? (e) => {
                      if (radios.current[i]?.checked) return hover.leave();
                      hover.enter(e, () => {
                        const r = radios.current[i];
                        if (!r || r.checked) return false;
                        r.checked = true; // silent: no change event, so nothing is announced
                        setSaid(null);
                      });
                    }
                  : undefined
              }
              onPointerMove={range ? hover.move : undefined}
              onPointerLeave={range ? hover.leave : undefined}
            >
              <input
                ref={(el) => {
                  radios.current[i] = el;
                }}
                className="sr-only"
                type="radio"
                name={name}
                value={i}
                defaultChecked={i === initial}
                onChange={() => setSaid(i)}
              />
              {range && <i className={s.dot} aria-hidden="true" />}
              {o}
            </label>
          ))}
        </div>
      </div>
      <div className={s.sayRow}>
        <p className={s.say}>
          {hint !== undefined && <span data-i="none">{hint}</span>}
          {lines.map((l, i) => (
            <span key={l} data-i={i}>
              {l}
            </span>
          ))}
        </p>
        {next && <div className={s.next}>{next}</div>}
        {routes && (
          <div className={s.routes}>
            {rest && <div data-i="none">{rest}</div>}
            {routes.map((r, i) => (
              <div key={i} data-i={i}>
                {r}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {said === null ? "" : lines[said]}
      </p>
      {children}
    </div>
  );
}
