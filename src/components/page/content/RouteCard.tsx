import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Section } from "@/components/ui/Section";
import { priceLabel } from "@/content/pricing";
import type { CalloutBlock } from "@/content/types";
import { describeHref } from "@/lib/routes";
import { priceRow } from "./extras";
import s from "./route.module.css";

/**
 * "Next step": the callout as a tint card, with one route stop per service page its text links to (label, published
 * price, who it suits). The whole stop is the link. The h2 stays the section's heading.
 */
export function RouteCard({ b, kicker }: { b: CalloutBlock; kicker?: string }) {
  const hrefs = [...new Set([...b.body.matchAll(/\]\((\/services\/[^)#?\s]+)\)/g)].map((m) => m[1]))];
  const routes = hrefs.map((href) => {
    const page = describeHref(href);
    if (!page) throw new Error(`RouteCard ${b.id}: no page for ${href}`);
    const row = priceRow(href, `RouteCard ${b.id}`);
    return { href, label: page.label, price: priceLabel(row), best: row.bestFor };
  });
  return (
    <Section id={b.id} tone={b.tone} className="compact">
      <div className={s.card} data-routes={routes.length ? "" : undefined}>
        <div className={s.text}>
          {kicker && <span className="kicker">{kicker}</span>}
          <h2 id={`${b.id}-h`}>
            <Rich text={b.h2} />
          </h2>
          <p className="copy">
            <Rich text={b.body} />
          </p>
          {b.cta && (
            <ButtonLink href={b.cta.href} variant="outline" arrow className={s.cta}>
              {b.cta.label}
            </ButtonLink>
          )}
        </div>
        {routes.length > 0 && (
          <ul className={s.routes}>
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={s.route}>
                  <span className={s.name}>{r.label}</span>{" "}
                  <span className="hr-badge">{r.price}</span>{" "}
                  <span className={s.best}>{r.best}</span>
                  <span className={s.go} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
