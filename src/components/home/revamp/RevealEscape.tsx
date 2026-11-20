"use client";

import { useEffect } from "react";

/**
 * WCAG 1.4.13 for the audience cards (server-rendered with `data-reveal`): Escape shuts a panel the pointer opened,
 * without moving the pointer, by setting `data-shut`. The card re-arms when the pointer leaves it or focus comes in.
 * A card that holds keyboard focus is never shut, because the focused link lives inside the panel. Renders nothing.
 */
export function RevealEscape({ root }: { root: string }) {
  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>(`#${root} [data-reveal]`)];
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      for (const c of cards) if (c.matches(":hover") && !c.matches(":focus-within")) c.dataset.shut = "";
    };
    const reArm = (e: Event) => {
      delete (e.currentTarget as HTMLElement).dataset.shut;
    };
    document.addEventListener("keydown", onKey);
    for (const c of cards) {
      c.addEventListener("pointerleave", reArm);
      c.addEventListener("focusin", reArm);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      for (const c of cards) {
        c.removeEventListener("pointerleave", reArm);
        c.removeEventListener("focusin", reArm);
      }
    };
  }, [root]);
  return null;
}
