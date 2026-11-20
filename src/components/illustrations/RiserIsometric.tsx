import { Arrow, Check, DASH, Dot, Frame, K, LegendLine, Pipe, Txt, Valve } from "./parts";

const W = K.white;
// Slab elevations (y) and the riser size at each cold tee, from the ground floor up.
const FLOORS: [number, number, string, string][] = [
  [300, 1, "2 in.", "Level 1"],
  [232, 2, "1-1/2 in.", "Level 2"],
  [164, 3, "1-1/4 in.", "Level 3"],
  [96, 4, "1 in.", "Level 4"],
];
const COLD_X = 128;
const HOT_X = 340;
const RET_X = 420;

/** Four-story domestic water riser: cold and hot risers, a recirculation loop, branches to restroom groups. */
export function RiserIsometric({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Domestic water riser diagram"
      desc="Riser diagram of a four-story building. A cold water riser on the left and a hot water riser on the right feed a restroom group on each level through valved branches. The hot riser loops back down as a recirculation return to a pump and the water heater."
    >
      {/* slabs and level labels */}
      <path d="M100 30H470" stroke={K.mut} strokeWidth="2" strokeDasharray="8 5" strokeLinecap="butt" fill="none" />
      <Txt x={24} y={34} size={12} weight={600} fill={K.mut}>Roof</Txt>
      {FLOORS.map(([y, , , label]) => (
        <g key={label}>
          <path d={`M100 ${y}H470`} stroke={K.navy} strokeWidth="3" fill="none" />
          <Txt x={24} y={y - 6} size={13} weight={700}>{label}</Txt>
          <rect x="190" y={y - 50} width="100" height="40" rx="4" fill={W} stroke={K.navy} strokeWidth="1.5" />
          <Txt x={240} y={y - 26} size={12} weight={600} anchor="middle" halo={W}>Restroom group</Txt>
        </g>
      ))}

      {/* recirculation return (dashed) with pump and check valve */}
      <g data-layer="return">
        <Pipe d={`M${HOT_X} 54H${RET_X}V336H362`} c={K.hot} w={4} dash={DASH.recirc} />
        <circle cx="396" cy="336" r="9" fill={W} stroke={K.navy} strokeWidth="1.5" />
        <path d="M392 331L402 336L392 341Z" fill={K.navy} stroke="none" transform="rotate(180 397 336)" />
        <Check x={374} y={336} r={180} />
        <Txt x={396} y={318} size={12} weight={700} anchor="middle">P-1</Txt>
      </g>

      {/* hot riser and branches */}
      <Pipe d={`M${HOT_X} 308V54M${HOT_X} 276H290M${HOT_X} 208H290M${HOT_X} 140H290M${HOT_X} 72H290`} c={K.hot} w={5} layer="hot" />
      {/* cold riser, branches and the feed to the heater */}
      <Pipe d={`M24 336H318M${COLD_X} 336V56M${COLD_X} 264H190M${COLD_X} 196H190M${COLD_X} 128H190M${COLD_X} 60H190`} c={K.cold} w={5} layer="cold" />
      {/* tees, branch valves and riser sizes (cold and hot parts never overlap, so each pair groups by layer) */}
      {FLOORS.map(([y, , size]) => (
        <g key={y}>
          <g data-layer="cold">
            <Dot x={COLD_X} y={y - 36} c={K.cold} />
            <Valve x={152} y={y - 36} />
            <Txt x={COLD_X - 10} y={y - 32} size={12} weight={600} fill={K.cold} anchor="end">{size} riser</Txt>
          </g>
          <g data-layer="hot">
            <Dot x={HOT_X} y={y - 24} c={K.hot} />
            <Valve x={315} y={y - 24} />
          </g>
        </g>
      ))}
      <g data-layer="cold">
        <Dot x={COLD_X} y={336} c={K.cold} />
        <Valve x={COLD_X} y={312} r={90} />
      </g>
      <g data-layer="hot">
        <Valve x={HOT_X} y={290} r={90} />
      </g>

      {/* water heater in the mechanical level below */}
      <rect x="318" y="308" width="44" height="56" rx="7" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={340} y={330} size={12} weight={800} anchor="middle" halo={W}>WH-1</Txt>

      {/* service entry: meter and backflow preventer, on the cold layer */}
      <g data-layer="cold">
        <Arrow x={36} y={336} c={K.cold} s={9} />
        <Valve x={52} y={336} />
        <circle cx="74" cy="336" r="9" fill={W} stroke={K.navy} strokeWidth="1.5" />
        <Txt x={74} y={340} size={12} weight={800} anchor="middle" halo={null}>M</Txt>
        <rect x="88" y="327" width="26" height="18" rx="2" fill={W} stroke={K.navy} strokeWidth="1.5" />
        <path d="M96 332L102 336L96 340ZM108 331V341" fill="none" stroke={K.navy} strokeWidth="1.25" />
        <Txt x={74} y={358} size={12} weight={600} anchor="middle">Meter</Txt>
        <Txt x={101} y={376} size={12} weight={600} anchor="middle">Backflow preventer</Txt>
      </g>

      {/* legend */}
      <rect x="492" y="40" width="130" height="190" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <LegendLine x={502} y={66} c={K.cold} label="Cold water" w={5} len={20} layer="cold" />
      <LegendLine x={502} y={98} c={K.hot} label="Hot water" w={5} len={20} layer="hot" />
      <LegendLine x={502} y={130} c={K.hot} label="Return" w={4} len={20} dash={DASH.recirc} layer="return" />
      <Valve x={512} y={162} />
      <Txt x={530} y={167} size={13} halo={null}>Valve</Txt>
      <Check x={512} y={196} />
      <Txt x={530} y={201} size={13} halo={null}>Check valve</Txt>
    </Frame>
  );
}
