# News Category — Design Spec
**Date:** 2026-07-02
**Site:** pay-calculator-australia.com (calc-boiler, Next.js static export → Firebase)
**Goal:** Launch a `/news/` category with 20–30 event-dated articles covering real Australian pay/tax/super/HECS/Centrelink news from the last ~6 months, to build freshness signals, topical authority, and Google trust — and funnel news readers into the site's calculators.

---

## 1. Decisions made (with user)

| Decision | Choice |
|---|---|
| News model | **Living news hub** — `/news/` index + `/news/<slug>/` dated articles, updated/re-dated as stories develop |
| Topic scope | **Core + adjacent money news** — pay, tax, super, HECS, wages, PLUS Centrelink payments & cost-of-living measures. Excludes energy rebates, CGT reform, luxury car tax (topical drift) |
| Rollout | **Event-dated archive** — ship all articles in one deploy; `datePublished` = when the story actually broke (Jan–Jul 2026), `dateModified` = build date |
| Architecture | **Registry + dynamic route** (Approach A) — per-article TSX content modules + central metadata registry + one `[slug]` route |

## 2. Architecture

### File structure
```
calc-boiler/
  lib/news.ts                      # Registry: NewsArticleMeta[] — single source of truth
  modules/news/
    layout.tsx                     # Shared NewsArticleLayout component
    index-page.tsx                 # News hub page component
    articles/<slug>.tsx            # One content module per article (body only)
  app/news/
    page.tsx                       # Hub route: metadata + CollectionPage schema + index
    [slug]/page.tsx                # generateStaticParams from registry; renders module
```

### Registry data model (`lib/news.ts`)
```ts
export type NewsCategory = "Tax" | "Super" | "Wages" | "HECS" | "Centrelink & Payments";

export type NewsArticleMeta = {
  slug: string;                    // e.g. "minimum-wage-increase-july-2026"
  headline: string;                // H1 + schema headline
  title: string;                   // <title> tag (may differ slightly for SERP)
  description: string;             // meta description + schema description
  category: NewsCategory;
  datePublished: string;           // ISO date — real event/publication date
  dateModified: string;            // ISO date — last content update
  authorId: keyof typeof AUTHORS;  // existing lib/authors.ts
  relatedCalculators: { href: string; label: string }[];  // ≥1, drives "What it means" CTA
  relatedArticles: string[];       // slugs, for Related News block
  sources: { name: string; url: string }[];  // ≥2 authoritative citations
  faq?: { question: string; answer: string }[];  // optional FAQPage schema
};

export const NEWS_ARTICLES: NewsArticleMeta[] = [...];  // sorted newest-first by helper
```
Content modules stay presentational (like existing `modules/guide/*.tsx`); everything Google reads about the article (dates, schema, titles, sources) lives in the registry.

### Routes
- `app/news/[slug]/page.tsx` — `generateStaticParams()` maps registry slugs; `generateMetadata()` builds title/description/canonical/OG (type `article`, `en_AU`); renders `JsonLd` (NewsArticle + BreadcrumbList + optional FAQPage) + `NewsArticleLayout` wrapping the matching content module. Unknown slug → `notFound()`.
- `app/news/page.tsx` — hub. Title: "Australian Pay & Tax News". Lists all articles newest-first with date, category badge, headline, description. Category filter = small `"use client"` filter-pill component (All / Tax / Super / Wages / HECS / Centrelink & Payments), defaulting to All — same client-component idiom the calculators already use. Schema: `CollectionPage` + `BreadcrumbList` + `ItemList` of articles.
- Static export compatible throughout (`output: "export"`, trailing slashes).

## 3. Article anatomy (`NewsArticleLayout`)

Order, top to bottom:
1. Breadcrumb (Pay Calculator → News → article)
2. Category badge + headline (H1)
3. Byline: author (from `lib/authors.ts`) + visible "Published: {date} · Updated: {date}"
4. **Lede** — 40–55 word snippet-format answer to the story (featured-snippet target)
5. **Key facts box** — the numbers that changed: old → new value table
6. Body sections (H2s) — the content module
7. **"What it means for your pay"** — bridge section with contextual CTA link(s) to relevant calculator(s), exact-match anchors per internal-linking-architecture.md
8. Sources — cited outbound links (ATO, FWC, Services Australia, DEWR, Treasury, legislation)
9. Related news — 2–3 registry-driven links

Schema per article: `NewsArticle` (headline, dates, author Person, publisher Organization, mainEntityOfPage, articleSection = category) + `BreadcrumbList` + `FAQPage` when `faq` present.

## 4. Article list (24 launch articles — all real, verified events)

Every fact below was verified via web research on 2026-07-02. Before writing each article, re-verify numbers against the listed primary source; every article cites ≥2 sources. **No invented facts, quotes, or events.**

### Wages (4)
| # | Slug | Story | datePublished |
|---|---|---|---|
| 1 | `minimum-wage-increase-july-2026` | FWC Annual Wage Review: 4.75% increase, NMW $24.95 → $26.44/hr ($948.00 → $1,004.90/wk), ~2.8M workers | 2026-06-02 (decision day) |
| 2 | `new-minimum-wage-take-home-pay` | What $26.44/hr means in take-home pay (weekly/fortnightly/annual, links pay calculator) | 2026-06-16 |
| 3 | `award-wage-increase-2026-industries` | 4.75% award increase by industry: retail, hospitality, care sectors; first full pay period after 1 July | 2026-06-24 |
| 4 | `c13-classification-phase-out` | FWC begins 3-stage phase-out of C13 (lowest award classification), stage 1 from 1 July 2026 | 2026-06-10 |

### Super (6)
| # | Slug | Story | datePublished |
|---|---|---|---|
| 5 | `payday-super-starts-july-2026` | Payday super live: super paid with every wage, must reach fund in 7 business days | 2026-07-01 |
| 6 | `payday-super-employees-payslip` | What payday super means on your payslip (employee angle) | 2026-07-02 |
| 7 | `division-296-super-tax-starts` | Div 296 live after 12-month delay: +15% on earnings share above $3M TSB, +10% more above $10M | 2026-07-01 |
| 8 | `super-contribution-caps-2026-27` | Concessional cap $30,000 → $32,500; non-concessional $120,000 → $130,000 for FY2026-27 | 2026-02-24 (AWOTE confirmation) |
| 9 | `transfer-balance-cap-increase-2026` | General transfer balance cap $2.0M → $2.1M from 1 July 2026 | 2026-03-05 |
| 10 | `super-tax-changes-explained` | "Jim Chalmers super tax changes" explainer — what Div 296 is/isn't, who's affected (3,000/mo KD 4) | 2026-05-12 |

### HECS (4)
| # | Slug | Story | datePublished |
|---|---|---|---|
| 11 | `hecs-indexation-2026` | 1 June 2026 indexation: 2.8% (lower of CPI/WPI) applied to HELP debts | 2026-06-01 |
| 12 | `hecs-20-percent-cut-status` | 20% HELP debt cut (law 2 Aug 2025, applied to 1 June 2025 balances): status + checking your credit | 2026-01-20 |
| 13 | `hecs-repayment-threshold-2026-27` | Minimum repayment threshold rises to $69,529 from 1 July 2026 | 2026-06-26 |
| 14 | `hecs-marginal-repayment-first-tax-time` | First tax time under marginal repayment system (15c/17c/10% structure over $67k) | 2026-07-02 |

### Tax (6)
| # | Slug | Story | datePublished |
|---|---|---|---|
| 15 | `tax-cut-july-2026` | 16% bracket rate cut to 15% from 1 July 2026 (legislated 2025 Budget) — **verify rate/status before writing** | 2026-07-01 |
| 16 | `1000-dollar-instant-tax-deduction` | $1,000 instant deduction (no receipts) live for FY2026-27 returns | 2026-07-01 |
| 17 | `tax-time-2026-whats-new` | Lodging your 2025-26 return: rates, WFH method, HECS system, key dates | 2026-06-29 |
| 18 | `federal-budget-2026-27-your-pay` | Budget 2026-27 measures affecting take-home pay — **verify measures before writing** | 2026-03-25 (budget week) |
| 19 | `medicare-levy-thresholds-2026` | Medicare levy low-income thresholds indexed — **verify amounts before writing** | 2026-03-26 |
| 20 | `july-1-2026-money-changes` | **Cornerstone roundup:** everything that changed 1 July 2026 (wage, super, HECS, tax, Centrelink) — links to all other articles | 2026-07-01 |

### Centrelink & Payments (4)
| # | Slug | Story | datePublished |
|---|---|---|---|
| 21 | `centrelink-payment-increase-january-2026` | 1 Jan 2026 indexation: Youth Allowance, Austudy, ABSTUDY, Carer Allowance (~1M recipients) | 2026-01-01 |
| 22 | `age-pension-increase-march-2026` | 20 Mar 2026: single pension +$22.20/fn to $1,200.90; couples $905.20 each | 2026-03-20 |
| 23 | `deeming-rates-change-2026` | 20 Mar 2026 deeming: 1.25% to $64,200, 3.25% above | 2026-03-20 |
| 24 | `centrelink-changes-july-2026` | 1 Jul 2026: FTB A/B increase, income/asset threshold rises for pension, JobSeeker, Youth Allowance | 2026-07-01 |

Buffer to reach 30 if wanted post-launch: SG 12% first full year, super on paid parental leave, ATO tax-time scam warnings, state payroll tax changes, WPI/CPI release explainers, award-specific deep dives.

### Fact-verification protocol (per article, at write time)
1. Web-search the story; read ≥2 sources, ≥1 primary (ATO/FWC/Services Australia/DEWR/Treasury/legislation.gov.au).
2. Numbers, dates, and names go in the key-facts box exactly as primary source states them.
3. Articles marked **verify before writing** must have their premise confirmed; if a premise fails verification, drop or re-angle the article (do not guess).
4. `sources[]` in the registry must contain the URLs actually used.

## 5. Site integration

- **Nav:** add `{ href: "/news/", label: "News" }` to `navigationItems` (no mega menu at launch).
- **Footer:** new `FOOTER_NEWS` column — hub link + latest ~8 articles (registry-driven).
- **Sitemap:** hub priority 0.7 / `weekly`; articles priority 0.6 / `monthly`, `lastModified` = real `dateModified` (no staggered-date function for news — dates are already real).
- **Inbound contextual links** (edit existing pages, exact-match anchors): hecs-help-calculator + hecs-help-guide → HECS news; superannuation-calculator + superannuation-guide → payday super/Div 296; award-rates + minimum-wage-history-australia → wage decision; centrelink-income-test → Centrelink news; tax-brackets + stage-3-tax-cuts → tax-cut article; homepage → July 1 roundup (cornerstone).
- **Outbound from every article:** ≥3 internal links (calculator bridge + related guides + related news).

## 6. Out of scope (YAGNI)

RSS/Atom feed, Google News sitemap-news XML, tag/author archive pages, pagination, comments, per-article OG images, email capture. Revisit only after the hub earns impressions.

## 7. Testing & verification

- `npm run build` (static export) passes; all 25 routes (hub + 24) emitted to `out/`.
- Spot-check rendered HTML for 3 articles: NewsArticle JSON-LD present and valid (schema.org validator), canonical + trailing slash correct, visible dates match registry.
- Hub lists all 24, sorted newest-first, category filters work.
- `npx tsc --noEmit` and ESLint clean.
- Internal link audit: every article has ≥3 outbound internal links; all hrefs resolve to real routes.

## 8. Risks

- **Backdated `datePublished`:** dates match real event dates and content is genuinely about those events — this reads as an archive, not deception. Mitigated further by honest `dateModified`.
- **News decay:** hub model means articles get updated (e.g. next indexation) rather than abandoned; cornerstone roundup is re-datable each July.
- **YMYL accuracy:** verification protocol above; every number traceable to a primary source.
