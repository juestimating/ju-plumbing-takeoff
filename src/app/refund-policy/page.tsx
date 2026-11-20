import { Confirm } from "@/components/legal/Confirm";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Refund and Revision Policy | JU Plumbing Takeoff",
  description:
    "Draft refund and revision policy for JU Plumbing Takeoff: addenda revisions, cancellations, refunds, rush orders and monthly packages for plumbing estimating.",
  path: "/refund-policy",
  noindex: true,
});

export default function RefundPolicyPage() {
  return (
    <LegalPage
      path="/refund-policy"
      h1="Refund and revision policy"
      lead="How revisions, cancellations and refunds work for plumbing takeoffs, estimates and monthly packages."
    >
      <p>We want every file to be right. Here is how revisions, cancellations and refunds work.</p>

      <h2>Revisions</h2>
      <ul className="list-disc">
        <li>
          <strong>Included:</strong> updates for addenda issued for the same scope, and corrections of any errors on our part.
        </li>
        <li>
          <strong>Time window:</strong>{" "}
          <Confirm>for example &quot;within 30 days of delivery&quot; or &quot;no limit for the same bid&quot;</Confirm>.
        </li>
        <li>
          <strong>Quoted separately:</strong> added systems or divisions, redesigns, new drawing sets, or changes to the scope you originally
          approved.
        </li>
      </ul>
      <p>To request a revision, reply to your delivery email with the changes or the addendum attached.</p>

      <h2>Cancellations</h2>
      <ul className="list-disc">
        <li>
          <strong>Before work starts:</strong> cancel at no charge and receive a full refund of any payment.
        </li>
        <li>
          <strong>After work starts:</strong>{" "}
          <Confirm>for example &quot;you pay for work completed to date; any balance is refunded&quot;</Confirm>.
        </li>
        <li>
          <strong>After delivery:</strong> deliverables are not refundable once delivered, but we will correct any errors on our part under
          the revision policy above.
        </li>
      </ul>

      <h2>Refunds</h2>
      <p>
        <Confirm>choose one option below, then delete the other</Confirm>
      </p>
      <p>
        <strong>Option A:</strong> If a delivered file contains an error on our part that we cannot correct within{" "}
        <Confirm>number of</Confirm> business days, we will refund the fee for the affected service.
      </p>
      <p>
        <strong>Option B:</strong> We do not offer refunds after delivery, but we will revise the work until it matches the agreed scope.
      </p>
      <p>
        Refunds are issued to the original payment method within <Confirm>number of</Confirm> business days.
      </p>

      <h2>Rush orders</h2>
      <p>
        Rush fees are non-refundable once rush work has started, unless we miss the agreed delivery time{" "}
        <Confirm>confirm this exception</Confirm>.
      </p>

      <h2>Monthly packages</h2>
      <ul className="list-disc">
        <li>
          Cancel with <Confirm>notice period, for example X days</Confirm> written notice before your next billing date.
        </li>
        <li>
          Unused projects <Confirm>do or do not</Confirm> roll over and are not refundable.
        </li>
        <li>
          Fees already paid for the current month are not refunded <Confirm>confirm this term</Confirm>.
        </li>
      </ul>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.display}</a>.
      </p>
    </LegalPage>
  );
}
