/**
 * Lead delivery for the quote form: email through Resend and/or a JSON webhook, sent in parallel.
 *
 * Environment variables read in this file:
 *   RESEND_API_KEY    Resend API key. Email is attempted only when this AND LEAD_FROM_EMAIL are both set.
 *   LEAD_FROM_EMAIL   Sender on a domain verified in Resend, e.g. "JU Plumbing Takeoff <quotes@example.com>".
 *   LEAD_TO_EMAIL     Where leads land. One address or a comma-separated list. Defaults to SITE.email.
 *   LEAD_WEBHOOK_URL  Optional. Every lead is POSTed here as JSON (CRM, Zapier, Make, a Slack relay).
 *   NODE_ENV          Set by Next.js. With no channel configured, "production" fails visibly so the visitor is
 *                     told to call or email, and any other value logs the lead to the server console and
 *                     reports success so local work is not blocked.
 *
 * A lead counts as delivered when at least one configured channel accepts it. A channel that fails is
 * logged (never with personal data) so a bad key or an unverified sender shows up in the server logs.
 */

import { SITE } from "./site";
import { formatDate } from "./utils";

export type Lead = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  roleLabel: string;
  /** Service page slug, "sample-request" or "not-sure". */
  service: string;
  serviceLabel: string;
  projectType: string;
  projectTypeLabel: string;
  location: string;
  /** ISO date (YYYY-MM-DD) or "". */
  dueDate: string;
  planLink: string;
  notes: string;
  nda: boolean;
  /** Page the form was on (the `source` prop). */
  source: string;
  /** Path the visit started on. */
  landing: string;
  referrer: string;
  utm: Record<string, string>;
};

export type ChannelResult = { channel: "email" | "webhook" | "console"; ok: boolean; error?: string };
export type DeliveryResult = { ok: boolean; id: string; channels: ChannelResult[] };

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 4000;
const RETRY_DELAY_MS = 300;

function readConfig() {
  const key = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.LEAD_FROM_EMAIL?.trim() ?? "";
  const to = (process.env.LEAD_TO_EMAIL?.trim() || SITE.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    email: key && from && to.length ? { key, from, to } : null,
    emailHalfSet: Boolean(key) !== Boolean(from),
    webhook: process.env.LEAD_WEBHOOK_URL?.trim() || null,
  };
}

/** Sends the lead to every configured channel at once. Never throws. */
export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const id = crypto.randomUUID();
  const at = new Date().toISOString();
  const cfg = readConfig();
  const jobs: Promise<ChannelResult>[] = [];

  const email = cfg.email;
  if (email) jobs.push(run("email", () => sendEmail(email, lead, id, at)));
  const webhook = cfg.webhook;
  if (webhook) jobs.push(run("webhook", () => sendWebhook(webhook, lead, id, at)));
  if (cfg.emailHalfSet) {
    console.error("[leads] RESEND_API_KEY and LEAD_FROM_EMAIL must both be set to send email. Email is skipped.");
  }

  if (jobs.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[leads] No delivery channel configured. Development mode: lead ${id} is logged, not sent.`, lead);
      return { ok: true, id, channels: [{ channel: "console", ok: true }] };
    }
    console.error(
      "[leads] No delivery channel configured. Set RESEND_API_KEY and LEAD_FROM_EMAIL, and/or LEAD_WEBHOOK_URL. A lead was NOT delivered.",
    );
    return { ok: false, id, channels: [] };
  }

  const channels = await Promise.all(jobs);
  for (const c of channels) {
    if (!c.ok) console.error(`[leads] ${c.channel} delivery failed for lead ${id}: ${c.error}`);
  }
  return { ok: channels.some((c) => c.ok), id, channels };
}

async function run(channel: "email" | "webhook", job: () => Promise<void>): Promise<ChannelResult> {
  try {
    await job();
    return { channel, ok: true };
  } catch (err) {
    return { channel, ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function sendEmail(cfg: { key: string; from: string; to: string[] }, lead: Lead, id: string, at: string) {
  const { subject, html, text } = buildLeadEmail(lead, id, at);
  await postJson(
    RESEND_URL,
    { from: cfg.from, to: cfg.to, reply_to: lead.email, subject, html, text },
    // Same key on a retry, so Resend does not send the lead twice if the first attempt got through.
    { Authorization: `Bearer ${cfg.key}`, "Idempotency-Key": `lead-${id}` },
  );
}

async function sendWebhook(url: string, lead: Lead, id: string, at: string) {
  // Same key on the retry, so a receiver that honors it does not create the lead twice.
  await postJson(url, { id, timestamp: at, site: SITE.name, ...lead }, { "Idempotency-Key": `lead-${id}` });
}

type Attempt = { ok: true } | { ok: false; retry: boolean; error: string };

async function attempt(url: string, init: RequestInit): Promise<Attempt> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (res.ok) return { ok: true };
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    return { ok: false, retry: res.status === 429 || res.status >= 500, error: `HTTP ${res.status} ${detail}`.trim() };
  } catch (err) {
    // Network failure or timeout: worth one more try.
    return { ok: false, retry: true, error: err instanceof Error ? `${err.name}: ${err.message}` : "request failed" };
  }
}

/** POSTs JSON. Retries once after a short pause on a network error, a timeout, a 429 or a 5xx. */
async function postJson(url: string, body: unknown, headers: Record<string, string> = {}): Promise<void> {
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
  let result = await attempt(url, init);
  if (!result.ok && result.retry) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    result = await attempt(url, init);
  }
  if (!result.ok) throw new Error(result.error);
}

/* ---------- email content ---------- */

type Row = { label: string; value: string; as?: "link" | "multiline" };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Whitespace in JavaScript regexes includes CR, LF and the Unicode line and paragraph separators, so this leaves one clean line. */
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

function leadRows(lead: Lead): Row[] {
  const rows: Row[] = [
    { label: "Name", value: lead.name },
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone },
    { label: "Company", value: lead.company },
    { label: "I am a", value: lead.roleLabel },
    { label: "Service", value: lead.serviceLabel },
    { label: "Project type", value: lead.projectTypeLabel },
    { label: "Project location", value: lead.location },
    { label: "Bid or due date", value: lead.dueDate ? formatDate(lead.dueDate) : "" },
    { label: "Plan link", value: lead.planLink, as: "link" },
    { label: "NDA first", value: lead.nda ? "Yes, send an NDA before files are shared" : "" },
    { label: "Notes", value: lead.notes, as: "multiline" },
  ];
  return rows.filter((r) => r.value);
}

function sourceRows(lead: Lead, id: string, at: string): Row[] {
  const rows: Row[] = [
    { label: "Form page", value: lead.source },
    { label: "Landing page", value: lead.landing },
    { label: "Referrer", value: lead.referrer },
    ...Object.entries(lead.utm).map(([label, value]) => ({ label, value })),
    { label: "Lead ID", value: id },
    { label: "Received", value: at },
  ];
  return rows.filter((r) => r.value);
}

const CELL = "padding:8px 12px;border:1px solid #e3e7f1;vertical-align:top;font-size:14px;line-height:1.5";

function cell(r: Row): string {
  if (r.as === "link") return `<a href="${esc(r.value)}" style="color:#1f1b50">${esc(r.value)}</a>`;
  if (r.as === "multiline") return esc(r.value).replace(/\r\n|\r|\n/g, "<br>");
  return esc(r.value);
}

function table(rows: Row[]): string {
  const body = rows
    .map((r) => `<tr><th align="left" style="${CELL};width:150px;background:#f4f6fb;color:#1f1b50">${esc(r.label)}</th><td style="${CELL}">${cell(r)}</td></tr>`)
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">${body}</table>`;
}

const plainRows = (rows: Row[]) =>
  rows.map((r) => (r.as === "multiline" && /[\r\n]/.test(r.value) ? `${r.label}:\n${r.value}` : `${r.label}: ${r.value}`));

/** Subject, HTML table and plain-text body. Every visitor-supplied value is HTML-escaped; the subject has no line breaks. */
export function buildLeadEmail(lead: Lead, id: string, at: string): { subject: string; html: string; text: string } {
  const subject = oneLine(`New plumbing quote request: ${lead.serviceLabel || "service not chosen"} (${lead.company || lead.name})`).slice(0, 200);
  const intro = `New plumbing quote request from ${SITE.name}. Reply to this email to answer ${lead.name} directly.`;
  const fields = leadRows(lead);
  const source = sourceRows(lead, id, at);
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1a1a3a">` +
    `<p style="margin:0 0 14px">${esc(intro)}</p>${table(fields)}` +
    `<p style="margin:22px 0 8px;font-weight:700;color:#1f1b50">Source</p>${table(source)}</div>`;
  const text = [intro, "", ...plainRows(fields), "", "Source", ...plainRows(source)].join("\n");
  return { subject, html, text };
}
