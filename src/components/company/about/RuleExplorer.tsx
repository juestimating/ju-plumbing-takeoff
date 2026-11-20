import { HoverTabs } from "@/components/interactive/HoverTabs";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import type { IconName, ListBlock } from "@/content/types";
import { RULE_MOCKS } from "./RuleMocks";
import s from "./about.module.css";

/** One icon per rule, in rule order: traces, second check, inside the drawings, estimate class, ZIP code, no compete. */
const ICONS: IconName[] = ["file-search", "shield-check", "alert", "scale", "map-pin", "handshake"];

/**
 * "Our rules": the working rules as hover-intent tabs on navy. Resting on a rule, clicking it or arrowing to it opens
 * its panel: the rule as written, then a small mock of where it shows up in your file. All six rules stay in the HTML.
 */
export function RuleExplorer({ block }: { block: ListBlock }) {
  if (block.items.length !== RULE_MOCKS.length) {
    throw new Error(`RuleExplorer: ${block.items.length} rules but ${RULE_MOCKS.length} mocks; keep them in step`);
  }
  const items = block.items.map((it, i) => {
    const title = it.title.replace(/\.$/, "");
    return {
      key: `rule-${i + 1}`,
      num: String(i + 1).padStart(2, "0"),
      label: title,
      panel: (
        <div className={s.rule}>
          <div className={s.ruleText}>
            <p className={s.ruleTitle}>
              <span className="hr-tile" aria-hidden="true">
                <Icon name={ICONS[i] ?? "check"} size={22} />
              </span>
              {title}
            </p>
            <p className={s.ruleBody}>
              <Rich text={it.body} />
            </p>
          </div>
          <div className={s.mock} aria-hidden="true">
            <div className={s.mockPane}>{RULE_MOCKS[i]}</div>
            <p className={s.mockCap}>Illustrative example</p>
          </div>
        </div>
      ),
    };
  });
  return (
    <Section id={block.id} tone="dark">
      <SectionHead id={block.id} kicker="Our rules" h2={block.h2} center />
      <HoverTabs items={items} label="Our working rules" ask="Pick a rule to see it on a file." tone="dark" className={s.rules} />
    </Section>
  );
}
