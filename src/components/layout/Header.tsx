import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { MobileNav } from "./MobileNav";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { navServices, type NavItem } from "@/lib/nav";
import { CLAIMS, SITE } from "@/lib/site";

function MegaLink({ item }: { item: NavItem }) {
  return (
    <Link href={item.href} className="mega-link">
      <span className="mega-ico" data-c={item.color}>
        <Icon name={item.icon ?? "wrench"} size={20} />
      </span>
      <span>
        <span className="mega-t">{item.label}</span>
        <span className="mega-d">{item.blurb}</span>
      </span>
    </Link>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="mega-feature">
      <span className="kicker">{CLAIMS.quoteShort}</span>
      <p className="mega-price">Takeoffs from $149</p>
      <p style={{ color: "#fff", fontWeight: 700 }}>{title}</p>
      <p>{text}</p>
      <ButtonLink href="/contact" arrow>
        Get a fixed quote
      </ButtonLink>
    </div>
  );
}

function ServicesPanel() {
  return (
    <div className="mega-inner">
      <div className="mega-list">
        {navServices.map((s) => (
          <MegaLink key={s.href} item={s} />
        ))}
        <Link href="/services" className="arrow-link mega-all">
          View all services
        </Link>
      </div>
      <Feature title="Plans in, measured quantities out." text={`Unlocked Excel, PDF summary and marked-up plans in ${CLAIMS.turnaround}. ${CLAIMS.nda}.`} />
    </div>
  );
}

const TOP_LINKS = [
  { id: "pricing", label: "Pricing", href: "/pricing" },
  { id: "samples", label: "Samples", href: "/samples" },
  { id: "guides", label: "Guides", href: "/guides" },
  { id: "about", label: "About", href: "/about" },
];

export function Header() {
  return (
    <header className="hdr">
      <div className="container-ju hdr-in">
        <Logo />
        <NavMenu
          items={[
            { id: "services", label: "Services", panel: <ServicesPanel /> },
            ...TOP_LINKS,
          ]}
        />
        <div className="hdr-actions">
          <a className="hdr-phone" href={`tel:${SITE.phone.tel}`}>
            <Phone size={18} aria-hidden="true" />
            {SITE.phone.display}
          </a>
          <ButtonLink href="/contact" className="hdr-cta" pill>
            Get a fixed quote
          </ButtonLink>
          <MobileNav logo={<Logo />}>
            <details>
              <summary>
                Services
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              {navServices.map((s) => (
                <Link key={s.href} href={s.href} className="mlink">
                  {s.label}
                </Link>
              ))}
              <Link href="/services" className="mlink arrow-link">
                View all services
              </Link>
            </details>
            {TOP_LINKS.map((l) => (
              <Link key={l.id} href={l.href} className="mlink mlink-top">
                {l.label}
              </Link>
            ))}
            <div className="mnav-cta">
              <ButtonLink href="/contact" size="lg" block arrow>
                Get a fixed quote
              </ButtonLink>
              <ButtonLink href={`tel:${SITE.phone.tel}`} variant="outline" size="lg" block>
                <Phone size={18} aria-hidden="true" /> Call {SITE.phone.display}
              </ButtonLink>
            </div>
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
