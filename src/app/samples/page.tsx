import { PageHero, HeroCard } from "@/components/page/PageHero";
import { ProofBar } from "@/components/page/ProofBar";
import { FaqSection } from "@/components/page/Faq";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { SampleMatcher } from "@/components/company/samples/SampleMatcher";
import { WorkbookSection } from "@/components/company/samples/Workbook";
import {
  SAMPLES_FAQ, SAMPLES_HERO, SAMPLES_PATH, SAMPLES_RELATED, SAMPLES_SEO,
} from "@/components/company/samples/content";
import { breadcrumbNode, faqNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({ ...SAMPLES_SEO, path: SAMPLES_PATH });

/**
 * "What will I actually get, and can I check it?": the three sample sheets as one workbook whose lines trace back to
 * the plan sheets, then a request slip for a real sample like the visitor's own project.
 */
export default function SamplesPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path: SAMPLES_PATH, name: SAMPLES_SEO.title, description: SAMPLES_SEO.description, modified: SITE.lastReviewed }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Sample takeoffs", path: SAMPLES_PATH },
          ]),
          faqNode(SAMPLES_FAQ.items),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Sample takeoffs" }]}
        kicker={SAMPLES_HERO.kicker}
        h1={SAMPLES_HERO.h1}
        lead={SAMPLES_HERO.lead}
        primary={SAMPLES_HERO.primary}
        secondary={SAMPLES_HERO.secondary}
        note={SAMPLES_HERO.note}
        card={<HeroCard illustration="plan-markup" {...SAMPLES_HERO.card} />}
      />
      <ProofBar tone="alt" />
      <WorkbookSection />
      <SampleMatcher />
      <RelatedLinks id={SAMPLES_RELATED.id} h2={SAMPLES_RELATED.h2} hrefs={SAMPLES_RELATED.hrefs} tone="alt" />
      <FaqSection id={SAMPLES_FAQ.id} h2={SAMPLES_FAQ.h2} items={SAMPLES_FAQ.items} tone="light" updated={SITE.lastReviewed} />
      <CtaBand source={SAMPLES_PATH} h2="Get a plumbing takeoff like the sample, built from your plans" />
    </>
  );
}
