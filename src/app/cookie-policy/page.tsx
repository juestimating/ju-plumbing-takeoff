import Link from "next/link";
import { Confirm } from "@/components/legal/Confirm";
import { LegalPage } from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Cookie Policy | JU Plumbing Takeoff",
  description:
    "Draft cookie policy for JU Plumbing Takeoff: which cookies and analytics tools this site uses, and how you can control them in your browser settings.",
  path: "/cookie-policy",
  noindex: true,
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      path="/cookie-policy"
      h1="Cookie policy"
      lead="Which cookies and analytics tools this website uses, and how you can control them."
    >
      <p>
        Cookies are small text files stored on your device when you visit a website. This policy explains which cookies this website uses
        and how you can control them.
      </p>

      <h2>Cookies we use</h2>
      <div className="tbl-wrap" tabIndex={0} role="group" aria-label="Cookies and similar tools on this website">
        <table className="tbl">
          <caption>Cookies and similar tools on this website</caption>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Purpose</th>
              <th scope="col">Examples</th>
              <th scope="col">Can you turn it off?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Essential</th>
              <td>Make the site and the quote form work</td>
              <td>
                None are set by default.{" "}
                <Confirm>
                  only if Google Analytics 4 is switched on: after a quote request the thank-you page stores one short value in session
                  storage (ju:lead-tracked) so a lead is counted once. Remove this note if GA4 stays off
                </Confirm>
              </td>
              <td>Not applicable, because none are set</td>
            </tr>
            <tr>
              <th scope="row">Analytics</th>
              <td>Show how visitors use the site and how fast pages load, so we can improve it</td>
              <td>
                Vercel Web Analytics and Vercel Speed Insights, which do not set cookies.{" "}
                <Confirm>Google Analytics 4, only if it is switched on for this site</Confirm>
              </td>
              <td>
                Nothing to turn off for the Vercel tools. <Confirm>how visitors can opt out of Google Analytics 4, if it is enabled</Confirm>
              </td>
            </tr>
            <tr>
              <th scope="row">Marketing</th>
              <td>Measure ads and show relevant ads on other sites</td>
              <td>
                None. <Confirm>Google Ads, Meta pixel, LinkedIn Insight, or &quot;None&quot;</Confirm>
              </td>
              <td>Not applicable, because none are used</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <Confirm>
          if no analytics cookies or marketing tools are used, delete those rows and no cookie banner is needed. If Google Analytics 4 or
          any marketing tag is switched on, add a consent control and update this table
        </Confirm>
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings, though some parts of the site may not work properly.{" "}
        <Confirm>if a cookie settings link or banner is added to the site footer, describe it here</Confirm>
      </p>

      <h2>More information</h2>
      <p>
        See our <Link href="/privacy-policy">Privacy Policy</Link> or contact <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
