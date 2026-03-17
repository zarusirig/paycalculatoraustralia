# Boilerplate Integration Guide
## Mapping SEO Strategy → Actual Codebase
## Pay Calculator Australia | calc-boiler | Generated: 2026-03-14

---

## Boilerplate Summary

The `calc-boiler/` directory is a **production-ready Next.js 16 boilerplate** currently themed for UK student loans. It provides the full architecture — the coding agent's job is to **replace the content**, not rebuild the structure.

### Tech Stack (Already Installed)
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.6 | App Router, SSR/SSG, metadata API |
| React | 19.2.3 | UI runtime |
| Tailwind CSS | 4.x | Styling (via PostCSS) |
| shadcn/Radix | latest | UI primitives (Card, Accordion, etc.) |
| Framer Motion | 12.x | Scroll animations |
| Recharts | 3.7 | Charts (for salary comparison viz) |
| `schema-dts` | 1.1.5 | TypeScript schema.org types |
| Lucide React | 0.574 | Icons |

---

## Architecture Map

```
calc-boiler/
├── app/                         ← ROUTES (Next.js App Router)
│   ├── layout.tsx               ← Root layout: fonts, Navbar, Footer, <main>
│   ├── page.tsx                 ← Homepage (renders modules/home/templates)
│   ├── globals.css              ← Global styles + Tailwind
│   ├── sitemap.ts               ← Dynamic sitemap generator
│   ├── loading.tsx              ← Loading skeleton
│   ├── not-found.tsx            ← 404 page
│   ├── calculators/             ← Calculator route folder
│   │   └── [slug]/page.tsx      ← Per-calculator: metadata + JsonLd + module
│   └── guides/                  ← Guide route folder
│       └── [slug]/page.tsx      ← Per-guide: metadata + JsonLd + module
│
├── modules/                     ← PAGE-LEVEL COMPONENTS
│   ├── calculator/              ← One .tsx per calculator (form + logic + UI)
│   ├── guides/                  ← One .tsx per guide (long-form content)
│   ├── home/                    ← Homepage sections
│   │   ├── components/          ← 12 composable section components
│   │   └── templates/index.tsx  ← Assembles all homepage sections
│   └── seo/
│       └── json-ld.tsx          ← <JsonLd code={schemas} /> component
│
├── components/                  ← SHARED/REUSABLE COMPONENTS
│   ├── layout/
│   │   ├── navbar.tsx           ← Main navigation (mega menu capable)
│   │   └── footer.tsx           ← Site footer
│   ├── common/
│   │   ├── section-wrapper.tsx  ← Animated section with variant backgrounds
│   │   ├── tableOfContent.tsx   ← Sticky TOC with scroll spy
│   │   └── error-boundary.tsx   ← Error handling
│   └── ui/                      ← shadcn primitives (Card, Accordion, etc.)
│
├── lib/                         ← DATA & CONSTANTS
│   ├── constants/               ← Financial constants (tax brackets, rates)
│   ├── navigation.ts            ← Nav items, mega menu categories
│   ├── home/home.ts             ← Homepage section data
│   └── utils.ts                 ← Shared utilities
│
├── types/index.ts               ← TypeScript types
└── public/                      ← Static assets
    ├── robots.txt
    └── images/
```

---

## 🎯 Where Each SEO Document Maps

### 1. `source-context.md` + `brand-identity.md`
**Maps to**: Global tone in ALL component copy text
- **Action**: Replace all UK student loan references with Australian pay calculator language
- **Specific files**: Every `.tsx` in `modules/` and `lib/` data files

### 2. `ontology-and-eav-knowledge-base.md` (ALL NUMBERS)
**Maps to**: `lib/constants/`
- **Action**: Replace `lib/constants/student-loans.ts` with `lib/constants/australian-tax.ts`
- **Content**:
```typescript
// lib/constants/australian-tax.ts

export const TAX_BRACKETS_2025_26 = [
  { min: 0, max: 18_200, rate: 0, base: 0 },
  { min: 18_201, max: 45_000, rate: 0.16, base: 0 },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_288 },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_288 },
  { min: 190_001, max: Infinity, rate: 0.45, base: 51_638 },
] as const;

export const MEDICARE_LEVY_RATE = 0.02;
export const SUPER_GUARANTEE_RATE = 0.12;
export const HECS_THRESHOLD = 67_000;
// ... all values from EAV Knowledge Base
```

### 3. `topical-map-and-architecture.md` (URLs, Titles, Metas)
**Maps to**: Multiple locations
| SEO Element | Codebase Location | Method |
|-------------|-------------------|--------|
| URLs/slugs | `app/calculators/[slug]/` folder names | Create one folder per calculator |
| Title tags | `app/calculators/[slug]/page.tsx` → `export const metadata` | Next.js Metadata API |
| Meta descriptions | Same `metadata` export | `description` field |
| Canonical URLs | Same `metadata` export | `alternates.canonical` |
| Open Graph | Same `metadata` export | `openGraph` object |
| Navigation | `lib/navigation.ts` | Replace `CALCULATOR_CATEGORIES`, `GUIDE_CATEGORIES` |

### 4. `content-briefs-all-pages.md` (H-tag Structure)
**Maps to**: `modules/calculator/[name].tsx` and `modules/guides/[name].tsx`
- **Action**: The H2/H3 headings in each module component must match the content brief exactly
- **Pattern**: Follow the existing `plan-2-student-loan-calculator.tsx` structure — hero → calculator card → content sections → FAQ accordion → sources

### 5. `content/` pre-written pages (9 files)
**Maps to**: Below-fold content sections in each calculator/guide module
- **Pattern**: The text from `content/*.md` files goes into `<section>` blocks below the calculator card
- **Reference**: See lines 508-715 of `plan-2-student-loan-calculator.tsx` for the exact pattern

### 6. `internal-linking-architecture.md` (Link Matrix)
**Maps to**: `<Link>` components within each module
- **Pattern**: Follow the existing pattern with internal links in:
  - Hero info boxes (e.g., line 196-200)
  - Input hint text (e.g., line 382-388)
  - Content sections (e.g., lines 680-712)
  - Related calculators section (e.g., lines 494-506)
  - Understanding section (e.g., lines 670-715)

### 7. `schema-markup-templates.md` (JSON-LD)
**Maps to**: `app/calculators/[slug]/page.tsx` (route-level, NOT module-level)
- **Existing pattern** (follow exactly):
```tsx
// app/calculators/income-tax-calculator/page.tsx
import { JsonLd } from '@/modules/seo/json-ld';
import { BreadcrumbList, FAQPage, SoftwareApplication, WithContext } from 'schema-dts';

const breadcrumbSchema: WithContext<BreadcrumbList> = { /* ... */ };
const softwareSchema: WithContext<SoftwareApplication> = { /* ... */ };
const faqSchema: WithContext<FAQPage> = { /* ... */ };

return (
  <>
    <JsonLd code={[breadcrumbSchema, softwareSchema, faqSchema]} />
    <IncomeTaxCalculatorPage />
  </>
);
```
- The `JsonLd` component already handles `schema-dts` types and renders `<script type="application/ld+json">`

### 8. `eeat-ymyl-compliance.md` (Trust Signals)
**Maps to**: Multiple shared components
| E-E-A-T Element | Create/Modify |
|-----------------|---------------|
| Trust bar | `components/common/trust-bar.tsx` (NEW) |
| Source attribution | `components/common/source-attribution.tsx` (NEW) |
| Methodology disclosure | `components/common/methodology-disclosure.tsx` (NEW) |
| Disclaimer | Already exists as pattern in calculator (lines 470-477) |
| About page | `app/about/page.tsx` (NEW route) |
| Contact page | `app/contact/page.tsx` (NEW route) |
| Privacy page | `app/privacy/page.tsx` (NEW route) |
| Terms page | `app/terms/page.tsx` (NEW route) |

### 9. `technical-seo-specification.md`
**Maps to**: Already partially implemented!
| Spec | Status | File |
|------|--------|------|
| robots.txt | ✅ Exists | `public/robots.txt` (update content) |
| Sitemap | ✅ Exists | `app/sitemap.ts` (add all 30+ pages) |
| Canonical | ✅ Pattern exists | `metadata.alternates.canonical` in each route |
| OG/Twitter | ✅ Pattern exists | `metadata.openGraph` / `metadata.twitter` |
| Security headers | ✅ Exists | `next.config.ts` (HSTS, X-Frame, X-Content-Type, Referrer) |
| Trailing slash | ✅ Enabled | `next.config.ts` → `trailingSlash: true` |
| 404 page | ✅ Exists | `app/not-found.tsx` (update content) |
| Core Web Vitals | ✅ Built-in | Next.js 16 + `font-display: swap` already set |
| GA4 | ❌ Missing | Add to `app/layout.tsx` via `next/script` |

### 10. `semantic-html-reference.md`
**Maps to**: Already largely followed
- `<main>` wrapper: `app/layout.tsx` line 51 ✅
- Skip-to-content link: `app/layout.tsx` lines 44-49 ✅
- `<nav aria-label>`: `components/layout/navbar.tsx` ✅
- `aria-live="polite"` on results: Calculator module line 405 ✅
- `<section>` with `aria-labelledby`: `SectionWrapper` component ✅
- Breadcrumb `<nav>`: Calculator module lines 141-153 ✅
- **Missing**: `<output>` element for calculator results (currently uses `<Card>`)

### 11. `programmatic-seo-templates.md`
**Maps to**: New dynamic route
```
app/
  tax-on-[salary]/
    page.tsx          ← Dynamic route with generateStaticParams()
```
- Use `generateStaticParams()` to pre-render all ~35 salary pages
- Reuse the `TAX_BRACKETS_2025_26` constants from `lib/constants/`

---

## 🔄 Step-by-Step Conversion Checklist

### Phase 1: Foundation (Do First)
- [ ] Replace `lib/constants/student-loans.ts` → `lib/constants/australian-tax.ts`
- [ ] Update `lib/constants/index.ts` barrel export
- [ ] Replace `lib/navigation.ts` with Australian calculator/guide categories
- [ ] Update `app/layout.tsx`: lang="en-AU", metadata base URL, title template, fonts
- [ ] Update `public/robots.txt` with production URL
- [ ] Update `app/sitemap.ts` with all 30 pages + priorities from technical SEO spec

### Phase 2: Homepage
- [ ] Replace `lib/home/home.ts` data with Australian calculator content
- [ ] Rewrite `modules/home/components/hero-section.tsx` with pay calculator hero
- [ ] Update all 12 home section components with Australian content
- [ ] Add Organization + WebSite schema to `app/page.tsx`

### Phase 3: Calculator Pages (Build Per Wave)
For each calculator:
- [ ] Create `app/calculators/[slug]/page.tsx` (metadata + JsonLd + component import)
- [ ] Create `modules/calculator/[slug].tsx` (form + logic + content sections)
- [ ] Test calculator output against EAV worked examples

### Phase 4: Guide Pages
For each guide:
- [ ] Create `app/guides/[slug]/page.tsx` (metadata + JsonLd + component import)
- [ ] Create `modules/guides/[slug].tsx` (long-form content + TOC)

### Phase 5: E-E-A-T & Compliance Pages
- [ ] Create `app/about/page.tsx`, `app/contact/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`
- [ ] Create shared trust components

### Phase 6: Programmatic Pages
- [ ] Create `app/tax-on-[salary]/page.tsx` with `generateStaticParams()`

### Phase 7: Polish
- [ ] Update `components/layout/navbar.tsx` with Australian nav
- [ ] Update `components/layout/footer.tsx` with Australian footer links
- [ ] Update `app/not-found.tsx` with Australian-themed 404
- [ ] Add GA4 tracking
- [ ] Final build test: `npm run build`

---

## ⚡ What the Boilerplate Already Handles (Don't Rebuild)

| Feature | Status | Notes |
|---------|--------|-------|
| Security headers | ✅ | HSTS, X-Frame, X-Content-Type, Referrer, Permissions |
| Trailing slashes | ✅ | `next.config.ts` |
| Image optimization | ✅ | AVIF + WebP via Next.js |
| Font optimization | ✅ | `font-display: swap`, Next.js font loading |
| Skip-to-content | ✅ | Accessibility link in layout |
| Loading skeleton | ✅ | `app/loading.tsx` |
| 404 page | ✅ | `app/not-found.tsx` |
| JSON-LD component | ✅ | `modules/seo/json-ld.tsx` with `schema-dts` types |
| Section animations | ✅ | `SectionWrapper` with Framer Motion |
| Table of Contents | ✅ | Sticky sidebar + mobile collapse with scroll spy |
| Error boundaries | ✅ | `components/common/error-boundary.tsx` |
| Accordion FAQs | ✅ | shadcn Accordion component |
| Card components | ✅ | shadcn Card + CardContent |
