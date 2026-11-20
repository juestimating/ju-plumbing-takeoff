import { Fragment, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { ArrowRight } from "lucide-react";
import { DrawingFigure } from "@/components/illustrations/DrawingFigure";
import { K } from "@/components/illustrations/parts";
import { keepTogether } from "@/components/mdx/keep";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { Rich, richNodes } from "@/components/ui/Rich";
import { turnaroundLine } from "@/content/pricing";
import type { IconName, IllustrationName, ImageRef, Link, SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";
import { CenterCurrent } from "./CenterCurrent";
import s from "./pagehero.module.css";

export type HeroSwitcher = { ask: string; items: { label: string; href: string; icon?: IconName; current?: boolean }[] };

type HeroProps = {
  crumbs: Crumb[];
  kicker?: string;
  /** The page's ONE <h1>. */
  h1: string;
  lead: string;
  primary?: Link;
  secondary?: Link;
  /** One string; it breaks between its sentences when it needs two lines. */
  note?: string;
  /** The note as separate lines (wins over `note`), each kept whole, after the clock icon. */
  noteLines?: string[];
  /** Extra content under the buttons (e.g. a guide byline). */
  extra?: ReactNode;
  /** Price and turnaround badges, only below 1024px (where the card, which carries them, stacks under the copy): right
   *  above the buttons on tablets, right after the lead on phones (clear of the fixed call bar). */
  badges?: ReactNode;
  card?: ReactNode;
  /** Below 640px the card comes right after the lead and switcher, before the buttons (the home's phone order). */
  cardFirstOnPhone?: boolean;
  /** Sibling pages as chips between the lead and the buttons (links: they navigate, never switch on hover). */
  switcher?: HeroSwitcher;
  /** Drafting backdrop with up to 4 risers in these colors (desktop). Vent, and a color named twice, draw dashed. */
  accents?: SystemColor[];
  /** Kicker rule in a system color. */
  accent?: SystemColor;
  /** Bottom room for a FactCard that rides over the hero edge (also automatic when a FactCard follows). */
  overlap?: boolean;
  /** Warm glow behind the card; default on when there is a card. */
  glow?: boolean;
  variant?: "default" | "slim";
};

/** A note string split into its sentences, so a two-line note breaks between them. */
const sentences = (note: string) => note.split(/(?<=\.)\s+(?=[A-Z])/);

/** Headlines longer than this get a smaller desktop size, so they keep to three lines beside the card. */
const LONG_H1 = 50;

/**
 * Navy drafting hero used by every inner page (the home hero language). Renders the page's only <h1>. Grid order is
 * copy, switcher, badges, buttons and note, card (`cardFirstOnPhone`: the card before the buttons): phones read it top
 * to bottom, with the badges lifted to right after the lead; from 1024px the card spans the right column and the copy
 * sits at its top.
 */
export function PageHero({
  crumbs, kicker, h1, lead, primary, secondary, note, noteLines, extra, badges, card, cardFirstOnPhone, switcher,
  accents, accent, overlap, glow, variant = "default",
}: HeroProps) {
  const slim = variant === "slim";
  const lines = noteLines ?? (note ? sentences(note) : undefined);
  const warm = glow ?? (Boolean(card) && !slim);
  const stage = card && <div className={s.stage}>{card}</div>;
  const first = Boolean(cardFirstOnPhone && card);
  return (
    <header className={cx("pg-hero", s.hero, warm && s.glow, overlap && s.overlap, slim && s.slim)}>
      {accents && accents.length > 0 && <Backdrop accents={accents} />}
      <Container className={s.inner}>
        <Breadcrumbs items={crumbs} />
        <div className={s.grid} data-card={card ? "" : undefined} data-first={first ? "" : undefined}>
          <div className={s.intro}>
            {kicker && (
              <span className={cx("kicker", s.kicker)} data-c={accent}>
                {kicker}
              </span>
            )}
            <h1 className={s.h1} data-long={h1.length > LONG_H1 ? "" : undefined}>
              {h1}
            </h1>
            <p className="lead">{keepTogether(richNodes(lead))}</p>
          </div>
          {switcher && <Switcher {...switcher} />}
          {first && stage}
          {(primary || secondary || lines || extra || badges) && (
            <div className={s.actions}>
              {badges && <p className={s.badges}>{badges}</p>}
              {(primary || secondary) && (
                <div className="hero-cta">
                  {primary && (
                    <ButtonLink href={primary.href} size="lg" arrow>
                      {primary.label}
                    </ButtonLink>
                  )}
                  {secondary && (
                    <ButtonLink href={secondary.href} size="lg" variant="outline">
                      {secondary.label}
                    </ButtonLink>
                  )}
                </div>
              )}
              {lines && (
                <p className={cx("hero-note", s.note)}>
                  <Icon name="clock" size={16} />
                  <span>
                    {lines.map((l, i) => (
                      <Fragment key={l}>
                        {i > 0 && " "}
                        <span className={s.sentence}>
                          <Rich text={l} />
                        </span>
                      </Fragment>
                    ))}
                  </span>
                </p>
              )}
              {extra}
            </div>
          )}
          {!first && stage}
        </div>
      </Container>
    </header>
  );
}

/**
 * "What do you need?": the page and its siblings as chips. The current page is lit and marked aria-current. Five or
 * more chips drop their icons from 1024px so they fit beside the card; on phones the row scrolls, centred on the lit chip.
 */
function Switcher({ ask, items }: HeroSwitcher) {
  return (
    <nav className={s.pick} aria-labelledby="hero-switch-ask" data-many={items.length >= 5 ? "" : undefined}>
      <p id="hero-switch-ask" className={s.ask}>
        {ask}
      </p>
      <CenterCurrent />
      <ul className={s.chips} role="list">
        {items.map((it) => (
          <li key={it.href}>
            <NextLink href={it.href} className={s.chip} aria-current={it.current ? "page" : undefined}>
              {it.icon && <Icon name={it.icon} size={18} />}
              {it.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Faint drafting sheet behind the hero (the home HeroArt): column bubbles A to E with center lines, and risers in the
 * page's colors climbing the gutter between the copy and the card, then turning under it. Decorative, about 1.5 KB.
 */
function Backdrop({ accents }: { accents: SystemColor[] }) {
  const runs = accents.slice(0, 4);
  // centered on x 752 (the gutter at every desktop width, since the sheet is centered like the container), 14px apart
  const xs = runs.map((_, i) => 752 - 7 * (runs.length - 1) + 14 * i);
  const [x0 = 752, x1 = x0] = xs;
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
        <g fill="#fff" fillOpacity={0.3} fontSize={13} fontWeight={700} textAnchor="middle">
          {["A", "B", "C", "D", "E"].map((c, i) => (
            <text key={c} x={96 + i * 288} y={35}>
              {c}
            </text>
          ))}
        </g>
        <g className={s.wide} strokeWidth={3} opacity={0.5}>
          {runs.map((c, i) => {
            const d = `M${xs[i]} 840V${76 + 16 * i}H2000`;
            // vent lines, return, overflow and buried runs are dashed on drawings; a repeated color is that second run
            return c === "vent" || runs.indexOf(c) < i ? (
              <path key={i} className={s.fade} stroke={K[c]} strokeDasharray="10 7" strokeLinecap="butt" d={d} />
            ) : (
              <path key={i} className={s.draw} style={{ "--i": i } as CSSProperties} pathLength={1} stroke={K[c]} d={d} />
            );
          })}
        </g>
        <g className={cx(s.wide, s.fade)} stroke="#fff" strokeOpacity={0.16} strokeWidth={1.5}>
          <path d={`M${x0 - 6} 170h12l-12 14h12zM${x1 - 6} 214h12l-12 14h12z`} />
          <circle cx={x0} cy={260} r={4} />
          <circle cx={x1} cy={300} r={4} />
        </g>
      </svg>
    </div>
  );
}

/**
 * Right-hand hero card in the home showcase anatomy: the drawing with its caption strip (or a photo), then the title
 * row with the price and turnaround badges, an optional note, three checks and an optional Explore link. Keeps
 * `.hero-card .price` (the SEO audit compares it with the Offer on service pages).
 */
export function HeroCard({
  illustration, image, label = "Starting price", price, turnaround, note, bullets, link,
}: {
  illustration?: IllustrationName;
  image?: ImageRef;
  label?: string;
  price: string;
  turnaround: string;
  note?: string;
  bullets?: string[];
  link?: Link;
}) {
  const media = Boolean(illustration || image);
  return (
    <aside className={cx("hero-card", s.heroCard)} aria-label={`${label}: ${price}`} data-media={media ? "" : undefined}>
      {illustration ? (
        <DrawingFigure name={illustration} className={s.figure} />
      ) : (
        image && (
          <div className={s.figure}>
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority sizes="(min-width: 1024px) 640px, 100vw" />
          </div>
        )
      )}
      <div className={s.body}>
        <div className={s.titleRow}>
          <p className={s.title}>{label}</p>
          <span className={s.tags}>
            <span className={cx("hr-badge price", s.price)}>{price}</span>{" "}
            <span className="hr-badge soft">
              <Icon name="clock" size={14} />
              {turnaroundLine(turnaround)}
            </span>
          </span>
        </div>
        {note && <p className={s.meta}>{note}</p>}
        {bullets && bullets.length > 0 && (
          <ul className={cx("hr-checks", s.checks)}>
            {bullets.map((b) => (
              <li key={b}>
                <Rich text={b} />
              </li>
            ))}
          </ul>
        )}
        {link && (
          <NextLink href={link.href} className={s.explore}>
            {link.label}
            <ArrowRight size={18} aria-hidden="true" />
          </NextLink>
        )}
      </div>
    </aside>
  );
}
