import type { PageContent } from "@/content/types";

const content: PageContent = {
  slug: "plumbing-bid-preparation",
  group: "services",
  nav: {
    label: "Bid preparation",
    blurb: "Bid form, scope letter, alternates and addenda check, ready to sign.",
    icon: "file-check",
  },
  seo: {
    title: "Plumbing bid preparation from $199 | JU Plumbing Takeoff",
    description:
      "Plumbing bid preparation from $199: bid form, scope letter, alternates, unit prices and addenda check, ready to sign in 24–72 hours. Get a fixed quote.",
    keywords: [
      "plumbing bid preparation",
      "plumbing bid package",
      "plumbing proposal",
      "plumbing bid forms",
      "plumbing bid preparation services",
      "plumbing scope letter",
      "plumbing bid submission",
    ],
  },
  hero: {
    h1: "Plumbing bid preparation services",
    lead:
      "Plumbing bid preparation turns a finished estimate into a bid that is complete and consistent with the bid documents. We build the bid form, scope letter, alternates, unit prices and document checklist for the owner or general contractor (GC), check them against the instructions to bidders, and hand them to you to review and sign. Prices start at $199 and delivery takes 24–72 hours.",
    illustration: "bid-package",
    bullets: [
      "Checked against the instructions to bidders",
      "Addenda logged and carried to the bid form",
      "Ready for your signature and submission",
    ],
  },
  price: { from: 199, display: "From $199", turnaround: "24–72 hours" },
  howItWorks: {
    h2: "How plumbing bid preparation works",
    intro: "From your bid documents and your numbers to a bid package ready to sign in 24–72 hours, with no obligation until you approve the quote.",
    steps: [
      {
        title: "Send the bid documents and your numbers.",
        body: "Share the plan set, the bid form, the instructions to bidders and every addendum, with the closing date and time, plus your estimate and any supplier quotes you want carried into the price.",
      },
      {
        title: "Get a fixed quote.",
        body: "We review the documents and send a fixed price with deliverables and a delivery date, usually within 10 minutes during business hours. That price holds unless the scope changes.",
      },
      {
        title: "Receive your bid package.",
        body: "Approve the quote and we start. The package comes back normally within 24–72 hours, and you review, sign and submit the bid yourself.",
      },
    ],
  },
  pricing: {
    paragraphs: [
      "**What moves the price:** the form the owner prescribes, how many alternates and unit prices there are, how many addenda arrive and how late, and how complete your estimate is. **What doesn't:** the dollar value of your bid.",
      "Revisions for addenda are included. Added scope or a major redesign is quoted separately. Compare every service on the [pricing page](/pricing).",
    ],
  },
  serviceType: "Plumbing bid preparation",
  blocks: [
    {
      type: "table",
      id: "plumbing-bid-package-contents",
      h2: "Plumbing bid package contents: what goes in and who supplies it",
      intro:
        "We build each document from your estimate and the bid documents; the price, the markups and the decision to bid stay with you. The last column shows who supplies each one.",
      caption: "Typical plumbing bid package, with the source of each document",
      head: ["Document", "What it contains", "Who supplies it"],
      rows: [
        ["Bid form", "Base bid, alternates, unit prices, addenda numbers, signature block", "We complete it; you sign"],
        ["Scope letter or proposal", "Inclusions by system, exclusions, clarifications, validity period", "We draft it; you approve it"],
        ["Alternates and unit prices", "Each add or deduct, and each unit price with its unit and quantity limit", "We draft them; you confirm the numbers"],
        ["Schedule and phasing", "Mobilizations, durations, long-lead equipment and work hours the price assumes", "We draft it; you confirm what your crews can commit to"],
        ["Addenda log", "Each addendum by number and date, and the lines it changed", "We keep it and carry the numbers to the bid form"],
        ["Bid security and surety letter", "Bid bond or other security; a surety letter when bonds are required", "Your surety or bank issues them; we list form, amount and delivery"],
        ["Insurance certificate", "Coverages, limits and endorsements the contract names", "Your broker issues it; we list what is required"],
        ["Forms and affidavits", "Non-collusion, drug-free workplace, E-Verify, prevailing wage, participation", "You sign; we fill in project data and flag notary blocks"],
        ["Qualifications and references", "License number, years in business, references, safety record", "You supply them; we format them"],
        ["Submission checklist", "Closing date and time, delivery method, copies, envelope or portal rules", "We write it; you submit"],
      ],
      note:
        "Which documents apply depends on the owner, the funding and the contract. A private subcontract bid is often a proposal letter, with insurance and any bond requested at award.",
    },
    {
      type: "list",
      id: "compliance-mistakes-that-get-plumbing-bids-rejected",
      tone: "dark",
      h2: "Compliance mistakes that get a plumbing bid thrown out",
      intro:
        "A bid can be rejected as non-responsive for reasons that have nothing to do with price. We check every package for these six, and the [plumbing bid checklist](/guides/plumbing-bid-checklist) covers the full pre-submission list.",
      items: [
        { title: "An addendum that was never acknowledged.", body: "Bid forms list addenda by number, and skipping one, even one that never touched plumbing, can make the bid non-responsive." },
        { title: "A bid form altered, incomplete or out of balance.", body: "Retyping the prescribed form, writing a condition into it, leaving a required line blank or submitting an extension that disagrees with its total can disqualify the bid." },
        { title: "Missing or wrong bid security.", body: "Public work is strict about the bond amount, a bond form the owner accepts and delivery before the closing time." },
        { title: "A signature or affidavit that does not count.", body: "Unsigned forms, a signer without authority to bind the company, blank notary blocks and front-end affidavits (non-collusion, E-Verify, participation) left incomplete all count against the bid." },
        { title: "Late or misdirected delivery.", body: "Portals and bid rooms close at a stated time, and a late bid, or one sent to the wrong address, portal or person, usually comes back unopened." },
        { title: "Exclusions that contradict the documents.", body: "Taking exception to the specification can disqualify a public bid, and exclusions copied from the last job make a private bid hard to level against other subs." },
      ],
    },
    {
      type: "prose",
      id: "how-we-check-a-plumbing-bid-package",
      h2: "How we check a plumbing bid package before it reaches you",
      paragraphs: [
        "The scope letter is written system by system from your estimate, with each exclusion tied to a drawing note, a specification section or a clarification you asked for, and open drawing conflicts become clarifications or RFIs. Then a second estimator reads the package against the instructions to bidders:",
      ],
      bullets: [
        "every required form is present and every addendum is acknowledged by number",
        "extensions and totals are recalculated, not eyeballed",
        "exclusions are compared with the specification for scope the price should carry",
        "the validity period, closing time and delivery method are on the submission checklist",
      ],
    },
    {
      type: "table",
      id: "what-you-receive-with-plumbing-bid-preparation",
      tone: "alt",
      variant: "sheet",
      h2: "What you receive with plumbing bid preparation",
      intro:
        "Five documents come back for you to review: the completed bid form, scope letter, alternates and unit price schedule, addenda log and submission checklist. The log ties each change to its line on the bid form.",
      caption: "Illustrative addenda and alternates log for one plumbing bid",
      head: ["Ref", "What changed", "Lines affected", "On the bid form"],
      rows: [
        ["Addendum 1", "Revised fixture schedule, 2 restrooms added", "Fixture counts and rough-in", "Acknowledged, counts updated"],
        ["Addendum 2", "Bid date moved back 1 week", "Submission checklist", "Acknowledged, date updated"],
        ["Alternate 1", "Add: tankless water heaters in place of storage units", "Equipment line", "Priced separately from the base bid"],
        ["Unit price 1", "Rock encountered in underground trenches", "Per cubic yard", "Entered with unit and conditions"],
        ["Question 1", "Fixture schedule and plans disagree on a lavatory type", "Scope-gap log", "Clarification written, RFI drafted"],
      ],
      note:
        "When an addendum is issued after delivery, we update the affected lines, the log and the acknowledgment, and reissue the package with the changes flagged.",
    },
  ],
  faq: [
    {
      q: "How do you write a plumbing bid proposal?",
      a: "Start from the final estimate and write it in a fixed order: base bid, scope system by system, exclusions, the clarifications you priced around, alternates, unit prices, schedule assumptions, validity period and signature block. Tie each line to the drawings or specification so the reader can check it. We draft the letter from your estimate for you to edit and sign.",
    },
    {
      q: "What should a plumbing bid exclude?",
      a: "Only what the contract documents let you exclude, and name each item. Common candidates are excavation and dewatering by others, rock, concrete cutting and patching, utility tap and connection fees, firestopping by another trade and the supply of owner-furnished fixtures, with setting and connecting stated separately. Check how the specification splits the work first; the [plumbing takeoff checklist](/guides/plumbing-takeoff-checklist) has a who-carries-what table. Vague exclusions invite disputes after award.",
    },
    {
      q: "Can you fill in plumbing bid forms from the owner or general contractor?",
      a: "Yes. We complete the owner's form, the general contractor's form or your own template, with your final number, addenda numbers and company details where the form asks. We never alter a prescribed form or write conditions into it; clarifications belong in the scope letter. You review the filled form, sign it and submit it under your own name.",
    },
    {
      q: "Do you provide bid bonds or insurance certificates?",
      a: "No. Bid bonds and surety letters come from your surety, and insurance certificates come from your broker. We list the bonds, limits and endorsements your documents require and check what comes back against that list, but we do not issue bonds, sell insurance or give legal advice.",
    },
    {
      q: "Is plumbing bid preparation the same as a plumbing estimate?",
      a: "No. A plumbing estimate prices the work: quantities, labor, material, equipment and markups. Bid preparation packages that price for submission: the bid form, scope letter, alternates, unit prices and supporting documents. You can order either alone. If you already priced the job, send your estimate and we build around it. If you have only quantities, start with [plumbing estimating](/services/plumbing-estimating).",
    },
    {
      q: "Can you help with public bids that need prevailing wage or DBE forms?",
      a: "Yes, with the paperwork. We list every form the instructions to bidders name, complete them from the project data and company details you give us, and flag those that need a notary or witness. Whether your firm qualifies as a disadvantaged business enterprise (DBE), which wage rate applies and how a good-faith effort is documented are decisions for you, the owner and your counsel.",
    },
  ],
  related: [
    "/services/plumbing-estimating",
    "/services/monthly-plumbing-estimating",
    "/services/plumbing-takeoff",
    "/guides/plumbing-bid-checklist",
    "/guides/plumbing-estimating-mistakes",
  ],
  updated: "2026-11-20",
};

export default content;
