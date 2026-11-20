import { ArrowRight } from "lucide-react";
import { HoverTabs } from "@/components/interactive/HoverTabs";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { DELIVERABLES } from "@/content/shared";
import { BLOCK_COPY, GAP_LOG } from "@/content/template-blocks";
import type { ListBlock, SystemColor } from "@/content/types";
import { plain } from "@/lib/schema";
import { cx } from "@/lib/utils";
import s from "./gaps.module.css";

const LOG_FILE = DELIVERABLES.find((d) => d.title === "Scope-gap log");
if (!LOG_FILE) throw new Error('GapExplorer: no "Scope-gap log" in DELIVERABLES');

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Before you price": the scope-gap log explorer (home system explorer on HoverTabs). Resting the mouse on a gap in
 * the numbered list, a click, a tap or the arrow keys open it in the white log card; below 1024px the list is the
 * chip row. Every gap is in the HTML as a panel h3 and its text, and the card keeps the tallest gap's height (from
 * 1024px it runs the list's full height). Under the explorer, once: what the log file holds, and the route to a
 * sample file (the scope-gap log ships in every takeoff; a log of its own, like the bid compliance check, has none).
 */
export function GapExplorer({ b, color, kicker }: { b: ListBlock; color?: SystemColor; kicker?: string }) {
  const own = GAP_LOG[b.id];
  const { ask, log, count } = own ?? BLOCK_COPY.gap;
  const n = pad(b.items.length);
  const footer = own ? (
    own.footer
  ) : (
    <>
      <strong>{BLOCK_COPY.gap.footer}</strong> {LOG_FILE!.body}
    </>
  );
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} kicker={kicker} h2={b.h2} intro={b.intro} center />
      <HoverTabs
        className={s.gap}
        panelClassName={s.panel}
        label={log}
        ask={ask}
        tone={b.tone === "dark" ? "dark" : "light"}
        items={b.items.map((it, i) => {
          const title = it.title.replace(/\.$/, "");
          return {
            key: String(i),
            num: pad(i + 1),
            label: plain(title),
            panel: (
              <div className={s.log} data-c={color}>
                <div className={cx("sheet-bar", s.bar)}>
                  <span className="sheet-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={s.logName}>{log}</span>
                  <span className={s.of}>{`${count ? `${count} ` : ""}${pad(i + 1)} of ${n}`}</span>
                </div>
                <div className={s.body}>
                  <div className={s.head}>
                    <span className={s.tile} aria-hidden="true" />
                    <h3>
                      <Rich text={title} />
                    </h3>
                  </div>
                  <p className={cx("copy", s.text)}>
                    <Rich text={it.body} />
                  </p>
                </div>
              </div>
            ),
          };
        })}
      />
      <div className={s.after}>
        <p className={s.foot}>
          <span className={s.file} aria-hidden="true" />
          <span>{footer}</span>
        </p>
        {!own && (
          <a href={BLOCK_COPY.sheet.sample.href} className={cx("arrow-link", s.more)}>
            {BLOCK_COPY.sheet.sample.label}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
    </Section>
  );
}
