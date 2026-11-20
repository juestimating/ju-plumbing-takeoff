import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import { OpenNow } from "./OpenNow";
import s from "./help.module.css";

/**
 * Navy "Still have questions?" card: phone, email, weekday hours with the live office-hours line, and the 30-minute
 * consultation. The title is a <p>, not a heading. `compact` drops the hours row and tightens the padding (rails).
 */
export function HelpCard({
  title = "Still have questions?", text = "An estimator will answer anything else by phone or email.", booking = true, compact = false,
}: { title?: string; text?: string; booking?: boolean; compact?: boolean }) {
  const hours = SITE.hours[0];
  return (
    <div className={cx("tone-dark", s.card)} data-compact={compact ? "" : undefined}>
      <div className={s.top}>
        <span className="hr-tile" aria-hidden="true">
          <MessageCircle size={22} />
        </span>
        <div>
          <p className={s.title}>{title}</p>
          {text && <p className={s.text}>{text}</p>}
        </div>
      </div>
      <ul className={s.contact}>
        <li>
          <a href={`tel:${SITE.phone.tel}`}>
            <span className={s.ic} data-i="phone" aria-hidden="true" />
            {SITE.phone.display}
          </a>
        </li>
        <li>
          <a href={`mailto:${SITE.email}`}>
            <span className={s.ic} data-i="mail" aria-hidden="true" />
            {SITE.email}
          </a>
        </li>
        {!compact && (
          <li>
            <span className={s.ic} data-i="clock" aria-hidden="true" />
            <span className={s.hours}>
              <span>
                {hours.days}, <span className={s.nowrap}>{hours.time}</span>
              </span>
              <OpenNow />
            </span>
          </li>
        )}
      </ul>
      {booking && (
        <ButtonLink href={SITE.bookingUrl} variant="outline" size="sm">
          Book a 30-minute consultation
        </ButtonLink>
      )}
    </div>
  );
}
