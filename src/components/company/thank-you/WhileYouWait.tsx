import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIDE_ART, Strip } from "@/components/illustrations/strips";
import { Section, SectionHead } from "@/components/ui/Section";
import { getGuide } from "@/content/guides";
import type { CardsBlock } from "@/content/types";
import { plain } from "@/lib/schema";
import { cx } from "@/lib/utils";
import s from "./thank-you.module.css";

const GUIDE = "/guides/";

/**
 * "Keep reading": the block's cards as the home guide cards. A guide card carries the guide's drawn strip (the one
 * it shows everywhere, from GUIDE_ART) and its category and reading time; the samples card gets a CSS workbook strip
 * whose highlighted row steps down on hover. The whole card is the link (stretched title link).
 */
export function WhileYouWait({ block }: { block: CardsBlock }) {
  return (
    <Section id={block.id} tone={block.tone ?? "alt"}>
      <SectionHead id={block.id} kicker="Keep reading" h2={block.h2} intro={block.intro} />
      <ul className={s.cards} role="list">
        {block.cards.map((c) => {
          const href = c.href ?? "";
          const slug = href.startsWith(GUIDE) ? href.slice(GUIDE.length) : "";
          const meta = slug ? getGuide(slug)?.meta : undefined;
          return (
            <li key={c.title} className="hr-reveal">
              <div className={cx("hr-card lift", s.card)}>
                <div className={s.band}>
                  {slug ? (
                    <Strip name={GUIDE_ART[slug] ?? "fixtures"} className={s.art} flowClassName={s.flow} />
                  ) : (
                    <span className={s.sheet} aria-hidden="true">
                      <i className={s.hit} />
                    </span>
                  )}
                </div>
                <div className={s.body}>
                  {/* guides: category and reading time from the guide itself; the samples card: its category only */}
                  {(meta || href === "/samples") && (
                    <p className={s.meta}>
                      {meta ? (
                        <>
                          <span className="hr-badge">{meta.category}</span>{" "}
                          <span className="hr-badge soft">
                            <Clock size={14} aria-hidden="true" />
                            {meta.readingMinutes} min read
                          </span>
                        </>
                      ) : (
                        <span className="hr-badge">Samples</span>
                      )}
                    </p>
                  )}
                  <h3 className={s.title}>
                    {href ? (
                      <Link href={href} className={s.stretch}>
                        {plain(c.title)}
                      </Link>
                    ) : (
                      plain(c.title)
                    )}
                  </h3>
                  <p className={s.blurb}>{plain(c.body)}</p>
                  {href && (
                    <span className={s.go} aria-hidden="true">
                      {slug ? "Read the guide" : href === "/samples" ? "See the samples" : "Explore"}
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
