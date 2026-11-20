import Link from "next/link";
import { Confirm } from "@/components/legal/Confirm";
import { LegalContact, LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy | JU Plumbing Takeoff",
  description:
    "Draft privacy policy for JU Plumbing Takeoff, a service of JU Estimating LLC: what the quote form and site analytics collect, and how your plans stay private.",
  path: "/privacy-policy",
  noindex: true,
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path="/privacy-policy"
      h1="Privacy policy"
      lead="How JU Plumbing Takeoff collects, uses and protects information, including the plans and pricing you send us."
    >
      <p>
        This Privacy Policy explains how JU Estimating LLC{" "}
        <Confirm>state of organization, for example &quot;an Ohio limited liability company&quot;</Confirm> (&quot;JU Estimating&quot;,
        &quot;we&quot;, &quot;us&quot;) collects, uses and protects information when you visit this website or use our plumbing takeoff and
        estimating services. JU Plumbing Takeoff is a service of JU Estimating LLC.
      </p>

      <h2>Information we collect</h2>
      <h3>Information you give us</h3>
      <ul className="list-disc">
        <li>
          <strong>Contact details:</strong> name, email address, phone number and company name, entered in the quote form or sent to us by
          email or phone.
        </li>
        <li>
          <strong>Project information:</strong> the project details, plan links and notes you enter in the quote form, and the drawings,
          specifications, addenda, photos, pricing, rates and templates you send us for a quote or project.
        </li>
        <li>
          <strong>Billing information:</strong> the details we need to invoice you. No payment is taken on this website. Payment details are
          handled by{" "}
          <Confirm>payment provider or invoicing tool, for example Stripe, QuickBooks or PayPal</Confirm>. We do not store full card numbers.
        </li>
        <li>
          <strong>Communications:</strong> emails, calls and messages with us.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul className="list-disc">
        <li>
          <strong>Quote form visit details:</strong> when you send the quote form, we also record the page you were on, the page that
          referred you and any campaign tags (utm_ values) in the address, so we know which page prompted the request. Your IP address is
          used only to limit repeated submissions and is not saved with the request.
        </li>
        <li>
          <strong>Hosting data:</strong> this site is hosted on Vercel, which receives your IP address, browser type and request details when
          you load a page, so it can serve the site.
        </li>
        <li>
          <strong>Analytics data:</strong> we use Vercel Web Analytics and Vercel Speed Insights to count page views and measure page speed.
          They report the pages visited, referring site, browser, device type, approximate location and page-load speed. Neither tool sets
          cookies, and their reports are not tied to an individual visitor.
        </li>
        <li>
          <Confirm>
            whether Google Analytics 4, or any other analytics or advertising tag, is switched on for this site. If so, list each one here
            with the data it collects
          </Confirm>
        </li>
      </ul>
      <p>
        See our <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>

      <h2>How we use information</h2>
      <ul className="list-disc">
        <li>To prepare quotes, plumbing takeoffs, estimates and other deliverables</li>
        <li>To communicate with you about your projects and requests</li>
        <li>To process payments and keep business records</li>
        <li>To improve our website and services</li>
        <li>
          To send service updates and, if you opt in, occasional newsletters (you can unsubscribe at any time){" "}
          <Confirm>whether newsletters are sent from this site</Confirm>
        </li>
        <li>To comply with legal obligations and protect our rights</li>
      </ul>

      <h2>Your project files are confidential</h2>
      <p>
        Drawings, specifications, pricing and other project documents you send are used only to deliver your work. We do not sell them,
        share them with other clients or use them to bid construction work, because we do not bid or build construction work. We
        sign non-disclosure agreements on request.
      </p>

      <h2>How we share information</h2>
      <p>We do not sell personal information. We share information only:</p>
      <ul className="list-disc">
        <li>
          With service providers who help us run the business, such as hosting, email delivery, file storage, payment processing and
          analytics, under confidentiality obligations. This site uses Vercel for hosting and analytics, and quote requests may be sent to
          us through an email delivery provider.{" "}
          <Confirm>
            name the email delivery provider, for example Resend, and any CRM or automation tool that receives leads. List providers by name
            or category
          </Confirm>
        </li>
        <li>With members of our estimating team who work on your project</li>
        <li>When required by law, or to protect our rights, property or safety</li>
        <li>In connection with a merger, sale or transfer of the business, under this policy</li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We keep project files for <Confirm>retention period, for example 12 months</Confirm> after delivery so we can handle revisions and
        addenda, then delete them, or sooner on request. We keep billing records as long as required for tax and accounting purposes.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable administrative, technical and physical safeguards to protect information, including access controls and secure
        file transfer. No method of transmission or storage is completely secure, so we cannot promise absolute security.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask us to access, correct or delete your personal information, or to stop sending marketing emails, by contacting us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
        <Confirm>privacy contact email, if it should differ from the general address</Confirm>. Depending on where you live, you may have
        additional rights under state privacy laws. We will respond within the time required by applicable law.
      </p>
      <p>
        <Confirm>
          if serving EU or UK clients, add a GDPR section: legal bases, international transfers and the right to complain to a
          supervisory authority
        </Confirm>
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        Our services are for businesses and are not directed to children under 13. We do not knowingly collect information from children.
      </p>

      <h2>Third-party links</h2>
      <p>Our site may link to other websites. We are not responsible for their privacy practices.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy. The &quot;Last updated&quot; date shows when it last changed.</p>

      <h2>Contact us</h2>
      <LegalContact />
    </LegalPage>
  );
}
