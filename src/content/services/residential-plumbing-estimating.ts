import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "residential-plumbing-estimating",
  group: "services",
  nav: {
    label: "Residential plumbing",
    blurb: "Custom homes, production plan types, remodels and additions.",
    icon: "home",
  },
  seo: {
    title: "Residential plumbing estimating services from $199",
    description:
      "Residential plumbing estimating from $199, back in 24–72 hours: custom homes and remodels, with groundwork, rough-in and trim priced apart. Get a quote.",
    keywords: [
      "residential plumbing estimating",
      "new construction plumbing estimate",
      "plumbing rough-in estimate",
      "remodel plumbing estimate",
      "house plumbing takeoff",
    ],
  },
  hero: {
    h1: "Residential plumbing estimating services",
    lead: "Residential plumbing estimating from your plan set, for custom homes, production plan types, remodels and additions. Groundwork, rough-in and trim are priced as separate stages you can bid and invoice, and what a house set leaves open, from pipe routing to fixture allowances, is written down as an assumption. Priced from $199 and delivered in 24–72 hours.",
    illustration: "house-rough-in",
    bullets: [
      "Groundwork, rough-in and trim kept apart",
      "Plan types priced once, options as add or deduct",
      "Fixture allowances shown on their own lines",
    ],
  },
  price: { from: 199, display: "From $199", turnaround: "24–72 hours" },
  serviceType: "Residential plumbing estimating",
  blocks: [
    {
      type: "scope",
      id: "what-we-measure-on-a-house-plumbing-takeoff",
      h2: "What we measure on a house plumbing takeoff",
      tone: "alt",
      intro:
        "A new construction plumbing estimate starts with the fixture schedule: every fixture is counted there and checked against each floor plan, and conflicts go to the scope-gap log. Commercial buildings and plants have their own pages: [commercial plumbing estimating](/services/commercial-plumbing-estimating) and [industrial plumbing estimating](/services/industrial-plumbing-estimating). To price the counts yourself, a [plumbing quantity takeoff](/services/plumbing-takeoff#quantity-or-material-takeoff) starts at $149.",
      illustration: "house-rough-in",
      items: [
        { label: "Plumbing fixtures by type", unit: "EA", note: "Double vanities counted by bowl." },
        { label: "Water supply pipe by size and material", unit: "LF", note: "PEX, copper or CPVC, home runs or trunk-and-branch as drawn." },
        { label: "Manifolds, shutoffs and stops", unit: "EA", note: "Manifold ports, the main shutoff, fixture and appliance stops." },
        { label: "Drain and vent pipe by size and material", unit: "LF", note: "PVC or ABS where allowed, cast iron where specified." },
        { label: "Fittings, traps and cleanouts", unit: "EA", note: "By type and size, with cleanout covers on their own line." },
        { label: "Vent terminations and roof penetrations", unit: "EA", note: "From the roof plan, with flashing responsibility noted." },
        { label: "Under-slab drain and water piping", unit: "LF", note: "Trench length, pipe and bedding, where the plumber carries it." },
        { label: "Water heaters and expansion tanks", unit: "EA", note: "Tank or tankless, with their water and gas connections." },
        { label: "Gas piping to appliances", unit: "LF", note: "Range, dryer, water heater, furnace, fireplace and outdoor connections." },
        { label: "Sump and ejector pits with pumps", unit: "EA", note: "Basin, pump, check valve and discharge piping." },
        { label: "Pipe insulation, hangers and firestopping", unit: "LF, EA", note: "Insulation by the foot; supports and rated penetrations counted." },
      ],
      footnote: "Measured from the drawings as issued.",
    },
    {
      type: "list",
      id: "plumbing-rough-in-estimate-by-phase",
      h2: "How we split a plumbing rough-in estimate by phase",
      numbered: true,
      intro:
        "Each stage has its own test and inspection, and many builders pay by stage, so each gets its own line and workbook tab, under the stage names your market uses.",
      items: [
        {
          title: "Groundwork or underground.",
          body: "Drain, sewer and under-slab water piping, tested and inspected before backfill or the pour, and priced on its own because it cannot be reached later.",
        },
        {
          title: "Rough-in, called top-out in some markets.",
          body: "Drain, waste, vent and supply piping in framed walls and floors before drywall, with roof penetrations, tub and shower valves and gas piping. Most of the pipe goes in here.",
        },
        {
          title: "Trim or finish.",
          body: "Fixtures, faucets, shower trim and appliance connections, set after drywall, paint and cabinets. The material is mostly fixtures and trim kits, so allowances and who furnishes each are stated.",
        },
      ],
    },
    {
      type: "list",
      id: "scope-gaps-on-residential-plumbing-bids",
      h2: "What we watch for on house plumbing bids",
      tone: "dark",
      items: [
        {
          title: "Foundation and under-slab work.",
          body: "Slab, crawlspace or basement changes the pipe, the supports and the below-grade work, so we price the foundation shown, with under-slab lines on their own and trenching, bedding and backfill marked yours or by others.",
        },
        {
          title: "Upper-floor drainage and venting.",
          body: "Each upper-floor stack is followed through chases, offsets and wet vents to the roof, and air admittance valves are carried only where the governing code and local amendments allow them.",
        },
        {
          title: "Supply layout.",
          body: "When the plans and the builder's specification do not say manifold or trunk-and-branch, the layout we assumed is stated so you can change it.",
        },
        {
          title: "Water heater and gas extras.",
          body: "Relief discharge, pans, expansion tanks and gas connections are itemized, flue venting is marked included or carried by others, and each gas appliance gets its own branch.",
        },
        {
          title: "Small items that add up.",
          body: "Hose bibbs, washer boxes, icemaker supplies, pot fillers and dishwasher connections are counted from the plans and the finish schedule.",
        },
        {
          title: "Where the utility connections end.",
          body: "Water service, sewer lateral, meters, taps and tap fees are each marked included, excluded or by others.",
        },
      ],
    },
    {
      type: "table",
      id: "illustrative-residential-plumbing-takeoff-quantities",
      h2: "Illustrative quantities from a residential plumbing takeoff",
      tone: "alt",
      intro:
        "An extract for a two-story house. The workbook has a tab per stage plus gas, and the basis of estimate names the routing assumption, who furnishes each fixture and where the utility connections end. RFIs flag items such as a fixture with no schedule entry or a stack with no path to the roof.",
      variant: "sheet",
      sheetTabs: ["Summary", "Groundwork", "Rough-in", "Trim", "Gas", "Assumptions"],
      caption: "Illustrative extract for a two-story house: round numbers, not project data",
      head: ["Tab", "Item", "Source", "Qty", "Unit"],
      rows: [
        ["Groundwork", "PVC drain under slab, 3 in. and 4 in.", "Foundation plan, plumbing plan", "180", "LF"],
        ["Rough-in", "PEX supply tubing, 1/2 in. home runs", "Plumbing plan, manifold detail", "700", "LF"],
        ["Rough-in", "PVC drain and vent, 2 in.", "Plumbing plan", "300", "LF"],
        ["Trim", "Water closets", "Fixture schedule, floor plans", "4", "EA"],
        ["Trim", "Lavatories, counted by bowl", "Fixture schedule, floor plans", "5", "EA"],
        ["Gas", "Gas piping to appliances", "Gas plan, floor plan", "90", "LF"],
      ],
      note: "In the real file every line cites its sheet and detail, and [waste and fitting allowances](/guides/plumbing-pipe-waste-and-fitting-allowances) are stated in the basis of estimate so you can use your own. Pricing, labor basis and accuracy follow the method on [plumbing estimating services](/services/plumbing-estimating).",
    },
  ],
  faq: [
    {
      q: "Can you price a house when the plans have no plumbing sheet?",
      a: "Yes. We build a routing assumption from the fixture locations, stack positions, framing direction and foundation type, and write it into the basis of estimate. The scope-gap log lists what a plumbing plan would have settled, such as stack locations or the wet vent layout, and the file says how much rests on assumption.",
    },
    {
      q: "How do you handle a remodel plumbing estimate?",
      a: "We price the new work, the tie-ins to existing lines and the demolition the drawings show. Pipe material, access and patching behind existing walls are written down as assumptions, which photos or site-walk notes tighten. Conditions that only demolition will reveal stay as stated assumptions or exclusions.",
    },
    {
      q: "Can you price production builder plans with options?",
      a: "Yes. The base plan is priced once, and each option, such as a bonus-room bath, a finished-basement rough-in or a foundation variant, is an add or deduct. Builders use it to check a sub's number or carry a budget before buyout. For steady volume, [monthly plumbing estimating](/services/monthly-plumbing-estimating) covers 10–15 projects for $1,499 a month.",
    },
    {
      q: "Can you estimate plumbing by the square foot or per fixture?",
      a: "Not for a bid. A per-square-foot or per-fixture figure hides what moves house plumbing: the foundation, how the baths group, the supply layout, fixture grade and who furnishes what. For a budget before drawings exist, a [preliminary plumbing estimate](/services/preliminary-plumbing-estimate) from $129 gives a low, likely and high range.",
    },
    {
      q: "Do you price the fixtures or only the rough-in?",
      a: "Both, as separate lines: rough-in material, trim material and fixtures, each showing who furnishes it. Builder allowances are carried as allowances, fixtures with no model or grade are flagged, and owner-furnished fixtures are listed as set-only, so the labor to set them is still counted.",
    },
    {
      q: "What drawings do you need for a house plumbing takeoff?",
      a: "The floor plan for every level, the foundation plan, the roof plan, any plumbing sheet, the fixture or finish schedule and the builder's specification or plumbing selections, with every addendum. When there is no plumbing sheet, the foundation and roof plans carry more weight: they set the under-slab runs and the vent terminations.",
    },
  ],
  related: [
    "/services/plumbing-estimating",
    "/services/plumbing-takeoff",
    "/services/commercial-plumbing-estimating",
    "/services/preliminary-plumbing-estimate",
  ],
  updated: "2026-11-20",
};

export default content;
