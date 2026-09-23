# Technical SEO audit — 23 Sep 2026

Site: pay-calculator-australia.com (Next.js 16 static export in `calc-boiler/`, Firebase Hosting).
Method: local static build (`npx next build --webpack`), then every `out/**/index.html` parsed with BeautifulSoup
(titles, meta, canonicals, robots, OG, H1s, JSON-LD, internal links, sitemap). Lighthouse 12, mobile, simulated
throttling, 2 runs per URL (median), served from `npx serve` (gzip on). Ads and GA stayed in place for every run.

Scope: config and template-level fixes only. Page bodies and titles belong to other workstreams, so page-level
items are listed at the end and were left alone.

## Headline numbers

| | Before | After |
|---|---|---|
| Built HTML routes | 851 | 857 (main merged mid-audit) |
| Pages with a "Loading…" spinner in `<main>` and the content in a hidden div | **851 / 851** | 0 |
| Sitemap URLs with invented lastmod (Feb–Mar 2026 stagger) | 610 | 0 |
| Duplicate-URL rewrite (`/tax-on-N/` served `/tax-on/N/`) | yes | 301 |
| FAQ answers missing from HTML (accordion unmounted) | every Accordion FAQ | 0 |
| FAQPage questions not on the page | 413 | 81 (page-level, listed below) |
| Pages without og:image | 437 | 94 (single-line `openGraph` page files, listed below) |
| Pages without og:url | 413 | 3 (404, `_not-found`, noindex embed) |
| Publisher logos pointing at a 404 (`/logo.png`) or the 32px favicon | 49 lines | 0 |
| JSON-LD parse errors / duplicate FAQPage / broken breadcrumb items | 0 / 0 / 0 | 0 / 0 / 0 |
| Broken internal links, links to redirects, links without trailing slash | 0 | 0 |
| Missing/duplicate titles or descriptions (excluding the two 404 docs) | 0 | 0 |
| Pages with 0 or >1 H1 | 0 | 0 |

### Lighthouse (mobile, median of 2)

| Template | URL | Perf before → after | LCP before → after | CLS before → after | TBT before → after | FCP before → after |
|---|---|---|---|---|---|---|
| Home | `/` | 59 → **88** | 8.3 s → 3.8 s | 0.000 → 0.000 | 91 → 50 ms | 4.7 s → 1.2 s |
| Calculator | `/income-tax-calculator/` | 60 → **92** | 7.1 s → 3.3 s | 0.062 → 0.000 | 17 → 4 ms | 4.7 s → 1.2 s |
| Award page | `/retail-award-rates/` | 56 → **90** | 7.9 s → 3.6 s | 0.111 → 0.000 | 0 → 4 ms | 4.8 s → 1.2 s |
| Programmatic | `/take-home-pay-on/80000/` | 62 → **92** | 7.7 s → 3.3 s | 0.000 → 0.000 | 1 → 4 ms | 4.9 s → 1.2 s |
| Guide | `/superannuation-guide/` | 61 → **92** | 8.3 s → 3.3 s | 0.000 → 0.000 | 0 → 8 ms | 4.8 s → 1.2 s |

SEO category scored 100 on all five, before and after.

## Findings and fixes

### 1. Page content was not in `<main>` (critical, all 851 pages)

`app/loading.tsx` (boilerplate from the first commit) wrapped every page in a Suspense boundary. The static export
wrote `<main>` as a spinner (`<!--$?--><template id="B:0">…Loading...`) and the whole page body as
`<div hidden id="S:0">` after the footer, swapped in by an inline `$RC()` script. Crawlers that don't run JS (Bing's
first pass, GPTBot, ClaudeBot, PerplexityBot, social scrapers) saw a spinner. Google renders JS, but LCP waited on
the swap, and the spinner-to-content swap caused the CLS on the award and calculator pages.

**Fix:** deleted `app/loading.tsx`. A static export has nothing to wait for. Content now renders inline in `<main>`.
This is where most of the Lighthouse gain came from.

### 2. Sitemap lastmod was invented

`app/sitemap.ts` handed priority < 0.7 pages dates spread over 15 Feb–15 Mar 2026 by index. Pages at ≥ 0.7 got the
build time. Neither said when the content changed. Once Google finds lastmod unreliable it ignores it for the whole site.

**Fix:** new `lib/sitemap-lastmod.ts`. One `git log --name-only` pass at build time. Each URL gets the latest commit
that touched the files that produce it: the route directory (excluding child routes), plus the `modules/` and
`lib/data/` files it imports, followed transitively. If the page's displayed `lastReviewed` date (`lib/authors.ts`)
is later, that date wins. Shared chrome (`components/`, layout, nav, `modules/seo`) and `lib/constants` are not
followed. A nav tweak is not a content change, and almost every page imports `formatAUD` from constants. A
shallow clone, missing git, or an uncommitted file falls back to the build date. News entries keep their real
`dateModified`. The hub uses the newest article.

Result: the 23 Sep lastmod on ~814 URLs is real. The T1–T6 waves rewrote those templates and data that day. Other
pages carry 1 Jul, 28 Jul, 5 Aug, 28 Aug etc.

**Drift guards:** any static `app/` route missing from the hand-kept lists is added automatically at priority 0.7,
except routes whose metadata sets `robots` noindex. A listed slug with no route is dropped with a build warning.
Every built HTML route is in the sitemap apart from `/404/`, `/_not-found/` and the noindex `/embed/take-home-pay/`.
No sitemap URL 404s. Priorities and changefreq were checked and left alone: home 1.0, calculators 0.9, guides 0.8,
state/frequency/spokes 0.7, programmatic 0.5, legal 0.3.

### 3. Canonicals, duplicates, trailing slashes

- Every indexable page has exactly one self-referencing canonical, HTTPS, non-www, with trailing slash. 0 mismatches.
  The only non-self canonical is the noindex embed widget, which points to `/take-home-pay-calculator/` on purpose.
- `firebase.json` rewrite `/tax-on-([0-9]+)/?` → `/tax-on/:1/index.html` served the same page at a second URL. **Now a
  301**: `"regex": "^/tax-on-(?P<salary>[0-9]+)/?$"` → `/tax-on/:salary/`. That was the only rewrite. `rewrites` is now empty.
- All 31 existing redirects were checked: no source shadows a built page, and every destination exists.
- `trailingSlash: true` in both `next.config.ts` and `firebase.json`, plus `cleanUrls: true`. Firebase 301s `/x` → `/x/`
  and serves `out/404.html` with a real 404 status for unknown paths. No internal link lacks the slash or points at a redirect.

### 4. Structured data

- **FAQ answers were not in the HTML.** Radix Accordion unmounts closed panels, so every FAQ built on
  `components/ui/accordion.tsx` shipped questions only, and the answers existed only in FAQPage JSON-LD. **Fix:**
  `AccordionContent` now uses `forceMount` and hides closed panels with `data-[state=closed]:hidden`. This one
  component covers 110 files. The answers are now in the DOM for every crawler.
- **/hourly-to-salary/N/ (166 pages):** none of the FAQPage questions appeared on the page. **Fix:** one `faqItems`
  list now feeds both a visible "Quick Answers" `<dl>` and the markup, so they can't drift.
- **Home:** removed the `WebSite` `SearchAction`. The site has no search page, `/?q=` just renders the homepage and is
  robots-blocked, and Google retired the sitelinks search box in Nov 2024. Also added trailing slashes to the
  `WebSite` and `BreadcrumbList` URLs. Organization, WebSite, WebApplication, BreadcrumbList and FAQPage are all present.
- **Publisher logos:** 9 references pointed at `/logo.png`, which doesn't exist, and 40 at the 32 px favicon. Google
  wants at least 112 px. All now use `/icon-512.png`.
- **Article/NewsArticle `image`:** added at template level to the award helper (`modules/guide/modern-award-seo.ts`),
  `minimum-wage-by-age/[age]`, `modules/guide/t3-seo.tsx`, `news/[slug]` and `healthcare-worker-pay/[state]`.
- Checked and clean: every JSON-LD block parses, there are no duplicate FAQPage or BreadcrumbList blocks,
  breadcrumb positions are sequential, every breadcrumb item resolves to a built page, and Datasets have name and description.

### 5. Meta / social

- **og:image:** `app/opengraph-image.tsx` exported an extensionless file served at `/opengraph-image?<hash>`. robots.txt's
  `Disallow: /*?*` blocks that URL for Twitterbot and other robots-respecting scrapers, and Firebase can't infer the
  file's content-type. Also, any page that sets its own `openGraph` replaces the root object and loses the image
  (Next does not merge it). **Fix:** replaced the route with a static `public/og-image.png` (1200×630, same artwork).
  Root metadata sets it with dimensions plus `twitter:images`. `images: ["/og-image.png"]` was added to every
  multi-line `openGraph` block (57 files) and to the dynamic templates (hourly, job, employer, ADF, payroll-tax,
  minimum-wage, Centrelink W3 helper, award helper, tax-on/take-home/salary-to-hourly).
- **og:url:** the three salary-grid templates (411 URLs) had no `openGraph` object. They now set `url` and the image.
  og:title/description are auto-filled from title/description.
- **Titles > 65 chars:** 46 before, 34 after. The one clear template offender, `job-pay-rates/[occupation]`, now picks the
  fullest of three forms that fits in 65 characters. The rest are hand-written copy and are listed below.
- **H1:** every page has exactly one.
- **Descriptions:** none are missing or duplicated. 220 are longer than 165 characters, 41 of them from the
  `job-pay-rates` template. They get truncated, not penalised, so they were left for the content owners.

### 6. Robots / indexing

`public/robots.txt` allows everything except `/api/` and `/*?*`, and points to the correct sitemap. No accidental
noindex: the only noindex pages are `/404/`, `/_not-found/` (Next artefacts) and the intentional `/embed/take-home-pay/`.
Root metadata is index/follow with `max-image-preview:large` and `max-snippet:-1`.

### 7. Performance (template-level)

1. `app/loading.tsx` removed (see §1). Biggest win on FCP, LCP and CLS.
2. **Self-hosted fonts.** The Google Fonts stylesheet was a render-blocking cross-origin request, ~0.8 s before any font
   file could start. The same families (latin + latin-ext woff2, OFL) now live in `public/fonts/`, declared in
   `app/fonts.css`. The body and H1 faces are preloaded. Family names stay literal because hundreds of inline
   `style={{ fontFamily: "'Bricolage Grotesque'…" }}` reference them by name. `next/font` hashes family names, which is why it wasn't used.
3. **Home hero.** The H1 and intro (the LCP element) and the calculator card used framer-motion `initial={{ opacity: 0 }}`,
   which left them invisible until hydration. Now `initial={false}`.
4. The Adsterra units, social bar/popunder and GA4 are unchanged.

## Remaining items (not fixed: page-level, owned elsewhere, or a judgment call)

1. **Analytics loads twice.** `components/firebase-analytics.tsx` (Firebase SDK) and the direct gtag `<Script>` in
   `app/layout.tsx` both initialise the same property, G-8WE507LD32. Lighthouse sees two 158 KB `gtag/js` downloads plus
   ~60 KB of Firebase JS, and page_view may be double-counted. Recommended: drop `<FirebaseAnalytics />`, since nothing
   calls `logEvent`, and check GA4 pageview totals before and after. Not changed here because it shifts the traffic baseline.
2. **Remaining LCP (~3.3 s simulated vs ~60 ms observed locally).** Lantern still counts the High-priority gtag preload
   that `next/script` `afterInteractive` inserts. Switching GA to `lazyOnload` would take it off the critical path but
   delays GA initialisation, so a few bounce pageviews would go unrecorded. This is the owner's trade-off to make.
3. **FAQPage questions not visible (81 questions on 40 page files).** Each page file carries its own hard-coded
   FAQPage that has drifted from the visible FAQ in its module:
   annual-leave-guide, annual-pay-calculator, construction-trades-pay, contractor-pay-calculator,
   contractor-vs-employee-calculator, division-293-tax, employer-cost-calculator, first-job-pay-guide,
   fortnightly-pay-calculator, fringe-benefits-tax, full-time-vs-part-time-vs-casual, gig-economy-pay-guide,
   healthcare-worker-pay, hourly-to-annual-salary-calculator, mining-fifo-pay-guide, monthly-pay-calculator,
   new-job-checklist, non-resident-tax, notice-of-assessment, novated-lease-guide, pay-calculator-act/nt/sa,
   private-health-insurance-medicare, retail-hospitality-pay-guide, salary-sacrifice-calculator,
   salary-sacrifice-vs-mortgage, stage-3-tax-cuts, stsl-on-payslip, superannuation-guide, take-home-pay-calculator,
   tax-bracket-history, tax-deductions-guide, tax-file-number-declaration, tech-salary-guide-australia,
   understanding-your-payslip, weekly-pay-calculator, work-from-home-deductions, working-holiday-tax,
   ytd-income-calculator. Fix pattern: export the module's FAQ array and build the schema from it, as
   `/hourly-to-salary/[rate]` now does.
4. **FAQ answer wording differs from visible text** on `tax-on/[salary]` (2 per page) and `take-home-pay-on/[salary]`
   (1 per page), plus ~150 answers on static pages. The figures match; only the phrasing differs. Low risk, but the same
   single-source pattern would remove it.
5. **og:image still missing on 94 pages.** These page files write `openGraph` on one line, which is the line title
   edits touch. They were skipped to avoid merge conflicts with the title workstreams. Fix: append
   `images: ["/og-image.png"]` to each file's `openGraph: { … }`. Find them with
   `grep -l "openGraph: {.*}" calc-boiler/app/**/page.tsx | xargs grep -L og-image`.
6. **Build-date `dateModified`.** 46 page files set `dateModified: new Date().toISOString()` in JSON-LD. That makes the
   same false-freshness claim the sitemap stagger did. Use the `GUIDE_AUTHORSHIP` `lastReviewed` date or a constant
   updated when the content changes.
7. **Article markup gaps.** 59 Articles lack `datePublished`: the award, tax-table and guide pages, plus the
   minimum-wage-by-age and nursing templates. Google lists it as recommended, not required. There is no truthful
   publish date in the data, so none was invented. `/healthcare-worker-pay/{state}/` Articles have no `author`, and the
   page shows no byline, so none was added.
8. **Titles over 65 characters (34).** Mostly the award pages, e.g. "Hair and Beauty Award Pay Rates 2026-27 (MA000005) —
   Hairdresser & Beauty Therapist Rates" at 89 characters. The others are schads (83), cleaning (81), ADF air-force
   (81), security, pharmacy and hospitality (79), restaurant and fast-food (77), road-transport (76), retail and
   nurses (74), aged-care (73), the salary-to-hourly hub (72), ADF navy (71), and 19 more at 66–70 characters.
   Candidate trim for the awards: drop the award code from the `<title>` (keep it in the H1).
9. **Descriptions over 165 characters (220).** The biggest group is `job-pay-rates/[occupation]`'s `descriptionFor` (41).
10. **Below-the-fold `whileInView` sections** on the home page still ship at `opacity:0` in the HTML (112 nodes). The
    text is in the DOM, so it is indexable, but a non-JS render shows it blank. `SectionWrapper animate` has the same pattern.
11. **Font file caching.** `firebase.json` marks `*.woff2` immutable for a year, and the font filenames aren't hashed.
    If the font files are ever replaced, rename them.

## Files changed

`calc-boiler/app/sitemap.ts`, `calc-boiler/lib/sitemap-lastmod.ts` (new), `calc-boiler/firebase.json`,
`calc-boiler/app/loading.tsx` (deleted), `calc-boiler/app/opengraph-image.tsx` (deleted),
`calc-boiler/public/og-image.png` (new), `calc-boiler/app/fonts.css` + `calc-boiler/public/fonts/*` (new),
`calc-boiler/app/layout.tsx` (head fonts + OG defaults only), `calc-boiler/components/ui/accordion.tsx`,
`calc-boiler/app/page.tsx`, `calc-boiler/modules/home/templates/index.tsx` (hero `initial={false}` only),
`calc-boiler/app/hourly-to-salary/[rate]/page.tsx`, `calc-boiler/app/job-pay-rates/[occupation]/page.tsx`, the
`openGraph.images` / publisher-logo lines in ~90 page and helper files. `components/layout` and `lib/navigation.ts` were not touched.

Verification: `tsc --noEmit` is clean, `npm test` passes 885/885, eslint on changed files shows no new warnings, and
`next build --webpack` builds 857 pages.
