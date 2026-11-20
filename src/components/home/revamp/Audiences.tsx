import Link from "next/link";
import {
  ArrowRight, ArrowUp, Briefcase, Building, Building2, Cog, DraftingCompass, Factory, Hammer, HardHat, Hospital,
  House, Houses, Pause, School, Stethoscope, Store, Utensils, Warehouse, Wrench, type LucideIcon,
} from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { cx } from "@/lib/utils";
import { RevealEscape } from "./RevealEscape";
import s from "./audiences.module.css";

const ID = "who-we-work-with";
const PAUSE_ID = `${ID}-pause`;

type Pill = [label: string, icon: LucideIcon];

const PEOPLE: Pill[] = [
  ["Plumbing contractors", Wrench],
  ["General contractors", HardHat],
  ["Mechanical contractors", Cog],
  ["Builders and remodelers", Hammer],
  ["Design-build teams", DraftingCompass],
  ["Owners and developers", Briefcase],
];

const PROJECTS: Pill[] = [
  ["Custom homes", House],
  ["Production homes", Houses],
  ["Apartment buildings", Building],
  ["Restaurants", Utensils],
  ["Schools", School],
  ["Offices", Building2],
  ["Retail", Store],
  ["Clinics", Stethoscope],
  ["Hospitals", Hospital],
  ["Warehouses", Warehouse],
  ["Industrial plants", Factory],
];

/** Front: who and why. Reveal: what they get and where to read more. */
const CARDS: { title: string; line: string; icon: LucideIcon; gets: [string, string]; link: { label: string; href: string } }[] = [
  {
    title: "Plumbing contractors",
    line: "Hand off the counting, keep the pricing.",
    icon: Wrench,
    gets: ["Quantities with sheet references", "Ready for your labor units and supplier quotes"],
    link: { label: "Plumbing takeoff", href: "/services/plumbing-takeoff" },
  },
  {
    title: "General contractors",
    line: "Carry a plumbing number without a plumbing estimator.",
    icon: HardHat,
    gets: ["Check a sub's quantities", "Send every bidder the same figures"],
    link: { label: "Plumbing quantity takeoff", href: "/services/plumbing-takeoff#quantity-or-material-takeoff" },
  },
  {
    title: "Builders and remodelers",
    line: "Know what's in a set before it goes out.",
    icon: Hammer,
    gets: ["Price repeat plan types from one count", "Buy out material from an order-ready list"],
    link: { label: "Plumbing material takeoff", href: "/services/plumbing-takeoff#quantity-or-material-takeoff" },
  },
  {
    title: "Owners and developers",
    line: "Check a bid or set a budget early.",
    icon: Briefcase,
    gets: ["An independent plumbing estimate", "A budget range before design is done"],
    link: { label: "Plumbing estimate", href: "/services/plumbing-estimating" },
  },
];

/**
 * One marquee row: the pills run along a drafted pipe with flow arrows. CSS-only loop: the belt holds the list
 * twice and slides by half its width; the copy is aria-hidden so screen readers hear each name once.
 */
function Row({ items, label, flow }: { items: Pill[]; label: string; flow: "left" | "right" }) {
  const list = (copy: boolean) => (
    <ul className={s.list} aria-label={copy ? undefined : label} aria-hidden={copy || undefined}>
      {items.map(([name, Icon]) => (
        <li key={name} className={s.pill}>
          <Icon size={18} aria-hidden="true" />
          {name}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={s.row} data-flow={flow}>
      <div className={s.belt}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}

/**
 * Who we work with: a two-row pill marquee, then four cards whose "What you get" panel slides up from the
 * "See what you get" row (or on keyboard focus). RevealEscape lets Escape shut a hover-opened panel.
 */
export function Audiences() {
  return (
    <Section id={ID} tone="light">
      <SectionHead
        id={ID}
        center
        kicker="Who we work with"
        h2="Who we work with, from plumbing subs to developers"
        intro="If you carry a plumbing price, we can help you get it right."
      />

      <div className={cx("hr-reveal", s.marquee)}>
        {/* Native switch, no script: checked pauses both rows (WCAG 2.2.2); hovering a row pauses them too. It sits
            before the rows so CSS can reach them with the sibling combinator; the label below is what people see. */}
        <input id={PAUSE_ID} type="checkbox" role="switch" className={s.pauseInput} />
        <div className={s.rows}>
          <Row items={PEOPLE} label="People we work with" flow="left" />
          <Row items={PROJECTS} label="Projects we price" flow="right" />
        </div>
        <label htmlFor={PAUSE_ID} className={s.pause}>
          <Pause size={15} aria-hidden="true" strokeWidth={2.5} />
          Pause motion
        </label>
      </div>

      <ul className={s.cards} role="list">
        {CARDS.map(({ title, line, icon: Icon, gets, link }) => (
          <li key={title} className="hr-reveal">
            <div className={cx("hr-card", "lift", s.card)} data-reveal>
              <div className={s.front}>
                <span className={cx("hr-tile", s.tile)} aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3 className={s.title}>{title}</h3>
                <p className={s.line}>{line}</p>
                <span className={s.hint} aria-hidden="true">
                  See what you get
                  <span className={s.hintIcon}>
                    <ArrowUp size={15} strokeWidth={2.5} />
                  </span>
                </span>
              </div>
              <div className={cx("tone-dark", s.reveal)}>
                <p className={s.label}>
                  <span className={cx("hr-tile", "sm", s.revealTile)} aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  What you get
                </p>
                <ul className={cx("hr-checks", s.gets)}>
                  {gets.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <Link href={link.href} className={cx("arrow-link", s.link)}>
                  {link.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <RevealEscape root={ID} />
    </Section>
  );
}
