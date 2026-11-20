import { Frame, K, LegendLine, Pipe, Txt, Valve, makeIso } from "./parts";
import { IsoBox } from "./iso";

const W = K.white;
const iso = makeIso(170, 190, 13);
const { p, path, poly, ell } = iso;
const BRACKETS = [3, 8, 13];
const GRATE = [4.2, 5.1, 6, 6.9, 7.8, 8.7, 9.6];

/** Thin leader line between two screen points. */
function Lead({ from, to }: { from: readonly [number, number]; to: readonly [number, number] }) {
  return <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} fill="none" stroke={K.mut} strokeWidth="1" />;
}

/** Industrial bay in isometric: process water and compressed air on wall brackets, trench drain, emergency shower and eyewash. */
export function ProcessPiping({ className }: { className?: string }) {
  const head = ell(3.5, 7, 7.6, 0.65);
  const bowl = ell(3.5, 7, 3.1, 0.95);
  const base = ell(3.5, 7, 0, 0.6);
  const pull = p(4, 7, 5.2);
  const airEnd = p(11, 2.3, 4.2);
  const valveW = p(14, 0.9, 7.6);
  const valveA = p(11, 2.3, 6.8);
  return (
    <Frame
      className={className}
      title="Industrial process piping layout"
      desc="Isometric view of an industrial bay. A process water line and a compressed air line run along the wall on pipe brackets and drop to equipment, a trench drain crosses the floor, and an emergency shower with an eyewash station stands in the corner."
    >
      {/* room: floor and two back walls */}
      <path d={poly([0, 0, 12], [0, 10, 12], [0, 10, 0], [0, 0, 0])} fill="#e3e7f3" stroke={K.navy} strokeWidth="1.5" />
      <path d={poly([0, 0, 12], [16, 0, 12], [16, 0, 0], [0, 0, 0])} fill={K.pale} stroke={K.navy} strokeWidth="1.5" />
      <path d={poly([0, 0, 0], [16, 0, 0], [16, 10, 0], [0, 10, 0])} fill={W} stroke={K.navy} strokeWidth="2" />

      {/* trench drain with grate */}
      <path d={poly([8.6, 3.4, 0], [9.4, 3.4, 0], [9.4, 10, 0], [8.6, 10, 0])} fill={K.pale} stroke={K.waste} strokeWidth="1.75" />
      <path d={GRATE.map((y) => path([8.6, y, 0], [9.4, y, 0])).join("")} fill="none" stroke={K.waste} strokeWidth="1.25" strokeLinecap="butt" />

      {/* pipe brackets on the right wall */}
      <path d={BRACKETS.map((x) => path([x, 0, 9], [x, 3, 9]) + path([x, 0, 6.8], [x, 2.4, 9])).join("")} fill="none" stroke={K.navy} strokeWidth="2.5" />

      {/* process skid */}
      <IsoBox iso={iso} x={12.6} y={2.2} z={0} dx={3} dy={3} dz={2.6} />

      {/* process water: along the wall, then down to the skid */}
      <Pipe d={path([0, 0.9, 9.35], [14, 0.9, 9.35], [14, 0.9, 5], [14, 3.6, 5], [14, 3.6, 2.6])} c={K.cold} w={7} />
      {/* compressed air: along the wall, then down to a hose drop */}
      <Pipe d={path([0, 2.3, 9.35], [11, 2.3, 9.35], [11, 2.3, 4.4])} c={K.med} w={4.5} />
      <circle cx={airEnd[0]} cy={airEnd[1]} r="3.5" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Valve x={valveW[0]} y={valveW[1] + 4} r={90} />
      <Valve x={valveA[0]} y={valveA[1] + 4} r={90} />

      {/* emergency shower and eyewash */}
      <ellipse cx={base.cx} cy={base.cy} rx={base.rx} ry={base.ry} fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Pipe d={path([3.5, 7, 0], [3.5, 7, 7.6])} c={K.cold} w={4} />
      <ellipse cx={bowl.cx} cy={bowl.cy} rx={bowl.rx} ry={bowl.ry} fill={W} stroke={K.navy} strokeWidth="1.5" />
      <ellipse cx={head.cx} cy={head.cy} rx={head.rx} ry={head.ry} fill={W} stroke={K.navy} strokeWidth="1.5" />
      <path d={path([4, 7, 7.4], [4, 7, 5.2])} fill="none" stroke={K.navy} strokeWidth="1.25" />
      <path d={`M${bowl.cx - 9} ${bowl.cy - 3}h0M${bowl.cx + 9} ${bowl.cy - 3}h0`} stroke={K.navy} strokeWidth="4" />
      <path d={`M${pull[0] - 4} ${pull[1]}H${pull[0] + 4}L${pull[0]} ${pull[1] + 8}Z`} fill={K.navy} stroke={K.navy} strokeWidth="1" />

      {/* labels */}
      <Lead from={p(9, 0.9, 9.35)} to={[380, 86]} />
      <Txt x={388} y={90} size={13} weight={700} fill={K.cold}>Process water, 3 in.</Txt>
      <Lead from={p(8, 0, 7)} to={[380, 132]} />
      <Txt x={388} y={136} size={13} weight={700}>Pipe brackets</Txt>
      <Lead from={p(0.5, 2.3, 9.35)} to={[116, 52]} />
      <Txt x={24} y={44} size={13} weight={700} fill={K.med}>Compressed air,</Txt>
      <Txt x={24} y={60} size={13} weight={700} fill={K.med}>1-1/2 in.</Txt>
      <Lead from={p(14.5, 4.5, 1.3)} to={[380, 186]} />
      <Txt x={388} y={190} size={13} weight={700}>Process equipment</Txt>
      <Lead from={p(9, 8, 0)} to={[380, 236]} />
      <Txt x={388} y={240} size={13} weight={700} fill={K.waste}>Trench drain</Txt>
      <Lead from={[bowl.cx - bowl.rx, bowl.cy]} to={[86, 330]} />
      <Txt x={24} y={344} size={13} weight={700}>Emergency shower</Txt>
      <Txt x={24} y={361} size={13} weight={700}>and eyewash</Txt>

      {/* legend */}
      <LegendLine x={388} y={332} c={K.cold} label="Process water" w={5} len={22} />
      <LegendLine x={388} y={356} c={K.med} label="Compressed air" w={5} len={22} />
    </Frame>
  );
}
