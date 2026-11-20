"use client";

import { useSyncExternalStore } from "react";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./help.module.css";

type State = "open" | "closed";

const NY = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** Inside SITE.hours right now, New York time? "HH:MM" strings compare in clock order. Holidays are not known. */
function read(): State {
  const p = Object.fromEntries(NY.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hm = `${p.hour}:${p.minute}`;
  return SITE.hours.some((h) => (h.schema.dayOfWeek as readonly string[]).includes(p.weekday) && hm >= h.schema.opens && hm < h.schema.closes)
    ? "open"
    : "closed";
}

// The clock is read only in subscribe and its timer, after mount (never during render). Every instance shares one
// store and one timer, and a change reaches every instance (a page can show the line in more than one place).
let state: State | null = null;
const listeners = new Set<() => void>();
let timer = 0;
const snapshot = () => state;
const serverSnapshot = () => null;
function subscribe(changed: () => void) {
  listeners.add(changed);
  if (listeners.size === 1) {
    state = read();
    timer = window.setInterval(() => {
      const next = read();
      if (next === state) return;
      state = next;
      listeners.forEach((l) => l());
    }, 60_000);
  }
  return () => {
    listeners.delete(changed);
    if (!listeners.size) window.clearInterval(timer);
  };
}

/**
 * "Office hours now" or "Outside office hours", from SITE.hours in New York time. The server and the first render
 * show a reserved empty line, so nothing moves when it fills in. A status, never a promise: holidays are not known.
 */
export function OpenNow({ variant = "line", className }: { variant?: "badge" | "line"; className?: string }) {
  const now = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return (
    <span className={cx(s.now, variant === "badge" && s.badge, className)} data-state={now ?? undefined}>
      {now && (
        <>
          <span className={s.dot} aria-hidden="true" />
          {now === "open" ? "Office hours now" : "Outside office hours"}
        </>
      )}
    </span>
  );
}
