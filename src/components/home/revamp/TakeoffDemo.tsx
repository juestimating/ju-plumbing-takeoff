import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { DELIVERABLES } from "@/content/shared";
import { InteractivePlan } from "./InteractivePlan";
import { TakeoffDemoClient } from "./TakeoffDemoClient";
import s from "./demo.module.css";

const ID = "what-is-in-every-plumbing-takeoff-file";

/** One-line versions of the shared deliverable copy (same facts, shorter). Falls back to the full body. */
const SHORT: Record<string, string> = {
  "Unlocked Excel workbook": "A summary tab, then a tab per system with pipe, fittings, valves and hangers, and live formulas you can edit.",
  "PDF summary": "Organized by CSI MasterFormat, ready for an owner, lender or general contractor.",
  "Marked-up plans": "Color-coded by system, so every quantity can be traced.",
  "Basis of estimate": "Inclusions, exclusions and assumptions written in trade language.",
  "Scope-gap log": "Drawing conflicts and missing information, ready to send as RFIs.",
};

/** "See it traced": an interactive marked-up plan linked to a workbook preview, then what every file contains. */
export function TakeoffDemo() {
  return (
    <Section id={ID} tone="dark" className={s.sec}>
      <SectionHead
        id={ID}
        center
        kicker="See it traced"
        h2="What is in every plumbing takeoff file"
        intro="Pick a system on the plan and the workbook follows. Every quantity names the sheet it came from, so you can check any number before you price it."
      />

      <TakeoffDemoClient plan={<InteractivePlan />} />

      <div className={s.receive}>
        <div className={s.recHead}>
          <span className="hr-tile">
            <Icon name="file-check" size={22} />
          </span>
          <div>
            <p className={s.recTitle}>What you get back</p>
            <p className={s.recSub}>
              <Rich text="In every plumbing takeoff file we send. Building your own workbook? The [plumbing estimating spreadsheet guide](/guides/plumbing-estimating-spreadsheet) walks through the tabs and formulas." />
            </p>
          </div>
        </div>
        <ul className={s.recGrid}>
          {DELIVERABLES.map((d) => (
            <li key={d.title} className={s.recCard}>
              <span className={s.recCheck}>
                <Icon name="check" size={16} />
              </span>
              <div>
                <h3>{d.title}</h3>
                <p>{SHORT[d.title] ?? d.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={s.recCta}>
          <p>Want to open one before you order?</p>
          <ButtonLink href="/samples" variant="outline" arrow>
            See a sample file
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
