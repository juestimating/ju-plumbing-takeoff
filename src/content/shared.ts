import type { IconName } from "./types";
import { CLAIMS } from "@/lib/site";

/** The three-step process shown on every service page and the home page. */
export const HOW_IT_WORKS = {
  h2: "How a plumbing takeoff order works",
  intro: `From plans to measured quantities or a priced estimate in ${CLAIMS.turnaround}, with no obligation until you approve the quote.`,
  steps: [
    {
      title: "Send your plans.",
      body: "Share a Dropbox, Google Drive or plan-room link, email the set, or tell us where to download it. Include the plumbing sheets, fixture schedule, specifications, any addenda already issued and your bid date.",
    },
    {
      title: "Get a fixed quote.",
      body: `We review the set and send a fixed price with deliverables and a delivery date, ${CLAIMS.quote}. The price changes only if the scope does.`,
    },
    {
      title: "Receive your files.",
      body: `Approve the quote and we start. Normally within ${CLAIMS.turnaround} you receive an unlocked Excel workbook, a PDF summary, color-coded marked-up plans, a basis of estimate and a scope-gap log.`,
    },
  ],
} as const;

/** What every file includes. Reused on service pages, samples and home. */
export const DELIVERABLES: { title: string; body: string; icon: IconName }[] = [
  { title: "Unlocked Excel workbook", body: "A summary tab, a tab per system, live formulas you can edit and re-price.", icon: "file-spreadsheet" },
  { title: "PDF summary", body: "Organized by CSI MasterFormat, with Division 22 for plumbing and Divisions 21, 23 and 33 where plumbing crews work, ready for an owner, lender or general contractor.", icon: "file-text" },
  { title: "Marked-up plans", body: "Color-coded by system: cold, hot, waste, vent, storm and gas, so every quantity can be traced.", icon: "layers" },
  { title: "Basis of estimate", body: "Inclusions, exclusions and assumptions written in trade language.", icon: "clipboard-check" },
  { title: "Scope-gap log", body: "Drawing conflicts and missing information, formatted so you can send them as RFIs.", icon: "alert" },
];

/** Tools and standards table, as on the JU Estimating About page. Only list what JU states it uses. */
export const STANDARDS: { area: string; uses: string }[] = [
  { area: "Cost structure", uses: "CSI MasterFormat (Division 22 plumbing, plus 21, 23 and 33 where plumbing crews work)" },
  { area: "Estimate classes", uses: "AACE International (Class 5 to Class 1)" },
  { area: "Takeoff software", uses: "Bluebeam Revu, PlanSwift, On-Screen Takeoff" },
  { area: "Estimating software", uses: "Trimble Accubid and your own templates" },
  { area: "Exports", uses: "Excel, CSV and PDF; imports to QuickBooks, Sage and Procore" },
];

/** Plumbing drawing color legend used across diagrams, chips and marked-up plans. */
export const SYSTEM_LEGEND: { key: import("./types").SystemColor; label: string }[] = [
  { key: "cold", label: "Cold water" },
  { key: "hot", label: "Hot water and recirculation" },
  { key: "waste", label: "Sanitary waste" },
  { key: "vent", label: "Vent" },
  { key: "storm", label: "Storm drainage" },
  { key: "gas", label: "Fuel gas" },
];
