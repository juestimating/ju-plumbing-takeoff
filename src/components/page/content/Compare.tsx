import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { COPY, primaryLabel, quoteService } from "@/content/template";
import { BLOCK_COPY, CLASS_METER, COMPARE_VIEW, FIT, QTO_MTO, RANGE, SHEET_VIEW, TRIO_ICONS } from "@/content/template-blocks";
import type { CompareBlock, PageContent } from "@/content/types";
import { plain } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { cx } from "@/lib/utils";
import { CompareFit } from "./CompareFit";
import { BidCalendar, ClassMeter } from "./extras";
import s from "./compare.module.css";

/** The workbook columns the quantity or material strip shows (the Sheet column is left out for width). */
const STRIP = ["Item", "Net", "Allowance", "Order", "Unit", "Buy as"];

/**
 * Side-by-side cards, one view per block (COMPARE_VIEW; default vs for two columns, trio for three). vs: an amber
 * "or" coin on the seam. qto-mto: "Show this line as" (native radios, CSS :has() only) shows one workbook line as each
 * output, rings the matching card and offers that output's quote. plans: bid calendars and the "How often do you bid?"
 * fit switch, which ends in the picked option's route. range: the low, likely and high markers as a picker that reads
 * back each case's own last sentence. meter: the AACE class meter. marked: a measured run and a marked handoff. Every
 * column keeps its h3, body, points and footer.
 */
export function Compare({ b, page, kicker }: { b: CompareBlock; page: PageContent; kicker?: string }) {
  const n = b.columns.length;
  const view = COMPARE_VIEW[b.id] ?? (n === 2 ? "vs" : "trio");
  function fail(why: string): never {
    throw new Error(`Compare ${b.id} (${view}): ${why}`);
  }
  if ((view === "vs" || view === "qto-mto" || view === "meter" || view === "marked") && n !== 2) fail(`needs 2 columns, has ${n}`);
  if (view === "range" && (n !== 3 || !/likely/i.test(b.columns[1].title))) fail("needs low, likely and high columns");
  const quote = `/contact?service=${quoteService(page)}`;

  const qto = view === "qto-mto" ? (QTO_MTO[b.id] ?? fail("no QTO_MTO wiring")) : undefined;
  const sheet = qto && page.blocks.find((x) => x.id === qto.sheet);
  const line = qto && sheet?.type === "table" ? sheet.rows[qto.row] : undefined;
  if (qto) {
    if (sheet?.type !== "table" || !line) fail(`no sheet row ${qto.row} in ${qto.sheet}`);
    const missing = STRIP.filter((h) => !sheet.head.includes(h));
    if (missing.length) fail(`sheet ${qto.sheet} has no ${missing.join(", ")} column`);
    for (const m of qto.modes) if (!plain(b.columns[m.col].body).includes(m.quote)) fail(`column ${m.col} no longer says "${m.quote}"`);
  }

  const fit = view === "plans" ? (FIT[b.id] ?? fail("no FIT wiring")) : undefined;
  if (fit && (fit.options.length !== n || fit.calendars.length !== n || fit.routes.length !== n)) fail(`FIT has ${fit.options.length} options for ${n} columns`);
  const lines = fit
    ? b.columns.map((c) => {
        const first = plain(c.points?.[0] ?? "");
        if (!first.startsWith("Suits ")) fail(`"${plain(c.title)}" has no "Suits ..." first point for the fit switch`);
        return `${plain(c.title)}: ${first.replace(/^Suits/, "suits")}.`;
      })
    : [];

  // range: the cases are named as the page's "Which case?" sheet view names them, and each reads back its last sentence
  const range = view === "range" ? (RANGE[b.id] ?? fail("no RANGE wiring")) : undefined;
  const cases = range ? SHEET_VIEW[range.sheet] : undefined;
  if (range && (cases?.kind !== "columns" || cases.labels.length !== n)) fail(`${range.sheet} has no ${n}-case columns view`);
  if (range && !page.blocks.some((x) => x.id === range.sheet)) fail(`no ${range.sheet} block to link to`);
  const said = range
    ? b.columns.map((c) => `${plain(c.title)}: ${plain(c.body).split(/(?<=\.)\s+/).pop()}`)
    : [];

  const meter = view === "meter" ? (CLASS_METER[b.id] ?? fail("no CLASS_METER wiring")) : undefined;
  for (const c of meter?.filter((g) => g.lit).flatMap((g) => g.classes) ?? []) {
    if (!b.columns.some((col) => plain(col.title).startsWith(`Class ${c}`))) fail(`no "Class ${c}" card for the lit meter class`);
  }

  const icons = view === "trio" ? TRIO_ICONS[b.id] : undefined;
  if (icons && icons.length !== n) fail(`${icons.length} icons for ${n} columns`);

  const cols = b.columns.map((c, i) => (
    <div key={c.title} className={cx("hr-card hr-reveal", s.col)} data-i={i} data-mode={qto?.modes.find((m) => m.col === i)?.key}>
      {fit && <BidCalendar filled={fit.calendars[i]} />}
      {icons && (
        <span className={cx("hr-tile", s.tile)}>
          <Icon name={icons[i]} size={22} />
        </span>
      )}
      <h3>
        <Rich text={c.title} />
      </h3>
      <p className="copy">
        <Rich text={c.body} />
      </p>
      {c.points && c.points.length > 0 && (
        <ul className={cx("hr-checks copy", s.points)}>
          {c.points.map((p) => (
            <li key={p}>
              <Rich text={p} />
            </li>
          ))}
        </ul>
      )}
      {c.footer && (
        <p className={cx("copy", s.foot)}>
          {view === "trio" && <span className={s.noteIcon} aria-hidden="true" />}
          <span>
            <Rich text={c.footer} />
          </span>
        </p>
      )}
      {fit && (
        <span className={s.fits} aria-hidden="true">
          {BLOCK_COPY.compare.fits}
        </span>
      )}
    </div>
  ));
  const cards = (
    <div className={s.cards} data-n={n} data-view={view}>
      {n === 2
        ? [
            cols[0],
            <span key="or" className={s.coin} aria-hidden="true">
              {BLOCK_COPY.compare.or}
            </span>,
            cols[1],
          ]
        : cols}
    </div>
  );

  let body = cards;
  if (fit) {
    body = (
      <CompareFit
        name={`${b.id}-fit`}
        question={fit.question}
        hint={fit.hint}
        options={fit.options}
        lines={lines}
        rest={
          <Link href="/pricing" className="arrow-link">
            {COPY.price.all}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
        routes={fit.routes.map((r, i) =>
          "consult" in r ? (
            <ButtonLink key={i} href={SITE.bookingUrl} variant="outline">
              {COPY.consult}
            </ButtonLink>
          ) : (
            <ButtonLink key={i} href={r.service ? `/contact?service=${r.service}` : "/contact"}>
              {r.label}
            </ButtonLink>
          ),
        )}
      >
        {cards}
      </CompareFit>
    );
  } else if (range && cases?.kind === "columns") {
    body = (
      <CompareFit
        name={`${b.id}-case`}
        question={cases.ask}
        options={cases.labels}
        lines={said}
        initial={1}
        look="range"
        next={
          <>
            <ButtonLink href={quote}>{primaryLabel(page)}</ButtonLink>
            <Link href={`#${range.sheet}`} className="arrow-link">
              {range.more}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </>
        }
      >
        {cards}
      </CompareFit>
    );
  }

  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} center />
      <div className={s.compare} data-view={view}>
        {qto && line && sheet?.type === "table" && (
          <div className={s.qto}>
            <div className={s.switchRow}>
              <p id={`${b.id}-ask`} className={s.ask}>
                {qto.ask}
              </p>
              <div className={s.toggle} role="radiogroup" aria-labelledby={`${b.id}-ask`}>
                <span className={s.thumb} aria-hidden="true" />
                {qto.modes.map((m, i) => (
                  <label key={m.key} className={s.seg}>
                    <input className="sr-only" type="radio" name={b.id} value={m.key} defaultChecked={i === 0} />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
            {/* One line of the sheet below, as each output reads it: a picture of the same data, so it is hidden from
                screen readers, who get the sentence under it and the full workbook further down. */}
            <div className={s.strip} aria-hidden="true">
              {STRIP.map((h) => (
                <span key={h} className={s.cell} data-col={h}>
                  <span className={s.cellHead}>{h}</span>
                  <span className={s.cellVal}>{line[sheet.head.indexOf(h)]}</span>
                </span>
              ))}
              <span className={s.stop}>{qto.stop}</span>
            </div>
            <div className={s.sayRow}>
              <p className={s.say}>
                {qto.modes.map((m) => (
                  <span key={m.key} data-mode={m.key}>
                    {m.quote}
                  </span>
                ))}
              </p>
              <div className={s.routes}>
                {qto.modes.map((m) => (
                  <ButtonLink key={m.key} href={quote} data-mode={m.key}>
                    {m.cta}
                  </ButtonLink>
                ))}
              </div>
            </div>
          </div>
        )}
        {meter && <ClassMeter groups={meter} />}
        {body}
        {fit && <p className={s.caption}>{BLOCK_COPY.compare.plansCaption}</p>}
      </div>
    </Section>
  );
}
