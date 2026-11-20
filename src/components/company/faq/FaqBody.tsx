import { ArrowUp } from "lucide-react";
import { FaqItems } from "@/components/page/Faq";
import { HelpCard } from "@/components/page/HelpCard";
import { PageJump } from "@/components/page/PageJump";
import { Icon } from "@/components/ui/Icon";
import { Container, SectionHead } from "@/components/ui/Section";
import type { IconName } from "@/content/types";
import { SITE } from "@/lib/site";
import { cx, formatMonthYear } from "@/lib/utils";
import { FAQ_ALL_ITEMS, FAQ_GROUPS } from "./content";
import s from "./faq-page.module.css";

const TOPIC_ICON: Record<string, IconName> = {
  "getting-started": "upload",
  "pricing-and-turnaround": "dollar",
  "accuracy-and-quality": "shield-check",
  "files-and-revisions": "file-spreadsheet",
  confidentiality: "lock",
};
const count = (n: number) => `${n} question${n === 1 ? "" : "s"}`;

/** "Pick a topic": the hero card, a help desk index of the five groups with their question counts (in-page links). */
export function TopicCard() {
  return (
    <nav id="faq-topics" className={s.topics} aria-labelledby="faq-topics-ask">
      <p id="faq-topics-ask" className={s.ask}>
        Pick a topic
      </p>
      <ul className={s.list} role="list">
        {FAQ_GROUPS.map((g) => (
          <li key={g.id}>
            <a href={`#${g.id}`} className={s.topic}>
              <span className={cx("hr-tile sm", s.tile)} aria-hidden="true">
                <Icon name={TOPIC_ICON[g.id] ?? "message"} />
              </span>
              <span className={s.topicText}>
                <span className={s.topicLabel}>{g.chip}</span>
                <span className="hr-badge soft">{count(g.items.length)}</span>
              </span>
              <span className={s.go} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className={s.foot}>
        {count(FAQ_ALL_ITEMS.length)} · Last reviewed {formatMonthYear(SITE.lastReviewed)}
      </p>
    </nav>
  );
}

/**
 * The five groups in one alt band, numbered 01 to 18 across the page, beside a sticky rail (where am I, plus the help
 * card) from 1024px. Phones read the groups, each with a way back to the topic card, then the help card.
 */
export function FaqBody() {
  const starts = FAQ_GROUPS.map((_, i) => 1 + FAQ_GROUPS.slice(0, i).reduce((n, g) => n + g.items.length, 0));
  return (
    <div id="faq-body" className="sec tone-alt">
      <Container className={s.grid}>
        <div className={s.groups}>
          {FAQ_GROUPS.map((g, i) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className={s.group}>
              <SectionHead id={g.id} kicker={count(g.items.length)} h2={g.h2} />
              <FaqItems items={g.items} name={g.id} start={starts[i]} openFirst={i === 0} />
              <a href="#faq-topics" className={cx("arrow-link", s.back)}>
                <ArrowUp size={18} aria-hidden="true" />
                Back to topics
              </a>
            </section>
          ))}
          <p className={s.reviewed}>
            Last reviewed <strong>{formatMonthYear(SITE.lastReviewed)}</strong>. Prices and turnaround are checked quarterly.
          </p>
        </div>
        <aside className={s.rail} aria-label="Topics and help">
          <PageJump variant="rail" items={FAQ_GROUPS.map((g) => ({ id: g.id, label: g.chip, count: g.items.length }))} className={s.jump} />
          <HelpCard compact />
        </aside>
      </Container>
    </div>
  );
}
