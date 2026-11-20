/**
 * Published starting prices. Source of truth for the pricing page, home pricing summary, service
 * page cards and Offer JSON-LD. Prices are the JU Estimating published starting prices, applied to
 * plumbing scope. Change a price here and it changes everywhere.
 */

export type PriceRow = {
  service: string;
  href: string;
  /** Numeric USD, or null for custom quotes. */
  from: number | null;
  /** Shown instead of `From $X` when set, e.g. "$1,499 / month". */
  display?: string;
  delivery: string;
  bestFor: string;
  group: "takeoff" | "estimate" | "bid" | "ongoing";
};

const D = "24–72 hours";

export const PRICE_ROWS: PriceRow[] = [
  { group: "takeoff", service: "Plumbing takeoff (quantities or a material list)", href: "/services/plumbing-takeoff", from: 149, delivery: D, bestFor: "Quantities to price at your own rates, or a list to order from" },
  { group: "estimate", service: "Preliminary plumbing estimate", href: "/services/preliminary-plumbing-estimate", from: 129, delivery: D, bestFor: "Budgets before drawings are finished" },
  { group: "estimate", service: "Plumbing estimate", href: "/services/plumbing-estimating", from: 199, delivery: D, bestFor: "Priced bids with labor, material and markups" },
  { group: "estimate", service: "Residential plumbing estimate", href: "/services/residential-plumbing-estimating", from: 199, delivery: D, bestFor: "Custom homes, production plans and remodels" },
  { group: "estimate", service: "Commercial plumbing estimate", href: "/services/commercial-plumbing-estimating", from: 199, delivery: D, bestFor: "Offices, retail, restaurants, schools, healthcare" },
  { group: "estimate", service: "Industrial plumbing estimate", href: "/services/industrial-plumbing-estimating", from: 349, delivery: "24–72 hours (larger sets confirmed at intake)", bestFor: "Plants, warehouses and process piping" },
  { group: "bid", service: "Plumbing bid preparation", href: "/services/plumbing-bid-preparation", from: 199, delivery: D, bestFor: "A bid package ready for you to sign and submit" },
  { group: "ongoing", service: "Monthly plumbing estimating", href: "/services/monthly-plumbing-estimating", from: 1499, display: "$1,499 / month", delivery: "24–72 hours", bestFor: "10–15 projects a month" },
  { group: "ongoing", service: "Dedicated plumbing estimator", href: "/services/monthly-plumbing-estimating#dedicated-plumbing-estimator", from: null, display: "Custom quote", delivery: "Set to your schedule", bestFor: "Your full bid calendar" },
];

/** "24–72 hours" reads "Delivered in 24–72 hours"; "Priority within 24–72 hours" and "Set to your schedule" print as written. */
export function turnaroundLine(turnaround: string): string {
  return /^\d/.test(turnaround) ? `Delivered in ${turnaround}` : turnaround;
}

export function priceLabel(r: PriceRow): string {
  if (r.display) return r.display;
  return r.from === null ? "Custom quote" : `From $${r.from.toLocaleString("en-US")}`;
}
