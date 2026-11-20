import Link from "next/link";
import { ArrowRight, Clock, Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { HOME_FAQ } from "@/components/home/content";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { SITE } from "@/lib/site";
import { formatMonthYear } from "@/lib/utils";
import s from "./faq.module.css";

const ID = "frequently-asked-questions";

/**
 * Home FAQ: numbered accordion cards on native <details> (no JS, every answer stays in the HTML for crawlers).
 * The visible text matches the FAQPage JSON-LD that page.tsx builds from the same HOME_FAQ array, so render it as is.
 * `name` groups the cards into one accordion where the browser supports it (opening one closes the other).
 * DOM order is head, questions, help card: phones read it top to bottom; on desktop the help card moves to the
 * left column under the heading and stays in view while the questions scroll.
 */
export function HomeFaq() {
  const hours = SITE.hours[0];
  return (
    <Section id={ID} tone="alt">
      <div className={s.layout}>
        <div className={s.head}>
          <SectionHead
            id={ID}
            kicker="FAQ"
            h2="Questions about plumbing takeoff and estimating services"
            intro="Straight answers on scope, files, speed, price and accuracy."
          />
        </div>

        <div className={s.qa}>
          <div className={s.list}>
            {HOME_FAQ.map((f, i) => (
              <details key={f.q} className={s.item} name="home-faq" open={i === 0}>
                <summary className={s.sum}>
                  <span className={s.num} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={s.q}>
                    <Rich text={f.q} />
                  </h3>
                  <span className={s.icon} aria-hidden="true">
                    <Plus size={18} strokeWidth={2.4} />
                  </span>
                </summary>
                <div className={s.a}>
                  {f.a.split("\n\n").map((p, j) => (
                    <p key={j}>
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <p className={s.reviewed}>
            Last reviewed <strong>{formatMonthYear(SITE.lastReviewed)}</strong>. Prices and turnaround are checked quarterly.
          </p>
        </div>

        <div className={s.help}>
          <div className={`tone-dark ${s.card}`}>
            <div className={s.cardTop}>
              <span className="hr-tile" aria-hidden="true">
                <MessageCircle size={22} />
              </span>
              <div>
                <p className={s.cardTitle}>Still have questions?</p>
                <p className={s.cardText}>An estimator will answer anything else by phone or email.</p>
              </div>
            </div>
            <ul className={s.contact}>
              <li>
                <a href={`tel:${SITE.phone.tel}`}>
                  <span className={s.ic} aria-hidden="true">
                    <Phone size={17} />
                  </span>
                  {SITE.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>
                  <span className={s.ic} aria-hidden="true">
                    <Mail size={17} />
                  </span>
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className={s.ic} aria-hidden="true">
                  <Clock size={17} />
                </span>
                <span>
                  {hours.days}, <span className={s.nowrap}>{hours.time}</span>
                </span>
              </li>
            </ul>
            <ButtonLink href={SITE.bookingUrl} variant="outline" size="sm">
              Book a 30-minute consultation
            </ButtonLink>
          </div>
          <Link href="/faq" className="arrow-link">
            See all FAQs <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
