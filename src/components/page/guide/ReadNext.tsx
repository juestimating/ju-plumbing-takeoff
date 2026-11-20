import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIDE_ART, STRIP_SPAN, Strip } from "@/components/illustrations/strips";
import { getGuide } from "@/content/guides";
import { cx } from "@/lib/utils";
import s from "./guide.module.css";

/** The home guide card turned sideways, at the end of the article: one curated next guide, then the whole shelf. */
export function ReadNext({ slug }: { slug: string }) {
  const next = getGuide(slug);
  if (!next) throw new Error(`guide template: Read next points at a missing guide (${slug})`);
  const { meta } = next;
  const art = GUIDE_ART[slug] ?? "fixtures";
  return (
    <div className={s.next} data-print="hide">
      <div className="hr-reveal">
        <div className={cx("hr-card lift", s.nextCard)}>
          <div className={s.nextBand} style={{ "--span": STRIP_SPAN[art] } as CSSProperties}>
            <Strip name={art} className={s.strip} flowClassName={s.flow} />
          </div>
          <div className={s.nextBody}>
            <p className={s.nextLabel}>Read next</p>
            <p className={s.nextMeta}>
              <span className="hr-badge">{meta.category}</span>{" "}
              <span className="hr-badge soft">
                <Clock size={14} aria-hidden="true" />
                {meta.readingMinutes} min read
              </span>
            </p>
            <p className={s.nextTitle}>
              <Link href={`/guides/${slug}`} className={s.stretch}>
                {meta.h1}
              </Link>
            </p>
            <p className={s.nextBlurb}>{meta.lead ?? meta.description}</p>
            <span className={s.go} aria-hidden="true">
              Read the guide <ArrowRight size={16} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
      <Link href="/guides" className={cx("arrow-link", s.all)}>
        All plumbing estimating guides <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}
