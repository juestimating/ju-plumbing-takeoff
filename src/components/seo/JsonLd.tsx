import type { Node } from "@/lib/schema";

/** Renders one JSON-LD <script>. Pass an array of nodes (they are wrapped in a single @graph). */
export function JsonLd({ nodes }: { nodes: (Node | null | undefined | false)[] }) {
  const graph = nodes.filter(Boolean);
  if (!graph.length) return null;
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
