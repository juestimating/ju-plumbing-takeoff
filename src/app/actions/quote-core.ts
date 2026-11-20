/**
 * Pure helpers for the quote server action: field validation (Zod 4) and the spam checks. No Next.js
 * imports and no side effects, so each piece can be tested on its own. This is NOT a "use server" file,
 * so nothing here becomes a public endpoint.
 */

import { z } from "zod";
import {
  PROJECT_TYPE_OPTIONS,
  QUOTE_FIELDS,
  QUOTE_LIMITS as L,
  ROLE_OPTIONS,
  type FieldErrors,
  type Option,
  type QuoteField,
  type QuoteValues,
} from "@/components/forms/quote-config";

/** Anything quicker than this after the form appeared is a script, not a person filling in fields. */
export const MIN_FILL_MS = 2500;
export const MAX_NOTE_LINKS = 3;
/** Values echoed back to re-populate the form are capped so a huge payload is never reflected in full. */
const ECHO_MAX = 5000;

/**
 * C0 and C1 controls (CR, LF and NEL included), DEL, line and paragraph separators, and invisible formatting characters:
 * soft hyphen, Arabic letter mark, zero-width space, LRM and RLM, bidi embeddings, overrides and isolates, word joiner,
 * BOM and tag characters. Zero-width joiner and non-joiner stay allowed because Persian, Indic and emoji names use them.
 */
const SINGLE_LINE_BAD = new RegExp("[\\p{Cc}\\p{Zl}\\p{Zp}\\u00ad\\u061c\\u200b\\u200e\\u200f\\u202a-\\u202e\\u2060-\\u206f\\ufeff\\u{e0000}-\\u{e007f}]", "u");
/** The same, except that tab, LF and CR are fine in the notes. */
const MULTI_LINE_BAD = new RegExp("[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f-\\u009f\\u2028\\u2029\\u00ad\\u061c\\u200b\\u200e\\u200f\\u202a-\\u202e\\u2060-\\u206f\\ufeff\\u{e0000}-\\u{e007f}]", "u");
const META_BAD = new RegExp(SINGLE_LINE_BAD.source, "gu");

export type QuoteData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  service: string;
  projectType: string;
  location: string;
  dueDate: string;
  planLink: string;
  notes: string;
  nda: boolean;
};

export type ParsedQuote = {
  /** What the visitor typed (length-capped), sent back so the form can re-populate after an error. */
  values: QuoteValues;
  errors: FieldErrors;
  /** Cleaned data when every field is valid, otherwise null. */
  data: QuoteData | null;
  /** True when the hidden "hp_q9x_field" field was filled in. Only automated form fillers do that. */
  honeypot: boolean;
  startedAt: string;
  source: string;
  landing: string;
  referrer: string;
  utm: Record<string, string>;
};

/** Visitor-supplied web addresses in a block of text. Used to turn away link spam. */
export function countLinks(text: string): number {
  return (text.match(/(?:https?:\/\/|www\.)\S+/gi) ?? []).length;
}

const digitCount = (v: string) => v.replace(/\D/g, "").length;

function phoneOk(v: string): boolean {
  if (v === "") return true;
  const digits = digitCount(v);
  return /^[\d\s+().\-#,;*xXeEtT]+$/.test(v) && digits >= 7 && digits <= 20;
}

function dateOk(v: string): boolean {
  if (v === "") return true;
  // A year typed as 0002 is the usual date-input slip, so keep the range sane.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || v < "2000-01-01" || v > "2100-12-31") return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v);
}

/** Trimmed single-line text with a maximum length. Pass `required` to demand a value and set its message. */
function line(label: string, max: number, required?: string) {
  let s = z.string().trim();
  if (required) s = s.min(1, required);
  return s
    .max(max, `${label} must be ${max} characters or fewer.`)
    .refine((v) => !SINGLE_LINE_BAD.test(v), `${label} cannot contain line breaks or control characters.`);
}

const httpUrl = z.httpUrl();

/** A plan link must not carry a username or password: "https://dropbox.com@evil.example" reads as dropbox.com but goes to evil.example. */
function hasNoCredentials(v: string): boolean {
  try {
    const u = new URL(v);
    return u.username === "" && u.password === "";
  } catch {
    return false;
  }
}

/** URL.href: lower-case host, punycode for non-ASCII hosts, percent-encoded spaces and invisible characters. */
function normalizeUrl(v: string): string {
  try {
    return v === "" ? v : new URL(v).href;
  } catch {
    return v;
  }
}

/** Untrusted tracking text: control characters become spaces, then trimmed and cut to length. */
const clean = (s: string, max: number) => s.replace(META_BAD, " ").trim().slice(0, max);

/** A FormData entry as a string. A file or a missing field reads as "". */
const str = (fd: FormData, key: string): string => {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
};

/** The form sends utm_* values as one query string. Keep at most 8 well-formed keys. */
function parseUtm(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (const [key, value] of new URLSearchParams(raw.slice(0, 600))) {
      if (/^utm_[a-z0-9_]{1,30}$/i.test(key) && Object.keys(out).length < 8) out[key.toLowerCase()] = clean(value, 120);
    }
  } catch {
    // tracking is best effort
  }
  return out;
}

/** Builds the parser once per process. `services` is the list of service values the select may send. */
export function makeQuoteParser(services: readonly Option[]) {
  const serviceValues = new Set(services.map((s) => s.value));
  const roleValues = new Set(ROLE_OPTIONS.map((o) => o.value));
  const typeValues = new Set(PROJECT_TYPE_OPTIONS.map((o) => o.value));
  const oneOf = (allowed: Set<string>) =>
    z.string().trim().refine((v) => v === "" || allowed.has(v), "Choose one of the options.");

  const schema = z.object({
    name: line("Name", L.name, "Enter your full name."),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email address.")
      .max(L.email, `Email must be ${L.email} characters or fewer.`)
      .regex(z.regexes.email, "Enter a valid email address, like name@company.com."),
    phone: line("Phone", L.phone).refine(phoneOk, "Enter a phone number with area code, or leave it blank."),
    company: line("Company", L.company),
    role: oneOf(roleValues),
    service: z
      .string()
      .trim()
      .refine((v) => serviceValues.has(v), "Choose the service you need."),
    projectType: oneOf(typeValues),
    location: line("Project location", L.location),
    dueDate: z.string().trim().refine(dateOk, "Enter a valid date, or leave it blank."),
    planLink: z
      .string()
      .trim()
      .max(L.planLink, `Plan link must be ${L.planLink} characters or fewer.`)
      .refine((v) => !SINGLE_LINE_BAD.test(v), "Plan link cannot contain line breaks or control characters.")
      .refine(
        (v) => v === "" || httpUrl.safeParse(v).success,
        "Enter a full web address that starts with https://, or leave it blank.",
      )
      .refine((v) => v === "" || hasNoCredentials(v), "Remove the username and password from the web address.")
      // Stored normalized, so a look-alike host shows as xn-- in the email instead of passing for a trusted site.
      .transform(normalizeUrl),
    notes: z
      .string()
      .trim()
      .max(L.notes, `Notes must be ${L.notes} characters or fewer.`)
      .refine((v) => !MULTI_LINE_BAD.test(v), "Notes contain characters we cannot accept.")
      .refine(
        (v) => countLinks(v) <= MAX_NOTE_LINKS,
        `Please include no more than ${MAX_NOTE_LINKS} links in your notes. For a large set, put one link in the plan link field.`,
      ),
  });

  return function parseQuote(fd: FormData): ParsedQuote {
    const nda = str(fd, "nda") === "yes";
    const input: Record<string, string> = {};
    const echoed: Record<string, string> = {};
    for (const field of QUOTE_FIELDS) {
      if (field === "nda") continue;
      const v = str(fd, field);
      input[field] = v;
      echoed[field] = v.slice(0, ECHO_MAX);
    }

    const result = schema.safeParse(input);
    const errors: FieldErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        // Checks run in order, so the first issue per field is the most basic one.
        if (typeof key === "string" && !(key in errors)) errors[key as QuoteField] = issue.message;
      }
    }

    return {
      values: { ...echoed, nda: nda ? "yes" : "" } as QuoteValues,
      errors,
      data: result.success ? { ...result.data, nda } : null,
      honeypot: str(fd, "hp_q9x_field").trim() !== "",
      startedAt: str(fd, "startedAt").trim(),
      source: clean(str(fd, "source"), 200),
      landing: clean(str(fd, "landing"), 200),
      referrer: clean(str(fd, "referrer"), 300),
      utm: parseUtm(str(fd, "utm")),
    };
  };
}

export type Timing = "ok" | "missing" | "fast";

/**
 * Judges how long the form sat open. `startedAt` is the visitor's own clock (epoch ms, written when the form
 * mounted), so it is a speed bump for scripts, not proof: anyone can forge it. A timestamp in the future means
 * the visitor's clock runs ahead of ours; that cannot be judged, so it passes rather than lock a real person out.
 */
export function checkTiming(startedAt: string, now = Date.now()): Timing {
  if (!/^\d{10,16}$/.test(startedAt)) return "missing";
  const age = now - Number(startedAt);
  // No "stale" check: the timestamp comes from the visitor's own clock, so a device clock a day or more behind ours (dead clock
  // battery, wrong date) would be refused on every attempt, and a form left open overnight is still a real request.
  if (age >= 0 && age < MIN_FILL_MS) return "fast";
  return "ok";
}

type HeaderReader = { get(name: string): string | null };

/**
 * Defense in depth next to the Origin check Next.js already runs for server actions. When the browser sends
 * an Origin header it must name the host that received the request. A missing Origin passes: browsers always
 * send one on a form POST, so only non-browser clients omit it, and the other checks cover those.
 */
export function originOk(h: HeaderReader): boolean {
  const origin = h.get("origin");
  if (!origin) return true;
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0]?.trim().toLowerCase();
  try {
    return Boolean(host) && new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

/** One limiter key per IPv6 /64 (the usual single-subscriber allocation); IPv4 stays per address. */
function ipKey(ip: string): string {
  if (!ip.includes(":") || ip.includes(".")) return ip; // IPv4 and IPv4-mapped IPv6 stay per address
  const [head = "", tail = ""] = ip.split("::");
  const a = head ? head.split(":") : [];
  const b = ip.includes("::") && tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...a, ...Array(Math.max(0, 8 - a.length - b.length)).fill("0"), ...b] : a;
  return `${groups.slice(0, 4).map((g) => g.padStart(4, "0")).join(":")}::/64`;
}

/**
 * Best-effort client key for rate limiting: the client IP, with IPv6 addresses collapsed to their /64. Vercel documents
 * x-vercel-forwarded-for, x-real-ip and x-forwarded-for as the real client address and overwrites values a client sends.
 * Behind another proxy, make sure it sets one of these headers itself, or the per-IP limit can be dodged by spoofing.
 */
export function clientIp(h: HeaderReader): string | null {
  for (const raw of [h.get("x-vercel-forwarded-for"), h.get("x-real-ip"), h.get("x-forwarded-for")]) {
    const first = raw?.split(",")[0]?.trim();
    if (first && /^[0-9a-f:.]{3,45}$/i.test(first)) return ipKey(first.toLowerCase());
  }
  return null;
}
