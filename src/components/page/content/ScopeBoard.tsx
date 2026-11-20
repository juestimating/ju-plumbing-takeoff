import type { ReactNode } from "react";
import { DrawingFigure } from "@/components/illustrations/DrawingFigure";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { COPY, isMeasured, primaryLabel, quoteService } from "@/content/template";
import { BLOCK_COPY, SCOPE_ROLE } from "@/content/template-blocks";
import type { IllustrationName, PageContent, ScopeBlock } from "@/content/types";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import { UnitFilter } from "./UnitFilter";
import s from "./scope.module.css";

const C = BLOCK_COPY.scope;
type Unit = keyof typeof C.units;
const isUnit = (u: string): u is Unit => u in C.units;
/** "EA / LF" and "LF, EA" are both units. */
const unitsOf = (unit: string) => unit.split(/\s*[/,]\s*/).filter(isUnit);

function Foot({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className={cx("copy", s.foot)}>
      <span className={s.info} aria-hidden="true" />
      <span>
        <Rich text={text} />
      </span>
    </p>
  );
}

const Label = ({ it }: { it: ScopeBlock["items"][number] }) => (
  <span className={s.text}>
    <Rich text={it.label} />
    {it.note && (
      <span className={s.note}>
        <Rich text={it.note} />
      </span>
    )}
  </span>
);

/**
 * "What we count", the home explorer's count box at full length: every scope line with its legend line (in the row's
 * system color, else the page's, else navy), note and unit, beside a count card (the count, the unit filter and the quote button, sticky from 1024px). Picking a unit dims the
 * other rows and counts "n of N line items"; rows also light up on hover and focus. A block drawing that repeats the
 * hero drawing is dropped.
 * Service lists (not measured, so nothing to count or filter) are the package grid, or with SCOPE_ROLE a role card
 * beside the duties, so two lists on one page never look alike.
 */
export function ScopeBoard({ b, page, kicker, heroDrawing }: { b: ScopeBlock; page: PageContent; kicker?: string; heroDrawing?: IllustrationName }) {
  if (b.image) throw new Error(`ScopeBoard ${b.id}: scope images are not rendered; use an illustration`);
  const section = (body: ReactNode) => (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} layout="split" />
      {body}
    </Section>
  );

  if (!isMeasured(b)) {
    const role = SCOPE_ROLE[b.id];
    if (!role) {
      return section(
        <div className="hr-reveal">
          <ul className={cx("copy", s.tiles)}>
            {b.items.map((it) => (
              <li key={it.label} className={s.tile}>
                <span className={s.tileTop}>
                  <span className={s.check} aria-hidden="true" />
                  <span className={cx("hr-badge soft", s.badge)}>{it.unit}</span>
                </span>
                <Label it={it} />
              </li>
            ))}
          </ul>
          <Foot text={b.footnote} />
        </div>,
      );
    }
    return section(
      <div className={s.board} data-role="">
        <div className={s.aside}>
          <div className={cx("hr-card", s.role)}>
            <span className="hr-tile">
              <Icon name={role.icon} size={24} />
            </span>
            <p className={s.roleTitle}>{role.title}</p>
            <span className="hr-badge">{role.badge}</span>
            <ButtonLink href={SITE.bookingUrl} variant="outline" block>
              {COPY.consult}
            </ButtonLink>
          </div>
        </div>
        <div className={cx("hr-reveal", s.main)}>
          <ul className={cx("copy", s.rows, s.duties)}>
            {b.items.map((it) => (
              <li key={it.label} className={s.row}>
                <i aria-hidden="true" />
                <Label it={it} />
                <span className={cx("hr-badge soft", s.badge)}>{it.unit}</span>
              </li>
            ))}
          </ul>
          <Foot text={b.footnote} />
        </div>
      </div>,
    );
  }

  const figure = b.illustration && b.illustration !== heroDrawing ? b.illustration : undefined;
  const rowUnits = b.items.map((it) => unitsOf(it.unit));
  // the units present, in one order on every page (EA, LF, SF, CY, LS)
  const units = (Object.keys(C.units) as Unit[]).filter((u) => rowUnits.some((r) => r.includes(u)));
  return section(
    <div className={s.board} data-fig={figure ? "" : undefined}>
      <div className={s.aside}>
        {figure && <DrawingFigure name={figure} className={s.fig} />}
        <div className={cx("hr-card", s.count)}>
          <UnitFilter
            name={`${b.id}-unit`}
            ask={C.ask}
            total={b.items.length}
            label={C.count}
            of={C.of}
            options={[
              { value: "all", label: C.all, n: b.items.length },
              ...units.map((u) => ({ value: u, label: u, desc: C.units[u], n: rowUnits.filter((r) => r.includes(u)).length })),
            ]}
          />
          <div className={s.quote}>
            <ButtonLink href={`/contact?service=${quoteService(page)}`} block>
              {primaryLabel(page)}
            </ButtonLink>
            <p>{C.note}</p>
          </div>
        </div>
      </div>
      <div className={cx("hr-reveal", s.main)}>
        <ul className={cx("copy", s.rows)}>
          {b.items.map((it, i) => (
            <li key={it.label} className={s.row} data-u={rowUnits[i].join(" ")}>
              <i className="legend-line" data-c={it.color ?? page.nav.color} aria-hidden="true" />
              <Label it={it} />
              <span className={cx("hr-badge soft", s.badge)}>{it.unit}</span>
            </li>
          ))}
        </ul>
        <Foot text={b.footnote} />
      </div>
    </div>,
  );
}
