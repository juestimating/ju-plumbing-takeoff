#!/usr/bin/env node
/**
 * Technical SEO audit for the JU Plumbing Takeoff site. Plain Node ESM, one dependency (node-html-parser).
 *
 *   node scripts/seo-audit.mjs [--base http://localhost:3100] [--json]
 *
 *   --base <url>   site to audit (default http://localhost:3100, or $SEO_AUDIT_BASE)
 *   --site <url>   origin the pages declare in canonical, og:url and JSON-LD when it is not --base
 *                  (a build made without NEXT_PUBLIC_SITE_URL declares http://localhost:3000)
 *   --preview      audit a local or preview build: site-wide noindex and "Disallow: /" are expected
 *   --json         print the JSON report on stdout instead of the text report
 *
 * Reads <base>/sitemap.xml (or crawls links from "/" when there is none), audits every indexable URL, the
 * noindex pages, the 404 behaviour, /robots.txt, /llms.txt, /manifest.webmanifest and every Open Graph image,
 * prints a per-page report, writes audit-reports/seo-audit.json and exits 1 when any ERROR exists
 * (2 when the audit itself could not run). ERROR = fix before launch, warn = review.
 *
 * A launch-grade local check needs a production build that knows its own origin:
 *   NEXT_PUBLIC_SITE_ENV=production NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build
 *   npx next start -p 3100        (second terminal)   then   npm run audit:seo
 */
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";
import { parse } from "node-html-parser";

const ROOT = path.resolve(import.meta.dirname, "..");

/** The h1 of every guide, read from the MDX meta blocks (cards on the home page and the guides hub reuse them as titles). */
let guideTitleCache;
function guideTitles() {
  if (!guideTitleCache) {
    guideTitleCache = new Set();
    const dir = path.join(ROOT, "src/content/guides");
    try {
      for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".mdx"))) {
        const m = /^\s*h1:\s*"([^"]+)"/m.exec(fs.readFileSync(path.join(dir, f), "utf8"));
        if (m) guideTitleCache.add(m[1]);
      }
    } catch { /* no guides folder: nothing to exempt */ }
  }
  return guideTitleCache;
}

/* ------------------------------------------------------------------ rules (edit here) */

const ALLOWED_PRICES = new Set([129, 149, 199, 349, 1499]);
const PHONE = { digits: "7037218864", display: "(703) 721-8864" };
const EMAIL = "info@juestimating.com";
const THEME_COLOR = "#1f1b50";
/** Utility and legal pages: must render, must be noindex, must stay out of the sitemap. Mirrors routes.ts. */
const NOINDEX_PATHS = ["/thank-you", "/privacy-policy", "/terms", "/refund-policy", "/cookie-policy", "/accessibility"];
const STATIC_PAGES = ["/", "/services", "/guides", "/pricing", "/samples", "/faq", "/about", "/contact"];
const HUBS = new Set(["/services", "/guides"]);
// guide: about 800 body words (the content lint minimum) plus the template around them
const MIN_WORDS = { home: 900, hub: 400, service: 1000, guide: 1300, other: 250 };
const LLMS_SECTIONS = ["Services", "Guides", "Company", "Contact"];
const GENERIC_ANCHOR = /^(?:click here|here|read more|learn more|more|more info|this link|this page|link)$/i;
const MAX_HTML_BYTES = 300 * 1024;

/** ERROR: placeholder text and claims the client has ruled out. Global flag is required (matchAll). */
const BANNED = [
  ["text.lorem", "lorem ipsum text", /\blorem\b/gi],
  ["text.todo", "TODO/TBD/FIXME marker", /\b(?:todo|tbd|fixme)\b/gi],
  ["text.brackets", "[...] placeholder", /\[(?:\.{3}|…)\]/g],
  ["text.stub", "STUB marker", /\bSTUB\b/g],
  ["text.placeholder", 'the word "placeholder"', /\bplaceholder\b/gi],
  ["text.em-dash", "em dash (use a comma, colon, period or parentheses)", /—/g],
  ["claim.certified", 'the word "certified"', /\bcertified\b/gi],
];

/** warn: phrases that read as machine-written (brief section 2). */
const AI_TELLS = [
  ["in today's", /\bin today[’']s\b/i],
  ["fast-paced", /\bfast[- ]paced\b/i],
  ["landscape", /\blandscape\b/i],
  ["unlock", /\bunlock(?:s|ing)?\b/i],
  ["elevate", /\belevat(?:e|es|ed|ing)\b/i],
  ["seamless", /\bseamless(?:ly)?\b(?!\s+(?:copper|tube|tubing|pipe|steel))/i],
  ["leverage", /\bleverag(?:e|es|ed|ing)\b/i],
  ["cutting-edge", /\bcutting[- ]edge\b/i],
  ["state-of-the-art", /\bstate[- ]of[- ]the[- ]art\b/i],
  ["game-changer", /\bgame[- ]chang(?:er|ers|ing)\b/i],
  ["revolutionize", /\brevolutioni[sz]/i],
  ["supercharge", /\bsupercharg/i],
  ["empower", /\bempower/i],
  ["holistic", /\bholistic/i],
  ["synergy", /\bsynerg/i],
  ["best-in-class", /\bbest[- ]in[- ]class\b/i],
  ["world-class", /\bworld[- ]class\b/i],
  ["top-notch", /\btop[- ]notch\b/i],
  ["second to none", /\bsecond to none\b/i],
  ["look no further", /\blook no further\b/i],
  ["take your ... to the next level", /\btake your [^.!?]{0,40}\bto the next level\b/i],
  ["navigate the complexities", /\bnavigat\w* the complexit/i],
  ["delve", /\bdelv(?:e|es|ed|ing)\b/i],
  ["robust", /\brobust\b/i],
  ["tailored solutions", /\btailored (?:solutions?|services|approach)\b/i],
  ["one-stop", /\bone[- ]stop\b/i],
  ["comprehensive solution", /\bcomprehensive solutions?\b/i],
  ["important to note", /\bimportant to note\b/i],
  ["in the world of", /\bin the world of\b/i],
  ["ultimate guide", /\bultimate guide\b/i],
  ["whether you're a", /\bwhether you(?:[’']re| are) an?\b/i],
  ["not just ... but", /\bnot just\b[^.!?]{1,80}\bbut\b/i],
  ["hyper-accurate", /\bhyper[- ]accurate\b/i],
  ["unparalleled", /\bunparalleled\b/i],
  ["streamline", /\bstreamlin/i],
  ["filler intro", /\bin this (?:article|guide|post)\b[^.]{0,25}\bwe(?:[’']ll| will)\b/i],
];

/** warn: wording the brief reserves for claims JU cannot make (certification, licence, guarantees). */
const CLAIM_WATCH = [["certification", /\bcertifications?\b/i], ["licensed", /\blicensed\b/i], ["guarantee", /\bguarantee[ds]?\b/i]];

/* ------------------------------------------------------------------ small helpers */

const E = (id, msg) => ({ level: "error", id, msg });
const W = (id, msg) => ({ level: "warn", id, msg });
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const chars = (s) => [...s].length;
const countWords = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const snip = (text, i, len = 0) => clean(text.slice(Math.max(0, i - 30), i + len + 30));
const tryUrl = (u, base) => { try { return new URL(u, base); } catch { return null; } };
const list = (items, n = 8) => (items.length > n ? `${items.slice(0, n).join(", ")} (+${items.length - n} more)` : items.join(", "));
const kindOf = (p) => (p === "/" ? "home" : HUBS.has(p) ? "hub" : p.startsWith("/services/") ? "service" : p.startsWith("/guides/") ? "guide" : "other");
const typesOf = (n) => [].concat(n?.["@type"] ?? []);
const hasType = (n, t) => typesOf(n).includes(t);
const noindexed = (v) => /\bnoindex\b/i.test(v ?? "");
const urlPath = (u) => { const x = tryUrl(u); return x ? (x.pathname.length > 1 ? x.pathname.replace(/\/+$/, "") : "/") : null; };

function strings(v, acc = []) {
  if (typeof v === "string") acc.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, acc));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, acc));
  return acc;
}

function graphNodes(ld) {
  const out = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") (Array.isArray(v["@graph"]) ? walk(v["@graph"]) : out.push(v));
  };
  ld.forEach((s) => s.json !== undefined && walk(s.json));
  return out;
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

async function http(url, { method = "GET", binary = false, accept = "*/*", timeout = 25_000 } = {}) {
  const t0 = performance.now();
  let error = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { method, redirect: "manual", signal: AbortSignal.timeout(timeout), headers: { "user-agent": "JU-SEO-Audit/1.0", accept } });
      const body = method === "HEAD" ? (binary ? Buffer.alloc(0) : "") : binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
      return { url, status: res.status, type: res.headers.get("content-type") ?? "", location: res.headers.get("location") ?? "", headers: res.headers, body, bytes: binary ? body.length : Buffer.byteLength(body), ms: Math.round(performance.now() - t0) };
    } catch (e) {
      error = String(e?.cause?.code ?? e?.cause?.message ?? e?.message ?? e);
    }
  }
  return { url, status: 0, type: "", location: "", headers: new Headers(), body: binary ? Buffer.alloc(0) : "", bytes: 0, ms: Math.round(performance.now() - t0), error };
}

/* ------------------------------------------------------------------ HTML analysis (pure, exported for tests) */

const SKIP = new Set(["script", "style", "noscript", "template", "svg"]);
const BLOCK = new Set("address article aside blockquote body br button dd details dialog div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr label li main nav ol option p pre section select summary table tbody td tfoot th thead tr ul".split(" "));

/** Visible text with line breaks at block boundaries, so phrases never run together across elements. */
function textOf(node) {
  let out = "";
  const walk = (n) => {
    if (n.nodeType === 3) out += n.text;
    else if (n.nodeType === 1) {
      const tag = (n.rawTagName ?? "").toLowerCase();
      if (SKIP.has(tag)) return;
      const brk = BLOCK.has(tag) ? "\n" : tag === "a" ? " " : "";
      out += brk;
      n.childNodes.forEach(walk);
      out += brk;
    }
  };
  walk(node);
  return out.replace(/[^\S\n]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n+/g, "\n").trim();
}

export function analyze(html) {
  const root = parse(html, { comment: false });
  const one = (s) => root.querySelector(s);
  const all = (s) => root.querySelectorAll(s);
  const attr = (el, n) => el?.getAttribute(n) ?? null;
  const meta = (sel) => { const v = attr(one(sel), "content"); return v === null ? null : clean(v); };
  const inside = (el, tag) => { for (let n = el.parentNode; n; n = n.parentNode) if (n.rawTagName?.toLowerCase() === tag) return true; return false; };
  const f = {};

  // JSON-LD first: the script nodes are dropped before text extraction.
  f.ld = all('script[type="application/ld+json"]').map((s) => { try { return { json: JSON.parse(s.innerHTML) }; } catch (e) { return { error: e.message }; } });
  f.nodes = graphNodes(f.ld);
  f.ldStrings = f.ld.flatMap((s) => (s.json === undefined ? [] : strings(s.json)));
  f.rawStripped = html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");

  f.lang = attr(one("html"), "lang");
  f.viewport = meta('meta[name="viewport"]');
  f.titleTags = all("head title").length;
  f.title = clean(one("head title")?.text);
  f.description = meta('meta[name="description"]');
  f.canonicals = all('link[rel="canonical"]').map((l) => attr(l, "href") ?? "");
  f.robots = all('meta[name="robots"], meta[name="googlebot"]').map((m) => (attr(m, "content") ?? "").toLowerCase());
  f.robotsMeta = meta('meta[name="robots"]');
  f.og = Object.fromEntries(all('meta[property^="og:"]').map((m) => [attr(m, "property"), clean(attr(m, "content") ?? "")]).reverse());
  f.twitter = Object.fromEntries(all('meta[name^="twitter:"]').map((m) => [attr(m, "name"), clean(attr(m, "content") ?? "")]).reverse());
  f.manifest = attr(one('link[rel="manifest"]'), "href");
  f.icons = all("link[rel]").filter((l) => /(^|\s)(?:shortcut\s+)?icon(\s|$)|apple-touch-icon/i.test(attr(l, "rel"))).map((l) => attr(l, "href")).filter(Boolean);

  const main = one("main");
  f.mainCount = all("main").length;
  f.headings = all("h1,h2,h3,h4,h5,h6").map((h) => {
    const inMain = inside(h, "main");
    return { level: Number(h.rawTagName[1]), text: clean(textOf(h)), inMain, inFaq: inside(h, "details"), chrome: inside(h, "nav") || inside(h, "footer") || (inside(h, "header") && !inMain) };
  });
  // The collapsible table of contents on guide pages (details.toc-m) is navigation, not an FAQ item.
  f.details = all("details").filter((d) => inside(d, "main") && !/(^|\s)toc-m(\s|$)/.test(attr(d, "class") ?? "")).map((d) => {
    const h = d.querySelector("summary h1, summary h2, summary h3, summary h4, summary h5, summary h6");
    return { heading: h ? h.rawTagName.toLowerCase() : null };
  });
  f.images = all("img").map((i) => ({ src: attr(i, "src") ?? "", alt: i.hasAttribute("alt") ? attr(i, "alt") : null, sized: Boolean(attr(i, "width") && attr(i, "height")) || attr(i, "data-nimg") === "fill" }));
  f.svgs = all("svg").filter((s) => attr(s, "role") === "img").map((s) => {
    const labelled = (attr(s, "aria-labelledby") ?? "").split(/\s+/).some((id) => id && clean(root.getElementById(id)?.text));
    return { named: Boolean(clean(attr(s, "aria-label")) || labelled || clean(s.querySelector("title")?.text)) };
  });
  f.links = all("a").filter((a) => a.hasAttribute("href")).map((a) => ({
    href: attr(a, "href"),
    text: clean(textOf(a)) || clean(attr(a, "aria-label")) || clean(attr(a.querySelector("img"), "alt")) || clean(a.querySelector("svg title")?.text),
    target: attr(a, "target"),
    rel: attr(a, "rel") ?? "",
  }));
  f.ids = new Set([...all("[id]").map((e) => attr(e, "id")), ...all("a[name]").map((e) => attr(e, "name"))].filter(Boolean));
  f.priceCard = one(".hero-card .price") ? clean(one(".hero-card .price").text) : null;

  f.attrTexts = [];
  for (const el of all("[alt],[aria-label],[title]")) for (const n of ["alt", "aria-label", "title"]) { const v = clean(attr(el, n)); if (v) f.attrTexts.push(v); }
  for (const t of all("svg title")) { const v = clean(t.text); if (v) f.attrTexts.push(v); }
  f.metaTexts = [f.title, f.description, f.og["og:title"], f.og["og:description"], f.twitter["twitter:title"], f.twitter["twitter:description"]].filter(Boolean);

  for (const el of all("script, style, noscript, template")) el.remove();
  f.bodyText = one("body") ? textOf(one("body")) : "";
  f.mainText = main ? textOf(main) : "";
  f.words = countWords(f.mainText);
  return f;
}

/* ------------------------------------------------------------------ banned content */

const TURN_CTX = /turnaround|turn around|deliver|back in|within|ready in|receive|returned|rush|as soon as|as little as|get it back|have it/i;

/** Dollar amounts, phone numbers, turnaround wording, e-mail addresses, placeholder text. `targets` = [[where, text], ...]. */
export function scanText(targets) {
  const out = [];
  const seen = new Set();
  const counts = {};
  const push = (level, id, msg, key) => {
    const k = `${id}|${key}`;
    if (seen.has(k)) return;
    seen.add(k);
    counts[id] = (counts[id] ?? 0) + 1;
    if (counts[id] <= 3) out.push({ level, id, msg });
  };
  for (const [where, text] of targets) {
    if (!text) continue;
    for (const [id, label, re] of BANNED) for (const m of text.matchAll(re)) push("error", id, `${label} in ${where}: "...${snip(text, m.index, m[0].length)}..."`, m[0].toLowerCase());

    for (const m of text.matchAll(/\$\s?(\d[\d,]*(?:\.\d+)?)/g)) {
      const n = Number(m[1].replace(/,+$/, "").replace(/,/g, ""));
      if (!ALLOWED_PRICES.has(n)) push("error", "price.unlisted", `$${m[1].replace(/,+$/, "")} in ${where} is not a published price (allowed: $129, $149, $199, $349, $1,499): "...${snip(text, m.index, m[0].length)}..."`, String(n));
    }
    for (const m of text.matchAll(/(?<!\d)(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}(?!\d)/g)) {
      const digits = m[0].replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
      if (digits !== PHONE.digits) push("error", "phone.unknown", `phone number ${m[0].trim()} in ${where} (the only number is ${PHONE.display})`, digits);
      else if (m[0].trim() !== PHONE.display) push("warn", "phone.format", `phone shown as "${m[0].trim()}" in ${where}, expected "${PHONE.display}"`, m[0].trim());
    }
    for (const m of text.matchAll(/[A-Za-z][\w.+-]*@[\w-]+(?:\.[\w-]+)+/g)) if (m[0].toLowerCase() !== EMAIL) push("warn", "email.unknown", `e-mail ${m[0]} in ${where} (the site address is ${EMAIL})`, m[0].toLowerCase());

    // Turnaround: only "24–72 hours" (en dash) is allowed. Drop the correct form, then flag what is left.
    const t = text.replace(/24–72[\s-]?hours?/gi, "\u0000".repeat(3));
    for (const m of t.matchAll(/\b(?:same|next)[- ]day\b/gi)) push("error", "turnaround.variant", `turnaround wording "${m[0]}" in ${where}: use "24–72 hours"`, m[0].toLowerCase());
    for (const m of t.matchAll(/\b(\d{1,3})\s*(?:[–—-]|to)\s*(\d{1,3})\s*(business\s+|working\s+)?(hours?|hrs?|days?)\b/gi)) {
      const [a, b] = [Number(m[1]), Number(m[2])];
      const hours = /^h/i.test(m[4]);
      const risky = hours ? [a, b].some((n) => [12, 24, 36, 48, 72, 96].includes(n)) : Boolean(m[3]) && Math.max(a, b) <= 7;
      const turnaroundSized = Math.max(a, b) <= (hours ? 168 : 14); // "30 to 60 days" is a bid-validity term, not a turnaround
      if (risky || (turnaroundSized && TURN_CTX.test(snip(t, m.index, m[0].length)))) push("error", "turnaround.variant", `turnaround "${m[0]}" in ${where} (should read "24–72 hours", with an en dash)`, m[0].toLowerCase());
    }
    for (const m of t.matchAll(/\b(24|48|72)[\s-]?(?:hours?|hrs?)\b/gi)) push("error", "turnaround.variant", `turnaround "${m[0]}" in ${where} (should read "24–72 hours")`, m[0].toLowerCase());
    for (const m of t.matchAll(/\b\d{1,2}\s+(?:business|working)\s+days?\b/gi)) if (TURN_CTX.test(snip(t, m.index, m[0].length))) push("error", "turnaround.variant", `turnaround "${m[0]}" in ${where} (should read "24–72 hours")`, m[0].toLowerCase());
  }
  for (const [id, n] of Object.entries(counts)) if (n > 3) out.push({ level: out.find((x) => x.id === id).level, id, msg: `...and ${n - 3} more ${id} finding${n - 3 === 1 ? "" : "s"} on this page` });
  return out;
}

/**
 * "undefined", "NaN" and "[object Object]" leaking out of the code. In attributes and the <title> any occurrence is a bug.
 * In visible text and JSON-LD only the shapes a leak takes count ("$undefined", "undefined%", a line that is just
 * "undefined", NaN anywhere), because "the limit of scope is undefined" is ordinary estimating English.
 */
function leakedValues(f) {
  const strict = /\bundefined\b|\bNaN\b|\[object Object\]/g;
  const loose = /^(?:undefined|NaN)$|[\d$%/_]undefined|undefined[\d%/_]|\bundefined undefined\b|\bNaN\b|\[object Object\]/gm;
  const out = [];
  const scan = (where, text, re) => {
    for (const m of text.matchAll(re)) if (out.length < 3) out.push(E("text.undefined", `"${m[0]}" in ${where}: "...${snip(text, m.index, m[0].length)}..."`));
  };
  for (const tag of f.rawStripped.matchAll(/<[a-zA-Z][^>]*>/g)) scan("an attribute", tag[0], strict);
  scan("the <title>", f.title, strict);
  scan("page text", f.bodyText, loose);
  scan("JSON-LD", f.ldStrings.join("\n"), loose);
  return out;
}

/* ------------------------------------------------------------------ one page */

/** Structure shared by indexable and noindex pages. */
function structure(f) {
  const out = [];
  const err = (id, msg) => out.push(E(id, msg));
  if (!/^en(?:-[A-Za-z]{2,4})?$/.test(f.lang ?? "")) err("html.lang", `<html lang> is ${f.lang ? `"${f.lang}"` : "missing"} (expected "en")`);
  if (!/width\s*=\s*device-width/i.test(f.viewport ?? "")) err("html.viewport", f.viewport ? `viewport meta lacks width=device-width ("${f.viewport}")` : "viewport meta is missing");
  if (f.mainCount !== 1) err("main.count", `${f.mainCount} <main> elements (need exactly 1)`);
  if (f.titleTags > 1) err("title.count", `${f.titleTags} <title> elements in the head (need exactly 1)`);
  else if (!f.title) err("title.missing", f.titleTags ? "<title> is empty" : "<title> is missing");

  const h1s = f.headings.filter((h) => h.level === 1);
  const h1sMain = h1s.filter((h) => h.inMain);
  if (h1sMain.length !== 1) err("h1.count", `${h1sMain.length} <h1> elements inside <main> (need exactly 1)`);
  if (h1s.length > h1sMain.length) err("h1.outside-main", "an <h1> sits outside <main>");
  if (h1sMain.length === 1) {
    const n = chars(h1sMain[0].text);
    if (n < 12 || n > 80) err("h1.length", `h1 is ${n} chars (12–80): "${h1sMain[0].text}"`);
  }
  for (const h of f.headings.filter((x) => x.chrome)) err("heading.chrome", `heading inside header/nav/footer: <h${h.level}> "${h.text}"`);

  let prev = 0;
  for (const h of f.headings.filter((x) => !x.chrome)) {
    if (prev === 0 && h.level !== 1) err("outline.start", `first heading is <h${h.level}> "${h.text}", expected the <h1>`);
    else if (h.level > prev + 1) err("outline.skip", `heading level jumps h${prev} to h${h.level}: "${h.text}"`);
    prev = h.level;
  }
  const seen = new Map();
  for (const h of f.headings.filter((x) => !x.chrome)) seen.set(h.text.toLowerCase(), (seen.get(h.text.toLowerCase()) ?? 0) + 1);
  for (const [t, n] of seen) if (n > 1) err("heading.duplicate", `heading text appears ${n} times: "${t}"`);
  return out;
}

/**
 * Every check that needs only the page itself. Returns { findings, internal, flags }.
 *   ctx: { path, kind, origin, baseUrl, origins:Set, noindexExpected, preview, sitemapLoc }
 */
export function checkPage(f, ctx) {
  const out = structure(f);
  const err = (id, msg) => out.push(E(id, msg));
  const warn = (id, msg) => out.push(W(id, msg));
  const flags = { noindexMeta: f.robots.some(noindexed) };
  const pageUrl = `${ctx.origin}${ctx.path}`;

  if (ctx.noindexExpected) {
    if (!flags.noindexMeta) err("robots.noindex-missing", 'this page must carry <meta name="robots" content="noindex">');
    return { findings: out, internal: [], flags };
  }

  /* robots meta: a production build says "index, follow" on every indexable page. buildMetadata() leaves the robots key out
     of indexable pages so the root layout value (with its googlebot preview limits) reaches the HTML. Noindex is reported elsewhere. */
  if (!ctx.preview && !flags.noindexMeta) {
    const tokens = (f.robotsMeta ?? "").toLowerCase().split(/\s*,\s*/);
    if (!f.robotsMeta) err("robots.meta", 'no <meta name="robots" content="index, follow"> (a page-level robots value of undefined replaces the layout value with nothing)');
    else if (!tokens.includes("index") || !tokens.includes("follow") || tokens.includes("none")) err("robots.meta", `robots meta is "${f.robotsMeta}", expected "index, follow"`);
  }

  /* title and description */
  const tl = chars(f.title);
  if (f.title && (tl < 30 || tl > 65)) err("title.length", `title is ${tl} chars (30–60, hard limit 65): "${f.title}"`);
  else if (tl > 60) warn("title.length", `title is ${tl} chars (aim for 60 or fewer): "${f.title}"`);
  if (f.description === null || f.description === "") err("description.missing", "meta description is missing");
  else {
    const dl = chars(f.description);
    if (dl < 120 || dl > 160) err("description.length", `meta description is ${dl} chars (120–160, aim for 130–158)`);
    else if (dl < 130 || dl > 158) warn("description.length", `meta description is ${dl} chars (aim for 130–158)`);
  }

  /* canonical */
  if (f.canonicals.length !== 1) err("canonical.count", `${f.canonicals.length} canonical links (need exactly 1)`);
  const canonical = f.canonicals[0];
  if (canonical !== undefined) {
    const cu = /^https?:\/\//i.test(canonical) ? tryUrl(canonical) : null;
    if (!cu) err("canonical.absolute", `canonical is not an absolute URL: "${canonical}"`);
    else {
      if (cu.origin !== ctx.origin) err("canonical.origin", `canonical origin is ${cu.origin}, expected ${ctx.origin}`);
      if (cu.pathname !== ctx.path) err("canonical.path", `canonical path is ${cu.pathname}, expected ${ctx.path}`);
      if (cu.search || cu.hash) err("canonical.params", `canonical carries a query or fragment: "${canonical}"`);
      if (ctx.sitemapLoc && ctx.sitemapLoc !== cu.href && ctx.sitemapLoc !== canonical) err("sitemap.canonical", `sitemap lists ${ctx.sitemapLoc} but the page canonical is ${canonical}`);
    }
  }

  /* Open Graph and Twitter */
  for (const p of ["og:title", "og:description", "og:url", "og:type", "og:image"]) {
    if (!f.og[p]) err("og.missing", p === "og:image" ? "og:image is missing (a page-level openGraph object replaces the parent's opengraph-image file, so pages without their own file must name the image in their metadata)" : `${p} is missing`);
  }
  if (f.og["og:image"] && !/^https?:\/\//i.test(f.og["og:image"])) err("og.image-url", `og:image is not an absolute URL: "${f.og["og:image"]}"`);
  if (f.og["og:url"] && canonical && f.og["og:url"] !== canonical) warn("og.url", `og:url (${f.og["og:url"]}) differs from the canonical (${canonical})`);
  if (!f.twitter["twitter:card"]) err("twitter.card", "twitter:card is missing");
  if (!f.twitter["twitter:image"]) warn("twitter.image", "twitter:image is missing");

  /* JSON-LD */
  f.ld.forEach((s, i) => s.error && err("jsonld.parse", `JSON-LD script ${i + 1} does not parse: ${s.error}`));
  for (const t of ["Organization", "WebSite", "ProfessionalService"]) if (!f.nodes.some((n) => hasType(n, t))) err("jsonld.missing", `${t} is missing from the JSON-LD graph`);
  // One Organization, and one ProfessionalService per office with a single PostalAddress: Ohio (head office) first, Virginia second.
  const offices = f.nodes.filter((n) => hasType(n, "ProfessionalService"));
  const regions = offices.map((n) => { const a = [].concat(n.address ?? []); return a.length === 1 && hasType(a[0], "PostalAddress") ? a[0].addressRegion : null; });
  if (offices.length && (offices.length !== 2 || regions.includes(null))) err("jsonld.address", `${offices.length} ProfessionalService node(s) with ${regions.filter(Boolean).length} valid PostalAddress entries (need exactly 2 offices, one PostalAddress each)`);
  else if (offices.length && (regions[0] !== "OH" || regions[1] !== "VA")) err("jsonld.address", `office nodes must list Ohio (head office) first and Virginia second, found ${regions[0]} then ${regions[1]}`);
  const org = f.nodes.find((n) => hasType(n, "Organization"));
  if (org && offices.length) {
    const located = [].concat(org.location ?? []).map((x) => x?.["@id"]);
    if (!offices.every((n) => n["@id"] && located.includes(n["@id"]))) warn("jsonld.org-location", "Organization.location does not reference every office node by @id");
  }

  if (ctx.path !== "/") {
    const bc = f.nodes.find((n) => hasType(n, "BreadcrumbList"));
    if (!bc) err("breadcrumb.missing", "BreadcrumbList JSON-LD is missing");
    else {
      const items = [].concat(bc.itemListElement ?? []).sort((a, b) => a.position - b.position);
      const last = items.at(-1);
      const target = typeof last?.item === "string" ? last.item : last?.item?.["@id"] ?? last?.item?.url;
      if (!last || (target !== pageUrl && target !== canonical)) err("breadcrumb.last", `last breadcrumb item is ${target ?? "missing"}, expected this page (${pageUrl})`);
      if (items.some((it, i) => it.position !== i + 1)) warn("breadcrumb.position", "breadcrumb positions are not 1..n");
      if (items.length && urlPath(typeof items[0].item === "string" ? items[0].item : items[0].item?.["@id"]) !== "/") warn("breadcrumb.first", "first breadcrumb item is not the home page");
    }
  }
  if (ctx.kind === "service") {
    const svc = f.nodes.find((n) => hasType(n, "Service"));
    const amount = f.priceCard ? Number((/\$\s?([\d,]+)/.exec(f.priceCard)?.[1] ?? "").replace(/,/g, "")) || null : null;
    const offer = [].concat(svc?.offers ?? []).find((o) => hasType(o, "Offer"));
    const min = offer?.priceSpecification?.minPrice ?? offer?.price;
    if (!svc) err("service.missing", "Service JSON-LD is missing");
    else if (f.priceCard === null) warn("service.card", "price card (.hero-card .price) not found, cannot compare it with the Offer");
    else if (amount !== null && !offer) err("service.offer", `Service has no Offer but the price card shows "${f.priceCard}"`);
    else if (amount !== null && Number(min) !== amount) err("service.price", `Offer minPrice is ${min ?? "missing"} but the price card shows "${f.priceCard}"`);
    else if (amount === null && offer) err("service.price", `Offer exists (${min}) but the price card shows "${f.priceCard}"`);
    else if (offer && offer.priceSpecification?.priceCurrency !== "USD" && offer.priceCurrency !== "USD") warn("service.currency", "Offer has no USD priceCurrency");
  }
  if (ctx.kind === "guide" && !f.nodes.some((n) => hasType(n, "Article"))) warn("article.missing", "Article JSON-LD is missing on a guide");

  /* FAQ */
  const badFaq = f.details.filter((d) => d.heading !== "h3").length;
  if (badFaq) err("faq.markup", `${badFaq} <details> item(s) whose <summary> does not hold an <h3> question`);
  const faqNames = new Set(f.nodes.filter((n) => hasType(n, "FAQPage")).flatMap((n) => [].concat(n.mainEntity ?? []).map((q) => q.name)));
  if (f.details.length !== faqNames.size) err("faq.count", `${f.details.length} FAQ questions on the page but ${faqNames.size} in FAQPage JSON-LD`);

  /* images and svg */
  const noAlt = f.images.filter((i) => i.alt === null);
  if (noAlt.length) err("img.alt", `${noAlt.length} <img> without an alt attribute: ${list(noAlt.map((i) => i.src.slice(0, 60)), 3)}`);
  const unsized = f.images.filter((i) => !i.sized);
  if (unsized.length) err("img.size", `${unsized.length} <img> without width and height: ${list(unsized.map((i) => i.src.slice(0, 60)), 3)}`);
  const unnamed = f.svgs.filter((s) => !s.named).length;
  if (unnamed) err("svg.name", `${unnamed} svg[role=img] without an accessible name (aria-label, aria-labelledby or <title>)`);

  /* links */
  const internal = [];
  for (const l of f.links) {
    const href = l.href.trim();
    if (href === "" || href === "#") err("link.empty", `link with an empty or "#" href: "${l.text}"`);
    else if (/^javascript:/i.test(href)) err("link.javascript", `javascript: link: "${l.text}"`);
    if (GENERIC_ANCHOR.test(l.text)) err("link.generic", `non-descriptive link text "${l.text}" pointing to ${href}`);
    else if (!l.text) warn("link.no-text", `link to ${href} has no text or accessible name`);
    if (l.target === "_blank" && !/\b(?:noopener|noreferrer)\b/i.test(l.rel)) err("link.blank", `target=_blank link to ${href} lacks rel="noopener"`);
    if (!href || href === "#" || /^(?:mailto:|tel:|sms:|javascript:|data:)/i.test(href)) {
      if (/^tel:/i.test(href) && href.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "") !== PHONE.digits) err("phone.unknown", `tel: link ${href} (the only number is ${PHONE.display})`);
      if (/^mailto:/i.test(href) && href.slice(7).split("?")[0].toLowerCase() !== EMAIL) warn("email.unknown", `mailto: link ${href} (the site address is ${EMAIL})`);
      continue;
    }
    const u = tryUrl(href, `${ctx.baseUrl}${ctx.path}`);
    if (!u || !ctx.origins.has(u.origin)) continue;
    const hash = (() => { try { return decodeURIComponent(u.hash.slice(1)); } catch { return u.hash.slice(1); } })();
    if (u.pathname === ctx.path && u.hash.length > 1) {
      if (!f.ids.has(hash)) err("link.anchor", `link to #${hash} but no element on this page has that id ("${l.text}")`);
    } else if (!u.pathname.startsWith("/_next/")) internal.push({ path: u.pathname, hash, text: l.text });
  }

  /* weight, copy and banned content */
  const min = MIN_WORDS[ctx.kind];
  if (f.words < min) warn("words.min", `${f.words} words in <main>, expected at least ${min} for a ${ctx.kind} page`);
  if (ctx.bytes > MAX_HTML_BYTES) warn("size.html", `HTML is ${(ctx.bytes / 1024).toFixed(0)} KB (over 300 KB)`);
  out.push(...scanText([["page text", f.bodyText], ["meta tags", f.metaTexts.join("\n")], ["alt/label text", f.attrTexts.join("\n")], ["JSON-LD", f.ldStrings.join("\n")]]));
  out.push(...leakedValues(f));
  const copy = [f.mainText, ...f.metaTexts].join("\n");
  for (const [label, re] of AI_TELLS) { const m = re.exec(copy); if (m) warn("ai-tell", `AI-tell phrase "${label}": "...${snip(copy, m.index, m[0].length)}..."`); }
  for (const [label, re] of CLAIM_WATCH) { const m = re.exec(copy); if (m) warn("claim.watch", `"${label}" in the copy (JU makes no such claim, check the context): "...${snip(copy, m.index, m[0].length)}..."`); }
  // A guide card repeats the guide's own h1, which may be a question; that is a title, not a Q&A heading.
  for (const h of f.headings) if (h.level > 1 && !h.chrome && !h.inFaq && /\?$/.test(h.text) && !/^what (?:is|are)\b/i.test(h.text) && !guideTitles().has(h.text)) warn("heading.question", `question heading (only "What is ...?" and FAQ questions are allowed): "${h.text}"`);
  const bangs = (f.mainText.match(/!/g) ?? []).length;
  if (bangs) warn("style.exclamation", `${bangs} exclamation mark${bangs === 1 ? "" : "s"} in <main>`);
  if (/\p{Extended_Pictographic}/u.test(copy.replace(/[©®™]/g, ""))) warn("style.emoji", "emoji or pictograph in the copy");
  return { findings: out, internal, flags };
}

/* ------------------------------------------------------------------ site resources */

export function parseSitemap(xml) {
  const entries = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const tag = (n) => { const x = new RegExp(`<${n}>\\s*([\\s\\S]*?)\\s*</${n}>`).exec(m[1]); return x ? x[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&") : null; };
    entries.push({ loc: tag("loc"), lastmod: tag("lastmod"), changefreq: tag("changefreq"), priority: tag("priority") });
  }
  return { entries, isIndex: /<sitemapindex/i.test(xml) };
}

const validDate = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(s)) return false;
  const d = new Date(s.length === 10 ? `${s}T00:00:00Z` : s);
  return !Number.isNaN(d.getTime()) && (s.length > 10 || d.toISOString().startsWith(s));
};

export function checkSitemap(res, { expected, noindexPaths = NOINDEX_PATHS, origin }) {
  const out = [];
  if (res.status !== 200) return [E("sitemap.status", `HTTP ${res.status || `no response (${res.error})`}: /sitemap.xml does not exist, so crawlers cannot discover the pages`)];
  if (!/xml/i.test(res.type)) out.push(W("sitemap.type", `content-type is "${res.type}", expected application/xml`));
  const sm = parseSitemap(res.body);
  if (sm.isIndex) out.push(W("sitemap.index", "sitemap index files are not followed by this audit"));
  if (!sm.entries.length) return [...out, E("sitemap.empty", "sitemap has no <url> entries")];
  const locs = sm.entries.map((e) => e.loc ?? "");
  const dup = locs.filter((l, i) => locs.indexOf(l) !== i);
  if (dup.length) out.push(E("sitemap.duplicate", `duplicate URLs: ${list([...new Set(dup)])}`));
  const origins = new Set(locs.map((l) => tryUrl(l)?.origin ?? `invalid(${l})`));
  if (origins.size > 1) out.push(E("sitemap.host", `URLs span several hosts: ${[...origins].join(", ")}`));
  else if (origin && [...origins][0] !== origin) out.push(E("sitemap.host", `sitemap host ${[...origins][0]} differs from the page canonical host ${origin}`));
  const paths = sm.entries.map((e) => urlPath(e.loc));
  const flagged = paths.filter((p) => noindexPaths.includes(p));
  if (flagged.length) out.push(E("sitemap.noindex", `noindex pages listed in the sitemap: ${flagged.join(", ")}`));
  for (const e of sm.entries) {
    if (!/^https?:\/\//i.test(e.loc ?? "") || /[?#]/.test(e.loc)) out.push(E("sitemap.loc", `invalid <loc> "${e.loc}" (absolute, no query or fragment)`));
    else if (urlPath(e.loc) !== "/" && e.loc.endsWith("/")) out.push(W("sitemap.loc", `trailing slash in ${e.loc} (pages are canonical without it)`));
  }
  const bad = sm.entries.filter((e) => !e.lastmod || !validDate(e.lastmod));
  if (bad.length) out.push(E("sitemap.lastmod", `${bad.length} URL(s) with a missing or invalid <lastmod> (YYYY-MM-DD): ${list(bad.map((e) => `${urlPath(e.loc)} "${e.lastmod ?? ""}"`), 4)}`));
  const future = sm.entries.filter((e) => e.lastmod && validDate(e.lastmod) && Date.parse(e.lastmod.length === 10 ? `${e.lastmod}T00:00:00Z` : e.lastmod) > Date.now() + 36 * 36e5);
  if (future.length) out.push(E("sitemap.lastmod", `<lastmod> is in the future for ${list(future.map((e) => urlPath(e.loc)))}`));
  const timed = sm.entries.filter((e) => e.lastmod && e.lastmod.length > 10);
  if (timed.length > 1 && new Set(timed.map((e) => e.lastmod)).size === 1) out.push(W("sitemap.lastmod", `every <lastmod> is the same timestamp (${timed[0].lastmod}), which looks like the build time; use each page's own updated date`));
  const bp = sm.entries.filter((e) => e.priority !== null && !(Number(e.priority) >= 0 && Number(e.priority) <= 1));
  if (bp.length) out.push(W("sitemap.priority", `priority outside 0..1 for ${list(bp.map((e) => urlPath(e.loc)))}`));
  if (expected) {
    const have = new Set(paths);
    const missing = expected.filter((p) => !have.has(p));
    if (missing.length) out.push(E("sitemap.missing", `sitemap lacks ${missing.length} indexable route(s): ${list(missing, 12)}`));
    const extra = paths.filter((p) => p && !expected.includes(p) && !noindexPaths.includes(p));
    if (extra.length) out.push(W("sitemap.extra", `sitemap lists ${extra.length} URL(s) with no matching page file: ${list(extra)}`));
  }
  return out;
}

export function parseRobots(txt) {
  const groups = [];
  const sitemaps = [];
  let cur = null;
  for (const raw of txt.split(/\r?\n/)) {
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(raw.replace(/#.*/, "").trim());
    if (!m) continue;
    const [k, v] = [m[1].toLowerCase(), m[2].trim()];
    if (k === "user-agent") { if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] })); cur.agents.push(v.toLowerCase()); }
    else if (k === "allow" || k === "disallow") cur?.rules.push([k, v]);
    else if (k === "sitemap") sitemaps.push(v);
  }
  return { groups, sitemaps };
}

export function checkRobots(res, { origin, preview }) {
  if (res.status !== 200) return [E("robots.status", `HTTP ${res.status || `no response (${res.error})`}: /robots.txt does not exist`)];
  const out = [];
  if (!/text\/plain/i.test(res.type)) out.push(W("robots.type", `content-type is "${res.type}", expected text/plain`));
  const { groups, sitemaps } = parseRobots(res.body);
  const star = groups.find((g) => g.agents.includes("*"));
  const blocksAll = Boolean(star?.rules.some(([k, v]) => k === "disallow" && v === "/"));
  if (preview) {
    if (!blocksAll) out.push(W("robots.preview", "preview build, but robots.txt does not disallow everything"));
  } else {
    if (!star) out.push(E("robots.agent", "no User-agent: * group"));
    if (blocksAll) out.push(E("robots.disallow-all", 'robots.txt has "Disallow: /" for all crawlers (non-production build; the launch build must allow crawling)'));
    else for (const p of ["/api/", "/thank-you"]) if (!star?.rules.some(([k, v]) => k === "disallow" && v === p)) out.push(W("robots.rules", `robots.txt does not disallow ${p}`));
    if (!sitemaps.length) out.push(E("robots.sitemap", "robots.txt has no Sitemap: line"));
    else if (!sitemaps.some((s) => s === `${origin}/sitemap.xml`)) out.push(W("robots.sitemap", `Sitemap line is ${sitemaps.join(", ")}, expected ${origin}/sitemap.xml`));
  }
  return out;
}

export function checkLlms(res, { origin, knownPaths }) {
  if (res.status !== 200) return [E("llms.status", `HTTP ${res.status || `no response (${res.error})`}: /llms.txt does not exist`)];
  const out = [];
  if (!/text\/plain/i.test(res.type)) out.push(E("llms.type", `content-type is "${res.type}", expected text/plain`));
  const lines = res.body.split(/\r?\n/);
  const first = lines.findIndex((l) => l.trim());
  if (!/^# \S/.test(lines[first] ?? "")) out.push(E("llms.h1", 'the first line must be an H1 ("# JU Plumbing Takeoff")'));
  else if (!/JU Plumbing Takeoff/.test(lines[first])) out.push(W("llms.name", `H1 is "${lines[first]}", expected the site name`));
  if (!/^> \S/.test(lines.slice(first + 1).find((l) => l.trim()) ?? "")) out.push(E("llms.summary", "the H1 must be followed by a blockquote summary (> ...)"));

  const sections = {};
  let cur = null;
  for (const l of lines) {
    const m = /^## (.+?)\s*$/.exec(l);
    if (m) sections[(cur = m[1])] = [];
    else if (cur && l.trim()) sections[cur].push(l);
  }
  for (const s of LLMS_SECTIONS) if (!sections[s]) out.push(E("llms.section", `missing "## ${s}" section`));
  const order = Object.keys(sections).filter((s) => LLMS_SECTIONS.includes(s));
  if (order.join("|") !== LLMS_SECTIONS.filter((s) => sections[s]).join("|")) out.push(W("llms.order", `sections are ordered ${order.join(", ")}, expected ${LLMS_SECTIONS.join(", ")}`));

  const listed = new Set();
  for (const s of ["Services", "Guides", "Company"]) {
    if (sections[s] && !sections[s].length) out.push(E("llms.section", `"## ${s}" is empty`));
    for (const l of sections[s] ?? []) {
      const m = /^- \[([^\]]+)\]\((https?:\/\/[^)\s]+)\): (\S.*)$/.exec(l);
      if (!m) { out.push(E("llms.entry", `${s}: not in the form "- [Title](absolute URL): description": ${l.slice(0, 80)}`)); continue; }
      if (/[.!?]\s+[A-Z]/.test(m[3])) out.push(W("llms.sentence", `${s}: description is more than one sentence: "${m[3].slice(0, 80)}"`));
      const u = tryUrl(m[2]);
      if (u?.origin !== origin) out.push(E("llms.origin", `${s}: ${m[2]} is not on ${origin}`));
      else {
        listed.add(urlPath(m[2]));
        if (knownPaths && !knownPaths.has(urlPath(m[2]))) out.push(E("llms.unknown-page", `${s}: ${m[2]} is not an indexable page of this site`));
      }
    }
  }
  if (knownPaths) {
    const missing = [...knownPaths].filter((p) => /^\/(?:services|guides)\/./.test(p) && !listed.has(p));
    if (missing.length) out.push(E("llms.missing", `llms.txt does not list ${missing.length} page(s): ${list(missing)}`));
  }
  const contact = (sections.Contact ?? []).join("\n");
  const need = [["email", contact.includes(EMAIL)], ["phone", contact.includes(PHONE.display)], ["head office (North Canton)", /North Canton/.test(contact)], ["regional office (Manassas)", /Manassas/.test(contact)], ["hours", /Monday/.test(contact) && /Saturday/.test(contact)]];
  for (const [what, ok] of need) if (!ok) out.push(E("llms.contact", `Contact section lacks the ${what}`));
  out.push(...scanText([["llms.txt", res.body]]));
  return out;
}

export function checkManifest(res, home) {
  if (res.status !== 200) return [E("manifest.status", `HTTP ${res.status || `no response (${res.error})`}: /manifest.webmanifest does not exist`)];
  const out = [];
  if (!/json/i.test(res.type)) out.push(W("manifest.type", `content-type is "${res.type}"`));
  let m;
  try { m = JSON.parse(res.body); } catch (e) { return [...out, E("manifest.parse", `manifest is not valid JSON: ${e.message}`)]; }
  for (const k of ["name", "short_name", "start_url"]) if (!m[k]) out.push(E("manifest.field", `${k} is missing`));
  if (String(m.theme_color ?? "").toLowerCase() !== THEME_COLOR) out.push(E("manifest.theme", `theme_color is "${m.theme_color}", expected ${THEME_COLOR}`));
  if (!["#ffffff", "#fff"].includes(String(m.background_color ?? "").toLowerCase())) out.push(E("manifest.background", `background_color is "${m.background_color}", expected #ffffff`));
  if (!Array.isArray(m.icons) || !m.icons.length) out.push(E("manifest.icons", "manifest has no icons"));
  else for (const i of m.icons) if (!i.src || !i.sizes || !i.type) out.push(W("manifest.icons", `icon entry lacks src, sizes or type: ${JSON.stringify(i)}`));
  if (home && !home.manifest) out.push(W("manifest.link", 'the home page has no <link rel="manifest">'));
  return out;
}

/** PNG width and height from the IHDR chunk, or null when the buffer is not a PNG. */
export function pngSize(buf) {
  return buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47 ? { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) } : null;
}

/* ------------------------------------------------------------------ the run */

const expectedRoutes = () => {
  const names = (dir, ext) => { try { return fs.readdirSync(path.join(ROOT, "src/content", dir)).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)).sort(); } catch { return []; } };
  const [services, guides] = [names("services", ".ts"), names("guides", ".mdx")];
  if (!services.length && !guides.length) return null;
  return [...STATIC_PAGES, ...services.map((s) => `/services/${s}`), ...guides.map((s) => `/guides/${s}`)];
};

export async function run(o, say) {
  const base = (o.base ?? process.env.SEO_AUDIT_BASE ?? "http://localhost:3100").replace(/\/+$/, "");
  const baseOrigin = tryUrl(base)?.origin;
  if (!baseOrigin) throw new Error(`--base is not a URL: ${base}`);
  const expectedOrigin = o.site ? tryUrl(o.site)?.origin : baseOrigin;
  if (!expectedOrigin) throw new Error(`--site is not a URL: ${o.site}`);

  const cache = new Map();
  const fetchPage = (p) => { if (!cache.has(p)) cache.set(p, http(base + p, { accept: "text/html" })); return cache.get(p); };
  say(`Auditing ${base} ...`);
  const home = await fetchPage("/");
  if (!home.status) throw new Error(`cannot reach ${base} (${home.error}). Start the server first or pass --base.`);
  const homeFacts = home.status === 200 && /html/i.test(home.type) ? analyze(home.body) : null;
  const declared = tryUrl(homeFacts?.canonicals[0] ?? "")?.origin ?? null;
  const origin = declared ?? expectedOrigin;
  const origins = new Set([baseOrigin, expectedOrigin, origin]);
  const groups = [];
  const group = (key, kind, extra = {}) => { const g = { key, kind, findings: [], ...extra }; groups.push(g); return g; };
  const site = group("Site-wide", "site");
  if (declared && declared !== expectedOrigin) site.findings.push(E("origin.mismatch", `pages declare ${declared} in canonical and og:url but the site is audited as ${expectedOrigin}. Build with NEXT_PUBLIC_SITE_URL=${expectedOrigin}, or pass --site ${declared} to check paths only.`));

  /* resources, in parallel */
  const stamp = Date.now().toString(36);
  const [smRes, robotsRes, llmsRes, manifestRes, nfRes] = await Promise.all([
    http(`${base}/sitemap.xml`), http(`${base}/robots.txt`), http(`${base}/llms.txt`), http(`${base}/manifest.webmanifest`),
    http(`${base}/__seo-audit-404-${stamp}`, { accept: "text/html" }),
  ]);
  const sm = smRes.status === 200 ? parseSitemap(smRes.body) : null;
  const useSitemap = Boolean(sm?.entries.length);
  const smByPath = new Map((sm?.entries ?? []).map((e) => [urlPath(e.loc), e.loc]));

  /* page list: sitemap, else a crawl from "/" */
  const hrefs = (html, from) => [...html.matchAll(/<a\s[^>]*?href="([^"]*)"/gi)].map((m) => tryUrl(m[1].replace(/&amp;/g, "&"), base + from)).filter((u) => u && origins.has(u.origin) && !/^\/(?:_next|api)\//.test(u.pathname) && !/\.[a-z0-9]{2,5}$/i.test(u.pathname)).map((u) => (u.pathname.length > 1 ? u.pathname.replace(/\/+$/, "") : "/"));
  let discovered;
  if (useSitemap) discovered = [...new Set([...smByPath.keys()].filter(Boolean))];
  else {
    say("No usable sitemap: crawling internal links from / instead ...");
    const seen = new Set(["/"]);
    const queue = ["/"];
    discovered = [];
    while (queue.length && discovered.length < 300) {
      await Promise.all(queue.splice(0, 8).map(async (p) => {
        const r = await fetchPage(p);
        if (r.status !== 200 || !/html/i.test(r.type)) return;
        discovered.push(p);
        for (const t of hrefs(r.body, p)) if (!seen.has(t)) { seen.add(t); queue.push(t); }
      }));
    }
  }
  const expected = expectedRoutes();
  const rank = new Map((expected ?? []).map((p, i) => [p, i]));
  const pages = [...new Set([...discovered, ...(expected ?? [])])].filter((p) => !NOINDEX_PATHS.includes(p)).sort((a, b) => (rank.get(a) ?? 1e6) - (rank.get(b) ?? 1e6));
  const knownPaths = new Set(useSitemap ? smByPath.keys() : expected ?? discovered);

  /* pages */
  say(`Auditing ${pages.length} pages and ${NOINDEX_PATHS.length} noindex pages ...`);
  const audit = async (p, noindexExpected) => {
    const res = await fetchPage(p);
    const g = { key: p, kind: "page", findings: [], res, facts: null, internal: [], flags: {}, noindexExpected };
    if (res.status !== 200) g.findings.push(E("http.status", res.status >= 300 && res.status < 400 ? `HTTP ${res.status} redirect to ${res.location || "?"} (listed URLs must answer 200 directly)` : `HTTP ${res.status || `no response (${res.error})`}`));
    else if (!/text\/html/i.test(res.type)) g.findings.push(E("http.type", `content-type is "${res.type}", expected text/html`));
    else {
      try {
        g.facts = analyze(res.body);
        const r = checkPage(g.facts, { path: p, kind: kindOf(p), origin, baseUrl: base, origins, noindexExpected, preview: Boolean(o.preview), sitemapLoc: useSitemap && !noindexExpected ? smByPath.get(p) : undefined, bytes: res.bytes });
        g.findings.push(...r.findings);
        g.internal = r.internal;
        g.flags = r.flags;
        g.flags.noindexHeader = noindexed(res.headers.get("x-robots-tag"));
      } catch (e) {
        g.findings.push(E("audit.crash", `the audit crashed on this page: ${e?.stack?.split("\n").slice(0, 2).join(" ") ?? e}`));
      }
    }
    return g;
  };
  const results = await pool(pages, 8, (p) => audit(p, false));
  const noindexResults = await pool(NOINDEX_PATHS, 8, (p) => audit(p, true));

  /* cross-page checks */
  const live = results.filter((r) => r.facts);
  for (const field of ["title", "description"]) {
    const byValue = new Map();
    for (const r of live) if (r.facts[field]) byValue.set(r.facts[field], [...(byValue.get(r.facts[field]) ?? []), r]);
    for (const [v, rs] of byValue) if (rs.length > 1) for (const r of rs) r.findings.push(E(`${field}.duplicate`, `${field} is identical on ${rs.length} pages (${list(rs.map((x) => x.key), 4)}): "${v.slice(0, 70)}"`));
  }
  const noindexLive = live.filter((r) => r.flags.noindexMeta || r.flags.noindexHeader);
  if (!o.preview && noindexLive.length) {
    if (noindexLive.length === live.length && live.length > 1) {
      const how = [live.every((r) => r.flags.noindexMeta) && "meta robots", live.every((r) => r.flags.noindexHeader) && "X-Robots-Tag header"].filter(Boolean).join(" and ") || "meta robots or X-Robots-Tag";
      site.findings.push(E("env.noindex", `all ${live.length} indexable pages are noindex (${how}). This is a non-production build: set NEXT_PUBLIC_SITE_ENV=production for the launch build, or re-run with --preview to audit everything else.`));
    } else for (const r of noindexLive) r.findings.push(E("robots.noindex", `indexable page is noindex (${r.flags.noindexMeta ? "meta robots" : "X-Robots-Tag header"})`));
  }
  const missingHeader = {};
  for (const r of live) {
    for (const h of ["x-content-type-options", "referrer-policy", "strict-transport-security"]) if (!r.res.headers.get(h)) (missingHeader[h] ??= []).push(r);
    if (r.res.headers.get("x-powered-by")) (missingHeader["x-powered-by (must be absent)"] ??= []).push(r);
  }
  for (const [h, rs] of Object.entries(missingHeader)) {
    if (rs.length > 3) site.findings.push(W("headers", `${h}: ${h.startsWith("x-powered-by") ? "present" : "missing"} on ${rs.length} of ${live.length} pages`));
    else for (const r of rs) r.findings.push(W("headers", `${h}: ${h.startsWith("x-powered-by") ? "present" : "missing"}`));
  }
  // Content-Security-Policy: next.config.ts sends it in production builds (enforced, or Report-Only while CSP_REPORT_ONLY=1).
  if (!o.preview) {
    const csp = (r) => r.res.headers.get("content-security-policy");
    const reportOnly = (r) => r.res.headers.get("content-security-policy-report-only");
    const noCsp = live.filter((r) => !csp(r) && !reportOnly(r));
    if (noCsp.length > 3) site.findings.push(E("headers.csp", `Content-Security-Policy header is missing on ${noCsp.length} of ${live.length} pages (next.config.ts sends it in production builds)`));
    else for (const r of noCsp) r.findings.push(E("headers.csp", "Content-Security-Policy header is missing (next.config.ts sends it in production builds)"));
    const observing = live.filter((r) => !csp(r) && reportOnly(r));
    if (observing.length) site.findings.push(W("headers.csp", `Content-Security-Policy is Report-Only on ${observing.length} of ${live.length} pages (CSP_REPORT_ONLY=1): nothing is blocked`));
  }
  // The same h2 text on more than 3 pages is usually a template heading; warn so each one is a choice, not an accident.
  const h2s = new Map();
  for (const r of live) for (const h of r.facts.headings.filter((x) => x.level === 2 && x.inMain && !x.chrome)) {
    const e = h2s.get(h.text.toLowerCase()) ?? { text: h.text, pages: new Set() };
    e.pages.add(r.key);
    h2s.set(h.text.toLowerCase(), e);
  }
  const repeated = [...h2s.values()].filter((e) => e.pages.size > 3).sort((a, b) => b.pages.size - a.pages.size);
  for (const e of repeated.slice(0, 10)) site.findings.push(W("heading.repeated", `h2 "${e.text}" appears on ${e.pages.size} pages (${list([...e.pages], 4)})`));
  if (repeated.length > 10) site.findings.push(W("heading.repeated", `...and ${repeated.length - 10} more h2 texts that appear on more than 3 pages`));

  /* internal links: every unique target once, collapsing sitewide breakage */
  const targets = new Map();
  for (const r of [...results, ...noindexResults]) for (const l of r.internal) { const t = targets.get(l.path) ?? { from: new Map() }; t.from.set(r.key, l); targets.set(l.path, t); }
  say(`Checking ${targets.size} internal link targets ...`);
  const status = new Map();
  await pool([...targets.keys()], 12, async (t) => {
    // Pages already fetched are reused. A trailing-slash link is not in the cache, so it reaches the server and shows its redirect.
    if (cache.has(t)) { const c = await cache.get(t); status.set(t, { status: c.status, location: c.location }); return; }
    let r = await http(base + t, { method: "HEAD" });
    if ([0, 405, 501].includes(r.status)) r = await http(base + t);
    status.set(t, { status: r.status, location: r.location });
  });
  for (const [t, info] of targets) {
    const s = status.get(t);
    if (s.status === 200) continue;
    const redirect = s.status >= 300 && s.status < 400;
    const msg = (l) => `internal link ${t} ${redirect ? `redirects (${s.status}) to ${s.location}, link to the final URL` : `returns HTTP ${s.status || "no response"}`} ("${l.text.slice(0, 40)}")`;
    const froms = [...info.from.keys()];
    if (froms.length >= 4) site.findings.push((redirect ? W : E)("link.broken", `${msg([...info.from.values()][0])}; linked from ${froms.length} pages (${list(froms, 4)})`));
    else for (const [from, l] of info.from) [...results, ...noindexResults].find((r) => r.key === from).findings.push((redirect ? W : E)("link.broken", msg(l)));
  }
  for (const r of [...results, ...noindexResults]) for (const l of r.internal) {
    const tp = results.find((x) => x.key === (l.path.length > 1 ? l.path.replace(/\/+$/, "") : l.path));
    if (l.hash && tp?.facts && !tp.facts.ids.has(l.hash)) r.findings.push(W("link.anchor", `link to ${l.path}#${l.hash} but that page has no element with the id ("${l.text.slice(0, 40)}")`));
  }

  /* open graph images */
  const og = new Map();
  for (const r of live) {
    const u = tryUrl(r.facts.og["og:image"] ?? "");
    if (u) { const fetchUrl = origins.has(u.origin) ? `${base}${u.pathname}${u.search}` : u.href; og.set(fetchUrl, [...(og.get(fetchUrl) ?? []), r.key]); }
  }
  say(`Checking ${og.size} Open Graph images ...`);
  const ogGroup = { key: "Open Graph images", kind: "resource", findings: [], info: `${og.size} unique image(s)` };
  await pool([...og.keys()], 8, async (u) => {
    const r = await http(u, { binary: true, accept: "image/*" });
    const used = `used by ${og.get(u).length} page(s), e.g. ${og.get(u)[0]}`;
    if (r.status !== 200) ogGroup.findings.push(E("og.image-fetch", `${u} returns HTTP ${r.status || `no response (${r.error})`} (${used})`));
    else if (!/^image\//i.test(r.type)) ogGroup.findings.push(E("og.image-fetch", `${u} content-type is "${r.type}", expected image/* (${used})`));
    else {
      const px = pngSize(r.body);
      if (px && (px.w !== 1200 || px.h !== 630)) ogGroup.findings.push(W("og.image-size", `${u} is ${px.w}x${px.h}, expected 1200x630 (${used})`));
    }
  });

  /* resources */
  group("/sitemap.xml", "resource", { info: sm ? `${sm.entries.length} URLs` : "", findings: checkSitemap(smRes, { expected, origin: declared ?? expectedOrigin }) });
  group("/robots.txt", "resource", { findings: checkRobots(robotsRes, { origin, preview: Boolean(o.preview) }) });
  group("/llms.txt", "resource", { findings: checkLlms(llmsRes, { origin, knownPaths }) });
  const manifestGroup = group("/manifest.webmanifest", "resource", { findings: checkManifest(manifestRes, homeFacts) });
  const iconRefs = [...(homeFacts?.icons ?? [])];
  if (manifestRes.status === 200) try { iconRefs.push(...(JSON.parse(manifestRes.body).icons ?? []).map((i) => i.src)); } catch { /* reported above */ }
  await pool([...new Set(iconRefs)], 6, async (src) => {
    const u = tryUrl(src, base + "/");
    const r = u ? await http(origins.has(u.origin) ? `${base}${u.pathname}${u.search}` : u.href, { binary: true, accept: "image/*" }) : { status: 0 };
    if (r.status !== 200 || !/^image\//i.test(r.type ?? "")) manifestGroup.findings.push(E("icon.fetch", `icon ${src} returns HTTP ${r.status || "no response"}${r.type ? ` (${r.type})` : ""}`));
  });
  if (homeFacts && !homeFacts.icons.length) manifestGroup.findings.push(W("icon.link", "the home page head has no icon link (favicon)"));
  const nf = group("404 page", "resource", { info: `GET /__seo-audit-404-${stamp}` });
  if (nfRes.status !== 404) nf.findings.push(E("404.status", `an unknown URL answers HTTP ${nfRes.status || `no response (${nfRes.error})`}, expected 404 (a 200 is a soft 404)`));
  if (nfRes.status) {
    const nfFacts = /html/i.test(nfRes.type) ? analyze(nfRes.body) : null;
    if (!nfFacts) nf.findings.push(W("404.type", `content-type is "${nfRes.type}", expected text/html`));
    else {
      if (!nfFacts.robots.some(noindexed) && !noindexed(nfRes.headers.get("x-robots-tag"))) nf.findings.push(W("404.noindex", "the 404 page is not noindex"));
      if (!nfFacts.headings.some((h) => h.level === 1 && h.inMain)) nf.findings.push(W("404.h1", "the 404 page has no <h1> inside <main>"));
    }
  }

  groups.push(ogGroup, ...results, ...noindexResults);
  return { base, origin, expectedOrigin, useSitemap, groups, pages: results.length, noindexPages: noindexResults.length };
}

/* ------------------------------------------------------------------ report */

const order = { site: 0, resource: 1, page: 2 };

export function buildReport(run, o) {
  const groups = run.groups.sort((a, b) => order[a.kind] - order[b.kind]);
  const all = groups.flatMap((g) => g.findings.map((f) => ({ ...f, where: g.key })));
  const byCheck = {};
  for (const f of all) { const c = (byCheck[f.id] ??= { errors: 0, warnings: 0 }); f.level === "error" ? c.errors++ : c.warnings++; }
  const errors = all.filter((f) => f.level === "error").length;
  return {
    tool: "seo-audit",
    generatedAt: new Date().toISOString(),
    base: run.base,
    declaredOrigin: run.origin,
    mode: o.preview ? "preview" : "production",
    pageSource: run.useSitemap ? "sitemap" : "crawl",
    summary: { pagesAudited: run.pages, noindexPagesAudited: run.noindexPages, errors, warnings: all.length - errors, pagesWithErrors: groups.filter((g) => g.kind === "page" && g.findings.some((f) => f.level === "error")).length, passed: errors === 0, byCheck },
    groups: groups.map((g) => ({
      key: g.key, kind: g.kind, info: g.info, noindexPage: g.noindexExpected || undefined,
      ...(g.res ? { status: g.res.status, bytes: g.res.bytes, ms: g.res.ms } : {}),
      ...(g.facts ? { title: g.facts.title, titleChars: chars(g.facts.title), descriptionChars: chars(g.facts.description ?? ""), canonical: g.facts.canonicals[0] ?? null, words: g.facts.words, ogImage: g.facts.og["og:image"] ?? null } : {}),
      findings: g.findings,
    })),
  };
}

export function printReport(r, color) {
  const paint = (code) => (s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
  const [red, yellow, green, dim, bold] = [paint(31), paint(33), paint(32), paint(2), paint(1)];
  const line = (f) => `    ${f.level === "error" ? red("ERROR") : yellow("warn ")}  ${f.msg}`;
  const out = [bold(`SEO audit  ${r.base}  (${r.mode} mode, pages from ${r.pageSource}, canonical origin ${r.declaredOrigin})`)];
  let section = "";
  for (const g of r.groups) {
    const title = { site: "SITE-WIDE", resource: "RESOURCES", page: `PAGES (${r.summary.pagesAudited} indexable, then ${r.summary.noindexPagesAudited} noindex)` }[g.kind];
    if (title !== section) { out.push("", bold(title)); section = title; }
    const e = g.findings.filter((f) => f.level === "error").length;
    const w = g.findings.length - e;
    const stats = g.noindexPage ? dim("noindex page") : g.kind === "page" && g.title !== undefined ? dim(`title ${g.titleChars} | desc ${g.descriptionChars} | ${g.words.toLocaleString("en-US")} words | ${(g.bytes / 1024).toFixed(1)} KB`) : g.info ? dim(g.info) : "";
    if (g.kind === "site") { g.findings.forEach((f) => out.push(line(f))); if (!g.findings.length) out.push(`  ${green("ok")}`); continue; }
    out.push(`  ${e ? red("[FAIL]") : w ? yellow("[warn]") : green("[ ok ]")}  ${g.key}  ${stats}`);
    g.findings.forEach((f) => out.push(line(f)));
  }
  const top = Object.entries(r.summary.byCheck).sort((a, b) => b[1].errors + b[1].warnings - (a[1].errors + a[1].warnings)).slice(0, 8);
  out.push("", bold("SUMMARY"));
  out.push(`  Pages audited: ${r.summary.pagesAudited} indexable + ${r.summary.noindexPagesAudited} noindex (${r.summary.pagesWithErrors} with errors)`);
  out.push(`  Errors: ${r.summary.errors}   Warnings: ${r.summary.warnings}`);
  if (top.length) out.push(`  Most common: ${top.map(([id, c]) => `${id} x${c.errors + c.warnings}`).join(", ")}`);
  out.push(`  Result: ${r.summary.passed ? green("PASS") : red("FAIL")}  (report written to audit-reports/seo-audit.json)`);
  return out.join("\n");
}

async function main() {
  const { values: o } = parseArgs({ options: { base: { type: "string" }, site: { type: "string" }, preview: { type: "boolean" }, json: { type: "boolean" }, help: { type: "boolean", short: "h" } } });
  if (o.help) return console.log(fs.readFileSync(import.meta.filename, "utf8").split("*/")[0].replace(/^#!.*\n/, "").replace(/^\/\*\*\n|^ \* ?/gm, ""));
  const report = buildReport(await run(o, (m) => process.stderr.write(`${m}\n`)), o);
  fs.mkdirSync(path.join(ROOT, "audit-reports"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "audit-reports", "seo-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(o.json ? JSON.stringify(report, null, 2) : printReport(report, process.stdout.isTTY && !process.env.NO_COLOR));
  process.exitCode = report.summary.passed ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error(`seo-audit failed: ${e?.message ?? e}`);
    process.exitCode = 2;
  });
}
