import { Arrow, DASH, Dot, Frame, K, LegendLine, Pipe, Txt, Walls } from "./parts";
import { Fd, Lav, Ur, WC } from "./symbols";

const W = K.white;
const S = 1.5;
const TAGS: [string, string][] = [
  ["WC-1", "Water closet"],
  ["WC-2", "Accessible WC"],
  ["UR-1", "Urinal"],
  ["LAV-1", "Lavatory"],
  ["FD-1", "Floor drain"],
];

/** Commercial restroom: four water closet stalls (one accessible), two urinals, three lavatories, floor drain. */
export function RestroomPlan({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Commercial restroom plumbing plan"
      desc="Plan of a commercial restroom with four water closet stalls including one accessible stall, two urinals, three lavatories and a floor drain. Tags label each fixture. Cold supply is blue, hot red, waste brown and vent green dashed."
    >
      <Txt x={32} y={32} size={14} weight={700}>Commercial restroom plumbing plan</Txt>

      {/* floor, walls, plumbing chase, door */}
      <rect x="36" y="60" width="408" height="222" fill={W} />
      <rect x="36" y="270" width="408" height="12" fill={K.pale} stroke={K.navy} strokeWidth="1.25" />
      <Walls d="M32 160V56H448V286H32V184" />
      <rect x="26" y="160" width="12" height="24" fill={W} />
      <path d="M26 160H38M26 184H38" stroke={K.navy} strokeWidth="2" strokeLinecap="butt" />
      <path d="M36 160H60" stroke={K.navy} strokeWidth="1.5" />
      <path d="M60 160A24 24 0 0 1 36 184" fill="none" stroke={K.mut} strokeWidth="1" />
      <path d="M102 60V134M168 60V134M234 60V134M340 60V134" stroke={K.navy} strokeWidth="1.75" strokeLinecap="butt" />

      {/* fixtures */}
      <WC x={69} y={60} s={S} />
      <WC x={135} y={60} s={S} />
      <WC x={201} y={60} s={S} />
      <WC x={266} y={60} s={S} />
      <Ur x={444} y={122} r={90} s={S} />
      <Ur x={444} y={162} r={90} s={S} />
      <Fd x={330} y={190} s={S} />
      <Lav x={296} y={270} r={180} s={S} />
      <Lav x={354} y={270} r={180} s={S} />
      <Lav x={412} y={270} r={180} s={S} />

      {/* waste and vent */}
      <Pipe d="M69 87H416V254H236M416 122H430M416 162H430M340 190H416" c={K.waste} />
      <Pipe d="M69 112H359M69 87V112M135 87V112M201 87V112M266 87V112" c={K.vent} dash={DASH.vent} />
      <circle cx="367" cy="112" r="6.5" fill={W} stroke={K.vent} strokeWidth="2.5" />
      <Txt x={367} y={102} size={12} anchor="middle" halo={null}>Vent up</Txt>
      <circle cx="236" cy="254" r="7" fill={W} stroke={K.waste} strokeWidth="2.5" />
      <Dot x={236} y={254} c={K.waste} />
      <Txt x={236} y={240} size={12} anchor="middle" halo={W}>Stack</Txt>

      {/* hot, then cold (cold runs in the wall behind the closets and urinals) */}
      <Pipe d="M262 312V279.5H412" c={K.hot} />
      <Pipe d="M454 56H48M448 56V273.5H284" c={K.cold} />
      <Dot x={448} y={56} c={K.cold} />
      <Arrow x={454} y={56} r={180} c={K.cold} s={8} />
      <Arrow x={262} y={292} r={-90} c={K.hot} s={8} />
      <Txt x={462} y={78} size={12} weight={600} fill={K.cold}>Cold in</Txt>
      <Txt x={274} y={312} size={12} weight={600} fill={K.hot}>Hot in</Txt>

      {/* fixture tags */}
      <Txt x={69} y={152} size={12} anchor="middle" halo={W}>WC-1</Txt>
      <Txt x={135} y={152} size={12} anchor="middle" halo={W}>WC-1</Txt>
      <Txt x={201} y={152} size={12} anchor="middle" halo={W}>WC-1</Txt>
      <Txt x={287} y={152} size={12} anchor="middle" halo={W}>WC-2</Txt>
      <Txt x={406} y={127} size={12} anchor="end" halo={W}>UR-1</Txt>
      <Txt x={406} y={167} size={12} anchor="end" halo={W}>UR-1</Txt>
      <Txt x={330} y={214} size={12} anchor="middle" halo={W}>FD-1</Txt>
      <Txt x={296} y={236} size={12} anchor="middle" halo={W}>LAV-1</Txt>
      <Txt x={354} y={236} size={12} anchor="middle" halo={W}>LAV-1</Txt>
      <Txt x={412} y={236} size={12} anchor="middle" halo={W}>LAV-1</Txt>

      {/* tag legend */}
      <rect x="468" y="100" width="152" height="150" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={482} y={122} size={14} weight={800} halo={null}>Fixture tags</Txt>
      {TAGS.map(([tag, name], i) => (
        <g key={tag}>
          <Txt x={482} y={146 + i * 20} size={12} weight={800} halo={null}>{tag}</Txt>
          <Txt x={528} y={146 + i * 20} size={12} weight={500} fill={K.mut} halo={null}>{name}</Txt>
        </g>
      ))}

      {/* system legend */}
      <LegendLine x={32} y={344} c={K.cold} label="Cold water" />
      <LegendLine x={170} y={344} c={K.hot} label="Hot water" />
      <LegendLine x={300} y={344} c={K.waste} label="Waste" />
      <LegendLine x={398} y={344} c={K.vent} label="Vent" dash={DASH.vent} />
      <Txt x={32} y={376} size={12} weight={500} fill={K.mut} halo={null}>Tags vary by project: read the drawing legend.</Txt>
    </Frame>
  );
}
