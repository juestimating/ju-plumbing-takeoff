"use client";

import { useEffect, useRef } from "react";

/**
 * Scrolls the switcher's chip row (its parent's list) so the current page's chip sits in the middle, once on mount.
 * Chrome does it in CSS (scroll-initial-target); this covers the rest. The row scrolls, never the page.
 */
export function CenterCurrent() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const row = ref.current?.parentElement?.querySelector("ul");
    const cur = row?.querySelector<HTMLElement>("[aria-current]");
    if (!row || !cur || row.scrollWidth <= row.clientWidth) return;
    const c = cur.getBoundingClientRect();
    row.scrollLeft += c.left - row.getBoundingClientRect().left - (row.clientWidth - c.width) / 2;
  }, []);
  return <span ref={ref} hidden />;
}
