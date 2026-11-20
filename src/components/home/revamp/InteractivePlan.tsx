import type { CSSProperties } from "react";
import { Arrow, Badge, DASH, DimH, Dot, Frame, K, LegendLine, Pipe, Txt, Valve, Walls } from "@/components/illustrations/parts";
import { Lav, Sink, WC, Wh } from "@/components/illustrations/symbols";
import s from "./demo.module.css";

/**
 * The PlanMarkup drawing (restroom and kitchenette core) rebuilt for the home page takeoff demo. Same geometry and
 * parts kit, but every system sits in its own <g data-layer> so the client island can dim, highlight and pick layers
 * with CSS on its wrapper (data-active / data-item). A layer may span several groups to keep the original paint order.
 * Server component: it is rendered once and handed to TakeoffDemoClient as a prop.
 */

const W = K.white;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Runs in plan units (the plan block is enlarged 10 percent as one group, as in PlanMarkup).
const COLD = "M404 214H32V56H158M346 214V181M277 214V132M201 214V132";
const HOT = "M326 180V202H210V132M286 202V132";
const WASTE = "M50 83H240V180M222 116H240M222 180H240M257 148H240";
const VENT = "M63 106H240";

/** Count marks and tap targets around each counted fixture (ellipses in plan units). */
const FIXTURES: [item: "wc" | "lav" | "sink", cx: number, cy: number, rx: number, ry: number][] = [
  ["wc", 63, 81, 17, 21],
  ["wc", 113, 81, 17, 21],
  ["wc", 158, 81, 17, 21],
  ["lav", 222, 116, 14, 18],
  ["lav", 222, 180, 14, 18],
  ["sink", 258, 148, 15, 32],
];
const VALVES: [number, number][] = [[392, 214], [346, 198]];

const LEGEND: [layer: string, c: string, label: string, qty: string, dash?: string][] = [
  ["cold", K.cold, "Cold water", "1 in. - 70 LF"],
  ["hot", K.hot, "Hot water", "3/4 in. - 25 LF"],
  ["waste", K.waste, "Waste", "4 in. - 30 LF"],
  ["vent", K.vent, "Vent", "2 in. - 15 LF", DASH.vent],
];
const COUNTS: [item: string, layer: string, n: number, tag: string][] = [
  ["wc", "fixtures", 3, "WC-1"],
  ["lav", "fixtures", 2, "LAV-1"],
  ["sink", "fixtures", 1, "SK-1"],
  ["wh", "equipment", 1, "WH-1"],
];

/** Highlighter stroke laid under a run: drawn in when its layer is picked (and once as an intro). */
function Mark({ path, c, delay }: { path: string; c: string; delay: number }) {
  return <path className={s.mark} d={path} pathLength={1} stroke={c} strokeWidth={13} fill="none" style={d(delay)} />;
}

/** Wide invisible stroke so a tap on or near a thin pipe still picks it. */
function HitRun({ path }: { path: string }) {
  return <path d={path} fill="none" stroke="#000" strokeOpacity={0} strokeWidth={16} />;
}

export function InteractivePlan() {
  return (
    <Frame
      className={s.planSvg}
      title="Plumbing plan with color-coded takeoff markup"
      desc="Plan of a restroom and a kitchenette. Cold water runs are blue, hot water red, sanitary waste brown and vent green dashed. Amber badges give fixture counts and labels give pipe size and length."
    >
      <Txt x={32} y={32} size={14} weight={700}>Level 1 plumbing plan</Txt>
      <Txt x={620} y={32} size={13} weight={700} anchor="end">Sheet P-101</Txt>

      <g transform="translate(32 50) scale(1.1) translate(-32 -50)">
        {/* base: floor, walls, doors, stall partitions (never dimmed) */}
        <rect x="36" y="60" width="360" height="184" fill={W} />
        <Walls d="M120 248H32V56H400V248H382M360 248H142M240 56V248" />
        <rect x="120" y="242" width="22" height="12" fill={W} />
        <rect x="360" y="242" width="22" height="12" fill={W} />
        <path d="M120 242V254M142 242V254M360 242V254M382 242V254" stroke={K.navy} strokeWidth="2" strokeLinecap="butt" />
        <path d="M120 244V222M360 244V222" stroke={K.navy} strokeWidth="1.5" />
        <path d="M120 222A22 22 0 0 1 142 244M360 222A22 22 0 0 1 382 244" fill="none" stroke={K.mut} strokeWidth="1" />
        <path d="M90 60V112M136 60V112M206 60V112" stroke={K.navy} strokeWidth="1.75" strokeLinecap="butt" />

        {/* fixtures: count marks first so they sit under the symbols */}
        <g data-layer="fixtures">
          {FIXTURES.map(([item, cx, cy, rx, ry], i) => (
            <ellipse key={i} className={s.dab} data-item={item} cx={cx} cy={cy} rx={rx} ry={ry} style={d(i * 70)} />
          ))}
          <WC x={63} y={60} s={1.3} />
          <WC x={113} y={60} s={1.3} />
          <WC x={158} y={60} s={1.3} />
          <Lav x={236} y={116} r={90} s={1.3} />
          <Lav x={236} y={180} r={90} s={1.3} />
          <Sink x={244} y={148} r={-90} s={1.3} />
        </g>
        <g data-layer="equipment">
          <circle className={s.dab} data-item="wh" cx={336} cy={166} r={23} />
          <Wh x={336} y={166} r={17} />
        </g>

        {/* sanitary waste and vent */}
        <g data-layer="waste">
          <Mark path={WASTE} c={K.waste} delay={500} />
          <Pipe d={WASTE} c={K.waste} />
          <circle cx="240" cy="148" r="6.5" fill={W} stroke={K.waste} strokeWidth="2.5" />
          <Dot x={240} y={148} c={K.waste} />
          <Txt x={252} y={82} size={13} fill={K.waste} halo={W}>4 in. - 30 LF</Txt>
        </g>
        <g data-layer="vent">
          <Mark path={VENT} c={K.vent} delay={750} />
          <Pipe d={VENT} c={K.vent} dash={DASH.vent} />
        </g>

        {/* hot water */}
        <g data-layer="hot">
          <Mark path={HOT} c={K.hot} delay={250} />
          <Pipe d={HOT} c={K.hot} />
          <Dot x={286} y={202} c={K.hot} />
        </g>

        {/* cold water: stubs carry a white halo so they hop over the hot run */}
        <g data-layer="cold">
          <Mark path={COLD} c={K.cold} delay={0} />
          <Pipe d="M346 214V181M277 214V132M201 214V132" c={W} w={10} />
          <Pipe d={COLD} c={K.cold} />
          <Dot x={346} y={214} c={K.cold} />
          <Dot x={277} y={214} c={K.cold} />
          <Dot x={201} y={214} c={K.cold} />
          {VALVES.map(([x, y], i) => (
            <circle key={i} className={s.dab} data-item="valves" cx={x} cy={y} r={11} style={d(i * 90)} />
          ))}
          <Valve x={392} y={214} />
          <Valve x={346} y={198} r={90} />
          <Arrow x={406} y={214} r={180} c={K.cold} s={8} />
          <Txt x={50} y={206} size={13} fill={K.cold} halo={W}>1 in. - 70 LF</Txt>
        </g>

        {/* count badges on top of the runs */}
        <g data-layer="fixtures">
          <g className={s.pop} data-item="wc" style={d(0)}><Badge x={113} y={134} n={3} /></g>
          <g className={s.pop} data-item="lav" style={d(80)}><Badge x={166} y={156} n={2} /></g>
          <g className={s.pop} data-item="sink" style={d(160)}><Badge x={262} y={100} n={1} /></g>
        </g>
        <g data-layer="equipment">
          <g className={s.pop} data-item="wh"><Badge x={336} y={132} n={1} /></g>
        </g>

        <Txt x={44} y={236} size={12} weight={500} fill={K.mut} halo={W}>Restroom</Txt>
        <Txt x={252} y={236} size={12} weight={500} fill={K.mut} halo={W}>Kitchenette</Txt>
        <DimH x1={32} x2={400} y={280} label="30 ft" />

        {/* tap targets, last so they sit above everything they belong to */}
        <g data-layer="waste"><HitRun path={WASTE} /></g>
        <g data-layer="vent"><HitRun path={VENT} /></g>
        <g data-layer="hot"><HitRun path={HOT} /></g>
        <g data-layer="cold">
          <HitRun path={COLD} />
          {VALVES.map(([x, y], i) => (
            <circle key={i} data-item="valves" cx={x} cy={y} r={10} fill="#000" fillOpacity={0} />
          ))}
        </g>
        <g data-layer="fixtures">
          {FIXTURES.map(([item, cx, cy, rx, ry], i) => (
            <ellipse key={i} data-item={item} cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" fillOpacity={0} />
          ))}
        </g>
        <g data-layer="equipment">
          <circle data-item="wh" cx={336} cy={166} r={20} fill="#000" fillOpacity={0} />
        </g>
      </g>

      {/* legend: each row dims and lights with its layer */}
      <rect x="466" y="50" width="154" height="224" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={480} y={74} size={14} weight={800} halo={null}>Legend</Txt>
      {LEGEND.map(([layer, c, label, qty, dash], i) => (
        <g key={label} data-layer={layer}>
          <rect x={472} y={86 + i * 40} width={142} height={44} fill={W} />
          <LegendLine x={480} y={102 + i * 40} c={c} label={label} dash={dash} />
          <Txt x={514} y={124 + i * 40} size={13} weight={500} fill={K.mut} halo={null}>{qty}</Txt>
        </g>
      ))}

      {/* count summary */}
      <rect x="32" y="326" width="588" height="56" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={48} y={359} size={14} weight={800} halo={null}>Counts</Txt>
      {COUNTS.map(([item, layer, n, tag], i) => (
        <g key={tag} data-layer={layer} data-item={item}>
          <rect x={190 + i * 112} y={338} width={90} height={32} fill={W} />
          <g className={s.pop} data-item={item} style={d(i * 80)}>
            <Badge x={204 + i * 112} y={354} n={n} />
          </g>
          <Txt x={220 + i * 112} y={359} size={13} halo={null}>{tag}</Txt>
        </g>
      ))}
    </Frame>
  );
}
