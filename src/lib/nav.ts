import { SERVICES, pagePath } from "@/content/registry";
import type { IconName, SystemColor } from "@/content/types";

export type NavItem = { label: string; blurb: string; href: string; icon?: IconName; color?: SystemColor };

/** Derived from the content registry so menus can never drift from the real pages. Imports no MDX. */
export const navServices: NavItem[] = SERVICES.map((p) => ({
  label: p.nav.label,
  blurb: p.nav.blurb,
  href: pagePath(p),
  icon: p.nav.icon,
  color: p.nav.color,
}));
