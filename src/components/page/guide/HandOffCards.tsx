import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { keepTogether } from "@/components/mdx/keep";
import { Icon } from "@/components/ui/Icon";
import { Rich, richNodes } from "@/components/ui/Rich";
import { Section } from "@/components/ui/Section";
import { PRICE_ROWS, priceLabel } from "@/content/pricing";
import type { Tone } from "@/content/types";
import { describeHref } from "@/lib/routes";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./handoff.module.css";

/** Published starting price for a service page. Throws (fails the build) when the price is missing. */
function priceFor(href: string): string {
  const row = PRICE_ROWS.find((r) => r.href === href);
  if (!row) throw new Error(`hand-off cards: no published price for ${href}`);
  return priceLabel(row);
}

/**
 * "Hand it off": the services that do the work a guide teaches, as the home pricing cards (without drawings): icon
 * tile, the page's name as the whole-card link, its blurb, the published price and the turnaround, and an Explore
 * footer. Head row: section head left, "See a sample file" right.
 */
export function HandOffCards({
  hrefs, id = "related-services", kicker = "Hand it off", h2, intro, tone = "alt",
}: { hrefs: string[]; id?: string; kicker?: string; h2: string; intro?: string; tone?: Tone }) {
  const cards = hrefs.map((href) => {
    const info = describeHref(href);
    if (!info) throw new Error(`hand-off cards: no page for ${href}`);
    return { ...info, href, price: priceFor(href) };
  });
  return (
    <Section id={id} tone={tone}>
      <div className={s.headRow}>
        {/* SectionHead's markup; the intro keeps "24–72 hours" on one line (SectionHead takes it as a plain string) */}
        <div className="sec-head">
          {kicker && <span className="kicker">{kicker}</span>}
          <h2 id={`${id}-h`}>
            <Rich text={h2} />
          </h2>
          {intro && <p className="sec-intro">{keepTogether(richNodes(intro))}</p>}
        </div>
        <Link href="/samples" className="arrow-link">
          See a sample file <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <ul className={s.grid} data-n={cards.length} role="list">
        {cards.map((c) => (
          <li key={c.href} className="hr-reveal">
            <div className={cx("hr-card lift", s.card)}>
              <span className={cx("hr-tile", s.tile)} aria-hidden="true">
                <Icon name={c.icon} size={22} />
              </span>
              <h3 className={s.title}>
                <Link href={c.href} className={s.stretch}>
                  {c.label}
                </Link>
              </h3>
              <p className={s.blurb}>{c.blurb}</p>
              <p className={s.badges}>
                <span className="hr-badge">{c.price}</span>{" "}
                <span className="hr-badge soft">{CLAIMS.turnaround}</span>
              </p>
              <span className={s.go} aria-hidden="true">
                Explore
                <span className={s.arrow}>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
