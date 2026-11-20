/**
 * Shared by the quote form (client) and the server action. Plain data and types only: this file must stay
 * free of server code and of the content registry, so it never drags page content into the browser bundle.
 */

export type Option = { value: string; label: string };

/** Server-side maximum lengths. The same numbers become maxLength on the inputs. */
export const QUOTE_LIMITS = {
  name: 100,
  email: 254,
  phone: 40,
  company: 120,
  location: 120,
  notes: 4000,
  planLink: 500,
} as const;

/** Select value for visitors who cannot pick a service yet. Service values are registry slugs, "sample-request" and this. */
export const NOT_SURE = "not-sure";

export const ROLE_OPTIONS: readonly Option[] = [
  { value: "plumbing-contractor", label: "Plumbing contractor" },
  { value: "general-contractor", label: "General contractor" },
  { value: "mechanical-contractor", label: "Mechanical contractor" },
  { value: "builder-remodeler", label: "Builder or remodeler" },
  { value: "owner-developer", label: "Owner or developer" },
  { value: "architect-engineer", label: "Architect or engineer" },
  { value: "other", label: "Other" },
];

export const PROJECT_TYPE_OPTIONS: readonly Option[] = [
  { value: "residential", label: "Residential" },
  { value: "multifamily", label: "Multifamily" },
  { value: "commercial", label: "Commercial" },
  { value: "healthcare", label: "Healthcare" },
  { value: "industrial", label: "Industrial" },
  { value: "other", label: "Other" },
];

/**
 * The /samples request slip sends visitors here as /contact?service=sample-request&type=<project type>&sample=<file>.
 * `sample` picks one of these fixed Notes lines (and only with service=sample-request).
 */
export const SAMPLE_NOTES: Readonly<Record<string, string>> = {
  takeoff: "Sample request: a plumbing takeoff.",
  "material-list": "Sample request: a plumbing material list.",
  estimate: "Sample request: a plumbing estimate.",
};

/**
 * Full-form defaults from the query string: ?type= when it is a known project type, ?sample= mapped to its fixed
 * Notes line. Anything else gives "": text from the URL is never copied into the form.
 */
export function queryDefaults(query: { get(name: string): string | null }): { projectType: string; notes: string } {
  const type = query.get("type") ?? "";
  const sample = query.get("sample") ?? "";
  return {
    projectType: PROJECT_TYPE_OPTIONS.some((o) => o.value === type) ? type : "",
    notes: query.get("service") === "sample-request" && Object.hasOwn(SAMPLE_NOTES, sample) ? (SAMPLE_NOTES[sample] ?? "") : "",
  };
}

/** Visible form fields, in on-screen order (the error summary lists problems in this order). */
export const QUOTE_FIELDS = [
  "name",
  "email",
  "phone",
  "company",
  "role",
  "service",
  "projectType",
  "location",
  "dueDate",
  "planLink",
  "notes",
  "nda",
] as const;

export type QuoteField = (typeof QUOTE_FIELDS)[number];
/** Every value is a string so it can round-trip through the server action. The NDA box is "yes" or "". */
export type QuoteValues = Record<QuoteField, string>;
export type FieldErrors = Partial<Record<QuoteField, string>>;

/** Why a submission came back. For logs and tests. */
export type QuoteReason = "invalid" | "fast" | "unverified" | "limited" | "failed";

export type QuoteState = {
  status: "idle" | "error";
  reason: QuoteReason | null;
  /** Counts failed submissions. Used as a React key so the fields re-mount with the values we send back. */
  attempt: number;
  message: string;
  errors: FieldErrors;
  values: QuoteValues;
};

export const EMPTY_VALUES = Object.fromEntries(QUOTE_FIELDS.map((f) => [f, ""])) as QuoteValues;

export const INITIAL_STATE: QuoteState = {
  status: "idle",
  reason: null,
  attempt: 0,
  message: "",
  errors: {},
  values: EMPTY_VALUES,
};

/** sessionStorage flag: the form sets it to "pending" on submit, the thank-you page sets it to "done" once the conversion event fires. */
export const LEAD_TRACKED_KEY = "ju:lead-tracked";
