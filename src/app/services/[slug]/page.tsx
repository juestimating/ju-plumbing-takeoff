import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/page/ContentPage";
import { SERVICES, getPage, pagePath } from "@/content/registry";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: pagePath(page), keywords: page.seo.keywords });
}

export default async function ServicePage({ params }: Props) {
  const page = getPage((await params).slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
