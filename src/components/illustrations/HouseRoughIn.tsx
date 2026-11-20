import { Arrow, Dot, Frame, K, LegendLine, Pipe, Txt, Walls } from "./parts";
import { Co, Lav, Shower, Sink, Tub, Washer, WC, Wh } from "./symbols";

const W = K.white;
const ROOMS: [number, string][] = [[92, "Bath 1"], [217, "Bath 2"], [337, "Kitchen"], [428, "Laundry"]];

/** Residential rough-in: kitchen, two baths, laundry, water heater, PEX manifold with home runs, under-slab drains. */
export function HouseRoughIn({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Residential plumbing rough-in plan"
      desc="Plan of a house with two baths, a kitchen and a laundry. A PEX manifold sends a cold and a hot line to each room. Under-slab drains collect the fixtures and leave the house through a cleanout."
    >
      <Txt x={32} y={26} size={14} weight={700}>Residential rough-in plan</Txt>
      {ROOMS.map(([x, name]) => (
        <Txt key={name} x={x} y={45} size={12} weight={600} fill={K.mut} anchor="middle">{name}</Txt>
      ))}

      {/* floor and walls (gaps in the lower wall of the wet rooms carry the PEX) */}
      <rect x="36" y="60" width="424" height="198" fill={W} />
      <Walls d="M32 56H464V262H32ZM152 56V158M282 56V158M392 56V158M32 158H64M84 158H190M210 158H326M346 158H406M454 158H464" />
      <path d="M64 154V162M84 154V162M190 154V162M210 154V162M326 154V162M346 154V162M406 154V162M454 154V162" stroke={K.navy} strokeWidth="2" strokeLinecap="butt" />
      <Txt x={44} y={246} size={12} weight={500} fill={K.mut} halo={W}>Living and bedrooms not shown</Txt>

      {/* fixtures along the north wall */}
      <Shower x={56} y={60} />
      <WC x={96} y={60} />
      <Lav x={130} y={60} />
      <Tub x={186} y={60} />
      <WC x={234} y={60} />
      <Lav x={262} y={60} />
      <Sink x={314} y={60} />
      <rect x="342" y="60" width="24" height="24" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={354} y={76} size={12} weight={700} anchor="middle" halo={null}>DW</Txt>
      <Washer x={418} y={60} />
      <Wh x={440} y={124} r={13} />

      {/* under-slab drains: one main with a branch to each fixture (the dishwasher discharges through the kitchen sink) */}
      <Pipe d="M56 100H478M56 94V100M96 90V100M130 79V100M186 88V100M234 90V100M262 79V100M314 80V100M418 88V100" c={K.waste} />
      <Co x={478} y={100} />
      <Arrow x={506} y={100} c={K.waste} s={9} />
      <Txt x={474} y={86} size={12} anchor="middle" halo={K.paper}>CO</Txt>
      <Txt x={474} y={124} size={12} weight={600} fill={K.waste} halo={K.paper}>To sewer</Txt>

      {/* manifold with home runs (cold and hot pairs peel off toward each room) */}
      <Pipe d="M278 172H196V118M278 186H70V118M322 172H350V118M322 186H412V118" c={K.cold} w={3.5} />
      <Pipe d="M278 179H204V118M278 193H78V118M322 179H358V118M322 193H420V118" c={K.hot} w={3.5} />
      {[196, 70, 350, 412].map((x) => <Dot key={x} x={x} y={118} c={K.cold} />)}
      {[204, 78, 358, 420].map((x) => <Dot key={x} x={x} y={118} c={K.hot} />)}

      {/* trunk lines: cold from the service, hot from the heater */}
      <Pipe d="M292 275V200M292 228H447V137" c={K.cold} w={5} />
      <Pipe d="M435 137V215H308V200" c={K.hot} w={5} />
      <Dot x={292} y={228} c={K.cold} />
      <Arrow x={292} y={266} r={-90} c={K.cold} s={8} />
      <Txt x={304} y={284} size={12} weight={600} fill={K.cold}>Cold in</Txt>
      <rect x="278" y="166" width="44" height="34" rx="3" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={300} y={187} size={12} weight={800} anchor="middle" halo={null}>MF-1</Txt>

      {/* legend */}
      <LegendLine x={32} y={322} c={K.cold} label="Cold water" len={24} />
      <LegendLine x={150} y={322} c={K.hot} label="Hot water" len={24} />
      <LegendLine x={262} y={322} c={K.waste} label="Under-slab drain" len={24} />
      <rect x="419" y="314" width="22" height="16" rx="2" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={449} y={327} size={13} halo={null}>PEX manifold</Txt>
      <Wh x={558} y={322} r={9} />
      <Txt x={574} y={327} size={13} halo={null}>Heater</Txt>
      <Txt x={32} y={364} size={12} weight={500} fill={K.mut} halo={null}>Trunk lines are heavier. One cold and one hot line serve each room.</Txt>
      <Txt x={32} y={380} size={12} weight={500} fill={K.mut} halo={null}>A full home-run layout runs a separate line to every fixture.</Txt>
    </Frame>
  );
}
