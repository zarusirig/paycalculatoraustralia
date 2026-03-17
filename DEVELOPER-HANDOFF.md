# 🏗️ Developer Handoff — Pay Calculator Australia
## Read This File First. It's the Master Blueprint.

---

## What This Project Is

A 30-page SEO-optimized Australian pay calculator website. All strategy, content, architecture, schema, and linking decisions have been pre-made in the documents below. **Follow them exactly — don't improvise.**

> ⚠️ **You have a ready-to-go boilerplate at `calc-boiler/`.** Do NOT build from scratch.
> Read `boilerplate-integration-guide.md` to understand how each SEO document maps to the existing codebase.

---

## 📂 Document Reading Order (Mandatory)

Read these files in this exact order before writing any code. Each document serves a specific purpose:

### Step 1: Understand the Site Identity
| Order | File | What It Tells You |
|-------|------|-------------------|
| 1 | `source-context.md` | Central entity, target audience, site-wide messaging rules |
| 2 | `brand-identity.md` | Voice, tone, reading level (Grade 8-10), forbidden words, CTA patterns |

### Step 2: Understand the Data
| Order | File | What It Tells You |
|-------|------|-------------------|
| 3 | `ontology-and-eav-knowledge-base.md` | **SINGLE SOURCE OF TRUTH** for all numbers — tax brackets, super rates, HECS thresholds. Every figure in the calculators MUST come from this file |
| 4 | `web-research-report.md` | Competitor landscape, PAA questions, FY2025-26 verified data |

### Step 3: Understand the Architecture
| Order | File | What It Tells You |
|-------|------|-------------------|
| 5 | `raw-topical-map.md` | All 30 pages — what each page does, its priority, target queries |
| 6 | `topical-map-and-architecture.md` | **Exact URLs, title tags, meta descriptions** for every page + flat URL hierarchy + navigation structure |

### Step 4: Understand the Content
| Order | File | What It Tells You |
|-------|------|-------------------|
| 7 | `content-briefs-all-pages.md` | **H-tag structure, word count, and internal links** for every page — follow these exactly |
| 8 | `root-document-brief.md` | Homepage-specific: calculator layout, input/output fields, hero section design |
| 9 | `content/` folder (9 files) | **Pre-written content** for 9 priority pages — use as-is |

### Step 5: Implement Linking & Schema
| Order | File | What It Tells You |
|-------|------|-------------------|
| 10 | `internal-linking-architecture.md` | Which pages link to which, exact anchor text, link coverage audit |
| 11 | `schema-markup-templates.md` | **Copy-paste JSON-LD** for every page type — Organization, WebApplication, FAQPage, BreadcrumbList, Article |

### Step 6: Trust, Compliance & HTML Structure
| Order | File | What It Tells You |
|-------|------|-------------------|
| 12 | `eeat-ymyl-compliance.md` | **CRITICAL for YMYL ranking** — trust signals, source attribution, methodology disclosure, required pages (About/Contact/Privacy/Terms), E-E-A-T audit checklist |
| 13 | `technical-seo-specification.md` | robots.txt, sitemap.xml, canonical URLs, Open Graph/Twitter cards, Core Web Vitals targets, security headers, GA4 custom events, 404 page, redirect patterns |
| 14 | `semantic-html-reference.md` | **Copy-paste HTML templates** for calculator and guide pages — semantic elements, ARIA attributes, accessibility, heading hierarchy rules |

### Step 7: Scaling & Launch Strategy
| Order | File | What It Tells You |
|-------|------|-------------------|
| 15 | `programmatic-seo-templates.md` | Auto-generate 35+ salary-specific pages (`/tax-on-80000/`) from the EAV data — content template, Next.js dynamic route pattern |
| 16 | `serp-production-publication-strategy.md` | QA checklists, 4-wave publication schedule, technical launch requirements |

---

## 🔧 Build Specifications

### Boilerplate (Already Built — Use This)
- **Directory**: `calc-boiler/`
- **Full mapping guide**: `boilerplate-integration-guide.md` — READ THIS FIRST
- **Framework**: Next.js 16 (App Router) — already installed
- **Styling**: Tailwind CSS 4 + shadcn/Radix — already installed
- **Animations**: Framer Motion — already installed
- **Charts**: Recharts — already installed
- **Schema types**: `schema-dts` + `JsonLd` component — already built
- **Deployment**: Vercel (or Cloudflare Pages)
- **Domain**: paycalculatoraustralia.com.au

### What the Boilerplate Already Has (Don't Rebuild)
- ✅ Security headers (HSTS, X-Frame, X-Content-Type)
- ✅ Trailing slashes, image optimization (AVIF/WebP)
- ✅ Skip-to-content accessibility link
- ✅ `<JsonLd>` component at `modules/seo/json-ld.tsx`
- ✅ `SectionWrapper` with animation variants
- ✅ `TableOfContents` with sticky sidebar + mobile collapse
- ✅ Accordion FAQ component (shadcn)
- ✅ Card components (shadcn)
- ✅ Dynamic `sitemap.ts` (add your pages)
- ✅ 404 page, loading skeleton, error boundary
- ✅ Navbar with mega menu + Footer

### Your Job: Replace Content, Not Structure
1. Replace `lib/constants/student-loans.ts` → `lib/constants/australian-tax.ts`
2. Replace `lib/navigation.ts` categories with Australian calculators/guides
3. Rewrite `modules/home/` sections with pay calculator homepage content
4. Create one `app/calculators/[slug]/page.tsx` + one `modules/calculator/[slug].tsx` per calculator
5. Create one `app/guides/[slug]/page.tsx` + one `modules/guides/[slug].tsx` per guide
6. Follow the existing `plan-2-student-loan-calculator.tsx` as your reference pattern

### Calculator Logic (Critical)

All calculator formulas must use the **EAV Knowledge Base** values:

```
Income Tax Calculation:
  if income <= 18200: tax = 0
  elif income <= 45000: tax = (income - 18200) * 0.16
  elif income <= 135000: tax = 4288 + (income - 45000) * 0.30
  elif income <= 190000: tax = 31288 + (income - 135000) * 0.37
  else: tax = 51638 + (income - 190000) * 0.45

Medicare Levy: income * 0.02

Super (employer-paid, display only): income * 0.12

HECS (if toggled on):
  if income <= 67000: hecs = 0
  elif income <= 125000: hecs = (income - 67000) * 0.15
  elif income <= 179285: hecs = 8700 + (income - 125000) * 0.17
  else: hecs = income * 0.10

Take-Home = income - tax - medicare - hecs
```

**Verify**: Calculator output MUST match the worked examples table in `ontology-and-eav-knowledge-base.md` (Part 2, Worked Examples section).

### Design Rules
- **Premium, modern aesthetic** — not a basic Bootstrap site
- Dark mode support
- Mobile-first responsive design (calculator must work at 320px)
- Smooth animations and transitions
- Trust signals: "Updated FY2025-26", "Official ATO rates", "Free forever"
- No ads, no signup walls
- Google Fonts: Inter or similar clean sans-serif

### Page Generation Pattern

For each of the 30 core pages:
1. Get the **URL, title tag, meta description** from `topical-map-and-architecture.md`
2. Get the **HTML structure** from `semantic-html-reference.md` — use the correct template (calculator or guide)
3. Get the **H-tag structure** from `content-briefs-all-pages.md`
4. Get the **content** from `content/[page].md` (if exists) — otherwise write following the brief
5. Get the **internal links** from `internal-linking-architecture.md`
6. Get the **schema** from `schema-markup-templates.md`
7. Apply **E-E-A-T signals** from `eeat-ymyl-compliance.md` (source attribution, trust bar, methodology)
8. Apply **technical SEO** from `technical-seo-specification.md` (canonical, OG tags, headers)
9. Apply brand voice from `brand-identity.md`

For the 35+ programmatic salary pages:
1. Follow the template in `programmatic-seo-templates.md`
2. Generate data using the calculator logic above
3. Use `generateStaticParams()` in Next.js for static pre-rendering

---

## 🚀 Build Order (Follow the Publication Waves)

Build in this order — matches `serp-production-publication-strategy.md`:

### Wave 1 (Build First — Core)
1. Homepage `/` — main calculator + hero + below-fold content
2. `/income-tax-calculator/` — calculator + guide content
3. `/take-home-pay-calculator/` — calculator + guide content
4. `/tax-brackets/` — reference page (no calculator)
5. `/superannuation-calculator/` — calculator + guide content

### Wave 2 (Deduction Pages)
6-11: Medicare, HECS calc + guide, Salary Sacrifice calc + guide, Super guide

### Wave 3 (Quick Wins + Frequency)
12-21: Contractor, Gross, Pay Rise, Redundancy, Hourly converter, Weekly/Fortnightly/Monthly

### Wave 4 (State + Remaining Guides)
22-30: Annual, 4 state pages, LITO, PAYG tables, Award Rates, Payslip guide, Employer cost

### Wave 5 (Programmatic Pages — After Core Launch)
31-65: Auto-generated `/tax-on-{salary}/` pages for $30K-$200K in $5K increments (see `programmatic-seo-templates.md`)

---

## 📋 Files Inventory

```
paycalculatoraustralia/
├── DEVELOPER-HANDOFF.md                      ← THIS FILE (start here)
│
│   Strategy & Identity
├── source-context.md                         ← Site identity
├── brand-identity.md                         ← Voice & tone rules
├── web-research-report.md                    ← Market research
│
│   Research & Analysis
├── keyword-intelligence-report.md            ← Keyword data
├── entity-attribute-analysis.md              ← Entity scoring
├── query-network-analysis.md                 ← Query clusters
├── lexical-relationship-map.md               ← Synonym/anchor chains
│
│   Architecture & Knowledge
├── raw-topical-map.md                        ← 30-page map
├── topical-map-and-architecture.md           ← URLs, titles, metas, nav
├── ontology-and-eav-knowledge-base.md        ← ALL NUMBERS (single source)
│
│   Content Planning
├── contextual-borders-and-audience-map.md    ← Scope rules + audiences
├── root-document-brief.md                    ← Homepage blueprint
├── content-briefs-all-pages.md               ← All page H-tag structures
│
│   Implementation
├── internal-linking-architecture.md          ← Link matrix
├── schema-markup-templates.md                ← JSON-LD templates
├── serp-production-publication-strategy.md   ← Launch plan + QA
│
│   🆕 Supplementary (Trust, Technical, Scale)
├── eeat-ymyl-compliance.md                   ← E-E-A-T trust & YMYL compliance
├── technical-seo-specification.md            ← robots.txt, sitemap, OG, CWV, headers
├── programmatic-seo-templates.md             ← Auto-generate 35+ salary pages
├── semantic-html-reference.md                ← HTML templates with semantic elements
│
│   Pre-Written Content (9 pages)
└── content/
    ├── homepage.md
    ├── tax-brackets.md
    ├── income-tax-calculator.md
    ├── take-home-pay-calculator.md
    ├── hecs-help-calculator.md
    ├── salary-sacrifice-calculator.md
    ├── superannuation-calculator.md
    ├── contractor-vs-employee-calculator.md
    └── medicare-levy.md
```

---

## ⚠️ Critical Rules for the Coding Agent

1. **Never invent numbers** — all financial figures come from `ontology-and-eav-knowledge-base.md`
2. **Never change URLs** — use exactly what's in `topical-map-and-architecture.md`
3. **Never skip schema** — every page needs the schemas listed in `schema-markup-templates.md`
4. **Never skip internal links** — implement every link from `internal-linking-architecture.md`
5. **Match the H-tag structure** — content briefs specify the exact heading hierarchy
6. **Pre-written content is final** — don't rewrite the 9 existing content pages
7. **Calculator accuracy is non-negotiable** — verify against the EAV worked examples table
8. **Use semantic HTML** — follow `semantic-html-reference.md` templates exactly (not generic `<div>` soup)
9. **E-E-A-T is mandatory** — every page needs source attribution, trust bar, and methodology per `eeat-ymyl-compliance.md`
10. **Create About, Contact, Privacy, Terms pages** — required for YMYL compliance (see `eeat-ymyl-compliance.md`)
11. **Follow technical SEO spec** — robots.txt, sitemap, canonical, OG tags, Core Web Vitals per `technical-seo-specification.md`
