import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "monthly-plumbing-estimating",
  group: "services",
  nav: {
    label: "Monthly or dedicated",
    blurb: "$1,499 a month for 10–15 projects, or a dedicated estimator on a custom quote.",
    icon: "calendar",
  },
  seo: {
    title: "Monthly plumbing estimating or a dedicated estimator",
    description:
      "Monthly plumbing estimating: $1,499 a month for 10–15 projects (takeoffs, estimates, material lists, bid support) or a dedicated estimator. Get a quote.",
    keywords: [
      "monthly plumbing estimating",
      "dedicated plumbing estimator",
      "plumbing estimating subscription",
      "monthly plumbing estimating service",
      "remote plumbing estimator",
      "hire a plumbing estimator vs outsource",
      "plumbing estimating package",
    ],
  },
  hero: {
    h1: "Monthly plumbing estimating or a dedicated plumbing estimator",
    lead:
      "$1,499 a month covers 10–15 projects, each with the same takeoff and estimate files as a one-off order, plus material lists, bid filing support and consultations. If your bid calendar is a full-time job, a dedicated estimator from our team can work remotely in your templates instead, on a custom quote.",
    primaryCta: "Request a quote",
    secondaryCta: { label: "Compare pricing", href: "/pricing" },
    illustration: "takeoff-sheet",
    bullets: [
      "10–15 projects a month, one fixed fee",
      "Takeoffs, estimates and material lists",
      "Bid filing support and consultations",
    ],
  },
  price: {
    from: 1499,
    unit: "per month",
    display: "$1,499 / month",
    turnaround: "Priority within 24–72 hours",
    note: "Dedicated estimator: custom quote",
  },
  howItWorks: {
    h2: "How monthly plumbing estimating starts",
    intro: "One setup for both options, with nothing owed until you approve a quote.",
    steps: [
      {
        title: "Tell us how you bid.",
        body: "Send a plan set or book a 30-minute consultation, with your systems, bid forms, monthly volume and what you will hand over: templates, assemblies, labor method and markups (rates optional). NDA first on request.",
      },
      {
        title: "Get a fixed or custom quote.",
        body: "A fixed quote for the monthly package, a custom quote for a dedicated estimator. Quotes and consultations are free, and work starts only when you approve.",
      },
      {
        title: "Send each set with its bid date.",
        body: "Share plans by link, upload or email. Monthly files come back within 24–72 hours; a dedicated estimator works to the schedule in your quote.",
      },
    ],
  },
  pricing: {
    paragraphs: [
      "**Quoted separately:** systems added after the scope is set and major redesigns, always before work begins. Per-project prices for lighter months are on the [pricing page](/pricing).",
      "**Dedicated estimator:** a custom quote set by your bid volume, the work you hand over and the schedule you need.",
    ],
  },
  serviceType: "Monthly plumbing estimating",
  blocks: [
    {
      type: "scope",
      id: "what-the-monthly-package-includes",
      h2: "What the monthly plumbing estimating package includes",
      intro:
        "Each project gets the same files and second-estimator check as a one-off order; what changes is that you buy the month, not the job.",
      items: [
        { label: "Plumbing takeoffs", unit: "per project", note: "Quantities by system, with marked-up plans and a live Excel workbook." },
        { label: "Priced plumbing estimates", unit: "per project", note: "Labor, material, equipment and markups, with a basis of estimate and the [AACE estimate class](/services/plumbing-estimating) stated." },
        { label: "Material lists", unit: "per project", note: "Grouped for ordering with waste and fitting allowances, as on a [plumbing material takeoff](/services/plumbing-takeoff#quantity-or-material-takeoff)." },
        { label: "Bid filing support", unit: "per bid", note: "Help assembling the package for the bids you submit." },
        { label: "Consultations", unit: "included", note: "Calls on scope, drawing conflicts and open questions before a bid closes." },
        { label: "Delivery within 24–72 hours", unit: "per project", note: "Send the bid date with each set." },
        { label: "Revisions for addenda", unit: "per addendum", note: "Included on every project." },
        { label: "Scope-gap log", unit: "per project", note: "Drawing conflicts and missing information, formatted as RFIs." },
      ],
      footnote: "Not included: engineering, design or code-compliance work. We measure and price from your drawings.",
    },
    {
      type: "compare",
      id: "per-project-monthly-or-dedicated-estimator",
      tone: "alt",
      h2: "Per-project pricing, the monthly package or a dedicated estimator",
      columns: [
        {
          title: "Per project",
          body: "From $149 for a plumbing takeoff or $199 for a plumbing estimate, with a fixed quote for each job.",
          points: ["Suits uneven or seasonal volume", "No monthly fee to size or manage"],
        },
        {
          title: "Monthly package",
          body: "$1,499 a month for 10–15 projects, handled by our estimating team.",
          points: ["Suits a contractor who bids most weeks", "One monthly fee you can budget"],
        },
        {
          title: "Dedicated estimator",
          body: "A named estimator from our team on a custom quote, with delivery set to your schedule.",
          points: [
            "Suits a full bid calendar, or an empty desk while your own estimator is out or being replaced",
            "Adds bid management, scheduling, change orders and plan-room profiles",
          ],
          footer: "[What a dedicated plumbing estimator handles](/services/monthly-plumbing-estimating#dedicated-plumbing-estimator)",
        },
      ],
    },
    {
      type: "scope",
      id: "dedicated-plumbing-estimator",
      h2: "Dedicated plumbing estimator: what one named estimator handles",
      intro:
        "One named estimator from our team works remotely in your templates, systems and bid calendar. You keep the decision on what to bid, at what number and what goes out under your name.",
      items: [
        { label: "Plumbing takeoffs by system", unit: "per project", note: "Each quantity tied to its sheet." },
        { label: "Estimates in your format", unit: "per project", note: "Your template, labor method and markups." },
        { label: "Bid log", unit: "ongoing", note: "Every invitation, due date, addendum and status in one place." },
        { label: "Plan-room profiles", unit: "ongoing" },
        { label: "Bid forms and proposals", unit: "per bid", note: "Prepared for your signature, as in [plumbing bid preparation](/services/plumbing-bid-preparation)." },
        { label: "Plumbing phase schedules", unit: "per project", note: "Underground, rough-in, top-out where it applies, trim and testing." },
        { label: "Change-order pricing", unit: "per change", note: "The quantity difference traced to the revised sheet." },
        { label: "Buyout material lists", unit: "per project", note: "For ordering when a bid becomes a job." },
        { label: "Scope-gap logs and RFIs", unit: "per project", note: "Logged with sheet references." },
      ],
      footnote: "What you hand over is written into the quote. Not included: engineering, design or code-compliance work.",
    },
    {
      type: "compare",
      id: "hire-a-plumbing-estimator-or-outsource",
      tone: "alt",
      h2: "Hire a plumbing estimator in-house or outsource: the trade-offs",
      intro:
        "Both can work; the differences are cost structure, field knowledge and continuity. Put your own figures into the [in-house cost formula](/guides/plumbing-takeoff-service-cost) before you compare.",
      columns: [
        {
          title: "Hire in-house",
          body: "A full-time estimator knows your crews and suppliers and can walk a job to judge existing conditions.",
          points: [
            "Salary, payroll taxes, benefits, software, training and management time, whether bids are heavy or light",
            "A hiring search first, then a single point of failure when the person is out or moves on",
          ],
        },
        {
          title: "Outsource to a dedicated estimator",
          body: "Priced as a custom quote against the work you hand over, not as a payroll position.",
          points: [
            "Starts with onboarding, not a hiring search, but your method has to be written down and shared",
            "Works from drawings and what you send, so site conditions arrive as photos, notes and as-builts",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is the monthly package cheaper than paying per project?",
      a: "Test it on your own last month: ask us to quote the jobs you bid, one at a time, and compare the total with the monthly fee. Per-project quotes move with sheet count, the number of systems and how fast you need them, so there is no single break-even point. [What a plumbing takeoff service costs](/guides/plumbing-takeoff-service-cost) compares the pricing models.",
    },
    {
      q: "Which option fits if I send more than 15 projects in a month?",
      a: "The monthly package is sized for 10–15 projects a month. If you expect more, tell us your volume when you ask for the first quote and we will say which option fits. A [dedicated plumbing estimator](/services/monthly-plumbing-estimating#dedicated-plumbing-estimator), priced as a custom quote, is built around a full bid calendar.",
    },
    {
      q: "Who does the work on a monthly plan?",
      a: "Our estimating team handles monthly projects, and a second estimator checks every file before it reaches you. The team works from your plan sets and any templates you share. If you want one named estimator working in your own templates and bid calendar, that is the dedicated estimator.",
    },
    {
      q: "Can I use my own templates and rates?",
      a: "Yes. Your template, rates and bid forms are optional, and we fill in your bid sheet when you send it. Without them, pricing follows the project ZIP code, including union, open-shop and prevailing-wage labor where the project calls for it. We take off in Bluebeam Revu, PlanSwift and On-Screen Takeoff, estimate in Trimble Accubid or your templates, and export Excel, CSV and PDF.",
    },
    {
      q: "What does bid filing support include?",
      a: "Bid filing support covers the bids you decide to submit: the bid form, the scope letter and a check of what the documents require. You review, sign and submit under your own name. A single bid outside a plan can be ordered as [plumbing bid preparation](/services/plumbing-bid-preparation), from $199.",
    },
    {
      q: "What does a dedicated plumbing estimator cost?",
      a: "It is a custom quote, set by your bid volume, the work you hand over (estimating only, or bid management, scheduling and change orders too) and the schedule you need. There is no published figure, because a contractor bidding daily and one bidding monthly need different things. Compare the quote with the full cost of a payroll position, not with a per-project price.",
    },
  ],
  related: [
    "/services/plumbing-estimating",
    "/services/plumbing-takeoff",
    "/services/plumbing-bid-preparation",
    "/guides/plumbing-takeoff-service-cost",
    "/guides/plumbing-takeoff-services-vs-software",
  ],
  updated: "2026-11-20",
};

export default content;
