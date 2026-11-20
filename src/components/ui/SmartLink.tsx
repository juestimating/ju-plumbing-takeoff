import Link from "next/link";
import type { ComponentProps } from "react";
import { isInternal } from "@/lib/utils";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string };

/** Internal paths use next/link (prefetch, client nav). External URLs open in a new tab safely. tel:/mailto: stay plain. */
export function SmartLink({ href, children, ...rest }: Props) {
  if (isInternal(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
