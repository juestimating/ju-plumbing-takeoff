import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HUBS } from "@/content/hubs";
import { HOW_IT_WORKS } from "@/content/shared";
import type { IconName } from "@/content/types";
import { breadcrumbNode, faqNode, itemListNode, webPageNode } from "@/lib/schema";
import { CLAIMS } from "@/lib/site";
import { CtaBand } from "./CtaBand";
import { FactCard } from "./FactCard";
import { FaqSection } from "./Faq";
import { PageHero } from "./PageHero";
import { ProofBar } from "./ProofBar";
import { RelatedLinks } from "./RelatedLinks";
import { HowItWorks } from "./Standard";
import type { Step } from "./StepCards";

type Group = keyof typeof HUBS;

/**
 * Template words per hub, in the home voice (the page copy stays in src/content/hubs.ts). Every h2 is unique on the
 * site and keeps the hub's keyword. The guides hub is for reading: each guide ends in its own quote band, so it skips
 * the order steps and its proof is the company figures.
 */
const COPY: Record<Group, { crumb: string; kicker: string; steps?: string; related: string; faq: string; faqIntro: string; quote: string }> = {
  services: {
    crumb: "Services",
    kicker: `A JU Estimating service, trusted by ${CLAIMS.contractors} contractors`,
    steps: "How to order plumbing takeoff and estimating services",
    related: "Plumbing takeoff guides to read next",
    faq: "Questions about our plumbing takeoff and estimating services",
    faqIntro: "Straight answers on which service fits, project types and ongoing work.",
    quote: "Get a fixed quote for your plumbing takeoff or estimate",
  },
  guides: {
    crumb: "Guides",
    kicker: "Learn the method",
    related: "Plumbing services that do the work in these guides",
    faq: "Questions about the plumbing estimating guides",
    faqIntro: "Straight answers on codes, numbers and the workbook the guides describe.",
    quote: "Short on hours? Send your plumbing plans for a fixed quote",
  },
};

const NOTE = [`Fixed quote ${CLAIMS.quote}.`, `No obligation, and an ${CLAIMS.nda}.`];
const READ_NOTE = "Read the method first, and hand the job off when the hours run out.";

/** The shared order steps (content titles and bodies) with the home Process tiles and buttons. */
const STEP_ICON: IconName[] = ["upload", "receipt", "file-spreadsheet"];
const STEP_CTA: Step["cta"][] = [
  { label: "Send your plans", href: "/contact", variant: "primary" },
  { label: "Get a fixed quote", href: "/contact", variant: "primary" },
  { label: "See a sample file", href: "/samples", variant: "outline" },
];
if (HOW_IT_WORKS.steps.length !== STEP_CTA.length) throw new Error("hubs: the order steps and their buttons no longer match");
const STEPS: Step[] = HOW_IT_WORKS.steps.map((st, i) => ({ title: st.title, body: st.body, icon: STEP_ICON[i], cta: STEP_CTA[i] }));

/**
 * Shared shell for the two hubs, in the home journey: welcome and orient (hero with the hub's own card), trust (fact
 * card), the hub's engage and catalog sections (`children`), then de-risk (order steps, related pages, FAQ with the
 * help card) and convert (the quote band). `items` feeds the ItemList JSON-LD and must be the array the catalog renders,
 * in its rendered order.
 */
export function HubPage({
  group, items, heroCard, children,
}: { group: Group; items: { name: string; path: string }[]; heroCard: ReactNode; children: ReactNode }) {
  const hub = HUBS[group];
  const c = COPY[group];
  const path = `/${group}`;
  const reading = group === "guides";
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path, name: hub.seo.title, description: hub.seo.description, type: "CollectionPage", modified: hub.updated }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: c.crumb, path },
          ]),
          itemListNode(items),
          faqNode(hub.faq),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: c.crumb }]}
        kicker={c.kicker}
        h1={hub.hero.h1}
        lead={hub.hero.lead}
        primary={{ label: "Get a fixed quote", href: "/contact" }}
        secondary={{ label: "See a sample", href: "/samples" }}
        noteLines={reading ? undefined : NOTE}
        extra={reading ? <p className="hero-note">{READ_NOTE}</p> : undefined}
        card={heroCard}
        cardFirstOnPhone
      />
      {reading ? <FactCard tone="alt" /> : <ProofBar tone="alt" />}
      {children}
      {c.steps && <HowItWorks h2={c.steps} intro="Three steps, no surprises. Nothing starts until you approve the price." steps={STEPS} />}
      <RelatedLinks hrefs={hub.related} h2={c.related} tone={reading ? "alt" : "light"} />
      <FaqSection items={hub.faq} updated={hub.updated} h2={c.faq} intro={c.faqIntro} tone={reading ? "light" : "alt"} name={`faq-${group}`} />
      <CtaBand source={path} h2={c.quote} />
    </>
  );
}
