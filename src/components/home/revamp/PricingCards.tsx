import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { GROUP_LABEL, usd } from "@/components/home/content";
import { Illustration } from "@/components/illustrations/Illustration";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { PRICE_ROWS, priceLabel } from "@/content/pricing";
import type { IllustrationName } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./pricing.module.css";

const ID = "plumbing-takeoff-and-estimating-pricing";

/**
 * One card per step of a bid, in order: a budget, the quantities, the priced estimate, the bid package. Variants of a
 * card (quantity and material takeoffs; residential, commercial and industrial estimates) and the ongoing plans live
 * on their own pages and /pricing, so no two cards read as the same thing. Title and line are home-page copy; price,
 * href and group come from PRICE_ROWS. The media is a zoomed crop of one drawing: `at` is the focal point, `zoom`
 * how far in we go.
 */
type Card = { href: string; title: string; line: string; drawing: IllustrationName; at: string; zoom: number };

const MONTHLY = "/services/monthly-plumbing-estimating";

const CARDS: Card[] = [
  { href: "/services/preliminary-plumbing-estimate", title: "Preliminary estimate", line: "A budget range before the drawings are finished.", drawing: "underground-plan", at: "28% 30%", zoom: 1.35 },
  // quantity and material takeoffs start at the same price, so this card speaks for all three
  { href: "/services/plumbing-takeoff", title: "Plumbing takeoff", line: "Every system measured: quantities to price or a material list to order from.", drawing: "riser-isometric", at: "10% 45%", zoom: 1.4 },
  { href: "/services/plumbing-estimating", title: "Plumbing estimate", line: "Labor, material and markups, ready to carry.", drawing: "takeoff-sheet", at: "24% 24%", zoom: 1.4 },
  { href: "/services/plumbing-bid-preparation", title: "Bid preparation", line: "Scope letter, inclusions, exclusions and the bid form.", drawing: "bid-package", at: "70% 100%", zoom: 1.25 },
];

/** Fails the build if a card points at a service without a published price, so a stale price can never ship. */
function rowFor(href: string) {
  const row = PRICE_ROWS.find((r) => r.href === href);
  if (!row) throw new Error(`pricing cards: no published price for ${href}`);
  return row;
}

/** Starting-price cards (reference slices 03-04): drawing crop, title, one line, price pill and Explore. */
export function PricingCards() {
  return (
    <Section id={ID} tone="light">
      <SectionHead
        id={ID}
        center
        kicker="What it costs"
        h2="Plumbing takeoff and estimating services, priced up front"
        intro="Our plumbing takeoff services give you quantities to price at your own rates, and our plumbing estimating services add labor, material, equipment and markups. These are starting prices: your plans get their own fixed quote, and nothing starts until you approve it."
      />
      <ul className={s.grid} role="list">
        {CARDS.map((c) => {
          const row = rowFor(c.href);
          return (
            <li key={c.href} className="hr-reveal">
              <div className={cx("hr-card", "lift", s.card)}>
                <div className={s.media} aria-hidden="true" style={{ "--at": c.at, "--zoom": c.zoom } as CSSProperties}>
                  <Illustration name={c.drawing} className={s.drawing} />
                </div>
                <div className={s.body}>
                  <span className={s.tag} aria-hidden="true">
                    {GROUP_LABEL[row.group]}
                  </span>
                  <h3 className={s.title}>
                    <Link href={c.href} className={s.stretch}>
                      {c.title}
                    </Link>
                  </h3>
                  <p className={s.line}>{c.line}</p>
                  <div className={s.foot}>
                    <span className="hr-badge">{priceLabel(row)}</span>
                    <span className={s.go} aria-hidden="true">
                      <span className={s.goText}>Explore</span>
                      <span className={s.goIcon}>
                        <ArrowRight size={16} strokeWidth={2.5} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={s.drivers}>
        <span className="hr-tile sm" aria-hidden="true">
          <Scale size={20} />
        </span>
        <div className={s.driversText}>
          <p>
            <Rich text="**What moves the price:** plumbing sheets, systems in scope, schedule-heavy or plan-heavy sets, and how fast you need it. **What doesn't:** your project's dollar value." />
          </p>
          <p className={s.custom}>
            {/* a word joiner (U+2060) after the dash keeps "10–15" on one line */}
            <Rich
              text={`Bidding every week? [Monthly plumbing estimating](${MONTHLY}) is ${usd(MONTHLY)} a month for 10–\u206015 projects. For your full bid calendar, a [dedicated plumbing estimator](${MONTHLY}#dedicated-plumbing-estimator) is a custom quote.`}
            />
          </p>
        </div>
        <ButtonLink href="/pricing" variant="outline" arrow className={s.compare}>
          Compare every service and price
        </ButtonLink>
      </div>
    </Section>
  );
}
