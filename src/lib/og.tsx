import { ImageResponse } from "next/og";
import { PRICE_ROWS } from "@/content/pricing";
import type { GuideMeta, PageContent } from "@/content/types";
import { CLAIMS, SITE } from "./site";

/**
 * Shared layout for every Open Graph card (1200 x 630). Navy blueprint grid, amber accent bar,
 * white headline, price chip and the wordmark with the domain. next/og only ships one regular-weight
 * font (Geist), so the headline gets a thin same-color stroke to read as bold. No font downloads.
 */

const NAVY = "#1f1b50";
const AMBER = "#f5b400";
const W = 1200;
const H = 630;

export type OgCard = {
  /** Group label above the headline, e.g. "Plumbing services". */
  kicker: string;
  /** The page title (h1). */
  title: string;
  /** First chip is the filled amber one (price); the rest are outlined. */
  chips: string[];
};

const host = (() => {
  try {
    return new URL(SITE.url).host;
  } catch {
    return SITE.url;
  }
})();

/** Smaller type for longer titles so a headline never runs past three lines. */
const titleSize = (t: string) => (t.length <= 26 ? 92 : t.length <= 42 ? 80 : t.length <= 58 ? 68 : 58);

function Card({ kicker, title, chips }: OgCard) {
  const size = titleSize(title);
  return (
    <div style={{ display: "flex", position: "relative", width: W, height: H, background: NAVY, color: "#ffffff" }}>
      {/* blueprint grid, faint */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* amber accent bar */}
      <div style={{ display: "flex", position: "absolute", top: 0, left: 0, width: 20, height: H, background: AMBER }} />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: W, height: H, padding: "64px 72px 52px 100px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* upper-cased here, not with textTransform: the transform leaves an uneven gap after some words */}
          <div style={{ display: "flex", color: AMBER, fontSize: 28, letterSpacing: 5, marginBottom: 26 }}>{kicker.toUpperCase()}</div>
          <div
            style={{
              display: "flex",
              fontSize: size,
              lineHeight: 1.06,
              letterSpacing: -1,
              WebkitTextStroke: `${Math.max(1, Math.round(size / 36))}px #ffffff`,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", marginBottom: 34 }}>
            {chips.map((c, i) => (
              <div
                key={c}
                style={
                  i === 0
                    ? { display: "flex", background: AMBER, color: NAVY, fontSize: 30, padding: "10px 24px", borderRadius: 6, marginRight: 16 }
                    : { display: "flex", border: "2px solid rgba(255,255,255,0.5)", fontSize: 30, padding: "8px 22px", borderRadius: 6, marginRight: 16 }
                }
              >
                {c}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: 22 }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: 28, letterSpacing: 0.5 }}>
              <div style={{ display: "flex", width: 14, height: 14, background: AMBER, marginRight: 14 }} />
              {SITE.name}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.72)" }}>{host}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ogImage(card: OgCard): ImageResponse {
  return new ImageResponse(<Card {...card} />, { width: W, height: H });
}

/** Site-wide default card (home page and every page without its own image). */
export function siteCard(): OgCard {
  const from = Math.min(...PRICE_ROWS.filter((r) => r.group === "takeoff").map((r) => r.from ?? Infinity));
  return { kicker: `A ${SITE.parentBrand} service`, title: SITE.tagline, chips: [`Takeoffs from $${from}`, CLAIMS.turnaround] };
}

/** Service pages: h1, group label, starting price and turnaround from the page data. */
export function pageCard(p: PageContent): OgCard {
  return {
    kicker: "Plumbing services",
    title: p.hero.h1,
    chips: [p.price.display, p.price.turnaround],
  };
}

/** Guides carry no price: the category is the lead chip, reading time the second. */
export function guideCard(m: GuideMeta): OgCard {
  return { kicker: "Plumbing guide", title: m.h1, chips: [m.category, `${m.readingMinutes} min read`] };
}
