import Link from "next/link";
import { Confirm } from "@/components/legal/Confirm";
import { LegalContact, LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service | JU Plumbing Takeoff",
  description:
    "Draft terms of service for JU Plumbing Takeoff: how quotes, fees, revisions, confidentiality and the nature of plumbing takeoffs and estimates are handled.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      h1="Terms of service"
      lead="The terms that apply when you use this website, request a quote or approve a plumbing takeoff or estimate."
    >
      <p>
        These Terms of Service (&quot;Terms&quot;) apply to your use of this website and to the plumbing takeoff and estimating services
        provided by JU Estimating LLC <Confirm>legal name and state of organization</Confirm> (&quot;JU Estimating&quot;, &quot;we&quot;,
        &quot;us&quot;), which operates JU Plumbing Takeoff. By requesting a quote, approving a quote or using our services, you
        (&quot;Client&quot;, &quot;you&quot;) agree to these Terms. If a separate signed agreement exists between us, that agreement
        controls where it conflicts with these Terms.
      </p>

      <h2>1. Services</h2>
      <p>
        We provide plumbing takeoffs, cost estimates, bid preparation and related estimating services (&quot;Services&quot;), as described
        in the quote you approve. Each quote states the scope, deliverables, price and expected delivery date.
      </p>

      <h2>2. Quotes and approval</h2>
      <p>
        Quotes are free and valid for <Confirm>validity period, for example 14 days</Confirm>. Work begins when you approve the quote{" "}
        <Confirm>add &quot;and payment is received&quot; or &quot;and a deposit is received&quot; if either applies</Confirm>. Delivery times run
        from approval and receipt of a complete set of documents.
      </p>

      <h2>3. Fees and payment</h2>
      <p>
        Prices are as stated in your quote. Starting prices on our website are the minimum for each service, not offers. No payment is taken
        on this website.
      </p>
      <ul className="list-disc">
        <li>
          <strong>Payment terms:</strong>{" "}
          <Confirm>
            for example full payment on approval, a deposit with the balance on delivery, or monthly invoices due within X days
          </Confirm>
          .
        </li>
        <li>
          <strong>Accepted methods:</strong> <Confirm>payment methods</Confirm>.
        </li>
        <li>Rush delivery, added systems or major scope changes are charged as quoted.</li>
        <li>
          Monthly packages renew <Confirm>monthly, or per term</Confirm> until canceled with <Confirm>notice period, for example X days</Confirm>{" "}
          written notice. <Confirm>rollover and overage terms</Confirm>
        </li>
        <li>Late payments may delay delivery of current and future work.</li>
      </ul>

      <h2>4. Your responsibilities</h2>
      <p>You agree to:</p>
      <ul className="list-disc">
        <li>Provide complete, accurate and legible drawings, specifications and addenda, and tell us your scope and deadlines</li>
        <li>Have the right to share the documents you send us</li>
        <li>Review all deliverables before relying on them</li>
      </ul>

      <h2>5. Nature of estimates and takeoffs</h2>
      <p>
        Our plumbing takeoffs and estimates are professional opinions based on the documents and information available at the time and on
        market data that changes. Actual quantities and costs may differ because of design changes, incomplete or conflicting documents,
        site conditions, market prices, labor availability, means and methods, and other factors outside our control.
      </p>
      <ul className="list-disc">
        <li>You are responsible for your final bid, prices, markups and contract decisions.</li>
        <li>You should review and verify our work before using it.</li>
        <li>
          Accuracy ranges published on our website (for example, ±5–10% for construction-document estimates) describe typical results, not
          a promise for any project.
        </li>
        <li>We are not responsible for errors caused by inaccurate, incomplete or changed documents provided to us.</li>
        <li>
          We measure and price from the drawings as issued. Where drawings conflict or leave something out, we record it in the scope-gap
          log instead of guessing.
        </li>
        <li>
          We do not provide engineering, architectural, legal or code-compliance services unless a quote states so in writing. A takeoff is
          not a design, a pipe-sizing exercise or a hydraulic calculation.
        </li>
      </ul>

      <h2>6. Revisions</h2>
      <p>
        Revisions for addenda and corrections of our errors are included{" "}
        <Confirm>limit or time window, for example &quot;within 30 days of delivery&quot;</Confirm>. Added systems, redesigns or major scope
        changes are quoted separately. See our <Link href="/refund-policy">Refund and Revision Policy</Link>.
      </p>

      <h2>7. Confidentiality</h2>
      <p>
        We keep your documents, pricing and project information confidential and use them only to perform the Services. We sign NDAs on
        request. You agree to keep confidential any non-public pricing, templates or methods we share with you.
      </p>

      <h2>8. Ownership and use of deliverables</h2>
      <p>
        Once paid in full, you may use the deliverables for your own business purposes, including bids, budgets and project management. You
        may not resell or republish our deliverables as your own estimating product. We may keep anonymized data for internal benchmarking.
        We will not identify you or your project without permission.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        <Confirm>attorney review required for this section</Confirm>
      </p>
      <p>
        To the fullest extent permitted by law, JU Estimating&apos;s total liability arising from any Services is limited to the fees you paid
        for the specific Services giving rise to the claim. We are not liable for indirect, incidental, special or consequential damages,
        including lost profits, lost bids, or losses from contracts you enter based on our deliverables.
      </p>

      <h2>10. Website use</h2>
      <p>
        You may use our website for lawful purposes only. Content on the site, including text, samples and graphics, belongs to JU
        Estimating and may not be copied for commercial use without permission. The site is provided &quot;as is&quot;.
      </p>

      <h2>11. Termination</h2>
      <p>
        Either party may stop work by written notice. You pay for Services completed and work in progress up to the date of termination{" "}
        <Confirm>confirm that work in progress is payable on termination</Confirm>.
      </p>

      <h2>12. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the State of <Confirm>state, for example Ohio</Confirm>. Disputes will be resolved in{" "}
        <Confirm>the state or federal courts of ___ County, ___, or binding arbitration under ___ rules</Confirm>.
      </p>

      <h2>13. Changes</h2>
      <p>We may update these Terms. The version in effect when you approve a quote applies to that project.</p>

      <h2>14. Contact</h2>
      <LegalContact />
    </LegalPage>
  );
}
