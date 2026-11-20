import { PageHero } from "@/components/page/PageHero";
import { ProofBar } from "@/components/page/ProofBar";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqBody, TopicCard } from "@/components/company/faq/FaqBody";
import { FAQ_ALL_ITEMS, FAQ_HERO, FAQ_PATH, FAQ_RELATED, FAQ_SEO } from "@/components/company/faq/content";
import { breadcrumbNode, faqNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({ ...FAQ_SEO, path: FAQ_PATH });

/** "Is my question here, and who do I ask if not?": a topic card in the hero, then every group beside the help card. */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path: FAQ_PATH, name: FAQ_SEO.title, description: FAQ_SEO.description, modified: SITE.lastReviewed }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "FAQ", path: FAQ_PATH },
          ]),
          // One FAQPage for the whole page, with every question from every group.
          faqNode(FAQ_ALL_ITEMS),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        kicker={FAQ_HERO.kicker}
        h1={FAQ_HERO.h1}
        lead={FAQ_HERO.lead}
        primary={FAQ_HERO.primary}
        secondary={FAQ_HERO.secondary}
        note={FAQ_HERO.note}
        card={<TopicCard />}
      />
      <ProofBar tone="alt" />
      <FaqBody />
      <RelatedLinks id={FAQ_RELATED.id} h2={FAQ_RELATED.h2} hrefs={FAQ_RELATED.hrefs} tone="light" />
      <CtaBand source={FAQ_PATH} h2="Questions answered? Send your plumbing plans for a fixed quote" />
    </>
  );
}
