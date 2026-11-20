import { Children, isValidElement, useId, type ComponentProps, type ReactNode } from "react";
import { ArrowRight, Eye, Info, Lightbulb, ListChecks, TriangleAlert } from "lucide-react";
import { H2_SYSTEMS } from "@/components/page/guide/template";
import { ButtonLink } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { CLAIMS } from "@/lib/site";
import { cx, toQuoteForm } from "@/lib/utils";
import { keepTogether } from "./keep";

/**
 * Components available inside guide .mdx files (in addition to standard Markdown):
 *   <Callout type="tip|warn|note" title="...">paragraphs</Callout>
 *   <KeyTakeaways title="Key takeaways">- bullet list</KeyTakeaways>
 *   <Cta title="..." href="/services/..." label="See ... services">one sentence</Cta>
 *     The button always opens the quote form (on the service the href names). href and label add a plain link.
 * None of them render headings, so the guide outline stays h1 (layout) > h2 > h3.
 * Leave a blank line between the tag and any Markdown inside it.
 * The element overrides below (p, h2, ul, ol, li) only change markup around the text, never the text. In paragraphs,
 * list items and the banner line, "24–72 hours" and ranges like "±5–10%" stay on one line (keepTogether).
 */
const ICON = { warn: TriangleAlert, tip: Lightbulb, note: Info } as const;

export function Callout({ type = "note", title, children }: { type?: "tip" | "warn" | "note"; title?: string; children: ReactNode }) {
  const I = ICON[type];
  return (
    <aside className={cx("mdx-callout", type)}>
      <span className="ico" aria-hidden="true">
        <I size={20} />
      </span>
      <div>
        {title && <span className="t">{title}</span>}
        {children}
      </div>
    </aside>
  );
}

export function KeyTakeaways({ title = "Key takeaways", children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="takeaways">
      <span className="t">
        <span className="hr-tile sm" aria-hidden="true">
          <ListChecks size={20} />
        </span>
        {title}
      </span>
      {children}
    </aside>
  );
}

/** Quote form on the service a guide's banner points at (a /services/<slug> href), else the plain form. */
const quoteFor = (href: string) => {
  const m = /^\/services\/([a-z0-9-]+)/.exec(href);
  return m ? `/contact?service=${m[1]}` : "/contact";
};

/** The one banner per guide, where the content places it: a navy panel with the quote button and its timing line. */
export function Cta({ title, href = "/contact", label = "Get a fixed quote", children }: { title: string; href?: string; label?: string; children?: ReactNode }) {
  const other = href !== "/contact";
  return (
    <aside className="inline-cta tone-dark">
      <div>
        <span className="kicker">Next step</span>
        <span className="t">{title}</span>
        {children && <p>{keepTogether(children)}</p>}
        {other && (
          <p>
            <SmartLink href={href} className="arrow-link">
              {label}
              <ArrowRight size={16} aria-hidden="true" />
            </SmartLink>
          </p>
        )}
      </div>
      <div className="go">
        <ButtonLink href={quoteFor(href)} arrow>
          Get a fixed quote
        </ButtonLink>
        <small>Fixed quote {CLAIMS.quote}.</small>
      </div>
    </aside>
  );
}

export function MdxLink({ href = "", children, ...rest }: ComponentProps<"a">) {
  return (
    <SmartLink href={toQuoteForm(href)} {...rest}>
      {children}
    </SmartLink>
  );
}

/** Plain text of server-rendered MDX children (cells, list items, strong). */
export function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** "**Watch for:** ..." paragraphs (the checklist's most common miss per group) become a flagged note. */
export function MdxP({ children, ...rest }: ComponentProps<"p">) {
  const first = Children.toArray(children)[0];
  if (isValidElement(first) && first.type === "strong" && textOf(first) === "Watch for:") {
    return (
      <p className="watch" {...rest}>
        <span className="ico" aria-hidden="true">
          <Eye size={18} />
        </span>
        <span>{keepTogether(children)}</span>
      </p>
    );
  }
  return <p {...rest}>{keepTogether(children)}</p>;
}

export const MdxLi = ({ children, ...rest }: ComponentProps<"li">) => <li {...rest}>{keepTogether(children)}</li>;

/** Article h2: system h2s (H2_SYSTEMS) draw their legend lines over the text; others get the amber rule in CSS. */
export function MdxH2({ id, children, ...rest }: ComponentProps<"h2">) {
  const sys = id ? H2_SYSTEMS[id] : undefined;
  return (
    <h2 id={id} {...rest}>
      {sys && (
        <span className="sys" aria-hidden="true">
          {sys.map((c) => (
            <i key={c} className="legend-line" data-c={c} />
          ))}
        </span>
      )}
      {children}
    </h2>
  );
}

/** list-style: none drops list semantics in Safari, so the custom-marker lists say they are lists. */
export const MdxUl = (props: ComponentProps<"ul">) => <ul role="list" {...props} />;
export const MdxOl = (props: ComponentProps<"ol">) => <ol role="list" {...props} />;

/**
 * Checklist item (only on the two checklist guides, passed as <Body components={{ li: TickLi }} />): a native
 * checkbox before the unchanged text. The item's bold lead is the box's <label> (an item without one is labelled
 * whole, unless it holds a link), so a click or tap on it ticks too. Ticks work without JS; GuideNav counts and
 * saves them.
 */
export function TickLi({ children, ...rest }: ComponentProps<"li">) {
  const id = useId();
  const kids = Children.toArray(keepTogether(children));
  const at = kids.findIndex((c) => isValidElement(c) && c.type === "strong");
  const linked = kids.some((c) => isValidElement<{ href?: string }>(c) && c.props.href !== undefined);
  if (at >= 0)
    kids[at] = (
      <label key="lead" htmlFor={id}>
        {kids[at]}
      </label>
    );
  const name = at < 0 && linked ? textOf(children).trim().split(/\s+/).slice(0, 8).join(" ") : undefined;
  return (
    <li className="tick-li" {...rest}>
      <input id={id} type="checkbox" className="tick" data-tick="" aria-label={name} />
      {at < 0 && !linked ? <label htmlFor={id}>{kids}</label> : kids}
    </li>
  );
}
