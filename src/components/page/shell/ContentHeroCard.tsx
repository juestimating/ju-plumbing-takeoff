import { COPY, heroDrawing } from "@/content/template";
import type { Link, PageContent } from "@/content/types";
import { HeroCard } from "../PageHero";

/** The content pages' hero card: the page's drawing, the price and turnaround badges, the three hero bullets and the exit link. */
export function ContentHeroCard({ page, link }: { page: PageContent; link?: Link }) {
  return (
    <HeroCard
      illustration={heroDrawing(page)}
      image={page.hero.image}
      bullets={page.hero.bullets}
      label={page.price.from === null ? COPY.price.labelCustom : COPY.price.label}
      price={page.price.display}
      turnaround={page.price.turnaround}
      note={page.price.note}
      link={link}
    />
  );
}
