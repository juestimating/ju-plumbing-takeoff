import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { Section, SectionHead } from "@/components/ui/Section";
import { PRICE_ROWS } from "@/content/pricing";
import { CLAIMS } from "@/lib/site";
import { BidWeekBoard } from "./BidWeekBoard";
import s from "./bidweek.module.css";

const ID = "why-plumbing-contractors-outsource-takeoffs";
const PRELIM = "/services/preliminary-plumbing-estimate";
const prelimFrom = PRICE_ROWS.find((r) => r.href === PRELIM)?.from;
if (!prelimFrom) throw new Error(`BidWeek: no published price for ${PRELIM}`);
const prelim = `$${prelimFrom.toLocaleString("en-US")}`;

const REASONS: { title: string; body: string }[] = [
  {
    title: "Bid dates don't move",
    body: "When the takeoff goes out the door, your estimator spends bid week on pricing, supplier calls and the bid form.",
  },
  {
    title: "One method on every job",
    body: "Legend and schedules first, each system on its own tab, then a check across systems, so jobs stay comparable.",
  },
  {
    title: "No software seats to keep up",
    body: "We already work in Bluebeam Revu, PlanSwift and On-Screen Takeoff. You get Excel and marked-up PDFs, nothing to install. Weighing it up? Read [plumbing takeoff services vs software](/guides/plumbing-takeoff-services-vs-software).",
  },
  {
    title: "A second set of eyes",
    body: "A second estimator checks counts, lengths and totals against the drawings before anything reaches you. See [how every file is checked](/about#how-we-work-on-every-file).",
  },
];

/** Why outsource: four honest reasons, the interactive bid week board, and when it isn't worth it. No figures. */
export function BidWeek() {
  return (
    <Section id={ID} tone="alt">
      <div className={s.grid}>
        <div>
          <SectionHead
            id={ID}
            kicker="Why outsource"
            h2="Why plumbing contractors outsource takeoffs"
            intro="Most plumbing bids aren't lost on skill. They're lost on hours. Two or three invitations land in the same week, and counting eats the hours you need for pricing."
          />
          <ul className={s.reasons}>
            {REASONS.map((r) => (
              <li key={r.title} className={s.reason}>
                <h3>{r.title}</h3>
                <p>
                  <Rich text={r.body} />
                </p>
              </li>
            ))}
          </ul>
        </div>
        <BidWeekBoard turnaround={CLAIMS.turnaround} />
      </div>

      <div className={s.note}>
        <span className="hr-tile">
          <Icon name="info" size={22} />
        </span>
        <div>
          <h3>{"When it isn't worth outsourcing"}</h3>
          <p>
            Small repairs you can measure on site, remodels where most piping is hidden, and weeks your own estimator
            already has covered. Send us the overflow, not the whole calendar.
          </p>
        </div>
        <p className={s.noteSide}>
          <Rich
            text={`No drawings yet? A [preliminary plumbing estimate](${PRELIM}) from ${prelim} gives you a budget range first.`}
          />
        </p>
      </div>
    </Section>
  );
}
