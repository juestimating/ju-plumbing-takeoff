"use client";

import { useEffect } from "react";
import { LEAD_TRACKED_KEY } from "@/components/forms/quote-config";

/**
 * Fires the GA4 `generate_lead` event once per quote submission. Render it on the thank-you page only.
 * Does nothing when gtag is not loaded (no GA measurement ID, or the visitor blocks analytics). The quote form
 * sets the sessionStorage flag to "pending" on submit and this page sets it to "done", so only a visitor who just
 * sent a request is counted, and a reload or a back-and-forth to this page is not counted twice.
 */
export function TrackLead() {
  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag !== "function") return;
    try {
      // The quote form sets "pending" on submit, so only a visitor who just sent a request counts. A bookmark, a shared link or a crawler does not.
      if (sessionStorage.getItem(LEAD_TRACKED_KEY) !== "pending") return;
      sessionStorage.setItem(LEAD_TRACKED_KEY, "done");
    } catch {
      // storage can be blocked: fall through and count the page view
    }
    w.gtag("event", "generate_lead", { lead_type: "plumbing_quote_request" });
  }, []);
  return null;
}
