import type { ReactNode } from "react";
import { Rich } from "./Rich";
import { cx } from "@/lib/utils";
import type { Tone } from "@/content/types";
import s from "./section.module.css";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("container-ju", className)}>{children}</div>;
}

/** A page section. Pass `id` and give its heading the id `${id}-h` so aria-labelledby resolves. */
export function Section({
  id, tone = "light", className, children,
}: { id?: string; tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className={cx("sec", `tone-${tone}`, className)}>
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Section heading block. Always renders the section's <h2>; `as="h3"` is only for nested headings.
 * `layout="split"` puts the kicker and h2 on the left and the intro on the right from 1024px; `"center"` equals `center`.
 */
export function SectionHead({
  id, h2, intro, kicker, center, layout, as: H = "h2",
}: { id?: string; h2: string; intro?: string; kicker?: string; center?: boolean; layout?: "split" | "center"; as?: "h2" | "h3" }) {
  return (
    <div className={cx("sec-head", (center || layout === "center") && "center", layout === "split" && s.split)}>
      {kicker && <span className="kicker">{kicker}</span>}
      <H id={id ? `${id}-h` : undefined}>
        <Rich text={h2} />
      </H>
      {intro && (
        <p className="sec-intro">
          <Rich text={intro} />
        </p>
      )}
    </div>
  );
}
