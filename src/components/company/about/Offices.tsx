import { ArrowRight } from "lucide-react";
import { OpenNow } from "@/components/page/OpenNow";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHead } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import type { Tone } from "@/content/types";
import { SITE, mapsUrl } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./about.module.css";

/**
 * Offices and hours for /about and /contact: the head office, then the regional office (the order SITE.offices
 * defines), then a navy card with the hours, the live office-hours line, phone, email and the 30-minute consultation.
 * Everything is read from SITE.
 */
export function Offices({
  id, h2, intro, kicker, tone = "light", booking = true,
}: { id: string; h2: string; intro?: string; kicker?: string; tone?: Tone; booking?: boolean }) {
  return (
    <Section id={id} tone={tone}>
      <SectionHead id={id} kicker={kicker} h2={h2} intro={intro} />
      <div className={s.offices}>
        {SITE.offices.map((o) => (
          <article key={o.role} className={cx("hr-card lift hr-reveal", s.office)}>
            {/* a site-plan scrap: the office on its lot, its water service tapped off the main in the street */}
            <span className={s.plot} aria-hidden="true">
              <span className={cx("hr-tile sm", s.pin)}>
                <Icon name="map-pin" size={20} />
              </span>
            </span>
            <h3 className={cx("hr-badge soft", s.role)}>{o.role}</h3>
            <address className={s.addr}>
              {o.street}
              <br />
              {o.city}, {o.region} {o.postalCode}
            </address>
            <SmartLink href={mapsUrl(o)} className={cx("arrow-link", s.directions)}>
              Get directions
              {/* Hidden text, not aria-label, so SmartLink's "(opens in a new tab)" notice is still announced. */}
              <span className="sr-only">
                {" "}
                to the {o.role.toLowerCase()} in {o.city}, {o.region}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </SmartLink>
          </article>
        ))}
        <article className={cx("tone-dark hr-reveal", s.hours)}>
          <h3 className={s.hoursTitle}>Hours and contact</h3>
          <ul className={s.rows} role="list">
            {SITE.hours.map((h) => (
              <li key={h.days}>
                <span className={s.ic} data-i="clock" aria-hidden="true" />
                <span>
                  <strong>{h.days}:</strong> {h.time}
                </span>
              </li>
            ))}
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
          </ul>
          <p className={s.hoursNote}>{SITE.hoursNote}</p>
          <OpenNow className={s.open} />
          {booking && (
            <ButtonLink href={SITE.bookingUrl} variant="outline" size="sm" className={s.book}>
              Book a 30-minute consultation
            </ButtonLink>
          )}
        </article>
      </div>
    </Section>
  );
}
