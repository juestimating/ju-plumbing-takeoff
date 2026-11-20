"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Hover that means it, for the sections that switch on hover as well as on click (the jQuery hoverIntent method):
 * the pointer is sampled every `interval` ms and `fn` runs once it moved less than `sensitivity` px between two
 * samples, so passing over a target on the way somewhere else (a diagonal from the list to the panel's buttons)
 * switches nothing. Guards, each for a case seen in testing:
 * - A target that slides under a still pointer (the page scrolled, a panel resized the list) waits for a real move.
 * - After a switch, a scroll or a press, and where the pointer is first seen, it must move AWAY px before anything
 *   arms, so a resting hand's twitch never picks what slid under it (no flip-flop if a switch moves the list).
 * - A mouse press cancels a pending pick, so a click is never followed by a late hover pick.
 * - Nothing switches while a keyboard user is working inside the widget's scope (it could hide their focused control):
 *   from a Tab or arrow key until the next mouse press or a deliberate mouse move. Scroll keys do not count. The scope
 *   is the target's closest `[data-hover-scope]`, `<section>` or `<header>` (a hero is a header, not a section).
 * Mouse only, never while a button is held: touch, pen, keyboard and screen readers keep using click.
 * One instance can serve a whole section, since the pointer is only ever over one target.
 */
export function useHoverIntent(interval = 80, sensitivity = 7) {
  const [hi] = useState(() => hoverIntent(interval, sensitivity));
  useEffect(() => {
    const capture = { capture: true, passive: true } as const;
    window.addEventListener("pointermove", hi.track, { passive: true });
    window.addEventListener("pointerdown", hi.pressed, capture);
    window.addEventListener("keydown", hi.key, capture);
    window.addEventListener("scroll", hi.scrolled, capture); // capture: the chip row and sheet tabs scroll too
    return () => {
      window.removeEventListener("pointermove", hi.track);
      window.removeEventListener("pointerdown", hi.pressed, capture);
      window.removeEventListener("keydown", hi.key, capture);
      window.removeEventListener("scroll", hi.scrolled, capture);
      hi.leave();
    };
  }, [hi]);
  return hi;
}

const AWAY = 12; // px (|dx| + |dy|): about a fifth of the smallest tab, more than any twitch
const MOUSE_AGAIN = 40; // px: a hand back on the mouse after keyboard navigation, not a knock of the desk
const NAV_KEYS = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];
/** At least d px (|dx| + |dy|) from the anchor (ax, ay); false while the anchor is unset (NaN). */
const moved = (x: number, y: number, ax: number, ay: number, d: number) => Math.abs(x - ax) + Math.abs(y - ay) >= d;

function hoverIntent(interval: number, sensitivity: number) {
  // x, y: pointer now; px, py: at the last sample; lx, ly: where it last really moved, page-wide (NaN until it has);
  // ax, ay: the AWAY anchor (NaN once the pointer has moved away); kbd: keyboard navigation since the last press or
  // deliberate mouse move, kx, ky: where the pointer was then; el, fn: the armed target and its pick, which returns
  // false when it changed nothing
  const s = {
    timer: 0, x: 0, y: 0, px: 0, py: 0, lx: NaN, ly: NaN, ax: NaN, ay: NaN, kbd: false, kx: NaN, ky: NaN,
    el: null as Element | null,
    fn: null as (() => boolean | void) | null,
  };
  const stop = () => {
    window.clearTimeout(s.timer);
    s.timer = 0;
  };
  const keyboardHere = () => {
    const f = document.activeElement;
    return s.kbd && !!f && f !== document.body && !!s.el?.closest("[data-hover-scope], section, header")?.contains(f);
  };
  const poll = () => {
    if (Math.abs(s.x - s.px) + Math.abs(s.y - s.py) < sensitivity) {
      const fn = s.fn;
      stop();
      if (!fn || keyboardHere()) return; // keyboard mode keeps it armed: a deliberate mouse move can still pick it
      s.fn = null;
      if (fn() === false) return;
      s.ax = s.x;
      s.ay = s.y;
    } else {
      s.px = s.x;
      s.py = s.y;
      s.timer = window.setTimeout(poll, interval);
    }
  };
  /** Start sampling once the pointer has really moved to (x, y), clear of the last switch or scroll. */
  const tryStart = (x: number, y: number) => {
    if (s.timer || !s.fn) return;
    if (Number.isNaN(s.lx) || (x === s.lx && y === s.ly)) return;
    if (!Number.isNaN(s.ax)) {
      if (!moved(x, y, s.ax, s.ay, AWAY)) return;
      s.ax = s.ay = NaN;
    }
    s.px = x;
    s.py = y;
    s.timer = window.setTimeout(poll, interval);
  };
  const ignore = (e: PointerEvent) => e.pointerType !== "mouse" || e.buttons !== 0;
  return {
    /** Window pointermove listener. React's handlers run on the document before it, so inside them lx, ly still
     *  hold the previous position: equal coordinates mean the pointer did not move. */
    track(e: globalThis.PointerEvent) {
      const x = e.clientX;
      const y = e.clientY;
      // first sight since mount: anchor here, since a scroll may already have slid a target under the pointer
      if (Number.isNaN(s.lx)) [s.ax, s.ay] = [x, y];
      else if (moved(x, y, s.ax, s.ay, AWAY)) s.ax = s.ay = NaN; // moved away, wherever it went
      if (s.kbd && Number.isNaN(s.kx)) [s.kx, s.ky] = [x, y];
      else if (s.kbd && moved(x, y, s.kx, s.ky, MOUSE_AGAIN)) s.kbd = false;
      s.lx = x;
      s.ly = y;
    },
    /** Window keydown listener: Tab and arrow keys mean a keyboard user (scroll keys, Shift or Escape do not). */
    key(e: globalThis.KeyboardEvent) {
      if (!NAV_KEYS.includes(e.key)) return;
      s.kbd = true;
      [s.kx, s.ky] = [s.lx, s.ly];
    },
    /** Window scroll listener: whatever is armed waits, and the pointer must move away before anything starts. */
    scrolled() {
      stop();
      [s.ax, s.ay] = [s.lx, s.ly];
    },
    /** Window pointerdown listener: a press cancels the pending pick and ends keyboard mode, and the pointer must
     *  move away before the next one, in case the click resized the layout under it. */
    pressed() {
      stop();
      s.fn = null;
      s.kbd = false;
      [s.ax, s.ay] = [s.lx, s.ly];
    },
    /** onPointerEnter (or a delegated pointerover) on a new target: arm `fn`, replacing whatever was armed. */
    enter(e: PointerEvent, fn: () => boolean | void) {
      stop();
      s.fn = null;
      if (ignore(e)) return;
      s.fn = fn;
      s.el = e.currentTarget as Element;
      s.x = e.clientX;
      s.y = e.clientY;
      tryStart(s.x, s.y);
    },
    /** onPointerMove on every target. */
    move(e: PointerEvent) {
      if (!s.fn || ignore(e)) return;
      tryStart(e.clientX, e.clientY);
      s.x = e.clientX;
      s.y = e.clientY;
    },
    /** onPointerLeave on every target. */
    leave() {
      stop();
      s.fn = null;
    },
  };
}

/**
 * Accessible tabs (WAI-ARIA tabs pattern) shared by the site's interactive sections.
 * Arrow keys move between tabs (Left/Right, and Up/Down when vertical), Home/End jump to the ends,
 * and selection follows focus. Optional auto-rotation (`autoMs`) never runs under prefers-reduced-motion,
 * pauses while the pointer or focus is inside `rootProps`, while the tab is hidden, or when `paused` is set,
 * and stops for good once the visitor picks a tab. `panelIds` gives panels their own ids (a panel that holds a
 * section other pages link to keeps that section's id); the default ids are generated.
 */
export function useTabs(
  count: number,
  opts: { autoMs?: number; vertical?: boolean; initial?: number; paused?: boolean; panelIds?: string[] } = {},
) {
  const { autoMs = 0, vertical = false, initial = 0, paused = false, panelIds } = opts;
  const base = useId();
  const [active, setActive] = useState(initial);
  const [hover, setHover] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(true); // assume reduced until the client says otherwise: no rotation during SSR
  const [hidden, setHidden] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(m.matches);
    sync();
    m.addEventListener("change", sync);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      m.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const canRotate = autoMs > 0 && !reduced && !stopped;
  const rotating = canRotate && !hover && !hidden && !userPaused && !paused;

  useEffect(() => {
    if (!rotating) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % count), autoMs);
    return () => window.clearTimeout(t);
  }, [rotating, active, autoMs, count]);

  const select = useCallback((i: number, focus = false) => {
    setActive(i);
    setStopped(true);
    if (focus) tabs.current[i]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      const prev = vertical ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft"];
      const next = vertical ? ["ArrowDown", "ArrowRight"] : ["ArrowRight"];
      // from the tab that has focus: a hover pick can move the selection while focus stays where it was
      const at = tabs.current.indexOf(e.currentTarget);
      const from = at < 0 ? active : at;
      let to: number | null = null;
      if (next.includes(e.key)) to = (from + 1) % count;
      else if (prev.includes(e.key)) to = (from - 1 + count) % count;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = count - 1;
      if (to === null) return;
      e.preventDefault();
      select(to, true);
    },
    [active, count, select, vertical],
  );

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = (i: number) => panelIds?.[i] ?? `${base}-panel-${i}`;

  return {
    active,
    select,
    /** True while the auto-rotation timer is running (drive a progress bar with it; restart its animation on `active`). */
    rotating,
    /** True when auto-rotation is possible at all (show a pause/play control only then). */
    canRotate,
    userPaused,
    togglePause: () => setUserPaused((p) => !p),
    tablistProps: { role: "tablist" as const, "aria-orientation": vertical ? ("vertical" as const) : ("horizontal" as const) },
    getTabProps: (i: number) => ({
      ref: (el: HTMLButtonElement | null) => {
        tabs.current[i] = el;
      },
      type: "button" as const,
      role: "tab" as const,
      id: tabId(i),
      "aria-selected": active === i,
      "aria-controls": panelId(i),
      tabIndex: active === i ? 0 : -1,
      onClick: () => select(i),
      onKeyDown,
    }),
    getPanelProps: (i: number) => ({
      role: "tabpanel" as const,
      id: panelId(i),
      "aria-labelledby": tabId(i),
      hidden: active !== i,
      tabIndex: 0,
    }),
    /** Spread on the element that wraps the tabs and panels: hovering or focusing inside it pauses rotation. */
    rootProps: {
      onPointerEnter: () => setHover(true),
      onPointerLeave: () => setHover(false),
      onFocus: () => setHover(true),
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(false);
      },
    },
  };
}
