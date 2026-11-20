import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "commercial-plumbing-estimating",
  group: "services",
  nav: {
    label: "Commercial plumbing",
    blurb: "Offices, retail, restaurants, schools, fit-outs and clinics.",
    icon: "building",
  },
  seo: {
    title: "Commercial plumbing estimating services from $199",
    description:
      "Commercial plumbing estimating from $199, back in 24–72 hours: restrooms, tenant improvements, restaurants and schools, with bid-ready numbers. Get a quote.",
    keywords: [
      "commercial plumbing estimating",
      "commercial plumbing takeoff",
      "commercial plumbing bid",
      "tenant improvement plumbing estimate",
      "commercial plumbing estimate",
    ],
  },
  hero: {
    h1: "Commercial plumbing estimating services",
    lead: "Commercial plumbing estimating for offices, tenant improvements, retail, restaurants, schools, clinics and multi-story buildings. Restroom groups, carriers, interceptors and specialties are measured from your drawings and schedules, then priced into a number you can bid or check. Starting at $199 with delivery in 24–72 hours.",
    illustration: "restroom-plan",
    bullets: [
      "Risers followed floor to floor",
      "Union, open-shop or prevailing-wage rates",
      "Backflow, water heating and roof drains itemized",
    ],
  },
  price: { from: 199, display: "From $199", turnaround: "24–72 hours" },
  serviceType: "Commercial plumbing estimating",
  blocks: [
    {
      type: "scope",
      id: "what-we-measure-on-a-commercial-plumbing-takeoff",
      h2: "What we measure on a commercial plumbing takeoff",
      tone: "alt",
      intro:
        "The fixture schedule, riser diagrams, equipment schedules, Division 22 specification and any food service or lab sheets are read together, with fixtures reconciled to the plans room by room and risers checked against the plan view on every floor. General contractors use the result to carry a plumbing number or check a sub's price. Houses go to [residential plumbing estimating](/services/residential-plumbing-estimating), plants to [industrial plumbing estimating](/services/industrial-plumbing-estimating), and quantities alone to a [plumbing takeoff](/services/plumbing-takeoff) from $149.",
      illustration: "restroom-plan",
      items: [
        { label: "Fixtures by type from the schedule", unit: "EA", note: "Closets, urinals, lavatories, sinks, fountains and mop sinks, by the legend's tags." },
        { label: "Carriers and wall-hung supports", unit: "EA", note: "Counted with each wall-hung closet, urinal and lavatory." },
        { label: "ADA fixtures and exposed-pipe covers", unit: "EA", note: "Accessible fixtures, with insulation kits on exposed supplies and drains." },
        { label: "Water supply pipe by size and material", unit: "LF", note: "Copper, PEX or CPVC as specified, with mains, risers and branches apart." },
        { label: "Valves and plumbing specialties", unit: "EA", note: "Isolation, check, balancing and mixing valves, PRVs, expansion tanks and trap primers." },
        { label: "Backflow assemblies", unit: "EA", note: "Reduced-pressure and double-check, with test connections and enclosures where shown." },
        { label: "Waste, vent and storm pipe by size and material", unit: "LF", note: "Cast iron, copper or plastic where allowed, from fixture branches to the building drain." },
        { label: "Floor drains, floor sinks and cleanouts", unit: "EA", note: "By type and size, with trap seal devices and access covers." },
        { label: "Grease and other interceptors", unit: "EA", note: "The unit with its piping, venting and access." },
        { label: "Water heaters and recirculation", unit: "EA", note: "Units, circulators, return piping and relief discharge, with flue venting included or carried by others." },
        { label: "Roof and overflow drains", unit: "EA", note: "Bodies, strainers and collars, with overflow leaders kept apart from the primary." },
        { label: "Insulation, hangers and penetrations", unit: "LF, EA", note: "Insulation by the foot; hangers, sleeves, firestopping and core drilling counted." },
      ],
      footnote:
        "Gas and medical gas are measured as their own systems.",
    },
    {
      type: "cards",
      id: "commercial-plumbing-estimating-by-building-type",
      h2: "Commercial plumbing estimating by building type",
      columns: 3,
      cards: [
        { title: "Offices and tenant improvements", body: "Restroom cores, break rooms and janitor closets tied into base-building risers, often in an occupied building.", icon: "briefcase" },
        { title: "Retail and shopping centers", body: "Large roofs with many roof and overflow drains, plus a restroom core and tenant connections.", icon: "building" },
        { title: "Restaurants and food service", body: "Grease interceptors, floor sinks, indirect waste, hand sinks and the kitchen equipment connections.", icon: "utensils" },
        { title: "Schools and colleges", body: "Gang restrooms, drinking fountains and bottle fillers, science and culinary rooms, and many floor drains.", icon: "graduation-cap" },
        { title: "Clinics and healthcare", body: "Hands-free fixtures, scrub and clinical sinks, and medical gas where the drawings show it.", icon: "stethoscope" },
        { title: "Hotels and multi-story buildings", body: "Stacked bath groups, long risers and central hot water with recirculation.", icon: "hotel" },
      ],
    },
    {
      type: "list",
      id: "scope-gaps-on-commercial-plumbing-bids",
      h2: "Common scope gaps on commercial plumbing bids",
      tone: "dark",
      items: [
        {
          title: "Fixtures in the schedule but not on the plans.",
          body: "The schedule and the floor plans rarely agree on the first pass. Each difference goes to the scope-gap log as an RFI, not into a guess.",
        },
        {
          title: "Risers through rated floors.",
          body: "Each riser is followed from the service or building drain to the roof, with offsets, supports and rated-floor penetrations counted, and insulation and firestopping carried on their own lines.",
        },
        {
          title: "Carriers, access panels and blocking.",
          body: "Wall-hung fixtures need carriers and finished walls need access panels, and neither always shows on the plumbing sheet. Each is listed with who furnishes it and who installs it.",
        },
        {
          title: "Work in existing or occupied buildings.",
          body: "Coring, slab cutting, scanning, patching, after-hours work, shutdowns for tie-ins and the phasing the documents show are priced as stated conditions or marked by others, not assumed away.",
        },
        {
          title: "Testing, flushing and disinfection.",
          body: "Drainage tests and the pressure testing, flushing and disinfection of potable water piping are carried where Division 22 calls for them.",
        },
        {
          title: "Seismic bracing.",
          body: "In seismic regions, piping restraint is flagged wherever the specification or the structural sheets show bracing details.",
        },
        {
          title: "Where the water service ends.",
          body: "The tap, meter, vault or enclosure and the backflow location mark where building plumbing meets the site utility contractor. Each is marked included, excluded or by others.",
        },
      ],
    },
    {
      type: "table",
      id: "illustrative-commercial-plumbing-takeoff-quantities",
      h2: "Illustrative quantities from a commercial plumbing takeoff",
      tone: "alt",
      intro:
        "An extract for a two-story office. The workbook has a tab per system and a summary by system and floor. The basis of estimate states the labor basis, who furnishes the equipment and where the utility boundary sits, and the scope-gap log carries the schedule-to-plan RFIs.",
      variant: "sheet",
      caption: "Illustrative extract for a two-story office building: round numbers, not project data",
      head: ["Item", "Source", "Qty", "Unit"],
      rows: [
        ["Water closets, wall-hung with carriers", "Fixture schedule, restroom plans", "16", "EA"],
        ["Lavatories, accessible with pipe covers", "Fixture schedule, restroom plans", "10", "EA"],
        ["Floor drains with trap primers", "Plumbing plans", "12", "EA"],
        ["Copper water pipe, 2 in.", "Riser diagram, plan views", "400", "LF"],
        ["No-hub cast iron drain, 4 in.", "Riser diagram, plan views", "250", "LF"],
        ["Backflow assembly, 3 in.", "Water entry detail", "1", "EA"],
        ["Roof drains with overflow drains", "Roof plan, storm riser", "8", "EA"],
      ],
      note: "Riser lengths follow the floor heights in the sections. Pricing, labor basis and accuracy follow the method on [plumbing estimating services](/services/plumbing-estimating).",
    },
  ],
  faq: [
    {
      q: "How do you price a tenant improvement plumbing estimate?",
      a: "We price the new fixtures, the branch piping, the tie-ins to base-building risers and mains, and the demolition the drawings show. What the landlord provides, such as capped connections or a base-building water heater, is stated as an assumption so you can confirm it before you bid.",
    },
    {
      q: "How do you estimate restaurant plumbing and grease interceptors?",
      a: "The plumbing and food service sheets are read together. Hand, prep and floor sinks, floor drains, indirect waste and the interceptor are counted, and each equipment connection is marked direct, indirect (air gap) or by others. We do not size interceptors: the designer or the governing code does. Excavation and concrete are flagged as another trade's scope where the drawings say so.",
    },
    {
      q: "Do you count ADA fixtures and accessible pipe covers?",
      a: "Yes. Accessible water closets, lavatories, sinks, drinking fountains and showers are counted from the schedule, with covers or insulation kits on the exposed supplies and drains under accessible lavatories and sinks. Grab bars and toilet accessories are normally specified in Division 10, so they are listed as excluded unless you ask us to carry them.",
    },
    {
      q: "What if the commercial plumbing set has no riser diagram?",
      a: "Small commercial sets often show plan views only. We build the risers from the stack and main locations on each floor and the floor-to-floor heights in the sections, and record the result as an assumption. Where heights or stack locations conflict between sheets, the scope-gap log raises an RFI instead of a guess.",
    },
    {
      q: "What documents do you need for a commercial plumbing takeoff?",
      a: "Send the plumbing plans, riser diagrams, fixture and equipment schedules, details and the Division 22 specification, with every addendum. Architectural floor plans, ceiling plans and sections set the heights and fixture locations, and food service or laboratory sheets matter when those rooms are in scope.",
    },
  ],
  related: [
    "/services/plumbing-estimating",
    "/services/plumbing-bid-preparation",
    "/services/plumbing-takeoff",
    "/services/industrial-plumbing-estimating",
  ],
  updated: "2026-11-20",
};

export default content;
