import { Mail, Phone } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { OpenNow } from "@/components/page/OpenNow";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Container } from "@/components/ui/Section";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import s from "./contact.module.css";

type Props = {
  crumbs: Crumb[];
  kicker: string;
  /** The page's ONE <h1>. */
  h1: string;
  lead: string;
  /** The form card: its section id (#request-a-quote, the target of every quote button), h2, intro and lead source. */
  form: { id: string; h2: string; intro: string; source: string };
  /** "What to expect": a label, the checks and a note (inline links allowed). */
  aside: { label: string; points: string[]; note: string };
};

/**
 * /contact, form first: the home quote band turned into the page hero. DOM order is intro, form, aside, so a phone
 * reaches the form right after the lead; from 1024px the form card takes the right column and the "what to expect"
 * panel rides along under the intro (sticky) while the form scrolls.
 */
export function ContactHero({ crumbs, kicker, h1, lead, form, aside }: Props) {
  return (
    <header className={cx("pg-hero", s.hero)}>
      <Container>
        <Breadcrumbs items={crumbs} />
        <div className={s.grid}>
          <div className={s.intro}>
            <span className="kicker">{kicker}</span>
            <h1 className={s.h1}>{h1}</h1>
            <p className="lead">
              <Rich text={lead} />
            </p>
          </div>
          <section id={form.id} aria-labelledby={`${form.id}-h`} className={cx("form-card", s.form)}>
            <h2 id={`${form.id}-h`} className={s.formH}>
              {form.h2}
            </h2>
            <p className={s.formIntro}>{form.intro}</p>
            <QuoteForm variant="full" source={form.source} />
          </section>
          <aside aria-label={aside.label} className={s.aside}>
            <p className={s.asideLabel}>{aside.label}</p>
            <ul className="hr-checks">
              {aside.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className={s.asideNote}>
              <Rich text={aside.note} />
            </p>
            <div className={cx("cta-contact", s.contact)}>
              <a href={`tel:${SITE.phone.tel}`}>
                <Phone size={18} aria-hidden="true" />
                {SITE.phone.display}
              </a>
              <a href={`mailto:${SITE.email}`}>
                <Mail size={18} aria-hidden="true" />
                {SITE.email}
              </a>
              <ButtonLink href={SITE.bookingUrl} variant="outline" size="sm">
                Book a 30-minute consultation
              </ButtonLink>
            </div>
            <OpenNow className={s.open} />
          </aside>
        </div>
      </Container>
    </header>
  );
}
