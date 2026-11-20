// Content-page template wiring (src/content/template.ts) against the content it decorates.
// Run: npm test   (tests/forms/register.mjs resolves the "@/" alias and .ts imports)
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const load = (p) => import(pathToFileURL(`${ROOT}/${p}`).href);

const { SERVICES: PAGES } = await load("content/registry.ts");
const T = await load("content/template.ts");
const FIXED_IDS = new Set(["how-it-works", "pricing-and-turnaround", "frequently-asked-questions"]);

test("template h2s are unique across the 8 pages, keep the page topic and never repeat a content h2", () => {
  const seen = new Map();
  for (const page of PAGES) {
    const h2 = T.h2For(page);
    const { a, plural } = T.TOPIC[page.slug];
    const topic = a.replace(/^an? /, "");
    const own = new Set(page.blocks.map((b) => b.h2.toLowerCase()));
    if (page.howItWorks) own.add(page.howItWorks.h2.toLowerCase());
    for (const [kind, text] of Object.entries(h2)) {
      if (kind === "howItWorks" && page.howItWorks !== undefined) continue; // the page's own h2 is used
      assert.ok(text.includes(topic) || text.includes(plural), `${page.slug} ${kind}: "${text}" lacks its topic`);
      assert.ok(!/:/.test(text), `${page.slug} ${kind}: "${text}" is colon catalog style`);
      assert.ok(!own.has(text.toLowerCase()), `${page.slug} ${kind}: "${text}" repeats a content h2`);
      assert.ok(!seen.has(text), `"${text}" is on ${seen.get(text)} and ${page.slug}`);
      seen.set(text, page.slug);
    }
  }
});

test("hero links and section bar chips point at sections that exist on the page", () => {
  for (const page of PAGES) {
    const ids = new Set([...page.blocks.map((b) => b.id), ...FIXED_IDS]);
    const link = T.heroLink(page);
    assert.ok(link, `${page.slug}: no hero link`);
    assert.ok(ids.has(link.href.slice(1)), `${page.slug}: hero link ${link.href} has no section`);
    const n = /^See all (\d+) line items$/.exec(link.label)?.[1];
    if (n) assert.equal(Number(n), page.blocks.find((b) => `#${b.id}` === link.href).items.length, `${page.slug}: wrong line item count`);
    const bar = T.sectionBar(page);
    for (const it of bar) assert.ok(ids.has(it.id), `${page.slug}: bar chip "${it.label}" points at #${it.id}`);
    assert.equal(new Set(bar.map((it) => it.label)).size, bar.length, `${page.slug}: two bar chips share a label`);
  }
});

test("kickers never repeat their block's h2, and every page has its price ladder stop", () => {
  for (const page of PAGES) {
    for (const b of page.blocks) assert.notEqual(T.kickerFor(b).toLowerCase(), b.h2.toLowerCase(), `${page.slug} ${b.id}`);
    const { stops } = T.ladderFor(page);
    assert.equal(stops.filter((s) => s.current).length, 1, `${page.slug}: one lit stop`);
  }
});
