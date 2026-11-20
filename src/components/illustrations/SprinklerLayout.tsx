import { Badge, DimH, Frame, K, LegendLine, Pipe, Txt, Walls } from "./parts";
import { ringPath } from "./symbols";

const W = K.white;
const COLS = [96, 192, 288, 384];
const ROWS = [84, 156, 228];

// Ceiling tile grid: 24 px tiles inside the room (x 36-444, y 48-264).
const TILES = (() => {
  let d = "";
  for (let x = 60; x < 444; x += 24) d += `M${x} 48V264`;
  for (let y = 72; y < 264; y += 24) d += `M36 ${y}H444`;
  return d;
})();
const HEADS = ROWS.flatMap((y) => COLS.map((x) => [x, y] as const));
const RINGS = HEADS.map(([x, y]) => ringPath(x, y)).join("");
const CROSSES = HEADS.map(([x, y]) => `M${x - 3} ${y}H${x + 3}M${x} ${y - 3}V${y + 3}`).join("");

/** Reflected ceiling plan: heads, branch lines, cross main and riser. */
export function SprinklerLayout({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Fire sprinkler mains and branch lines"
      desc="Reflected ceiling plan on a tile grid. Twelve pendent sprinkler heads sit in three rows. Branch lines run from a cross main to the heads, and a riser feeds the cross main. A fire department connection is piped to the riser. The water supply and riser valves are not drawn."
    >
      <Txt x={32} y={28} size={14} weight={700}>Reflected ceiling plan: sprinkler layout</Txt>

      <rect x="36" y="48" width="408" height="216" fill={W} />
      <path d={TILES} fill="none" stroke="#d8dcec" strokeWidth="1" strokeLinecap="butt" />
      <Walls d="M32 44H448V268H32Z" />

      {/* cross main, branch lines, feed from the fire department connection */}
      <Pipe d="M60 84H384M60 156H384M60 228H384" c={K.fire} w={4} layer="branch" />
      <g data-layer="main">
        <Pipe d="M60 252V84" c={K.fire} w={6} />
        <Pipe d="M60 292V252" c={K.fire} w={6} />
        <rect x="46" y="286" width="28" height="12" rx="2" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <Txt x={84} y={297} size={12} weight={600} halo={K.paper}>Fire dept. connection</Txt>
      </g>

      {/* heads */}
      <g data-layer="heads">
        <path d={RINGS} fill={W} stroke={K.navy} strokeWidth="1.75" />
        <path d={CROSSES} fill="none" stroke={K.navy} strokeWidth="1.25" strokeLinecap="butt" />
      </g>

      {/* riser */}
      <g data-layer="main">
        <circle cx="60" cy="252" r="9" fill={W} stroke={K.fire} strokeWidth="3" />
        <circle cx="60" cy="252" r="3.5" fill={K.fire} stroke="none" />
      </g>

      {/* labels and dimension */}
      <DimH x1={96} x2={192} y={68} label="8 ft" />
      <Txt x={74} y={199} size={12} weight={700} fill={K.fire} halo={W} layer="main">Cross main 2-1/2 in.</Txt>
      <Txt x={214} y={144} size={12} weight={700} fill={K.fire} halo={W} layer="branch">Branch line 1-1/2 in.</Txt>
      <Txt x={74} y={256} size={12} weight={700} fill={K.fire} halo={W} layer="main">Riser</Txt>

      {/* legend */}
      <rect x="472" y="42" width="148" height="230" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={488} y={68} size={14} weight={800} halo={null}>Legend</Txt>
      <g data-layer="heads">
        <path d={ringPath(498, 102, 5)} fill={W} stroke={K.navy} strokeWidth="1.75" />
        <path d="M494 102H502M498 98V106" stroke={K.navy} strokeWidth="1.25" strokeLinecap="butt" />
        <Txt x={514} y={107} size={13} halo={null}>Pendent head</Txt>
      </g>
      <LegendLine x={488} y={142} c={K.fire} label="Branch line" w={4} len={20} layer="branch" />
      <LegendLine x={488} y={180} c={K.fire} label="Cross main" w={6} len={20} layer="main" />
      <g data-layer="main">
        <circle cx="498" cy="218" r="8" fill={W} stroke={K.fire} strokeWidth="3" />
        <circle cx="498" cy="218" r="3" fill={K.fire} stroke="none" />
        <Txt x={514} y={223} size={13} halo={null}>Riser</Txt>
      </g>

      {/* takeoff summary */}
      <rect x="32" y="316" width="588" height="56" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={48} y={349} size={14} weight={800} halo={null}>Takeoff</Txt>
      <g data-layer="heads">
        <Badge x={158} y={344} n={12} />
        <Txt x={176} y={349} size={13} halo={null}>Heads</Txt>
      </g>
      <LegendLine x={256} y={344} c={K.fire} label="1-1/2 in. - 80 LF" w={4} len={22} layer="branch" />
      <LegendLine x={410} y={344} c={K.fire} label="2-1/2 in. - 15 LF" w={6} len={22} layer="main" />
      <Txt x={32} y={392} size={12} weight={500} fill={K.mut} halo={null}>Sizes are examples only. Water supply and riser valves are not drawn.</Txt>
    </Frame>
  );
}
