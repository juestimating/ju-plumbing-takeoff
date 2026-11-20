import type { HubContent } from "./types";

/**
 * Copy for the two hub pages. HubPage adds the proof bar, the card grid (from the registry), the
 * shared "How a plumbing takeoff order works" steps (not on /guides), related links and the closing CTA,
 * so none of those headings are written here. Only published prices ($129, $149, $199, $349, $1,499 a month)
 * and the "24–72 hours" turnaround appear. Plain data with `import type` only, so scripts can load it.
 */
export const HUBS: Record<"services" | "guides", HubContent> = {
  services: {
    seo: {
      title: "Plumbing takeoff, estimate and bid preparation from $129",
      description:
        "Plumbing takeoff, estimating and bid preparation for contractors and builders. Takeoffs from $149, estimates from $199, in 24–72 hours. Get a fixed quote.",
      keywords: [
        "plumbing takeoff, estimating and bid preparation",
        "plumbing preconstruction services",
        "plumbing estimating and bidding services",
        "types of plumbing estimates",
      ],
    },
    hero: {
      h1: "Plumbing takeoff, estimating and bid preparation",
      lead: "Our plumbing takeoff and estimating services turn your plan set into measured quantities or a priced estimate in 24–72 hours. Fixtures, pipe, valves and equipment are measured from your drawings, every file is checked by a second estimator, and you get an Excel workbook with live formulas and marked-up plans. Takeoffs start at $149 and estimates at $199.",
    },
    intro: {
      h2: "How to choose between a takeoff, an estimate and bid support",
      paragraphs: [
        "A **plumbing takeoff** is measured quantities with no prices, so you apply your own labor units and supplier quotes. A **plumbing estimate** adds material at the project ZIP code, labor, equipment, subcontractors, overhead and profit, with a basis of estimate. Bid preparation turns either one into a submission.",
      ],
      bullets: [
        "Own rates, need quantities or a material list: a [plumbing takeoff](/services/plumbing-takeoff) from $149.",
        "Need a number to bid with: a [plumbing estimate](/services/plumbing-estimating), from $199 for most work and $349 for industrial.",
        "Drawings not finished: a [preliminary plumbing estimate](/services/preliminary-plumbing-estimate) from $129.",
        "Whole submission needed: [plumbing bid preparation](/services/plumbing-bid-preparation) from $199.",
        "Steady volume: [monthly plumbing estimating](/services/monthly-plumbing-estimating) at $1,499 a month for 10–15 projects, or a dedicated estimator on a custom quote.",
      ],
    },
    list: {
      h2: "All plumbing takeoff, estimating and bid preparation services",
      intro: "Every project gets a fixed quote before work begins, and the [pricing page](/pricing) compares every service.",
    },
    faq: [
      {
        q: "Which plumbing service fits a subcontractor, a general contractor or a builder?",
        a: "A plumbing subcontractor with its own labor units usually orders the takeoff and prices it at its own rates. A general contractor carrying the plumbing package needs the priced estimate, or a [plumbing quantity takeoff](/services/plumbing-takeoff#quantity-or-material-takeoff) when every bidder should price the same counts. A builder repeating a plan type can price every house from one count. Unsure? Send the plans and we will say which fits.",
      },
      {
        q: "Do you estimate residential, commercial and industrial plumbing?",
        a: "Yes. Residential estimates cover custom homes, production plan types and remodels, with groundwork, rough-in and trim kept apart. Commercial estimates cover restroom groups, risers, tenant fit-outs, restaurants and schools. Industrial estimates cover plants and warehouses, including process water, compressed air and chemical waste. Residential and commercial estimates start at $199 and industrial at $349, with larger industrial sets confirmed at intake.",
      },
      {
        q: "Do you offer monthly plumbing estimating or a dedicated estimator?",
        a: "Yes, both. The [monthly plumbing estimating](/services/monthly-plumbing-estimating) package suits a steady 10–15 projects a month, and a [dedicated plumbing estimator](/services/monthly-plumbing-estimating#dedicated-plumbing-estimator) suits a full bid calendar. Either way you hand off the measuring and the estimate, and you keep the decision on what to bid and at what number.",
      },
    ],
    related: [
      "/guides/plumbing-takeoff-vs-plumbing-estimate",
      "/guides/plumbing-takeoff-service-cost",
      "/guides/how-to-do-a-plumbing-takeoff",
      "/faq",
    ],
    updated: "2026-11-20",
  },

  guides: {
    seo: {
      title: "Plumbing estimating guides: takeoff, pricing, bidding",
      description:
        "Plumbing estimating guides for contractors: how to do a takeoff, price a job, read plans and avoid bid mistakes. Start with the takeoff guide.",
      keywords: [
        "plumbing estimating guides",
        "plumbing takeoff guide",
        "plumbing estimating resources",
        "plumbing takeoff and estimating guides",
      ],
    },
    hero: {
      h1: "Plumbing estimating guides",
      lead: "These plumbing estimating guides explain how to do a takeoff, price a job, read plumbing plans and avoid the scope gaps that cost bids. Each one gives the method and the checks to run, and links to the service that does the work.",
    },
    intro: {
      h2: "Where to start with the plumbing estimating guides",
      paragraphs: [
        "For takeoff basics, begin with [how to do a plumbing takeoff](/guides/how-to-do-a-plumbing-takeoff), and to price a job, read [how to estimate a plumbing job](/guides/how-to-estimate-a-plumbing-job). Before bid day, review the [plumbing estimating mistakes](/guides/plumbing-estimating-mistakes) and run the [plumbing bid checklist](/guides/plumbing-bid-checklist). Weighing an outside service? Compare [plumbing takeoff services vs software](/guides/plumbing-takeoff-services-vs-software), then check [what a takeoff costs](/guides/plumbing-takeoff-service-cost).",
      ],
    },
    list: {
      h2: "All plumbing estimating guides for takeoffs and bids",
      intro: "Pick a guide by the job in front of you: measuring, pricing, buying or checking a bid.",
    },
    faq: [
      {
        q: "Do the guides give pipe sizes, slopes or hanger spacing?",
        a: "No. Those requirements depend on the code edition, the local amendments and the specification, so the governing code and the engineer of record decide them. The guides explain how to measure, check and price. They name the International Plumbing Code from the [International Code Council](https://www.iccsafe.org/) and the Uniform Plumbing Code from [IAPMO](https://iapmo.org/) as the 2 main code families, not as a source of numbers.",
      },
      {
        q: "Can I see the workbook layout the guides describe?",
        a: "Yes. The [samples page](/samples) shows 3 illustrative previews: a fixture count and DWV pipe takeoff, a material list and an estimate summary, each from an Excel workbook with a tab per system and live formulas. You can also [request a plumbing sample](/contact?service=sample-request#request-a-quote) with client details removed.",
      },
    ],
    related: [
      "/services/plumbing-takeoff",
      "/services/plumbing-estimating",
      "/faq",
    ],
    updated: "2026-11-20",
  },
};
