"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { Highlighter, MousePointerClick } from "lucide-react";
import { cx } from "@/lib/utils";
import { useHoverIntent, useTabs } from "@/components/interactive/useTabs";
import s from "./demo.module.css";

/**
 * Takeoff demo island: the marked-up plan (server-rendered, passed in) and an Excel-style workbook share one state.
 * Picking a layer pill, tapping the plan or picking a line in the workbook lights the matching runs on the plan,
 * switches the workbook tab and highlights the rows. Picking a tab lights that tab's layers on the plan.
 * Resting the mouse on a pill, a run, a workbook line or a tab picks it too (useHoverIntent), so clicks are optional.
 */

type Layer = "cold" | "hot" | "waste" | "vent" | "fixtures" | "equipment";
type Item = "wc" | "lav" | "sink" | "waste-run" | "vent-run" | "cold-run" | "hot-run" | "valves" | "wh";
type Pick = { tab: number; layers: Layer[]; item?: Item };

const TABS = ["Summary", "Fixtures", "Waste and vent", "Water", "Equipment"];
const TAB_LAYERS: Layer[][] = [[], ["fixtures"], ["waste", "vent"], ["cold", "hot"], ["equipment"]];
const TAB_OF: Record<Layer, number> = { fixtures: 1, waste: 2, vent: 2, cold: 3, hot: 3, equipment: 4 };
const SHEET_ROWS = 9; // every tab shows nine rows, padded with empty ones like a real sheet
const NAV_KEYS = ["ArrowLeft", "ArrowRight", "Home", "End"];
const NEWS_MS = 5000; // how long an announcement stays in the hidden live region (so browse mode reads it once)

/** Illustrative quantities, consistent with the plan. Every line comes from sheet P-101.
 *  No-break spaces (\u00a0) keep a size or a material in one piece when a phone wraps the line. */
const ROWS: { tab: number; sys: string; line: string; qty: string; unit: string; layer: Layer; item: Item }[] = [
  { tab: 1, sys: "Fixtures", line: "Water closets, WC-1", qty: "3", unit: "EA", layer: "fixtures", item: "wc" },
  { tab: 1, sys: "Fixtures", line: "Lavatories, LAV-1", qty: "2", unit: "EA", layer: "fixtures", item: "lav" },
  { tab: 1, sys: "Fixtures", line: "Kitchenette sink, SK-1", qty: "1", unit: "EA", layer: "fixtures", item: "sink" },
  { tab: 2, sys: "Waste and vent", line: "Sanitary waste, 4\u00a0in. PVC\u00a0DWV", qty: "30", unit: "LF", layer: "waste", item: "waste-run" },
  { tab: 2, sys: "Waste and vent", line: "Vent, 2\u00a0in. PVC\u00a0DWV", qty: "15", unit: "LF", layer: "vent", item: "vent-run" },
  { tab: 3, sys: "Water", line: "Cold water, 1\u00a0in. Type\u00a0L\u00a0copper", qty: "70", unit: "LF", layer: "cold", item: "cold-run" },
  { tab: 3, sys: "Water", line: "Hot water, 3/4\u00a0in. Type\u00a0L\u00a0copper", qty: "25", unit: "LF", layer: "hot", item: "hot-run" },
  { tab: 3, sys: "Water", line: "Isolation valves", qty: "2", unit: "EA", layer: "cold", item: "valves" },
  { tab: 4, sys: "Equipment", line: "Water heater, WH-1", qty: "1", unit: "EA", layer: "equipment", item: "wh" },
];

const PILLS: { key: "all" | Layer; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cold", label: "Cold water" },
  { key: "hot", label: "Hot water" },
  { key: "waste", label: "Waste" },
  { key: "vent", label: "Vent" },
  { key: "fixtures", label: "Fixtures" },
  { key: "equipment", label: "Water heater" },
];

/** Live readout under the plan, keyed by the picked line, else by the lit layers. */
const SAY: Record<string, [string, string]> = {
  all: ["Everything on sheet P-101.", "Pick a system, a pipe on the plan or a line in the workbook."],
  cold: ["Cold water:", "70 LF of 1 in. Type L copper and 2 isolation valves, from sheet P-101."],
  hot: ["Hot water:", "25 LF of 3/4 in. Type L copper, from sheet P-101."],
  waste: ["Waste:", "30 LF of 4 in. PVC DWV, from sheet P-101."],
  vent: ["Vent:", "15 LF of 2 in. PVC DWV, from sheet P-101."],
  fixtures: ["Fixtures:", "3 water closets, 2 lavatories and 1 kitchenette sink, counted on sheet P-101."],
  "waste vent": ["Waste and vent:", "30 LF of 4 in. waste and 15 LF of 2 in. vent, from sheet P-101."],
  "cold hot": ["Water:", "70 LF of cold, 25 LF of hot and 2 isolation valves, from sheet P-101."],
  equipment: ["Equipment:", "1 water heater, WH-1, from sheet P-101."],
  wc: ["Water closets, WC-1:", "3 counted on sheet P-101."],
  lav: ["Lavatories, LAV-1:", "2 counted on sheet P-101."],
  sink: ["Kitchenette sink, SK-1:", "1 counted on sheet P-101."],
  "waste-run": ["Sanitary waste, 4 in. PVC DWV:", "30 LF measured on sheet P-101."],
  "vent-run": ["Vent, 2 in. PVC DWV:", "15 LF measured on sheet P-101."],
  "cold-run": ["Cold water, 1 in. Type L copper:", "70 LF measured on sheet P-101."],
  "hot-run": ["Hot water, 3/4 in. Type L copper:", "25 LF measured on sheet P-101."],
  valves: ["Isolation valves:", "2 on the cold water line, from sheet P-101."],
  wh: ["Water heater, WH-1:", "1 counted on sheet P-101."],
};

export function TakeoffDemoClient({ plan }: { plan: ReactNode }) {
  const tabs = useTabs(TABS.length);
  const hover = useHoverIntent();
  const [pick, setPick] = useState<Pick | null>(null);
  const [news, setNews] = useState(false); // the last pick was a click, tap or key: say it in the live region
  const [intro, setIntro] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const planKey = useRef<string | null>(null);
  const hoverLit = useRef(false); // the view on screen came from a hover pick, with no click, tap or key since
  const tabBarRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  // On a phone the tab strip scrolls sideways: keep the active tab in view when a pill or the plan picks it.
  useEffect(() => {
    const bar = tabBarRef.current;
    const tab = bar?.children[tabs.active] as HTMLElement | undefined;
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    if (tab.offsetLeft < bar.scrollLeft || tab.offsetLeft + tab.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollTo({ left: tab.offsetLeft - 12 }); // smooth only without reduced motion (CSS scroll-behavior)
    }
  }, [tabs.active]);

  // One short trace of every run the first time the plan scrolls into view (CSS skips it under reduced motion).
  useEffect(() => {
    const el = planRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let t = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setIntro(true);
        t = window.setTimeout(() => setIntro(false), 3200);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // A pick belongs to the tab it was made on; picking another tab falls back to that tab's layers.
  const picked = pick && pick.tab === tabs.active ? pick : null;
  const on = picked ? picked.layers : TAB_LAYERS[tabs.active]!;
  const item = picked?.item;
  const sayKey = item ?? (on.join(" ") || "all");
  const [label, text] = SAY[sayKey] ?? SAY.all!;

  useEffect(() => {
    if (!news) return;
    const t = window.setTimeout(() => setNews(false), NEWS_MS);
    return () => window.clearTimeout(t);
  }, [news, label]);

  const show = (layer: Layer, it?: Item, tab = TAB_OF[layer]) => {
    setIntro(false); // the first pick ends the first-view trace, so coming back to All never replays it
    tabs.select(tab);
    setPick({ tab, layers: [layer], item: it });
  };
  const reset = () => {
    setIntro(false);
    tabs.select(0);
    setPick(null);
  };
  // Only clicks, taps and keys reach the live region (`news`). Hover picks change the view silently, so a mouse
  // resting along the plan or the workbook does not queue a stream of announcements, and mark it hover-lit.
  const byClick = () => {
    setNews(true);
    hoverLit.current = false;
  };
  const byHover = () => {
    setNews(false);
    hoverLit.current = true;
  };
  const hoverShow = (layer: Layer, it?: Item, tab = TAB_OF[layer]) => {
    if ((it ?? layer) === sayKey && tab === tabs.active) return false; // already showing
    byHover();
    show(layer, it, tab);
  };
  // A click on the lit pill turns it off, except the first mouse click on a pill a hover pick lit (resting on the
  // pill, a run or a tab), however long the visitor took: they came to click it, so it confirms (and is announced).
  const onPill = (key: "all" | Layer, mouse: boolean) => {
    const confirm = mouse && hoverLit.current && key === sayKey;
    byClick();
    if (confirm) return;
    if (key === "all" || (on.length === 1 && on[0] === key && !item)) reset();
    else show(key);
  };
  const hoverPill = (key: "all" | Layer) => {
    if (key === sayKey) return false; // already showing: "all", or that one layer with no line picked
    byHover();
    if (key === "all") reset();
    else show(key);
  };
  // Pointer shortcut on the drawing (the pills above are the keyboard and screen reader route to the same picks).
  // Lookups stay inside the svg: the wrapper div carries data-item too, for the CSS.
  const planTarget = (el: Element) => ({
    layer: el.closest("svg [data-layer]")?.getAttribute("data-layer") as Layer | null,
    it: (el.closest("svg [data-item]")?.getAttribute("data-item") as Item | null) ?? undefined,
  });
  const onPlan = (e: MouseEvent<HTMLDivElement>) => {
    byClick();
    const { layer, it } = planTarget(e.target as Element);
    if (!layer) return reset();
    show(layer, it);
  };
  // Hover on the drawing: arm the run or fixture under the pointer. Bare paper arms nothing and keeps the last pick.
  const onPlanOver = (e: PointerEvent<HTMLDivElement>) => {
    const { layer, it } = planTarget(e.target as Element);
    const key = layer ? `${layer} ${it ?? ""}` : null;
    if (key === planKey.current) return;
    planKey.current = key;
    if (layer) hover.enter(e, () => hoverShow(layer, it));
    else hover.leave();
  };
  const onPlanLeave = () => {
    planKey.current = null;
    hover.leave();
  };
  const tabProps = (i: number) => {
    const p = tabs.getTabProps(i);
    return {
      ...p,
      onClick: () => {
        byClick();
        setPick(null);
        p.onClick();
      },
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (NAV_KEYS.includes(e.key)) {
          byClick();
          setPick(null);
        }
        p.onKeyDown(e);
      },
      onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
        if (i === tabs.active) return hover.leave();
        hover.enter(e, () => {
          byHover();
          setPick(null);
          tabs.select(i);
        });
      },
      onPointerMove: hover.move,
      onPointerLeave: hover.leave,
    };
  };

  return (
    <div className={s.demo}>
      <div className={s.head}>
        <span className={s.headLabel} id={labelId}>
          Pick a system
        </span>
        <div className={s.pills} role="group" aria-labelledby={labelId}>
          {PILLS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={s.pill}
              aria-pressed={p.key === "all" ? on.length === 0 : on.includes(p.key)}
              onClick={(e) => onPill(p.key, e.detail > 0)} // detail is 0 for Enter and Space
              onPointerEnter={(e) => hover.enter(e, () => hoverPill(p.key))}
              onPointerMove={hover.move}
              onPointerLeave={hover.leave}
            >
              <i className={s.sw} data-c={p.key} aria-hidden="true" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={s.planPane}>
        <div className={cx("sheet-bar", s.bar)}>
          <span className="sheet-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={s.barTitle}>
            <b className={s.src}>P-101</b> Marked-up plan
          </span>
          <span className={s.barHint}>
            <MousePointerClick size={15} aria-hidden="true" />
            Pick a pipe or a fixture
          </span>
        </div>
        <div
          ref={planRef}
          className={s.plan}
          data-active={on.join(" ") || "all"}
          data-item={item}
          data-intro={intro ? "" : undefined}
          onClick={onPlan}
          onPointerOver={onPlanOver}
          onPointerMove={hover.move}
          onPointerLeave={onPlanLeave}
        >
          {plan}
        </div>
      </div>

      <p className={s.readout}>
        <Highlighter size={18} aria-hidden="true" />
        <span key={label} className={s.say}>
          <strong>{label}</strong> {text}
        </span>
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {news ? `${label} ${text}` : ""}
      </p>

      <div className={cx("sheet", s.sheet)}>
        <div className="sheet-bar">
          <span className="sheet-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Illustrative example, trimmed for the demo. Quantities are examples, not project data.</span>
        </div>
        <div className={s.panels}>
          {TABS.map((t, i) => {
            const rows = i === 0 ? ROWS : ROWS.filter((r) => r.tab === i);
            return (
              <div key={t} {...tabs.getPanelProps(i)} className={cx("sheet-scroll", s.panel)}>
                <table className={s.table}>
                  <caption>{`${t} tab of the takeoff workbook, illustrative example (quantities only)`}</caption>
                  <thead>
                    <tr>
                      <th className="rn" scope="col">
                        <span className="sr-only">Row</span>
                      </th>
                      <th scope="col">System</th>
                      <th scope="col">Line item</th>
                      <th scope="col">Source</th>
                      <th scope="col" className="r">
                        Qty
                      </th>
                      <th scope="col">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, ri) => (
                      <tr
                        key={r.item}
                        className={cx(picked && (item ? r.item === item : on.includes(r.layer)) && s.rowOn)}
                        onPointerEnter={(e) => hover.enter(e, () => hoverShow(r.layer, r.item, i))}
                        onPointerMove={hover.move}
                        onPointerLeave={hover.leave}
                      >
                        <td className="rn">{ri + 1}</td>
                        <td>{r.sys}</td>
                        <td className={s.lineCell}>
                          {/* the name is the visible text (plus the system on phones), framed by hidden words */}
                          <button
                            type="button"
                            className={s.line}
                            onClick={() => {
                              byClick();
                              show(r.layer, r.item, i);
                            }}
                          >
                            <i className={cx(s.sw, s.swSm)} data-c={r.layer} aria-hidden="true" />
                            <span>
                              <span className="sr-only">Show </span>
                              {r.line} <small className={s.lineSys}>{r.sys}</small>
                              <span className="sr-only"> on the plan</span>
                            </span>
                          </button>
                        </td>
                        <td>
                          <span className={s.src}>P-101</span>
                        </td>
                        <td className="r">{r.qty}</td>
                        <td>{r.unit}</td>
                      </tr>
                    ))}
                    {/* filler rows only on the visible tab (hidden tabs keep just their real rows) */}
                    {i === tabs.active &&
                      Array.from({ length: SHEET_ROWS - rows.length }, (_, k) => (
                        <tr key={`empty-${k}`} className={s.empty} aria-hidden="true">
                          <td className="rn">{rows.length + k + 1}</td>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
        <div ref={tabBarRef} className={cx("sheet-tabs", s.tabs)} {...tabs.tablistProps} aria-label="Workbook tabs">
          {TABS.map((t, i) => (
            <button key={t} {...tabProps(i)} className={s.tab}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
