import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type {
  Block, CalloutBlock, CardsBlock, CompareBlock, DeliverablesBlock, IllustrationName, ImageRef,
  ListBlock, ProseBlock, ScopeBlock, StepsBlock, TableBlock,
} from "@/content/types";
import { Section, SectionHead } from "@/components/ui/Section";
import { Rich } from "@/components/ui/Rich";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Illustration } from "@/components/illustrations/Illustration";
import { plain } from "@/lib/schema";
import { cx } from "@/lib/utils";

function Media({ illustration, image }: { illustration?: IllustrationName; image?: ImageRef }) {
  if (!illustration && !image) return null;
  return (
    <div className="media-frame">
      {illustration ? (
        <Illustration name={illustration} />
      ) : (
        image && <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 900px) 520px, 100vw" />
      )}
    </div>
  );
}

const Paras = ({ items }: { items: string[] }) =>
  items.map((p, i) => (
    <p key={i}>
      <Rich text={p} />
    </p>
  ));

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="bul">
    {items.map((x, i) => (
      <li key={i}>
        <Rich text={x} />
      </li>
    ))}
  </ul>
);

function ProseView({ b }: { b: ProseBlock }) {
  const copy = (
    <div className="copy">
      <Paras items={b.paragraphs} />
      {b.bullets && <Bullets items={b.bullets} />}
    </div>
  );
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      {b.illustration || b.image ? (
        <div className="split">
          {copy}
          <Media illustration={b.illustration} image={b.image} />
        </div>
      ) : (
        copy
      )}
    </Section>
  );
}

function ScopeView({ b }: { b: ScopeBlock }) {
  const hasMedia = Boolean(b.illustration || b.image);
  const list = (
    <div>
      <ul className={cx("scope-list", !hasMedia && "cols")}>
        {b.items.map((it) => (
          <li key={it.label}>
            <span>
              <span className="lbl">
                <Rich text={it.label} />
              </span>
              {it.note && (
                <span className="note">
                  <Rich text={it.note} />
                </span>
              )}
            </span>
            <span className="unit">{it.unit}</span>
          </li>
        ))}
      </ul>
      {b.footnote && (
        <p className="scope-foot">
          <Rich text={b.footnote} />
        </p>
      )}
    </div>
  );
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      {hasMedia ? (
        <div className="split">
          {list}
          <Media illustration={b.illustration} image={b.image} />
        </div>
      ) : (
        list
      )}
    </Section>
  );
}

function CardsView({ b }: { b: CardsBlock }) {
  const cols = b.columns ?? 3;
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      <div className={cx("cards", cols === 3 && "c3", cols === 4 && "c4")}>
        {b.cards.map((c) => (
          <article key={c.title} className={cx("card", c.href && "link")}>
            {c.icon && (
              <span className="card-ico" data-c={c.color}>
                <Icon name={c.icon} size={22} />
              </span>
            )}
            {c.tag && <span className="tag">{c.tag}</span>}
            <h3>
              {c.href ? (
                <Link href={c.href} className="stretch">
                  {plain(c.title)}
                </Link>
              ) : (
                <Rich text={c.title} />
              )}
            </h3>
            {/* Linked cards use plain text: inline links would sit under the stretched card link. */}
            <p>{c.href ? plain(c.body) : <Rich text={c.body} />}</p>
            {c.href && (
              <span className="go" aria-hidden="true">
                Explore <ArrowRight size={16} />
              </span>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

function CompareView({ b }: { b: CompareBlock }) {
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      <div className="compare" style={{ "--n": b.columns.length } as React.CSSProperties}>
        {b.columns.map((c) => (
          <div key={c.title} className="col">
            <h3>
              <Rich text={c.title} />
            </h3>
            <p>
              <Rich text={c.body} />
            </p>
            {c.points && <Bullets items={c.points} />}
            {c.footer && (
              <p className="foot">
                <Rich text={c.footer} />
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function ListView({ b }: { b: ListBlock }) {
  const Tag = b.numbered ? "ol" : "ul";
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      <Tag className={cx("ilist", b.numbered && "num")}>
        {b.items.map((it) => (
          <li key={it.title}>
            <strong>
              <Rich text={it.title} />
            </strong>
            <Rich text={it.body} />
          </li>
        ))}
      </Tag>
    </Section>
  );
}

export function StepsView({ b }: { b: StepsBlock }) {
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      <ol className="steps">
        {b.steps.map((s, i) => (
          <li key={s.title} className="step">
            <span className="n" aria-hidden="true">
              {i + 1}
            </span>
            <h3>
              <Rich text={s.title} />
            </h3>
            <p>
              <Rich text={s.body} />
            </p>
          </li>
        ))}
      </ol>
      {b.cta && (
        <div style={{ marginTop: 32 }}>
          <ButtonLink href={b.cta.href} size="lg" arrow>
            {b.cta.label}
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}

const isNumeric = (s: string) => /^[\d,.\-–$%+()/\s]+$/.test(s.trim());

function TableView({ b }: { b: TableBlock }) {
  const sheet = b.variant === "sheet";
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      {sheet ? (
        <div className="sheet">
          <div className="sheet-bar">
            <span className="sheet-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Illustrative layout. Figures are examples, not project data.</span>
          </div>
          <div className="sheet-scroll" tabIndex={0} role="group" aria-label={b.caption}>
            <table>
              <caption>{b.caption}</caption>
              <thead>
                <tr>
                  <th className="rn" scope="col">
                    <span className="sr-only">Row</span>
                  </th>
                  {b.head.map((h, i) => (
                    <th key={h} scope="col" className={cx(b.rows.every((r) => isNumeric(r[i] ?? "")) && "r")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri}>
                    <td className="rn">{ri + 1}</td>
                    {r.map((cell, ci) => (
                      <td key={ci} className={cx(isNumeric(cell) && "r")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="tbl-wrap" tabIndex={0} role="group" aria-label={b.caption}>
          <table className="tbl">
            <caption>{b.caption}</caption>
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((cell, ci) =>
                    ci === 0 ? (
                      <th key={ci} scope="row">
                        <Rich text={cell} />
                      </th>
                    ) : (
                      <td key={ci}>
                        <Rich text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {b.note && (
        <p className="tbl-note">
          <Rich text={b.note} />
        </p>
      )}
    </Section>
  );
}

function DeliverablesView({ b }: { b: DeliverablesBlock }) {
  return (
    <Section id={b.id} tone={b.tone}>
      <SectionHead id={b.id} h2={b.h2} intro={b.intro} />
      <div className="cards c3">
        {b.items.map((it) => (
          <article key={it.title} className="card">
            <span className="card-ico">
              <Icon name={it.icon ?? "file-check"} size={22} />
            </span>
            <h3>
              <Rich text={it.title} />
            </h3>
            <p>
              <Rich text={it.body} />
            </p>
          </article>
        ))}
      </div>
      {b.cta && (
        <div style={{ marginTop: 32 }}>
          <ButtonLink href={b.cta.href} variant="outline" arrow>
            {b.cta.label}
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}

function CalloutView({ b }: { b: CalloutBlock }) {
  return (
    <Section id={b.id} tone={b.tone} className="compact">
      <div className="callout">
        <div>
          <h2 id={`${b.id}-h`}>
            <Rich text={b.h2} />
          </h2>
          <p>
            <Rich text={b.body} />
          </p>
        </div>
        {b.cta && (
          <ButtonLink href={b.cta.href} size="lg" arrow>
            {b.cta.label}
          </ButtonLink>
        )}
      </div>
    </Section>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "prose": return <ProseView b={block} />;
    case "scope": return <ScopeView b={block} />;
    case "cards": return <CardsView b={block} />;
    case "compare": return <CompareView b={block} />;
    case "list": return <ListView b={block} />;
    case "steps": return <StepsView b={block} />;
    case "table": return <TableView b={block} />;
    case "deliverables": return <DeliverablesView b={block} />;
    case "callout": return <CalloutView b={block} />;
  }
}
