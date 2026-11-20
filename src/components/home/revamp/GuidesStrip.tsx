import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIDES_HEAD } from "@/components/home/content";
import { GUIDE_ART, Strip } from "@/components/illustrations/strips";
import { Section, SectionHead } from "@/components/ui/Section";
import { getGuide } from "@/content/guides";
import g from "./guides.module.css";

/**
 * Three guide cards. Title, category and reading time come from each guide's own meta, so they always match the
 * guide page; the blurb is written for the home page. The whole card is the link (stretched title link).
 * The head row pairs the section head with a right-aligned link to the guides hub; on narrow screens it wraps under.
 */
export function GuidesStrip() {
  const cards = GUIDES_HEAD.items.flatMap(({ slug, blurb }) => {
    const guide = getGuide(slug);
    return guide ? [{ slug, blurb, meta: guide.meta }] : [];
  });
  if (!cards.length) return null;
  return (
    <Section id={GUIDES_HEAD.id} tone="light">
      <div className={g.headRow}>
        <SectionHead
          id={GUIDES_HEAD.id}
          kicker="Learn the method"
          h2={GUIDES_HEAD.h2}
          intro="Plain-language guides on measuring, pricing and bidding plumbing work, from the method to common [plumbing estimating mistakes](/guides/plumbing-estimating-mistakes)."
        />
        <Link href="/guides" className="arrow-link">
          All plumbing estimating guides <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <ul className={g.grid}>
        {cards.map(({ slug, blurb, meta }) => {
          return (
            <li key={slug} className="hr-reveal">
              <div className={`hr-card lift ${g.card}`}>
                <div className={g.band}>
                  <Strip name={GUIDE_ART[slug] ?? "fixtures"} className={g.art} flowClassName={g.flow} />
                </div>
                <div className={g.body}>
                  <p className={g.meta}>
                    <span className="hr-badge">{meta.category}</span>
                    <span className="hr-badge soft">
                      <Clock size={14} aria-hidden="true" />
                      {meta.readingMinutes} min read
                    </span>
                  </p>
                  <h3 className={g.title}>
                    <Link href={`/guides/${slug}`} className={g.stretch}>
                      {meta.h1}
                    </Link>
                  </h3>
                  <p className={g.blurb}>{blurb}</p>
                  <span className={g.go} aria-hidden="true">
                    Read the guide <ArrowRight size={16} strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
