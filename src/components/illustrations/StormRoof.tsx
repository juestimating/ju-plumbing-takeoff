import { Arrow, Frame, K, LegendLine, Pipe, Txt } from "./parts";

const W = K.white;

/** Roof drain in section: sump, strainer dome, optional raised collar for the overflow drain. */
function Drain({ x, y, collar = 0 }: { x: number; y: number; collar?: number }) {
  const top = y - collar;
  return (
    <g fill={W} stroke={K.navy} strokeWidth="1.75">
      <path d={`M${x - 15} ${y}L${x - 10} ${y + 16}H${x + 10}L${x + 15} ${y}`} />
      <path d={`M${x - 5} ${y + 16}V${y + 24}H${x + 5}V${y + 16}`} />
      {collar > 0 && <path d={`M${x - 13} ${y}V${top}M${x + 13} ${y}V${top}`} />}
      <path d={`M${x - 13} ${top}A13 9 0 0 1 ${x + 13} ${top}Z`} />
    </g>
  );
}

/** Roof section: primary roof drain with leader and horizontal storm, overflow drain with its own line, cleanout. */
export function StormRoof({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Roof drain and storm leader"
      desc="Section through a roof. The roof slopes to a roof drain whose pipe drops through the deck, runs horizontally in the ceiling space and turns down a vertical leader with a cleanout at its base. A separate overflow drain with a raised inlet has its own line to a visible outlet."
    >
      {/* roof deck, parapets, walls, ceiling, floor */}
      <path d="M70 108L190 124L548 104V120L190 140L70 124Z" fill={K.pale} stroke={K.navy} strokeWidth="2" />
      <rect x="62" y="84" width="12" height="40" fill={W} stroke={K.navy} strokeWidth="2" />
      <rect x="542" y="80" width="12" height="40" fill={W} stroke={K.navy} strokeWidth="2" />
      <path d="M68 124V340M548 120V340" stroke={K.navy} strokeWidth="2.5" fill="none" />
      <path d="M68 202H548" stroke={K.mut} strokeWidth="1.5" strokeDasharray="7 5" strokeLinecap="butt" fill="none" />
      <path d="M40 340H616" stroke={K.navy} strokeWidth="3" fill="none" />
      <Txt x={80} y={196} size={12} weight={500} fill={K.mut}>Ceiling</Txt>
      <Txt x={80} y={332} size={12} weight={500} fill={K.mut}>Floor</Txt>

      {/* slope to drain */}
      <Arrow x={404} y={98} r={183} c={K.mut} s={8} />
      <Txt x={420} y={94} size={12} weight={500} fill={K.mut}>Slope to drain</Txt>

      {/* overflow line (own path, dashed) */}
      <g data-layer="overflow">
        <Pipe d="M330 140V156H588V186" c={K.storm} dash="12 6" />
        <Arrow x={588} y={194} r={90} c={K.storm} s={9} />
      </g>
      {/* primary leader and horizontal storm, cleanout at the base of the leader, roof drain */}
      <g data-layer="storm">
        <Pipe d="M190 148V170H500V362H600" c={K.storm} />
        <Arrow x={616} y={362} c={K.storm} s={9} />
        <path d="M500 316H486" stroke={K.storm} strokeWidth="4" fill="none" />
        <circle cx="481" cy="316" r="5" fill={W} stroke={K.navy} strokeWidth="1.75" />
        <Drain x={190} y={124} />
      </g>
      <g data-layer="overflow">
        <Drain x={330} y={116} collar={8} />
      </g>

      {/* labels */}
      <Txt x={190} y={96} size={12} weight={700} anchor="middle" layer="storm">RD-1 roof drain</Txt>
      <g data-layer="overflow">
        <Txt x={330} y={84} size={12} weight={700} anchor="middle">OD-1 overflow drain</Txt>
        <Txt x={402} y={150} size={12} weight={600} fill={K.storm}>Overflow line</Txt>
        <Txt x={632} y={212} size={12} weight={600} fill={K.storm} anchor="end">Overflow</Txt>
        <Txt x={632} y={228} size={12} weight={600} fill={K.storm} anchor="end">outlet</Txt>
      </g>
      <g data-layer="storm">
        <Txt x={290} y={190} size={12} weight={600} fill={K.storm}>Horizontal storm</Txt>
        <Txt x={490} y={262} size={12} weight={600} fill={K.storm} anchor="end">Vertical leader</Txt>
        <Txt x={474} y={304} size={12} weight={700} anchor="end">Cleanout</Txt>
        <Txt x={606} y={355} size={12} weight={600} fill={K.storm} anchor="end">To storm sewer</Txt>
      </g>

      {/* legend */}
      <LegendLine x={32} y={384} c={K.storm} label="Primary storm" layer="storm" />
      <LegendLine x={190} y={384} c={K.storm} label="Overflow, separate line" dash="12 6" layer="overflow" />
    </Frame>
  );
}
