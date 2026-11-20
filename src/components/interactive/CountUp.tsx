"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up the first time it scrolls into view. The server renders the final value once, so crawlers,
 * copy and paste, no-JS and reduced-motion visitors get the real figure. Only while the count runs is there a second,
 * screen-reader copy, and a hidden copy of the final value holds the width so the "+" never shifts.
 */
export function CountUp({ value, prefix = "", suffix = "", ms = 1200 }: { value: number; prefix?: string; suffix?: string; ms?: number }) {
  const [shown, setShown] = useState<number | null>(null); // null: settled on the final value
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / ms);
          if (t < 1) {
            setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
            raf = requestAnimationFrame(tick);
          } else {
            setShown(null);
          }
        };
        setShown(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, ms]);

  const final = `${prefix}${value.toLocaleString("en-US")}${suffix}`;
  return (
    <span ref={el} className="num" style={{ display: "inline-grid" }}>
      {shown === null ? (
        final
      ) : (
        <>
          <span aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden" }}>
            {final}
          </span>
          <span aria-hidden="true" style={{ gridArea: "1 / 1" }}>{`${prefix}${shown.toLocaleString("en-US")}${suffix}`}</span>
          <span className="sr-only">{final}</span>
        </>
      )}
    </span>
  );
}
