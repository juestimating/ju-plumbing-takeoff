import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usd } from "@/components/home/content";
import { Illustration } from "@/components/illustrations/Illustration";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import type { IconName, IllustrationName } from "@/content/types";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import { HeroShowcase } from "./HeroShowcase";
import { StatCard } from "./StatCard";
import s from "./hero.module.css";

const TAKEOFF = "/services/plumbing-takeoff";

const LEAD = `Send us your plumbing plans and we'll count every fixture, measure every run and send back a takeoff you can price. Takeoffs start at ${usd(TAKEOFF)}, priced estimates at ${usd("/services/plumbing-estimating")}, and a second estimator checks every file before it reaches you.`;

type Panel = {
  chip: string;
  icon: IconName;
  drawing: IllustrationName;
  title: string;
  line: string;
  checks: string[];
  /** "Estimates" or "Takeoffs": the badge reads "<kind> from $X", the published price of `href`. */
  kind: string;
  /** The panel's page and its link text. */
  cta: string;
  href: string;
};

const PANELS: Panel[] = [
  {
    chip: "Residential",
    icon: "home",
    drawing: "house-rough-in",
    title: "Residential plumbing",
    line: "Custom homes, production plans, additions and remodels.",
    checks: ["Underground, rough-in and trim kept separate", "Fixtures counted from the schedule and every floor plan", "Water heater and gas connections listed"],
    kind: "Estimates",
    cta: "Explore residential estimating",
    href: "/services/residential-plumbing-estimating",
  },
  {
    chip: "Commercial",
    icon: "building",
    drawing: "restroom-plan",
    title: "Commercial plumbing",
    line: "Offices, retail, schools, restaurants and apartment buildings.",
    checks: ["Restroom groups and ADA fixtures", "Risers measured floor to floor", "Backflow preventers, water heaters and roof drains"],
    kind: "Estimates",
    cta: "Explore commercial estimating",
    href: "/services/commercial-plumbing-estimating",
  },
  {
    chip: "Industrial",
    icon: "factory",
    drawing: "process-piping",
    title: "Industrial plumbing",
    line: "Plants, warehouses and process areas.",
    checks: ["Process water and trench drains", "Emergency showers and eyewash stations", "Large-diameter pipe and heavy supports"],
    kind: "Estimates",
    cta: "Explore industrial estimating",
    href: "/services/industrial-plumbing-estimating",
  },
  {
    chip: "Medical gas",
    icon: "stethoscope",
    drawing: "medical-gas-zone",
    title: "Medical gas",
    line: "Clinics and hospitals.",
    checks: ["Oxygen, vacuum and medical air piping", "Zone valve boxes and alarm panels", "Outlets counted by room type"],
    kind: "Takeoffs",
    cta: "Explore plumbing takeoff",
    href: TAKEOFF,
  },
];

/** Faint white sketch lines and labels for the background art. Pipe colors match the drafting kit (illustrations/parts.tsx). */
const INK = { stroke: "#fff", strokeOpacity: 0.16, strokeWidth: 1.5 } as const;
const LABEL = { fill: "#fff", stroke: "none", fontWeight: 600 } as const;

/** Faint drafting-sheet art behind the hero: grid bubbles and center lines, supply and vent risers, a slab drain with fixtures. */
function HeroArt() {
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 1440 820" width={1440} height={820} focusable="false" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="#fff" strokeOpacity={0.1}>
          <path d="M96 50V820M384 50V820M672 50V820M960 50V820M1248 50V820" strokeDasharray="26 8 4 8" strokeLinecap="butt" />
          <path d="M96 58H1248M96 52V64M384 52V64M672 52V64M960 52V64M1248 52V64" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={96 + i * 288} cy={30} r={15} />
          ))}
        </g>
        <g {...LABEL} fillOpacity={0.3} fontSize={13} fontWeight={700} textAnchor="middle" style={{ fontFamily: "var(--font-display)" }}>
          {["A", "B", "C", "D", "E"].map((c, i) => (
            <text key={c} x={96 + i * 288} y={35}>
              {c}
            </text>
          ))}
        </g>
        {/* desktop: supply and vent risers climb the gutter between the copy and the card */}
        <g className={s.wide}>
          <g strokeWidth={3} opacity={0.5}>
            <path className={s.draw} pathLength={1} stroke="#1f6fd0" d="M738 840V76H2000" />
            <path className={cx(s.draw, s.next)} pathLength={1} stroke="#d64533" d="M752 840V92H2000" />
            <path className={s.fade} stroke="#2f9a62" strokeDasharray="10 7" strokeLinecap="butt" d="M766 840V108H2000" />
          </g>
          <g className={s.fade} {...INK}>
            <path d="M732 170h12l-12 14h12zM746 214h12l-12 14h12z" />
            <circle cx="738" cy="260" r="4" />
            <circle cx="752" cy="300" r="4" />
          </g>
        </g>
        {/* wide screens, where the copy column is short enough: a slab drain with fixtures under the buttons */}
        <g className={s.xwide}>
          <g strokeWidth={3} opacity={0.5} stroke="#9c846b">
            <path className={s.draw} pathLength={1} d="M-560 772H700" />
            <path className={cx(s.draw, s.late)} pathLength={1} d="M406 772L430 748V732M516 772L540 748V734M626 772L650 748V738" />
          </g>
          <g className={s.fade} {...INK}>
            <rect x="416" y="688" width="28" height="10" rx="2" />
            <ellipse cx="430" cy="716" rx="11" ry="14" />
            <rect x="524" y="710" width="32" height="24" rx="6" />
            <circle cx="540" cy="722" r="5" />
            <circle cx="650" cy="728" r="9" />
            <path d="M644 728h12M650 722v12" />
          </g>
          <g className={s.fade} {...LABEL} fillOpacity={0.22} fontSize={11} style={{ fontFamily: "var(--font-sans)" }}>
            <text x="450" y="720">WC-1</text>
            <text x="564" y="726">LAV-1</text>
            <text x="666" y="732">FD-1</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Home hero: the page's one h1, project-type chips that drive a rotating showcase card, and the floating fact card.
 * Grid order is copy, chips, card, buttons: on phones the chips sit right above the card they change (the sticky
 * bar keeps a quote button on screen), and on desktop the card spans the right column.
 */
export function Hero() {
  const panels = PANELS.map((p) => (
    <Fragment key={p.chip}>
      <div className={s.media}>
        <Illustration name={p.drawing} className={s.drawing} />
      </div>
      <div className={s.body}>
        <div className={s.titleRow}>
          <p className={s.title}>{p.title}</p>
          <span className="hr-badge">{`${p.kind} from ${usd(p.href)}`}</span>
        </div>
        <p className={s.line}>{p.line}</p>
        <ul className={cx("hr-checks", s.checks)}>
          {p.checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Link href={p.href} className={s.explore}>
          {p.cta}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Fragment>
  ));

  return (
    <>
      <header className={cx("pg-hero", s.hero)}>
        <HeroArt />
        <Container className={s.inner}>
          <div className={s.grid}>
            <div className={s.intro}>
              <span className={cx("kicker", s.kicker)}>{`A JU Estimating service, trusted by ${CLAIMS.contractors} contractors`}</span>
              <h1 className={s.h1}>
                Plumbing takeoff and estimating services, back in <span className={s.hl}>{CLAIMS.turnaround}</span>
              </h1>
              <p className="lead">{LEAD}</p>
            </div>
            <HeroShowcase
              ask="What are you bidding?"
              tabs={PANELS.map((p) => ({ label: p.chip, icon: <Icon name={p.icon} size={18} /> }))}
              panels={panels}
            />
            <div className={s.actions}>
              <div className="hero-cta">
                <ButtonLink href="/contact" size="lg" arrow>
                  Get a fixed quote
                </ButtonLink>
                <ButtonLink href="/samples" size="lg" variant="outline">
                  See a sample
                </ButtonLink>
              </div>
              <p className={cx("hero-note", s.note)}>
                <Icon name="clock" size={16} />
                <span>
                  <span className={s.sentence}>{`Fixed quote ${CLAIMS.quote}.`}</span>{" "}
                  <span className={s.sentence}>{`No obligation, and an ${CLAIMS.nda}.`}</span>
                </span>
              </p>
            </div>
          </div>
        </Container>
      </header>
      <StatCard />
    </>
  );
}
