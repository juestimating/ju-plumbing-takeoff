import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "plumbing-estimating",
  group: "services",
  nav: { label: "Plumbing estimating", blurb: "Priced bids with labor, material and markups.", icon: "calculator" },
  seo: {
    title: "Plumbing estimating services from $199 | JU Plumbing Takeoff",
    description:
      "Plumbing estimating services from $199, back in 24–72 hours: takeoff, material at the project ZIP code, labor and markups in one priced bid. Get a quote.",
    keywords: [
      "plumbing estimating services",
      "plumbing estimator",
      "outsourced plumbing estimating",
      "plumbing cost estimate",
      "plumbing bid estimate",
    ],
  },
  hero: {
    h1: "Plumbing estimating services",
    lead: "Our plumbing estimating services turn your plans into a priced bid: a full takeoff, material priced for the project ZIP code, labor, equipment, subcontractors and markups, with every assumption written down. Estimates start at $199 and arrive in 24–72 hours, checked by a second estimator.",
    illustration: "takeoff-sheet",
    bullets: [
      "Priced at the project ZIP code, or at your own rates",
      "Union, open-shop or prevailing-wage labor",
      "AACE estimate class stated on every estimate",
    ],
  },
  price: { from: 199, display: "From $199", turnaround: "24–72 hours" },
  serviceType: "Plumbing estimating",
  blocks: [
    {
      id: "outsourced-plumbing-estimating",
      type: "prose",
      h2: "Outsourced plumbing estimating, priced line by line",
      paragraphs: [
        "Outsourced plumbing estimating gives you the work of an in-house estimator without the payroll. Plumbing contractors use it when the bid calendar is fuller than the week, general contractors to check plumbing subcontractor bids, and owners to test a price against an independent estimate from the same drawings.",
        "You review the number, adjust it to your margins and decide whether to bid. We don't bid or build, so your plans and pricing stay yours.",
      ],
    },
    {
      id: "how-a-plumbing-estimate-is-built",
      type: "steps",
      tone: "alt",
      h2: "How a plumbing estimate is built, step by step",
      intro:
        "Each step feeds the next, so a wrong quantity becomes a wrong price. The guide on [how to estimate a plumbing job](/guides/how-to-estimate-a-plumbing-job) walks through the same method for estimators who price in house.",
      steps: [
        {
          title: "Measure the set.",
          body: "Fixtures, pipe, fittings, valves, hangers, insulation and equipment are measured by system, each quantity tied to its sheet and detail.",
        },
        {
          title: "Price the material.",
          body: "Material is priced for the project ZIP code, or from your supplier quotes, with the pricing date stated.",
        },
        {
          title: "Build the labor.",
          body: "Labor is built by task from the quantities, with your labor units if you send them, then adjusted for building height, congestion, phasing and work in occupied space.",
        },
        {
          title: "Add equipment and subcontracts.",
          body: "Water heaters, pumps and similar equipment are priced from the schedules and any quotes you hold. Excavation, core drilling, insulation and scaffolding each get a line: priced from your quotes or a stated allowance, or marked excluded if another trade carries them.",
        },
        {
          title: "Carry the project costs.",
          body: "Permits and fees, testing and disinfection, mobilization, supervision and insurance are priced as lines or listed as exclusions, so none of them vanish from a rushed bid.",
        },
        {
          title: "Apply markups in your order.",
          body: "Overhead, profit, bond premium and any sales or use tax go on in your order and on your base, so the total ties to your bid form. Contingency and escalation are stated lines you can change, never buried in unit costs.",
        },
        {
          title: "Write the basis and check it.",
          body: "The basis of estimate lists inclusions, exclusions, assumptions, the wage basis, the pricing date and the AACE estimate class. A second estimator then checks quantities, extensions and markup math before delivery.",
        },
      ],
      cta: { label: "Send your plans for a fixed quote", href: "/contact?service=plumbing-estimating#request-a-quote" },
    },
    {
      id: "union-open-shop-and-prevailing-wage-labor",
      type: "compare",
      h2: "Union, open-shop and prevailing-wage labor in the estimate",
      intro: "The wage basis changes every labor line, so we confirm it before pricing and print it in the basis of estimate.",
      columns: [
        {
          title: "Union",
          body: "The wage and fringe package in the local collective bargaining agreement, plus payroll taxes and insurance.",
          footer: "Send the agreement's current rate sheet and we use it as given.",
        },
        {
          title: "Open shop",
          body: "The wage and burden of your own crews, or the local market if you ask us to use it.",
          footer: "Send your crew rates and burden, or we state our assumption.",
        },
        {
          title: "Prevailing wage",
          body: "The wage determination the bid documents name, such as Davis-Bacon on federal work or a state schedule.",
          footer: "We price to that determination and state which one we used.",
        },
      ],
    },
    {
      id: "sample-plumbing-estimate-sheet",
      type: "table",
      tone: "alt",
      variant: "sheet",
      h2: "What you receive: a sample plumbing cost estimate sheet",
      intro:
        "Every price sits on a takeoff quantity, and each line says how it was priced. The workbook adds material, labor, equipment, subcontract and markup pricing to the quantities, and the basis of estimate adds the wage basis, the pricing date and the AACE class.",
      caption: "Plumbing estimate sheet, illustrative layout (quantities only)",
      head: ["Estimate line", "Priced from", "Qty", "Unit"],
      rows: [
        ["Fixtures and trim", "Material at project ZIP code, labor by task", "48", "EA"],
        ["Pipe, fittings, valves and hangers", "Material at project ZIP code, labor by task", "2,100", "LF"],
        ["Water heaters and pumps", "Schedule, quotes, set-in-place labor", "4", "EA"],
        ["Core drilling", "Subcontract quote or stated allowance", "36", "EA"],
        ["Overhead, profit, bond and tax", "Your rates, or stated assumptions", "1", "LS"],
        ["Contingency", "Stated line you can change", "1", "LS"],
      ],
      note: "A real estimate prices every line with the formulas visible and lists the assumptions behind it.",
    },
    {
      id: "preliminary-estimate-or-bid-preparation",
      type: "callout",
      h2: "When the drawings are early or the bid is due",
      body: "While the design is still moving, a [preliminary plumbing estimate](/services/preliminary-plumbing-estimate) prices a low, likely and high budget from $129. When the estimate has to become a submission, [plumbing bid preparation](/services/plumbing-bid-preparation) builds the bid form, scope letter, alternates and unit prices for you to sign, from $199.",
    },
  ],
  faq: [
    {
      q: "How is a plumbing estimate different from a plumbing takeoff?",
      a: "A [plumbing quantity or material takeoff](/services/plumbing-takeoff#quantity-or-material-takeoff) stops at quantities: net counts and lengths to price, or a list to order from, with no labor or markups. It starts at $149 and suits contractors who hold their own labor units and supplier pricing. The estimate includes the same takeoff, then adds material pricing, labor, equipment, subcontracts, project costs and markups, so you receive a number to bid from.",
    },
    {
      q: "How do you price material for my project?",
      a: "Material is priced for the project ZIP code, and the basis of estimate prints the date the pricing reflects, because material prices move. Supplier quotes or a price list you send replace our pricing, and those lines are marked as yours. Long-lead equipment is flagged, since lead times can decide whether a price holds, and every unit price stays editable in the workbook.",
    },
    {
      q: "How accurate is a plumbing estimate, and which AACE class will I get?",
      a: "Our typical variance is ±5–10% on construction-document estimates and ±15–30% on conceptual budgets. Those are our figures, not AACE ranges. The [AACE International](https://web.aacei.org/) class follows how complete the design is, from Class 5, the least defined, to Class 1, the most defined, and every estimate states its class. Firm supplier and subcontract quotes tighten the number, allowances widen it, and drawing conflicts are logged rather than guessed.",
    },
    {
      q: "What markup do you apply, and can you use my own rates and supplier quotes?",
      a: "Markups are yours to set. Send your overhead, profit, bond and tax rates, your crew rates and burden, your labor units and any supplier or subcontract quotes, and we price with them in the order you carry them. Anything you do not send is priced from local rates or stated as an assumption, so you can see exactly what to replace before you bid.",
    },
    {
      q: "What does a plumbing estimator do, and can I outsource one?",
      a: "A plumbing estimator measures the plumbing in a set of drawings and prices it into a bid. You can outsource that work to us project by project, through [monthly plumbing estimating](/services/monthly-plumbing-estimating) for 10–15 projects a month, or with a [dedicated plumbing estimator](/services/monthly-plumbing-estimating#dedicated-plumbing-estimator) who works in your templates and on your bid calendar.",
    },
  ],
  related: [
    "/services/plumbing-takeoff",
    "/services/preliminary-plumbing-estimate",
    "/services/plumbing-bid-preparation",
    "/services/residential-plumbing-estimating",
    "/services/commercial-plumbing-estimating",
    "/services/industrial-plumbing-estimating",
  ],
  updated: "2026-11-20",
};

export default content;
