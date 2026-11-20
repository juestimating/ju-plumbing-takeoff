"use server";

/**
 * Quote form server action. Order of checks: Origin, honeypot, field validation, form timer, rate limit,
 * delivery. Success redirects to /thank-you. Any failure returns state for the form to show, with the
 * visitor's values, so nothing they typed is lost.
 *
 * Only `submitQuote` may be exported from this file: every export of a "use server" module is a public
 * endpoint. Helpers live in ./quote-core, which is a plain module.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  INITIAL_STATE,
  PROJECT_TYPE_OPTIONS,
  ROLE_OPTIONS,
  type FieldErrors,
  type Option,
  type QuoteReason,
  type QuoteState,
} from "@/components/forms/quote-config";
import { SERVICE_OPTIONS } from "@/components/forms/service-options";
import { deliverLead, type Lead } from "@/lib/leads";
import { consume } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";
import { checkTiming, clientIp, makeQuoteParser, originOk } from "./quote-core";

const parseQuote = makeQuoteParser(SERVICE_OPTIONS);

const HOUR_MS = 60 * 60 * 1000;
const IP_LIMIT = 5;
const EMAIL_LIMIT = 3;

/** Ends every "we could not send it" message, so a visitor always has a way to reach us. */
const CALL_OR_EMAIL = `call ${SITE.phone.display} or email ${SITE.email}`;
const MESSAGES = {
  invalid: "Check the highlighted fields and send your request again.",
  fast: "That was quick. Check your details and send the request again.",
  unverified: `We could not confirm that the form loaded fully. Reload the page and try again, or ${CALL_OR_EMAIL}.`,
  failed: `We could not send your request. Please ${CALL_OR_EMAIL}.`,
  limited: (retryAfterMs: number) =>
    `We have received several requests from you in the past hour. Please ${CALL_OR_EMAIL}, or try again in about ${Math.min(60, Math.max(1, Math.ceil(retryAfterMs / 60_000)))} minutes.`,
};

const labelOf = (options: readonly Option[], value: string) => options.find((o) => o.value === value)?.label ?? "";

export async function submitQuote(prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Only the form posts here. A forged call with another argument shape gets a plain refusal, not a 500 and a stack trace in the logs.
  if (!(formData instanceof FormData)) return { ...INITIAL_STATE, status: "error", reason: "invalid", attempt: 1, message: MESSAGES.invalid };
  const outcome = await handle(prev, formData);
  // redirect() works by throwing, so it stays outside every try/catch.
  if (outcome === "sent") redirect("/thank-you");
  return outcome;
}

async function handle(prev: QuoteState, formData: FormData): Promise<QuoteState | "sent"> {
  // `prev` comes back from the browser, so treat it as untrusted: it only feeds a counter.
  const attempt = (typeof prev?.attempt === "number" && Number.isFinite(prev.attempt) ? Math.min(Math.max(prev.attempt, 0), 1000) : 0) + 1;
  const parsed = parseQuote(formData);
  const fail = (reason: QuoteReason, message: string, errors: FieldErrors = {}): QuoteState => ({
    status: "error",
    reason,
    attempt,
    message,
    errors,
    values: parsed.values,
  });

  const h = await headers();
  if (!originOk(h)) {
    // Next.js rejects a foreign Origin before this runs, so this only fires for a host added to serverActions.allowedOrigins.
    console.warn("[quote] origin check failed", { origin: h.get("origin"), host: h.get("x-forwarded-host") ?? h.get("host") });
    return fail("failed", MESSAGES.failed);
  }

  // Spam trap: people never see this field, scripts fill it. Look successful, send nothing.
  if (parsed.honeypot) {
    console.warn("[quote] honeypot field was filled; request dropped");
    return "sent";
  }

  if (!parsed.data) return fail("invalid", MESSAGES.invalid, parsed.errors);
  const data = parsed.data;

  const timing = checkTiming(parsed.startedAt);
  if (timing === "missing") return fail("unverified", MESSAGES.unverified);
  if (timing === "fast") return fail("fast", MESSAGES.fast);

  // Reserve both hits before sending so a burst of parallel requests cannot all slip through; give them
  // back if the lead is not delivered, so an outage on our side never uses up a visitor's allowance.
  const ip = clientIp(h);
  const hits = [
    ip ? consume(`quote:ip:${ip}`, IP_LIMIT, HOUR_MS) : null,
    consume(`quote:email:${data.email.toLowerCase()}`, EMAIL_LIMIT, HOUR_MS),
  ];
  const release = () => hits.forEach((hit) => hit?.ok && hit.undo());
  const refused = hits.find((hit) => hit && !hit.ok);
  if (refused && !refused.ok) {
    release();
    console.warn("[quote] rate limit reached; request refused");
    return fail("limited", MESSAGES.limited(refused.retryAfterMs));
  }

  const lead: Lead = {
    ...data,
    roleLabel: labelOf(ROLE_OPTIONS, data.role),
    serviceLabel: labelOf(SERVICE_OPTIONS, data.service),
    projectTypeLabel: labelOf(PROJECT_TYPE_OPTIONS, data.projectType),
    source: parsed.source,
    landing: parsed.landing,
    referrer: parsed.referrer,
    utm: parsed.utm,
  };

  let delivered = false;
  try {
    delivered = (await deliverLead(lead)).ok;
  } catch (err) {
    console.error("[quote] lead delivery threw", err);
  }
  if (!delivered) {
    release();
    return fail("failed", MESSAGES.failed);
  }
  return "sent";
}
