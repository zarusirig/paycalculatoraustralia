# News Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch `/news/` — a hub + 24 event-dated news articles covering real Jan–Jul 2026 Australian pay/tax/super/HECS/Centrelink stories, with NewsArticle schema, calculator bridges, and full site integration.

**Architecture:** Central metadata registry (`lib/news.ts`) + one presentational TSX module per article (`modules/news/articles/`) + one dynamic route (`app/news/[slug]/page.tsx`, `generateStaticParams`) + hub (`app/news/page.tsx`). Same pattern as `/tax-on/[salary]`. Static export (`output: "export"`), trailing slashes.

**Tech Stack:** Next.js 16 App Router (static export), React 19, Tailwind 4, schema-dts, lucide-react. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-02-news-category-design.md`

## Global Constraints

- Site builds with `npm run build` from `calc-boiler/`; all pages must emit into `out/` (no runtime server features — no `headers()`, `cookies()`, ISR).
- Every URL ends with a trailing slash; canonical = `https://pay-calculator-australia.com/news/<slug>/`.
- Styling idiom (copy from `modules/guide/stsl-on-payslip.tsx`): navy/eucalyptus/warmgray palette classes, headings `style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}`, `prose prose-blue prose-lg` article body, tables as `overflow-x-auto not-prose` blocks.
- Authors: only `james-harrington`, `penny-ward`, `garth-mcgregor` (from `lib/authors.ts` `AUTHORS`).
- **YMYL fact rule:** every number/date printed must be re-verified via web search at write time against ≥1 primary source (ATO / FWC / FWO / Services Australia / DEWR / Treasury / education.gov.au). If a story's premise fails verification, STOP and flag — do not guess (spec §4 protocol).
- Every article: ≥3 internal links out, ≥2 cited sources, one "What this means for your pay" section.
- `dateModified` for all launch articles: `"2026-07-02"`. `datePublished` per the table in each task — real event dates, do not change them.
- No new npm packages. No RSS, no Google News XML, no tag pages, no pagination (spec §6).

## Verified facts pack (researched 2026-07-02 — re-verify at write time)

- **FWC Annual Wage Review 2026** (decision 2 June 2026, effective first full pay period on/after 1 July 2026): +4.75% to award rates; NMW $24.95 → **$26.44/hr**, $948.00 → **$1,004.90/wk** (+$56.90); ~2.8M award-reliant workers (~21.1% of workforce); FWC declined a "real wage" increase; C13 classification phase-out stage 1 begins. Sources: fwc.gov.au annual-wage-review-2026, fairwork.gov.au.
- **Payday super** from 1 July 2026: SG paid each payday, must reach fund within 7 business days; SBSCH closed 30 June 2026. Sources: ato.gov.au payday-super, fairwork.gov.au newsroom.
- **Division 296** from 1 July 2026 (first applies to FY2026-27 earnings, after 12-month delay): +15% on earnings share above $3M TSB; +10% further above $10M. Source: ato.gov.au better-targeted-superannuation-concessions.
- **FY2026-27 caps:** concessional $30,000 → **$32,500**; non-concessional $120,000 → **$130,000**; general transfer balance cap $2.0M → **$2.1M**. Source: ato.gov.au, superguide.com.au.
- **HECS/HELP:** 1 June 2026 indexation **2.8%** (lower of CPI/WPI); 20% one-off debt cut (law 2 Aug 2025, applied to 1 June 2025 balances, avg cut ≈ $5,520 on $27,600); marginal repayment system since 1 July 2025 ($67,000 threshold FY2025-26: 15c/$ 67k–125k, $8,700 + 17c/$ 125k–179,285, 10% flat above); threshold indexed to **$69,529** from 1 July 2026 (site's STSL page uses $69,528 — re-verify exact figure and align sitewide). Sources: education.gov.au, ato.gov.au.
- **Tax:** 16% bracket rate cut to **15%** from 1 July 2026 (legislated 2025 Budget — verify premise); **$1,000 instant work-related deduction** first claimable in FY2026-27 returns (verify premise); Medicare levy low-income thresholds indexed in March 2026 Budget (verify amounts).
- **Centrelink:** 1 Jan 2026 indexation (Youth Allowance, Austudy, ABSTUDY, Carer Allowance, ~1M recipients); 20 Mar 2026 Age/DSP/Carer +$22.20/fn single → **$1,200.90**, couples **$905.20** each (+$16.70); deeming from 20 Mar 2026: 1.25% up to $64,200, 3.25% above; 1 Jul 2026 FTB A/B increase + income/asset threshold rises. Sources: servicesaustralia.gov.au, yahoo finance AU roundups.

---

### Task 1: News registry (`lib/news.ts`)

**Files:**
- Create: `calc-boiler/lib/news.ts`

**Interfaces:**
- Produces: `NewsCategory`, `NewsArticleMeta`, `NEWS_ARTICLES`, `NEWS_CATEGORIES`, `getAllNews()`, `getNewsBySlug(slug)`, `getRelatedNews(slug)`, `formatNewsDate(iso)` — consumed by every later task.

- [ ] **Step 1: Create `lib/news.ts`** with types, helpers, and the first article's metadata:

```ts
import { AUTHORS } from "@/lib/authors";

export type NewsCategory = "Tax" | "Super" | "Wages" | "HECS" | "Centrelink & Payments";

export type NewsSource = { title: string; url: string; publisher: string };
export type NewsFaq = { question: string; answer: string };
export type NewsLink = { href: string; label: string };

export type NewsArticleMeta = {
  slug: string;
  headline: string;          // H1 + schema headline
  title: string;             // <title> tag
  description: string;       // meta description + schema description
  category: NewsCategory;
  datePublished: string;     // ISO yyyy-mm-dd — real event date, never today-by-default
  dateModified: string;      // ISO yyyy-mm-dd — last content update
  authorId: keyof typeof AUTHORS;
  relatedCalculators: NewsLink[];  // drives the "What it means for your pay" CTA card
  relatedArticles: string[];       // slugs for the Related News block
  sources: NewsSource[];           // ≥2, rendered via SourceAttribution
  faq?: NewsFaq[];                 // optional FAQPage schema
};

export const NEWS_CATEGORIES: NewsCategory[] = ["Wages", "Super", "Tax", "HECS", "Centrelink & Payments"];

export const NEWS_ARTICLES: NewsArticleMeta[] = [
  {
    slug: "minimum-wage-increase-july-2026",
    headline: "Minimum Wage Rises 4.75% to $26.44 an Hour From 1 July 2026",
    title: "Minimum Wage Increase July 2026: FWC Awards 4.75% — New Rates",
    description: "The Fair Work Commission's 2026 Annual Wage Review lifts the national minimum wage from $24.95 to $26.44 an hour ($1,004.90 a week) from 1 July 2026. See who gets the 4.75% increase and what it means for your take-home pay.",
    category: "Wages",
    datePublished: "2026-06-02",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Salary Calculator" },
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
    ],
    relatedArticles: ["new-minimum-wage-take-home-pay", "award-wage-increase-2026-industries", "july-1-2026-money-changes"],
    sources: [
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
    ],
    faq: [
      { question: "What is the new minimum wage in Australia from 1 July 2026?", answer: "The national minimum wage is $26.44 per hour or $1,004.90 per 38-hour week, following the Fair Work Commission's 4.75% increase effective from the first full pay period on or after 1 July 2026." },
      { question: "Who gets the 4.75% wage increase?", answer: "Around 2.8 million award-reliant employees — about 21% of the Australian workforce — plus anyone on the national minimum wage. Workers on enterprise agreements or over-award salaries are only affected if their pay is tied to award movements." },
      { question: "When does the 2026 minimum wage increase start?", answer: "From the first full pay period starting on or after 1 July 2026. If your pay week begins on a Wednesday, the new rate applies from the first Wednesday in July." },
    ],
  },
];

/** All articles, newest first. */
export function getAllNews(): NewsArticleMeta[] {
  return [...NEWS_ARTICLES].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function getNewsBySlug(slug: string): NewsArticleMeta | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedNews(slug: string): NewsArticleMeta[] {
  const article = getNewsBySlug(slug);
  if (!article) return [];
  return article.relatedArticles
    .map(getNewsBySlug)
    .filter((a): a is NewsArticleMeta => Boolean(a));
}

/** "2026-06-02" → "2 June 2026" (AEST-safe). */
export function formatNewsDate(iso: string): string {
  return new Date(`${iso}T00:00:00+10:00`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Sydney",
  });
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `cd calc-boiler && npx tsc --noEmit`
Expected: exit 0, no errors (pre-existing errors unrelated to `lib/news.ts` are out of scope — there should be none).

- [ ] **Step 3: Commit**

```bash
git add calc-boiler/lib/news.ts
git commit -m "feat(news): add news article registry with types and helpers"
```

---

### Task 2: `NewsArticleLayout` + `NewsKeyFacts` components

**Files:**
- Create: `calc-boiler/modules/news/layout.tsx`

**Interfaces:**
- Consumes: `NewsArticleMeta`, `getRelatedNews`, `formatNewsDate` from Task 1; `AUTHORS` from `lib/authors.ts`; `SourceAttribution` from `components/common/source-attribution.tsx`.
- Produces: `default export NewsArticleLayout({ meta, children })`; named export `NewsKeyFacts({ title?, rows })` where `rows: { label: string; before?: string; after: string }[]`. Article modules (Tasks 3, 6–10) render inside this layout; the route (Task 3) wraps modules with it.

- [ ] **Step 1: Create `modules/news/layout.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Newspaper, ArrowRight } from "lucide-react";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { AUTHORS } from "@/lib/authors";
import { formatNewsDate, getRelatedNews, type NewsArticleMeta } from "@/lib/news";

type KeyFactRow = { label: string; before?: string; after: string };

/** Old → new comparison box for the numbers that changed. */
export function NewsKeyFacts({ title = "Key facts", rows }: { title?: string; rows: KeyFactRow[] }) {
  const hasBefore = rows.some((r) => r.before !== undefined);
  return (
    <div className="overflow-x-auto not-prose my-8 rounded-xl border border-eucalyptus/30 bg-eucalyptus/5 p-1">
      <p className="px-4 pt-3 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">{title}</p>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-navy/60">
            <th className="px-4 py-2 font-semibold">What changed</th>
            {hasBefore && <th className="px-4 py-2 font-semibold">Before</th>}
            <th className="px-4 py-2 font-semibold">{hasBefore ? "Now" : "Detail"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-eucalyptus/10 text-navy">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-2.5 font-medium">{row.label}</td>
              {hasBefore && <td className="px-4 py-2.5">{row.before ?? "—"}</td>}
              <td className="px-4 py-2.5 font-semibold">{row.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NewsArticleLayout({ meta, children }: { meta: NewsArticleMeta; children: ReactNode }) {
  const author = AUTHORS[meta.authorId];
  const related = getRelatedNews(meta.slug);
  const sources: SourceLink[] = meta.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/news/" className="hover:text-eucalyptus-dark hover:underline">News</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{meta.headline}</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-eucalyptus/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">
            <Newspaper className="h-3.5 w-3.5" /> {meta.category}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {meta.headline}
          </h1>
          <p className="text-sm text-warmgray-light">
            By <span className="font-semibold text-navy">{author.name}</span>, {author.role} · Published {formatNewsDate(meta.datePublished)}
            {meta.dateModified !== meta.datePublished && <> · Updated {formatNewsDate(meta.dateModified)}</>}
          </p>
        </header>

        <div className="max-w-4xl">
          <article className="prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">
            {children}
          </article>

          <aside className="not-prose my-10 rounded-xl border border-navy/10 bg-navy/3 p-6">
            <h2 className="mb-3 text-lg font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Run your own numbers
            </h2>
            <ul className="space-y-2">
              {meta.relatedCalculators.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="inline-flex items-center gap-1.5 font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    {c.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <SourceAttribution sources={sources} />

          {related.length > 0 && (
            <section className="mt-12 border-t border-navy/10 pt-8">
              <h2 className="mb-4 text-xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Related news
              </h2>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/news/${r.slug}/`} className="font-semibold text-eucalyptus-dark hover:text-navy hover:underline">{r.headline}</Link>
                    <span className="ml-2 text-sm text-warmgray-light">{formatNewsDate(r.datePublished)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Note:** before writing, open `components/common/source-attribution.tsx` and confirm the `SourceAttribution` props signature (`sources: SourceLink[]`). If it differs (e.g. takes `title` prop too), adapt the call — keep the registry `sources` as the data source.

- [ ] **Step 2: Typecheck**

Run: `cd calc-boiler && npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add calc-boiler/modules/news/layout.tsx
git commit -m "feat(news): add NewsArticleLayout and NewsKeyFacts components"
```

---

### Task 3: First article module + dynamic route

**Files:**
- Create: `calc-boiler/modules/news/articles/minimum-wage-increase-july-2026.tsx`
- Create: `calc-boiler/modules/news/articles/index.ts`
- Create: `calc-boiler/app/news/[slug]/page.tsx`

**Interfaces:**
- Consumes: Task 1 registry, Task 2 layout.
- Produces: `NEWS_COMPONENTS: Record<string, ComponentType>` in `modules/news/articles/index.ts` — every article batch task (6–10) adds its modules here. Route renders `NEWS_COMPONENTS[slug]` inside `NewsArticleLayout`.

- [ ] **Step 1: Re-verify the facts** (write-time protocol): web-search "FWC annual wage review 2026 decision minimum wage $26.44" and confirm against fwc.gov.au / fairwork.gov.au: 4.75%, $24.95 → $26.44/hr, $948.00 → $1,004.90/wk, decision date 2 June 2026, ~2.8M workers. If any number differs, fix the registry entry AND this module before proceeding.

- [ ] **Step 2: Create the worked-example article module** `modules/news/articles/minimum-wage-increase-july-2026.tsx`. This is the canonical structure every later article copies (lede → key facts → body H2s → "What this means for your pay" H2):

```tsx
import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function MinimumWageIncreaseJuly2026() {
  return (
    <>
      <p className="lead">
        The Fair Work Commission has lifted the national minimum wage by <strong>4.75%</strong> from
        1 July 2026, taking it from $24.95 to <strong>$26.44 an hour</strong> — $1,004.90 for a
        38-hour week. The increase flows to about 2.8 million award-reliant workers.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "National minimum wage (hourly)", before: "$24.95", after: "$26.44" },
          { label: "National minimum wage (weekly, 38 hrs)", before: "$948.00", after: "$1,004.90" },
          { label: "Modern award minimum rates", before: "—", after: "+4.75%" },
          { label: "Takes effect", after: "First full pay period on or after 1 July 2026" },
        ]}
      />

      <h2>What the Commission decided</h2>
      <p>
        The Expert Panel handed down the Annual Wage Review 2026 decision on 2 June 2026, awarding a
        4.75% increase to the national minimum wage and all modern award minimum rates. The Panel
        said it would not be &ldquo;practicable or reasonable in the current circumstances&rdquo; to
        award a real wage increase large enough to close the gap left by the inflation spike of
        recent years, pointing to inflation sitting above the Reserve Bank&apos;s target band and
        global fuel supply disruption.
      </p>
      <p>
        The decision also starts a three-stage phase-out of the C13 classification — the lowest
        ongoing rate in the award system — with the first stage taking effect from 1 July 2026.
      </p>

      <h2>Who gets the increase</h2>
      <p>
        The rise applies to employees on the national minimum wage and the roughly 2.8 million
        workers — about 21% of the workforce — whose pay is set by a modern award. If you&apos;re on
        an enterprise agreement or an over-award salary, nothing changes automatically, though many
        agreements index their rates to the review. Check your award classification on our{" "}
        <Link href="/award-rates/">award rates guide</Link> if you&apos;re not sure which rate
        applies to you.
      </p>

      <h2>When it starts</h2>
      <p>
        The new rates apply from the first full pay period starting on or after 1 July 2026. If your
        pay cycle runs Wednesday to Tuesday, the new rate begins on the first Wednesday in July —
        your first full July payslip may still show a few days at the old rate.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        A full-time minimum-wage worker picks up about $56.90 a week before tax — roughly $2,959 a
        year. Because the increase is taxed at your marginal rate, your take-home rise will be
        smaller: run your new rate through our{" "}
        <Link href="/hourly-to-annual-salary-calculator/">hourly to annual salary calculator</Link>{" "}
        to see the annual figure, then our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> for the after-tax
        result. Casual? Remember the 25% loading stacks on top of the new base rate.
      </p>
    </>
  );
}
```

- [ ] **Step 3: Create the component map** `modules/news/articles/index.ts`:

```ts
import type { ComponentType } from "react";
import MinimumWageIncreaseJuly2026 from "./minimum-wage-increase-july-2026";

/** slug → article body component. Every entry in NEWS_ARTICLES must have a component here. */
export const NEWS_COMPONENTS: Record<string, ComponentType> = {
  "minimum-wage-increase-july-2026": MinimumWageIncreaseJuly2026,
};
```

- [ ] **Step 4: Create the dynamic route** `app/news/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, NewsArticle, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { getAllNews, getNewsBySlug } from "@/lib/news";
import { NEWS_COMPONENTS } from "@/modules/news/articles";
import NewsArticleLayout from "@/modules/news/layout";

const BASE = SITE_CONFIG.baseUrl;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllNews().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getNewsBySlug(slug);
  if (!meta) return {};
  const url = `${BASE}/news/${meta.slug}/`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: SITE_CONFIG.name,
      type: "article",
      locale: "en_AU",
      publishedTime: meta.datePublished,
      modifiedTime: meta.dateModified,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getNewsBySlug(slug);
  const Body = NEWS_COMPONENTS[slug];
  if (!meta || !Body) notFound();

  const url = `${BASE}/news/${meta.slug}/`;

  const newsArticle: WithContext<NewsArticle> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: meta.headline,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    articleSection: meta.category,
    isAccessibleForFree: true,
    author: AUTHORS[meta.authorId].jsonLd,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
      { "@type": "ListItem", position: 2, name: "News", item: `${BASE}/news/` },
      { "@type": "ListItem", position: 3, name: meta.headline, item: url },
    ],
  };

  const schemas: (WithContext<NewsArticle> | WithContext<BreadcrumbList> | WithContext<FAQPage>)[] = [newsArticle, breadcrumb];

  if (meta.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faq.map((f) => ({
        "@type": "Question" as const,
        name: f.question,
        acceptedAnswer: { "@type": "Answer" as const, text: f.answer },
      })),
    });
  }

  return (
    <>
      <JsonLd code={schemas} />
      <NewsArticleLayout meta={meta}>
        <Body />
      </NewsArticleLayout>
    </>
  );
}
```

- [ ] **Step 5: Build and verify the page emits correctly**

Run: `cd calc-boiler && npm run build && ls out/news/minimum-wage-increase-july-2026/index.html && grep -o '"@type":"NewsArticle"' out/news/minimum-wage-increase-july-2026/index.html && grep -o '<link rel="canonical" href="https://pay-calculator-australia.com/news/minimum-wage-increase-july-2026/"' out/news/minimum-wage-increase-july-2026/index.html`
Expected: build succeeds; file exists; both greps print a match.

- [ ] **Step 6: Commit**

```bash
git add calc-boiler/modules/news/articles/ "calc-boiler/app/news/[slug]/page.tsx"
git commit -m "feat(news): add news article route with NewsArticle schema + first article"
```

---

### Task 4: News hub page (`/news/`)

**Files:**
- Create: `calc-boiler/modules/news/index-page.tsx`
- Create: `calc-boiler/app/news/page.tsx`

**Interfaces:**
- Consumes: `getAllNews`, `NEWS_CATEGORIES`, `formatNewsDate`, `NewsCategory` from Task 1.
- Produces: hub route; no exports consumed later.

- [ ] **Step 1: Create the hub component** `modules/news/index-page.tsx` (client component — category filter pills):

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Newspaper } from "lucide-react";
import { formatNewsDate, getAllNews, NEWS_CATEGORIES, type NewsCategory } from "@/lib/news";

export default function NewsIndexPage() {
  const [filter, setFilter] = useState<NewsCategory | "All">("All");
  const articles = getAllNews().filter((a) => filter === "All" || a.category === filter);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">News</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Australian Pay &amp; Tax News
          </h1>
          <p className="text-xl text-warmgray leading-relaxed">
            Wage decisions, tax changes, super rules and payment increases — what changed, when it
            starts, and what it means for your take-home pay. Every story links to a calculator so
            you can run your own numbers.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter news by category">
          {(["All", ...NEWS_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === cat ? "bg-navy text-white" : "bg-navy/5 text-navy hover:bg-eucalyptus/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="max-w-4xl divide-y divide-navy/10">
          {articles.map((a) => (
            <li key={a.slug} className="py-6">
              <p className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-eucalyptus/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">
                <Newspaper className="h-3 w-3" /> {a.category}
              </p>
              <h2 className="text-xl font-bold leading-snug" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                <Link href={`/news/${a.slug}/`} className="text-navy hover:text-eucalyptus-dark hover:underline">{a.headline}</Link>
              </h2>
              <p className="mt-1 text-sm text-warmgray-light">{formatNewsDate(a.datePublished)}</p>
              <p className="mt-2 text-warmgray leading-relaxed">{a.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the hub route** `app/news/page.tsx`:

```tsx
import type { Metadata } from "next";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllNews } from "@/lib/news";
import NewsIndexPage from "@/modules/news/index-page";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/news/`;
const TITLE = "Australian Pay & Tax News — Wage, Super & Tax Changes Explained";
const DESCRIPTION = "The latest Australian pay news: minimum wage decisions, tax changes, superannuation rules, HECS updates and Centrelink payment increases — with what each change means for your take-home pay.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const collection: WithContext<CollectionPage> = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: getAllNews().map((a, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      url: `${BASE}/news/${a.slug}/`,
      name: a.headline,
    })),
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "News", item: URL },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd code={[collection, breadcrumb]} />
      <NewsIndexPage />
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

Run: `cd calc-boiler && npm run build && grep -o '"@type":"CollectionPage"' out/news/index.html && grep -c 'href="/news/minimum-wage-increase-july-2026/"' out/news/index.html`
Expected: build succeeds; CollectionPage match; link count ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add calc-boiler/modules/news/index-page.tsx calc-boiler/app/news/page.tsx
git commit -m "feat(news): add /news/ hub with category filter and CollectionPage schema"
```

---

### Task 5: Site integration — nav, footer, sitemap

**Files:**
- Modify: `calc-boiler/lib/navigation.ts` (navigationItems + new FOOTER_NEWS export)
- Modify: `calc-boiler/components/layout/footer.tsx` (render FOOTER_NEWS column)
- Modify: `calc-boiler/app/sitemap.ts` (append news entries)

**Interfaces:**
- Consumes: `NEWS_ARTICLES`, `getAllNews` from Task 1.
- Produces: `FOOTER_NEWS` export in `lib/navigation.ts`.

- [ ] **Step 1: Add News to `navigationItems`** in `lib/navigation.ts` — insert before the "Tax on Salary" mega-menu item:

```ts
export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Pay Calculator" },
  { href: "/income-tax-calculator/", label: "Tax Calculator" },
  { href: "/superannuation-calculator/", label: "Super Calculator" },
  { href: "/take-home-pay-calculator/", label: "Take-Home Pay" },
  { href: "/news/", label: "News" },
  { href: "#", label: "Tax on Salary", hasMegaMenu: true },
  { href: "#", label: "Guides", hasMegaMenu: true },
  { href: "#", label: "By State", hasMegaMenu: true },
];
```

- [ ] **Step 2: Add `FOOTER_NEWS`** at the end of `lib/navigation.ts` (static list — footer link labels are short forms of the headlines; update this list in Task 10 once all articles exist):

```ts
export const FOOTER_NEWS = [
  { href: "/news/", label: "Pay & Tax News" },
  { href: "/news/july-1-2026-money-changes/", label: "July 1 Money Changes" },
  { href: "/news/minimum-wage-increase-july-2026/", label: "Minimum Wage Increase 2026" },
  { href: "/news/payday-super-starts-july-2026/", label: "Payday Super" },
  { href: "/news/tax-cut-july-2026/", label: "July 2026 Tax Cut" },
  { href: "/news/hecs-indexation-2026/", label: "HECS Indexation 2026" },
  { href: "/news/super-contribution-caps-2026-27/", label: "Super Caps 2026-27" },
  { href: "/news/age-pension-increase-march-2026/", label: "Age Pension Increase" },
  { href: "/news/centrelink-changes-july-2026/", label: "Centrelink Changes July 2026" },
] as const;
```

**NOTE:** these link to articles created in Tasks 6–10. The footer ships in this task but the link-audit gate is Task 12 — links will 404 in the interim; acceptable because everything lands in one deploy.

- [ ] **Step 3: Render the news column in `components/layout/footer.tsx`.** Import `FOOTER_NEWS`, then add a column in the "Site directory" grid following the existing column markup exactly (copy an existing `<div><h3>…</h3><ul>…</ul></div>` block, heading text "News"):

```tsx
<div>
  <h3
    className="mb-3 text-xs font-bold uppercase tracking-widest text-eucalyptus/80"
    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
  >
    News
  </h3>
  <ul role="list" className="space-y-2 text-sm">
    {FOOTER_NEWS.map(({ href, label }) => (
      <li key={href}>
        <Link href={href} className="text-sandstone-dark/45 hover:text-eucalyptus">{label}</Link>
      </li>
    ))}
  </ul>
</div>
```

Adjust the grid columns class if needed (`md:grid-cols-4` → `md:grid-cols-5`, or place the column inside an existing cell — match whichever keeps the layout balanced; check rendered output).

- [ ] **Step 4: Append news to `app/sitemap.ts`.** After the existing `return allPages.map(...)` expression, restructure to concatenate news entries with **real dates** (no staggeredDate):

```ts
  // 10. News — hub weekly/0.7, articles monthly/0.6, real dates
  const newsEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/news/`,
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...NEWS_ARTICLES.map((a) => ({
      url: `${baseUrl}/news/${a.slug}/`,
      lastModified: new Date(`${a.dateModified}T09:00:00+10:00`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...allPages.map((page, index) => ({ /* existing mapping unchanged */ })),
    ...newsEntries,
  ];
```

Import at top: `import { NEWS_ARTICLES } from "@/lib/news";`

- [ ] **Step 5: Build and verify**

Run: `cd calc-boiler && npm run build && grep -o '<loc>https://pay-calculator-australia.com/news/</loc>' out/sitemap.xml && grep -c '/news/' out/index.html`
Expected: sitemap contains the hub URL; homepage HTML contains ≥2 `/news/` references (nav + footer).

- [ ] **Step 6: Commit**

```bash
git add calc-boiler/lib/navigation.ts calc-boiler/components/layout/footer.tsx calc-boiler/app/sitemap.ts
git commit -m "feat(news): wire news into nav, footer, and sitemap"
```

---

## Article batch tasks (6–10) — shared instructions

Each batch task repeats this cycle **per article**:

1. **Verify** — run the listed web searches; confirm every number in the brief against a primary source. Premise-flagged articles (⚠): if the premise is wrong, STOP, flag to the user, skip the article.
2. **Registry** — append the entry to `NEWS_ARTICLES` in `lib/news.ts` (full entries provided below; correct any figures that verification changed; write 3–5 `faq` items from verified facts for entries marked `faq: TODO-write-from-verified-facts` — questions must mirror real query phrasing, answers 40–60 words, standalone).
3. **Module** — create `modules/news/articles/<slug>.tsx` following the Task 3 worked example EXACTLY in structure: `lead` paragraph (40–55 words, answers the story), `<NewsKeyFacts rows={...}>` with the brief's numbers, 3–5 H2 body sections (500–900 words total, en-AU spelling, factual modality — no hedging on verified numbers), final H2 **"What this means for your pay"** with ≥1 contextual `<Link>` to the related calculators, ≥3 internal links total per article.
4. **Register** — add the import + entry to `NEWS_COMPONENTS` in `modules/news/articles/index.ts`.
5. **Build** — `npm run build`; verify `out/news/<slug>/index.html` exists and contains `"@type":"NewsArticle"`.
6. **Commit** — one commit per batch (message given in each task).

Author assignment: **penny-ward** → Wages + Centrelink; **james-harrington** → Tax + HECS + Super.

---

### Task 6: Wages batch (3 remaining articles)

**Files:**
- Modify: `calc-boiler/lib/news.ts`
- Create: `calc-boiler/modules/news/articles/new-minimum-wage-take-home-pay.tsx`, `award-wage-increase-2026-industries.tsx`, `c13-classification-phase-out.tsx`
- Modify: `calc-boiler/modules/news/articles/index.ts`

- [ ] **Step 1: Verify facts.** Searches: `"annual wage review 2026" 4.75% award industries retail hospitality`, `FWC C13 classification phase out 2026 three stage`, `minimum wage $26.44 take home pay after tax`. Confirm: per-industry applicability, C13 mechanics, and compute take-home figures with the site's own `calculatePayBreakdown` (FY2026-27 — check `lib/constants/australian-tax.ts` has 2026-27 rates; if it only has 2025-26, compute with 2025-26 and say so in copy, or use the payg-withholding constants added in the tax-tables work).

- [ ] **Step 2: Registry entries** (append to `NEWS_ARTICLES`):

```ts
  {
    slug: "new-minimum-wage-take-home-pay",
    headline: "What the New $26.44 Minimum Wage Means for Your Take-Home Pay",
    title: "New Minimum Wage 2026: Weekly, Fortnightly & Annual Take-Home Pay",
    description: "From 1 July 2026 the minimum wage is $26.44/hour — $1,004.90 a week or about $52,255 a year full-time. Here's what actually lands in your bank account after tax, and how casuals and part-timers work out their new rate.",
    category: "Wages",
    datePublished: "2026-06-16",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
      { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
    ],
    relatedArticles: ["minimum-wage-increase-july-2026", "award-wage-increase-2026-industries", "tax-cut-july-2026"],
    sources: [
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
    ],
    faq: TODO-write-from-verified-facts,
  },
  {
    slug: "award-wage-increase-2026-industries",
    headline: "Award Wages Rise 4.75% From July: Retail, Hospitality and Care Rates",
    title: "Award Wage Increase 2026: New Rates by Industry From 1 July",
    description: "All modern award minimum rates rise 4.75% from the first full pay period after 1 July 2026. What the increase looks like in retail, hospitality, aged care and other award-reliant industries — and how to check your new rate.",
    category: "Wages",
    datePublished: "2026-06-24",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/award-rates/", label: "Award Rates Guide" },
      { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    ],
    relatedArticles: ["minimum-wage-increase-july-2026", "new-minimum-wage-take-home-pay", "c13-classification-phase-out"],
    sources: [
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
    ],
    faq: TODO-write-from-verified-facts,
  },
  {
    slug: "c13-classification-phase-out",
    headline: "FWC Begins Phasing Out the C13 Award Classification",
    title: "C13 Classification Phase-Out: What the Lowest Award Rate Change Means",
    description: "The Fair Work Commission is phasing out the C13 classification — the lowest ongoing rate in the award system — in three stages, starting 1 July 2026. What C13 workers can expect their pay to do as the transition rolls through.",
    category: "Wages",
    datePublished: "2026-06-10",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/award-rates/", label: "Award Rates Guide" },
      { href: "/minimum-wage-history-australia/", label: "Minimum Wage History" },
    ],
    relatedArticles: ["minimum-wage-increase-july-2026", "award-wage-increase-2026-industries"],
    sources: [
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
      { title: "Annual Wage Review", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review", publisher: "Fair Work Ombudsman" },
    ],
  },
```

- [ ] **Step 3: Write the 3 modules** (structure per shared instructions; take-home piece MUST include a small table of minimum-wage take-home at weekly/fortnightly/annual frequency computed from site constants).
- [ ] **Step 4: Register in `NEWS_COMPONENTS`.**
- [ ] **Step 5: Build + verify** — `npm run build`; `for s in new-minimum-wage-take-home-pay award-wage-increase-2026-industries c13-classification-phase-out; do grep -l '"@type":"NewsArticle"' out/news/$s/index.html; done` → 3 paths.
- [ ] **Step 6: Commit** — `git commit -m "feat(news): add wages news batch (take-home, award industries, C13)"`

---

### Task 7: Super batch (5 articles)

**Files:**
- Modify: `calc-boiler/lib/news.ts`, `calc-boiler/modules/news/articles/index.ts`
- Create: `payday-super-starts-july-2026.tsx`, `payday-super-employees-payslip.tsx`, `division-296-super-tax-starts.tsx`, `super-contribution-caps-2026-27.tsx`, `transfer-balance-cap-increase-2026.tsx`, `super-tax-changes-explained.tsx` in `calc-boiler/modules/news/articles/`

- [ ] **Step 1: Verify facts.** Searches: `ato payday super 1 July 2026 seven business days`, `Division 296 start date $3 million 15% ato`, `concessional contributions cap 2026-27 $32,500`, `transfer balance cap 2026 $2.1 million`, `jim chalmers superannuation tax changes division 296`. Confirm each number in the facts pack; Div 296's >$10M extra 10% tier must be re-verified (newer measure — confirm on ato.gov.au).

- [ ] **Step 2: Registry entries** — same shape as Task 6. Exact values:

| slug | headline | datePublished | authorId | relatedCalculators | relatedArticles |
|---|---|---|---|---|---|
| `payday-super-starts-july-2026` | "Payday Super Is Live: Employers Must Now Pay Super With Every Pay" | 2026-07-01 | james-harrington | /superannuation-calculator/, /employer-cost-calculator/ | payday-super-employees-payslip, super-contribution-caps-2026-27, july-1-2026-money-changes |
| `payday-super-employees-payslip` | "Payday Super: What Changes on Your Payslip From July 2026" | 2026-07-02 | james-harrington | /understanding-your-payslip/, /superannuation-calculator/ | payday-super-starts-july-2026, july-1-2026-money-changes |
| `division-296-super-tax-starts` | "Division 296 Super Tax Starts: Extra 15% on Balances Above $3 Million" | 2026-07-01 | james-harrington | /division-293-tax/, /superannuation-calculator/ | super-tax-changes-explained, transfer-balance-cap-increase-2026 |
| `super-contribution-caps-2026-27` | "Super Contribution Caps Rise to $32,500 and $130,000 for 2026-27" | 2026-02-24 | james-harrington | /salary-sacrifice-calculator/, /superannuation-calculator/ | transfer-balance-cap-increase-2026, payday-super-starts-july-2026 |
| `transfer-balance-cap-increase-2026` | "Transfer Balance Cap Lifts to $2.1 Million From 1 July 2026" | 2026-03-05 | james-harrington | /superannuation-calculator/, /division-293-tax/ | super-contribution-caps-2026-27, division-296-super-tax-starts |
| `super-tax-changes-explained` | "The Super Tax Changes, Explained: Who Division 296 Actually Hits" | 2026-05-12 | james-harrington | /division-293-tax/, /superannuation-calculator/ | division-296-super-tax-starts, super-contribution-caps-2026-27 |

Write `title`/`description` in the same style as Task 6 entries (title ≤ 60 chars where possible, description 140–160 chars, includes the key number). Sources per article: ≥2 from {ato.gov.au payday-super, ato.gov.au better-targeted-superannuation-concessions, fairwork.gov.au payday-super newsroom, superguide.com.au}. Give `faq` (3–5) to `payday-super-starts-july-2026`, `division-296-super-tax-starts`, and `super-tax-changes-explained` — highest question-intent (Ahrefs: "payday super" 4,400/mo, "jim chalmers superannuation tax changes" 3,000/mo).

- [ ] **Step 3–6:** modules → register → build-verify all 6 slugs emit with NewsArticle schema → commit `feat(news): add super news batch (payday super, Div 296, caps)`.

---

### Task 8: HECS batch (4 articles)

**Files:**
- Modify: `calc-boiler/lib/news.ts`, `calc-boiler/modules/news/articles/index.ts`
- Create: `hecs-indexation-2026.tsx`, `hecs-20-percent-cut-status.tsx`, `hecs-repayment-threshold-2026-27.tsx`, `hecs-marginal-repayment-first-tax-time.tsx`

- [ ] **Step 1: Verify facts.** Searches: `HELP indexation 1 June 2026 rate 2.8% education.gov.au`, `20% HELP debt reduction ato applied`, `HELP repayment threshold 2026-27 $69,529`, `HELP marginal repayment 15 cents $67,000`. **Threshold discrepancy to resolve:** site's `/stsl-on-payslip/` page says $69,528; research said $69,529 — find the exact ATO figure and make registry + module + the existing STSL page agree (if STSL page is wrong, fix it in this task; note the fix in the commit).

- [ ] **Step 2: Registry entries:**

| slug | headline | datePublished | authorId | relatedCalculators | relatedArticles |
|---|---|---|---|---|---|
| `hecs-indexation-2026` | "HECS Indexation 2026: 2.8% Added to Student Debts on 1 June" | 2026-06-01 | james-harrington | /hecs-help-calculator/, /extra-super-vs-hecs-repayment/ | hecs-20-percent-cut-status, hecs-repayment-threshold-2026-27 |
| `hecs-20-percent-cut-status` | "The 20% HECS Debt Cut: How to Check It Hit Your Balance" | 2026-01-20 | james-harrington | /hecs-help-calculator/, /hecs-help-guide/ | hecs-indexation-2026, hecs-marginal-repayment-first-tax-time |
| `hecs-repayment-threshold-2026-27` | "HECS Repayment Threshold Rises to $69,529 for 2026-27" | 2026-06-26 | james-harrington | /hecs-help-calculator/, /stsl-on-payslip/ | hecs-marginal-repayment-first-tax-time, hecs-indexation-2026 |
| `hecs-marginal-repayment-first-tax-time` | "Your First Tax Return Under the New HECS Repayment System" | 2026-07-02 | james-harrington | /hecs-help-calculator/, /tax-return-calculator/ | hecs-repayment-threshold-2026-27, hecs-20-percent-cut-status |

Titles/descriptions in Task 6 style with the key number. Sources: education.gov.au HELP indexation page, ato.gov.au study-and-training-support-loans pages. `faq` (3–5) on all four — the whole cluster is question-intent ("hecs indexation" 3,400/mo KD 9, "hecs debt reduction" 7,400/mo KD 16).

- [ ] **Step 3–6:** modules → register → build-verify 4 slugs → commit `feat(news): add HECS news batch (indexation, 20% cut, thresholds, tax time)`.

---

### Task 9: Tax batch (6 articles, 3 premise-flagged)

**Files:**
- Modify: `calc-boiler/lib/news.ts`, `calc-boiler/modules/news/articles/index.ts`
- Create: `tax-cut-july-2026.tsx`, `1000-dollar-instant-tax-deduction.tsx`, `tax-time-2026-whats-new.tsx`, `federal-budget-2026-27-your-pay.tsx`, `medicare-levy-thresholds-2026.tsx`, `july-1-2026-money-changes.tsx`

- [ ] **Step 1: Verify facts — three ⚠ premise checks:**
  - ⚠ `tax-cut-july-2026`: search `Australia tax cut 1 July 2026 16 per cent 15 per cent legislated`. Confirm the 16%→15% rate cut took effect 1 July 2026 and the exact bracket ($18,201–$45,000). If not real, drop the article and tell the user.
  - ⚠ `1000-dollar-instant-tax-deduction`: search `$1000 instant tax deduction 2026-27 legislation ato`. Confirm status (in effect for FY2026-27 returns vs still before parliament) — write the article to match the verified status.
  - ⚠ `federal-budget-2026-27-your-pay` and `medicare-levy-thresholds-2026`: search `federal budget March 2026 personal income tax measures` and `medicare levy low income threshold 2026 budget`. Build both articles ONLY from verified measures; if the budget had no pay-relevant measures, re-angle the budget piece to "what the budget didn't change for your pay" (that is a legitimate news angle) or drop it.
  - `tax-time-2026-whats-new` and `july-1-2026-money-changes`: assemble from already-verified facts of other articles + search `tax time 2026 ato lodge return changes` for lodgement dates/WFH rate.

- [ ] **Step 2: Registry entries:**

| slug | headline | datePublished | authorId | relatedCalculators | relatedArticles |
|---|---|---|---|---|---|
| `tax-cut-july-2026` | "Tax Cut From 1 July 2026: The 16% Rate Drops to 15%" | 2026-07-01 | james-harrington | /income-tax-calculator/, /pay-rise-calculator/ | july-1-2026-money-changes, tax-time-2026-whats-new |
| `1000-dollar-instant-tax-deduction` | "The $1,000 Instant Tax Deduction: No Receipts, One Tick" | 2026-07-01 | james-harrington | /tax-return-calculator/, /income-tax-calculator/ | tax-time-2026-whats-new, tax-cut-july-2026 |
| `tax-time-2026-whats-new` | "Tax Time 2026: Everything New When You Lodge This Year" | 2026-06-29 | james-harrington | /tax-return-calculator/, /income-tax-calculator/ | 1000-dollar-instant-tax-deduction, hecs-marginal-repayment-first-tax-time |
| `federal-budget-2026-27-your-pay` | "Federal Budget 2026-27: What It Means for Your Take-Home Pay" | 2026-03-25 | james-harrington | /income-tax-calculator/, /take-home-pay-calculator/ | tax-cut-july-2026, medicare-levy-thresholds-2026 |
| `medicare-levy-thresholds-2026` | "Medicare Levy Thresholds Lifted: Who Pays Less From 2026" | 2026-03-26 | james-harrington | /medicare-levy/, /income-tax-calculator/ | federal-budget-2026-27-your-pay, tax-time-2026-whats-new |
| `july-1-2026-money-changes` | "Everything That Changed on 1 July 2026: Pay, Super, Tax, HECS and Centrelink" | 2026-07-01 | james-harrington | /take-home-pay-calculator/, /income-tax-calculator/ | minimum-wage-increase-july-2026, payday-super-starts-july-2026, tax-cut-july-2026, hecs-repayment-threshold-2026-27, centrelink-changes-july-2026 |

**`july-1-2026-money-changes` is the cornerstone:** its body must have one H2 per change area, each summarising in 2–3 sentences and linking to the dedicated article + the matching calculator (≥10 internal links). `faq` (3–5) on cornerstone, tax-cut, and $1,000-deduction articles. Sources: ato.gov.au, treasury.gov.au/budget, health.gov.au or ato.gov.au for Medicare levy.

- [ ] **Step 3–6:** modules → register → build-verify 6 slugs → commit `feat(news): add tax news batch incl. July 1 cornerstone roundup`.

---

### Task 10: Centrelink batch (4 articles) + footer list freshness

**Files:**
- Modify: `calc-boiler/lib/news.ts`, `calc-boiler/modules/news/articles/index.ts`, `calc-boiler/lib/navigation.ts`
- Create: `centrelink-payment-increase-january-2026.tsx`, `age-pension-increase-march-2026.tsx`, `deeming-rates-change-2026.tsx`, `centrelink-changes-july-2026.tsx`

- [ ] **Step 1: Verify facts.** Searches: `centrelink indexation 1 january 2026 youth allowance austudy`, `age pension increase 20 march 2026 $1,200.90`, `deeming rates 20 march 2026 1.25% $64,200`, `centrelink 1 july 2026 family tax benefit threshold changes`. All four premises came from secondary sources (Yahoo Finance) — confirm each against servicesaustralia.gov.au / dss.gov.au before writing.

- [ ] **Step 2: Registry entries:**

| slug | headline | datePublished | authorId | relatedCalculators | relatedArticles |
|---|---|---|---|---|---|
| `centrelink-payment-increase-january-2026` | "Centrelink Payments Rise From 1 January: Who Gets More" | 2026-01-01 | penny-ward | /centrelink-income-test/, /take-home-pay-calculator/ | age-pension-increase-march-2026, centrelink-changes-july-2026 |
| `age-pension-increase-march-2026` | "Age Pension Rises $22.20 a Fortnight From 20 March 2026" | 2026-03-20 | penny-ward | /centrelink-income-test/, /superannuation-calculator/ | deeming-rates-change-2026, centrelink-payment-increase-january-2026 |
| `deeming-rates-change-2026` | "Deeming Rates Change: How Centrelink Now Counts Your Savings" | 2026-03-20 | penny-ward | /centrelink-income-test/, /superannuation-calculator/ | age-pension-increase-march-2026, centrelink-changes-july-2026 |
| `centrelink-changes-july-2026` | "Centrelink Changes From 1 July: Family Payments and Higher Limits" | 2026-07-01 | penny-ward | /centrelink-income-test/, /parental-leave-pay/ | july-1-2026-money-changes, centrelink-payment-increase-january-2026 |

`faq` (3–5) on all four — the cluster is heavily question-driven ("centrelink payments increase" 8,300/mo KD 5). Sources: servicesaustralia.gov.au payment pages, dss.gov.au indexation.

- [ ] **Step 3: Reconcile `FOOTER_NEWS`** in `lib/navigation.ts` — all 9 hrefs must now resolve to real slugs (they were forward-declared in Task 5; fix any drift).
- [ ] **Step 4–6:** modules → register → build-verify 4 slugs → commit `feat(news): add Centrelink news batch, reconcile footer news links`.

---

### Task 11: Inbound contextual links from existing pages

**Files (modify only — add one short paragraph or list item each, near existing related-content sections, exact-match anchors):**

| File (module) | Add link(s) to | Anchor text |
|---|---|---|
| `modules/calculator/hecs-help-calculator.tsx` | `/news/hecs-indexation-2026/`, `/news/hecs-repayment-threshold-2026-27/` | "HECS indexation 2026", "2026-27 HECS repayment threshold" |
| `modules/guide/hecs-help-guide.tsx` | `/news/hecs-20-percent-cut-status/` | "20% HECS debt cut" |
| `modules/guide/superannuation-guide.tsx` | `/news/payday-super-starts-july-2026/` | "payday super rules from 1 July 2026" |
| `modules/calculator/superannuation-calculator.tsx` (or its module file) | `/news/super-contribution-caps-2026-27/` | "super contribution caps for 2026-27" |
| `modules/guide/award-rates.tsx` | `/news/minimum-wage-increase-july-2026/`, `/news/award-wage-increase-2026-industries/` | "minimum wage increase from 1 July 2026", "4.75% award wage increase" |
| `modules/guide/minimum-wage-history-australia.tsx` | `/news/minimum-wage-increase-july-2026/` | "2026 minimum wage decision" |
| `modules/guide/centrelink-income-test.tsx` | `/news/deeming-rates-change-2026/`, `/news/centrelink-changes-july-2026/` | "deeming rate changes", "Centrelink changes from 1 July 2026" |
| `modules/guides/tax-brackets.tsx` | `/news/tax-cut-july-2026/` | "July 2026 tax cut" |
| `modules/guide/stage-3-tax-cuts.tsx` | `/news/tax-cut-july-2026/` | "next tax cut from 1 July 2026" |
| `modules/home/*` (homepage hero or footer strip — find the main home module) | `/news/july-1-2026-money-changes/` | "everything that changed on 1 July 2026" |

- [ ] **Step 1:** For each file: read it, find the most contextually relevant existing paragraph/section (not a nav dump), and weave the link into a natural sentence. One link per anchor; do not force all links into one blob.
- [ ] **Step 2:** Build: `npm run build` — succeeds.
- [ ] **Step 3:** Commit — `git commit -m "feat(news): contextual inbound links from calculators and guides to news"`

---

### Task 12: Final audit gate

**Files:**
- Create: `calc-boiler/scripts/audit-news-links.mjs` (throwaway-quality audit script, committed for reuse)

- [ ] **Step 1: Write the link audit script**

```js
// Audits every /news/ page in out/: internal links resolve, ≥3 internal links per article,
// NewsArticle JSON-LD present, canonical present.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out", import.meta.url).pathname;
const newsDir = join(OUT, "news");
let failures = 0;

const articleDirs = readdirSync(newsDir).filter((d) => statSync(join(newsDir, d)).isDirectory());
console.log(`Auditing ${articleDirs.length} news articles + hub`);

for (const dir of [...articleDirs.map((d) => join(newsDir, d)), newsDir]) {
  const file = join(dir, "index.html");
  const html = readFileSync(file, "utf8");
  const isArticle = dir !== newsDir;

  if (isArticle && !html.includes('"@type":"NewsArticle"')) {
    console.error(`FAIL ${dir}: missing NewsArticle JSON-LD`); failures++;
  }
  if (!html.includes('rel="canonical"')) {
    console.error(`FAIL ${dir}: missing canonical`); failures++;
  }

  const links = [...html.matchAll(/href="(\/[^"#]*?)\/?"/g)].map((m) => m[1]).filter((h) => !h.startsWith("/_next") && !h.startsWith("/images"));
  const unique = [...new Set(links)];
  for (const href of unique) {
    const target = join(OUT, href.replace(/^\//, ""), "index.html");
    if (!existsSync(target)) { console.error(`FAIL ${dir}: broken internal link ${href}`); failures++; }
  }
  if (isArticle && unique.filter((h) => h !== "/").length < 3) {
    console.error(`FAIL ${dir}: fewer than 3 internal links`); failures++;
  }
}

if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log("All news pages pass.");
```

- [ ] **Step 2: Full verification run**

```bash
cd calc-boiler
npx tsc --noEmit          # expect: exit 0
npm run lint              # expect: no new errors in news files
npm run build             # expect: success; count routes
node scripts/audit-news-links.mjs   # expect: "All news pages pass."
grep -c "/news/" out/sitemap.xml     # expect: 25 (hub + 24) — or 24+N if premise-flagged articles were dropped
```

- [ ] **Step 3: Manual schema spot-check** — paste the rendered JSON-LD from 3 articles (cornerstone, one FAQ article, one plain) into https://validator.schema.org/ (or check structure by eye against schema.org/NewsArticle): no errors.

- [ ] **Step 4: Registry cross-checks** — every `relatedArticles` slug exists in `NEWS_ARTICLES`; every registry slug has a component in `NEWS_COMPONENTS`; article count is 20–30. Quick check:

```bash
node -e "
const ts = require('fs').readFileSync('lib/news.ts','utf8');
const slugs = [...ts.matchAll(/slug: \"([a-z0-9-]+)\"/g)].map(m=>m[1]);
console.log('articles:', slugs.length);
const idx = require('fs').readFileSync('modules/news/articles/index.ts','utf8');
const missing = slugs.filter(s => !idx.includes('\"' + s + '\"'));
console.log(missing.length ? 'MISSING COMPONENTS: ' + missing : 'all registered');
"
```

- [ ] **Step 5: Commit + final report**

```bash
git add calc-boiler/scripts/audit-news-links.mjs
git commit -m "chore(news): add news link/schema audit script"
```

Report to user: article count shipped, any premise-flagged articles dropped/re-angled, audit results, and suggested next step (deploy, then request indexing for the hub + cornerstone in GSC).

---

## Self-review notes

- **Spec coverage:** §2 architecture → Tasks 1–4; §3 anatomy → Tasks 2–3; §4 article list + verification protocol → Tasks 3, 6–10 (24 articles: 1+3 wages, 6 super, 4 HECS, 6 tax, 4 Centrelink); §5 integration → Tasks 5, 11; §7 testing → Task 12. Buffer-to-30 topics are post-launch, out of plan scope (spec says "if wanted post-launch").
- **Known interim state:** Task 5's `FOOTER_NEWS` forward-declares slugs created in Tasks 6–10; single-deploy site, gated by Task 12 audit.
- **`faq: TODO-write-from-verified-facts`** is an instruction token to the executor defined in the shared batch instructions (write 3–5 real FAQs at write time from verified facts) — it must never appear in committed code; the Task 12 audit's tsc step would reject it anyway.
