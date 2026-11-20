import Link from "next/link";
import { HoverTabs } from "@/components/interactive/HoverTabs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { PRICE_ROWS, priceLabel, type PriceRow } from "@/content/pricing";
import { SERVICES, pagePath } from "@/content/registry";
import type { IconName } from "@/content/types";
import { cx } from "@/lib/utils";
import { PER_PROJECT } from "./content";
import s from "./finder.module.css";
import p from "./pricing.module.css";

/**
 * "What do you need from us?": five needs as hover-intent chips over a quote sheet, the home hero showcase turned into
 * a price lookup. Every price, delivery time and "best for" line is a PRICE_ROWS row; the checks are the service
 * page's own hero bullets. The quote button carries the picked service to the form.
 */
type Need = { key: string; label: string; icon: IconName; hrefs: string[]; explore: string };

const NEEDS: Need[] = [
  { key: "budget", label: "A budget range", icon: "pencil-ruler", hrefs: ["/services/preliminary-plumbing-estimate"], explore: "Explore preliminary estimates" },
  { key: "takeoff", label: "Quantities to price", icon: "ruler", hrefs: ["/services/plumbing-takeoff"], explore: "Explore plumbing takeoffs" },
  {
    key: "estimate",
    label: "A priced estimate",
    icon: "calculator",
    hrefs: ["/services/plumbing-estimating", "/services/residential-plumbing-estimating", "/services/commercial-plumbing-estimating", "/services/industrial-plumbing-estimating"],
    explore: "Explore plumbing estimating",
  },
  { key: "bid", label: "A bid package", icon: "file-check", hrefs: ["/services/plumbing-bid-preparation"], explore: "Explore bid preparation" },
  {
    key: "monthly",
    label: "Monthly support",
    icon: "calendar",
    hrefs: ["/services/monthly-plumbing-estimating", "/services/monthly-plumbing-estimating#dedicated-plumbing-estimator"],
    explore: "Explore monthly estimating",
  },
];
const INITIAL = 1; // "Quantities to price": the takeoff, the service most visitors come for

/** Fails the build when a need points at a service without a published price or a page. */
function rowFor(href: string): PriceRow {
  const row = PRICE_ROWS.find((r) => r.href === href);
  if (!row) throw new Error(`price finder: no published price for ${href}`);
  return row;
}
function pageFor(href: string) {
  const page = SERVICES.find((p) => pagePath(p) === href.split("#")[0]);
  if (!page) throw new Error(`price finder: no service page for ${href}`);
  return page;
}
const captionFor = (group: PriceRow["group"]) => PER_PROJECT.groups.find((g) => g.group === group)?.caption ?? "";

function Panel({ need }: { need: Need }) {
  const rows = need.hrefs.map(rowFor);
  const page = pageFor(need.hrefs[0]!);
  const [row] = rows as [PriceRow];
  const [svc, price, delivery, best] = PER_PROJECT.head;
  return (
    <>
      <div className={s.quote}>
        <div className={cx("sheet-bar", s.bar)}>
          <span className="sheet-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Starting price · {captionFor(row.group)}</span>
        </div>
        {rows.length === 1 ? (
          <>
            <dl className={s.fields}>
              <div className={s.wide}>
                <dt>{svc}</dt>
                <dd>
                  <Link href={row.href} className={p.svc}>
                    {row.service}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>{price}</dt>
                <dd className={s.big}>{priceLabel(row)}</dd>
              </div>
              <div>
                <dt>{delivery}</dt>
                <dd>
                  <span className={cx("hr-badge soft", p.when)}>{row.delivery}</span>
                </dd>
              </div>
              <div className={s.wide}>
                <dt>{best}</dt>
                <dd>{row.bestFor}</dd>
              </div>
            </dl>
            {page.hero.bullets && (
              <ul className={cx("hr-checks", s.checks)}>
                {page.hero.bullets.map((b) => (
                  <li key={b}>
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <ul className={s.lines} role="list">
            {rows.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={p.svc}>
                  {r.service}
                </Link>
                <span className="hr-badge">{priceLabel(r)}</span>
                <span className={s.meta}>
                  <span>{r.bestFor}</span>
                  <span className={p.when}>{r.delivery}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={s.cta}>
        <ButtonLink href={`/contact?service=${page.slug}`} arrow>
          Get a fixed quote
        </ButtonLink>
        <Link href={pagePath(page)} className={s.explore}>
          {need.explore}
        </Link>
      </div>
    </>
  );
}

export function PriceFinder() {
  return (
    <div className={s.finder}>
      <HoverTabs
        items={NEEDS.map((n) => ({ key: n.key, label: n.label, icon: <Icon name={n.icon} size={18} />, panel: <Panel need={n} /> }))}
        label="What you need from us"
        ask="What do you need from us?"
        orientation="horizontal"
        initial={INITIAL}
        className={s.finderTabs}
        panelClassName={s.finderPanel}
      />
      <p className={s.foot}>
        <Rich text={PER_PROJECT.note} />
      </p>
    </div>
  );
}
