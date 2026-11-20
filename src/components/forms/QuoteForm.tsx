import { SITE } from "@/lib/site";
import { QuoteFormClient } from "./QuoteFormClient";
import { SERVICE_OPTIONS } from "./service-options";

/**
 * The quote form. A server component on purpose: it reads the service list from the content registry and the
 * contact details from SITE, and hands the client form only those short values, so neither the registry (every
 * page's content) nor the site config has to ship to the browser for this form.
 *
 * Used by CtaBand (variant "compact") and the contact page (variant "full"). IDs matter: only the full form
 * carries id="quote-form" (the sticky mobile bar hides itself when that id is on the page). The compact
 * variant uses id="quote-form-compact". `source` is the path of the page the form sits on, saved with the lead.
 */
export function QuoteForm({ variant = "compact", source = "" }: { variant?: "compact" | "full"; source?: string }) {
  return (
    <QuoteFormClient
      variant={variant}
      source={source}
      services={SERVICE_OPTIONS}
      contact={`call ${SITE.phone.display} or email ${SITE.email}`}
    />
  );
}
