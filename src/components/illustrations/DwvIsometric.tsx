import { DASH, Frame, K, LegendLine, Pipe, Txt, makeIso } from "./parts";
import { IsoBox, IsoCyl } from "./iso";

const W = K.white;
const iso = makeIso(200, 212, 1.5);
const { p, path, poly, ell } = iso;

/** Thin leader line between two screen points. */
function Lead({ from, to }: { from: readonly [number, number]; to: readonly [number, number] }) {
  return <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} fill="none" stroke={K.mut} strokeWidth="1" />;
}

/**
 * Isometric bathroom group on a stack, in a corner: lavatory on the left wall, water closet and shower on the
 * right wall. Cleanout at the base, vents to a header and up through the roof.
 */
export function DwvIsometric({ className }: { className?: string }) {
  const flash = ell(0, 0, 100, 5);
  const basin = ell(12, 40, 30, 7);
  const head = ell(110, 8, 66, 5);
  const seat = ell(56, 12, 16, 6);
  const stackTop = p(0, 0, 122);
  const co = p(0, 0, -78);
  return (
    <Frame
      className={className}
      title="Sanitary waste and vent isometric"
      desc="Isometric drawing of a bathroom group in a corner. A lavatory on one wall and a water closet and shower on the other each drain through a trap or branch to a four inch stack. A cleanout sits at the base of the stack, vents rise to a header, and the stack continues through the roof."
    >
      {/* floor and roof references */}
      <path d={poly([-12, -12, 0], [140, -12, 0], [140, 56, 0], [-12, 56, 0])} fill="none" stroke={K.rule} strokeWidth="1.5" strokeDasharray="6 5" strokeLinecap="butt" />
      <path d={poly([-16, -16, 100], [28, -16, 100], [28, 28, 100], [-16, 28, 100])} fill={K.pale} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={266} y={78} size={12} weight={500} fill={K.mut}>Roof</Txt>
      <Txt x={262} y={338} size={12} weight={500} fill={K.mut}>Floor</Txt>

      {/* shower back wall */}
      <path d={poly([92, 0, 0], [128, 0, 0], [128, 0, 70], [92, 0, 70])} fill={K.pale} stroke={K.navy} strokeWidth="1.25" />

      {/* sanitary waste: stack, building drain, cleanout, branches */}
      <Pipe d={path([0, 0, 18], [0, 0, -66], [0, 70, -66])} c={K.waste} w={8} layer="waste" />
      <Pipe d={path([0, 0, -66], [0, 0, -78])} c={K.waste} w={8} layer="waste" />
      <path data-layer="waste" d={`M${co[0] - 9} ${co[1] + 2}H${co[0] + 9}`} stroke={K.navy} strokeWidth="3" />
      <Pipe d={path([0, 0, -24], [120, 0, -24])} c={K.waste} w={6} layer="waste" />
      <Pipe d={path([56, 12, 0], [56, 12, -24], [56, 0, -24])} c={K.waste} w={6} layer="waste" />

      {/* vents: header at z 44 with risers from each branch, stack above the top fixture */}
      <Pipe d={path([92, 0, 44], [0, 0, 44], [0, 18, 44], [0, 18, 13])} c={K.vent} w={4} dash={DASH.vent} layer="vent" />
      <Pipe d={path([30, 0, -24], [30, 0, 44])} c={K.vent} w={4} dash={DASH.vent} layer="vent" />
      <Pipe d={path([92, 0, -24], [92, 0, 44])} c={K.vent} w={4} dash={DASH.vent} layer="vent" />
      <Pipe d={path([0, 0, 18], [0, 0, 100])} c={K.vent} w={6} dash="7 5" layer="vent" />

      {/* roof penetration and terminal */}
      <ellipse cx={flash.cx} cy={flash.cy} rx={flash.rx} ry={flash.ry} fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Pipe d={path([0, 0, 100], [0, 0, 122])} c={K.vent} w={6} dash="7 5" layer="vent" />

      {/* lavatory on the left wall, with its P-trap and arm (drawn first so the fixture hides what is behind it) */}
      <Pipe d={path([12, 40, 26], [12, 40, 5], [3, 40, 5], [3, 40, 13], [3, 0, 13], [0, 0, 13])} c={K.waste} w={4} layer="waste" />
      <IsoBox iso={iso} x={0} y={26} z={26} dx={20} dy={28} dz={4} />
      <ellipse cx={basin.cx} cy={basin.cy} rx={basin.rx} ry={basin.ry} fill={W} stroke={K.navy} strokeWidth="1.25" />

      {/* water closet on the right wall */}
      <IsoBox iso={iso} x={44} y={0} z={16} dx={24} dy={8} dz={20} />
      <IsoCyl iso={iso} x={56} y={12} z={0} r={6} h={10} />
      <IsoCyl iso={iso} x={56} y={12} z={10} r={10} h={6} />
      <ellipse cx={seat.cx} cy={seat.cy} rx={seat.rx} ry={seat.ry} fill={K.pale} stroke={K.navy} strokeWidth="1.25" />

      {/* shower pan, head and below-floor trap (trap first, the pan hides its top) */}
      <Pipe d={path([110, 14, 0], [110, 14, -14], [121, 14, -14], [121, 14, -7], [121, 0, -7], [121, 0, -24])} c={K.waste} w={4} layer="waste" />
      <IsoBox iso={iso} x={92} y={0} z={0} dx={36} dy={36} dz={2} />
      <Pipe d={path([110, 0, 66], [110, 8, 66])} c={K.navy} w={2} />
      <ellipse cx={head.cx} cy={head.cy} rx={head.rx} ry={head.ry} fill={W} stroke={K.navy} strokeWidth="1.25" />

      {/* left labels (run labels join their layer; fixture names stay) */}
      <g data-layer="vent">
        <Lead from={[stackTop[0] - 5, stackTop[1]]} to={[150, 38]} />
        <Txt x={24} y={43} size={13} weight={700}>Vent through roof</Txt>
        <Lead from={[p(0, 0, 62)[0] - 6, p(0, 0, 62)[1]]} to={[100, 120]} />
        <Txt x={24} y={125} size={13} weight={700}>4 in. stack vent</Txt>
      </g>
      <Lead from={[p(0, 40, 22)[0] - 6, p(0, 40, 22)[1] + 4]} to={[126, 244]} />
      <Txt x={24} y={226} size={13} weight={700}>Lavatory</Txt>
      <g data-layer="waste">
        <Txt x={24} y={243} size={12} weight={500} fill={K.mut}>P-trap and arm,</Txt>
        <Txt x={24} y={258} size={12} weight={500} fill={K.mut}>1-1/2 in.</Txt>
        <Lead from={[co[0] - 8, co[1] + 4]} to={[96, 322]} />
        <Txt x={24} y={316} size={13} weight={700}>Cleanout</Txt>
        <Txt x={24} y={332} size={13} weight={700}>at base</Txt>
        <Txt x={24} y={376} size={12} weight={500} fill={K.mut}>Building drain leaves here</Txt>
      </g>

      {/* right labels */}
      <g data-layer="vent">
        <Lead from={p(64, 0, 44)} to={[396, 150]} />
        <Txt x={404} y={154} size={13} weight={700} fill={K.vent}>Vent header, 2 in.</Txt>
      </g>
      <Lead from={p(68, 12, 8)} to={[396, 262]} />
      <Txt x={404} y={262} size={13} weight={700}>Water closet</Txt>
      <g data-layer="waste">
        <Txt x={404} y={279} size={12} weight={500} fill={K.mut}>Branch 3 in.,</Txt>
        <Txt x={404} y={294} size={12} weight={500} fill={K.mut}>integral trap</Txt>
      </g>
      <Lead from={p(121, 8, -10)} to={[396, 338]} />
      <Txt x={404} y={338} size={13} weight={700}>Shower</Txt>
      <Txt x={404} y={355} size={12} weight={500} fill={K.mut} layer="waste">P-trap and arm, 2 in.</Txt>

      {/* legend */}
      <LegendLine x={440} y={48} c={K.waste} label="Sanitary waste" layer="waste" />
      <LegendLine x={440} y={78} c={K.vent} label="Vent" dash={DASH.vent} layer="vent" />
    </Frame>
  );
}
