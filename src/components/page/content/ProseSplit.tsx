import type { ReactNode } from "react";
import { DrawingFigure } from "@/components/illustrations/DrawingFigure";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { PROSE_EXTRA } from "@/content/template-blocks";
import type { IllustrationName, PageContent, ProseBlock } from "@/content/types";
import { cx } from "@/lib/utils";
import { CheckCard, StageTimeline, TakeoffEquation, priceRow } from "./extras";
import s from "./prose.module.css";

/**
 * "In plain terms": the copy beside a plumbing artifact. The block's own drawing, else the PROSE_EXTRA artifact
 * (takeoff equation, design stage timeline, check card for the bullets), else the copy alone.
 */
export function ProseSplit({ b, page, kicker, heroDrawing }: { b: ProseBlock; page: PageContent; kicker?: string; heroDrawing?: IllustrationName }) {
  if (b.image) throw new Error(`ProseSplit ${b.id}: prose images are not rendered; use an illustration`);
  const extra = PROSE_EXTRA[b.id];
  const drawing = b.illustration !== heroDrawing ? b.illustration : undefined;
  if (extra?.kind === "check" && !b.bullets?.length) throw new Error(`ProseSplit ${b.id}: a check card needs the block's bullets`);
  if (extra?.kind === "equation") {
    const lead = page.hero.lead.toLowerCase();
    const missing = extra.adds.filter((a) => !lead.includes(a.toLowerCase()));
    if (missing.length) throw new Error(`ProseSplit ${b.id}: the hero lead no longer says ${missing.join(", ")}`);
  }

  let side: ReactNode = null;
  if (drawing) {
    side = <DrawingFigure name={drawing} />;
  } else if (extra?.kind === "equation") {
    side = <TakeoffEquation from={priceRow(extra.from, b.id)} to={priceRow(extra.to, b.id)} adds={extra.adds} />;
  } else if (extra?.kind === "timeline") {
    side = <StageTimeline stops={extra.stops} spans={extra.spans} />;
  } else if (extra?.kind === "check") {
    side = <CheckCard label={extra.label} items={b.bullets!} cta={extra.cta} />;
  }

  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} />
      <div className={side !== null ? s.split : undefined}>
        <div className={cx("copy", s.copy)}>
          {b.paragraphs.map((p, i) => (
            <p key={i}>
              <Rich text={p} />
            </p>
          ))}
          {b.bullets && extra?.kind !== "check" && (
            <ul className="hr-checks">
              {b.bullets.map((x) => (
                <li key={x}>
                  <Rich text={x} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {side !== null && <div className={s.side}>{side}</div>}
      </div>
    </Section>
  );
}
