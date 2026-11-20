import { Arrow, DASH, Dot, Frame, K, LegendLine, Pipe, Txt, Valve } from "./parts";

const W = K.white;

/** Sediment trap (drip leg): a capped stub hanging below the line. */
function DripLeg({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Pipe d={`M${x} ${y}V${y + 18}`} c={K.gas} w={4.5} />
      <path d={`M${x - 5} ${y + 22}H${x + 5}`} stroke={K.navy} strokeWidth="3" fill="none" />
    </g>
  );
}

/** Gas piping schematic: service, meter, regulator, shutoffs, header, branches with drip legs to RTU, heater and range. */
export function GasManifold({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Gas piping, regulator and meter"
      desc="Schematic of fuel gas piping. The gas service rises from underground through a shutoff valve, meter and regulator to a main shutoff and a header. Branches with shutoff valves and drip legs serve a rooftop unit, a water heater and a range."
    >
      {/* ground and roof */}
      <rect x="0" y="324" width="640" height="76" fill={K.pale} />
      <path d="M24 324H616" stroke={K.navy} strokeWidth="3" fill="none" />
      <path d="M300 116H616" stroke={K.navy} strokeWidth="3" fill="none" />
      <Txt x={32} y={316} size={12} weight={500} fill={K.mut}>Grade</Txt>
      <Txt x={550} y={134} size={12} weight={500} fill={K.mut}>Roof</Txt>

      {/* gas piping: the underground service (dashed) and the aboveground fuel gas */}
      <Pipe d="M24 356H70V324" c={K.gas} w={4.5} dash="9 5" layer="buried" />
      <Pipe d="M70 324V196H560V250M330 196V84H450M410 196V290H430" c={K.gas} w={4.5} layer="gas" />
      <g data-layer="gas">
        <Dot x={330} y={196} c={K.gas} />
        <Dot x={410} y={196} c={K.gas} />
      </g>
      <g data-layer="buried">
        <Arrow x={34} y={356} c={K.gas} s={9} />
      </g>

      {/* appliances */}
      <rect x="450" y="54" width="110" height="62" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={505} y={90} size={13} weight={800} anchor="middle" halo={W}>RTU-1</Txt>
      <rect x="430" y="250" width="54" height="74" rx="8" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={457} y={292} size={13} weight={800} anchor="middle" halo={W}>WH-1</Txt>
      <rect x="528" y="268" width="80" height="56" rx="3" fill={W} stroke={K.navy} strokeWidth="2" />
      <path d="M528 284H608" stroke={K.navy} strokeWidth="1.25" fill="none" />
      <path d="M544 276h0M568 276h0M592 276h0" stroke={K.navy} strokeWidth="6" fill="none" />
      <Txt x={568} y={310} size={13} weight={800} anchor="middle" halo={W}>Range</Txt>
      <path d="M560 250V268" stroke={K.navy} strokeWidth="2" strokeDasharray="3 3" strokeLinecap="butt" fill="none" />

      {/* meter and regulator */}
      <rect x="104" y="174" width="56" height="44" rx="5" fill={W} stroke={K.navy} strokeWidth="2" />
      <circle cx="132" cy="196" r="10" fill="none" stroke={K.navy} strokeWidth="1.5" />
      <path d="M132 196L137 191" stroke={K.navy} strokeWidth="1.5" fill="none" />
      <g data-layer="gas" transform="translate(206 196)">
        <path d="M-6-5V5L6-5V5Z" fill={W} stroke={K.navy} strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M0 0V-10M-9-10A9 7 0 0 1 9-10Z" fill={W} stroke={K.navy} strokeWidth="1.5" />
        <path d="M0-17V-26Q0-30 4-30" fill="none" stroke={K.navy} strokeWidth="1.5" />
      </g>

      {/* shutoff valves and drip legs (on the fuel gas layer, as the pipe under them) */}
      <g data-layer="gas">
        <Valve x={70} y={284} r={90} />
        <Valve x={262} y={196} />
        <Valve x={330} y={150} r={90} />
        <Valve x={410} y={236} r={90} />
        <Valve x={560} y={224} r={90} />
        <Valve x={430} y={84} />
        <DripLeg x={390} y={84} />
        <DripLeg x={410} y={290} />
      </g>

      {/* labels (the meter stays on every layer) */}
      <Txt x={84} y={350} size={12} weight={600} fill={K.gas} layer="buried">Service from utility main</Txt>
      <Txt x={82} y={288} size={12} weight={600} halo={K.paper} layer="gas">Service shutoff</Txt>
      <Txt x={132} y={234} size={12} weight={600} anchor="middle">Meter</Txt>
      <g data-layer="gas">
        <Txt x={206} y={232} size={12} weight={600} anchor="middle">Regulator</Txt>
        <Txt x={262} y={178} size={12} weight={600} anchor="middle">Main shutoff</Txt>
        <Txt x={344} y={146} size={12} weight={700} fill={K.gas}>1 in.</Txt>
        <Txt x={272} y={214} size={12} weight={700} fill={K.gas}>1-1/4 in.</Txt>
        <Txt x={424} y={240} size={12} weight={700} fill={K.gas}>3/4 in.</Txt>
        <Txt x={568} y={228} size={12} weight={700} fill={K.gas}>1/2 in.</Txt>
        <Txt x={390} y={72} size={12} weight={600} anchor="middle">Drip leg</Txt>
      </g>

      {/* legend */}
      <LegendLine x={32} y={382} c={K.gas} label="Fuel gas" layer="gas" />
      <LegendLine x={150} y={382} c={K.gas} label="Underground" dash={DASH.vent} layer="buried" />
      <Txt x={296} y={387} size={12} weight={500} fill={K.mut} halo={null}>Sizes are examples only. Sizing is design work.</Txt>
    </Frame>
  );
}
