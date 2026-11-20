import { CtaBand } from "./CtaBand";
import { FAQ_PAGE_NOTE, FaqSection } from "./Faq";
import { GuideHero } from "./guide/GuideHero";
import { GuideNav, type TocItem } from "./guide/GuideNav";
import { HandOffCards } from "./guide/HandOffCards";
import { HandoffCard } from "./guide/HandoffCard";
import { ReadNext } from "./guide/ReadNext";
import { HANDOFF_INTRO, offerFor, templateFor } from "./guide/template";
import s from "./guide/guide.module.css";
import { TickLi } from "@/components/mdx/Mdx";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import type { Guide } from "@/content/guides";
import { articleNode, breadcrumbNode, faqNode, webPageNode } from "@/lib/schema";
import { cx } from "@/lib/utils";

const TICKS = { li: TickLi };

/**
 * Layout for every /guides/<slug> page (guides SPEC 5): hero with the title block and hand-off card; the article with
 * its reading navigator (rail or phone bar) and sidebar card, then Read next; Hand it off; FAQ with the help card;
 * the quote band. The MDX body renders inside .prose-ju and must not contain an h1. `toc` comes from the MDX source
 * (same slugger as rehype-slug); `items` is the checklist size on the two tick guides.
 */
export function GuidePage({ guide, toc, items }: { guide: Guide; toc: TocItem[]; items?: number }) {
  const { meta, Body } = guide;
  const path = `/guides/${meta.slug}`;
  const t = templateFor(meta.slug);
  const offer = offerFor(meta.related[0] ?? "");
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path, name: meta.title, description: meta.description, modified: meta.dateModified }),
          articleNode({ path, headline: meta.h1, description: meta.description, published: meta.datePublished, modified: meta.dateModified, keywords: meta.keywords }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: meta.h1, path },
          ]),
          faqNode(meta.faq ?? []),
        ]}
      />
      <GuideHero meta={meta} sections={toc.length} items={t.ticks ? items : undefined} offer={offer} />
      <Section tone="light">
        <div className={s.wrap} data-guide="">
          <aside className={s.aside} aria-label="Guide navigation" data-print="hide">
            <GuideNav items={toc} minutes={meta.readingMinutes} ticks={t.ticks ? { key: `ju-ticks:${meta.slug}:${meta.dateModified}` } : undefined} />
            <HandoffCard offer={offer} />
          </aside>
          <article className={cx("prose-ju", s.article)} data-guide-article="">
            <p className="kicker lede-k">The short answer</p>
            <Body components={t.ticks ? TICKS : undefined} />
          </article>
          <ReadNext slug={t.next} />
        </div>
      </Section>
      <HandOffCards hrefs={meta.related} h2={t.related} intro={HANDOFF_INTRO} />
      <FaqSection items={meta.faq ?? []} updated={meta.dateModified} h2={t.faq} intro={FAQ_PAGE_NOTE} name="guide-faq" />
      <CtaBand source={path} h2={t.band} />
    </>
  );
}
