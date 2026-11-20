import { Illustration } from "@/components/illustrations/Illustration";
import { HOME_SYSTEMS, SYSTEM_PRICE } from "@/components/home/content";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHead } from "@/components/ui/Section";
import { CLAIMS } from "@/lib/site";
import { cx } from "@/lib/utils";
import { SystemTabs } from "./SystemTabs";
import s from "./systems.module.css";

const ID = "plumbing-takeoff-by-system";

/**
 * Section B, the system explorer: one tab per plumbing system (HOME_SYSTEMS). Every panel (drawing, summary, price,
 * quote button and the first five lines of what we count) renders here on the server and reaches the client island as
 * a prop, so every system is in the HTML and the island stays small. The drawing goes in as its own prop and only the
 * open tab mounts it, which keeps about 570 nodes of hidden drawings out of the page.
 */
export function SystemExplorer() {
  const items = HOME_SYSTEMS.map((sys) => ({
    key: sys.key,
    label: sys.label,
    color: sys.color,
    icon: <Icon name={sys.icon} size={20} />,
    // Keys: on the client the drawing and the panel blocks sit in arrays (the fragment arrives as one), and the
    // drawing can arrive as a lazy chunk the JSX runtime cannot mark as a fixed child.
    media: (
      <figure key="media" className={s.media}>
        <Illustration name={sys.drawing} />
        <figcaption>
          <span>Illustrative drawing</span>
          <span>Not to scale</span>
        </figcaption>
      </figure>
    ),
    panel: (
      <>
        <div key="summary" className={s.summary}>
          <div className={s.head}>
            <span className={cx("hr-tile", s.tile)}>
              <Icon name={sys.icon} size={22} />
            </span>
            <h3>{sys.label}</h3>
          </div>
          <p className={s.blurb}>{sys.blurb}</p>
          <ul className={s.badges}>
            <li className="hr-badge">
              <Icon name="dollar" size={15} />
              {SYSTEM_PRICE}
            </li>
            <li className="hr-badge soft">
              <Icon name="clock" size={15} />
              {CLAIMS.turnaround}
            </li>
            <li className="hr-badge soft">
              <Icon name="file-spreadsheet" size={15} />
              Own tab in your workbook
            </li>
          </ul>
        </div>
        <div key="ctas" className={s.ctas}>
          <ButtonLink href="/contact?service=plumbing-takeoff">Get a fixed quote</ButtonLink>
        </div>
        <div key="counts" className={s.counts}>
          <p className={s.countHead}>What we count</p>
          <ul className={s.countList}>
            {sys.counts.map(([label, unit]) => (
              <li key={label}>
                <span className={s.line}>{label}</span>
                <span className="hr-badge soft">{unit}</span>
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  }));

  return (
    <Section id={ID} tone="alt">
      <SectionHead
        id={ID}
        kicker="What we take off"
        h2="Plumbing takeoff by system, from DWV to medical gas"
        intro="Pick a system to see what we count. Each one gets its own tab in your workbook, so you can price it, buy it or hand it to a crew."
        center
      />
      <SystemTabs items={items} />
    </Section>
  );
}
