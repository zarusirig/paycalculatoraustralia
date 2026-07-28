# FY2026-27 Migration & SERP Recovery — Design

**Date:** 28 July 2026
**Status:** Steps 1–5 implemented on branch `seo/fy2026-27-recovery` (not pushed). See §13.
**Site:** pay-calculator-australia.com (`calc-boiler/`, Next.js App Router, `output: "export"` → Firebase Hosting)

---

## 1. Problem statement

**GSC export (28 July 2026, last 28 days vs previous 28 days) shows no site-wide decline.**

| | Previous 28d | Last 28d | Change |
|---|---|---|---|
| Clicks | 4,958 | 6,873 | **+38.6%** |
| Impressions | 485,102 | 663,712 | **+36.8%** |
| Mobile avg position | 6.86 | 6.07 | improved |
| Desktop avg position | 10.95 | 9.77 | improved |

An earlier hypothesis in this engagement — that the 1 July FY rollover collapsed demand on the site's 2025-targeted queries and caused a GSC decline — **is not supported and has been withdrawn.** Direct test: queries containing "2025" grew impressions +31% (3,341 → 4,373); queries containing "2026" grew +36% (534 → 727). Both rising. (Caveat: 79% of clicks sit in anonymised queries, so query-level evidence is weak in both directions.)

The site is growing strongly. The real problems are **a narrow, diagnosable decline on specific pages**, and **a large blocked opportunity**.

### 1a. The actual decline: the bonus cluster, ≈ −130 clicks

`/bonus-tax-calculator/` is the largest single-page loss at **−109 clicks**.

| Query | Clicks | Impressions | Position |
|---|---|---|---|
| tax on bonus payments calculator australia | 68 → 27 | 151 → 153 | 3.1 → 3.7 |
| bonus tax calculator australia | 43 → 17 | 152 → 153 | 3.4 → 5.9 |
| bonus calculator australia | 37 → 14 | 74 → 57 | 3.5 → 4.7 |
| bonus tax calculator | 95 → 73 | 289 → 270 | 3.3 → 3.9 |
| tax on bonus calculator | 29 → 15 | 104 → 143 | 2.1 → 4.5 |

**Impressions flat; clicks roughly halved; positions slipping 0.5–2.4 places.** That is a page demotion, not lost demand — and it lands on the page that imports `TAX_BRACKETS_2025_26`, hardcodes `$67,000` HECS and a `$30,000` concessional cap, and **does not use the correct FY2026-27 Schedule 5 engine already present in the repo** (`calculateSchedule5MethodB`, `payg-withholding.ts:168`). Bonus tax *is* Schedule 5. This is the one place the FY-staleness problem is demonstrably costing traffic today.

Also declining:
- `/leave-calculator/` **−62** — genuine ranking loss (6.4 → 7.3; "annual leave loading calculator" 6.3 → 12.2)
- `/centrelink-income-test/` **−56** — *not* our doing: impressions collapsed ~90% ("centrelink payment calculator" 1,828 → 183) while position barely moved. Demand or SERP-feature change; likely seasonal. **No action.**
- `/hourly-to-annual-salary-calculator/` **−29** at flat position 6.6 — mild CTR decay

### 1b. The blocked opportunity: the tax-table pages are not indexed

The four Wave 13 tax-table pages return **zero rows in the GSC Pages export** — zero impressions in 28 days — and a `site:pay-calculator-australia.com tax table` search returns only `/payg-withholding-tables/`. The dedicated pages appear solely as footer link text on other pages.

They are technically indexable (HTTP 200, self-canonical, `robots: index, follow`, in `sitemap.xml`). They are simply **not indexed** three weeks after launch. §7 explains why: no crawlable navigation, and footer-only linking at half the rate of their competitors.

Meanwhile the season is live and the hub is absorbing the demand: `/payg-withholding-tables/` went **13 → 109 clicks**, impressions **3,326 → 6,157**, position **11.9 → 8.6**. Forward-year demand is already appearing — "monthly tax tables 2026" 0 → 416 impressions at position 8.6, "tax tables 2027" at position 1.0.

### 1c. The growth ceiling

92 keywords with ≥300 searches/mo rank at position ≤60, almost all reporting zero Ahrefs traffic — the footprint sits at positions 13–51. `/tax-brackets/` is buried at 39–51 across ~11,000 searches/mo and contains **no FY2026-27 rate table at all**; its only table reads `$18,201–$45,000 | 16c` and "Applies 1 July 2025 to 30 June 2026". This caps growth rather than causing decline, but it is where the largest upside sits.

### 1d. Why Ahrefs and GSC disagreed

Ahrefs AU shows monotonic growth 0 → 803/week since March. GSC agrees on direction. Both were right; the earlier reconciliation attempt was the error. Ahrefs models traffic as rank snapshot × volume average and materially understates a fast-growing young site — it reports ~850/mo where GSC measures ~6,900 clicks per 28 days. **Use GSC for anything decision-grade.**

**Not the cause: content depth.** Measured against the live AU SERPs — PwC ranks #4 for "australian tax rates" with 1,635 words against our 2,407; MoneySmart ranks #4–9 with ~1,000 words and no non-resident or WHM table; Sleek has 2,637 words and DR 68 and sits at #15 because its "2026" table prints 16%. Meanwhile `netactuary.com.au` (DR 8, one referring domain) ranks #13 where we rank #49. Depth is uncorrelated with position in this SERP; currency is. **This plan therefore writes almost no new content.**

---

## 2. Scope decisions taken

| Decision | Choice | Rationale |
|---|---|---|
| NAT 1006 accuracy defect | **Fix first, before all other work** | Published figures understate withholding ~2×; page carries a CPA byline and Registered Tax Agent number |
| `/tax-return-calculator/`, `/tax-refund-guide/`, `/notice-of-assessment/`, `/work-from-home-deductions/` | **Carry both years explicitly** | Users lodging now file the 2025-26 return while FY2026-27 is underway; stacked sections match how every SERP winner survives the transition |
| `/tax-on/` vs `/take-home-pay-on/` (35 duplicate pairs) | **Differentiate, do not merge** | No redirects, so no ranking risk; `/take-home-pay-on/75000/` currently holds 215 internal links |

### 2a. Execution order (supersedes the phase numbering below)

The GSC data reprioritises the work. Phase numbers in §4–§8 are kept as written for reference; **execute in this order**:

| Order | Work | Section | Why now |
|---|---|---|---|
| 1 | NAT 1006 coefficient fix | §4 | Correctness. Also a hard prerequisite for step 2 — do not push Google to index pages whose figures are wrong |
| 2 | Internal linking + force indexation of the 4 tax-table pages | §7 | The season is live *now* (Jul–Oct) and those pages have zero impressions. Highest-value unblock on the site |
| 3 | `/bonus-tax-calculator/` → point at the existing Schedule 5 engine | §5 | The only measurable active loss (−109 clicks, impressions flat) |
| 4 | One engine, sitewide | §5 | 123 URLs computing tax ~$268/yr too high |
| 5 | Labels and metadata | §6 | Cheap, wide, but growth-capping rather than decline-causing |
| 6 | SERP work on `/tax-brackets/`, LITO, HECS thresholds | §8 | Largest upside, longest payback |

`/leave-calculator/` (−62) needs its own diagnosis and is not yet scoped here. `/centrelink-income-test/` (−56) requires no action — see §1a.

---

## 3. Verified FY2026-27 constants

Every figure below was retrieved from ato.gov.au via firecrawl on 28 July 2026 and cross-checked arithmetically. **These are the authoritative inputs for Phase 1.**

### Resident income tax — FY2026-27

| Taxable income | Tax |
|---|---|
| $0 – $18,200 | Nil |
| $18,201 – $45,000 | **15c** per $1 over $18,200 |
| $45,001 – $135,000 | **$4,020** + 30c per $1 over $45,000 |
| $135,001 – $190,000 | **$31,020** + 37c per $1 over $135,000 |
| $190,001 + | **$51,370** + 45c per $1 over $190,000 |

Accumulators verified: `(45,000−18,200)×0.15 = 4,020`; `4,020 + 90,000×0.30 = 31,020`; `31,020 + 55,000×0.37 = 51,370`.

**Sourcing caveat.** The ATO's *Tax rates – Australian resident* page was last updated 1 June 2026 and **contains no FY2026-27 table** — it stops at 2025-26. The cut is nonetheless in force: the ATO fortnightly tax table states it "applies to payments made from 1 July 2026", and the Schedule 1 weekly coefficients (published 17 June 2026) open at `0.1500`. Cite Treasury/Budget plus Schedule 1, not that ATO page.

### Study and training loans (HECS/HELP/STSL) — FY2026-27

| Repayment income | Repayment |
|---|---|
| $0 – $69,528 | Nil |
| $69,529 – $129,717 | 15c per $1 over $69,528 |
| $129,718 – $186,050 | **$9,028** + 17c per $1 over $129,717 |
| $186,051 + | 10% of total repayment income |

Source: ATO, last updated 30 June 2026. **Use `$9,028`, not `$9,028.35`** — ATO's own worked example reconciles to $9,028 (`$137,064 − $129,717 = $7,347 × 17% = $1,248.99 + $9,028 = $10,276.99`). The site's existing figure is correct. Indexation applied 1 June 2026: 2.8%.

FY2025-26 comparison: $67,000 / $125,000 / $179,285, base $8,700.

### Medicare levy — FY2026-27 (from Schedule 1 coefficients page)

- Single low-income threshold: **$28,011** ($538/week) — repo currently has `27_222`
- Shade-in to: **$35,013** ($673/week), at 10% of the excess
- Family threshold: **$47,238**; additional child: **$4,338**
- Rate above shade-in: 2%

### Medicare levy surcharge — FY2026-27

| | Base | Tier 1 (1%) | Tier 2 (1.25%) | Tier 3 (1.5%) |
|---|---|---|---|---|
| Single | ≤$105,000 | $105,001–123,000 | $123,001–164,000 | $164,001+ |
| Family | ≤$210,000 | $210,001–246,000 | $246,001–328,000 | $328,001+ |

Source: ATO, last updated 22 June 2026. Family threshold +$1,500 per dependent child after the first.

**The repo's MLS tiers are three years stale, not one.** Current values `93,001–108,000 / 108,001–144,000 / 144,001+` are the ATO's **FY2023-24** table verbatim.

### LITO — FY2026-27

Parameters unchanged: max **$700**, full below **$37,500**, 5c taper to $45,000 (→$325), 1.5c taper to **$66,667**, nil above.

**Derived figure changed:** effective tax-free threshold = `18,200 + 700/0.15` = **$22,867**. Repo hardcodes `22_575`, which is the 16% version (`700/0.16`) — correct last year, wrong now.

### Foreign resident, fortnightly

| Fortnightly earnings | Rate |
|---|---|
| $0 – $5,191 | 30c per $1 |
| $5,192 – $7,305 | $1,557 + 37c per $1 over $5,191 |
| $7,306 + | $2,339 + 45c per $1 over $7,305 |

### 27-pay-year additional withholding (fortnightly)

`$1,700–5,199 → $12` · `$5,200–7,249 → $27` · `$7,250+ → $48`

### Still unresolved — do not guess

- `maxContributionBasePerQuarter` / `maxSGPerQuarter` (repo: 62,500 / 7,500) — no FY2026-27 source located
- Super caps: repo has 30,000 / 120,000; repo's own news article says 32,500 / 130,000 from 1 July 2026. Verify against ATO before adopting.
- Minimum wage: repo has $24.10 (a 1 July 2024 rate); repo's own tables say FY2025-26 $24.95 and FY2026-27 $26.44 / $1,004.90. Verify against Fair Work.

---

## 4. Phase 0 — NAT 1006 correctness (leads all other work)

### The defect

`/fortnightly-tax-table/` publishes, at $1,000 gross: **$18** withheld (threshold claimed) and **$150** (not claimed). The ATO's own worked example for $989.80 gives **$40** and **$176**.

**Root cause.** The engine annualises the pay, applies the FY2026-27 scale, subtracts the **full** LITO, then divides back. At $26,000 annualised: `$1,170 tax − $700 LITO = $470/yr ÷ 26 = $18.08`. That is arithmetically correct and completely wrong as withholding — the ATO's PAYG schedules deliberately do not deliver full LITO through withholding. An employer using this table under-withholds.

Two visible tells: the page's disclaimer says figures "may differ from the printed ATO table by a few dollars" (the gap is >100%), and the table prints odd dollar amounts ($595, $723, $851) when every ATO fortnightly figure is necessarily even.

### The correct algorithm (validated end-to-end)

```
fortnightly:  weeklyEquivalent = floor(fortnightlyGross / 2) + 0.99
monthly:      (see Schedule 1 — includes the $0.33 rule before ÷ 13/3)
weekly:       weeklyEquivalent = floor(weeklyGross) + 0.99

withheld_weekly = round(a * weeklyEquivalent - b)      // nearest dollar
withheld_fortnightly = withheld_weekly * 2
```

Validation against the ATO's published example (fortnightly $989.80):

| Scale | Band | a | b | Computation | Result | ATO |
|---|---|---|---|---|---|---|
| 2 (threshold claimed) | <$538 | 0.1500 | 54.3462 | `0.1500×494.99 − 54.3462 = 19.90 → $20 × 2` | **$40** | $40 ✓ |
| 1 (no threshold) | <$515 | 0.1790 | 0.1066 | `0.1790×494.99 − 0.1066 = 88.49 → $88 × 2` | **$176** | $176 ✓ |

### Scale 2 coefficients — threshold claimed (FY2026-27)

| Weekly earnings (x) | a | b |
|---|---|---|
| < $362 | – | – |
| < $538 | 0.1500 | 54.3462 |
| < $673 | 0.2500 | 108.2135 |
| < $721 | 0.1700 | 54.3473 |
| < $865 | 0.1790 | 60.8377 |
| < $1,282 | 0.3227 | 185.1935 |
| < $2,596 | 0.3200 | 181.7319 |
| < $3,653 | 0.3900 | 363.4627 |
| $3,653 + | 0.4700 | 655.7704 |

### Scale 1 coefficients — no threshold (FY2026-27)

| Weekly earnings (x) | a | b |
|---|---|---|
| < $188 | 0.1500 | 0.1500 |
| < $371 | 0.2084 | 11.0185 |
| < $515 | 0.1790 | 0.1066 |
| < $932 | 0.3227 | 74.1674 |
| < $2,246 | 0.3200 | 71.6508 |
| < $3,303 | 0.3900 | 228.8816 |
| $3,303 + | 0.4700 | 493.1893 |

Scale 3 (foreign resident), Scale 4 (no TFN: 47% resident / 45% foreign), Scale 5 (full Medicare exemption) and Scale 6 (half exemption) are also published and should be encoded — Scale 3 and 4 are needed for the foreign-resident and no-TFN columns that competitors carry and we lack.

### Work

1. Add `SCHEDULE_1_COEFFICIENTS` (scales 1–6) to `lib/constants/payg-withholding.ts`.
2. Replace the annualise-and-divide withholding function with the coefficient method.
3. **Add a regression test asserting the two ATO worked examples** ($989.80 → $40 / $176). Non-negotiable — this is the guard against silent drift next July.
4. Assert in test that every fortnightly output is an even dollar amount.
5. Remove the "may differ by a few dollars" disclaimer once parity holds.
6. Regenerate the tables on all four tax-table pages.
7. Fix the broken source citation — the cited Statement of Formulas URL **404s**; the live path inserts `schedule-1-`.

---

## 5. Phase 1 — one engine

The repo has **three** tax engines:

| Engine | Location | FY |
|---|---|---|
| Sitewide | `lib/constants/australian-tax.ts` | 2025-26 |
| PAYG | `lib/constants/payg-withholding.ts` | 2026-27 |
| HECS (page-local) | `modules/calculator/hecs-help-calculator.tsx:28-49` | 2026-27 |

And they leak into each other. `payg-withholding.ts:19-25` imports `LITO`, `MEDICARE_LEVY` and `calculateHECS` from the FY2025-26 file — so **every "FY2026-27" tax table computes its STSL column on $67,000 bands** while the same page's prose says $69,528.

### Work

1. Promote `TAX_BRACKETS_2026_27` to sitewide; repoint `calculateIncomeTax` and `calculatePayBreakdown`. **Fixes 123 URLs** currently reporting tax ~$268/yr too high above $45k.
2. Keep `TAX_BRACKETS_2025_26` exported — `/tax-bracket-history/` legitimately needs it.
3. Update `HECS_HELP` to 69,528 / 129,717 / 186,050 and **delete** the page-local `HECS_2026_27`.
4. `MEDICARE_LEVY.lowIncomeThreshold` → 28,011; add shade-in 35,013; MLS tiers → the FY2026-27 table above.
5. `LITO.effectiveTaxFreeThreshold` → **derive from the bracket rate**, never hardcode. This is the exact bug that produced $22,575.
6. Reconcile `calculateMedicareLevy` — the sitewide version is flat 2% from the first dollar with a `// Simplified` comment; the PAYG version shades correctly. Keep the shaded one.
7. Rename `TAX_HISTORY.upcomingFY2026_27` — the event was 27 days ago and pages render it as a future promise.
8. Single source of truth for dates:

```ts
export const FY = { current: "2026-27", start: "1 July 2026", end: "30 June 2027", previous: "2025-26" } as const;
export const LAST_VERIFIED = "…";
export const RATES_EFFECTIVE = "1 July 2026";
```

Then delete the competing `PAYG_FINANCIAL_YEAR` / `PAYG_TABLES_UPDATED`, the two `lastVerified="2 July 2026"` per-page overrides, and the three hardcoded `<time>` literals in privacy/terms/about. **Two competing FY constants is what produced the visible on-page contradiction.**

---

## 6. Phase 2 — labels (five edits, ~200 pages)

| # | File:line | Change |
|---|---|---|
| 1 | `lib/constants/australian-tax.ts:168-171` | `financialYear`, `financialYearStart`, `financialYearEnd`, `lastVerified` |
| 2 | `components/common/trust-bar.tsx:12` | `Updated FY${SITE_CONFIG.financialYear}` — **one line, ~200 pages** |
| 3 | `components/layout/footer.tsx:100,148,155,261` | "Tax Brackets 2025-26" label; "Updated for FY…"; two "verified" dates |
| 4 | `lib/navigation.ts:38,78,103,272,307` | Nav/footer labels incl. "Award Rates 2025" |
| 5 | `app/layout.tsx:18,21` + `app/opengraph-image.tsx:63` + `app/not-found.tsx:10` | Title template, description, OG card |

Edit 1 also rewrites **90 dynamic titles/descriptions** across `/tax-on/`, `/take-home-pay-on/` and `/salary-to-hourly/`, which interpolate `SITE_CONFIG.financialYear`.

Then 24 stale static metadata titles by hand, with the four return-year pages handled per §2 (both years, stacked and labelled) and `/fringe-benefits-tax/` treated separately — the FBT year ends 31 March, so it does not follow the income-year cycle.

---

## 7. Phase 3 — internal linking

### The mega menu emits zero crawlable links

`components/layout/navbar.tsx` is `"use client"`, and the menu renders inside a framer-motion `AnimatePresence` gated on hover state. Grepping the built HTML for its link strings returns zero matches. Silently orphaned: 40+ guide links, **all 35 `/tax-on/` links**, all state links. `CALCULATOR_CATEGORIES` is exported and never imported anywhere — dead code.

Only five links render server-side.

Consequence: 25 of 35 `/tax-on/` pages have exactly **one** inbound internal link. `/tax-on/65000/` has one — which is why `/salary-to-hourly/65000/` (two links) outranks it for "tax on 65000 australia".

### The footer's two zones create the tax-table deficit

`footer.tsx:36-110` is a hardcoded "Site Directory"; `footer.tsx:183-217` is the array-driven mega footer. `/fortnightly-pay-calculator/` and `/payg-withholding-tables/` appear in **both** (2 links/page). The four `*-tax-table` pages appear in **one** (1 link/page).

| Page | Sitewide inbound links |
|---|---|
| `/payg-withholding-tables/` | 465 |
| `/fortnightly-pay-calculator/` | 436 |
| `/fortnightly-tax-table/` | **226** |

That 2:1 deficit is why Google ranks the pay calculator at #22 for "fortnightly tax table" (19,000/mo, KD 2) while the purpose-built page has **zero AU organic keywords**.

Note: keyword density is *not* the cause — `/fortnightly-tax-table/` has 18 occurrences of the phrase versus 5 on each rival, and is the only one carrying it in title, description and H1.

### Work

1. Server-render the nav links, or add a crawlable HTML fallback (`<noscript>` or a static link block).
2. Add the four tax-table pages to footer Zone 1.
3. Link all 35 `/tax-on/` pages — `FOOTER_TAX_ON_SALARY` currently lists 10, and does not even match the amounts listed for `/take-home-pay-on/`.
4. Delete `CALCULATOR_CATEGORIES`.
5. Reduce `/payg-withholding-tables/` section-level duplication: `modules/guide/payg-withholding-tables.tsx:162` renders `<h2>Fortnightly Tax Table</h2>` plus a full inline withholding table, duplicating the target page's entire purpose. Same at `:158` (weekly) and `:218` (monthly). Trim to a summary + prominent link.

### Trailing-slash duplicates

Canonicals and sitemap **agree** — 210/210 sitemap URLs end in `/`, and all canonicals are built with an explicit trailing slash. The problem is at the hosting layer: `firebase.json:151-152` sets **both** `cleanUrls: true` and `trailingSlash: true`, which prescribe opposite normalisations. Separately, `firebase.json:9-13` rewrites `/tax-on-([0-9]+)/?` — a **rewrite (200), not a redirect (301)** — generating a second duplicate family.

**Required first step:** `curl -sIL` both variants against production to establish actual status codes. This was not verifiable from the codebase.

---

## 8. Phase 4 — SERP work

The pattern every winner uses, measured across 12 stable top-10 performers: **one evergreen year-free URL, updated in place, with current and prior FY tables stacked on-page under explicit year headings.** Eight of twelve have no year in the title tag at all. Per-year URLs consistently underperform.

| Page | Work |
|---|---|
| `/tax-brackets/` | Add the FY2026-27 table (currently absent entirely); stack FY2025-26 beneath; drop the year from the title; surface "australian tax rates" / "individual tax rates" / "tax thresholds" phrasings in H1/H2 — DR 8–19 pages outrank us on exact-match slugs alone; add WHM rate table and FY2027-28 (14%) table |
| `/low-income-tax-offset/` | Retitle off "LITO 2025-26"; rebuild ~11 table rows × 2 columns on the 15% bracket; correct effective threshold to $22,867; visible last-updated under H1. **Do not build `/lito-calculator/`** — zero pages in this SERP's top 10 embed a calculator |
| HECS thresholds | Promote `/news/hecs-repayment-threshold-2026-27/` (correct figures, wrong path) to evergreen `/hecs-repayment-threshold/`, year in H1 not slug. Winning shape is 300–500 words that are 60% table — AccessPay ranks #4 on 475 words while our 2,907-word omnibus sits at #40 |
| `/hecs-help-guide/` | Strip thresholds to a summary + link; fix the self-contradiction — `:55` stale alert box, and `:144,401-402,424` render $67,000 in tables adjacent to $69,528 prose. The page states two different repayments for the same salary |
| Tax-table pages | Add ATO PDF/XLSX links (currently **zero**); add `Dataset` schema; add foreign-resident and 27-pay tables; add a year selector |

---

## 9. Out of scope

- **New content.** Justified in §1.
- **Link building.** Ahrefs reports **DR 0.8 against 367 referring domains and 759 backlinks** — a ratio that normally supports DR 15–30. Something is causing those links to be valued at nothing. That needs its own investigation; more links of the same kind will not move it. It caps the ceiling on everything here.
- **Pre-existing factual bugs** (fix opportunistically when touching the file): `/award-rates/` states **three different minimum wages on one page** ($24.10, $24.95, $26.44); `modules/guide/overtime-penalty-rates-guide.tsx:199` and `modules/calculator/leave-calculator.tsx:483` cite a **32.5% marginal rate that has not existed since Stage 3**; `modules/guide/minimum-wage-history-australia.tsx:36` renders a live **"TBD"** row; a 67c/70c WFH rate conflict.

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Engine swap changes every computed figure sitewide | Regression tests on ATO worked examples before merge; diff a sample of rendered outputs |
| Wrong figures reach Google via structured data | `FAQPage` JSON-LD on the homepage, `/award-rates/`, `/annual-pay-calculator/` and `/minimum-wage-history-australia/` hardcodes stale numbers. Prioritise — Google ingests these as factual claims |
| Footer ships hardcoded stale take-home figures | `footer.tsx:16-24` has seven weekly net-pay values computed on the 16% scale, on all 212 pages. Not caught by any year-string grep — derive from the engine |
| Tax-table season is July–October | Phases 0–3 are the seasonal-critical ones; Phase 4 can follow |

---

## 11. Success criteria

1. ATO worked examples pass as automated tests; every fortnightly output is an even dollar amount.
2. Zero pages display FY2025-26 as the current year.
3. One tax engine. `australian-tax.ts` retains prior-year brackets for history only.
4. All 35 `/tax-on/` pages have >1 crawlable inbound internal link; nav links present in built HTML.
5. `/fortnightly-tax-table/` has ≥ the internal link count of `/fortnightly-pay-calculator/`.
6. `/tax-brackets/` and `/low-income-tax-offset/` carry FY2026-27 tables with FY2025-26 stacked beneath.
7. **The four tax-table pages are indexed** — non-zero impressions in GSC and present in a `site:` search. This is the primary measurable outcome of steps 1–2.
8. **`/bonus-tax-calculator/` recovers toward its previous positions** (3.1–3.4 on its head terms). Baseline for comparison: 1,057 clicks in the 28 days to 25 July, down from 1,166.
9. **Baseline to measure against:** 6,873 clicks / 663,712 impressions in the 28 days to ~25 July 2026. Re-export the same GSC comparison after each step. Ahrefs materially understates this site (~850/mo vs ~6,900 clicks/28d) — **do not use it to judge these changes.**

---

## 12. Open items for the user

- ~~GSC clicks/impressions~~ — supplied 28 July 2026, analysed in §1.
- Verification of super caps and minimum wage (§3, "Still unresolved").
- Production `curl` check on trailing-slash variants (§7).
- `/leave-calculator/` lost 62 clicks with a real position drop (6.4 → 7.3). Not yet diagnosed — worth a look after the steps above.

---

## 13. Implementation status (28 July 2026)

Branch `seo/fy2026-27-recovery`, 6 commits, **not pushed**.

| Step | State | Commit |
|---|---|---|
| Titles: brand suffix, length, stale years | **Done** | `be94347`, `4943616` |
| NAT 1006 Schedule 1 coefficients + tests | **Done** | `53259e9` |
| One engine sitewide (FY2026-27) | **Done** | `53259e9` |
| Labels: trust bar, footer, nav, OG, 404 | **Done** | `e7b0b76` |
| Indexation: footer Zone 1 + `/tax-on/` chain | **Partial** | `e7b0b76` |
| `/bonus-tax-calculator/` figures | **Done** | `8863d52` |
| Stale HECS / NMW / bracket literals | **Done** | `8863d52`, `4943616` |

**Verified against the built HTML (212 pages), all zero:** brand suffix in
titles · tautological threshold sentences · "Updated FY2025-26" · "Rates
verified 14 March 2026" · stale NMW $24.10 · "16c for each $1 over $18,200" ·
meta descriptions saying FY2025-26 · odd-dollar fortnightly withholding.
Title width 842px → 536px average, over-cap 92/95 → 4 (news only).
`npm test` 11/11. Zero new eslint errors (20 → 20 in touched files).

### Two further defects found during implementation

- **`calculateHECS` ignored its own band data**, hardcoding `$125,000` as a
  boundary. At $137,064 it returned $11,079 against the ATO's published
  $10,276.99. Now driven entirely by `HECS_HELP.bands`.
- **`calculateMedicareLevy` applied a flat 2% from the first dollar** with a
  `// Simplified` comment, overstating the levy for every low-income earner.
  Now shades in from $28,011.

### Deliberately not done

- **Navbar server-rendering.** The mega menu still emits no crawlable links.
  Unpicking framer-motion animation state is a larger change with real UI
  risk; the footer route solves the crawl problem for the seven affected
  pages. The 40+ guide links and all state links remain nav-only.
- **Super contribution caps and maximum contribution base** — still the
  unverified values from §3. `concessionalCap` is `30_000`; the repo's own
  news article says `32_500` from 1 July 2026. **Needs an ATO check.**
- **`/fringe-benefits-tax/`** — FBT runs 1 April–31 March, so its FY2025-26
  labelling is a different cycle. No verified figures for the year ending
  31 March 2027.
- **Titles bumped to 2026-27.** Stale years were *removed*, not bumped —
  matching the majority winner pattern (gap analysis §8). Revisit if the
  tax-table evidence argues for explicit FY labelling on those pages.
- **Figures in `/tax-on/` titles** (e.g. "$5,270 Tax, $43,730 Take-Home").
  Unblocked by the engine fix, but not applied.
- **Production trailing-slash check** (§7) — still outstanding.
