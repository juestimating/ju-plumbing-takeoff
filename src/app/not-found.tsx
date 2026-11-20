import type { Metadata } from "next";
import { BrokenRun } from "@/components/company/notfound/BrokenRun";
import { RouteCards } from "@/components/company/notfound/RouteCards";
import { PageHero } from "@/components/page/PageHero";

export const metadata: Metadata = { title: { absolute: "Page not found | JU Plumbing Takeoff" }, robots: { index: false, follow: false } };

/** The pages a lost visitor most likely wanted, in menu order. */
const POPULAR = ["/services/plumbing-takeoff", "/pricing", "/samples", "/guides", "/faq"];

export default function NotFound() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Page not found" }]}
        kicker="Error 404"
        h1="That page isn't here"
        lead="The link may be old or mistyped. These pages are the quickest way back."
        primary={{ label: "Get a fixed quote", href: "/contact" }}
        secondary={{ label: "Go to the home page", href: "/" }}
        card={<BrokenRun />}
      />
      <RouteCards hrefs={POPULAR} />
    </>
  );
}
