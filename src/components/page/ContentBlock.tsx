import { TONE } from "@/content/template-blocks";
import type { Block, IllustrationName, PageContent } from "@/content/types";
import { BlockRenderer } from "./Blocks";
import { Compare } from "./content/Compare";
import { GapExplorer } from "./content/GapExplorer";
import { HandoffTable } from "./content/HandoffTable";
import { PipeRun } from "./content/PipeRun";
import { ProseSplit } from "./content/ProseSplit";
import { RouteCard } from "./content/RouteCard";
import { ScopeBoard } from "./content/ScopeBoard";
import { SheetSection } from "./content/Sheet";
import { TypeCards } from "./content/TypeCards";

export type ContentBlockProps = {
  block: Block;
  page: PageContent;
  kicker?: string;
  /** The page's hero drawing: a block drawing equal to it is dropped, so no drawing shows twice. */
  heroDrawing?: IllustrationName;
};

/**
 * One content block of a service page in its home-style view: prose beside a plumbing artifact,
 * the scope board, a pipe run for numbered lists and steps, the scope-gap log explorer for the other lists, compare
 * cards, type cards, the live workbook for sheets, the handoff table, and the route card for callouts. Every view keeps
 * the block's section id, its h2 and all of its text in the server HTML. The view wiring is in
 * src/content/template-blocks.ts.
 */
export function ContentBlock({ block, page, kicker, heroDrawing }: ContentBlockProps) {
  // A template tone (TONE) puts one mid-page block on navy where the content runs a long light stretch.
  const tone = TONE[block.id];
  const b: Block = tone ? { ...block, tone } : block;
  // The pipe run, the log stripe and the scope legend run in the page's color (nav.color); without one, navy and amber.
  const color = page.nav.color;
  switch (b.type) {
    case "prose": return <ProseSplit b={b} page={page} kicker={kicker} heroDrawing={heroDrawing} />;
    case "scope": return <ScopeBoard b={b} page={page} kicker={kicker} heroDrawing={heroDrawing} />;
    case "list": return b.numbered ? <PipeRun b={b} color={color} kicker={kicker} /> : <GapExplorer b={b} color={color} kicker={kicker} />;
    case "steps": return <PipeRun b={b} color={color} kicker={kicker} />;
    case "compare": return <Compare b={b} page={page} kicker={kicker} />;
    case "cards": return <TypeCards b={b} kicker={kicker} />;
    case "table": {
      if (b.variant === "sheet") return <SheetSection b={b} kicker={kicker} />;
      const owner = b.head.indexOf("Who supplies it");
      return owner >= 0 ? <HandoffTable b={b} kicker={kicker} owner={owner} /> : <BlockRenderer block={b} />;
    }
    case "callout": return <RouteCard b={b} kicker={kicker} />;
    // ponytail: no content page uses deliverables; the shared view renders it until one does
    case "deliverables": return <BlockRenderer block={b} />;
  }
}
