import { TrackLead } from "@/components/analytics/TrackLead";
import { RequestTracker } from "@/components/company/thank-you/RequestTracker";
import { WhileYouWait } from "@/components/company/thank-you/WhileYouWait";
import { PageHero } from "@/components/page/PageHero";
import { keepHyphenated } from "@/components/page/StepCards";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import type { CalloutBlock, CardsBlock, IconName, ProseBlock, StepsBlock } from "@/content/types";
import { buildMetadata } from "@/lib/seo";
import { CLAIMS, SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "@/components/company/thank-you/thank-you.module.css";

/** Confirmation page for the quote form. Not for search: noindex, and left out of the sitemap. */
export const metadata = buildMetadata({
  title: "Plumbing Quote Request Received | JU Plumbing Takeoff",
  description: "Your plumbing quote request is in. A fixed quote usually arrives within 10 minutes in business hours. Reply with a plan link, or email info@juestimating.com.",
  path: "/thank-you",
  noindex: true,
});

const HOURS = SITE.hours.map((h) => `${h.days} ${h.time}`).join(" and ");
const PHONE_LINK = `[${SITE.phone.display}](tel:${SITE.phone.tel})`;

/** Rendered by the hero's request tracker (keeps #next-10-minutes, which also hides the phone sticky bar). */
const NEXT_10_MINUTES: StepsBlock = {
  type: "steps",
  id: "next-10-minutes",
  h2: "What happens after you send your request",
  intro: `A fixed quote usually goes out within 10 minutes during business hours: ${HOURS}. Outside those hours email is still monitored, and we reply as soon as we can.`,
  steps: [
    {
      title: "Your request reaches our team.",
      body: "We open it, check the plans or link you sent and confirm the systems and the due date.",
    },
    {
      title: "Your fixed quote arrives by email.",
      body: "It gives the price, the deliverables and a delivery date. The price changes only if the scope does.",
    },
    {
      title: "You approve and work starts.",
      body: `Nothing starts until you approve the quote. Standard delivery is ${CLAIMS.turnaround}, with an Excel workbook that has live formulas, a PDF summary and marked-up plans.`,
    },
  ],
};

const LARGE_SETS: ProseBlock = {
  type: "prose",
  id: "send-a-large-plan-set",
  tone: "light",
  h2: "How to send a large plumbing plan set",
  paragraphs: [
    `Large sets go by link. If you did not add one to the form, reply to our email with it, or send it to [${SITE.email}](mailto:${SITE.email}).`,
  ],
  bullets: [
    "Use a Dropbox, Google Drive or plan-room link, and check that anyone with the link can open it.",
    "Or email PDF, DWG, DXF or ZIP files directly. Split a very large set across several emails.",
    "Want an NDA first? Say so in your reply and we send one before you share anything.",
  ],
};
/** One tile per way to send, in bullet order: by link, by email, NDA first. */
const METHOD_ICONS: IconName[] = ["upload", "mail", "lock"];

const WHILE_YOU_WAIT: CardsBlock = {
  type: "cards",
  id: "while-you-wait",
  tone: "alt",
  h2: "While you wait: sample takeoffs and plumbing guides",
  columns: 3,
  cards: [
    {
      title: "Sample plumbing takeoffs",
      body: "See the Excel workbook, PDF summary and marked-up plans you receive.",
      href: "/samples",
      icon: "file-spreadsheet",
    },
    {
      title: "How to do a plumbing takeoff",
      body: "The working order for measuring each system, from fixtures to risers.",
      href: "/guides/how-to-do-a-plumbing-takeoff",
      icon: "ruler",
    },
    {
      title: "Plumbing takeoff checklist",
      body: "Every item grouped by system, to check against your own takeoff.",
      href: "/guides/plumbing-takeoff-checklist",
      icon: "list-checks",
    },
  ],
};

const CALL_OR_BOOK: CalloutBlock = {
  type: "callout",
  id: "call-or-book",
  tone: "light",
  h2: "Call us or book a 30-minute consultation",
  body: `Call ${PHONE_LINK} during business hours, or pick a time that suits you. Email is monitored outside those hours.`,
  cta: { label: "Book a 30-minute consultation", href: SITE.bookingUrl },
};

export default function ThankYouPage() {
  return (
    <>
      <TrackLead />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Thank you" }]}
        kicker="Request received"
        h1="Your plumbing quote request is in"
        lead={`A fixed quote is on its way, ${CLAIMS.quote}, once we can open your plans. No plan link yet? Reply to our email with one. Nothing starts until you approve the quote.`}
        primary={{ label: "Email your plans", href: `mailto:${SITE.email}?subject=Plumbing%20plans%20for%20my%20quote` }}
        secondary={{ label: "How to send a large set", href: `#${LARGE_SETS.id}` }}
        extra={
          <p className={cx("hero-note", s.questions)}>
            Questions? Call <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.display}</a> or email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        }
        card={<RequestTracker block={NEXT_10_MINUTES} />}
      />

      <Section id={LARGE_SETS.id} tone={LARGE_SETS.tone}>
        {/* the block's paragraph reads as the section intro, the bullets as one tile each */}
        <SectionHead id={LARGE_SETS.id} kicker="Plans not attached yet?" h2={LARGE_SETS.h2} intro={LARGE_SETS.paragraphs.join(" ")} />
        <ul className={s.methods} role="list">
          {LARGE_SETS.bullets?.map((b, i) => (
            <li key={b} className={cx("hr-card lift hr-reveal", s.method)}>
              <span className="hr-tile" aria-hidden="true">
                <Icon name={METHOD_ICONS[i] ?? "info"} size={22} />
              </span>
              <p>
                <Rich text={b} />
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <WhileYouWait block={WHILE_YOU_WAIT} />

      <Section id={CALL_OR_BOOK.id} tone={CALL_OR_BOOK.tone}>
        <div className={cx("tone-dark", s.call)}>
          <span className="hr-tile" aria-hidden="true">
            <Icon name="message" size={22} />
          </span>
          <div className={s.callText}>
            {/* "30-minute" stays whole: a narrow line never ends on its hyphen */}
            <h2 id={`${CALL_OR_BOOK.id}-h`}>{keepHyphenated(CALL_OR_BOOK.h2)}</h2>
            <p>
              <Rich text={CALL_OR_BOOK.body} />
            </p>
          </div>
          {CALL_OR_BOOK.cta && (
            <ButtonLink href={CALL_OR_BOOK.cta.href} variant="outline" className={s.callBtn}>
              {CALL_OR_BOOK.cta.label}
            </ButtonLink>
          )}
        </div>
      </Section>
    </>
  );
}
