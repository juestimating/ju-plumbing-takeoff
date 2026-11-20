import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import type { CardsBlock } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./cards.module.css";

/** "Where we work": building or facility types as home cards with an amber icon tile. Content only, no links. */
export function TypeCards({ b, kicker }: { b: CardsBlock; kicker?: string }) {
  const linked = b.cards.find((c) => c.href || c.tag);
  if (linked) throw new Error(`TypeCards ${b.id}: card "${linked.title}" has an href or tag, which this view does not render`);
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} center />
      <ul className={s.grid} data-cols={b.columns ?? 3}>
        {b.cards.map((c) => (
          <li key={c.title} className="hr-reveal">
            <div className={cx("hr-card lift", s.card)}>
              {c.icon && (
                <span className="hr-tile" data-c={c.color}>
                  <Icon name={c.icon} size={22} />
                </span>
              )}
              <h3>
                <Rich text={c.title} />
              </h3>
              <p className="copy">
                <Rich text={c.body} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
