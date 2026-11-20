import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Served at /manifest.webmanifest and linked from every page head by Next.js.
 * display "browser" keeps this a normal website (no install prompt); the manifest only supplies
 * the name, theme color and icons that browsers and search results pick up.
 * The icons are the app icon files in src/app: icon.svg, apple-icon.png (180 x 180) and favicon.ico (32 and 48 px).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: `${SITE.tagline} for plumbing contractors, general contractors and builders.`,
    start_url: "/",
    scope: "/",
    lang: "en-US",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#1f1b50",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/favicon.ico", sizes: "32x32 48x48", type: "image/x-icon" },
    ],
  };
}
