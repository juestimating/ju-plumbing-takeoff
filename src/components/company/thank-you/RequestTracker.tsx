import { OpenNow } from "@/components/page/OpenNow";
import { keepHyphenated } from "@/components/page/StepCards";
import { Rich } from "@/components/ui/Rich";
import type { StepsBlock } from "@/content/types";
import s from "./thank-you.module.css";

/** Where the request stands on this page: the first step has happened (they sent it), the quote is being made. */
const STATES = [
  { key: "done", label: "Done" },
  { key: "now", label: "In progress" },
  { key: "next", label: "Next" },
] as const;

/**
 * "What happens after you send your request" as a request tracker in the hero card: the steps as stops on a short
 * pipe run (done, in progress, next), each named in words so color is never the only signal. The card is the
 * #next-10-minutes section (the phone sticky bar hides itself on a page that has that id). No script.
 */
export function RequestTracker({ block }: { block: StepsBlock }) {
  return (
    <section id={block.id} aria-labelledby={`${block.id}-h`} className={s.tracker}>
      <h2 id={`${block.id}-h`} className={s.trackerH}>
        <Rich text={block.h2} />
      </h2>
      {block.intro && (
        <p className={s.trackerIntro}>
          <Rich text={block.intro} />
        </p>
      )}
      <OpenNow className={s.open} />
      <ol className={s.run}>
        {block.steps.map((st, i) => {
          const state = STATES[Math.min(i, STATES.length - 1)]!;
          return (
            <li key={st.title} className={s.stop} data-state={state.key}>
              <span className={s.node} aria-hidden="true" />
              <div className={s.stopText}>
                <p className={s.state}>{state.label}</p>
                <h3 className={s.stopTitle}>{st.title.replace(/\.$/, "")}</h3>
                {/* plain bodies keep "marked-up" and "24–72" whole at a line end */}
                <p className={s.stopBody}>{/\[|\*\*/.test(st.body) ? <Rich text={st.body} /> : keepHyphenated(st.body)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
