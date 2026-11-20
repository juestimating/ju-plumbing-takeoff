import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHead } from "@/components/ui/Section";
import { describeHref } from "@/lib/routes";
import { cx } from "@/lib/utils";
import type { Tone } from "@/content/types";
import s from "./related.module.css";

/**
 * Related pages as whole-card links (the home pricing and guide cards): tile with the page's icon, the target page's
 * real name as the link text, its blurb, and an Explore footer. Guides read "Read the guide". The title link is
 * stretched over the card, so the focus ring traces the whole card.
 */
export function RelatedLinks({
  hrefs, id = "related-services", h2 = "Related plumbing takeoff and estimating pages", kicker = "Keep exploring", intro, tone = "alt",
}: { hrefs: string[]; id?: string; h2?: string; kicker?: string; intro?: string; tone?: Tone }) {
  const items = hrefs.flatMap((href) => {
    const info = describeHref(href);
    return info ? [{ ...info, href }] : [];
  });
  if (!items.length) return null;
  return (
    <Section id={id} tone={tone}>
      <SectionHead id={id} kicker={kicker} h2={h2} intro={intro} />
      <ul className={s.grid} data-count={items.length} role="list">
        {items.map((it) => {
          const guide = it.href.startsWith("/guides/");
          return (
            <li key={it.href} className="hr-reveal">
              <div className={cx("hr-card lift", s.card)} data-kind={guide ? "guide" : undefined}>
                <span className={cx("hr-tile", s.tile)} aria-hidden="true">
                  <Icon name={it.icon} size={22} />
                </span>
                <div className={s.text}>
                  <Link href={it.href} className={s.title}>
                    {it.label}
                  </Link>
                  <p className={s.blurb}>{it.blurb}</p>
                </div>
                <span className={s.go} aria-hidden="true">
                  <span className={s.goText}>{guide ? "Read the guide" : "Explore"}</span>
                  <span className={s.arrow} />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
