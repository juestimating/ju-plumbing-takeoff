/** Single source of truth for brand, NAP, claims and hours. Edit here, never inline. */

// A blank NEXT_PUBLIC_SITE_URL (as shipped in .env.example) counts as unset, hence || and not ??.
// This fallback is for local work and previews: a Vercel Production build refuses to run without a real https origin
// (the guard is in next.config.ts).
const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE = {
  name: "JU Plumbing Takeoff",
  shortName: "JU Plumbing",
  legalName: "JU Estimating LLC",
  parentBrand: "JU Estimating",
  parentUrl: "https://www.juestimating.com",
  tagline: "Plumbing takeoff and estimating services",
  url: rawUrl.replace(/\/+$/, ""),
  /** Only the live domain (NEXT_PUBLIC_SITE_ENV=production) is indexable. Mirrors next.config.ts. */
  isProduction: process.env.NEXT_PUBLIC_SITE_ENV === "production",
  locale: "en_US",
  phone: { display: "(703) 721-8864", tel: "+17037218864" },
  email: "info@juestimating.com",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://cal.com/juestimating/new-project-consultation",
  hours: [
    { days: "Monday to Friday", time: "8:00 AM to 6:00 PM ET", schema: { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" } },
    { days: "Saturday", time: "9:00 AM to 2:00 PM ET", schema: { dayOfWeek: ["Saturday"], opens: "09:00", closes: "14:00" } },
  ],
  hoursNote: "Email is monitored outside these hours. Rush requests are handled as capacity allows.",
  /** North Canton, OH is the MAIN office; Manassas, VA is the branch. Keep this order everywhere. */
  offices: [
    { role: "Head office", street: "6545 Market Ave. North", city: "North Canton", region: "OH", postalCode: "44721", country: "US" },
    { role: "Regional office", street: "8855 Peregrine Heights Rd", city: "Manassas", region: "VA", postalCode: "20111", country: "US" },
  ],
  /** Updated by hand whenever pricing, turnaround or copy is re-checked. */
  lastReviewed: "2026-11-17",
  lastReviewedLabel: "November 2026",
} as const;

export function officeLine(o: (typeof SITE.offices)[number]): string {
  return `${o.street}, ${o.city}, ${o.region} ${o.postalCode}`;
}

export function mapsUrl(o: (typeof SITE.offices)[number]): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeLine(o))}`;
}

/**
 * Claims inherited from the JU Estimating main site. Use these constants; do NOT invent new
 * metrics, guarantees, certifications or customer counts anywhere on the site.
 */
export const CLAIMS = {
  turnaround: "24–72 hours",
  quote: "usually within 10 minutes during business hours",
  quoteShort: "Fixed quote usually within 10 minutes (business hours)",
  checked: "Every file checked by a second estimator",
  variance: "Typical variance ±5–10%",
  varianceLong:
    "Typical variance is ±5–10% on construction-document estimates and ±15–30% on conceptual budgets.",
  nda: "NDA on request",
  fixed: "Work starts only when you approve the quote",
  contractors: "500+",
  years: "15+",
  states: "all 50 states",
  excel: "Unlocked Excel with live formulas",
  noCompete: "We don't bid or build construction work, so your plans and pricing stay yours",
} as const;

/** Default proof bar under every page hero. Exactly five items. */
export const PROOF_ITEMS: { icon: import("@/content/types").IconName; text: string }[] = [
  { icon: "clock", text: "Delivered in 24–72 hours" },
  { icon: "dollar", text: "Published prices from $129" },
  { icon: "file-spreadsheet", text: "Unlocked Excel workbook" },
  { icon: "shield-check", text: "Second-estimator check" },
  { icon: "lock", text: "NDA on request" },
];

export const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Samples", href: "/samples" },
  { label: "Guides", href: "/guides" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Accessibility", href: "/accessibility" },
];
