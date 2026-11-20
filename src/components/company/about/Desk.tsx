import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import type { ProseBlock } from "@/content/types";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./about.module.css";

/**
 * "Behind the brand": who runs the plumbing desk (the block's prose) beside a navy card with the two working facts
 * the old hero card carried, the second one linking down to the offices.
 */
export function Desk({ block, officesId }: { block: ProseBlock; officesId: string }) {
  const places = SITE.offices.map((o) => `${o.city}, ${o.region}`).join(" and ");
  return (
    <Section id={block.id} tone="light">
      <div className={s.deskGrid}>
        <div>
          <SectionHead id={block.id} kicker="Behind the brand" h2={block.h2} intro={block.intro} />
          <div className={cx("copy", s.deskCopy)}>
            {block.paragraphs.map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>
        <ul className={cx("tone-dark", s.deskFacts)} role="list">
          <li>
            <span className="hr-tile" aria-hidden="true">
              <Icon name="network" size={22} />
            </span>
            <span>Most projects handled entirely online</span>
          </li>
          <li>
            <span className="hr-tile" aria-hidden="true">
              <Icon name="map-pin" size={22} />
            </span>
            <a href={`#${officesId}`} className={s.deskLink}>
              Offices in {places}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
