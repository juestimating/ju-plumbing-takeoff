import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { PRICE_ROWS, priceLabel, type PriceRow } from "@/content/pricing";
import { BLOCK_COPY } from "@/content/template-blocks";
import type { Link as LinkT } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./extras.module.css";

/** A published price row by page href; the build fails when the price is gone. */
export function priceRow(href: string, where: string): PriceRow {
  const row = PRICE_ROWS.find((r) => r.href === href);
  if (!row) throw new Error(`${where}: no published price for ${href}`);
  return row;
}
/** "Plumbing takeoff (quantities or a material list)" reads "Plumbing takeoff". */
const service = (r: PriceRow) => r.service.replace(/\s*\(.*\)$/, "");

/** Takeoff + what an estimate adds = estimate, with both published prices. */
export function TakeoffEquation({ from, to, adds }: { from: PriceRow; to: PriceRow; adds: string[] }) {
  return (
    <div className={cx("hr-card", s.eq)}>
      <p className={s.label} aria-hidden="true">
        {BLOCK_COPY.equation}
      </p>
      <ol className={s.terms} aria-label={BLOCK_COPY.equation}>
        <li className={s.term}>
          <Link href={from.href} className={s.start}>
            {service(from)}
          </Link>
          <span className="hr-badge">{priceLabel(from)}</span>
        </li>
        {adds.map((a) => (
          <li key={a} className={s.term} data-op="+">
            <span className="sr-only">plus </span>
            {a}
          </li>
        ))}
        <li className={cx(s.term, s.result)} data-op="=">
          <span className="sr-only">equals </span>
          {service(to)}
          <span className="hr-badge">{priceLabel(to)}</span>
        </li>
      </ol>
    </div>
  );
}

/** Design stages on a line, with the service that covers each span ("You're here" on the current page). */
export function StageTimeline({ stops, spans }: { stops: string[]; spans: { from: number; to: number; href: string; current?: boolean }[] }) {
  return (
    <div className={cx("hr-card", s.timeline)} style={{ "--n": stops.length } as CSSProperties}>
      <ol className={s.stops}>
        {stops.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      <ul className={s.spans}>
        {spans.map((sp) => {
          const row = priceRow(sp.href, "StageTimeline");
          const label = `${service(row)} · ${priceLabel(row)}`;
          return (
            <li key={sp.href} style={{ "--a": sp.from + 1, "--b": sp.to + 2 } as CSSProperties} data-current={sp.current ? "" : undefined}>
              {sp.current ? (
                <>
                  <span className={s.here}>{BLOCK_COPY.timeline.here}</span> {label}
                </>
              ) : (
                <Link href={sp.href}>
                  {label}
                  <span className={s.arrow} aria-hidden="true" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A block's bullets as checks in a card, with an optional label and button. */
export function CheckCard({ label, items, cta }: { label?: string; items: string[]; cta?: LinkT }) {
  return (
    <div className={cx("hr-card", s.check)}>
      {label && <p className={s.label}>{label}</p>}
      <ul className="hr-checks copy">
        {items.map((x) => (
          <li key={x}>
            <Rich text={x} />
          </li>
        ))}
      </ul>
      {cta && (
        <ButtonLink href={cta.href} arrow className={s.cta}>
          {cta.label}
        </ButtonLink>
      )}
    </div>
  );
}

/** AACE classes in a row, bracketed by what each group is for. */
export function ClassMeter({ groups }: { groups: { label: string; classes: number[]; lit?: boolean }[] }) {
  return (
    <div className={s.meter}>
      {groups.map((g) => (
        <div key={g.label} className={s.group} data-lit={g.lit ? "" : undefined} style={{ "--k": g.classes.length } as CSSProperties}>
          <ol className={s.classes}>
            {g.classes.map((c) => (
              <li key={c}>Class {c}</li>
            ))}
          </ol>
          <p className={s.bracket}>{g.label}</p>
        </div>
      ))}
    </div>
  );
}

/** An illustrative bid month: 20 working days, `filled` of them with a bid, spread evenly. Decorative. */
export function BidCalendar({ filled }: { filled: number }) {
  return (
    <span className={s.cal} aria-hidden="true">
      {Array.from({ length: 20 }, (_, k) => (
        <i key={k} data-on={(k * filled) % 20 < filled ? "" : undefined} />
      ))}
    </span>
  );
}
