import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { BLOCK_COPY, STEPS_BUILD } from "@/content/template-blocks";
import type { ListBlock, StepsBlock, SystemColor } from "@/content/types";
import { plain } from "@/lib/schema";
import { cx } from "@/lib/utils";
import { BuildBands } from "./BuildBands";
import s from "./piperun.module.css";

/**
 * "The method": numbered steps hung on a pipe in the system color, with numbered fittings and the home process spools
 * between them (the amber flow moves with the scroll, never on its own). One row of cards from 1280px (six steps run
 * as two rows of three), a riser below.
 * Steps listed in STEPS_BUILD become the estimate build: a stack of band buttons beside the riser. Picking a band
 * (hover intent, click, tap, keys) rings it and lights its step; hovering a step rings its band (CSS :has()); each band
 * fills as its step scrolls in (scroll-driven, all filled without).
 */
export function PipeRun({ b, color, kicker }: { b: ListBlock | StepsBlock; color?: SystemColor; kicker?: string }) {
  const items = b.type === "list" ? b.items : b.steps;
  const bands = STEPS_BUILD[b.id];
  if (bands && bands.length !== items.length) throw new Error(`PipeRun ${b.id}: ${bands.length} bands for ${items.length} steps`);
  const cta = b.type === "steps" && b.cta && (
    <p className={s.cta}>
      <ButtonLink href={b.cta.href} size="lg" arrow>
        {b.cta.label}
      </ButtonLink>
    </p>
  );
  const run = (
    <ol className={s.run} data-n={items.length} data-c={color} data-tone={b.tone === "dark" ? "dark" : "light"} data-riser={bands ? "" : undefined}>
      {items.map((it, i) => (
        <li key={it.title} className={cx(s.step, "hr-reveal")}>
          <span className={s.node} data-n={String(i + 1).padStart(2, "0")} aria-hidden="true" />
          <div className={cx("hr-card lift", s.card)}>
            <h3>
              <Rich text={it.title.replace(/\.$/, "")} />
            </h3>
            <p className="copy">
              <Rich text={it.body} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} center={!bands} />
      {bands ? (
        <div className={s.build} data-tone={b.tone === "dark" ? "dark" : "light"}>
          <BuildBands ask={BLOCK_COPY.build.ask} bands={bands} steps={items.map((it) => plain(it.title))} caption={BLOCK_COPY.build.caption} />
          <div>
            {run}
            {cta}
          </div>
        </div>
      ) : (
        <>
          {run}
          {cta}
        </>
      )}
    </Section>
  );
}
