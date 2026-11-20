import { Container } from "@/components/ui/Section";
import { Rich } from "@/components/ui/Rich";
import type { Block, TableBlock } from "@/content/types";
import { cx } from "@/lib/utils";
import { SAMPLE_ESTIMATE_SUMMARY, SAMPLE_FIXTURES_DWV, SAMPLE_MATERIAL_LIST } from "./content";
import { SampleWorkbook, type Sheet, type SheetRow, type SheetTab, type Swatch } from "./SampleWorkbook";
import s from "./samples.module.css";

/*
 * Turns the three sample tables into workbook files at build time. Columns are found by their header, every line
 * must name a source and every sheet tab must have a view, so a content edit that breaks the trace fails the build
 * instead of shipping a dead line or a tab that does nothing.
 */

const PLANS = ["P-101", "P-102", "P-103"]; // "measured from plans": the floor plan sheets the takeoff names
const SHEET_KIND: Record<string, string> = { "P-301": "Roof plan", "P-501": "Riser diagram", "P-601": "Schedules" };
const WORDS: [key: string, re: RegExp, label: string][] = [
  ["spec", /\bspecification\b/i, "Specification"],
  ["civil", /\bcivil sheets\b/i, "Civil sheets"],
  ["gap", /\bscope-gap log\b/i, "Scope-gap log"],
];
const SWATCH: [RegExp, Swatch][] = [
  [/water closet|lavatory|urinal|floor drain|fixtures/i, "fixtures"],
  [/sanitary|cleanout/i, "waste"],
  [/\bvent\b/i, "vent"],
  [/domestic|\bhot\b|\bcold\b/i, "water"],
  [/storm/i, "storm"],
  [/water heater|pump/i, "equipment"],
  [/sprinkler/i, "fire"],
];
/** Material list tabs: the columns each one lights. */
const TAB_COLUMNS: Record<string, string[]> = { "Order list": ["Order", "Buy as"], "Net quantities": ["Net"], Allowances: ["Allowance"] };
/** Estimate summary tabs: the systems whose summary lines each one keeps lit (the summary itself is every line). */
const TAB_SYSTEMS: Record<string, Swatch[] | "all"> = {
  Summary: "all",
  "Fixtures and DWV": ["fixtures", "waste", "vent"],
  "Domestic water": ["water"],
  Storm: ["storm"],
  Equipment: ["equipment"],
};

function table(b: Block): TableBlock {
  if (b.type !== "table") throw new Error(`samples workbook: ${b.id} is not a table block`);
  return b;
}
function col(b: TableBlock, name: string): number {
  const i = b.head.indexOf(name);
  if (i < 0) throw new Error(`samples workbook: ${b.id} has no "${name}" column`);
  return i;
}
const cell = (r: string[], i: number) => r[i] ?? "";
const isNumeric = (v: string) => /^[\d,.\-–$%+()/\s]+$/.test(v.trim());

/** "P-601, P-101 to P-103" gives P-601, P-101, P-102, P-103. */
function sheetRefs(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/P-(\d+)(?:\s+to\s+P-(\d+))?/g)) {
    const from = Number(m[1]);
    const to = Number(m[2] ?? m[1]);
    if (to < from || to - from > 20) throw new Error(`samples workbook: odd sheet range "${m[0]}"`);
    for (let n = from; n <= to; n++) out.push(`P-${n}`);
  }
  return out;
}
/** The estimate's basis column: sheet numbers, "plans" (not "roof plan"), and the documents it names. */
function basisRefs(text: string): string[] {
  return [...sheetRefs(text), ...(/\bplans\b/i.test(text) ? PLANS : []), ...WORDS.filter(([, re]) => re.test(text)).map(([k]) => k)];
}
function sourceFor(key: string): Sheet["sources"][number] {
  if (/^P-1\d\d$/.test(key)) return { key, label: key, sub: "Plan" };
  const kind = SHEET_KIND[key];
  if (kind) return { key, label: key, sub: kind };
  const word = WORDS.find(([k]) => k === key);
  if (word) return { key, label: word[2] };
  throw new Error(`samples workbook: no source label for ${key}`);
}
/** Every source the sheet's lines name, sheets in number order, then the documents. */
function sourcesOf(rows: SheetRow[]): Sheet["sources"] {
  const keys = [...new Set(rows.flatMap((r) => r.refs))];
  const order = (k: string) => (k.startsWith("P-") ? Number(k.slice(2)) : 1000 + WORDS.findIndex(([w]) => w === k));
  return keys.sort((a, b) => order(a) - order(b)).map(sourceFor);
}
function withRefs(b: TableBlock, row: SheetRow): SheetRow {
  if (!row.refs.length) throw new Error(`samples workbook: "${row.cells[0]}" in ${b.id} names no source`);
  return row;
}
/** The rail's sources, and each line's readout ending with the sheets it lights, so the answer sits under the line too. */
function traced(rows: SheetRow[]): Pick<Sheet, "rows" | "sources"> {
  const sources = sourcesOf(rows);
  const lit = (r: SheetRow) => sources.filter((src) => r.refs.includes(src.key)).map((src) => src.label);
  return { sources, rows: rows.map((r) => ({ ...r, parts: [...r.parts, `Source sheets: ${lit(r).join(", ")}`] })) };
}
const swatchOf = (text: string) => SWATCH.find(([re]) => re.test(text))?.[1];

/** The sheet's tabs, each with its view; a tab without one, or a lone tab, fails the build. */
function tabsOf(b: TableBlock, view: (tab: string) => Omit<SheetTab, "label"> | undefined): SheetTab[] | undefined {
  if (!b.sheetTabs) return undefined;
  if (b.sheetTabs.length < 2) throw new Error(`samples workbook: ${b.id} needs two sheet tabs or none`);
  return b.sheetTabs.map((label) => {
    const v = view(label);
    if (!v) throw new Error(`samples workbook: sheet tab "${label}" in ${b.id} has no view`);
    return { label, ...v };
  });
}

function base(b: TableBlock, tab: string): Omit<Sheet, "rows" | "sources" | "hint" | "frame"> {
  return {
    id: b.id,
    tab,
    head: (
      <>
        <h2 id={`${b.id}-h`} className={s.h2}>
          <Rich text={b.h2} />
        </h2>
        {b.intro && (
          <p className={s.intro}>
            <Rich text={b.intro} />
          </p>
        )}
      </>
    ),
    note: b.note ? <Rich text={b.note} /> : null,
    caption: b.caption,
    columns: b.head,
    right: b.head.map((_, i) => b.rows.every((r) => isNumeric(cell(r, i)))),
  };
}

function takeoffSheet(block: Block): Sheet {
  const b = table(block);
  const [item, size, ref, qty, unit] = ["Item", "Size and material", "Sheet reference", "Qty", "Unit"].map((n) => col(b, n)) as number[];
  const rows = b.rows.map((r) =>
    withRefs(b, {
      cells: r,
      refs: sheetRefs(cell(r, ref!)),
      swatch: swatchOf(cell(r, item!)),
      parts: [cell(r, item!), `${cell(r, qty!)} ${cell(r, unit!)}`, cell(r, size!)],
    }),
  );
  return {
    ...base(b, "Takeoff"),
    sub: size,
    ...traced(rows),
    sheetTabs: tabsOf(b, () => undefined), // its lines are all one tab: no second view to switch to
    hint: "Pick a line to see where it came from.",
    frame: ["Show where", "came from"],
  };
}

function materialSheet(block: Block): Sheet {
  const b = table(block);
  const [item, net, allow, order, unit, buy] = ["Item", "Net", "Allowance", "Order", "Unit", "Buy as"].map((n) => col(b, n)) as number[];
  const rows = b.rows.map((r): SheetRow => {
    const u = cell(r, unit!);
    return {
      cells: r,
      refs: [],
      parts: [cell(r, item!), `${cell(r, net!)} ${u} net + ${cell(r, allow!)} ${u} allowance = ${cell(r, order!)} ${u} to order`, `Buy as ${cell(r, buy!)}`],
      math: [`${cell(r, net!)} ${u}`, `${cell(r, allow!)} ${u}`, `${cell(r, order!)} ${u}`, cell(r, buy!)],
    };
  });
  return {
    ...base(b, "Material list"),
    sub: buy,
    rows,
    sources: [],
    sheetTabs: tabsOf(b, (t) => TAB_COLUMNS[t] && { cols: TAB_COLUMNS[t].map((n) => col(b, n)) }),
    hint: "Pick a line to see how the order quantity is built.",
    frame: ["Show how the order is built for", ""],
  };
}

function estimateSheet(block: Block): Sheet {
  const b = table(block);
  const [sys, qty, unit, basis] = ["System", "Qty", "Unit", "Basis"].map((n) => col(b, n)) as number[];
  const rows = b.rows.map((r) => {
    const q = cell(r, qty!);
    return withRefs(b, {
      cells: r,
      refs: basisRefs(cell(r, basis!)),
      swatch: swatchOf(cell(r, sys!)),
      parts: [cell(r, sys!), ...(q === "-" ? [] : [`${q} ${cell(r, unit!)}`]), cell(r, basis!)],
    });
  });
  const sheetTabs = tabsOf(b, (t) => {
    const systems = TAB_SYSTEMS[t];
    if (!systems) return undefined;
    const lit = rows.flatMap((r, i) => (systems === "all" || (r.swatch && systems.includes(r.swatch)) ? [i] : []));
    if (!lit.length) throw new Error(`samples workbook: sheet tab "${t}" in ${b.id} lights no line`);
    return { rows: lit };
  });
  return { ...base(b, "Estimate"), ...traced(rows), sheetTabs, hint: "Pick a line to see where it came from.", frame: ["Show where", "came from"] };
}

/**
 * "Open the workbook": the three sample sheets as files in one window (dark section). The wrapper is labelled by its
 * kicker and has no h2 of its own: each file keeps its block's id, h2, intro, caption and note.
 */
export function WorkbookSection() {
  const sheets = [takeoffSheet(SAMPLE_FIXTURES_DWV), materialSheet(SAMPLE_MATERIAL_LIST), estimateSheet(SAMPLE_ESTIMATE_SUMMARY)];
  return (
    <section id="sample-workbook" aria-labelledby="sample-workbook-k" className={cx("sec tone-dark", s.sec)}>
      <Container>
        <div className="sec-head center">
          <span id="sample-workbook-k" className="kicker">
            Open the workbook
          </span>
          <p className="sec-intro">Pick a file, then a line, and see where it came from.</p>
        </div>
        <SampleWorkbook sheets={sheets} />
      </Container>
    </section>
  );
}
