import { Arrow, Check, DASH, Dot, Frame, K, LegendLine, Pipe, Txt, Valve } from "./parts";

const W = K.white;
const TANKS = [214, 304];

/** Equipment room schematic: service entry, backflow preventer, PRV, expansion tank, two heaters, mixing valve, recirc pump. */
export function EquipmentRoom({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Water heater and equipment room piping"
      desc="Elevation schematic of a plumbing equipment room. Cold water enters through a valve, backflow preventer and pressure reducing valve, then splits to the building and to two water heaters with an expansion tank. Hot water passes a mixing valve to the building, and a recirculation return comes back through a pump and check valve. Cold water also feeds the mixing valve. Each water heater has a relief valve and discharge line."
    >
      {/* floor */}
      <path d="M24 348H616" stroke={K.navy} strokeWidth="3" fill="none" />

      {/* cold: service, building riser, heater manifold */}
      <Pipe d="M24 316H166V40M166 214H430V139" c={K.cold} />
      <Pipe d="M200 214V192M226 214V232M316 214V232" c={K.cold} />
      <Dot x={166} y={214} c={K.cold} />
      <Dot x={200} y={214} c={K.cold} />
      <Dot x={316} y={214} c={K.cold} />
      <Arrow x={34} y={316} c={K.cold} s={9} />
      <Valve x={54} y={316} />
      <rect x="76" y="306" width="40" height="20" rx="2" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <path d="M84 311L92 316L84 321ZM88 311V321M100 311L108 316L100 321ZM104 311V321M96 326V336" fill="none" stroke={K.navy} strokeWidth="1.25" />
      {/* PRV: valve with a diaphragm dome */}
      <g transform="translate(140 316)">
        <path d="M-6-5V5L6-5V5Z" fill={W} stroke={K.navy} strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M0 0V-9M-7-9A7 5 0 0 1 7-9Z" fill={W} stroke={K.navy} strokeWidth="1.5" />
      </g>
      <Txt x={96} y={296} size={12} weight={600} anchor="middle">Backflow preventer</Txt>
      <Txt x={140} y={340} size={12} weight={600} anchor="middle">PRV</Txt>
      <Txt x={166} y={26} size={12} weight={700} anchor="middle" fill={K.cold}>Cold to building</Txt>
      <Arrow x={166} y={40} r={-90} c={K.cold} s={9} />

      {/* expansion tank */}
      <rect x="186" y="150" width="28" height="42" rx="14" fill={W} stroke={K.navy} strokeWidth="1.75" />
      <path d="M186 170H214" stroke={K.navy} strokeWidth="1.25" strokeDasharray="3 3" strokeLinecap="butt" fill="none" />
      <Txt x={200} y={144} size={12} weight={700} anchor="middle">ET-1</Txt>

      {/* water heaters */}
      {TANKS.map((x, i) => (
        <g key={x}>
          <rect x={x} y={232} width={54} height={116} rx={8} fill={W} stroke={K.navy} strokeWidth="2" />
          <Txt x={x + 27} y={296} size={13} weight={800} anchor="middle" halo={W}>WH-{i + 1}</Txt>
        </g>
      ))}
      <Valve x={226} y={224} r={90} />
      <Valve x={316} y={224} r={90} />
      {/* T&P relief valves: each has its own open discharge line (arrow, never capped), named once in the legend */}
      {[268, 358].map((x) => (
        <g key={x}>
          <path d={`M${x} 250H${x + 14}V298`} fill="none" stroke={K.navy} strokeWidth="2" />
          <rect x={x + 5} y="245" width="10" height="10" rx="1" fill={W} stroke={K.navy} strokeWidth="1.5" />
          <Arrow x={x + 14} y={306} r={90} s={8} c={K.navy} />
        </g>
      ))}

      {/* hot: heater outlets (paper halo hops the cold manifold), header, mixing valve, building */}
      <Pipe d="M256 232V128M346 232V128" c={K.paper} w={10} />
      <Pipe d="M256 232V128H420M346 232V128M440 128H470V40" c={K.hot} />
      <Dot x={346} y={128} c={K.hot} />
      <Valve x={256} y={180} r={90} />
      <Valve x={346} y={180} r={90} />
      <circle cx="430" cy="128" r="11" fill={W} stroke={K.navy} strokeWidth="1.75" />
      <path d="M424 134L436 122M430 128V138" fill="none" stroke={K.navy} strokeWidth="1.5" />
      <Txt x={446} y={176} size={12} weight={600}>Mixing valve</Txt>
      <Txt x={470} y={26} size={12} weight={700} anchor="middle" fill={K.hot}>Hot to building</Txt>
      <Arrow x={470} y={40} r={-90} c={K.hot} s={9} />

      {/* recirculation return, pump, check valve */}
      <Pipe d="M540 70V316H358" c={K.hot} w={4} dash={DASH.recirc} />
      <Arrow x={540} y={78} r={90} c={K.hot} s={9} />
      <circle cx="490" cy="316" r="11" fill={W} stroke={K.navy} strokeWidth="1.75" />
      <path d="M494 309L485 316L494 323Z" fill={K.navy} stroke="none" />
      <Check x={420} y={316} r={180} />
      <Txt x={490} y={296} size={12} weight={700} anchor="middle">P-1</Txt>
      <Txt x={548} y={96} size={12} weight={700} fill={K.hot}>Recirculation</Txt>
      <Txt x={548} y={112} size={12} weight={700} fill={K.hot}>return</Txt>

      {/* legend */}
      <LegendLine x={32} y={382} c={K.cold} label="Cold water" />
      <LegendLine x={170} y={382} c={K.hot} label="Hot water" />
      <LegendLine x={300} y={382} c={K.hot} label="Recirculation" w={4} dash={DASH.recirc} />
      <rect x="436" y="376" width="10" height="10" rx="1" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <path d="M441 386V392" stroke={K.navy} strokeWidth="2" />
      <Txt x={456} y={387} size={13} halo={null}>{"T&P relief valve"}</Txt>
    </Frame>
  );
}
