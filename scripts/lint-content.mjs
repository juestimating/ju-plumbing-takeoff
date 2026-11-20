#!/usr/bin/env node
/**
 * Content linter: enforces the editorial and SEO rules on the DATA files, before anything is built.
 *   node scripts/lint-content.mjs                      lint every service and guide
 *   node scripts/lint-content.mjs src/content/services/plumbing-takeoff.ts ...
 * Exit code 1 when any ERROR is found. Warnings are advisory but should normally be fixed.
 * Content .ts files must only use `import type` (Node strips types; runtime imports with the @/ alias would fail).
 */
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const C = (p) => path.join(ROOT, "src/content", p);
const list = (dir, ext) => (fs.existsSync(C(dir)) ? fs.readdirSync(C(dir)).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)) : []);

const SERVICES = list("services", ".ts");
const GUIDES = list("guides", ".mdx");
/** Every page that exists. Related routes and inline links to anything else (a removed page included) are errors. */
const STATIC = ["/", "/services", "/guides", "/pricing", "/samples", "/faq", "/about", "/contact", "/thank-you", "/privacy-policy", "/terms", "/refund-policy", "/cookie-policy", "/accessibility"];
const ROUTES = new Set([...STATIC, ...SERVICES.map((s) => `/services/${s}`), ...GUIDES.map((s) => `/guides/${s}`)]);

const ICONS = new Set("phone mail arrow-right check clock shield-check file-spreadsheet file-text file-check ruler layers search users upload wrench droplets flame building factory hospital warehouse home calculator clipboard-check hard-hat waves gauge map-pin download lock dollar timer pencil-ruler boxes package receipt list-checks alert info hammer cog thermometer zap graduation-cap hotel utensils stethoscope siren handshake file-search scale eye briefcase calendar message target trending-up network table".split(" "));
const ILLUS = new Set("plan-markup riser-isometric dwv-isometric underground-plan fixture-schedule equipment-room storm-roof gas-manifold medical-gas-zone sprinkler-layout takeoff-sheet bid-package restroom-plan house-rough-in process-piping".split(" "));
const RESERVED = new Set(["how-it-works", "pricing-and-turnaround", "related-services", "frequently-asked-questions", "get-quote", "overview", "all"]);
const ALLOWED_PRICES = new Set(["129", "149", "199", "349", "1,499", "1499"]);

// Plain strings match as substrings. Regexes carry the trade-wording exceptions: "unlocked Excel" is JU's own deliverable
// wording, "elevated pressure" is a gas term, "Seamless Copper Tube" is an ASTM title, "verification and certification"
// is how medical gas work is described, "certified payroll" is a wage-reporting term.
const BANNED = ["in today's", "fast-paced", /\bunlock(?!ed\b)\w*/, /\belevat(?:e|es|ing)\b/, /\bseamless\b(?! (?:copper|tube|pipe|steel))/, "leverage", "cutting-edge", "cutting edge", "state-of-the-art", "game-changer", "game changing", "game-changing", "revolutioni", "supercharge", "empower", "holistic", "synerg", "best-in-class", "world-class", "top-notch", "second to none", "look no further", "to the next level", "navigate the complexit", "delve", "tailored solution", "one-stop", "comprehensive solution", "important to note", "in the world of", "ultimate guide", "whether you're", "whether you are a", "hyper-accurate", "unparalleled", "streamline", /\bcertified\b(?! payroll)/, /(?<!verification and )\bcertification\b/];
const SOFT_BANNED = ["robust", "landscape", "licensed", "guarantee"];
const GENERIC_ANCHOR = /^(click here|here|read more|learn more|this|link|more)$/i;

let errors = 0;
let warns = 0;
const out = [];
const log = (file, level, msg) => {
  out.push(`  ${level === "ERROR" ? "ERROR" : "warn "}  ${msg}`);
  level === "ERROR" ? errors++ : warns++;
  void file;
};

const words = (s) => (s.match(/[A-Za-z0-9$%±–'’-]+/g) || []).length;
const stripMd = (s) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");

function textChecks(file, text, where, { moneyOk = false } = {}) {
  const lower = text.toLowerCase();
  if (text.includes("—")) log(file, "ERROR", `${where}: em dash found (use comma, colon, period or parentheses)`);
  if (/!/.test(text) && !/!\[/.test(text)) log(file, "WARN", `${where}: exclamation mark`);
  for (const b of BANNED) if (typeof b === "string" ? lower.includes(b) : b.test(lower)) log(file, "ERROR", `${where}: banned phrase "${b instanceof RegExp ? lower.match(b)[0] : b}"`);
  for (const b of SOFT_BANNED) if (lower.includes(b)) log(file, "WARN", `${where}: check wording "${b}" (see brief sections 1 and 2)`);
  if (/not just .{1,70}\bbut\b/i.test(text)) log(file, "WARN", `${where}: "not just ... but" pattern`);
  if (/\b(todo|tbd|fixme|lorem|placeholder|stub(?!-))\b/i.test(text)) log(file, "ERROR", `${where}: placeholder text`);
  if (/\b24\s?[-]\s?72\b|\b24\s?[–-]\s?48\b|\b48\s?[–-]\s?72\b|same[- ]day|next[- ]day/i.test(text)) log(file, "ERROR", `${where}: turnaround must be exactly "24–72 hours"`);
  for (const m of text.matchAll(/\$\s?(\d[\d,]*\d|\d)(?:\.\d+)?/g)) {
    if (!ALLOWED_PRICES.has(m[1])) log(file, moneyOk ? "WARN" : "ERROR", `${where}: dollar figure $${m[1]} is not a published price`);
  }
  for (const m of text.matchAll(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g)) {
    if (!/703\)?[\s.-]721[\s.-]8864/.test(m[0])) log(file, "ERROR", `${where}: unknown phone number ${m[0]}`);
  }
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s?%/g)) {
    const ctx = text.slice(Math.max(0, m.index - 8), m.index + 12);
    if (!/(5–10|15–30|10%|30%)/.test(ctx)) log(file, "WARN", `${where}: percentage "${m[0]}" (only use if it is an example, or JU's published variance)`);
  }
  for (const m of text.matchAll(/(\d+)\+?\s*years/gi)) if (!["15"].includes(m[1])) log(file, "WARN", `${where}: years claim "${m[0]}" (only "15+ years" is allowed)`);
}

function checkLinks(file, strings, minInternal, { allowAnyCount = false } = {}) {
  const counts = new Map();
  let internal = 0;
  for (const s of strings) {
    for (const m of s.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
      const [, label, href] = m;
      if (GENERIC_ANCHOR.test(label.trim())) log(file, "ERROR", `link anchor "${label}" is generic`);
      if (href.startsWith("/")) {
        const clean = href.split("#")[0].split("?")[0];
        if (!ROUTES.has(clean)) log(file, "ERROR", `internal link to unknown route ${href}`);
        internal++;
        counts.set(clean, (counts.get(clean) || 0) + 1);
      } else if (!/^https:\/\//.test(href) && !/^(mailto|tel):/.test(href)) log(file, "ERROR", `bad link ${href}`);
    }
  }
  if (!allowAnyCount && internal < minInternal) log(file, "WARN", `only ${internal} inline internal links (want ${minInternal}+)`);
  for (const [h, n] of counts) if (n > 2) log(file, "WARN", `link target ${h} used ${n} times (max 2)`);
  return internal;
}

function collectStrings(node, acc = [], key = "") {
  if (typeof node === "string") {
    if (!["slug", "icon", "illustration", "color", "tone", "type", "id", "href", "updated", "group", "unit", "variant"].includes(key)) acc.push(node);
  } else if (Array.isArray(node)) node.forEach((n) => collectStrings(n, acc, key));
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) collectStrings(v, acc, k);
  return acc;
}

async function lintPage(file) {
  const rel = path.relative(ROOT, file);
  const slug = path.basename(file, ".ts");
  let page;
  try {
    page = (await import(pathToFileURL(file).href + `?t=${Date.now()}`)).default;
  } catch (e) {
    log(file, "ERROR", `cannot import (runtime imports are not allowed, use import type only): ${e.message.split("\n")[0]}`);
    return rel;
  }
  if (page.slug !== slug) log(file, "ERROR", `slug "${page.slug}" must equal filename "${slug}"`);
  if (page.group !== "services") log(file, "ERROR", 'group must be "services"');

  const { seo, hero, price, blocks = [], faq = [], related = [] } = page;
  const primary = (seo.keywords?.[0] || "").toLowerCase();
  if (!primary) log(file, "ERROR", "seo.keywords is empty (first entry is the PRIMARY keyword)");
  if ((seo.keywords || []).length < 4) log(file, "WARN", "seo.keywords: want 4-8 entries");
  if (seo.title.length < 30 || seo.title.length > 60) log(file, "ERROR", `title is ${seo.title.length} chars (30-60): "${seo.title}"`);
  if (seo.description.length < 130 || seo.description.length > 158) log(file, "ERROR", `description is ${seo.description.length} chars (130-158)`);
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  if (primary && !norm(seo.title).includes(norm(primary))) log(file, "WARN", `primary keyword "${primary}" not in title`);
  if (primary && !norm(hero.h1).includes(norm(primary).replace(/ services$/, ""))) log(file, "WARN", `primary keyword "${primary}" not reflected in h1`);
  if (primary && !norm(seo.description).includes(norm(primary).replace(/ services$/, ""))) log(file, "WARN", `primary keyword "${primary}" not in description`);
  const leadWords = words(stripMd(hero.lead));
  if (leadWords < 35 || leadWords > 80) log(file, "WARN", `hero.lead is ${leadWords} words (40-75)`);
  if (hero.illustration && !ILLUS.has(hero.illustration)) log(file, "ERROR", `unknown hero.illustration ${hero.illustration}`);
  if (hero.image) log(file, "ERROR", "do not use hero.image (no photos)");
  if (!/^From \$\d|^\$1,499|^Custom quote/.test(price.display)) log(file, "WARN", `price.display "${price.display}"`);
  if (price.turnaround !== "24–72 hours" && !/^Priority within 24–72 hours$|^Set to your schedule$/.test(price.turnaround)) log(file, "ERROR", `price.turnaround "${price.turnaround}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(page.updated)) log(file, "ERROR", "updated must be YYYY-MM-DD");

  // Recipe (2026-11-20 trim): scope, the one product-specific section, gaps, a sample sheet, at most one callout.
  // The template already adds the order steps, pricing, related links, FAQ and the quote form.
  if (blocks.length < 4) log(file, "WARN", `only ${blocks.length} blocks (the recipe has 4-6)`);
  if (blocks.length > 7) log(file, "WARN", `${blocks.length} blocks (the recipe has 4-6: keep only what this page alone needs)`);
  const ids = new Set();
  const h2s = new Set();
  let dark = 0;
  let bodyWords = 0;
  for (const b of blocks) {
    const where = `block "${b.id}"`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.id)) log(file, "ERROR", `${where}: id must be lowercase-kebab`);
    if (ids.has(b.id)) log(file, "ERROR", `${where}: duplicate id`);
    if (RESERVED.has(b.id)) log(file, "ERROR", `${where}: reserved id`);
    ids.add(b.id);
    if (h2s.has(b.h2.toLowerCase())) log(file, "ERROR", `${where}: duplicate h2 "${b.h2}"`);
    h2s.add(b.h2.toLowerCase());
    if (b.h2.length > 80) log(file, "WARN", `${where}: h2 is ${b.h2.length} chars (max about 70)`);
    if (/[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+/.test(b.h2)) log(file, "WARN", `${where}: h2 looks Title Case (use sentence case)`);
    if (b.tone === "dark" && ++dark > 2) log(file, "WARN", "more than two dark blocks");
    if (b.illustration && !ILLUS.has(b.illustration)) log(file, "ERROR", `${where}: unknown illustration ${b.illustration}`);
    if (b.image) log(file, "ERROR", `${where}: do not use image (no photos)`);
    for (const c of b.cards || []) if (c.icon && !ICONS.has(c.icon)) log(file, "ERROR", `${where}: unknown icon ${c.icon}`);
    for (const c of b.items || []) if (c.icon && !ICONS.has(c.icon)) log(file, "ERROR", `${where}: unknown icon ${c.icon}`);
    if (b.type === "table" && b.variant === "sheet" && (b.rows?.length ?? 0) < 5) log(file, "WARN", `${where}: sheet table has few rows`);
    if (b.type === "table" && b.rows?.some((r) => r.length !== b.head.length)) log(file, "ERROR", `${where}: a table row does not match the header column count`);
    if (b.type === "cards") for (const c of b.cards) if (c.href && /\]\(/.test(c.body)) log(file, "ERROR", `${where}: card "${c.title}" has href AND an inline link in its body`);
    const strs = collectStrings(b);
    strs.forEach((s) => textChecks(file, s, where, { moneyOk: b.type === "table" }));
    bodyWords += strs.reduce((n, s) => n + words(stripMd(s)), 0);
  }
  textChecks(file, hero.lead + " " + seo.title + " " + seo.description + " " + hero.h1, "seo/hero");
  // Optional template overrides: same text rules as the blocks.
  for (const s of [hero.note, price.note, ...(page.howItWorks ? collectStrings(page.howItWorks) : []), ...(page.pricing ? collectStrings(page.pricing) : [])]) {
    if (s) textChecks(file, s, "override");
  }
  if (price.note && price.note.length > 80) log(file, "WARN", "price.note is long (keep it under 80 characters)");
  // Specific but not padded: page-specific words (blocks, overrides and FAQ), the template excluded.
  const target = [800, 1700];
  const total = bodyWords + faq.reduce((n, f) => n + words(f.a) + words(f.q), 0);
  if (total < target[0]) log(file, "ERROR", `only ~${total} words of content (min ${target[0]})`);
  else if (total > target[1]) log(file, "WARN", `~${total} words (target max ${target[1]})`);

  if (faq.length < 4 || faq.length > 8) log(file, "ERROR", `faq has ${faq.length} items (4-8)`);
  const qs = new Set();
  for (const f of faq) {
    // cost, turnaround, addenda and confidentiality are answered by the template and /faq, not page by page
    if (/^how (much|long)\b|addend|confidential|\bnda\b/i.test(f.q)) log(file, "WARN", `faq "${f.q.slice(0, 50)}": generic question (the template and /faq answer it)`);
    const aw = words(stripMd(f.a));
    if (aw < 35 || aw > 125) log(file, "WARN", `faq "${f.q.slice(0, 50)}": answer is ${aw} words (40-110)`);
    if (!f.q.trim().endsWith("?")) log(file, "ERROR", `faq question must end with ?: "${f.q.slice(0, 50)}"`);
    if (qs.has(f.q)) log(file, "ERROR", `duplicate faq question "${f.q.slice(0, 50)}"`);
    qs.add(f.q);
    textChecks(file, f.q + " " + f.a, `faq "${f.q.slice(0, 40)}"`);
  }
  if (related.length < 4 || related.length > 6) log(file, "WARN", `related has ${related.length} entries (4-6)`);
  for (const r of related) if (r === "/pricing" || r === "/samples") log(file, "WARN", `related: ${r} is already linked by the hero and the pricing section`);
  for (const r of related) if (!ROUTES.has(r)) log(file, "ERROR", `related: unknown route ${r}`);
  if (new Set(related).size !== related.length) log(file, "ERROR", "related has duplicates");
  if (related.includes(`/services/${slug}`)) log(file, "ERROR", "related links to itself");
  const n = checkLinks(file, [...blocks.flatMap((b) => collectStrings(b)), ...faq.map((f) => f.a), hero.lead], 3);
  out.push(`  info   ~${total} words, ${blocks.length} blocks, ${faq.length} faqs, ${n} inline internal links`);
  return rel;
}

function lintGuide(file) {
  const rel = path.relative(ROOT, file);
  const slug = path.basename(file, ".mdx");
  const src = fs.readFileSync(file, "utf8");
  const m = /export const meta = (\{[\s\S]*?\n\});/.exec(src);
  if (!m) {
    log(file, "ERROR", "no `export const meta = {...};` block found");
    return rel;
  }
  let meta;
  try {
    meta = new Function(`return (${m[1]})`)();
  } catch (e) {
    log(file, "ERROR", `meta is not a plain object literal: ${e.message}`);
    return rel;
  }
  const body = src.slice(m.index + m[0].length);
  if (meta.slug !== slug) log(file, "ERROR", `meta.slug "${meta.slug}" must equal filename "${slug}"`);
  if (meta.title.length < 30 || meta.title.length > 60) log(file, "ERROR", `title is ${meta.title.length} chars (30-60)`);
  if (meta.description.length < 130 || meta.description.length > 158) log(file, "ERROR", `description is ${meta.description.length} chars (130-158)`);
  if (!["How-to", "Estimating", "Buying guide", "Reference"].includes(meta.category)) log(file, "ERROR", `bad category ${meta.category}`);
  if ((meta.keywords || []).length < 4) log(file, "WARN", "keywords: want 4-8");
  for (const k of ["datePublished", "dateModified"]) if (!/^\d{4}-\d{2}-\d{2}$/.test(meta[k] || "")) log(file, "ERROR", `${k} must be YYYY-MM-DD`);
  if (!(meta.related?.length >= 2 && meta.related.length <= 4)) log(file, "WARN", "meta.related should have 2-4 hrefs");
  for (const r of meta.related || []) if (!ROUTES.has(r)) log(file, "ERROR", `meta.related: unknown route ${r}`);
  const faq = meta.faq || [];
  if (faq.length < 3 || faq.length > 5) log(file, "WARN", `meta.faq has ${faq.length} items (3-5: only questions the body does not answer)`);
  for (const f of faq) {
    if (!f.q.trim().endsWith("?")) log(file, "ERROR", `faq question must end with ?: "${f.q.slice(0, 50)}"`);
    textChecks(file, f.q + " " + f.a, "faq");
  }
  const primary = (meta.keywords?.[0] || "").toLowerCase();
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  if (primary && !norm(meta.h1 + " " + meta.title).includes(norm(primary))) log(file, "WARN", `primary keyword "${primary}" not in h1/title`);
  if (primary && !norm(meta.description).includes(norm(primary))) log(file, "WARN", `primary keyword "${primary}" not in description`);

  const lines = body.split(/\r?\n/);
  let fenced = false;
  let last = 1;
  const h2s = [];
  for (const [i, line] of lines.entries()) {
    if (line.startsWith("```")) fenced = !fenced;
    if (fenced) continue;
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!h) continue;
    const level = h[1].length;
    if (level === 1) log(file, "ERROR", `line ${i + 1}: h1 in body (the layout renders the h1)`);
    if (level > last + 1) log(file, "ERROR", `line ${i + 1}: heading level skips (h${last} to h${level})`);
    last = level;
    if (level === 2) h2s.push(h[2].toLowerCase());
    if (h[2].length > 90) log(file, "WARN", `line ${i + 1}: long heading`);
  }
  if (h2s.length < 4) log(file, "WARN", `only ${h2s.length} h2 sections (want 4-9)`);
  if (h2s.length > 9) log(file, "WARN", `${h2s.length} h2 sections (want 4-9)`);
  if (new Set(h2s).size !== h2s.length) log(file, "ERROR", "duplicate h2 headings");
  if (/<!--/.test(body)) log(file, "ERROR", "HTML comment (use {/* */})");
  for (const tag of ["Callout", "KeyTakeaways", "Cta"]) {
    const open = (body.match(new RegExp(`<${tag}[\\s>]`, "g")) || []).length;
    const close = (body.match(new RegExp(`</${tag}>`, "g")) || []).length;
    if (open !== close) log(file, "ERROR", `<${tag}> opened ${open} times, closed ${close}`);
  }
  // KeyTakeaways and Callout are optional; exactly one inline Cta (the sidebar card and quote band carry the rest).
  const ctas = (body.match(/<Cta[\s>]/g) || []).length;
  if (ctas !== 1) log(file, "WARN", `${ctas} inline <Cta> (want exactly 1)`);
  if (!/^\|.*\|\s*$/m.test(body)) log(file, "WARN", "no Markdown table");
  if ((body.match(/<Callout[\s>]/g) || []).length > 1) log(file, "WARN", "more than one <Callout>");
  if (/(^|\n)\s*FAQ|frequently asked/i.test(h2s.join("\n"))) log(file, "WARN", "FAQ heading in body (use meta.faq)");
  const text = lines.filter((l) => !l.startsWith("```")).join("\n");
  textChecks(file, text, "body", { moneyOk: false });
  const wc = words(stripMd(text.replace(/<[^>]+>/g, " ")));
  if (wc < 800) log(file, "ERROR", `only ~${wc} words (min about 800)`);
  else if (wc > 2300) log(file, "WARN", `~${wc} words (keep a guide under about 2,200)`);
  const n = checkLinks(file, [text], 3);
  out.push(`  info   ~${wc} words, ${h2s.length} h2 sections, ${n} inline internal links`);
  return rel;
}

/**
 * The content-page template's own words (src/content/template.ts), as every page renders them, under the same text
 * rules. template.ts reads CLAIMS and the registry at runtime, so it loads through the test resolver ("@/" alias, .ts
 * extensions); that resolver is registered only here, after the content files, so their "import type only" check holds.
 */
const TEMPLATE = C("template.ts");
async function lintTemplate(file) {
  register("../tests/forms/hooks.mjs", import.meta.url);
  const T = await import(pathToFileURL(file).href);
  const { SERVICES: S } = await import(pathToFileURL(C("registry.ts")).href);
  // The block views' microcopy (template-blocks.ts) follows the same rules.
  const strings = [...collectStrings(T.COPY), ...collectStrings({ ...(await import(pathToFileURL(C("template-blocks.ts")).href)) })];
  for (const page of S) {
    const link = T.heroLink(page);
    const sw = T.switcherFor(page);
    strings.push(...Object.values(T.h2For(page)), T.priceIntro(page), ...page.blocks.map(T.kickerFor), ...T.sectionBar(page).map((i) => i.label));
    strings.push(...(link ? [link.label] : []), sw.ask, ...sw.items.map((i) => i.label));
    strings.push(...T.ladderFor(page).stops.flatMap((st) => [st.label, st.price, st.bestFor]));
  }
  const unique = [...new Set(strings)];
  unique.forEach((s) => textChecks(file, s, "template"));
  checkLinks(file, unique, 0, { allowAnyCount: true });
  out.push(`  info   ${unique.length} template strings across ${S.length} pages`);
  return path.relative(ROOT, file);
}

const args = process.argv.slice(2).map((a) => path.resolve(a));
const files = (
  args.length
    ? args
    : [...SERVICES.map((s) => C(`services/${s}.ts`)), ...GUIDES.map((s) => C(`guides/${s}.mdx`)), TEMPLATE]
).sort((a, b) => (a === TEMPLATE) - (b === TEMPLATE)); // the template last (see lintTemplate)

for (const f of files) {
  out.length = 0;
  const before = errors + warns;
  const rel = f.endsWith(".mdx") ? lintGuide(f) : f === TEMPLATE ? await lintTemplate(f) : await lintPage(f);
  console.log(`\n${rel}${errors + warns === before ? "  ok" : ""}`);
  console.log(out.join("\n"));
}
console.log(`\n${files.length} file(s): ${errors} error(s), ${warns} warning(s)`);
process.exit(errors ? 1 : 0);
