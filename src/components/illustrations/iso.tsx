import { K, makeIso } from "./parts";

export type Iso = ReturnType<typeof makeIso>;

const LEFT = K.pale;
const RIGHT = "#d3d8ea";

/** Isometric box: top, left (+y) and right (+x) faces in flat tones. */
export function IsoBox({
  iso, x, y, z, dx, dy, dz, top = K.white, sw = 1.5,
}: { iso: Iso; x: number; y: number; z: number; dx: number; dy: number; dz: number; top?: string; sw?: number }) {
  return (
    <g stroke={K.navy} strokeWidth={sw}>
      <path d={iso.poly([x, y + dy, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x, y + dy, z + dz])} fill={LEFT} />
      <path d={iso.poly([x + dx, y, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x + dx, y, z + dz])} fill={RIGHT} />
      <path d={iso.poly([x, y, z + dz], [x + dx, y, z + dz], [x + dx, y + dy, z + dz], [x, y + dy, z + dz])} fill={top} />
    </g>
  );
}

/** Upright cylinder in isometric: bottom arc, two sides and a top ellipse. */
export function IsoCyl({
  iso, x, y, z, r, h, fill = K.white, sw = 1.5,
}: { iso: Iso; x: number; y: number; z: number; r: number; h: number; fill?: string; sw?: number }) {
  const b = iso.ell(x, y, z, r);
  const t = iso.ell(x, y, z + h, r);
  return (
    <g stroke={K.navy} strokeWidth={sw} fill={fill}>
      <path d={`M${b.cx - b.rx} ${t.cy}V${b.cy}A${b.rx} ${b.ry} 0 0 0 ${b.cx + b.rx} ${b.cy}V${t.cy}`} />
      <ellipse cx={t.cx} cy={t.cy} rx={t.rx} ry={t.ry} />
    </g>
  );
}
