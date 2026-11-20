import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";
import { toQuoteForm } from "@/lib/utils";

const TOKEN = /(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*)/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
const BOLD = /^\*\*([^*]+)\*\*$/;

/** Tiny inline renderer for content strings: [text](/path) and **bold**. Keeps content files free of JSX. */
export function Rich({ text }: { text: string }): ReactNode {
  return richNodes(text);
}

/** Rich's output as plain nodes, for callers that post-process it (e.g. keepTogether on FAQ answers). */
export function richNodes(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const link = LINK.exec(part);
    if (link) {
      return (
        <SmartLink key={i} href={toQuoteForm(link[2]!)}>
          {link[1]}
        </SmartLink>
      );
    }
    const bold = BOLD.exec(part);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return part;
  });
}
