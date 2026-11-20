import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "preliminary-plumbing-estimate",
  group: "services",
  nav: {
    label: "Preliminary estimate",
    blurb: "A plumbing budget before drawings are finished.",
    icon: "pencil-ruler",
  },
  seo: {
    title: "Preliminary plumbing estimate services from $129",
    description:
      "A preliminary plumbing estimate gives you a low, likely and high budget before the drawings are finished. From $129 in 24–72 hours. Get a fixed quote.",
    keywords: [
      "preliminary plumbing estimate",
      "plumbing budget estimate",
      "conceptual plumbing estimate",
      "plumbing estimate before drawings",
      "class 5 plumbing estimate",
    ],
  },
  hero: {
    h1: "Preliminary plumbing estimate services",
    lead: "A preliminary plumbing estimate puts a low, likely and high budget on the plumbing before the drawings are finished. We build it from your program, square footage, fixture counts and sketches, and state every assumption. Typical variance on a conceptual budget is ±15–30%. From $129 in 24–72 hours.",
    illustration: "plan-markup",
    bullets: [
      "Low, likely and high range",
      "AACE Class 5 and Class 4 stated",
      "Every assumption written down",
    ],
  },
  price: { from: 129, display: "From $129", turnaround: "24–72 hours" },
  // The default steps ask for plumbing sheets and promise marked-up plans; a budget before drawings has neither.
  howItWorks: {
    h2: "Preliminary plumbing estimate: how an order works",
    intro: "From a program or sketches to a low, likely and high budget in 24–72 hours, with no obligation until you approve the quote.",
    steps: [
      {
        title: "Send what you have.",
        body: "Describe the building and attach what exists, by email or a link, with the date you need the budget. No construction drawings are needed.",
      },
      {
        title: "Get a fixed quote.",
        body: "We review what you sent and reply with a fixed price and a delivery date, usually within 10 minutes during business hours.",
      },
      {
        title: "Receive the budget.",
        body: "Approve the quote and we start. The three-case Excel workbook, the PDF summary by CSI MasterFormat and the basis of estimate normally arrive within 24–72 hours, checked by a second estimator.",
      },
    ],
  },
  // The default drivers (plumbing sheets, schedule-heavy or plan-heavy sets) do not exist before drawings.
  pricing: {
    paragraphs: [
      "**What moves the price:** how much information there is to review, how many systems are in scope and how fast you need the budget. **What doesn't:** the dollar value of the building. Compare every service on the [pricing page](/pricing).",
    ],
  },
  serviceType: "Preliminary plumbing estimate",
  blocks: [
    {
      type: "prose",
      id: "plumbing-budget-before-drawings",
      h2: "A plumbing budget estimate while the design can still change",
      paragraphs: [
        "A preliminary estimate tells you whether the plumbing fits the money set aside for it. Owners use it to test a site or a program, architects to check the plumbing at schematic design, and contractors to carry an early number in a design-build or preconstruction proposal.",
        "It is a budget for decisions, not a bid. Once construction drawings exist, a [plumbing estimating](/services/plumbing-estimating) order replaces it with a measured, priced number.",
      ],
    },
    {
      type: "compare",
      id: "low-likely-and-high-plumbing-budget-range",
      h2: "Low, likely and high: how a plumbing budget estimate works",
      tone: "alt",
      intro: "A single number hides its assumptions. A range shows them, and it narrows as drawings add detail.",
      columns: [
        {
          title: "Low case",
          body: "Fixture counts at the minimum the program implies, stacks that line up, short routing and standard-grade fixtures. The best realistic result, not a target.",
        },
        {
          title: "Likely case",
          body: "Fixture counts that follow the program, stacked restroom groups, equipment and finishes that match the building type, and site connections where a normal site puts them. **This is the number to carry as the budget.**",
        },
        {
          title: "High case",
          body: "More fixtures, longer runs, offsets around structure, upgraded fixtures, added equipment and harder site connections. It shows what is at risk if the design grows.",
        },
      ],
    },
    {
      type: "compare",
      id: "aace-class-5-and-class-4-plumbing-estimates",
      h2: "AACE Class 5 and Class 4 plumbing estimates in plain language",
      intro:
        "[AACE International](https://web.aacei.org/) classes follow how much of the project is defined. Our typical variance on a conceptual budget is ±15–30%, and AACE notes that the class alone does not set the accuracy range.",
      columns: [
        {
          title: "Class 5: concept screening",
          body: "The earliest class. The estimate leans on counts, judgment and comparison with similar buildings, so the range is widest.",
          points: [
            "Inputs: building type, area, location, a room or fixture program",
            "Used for: screening a site, a first budget, a go or no-go decision",
          ],
        },
        {
          title: "Class 4: study or feasibility",
          body: "The estimate is still built from counts and assemblies rather than a full takeoff, but it counts what exists, so the range tightens.",
          points: [
            "Inputs: schematic plans, a fixture list, equipment concepts, site information",
            "Used for: feasibility studies, funding requests, schematic design budgets",
          ],
          footer: "Class 3 and tighter classes need drawings to measure, so they belong to a detailed estimate.",
        },
      ],
    },
    {
      type: "list",
      id: "how-we-build-a-conceptual-plumbing-estimate",
      h2: "How we build a conceptual plumbing estimate from fixture counts",
      tone: "dark",
      numbered: true,
      intro:
        "A rate per square foot or per fixture hides what drives plumbing cost, so the budget is built from what the building needs.",
      items: [
        {
          title: "Confirm the program first.",
          body: "Use decides most of the plumbing: a house turns on bath count and foundation, an office on restroom groups and risers, a plant on its equipment list.",
        },
        {
          title: "Settle the fixture count.",
          body: "Fixtures come from your program or fixture list, counted by type the way a plumbing fixtures takeoff counts them. Without one, we derive a count from the occupancy and mark it as an assumption.",
        },
        {
          title: "Group fixtures into modules.",
          body: "Restroom groups, kitchens, janitor rooms and equipment rooms that share a wall and a stack need less pipe per fixture than scattered fixtures.",
        },
        {
          title: "Use area only where it sets length or count.",
          body: "The building drain and water mains come from the footprint, riser length from the floor count and roof drains from the roof area.",
        },
        {
          title: "Carry equipment as allowances and state the unknowns.",
          body: "Water heating, backflow protection, interceptors, pumps and gas service follow from the use and size. We also state who carries the site connections, the fixture grade we assumed and, on additions and fit-outs, what we assumed about the existing pipe.",
        },
        {
          title: "Price each module and number every assumption.",
          body: "Modules are priced at the project ZIP code and wage basis, or at your rates. The basis of estimate numbers each assumption and says what would confirm or change it.",
        },
      ],
    },
    {
      type: "prose",
      id: "what-to-send-for-a-plumbing-estimate-before-drawings",
      h2: "What to send for a plumbing estimate before drawings",
      intro:
        "[Send what you have](/contact?service=preliminary-plumbing-estimate#request-a-quote). A thin set still gets a range, and the range shows how thin it is.",
      paragraphs: ["Each item below narrows the range. The assumptions are for budgeting, not a design, a sizing or a code review."],
      bullets: [
        "Building type, ZIP code and number of floors",
        "Gross area by floor, or a program of rooms",
        "A fixture list, or a room list we can derive one from",
        "Sketches, test fits or concept floor plans",
        "Kitchens, labs, medical gas or other special systems",
        "Union, open-shop or prevailing-wage labor",
        "Your planned start date, for escalation",
      ],
    },
    {
      type: "table",
      id: "illustrative-low-likely-and-high-plumbing-quantities",
      tone: "alt",
      h2: "What you receive: low, likely and high plumbing quantities",
      intro:
        "An extract of a budget workbook for a three-story office building. The workbook carries all three cases with live formulas, sketches you send come back marked up, and the basis of estimate states the AACE class, numbers every assumption and lists what would narrow the range.",
      variant: "sheet",
      caption: "Illustrative extract: quantities only, round numbers, not project data",
      head: ["Item", "Unit", "Low", "Likely", "High", "Basis"],
      rows: [
        ["Plumbing fixtures, all types", "EA", "40", "50", "60", "Program and occupancy"],
        ["Restroom groups", "EA", "4", "5", "6", "Stacked on each floor"],
        ["Roof and overflow drains", "EA", "6", "8", "10", "Roof area"],
        ["Sanitary waste and vent pipe", "LF", "2,000", "2,500", "3,000", "Floors and footprint"],
        ["Domestic water pipe", "LF", "1,500", "2,000", "2,500", "Riser length and routing"],
        ["Water heaters", "EA", "1", "2", "3", "Central or point of use"],
      ],
      note: "The three columns are one building under three sets of stated assumptions. Pricing each case gives the low, likely and high budget.",
    },
  ],
  faq: [
    {
      q: "What is the difference between a preliminary and a detailed plumbing estimate?",
      a: "A preliminary estimate is built from a program, floor area, fixture counts and sketches, and it reports a low, likely and high range for budgeting. A [detailed plumbing estimate](/services/plumbing-estimating) is measured from construction drawings and reports one priced number you can bid from. Our typical variance is ±15–30% on conceptual budgets and ±5–10% on construction-document estimates.",
    },
    {
      q: "Which fixture counts do you use when the program does not list them?",
      a: "We derive a count from the building type, the occupancy and the minimum fixture counts in the governing code, then mark it as an assumption for the architect to confirm. That code is usually the [International Plumbing Code](https://www.iccsafe.org/) or the [Uniform Plumbing Code](https://iapmo.org/) as adopted where the project sits, with state and local amendments. Codes set minimums and owners often add fixtures, so the high case carries extra.",
    },
    {
      q: "Can I use a plumbing budget estimate for a loan or a bid?",
      a: "Use it for budgeting and early decisions. It is a range built on stated assumptions, not a fixed price, and it should not be the basis of a contract. Owners often need a budget at early stages, for example in financing talks, but a bid needs a detailed estimate measured from construction drawings.",
    },
    {
      q: "What happens when the drawings arrive?",
      a: "Send them and order a detailed estimate. Quantities are then measured from the sheets, and you can check each numbered assumption in the budget against them. Differences usually trace to a design change, such as a fixture count that grew, a riser that moved or equipment missing from the program, so you can explain the new number to an owner or lender.",
    },
    {
      q: "Do you include contingency and escalation in the budget?",
      a: "Both are stated, never hidden. A design contingency covers growth as the design develops, and an escalation allowance covers price movement to the start date you give us. Each shows as its own line with the assumption written beside it, so you can change it or remove it.",
    },
  ],
  related: [
    "/services/plumbing-estimating",
    "/services/plumbing-takeoff",
    "/services/plumbing-bid-preparation",
    "/services/commercial-plumbing-estimating",
    "/guides/how-to-estimate-a-plumbing-job",
  ],
  updated: "2026-11-20",
};

export default content;
