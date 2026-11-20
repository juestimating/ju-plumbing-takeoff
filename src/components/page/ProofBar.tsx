import type { Tone } from "@/content/types";
import { PROOF_ITEMS, SITE } from "@/lib/site";
import { FactCard } from "./FactCard";

/** What every order includes, as the floating fact card, with the office line (NAP order) as its note. */
export function ProofBar({ items = PROOF_ITEMS, tone = "light" }: { items?: typeof PROOF_ITEMS; tone?: Tone }) {
  const [head, regional] = SITE.offices.map((o) => `${o.city}, ${o.region}`);
  return (
    <FactCard
      title="What every order includes"
      note={`A service of ${SITE.legalName}. Head office in ${head}, regional office in ${regional}.`}
      facts={items}
      tone={tone}
    />
  );
}
