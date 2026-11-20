import type { MDXComponents } from "mdx/types";
import { Callout, Cta, KeyTakeaways, MdxH2, MdxLi, MdxLink, MdxOl, MdxP, MdxUl } from "@/components/mdx/Mdx";
import { MdxTable } from "@/components/mdx/MdxTable";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: MdxLink,
    table: MdxTable,
    p: MdxP,
    h2: MdxH2,
    ul: MdxUl,
    ol: MdxOl,
    li: MdxLi,
    Callout,
    KeyTakeaways,
    Cta,
  };
}
