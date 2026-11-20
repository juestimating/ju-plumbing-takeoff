import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { pagePath } from "@/content/registry";
import {
  COPY, accentsFor, barPrice, consultRow, h2For, heroDrawing, heroLink, kickerFor, primaryLabel, quoteService, sectionBar,
  switcherFor,
} from "@/content/template";
import type { PageContent } from "@/content/types";
import { breadcrumbNode, faqNode, serviceNode, webPageNode } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import { ContentBlock } from "./ContentBlock";
import { CtaBand } from "./CtaBand";
import { FactCard } from "./FactCard";
import { FAQ_PAGE_NOTE, FaqSection } from "./Faq";
import { PageHero } from "./PageHero";
import { PageJump } from "./PageJump";
import { RelatedLinks } from "./RelatedLinks";
import { HowItWorks } from "./Standard";
import { ContentHeroCard } from "./shell/ContentHeroCard";
import { PriceBlock } from "./shell/PriceBlock";
import s from "./shell/shell.module.css";

/**
 * Template for every /services/* page, in the home journey: welcome and orient (hero with the page's drawing and the
 * sibling-service switcher), trust (fact card), wayfinding (the section bar with price and "Send your plans"), the
 * content blocks in content order (ContentBlock decides their look), then de-risk (how it works, price and the
 * ladder, related pages, FAQ) and convert (the quote band).
 * Outline: the hero's h1, one h2 per section, h3 only for cards, steps and FAQ questions. Template words live in
 * src/content/template.ts.
 */
export function ContentPage({ page }: { page: PageContent }) {
  const path = pagePath(page);
  const h2 = h2For(page);
  const quote = { label: primaryLabel(page), href: `/contact?service=${quoteService(page)}` };
  // the fact card's band and, on phones, the section bar take the first block's tone, so they lead into it
  const band = page.blocks[0]?.tone ?? "light";
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path, name: page.seo.title, description: page.seo.description, modified: page.updated }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: page.nav.label, path },
          ]),
          serviceNode({ path, name: page.hero.h1, description: page.seo.description, serviceType: page.serviceType, from: page.price.from }),
          faqNode(page.faq),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: page.nav.label }]}
        kicker={COPY.kicker}
        accent={page.nav.color}
        accents={accentsFor(page)}
        h1={page.hero.h1}
        lead={page.hero.lead}
        switcher={switcherFor(page)}
        primary={quote}
        secondary={page.hero.secondaryCta ?? COPY.sample}
        note={page.hero.note}
        noteLines={page.hero.note ? undefined : [...(page.price.from === null ? COPY.noteCustom : COPY.note)]}
        badges={
          <>
            <span className="hr-badge">{page.price.display}</span>{" "}
            <span className="hr-badge soft">
              <Icon name="clock" size={14} />
              {page.price.turnaround}
            </span>
          </>
        }
        card={<ContentHeroCard page={page} link={heroLink(page)} />}
      />
      <FactCard tone={band} after={<p>{COPY.offices}</p>} />
      {/* The bar's containing block: it stays stuck under the header until the FAQ ends, then leaves with the quote band. */}
      <div className={cx(s.flow, band === "alt" && s.alt)}>
        <PageJump
          variant="bar"
          items={sectionBar(page)}
          aside={
            <>
              <span data-bar-price="">{barPrice(page)}</span>
              {/* outline: the header pill stays the one amber button in that corner */}
              <ButtonLink href="#get-quote" size="sm" variant="outline">
                {COPY.sendPlans}
              </ButtonLink>
            </>
          }
        />
        {page.blocks.map((b) => (
          <ContentBlock key={b.id} block={b} page={page} kicker={kickerFor(b)} heroDrawing={heroDrawing(page)} />
        ))}
        {page.howItWorks !== false && (
          <HowItWorks
            content={page.howItWorks}
            h2={page.howItWorks ? undefined : h2.howItWorks}
            service={quoteService(page)}
            urgent={!consultRow(page)}
            ctaRow={consultRow(page) ? { primary: quote, secondary: { label: COPY.consult, href: SITE.bookingUrl } } : undefined}
          />
        )}
        <PriceBlock page={page} h2={h2.price} />
        <RelatedLinks hrefs={page.related} h2={h2.related} tone="light" />
        <FaqSection items={page.faq} updated={page.updated} h2={h2.faq} intro={FAQ_PAGE_NOTE} tone="alt" />
      </div>
      <CtaBand source={path} h2={h2.quote} />
    </>
  );
}
