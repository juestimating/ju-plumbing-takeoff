"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

/**
 * Mobile-only bottom bar: contractors read on the jobsite, so call and quote are always one tap away.
 * It steps aside while the page's own quote form is on screen (the closing band's compact form, or the
 * form section on /contact), so two amber "Get a fixed quote" buttons never stack with different actions.
 */
export function StickyCta() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  // pathname is a dependency because the bar lives in the root layout and the page (and its form) changes under it.
  useEffect(() => {
    const forms = document.querySelectorAll("#request-a-quote, #quote-form-compact");
    if (!forms.length) return;
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) onScreen.add(e.target);
          else onScreen.delete(e.target);
        }
        setHidden(onScreen.size > 0);
      },
      // The bottom 80px is the bar's own strip, so a form peeking out above the bar does not count yet.
      { rootMargin: "0px 0px -80px 0px" },
    );
    forms.forEach((f) => io.observe(f));
    return () => {
      io.disconnect();
      setHidden(false);
    };
  }, [pathname]);

  return (
    <div className="sticky-cta" role="region" aria-label="Quick contact" data-hidden={hidden || undefined} inert={hidden}>
      <ButtonLink href={`tel:${SITE.phone.tel}`} variant="outline">
        <Phone size={18} aria-hidden="true" /> Call
      </ButtonLink>
      <ButtonLink href="/contact">Get a fixed quote</ButtonLink>
    </div>
  );
}
