import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Rich, richNodes } from "@/components/ui/Rich";
import { keepTogether } from "@/components/mdx/keep";
import { SITE } from "@/lib/site";
import { cx, formatMonthYear } from "@/lib/utils";
import type { FaqItem, Tone } from "@/content/types";
import { HelpCard } from "./HelpCard";
import s from "./faq.module.css";

/** Intro for page FAQs: the questions every page would share live once, on /faq. */
export const FAQ_PAGE_NOTE = "Files, turnaround, revisions and NDAs are answered once for every service on the [plumbing takeoff and estimating FAQ](/faq).";

/**
 * Numbered accordion cards on native <details> (zero JS; every answer stays in the HTML for crawlers). Each question is
 * a real <h3> in the summary, so it must render the same array the page's faqNode() JSON-LD is built from. `name`
 * makes it one accordion where the browser supports it; `start` continues the numbering across groups (/faq).
 */
export function FaqItems({ items, name, start = 1, openFirst = true }: { items: FaqItem[]; name: string; start?: number; openFirst?: boolean }) {
  return (
    <div className={s.list}>
      {items.map((f, i) => (
        <details key={f.q} className={cx("faq-item", s.item)} name={name} open={openFirst && i === 0}>
          <summary className={s.sum}>
            <span className={s.num} aria-hidden="true">
              {String(start + i).padStart(2, "0")}
            </span>
            <h3 className={cx("faq-q", s.q)}>
              <Rich text={f.q} />
            </h3>
            <span className={s.icon} aria-hidden="true" />
          </summary>
          <div className={cx("faq-a", s.a)}>
            {f.a.split("\n\n").map((p, j) => (
              <p key={j}>{keepTogether(richNodes(p))}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

/**
 * FAQ section (the home FAQ): heading and the navy help card on the left, numbered cards on the right from 1024px;
 * the help card stays in view while the questions scroll. DOM order is head, questions, help card, so phones read it
 * top to bottom. Pair with faqNode(items) JSON-LD in the page template.
 */
export function FaqSection({
  items, id = "frequently-asked-questions", h2 = "Frequently asked questions", intro, tone = "light", updated, showReviewed = true,
  kicker = "FAQ", name, openFirst = true, help = true, allHref = "/faq",
}: {
  items: FaqItem[];
  id?: string;
  h2?: string;
  intro?: string;
  tone?: Tone;
  updated?: string;
  showReviewed?: boolean;
  kicker?: string;
  /** <details name>: one open at a time. Defaults to the section id. */
  name?: string;
  openFirst?: boolean;
  help?: boolean;
  /** "See all FAQs" under the help card; false on /faq itself. */
  allHref?: string | false;
}) {
  if (!items.length) return null;
  return (
    <Section id={id} tone={tone}>
      <div className={s.layout}>
        <div className={s.head}>
          <SectionHead id={id} kicker={kicker} h2={h2} intro={intro} />
        </div>
        <div className={s.qa}>
          <FaqItems items={items} name={name ?? id} openFirst={openFirst} />
          {showReviewed && (
            <p className={s.reviewed}>
              Last reviewed <strong>{formatMonthYear(updated ?? SITE.lastReviewed)}</strong>. Prices and turnaround are checked quarterly.
            </p>
          )}
        </div>
        {(help || allHref) && (
          <div className={s.help}>
            {help && <HelpCard />}
            {allHref && (
              <Link href={allHref} className="arrow-link">
                See all FAQs <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
