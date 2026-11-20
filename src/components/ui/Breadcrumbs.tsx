import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb trail (inside dark heroes). The matching BreadcrumbList JSON-LD is emitted by the page template. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label}>
              {last || !c.href ? <span aria-current={last ? "page" : undefined}>{c.label}</span> : <Link href={c.href}>{c.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
