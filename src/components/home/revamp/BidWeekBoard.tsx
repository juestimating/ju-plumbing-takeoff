"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Check, Hourglass, Timer, UserRound, X } from "lucide-react";
import s from "./bidweek.module.css";

type Mode = "own" | "ju";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
/** Illustrative bids, all due Friday. None lands after Tuesday, so even a 72-hour takeoff is back by bid day. */
const BIDS = [
  { name: "Restaurant fit-out", day: 0 },
  { name: "Medical office", day: 0 },
  { name: "12 townhomes", day: 1 },
];
const MODES: { value: Mode; label: string }[] = [
  { value: "own", label: "On your own" },
  { value: "ju", label: "With JU" },
];

/** Row index as a CSS variable: drives the stagger of the switch animation. */
const row = (n: number) => ({ "--i": n }) as CSSProperties;

function Priced() {
  return (
    <span className={s.priced}>
      <Check size={14} strokeWidth={3} aria-hidden="true" />
      Priced
    </span>
  );
}

/**
 * Bid week board: three invitations land Monday and Tuesday, all due Friday. "On your own", one estimator prices one;
 * "With JU", every takeoff comes back and all three get priced. Both states are in the HTML; `data-mode` picks the one
 * on screen and CSS animates the switch. The radios are native inputs, so arrow keys and screen readers work as usual.
 */
export function BidWeekBoard({ turnaround }: { turnaround: string }) {
  const [mode, setMode] = useState<Mode>("own");
  const [nudge, setNudge] = useState(false);
  const touched = useRef(false);
  const ref = useRef<HTMLElement>(null);
  const id = useId();
  const priced = mode === "ju" ? BIDS.length : 1;

  // Invite the first click: "With JU" pulses softly once the board is in view (CSS skips it under reduced motion).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        if (!touched.current) setNudge(true);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (m: Mode) => {
    touched.current = true;
    setMode(m);
    setNudge(false);
  };

  return (
    <figure ref={ref} className={`${s.board} hr-reveal`} data-mode={mode} data-nudge={nudge || undefined}>
      <div className={s.top}>
        <p className={s.ask} id={`${id}-ask`}>
          Who does the takeoff?
        </p>
        <div className={s.toggle} role="radiogroup" aria-labelledby={`${id}-ask`}>
          <span className={s.thumb} aria-hidden="true" />
          {MODES.map((m) => (
            <label key={m.value} className={s.seg}>
              <input
                className="sr-only"
                type="radio"
                name={`${id}-mode`}
                value={m.value}
                checked={mode === m.value}
                onChange={() => pick(m.value)}
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      <div className={s.cal}>
        <ol className={s.days} aria-hidden="true">
          {DAYS.map((d) => (
            <li key={d}>
              {d.slice(0, 3)}
              {d === "Friday" && <span className={s.due}>Due</span>}
            </li>
          ))}
        </ol>
        <ul className={s.bids}>
          {BIDS.map((b, n) => {
            const first = n === 0;
            return (
              <li
                key={b.name}
                className={s.bid}
                data-fate={first ? "priced" : "passed"}
                style={{ ...row(n), gridColumnStart: b.day + 1, gridRow: n + 1 }}
              >
                <div className={s.bidIn}>
                  <p className={s.name}>{b.name}</p>
                  <p className={s.meta}>Lands {DAYS[b.day]}, due Friday</p>
                  <p className={`${s.swap} ${s.line}`}>
                    {first ? (
                      <span className={s.own}>
                        <UserRound size={16} aria-hidden="true" />
                        You count it, then price it
                      </span>
                    ) : (
                      <span className={s.own}>
                        <Hourglass size={16} aria-hidden="true" />
                        No hours left to count it
                      </span>
                    )}
                    <span className={s.ju}>
                      <Timer size={16} aria-hidden="true" />
                      Takeoff back in {turnaround}
                    </span>
                  </p>
                  <div className={`${s.swap} ${s.stamp}`}>
                    {first ? (
                      <Priced />
                    ) : (
                      <>
                        <span className={s.own}>
                          <span className={s.passed}>
                            <X size={14} strokeWidth={3} aria-hidden="true" />
                            Passed
                          </span>
                        </span>
                        <span className={s.ju}>
                          <Priced />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={s.foot}>
        <p className={s.summary} aria-live="polite" aria-atomic="true">
          <strong key={priced} className={s.count}>
            {priced} of {BIDS.length}
          </strong>{" "}
          bids priced
        </p>
        <span className={s.meter} aria-hidden="true">
          {BIDS.map((b, n) => (
            <i key={b.name} style={row(n)} data-on={n < priced || undefined} />
          ))}
        </span>
        <p className={`${s.swap} ${s.story}`}>
          <span className={s.own}>Your estimator counted and priced one. The other two got passed.</span>
          <span className={s.ju}>Your estimator priced all three and counted none.</span>
        </p>
      </div>
      <figcaption className={s.cap}>
        Illustrative bid week, not client data. Delivery is {turnaround} from the approved quote.
      </figcaption>
    </figure>
  );
}
