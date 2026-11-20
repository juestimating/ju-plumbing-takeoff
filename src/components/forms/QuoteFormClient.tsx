"use client";

import Link from "next/link";
import { unstable_rethrow, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { submitQuote } from "@/app/actions/quote";
import {
  EMPTY_VALUES,
  INITIAL_STATE,
  LEAD_TRACKED_KEY,
  PROJECT_TYPE_OPTIONS,
  QUOTE_FIELDS,
  QUOTE_LIMITS as L,
  ROLE_OPTIONS,
  queryDefaults,
  type Option,
  type QuoteState,
  type QuoteValues,
} from "./quote-config";

type Props = {
  variant: "compact" | "full";
  source: string;
  services: readonly Option[];
  /** Ends the messages shown when the form cannot send (JavaScript off, server not reachable), in the form "call <phone> or email <address>". */
  contact: string;
};

/**
 * Calls the server action. A successful send redirects, and Next.js delivers that redirect to the client as
 * a thrown error, so it is passed straight back. Anything else that goes wrong (the connection drops mid-send,
 * an old tab calls an action from a previous deploy) would otherwise reach the error boundary and replace the
 * form; here it becomes an inline message and the visitor keeps what they typed.
 */
async function send(prev: QuoteState, formData: FormData, contact: string): Promise<QuoteState> {
  // A submit tapped before hydration is replayed before the mount effect has written the form timer. Fall back to the page
  // load time, so a slow phone connection does not turn a real request into an "unverified" error.
  if (!formData.get("startedAt")) formData.set("startedAt", String(Math.round(Date.now() - performance.now())));
  try {
    return await submitQuote(prev, formData);
  } catch (err) {
    unstable_rethrow(err);
    const values: QuoteValues = { ...EMPTY_VALUES };
    for (const field of QUOTE_FIELDS) {
      const v = formData.get(field);
      if (typeof v === "string") values[field] = v.slice(0, 5000);
    }
    return {
      status: "error",
      reason: "failed",
      attempt: prev.attempt + 1,
      message: `We could not reach the server. Check your connection and send again. If it keeps failing, copy your notes and reload the page, or ${contact}.`,
      errors: {},
      values,
    };
  }
}

/**
 * The full form fits as many columns as the card allows (two, once it is about 500px wide) instead of
 * switching on viewport width, because beside the "what to expect" panel the card is narrow on tablets.
 */
const FULL_GRID: CSSProperties = { gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))" };
/** Spans every column, whatever the grid above settles on. */
const WIDE: CSSProperties = { gridColumn: "1 / -1" };

const SR_ONLY: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * The quote form. The compact variant (name, email, service, message) sits in the closing CTA band of every
 * page; the full variant is the contact page form. A React 19 form action posts to the `submitQuote` server
 * action. When the server rejects a submission, it sends back the visitor's values and the field errors; the
 * fields re-mount (keyed by `attempt`) with those values, because React resets uncontrolled fields once an
 * action finishes.
 */
export function QuoteFormClient({ variant, source, services, contact }: Props) {
  const full = variant === "full";
  const p = full ? "qf" : "qc";
  const [state, formAction] = useActionState((prev: QuoteState, formData: FormData) => send(prev, formData, contact), INITIAL_STATE);
  const summaryRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const { errors: e, values: v } = state;
  const hasError = state.status === "error";
  const errorList = QUOTE_FIELDS.flatMap((field) => {
    const message = e[field];
    return message ? [{ field, message }] : [];
  });

  // Timer and tracking fields are written after mount, so the page itself can stay statically rendered.
  useEffect(() => {
    fillTracking(hiddenRef.current);
  }, []);

  // A failed send moves focus to the error summary.
  useEffect(() => {
    if (state.status !== "error") return;
    summaryRef.current?.focus();
  }, [state]);

  function onSubmit() {
    // Marks this tab as having submitted, so the thank-you page counts one conversion for it.
    try {
      sessionStorage.setItem(LEAD_TRACKED_KEY, "pending");
    } catch {
      // storage can be blocked; the event then simply fires once per page view
    }
  }

  // The form on /services/<slug> starts on that service. A ?service= link or the visitor's own pick overrides it.
  const pageService = /^\/services\/([a-z0-9-]+)\/?$/.exec(source)?.[1] ?? "";
  const pageDefault = services.some((o) => o.value === pageService) ? pageService : "";
  const service = {
    id: `${p}-service`,
    options: services,
    defaultValue: v.service || (state.attempt === 0 ? pageDefault : ""),
    error: e.service,
    attempt: state.attempt,
  };
  const projectType = { id: `${p}-projectType`, error: e.projectType, value: v.projectType, attempt: state.attempt };
  const notes = { id: `${p}-notes`, error: e.notes, value: v.notes, attempt: state.attempt, full };

  return (
    <form id={full ? "quote-form" : "quote-form-compact"} action={formAction} onSubmit={onSubmit} aria-label="Plumbing quote request">
      <noscript>
        <p className="alert bad" style={{ marginBottom: 16 }}>
          This form needs JavaScript to send. Please {contact}.
        </p>
      </noscript>
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className={hasError ? "alert bad" : undefined}
        style={hasError ? { marginBottom: 16 } : undefined}
      >
        {hasError && (
          <>
            <p style={{ margin: 0 }}>{state.message}</p>
            {errorList.length > 0 && (
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                {errorList.map(({ field, message }) => (
                  <li key={field}>
                    <a
                      href={`#${p}-${field}`}
                      style={{ textDecoration: "underline" }}
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById(`${p}-${field}`)?.focus();
                      }}
                    >
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <p className="form-fine" style={{ margin: "0 0 12px" }}>
        Fields marked * are required.
      </p>

      <div key={state.attempt} className="form-grid" style={full ? FULL_GRID : undefined}>
        <Field id={`${p}-name`} name="name" label="Full name" required error={e.name}>
          {(c) => <input {...c} className="input" type="text" autoComplete="name" required maxLength={L.name} defaultValue={v.name} />}
        </Field>
        <Field id={`${p}-email`} name="email" label="Email" required error={e.email}>
          {(c) => (
            <input
              {...c}
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={L.email}
              defaultValue={v.email}
            />
          )}
        </Field>

        {full && (
          <>
            <Field id={`${p}-phone`} name="phone" label="Phone" error={e.phone}>
              {(c) => <input {...c} className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={L.phone} defaultValue={v.phone} />}
            </Field>
            <Field id={`${p}-company`} name="company" label="Company" error={e.company}>
              {(c) => <input {...c} className="input" type="text" autoComplete="organization" maxLength={L.company} defaultValue={v.company} />}
            </Field>
            <Field id={`${p}-role`} name="role" label="Your role" error={e.role}>
              {(c) => <OptionSelect control={c} options={ROLE_OPTIONS} placeholder="Select one" defaultValue={v.role} />}
            </Field>
          </>
        )}

        {/* useSearchParams prefills ?service=<slug>. Inside Suspense so the page stays static; the fallback is the same select. */}
        <Suspense fallback={<ServiceSelect {...service} />}>
          <ServiceFromQuery {...service} />
        </Suspense>

        {full && (
          <>
            {/* ?type= from the /samples request slip prefills the project type (same Suspense pattern as the service). */}
            <Suspense fallback={<ProjectTypeField {...projectType} />}>
              <ProjectTypeFromQuery {...projectType} />
            </Suspense>
            <Field id={`${p}-location`} name="location" label="Project location (city, state)" error={e.location}>
              {(c) => <input {...c} className="input" type="text" autoComplete="off" maxLength={L.location} defaultValue={v.location} />}
            </Field>
            <Field
              id={`${p}-dueDate`}
              name="dueDate"
              label="Bid or due date"
              hint="If the bid has a deadline, enter it so we can plan around it."
              error={e.dueDate}
            >
              {(c) => <input {...c} className="input" type="date" defaultValue={v.dueDate} />}
            </Field>
            <Field
              id={`${p}-planLink`}
              name="planLink"
              label="Plan link"
              optional
              hint="A Dropbox, Google Drive or plan-room link. Large sets go by link."
              error={e.planLink}
            >
              {(c) => (
                <input {...c} className="input" type="url" inputMode="url" autoComplete="off" spellCheck={false} maxLength={L.planLink} defaultValue={v.planLink} />
              )}
            </Field>
          </>
        )}

        {/* On the full form, ?sample= (with ?service=sample-request) prefills a fixed Notes line. */}
        {full ? (
          <Suspense fallback={<NotesField {...notes} />}>
            <NotesFromQuery {...notes} />
          </Suspense>
        ) : (
          <NotesField {...notes} />
        )}

        {full && (
          <div style={WIDE}>
            <label className="check">
              <input type="checkbox" name="nda" value="yes" defaultChecked={v.nda === "yes"} />
              <span>{"I'd like an NDA before sharing files"}</span>
            </label>
          </div>
        )}

        <div style={{ ...WIDE, display: "grid", gap: 12 }}>
          <Submit label={full ? "Request my fixed quote" : "Get a fixed quote"} />
          <p className="form-fine">
            No obligation, and work starts only when you approve the quote. By sending, you agree to our <Link href="/terms">Terms</Link> and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/*
        Outside the keyed block so the timer survives a failed send. These hidden inputs get no value or
        defaultValue prop on purpose: fillTracking writes them after mount, and React would overwrite
        a defaultValue it still believes is "" on every re-render. Form reset leaves hidden inputs alone.
      */}
      <div ref={hiddenRef}>
        <input type="hidden" name="startedAt" />
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="landing" />
        <input type="hidden" name="referrer" />
        <input type="hidden" name="utm" />
        {/* Honeypot: off-screen, skipped by keyboard and screen readers. Scripts fill it, people never see it. */}
        <div className="hp" aria-hidden="true">
          <label>
            Leave this field empty
            <input type="text" name="hp_q9x_field" tabIndex={-1} autoComplete="off" defaultValue="" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" data-form-type="other" />
          </label>
        </div>
      </div>
    </form>
  );
}

/* ---------- pieces ---------- */

type Control = { id: string; name: string; "aria-invalid"?: true; "aria-describedby"?: string };

/** Label, control, hint and error with the aria wiring done once. The control comes in through a render prop. */
function Field({
  id, name, label, required, optional, hint, error, wide, children,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  wide?: boolean;
  children: (control: Control) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="field" style={wide ? WIDE : undefined}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            {" "}*
          </span>
        )}
        {optional && <span style={{ fontWeight: 400, color: "var(--color-mut)" }}> (optional)</span>}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
      })}
      {hint && (
        <span id={hintId} className="help">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="err">
          {error}
        </span>
      )}
    </div>
  );
}

function OptionSelect({
  control, options, placeholder, defaultValue,
}: {
  control: Control;
  options: readonly Option[];
  placeholder: string;
  defaultValue: string;
}) {
  return (
    <select {...control} className="select" defaultValue={defaultValue}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

type ServiceProps = { id: string; options: readonly Option[]; defaultValue: string; error?: string; attempt: number };

function ServiceSelect({ id, options, defaultValue, error }: ServiceProps) {
  return (
    <Field id={id} name="service" label="Service needed" required error={error}>
      {(c) => (
        <select {...c} aria-invalid={c["aria-invalid"] ?? false} className="select" required defaultValue={defaultValue}>
          <option value="">Select a service</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** Reads ?service=<slug> on the client. Applies only to the first render, never over what the visitor chose. */
function ServiceFromQuery(props: ServiceProps) {
  const fromUrl = useSearchParams()?.get("service") ?? "";
  const known = props.attempt === 0 && props.options.some((o) => o.value === fromUrl);
  return <ServiceSelect {...props} defaultValue={known ? fromUrl : props.defaultValue} />;
}

/** A field whose default can come from the URL: `value` is what the server sent back after a failed send, else "". */
type Prefill = { id: string; error?: string; value: string; attempt: number };
type NotesProps = Prefill & { full: boolean };

function ProjectTypeField({ id, error, value }: Prefill) {
  return (
    <Field id={id} name="projectType" label="Project type" error={error}>
      {(c) => <OptionSelect control={c} options={PROJECT_TYPE_OPTIONS} placeholder="Select a project type" defaultValue={value} />}
    </Field>
  );
}

function NotesField({ id, error, value, full }: NotesProps) {
  return (
    <Field
      id={id}
      name="notes"
      label={full ? "Notes" : "Message or plan link"}
      optional
      hint={
        full
          ? "Systems to include, sheets that matter, rates to use, anything we should know."
          : "A Dropbox, Google Drive or plan-room link, your bid date, and whether you want an NDA first."
      }
      error={error}
      wide
    >
      {(c) => <textarea {...c} className="textarea" rows={full ? 5 : 4} maxLength={L.notes} defaultValue={value} />}
    </Field>
  );
}

/** ?type= and ?sample= from the /samples request slip: mapped values only (queryDefaults), first render only. */
function useQueryDefault(field: "projectType" | "notes", attempt: number): string {
  const query = useSearchParams();
  return attempt === 0 && query ? queryDefaults(query)[field] : "";
}

function ProjectTypeFromQuery(props: Prefill) {
  const fromUrl = useQueryDefault("projectType", props.attempt);
  return <ProjectTypeField {...props} value={props.value || fromUrl} />;
}

function NotesFromQuery(props: NotesProps) {
  const fromUrl = useQueryDefault("notes", props.attempt);
  return <NotesField {...props} value={props.value || fromUrl} />;
}

/** Must render inside the form: useFormStatus reads the nearest parent form. */
function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        className="btn btn-primary btn-lg btn-block"
        disabled={pending}
        style={pending ? { opacity: 0.7, cursor: "progress", transform: "none" } : undefined}
      >
        {pending ? (
          "Sending your request…"
        ) : (
          <>
            {label}
            <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <span role="status" style={SR_ONLY}>
        {pending ? "Sending your request." : ""}
      </span>
    </>
  );
}

/* ---------- hidden tracking fields ---------- */

function setHidden(root: HTMLElement | null, name: string, value: string) {
  const el = root?.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (el) el.value = value.slice(0, 600);
}

/**
 * Writes the form timer and the visit details into the hidden inputs. The landing path and any utm_* values
 * come from the page the visit started on (the browser's navigation entry), so they survive in-site
 * navigation; utm_* on the current URL win. The referrer is cut to origin and path.
 */
function fillTracking(root: HTMLElement | null) {
  setHidden(root, "startedAt", String(Date.now()));
  try {
    const here = new URL(location.href);
    const entry = new URL(performance.getEntriesByType("navigation")[0]?.name || location.href);
    setHidden(root, "landing", entry.pathname);
    if (document.referrer) {
      const ref = new URL(document.referrer);
      setHidden(root, "referrer", ref.origin + ref.pathname);
    }
    const utm = new URLSearchParams();
    for (const url of [here, entry]) {
      for (const [key, value] of url.searchParams) {
        if (/^utm_/i.test(key) && !utm.has(key)) utm.set(key, value);
      }
    }
    setHidden(root, "utm", utm.toString());
  } catch {
    // tracking is best effort and must never get in the way of a lead
  }
}
