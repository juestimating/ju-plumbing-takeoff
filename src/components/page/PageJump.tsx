"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/utils";
import s from "./page-jump.module.css";

export type JumpItem = { id: string; label: string; count?: number };

/**
 * "On this page" links with scroll-spy. The links are server-rendered and work without JS; after mount an
 * IntersectionObserver marks the section being read (aria-current="location"). `bar`: a chip strip, sticky under the
 * header from 1024px with an optional `aside` (price, CTA; its [data-bar-price] part shows from 1440px, the aside from
 * 1280px, so every chip fits from 1024px), a static sideways-scrolling row below; it casts a shadow while stuck.
 * `rail`: a vertical list for a sticky side column. The strip scrolls its own row to the current chip, never the page.
 */
export function PageJump({
  items, label = "On this page", variant, aside, className,
}: { items: JumpItem[]; label?: string; variant: "bar" | "rail"; aside?: ReactNode; className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const sentinel = useRef<HTMLSpanElement>(null);
  const labelId = useId();
  const ids = items.map((it) => it.id).join(" ");

  // bar: stuck once the spot it starts from (a 1px sentinel just above it) has passed under the header; the CSS shows
  // a shadow then (from 1024px, where the bar is sticky). The root runs far below the viewport, so "below the header
  // line" always intersects and a jump (Home, End, an anchor) still flips the state.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < top), {
      rootMargin: `-${top}px 0px 100000px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const els = ids.split(" ").flatMap((id) => document.getElementById(id) ?? []);
    if (!els.length) return;
    // The current section is the last one whose top has passed 45% of the viewport. The observer only says when
    // something crossed the top 45% band; the rects decide, so a fast scroll that skipped a target still lands right.
    const io = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.45;
        let cur: string | null = null;
        for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
        setActive(cur);
      },
      { rootMargin: "0px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  useEffect(() => {
    const row = list.current;
    const a = active ? row?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active)}"]`) : null;
    if (!row || !a || row.scrollWidth <= row.clientWidth) return;
    const { offsetLeft: l, offsetWidth: w } = a;
    if (l >= row.scrollLeft && l + w <= row.scrollLeft + row.clientWidth) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: l - (row.clientWidth - w) / 2, behavior: smooth ? "smooth" : "auto" });
  }, [active]);

  return (
    <>
      {variant === "bar" && <span ref={sentinel} className={s.sentinel} aria-hidden="true" />}
      <nav
        className={cx(s.jump, s[variant], className)}
        aria-labelledby={labelId}
        data-jump={variant}
        data-stuck={stuck || undefined}
      >
        <div className={cx(variant === "bar" && "container-ju", s.in)}>
          <p id={labelId} className={s.label}>
            {label}
          </p>
          <ul ref={list} className={s.list} role="list">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  data-id={it.id}
                  className={s.link}
                  aria-current={active === it.id ? "location" : undefined}
                  onClick={() => setActive(it.id)}
                >
                  <span>{it.label}</span>
                  {it.count !== undefined && (
                    <>
                      {" "}
                      <span className={cx("hr-badge soft", s.count)}>{it.count}</span>
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>
          {aside && <div className={s.aside}>{aside}</div>}
        </div>
      </nav>
    </>
  );
}
