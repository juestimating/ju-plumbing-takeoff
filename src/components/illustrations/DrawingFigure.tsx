import type { IllustrationName } from "@/content/types";
import { cx } from "@/lib/utils";
import { Illustration } from "./Illustration";

/**
 * A drawing shown as evidence: the sheet in a frame with the honesty strip under it, as in the home system explorer
 * (styles: `.drawing-fig` in src/styles/kit.css; a module class on `className` restyles it).
 */
export function DrawingFigure({
  name,
  caption = ["Illustrative drawing", "Not to scale"],
  className,
}: {
  name: IllustrationName;
  caption?: [string, string];
  className?: string;
}) {
  return (
    <figure className={cx("drawing-fig", className)}>
      <Illustration name={name} />
      <figcaption>
        <span>{caption[0]}</span>
        <span>{caption[1]}</span>
      </figcaption>
    </figure>
  );
}
