import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { SmartLink } from "./SmartLink";
import { cx, toQuoteForm } from "@/lib/utils";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  variant?: "primary" | "navy" | "outline";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
  block?: boolean;
  arrow?: boolean;
};

/** The one button. Primary = amber (the conversion action), navy, or outline (auto-inverts on dark sections). */
export function ButtonLink({
  href, variant = "primary", size = "md", pill, block, arrow, className, children, ...rest
}: Props) {
  // Quote buttons (amber or outline) skip the /contact hero and land on the form (about 1,350px down on a phone).
  const to = toQuoteForm(href);
  return (
    <SmartLink
      href={to}
      className={cx("btn", `btn-${variant}`, size !== "md" && `btn-${size}`, pill && "btn-pill", block && "btn-block", className)}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight size={18} aria-hidden="true" />}
    </SmartLink>
  );
}
