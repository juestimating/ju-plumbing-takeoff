import { K } from "./parts";

/**
 * Plan-view plumbing fixture symbols. Wall-mounted ones have their origin at the wall contact point,
 * centered on the fixture, and extend toward +y (rotate 90 to face west, -90 east, 180 north).
 * Centered ones (floor drain, cleanout, mop sink, heater) are placed by their center.
 * `s` scales the symbol; stroke widths are compensated so lines stay the same weight.
 */
type At = { x: number; y: number; r?: number; s?: number };
const at = ({ x, y, r = 0, s = 1 }: At) =>
  `translate(${x} ${y})${r ? ` rotate(${r})` : ""}${s !== 1 ? ` scale(${s})` : ""}`;
const base = (s = 1) => ({ fill: K.white, stroke: K.navy, strokeWidth: 1.5 / s }) as const;

/** Water closet: tank against the wall, elongated bowl. */
export function WC(p: At) {
  return (
    <g {...base(p.s)} transform={at(p)}>
      <rect x={-9} y={0} width={18} height={7} rx={1.5} />
      <ellipse cx={0} cy={18} rx={8.5} ry={11.5} />
    </g>
  );
}

/** Lavatory: counter-mounted basin with faucet. */
export function Lav(p: At) {
  return (
    <g {...base(p.s)} transform={at(p)}>
      <rect x={-12} y={0} width={24} height={18} rx={3} />
      <ellipse cx={0} cy={10.5} rx={7} ry={5.5} />
      <circle cx={0} cy={3.2} r={1.4} fill={K.navy} stroke="none" />
    </g>
  );
}

/** Wall-hung urinal. */
export function Ur(p: At) {
  return (
    <g {...base(p.s)} transform={at(p)}>
      <path d="M-7 0H7V7Q7 16 0 16Q-7 16-7 7Z" />
      <circle cx={0} cy={9.5} r={1.6} fill={K.navy} stroke="none" />
    </g>
  );
}

/** Floor drain: circle with a cross. */
export function Fd(p: At) {
  const s = p.s ?? 1;
  return (
    <g {...base(s)} transform={at(p)}>
      <circle r={6.5} />
      <path d="M-4.2-4.2L4.2 4.2M4.2-4.2L-4.2 4.2" strokeWidth={1.25 / s} />
    </g>
  );
}

/** Cleanout: ring with a plug. */
export function Co(p: At) {
  return (
    <g {...base(p.s)} transform={at(p)}>
      <circle r={6} />
      <circle r={2.2} fill={K.navy} stroke="none" />
    </g>
  );
}

/** Double-bowl kitchen sink. */
export function Sink(p: At) {
  const s = p.s ?? 1;
  return (
    <g {...base(s)} transform={at(p)}>
      <rect x={-22} y={0} width={44} height={20} rx={2} />
      <rect x={-18} y={3.5} width={16} height={13} rx={3} strokeWidth={1.25 / s} />
      <rect x={2} y={3.5} width={16} height={13} rx={3} strokeWidth={1.25 / s} />
    </g>
  );
}

/** Floor-set mop sink. */
export function Ms(p: At) {
  const s = p.s ?? 1;
  return (
    <g {...base(s)} transform={at(p)}>
      <rect x={-13} y={-13} width={26} height={26} rx={2} />
      <rect x={-9} y={-9} width={18} height={18} rx={1.5} strokeWidth={1.25 / s} />
      <circle r={2} fill={K.navy} stroke="none" />
    </g>
  );
}

/** Water heater in plan: a ring (label it). */
export function Wh({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g {...base()} transform={at({ x, y })}>
      <circle r={r} />
      <circle r={r - 5} strokeWidth={1} />
    </g>
  );
}

/** Bathtub with the drain at the left end. */
export function Tub(p: At) {
  const s = p.s ?? 1;
  return (
    <g {...base(s)} transform={at(p)}>
      <rect x={-30} y={0} width={60} height={28} rx={4} />
      <rect x={-26} y={3.5} width={52} height={21} rx={9} strokeWidth={1.1 / s} />
      <circle cx={-19} cy={14} r={1.8} fill={K.navy} stroke="none" />
    </g>
  );
}

/** Shower stall with center drain. */
export function Shower(p: At) {
  const s = p.s ?? 1;
  return (
    <g {...base(s)} transform={at(p)}>
      <rect x={-17} y={0} width={34} height={34} />
      <path d="M-17 0L17 34M17 0L-17 34" strokeWidth={1 / s} />
      <circle cx={0} cy={17} r={3.2} />
    </g>
  );
}

/** Clothes washer box (supply and drain). */
export function Washer(p: At) {
  const s = p.s ?? 1;
  return (
    <g {...base(s)} transform={at(p)}>
      <rect x={-14} y={0} width={28} height={28} rx={3} />
      <circle cx={0} cy={15} r={9} strokeWidth={1 / s} />
    </g>
  );
}

/** Path for a ring of radius r at (x, y), for batching many sprinkler heads into one element. */
export function ringPath(x: number, y: number, r = 4.2): string {
  return `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
}
