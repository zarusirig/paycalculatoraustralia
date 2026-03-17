# PROMPT — Copy everything below this line into a new session

---

You are building **Pay Calculator Australia** — a 30-page SEO-optimized Australian pay calculator website. The entire strategy, content, architecture, and technical specification has been pre-built across 24 documents. Your job is to **adapt the existing boilerplate codebase** at `calc-boiler/` (a Next.js 16 + Tailwind 4 + shadcn project) into the finished product.

## CRITICAL: Read These Files FIRST (In This Exact Order)

Before writing a single line of code, you MUST read and internalize these files. They are your law — do not deviate.

### Master Blueprint
1. **`@/DEVELOPER-HANDOFF.md`** — Start here. The master index of all documents, build order, calculator logic pseudocode, and 11 critical rules.
2. **`@/boilerplate-integration-guide.md`** — Maps every strategy document to exact file locations in `calc-boiler/`. Shows what's pre-built (don't rebuild) and what needs replacing.

### Identity & Voice (Read Before Writing ANY Content)
3. **`@/source-context.md`** — Central Entity ("Pay Calculator Australia"), Central Search Intent, site-wide n-grams. Every word on the site must serve this context.
4. **`@/brand-identity.md`** — Voice (Sage archetype), tone (professional, clear, empowering), reading level (Grade 8-10), forbidden words, CTA patterns, formatting rules. FOLLOW THIS FOR ALL COPY.

### Data (Single Source of Truth for ALL Numbers)
5. **`@/ontology-and-eav-knowledge-base.md`** — **NEVER invent financial figures.** Every tax bracket, super rate, HECS threshold, worked example — it's all here. Calculator outputs MUST match the worked examples in Part 2.
6. **`@/web-research-report.md`** — FY2025-26 verified data, competitor landscape, PAA questions, seasonal patterns.

### Architecture (URLs, Titles, Navigation)
7. **`@/raw-topical-map.md`** — All 30 pages: what each page does, its priority score, target queries, entity coverage.
8. **`@/topical-map-and-architecture.md`** — **Exact URLs, title tags, meta descriptions** for every page. The URL structure is flat (1-click depth). Do NOT change any URL.

### Content (H-tags, Word Counts, Structure)
9. **`@/content-briefs-all-pages.md`** — **The blueprint for every page's content structure.** H1, H2, H3 hierarchy, target word count, required internal links, lexical requirements. Follow the heading structure EXACTLY.
10. **`@/root-document-brief.md`** — Homepage-specific: calculator layout, input/output fields, hero section, below-fold content sections.
11. **`@/content/` folder** (9 pre-written pages) — These are FINAL content. Use as-is, do not rewrite:
    - `homepage.md`, `tax-brackets.md`, `income-tax-calculator.md`, `take-home-pay-calculator.md`
    - `hecs-help-calculator.md`, `salary-sacrifice-calculator.md`, `superannuation-calculator.md`
    - `contractor-vs-employee-calculator.md`, `medicare-levy.md`

### Internal Linking (Every Link Matters)
12. **`@/internal-linking-architecture.md`** — Complete link matrix for all 30 pages. Specifies which pages link to which, with exact anchor text variations. Minimum 5 internal links per page. No orphan pages.

### Schema Markup (Copy-Paste JSON-LD)
13. **`@/schema-markup-templates.md`** — 7 ready-to-deploy JSON-LD schemas: Organization, WebSite, WebApplication, FAQPage, BreadcrumbList, Article, Table. Per-page deployment checklist included. Use with the existing `<JsonLd>` component at `modules/seo/json-ld.tsx`.

### E-E-A-T & Trust (CRITICAL for YMYL Ranking)
14. **`@/eeat-ymyl-compliance.md`** — This is a YMYL (Your Money, Your Life) site. Every page MUST have:
    - Source attribution ("Rates sourced from ATO, verified [date]")
    - Trust bar ("✓ Official ATO rates ✓ Updated FY2025-26 ✓ Free forever")
    - Methodology disclosure (how the calculator works)
    - At least 1 outbound link to ato.gov.au or fairwork.gov.au
    - You MUST create `/about/`, `/contact/`, `/privacy/`, `/terms/` pages

### Technical SEO
15. **`@/technical-seo-specification.md`** — robots.txt content, sitemap priorities, canonical URL rules, Open Graph + Twitter cards, Core Web Vitals targets, security headers (already in next.config), GA4 custom events, 404 page requirements, redirect patterns.

### Semantic HTML
16. **`@/semantic-html-reference.md`** — Full HTML templates for calculator and guide pages showing proper `<main>`, `<article>`, `<section>`, `<output>`, `<details>`, ARIA attributes, accessibility. The boilerplate already follows most of this — maintain the patterns.

### Scaling (After Core 30 Pages)
17. **`@/programmatic-seo-templates.md`** — Auto-generate 35+ `/tax-on-{salary}/` pages using `generateStaticParams()`. Content template with dynamic variables. Build AFTER the core 30 pages are done.

### Launch Strategy
18. **`@/serp-production-publication-strategy.md`** — QA checklists, 4-wave publication schedule, SERP feature targeting (featured snippets, PAA), competitor weaknesses to exploit.

### Supporting Research (Reference When Needed)
19. **`@/keyword-intelligence-report.md`** — 46 keywords, 7 clusters, volume data
20. **`@/entity-attribute-analysis.md`** — 20 entities scored across attributes
21. **`@/query-network-analysis.md`** — 7 query clusters, 5 user journey paths
22. **`@/lexical-relationship-map.md`** — Synonym chains, anchor text bank
23. **`@/contextual-borders-and-audience-map.md`** — In-scope vs out-of-scope topics, 5 audience segments

---

## HOW TO BUILD

### Step 1: Foundation (Do First)
- Read all documents listed above
- Replace `calc-boiler/lib/constants/student-loans.ts` with `lib/constants/australian-tax.ts` using values from `ontology-and-eav-knowledge-base.md`
- Replace `lib/navigation.ts` with Australian calculator/guide categories from `topical-map-and-architecture.md`
- Update `app/layout.tsx`: `lang="en-AU"`, metadata base URL to `paycalculatoraustralia.com.au`, title template, Inter font
- Update `app/sitemap.ts` with all 30 pages using priorities from `technical-seo-specification.md`
- Update `public/robots.txt`

### Step 2: Homepage
- Rewrite all 12 `modules/home/components/` sections with Australian pay calculator content
- Update `lib/home/home.ts` data
- Follow `root-document-brief.md` for the hero calculator layout
- Use pre-written content from `content/homepage.md`
- Add Organization + WebSite schema

### Step 3: Calculator Pages (Follow Wave Order)

**Wave 1** (Build first — highest priority):
1. Income Tax Calculator → `app/calculators/income-tax-calculator/page.tsx`
2. Take-Home Pay Calculator → `app/calculators/take-home-pay-calculator/page.tsx`
3. Superannuation Calculator → `app/calculators/superannuation-calculator/page.tsx`

**For each calculator page:**
1. Create `app/calculators/[slug]/page.tsx` — export Next.js `Metadata` (title, description, OG from `topical-map-and-architecture.md`), render `<JsonLd>` schemas from `schema-markup-templates.md`, import module component
2. Create `modules/calculator/[slug].tsx` — follow the EXACT structure of `plan-2-student-loan-calculator.tsx`:
   - Hero section with breadcrumb + H1 + trust badge
   - Calculator card with form inputs + live results panel
   - Below-fold content sections (from `content/*.md` or write following `content-briefs-all-pages.md`)
   - FAQ accordion (matching FAQPage schema)
   - Related calculators section
   - Sources & references
3. Calculator logic MUST use constants from `lib/constants/australian-tax.ts`
4. Verify calculator output matches the worked examples in `ontology-and-eav-knowledge-base.md`
5. Implement ALL internal links from `internal-linking-architecture.md`
6. Apply E-E-A-T signals from `eeat-ymyl-compliance.md`

**Continue with Waves 2-4** for remaining calculators and guides.

### Step 4: Guide Pages
- Follow the existing `modules/guides/how-student-loans-work-uk.tsx` as the reference
- Use `TableOfContents` component for guides (it's already built)
- Content follows `content-briefs-all-pages.md` H-tag structure

### Step 5: E-E-A-T Compliance Pages
- Create `/about/`, `/contact/`, `/privacy/`, `/terms/` per `eeat-ymyl-compliance.md`
- Create shared components: `TrustBar`, `SourceAttribution`, `MethodologyDisclosure`

### Step 6: Programmatic Pages (After Core Launch)
- Create `app/tax-on-[salary]/page.tsx` with `generateStaticParams()`
- Follow `programmatic-seo-templates.md` exactly

### Step 7: Navigation & Footer
- Update `components/layout/navbar.tsx` with Australian categories
- Update `components/layout/footer.tsx` with all calculator/guide/state links per `internal-linking-architecture.md`

---

## ABSOLUTE RULES (NEVER BREAK THESE)

1. **NEVER invent financial numbers** — Every tax rate, threshold, and figure comes from `ontology-and-eav-knowledge-base.md`
2. **NEVER change URLs** — Use exactly what's in `topical-map-and-architecture.md`
3. **NEVER skip schema markup** — Every page gets its schemas from `schema-markup-templates.md`
4. **NEVER skip internal links** — Implement every link from `internal-linking-architecture.md`
5. **NEVER deviate from H-tag structure** — Follow `content-briefs-all-pages.md` heading hierarchy
6. **NEVER rewrite pre-written content** — The 9 pages in `content/` are final
7. **NEVER skip E-E-A-T signals** — Source attribution, trust bar, and methodology on every page
8. **NEVER use placeholder content** — Write real, substantive content following `brand-identity.md` voice
9. **NEVER forget accessibility** — ARIA labels, semantic HTML, keyboard navigation per `semantic-html-reference.md`
10. **NEVER build from scratch** — Adapt `calc-boiler/`, don't start a new project

## CONTENT QUALITY RULES (Most Important)

Content is the #1 priority. When writing content for pages that don't have pre-written `.md` files:

- **Voice**: Sage archetype — professional, clear, empowering. Grade 8-10 reading level. No jargon without explanation.
- **Tone**: Authoritative but approachable. Like a knowledgeable friend who happens to be a tax accountant.
- **Forbidden**: "synergy", "leverage" (as verb), "cutting-edge", "innovative", "seamless", "game-changer"
- **Required per page**: At least one worked example with real numbers from the EAV knowledge base
- **Australian English**: "organisation" not "organization", "colour" not "color", "superannuation" not "401(k)"
- **CTAs**: Action verbs ("Calculate your take-home pay", "See your tax breakdown"), never "Click here" or "Learn more"
- **Source every claim**: Link to ATO, FWC, or Services Australia for any specific rate or rule
- **Include FAQs**: Every page needs 3-5 FAQs matching the FAQPage schema
- **Follow lexical requirements**: Use synonyms and related terms from `lexical-relationship-map.md` naturally throughout content

## DESIGN QUALITY RULES

- **Premium, modern aesthetic** — NOT a basic Bootstrap/template look
- **Dark mode**: Support it from day one
- **Mobile-first**: Calculator must work perfectly at 320px
- **Animations**: Use `SectionWrapper` with Framer Motion for scroll-reveal sections
- **Trust signals**: Always visible — "Updated FY2025-26", "Official ATO rates", "Free forever"
- **No ads, no signup walls, no popups**
- **Google Font**: Inter (or keep Geist from boilerplate)

---

Start by reading `DEVELOPER-HANDOFF.md` and `boilerplate-integration-guide.md`, then begin with Step 1: Foundation.
