import { Arrow, Dot, Frame, K, LegendLine, Pipe, Txt, Valve, Walls } from "./parts";
import { ringPath } from "./symbols";

const W = K.white;
const BEDS = [140, 332, 520];
const GASES: [string, number][] = [["O2", -26], ["AIR", 0], ["VAC", 26]];
const OUTLETS = BEDS.flatMap((c) => GASES.map(([, dx]) => ringPath(c + dx, 66, 4.5))).join("");

/** Corridor with a zone valve box and alarm panel serving patient rooms with headwall outlets. */
export function MedicalGasZone({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Medical gas zone valve box and outlets"
      desc="Plan of a hospital corridor with three patient rooms. A medical gas main runs along the corridor through a zone valve box, with branches to a headwall in each room carrying oxygen, medical air and vacuum outlets. An area alarm panel is on the corridor wall. Each gas has its own pipe and valve, and the plan draws the three as one line and one valve."
    >
      <Txt x={32} y={24} size={14} weight={700}>Medical gas zone: corridor and patient rooms</Txt>

      {/* floor, walls, doors */}
      <rect x="48" y="60" width="560" height="212" fill={W} />
      <Walls d="M44 56H612V276H44ZM44 176H56M82 176H248M274 176H440M466 176H612M236 56V176M428 56V176" />
      <path d="M56 170H82V182H56ZM248 170H274V182H248ZM440 170H466V182H440Z" fill={W} stroke="none" />
      <path d="M56 170V182M82 170V182M248 170V182M274 170V182M440 170V182M466 170V182" stroke={K.navy} strokeWidth="2" strokeLinecap="butt" />
      <path d="M56 174V148M248 174V148M440 174V148" stroke={K.navy} strokeWidth="1.5" />
      <path d="M56 148A26 26 0 0 1 82 174M248 148A26 26 0 0 1 274 174M440 148A26 26 0 0 1 466 174" fill="none" stroke={K.mut} strokeWidth="1" />

      {/* beds, headwalls, outlets */}
      {BEDS.map((c, i) => (
        <g key={c}>
          <rect x={c - 24} y={64} width={48} height={76} rx={3} fill={W} stroke={K.navy} strokeWidth="1.5" />
          <rect x={c - 18} y={68} width={36} height={14} rx={3} fill={W} stroke={K.navy} strokeWidth="1" />
          <rect data-layer="outlet" x={c - 42} y={60} width={84} height={12} rx={2} fill={K.pale} stroke={K.navy} strokeWidth="1.25" />
          {GASES.map(([name, dx]) => (
            <Txt key={name} x={c + dx} y={46} size={12} weight={700} anchor="middle" layer="outlet">{name}</Txt>
          ))}
          <Txt x={c + 14} y={162} size={12} weight={500} fill={K.mut} anchor="middle" halo={W}>Room {101 + i}</Txt>
        </g>
      ))}
      <path data-layer="outlet" d={OUTLETS} fill={W} stroke={K.med} strokeWidth="2.25" />

      {/* medical gas main and branches */}
      <g data-layer="pipe">
        <Pipe d="M26 200H606M108 200V66H166M300 200V66H358M492 200V66H550" c={K.med} w={5} />
        <Arrow x={44} y={200} c={K.med} s={9} />
        <Dot x={108} y={200} c={K.med} />
        <Dot x={300} y={200} c={K.med} />
        <Dot x={492} y={200} c={K.med} />
        <Txt x={52} y={254} size={12} weight={600} halo={W}>From source</Txt>
      </g>

      {/* zone valve box and alarm panel */}
      <g data-layer="zvb">
        <rect x="54" y="186" width="40" height="28" rx="2" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <Valve x={74} y={200} />
        <Txt x={74} y={232} size={12} weight={700} anchor="middle" halo={W}>ZVB-1</Txt>
      </g>
      <g data-layer="alarm">
        <rect x="316" y="254" width="48" height="18" rx="2" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <circle cx="328" cy="263" r="3" fill={K.amber} stroke={K.navy} strokeWidth="1" />
        <circle cx="340" cy="263" r="3" fill={K.med} stroke="none" />
        <circle cx="352" cy="263" r="3" fill={K.med} stroke="none" />
        <Txt x={340} y={248} size={12} weight={700} anchor="middle" halo={W}>Alarm panel</Txt>
      </g>

      {/* legend */}
      <LegendLine x={32} y={326} c={K.med} label="Medical gas pipe" w={5} len={24} layer="pipe" />
      <g data-layer="outlet">
        <path d={ringPath(224, 326, 5)} fill={W} stroke={K.med} strokeWidth="2.25" />
        <Txt x={238} y={331} size={13} halo={null}>Outlet</Txt>
      </g>
      <g data-layer="zvb">
        <rect x="312" y="319" width="22" height="14" rx="2" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <Txt x={342} y={331} size={13} halo={null}>Zone valve box</Txt>
      </g>
      <g data-layer="alarm">
        <rect x="456" y="319" width="22" height="14" rx="2" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <Txt x={486} y={331} size={13} halo={null}>Alarm panel</Txt>
      </g>
      <Txt x={32} y={366} size={12} weight={500} fill={K.mut} halo={null}>O2 oxygen, AIR medical air, VAC vacuum. Outlets by room type come from the drawings.</Txt>
      <Txt x={32} y={384} size={12} weight={500} fill={K.mut} halo={null}>Each line stands for three pipes and the valve for three valves, one per gas.</Txt>
    </Frame>
  );
}
