import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "industrial-plumbing-estimating",
  group: "services",
  nav: {
    label: "Industrial plumbing",
    blurb: "Plants, warehouses, process water and large-diameter pipe.",
    icon: "factory",
  },
  seo: {
    title: "Industrial plumbing estimating services from $349",
    description:
      "Industrial plumbing estimating for plants, warehouses and process piping scope, from $349 in 24–72 hours. Larger sets are confirmed at intake. Get a quote.",
    keywords: [
      "industrial plumbing estimating",
      "industrial piping takeoff",
      "process piping plumbing estimate",
      "warehouse plumbing estimate",
      "industrial plumbing estimate",
    ],
  },
  hero: {
    h1: "Industrial plumbing estimating services",
    lead: "Industrial plumbing estimating for plants, warehouses and manufacturing buildings: process water, compressed air, acid or chemical waste, trench drains, emergency fixtures and large-diameter pipe, measured from your drawings. We mark where plumbing hands off to process piping. From $349 in 24–72 hours, with larger sets confirmed at intake.",
    illustration: "process-piping",
    bullets: [
      "Acid waste, trench drains and emergency fixtures",
      "Large pipe, heavy supports and work at height",
      "Process handoffs marked at each machine",
    ],
  },
  price: { from: 349, display: "From $349", turnaround: "24–72 hours", note: "Larger sets are confirmed at intake." },
  serviceType: "Industrial plumbing estimating",
  blocks: [
    {
      type: "scope",
      id: "what-we-measure-on-an-industrial-plumbing-takeoff",
      h2: "What we measure on an industrial plumbing takeoff",
      tone: "alt",
      intro:
        "Pipe is measured by size, class, material and joint type, so large pipe is never averaged into small, and plans are checked against sections for elevation. P&IDs, line lists and pipe class specifications are read with the plans when they are issued. Smaller commercial buildings belong on [commercial plumbing estimating](/services/commercial-plumbing-estimating).",
      illustration: "process-piping",
      items: [
        { label: "Large-diameter drain and waste pipe", unit: "LF", note: "Cast iron, ductile iron or plastic, by size." },
        { label: "Underground drain and sewer pipe", unit: "LF", note: "Trench length, bedding and backfill." },
        { label: "Trench drains and channel drains", unit: "LF", note: "Channel by length and width, with grates, frames and outlets." },
        { label: "Floor drains, floor sinks and hub drains", unit: "EA", note: "Heavy-duty bodies, sediment buckets, grates, funnels and trap primers." },
        { label: "Acid and chemical waste pipe", unit: "LF", note: "Polypropylene or PVDF by size and joint type, with neutralization tanks counted separately." },
        { label: "Domestic and process water pipe", unit: "LF", note: "Copper, stainless steel, CPVC, PVC or steel as specified, by size and pipe class." },
        { label: "Compressed air piping", unit: "LF", note: "Where the specification places it in plumbing: pipe, drops, drains and isolation valves." },
        { label: "Emergency showers and eyewash stations", unit: "EA", note: "Units by type, with their tepid supply and drain." },
        { label: "Large valves and flanged joints", unit: "EA", note: "Gate, butterfly and check valves, flanges, gaskets and bolt sets by size and pressure class." },
        { label: "Heavy hangers, supports and bracing", unit: "EA", note: "Clevis hangers, trapeze framing, riser clamps and bases, with the spacing assumption stated." },
        { label: "Roof and overflow drains", unit: "EA", note: "Primary and overflow leaders on large roofs, tied to the underground storm." },
        { label: "Gas piping to heaters and equipment", unit: "LF", note: "Steel pipe to unit heaters and rooftop units, with regulators and shutoffs." },
      ],
    },
    {
      type: "compare",
      id: "plumbing-scope-we-measure-and-process-scope-we-mark",
      h2: "Plumbing scope we measure and process scope we only mark",
      intro:
        "Division 22 is plumbing, Division 23 is mechanical, and process piping sits in sections of its own, as laid out in [CSI MasterFormat](https://www.csiresources.org/home). We follow the line your documents draw.",
      columns: [
        {
          title: "Measured in the plumbing takeoff",
          body: "Everything the plumbing drawings and the Division 22 specification assign to plumbing: sanitary and storm drainage, domestic water, compressed air where it is specified there, gas to equipment, emergency fixtures, floor and trench drains, and interceptors.",
          points: ["Fittings, valves, supports and specialties by type", "Connections to equipment, from the schedules and details"],
        },
        {
          title: "Marked as a handoff",
          body: "Process lines on P&IDs, hydronic and steam piping, equipment selection and controls. We list where plumbing meets each one, so nothing falls between trades.",
          points: ["The boundary is written at each machine and header", "Unclear ownership goes in the scope-gap log as an RFI"],
          footer: "We measure from drawings. We do not design, size or specify process or mechanical systems.",
        },
      ],
    },
    {
      type: "cards",
      id: "industrial-plumbing-estimating-by-facility-type",
      h2: "Industrial plumbing estimating by facility type",
      tone: "alt",
      columns: 3,
      cards: [
        { title: "Warehouses and distribution centers", body: "Drain-heavy and fixture-light, with long roof-drain and underground runs.", icon: "warehouse" },
        { title: "Manufacturing plants", body: "Domestic and process water, compressed air, floor drains and emergency fixtures across a large floor.", icon: "factory" },
        { title: "Food and beverage plants", body: "Sanitary floor drains, washdown stations, hot water at volume and solids interceptors.", icon: "droplets" },
        { title: "Chemical and laboratory areas", body: "Acid waste, neutralization, dedicated vents and emergency showers where corrosive liquids are handled.", icon: "alert" },
        { title: "Heavy underground work", body: "Deep drains and large sewers under thick slabs.", icon: "layers" },
        { title: "Offices and amenity space in a plant", body: "Restrooms, locker rooms and break rooms, measured the way commercial plumbing is.", icon: "building" },
      ],
    },
    {
      type: "list",
      id: "scope-gaps-on-industrial-plumbing-bids",
      h2: "Common scope gaps on industrial plumbing bids",
      tone: "dark",
      items: [
        {
          title: "Large-pipe joints, fittings and restraints.",
          body: "Welded, grooved, flanged and fusion joints are counted separately by size, and fittings, couplings, flange kits and restraints are priced one by one. On single-line drawings, the fitting allowance is stated.",
        },
        {
          title: "Height, access and shutdown windows.",
          body: "Lifts, scaffolding, work over live equipment and shutdown windows are carried as stated conditions, and you can replace any of them with your own.",
        },
        {
          title: "Supports and hanger points.",
          body: "Supports follow the specification, and the structure decides where pipe can hang. When the structural sheets do not define support points, we raise an RFI.",
        },
        {
          title: "Thick slabs and underground work.",
          body: "Saw cutting, trenching, shoring and patching are priced as their own lines, and the estimate states who cuts, who digs and who restores the slab.",
        },
        {
          title: "Trench drain embedment.",
          body: "Trench drains are set before the slab pour, so the estimate notes who sets the channel and who supplies the grates.",
        },
        {
          title: "Testing, flushing and temporary service.",
          body: "Hydrostatic testing and flushing of large lines, and temporary water or drains in an operating plant, are each stated as included, excluded or by others.",
        },
      ],
    },
    {
      type: "table",
      id: "illustrative-industrial-plumbing-takeoff-quantities",
      h2: "Illustrative quantities from an industrial plumbing takeoff",
      tone: "alt",
      intro:
        "An extract for a small manufacturing building. Pipe is carried by size, class and material on a tab per system, and the [basis of estimate](/guides/how-to-estimate-a-plumbing-job) states pipe class and joint type, support spacing, height and access conditions and each handoff to process or mechanical scope.",
      variant: "sheet",
      caption: "Illustrative extract for a small manufacturing building: round numbers, not project data",
      head: ["Item", "Source", "Qty", "Unit"],
      rows: [
        ["Hubless cast iron drain, 6 in. and 8 in.", "Plumbing plans, sections", "600", "LF"],
        ["Underground PVC sewer, 8 in.", "Underground plan, profiles", "350", "LF"],
        ["Trench drain channel with grates", "Plumbing plans, details", "120", "LF"],
        ["Polypropylene acid waste pipe, 3 in.", "Acid waste plan, riser", "220", "LF"],
        ["Compressed air pipe, 2 in.", "Plumbing and mechanical plans", "500", "LF"],
        ["Emergency shower and eyewash units", "Plumbing plans, schedule", "6", "EA"],
        ["Clevis hangers and trapeze supports, large pipe", "Details, specification", "120", "EA"],
      ],
      note: "In the real file every line cites its sheet and detail. Pricing, labor basis and accuracy follow the method on [plumbing estimating services](/services/plumbing-estimating).",
    },
  ],
  faq: [
    {
      q: "How is an industrial plumbing estimate different from a commercial one?",
      a: "Pipe is larger and heavier, materials vary more, and the work sits higher in more crowded space. The measuring is the same, but the estimate carries lines a commercial job rarely has, such as acid waste, process water, trench drains and heavy supports, plus stated height and access conditions.",
    },
    {
      q: "Can you prepare a process piping plumbing estimate for lines the plumber installs?",
      a: "Yes, when the drawings and the specification assign those lines to the plumbing contractor, measured by size, material and joint type. Lines specified as process piping on P&IDs sit outside the standard plumbing scope: tell us at intake if you need them priced, and we confirm before we quote. We never design or size process lines.",
    },
    {
      q: "Do you estimate acid waste and chemical drainage?",
      a: "Yes, as drawn and specified: corrosion-resistant pipe by size and joint type, fittings, neutralization tank connections, sample points, vents and supports. Which chemicals the system handles, and what pipe suits them, is the engineer's decision; we do not select materials or check chemical compatibility.",
    },
    {
      q: "How do you price emergency showers and eyewash stations?",
      a: "Each unit is counted by type from the schedule, and its tepid supply, mixing valve, drain and any freeze protection are measured as drawn. Specifications commonly cite ANSI/ISEA Z358.1 for these units. A unit shown with no drain or no tempered supply is flagged as a question for the design team.",
    },
    {
      q: "Where does a warehouse plumbing estimate stop?",
      a: "At the scope the plumbing drawings assign: roof and overflow drains, underground storm and sanitary, the water service connection, a restroom core and gas to unit heaters. Fire sprinkler work is a separate scope in many markets, so it is shown as included, excluded or by others. Racking, dock equipment and process lines are marked only where the plumbing drawings touch them.",
    },
    {
      q: "What drawings do you need for an industrial piping takeoff?",
      a: "Send the plumbing plans, underground and site utility plans, details, schedules and the Division 22 specification, plus the structural sheets that show support points. Add P&IDs, line lists or pipe class specifications when process lines are in scope, and every addendum. If you need quantities only, say so: an industrial piping takeoff is quoted like any other project, with a fixed price before work starts.",
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
