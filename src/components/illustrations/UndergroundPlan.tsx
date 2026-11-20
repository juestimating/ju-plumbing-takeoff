import { Arrow, Dot, Frame, K, Pipe, Txt, Valve } from "./parts";
import { Co, Fd } from "./symbols";

const W = K.white;
const BAND = { a: "#fdf0c4", b: "#fbd96b", c: "#f5b400" } as const;

/** Trench band: a wide tinted stroke under a pipe run, tinted by depth band. */
function Trench({ d, c }: { d: string; c: string }) {
  return <path d={d} fill="none" stroke={c} strokeWidth="18" strokeLinecap="butt" />;
}

/** Site plan: building footprint with water service, sanitary lateral to a manhole and a storm line. */
export function UndergroundPlan({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Underground plumbing plan"
      desc="Site plan with a building footprint. A water service with a curb stop and meter comes from the water main, a sanitary lateral runs south to a manhole in the sewer main, and a storm line leaves the east side. Trench shading shows three depth bands and labels give inverts."
    >
      {/* property line */}
      <rect x="64" y="62" width="520" height="262" fill="none" stroke={K.mut} strokeWidth="1.25" strokeDasharray="8 5" strokeLinecap="butt" />
      <Txt x={72} y={78} size={12} weight={500} fill={K.mut}>Property line</Txt>

      {/* trench depth bands (under the pipes) */}
      <g data-layer="depth">
        <Trench d="M230 30V112" c={BAND.a} />
        <Trench d="M330 228V276" c={BAND.a} />
        <Trench d="M330 276V326" c={BAND.b} />
        <Trench d="M330 326V360" c={BAND.c} />
        <Trench d="M470 190H616" c={BAND.a} />
      </g>

      {/* building footprint and under-slab piping */}
      <rect x="190" y="100" width="280" height="128" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={330} y={128} size={13} anchor="middle" halo={W}>Building</Txt>
      <g data-layer="sanitary">
        <Pipe d="M262 160H330V228M330 190H296" c={K.waste} />
        <Fd x={262} y={160} />
        <Fd x={296} y={190} />
        <Txt x={204} y={186} size={12} weight={500} fill={K.mut} halo={W}>Under-slab</Txt>
      </g>

      {/* water main and service */}
      <g data-layer="water">
        <Pipe d="M24 30H616" c={K.cold} w={5} />
        <Txt x={28} y={22} size={12} weight={700} fill={K.cold}>8 in. water main</Txt>
        <Pipe d="M230 30V112" c={K.cold} w={4.5} />
        <Dot x={230} y={30} c={K.cold} />
        <Valve x={230} y={68} r={90} />
        <circle cx="230" cy="86" r="9" fill={W} stroke={K.navy} strokeWidth="1.5" />
        <Txt x={230} y={90} size={12} weight={800} anchor="middle" halo={null}>M</Txt>
        <Txt x={246} y={50} size={12} weight={700} fill={K.cold}>2 in. water service</Txt>
        <Txt x={244} y={72} size={12}>Curb stop</Txt>
        <Txt x={244} y={90} size={12}>Meter</Txt>
      </g>

      {/* sanitary lateral and sewer main */}
      <g data-layer="sanitary">
        <Pipe d="M24 360H616" c={K.waste} w={5} />
        <Txt x={28} y={350} size={12} weight={700} fill={K.waste}>8 in. sanitary sewer</Txt>
        <Pipe d="M330 228V360" c={K.waste} />
        <Co x={330} y={290} />
        <circle cx="330" cy="360" r="11" fill={W} stroke={K.navy} strokeWidth="2" />
        <circle cx="330" cy="360" r="5" fill="none" stroke={K.navy} strokeWidth="1.25" />
        <Txt x={344} y={352} size={12} weight={800}>SMH-1</Txt>
        <Txt x={344} y={246} size={12} weight={700} fill={K.waste}>INV 94.20</Txt>
        <Txt x={344} y={285} size={12} weight={700} fill={K.waste}>6 in. lateral</Txt>
        <Txt x={344} y={336} size={12} weight={700} fill={K.waste}>INV 90.40</Txt>
      </g>

      {/* storm line */}
      <g data-layer="storm">
        <Pipe d="M470 190H616" c={K.storm} />
        <rect x="513" y="183" width="14" height="14" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <Txt x={520} y={172} size={12} weight={700} fill={K.storm} anchor="middle">8 in. storm</Txt>
        <Txt x={520} y={214} size={12} anchor="middle">CB-1</Txt>
        <Arrow x={624} y={190} c={K.storm} s={9} />
        <Txt x={612} y={238} size={12} anchor="end">To storm main</Txt>
      </g>

      {/* trench depth legend */}
      <g data-layer="depth">
        <Txt x={24} y={392} size={12} weight={700} halo={null}>Trench depth</Txt>
        {([["0–4 ft", BAND.a, 118], ["4–8 ft", BAND.b, 208], ["8–12 ft", BAND.c, 302]] as const).map(([label, c, x]) => (
          <g key={label}>
            <rect x={x} y={381} width="26" height="14" fill={c} stroke={K.navy} strokeWidth="1" />
            <Txt x={x + 34} y={392} size={12} weight={500} fill={K.mut} halo={null}>{label}</Txt>
          </g>
        ))}
      </g>
    </Frame>
  );
}
