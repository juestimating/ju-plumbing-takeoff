import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "plumbing-takeoff",
  group: "services",
  nav: { label: "Plumbing takeoff", blurb: "Net quantities to price, or a material list to order from.", icon: "ruler" },
  seo: {
    title: "Plumbing takeoff services: quantity or material, from $149",
    description:
      "Plumbing takeoff services from $149, back in 24–72 hours: net quantities to price or a material list to order from, each line tied to its sheet. Get a quote.",
    keywords: [
      "plumbing takeoff services",
      "plumbing takeoff",
      "plumbing quantity takeoff",
      "plumbing material takeoff",
      "plumbing material list",
      "outsourced plumbing takeoff",
      "plumbing takeoff service for contractors",
    ],
  },
  hero: {
    h1: "Plumbing takeoff services",
    lead: "Our plumbing takeoff services measure every plumbing system in your plan set: fixtures counted by tag, pipe by size and material, risers followed floor to floor. Take the result as net quantities to price at your own rates, or as a material list in stock lengths to order from. Either way, every line points back to the sheet it came from.",
    illustration: "plan-markup",
    bullets: [
      "Net quantities or an order-ready material list",
      "Every quantity traced to a sheet and detail",
      "Marked-up plans, color-coded by system",
    ],
  },
  price: { from: 149, display: "From $149", turnaround: "24–72 hours" },
  serviceType: "Plumbing takeoff",
  blocks: [
    {
      id: "what-we-measure-on-a-plumbing-takeoff",
      type: "scope",
      h2: "What our plumbing takeoff services count and measure",
      intro:
        "We read the legend, schedules and notes first, check each sheet's scale against a printed dimension rather than the title block, and measure in Bluebeam Revu, PlanSwift or On-Screen Takeoff. The systems are then reconciled so waste, vent, water and storm agree with the fixtures they serve, and a second estimator checks the file against the drawings before it leaves.",
      illustration: "riser-isometric",
      items: [
        { label: "Plumbing fixtures by tag", unit: "EA", note: "Counted on the plans floor by floor and reconciled to the fixture schedule.", color: "cold" },
        { label: "Sanitary waste and vent pipe", unit: "LF", note: "By size and material, with above-slab and below-slab runs kept apart.", color: "waste" },
        { label: "Domestic water pipe: hot, cold and recirculation", unit: "LF", note: "By size and material, with risers followed floor to floor.", color: "cold" },
        { label: "Storm drainage: roof drains, leaders and pipe", unit: "EA / LF", note: "Roof and overflow drains counted, leaders and runs measured by size.", color: "storm" },
        { label: "Fittings by type and size", unit: "EA", note: "From isometrics where they are drawn, otherwise from the plan layout." },
        { label: "Valves and plumbing specialties", unit: "EA", note: "Isolation, check, balancing and pressure-reducing valves, backflow preventers, cleanouts, floor drains and trap primers." },
        { label: "Hangers and supports", unit: "EA", note: "By pipe size and type, at the spacing the specification calls for." },
        { label: "Pipe and equipment insulation", unit: "LF / SF", note: "By pipe size and thickness, as specified." },
        { label: "Water heaters, pumps and other equipment", unit: "EA", note: "By tag from the equipment schedule, with connections noted." },
        { label: "Gas, medical gas and fire sprinkler piping", unit: "LF", note: "Measured as separate systems when they are in scope.", color: "gas" },
        { label: "Underground pipe and trench", unit: "LF / CY", note: "Trench by depth band, with bedding and backfill, when excavation is in your scope.", color: "waste" },
        { label: "Sleeves, core holes and firestopping", unit: "EA", note: "At wall and floor penetrations, with wall and floor types from the architectural sheets." },
      ],
      footnote:
        "We measure what the drawings show. Pipe sizing, design and compliance with the governing code, such as the [International Plumbing Code](https://www.iccsafe.org/) or the [Uniform Plumbing Code](https://iapmo.org/) with local amendments, stay with the engineer of record.",
    },
    {
      id: "quantity-or-material-takeoff",
      type: "compare",
      tone: "alt",
      h2: "Quantity takeoff or material takeoff: two ways to receive it",
      intro:
        "Both come from the same measuring and the same second-estimator check, and both start at $149. Order quantities to price or circulate, and a material list to buy.",
      columns: [
        {
          title: "Plumbing quantity takeoff: net quantities to price",
          body: "A quantity takeoff (QTO) is net: what the drawings show installed, with no waste, allowance or price added. If the plans show 400 LF of 2 in. copper, the sheet says 400 LF.",
          points: [
            "Price it with your own labor units, supplier quotes and markups",
            "Give every plumbing bidder the same quantity base",
            "Check a subcontractor's quantities against an independent count",
            "Add your allowances in the open, in your own pricing",
          ],
        },
        {
          title: "Plumbing material takeoff: a list to order from",
          body: "A material takeoff (MTO), also called a plumbing material list or bill of materials, puts net, allowance and order quantity side by side and rounds up to the stick, coil or pack the product is sold in: for example, 400 LF plus a 20 LF allowance is 420 LF, or 21 sticks of 20 ft.",
          points: [
            "Buyout packages: underground (usually ordered first), waste and vent, water, storm, fixtures and trim, and equipment",
            "Long-lead equipment flagged so it can be released early",
            "Solder, flux, solvent cement and other consumables as an editable lump-sum allowance",
            "Or-equal lines listed beside the basis-of-design product",
            "Your supplier's part descriptions matched when you send a past order or catalog page",
          ],
          footer: "Not priced: your supplier quotes the list.",
        },
      ],
    },
    {
      id: "scope-gaps-we-flag",
      type: "list",
      tone: "dark",
      h2: "Scope gaps we flag on every plumbing takeoff",
      intro:
        "The costly misses sit between sheets, between trades and in notes read once. Anything the drawings leave open goes into the scope-gap log with its sheet reference instead of being guessed, ready to send as an RFI.",
      items: [
        {
          title: "Risers drawn only on the riser diagram.",
          body: "Plan view shows a pipe dropping out of sight, so we follow each riser floor to floor and carry its height into the pipe length.",
        },
        {
          title: "Plan and schedule counts that disagree.",
          body: "If the schedule lists 30 lavatories and the plans show 28, the workbook shows 28, 30 and a difference of 2 and the log cites both sheets; enlarged restroom plans are matched to the overall plan so no fixture is counted twice.",
        },
        {
          title: "Underground drawn on the civil sheets.",
          body: "The building sewer and water service often sit on civil drawings at another scale, so we state where the building piping stops and the site utility starts.",
        },
        {
          title: "Work called for only in the specification.",
          body: "Insulation, pressure testing and disinfection rarely appear on the plans, so each becomes a line you price or exclude on purpose.",
        },
        {
          title: "Pipe material that a plan note and the specification disagree on.",
          body: "The conflict is logged so it is settled before anything is priced or ordered.",
        },
        {
          title: "Work between trades.",
          body: "Sleeves, firestopping and the condensate, makeup water and gas connections to mechanical equipment are counted and marked carried or excluded.",
        },
      ],
    },
    {
      id: "what-you-receive-with-a-plumbing-takeoff",
      type: "table",
      variant: "sheet",
      h2: "What you receive with a plumbing takeoff",
      intro:
        "One sheet shows both outputs: a quantities-only order stops at the Net column, and a material list carries on to the order quantity and how it is bought. Every order also comes with a CSV export that imports to QuickBooks, Sage or Procore, and on request we fill in your own bid sheet instead of our workbook.",
      caption: "Plumbing takeoff and material list, illustrative example",
      head: ["Item", "Sheet", "Net", "Allowance", "Order", "Unit", "Buy as"],
      rows: [
        ["2 in. copper tube, hard-drawn", "P-101 to P-103, riser P-602", "400", "20", "420", "LF", "21 sticks of 20 ft"],
        ["3 in. cast iron hubless, above slab", "P-101 to P-103, riser R-2", "200", "10", "210", "LF", "21 lengths of 10 ft"],
        ["2 in. copper 90-degree elbows", "Riser P-602", "60", "6", "66", "EA", "66 each"],
        ["Lavatories, LAV-1", "P-601, P-101 to P-103", "28", "0", "28", "EA", "28 each"],
        ["Floor drains with trap primers, FD-1", "Plan P-101", "12", "0", "12", "EA", "12 each"],
        ["Storage water heater, WH-1", "Schedule P-601", "2", "0", "2", "EA", "2 each, long lead"],
      ],
      note: "LAV-1 carries the plan count of 28, with the schedule's 30 in the scope-gap log. Tags, sheet numbers and allowances vary by project.",
    },
    {
      id: "need-the-takeoff-priced",
      type: "callout",
      tone: "alt",
      h2: "When you need the takeoff priced",
      body: "A takeoff stops at quantities. A [plumbing estimate](/services/plumbing-estimating) from $199 adds material at the project ZIP code, labor and markups, and a [preliminary plumbing estimate](/services/preliminary-plumbing-estimate) from $129 gives a budget range before the drawings are finished. The guide to [plumbing takeoff vs plumbing estimate](/guides/plumbing-takeoff-vs-plumbing-estimate) explains where each fits.",
      cta: { label: "See plumbing estimating", href: "/services/plumbing-estimating" },
    },
  ],
  faq: [
    {
      q: "Can you take off only some of the plumbing systems?",
      a: "Yes. You choose the systems and the quote is built on those alone. A common split keeps fixtures, waste and vent, water and storm together and handles gas, medical gas or fire sprinkler separately. Each system sits on its own tab, so it can be priced or bought on its own.",
    },
    {
      q: "Can a general contractor send one plumbing quantity takeoff to every subcontractor?",
      a: "Yes. Every plumbing bidder prices the same net quantities, so bids compare on rates and exclusions rather than on who counted what. Send the scope-gap log with the numbers and a question is answered once for everyone. The quantities are a shared baseline, not a substitute for each sub's own review: every line carries its sheet reference, so any bidder can check it and price at their own rates.",
    },
    {
      q: "How do I order a plumbing material list rather than net quantities?",
      a: "Choose **Plumbing takeoff** as the service on the [quote form](/contact?service=plumbing-takeoff#request-a-quote) and say in your message that you want a material list. Name the supplier you buy from and the package you need first, such as underground, and the fixed quote states what goes in each package.",
    },
    {
      q: "How do you set waste and fitting allowances?",
      a: "From your own history when you send it. When you do not, we state the assumption we used, where it applies and why, and nothing is hidden in a unit price. Each allowance sits in its own cell, so changing it recalculates the order quantity. Our guide to [pipe waste and fitting allowances](/guides/plumbing-pipe-waste-and-fitting-allowances) explains how to set and document them.",
    },
    {
      q: "Should I use my supplier's takeoff or order an independent plumbing material takeoff?",
      a: "Use both if you can, because they answer different questions. A supplier's list is usually built around that supplier's own products and pricing, so ask whether it names the sheet behind each line, comes as a file you can edit and covers hangers, insulation and equipment. An independent plumbing material takeoff is not tied to where you buy: every line shows its allowance and its sheet, and the same list can go to any supplier for a quote.",
    },
    {
      q: "Can you keep alternates and phases out of the base quantities?",
      a: "Yes. Add and deduct alternates are measured separately and tagged, so the base quantity never carries work the owner may not buy and each alternate can be priced on its own line. Phases are tagged as they are measured, too. Owner-furnished and by-others items are still counted and flagged, so they are neither carried by mistake nor dropped.",
    },
  ],
  related: [
    "/services/plumbing-estimating",
    "/services/preliminary-plumbing-estimate",
    "/guides/how-to-do-a-plumbing-takeoff",
    "/guides/plumbing-takeoff-checklist",
    "/guides/plumbing-pipe-waste-and-fitting-allowances",
  ],
  updated: "2026-11-20",
};

export default content;
