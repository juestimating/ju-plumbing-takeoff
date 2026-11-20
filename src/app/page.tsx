import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOME_DESCRIPTION, HOME_FAQ, HOME_KEYWORDS, HOME_TITLE } from "@/components/home/content";
import { Audiences } from "@/components/home/revamp/Audiences";
import { BidWeek } from "@/components/home/revamp/BidWeek";
import { GuidesStrip } from "@/components/home/revamp/GuidesStrip";
import { Hero } from "@/components/home/revamp/Hero";
import { HomeFaq } from "@/components/home/revamp/HomeFaq";
import { PricingCards } from "@/components/home/revamp/PricingCards";
import { Process } from "@/components/home/revamp/Process";
import { SystemExplorer } from "@/components/home/revamp/SystemExplorer";
import { TakeoffDemo } from "@/components/home/revamp/TakeoffDemo";
import { faqNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  keywords: HOME_KEYWORDS,
});

/**
 * Home page (revamp pilot). Outline: one h1 (hero), one h2 per section, h3 only for cards, steps and FAQ questions.
 * Tone rhythm: dark hero with a floating fact card, then alt, dark, light, dark, alt, light, alt, light, and the dark quote band.
 * Everything inside .hr uses the home design language in src/styles/home.css (pill buttons, kicker heads, soft cards).
 * The Organization, WebSite and ProfessionalService schema nodes come from the root layout.
 */
export default function Home() {
  return (
    <div className="hr">
      <JsonLd
        nodes={[
          webPageNode({ path: "/", name: HOME_TITLE, description: HOME_DESCRIPTION, modified: SITE.lastReviewed }),
          faqNode(HOME_FAQ),
        ]}
      />
      <Hero />
      <SystemExplorer />
      <TakeoffDemo />
      <PricingCards />
      <Process />
      <BidWeek />
      <Audiences />
      <HomeFaq />
      <GuidesStrip />
      <CtaBand source="/" />
    </div>
  );
}
