// Quote form logic: validation, spam traps, rate limiting and lead delivery.
// Run: npm test   (uses tests/forms/register.mjs so the "@/" alias and .ts imports resolve)
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src");
const load = (p) => import(pathToFileURL(`${ROOT}/${p}`).href);

const { consume } = await load("lib/rate-limit.ts");
const core = await load("app/actions/quote-core.ts");
const leads = await load("lib/leads.ts");
const cfg = await load("components/forms/quote-config.ts");

const SERVICES = [
  { value: "plumbing-takeoff", label: "Plumbing takeoff" },
  { value: "plumbing-estimating", label: "Plumbing estimating" },
  { value: "not-sure", label: "Not sure" },
];
const parse = core.makeQuoteParser(SERVICES);

const form = (o = {}) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(o)) fd.set(k, v);
  return fd;
};
const good = { name: "Pat Lee", email: "pat@example.com", service: "plumbing-takeoff" };

/* ---------------- rate limit ---------------- */
test("rate-limit: allows up to the limit, then refuses with a retry time", () => {
  const t = 1_000_000;
  for (let i = 0; i < 5; i++) assert.equal(consume("a", 5, 3600_000, t + i).ok, true);
  const r = consume("a", 5, 3600_000, t + 10);
  assert.equal(r.ok, false);
  assert.equal(r.retryAfterMs, t + 3600_000 - (t + 10));
});
test("rate-limit: undo gives the hit back; keys are independent; window slides", () => {
  const t = 5_000_000;
  const hits = [consume("b", 2, 1000, t), consume("b", 2, 1000, t + 1)];
  assert.equal(consume("b", 2, 1000, t + 2).ok, false);
  hits[1].undo();
  assert.equal(consume("b", 2, 1000, t + 3).ok, true);
  assert.equal(consume("other", 2, 1000, t + 3).ok, true);
  // after the window passes, capacity returns
  assert.equal(consume("b", 2, 1000, t + 1500).ok, true);
});
test("rate-limit: parallel reservations cannot all pass", async () => {
  const results = await Promise.all(Array.from({ length: 10 }, async () => consume("burst", 3, 60_000)));
  assert.equal(results.filter((r) => r.ok).length, 3);
});

/* ---------------- parse + validation ---------------- */
test("parse: minimal compact form is valid", () => {
  const p = parse(form(good));
  assert.deepEqual(p.errors, {});
  assert.ok(p.data);
  assert.equal(p.data.nda, false);
  assert.equal(p.data.service, "plumbing-takeoff");
});
test("parse: empty form lists required fields in order", () => {
  const p = parse(form());
  assert.equal(p.data, null);
  assert.deepEqual(Object.keys(p.errors), ["name", "email", "service"]);
  assert.equal(p.errors.name, "Enter your full name.");
  assert.equal(p.errors.email, "Enter your email address.");
  assert.equal(p.errors.service, "Choose the service you need.");
});
test("parse: trims, caps lengths, rejects line breaks in single-line fields", () => {
  assert.equal(parse(form({ ...good, name: "  Pat Lee  " })).data.name, "Pat Lee");
  assert.ok(parse(form({ ...good, name: "x".repeat(100) })).data);
  assert.ok(parse(form({ ...good, name: "x".repeat(101) })).errors.name);
  assert.ok(parse(form({ ...good, name: "Pat\r\nBcc: evil@x.com" })).errors.name);
  assert.ok(parse(form({ ...good, company: "Acme\nPlumbing" })).errors.company);
  assert.ok(parse(form({ ...good, location: "x".repeat(121) })).errors.location);
  assert.ok(parse(form({ ...good, name: "Pat\u202eLee" })).errors.name); // bidi override
  assert.ok(parse(form({ ...good, name: "Pat\u2028Lee" })).errors.name); // line separator
  assert.ok(parse(form({ ...good, name: "Pat\u0085Lee" })).errors.name); // C1 control (NEL)
  assert.ok(parse(form({ ...good, name: "Pat\u200fLee" })).errors.name); // right-to-left mark
  assert.ok(parse(form({ ...good, company: "Lee\u200bPlumbing" })).errors.company); // zero-width space
  assert.ok(parse(form({ ...good, notes: "a\u0085b" })).errors.notes); // the notes accept tab, LF and CR only
  for (const ok of ["Jos\u00e9 N\u00fa\u00f1ez", "Nguy\u1ec5n V\u0103n A", "\u674e\u96f7", "\u0645\u06cc\u200c\u062e\u0648\u0627\u0647\u0645", "O'Brien-Smith Jr."]) {
    assert.ok(!parse(form({ ...good, name: ok })).errors.name, `should accept ${JSON.stringify(ok)}`);
  }
});
test("parse: email rules", () => {
  for (const bad of ["a@b", "a b@c.com", "pat@example.com\r\nBcc: x@y.com", "@example.com", "pat@", "pat@example.c"]) {
    assert.ok(parse(form({ ...good, email: bad })).errors.email, `should reject ${JSON.stringify(bad)}`);
  }
  for (const ok of ["pat@example.com", "pat.lee+bids@sub.example.co", "  pat@example.com  "]) {
    assert.ok(!parse(form({ ...good, email: ok })).errors.email, `should accept ${JSON.stringify(ok)}`);
  }
  const long = "a".repeat(250) + "@x.com";
  assert.ok(parse(form({ ...good, email: long })).errors.email);
});
test("parse: phone rules", () => {
  for (const ok of ["", "(703) 721-8864", "703.721.8864", "+1 703 721 8864 ext 5", "703-721-8864 x12"]) {
    assert.ok(!parse(form({ ...good, phone: ok })).errors.phone, `should accept ${JSON.stringify(ok)}`);
  }
  for (const bad of ["abc", "n/a", "12345", "call me after 5", "1".repeat(41)]) {
    assert.ok(parse(form({ ...good, phone: bad })).errors.phone, `should reject ${JSON.stringify(bad)}`);
  }
});
test("parse: date rules", () => {
  for (const ok of ["", "2026-12-31", "2027-02-28"]) assert.ok(!parse(form({ ...good, dueDate: ok })).errors.dueDate, ok);
  for (const bad of ["2026-13-45", "0002-02-02", "2026-02-30", "12/31/2026", "2101-01-01", "1999-12-31", "tomorrow"]) {
    assert.ok(parse(form({ ...good, dueDate: bad })).errors.dueDate, `should reject ${bad}`);
  }
});
test("parse: plan link accepts http(s) only", () => {
  for (const ok of ["", "https://www.dropbox.com/s/abc/plans.zip?dl=0", "http://plans.example.com/job/12", "  https://drive.google.com/drive/folders/abc  "]) {
    assert.ok(!parse(form({ ...good, planLink: ok })).errors.planLink, `should accept ${JSON.stringify(ok)}`);
  }
  for (const bad of [
    "javascript:alert(1)", "ftp://files.example.com/a", "dropbox.com/s/x", "https://", "https://exa mple.com", "data:text/html;base64,AAAA",
    "https://example.com/\nBcc: x", "https://" + "a".repeat(500) + ".com",
    "https://dropbox.com@evil.example/plans", "https://user:pass@example.com/x", "https://example.com%2f@evil.example/", // a username makes the link read as another host
  ]) {
    assert.ok(parse(form({ ...good, planLink: bad })).errors.planLink, `should reject ${JSON.stringify(bad).slice(0, 60)}`);
  }
  // Stored normalized: a look-alike host (Greek omicron) shows as punycode, and ordinary links come through unchanged.
  assert.equal(parse(form({ ...good, planLink: "https://dropbοx.com/plans" })).data.planLink, "https://xn--dropbx-m0e.com/plans");
  assert.equal(parse(form({ ...good, planLink: "HTTPS://Drive.Google.com/drive/folders/abc?usp=sharing" })).data.planLink, "https://drive.google.com/drive/folders/abc?usp=sharing");
  assert.equal(parse(form({ ...good, planLink: "" })).data.planLink, "");
});
test("parse: notes length, control chars and link count", () => {
  assert.ok(!parse(form({ ...good, notes: "x".repeat(4000) })).errors.notes);
  assert.ok(parse(form({ ...good, notes: "x".repeat(4001) })).errors.notes);
  assert.ok(!parse(form({ ...good, notes: "Line one\nLine two\r\n\tindented" })).errors.notes);
  assert.ok(parse(form({ ...good, notes: "bad\u0000byte" })).errors.notes);
  const three = "https://a.com/x https://b.com/y www.c.com";
  assert.ok(!parse(form({ ...good, notes: three })).errors.notes);
  const four = three + " http://d.com";
  assert.match(parse(form({ ...good, notes: four })).errors.notes, /no more than 3 links/);
  assert.equal(core.countLinks("see https://a.com and HTTP://B.COM, www.c.com. plain.text.com"), 3);
});
test("parse: select values are checked against the lists", () => {
  assert.ok(parse(form({ ...good, service: "not-sure" })).data);
  assert.ok(parse(form({ ...good, service: "plumbing-estimating" })).data);
  assert.ok(parse(form({ ...good, service: "<script>" })).errors.service);
  assert.ok(parse(form({ ...good, role: "wizard" })).errors.role);
  assert.ok(parse(form({ ...good, projectType: "castle" })).errors.projectType);
  const p = parse(form({ ...good, role: "general-contractor", projectType: "healthcare" }));
  assert.equal(p.data.role, "general-contractor");
  assert.equal(p.data.projectType, "healthcare");
});
test("parse: checkbox, honeypot, file values, echo", () => {
  assert.equal(parse(form({ ...good, nda: "yes" })).data.nda, true);
  assert.equal(parse(form({ ...good, nda: "on" })).data.nda, false);
  assert.equal(parse(form(good)).honeypot, false);
  assert.equal(parse(form({ ...good, hp_q9x_field: "http://spam" })).honeypot, true);
  assert.equal(parse(form({ ...good, hp_q9x_field: "   " })).honeypot, false);
  assert.equal(parse(form({ ...good, website: "https://example.com" })).honeypot, false, "the old field name is no longer a trap");
  const fd = form(good);
  fd.set("company", new File(["x"], "plans.pdf"));
  assert.equal(parse(fd).data.company, "");
  const bad = parse(form({ name: "Pat", email: "nope", service: "plumbing-takeoff", notes: "keep me", nda: "yes" }));
  assert.equal(bad.values.name, "Pat");
  assert.equal(bad.values.notes, "keep me");
  assert.equal(bad.values.nda, "yes");
  assert.equal(parse(form({ ...good, notes: "z".repeat(9000) })).values.notes.length, 5000);
});
test("parse: tracking fields are cleaned and capped", () => {
  const p = parse(
    form({
      ...good,
      source: "/services/plumbing-takeoff\r\nX: y",
      landing: "/guides/how-to-do-a-plumbing-takeoff",
      referrer: "https://www.google.com/" + "a".repeat(400),
      utm: "utm_source=google&utm_medium=cpc&foo=bar&UTM_Campaign=Fall%20Bids&__proto__=1&utm_content=" + "z".repeat(300),
      startedAt: " 1760000000000 ",
    }),
  );
  assert.equal(p.source, "/services/plumbing-takeoff  X: y");
  assert.ok(p.referrer.length <= 300);
  assert.deepEqual(Object.keys(p.utm).sort(), ["utm_campaign", "utm_content", "utm_medium", "utm_source"]);
  assert.equal(p.utm.utm_campaign, "Fall Bids");
  assert.equal(p.utm.utm_content.length, 120);
  assert.equal(p.startedAt, "1760000000000");
  const many = Array.from({ length: 20 }, (_, i) => `utm_k${i}=v`).join("&");
  assert.equal(Object.keys(parse(form({ ...good, utm: many })).utm).length, 8);
  assert.equal(Object.getPrototypeOf(p.utm), Object.prototype);
});

/* ---------------- timing, origin, ip ---------------- */
test("timing", () => {
  const now = 1_800_000_000_000;
  assert.equal(core.checkTiming("", now), "missing");
  assert.equal(core.checkTiming("abc", now), "missing");
  assert.equal(core.checkTiming("12345", now), "missing");
  assert.equal(core.checkTiming(String(now - 1000), now), "fast");
  assert.equal(core.checkTiming(String(now - 2499), now), "fast");
  assert.equal(core.checkTiming(String(now - 2500), now), "ok");
  assert.equal(core.checkTiming(String(now - 3000), now), "ok");
  assert.equal(core.checkTiming(String(now - 24 * 3600_000), now), "ok");
  assert.equal(core.checkTiming(String(now - 24 * 3600_000 - 1), now), "ok"); // a tab left open overnight, or a clock a day behind ours, is still a real request
  assert.equal(core.checkTiming(String(now + 60_000), now), "ok"); // visitor clock ahead of ours
});
test("origin", () => {
  const h = (o) => new Headers(o);
  assert.equal(core.originOk(h({ host: "site.com" })), true); // no Origin header
  assert.equal(core.originOk(h({ host: "site.com", origin: "https://site.com" })), true);
  assert.equal(core.originOk(h({ host: "site.com", origin: "https://SITE.com" })), true);
  assert.equal(core.originOk(h({ host: "localhost:3100", origin: "http://localhost:3100" })), true);
  assert.equal(core.originOk(h({ host: "site.com", origin: "https://evil.com" })), false);
  assert.equal(core.originOk(h({ host: "site.com", origin: "https://site.com.evil.com" })), false);
  assert.equal(core.originOk(h({ host: "site.com", origin: "null" })), false);
  assert.equal(core.originOk(h({ host: "site.com", origin: "not a url" })), false);
  assert.equal(core.originOk(h({ origin: "https://site.com" })), false); // cannot compare
  assert.equal(core.originOk(h({ host: "internal:3000", "x-forwarded-host": "site.com", origin: "https://site.com" })), true);
  assert.equal(core.originOk(h({ host: "internal", "x-forwarded-host": "site.com, proxy.net", origin: "https://site.com" })), true);
});
test("client ip", () => {
  const h = (o) => new Headers(o);
  assert.equal(core.clientIp(h({})), null);
  assert.equal(core.clientIp(h({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" })), "203.0.113.9");
  assert.equal(core.clientIp(h({ "x-real-ip": "198.51.100.7", "x-forwarded-for": "203.0.113.9" })), "198.51.100.7");
  assert.equal(core.clientIp(h({ "x-vercel-forwarded-for": "192.0.2.1", "x-real-ip": "198.51.100.7" })), "192.0.2.1");
  assert.equal(core.clientIp(h({ "x-forwarded-for": "<script>" })), null);
  assert.equal(core.clientIp(h({ "x-real-ip": "garbage!", "x-forwarded-for": "203.0.113.9" })), "203.0.113.9");
});
test("client ip: IPv6 collapses to its /64, so rotating the host part does not get a fresh limiter key", () => {
  const h = (ip) => new Headers({ "x-real-ip": ip });
  assert.equal(core.clientIp(h("2001:DB8::1")), "2001:0db8:0000:0000::/64");
  const same = ["2001:db8:abcd:12::1", "2001:db8:abcd:12:ffff:1:2:3", "2001:DB8:ABCD:12:1::9", "2001:db8:abcd:0012::"];
  assert.deepEqual(new Set(same.map((ip) => core.clientIp(h(ip)))), new Set(["2001:0db8:abcd:0012::/64"]));
  assert.notEqual(core.clientIp(h("2001:db8:abcd:13::1")), core.clientIp(h("2001:db8:abcd:12::1"))); // the next /64 is a different subscriber
  assert.equal(core.clientIp(h("::ffff:203.0.113.9")), "::ffff:203.0.113.9"); // IPv4-mapped stays per address
  assert.equal(core.clientIp(h("203.0.113.9")), "203.0.113.9");
  for (const odd of ["::1", ":::", "1::2::3", "1:2:3:4:5:6:7:8:9"]) assert.match(core.clientIp(h(odd)), /::\/64$/); // odd shapes never throw
});

/* ---------------- email content ---------------- */
const lead = {
  name: "Pat <b>Lee</b>",
  email: "pat@example.com",
  phone: "(703) 555-0100",
  company: 'Lee & Sons "Plumbing"',
  role: "plumbing-contractor",
  roleLabel: "Plumbing contractor",
  service: "plumbing-takeoff",
  serviceLabel: "Plumbing takeoff",
  projectType: "commercial",
  projectTypeLabel: "Commercial",
  location: "Canton, OH",
  dueDate: "2026-12-04",
  planLink: "https://www.dropbox.com/s/abc?dl=0&x=\"y\"",
  notes: "Line one <script>alert(1)</script>\nLine two & more",
  nda: true,
  source: "/contact",
  landing: "/guides/how-to-do-a-plumbing-takeoff",
  referrer: "https://www.google.com/",
  utm: { utm_source: "google", utm_medium: "cpc" },
};
test("email: subject has no line breaks and values are escaped", () => {
  const e = leads.buildLeadEmail({ ...lead, company: "Lee\r\nBcc: x@y.com", name: "Pat" }, "id-1", "2026-11-17T10:00:00.000Z");
  assert.ok(!/[\r\n]/.test(e.subject));
  assert.equal(e.subject, "New plumbing quote request: Plumbing takeoff (Lee Bcc: x@y.com)");
  const full = leads.buildLeadEmail(lead, "id-1", "2026-11-17T10:00:00.000Z");
  assert.ok(!full.html.includes("<script>"));
  assert.ok(!full.html.includes("<b>Lee"));
  assert.ok(full.html.includes("Pat &lt;b&gt;Lee&lt;/b&gt;"));
  assert.ok(full.html.includes("Lee &amp; Sons &quot;Plumbing&quot;"));
  assert.ok(full.html.includes("Line one &lt;script&gt;alert(1)&lt;/script&gt;<br>Line two &amp; more"));
  assert.ok(full.html.includes('href="https://www.dropbox.com/s/abc?dl=0&amp;x=&quot;y&quot;"'));
  assert.ok(full.html.includes("December 4, 2026"));
  assert.ok(full.html.includes("Yes, send an NDA before files are shared"));
  assert.ok(full.html.includes("utm_source"));
  assert.ok(full.text.includes("Notes:\nLine one <script>alert(1)</script>\nLine two & more"));
  assert.ok(full.text.includes("Lead ID: id-1"));
});
test("email: empty optional fields are left out", () => {
  const e = leads.buildLeadEmail({ ...lead, phone: "", company: "", role: "", roleLabel: "", planLink: "", notes: "", nda: false, dueDate: "", utm: {}, referrer: "" }, "i", "t");
  assert.ok(!e.text.includes("Phone:"));
  assert.ok(!e.text.includes("Company:"));
  assert.ok(!e.text.includes("Notes"));
  assert.ok(!e.text.includes("NDA first"));
  assert.ok(e.subject.endsWith("(Pat <b>Lee</b>)")); // falls back to the name
});

/* ---------------- delivery ---------------- */
const realFetch = globalThis.fetch;
const realError = console.error;
const realInfo = console.info;
const realWarn = console.warn;
const quiet = () => {
  console.error = () => {};
  console.info = () => {};
  console.warn = () => {};
};
const loud = () => {
  console.error = realError;
  console.info = realInfo;
  console.warn = realWarn;
};
const setEnv = (o) => {
  for (const k of ["RESEND_API_KEY", "LEAD_FROM_EMAIL", "LEAD_TO_EMAIL", "LEAD_WEBHOOK_URL"]) delete process.env[k];
  Object.assign(process.env, o);
};
const mockFetch = (handler) => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return handler(String(url), init, calls.length);
  };
  return calls;
};
const ok = () => new Response('{"id":"x"}', { status: 200 });
const status = (n, body = "") => new Response(body, { status: n });

test("deliver: email and webhook both fire with the right payloads", async () => {
  quiet();
  setEnv({ RESEND_API_KEY: "re_test", LEAD_FROM_EMAIL: "JU <quotes@example.com>", LEAD_TO_EMAIL: "a@example.com, b@example.com", LEAD_WEBHOOK_URL: "https://hooks.example.com/abc" });
  process.env.NODE_ENV = "production";
  const calls = mockFetch(() => ok());
  const r = await leads.deliverLead(lead);
  loud();
  assert.equal(r.ok, true);
  assert.equal(calls.length, 2);
  const resend = calls.find((c) => c.url === "https://api.resend.com/emails");
  const hook = calls.find((c) => c.url === "https://hooks.example.com/abc");
  assert.equal(resend.init.method, "POST");
  assert.equal(resend.init.headers.Authorization, "Bearer re_test");
  assert.equal(resend.init.headers["Idempotency-Key"], `lead-${r.id}`);
  const body = JSON.parse(resend.init.body);
  assert.equal(body.from, "JU <quotes@example.com>");
  assert.deepEqual(body.to, ["a@example.com", "b@example.com"]);
  assert.equal(body.reply_to, "pat@example.com");
  assert.ok(body.subject.startsWith("New plumbing quote request: Plumbing takeoff"));
  assert.ok(body.html && body.text);
  assert.equal(hook.init.headers["Idempotency-Key"], `lead-${r.id}`);
  const hb = JSON.parse(hook.init.body);
  assert.equal(hb.id, r.id);
  assert.equal(hb.site, "JU Plumbing Takeoff");
  assert.ok(!Number.isNaN(Date.parse(hb.timestamp)));
  assert.equal(hb.email, "pat@example.com");
  assert.equal(hb.nda, true);
  assert.deepEqual(hb.utm, { utm_source: "google", utm_medium: "cpc" });
});
test("deliver: succeeds when one channel fails, logs it", async () => {
  const logged = [];
  console.error = (...a) => logged.push(a.join(" "));
  console.info = () => {};
  setEnv({ RESEND_API_KEY: "re_test", LEAD_FROM_EMAIL: "q@example.com", LEAD_WEBHOOK_URL: "https://hooks.example.com/abc" });
  process.env.NODE_ENV = "production";
  const calls = mockFetch((url) => (url.includes("resend") ? status(403, '{"message":"domain not verified"}') : ok()));
  const r = await leads.deliverLead(lead);
  loud();
  assert.equal(r.ok, true);
  assert.equal(calls.filter((c) => c.url.includes("resend")).length, 1, "403 is not retried");
  assert.ok(logged.some((l) => l.includes("email delivery failed") && l.includes("403") && l.includes("domain not verified")));
  assert.ok(logged.every((l) => !l.includes("pat@example.com")), "no personal data in logs");
});
test("deliver: retries 429/5xx once and reuses the idempotency key", async () => {
  quiet();
  setEnv({ RESEND_API_KEY: "re_test", LEAD_FROM_EMAIL: "q@example.com" });
  process.env.NODE_ENV = "production";
  const calls = mockFetch((_u, _i, n) => (n === 1 ? status(429) : ok()));
  const r = await leads.deliverLead(lead);
  loud();
  assert.equal(r.ok, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].init.headers["Idempotency-Key"], calls[1].init.headers["Idempotency-Key"]);
});
test("deliver: network errors retry once, then fail", async () => {
  quiet();
  setEnv({ LEAD_WEBHOOK_URL: "https://hooks.example.com/abc" });
  process.env.NODE_ENV = "production";
  const calls = mockFetch(() => {
    throw new TypeError("fetch failed");
  });
  const r = await leads.deliverLead(lead);
  loud();
  assert.equal(r.ok, false);
  assert.equal(calls.length, 2);
  assert.equal(r.channels[0].channel, "webhook");
});
test("deliver: every channel failing is a failure", async () => {
  quiet();
  setEnv({ RESEND_API_KEY: "re_test", LEAD_FROM_EMAIL: "q@example.com", LEAD_WEBHOOK_URL: "https://hooks.example.com/abc" });
  process.env.NODE_ENV = "production";
  mockFetch(() => status(500));
  const r = await leads.deliverLead(lead);
  loud();
  assert.equal(r.ok, false);
  assert.equal(r.channels.length, 2);
});
test("deliver: nothing configured is logged in development and a failure in production", async () => {
  quiet();
  setEnv({});
  mockFetch(() => ok());
  process.env.NODE_ENV = "development";
  const dev = await leads.deliverLead(lead);
  assert.equal(dev.ok, true);
  assert.equal(dev.channels[0].channel, "console");
  process.env.NODE_ENV = "production";
  const prod = await leads.deliverLead(lead);
  loud();
  assert.equal(prod.ok, false);
  assert.deepEqual(prod.channels, []);
});
test("deliver: a key without a sender is a clear misconfiguration, not a silent drop", async () => {
  const logged = [];
  console.error = (...a) => logged.push(a.join(" "));
  setEnv({ RESEND_API_KEY: "re_test" });
  process.env.NODE_ENV = "production";
  mockFetch(() => ok());
  const r = await leads.deliverLead(lead);
  loud();
  assert.equal(r.ok, false);
  assert.ok(logged.some((l) => l.includes("must both be set")));
});
test("deliver: LEAD_TO_EMAIL defaults to the site address", async () => {
  quiet();
  setEnv({ RESEND_API_KEY: "re_test", LEAD_FROM_EMAIL: "q@example.com" });
  process.env.NODE_ENV = "production";
  const calls = mockFetch(() => ok());
  await leads.deliverLead(lead);
  loud();
  assert.deepEqual(JSON.parse(calls[0].init.body).to, ["info@juestimating.com"]);
});

/* ---------------- the server action, end to end with stubs ---------------- */
const { submitQuote } = await load("app/actions/quote.ts");
const initial = cfg.INITIAL_STATE;
const hdrs = (extra = {}) => {
  globalThis.__testHeaders = new Headers({ host: "localhost:3100", origin: "http://localhost:3100", "x-real-ip": "203.0.113.10", ...extra });
};
const submit = async (fields, prev = initial) => {
  try {
    return await submitQuote(prev, form(fields));
  } catch (e) {
    if (e?.digest === "NEXT_REDIRECT") return { redirect: e.url };
    throw e;
  }
};
const filled = (extra = {}) => ({ ...good, startedAt: String(Date.now() - 6000), source: "/contact", ...extra });

test("action: valid submission redirects to /thank-you (dev mode logs the lead)", async () => {
  hdrs({ "x-real-ip": "198.51.100.1" });
  setEnv({});
  process.env.NODE_ENV = "development";
  const info = [];
  console.info = (...a) => info.push(a);
  const r = await submit(filled({ email: "valid1@example.com", notes: "hello", nda: "yes", role: "general-contractor", projectType: "healthcare" }));
  loud();
  assert.deepEqual(r, { redirect: "/thank-you" });
  assert.equal(info.length, 1);
  const sent = info[0][1];
  assert.equal(sent.serviceLabel, "Plumbing takeoff");
  assert.equal(sent.roleLabel, "General contractor");
  assert.equal(sent.projectTypeLabel, "Healthcare");
  assert.equal(sent.nda, true);
  assert.equal(sent.source, "/contact");
});
test("action: honeypot looks successful and sends nothing", async () => {
  hdrs({ "x-real-ip": "198.51.100.2" });
  setEnv({ LEAD_WEBHOOK_URL: "https://hooks.example.com/abc" });
  process.env.NODE_ENV = "production";
  const calls = mockFetch(() => ok());
  quiet();
  const r = await submit(filled({ email: "bot@example.com", hp_q9x_field: "http://spam.example" }));
  loud();
  assert.deepEqual(r, { redirect: "/thank-you" });
  assert.equal(calls.length, 0);
});
test("action: validation errors come back with the visitor's values", async () => {
  hdrs({ "x-real-ip": "198.51.100.3" });
  const r = await submit(filled({ email: "nope", notes: "keep this text", company: "Acme" }), { ...initial, attempt: 2 });
  assert.equal(r.status, "error");
  assert.equal(r.reason, "invalid");
  assert.equal(r.attempt, 3);
  assert.ok(r.errors.email);
  assert.equal(r.values.notes, "keep this text");
  assert.equal(r.values.company, "Acme");
  assert.equal(r.values.email, "nope");
});
test("action: timer checks", async () => {
  hdrs({ "x-real-ip": "198.51.100.4" });
  const fast = await submit(filled({ email: "fast@example.com", startedAt: String(Date.now() - 500) }));
  assert.equal(fast.reason, "fast");
  const missing = await submit(filled({ email: "miss@example.com", startedAt: "" }));
  assert.equal(missing.reason, "unverified");
  assert.match(missing.message, /\(703\) 721-8864/);
  assert.match(missing.message, /info@juestimating\.com/);
  const old = await submit(filled({ email: "stale@example.com", startedAt: String(Date.now() - 25 * 3600_000) }));
  assert.deepEqual(old, { redirect: "/thank-you" }, "a form left open overnight, or a clock a day behind ours, must not lock a visitor out");
  const future = await submit(filled({ email: "future@example.com", startedAt: String(Date.now() + 120_000) }));
  assert.deepEqual(future, { redirect: "/thank-you" }, "a clock running ahead must not lock a visitor out");
});
test("action: a different Origin is refused", async () => {
  hdrs({ origin: "https://evil.example", "x-real-ip": "198.51.100.5" });
  const warned = [];
  console.warn = (...a) => warned.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
  const r = await submit(filled({ email: "csrf@example.com" }));
  loud();
  assert.ok(warned.some((w) => w.includes("origin check failed") && w.includes("evil.example")), "the refusal is logged");
  assert.ok(warned.every((w) => !w.includes("csrf@example.com")), "no personal data in logs");
  assert.equal(r.status, "error");
  assert.equal(r.reason, "failed");
  assert.match(r.message, /We could not send your request\. Please call \(703\) 721-8864 or email info@juestimating\.com\./);
});
test("action: 5 per IP per hour, then a clear message", async () => {
  hdrs({ "x-real-ip": "198.51.100.6" });
  setEnv({});
  process.env.NODE_ENV = "development";
  quiet();
  const results = [];
  for (let i = 0; i < 6; i++) results.push(await submit(filled({ email: `ip-limit-${i}@example.com` })));
  loud();
  assert.deepEqual(results.slice(0, 5), Array(5).fill({ redirect: "/thank-you" }));
  assert.equal(results[5].reason, "limited");
  assert.match(results[5].message, /several requests/);
  assert.match(results[5].message, /about \d+ minutes/);
  // a different IP is unaffected
  hdrs({ "x-real-ip": "198.51.100.66" });
  quiet();
  const other = await submit(filled({ email: "ip-limit-other@example.com" }));
  loud();
  assert.deepEqual(other, { redirect: "/thank-you" });
});
test("action: 3 per email per hour, across IPs, case-insensitive", async () => {
  setEnv({});
  process.env.NODE_ENV = "development";
  quiet();
  const results = [];
  for (let i = 0; i < 4; i++) {
    hdrs({ "x-real-ip": `192.0.2.${100 + i}` });
    results.push(await submit(filled({ email: i % 2 ? "Same@Example.com" : "same@example.com" })));
  }
  loud();
  assert.deepEqual(results.slice(0, 3), Array(3).fill({ redirect: "/thank-you" }));
  assert.equal(results[3].reason, "limited");
});
test("action: a failed delivery does not use up the visitor's allowance", async () => {
  hdrs({ "x-real-ip": "198.51.100.7" });
  setEnv({ LEAD_WEBHOOK_URL: "https://hooks.example.com/abc" });
  process.env.NODE_ENV = "production";
  mockFetch(() => status(400));
  quiet();
  const outage = [];
  for (let i = 0; i < 7; i++) outage.push(await submit(filled({ email: "outage@example.com" })));
  assert.ok(outage.every((r) => r.status === "error" && r.reason === "failed"), "never rate limited while we are failing");
  assert.match(outage[0].message, /We could not send your request/);
  assert.equal(outage[0].values.email, "outage@example.com");
  // service comes back: the same visitor can still send
  mockFetch(() => ok());
  const back = await submit(filled({ email: "outage@example.com" }));
  loud();
  assert.deepEqual(back, { redirect: "/thank-you" });
});
test("action: a plumbing sample request is a valid service and reads that way in the lead email", async () => {
  hdrs({ "x-real-ip": "198.51.100.9" });
  setEnv({});
  process.env.NODE_ENV = "development";
  const info = [];
  console.info = (...a) => info.push(a);
  const r = await submit(filled({ email: "sample@example.com", service: "sample-request", company: "Lee Plumbing" }));
  loud();
  assert.deepEqual(r, { redirect: "/thank-you" });
  const sent = info[0][1];
  assert.equal(sent.service, "sample-request");
  assert.equal(sent.serviceLabel, "Request a plumbing sample");
  assert.equal(leads.buildLeadEmail(sent, "id-1", "t").subject, "New plumbing quote request: Request a plumbing sample (Lee Plumbing)");
});
test("action: a call with the wrong argument shape gets a plain refusal instead of throwing", async () => {
  for (const bad of [undefined, null, "oops", {}, { get: 1 }]) {
    const r = await submitQuote(initial, bad);
    assert.equal(r.status, "error");
    assert.equal(r.reason, "invalid");
    assert.equal(r.attempt, 1);
    assert.deepEqual(r.errors, {});
  }
});
test("action: tampered previous state cannot break the attempt counter", async () => {
  hdrs({ "x-real-ip": "198.51.100.8" });
  for (const prev of [null, undefined, { attempt: "9" }, { attempt: NaN }, { attempt: -5 }, { attempt: 1e9 }]) {
    const r = await submit(filled({ email: "nope" }), prev);
    assert.equal(r.status, "error");
    assert.ok(Number.isInteger(r.attempt) && r.attempt >= 1 && r.attempt <= 1001, `attempt ${r.attempt}`);
  }
});

process.on("exit", () => {
  globalThis.fetch = realFetch;
});
