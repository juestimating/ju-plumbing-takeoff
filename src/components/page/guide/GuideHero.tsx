import type { CSSProperties } from "react";
import { Clock } from "lucide-react";
import { GUIDE_ART, STRIP_SPAN, Strip } from "@/components/illustrations/strips";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Container } from "@/components/ui/Section";
import type { GuideMeta } from "@/content/types";
import { CLAIMS, SITE } from "@/lib/site";
import { cx, formatDate } from "@/lib/utils";
import { CATEGORY_KICKER, type Offer } from "./template";
import s from "./guide.module.css";

/**
 * Guide hero: welcome and orient on the left (kicker, the page's one h1, lead and a drafting title block in place of a
 * byline), the hand-off decision on the right from 1024px (the guide's own drawn strip, "Skip the takeoff", the
 * published price and the quote promise). Below 1024px the card body is hidden for everyone and its strip becomes a
 * paper band along the hero's bottom edge: phones keep the sticky Call and quote bar instead. Columns match the
 * article grid below, so the card lines up with the sidebar.
 */
export function GuideHero({ meta, sections, items, offer }: { meta: GuideMeta; sections: number; items?: number; offer: Offer }) {
  const art = GUIDE_ART[meta.slug] ?? "fixtures";
  return (
    <header className={cx("pg-hero", s.hero)}>
      <Container>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: meta.h1 }]}
        />
        <div className={s.heroGrid}>
          <div>
            <span className={cx("kicker", s.kicker)}>{CATEGORY_KICKER[meta.category]}</span>
            <h1 className={s.h1}>{meta.h1}</h1>
            <p className="lead">
              <Rich text={meta.lead ?? meta.description} />
            </p>
            <dl className={s.tb}>
              <div>
                <dt>Written by</dt>
                <dd>{SITE.name}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>
                  <time dateTime={meta.dateModified}>{formatDate(meta.dateModified)}</time>
                </dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>{meta.readingMinutes} min</dd>
              </div>
              <div>
                <dt>{items ? "Checklist" : "In this guide"}</dt>
                <dd>{items ? `${items} items` : `${sections} sections`}</dd>
              </div>
            </dl>
          </div>
          <div className={s.card} data-print="hide">
            <div className={s.band} style={{ "--span": STRIP_SPAN[art] } as CSSProperties}>
              <Strip name={art} className={s.strip} flowClassName={s.flow} />
            </div>
            <div className={s.body}>
              <p className={s.label}>Bid due this week?</p>
              <p className={s.title}>{offer.title}</p>
              <p className={s.badges}>
                <span className="hr-badge">{offer.price}</span>{" "}
                <span className="hr-badge soft">{CLAIMS.turnaround}</span>
              </p>
              <p className={s.note}>
                <Clock size={16} aria-hidden="true" />
                <span>Fixed quote {CLAIMS.quote}. No obligation, and an {CLAIMS.nda}.</span>
              </p>
              <div className={s.buttons}>
                <ButtonLink href={offer.href} arrow block>
                  Get a fixed quote
                </ButtonLink>
                <ButtonLink href="/samples" variant="outline" block>
                  See a sample file
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
