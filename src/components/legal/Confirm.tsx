import type { ReactNode } from "react";

/**
 * Visible placeholder for a term the client or counsel still has to settle. The legal pages stay
 * noindex drafts until every one of these is resolved: write what is missing, never hide the marker.
 */
export function Confirm({ children }: { children: ReactNode }) {
  return <mark className="confirm">CONFIRM: {children}</mark>;
}
