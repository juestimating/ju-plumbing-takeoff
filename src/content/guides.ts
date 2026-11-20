import type { ComponentType } from "react";
import type { GuideMeta } from "./types";
import * as howToDoAPlumbingTakeoff from "./guides/how-to-do-a-plumbing-takeoff.mdx";
import * as plumbingTakeoffChecklist from "./guides/plumbing-takeoff-checklist.mdx";
import * as howToEstimateAPlumbingJob from "./guides/how-to-estimate-a-plumbing-job.mdx";
import * as plumbingTakeoffVsPlumbingEstimate from "./guides/plumbing-takeoff-vs-plumbing-estimate.mdx";
import * as plumbingTakeoffServicesVsSoftware from "./guides/plumbing-takeoff-services-vs-software.mdx";
import * as plumbingTakeoffServiceCost from "./guides/plumbing-takeoff-service-cost.mdx";
import * as howToReadPlumbingPlans from "./guides/how-to-read-plumbing-plans.mdx";
import * as plumbingEstimatingMistakes from "./guides/plumbing-estimating-mistakes.mdx";
import * as plumbingPipeWasteAndFittingAllowances from "./guides/plumbing-pipe-waste-and-fitting-allowances.mdx";
import * as plumbingBidChecklist from "./guides/plumbing-bid-checklist.mdx";
import * as plumbingEstimatingSpreadsheet from "./guides/plumbing-estimating-spreadsheet.mdx";

export type Guide = { meta: GuideMeta; Body: ComponentType<Record<string, unknown>> };

/** Order here is the order on the guides hub. */
export const GUIDES: Guide[] = [
  { meta: howToDoAPlumbingTakeoff.meta, Body: howToDoAPlumbingTakeoff.default },
  { meta: plumbingTakeoffChecklist.meta, Body: plumbingTakeoffChecklist.default },
  { meta: howToEstimateAPlumbingJob.meta, Body: howToEstimateAPlumbingJob.default },
  { meta: plumbingTakeoffVsPlumbingEstimate.meta, Body: plumbingTakeoffVsPlumbingEstimate.default },
  { meta: plumbingTakeoffServicesVsSoftware.meta, Body: plumbingTakeoffServicesVsSoftware.default },
  { meta: plumbingTakeoffServiceCost.meta, Body: plumbingTakeoffServiceCost.default },
  { meta: howToReadPlumbingPlans.meta, Body: howToReadPlumbingPlans.default },
  { meta: plumbingEstimatingMistakes.meta, Body: plumbingEstimatingMistakes.default },
  { meta: plumbingPipeWasteAndFittingAllowances.meta, Body: plumbingPipeWasteAndFittingAllowances.default },
  { meta: plumbingBidChecklist.meta, Body: plumbingBidChecklist.default },
  { meta: plumbingEstimatingSpreadsheet.meta, Body: plumbingEstimatingSpreadsheet.default },
];

export const getGuide = (slug: string): Guide | undefined => GUIDES.find((g) => g.meta.slug === slug);
