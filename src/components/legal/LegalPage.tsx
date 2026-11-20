import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import GithubSlugger from "github-slugger";
import Link from "next/link";
import { Confirm } from "./Confirm";
import { PageHero } from "@/components/page/PageHero";
import { PageJump, type JumpItem } from "@/components/page/PageJump";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, webPageNode } from "@/lib/schema";
import { LEGAL_LINKS, SITE, officeLine } from "@/lib/site";
import s from "./legal.module.css";

/** Printed as "Last updated" on every legal draft. Change it when the legal text changes, not when the site is re-reviewed. */
export const LEGAL_UPDATED = "Draft, November 2026";

type Props = {
  /** Route path, e.g. "/privacy-policy". */
  path: string;
  /** The page's ONE <h1>, sentence case. */
  h1: string;
  /** One plain sentence under the h1. */
  lead: string;
  /** Prose body: one <h2> per section (direct children, they get the ids the contents link to), <h3> only inside a section. */
  children: ReactNode;
};

/** The text inside a heading, however it is nested. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/**
 * Shared shell for the five legal drafts: a slim navy hero with the h1 and the byline, then the document as a white
 * card on the alt band: the draft notice as an amber callout, the body in .prose-ju. Every top-level h2 gets an id
 * (github-slugger, as the guides do), and the same list feeds the contents: a sticky rail beside the card from
 * 1100px, a disclosure above it below that. The other policies follow as chips. Pages that use it must also pass
 * `noindex: true` to buildMetadata until counsel approves the text.
 */
export function LegalPage({ path, h1, lead, children }: Props) {
  const slugger = new GithubSlugger();
  const toc: JumpItem[] = [];
  const body = Children.toArray(children).map((child) => {
    if (!isValidElement<{ id?: string; children?: ReactNode }>(child) || child.type !== "h2") return child;
    const label = textOf(child.props.children);
    const id = child.props.id ?? slugger.slug(label);
    toc.push({ id, label });
    return cloneElement(child, { id });
  });
  const others = LEGAL_LINKS.filter((l) => l.href !== path);
  return (
    <>
      <JsonLd
        nodes={[
          webPageNode({ path, name: h1, description: lead }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: h1, path },
          ]),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: h1 }]}
        kicker="Legal"
        h1={h1}
        lead={lead}
        variant="slim"
        extra={
          <p className="byline">
            <span>
              Last updated: <b>{LEGAL_UPDATED}</b>
            </span>
          </p>
        }
      />
      <Section tone="alt">
        <div className={s.layout}>
          {toc.length > 0 && (
            <>
              <nav aria-label="On this page" className={s.tocM}>
                <details className="toc-m">
                  <summary>On this page</summary>
                  <ol>
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`}>{t.label}</a>
                      </li>
                    ))}
                  </ol>
                </details>
              </nav>
              <div className={s.rail}>
                <PageJump items={toc} variant="rail" />
              </div>
            </>
          )}
          <article className={s.doc}>
            <p className={s.draft}>
              <span className="hr-tile sm" aria-hidden="true">
                <Icon name="info" />
              </span>
              <span>
                <strong>Draft for attorney review.</strong> This page is not final legal text. Highlighted items are waiting for client
                confirmation, and the page is hidden from search engines until it is approved.
              </span>
            </p>
            <div className="prose-ju">{body}</div>
          </article>
          {others.length > 0 && (
            <nav aria-labelledby="other-policies" className={s.others}>
              <p id="other-policies" className={s.othersLabel}>
                Other policies
              </p>
              <ul role="list">
                {others.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={s.chip}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Section>
    </>
  );
}

/** Contact block for the end of a legal page. Address, email and phone come from SITE so they cannot drift. */
export function LegalContact() {
  const headOffice = SITE.offices[0];
  return (
    <address className={s.contact}>
      <strong>{SITE.legalName}</strong> <Confirm>state of organization</Confirm>
      <br />
      {officeLine(headOffice)}
      <br />
      Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · Phone: <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.display}</a>
    </address>
  );
}
