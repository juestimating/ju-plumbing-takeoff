# JU Plumbing Takeoff

Marketing site for plumbing takeoff and estimating services, a plumbing-only offshoot of [JU Estimating](https://www.juestimating.com).
It follows the JU Estimating design language (navy and amber, Archivo and DM Sans, blueprint-grid heroes) and strategy
(published prices, delivery in 24–72 hours, second-estimator check), with trade-specific pages for plumbing.

- 27 indexable pages: home, 8 services, 11 guides, 2 hubs, pricing, samples, FAQ, about, contact
- 6 noindex pages: thank-you and five legal drafts (privacy, terms, refunds, cookies, accessibility)
- Everything is statically generated. The only server code is the quote-form action (`src/app/actions`).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 (CSS-first, `src/styles/*.css`) · TypeScript 6 · MDX for guides ·
Zod for form validation · `next/font` (Archivo, DM Sans) · Vercel Analytics and Speed Insights (only rendered on Vercel).
No UI kit, no CMS, no database. Requires Node 22.18 or newer.

TypeScript is pinned to `~6.0` because `typescript-eslint` does not support TypeScript 7 yet. Unpin it when it does.

## Commands

```bash
npm install
npm run dev            # http://localhost:3000 (served noindex)
npm run check          # typecheck + ESLint + content lint + tests + production build
npm run lint:content   # content rules: lengths, keywords, banned phrases, prices, links (19 pages)
npm test               # quote form logic: validation, spam traps, rate limit, lead delivery
npm run audit:seo      # technical SEO audit of a running site (see "SEO checks")
```

## Environment variables

Copy `.env.example` to `.env.local`. Nothing is required to run the site locally.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin without a trailing slash. Drives canonicals, sitemap, Open Graph, JSON-LD and `llms.txt`. A Vercel Production build fails while it is blank, not https, or a placeholder (localhost, example.com). Leave it blank locally and on previews. |
| `NEXT_PUBLIC_SITE_ENV` | Set to `production` on the live domain only. Any other value serves the whole site `noindex` (header, meta and `robots.txt`). `VERCEL_ENV=production` also counts. |
| `RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_TO_EMAIL` | Email delivery of quote requests through Resend. The sender must be on a domain verified in Resend. `LEAD_TO_EMAIL` defaults to `info@juestimating.com`. |
| `LEAD_WEBHOOK_URL` | Optional JSON webhook (CRM, Zapier, Make). Email, webhook or both. |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 ID. If you switch it on, add a consent control and update the cookie policy first. |
| `NEXT_PUBLIC_BOOKING_URL` | Booking page for the "Book a 30-minute consultation" button. |
| `CSP_REPORT_ONLY` | Set to `1` to send the Content-Security-Policy as Report-Only while testing a new tag or embed. Production builds enforce the policy by default; `next dev` sends none. Read at build time, so redeploy after changing it. |

With no delivery variable set, a Vercel Production build refuses to run. Any other production-mode server (a Vercel Preview,
`next start`) shows visitors a "call or email us" message instead of silently dropping a lead. Set both email and a webhook if you
can: a lead counts as delivered when either one accepts it, so one provider outage then drops nothing.

## How the content is organized

Pages are data, rendered by templates, so heading outlines, internal links and JSON-LD stay consistent.

| What | Where |
| --- | --- |
| Service pages | `src/content/services/<slug>.ts` |
| Guides | `src/content/guides/<slug>.mdx` (exports a `meta` block, no h1 in the body) |
| Hub intros and FAQs | `src/content/hubs.ts` |
| Published prices (one source of truth) | `src/content/pricing.ts` |
| Brand, phone, hours, offices, company claims | `src/lib/site.ts` |
| Home, pricing, samples, FAQ and about copy | `src/components/home/content.ts`, `src/components/company/*/content.ts` |
| Templates | `src/components/page/*` (ContentPage, GuidePage, HubPage, Blocks, CtaBand, Faq) |
| Menus, sitemap, related links | derived from `src/content/registry.ts`, `src/content/guides.ts` and `src/lib/routes.ts` |

To add a page: create the file, add one import and one list entry in `registry.ts` (or `guides.ts`), add its links, then run
`npm run lint:content`. Service pages can override the shared "how it works" and "pricing" sections with the optional
`howItWorks`, `pricing`, `hero.note` and `price.note` fields (see `src/content/types.ts`).

## Content rules (enforced by `npm run lint:content` and the SEO audit)

- Turnaround is always "24–72 hours". Prices are only those in `pricing.ts`. No invented metrics, testimonials, guarantees or awards.
- Never describe JU as "certified" or the estimators as licensed plumbers. JU does not bid or build.
- No em dashes and no stock AI phrases. US spelling. One h1 per page, sentence-case headings.
- Sample tables and drawings are labeled illustrative. Do not add code table numbers, slopes or hanger spacing unless verified.

## SEO checks

`scripts/seo-audit.mjs` crawls a running site (sitemap, every page, 404, robots, `llms.txt`, manifest, Open Graph images) and exits 1
on any error. For a launch-grade local run:

```bash
NEXT_PUBLIC_SITE_ENV=production NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build
npx next start -p 3100        # second terminal
npm run audit:seo
```

Without those two variables the audit stops with two site-level errors by design (`origin.mismatch`, `env.noindex`).
Use `--preview --site <declared origin>` to audit everything else on a preview build.

## Security headers

`next.config.ts` sends nosniff, same-origin framing only, a strict referrer policy, a locked-down Permissions-Policy, HSTS and, in
production builds, a Content-Security-Policy that limits connections, fonts, images, styles and form posts to this site. Inline scripts
stay allowed because every page is statically generated and Next's inline data scripts cannot carry a nonce or a stable hash.
Adding a third-party tag, embed or font means extending the policy first: the GA4 hosts are added automatically when
`NEXT_PUBLIC_GA_ID` is set, and anything else is blocked. Set `CSP_REPORT_ONLY=1` to test a change without blocking, then look for
"[Report Only]" lines in the browser console (ignore ones whose source is a browser extension). Vercel preview deployments get the
same policy, so the Vercel toolbar (it loads from vercel.live) is blocked there; production is unaffected.

## Abuse protection

The quote form is the only server code. Its in-app limiter keeps counters in each server instance's memory, so on Vercel it slows
casual spam but cannot stop a determined sender, and the form's action id is public in the page scripts. Code already caps the
Server Action body at 128 KB (a real request is well under 50 KB). The rest is an owner action in the Vercel dashboard.

**Owner action, before launch: add a Firewall rate-limit rule.**

1. Open the project, then Firewall, then Configure, then New Rule.
2. If: Server Action Name equals `src/app/actions/quote.ts#submitQuote`. This condition needs Next.js 15.5 or newer; this site runs 16.4.
   Pick the name from the list the dashboard shows, because the exact format could not be checked on the live project (Vercel's docs
   example is `app/auth/actions.ts#getUser`). Match on the action name, not on a path: the form posts to whichever page holds it.
3. Then: Rate Limit, Fixed Window, 10 minutes, 10 requests, key IP.
4. Set the action to Log for a week and look for real visitors who were caught, then switch it to the default 429 response.

Vercel's plan limits for rate-limit rules (a Hobby plan allows one, and counters are kept per region) can change, so confirm them in
the dashboard. If spam still gets through, add a hidden challenge such as Cloudflare Turnstile. It is not needed at launch.

## Launch checklist

1. Create the Vercel project on the JU Estimating team, connect this repo, set the variables above (production target).
2. Point the production domain at it and redirect the other host (www or apex) to the canonical one.
3. Set `NEXT_PUBLIC_SITE_URL` to that origin and `NEXT_PUBLIC_SITE_ENV=production`, redeploy, and run `npm run audit:seo` against it.
4. Verify a sending domain in Resend, set the lead variables, and send one real test request through the form. Then add the
   Firewall rate-limit rule described under "Abuse protection".
5. Open the Cal.com booking link in a browser and confirm it loads.
6. Have an attorney review the five legal drafts. Replace every highlighted `CONFIRM:` marker, then remove `noindex: true` for each in
   `src/lib/routes.ts` and the page metadata.
7. Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools. Claim or verify the existing Google Business Profiles
   for the two offices instead of creating new ones: Google allows one profile per business location, so check whether JU Estimating
   already has one at either address first. If an office does not receive walk-in customers, set its profile up as a service-area
   business with the address hidden.
8. Replace the illustrative samples with sanitized real files if available, and add real testimonials and project photos only with permission.

## Known gaps (need the owner)

- Company-wide claims (500+ contractors, 15+ years, all 50 states) come from the JU Estimating site and are labeled as company-wide.
- Process details written from the brief (for example how allowances and fittings are handled) should be confirmed against JU practice.
- Payment terms, refunds, retention period and governing law are unconfirmed and left as `CONFIRM:` markers in the legal drafts.
- No testimonials, case studies or photos are shown, on purpose, until real ones exist.
- Direct plan-file upload is not built. Visitors send a link or email the set. Vercel Blob is the usual next step.
