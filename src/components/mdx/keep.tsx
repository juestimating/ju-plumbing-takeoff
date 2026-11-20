import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const RANGE = /(\d+–\d+ hours|±\d+–\d+%)/;

/**
 * Keeps "24–72 hours" and ranges like "±5–10%" on one line inside table cells and readouts: each match gets a
 * nowrap span, the text itself is unchanged. Plain module (no hooks), so the server table and the client
 * readout both use it.
 */
export function keepTogether(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    const parts = node.split(RANGE);
    return parts.length < 2
      ? node
      : parts.map((p, i) =>
          i % 2 ? (
            <span key={i} className="whitespace-nowrap">
              {p}
            </span>
          ) : (
            p
          ),
        );
  }
  if (Array.isArray(node)) return Children.map(node, keepTogether);
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children != null) {
    return cloneElement(node, undefined, keepTogether(node.props.children));
  }
  return node;
}
