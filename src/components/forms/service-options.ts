import { SERVICES } from "@/content/registry";
import { NOT_SURE, type Option } from "./quote-config";

/**
 * The service list for the quote form: one option per service page (value = slug, label = menu label), then
 * "Request a plumbing sample" (the target of every sample call to action, as /contact?service=sample-request)
 * and "Not sure". Server only. The registry holds every page's content, so the client form receives this short
 * list as props and never imports the registry itself. The server action validates against the same list.
 */
export const SERVICE_OPTIONS: readonly Option[] = [
  ...SERVICES.map((p) => ({ value: p.slug, label: p.nav.label })),
  { value: "sample-request", label: "Request a plumbing sample" },
  { value: NOT_SURE, label: "Not sure" },
];
