import type { CSSProperties, ReactNode } from "react";
import { Arrow, Badge, Check, DASH, DimH, Dot, K, Pipe, Txt, Valve, Walls } from "./parts";
import { Co, Fd, Lav, Sink, WC, Wh } from "./symbols";

/*
 * Decorative drawing strips for the guide cards, drafted with the illustration kit. Each is a wide 720 x 150 sheet
 * cropped to the card with preserveAspectRatio "slice": the mains run edge to edge, and the fixtures and fittings sit
 * in the middle (x 170 to 550), which stays in view at every card width. aria-hidden: the card text carries the meaning.
 * Each strip has one "flow" path along its main, which a card animates on hover (the class comes from the card).
 */
export type StripName = "fixtures" | "waste" | "heater" | "riser" | "sheet" | "cut" | "bid";

/** The strip each guide's cards show (home cards, guides hub, the guide's own hero card and Read next). The three home
 *  guides keep fixtures, waste and heater. */
export const GUIDE_ART: Record<string, StripName> = {
  "how-to-do-a-plumbing-takeoff": "fixtures",
  "plumbing-takeoff-vs-plumbing-estimate": "waste",
  "plumbing-takeoff-service-cost": "heater",
  "plumbing-takeoff-checklist": "waste",
  "how-to-estimate-a-plumbing-job": "sheet",
  "plumbing-takeoff-services-vs-software": "riser",
  "how-to-read-plumbing-plans": "riser",
  "plumbing-estimating-mistakes": "sheet",
  "plumbing-pipe-waste-and-fitting-allowances": "cut",
  "plumbing-bid-checklist": "bid",
  "plumbing-estimating-spreadsheet": "sheet",
};

/** Width in viewBox units, centred on x 360, that holds each strip's whole drawing (fixtures, documents, labels; the
 *  mains and their flow arrows bleed). A card that must show a strip uncut scales it so this span fits its band. */
export const STRIP_SPAN: Record<StripName, number> = { fixtures: 396, waste: 356, heater: 410, riser: 376, sheet: 376, cut: 448, bid: 388 };

const GRID = (() => {
  let d = "";
  for (let y = 20; y < 150; y += 20) d += `M0 ${y}H720`;
  for (let x = 20; x < 720; x += 20) d += `M${x} 0V150`;
  return d;
})();

const FLOW: Record<StripName, string> = {
  fixtures: "M0 108H720",
  waste: "M0 92H720",
  heater: "M272 58H720",
  riser: "M330 66V140H720",
  sheet: "M408 90H460V105H408Z",
  cut: "M165 48H400",
  bid: "M184 131H306",
};
/** Strips drawn on white or pale paper run a navy flow (a card's flow class reads `stroke: var(--flow-c, #fff)`). */
const FLOW_C: Partial<Record<StripName, string>> = { sheet: K.navy, cut: K.navy, bid: K.navy };

/** A check mark (the drawing kit's Check is a check valve). */
const ticks = (...at: [number, number][]) => at.map(([x, y]) => `M${x} ${y}l4 4 8-8`).join("");

/** Fixtures on a wall, fed by cold and hot water, with takeoff count badges. */
function FixturesArt({ flow }: { flow: ReactNode }) {
  return (
    <>
      <Walls d="M0 22H720" t={6} />
      <WC x={230} y={27} />
      <WC x={290} y={27} />
      <Lav x={376} y={27} />
      <Lav x={444} y={27} />
      <Sink x={524} y={27} />
      <Pipe d="M330 124H720" c={K.hot} w={3.5} />
      <Pipe d="M393 124V36M461 124V36M551 124V36" c={K.hot} w={3} />
      <Pipe d="M0 108H720" c={K.cold} w={4} />
      <Pipe d="M217 108V36M277 108V36M359 108V36M427 108V36M497 108V36" c={K.cold} w={3} />
      {flow}
      {[217, 277, 359, 427, 497].map((x) => (
        <Dot key={x} x={x} y={108} c={K.cold} />
      ))}
      {[393, 461, 551].map((x) => (
        <Dot key={x} x={x} y={124} c={K.hot} />
      ))}
      <Valve x={186} y={108} />
      <Badge x={260} y={78} n={2} />
      <Badge x={410} y={72} n={2} />
      <Badge x={524} y={72} n={1} />
    </>
  );
}

/** Floor drains on a waste main with a cleanout, vented with dashed lines. */
function WasteArt({ flow }: { flow: ReactNode }) {
  return (
    <>
      <Pipe d="M0 124H720" c={K.vent} w={3} dash={DASH.vent} />
      <Pipe d="M250 72H274V124M360 72H384V124M470 72H494V124" c={K.vent} w={3} dash={DASH.vent} />
      <Pipe d="M0 92H720" c={K.waste} w={5} />
      <Pipe d="M250 56V92M360 56V92M470 56V92" c={K.waste} w={3.5} />
      {flow}
      {[250, 360, 470].map((x) => (
        <g key={x}>
          <Dot x={x} y={92} c={K.waste} />
          <Fd x={x} y={50} />
        </g>
      ))}
      <Co x={198} y={92} />
      <Arrow x={580} y={92} c={K.navy} />
      <Badge x={524} y={50} n={3} />
    </>
  );
}

/** A water heater with an expansion tank, hot water out and a dashed recirculation return. */
function HeaterArt({ flow }: { flow: ReactNode }) {
  return (
    <>
      {/* runs end under the heater ring, which is drawn on top */}
      <Pipe d="M0 58H240" c={K.cold} w={4} />
      <Pipe d="M200 58V40" c={K.cold} w={3} />
      <circle cx={200} cy={30} r={10} fill={K.white} stroke={K.navy} strokeWidth={1.5} />
      <Pipe d="M264 58H720M420 58V0M560 58V0" c={K.hot} w={4} />
      <Pipe d="M720 112H252V96" c={K.hot} w={3} dash={DASH.recirc} />
      {flow}
      <Dot x={200} y={58} c={K.cold} />
      <Dot x={420} y={58} c={K.hot} />
      <Dot x={560} y={58} c={K.hot} />
      <Wh x={252} y={76} r={26} />
      <Valve x={180} y={58} />
      <Valve x={326} y={58} />
      <circle cx={360} cy={112} r={9} fill={K.white} stroke={K.navy} strokeWidth={1.5} />
      <path d="M364 107.5L355.5 112L364 116.5Z" fill={K.navy} />
      <Check x={470} y={112} r={180} />
      <Txt x={292} y={92} size={12} weight={700}>
        WH-1
      </Txt>
      <Badge x={300} y={32} n={1} />
    </>
  );
}

/** A riser diagram: floor levels, a waste stack with a branch on each floor, the vent stack through the roof. */
function RiserArt({ flow }: { flow: ReactNode }) {
  return (
    <>
      <path d="M0 38H720M0 78H720M0 118H720" fill="none" stroke={K.rule} strokeWidth="1.5" strokeDasharray="10 6" strokeLinecap="butt" />
      <Txt x={176} y={33} size={11} weight={700} fill={K.mut}>
        ROOF
      </Txt>
      <Txt x={176} y={73} size={11} weight={700} fill={K.mut}>
        L2
      </Txt>
      <Txt x={176} y={113} size={11} weight={700} fill={K.mut}>
        L1
      </Txt>
      <Pipe d="M330 126H372V20M330 66V48H372" c={K.vent} w={3} dash={DASH.vent} />
      <path d="M362 38H382" fill="none" stroke={K.navy} strokeWidth="2.5" />
      <Pipe d="M306 140H720M330 66V140" c={K.waste} w={5} />
      <Pipe d="M262 70H330M262 110H330" c={K.waste} w={3.5} />
      <Pipe d="M262 56V70M296 56V70M262 96V110M296 96V110" c={K.waste} w={3} />
      {flow}
      {[70, 110].flatMap((y) => [296, 330].map((x) => <Dot key={`${x}-${y}`} x={x} y={y} c={K.waste} />))}
      <Co x={300} y={140} />
      <path d="M414 78H426M414 118H426M420 78V118" fill="none" stroke={K.navy} strokeWidth="1" strokeLinecap="butt" />
      <Txt x={428} y={102} size={11}>
        12 ft
      </Txt>
      <Arrow x={612} y={140} c={K.navy} />
      <Badge x={236} y={62} n={2} />
      <Badge x={236} y={102} n={1} />
    </>
  );
}

/** A workbook window: the formula bar, columns F to J of row 5, the quantity to buy outlined, the system tabs. */
function SheetArt({ flow }: { flow: ReactNode }) {
  const cols = [200, 252, 304, 356, 408, 460, 512];
  return (
    <>
      <rect x={176} y={14} width={368} height={122} rx={6} fill={K.white} />
      <path d="M176 30V20a6 6 0 0 1 6-6h356a6 6 0 0 1 6 6v10Z" fill={K.pale} />
      {[188, 198, 208].map((x) => (
        <circle key={x} cx={x} cy={22} r={2.8} fill={K.rule} />
      ))}
      <rect x={176} y={48} width={368} height={12} fill={K.paper} />
      <rect x={176} y={60} width={24} height={60} fill={K.paper} />
      <rect x={176} y={120} width={368} height={16} fill={K.paper} />
      <path
        d={`M176 30H544M176 48H544M176 60H544M176 75H544M176 90H544M176 105H544M176 120H544${cols.map((x) => `M${x} 48V120`).join("")}`}
        fill="none"
        stroke={K.grid}
        strokeWidth="1"
        strokeLinecap="butt"
      />
      <path d="M210 67.5h30M262 67.5h22M314 67.5h30M366 67.5h20M418 67.5h30M210 82.5h22M262 82.5h30M314 82.5h18M366 82.5h28M418 82.5h24M210 112.5h28M262 112.5h20M314 112.5h26M366 112.5h22M418 112.5h30" fill="none" stroke={K.pale} strokeWidth="4" />
      <Txt x={186} y={43} size={11} fill={K.mut} halo={null}>
        fx
      </Txt>
      <Txt x={204} y={43} size={11} halo={null}>
        =CEILING(ROUND(F5*(1+H5),4),I5)
      </Txt>
      <text y={57.5} fontSize={9.5} fontWeight={700} fill={K.mut} textAnchor="middle">
        {["F", "G", "H", "I", "J", "K"].map((c, i) => (
          <tspan key={c} x={cols[i]! + 26}>
            {c}
          </tspan>
        ))}
      </text>
      <text x={188} fontSize={9.5} fontWeight={600} fill={K.mut} textAnchor="middle">
        {[3, 4, 5, 6].map((n, i) => (
          <tspan key={n} x={188} y={71.5 + 15 * i}>
            {n}
          </tspan>
        ))}
      </text>
      <rect x={408} y={90} width={52} height={15} fill={K.tint} stroke={K.amber} strokeWidth={2} />
      <Txt x={247} y={101.5} size={11} weight={700} fill={K.cold} anchor="end" halo={null}>
        150
      </Txt>
      <Txt x={351} y={101.5} size={11} weight={700} fill={K.hot} anchor="end" halo={null}>
        5%
      </Txt>
      <Txt x={403} y={101.5} size={11} weight={700} fill={K.vent} anchor="end" halo={null}>
        10
      </Txt>
      <Txt x={455} y={101.5} size={11} weight={800} anchor="end" halo={null}>
        160
      </Txt>
      <rect x={244} y={120} width={40} height={16} fill={K.white} />
      <path d="M244 134.5H284" fill="none" stroke={K.amber} strokeWidth="3" strokeLinecap="butt" />
      {[
        [190, "Summary"],
        [252, "DWV"],
        [296, "Water"],
        [340, "Gas"],
      ].map(([x, t]) => (
        <Txt key={t} x={x as number} y={131.5} size={9.5} weight={t === "DWV" ? 800 : 600} fill={t === "DWV" ? K.navy : K.mut} halo={null}>
          {t}
        </Txt>
      ))}
      <rect x={176} y={14} width={368} height={122} rx={6} fill="none" stroke={K.navy} strokeWidth={1.5} />
      {flow}
    </>
  );
}

/** Stock lengths (20 px per foot): a 12 ft cut leaves an 8 ft offcut, the next length uses it, and the allowance. */
function CutArt({ flow }: { flow: ReactNode }) {
  const hatch = Array.from({ length: 19 }, (_, i) => `M${404 + 8 * i} 53l8-10`).join("");
  return (
    <>
      <DimH x1={160} x2={560} y={22} label="20 ft" />
      {[43, 77, 111].map((y) => (
        <rect key={y} x={160} y={y} width={400} height={10} rx={5} fill={K.pale} stroke={K.navy} strokeWidth={1.5} />
      ))}
      <path d={hatch} fill="none" stroke={K.rule} strokeWidth="1.5" />
      {flow}
      <Pipe d="M400 37V59" c={K.amber} w={3} />
      <Txt x={480} y={68} size={11} fill={K.mut} anchor="middle">
        8 ft offcut
      </Txt>
      <path d="M400 75V89" fill="none" stroke={K.navy} strokeWidth="1.5" />
      <Txt x={280} y={102} size={11} anchor="middle">
        12 ft + 8 ft
      </Txt>
      <path d={ticks([474, 96])} fill="none" stroke={K.vent} strokeWidth="2.5" />
      <rect x={560} y={111} width={20} height={10} rx={3} fill={K.tint} stroke={K.amber} strokeWidth={1.5} strokeDasharray="3 2" />
      <Txt x={360} y={138} size={11} fill={K.mut} anchor="middle">
        +5% allowance
      </Txt>
    </>
  );
}

/** Bid day: the bid form with its total, the addenda log ticked off, and the due date. */
function BidArt({ flow }: { flow: ReactNode }) {
  return (
    <>
      <rect x={170} y={16} width={150} height={124} rx={4} fill={K.white} stroke={K.navy} strokeWidth={1.5} />
      <Txt x={184} y={34} size={11} weight={800} halo={null}>
        BID FORM
      </Txt>
      <path d="M184 48H306M184 60H306M184 72H306M184 84H306M184 96H306M184 131H306" fill="none" stroke={K.rule} strokeWidth="1.5" />
      <path d="M184 48h22M184 60h30M184 72h18M184 84h26M184 96h20" fill="none" stroke={K.navy} strokeWidth="2" />
      <Txt x={184} y={116} size={10} weight={800} halo={null}>
        TOTAL
      </Txt>
      <rect x={236} y={105} width={70} height={15} rx={3} fill={K.amber} stroke={K.navy} strokeWidth={1.2} />
      {flow}
      <rect x={340} y={28} width={130} height={98} rx={4} fill={K.white} stroke={K.navy} strokeWidth={1.5} />
      <Txt x={352} y={45} size={10} weight={800} halo={null}>
        ADDENDA
      </Txt>
      <path d="M340 54H470M340 78H470M340 102H470" fill="none" stroke={K.rule} strokeWidth="1" />
      {[1, 2, 3].map((n) => (
        <Txt key={n} x={352} y={46 + 24 * n} size={11} halo={null}>
          {`ADD ${n}`}
        </Txt>
      ))}
      <path d={ticks([444, 65], [444, 89], [444, 113])} fill="none" stroke={K.vent} strokeWidth="2.5" />
      <rect x={490} y={38} width={60} height={72} rx={6} fill={K.white} stroke={K.navy} strokeWidth={1.5} />
      <path d="M490 58V44a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v14Z" fill={K.amber} stroke={K.navy} strokeWidth={1.5} />
      <Txt x={520} y={52.5} size={11} weight={800} anchor="middle" halo={null}>
        DUE
      </Txt>
      <Txt x={520} y={92} size={18} weight={800} anchor="middle" halo={null}>
        FRI
      </Txt>
    </>
  );
}

const ART: Record<StripName, (p: { flow: ReactNode }) => ReactNode> = {
  fixtures: FixturesArt,
  waste: WasteArt,
  heater: HeaterArt,
  riser: RiserArt,
  sheet: SheetArt,
  cut: CutArt,
  bid: BidArt,
};

/** The flow path along a strip's main, styled by the card's class. */
function Flow({ name, className }: { name: StripName; className: string }) {
  const c = FLOW_C[name];
  return <path className={className} d={FLOW[name]} style={c ? ({ "--flow-c": c } as CSSProperties) : undefined} />;
}

const PAPER = (
  <>
    <rect width="720" height="150" fill={K.paper} />
    <path d={GRID} fill="none" stroke={K.grid} strokeWidth="1" strokeLinecap="butt" />
  </>
);

/** One strip, drawn in place (about 2.5 to 4 KB of markup). `flowClassName` styles the flow path along the main. */
export function Strip({ name, className, flowClassName }: { name: StripName; className?: string; flowClassName?: string }) {
  const Art = ART[name];
  return (
    <svg
      viewBox="0 0 720 150"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
    >
      {PAPER}
      <Art flow={flowClassName ? <Flow name={name} className={flowClassName} /> : null} />
    </svg>
  );
}

/**
 * For a page that shows many strips (a shelf of guide cards): render each strip once as a symbol here, then place
 * copies with `StripUse`. Each `name` once per page, or the symbol ids repeat.
 */
export function StripSprite({ names }: { names: StripName[] }) {
  return (
    <svg className="sr-only" width="0" height="0" aria-hidden="true" focusable="false">
      {[...new Set(names)].map((name) => {
        const Art = ART[name];
        return (
          <symbol key={name} id={`gs-${name}`} viewBox="0 0 720 150">
            <g strokeLinecap="round" strokeLinejoin="round">
              {PAPER}
              <Art flow={null} />
            </g>
          </symbol>
        );
      })}
    </svg>
  );
}

/** A copy of a `StripSprite` symbol. The flow path is drawn over the copy, where the card's hover class can reach it. */
export function StripUse({ name, className, flowClass }: { name: StripName; className?: string; flowClass?: string }) {
  return (
    <svg viewBox="0 0 720 150" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <use href={`#gs-${name}`} width="720" height="150" />
      {flowClass && <Flow name={name} className={flowClass} />}
    </svg>
  );
}
