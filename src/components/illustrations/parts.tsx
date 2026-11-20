import { useId } from "react";
import type { ReactNode } from "react";

/**
 * Shared drafting kit for the illustrations. Everything is inline SVG on a 640 x 400 sheet:
 * paper background, faint blueprint grid, navy structure, system-colored pipe runs.
 * Colors match src/styles/tokens.css. Color is never the only signal: runs are labeled.
 */
export const K = {
  navy: "#1f1b50",
  paper: "#f4f6fb",
  grid: "#e3e7f1",
  white: "#ffffff",
  mut: "#5b6280",
  pale: "#e8ebf5",
  rule: "#c5cae0",
  amber: "#f5b400",
  tint: "#fff5d6",
  cold: "#1f6fd0",
  hot: "#d64533",
  waste: "#7b5b3a",
  vent: "#2f9a62",
  storm: "#0f8b9b",
  gas: "#c99400",
  fire: "#c62f2f",
  med: "#4f7f95",
} as const;

export const DASH = { vent: "8 5", recirc: "9 5" } as const;

const gridPath = (w: number, h: number) => {
  let d = "";
  for (let y = 20; y < h; y += 20) d += `M0 ${y}H${w}`;
  for (let x = 20; x < w; x += 20) d += `M${x} 0V${h}`;
  return d;
};
const GRID = gridPath(640, 400);

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Sheet: accessible name from <title>, description from <desc>, paper background and grid. 640 x 400 unless sized. */
export function Frame({
  title, desc, className, width = 640, height = 400, children,
}: { title: string; desc: string; className?: string; width?: number; height?: number; children: ReactNode }) {
  const id = useId();
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      {...(className ? { className } : {})}
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      <rect width={width} height={height} fill={K.paper} />
      <path d={width === 640 && height === 400 ? GRID : gridPath(width, height)} fill="none" stroke={K.grid} strokeWidth="1" strokeLinecap="butt" />
      {children}
    </svg>
  );
}

type TxtProps = {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  /** Halo color painted behind the glyphs for legibility over lines. null = none. */
  halo?: string | null;
  /** Layer key, rendered as data-layer. ponytail: nothing reads it since the system pages' drawing trace went; drop the
   *  layer props from the drawings if no picker returns. */
  layer?: string;
};

/** Text-safe shades (4.5:1 or better on the sheet and on white) for labels set in a system color. Pipe strokes keep the K colors. */
const TEXT_SAFE: Record<string, string> = {
  [K.gas]: "#8a5a00",
  [K.vent]: "#1f7a4d",
  [K.storm]: "#0b6f7c",
  [K.med]: "#3f6b80",
  [K.hot]: "#b8362a",
};

/** `data-layer` only when a layer is set: an undefined prop still costs bytes in the page's RSC payload. */
const tag = (layer?: string) => (layer ? { "data-layer": layer } : {});

/** Label in the site sans at 12-14px with a light halo (paint-order stroke). */
export function Txt({ x, y, children, size = 13, weight = 600, fill = K.navy, anchor, halo = K.paper, layer }: TxtProps) {
  return (
    <text
      {...tag(layer)}
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={TEXT_SAFE[fill] ?? fill}
      {...(anchor ? { textAnchor: anchor } : {})}
      {...(halo ? { stroke: halo, strokeWidth: 4, paintOrder: "stroke" } : {})}
    >
      {children}
    </text>
  );
}

/** A pipe run in a system color. Dashed runs (vent, recirculation) use butt caps so dashes stay crisp. */
export function Pipe({ d, c, w = 4.5, dash, layer }: { d: string; c: string; w?: number; dash?: string; layer?: string }) {
  return (
    <path {...tag(layer)} d={d} fill="none" stroke={c} strokeWidth={w} {...(dash ? { strokeDasharray: dash, strokeLinecap: "butt" as const } : {})} />
  );
}

/** Double-line walls: navy casing under a white core, so junctions merge cleanly. `d` is the wall centerline. */
export function Walls({ d, t = 8 }: { d: string; t?: number }) {
  return (
    <g fill="none" strokeLinecap="butt" strokeLinejoin="miter">
      <path d={d} stroke={K.navy} strokeWidth={t + 4} />
      <path d={d} stroke={K.white} strokeWidth={t} />
    </g>
  );
}

const at = (x: number, y: number, r = 0) => `translate(${x} ${y})${r ? ` rotate(${r})` : ""}`;

/** Gate or ball valve: the bow-tie. r = 90 for a vertical pipe. */
export function Valve({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <path d="M-6-5V5L6-5V5Z" transform={at(x, y, r)} fill={K.white} stroke={K.navy} strokeWidth="1.5" strokeLinejoin="miter" />
  );
}

/** Check valve: triangle and bar, pointing along the flow (+x at r = 0). */
export function Check({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <path d="M-5-5L5 0L-5 5ZM5-5V5" transform={at(x, y, r)} fill={K.white} stroke={K.navy} strokeWidth="1.5" />
  );
}

/** Amber takeoff count badge: circle with the navy number. */
export function Badge({ x, y, n, layer }: { x: number; y: number; n: number | string; layer?: string }) {
  return (
    <g {...tag(layer)}>
      <circle cx={x} cy={y} r="10" fill={K.amber} stroke={K.navy} strokeWidth="1.5" />
      <text x={x} y={y + 4.6} textAnchor="middle" fontSize="13" fontWeight="800" fill={K.navy}>
        {n}
      </text>
    </g>
  );
}

/** Junction dot: a true connection (crossing pipes without a dot are not connected). */
export function Dot({ x, y, c = K.navy }: { x: number; y: number; c?: string }) {
  return <circle cx={x} cy={y} r="3.4" fill={c} stroke="none" />;
}

/** Solid arrowhead with its tip at (x, y), pointing along r degrees (0 = +x). */
export function Arrow({ x, y, r = 0, s = 9, c = K.navy }: { x: number; y: number; r?: number; s?: number; c?: string }) {
  return (
    <path d={`M0 0L${-s} ${r1(-s * 0.5)}V${r1(s * 0.5)}Z`} transform={at(x, y, r)} fill={c} stroke={c} strokeWidth="1" />
  );
}

/** Thin leader line from a label to the thing it names. */
export function Leader({ d }: { d: string }) {
  return <path d={d} fill="none" stroke={K.mut} strokeWidth="1" />;
}

/** Horizontal dimension line with end ticks and a centered label. */
export function DimH({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <path
        d={`M${x1} ${y - 5}V${y + 5}M${x2} ${y - 5}V${y + 5}M${x1} ${y}H${x2}`}
        fill="none"
        stroke={K.navy}
        strokeWidth="1"
        strokeLinecap="butt"
      />
      <Txt x={(x1 + x2) / 2} y={y - 7} anchor="middle" size={12} weight={600}>
        {label}
      </Txt>
    </g>
  );
}

/** Legend sample line (solid or dashed) with its label. */
export function LegendLine({
  x, y, c, label, dash, w = 4.5, len = 26, layer,
}: { x: number; y: number; c: string; label: string; dash?: string; w?: number; len?: number; layer?: string }) {
  return (
    <g {...tag(layer)}>
      <Pipe d={`M${x} ${y}h${len}`} c={c} w={w} dash={dash} />
      <Txt x={x + len + 8} y={y + 4.5} size={13} weight={600} halo={null}>
        {label}
      </Txt>
    </g>
  );
}

/** Isometric (30 degree axonometric) projection helper. x runs right-down, y runs left-down, z is up. */
export function makeIso(ox: number, oy: number, k = 1) {
  const cx = 0.866 * k;
  const cy = 0.5 * k;
  const p = (x: number, y: number, z = 0): [number, number] => [r1(ox + (x - y) * cx), r1(oy + (x + y) * cy - z * k)];
  const path = (...pts: [number, number, number][]) =>
    pts
      .map(([x, y, z], i) => {
        const [a, b] = p(x, y, z);
        return `${i ? "L" : "M"}${a} ${b}`;
      })
      .join("");
  /** Closed polygon through the given points. */
  const poly = (...pts: [number, number, number][]) => `${path(...pts)}Z`;
  /** A horizontal circle of radius r (same units as x, y, z) projects to this ellipse. */
  const ell = (x: number, y: number, z: number, r: number) => {
    const [cx, cy] = p(x, y, z);
    return { cx, cy, rx: r1(1.2247 * r * k), ry: r1(0.7071 * r * k) };
  };
  return { p, path, poly, ell };
}
