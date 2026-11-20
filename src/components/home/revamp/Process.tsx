import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHead } from "@/components/ui/Section";
import { HOW_IT_WORKS } from "@/content/shared";
import type { IconName } from "@/content/types";
import { CLAIMS, SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./process.module.css";

const ID = "how-it-works";

const STEPS: {
  title: string;
  icon: IconName;
  body: string;
  checks: string[];
  cta: { label: string; href: string; variant: "primary" | "outline" };
}[] = [
  {
    title: "Send your plans",
    icon: "upload",
    body: "Email the set, share a Dropbox or Google Drive folder, or send a plan-room link.",
    checks: ["PDF, DWG, DXF or ZIP files", "Plumbing sheets, fixture schedule and specs", "Any addenda issued so far", "Your bid date"],
    cta: { label: "Send your plans", href: "/contact", variant: "primary" },
  },
  {
    title: "Get a fixed quote",
    icon: "receipt",
    body: `We look over the set and send a fixed price with the deliverables and a delivery date, ${CLAIMS.quote}.`,
    checks: ["Priced by sheets and systems, not project value", "Missing sheets flagged before work starts", CLAIMS.nda],
    cta: { label: "Get a fixed quote", href: "/contact", variant: "primary" },
  },
  {
    title: "Get your files",
    icon: "file-spreadsheet",
    body: `Approve the quote and we start. Your takeoff lands in ${CLAIMS.turnaround}, and larger or phased sets get a confirmed date with the quote.`,
    checks: [
      "Excel workbook, marked-up plans and scope-gap log",
      "Every quantity names the sheet it came from",
      "Revisions for addenda included",
      "Added systems or a redesign quoted separately",
    ],
    cta: { label: "See a sample file", href: "/samples", variant: "outline" },
  },
];

/** How it works: three step cards joined by short pipe runs, then the "bid due this week" banner. */
export function Process() {
  return (
    <Section id={ID} tone="dark">
      <SectionHead
        id={ID}
        kicker="How it works"
        h2={HOW_IT_WORKS.h2}
        intro="Three steps, no surprises. Nothing starts until you approve the price."
        center
      />
      <ol className={s.steps}>
        {STEPS.map((st, i) => (
          <li key={st.title} className={cx(s.step, "hr-reveal")}>
            <div className={cx("hr-card lift", s.card)}>
              {/* The number is generated content (::before), so contrast checkers skip this decorative text. */}
              <span className={s.num} data-n={String(i + 1).padStart(2, "0")} aria-hidden="true" />
              <span className="hr-tile">
                <Icon name={st.icon} size={22} />
              </span>
              <h3>{st.title}</h3>
              <p>{keepHyphenated(st.body)}</p>
              <ul className="hr-checks">
                {st.checks.map((c) => (
                  <li key={c}>{keepHyphenated(c)}</li>
                ))}
              </ul>
              <ButtonLink href={st.cta.href} variant={st.cta.variant} size="lg" block className={s.cta}>
                {st.cta.label}
              </ButtonLink>
            </div>
          </li>
        ))}
      </ol>

      <div className={s.banner}>
        <PipeArt className={s.artL} />
        <PipeArt className={s.artR} />
        <p className={s.bannerTitle}>Bid due this week?</p>
        <p className={s.bannerText}>
          Send the plans and your bid date today. Your fixed quote names the delivery date before you approve anything.
        </p>
        <div className={s.bannerCta}>
          <ButtonLink href="/contact" size="lg" arrow>
            Get a fixed quote
          </ButtonLink>
          <ButtonLink href={`tel:${SITE.phone.tel}`} variant="outline" size="lg">
            <Icon name="phone" size={18} />
            Call {SITE.phone.display}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

/** Keeps hyphenated words ("scope-gap", "plan-room") whole, so a line never ends on a dangling hyphen. */
function keepHyphenated(text: string) {
  return text.split(/(\S+-\S+)/).map((part, k) =>
    k % 2 ? (
      <span key={k} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Faint pipe run in the banner corners: a main with a gate valve, a riser and two branches to fixtures. */
function PipeArt({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 240 200" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-12 160H130V22" />
        <path d="M130 70H184M130 116H168" />
      </g>
      <g fill="currentColor">
        <circle cx="130" cy="160" r="9" />
        <circle cx="130" cy="70" r="8" />
        <circle cx="130" cy="116" r="8" />
        <path d="M50 146L78 174V146L50 174Z" />
      </g>
      <g stroke="currentColor" strokeWidth="4">
        <rect x="186" y="56" width="34" height="28" rx="7" />
        <rect x="170" y="104" width="26" height="24" rx="6" />
      </g>
    </svg>
  );
}
