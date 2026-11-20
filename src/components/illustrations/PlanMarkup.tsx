import { Arrow, Badge, DASH, DimH, Dot, Frame, K, LegendLine, Pipe, Txt, Valve, Walls } from "./parts";
import { Lav, Sink, WC, Wh } from "./symbols";

const W = K.white;
const COUNTS: [number, string][] = [[3, "WC-1"], [2, "LAV-1"], [1, "SK-1"], [1, "WH-1"]];
const RUNS: [string, string, string, string?][] = [
  [K.cold, "Cold water", "1 in. - 70 LF"],
  [K.hot, "Hot water", "3/4 in. - 25 LF"],
  [K.waste, "Waste", "4 in. - 30 LF"],
  [K.vent, "Vent", "2 in. - 15 LF", DASH.vent],
];

/** Hero drawing: restroom and kitchenette core with color-coded takeoff markup. */
export function PlanMarkup({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Plumbing plan with color-coded takeoff markup"
      desc="Plan of a restroom and a kitchenette. Cold water runs are blue, hot water red, sanitary waste brown and vent green dashed. Amber badges give fixture counts and labels give pipe size and length."
    >
      <Txt x={32} y={32} size={14} weight={700}>Level 1 plumbing plan</Txt>

      {/* the plan itself is drawn in its own units and enlarged 10 percent as one block */}
      <g transform="translate(32 50) scale(1.1) translate(-32 -50)">
        {/* floor, walls, doors, stall partitions */}
        <rect x="36" y="60" width="360" height="184" fill={W} />
        <Walls d="M120 248H32V56H400V248H382M360 248H142M240 56V248" />
        <rect x="120" y="242" width="22" height="12" fill={W} />
        <rect x="360" y="242" width="22" height="12" fill={W} />
        <path d="M120 242V254M142 242V254M360 242V254M382 242V254" stroke={K.navy} strokeWidth="2" strokeLinecap="butt" />
        <path d="M120 244V222M360 244V222" stroke={K.navy} strokeWidth="1.5" />
        <path d="M120 222A22 22 0 0 1 142 244M360 222A22 22 0 0 1 382 244" fill="none" stroke={K.mut} strokeWidth="1" />
        <path d="M90 60V112M136 60V112M206 60V112" stroke={K.navy} strokeWidth="1.75" strokeLinecap="butt" />

        {/* fixtures */}
        <WC x={63} y={60} s={1.3} />
        <WC x={113} y={60} s={1.3} />
        <WC x={158} y={60} s={1.3} />
        <Lav x={236} y={116} r={90} s={1.3} />
        <Lav x={236} y={180} r={90} s={1.3} />
        <Sink x={244} y={148} r={-90} s={1.3} />
        <Wh x={336} y={166} r={17} />

        {/* sanitary waste and vent */}
        <Pipe d="M50 83H240V180M222 116H240M222 180H240M257 148H240" c={K.waste} />
        <Pipe d="M63 106H240" c={K.vent} dash={DASH.vent} />
        <circle cx="240" cy="148" r="6.5" fill={W} stroke={K.waste} strokeWidth="2.5" />
        <Dot x={240} y={148} c={K.waste} />

        {/* hot water */}
        <Pipe d="M326 180V202H210V132M286 202V132" c={K.hot} />
        <Dot x={286} y={202} c={K.hot} />
        {/* cold water: stubs carry a white halo so they hop over the hot run */}
        <Pipe d="M346 214V181M277 214V132M201 214V132" c={W} w={10} />
        <Pipe d="M404 214H32V56H158M346 214V181M277 214V132M201 214V132" c={K.cold} />
        <Dot x={346} y={214} c={K.cold} />
        <Dot x={277} y={214} c={K.cold} />
        <Dot x={201} y={214} c={K.cold} />
        <Valve x={392} y={214} />
        <Valve x={346} y={198} r={90} />
        <Arrow x={406} y={214} r={180} c={K.cold} s={8} />

        {/* count badges, run callouts, room names, dimension */}
        <Badge x={113} y={134} n={3} />
        <Badge x={166} y={156} n={2} />
        <Badge x={262} y={100} n={1} />
        <Badge x={336} y={132} n={1} />
        <Txt x={252} y={82} size={13} fill={K.waste} halo={W}>4 in. - 30 LF</Txt>
        <Txt x={50} y={206} size={13} fill={K.cold} halo={W}>1 in. - 70 LF</Txt>
        <Txt x={44} y={236} size={12} weight={500} fill={K.mut} halo={W}>Restroom</Txt>
        <Txt x={252} y={236} size={12} weight={500} fill={K.mut} halo={W}>Kitchenette</Txt>
        <DimH x1={32} x2={400} y={280} label="30 ft" />
      </g>

      {/* legend */}
      <rect x="466" y="50" width="154" height="224" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={480} y={74} size={14} weight={800} halo={null}>Legend</Txt>
      {RUNS.map(([c, label, qty, dash], i) => (
        <g key={label}>
          <LegendLine x={480} y={102 + i * 40} c={c} label={label} dash={dash} />
          <Txt x={514} y={124 + i * 40} size={13} weight={500} fill={K.mut} halo={null}>{qty}</Txt>
        </g>
      ))}

      {/* count summary */}
      <rect x="32" y="326" width="588" height="56" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={48} y={359} size={14} weight={800} halo={null}>Fixture count</Txt>
      {COUNTS.map(([n, tag], i) => (
        <g key={tag}>
          <Badge x={204 + i * 112} y={354} n={n} />
          <Txt x={220 + i * 112} y={359} size={13} halo={null}>{tag}</Txt>
        </g>
      ))}
    </Frame>
  );
}
