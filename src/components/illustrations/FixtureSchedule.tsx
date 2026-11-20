import { ROWS } from "./fixtures";
import { Badge, Frame, K, Txt, Walls } from "./parts";
import { Fd, Lav, Ms, Ur, WC } from "./symbols";

export { ROWS };

const W = K.white;

/**
 * Fixture schedule on the left, the counted tags on the plan on the right. Each tag's schedule row and plan symbols
 * carry its layer key as data-layer; a transparent rect makes the whole row one target.
 */
export function FixtureSchedule({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Fixture schedule and counts"
      desc="A fixture schedule listing tags WC-1, LAV-1, UR-1, FD-1 and MS-1 with a symbol and a count for each, and an arrow to a restroom plan where the same tags are counted."
    >
      {/* schedule */}
      <rect x="24" y="40" width="276" height="300" rx="3" fill={W} stroke={K.navy} strokeWidth="2" />
      <path d="M24 43a3 3 0 0 1 3-3H297a3 3 0 0 1 3 3V72H24Z" fill={K.navy} stroke="none" />
      <Txt x={38} y={62} size={14} weight={700} fill={W} halo={null}>Plumbing fixture schedule</Txt>
      <rect x="24" y="72" width="276" height="24" fill={K.pale} />
      <Txt x={68} y={89} size={12} weight={700} fill={K.mut} halo={null}>Mark</Txt>
      <Txt x={124} y={89} size={12} weight={700} fill={K.mut} halo={null}>Fixture</Txt>
      <Txt x={272} y={89} size={12} weight={700} fill={K.mut} anchor="middle" halo={null}>Qty</Txt>
      <path d="M24 136H300M24 176H300M24 216H300M24 256H300M24 296H300" stroke={K.rule} strokeWidth="1" strokeLinecap="butt" fill="none" />
      <rect x="25" y="297" width="274" height="42" fill={K.tint} />
      <g data-layer="wc"><WC x={46} y={104} s={0.85} /></g>
      <g data-layer="lav"><Lav x={46} y={149} s={0.85} /></g>
      <g data-layer="ur"><Ur x={46} y={189} s={0.85} /></g>
      <g data-layer="fd"><Fd x={46} y={236} /></g>
      <g data-layer="ms"><Ms x={46} y={276} s={0.8} /></g>
      {ROWS.map(({ tag, mark, name, note, qty }, i) => (
        <g key={mark} data-layer={tag}>
          <rect x={24} y={96 + i * 40} width={276} height={40} fill="#000" fillOpacity={0} />
          <Txt x={68} y={121 + i * 40} size={13} weight={800} halo={null}>{mark}</Txt>
          <Txt x={124} y={116 + i * 40} size={13} weight={700} halo={null}>{name}</Txt>
          <Txt x={124} y={132 + i * 40} size={12} weight={500} fill={K.mut} halo={null}>{note}</Txt>
          <Badge x={272} y={116 + i * 40} n={qty} />
        </g>
      ))}
      <Txt x={68} y={322} size={13} weight={800} halo={null}>Total fixtures</Txt>
      <Badge x={272} y={318} n={9} />

      {/* arrow from schedule to plan */}
      <path d="M304 180H324V168L346 190L324 212V200H304Z" fill={K.amber} stroke={K.navy} strokeWidth="1.5" />

      {/* plan with counted tags */}
      <Txt x={372} y={64} size={14} weight={700}>Counted on the plan</Txt>
      <rect x="376" y="88" width="220" height="208" fill={W} />
      <Walls d="M372 200V84H600V300H372V224" />
      <rect x="366" y="200" width="12" height="24" fill={W} />
      <path d="M366 200H378M366 224H378" stroke={K.navy} strokeWidth="2" strokeLinecap="butt" />
      <path d="M376 200H400" stroke={K.navy} strokeWidth="1.5" />
      <path d="M400 200A24 24 0 0 1 376 224" fill="none" stroke={K.mut} strokeWidth="1" />
      <path d="M428 88V150M480 88V150M532 88V150" stroke={K.navy} strokeWidth="1.75" strokeLinecap="butt" />
      <g data-layer="wc">
        <WC x={402} y={88} s={1.2} />
        <WC x={454} y={88} s={1.2} />
        <WC x={506} y={88} s={1.2} />
      </g>
      <g data-layer="ur">
        <Ur x={596} y={120} r={90} s={1.2} />
        <Ur x={596} y={160} r={90} s={1.2} />
      </g>
      <g data-layer="lav">
        <Lav x={420} y={296} r={180} s={1.2} />
        <Lav x={472} y={296} r={180} s={1.2} />
      </g>
      <g data-layer="fd"><Fd x={520} y={216} s={1.2} /></g>
      <g data-layer="ms"><Ms x={566} y={260} /></g>
      {[402, 454, 506].map((x) => (
        <Txt key={x} x={x} y={166} size={12} weight={700} anchor="middle" halo={W} layer="wc">WC-1</Txt>
      ))}
      <Txt x={566} y={125} size={12} weight={700} anchor="end" halo={W} layer="ur">UR-1</Txt>
      <Txt x={566} y={165} size={12} weight={700} anchor="end" halo={W} layer="ur">UR-1</Txt>
      <Txt x={420} y={266} size={12} weight={700} anchor="middle" halo={W} layer="lav">LAV-1</Txt>
      <Txt x={472} y={266} size={12} weight={700} anchor="middle" halo={W} layer="lav">LAV-1</Txt>
      <Txt x={520} y={240} size={12} weight={700} anchor="middle" halo={W} layer="fd">FD-1</Txt>
      <Txt x={566} y={238} size={12} weight={700} anchor="middle" halo={W} layer="ms">MS-1</Txt>

      <Txt x={24} y={372} size={12} weight={500} fill={K.mut} halo={null}>Counts on the schedule are reconciled to the plan.</Txt>
    </Frame>
  );
}
