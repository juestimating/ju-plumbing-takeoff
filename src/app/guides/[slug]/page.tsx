import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GithubSlugger from "github-slugger";
import { GuidePage } from "@/components/page/GuidePage";
import type { TocItem } from "@/components/page/guide/GuideNav";
import { H2_SYSTEMS } from "@/components/page/guide/template";
import { GUIDES, getGuide } from "@/content/guides";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.meta.slug }));
}

/**
 * Table of contents (h2s with their h3s) and the number of top-level list items, from the MDX source. Uses the same
 * slugger as rehype-slug, so anchors match the rendered ids. System h2s carry their legend colors.
 */
function readGuide(slug: string): { toc: TocItem[]; items: number } {
  const src = fs.readFileSync(path.join(process.cwd(), "src/content/guides", `${slug}.mdx`), "utf8");
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let items = 0;
  let fenced = false;
  for (const line of src.split(/\r?\n/)) {
    if (line.startsWith("```")) fenced = !fenced;
    if (fenced) continue;
    if (/^(- |\d+\. )/.test(line)) items++;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2]!.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
    const id = slugger.slug(text);
    const h2 = toc.at(-1);
    if (m[1] === "##" || !h2) toc.push({ id, text, ...(H2_SYSTEMS[id] && { systems: H2_SYSTEMS[id] }) });
    else (h2.children ??= []).push({ id, text });
  }
  return { toc, items };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  const { meta } = guide;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: `/guides/${meta.slug}`,
    keywords: meta.keywords,
    type: "article",
    published: meta.datePublished,
    modified: meta.dateModified,
  });
}

export default async function Guide({ params }: Props) {
  const slug = (await params).slug;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const { toc, items } = readGuide(slug);
  return <GuidePage guide={guide} toc={toc} items={items} />;
}
