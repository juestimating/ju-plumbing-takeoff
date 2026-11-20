import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { describeHref } from "@/lib/routes";
import { cx } from "@/lib/utils";
import g from "@/components/page/related.module.css";
import s from "./notfound.module.css";

/**
 * "Try one of these": the most used pages as whole-card links (the related-card look and its grid, which centres a short
 * last row), label and blurb from the route registry. A nav, so no headings inside: the kicker and the card titles are text.
 */
export function RouteCards({ hrefs }: { hrefs: string[] }) {
  const routes = hrefs.flatMap((href) => {
    const r = describeHref(href);
    return r ? [{ ...r, href }] : [];
  });
  return (
    <nav aria-label="Popular pages" className={cx("sec tone-light", s.routes)}>
      <Container>
        <p className="kicker">Try one of these</p>
        <ul className={g.grid} data-count={routes.length} role="list">
          {routes.map((r) => (
            <li key={r.href} className="hr-reveal">
              <div className={cx("hr-card lift", s.card)}>
                <span className={cx("hr-tile", s.tile)} aria-hidden="true">
                  <Icon name={r.icon} size={22} />
                </span>
                <span className={s.text}>
                  <Link href={r.href} className={s.title}>
                    {r.label}
                  </Link>
                  <span className={s.blurb}>{r.blurb}</span>
                </span>
                <span className={s.arrow} aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
