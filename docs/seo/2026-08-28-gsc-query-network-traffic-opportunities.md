# GSC Query-Network Analysis — Traffic Opportunities

**Date:** 2026-08-28
**Source:** Google Search Console export, 2026-03-15 → 2026-08-27 (`Pay AU Calc Data-20260828T080119Z-1-001.zip`)
**Method:** Koray query-network analysis (cluster → representative query → node coverage → cannibalisation → temporal / seasonal), run against the live route list in `calc-boiler/app/` and the built HTML in `calc-boiler/out/` (build of 21 Aug 2026).
**Status (28 Aug 2026):** Option A — P1 (`1b194de`), P2 (`cd047ab`), P8 (`38988ea`) — and Option B — P6 `/commission-tax-calculator/` (`d572612`), P3 `/salary-package-calculator/` (`57e8e6d`), P5 three Centrelink calculators + hub refresh (see git log) — are committed on `main`, not yet pushed or deployed. Centrelink figures verified at Services Australia on 28 Aug 2026 (`lib/constants/centrelink-income-test.ts`, 9 tests). Remaining: P4, P7, P9–P12. Known gaps: the merged bonus sections still carry FY2025-26 super-cap labels; the Centrelink hub's assets-test and deeming figures were not re-verified.

**Companion docs:** `docs/seo/2026-07-28-keyword-and-content-gap-analysis.md` (§8 do-not-build list still stands), `raw-topical-map.md`, `source-context.md`.

---

## 1. The finding in one paragraph

Traffic stopped growing in June. The three 28-day windows since the EOFY spike are 6,214 → 6,096 → 5,660 clicks on flat impressions (~590k). Positions are fine (8.3 average) — the site is **seen 2 million times and clicked 19,336 times (0.97% CTR)**. The query network shows exactly where those impressions die: (a) a hub page catches number-specific queries whose spoke pages exist but are not linked from it; (b) six pairs of pages compete for one representative query, so neither ranks; (c) three real entity-attributes have demand and no node at all (salary package ↔ base salary, Centrelink payment types, commission tax). None of this needs new authority or long content. It is node completion, node consolidation, and contextual-vector linking.

---

## 2. Baseline and data caveats

| Metric | Value |
|---|---|
| Clicks / impressions / CTR / position (5.5 months) | 19,336 / 2,003,435 / 0.97% / 8.9 |
| Last 28 days (31 Jul → 27 Aug) | 5,660 / 582,553 / 0.97% / 8.35 |
| Prior 28 days | 6,096 / 600,998 / 1.01% / 8.05 |
| 28 days before that (EOFY peak) | 6,214 / 588,331 / 1.06% / 8.32 |
| Mobile share of clicks | 60% |
| Australia share of clicks | 95% |

Weekly clicks: 2,073 (w/c 28 Jun peak) → 1,142 (26 Jul) → 1,775 (16 Aug) → 1,095 (23 Aug, 5-day partial week). The June doubling was seasonal, not structural.

**Caveat 1 — the query file is a sample.** `by_query.csv` holds 4,676 clicks / 415,817 impressions — **24% of clicks, 21% of impressions**. Google anonymises the rest (long-tail number queries are exactly what gets hidden). Query-level figures below are therefore floors; page-level figures (`by_page.csv`) are complete. Where a query family shows N impressions, expect ~4× that in reality.

**Caveat 2 — Ahrefs API units are at 0.** No search volumes or KD could be pulled for the new-node candidates. Prioritisation below uses GSC impressions (real demand we already trigger) instead. Re-check volumes when units reset.

**Caveat 3 — `out/` is dated 21 Aug.** Commit `8f494f9` (homepage + income-tax-calculator rebuild) may post-date it. Head-term positions are quoted as measured, but that rebuild is too recent to have moved them.

---

## 3. Where the 2 million impressions go (page level, complete data)

| Page | Impr | Clicks | CTR | Pos | What is happening |
|---|---:|---:|---:|---:|---|
| /hourly-to-annual-salary-calculator/ | 260,176 | 1,460 | 0.56% | 7.2 | Catches every "$X an hour is how much a year" query; spoke pages hold only 10k impr |
| /fortnightly-pay-calculator/ | 112,331 | 1,297 | 1.15% | 5.8 | Healthy |
| / | 70,247 | 373 | 0.53% | 12.4 | Head terms; rebuilt 27 Aug, too early to judge |
| /bonus-tax-calculator/ | 57,085 | 4,487 | 7.86% | 5.9 | Best node on the site; 23% of all clicks |
| /low-income-tax-offset/ | 54,833 | 143 | 0.26% | 7.0 | Zero-click attribute queries (answered in SERP) |
| /gross-pay-calculator/ | 51,834 | 559 | 1.08% | 9.3 | Healthy |
| /weekly-pay-calculator/ | 49,767 | 226 | 0.45% | 6.8 | Catches "$X a week" amount queries; page shows no amounts |
| /leave-calculator/ | 42,252 | 510 | 1.21% | 7.9 | Healthy |
| /medicare-levy/ | 41,212 | 50 | **0.12%** | 11.5 | Worst CTR on the site; "medicare levy rate 2025-26 2%" zero-click; no calculator ranking |
| /superannuation-calculator/ | 39,616 | 94 | 0.24% | 8.0 | Catches "salary package / plus super" queries it does not answer |
| /hecs-help-calculator/ | 34,496 | 384 | 1.11% | 6.8 | Fine — but see next row |
| /hecs-help-guide/ | 32,736 | 60 | **0.18%** | 11.8 | Takes half the HECS impressions at 1/6 the CTR |
| /award-rates/ | 28,119 | 142 | 0.51% | 11.2 | "find my award pay rate" — Fair Work owns it (§8) |
| /income-tax-calculator/ | 26,022 | 110 | 0.42% | 27.1 | Head term; rebuilt 27 Aug |
| /working-holiday-tax/ | 22,552 | 58 | 0.26% | 9.7 | "ato working holiday maker tax rates 2025 official" — same AI-fan-out shape as §8's super-rate queries |
| /tax-brackets/ | 12,005 | 5 | **0.04%** | 41.2 | Core node G1 (★★★★★) ranking nowhere; `/tax-on/100000/` outranks it (pos 3) for "tax brackets australia" |

Programmatic clusters (complete data):

| Cluster | Pages | Impr | Clicks | CTR | Pos |
|---|---:|---:|---:|---:|---:|
| /tax-on/* | 41 | 217,335 | 832 | 0.38% | 7.1 |
| /take-home-pay-on/* | 41 | 171,838 | 996 | 0.58% | 6.2 |
| /salary-to-hourly/* | 21 | 126,907 | 1,039 | 0.82% | 5.0 |
| /hourly-to-salary/* | 30 | 10,004 | 30 | 0.30% | 6.9 |
| /news/* | 24 | 5,495 | 19 | 0.35% | 11.1 |

---

## 4. Opportunities, ranked

Ranking = (impressions we already trigger) × (gap between current CTR/position and what the same node type achieves elsewhere on the site) ÷ effort. Effects are estimates from the site's own conversion rates, not Ahrefs.

### P1. Complete the hourly-rate node and wire the hub to its spokes

**Evidence.** The hub (`/hourly-to-annual-salary-calculator/`) holds 260k impressions at 0.56%. Its visible queries are number-specific: "36 an hour is how much a year" (207i, 0 clicks), "26.44 an hour…" (181i), "48 per hour annual salary" (173i), "60 per hour annual salary" (220i). The 30 `/hourly-to-salary/[rate]/` spokes exist since late July but hold 10k impressions between them. **The built hub links to only 2 of the 30 spokes** (`grep href="/hourly-to-salary/` on `out/hourly-to-annual-salary-calculator/index.html` → 2). Google has no contextual vector from the ranking page to the exact-match page, so it keeps serving the hub.

**Demand with no page (visible impressions):** $20/hr 517i, $26.44 309i, $58 195i, $37.50 188i, $90 187i, $62 138i, $10 124i, $85 123i, $49 117i, $15 116i, $36.50 107i, $41 99i, $34.50 92i, $43 91i, $29.45 85i. **38% of visible rate impressions (9,066 of 23,948) have no page.** Half-dollar and cent-level rates ($26.44, $37.50, $29.45) are award/NMW rates people are paid — Koray's synthetic-query rule says every whole-dollar rate from $20 to $100 is a valid query once "$36 an hour" is.

**Action.**
1. Extend `ALL_RATES` to every whole dollar $20–$100 (81 pages) plus the half-dollar band $20.50–$45.50 and the current NMW/award hourly rates from `lib/constants/junior-rates.ts`, `hospitality-award.ts`, `schads-award.ts`, `australian-tax.ts`.
2. On the hub, add a rate table section: one row per rate, anchor text = the representative query ("$36 an hour is how much a year"), linking to the spoke. Same for `/salary-to-hourly/` amounts (the hub links to those already via the 20-row table; check).
3. Cross-link each spoke to its neighbours (±$1, ±$5) and to the matching `/take-home-pay-on/` annual page.

**Expected.** The `/salary-to-hourly/*` cluster converts at 0.82% at pos 5.0 against the hub's 0.56%. Moving the rate queries onto spokes at that rate is roughly **+100–150 clicks per 28 days** on existing impressions, before the new rates add impressions of their own. Cost: template already exists; constants edit + one hub section.

### P2. Consolidate HECS into one calculator-first node

**Evidence.** Four pages plus four news posts share one query network: calculator 384c/34,496i (1.11%, pos 6.8); guide 60c/32,736i (0.18%, pos 11.8); `/stsl-on-payslip/` 6c/3,339i; `/hecs-repayment-threshold/` 0c/634i. "hecs repayment threshold 2026" splits 158/59 across two pages. Both guide and calculator receive 252 sitewide inbound links, so Google sees no hierarchy. The guide's visible queries are calculator/threshold queries ("hecs brackets", "hecs repayment threshold", "help tax table") — it has no representative query of its own.

**Action.** Merge the guide's prose under the calculator (calculator first, thresholds table, "STSL on your payslip" section, FAQ); 301 `/hecs-help-guide/` and `/hecs-repayment-threshold/` → `/hecs-help-calculator/`. Keep `/stsl-on-payslip/` (distinct attribute: the payslip label) and `/extra-super-vs-hecs-repayment/` (3.35% CTR — a genuine decision node). Retire the four HECS news posts into the calculator's "what changed" section.

**Expected.** 32.7k impressions/5.5 months ≈ 6k/28d currently converting at 0.18%; at the calculator's 1.1% that is **~+55 clicks/28d**, plus whatever consolidation does to the calculator's position (6.8 → top 5 is realistic once the split ends). Gap doc §11.4 asked "consolidate or split?" — GSC answers consolidate.

### P3. New node: Salary package ↔ base salary (super-inclusive) calculator

**Evidence.** A hidden family: 281 visible queries / 2,217 impressions / pos 23 / 5 clicks. "how to calculate superannuation from total package" (299i, pos 18), "salary including super" (107i), "salary package calculator australia" (90i, pos 73), "how to calculate base salary from package including super" (43i), "75k including super" (31i), "whats 90 plus super" (30i), "80k plus super salary calculator" (26i). They land on `/superannuation-calculator/` (592i), `/` (323i), `/annual-pay-calculator/` (128i) — none answers them. This is a core entity-attribute (Gross Pay → package vs base) that the raw topical map never listed, and it is the reason the super calculator has 40k impressions at 0.24%.

**Action.** Build `/salary-package-calculator/` : inputs = package or base, toggle "includes super / plus super", SG 12% → base, super, take-home (weekly/fortnightly/monthly). Two tables: "$X including super → base salary" and "$X plus super → total package" for $50k–$200k. FAQ H2s = the question queries verbatim. Link from the super calculator, gross-pay calculator, every `/take-home-pay-on/` page ("Is your $X a package or base?"), and the pay-rise calculator.

**Expected.** Visible 2.2k impressions ≈ 9k real, currently at pos 23. An exact node should sit top 10 (no competitor has a package calculator that also does take-home). **+40–80 clicks/28d**, and it fixes the super calculator's intent mismatch.

### P4. Make `/medicare-levy/` a calculator that ranks for "medicare levy calculator"

**Evidence.** 41k impressions, 50 clicks. Visible queries are all "medicare levy rate 2025-26 2%" variants (zero-click, answered inline — same shape §8 flagged for the super rate). The one intent with clicks in it, "medicare levy calculator" (gap doc §11.8: 6,300 vol, KD 4), is where we are absent. The title already says "Calculator"; the page does not rank as one.

**Action.** Calculator-first rebuild: income → levy, low-income reduction (singles/families with the 2025-26 thresholds, which lag a year — see memory), MLS tier with/without cover, family threshold per child. Example table $30k–$200k. Link it from every `/tax-on/` page's Medicare line (82 contextual links with anchor "Medicare levy on $X"). Already in the roadmap (§10 "revive dormant pages"); GSC moves it to the top of that list because it is the largest wasted-impression pool on the site.

**Expected.** Cannot be estimated from GSC (we do not trigger the calculator query yet). KD 4 and an existing trusted URL make top 5 plausible.

### P5. Centrelink payment-type sub-nodes (border decision — see §7)

**Evidence.** One page, `/centrelink-income-test/`, holds 42k impressions / 430 clicks (#8 page) across at least eight payment types. Visible sub-families: generic "centrelink payment calculator" 6,435i (pos 11.7); **Austudy/Youth Allowance income test 2,455i at pos 7.5 with 0 clicks** ("services australia austudy income test taper rate 50 cents 60 cents" 317i+269i); JobSeeker 1,262i; Age Pension 221i at pos 32. "centrelink payment calculator when working" converts at 5.5% — the pay↔payment bridge is the site's angle and Google already trusts it.

Also: "work bonus calculator" / "work bonus tax" (Age Pension Work Bonus) lands on `/bonus-tax-calculator/` — a wrong-node signal.

**Action.** Keep the current page as hub. Add three spokes: `/jobseeker-income-test-calculator/`, `/youth-allowance-austudy-income-test-calculator/` (the 50c/60c taper is the exact query), `/age-pension-income-test-calculator/` (with Work Bonus). Each: calculator + taper table + "how much can I earn before payment stops" H2.

**Expected.** Hub already at 1.0% on generic queries; spokes at pos 7 for taper queries with 0% CTR only need a matching title. **+60–120 clicks/28d.** This expands the contextual border slightly (see §7).

### P6. New node: Commission tax calculator (cheapest win)

**Evidence.** 88 visible queries / 610 impressions / **14.3% CTR** / pos 8.2, landing on the bonus calculator. "commission tax calculator" 33c/86i at 38% CTR pos 4.3. The family converts because the bonus page's Schedule 5 engine is the right answer; a dedicated node would rank higher and stop diluting the bonus page's representative query.

**Action.** `/commission-tax-calculator/` reusing the Schedule 5 module (method A/B, pay-period toggle). Link from bonus, pay-rise, second-job. One day of work.

### P7. Per-week / per-fortnight amount tables on the frequency pages (one node, not 100 pages)

**Evidence.** 771 visible queries / 2,692 impressions / pos 7.9 / 6 clicks: "3000 a fortnight is how much a year" (41i), "tax on 1700 per fortnight" (52i), "1500 per week annual salary" (28i), "$100k after tax australia weekly salary" (267i on `/`). They land on `/weekly-pay-calculator/` (50k impr, 0.45%), `/fortnightly-pay-calculator/`, and the hourly hub. Gap doc §8 says per-amount fortnight pages have zero Ahrefs volume — GSC shows the demand Ahrefs cannot see, but it is spread thin, so the Koray answer is one page that covers every variant (the aussalarycalculator pattern), not programmatic pages.

**Action.** On `/weekly-pay-calculator/` and `/fortnightly-pay-calculator/`: add a "$X a week/fortnight → annual, tax, take-home" table ($500–$5,000 in $100 steps) with each row's figures visible in HTML (crawlable, not client-rendered), and an H2 per top question. Titles keep the frequency word first.

### P8. Node consolidations (six more pairs)

| Pair | Data | Action |
|---|---|---|
| `/bonus-tax-guide/` vs `/bonus-tax-calculator/` | guide 57c/9,116i 0.63% pos 15; splits "australia bonus tax calculator", "does bonus pay get taxed" (191i, pos 35) | Fold guide into calculator; 301. Protects the #1 page |
| `/contractor-vs-employee/` + `/contractor-vs-employee-calculator/` + `/contractor-pay-calculator/` | all pos 60–80 for "contractor pay calculator" (254i split 139/81); 34c/10k, 87c/5k, 310c/21.5k | Merge the two "vs" pages into one decision node; make `/contractor-pay-calculator/` the sole target for pay/rate/wage-calculator queries |
| `/redundancy-pay-guide/` vs `/redundancy-pay-calculator/` | both pos 40–60 for "redundancy calculator"; guide 42c/6.4k pos 19.7 | Fold guide into calculator (NES table + ETP tax section); 301 |
| `/salary-sacrifice-guide/` (pos 51) vs `/salary-sacrifice-calculator/` (pos 17; "salary sacrifice calculator" pos 71) | six salary-sacrifice/FBT pages, 154 clicks on 37k impressions | Fold guide into calculator. Keep packaging, novated, FBT as distinct attributes |
| `/annual-pay-calculator/` vs `/` | 30c/14k pos 22.7; splits "salary calculator" 690/249 with `/`; no representative query of its own | Retarget to "annual salary calculator / yearly salary calculator" (365i+315i+433i, pos 16–17 — currently landing on the hourly hub) or merge into `/` |
| `/overtime-pay-calculator/` vs `/overtime-penalty-rates-guide/` | both pos 50–69 for "overtime pay" (148/145) | Keep both (rates vs calculation are distinct attributes); fix anchors: guide → calculator with "overtime pay calculator", calculator → guide with "penalty rates" only |

Not recommended now: merging `/tax-on/X` with `/take-home-pay-on/X`. Every amount query splits across both (e.g. "tax on 100k australia" 253/169), but both sit at pos 6–7 and together they are 389k impressions. The 0.38–0.58% CTR at position 6 means an AI overview is answering the number; merging would trade two SERP slots for one without fixing that. Differentiate snippets instead (tax-on = "$X tax, Y% effective"; take-home = "$X per fortnight after tax") and revisit after P1–P7.

### P9. FIFO pay calculator

**Evidence.** "fifo" occupation family 5,780 visible impressions / 47 clicks; "fifo pay calculator" 256i at 3.9% (pos 10); "average fifo salary", "how much does a fifo worker make" 0 clicks at pos 7–19. The guide (`/mining-fifo-pay-guide/`, 360 clicks, #12 page) is catching calculator and benchmark intent. Roster-maths queries ("2:1 roster") are tiny (49i) — do not build a roster tool; build hourly × swing + allowances → annual + take-home, with a salary-by-role table.

**Action.** Calculator section at the top of the mining guide (or `/fifo-pay-calculator/` linked from it), title carrying "FIFO Pay Calculator".

### P10. Rebuild the `/tax-brackets/` core node

**Evidence.** 12k impressions, 5 clicks, pos 41; "australia tax brackets" pos 48.6. `/tax-on/100000/` ranks pos 3 for "tax brackets australia" — Google prefers our amount page over our bracket page. 252 sitewide inbound links have not helped, so the page itself is the problem. Node G1 was ★★★★★ in the raw map.

**Action.** Same completeness pattern as the 27 Aug homepage rebuild: both FY tables (2025-26 being lodged, 2026-27 being paid), effective-rate table $30k–$200k, "which bracket am I in" mini-calculator, worked examples, 15-question FAQ, `Dataset` schema. Add a contextual link from all 82 amount pages' bracket line with anchor "2026-27 tax brackets". Target is top 15 (ATO, Canstar, H&R Block hold the top) — still 10× current clicks.

### P11. Pay-periods / fortnights-in-a-year node

**Evidence.** "how many fortnights in a financial year" 301i pos 10 → lands on the fortnightly calculator; "fortnight per year" 197i; "how many weeks in financial year 2025 26" → `/tax-calendar/`. Gap doc §11.3 lists "fortnights in a year" (2,200, KD 0) and "financial year australia" (5,000, KD 1).

**Action.** One page, `/pay-periods-2026-27/` (or fold into `/tax-calendar/`): weeks/fortnights/months in FY2026-27, 27-fortnight years, pay-date table, link to each frequency calculator. Cheap. The larger school/public-holiday cluster (655k) remains the strategic call from §11.3 — not decided here.

### P12. Temporal labels: keep both financial years on every tax page

**Evidence.** Queries containing "2025" carry 36,615 visible impressions; "2026" 11,960; "2025-26" 24,342 vs "2026-27" 317. Searchers use last year's label — they are lodging 2025-26 returns now. Built pages carry 2026-27 heavily (HECS calculator 46× vs 2025-26 1×; bonus 28 vs 2; super 36 vs 2). Titles were swept to 2026-27 in July.

**Action.** Every tax page keeps a visible "2025-26 (return you lodge now) / 2026-27 (pay you receive now)" pair in the H1 area and the first table — both attribute values, not one. No title changes needed.

---

## 5. Additions to the topical map (new nodes)

| Node | Section | Representative query | Evidence |
|---|---|---|---|
| Salary package calculator (base ↔ package ↔ take-home) | Core | "salary package calculator" | P3 |
| Commission tax calculator | Core | "commission tax calculator" | P6 |
| JobSeeker income test calculator | Core (border) | "jobseeker payment calculator" | P5 |
| Youth Allowance / Austudy income test calculator | Core (border) | "austudy income test" | P5 |
| Age Pension income test + Work Bonus calculator | Core (border) | "age pension income test calculator" | P5 |
| FIFO pay calculator | Core | "fifo pay calculator" | P9 |
| Pay periods in FY2026-27 | Outer | "how many fortnights in a financial year" | P11 |
| Hourly-rate spokes $20–$100 + award rates | Programmatic | "$N an hour is how much a year" | P1 |
| Pro-rata salary calculator | Core (small) | "pro rata salary calculator" | 320i, pos 29, no page; build after the above |
| Apprentice wage calculator | Core (small) | "apprentice wage calculator" | ~340i, pos 10–14; blocked until apprentice rates are verified (constants `_UNVERIFIED`) |

Question-format H2s to add to existing nodes (each is a query at pos 18–35 with 190–300 impressions and no answer on the page): "how much do I cost my employer" → employer-cost calculator; "does bonus pay get taxed" → bonus calculator; "what are award rates" → award-rates; "how to calculate superannuation from total package" → P3.

---

## 6. Zero-click attribute pages — do not chase

These rank pos 7–10 for attribute-value queries that Google answers inline (and, per §8, are partly AI-Overview fan-out): `/low-income-tax-offset/` 55k impr / 0.26%; `/medicare-levy/` rate queries; `/super-guarantee-rate-history/` 18.5k / 0.48%; `/working-holiday-tax/` 22.5k / 0.26% ("ato working holiday maker tax rates 2025 official"). Their job is to be the trusted answer and to pass contextual relevance: each should link to the calculator that applies the attribute ("see what LITO does to $45,000" → `/take-home-pay-on/45000/`; "WHM tax on $X" → a working-holiday take-home table). No title work.

---

## 7. Decisions needed

1. **Centrelink sub-cluster (P5)** — this widens the contextual border from "your pay" to "your pay and your payment". The hub already earns 430 clicks and Google trusts us on the taper rates. Recommendation: **yes**, three spokes only, no benefit-eligibility content.
2. **Order of work** — Option A: P1 + P2 + P8 first (template extension and merges; engineering only, no new content; compounding on impressions we already have). Option B: P3 + P5 + P6 first (new nodes). Recommendation: **A, then B.** A is faster and it de-risks B, because new nodes launched into a cannibalised cluster inherit the split.

---

## 8. Seasonal map (Koray: publish before the event)

| Date | Event | Node that should be ready 4–6 weeks before |
|---|---|---|
| 31 Oct 2026 | Self-lodgement deadline | `/tax-return-calculator/` (131k vol, KD 31, pos 45 — largest dormant asset; not addressed above because it needs a full tool, not a fix) |
| 1 Dec 2026 | FWCFB 75 junior-rate phase-in (retail/fast food/pharmacy) | `/junior-pay-rates/` (17k impr, 0.40%) with a before/after table |
| Dec 2026 | Christmas / public-holiday penalty rates | `/overtime-penalty-rates-guide/` with dated public-holiday rate table |
| 1 Jan 2027 | Centrelink indexation | P5 spokes |
| 20 Mar 2027 | Pension indexation | P5 age-pension spoke |
| 1 Jul 2027 | FY2027-28 | All (the June doubling repeats) |

The news cluster (24 pages, 19 clicks, 5.5k impressions, pos 11) is not the vehicle for this — thin dated posts at pos 7 convert at 0.35%. Put the dated change inside the calculator node instead.

---

## 9. Money side-note (researched 28 Aug 2026; details in memory)

The user's goal for this round is traffic; this is recorded so it is not re-researched.

- **No cash affiliate programs exist for Australian tax agents** (Etax, H&R Block AU, Hnry all run client-only referral credits). Software affiliates exist (MYOB on Impact: $115–$185 per subscription; Xero/QuickBooks unverified) — relevant only to `/employer-cost-calculator/` and contractor pages.
- **Mediavine Journey** now accepts sites at **1,000 sessions/month** (since 15 Jan 2026), 70% share — but its policies **prohibit forced popunders**, which are 94% of current revenue. At today's ~14k pageviews a display-only setup is unlikely to beat the popunder; it becomes the right move once traffic roughly doubles. **Ezoic** now requires 250k monthly users. **Monumetric** 10k pv, $99 setup, display-exclusive.
- **paycalculator.com.au** (the leader) runs Publift Fuse (7 slots, 500k pv minimum) and nothing else; **paycal.com.au** runs AdSense + Ko-fi.
- Super/insurance affiliate links carry ASIC "dealing by arranging" risk — keep those pages factual; tax-agent and software links do not.

So: the traffic work above is also the money work. Every extra click today is a popunder impression; at ~2× traffic the ad-network switch becomes available.

---

## 10. Analysis artefacts

Scripts are in `docs/seo/scripts/gsc-query-network/` (`analyze.py`, `analyze2.py`, README); rerun against the next GSC export with the same family regexes to measure movement. Baseline to beat: **5,660 clicks / 582,553 impressions / 0.97% / pos 8.35 in the 28 days to 27 Aug 2026.**
