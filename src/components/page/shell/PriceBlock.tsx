import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { turnaroundLine } from "@/content/pricing";
import { COPY, ladderFor, priceIntro, primaryLabel, quoteService } from "@/content/template";
import type { PageContent } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./price.module.css";

const ID = "pricing-and-turnaround";

/**
 * "What it costs" on a content page: what moves the price (the page's own pricing copy when it has one) beside the
 * price card, then the price ladder, every service in bid order on one navy pipe, so a visitor on the wrong page finds
 * the right one. Stops are whole-card links (the name is stretched over the card).
 */
export function PriceBlock({ page, h2 }: { page: PageContent; h2: string }) {
  const custom = page.price.from === null;
  const { stops } = ladderFor(page);
  return (
    <Section id={ID} tone="alt">
      <SectionHead id={ID} kicker={COPY.price.kicker} h2={h2} intro={priceIntro(page)} layout="split" />
      <div className={s.row}>
        <div className={s.drivers}>
          <span className="hr-tile sm" aria-hidden="true">
            <Icon name="scale" />
          </span>
          <div className={s.text}>
            {(page.pricing?.paragraphs ?? COPY.price.drivers).map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
            {page.pricing?.bullets && (
              <ul className="hr-checks">
                {page.pricing.bullets.map((b) => (
                  <li key={b}>
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={s.card}>
          <p className={s.label}>{custom ? COPY.price.labelCustom : COPY.price.label}</p>
          <p className={s.amount}>{page.price.display}</p>
          <p className={s.meta}>
            <span className="hr-badge soft">
              <Icon name="clock" size={14} />
              {turnaroundLine(page.price.turnaround)}
            </span>
            {page.price.note && <span>{page.price.note}</span>}
          </p>
          <ButtonLink href={`/contact?service=${quoteService(page)}`} size="lg" block arrow className={s.cta}>
            {primaryLabel(page)}
          </ButtonLink>
          <p className={s.quote}>{COPY.price.quoteLine}</p>
        </div>
      </div>
      <div className={s.ladder}>
        <p id="price-ladder" className={s.ladderLabel}>
          {COPY.price.ladder}
        </p>
        <ol className={s.stops} aria-labelledby="price-ladder" role="list">
          {stops.map((st) => (
            // the li carries the pipe and fitting, the card inside it lifts on hover
            <li key={st.href} className={s.stop} data-on={st.current ? "" : undefined} data-branch={st.branch ? "" : undefined}>
              <div className={s.stopCard}>
                <Link href={st.href} className={s.name} aria-current={st.current ? "page" : undefined}>
                  {st.label}
                </Link>
                <span className={s.tags}>
                  <span className="hr-badge">{st.price}</span>
                  {st.current && <span className={s.here}>{COPY.price.here}</span>}
                </span>
                <span className={s.best}>{st.bestFor}</span>
                <span className={s.go} aria-hidden="true" />
              </div>
            </li>
          ))}
        </ol>
        <Link href="/pricing" className={cx("arrow-link", s.all)}>
          {COPY.price.all}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
