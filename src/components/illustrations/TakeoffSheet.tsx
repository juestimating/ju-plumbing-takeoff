import { Frame, K, Txt } from "./parts";

const W = K.white;
const COLS = { gut: 40, a: 68, b: 256, c: 326, d: 396, e: 456, end: 600 };
const ROW0 = 98;
const RH = 26;
// item, size, qty, unit, sheet
const ROWS: [string, string, string, string, string][] = [
  ["Sanitary pipe, PVC DWV", "4 in.", "180", "LF", "P-101"],
  ["Sanitary pipe, PVC DWV", "3 in.", "120", "LF", "P-101"],
  ["Sanitary pipe, PVC DWV", "2 in.", "210", "LF", "P-102"],
  ["Pipe subtotal", "", "510", "LF", ""],
  ["Wye, long sweep", "4 in.", "16", "EA", "P-101"],
  ["Cleanout with plug", "4 in.", "6", "EA", "P-101"],
  ["Floor drain with trap primer", "3 in.", "8", "EA", "P-102"],
  ["Vent through roof", "3 in.", "4", "EA", "P-104"],
];
const TABS: [string, number, number][] = [["Summary", 52, 78], ["DWV", 138, 58], ["Water", 204, 62], ["Fixtures", 274, 74]];

const GRID_LINES = (() => {
  let d = "";
  for (let i = 0; i <= 9; i++) d += `M${COLS.gut} ${ROW0 + i * RH}H${COLS.end}`;
  for (const x of [COLS.a, COLS.b, COLS.c, COLS.d, COLS.e]) d += `M${x} 80V${ROW0 + 9 * RH}`;
  return d;
})();

/** Takeoff workbook window: formula bar, columns for item, size, quantity, unit and sheet, and tabs per system. */
export function TakeoffSheet({ className }: { className?: string }) {
  const selY = ROW0 + 4 * RH;
  return (
    <Frame
      className={className}
      title="Takeoff spreadsheet"
      desc="A spreadsheet window with a formula bar and tabs named Summary, DWV, Water and Fixtures. The DWV tab lists items with size, quantity, unit and the plan sheet each quantity came from, and a subtotal cell holds a live SUM formula."
    >
      <rect x="40" y="28" width="560" height="344" rx="6" fill={W} stroke={K.navy} strokeWidth="2" />
      <path d="M40 34a6 6 0 0 1 6-6H594a6 6 0 0 1 6 6V54H40Z" fill={K.navy} stroke="none" />
      <Txt x={56} y={46} size={13} weight={700} fill={W} halo={null}>Plumbing takeoff.xlsx</Txt>

      {/* formula bar */}
      <rect x="41" y="54" width="558" height="26" fill={K.pale} />
      <rect x="48" y="58" width="52" height="18" rx="2" fill={W} stroke={K.rule} strokeWidth="1" />
      <Txt x={74} y={71} size={12} weight={700} anchor="middle" halo={null}>C5</Txt>
      <Txt x={112} y={71} size={12} weight={800} fill={K.mut} halo={null}>fx</Txt>
      <Txt x={136} y={71} size={13} weight={600} halo={null}>=SUM(C2:C4)</Txt>

      {/* column letters, row numbers, header row */}
      <rect x={COLS.gut} y="80" width={COLS.end - COLS.gut} height="18" fill={K.pale} />
      <rect x={COLS.gut} y="98" width={COLS.a - COLS.gut} height={RH * 9} fill={K.pale} />
      <rect x={COLS.a} y="98" width={COLS.end - COLS.a} height={RH} fill={K.tint} />
      <rect x={COLS.a} y={ROW0 + 4 * RH} width={COLS.end - COLS.a} height={RH} fill={K.pale} />
      {(["a", "b", "c", "d", "e"] as const).map((c, i) => {
        const next = (["b", "c", "d", "e", "end"] as const)[i];
        return (
          <Txt key={c} x={(COLS[c] + COLS[next]) / 2} y={93} size={12} weight={600} fill={K.mut} anchor="middle" halo={null}>
            {"ABCDE"[i]}
          </Txt>
        );
      })}
      {Array.from({ length: 9 }, (_, i) => (
        <Txt key={i} x={COLS.gut + 14} y={ROW0 + i * RH + 18} size={12} weight={500} fill={K.mut} anchor="middle" halo={null}>
          {i + 1}
        </Txt>
      ))}
      <path d={GRID_LINES} fill="none" stroke="#dde1ee" strokeWidth="1" strokeLinecap="butt" />

      {/* header row */}
      <text y={ROW0 + 18} fontSize="12" fontWeight="800" fill={K.navy}>
        <tspan x={COLS.a + 8}>Item</tspan>
        <tspan x={COLS.b + 8}>Size</tspan>
        <tspan x={COLS.d - 8} textAnchor="end">Qty</tspan>
        <tspan x={COLS.d + 8}>Unit</tspan>
        <tspan x={COLS.e + 8}>Sheet</tspan>
      </text>
      {/* data rows */}
      {ROWS.map(([item, size, qty, unit, sheet], i) => {
        const y = ROW0 + (i + 1) * RH + 18;
        const bold = item === "Pipe subtotal";
        return (
          <text key={i} y={y} fontSize="13" fontWeight={bold ? 800 : 500} fill={K.navy}>
            <tspan x={COLS.a + 8}>{item}</tspan>
            <tspan x={COLS.b + 8}>{size}</tspan>
            <tspan x={COLS.d - 8} textAnchor="end">{qty}</tspan>
            <tspan x={COLS.d + 8}>{unit}</tspan>
            <tspan x={COLS.e + 8} fill={K.mut}>{sheet}</tspan>
          </text>
        );
      })}
      {/* selected cell */}
      <rect x={COLS.c} y={selY} width={COLS.d - COLS.c} height={RH} fill="none" stroke={K.amber} strokeWidth="3" />

      {/* sheet tabs */}
      <rect x="41" y="332" width="558" height="39" fill={K.pale} />
      {TABS.map(([name, x, w]) => {
        const active = name === "DWV";
        return (
          <g key={name}>
            <path
              d={`M${x} 332H${x + w}V352a5 5 0 0 1-5 5H${x + 5}a5 5 0 0 1-5-5Z`}
              fill={active ? W : K.pale}
              stroke={K.navy}
              strokeWidth={active ? 1.75 : 1.25}
            />
            {active && <path d={`M${x} 332H${x + w}`} stroke={K.amber} strokeWidth="4" strokeLinecap="butt" />}
            <Txt x={x + w / 2} y={349} size={12} weight={active ? 800 : 600} anchor="middle" fill={active ? K.navy : K.mut} halo={null}>
              {name}
            </Txt>
          </g>
        );
      })}
    </Frame>
  );
}
