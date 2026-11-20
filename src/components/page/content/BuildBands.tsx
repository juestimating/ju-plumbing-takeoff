"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useHoverIntent } from "@/components/interactive/useTabs";
import s from "./piperun.module.css";

const NEWS_MS = 5000; // how long an announcement stays in the live region (home demo value)

/**
 * The estimate build's stack of bands as toggle buttons (aria-pressed), bottom to top. Resting the mouse on a band, a
 * click, a tap or Enter picks it: the band rings and its step card beside it lights (CSS :has() in PipeRun's module);
 * a click on the picked band lets it go, except the first mouse click on a band a hover pick lit: the visitor came to
 * click it, however long they took, so it confirms instead (and is announced). The polite live region names the step
 * after a click, tap or key only.
 */
export function BuildBands({ ask, bands, steps, caption }: { ask: string; bands: string[]; steps: string[]; caption: string }) {
  const hover = useHoverIntent();
  const askId = useId();
  const [sel, setSel] = useState<number | null>(null);
  const [news, setNews] = useState(false);
  const hoverPicked = useRef<number | null>(null); // the band the last hover pick lit

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, sel]);

  return (
    <div className={s.stack}>
      <p id={askId} className={s.ask}>
        {ask}
      </p>
      <div role="group" aria-labelledby={askId}>
        <ol className={s.bands}>
          {bands.map((x, i) => (
            <li key={x}>
              <button
                type="button"
                className={s.band}
                aria-pressed={sel === i}
                onClick={(e) => {
                  // detail is 0 for Enter and Space
                  const confirm = e.detail > 0 && hoverPicked.current === i && sel === i;
                  hoverPicked.current = null;
                  const next = confirm || sel !== i ? i : null;
                  setSel(next);
                  setNews(next !== null);
                }}
                onPointerEnter={(e) => {
                  if (i === sel) return hover.leave();
                  hover.enter(e, () => {
                    hoverPicked.current = i;
                    setSel(i);
                    setNews(false);
                  });
                }}
                onPointerMove={hover.move}
                onPointerLeave={hover.leave}
              >
                {x}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className={s.cap}>{caption}</p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {news && sel !== null ? steps[sel] : ""}
      </p>
    </div>
  );
}
