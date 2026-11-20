export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

export const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

/** A link to /contact (with or without ?service=) that does not name an anchor lands on the quote form, not the top of the page. */
export const toQuoteForm = (href: string) => (/^\/contact(\?[^#]*)?$/.test(href) ? `${href}#request-a-quote` : href);
