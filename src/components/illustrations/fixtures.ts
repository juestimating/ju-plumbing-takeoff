/** A fixture tag's layer key (the `data-layer` its schedule row and plan symbols carry). */
export type FixtureTag = "wc" | "lav" | "ur" | "fd" | "ms";

/**
 * The fixture schedule the FixtureSchedule drawing shows, row by row. `qty` is both the schedule count and the number
 * of symbols drawn on its plan (the drawing reconciles them).
 */
export const ROWS: { tag: FixtureTag; mark: string; name: string; note: string; qty: number }[] = [
  { tag: "wc", mark: "WC-1", name: "Water closet", note: "floor mount", qty: 3 },
  { tag: "lav", mark: "LAV-1", name: "Lavatory", note: "countertop", qty: 2 },
  { tag: "ur", mark: "UR-1", name: "Urinal", note: "wall hung", qty: 2 },
  { tag: "fd", mark: "FD-1", name: "Floor drain", note: "trap primer", qty: 1 },
  { tag: "ms", mark: "MS-1", name: "Mop sink", note: "floor set", qty: 1 },
];
