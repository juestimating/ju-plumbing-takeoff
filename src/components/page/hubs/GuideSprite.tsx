"use client";

import { StripSprite, type StripName } from "@/components/illustrations/strips";

/**
 * The guide strips as one sprite, rendered from a client component on purpose: the symbols reach the HTML once and
 * their code sits in a cached chunk, instead of a second copy in the page's RSC payload (about 20 KB on /guides).
 */
export function GuideSprite({ names }: { names: StripName[] }) {
  return <StripSprite names={names} />;
}
