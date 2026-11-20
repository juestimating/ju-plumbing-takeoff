import type { CSSProperties, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import type { IconName, Link, SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./steps.module.css";

export type Step = {
  title: string;
  body: ReactNode;
  icon?: IconName;
  checks?: string[];
  cta?: { label: string; href: string; variant: "primary" | "outline" };
};
export type StepCardsProps = { steps: Step[]; tone?: "light" | "dark"; color?: SystemColor; numbered?: boolean };

/**
 * Step cards joined by short flanged pipe spools (the home Process): faded big numbers, an icon tile, the title as an
 * h3 (a trailing period is dropped for display), the body, optional checks and a button at the bottom. The amber
 * flow in the spools moves with the scroll, never on its own. `color` runs the spools in a system color.
 */
export function StepCards({ steps, tone = "dark", color, numbered = true }: StepCardsProps) {
  return (
    // ponytail: up to 4 steps in one row; a fifth would wrap and leave the fourth spool pointing at nothing
    <ol className={s.steps} data-tone={tone} data-c={color} style={{ "--n": Math.min(steps.length, 4) } as CSSProperties}>
      {steps.map((st, i) => (
        <li key={st.title} className={cx(s.step, "hr-reveal")}>
          <div className={cx("hr-card lift", s.card)}>
            {/* The number is generated content (::before), so contrast checkers skip this decorative text. */}
            {numbered && <span className={s.num} data-n={String(i + 1).padStart(2, "0")} aria-hidden="true" />}
            {st.icon && (
              <span className="hr-tile">
                <Icon name={st.icon} size={22} />
              </span>
            )}
            <h3>{st.title.replace(/\.$/, "")}</h3>
            {typeof st.body === "string" ? <p>{prose(st.body)}</p> : <div className={s.body}>{st.body}</div>}
            {st.checks && st.checks.length > 0 && (
              <ul className="hr-checks">
                {st.checks.map((c) => (
                  <li key={c}>{keepHyphenated(c)}</li>
                ))}
              </ul>
            )}
            {st.cta && (
              <ButtonLink href={st.cta.href} variant={st.cta.variant} size="lg" block className={s.cta}>
                {st.cta.label}
              </ButtonLink>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** "Bid due this week?" (the home banner): a navy strip with a quote button and, usually, the phone. The title is a <p>. */
export function UrgencyBanner({
  title = "Bid due this week?",
  text = "Send the plans and your bid date today. Your fixed quote names the delivery date before you approve anything.",
  primary,
  secondary,
}: { title?: string; text?: string; primary: Link; secondary?: Link }) {
  return (
    <div className={cx("tone-dark", s.banner)}>
      <p className={s.bannerTitle}>{title}</p>
      <p className={s.bannerText}>{text}</p>
      <CtaRow primary={primary} secondary={secondary} />
    </div>
  );
}

/** The commit pair under steps: amber primary and an outline second (a tel: link gets the phone icon). */
export function CtaRow({ primary, secondary }: { primary: Link; secondary?: Link }) {
  return (
    <div className={s.ctaRow}>
      <ButtonLink href={primary.href} size="lg" arrow>
        {primary.label}
      </ButtonLink>
      {secondary && (
        <ButtonLink href={secondary.href} variant="outline" size="lg">
          {secondary.href.startsWith("tel:") && <Icon name="phone" size={18} />}
          {secondary.label}
        </ButtonLink>
      )}
    </div>
  );
}

/** Step body: inline links and bold, or plain text with its hyphenated words kept whole. */
const prose = (text: string) => (/\[|\*\*/.test(text) ? <Rich text={text} /> : keepHyphenated(text));

/** Keeps hyphenated words and ranges ("scope-gap", "plan-room", "24–72") whole, so a line never ends on a dash. */
export function keepHyphenated(text: string) {
  return text.split(/(\S+[-–]\S+)/).map((part, k) =>
    k % 2 ? (
      <span key={k} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
