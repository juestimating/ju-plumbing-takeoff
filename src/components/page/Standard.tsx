import { Section, SectionHead } from "@/components/ui/Section";
import { CtaRow, StepCards, UrgencyBanner, type StepCardsProps } from "./StepCards";
import { HOW_IT_WORKS } from "@/content/shared";
import type { IconName, Link as LinkT, SystemColor, Tone } from "@/content/types";
import { SITE } from "@/lib/site";

type HowItWorksContent = { h2: string; intro: string; steps: readonly { title: string; body: string }[] };

/** Tiles for the three order steps: send, quote, files. */
const STEP_ICONS: IconName[] = ["upload", "receipt", "file-spreadsheet"];

/**
 * The shared order steps as the home Process (same wording everywhere unless a page overrides it with `content`):
 * centered head, step cards joined by pipe spools, then the "Bid due this week?" banner (`urgent`) or a CTA pair
 * (`ctaRow`). `h2` and `intro` replace the content's, so each page can carry its own keyword in the shared section.
 */
export function HowItWorks({
  tone = "dark", id = "how-it-works", content = HOW_IT_WORKS, h2, intro, steps, urgent, ctaRow, service, color,
}: {
  tone?: Tone;
  id?: string;
  content?: HowItWorksContent;
  h2?: string;
  intro?: string;
  steps?: StepCardsProps["steps"];
  urgent?: boolean;
  ctaRow?: { primary: LinkT; secondary?: LinkT };
  /** Quote button target: /contact?service=<service> (lands on the form). */
  service?: string;
  color?: SystemColor;
}) {
  return (
    <Section id={id} tone={tone}>
      <SectionHead id={id} kicker="How it works" h2={h2 ?? content.h2} intro={intro ?? content.intro} center />
      <StepCards
        tone={tone === "dark" ? "dark" : "light"}
        color={color}
        steps={steps ?? content.steps.map((st, i) => ({ title: st.title, body: st.body, icon: STEP_ICONS[i] }))}
      />
      {urgent && (
        <UrgencyBanner
          primary={{ label: "Get a fixed quote", href: service ? `/contact?service=${service}` : "/contact" }}
          secondary={{ label: `Call ${SITE.phone.display}`, href: `tel:${SITE.phone.tel}` }}
        />
      )}
      {ctaRow && <CtaRow {...ctaRow} />}
    </Section>
  );
}
