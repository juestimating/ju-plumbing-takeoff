import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import type { IconName, ListBlock, SystemColor } from "@/content/types";
import { cx } from "@/lib/utils";
import s from "./contact.module.css";

/** Icons for the "good to know" notes, in order: rates and template, large sets by link, incomplete sets. */
const NOTE_ICONS: IconName[] = ["calculator", "upload", "info"];
/** Every drawing color, shown on the "systems to include" row as a legend. */
const SYSTEM_COLORS: SystemColor[] = ["cold", "hot", "waste", "vent", "storm", "gas", "fire", "med"];

/**
 * "Before you send": the what-to-send list as a plan-set packing checklist. The first three items are what to send
 * (native checkboxes the visitor ticks), the last three are notes. The count and the "Ready" link are CSS only
 * (a counter on the checked boxes, :has() for all three), so it works without JavaScript; nothing here is sent.
 */
export function ReadyChecklist({ block, formId }: { block: ListBlock; formId: string }) {
  if (block.items.length !== 6) throw new Error(`ReadyChecklist: expected 6 items (3 to send, 3 notes), got ${block.items.length}`);
  const send = block.items.slice(0, 3);
  const notes = block.items.slice(3);
  return (
    <Section id={block.id} tone={block.tone ?? "light"}>
      <SectionHead id={block.id} kicker="Before you send" h2={block.h2} intro={block.intro} />
      <div className={s.ready}>
        <div className={cx("hr-card", s.send)}>
          <p className={s.cardTitle}>Send these</p>
          <ul className={s.ticks} role="list">
            {send.map((it, i) => {
              const bodyId = `${block.id}-send-${i + 1}`;
              return (
                <li key={it.title} className={s.tick}>
                  <label className={s.tickLabel}>
                    <input type="checkbox" className={s.box} aria-describedby={bodyId} />
                    <span>{it.title}</span>
                  </label>
                  <p id={bodyId} className={s.tickBody}>
                    <Rich text={it.body} />
                  </p>
                  {it.body.includes("plumbing systems") && (
                    <span className={s.legend} aria-hidden="true">
                      {SYSTEM_COLORS.map((c) => (
                        <i key={c} className="legend-line" data-c={c} />
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={s.status}>
            <p className={s.count} aria-hidden="true">
              {` of ${send.length} ready`}
            </p>
            <a href={`#${formId}`} className={cx("arrow-link", s.done)}>
              Ready. Send your plans
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className={s.foot}>Tick what you have. Nothing here is sent.</p>
        </div>
        <div className={cx("hr-card", s.notes)}>
          <p className={s.cardTitle}>Good to know</p>
          <ul className={s.noteList} role="list">
            {notes.map((it, i) => (
              <li key={it.title}>
                <span className="hr-tile sm" aria-hidden="true">
                  <Icon name={NOTE_ICONS[i] ?? "info"} />
                </span>
                <div>
                  <p className={s.noteTitle}>{it.title}</p>
                  <p className={s.noteBody}>
                    <Rich text={it.body} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
