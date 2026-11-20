import { Frame, K, Txt } from "./parts";

const W = K.white;
const BAR = "#d7dced";
const CHECKLIST = ["Bid form signed", "Scope letter", "Alternates priced", "Addenda acknowledged", "Bond and insurance"];

/** Amber check badge: circle with a navy tick. */
function Tick({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  const s = r / 11;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={K.amber} stroke={K.navy} strokeWidth="1.5" />
      <path d={`M${x - 5 * s} ${y}L${x - 1.5 * s} ${y + 4 * s}L${x + 5 * s} ${y - 4 * s}`} fill="none" stroke={K.navy} strokeWidth="2.5" />
    </g>
  );
}

/** A stack of bid documents, each checked, and a submission checklist. */
export function BidPackage({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="Bid package documents"
      desc="A stack of three bid documents, an alternates sheet, a scope letter and a bid form, each with a check mark, beside a submission checklist."
    >
      {/* back to front: alternates, scope letter, bid form */}
      <rect x="40" y="28" width="250" height="250" rx="4" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={58} y={56} size={14} weight={800} halo={null}>Alternates</Txt>
      <Tick x={266} y={48} />

      <rect x="76" y="68" width="250" height="250" rx="4" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={94} y={96} size={14} weight={800} halo={null}>Scope letter</Txt>
      <Tick x={302} y={88} />

      <rect x="112" y="108" width="250" height="250" rx="4" fill={W} stroke={K.navy} strokeWidth="2" />
      <Txt x={130} y={136} size={14} weight={800} halo={null}>Bid form</Txt>
      <Tick x={338} y={128} />
      <path d="M130 150H344" stroke={K.rule} strokeWidth="1.5" strokeLinecap="butt" fill="none" />
      {(["Project", "Base bid", "Alternates"] as const).map((label, i) => (
        <g key={label}>
          <Txt x={130} y={176 + i * 28} size={12} weight={600} fill={K.mut} halo={null}>{label}</Txt>
          <rect x={196} y={166 + i * 28} width={[148, 96, 124][i]} height={12} rx={6} fill={BAR} />
        </g>
      ))}
      {(["Addenda acknowledged", "Bond and insurance attached"] as const).map((label, i) => (
        <g key={label}>
          <rect x={130} y={252 + i * 26} width={16} height={16} rx={2} fill={W} stroke={K.navy} strokeWidth="1.5" />
          <path d={`M${133} ${260 + i * 26}L${137} ${264 + i * 26}L${144} ${255 + i * 26}`} fill="none" stroke={K.navy} strokeWidth="2.25" />
          <Txt x={154} y={265 + i * 26} size={13} weight={600} halo={null}>{label}</Txt>
        </g>
      ))}
      <path d="M130 334H290" stroke={K.navy} strokeWidth="1.5" strokeLinecap="butt" fill="none" />
      <Txt x={130} y={349} size={12} weight={500} fill={K.mut} halo={null}>Authorized signature</Txt>

      {/* checklist */}
      <rect x="396" y="108" width="224" height="250" rx="4" fill={W} stroke={K.navy} strokeWidth="1.5" />
      <Txt x={412} y={138} size={14} weight={800} halo={null}>Submission checklist</Txt>
      {CHECKLIST.map((label, i) => (
        <g key={label}>
          <Tick x={424} y={172 + i * 36} r={10} />
          <Txt x={444} y={177 + i * 36} size={13} weight={600} halo={null}>{label}</Txt>
        </g>
      ))}
    </Frame>
  );
}
