import { Confirm } from "@/components/legal/Confirm";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Accessibility Statement | JU Plumbing Takeoff",
  description:
    "Draft accessibility statement for JU Plumbing Takeoff: our WCAG 2.1 Level AA target, what the site includes, and how to reach us if you have trouble.",
  path: "/accessibility",
  noindex: true,
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      path="/accessibility"
      h1="Accessibility statement"
      lead="Our commitment to an accessible website, and how to reach us if something is hard to use."
    >
      <p>
        We want everyone to be able to use this website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1
        Level AA and review the site regularly.
      </p>

      <h2>What the site includes</h2>
      <ul className="list-disc">
        <li>A &quot;Skip to content&quot; link at the top of every page</li>
        <li>A visible focus outline for keyboard users</li>
        <li>Smooth scrolling and transitions are reduced when your device asks for reduced motion</li>
        <li>One main heading per page, with section headings in order, so screen reader users can move between sections</li>
        <li>Text names for the plumbing drawings, and drawing colors that are always paired with a text label</li>
      </ul>
      <p>
        <Confirm>check each item above against the live site before this page is published</Confirm>
      </p>

      <h2>Known limitations</h2>
      <p>
        <Confirm>list any known accessibility issues, or state that none are known, after an accessibility review of the live site</Confirm>
      </p>

      <h2>Contact us about accessibility</h2>
      <p>
        If you have trouble using any part of the site, or need a document in another format, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.display}</a>. We will
        respond within <Confirm>response time, for example 2</Confirm> business days and help you get the information you need.
      </p>
      <p>We take calls {SITE.hours.map((h) => `${h.days}, ${h.time}`).join("; ")}. Email is monitored outside these hours.</p>
    </LegalPage>
  );
}
