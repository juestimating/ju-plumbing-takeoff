import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import type { Offer } from "./template";
import s from "./guide.module.css";

/**
 * The sidebar hand-off under the rail (1024px up), in view while reading. Outline, so the header pill (and the inline
 * banner when it scrolls past) stay the only amber buttons on screen. Phones use the sticky Call and quote bar.
 */
export function HandoffCard({ offer }: { offer: Offer }) {
  return (
    <div className={cx("hr-card", s.handoff)}>
      <p className={s.hoTitle}>{offer.title}</p>
      <p className={s.hoText}>
        Fixed quote {CLAIMS.quote}. {offer.price}, delivered in <span className="whitespace-nowrap">{CLAIMS.turnaround}</span>.
      </p>
      <ButtonLink href={offer.href} variant="outline" arrow block>
        Get a fixed quote
      </ButtonLink>
      <Link href="/samples" className={cx("arrow-link", s.hoLink)}>
        See a sample file <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}
