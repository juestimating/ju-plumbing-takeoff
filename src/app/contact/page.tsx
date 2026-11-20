import { Offices } from "@/components/company/about/Offices";
import { ContactHero } from "@/components/company/contact/ContactHero";
import { ReadyChecklist } from "@/components/company/contact/ReadyChecklist";
import { CtaRow, StepCards } from "@/components/page/StepCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionHead } from "@/components/ui/Section";
import type { IconName, ListBlock, StepsBlock } from "@/content/types";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { CLAIMS, SITE } from "@/lib/site";

const PATH = "/contact";
const TITLE = "Get a plumbing takeoff quote | JU Plumbing Takeoff";
const DESCRIPTION =
  "Get a plumbing takeoff quote: send your plans and get a fixed price, usually within 10 minutes during business hours. Takeoffs from $149 in 24–72 hours.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: ["plumbing takeoff quote", "get a plumbing quote", "plumbing estimating quote", "send plumbing plans"],
});

/** The form's section id: every quote button, the sticky bar and the checklist's "Ready" link land here. */
const FORM_ID = "request-a-quote";

/** The what-to-send checklist, directly under the form. The first three items are what to send (checkboxes), the
 *  last three are notes; it also answers incomplete and large sets. */
const BEFORE_YOU_SEND: ListBlock = {
  type: "list",
  id: "before-you-send",
  h2: "What to send with your plumbing plans",
  intro: "A complete package gets a tighter quote. The [plumbing takeoff checklist](/guides/plumbing-takeoff-checklist) shows what we measure on each system.",
  items: [
    {
      title: "The full plumbing set",
      body: "Every plumbing sheet, the fixture schedule and the specification sections.",
    },
    {
      title: "Addenda issued so far",
      body: "Revisions for addenda are included; added systems or a major redesign are quoted separately.",
    },
    {
      title: "The systems to include",
      body: "Name the plumbing systems you want, or choose Not sure on the form.",
    },
    {
      title: "Your rates and template, if you have them",
      body: "We price with your rates and fill in your template. Otherwise estimate pricing follows the project ZIP code: union, open-shop or prevailing wage.",
    },
    {
      title: "Large sets by link",
      body: `Paste a Dropbox, Google Drive or plan-room link, or email PDF, DWG, DXF or ZIP files to [${SITE.email}](mailto:${SITE.email}).`,
    },
    {
      title: "Incomplete sets too",
      body: "Send what you have and we say what is missing. If the drawings are early, a [preliminary plumbing estimate](/services/preliminary-plumbing-estimate) gives a budget range now.",
    },
  ],
};

const NEXT_STEPS: StepsBlock = {
  type: "steps",
  id: "what-happens-next",
  tone: "dark",
  h2: "What happens after you send your plumbing plans",
  steps: [
    {
      title: "We review your set.",
      body: "We check the sheets, schedules, specifications and addenda, then confirm the scope and due date with you.",
    },
    {
      title: "You receive a fixed quote.",
      body: "Price, deliverables and delivery date in one quote, and the number holds unless the scope changes.",
    },
    {
      title: "You approve and we start.",
      body: `You receive an Excel workbook with live formulas, a PDF summary and marked-up plans in ${CLAIMS.turnaround}.`,
    },
  ],
};
/** Step icons, in order: review the set, the quote, the files. */
const STEP_ICONS: IconName[] = ["file-search", "receipt", "file-spreadsheet"];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path: PATH, name: TITLE, description: DESCRIPTION, type: "ContactPage", modified: SITE.lastReviewed }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Contact", path: PATH },
          ]),
        ]}
      />

      <ContactHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        kicker="Free quote"
        h1="Get a fixed quote for your plumbing takeoff"
        lead="Send your plumbing plans and tell us what you need. We review the set and reply with a fixed price, the deliverables and a delivery date, usually within 10 minutes during business hours. A plumbing quote costs nothing, and work starts only when you approve it."
        form={{ id: FORM_ID, h2: "Request a fixed plumbing quote from your plans", intro: "Tell us what you need and where the plans are.", source: PATH }}
        aside={{
          label: "What to expect",
          points: [`A fixed quote, ${CLAIMS.quote}. ${CLAIMS.fixed}.`, `${CLAIMS.nda}: check the box and we send one before you share files.`],
          note: "Not sure which service fits? Choose Not sure and we recommend a [plumbing takeoff](/services/plumbing-takeoff) for quantities or a [plumbing estimate](/services/plumbing-estimating) for a priced bid. To see the output first, browse the [sample takeoffs](/samples) or choose Request a plumbing sample as the service.",
        }}
      />

      <ReadyChecklist block={BEFORE_YOU_SEND} formId={FORM_ID} />

      <Section id={NEXT_STEPS.id} tone="dark">
        <SectionHead
          id={NEXT_STEPS.id}
          kicker="What happens next"
          h2={NEXT_STEPS.h2}
          intro="Three steps, no surprises. Nothing starts until you approve the price."
          center
        />
        <StepCards steps={NEXT_STEPS.steps.map((st, i) => ({ ...st, icon: STEP_ICONS[i] }))} />
        {/* the page's own form hides the sticky quote bar, so the way back to it sits under the steps (as on the home) */}
        <CtaRow primary={{ label: "Send your plans", href: `#${FORM_ID}` }} />
      </Section>

      <Offices
        id="talk-to-us"
        kicker="Talk to a person"
        h2="Talk to us: phone, email and offices"
        intro="Call, email or book a 30-minute consultation, whichever suits your day."
      />
    </>
  );
}
