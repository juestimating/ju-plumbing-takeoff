import { SERVICES, pagePath } from "@/content/registry";
import { GUIDES } from "@/content/guides";
import type { IconName } from "@/content/types";
import { SITE } from "./site";

export type RouteInfo = {
  path: string;
  label: string;
  blurb: string;
  updated: string;
  priority: number;
  /** Tile icon on related-page cards. */
  icon: IconName;
  /** Draft or utility pages: excluded from the sitemap and llms.txt, rendered with robots noindex. */
  noindex?: true;
};

const d = SITE.lastReviewed;

/** Every indexable non-content page. The sitemap, llms.txt and related-link resolver all read this. */
export const STATIC_ROUTES: RouteInfo[] = [
  { path: "/", label: "Home", blurb: "Plumbing takeoff and estimating services, back in 24–72 hours.", updated: d, priority: 1, icon: "home" },
  { path: "/services", label: "Plumbing takeoff, estimating and bid preparation", blurb: "Takeoffs, estimates and bid support for plumbing scope.", updated: d, priority: 0.9, icon: "wrench" },
  { path: "/pricing", label: "Pricing", blurb: "Published starting prices for every service.", updated: d, priority: 0.9, icon: "dollar" },
  { path: "/samples", label: "Sample takeoffs", blurb: "See what you receive before you send a plan.", updated: d, priority: 0.8, icon: "file-spreadsheet" },
  { path: "/guides", label: "Plumbing estimating guides", blurb: "How to do a plumbing takeoff, estimate a job and win more bids.", updated: d, priority: 0.8, icon: "graduation-cap" },
  { path: "/faq", label: "FAQ", blurb: "Timelines, accuracy, files, pricing and confidentiality.", updated: d, priority: 0.7, icon: "message" },
  { path: "/about", label: "About", blurb: "Who we are and how every file is checked.", updated: d, priority: 0.6, icon: "users" },
  { path: "/contact", label: "Contact and quote", blurb: "Send your plans for a fixed quote.", updated: d, priority: 0.8, icon: "mail" },
  { path: "/privacy-policy", noindex: true, label: "Privacy Policy", blurb: "How we handle your information and files.", updated: d, priority: 0.2, icon: "lock" },
  { path: "/terms", noindex: true, label: "Terms of Service", blurb: "The terms that apply to our services.", updated: d, priority: 0.2, icon: "file-text" },
  { path: "/refund-policy", noindex: true, label: "Refund Policy", blurb: "When and how refunds are handled.", updated: d, priority: 0.2, icon: "receipt" },
  { path: "/cookie-policy", noindex: true, label: "Cookie Policy", blurb: "Which cookies and analytics this site uses.", updated: d, priority: 0.2, icon: "info" },
  { path: "/accessibility", noindex: true, label: "Accessibility", blurb: "Our accessibility commitment and how to reach us.", updated: d, priority: 0.2, icon: "eye" },
];

/** Static routes + every service and guide page. Order = sitemap order. */
export function allRoutes(): RouteInfo[] {
  return [
    ...STATIC_ROUTES,
    ...SERVICES.map((p, i) => ({ path: pagePath(p), label: p.nav.label, blurb: p.nav.blurb, updated: p.updated, priority: i < 4 ? 0.9 : 0.8, icon: p.nav.icon ?? "wrench" })),
    ...GUIDES.map((g) => ({ path: `/guides/${g.meta.slug}`, label: g.meta.h1, blurb: g.meta.description, updated: g.meta.dateModified, priority: 0.7, icon: "file-text" as const })),
  ];
}

/** Pages that belong in the sitemap and llms.txt. Legal pages stay out until the attorney approves them. */
export function indexableRoutes(): RouteInfo[] {
  return allRoutes().filter((r) => !r.noindex);
}

/** Label, blurb and icon for any internal href, used by related-link cards. */
export function describeHref(href: string): RouteInfo | undefined {
  return allRoutes().find((r) => r.path === href);
}
