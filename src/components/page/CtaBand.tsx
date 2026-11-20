import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { CLAIMS, SITE } from "@/lib/site";

/** Closing conversion section: short promise on the left, compact quote form on the right. One per page. */
export function CtaBand({
  h2 = "Send your plumbing plans for a fixed quote", text, source,
}: { h2?: string; text?: string; source?: string }) {
  return (
    <section className="cta-band" id="get-quote" aria-labelledby="get-quote-h">
      <Container>
        <div className="cta-grid">
          <div>
            <span className="kicker">Free quote</span>
            <h2 id="get-quote-h">
              <Rich text={h2} />
            </h2>
            <p>
              {text ?? (
                <>
                  We send a fixed quote, {CLAIMS.quote}. Standard delivery is{" "}
                  {/* keeps "24–72 hours" from breaking at the en dash on phones */}
                  <span className="whitespace-nowrap">{CLAIMS.turnaround}</span>. There is no obligation, and work starts only when you
                  approve the quote.
                </>
              )}
            </p>
            <ul className="cta-points">
              <li>Fixed price before any work starts</li>
              <li>Unlocked Excel, PDF summary and marked-up plans</li>
              <li>{CLAIMS.checked}</li>
              <li>{CLAIMS.nda}</li>
            </ul>
            <div className="cta-contact">
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
          </div>
          <div className="form-card">
            <h3>Tell us about the job</h3>
            <QuoteForm variant="compact" source={source} />
          </div>
        </div>
      </Container>
    </section>
  );
}
