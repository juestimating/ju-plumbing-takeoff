import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { navServices } from "@/lib/nav";
import { CLAIMS, COMPANY_LINKS, LEGAL_LINKS, SITE, mapsUrl, officeLine } from "@/lib/site";

export function Footer() {
  return (
    <footer className="ft">
      <div className="container-ju">
        <div className="ft-grid">
          <div className="ft-brand">
            <Logo light />
            <p style={{ marginTop: 18, maxWidth: "38ch" }}>
              Plumbing takeoff and estimating for contractors in {CLAIMS.states}. A{" "}
              <a href={SITE.parentUrl} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                JU Estimating
              </a>{" "}
              service with {CLAIMS.years} years of estimating, trusted by {CLAIMS.contractors} contractors across all trades.
            </p>
            <p style={{ display: "grid", gap: 8 }}>
              <a href={`tel:${SITE.phone.tel}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700 }}>
                <Phone size={18} aria-hidden="true" />
                {SITE.phone.display}
              </a>
              <a href={`mailto:${SITE.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Mail size={18} aria-hidden="true" />
                {SITE.email}
              </a>
            </p>
          </div>

          <nav aria-label="Footer: services">
            <p className="ft-title">Services</p>
            <ul>
              {navServices.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/services">All services</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer: company">
            <p className="ft-title">Company</p>
            <ul>
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft-offices">
            <p className="ft-title">Our offices</p>
            {SITE.offices.map((o) => (
              <address key={o.role} style={{ marginBottom: 14 }}>
                <strong style={{ color: "#fff" }}>{o.role}</strong>
                <br />
                {officeLine(o)}
                <br />
                <a href={mapsUrl(o)} aria-label={`Get directions to the ${o.role.toLowerCase()} in ${o.city}, ${o.region}`}>
                  Get directions
                </a>
              </address>
            ))}
            {SITE.hours.map((h) => (
              <p key={h.days} style={{ margin: 0, fontSize: ".92rem" }}>
                {h.days}: {h.time}
              </p>
            ))}
          </div>
        </div>

        <div className="ft-bottom">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <nav className="ft-legal" aria-label="Legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
