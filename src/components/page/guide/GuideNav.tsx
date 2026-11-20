"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import type { SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./nav.module.css";

export type TocItem = { id: string; text: string; systems?: SystemColor[]; children?: { id: string; text: string }[] };
type Count = { done: number; total: number };

const subscribe = () => () => {};
/** Bar height under the header below 1024px (nav.module.css .sum), for the "which section is this" line. */
const BAR_H = 56;

const timeLeft = (minutes: number, p: number) => {
  if (p <= 0) return `${minutes} min read`;
  if (p >= 0.985) return "End of the guide";
  const n = Math.ceil(minutes * (1 - p));
  return n <= 1 ? "1 min left" : `${n} min left`;
};

/**
 * The guide's reading navigator, one instance: a sticky rail from 1024px (riser progress, a node per h2, minutes left;
 * no h3 sub-lists, so its height never changes while reading and the card under it stays put) and a sticky disclosure
 * bar below (details.toc-m, the only non-FAQ details on the page; it lists the h3s too). Every link is in the server
 * HTML. The active section is the last heading whose top passed the header, the bar and a quarter of the screen. On
 * the checklist guides it also keeps the tick boxes (TickLi in the article): counts per section, saved in this browser
 * under `ticks.key` (the key carries the guide's date, so an edited checklist starts fresh). The tick total and Clear
 * sit in the rail head and at the top of the phone panel, never under the card or below the panel's fold.
 */
export function GuideNav({ items, minutes, ticks }: { items: TocItem[]; minutes: number; ticks?: { key: string } }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDetailsElement>(null);
  const clearAll = useRef<(() => void) | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [time, setTime] = useState(`${minutes} min read`);
  const [counts, setCounts] = useState<Record<string, Count> | null>(null);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const tickKey = ticks?.key;

  // Scroll position: one passive listener, one read per frame. --p (0 to 1 through the article) drives the fills.
  useEffect(() => {
    const el = root.current;
    const article = document.querySelector<HTMLElement>("[data-guide-article]");
    if (!el || !article) return;
    const ids = items.flatMap((it) => [it.id, ...(it.children ?? []).map((c) => c.id)]);
    const heads = ids.map((id) => document.getElementById(id));
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
    let raf = 0;
    const run = () => {
      raf = 0;
      const vh = window.innerHeight;
      const line = headerH + (window.innerWidth < 1024 ? BAR_H : 0) + vh * 0.25;
      let at: string | null = null;
      for (let i = 0; i < heads.length; i++) {
        const h = heads[i];
        if (!h) continue;
        if (h.getBoundingClientRect().top > line) break;
        at = ids[i]!;
      }
      const r = article.getBoundingClientRect();
      const span = r.height - (vh - headerH);
      const p = span > 0 ? Math.min(1, Math.max(0, (headerH - r.top) / span)) : 1;
      el.style.setProperty("--p", p.toFixed(4));
      setActiveId(at);
      setTime(timeLeft(minutes, p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, minutes]);

  const h2At = items.findIndex((it) => it.id === activeId || it.children?.some((c) => c.id === activeId));
  const railId = h2At >= 0 ? items[h2At]!.id : null;

  // On a short screen only the rail's list scrolls (the head and the card stay put); it follows the active link
  // itself, never the page.
  useEffect(() => {
    const box = list.current;
    const link = railId ? box?.querySelector<HTMLElement>(`a[href="#${railId}"]`) : null;
    if (!box || !link || box.scrollHeight <= box.clientHeight) return;
    const b = box.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    if (l.top < b.top + 12) box.scrollTop -= b.top + 12 - l.top;
    else if (l.bottom > b.bottom - 12) box.scrollTop += l.bottom - b.bottom + 12;
  }, [railId]);

  // Tick boxes: key each by its section and position, restore, count, save on every change.
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-guide-article]");
    if (!tickKey || !article) return;
    const boxes: { box: HTMLInputElement; key: string; h2: string }[] = [];
    let h2 = "";
    let n = 0;
    for (const el of article.querySelectorAll<HTMLElement>("h2[id], input[data-tick]")) {
      if (el instanceof HTMLInputElement) boxes.push({ box: el, key: `${h2}:${++n}`, h2 });
      else [h2, n] = [el.id, 0];
    }
    let saved: unknown = [];
    try {
      saved = JSON.parse(localStorage.getItem(tickKey) ?? "[]");
    } catch {
      // no storage (private window, blocked): ticks still work on screen, nothing is kept
    }
    const keep = new Set(Array.isArray(saved) ? saved : []);
    // a box ticked before the page finished loading stays ticked
    for (const b of boxes) if (keep.has(b.key)) b.box.checked = true;
    const save = () => {
      const next: Record<string, Count> = {};
      for (const b of boxes) {
        const c = (next[b.h2] ??= { done: 0, total: 0 });
        c.total++;
        if (b.box.checked) c.done++;
      }
      setCounts(next);
      try {
        localStorage.setItem(tickKey, JSON.stringify(boxes.filter((b) => b.box.checked).map((b) => b.key)));
      } catch {
        // as above
      }
    };
    const onChange = (e: Event) => {
      if (e.target instanceof HTMLInputElement && e.target.hasAttribute("data-tick")) save();
    };
    article.addEventListener("change", onChange);
    clearAll.current = () => {
      for (const b of boxes) b.box.checked = false;
      save();
    };
    const raf = requestAnimationFrame(save);
    return () => {
      cancelAnimationFrame(raf);
      article.removeEventListener("change", onChange);
      clearAll.current = null;
    };
  }, [tickKey]);

  useEffect(() => {
    if (!status) return;
    const t = window.setTimeout(() => setStatus(""), 4000);
    return () => window.clearTimeout(t);
  }, [status]);

  // The open phone panel closes on a press outside the bar.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const d = bar.current;
      if (d && !d.contains(e.target as Node)) d.open = false;
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const all = counts ? Object.values(counts).reduce((a, c) => ({ done: a.done + c.done, total: a.total + c.total }), { done: 0, total: 0 }) : null;
  const clear = () => {
    clearAll.current?.();
    setStatus("Ticks cleared");
  };
  const closeBar = () => {
    if (bar.current) bar.current.open = false;
  };
  const onBarKey = (e: KeyboardEvent<HTMLDetailsElement>) => {
    if (e.key !== "Escape" || !e.currentTarget.open) return;
    e.currentTarget.open = false;
    e.currentTarget.querySelector("summary")?.focus();
  };
  const tickBlock = ticks && (
    <div className={s.ticks}>
      <p className={s.tickSum}>{all ? `${all.done} of ${all.total} checked` : ""}</p>
      <button type="button" className={s.clear} disabled={!all?.done} onClick={clear}>
        Clear ticks
      </button>
      <p className={s.tickNote}>Ticks stay in this browser only.</p>
    </div>
  );
  const countOf = (id: string, cls: string) => {
    const c = counts?.[id];
    return (
      <span className={cls} data-done={c && c.done === c.total ? "" : undefined}>
        {c && (
          <>
            <span aria-hidden="true">
              {c.done}/{c.total}
            </span>
            <span className="sr-only">
              {c.done} of {c.total} checked
            </span>
          </>
        )}
      </span>
    );
  };

  return (
    <div ref={root} className={s.nav} data-js={hydrated ? "" : undefined}>
      <nav className={s.rail} aria-label="On this page" data-rail>
        <div className={s.head}>
          <span className={s.label}>On this page</span>
          <span className={s.time}>{time}</span>
          {tickBlock}
        </div>
        <div ref={list} className={s.scroll}>
          <div className={s.track}>
            <span className={s.fill} aria-hidden="true" />
            <ol className={s.list} role="list">
              {items.map((it, i) => (
                <li key={it.id} className={s.item} data-on={i === h2At ? "" : undefined} data-passed={i < h2At ? "" : undefined}>
                  <a className={s.link} href={`#${it.id}`} aria-current={i === h2At ? "location" : undefined}>
                    {it.text}
                    {it.systems && (
                      <span className={s.sys} aria-hidden="true">
                        {it.systems.map((c) => (
                          <i key={c} className="legend-line" data-c={c} />
                        ))}
                      </span>
                    )}
                  </a>
                  {ticks && countOf(it.id, s.count)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      <nav className={s.barNav} aria-label="On this page">
        <details ref={bar} className={cx("toc-m", s.bar)} data-toc="guide" onToggle={(e) => setOpen(e.currentTarget.open)} onKeyDown={onBarKey}>
          <summary className={s.sum}>
            <span className={s.lab}>
              On this page<span aria-hidden="true"> · </span>
              {time}
            </span>
            <span className={s.cur}>{h2At >= 0 ? items[h2At]!.text : `${items.length} sections`}</span>
            {ticks && (
              <span className={s.total}>
                {all && (
                  <>
                    <span aria-hidden="true">
                      {all.done}/{all.total}
                    </span>
                    <span className="sr-only">
                      {all.done} of {all.total} checked
                    </span>
                  </>
                )}
              </span>
            )}
            <span className={s.chev} aria-hidden="true" />
            <span className={s.line} aria-hidden="true" />
          </summary>
          <div className={s.panel}>
            {tickBlock}
            <ol className={s.plist} role="list">
              {items.map((it, i) => (
                <li key={it.id}>
                  <div className={s.prow}>
                    <a className={s.plink} href={`#${it.id}`} onClick={closeBar} data-on={i === h2At ? "" : undefined} aria-current={activeId === it.id ? "location" : undefined}>
                      {it.text}
                    </a>
                    {ticks && countOf(it.id, s.pcount)}
                  </div>
                  {it.children && (
                    <ol className={s.psub} role="list">
                      {it.children.map((c) => (
                        <li key={c.id}>
                          <a className={s.plink} href={`#${c.id}`} onClick={closeBar} aria-current={activeId === c.id ? "location" : undefined}>
                            {c.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </details>
      </nav>
      <p className="sr-only" role="status">
        {status}
      </p>
    </div>
  );
}
