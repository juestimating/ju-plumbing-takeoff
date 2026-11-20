import type { PageContent } from "./types";
import plumbingTakeoff from "./services/plumbing-takeoff";
import plumbingEstimating from "./services/plumbing-estimating";
import preliminaryPlumbingEstimate from "./services/preliminary-plumbing-estimate";
import plumbingBidPreparation from "./services/plumbing-bid-preparation";
import residentialPlumbingEstimating from "./services/residential-plumbing-estimating";
import commercialPlumbingEstimating from "./services/commercial-plumbing-estimating";
import industrialPlumbingEstimating from "./services/industrial-plumbing-estimating";
import monthlyPlumbingEstimating from "./services/monthly-plumbing-estimating";

/**
 * Order here is the order in menus, hubs, the quote form and the sitemap. Services run: the four things you buy for
 * one bid, then the three project types, then ongoing support. (Quantity and material takeoff live inside the
 * plumbing takeoff page, the dedicated estimator inside the monthly page.)
 */
export const SERVICES: PageContent[] = [
  plumbingTakeoff,
  plumbingEstimating,
  preliminaryPlumbingEstimate,
  plumbingBidPreparation,
  residentialPlumbingEstimating,
  commercialPlumbingEstimating,
  industrialPlumbingEstimating,
  monthlyPlumbingEstimating,
];

export const pagePath = (p: PageContent) => `/${p.group}/${p.slug}`;

export function getPage(slug: string): PageContent | undefined {
  return SERVICES.find((p) => p.slug === slug);
}
