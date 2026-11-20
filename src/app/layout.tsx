import type { Metadata, Viewport } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteNodes } from "@/lib/schema";
import { SITE } from "@/lib/site";

// Variable fonts: one file each, self-hosted at build time, zero layout shift.
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.tagline} | ${SITE.name}`, template: `%s | ${SITE.name}` },
  description: `${SITE.tagline} for plumbing contractors, general contractors and builders. Takeoffs from $149, delivered in 24–72 hours.`,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.parentUrl }],
  creator: SITE.legalName,
  formatDetection: { telephone: false },
  robots: SITE.isProduction
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1f1b50",
  width: "device-width",
  initialScale: 1,
};

const GA = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "") ? process.env.NEXT_PUBLIC_GA_ID : undefined;
const onVercel = Boolean(process.env.VERCEL);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${dmSans.variable}`}>
      {/* .hr: the home design primitives (src/styles/home.css) on every page */}
      <body className="hr">
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCta />
        <JsonLd nodes={siteNodes()} />
        {onVercel && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        {GA && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
