# Keyword & Content Gap Analysis

**Date:** 28 July 2026
**Site:** pay-calculator-australia.com (~212 built URLs, Ahrefs DR 0.8)
**Data:** GSC Performance export 28 Jul 2026 (28d vs prior 28d, Web, all countries) · Ahrefs AU · live SERPs and competitor pages via Firecrawl
**Companion doc:** `docs/superpowers/specs/2026-07-28-fy2026-27-migration-and-serp-recovery-design.md` (the correctness/migration work)

---

## 1. The finding in one paragraph

There is a real keyword gap — **240 keywords worth ≈2,110,000 monthly AU searches** where a competitor ranks top-20 and we do not (§11). But it is not the first thing to fix, because the site's existing footprint is already large and almost entirely unconverted: **698,124 impressions in 28 days producing 6,894 clicks, a 0.99% CTR**, with **69% of impressions sitting on pages below 1%**. Three findings reorder the work. **Every page shipped in the last wave is unindexed.** **Eight pages we already own rank for nothing on their own target term**, including `medicare levy calculator` at KD 4 and `monthly tax table` at KD 3. And **a DR 0.1 competitor ranks #4 for `pay calculator` (301,000 volume) on a single 1,430-word page** — so the head terms we are absent from are gated by page-level completeness and freshness, not authority.

Ranked by recoverable clicks: fix click-through and freshness → fix indexation → revive the pages that already exist → build a small number of genuinely uncontested tools → then attack the head terms and new clusters. Several obvious-looking targets are traps and are listed explicitly in §8 so nobody spends a week on them.

---

## 2. Baseline

| Metric | 28 days to ~25 Jul 2026 | Prior 28 days |
|---|---|---|
| Clicks | 6,894 | 4,958 (+38.9%) |
| Impressions | 698,124 | 507,603 (+37.5%) |
| Sitewide CTR | **0.99%** | 0.98% |
| URLs with ≥1 impression | 196 of ~212 | — |

**Where the traffic is.** Top pages by clicks:

| Page | Clicks | Impressions | CTR | Pos |
|---|---:|---:|---:|---:|
| /bonus-tax-calculator/ | 1,057 | 16,423 | **6.44%** | 5.4 |
| /pay-rise-calculator/ | 531 | 28,084 | 1.89% | 5.2 |
| /hourly-to-annual-salary-calculator/ | 502 | **77,762** | **0.65%** | 6.6 |
| /fortnightly-pay-calculator/ | 461 | 38,198 | 1.21% | 5.5 |
| /second-job-tax-calculator/ | 316 | 6,621 | **4.77%** | 6.2 |
| /gross-pay-calculator/ | 221 | 17,058 | 1.30% | 7.0 |
| /hecs-help-calculator/ | 178 | 13,035 | 1.37% | 5.5 |
| /leave-calculator/ | 161 | 8,857 | 1.82% | 7.3 |
| **/ (homepage)** | 159 | 22,389 | 0.71% | 7.2 |
| /mining-fifo-pay-guide/ | 151 | 15,585 | 0.97% | 7.2 |
| /backpay-calculator/ | 112 | 1,674 | **6.69%** | 4.7 |

Two things follow. **The homepage is only 3.2% of impressions** — this is a long-tail site, not a head-term site. And **the highest-CTR pages are narrow, unglamorous tools** — backpay 6.69%, bonus 6.44%, second-job 4.77%. That is the model that works here, and it is worth protecting deliberately.

---

## 3. Gap A — click-through suppression (largest recoverable pool)

**117 pages with ≥500 impressions convert below 1%: 479,577 impressions producing 2,661 clicks.** That is 69% of all site impressions.

**54 queries have ≥100 impressions and exactly zero clicks — 9,464 impressions, no traffic.**

### A1. Every title on the site is truncated

12 of 12 pages measured run **773–904px against Google's ~600px cap**. Median overshoot ~260px, so roughly 45% of every title never renders. The trailing ` | Pay Calculator Australia` costs **230–250px, is always cut, and Google appends the brand itself anyway.**

| Page | px | What users actually see |
|---|---:|---|
| /award-rates/ | 904 | `…Industry & Cl…` |
| /tax-on/50000/ | 870 | `…Take-Home Pay (20…` |
| /working-holiday-tax/ | 867 | `…417 & 462 Visa Tax…` |
| /hecs-help-guide/ | 863 | `…Marginal System Expl…` |
| /superannuation-calculator/ | 860 | `…SG at 12% (202…` |
| /low-income-tax-offset/ | 859 | `…Tax Offset? (Calcu…` |
| /weekly-pay-calculator/ | 875 | `…Per Week (2…` |

**9 of 10 also carry a stale financial year** in the title or description. Competitors at DR 0–31 are outranking us while advertising "2026-27".

### A2. What the impressions are actually made of

Classification of ~92,800 impressions across eight high-volume pages:

| Class | Share | Recoverable? |
|---|---:|---|
| (a) SERP answers it inline — AI Overview / snippet | **30%** | No. Structural. |
| (b) Winnable by title & snippet rewrite | **30%** | **Yes — do this first** |
| (c) Rich-result gap | 2% | **No gap exists** — see below |
| (d) Genuinely ranked too low | 15% | Only via ranking work |
| (e) Intent mismatch — wrong product for the query | **23%** | Only via new content |

**Class (c) is empty and that matters.** We already ship `FAQPage`, `HowTo`, `WebApplication`, `Article` and `Legislation` markup. **No competitor above us in any of ten SERPs earns a rich result either** — Google withdrew FAQPage/HowTo rich results for non-government, non-health sites in 2023. That markup does nothing for SERP appearance. It still matters for AI-Overview comprehension (§3.4), which is a different mechanism.

**Class (e) is the trap inside this gap.** `/superannuation-calculator/` — **17,160 impressions, 51 clicks, 0.30%** — is an *employer SG contribution* calculator competing in a SERP where every result above it is a *retirement projection* tool ("How much super do you need to retire?"). No title fixes that. Either build the projection tool or stop counting those impressions as opportunity.

**Estimated value of the class (b) work:** ~28,000 impressions currently at ~0.4%, moved to a par 2.5–3.5% for positions 6–8 → **+600 to +850 clicks per 28 days**, against 347 total on that page set today. A 3–4× lift from title tags alone.

### A3. Priority rewrites

Global rules: **delete the ` | Pay Calculator Australia` suffix everywhere**; **bump every `2025-26` to `2026-27`**; **lead with the answer, not the tool name**.

| Page | Current → Proposed |
|---|---|
| /take-home-pay-calculator/ | 820px → `Take-Home Pay Calculator Australia 2026-27` (~390px) |
| /weekly-pay-calculator/ | 875px → `Weekly Pay Calculator 2026-27 — Your Net Pay Per Week` (~490px) |
| /tax-on/50000/ | 870px → `Tax on $50,000 Australia 2026-27: $5,270 Tax, $43,730 Take-Home` |
| /superannuation-calculator/ | 860px → `Super Guarantee Calculator — 12% SG on Your Salary (2026-27)` |
| /low-income-tax-offset/ | 859px → `LITO 2026-27: Work Out Your Low Income Tax Offset ($700 Max)` |
| /working-holiday-tax/ | 867px → `Working Holiday Tax Rate 2026-27: 15% to $45,000 (417 & 462)` |
| /award-rates/ | 904px → `Award Rates 2026-27: Minimum Pay by Industry & Classification` |
| /hecs-help-guide/ | 863px → `HECS Repayment 2026-27: Thresholds, Rates & What You'll Pay` |
| / (homepage) | 668px → `Pay Calculator Australia 2026-27 — Take-Home Pay After Tax` |

The `/tax-on/` pattern — putting the actual dollar figures in the title — should be applied across all 35 `/tax-on/*` and 35 `/take-home-pay-on/*` pages. Against an AI Overview that has already stated a number, only a listing showing the number competes. **Note the figures above are the corrected FY2026-27 values** (see §3.5).

### A4. FAQ answers are invisible to crawlers

**94 modules use the Radix accordion**, whose closed content unmounts — so FAQ answers are absent from rendered HTML sitewide. Protection is uneven:

| Page | FAQPage JSON-LD | Answers readable? |
|---|---|---|
| /fortnightly-tax-table/ | present, 4 answers | via structured data only |
| /tax-on/50000/ | present, 2 answers | via structured data only |
| **/salary-to-hourly/80000/** | **absent** | **nowhere — fully invisible** |

The programmatic `/salary-to-hourly/` family is the acute case. This is the likeliest reason DR-0 `salaryadviser.com` is cited in AI Overviews where we are not — competitors put answer text on the page.

### A5. Structured data is feeding Google wrong numbers

`/tax-on/50000/` tells Google, in `FAQPage` markup:

> "On $50,000, you pay **$5,538** in income tax (13.1% effective rate)"

That is the FY2025-26 computation. The correct FY2026-27 figure is **$5,270**. **35 URLs, wrong by $268, in the format Google trusts most.** Same defect in `/award-rates/` JSON-LD, which publishes `$24.10` and `$915.91` as the current minimum wage — figures that were wrong even for FY2025-26 (see §7.2).

---

## 4. Gap B — indexation

**All seven genuinely-new Wave 13 URLs have zero impressions in 28 days:**

`/weekly-tax-table/` · `/fortnightly-tax-table/` · `/monthly-tax-table/` · `/schedule-5-tax-table/` · `/payslip-generator/` · `/ytd-income-calculator/` · `/stsl-on-payslip/`

A `site:` search confirms it — they appear only as footer link text on other pages. They are technically indexable (200, self-canonical, `robots: index, follow`, in sitemap). They are simply not indexed, three weeks after launch.

**Cause** (from the companion doc): the mega menu is `"use client"` inside a framer-motion `AnimatePresence` and emits **zero crawlable links**; only five nav links render server-side. The tax-table pages then receive footer links from one zone where their competitors receive two — 226 sitewide links versus 436 and 465.

**Cost right now.** The tax-table season runs July–October and is live: `/payg-withholding-tables/` went **13 → 109 clicks**, impressions **3,326 → 6,157**, position 11.9 → 8.6. The hub is absorbing demand the dedicated pages should own. Separately, wagecalculator's `/payslip-generator` ranks **#1** for "australian payslip generator"; ours is unindexed.

---

## 5. Gap C — tools we don't have (highest ROI of the "build" items)

Queries with clear calculator intent where we serve a guide.

### C1. Zone tax offset calculator — build this first

The cleanest opportunity found anywhere in this research.

- `zone offset calculator` — **440 impressions, 1 click, position 7.3**
- KD **0** · CPC **$1.20** · **zero SERP features — no AI Overview, no snippet, no PAA**
- Top-10 competitors include a **DR-2 page that is just a list of links to the ATO** (#4) and a **DR-1 static `.htm` file** (#9)
- The ATO's own tool at #1 self-describes as taking **5–20 minutes**
- **Not one instant calculator exists in the top 10**
- The maths is trivial and fully published: Zone A $338, Zone B $57, Special Area $1,173, Overseas forces $338, plus 50%/20%/50% of dependant offset amounts

We already have `/zone-tax-offset/` ranking at 7.3 with no calculator. Add one.

### C2. SAPTO — the best unclaimed keyword asset

| Keyword | Vol | KD | CPC |
|---|---:|---:|---:|
| **sapto calculator** | 500 | **0** | **$17.00** |
| sapto | 2,200 | 1 | $0.01 |
| sapto eligibility | 1,400 | 0 | $0.02 |
| sapto threshold | 400 | 0 | — |
| what is sapto | 300 | 3 | $0.09 |

~4,800 combined at KD 0–3. `sapto calculator` has **no AI Overview** and traffic potential 1,200. That **$17.00 CPC is 17× the commercial signal** of anything else surveyed. We have no SAPTO page — only a passing mention on `/low-income-tax-offset/`.

Adjacent, same pattern: `low and middle income tax offset` (2,200, KD 7, **CPC $11.00** — pure historical-lookup demand since LMITO is abolished, so cheap to satisfy definitively), `small business income tax offset` (1,000, KD 2), `spouse contribution tax offset` (500, KD 1), `beneficiary tax offset` (250, KD 0).

### C3. LITO calculator

`low income tax offset calculator` — 262 impressions, 3 clicks, position 8.5, KD 11. The #3 result (`atotaxcalculator.com.au`) has a heading literally titled "LITO Calculator" **with no calculator under it**, and its body text is stamped 2023. Its CPS of 1.56 means searchers click more than one and a half results — nobody is satisfied. Cheap to add to the existing page; expect the AI Overview on the head term to cap it.

### C4. Work hours / timesheet calculator

We have nothing for hours-worked intent. `working hours calculator` is 800 vol; wagecalculator's `/work-hours-calculator` is their **#2 non-homepage asset at 217/mo**. Their build: 5-row multi-shift timesheet, break handling, overnight shifts, casual loading toggle, overtime multipliers, localStorage persistence, printable summary.

### C5. Other tool gaps, ranked by evidence

| Tool | Signal | Action |
|---|---|---|
| CGT calculator | `capital gains tax calculator` **11,000 vol**; wagecalculator at position **28** | NEW — largest untapped keyword found |
| Novated lease calculator | they rank #1 and #2 on EV salary-sacrifice terms with thin pages | EXTEND `/novated-lease-guide/` |
| Salary-sacrifice sub-variants (super / novated / healthcare FBT-exempt / equipment) | `superannuation salary sacrifice calculator` 400 @ 8 | EXTEND `/salary-sacrifice-calculator/` |
| Long service leave calculator + 8 states | genuinely state-divergent law = 8 defensible pages | EXTEND `/leave-calculator/` (annual leave only today) |
| Interactive PAYG-withheld calculator | ours is static tables | EXTEND `/payg-withholding-tables/` |
| Job-offer comparison (2 offers after tax) | they hold #1 for "salary compare" | NEW — utility & internal-link value over volume |
| Super retirement projection | resolves the class (e) mismatch on our 17,160-impression page | EXTEND `/superannuation-calculator/` |

---

## 6. Gap D — content clusters worth building

### D1. Reverse direction: hourly → salary (the single biggest keyword gap)

We convert salary→hourly. We do not serve the reverse, and **the reverse is larger**.

| Direction | AU vol/mo | Our coverage |
|---|---:|---|
| `$X an hour is how much a year` | ~4,780 | ❌ none |
| `$X per hour annual salary` | ~4,280 | ❌ none |
| **Reverse total** | **~9,060** | **none** |
| `$X a year is how much an hour` | ~4,350 | ✅ |
| `$X salary to hourly` | ~1,240 | ✅ |
| **Forward total** | **~5,590** | covered |

30 hourly values carry AU volume ($25–$100), ~9,100/mo. **Top 12 = 7,090/mo (78%):** $40 (1,180), $35 (1,090), $50 (810), $45 (760), $30 (620), $38 (460), $60 (460), $55 (430), $32 (380), $37 (310), $36 (300), $33 (290).

Winnable at our authority: `fairworkmate.com.au` (**DR 19**) pulls 441/mo from one page and holds the #1 AI Overview citation; `salaryadviser.com` (**DR 0**) ranks #3 on the reverse terms. Format, not authority, is the gate.

**Route:** `/hourly-to-salary/[rate]/` mirroring the existing family, cross-linked both ways, with `/hourly-to-annual-salary-calculator/` as hub.

### D2. Payday Super + Super Guarantee Charge

The actual 1 July 2026 superannuation event, and we cover none of it: SG is now owed **each payday** rather than quarterly, calculated on **qualifying earnings** rather than OTE, and the maximum contribution base changed from **$62,500/quarter to $270,830/year**.

- `super guarantee charge` — 1,000 vol, **KD 1**, CPC $2.50
- `super guarantee charge statement` — 700 vol, **KD 0**

SGC is what employers pay when they are late, and Payday Super makes lateness dramatically more likely. Note: the SG **rate** is terminal at 12% — there are no further general step-ups.

### D3. Specific award rate pages (not an award finder — see §8)

| Keyword | Vol | KD | CPC |
|---|---:|---:|---:|
| schads award pay rates | 2,900–3,300 | **1** | $1.60 |
| hospitality award rates | 1,400 | **0** | **$3.00** |
| penalty rates | 1,100 | **2** | $2.00 |
| minimum wage australia 16 year old | 2,100 | 15 | — |
| minimum wage australia 14 year old | 1,300 | 14 | — |
| casual minimum wage australia | 800 | 24 | $0.20 |

wagecalculator has exactly **one** award page (`/awards/schads`, 48/mo, ranking 11 on a 3,300-vol term). Junior rates (~4,300 combined) are unclaimed by anyone. Extend `/award-rates/` into per-award children.

### D4. Occupational pay-scale clusters

wagecalculator's largest structural moat: 64 pages, ~735/mo — public service (39 URLs, ~648/mo measured), teachers by state (9), nurses by state (9), ADF by rank (4). We have **zero** public-service and ADF pages, and single national pages where they have 8-state clusters.

The pattern is repeatable: `Dataset` + `Place` + `PropertyValue` schema, effective date in-page rather than in-URL, and a cited enterprise-agreement PDF. **Extend `/teacher-pay-australia/` and `/healthcare-worker-pay/` into hub + 8-state sets first** — we already own the topical entry point.

### D5. Smaller confirmed gaps

| Gap | Evidence |
|---|---|
| **State payroll tax** | `payroll tax tasmania` — 211 impressions, **0 clicks**, pos 18.2. `STATE_PAYROLL_TAX` covers only NSW/VIC/QLD/WA; we have pay-calculator routes for all 8 |
| **FIFO** | `fifo pay` 142, `average fifo salary` 132, `fifo australia salary` 108, `fifo salary` 106 — all **zero clicks**. `fifo pay calculator` 200 impr / 6 clicks is tool intent against our guide |
| **`how many fortnights in a financial year`** | 240 impressions, 1 click, pos 9.9. No page. FY2026-27 is a 27-pay year for some — we already discuss this elsewhere |
| **`minimum wage australia`** | **34,000 vol**, no dedicated page (only `/minimum-wage-history-australia/`). Largest single volume gap, but KD 26 and AI-Overviewed — treat as a stretch target |
| **FY-scoped bracket children** | `tax brackets 2026` 8,600 vol; wagecalculator ranks 15 with `/tax-rates/2026-27`. Add `/tax-brackets/{fy}` children + evergreen hub |
| **`true cost of employee calculator australia`** | 125 impr, **0 clicks**, pos 25.8. Page exists — pure title mismatch |
| **Author entity pages** | We already have strong per-page bylines (CPA + fact-checker) — stronger than most competitors. We lack `/author/{name}` pages with `Person` + credential schema |

---

## 7. Corrections to existing content (correctness, not growth)

### 7.1 Hourly rate basis

We compute on **52.18 weeks**; every other AU site uses **52**. On $80,000 that is our **$40.35** against their **$40.49**. Being the only site with a different number reads as an error, not precision. Change to 52.

### 7.2 Minimum wage is wrong on ~15 modules

Fair Work (updated 1 July 2026): NMW is **$26.44/hr, $1,004.90/week**, award minimums **+4.75%**.

`/award-rates/` currently states **three different figures on one page** ($24.10, $24.95, $26.44) and ships this in FAQPage structured data:

> "The national minimum wage for FY2025-26 is $24.10 per hour, or $915.91 per week" · "The FY2025-26 increase was 3.75%"

Both wrong: $24.10 was FY2024-25; FY2025-26 was $24.95/$948.00 at 3.5%. **The page is wrong about two financial years simultaneously.** `$24.10` is hardcoded across ~15 modules, `$25.44` across ~20 more.

### 7.3 Everything in the companion doc

The FY2026-27 engine migration, NAT 1006 coefficient defect, three-engine reconciliation and label sweep are specified separately in `docs/superpowers/specs/2026-07-28-fy2026-27-migration-and-serp-recovery-design.md`.

---

## 8. Do NOT build these

Each of these looks like an opportunity in the keyword data and is not. Recorded so the reasoning does not have to be rediscovered.

| Target | Why not |
|---|---|
| **Award finder / `award calculator`** | Fair Work owns it outright. `calculate.fairwork.gov.au/findyouraward` = **31,370 visits/mo**; the best commercial competitor (fairworkmate, which already has the full 121-award lookup you'd have to build) = **31**. A 1,000:1 ratio. Six of ten results are `.gov.au`. Building the tool does not change the ceiling. *(Per-award **rate** pages in §D3 are a different, viable thing.)* |
| **`/super-guarantee-rate/` page** | The three zero-click "ato super guarantee rate … 12%" queries (1,546 impressions) are probably **not human** — Ahrefs shows null difficulty, null parent topic and an empty SERP-features array, and **global volume exceeds AU volume for a query naming the *Australian* Taxation Office**. Consistent with AI Mode query fan-out logged as impressions. The rest is answered inline, and we already hold the AI Overview citation on `super guarantee rate history` — which is precisely *why* it converts at 0.28%. Winning the citation **is** the traffic loss. |
| **The `lito` keyword** | Position 1 in Australia is **LiTO, an Italian restaurant in Burleigh Heads**, plus its Instagram (#3), Facebook (#5) and a Spotify artist with 263,000 monthly listeners (#9). Four of ten results concern tax. Google's own PAA asks "What is a Lito food?". Unfixable. |
| **More `/salary-to-hourly/` values** | The amount gap is closed. 35k, 170k and 250k have **zero** AU volume (35k's 3,800 is US). All remaining uncovered values total ~210/mo. |
| **Per-amount fortnight/day pages** | Literally zero AU volume, confirmed. "a week" volume (~1,500) is 87% `after tax` — that is existing `/take-home-pay-on/` intent, not a new family. |
| **Stamp duty / land tax / GST / budget planner** | wagecalculator has 17+ such pages and **none register in their top 40**. Evidence against copying that part of their architecture. |
| **New FAQPage/HowTo markup for CTR** | Google withdrew those rich results for non-gov/non-health sites in 2023. No competitor earns one. Still worth fixing for AI-Overview comprehension (§A4) — but not as a CTR play. |
| **`/superannuation-calculator/` retitling alone** | 17,160 impressions of retirement-projection intent against an SG-contribution tool. Either build the projection calculator or write those impressions off. |

---

## 9. The strategic choice

Two facts define the ceiling:

**wagecalculator.com.au's ~18,740/mo is 86% a single page** — their homepage at position #10 for `tax calculator` (205,000 volume) carrying 2,281 keywords. Their other **185 pages produce ~2,600/mo, ~14 visits each**.

**We are 26–74 positions from every head term:**

| Query | Our position |
|---|---:|
| pay calculator | 44.8 |
| salary calculator | 73.7 |
| income tax calculator | 71.5 |
| take home pay calculator | 37.1 |
| tax refund calculator | 70.1 |
| wage calculator | 26.6 |

So **copying wagecalculator's page types does not close the traffic gap** — their whole content estate outside the homepage is worth ~2,600/mo. Our long tail already outperforms it: `/bonus-tax-calculator/` earns **1,057 clicks/28d, four times their best non-homepage asset**, and `/backpay-calculator/` converts at 6.69%.

**But the head terms are not out of reach, and that is the important correction.** `aussalarycalculator.com.au` — **DR 0.1**, a single 1,430-word homepage — ranks **#4 for `pay calculator` (301,000 vol)**, #5 `salary calculator`, #4 `wage calculator`, #8 `take home pay calculator`. Its mechanism is not authority. It is one page answering every variant intent (hourly / shift / casual / salary), a **19-question FAQ** that swallows the question long-tail, and explicit **"2026-27"** labelling in copy. See §12.5.

**Two caveats before anyone treats 301,000 as the prize.** First, aussalarycalculator ranks #4 on that term and Ahrefs still estimates its *entire* site at 11,036/mo — so effective CTR on these calculator SERPs is very low, consistent with the AI-Overview saturation in §3.2. Second, **we cannot compare our GSC clicks to competitors' Ahrefs estimates**: Ahrefs models us at ~850/mo against a measured ~6,900 clicks per 28 days, an ~8× understatement. Competitor figures in this document are Ahrefs estimates and are directionally useful only.

**Revised recommendation.** Do both, in this order: fix the CTR and freshness problems that suppress everything already ranking; then rebuild `/` and `/income-tax-calculator/` on the aussalarycalculator pattern, because DR 0.1 proves the barrier is page-level completeness rather than domain authority; and keep compounding the niche-tool long tail, which is the model demonstrably working for us. The single largest individual prize is still not a new page: **`/hourly-to-annual-salary-calculator/` carries 77,762 impressions at 0.65% CTR** — at par 3% that one page returns ~2,300 clicks.

---

## 10. Prioritised roadmap

Sequenced by recoverable clicks per unit of effort. Steps 1–2 assume the correctness work in the companion doc lands first — do not push Google to index or re-crawl pages whose figures are wrong.

**Status, 28 July 2026** — branch `seo/fy2026-27-recovery`, 9 commits, not pushed.

**Done:** 1 (titles) · 2 (indexation — via `/site-directory/`, 158 crawlable
links) · 3 (dormant-page titles retargeted) · 4 (FAQ/JSON-LD figures) ·
5 (minimum wage) · plus the whole correctness programme in the companion doc,
the verified super caps, figures in programmatic titles, and the 52-week
hourly basis.

**Open — all genuine new-build work needing its own scoping:** 6 (zone tax
offset calculator), 8 (per-award rate pages), 9 (Payday Super + SGC),
10 (`/hourly-to-salary/[rate]/`), 11 (work hours calculator), 12 (CGT),
plus SAPTO, the holidays cluster and the occupational clusters.

The highest-value next item is **6, the zone tax offset calculator** — KD 0,
zero SERP features, DR-1 and DR-2 pages in the top 10, and we already rank
7.3 on 440 impressions with a guide and no calculator.

| # | Work | Effort | Why here |
|---|---|---|---|
| 1 | **Title & description sweep** — drop the ` \| Pay Calculator Australia` suffix, bump every FY to 2026-27, lead with the answer. All ~212 pages; `/tax-on/` and `/take-home-pay-on/` templated | Low | **+600–850 clicks/28d.** Also unblocks ~25,500 of year-stamped volume (`tax brackets 2026`, `tax calculator 2026`, `tax rates 2026`) where staleness is the plausible sole cause |
| 2 | **Fix indexation** — server-render nav links, add tax-table pages to footer Zone 1, link all 35 `/tax-on/` pages | Low–Med | Unblocks 7 dead pages mid-season, incl. `/weekly-tax-table/` (16,000 vol, **KD 13**) and `/payslip-generator/` (1,700) |
| 3 | **Revive dormant pages** (§11.8) — pages that exist, are on-topic, and rank for nothing | Low | `medicare levy calculator` **KD 4** · `monthly tax table` **KD 3** · `salary sacrifice calculator` **KD 7** · `redundancy payment calculator` **KD 20**. Cheapest volume on the list |
| 4 | **Un-collapse FAQs + add FAQPage JSON-LD to `/salary-to-hourly/`** | Low | AI-Overview citation eligibility (§3.4) |
| 5 | **Fix minimum wage across ~15 modules + JSON-LD** | Low | Correctness; the wrong figure is currently in Google's index |
| 6 | **Zone tax offset calculator** | Low | KD 0, zero SERP features, 440 impressions already |
| 7 | **Thicken the four tax-table pages** — ≥850 words, ≥26 rows, add NAT 1005/1006/1007 | Low–Med | 43,300 pure gap at KD 3–13; the SERP visibly rewards NAT and FY labelling (§11.6) |
| 8 | **Consolidate HECS** — full calculator + all 7 loan schemes on `/hecs-help-calculator/`; dedicated narrow threshold page (§11.4) | Med | ~28,500 volume currently split across 4 pages, none above #34 |
| 9 | **SAPTO cluster** (calculator + guide) | Low–Med | ~4,800 vol at KD 0–3, **$17 CPC** |
| 10 | **`/hourly-to-salary/[rate]/`** — Tier 1: 12 pages | Med | ~7,090/mo addressable; the direction we don't serve is larger than the one we do |
| 11 | **Rebuild `/` and `/income-tax-calculator/`** on the aussalarycalculator pattern — pay-type selector, 15–20 FAQs in schema, explicit 2026-27 | Med | The ~1,160,000 head-term cluster. DR 0.1 proves it is page-completeness, not authority (§11.5) |
| 12 | **Per-award rate pages** — SCHADS, hospitality, retail, junior rates | Med | ~8,700 vol at KD 0–2 |
| 13 | **Payday Super + SGC** | Med | 1,700 vol at KD 0–1, and the actual 1 July 2026 event |
| 14 | **Work hours / timesheet calculator** | Med | `hours calculator` 15,000 · `work hours calculator` 4,900; proven at 217/mo |
| 15 | **CGT calculator + guide** | Med–High | `capital gains tax calculator` 11,000; `how much is capital gains tax` 2,500 with wagecalculator at #1 |
| 16 | **Holidays/calendar section** — ~40 programmatic state×year pages + working-days calculator | High | ≈655,000 vol at KD 0–30, proven at DR 22. **Strategic call first** — adjacent traffic, not pay-calculator intent |
| 17 | **Teacher/nurse state clusters**, then public service | High | ~735/mo, long payback |

**Measurement.** Re-export the same GSC 28d-vs-28d comparison after each step. Baseline: **6,894 clicks / 698,124 impressions / 0.99% CTR**. Ahrefs materially understates this site (~850/mo against ~6,900 clicks/28d) — do not use it to judge these changes.

---

## 11. Competitor keyword gap

**240 keywords meet the gap test** (a competitor ranks top-20 and we are absent or ≥30), totalling **≈2,110,000 monthly AU searches**.

**Confidence note.** Our own Ahrefs pull returned 100 rows sorted volume-desc, running from 19,000 down to 200. Because the cut landed *at* 200, the list is complete for every keyword ≥250 volume — so "ABSENT" below means **not in the top 100 at all**, evidenced rather than inferred. (GSC shows an average position of 44.8 for `pay calculator`; Ahrefs' point-in-time snapshot shows nothing in the top 100. Both mean "nowhere useful".)

### 11.1 Head terms — we rank for none of them

Our highest-volume ranked keyword is `fortnightly tax table` at 19,000, position 22. We rank in the top 100 for **zero** of the eleven terms above 20,000 volume.

| Keyword | Vol | KD | Best competitor | Ours |
|---|---:|---:|---|---|
| pay calculator | 301,000 | 61 | **aussalarycalc #4 (DR 0.1)** | ABSENT |
| tax calculator | 205,000 | 58 | wagecalculator #10 (DR 7) | ABSENT |
| tax return calculator | 131,000 | 31 | paycalculator #13 | ABSENT |
| salary calculator | 39,000 | 43 | **aussalarycalc #5** | ABSENT |
| income tax calculator | 37,000 | **18** | paycalculator #3 | ABSENT |
| ato tax calculator | 36,000 | 56 | paycalculator #4 | ABSENT |
| simple tax calculator | 28,000 | 40 | paycalculator #3 | ABSENT |
| tax calculator australia | 24,000 | 36 | paycalculator #3 | ABSENT |
| pay calculator australia | 23,000 | 61 | **wagecalculator #3** | ABSENT |
| payg calculator | 22,000 | 46 | wagecalculator #9 | ABSENT |
| tax withheld calculator | 21,000 | 60 | paycalculator #4 | ABSENT |
| weekly tax calculator | 13,000 | 39 | paycalculator #4 | ABSENT |
| take home pay calculator | 12,000 | 48 | **wagecalculator #4** | ABSENT |

### 11.2 Cluster rollup

| Rank | Cluster | Gap kw | Addressable vol | Our coverage |
|---|---|---:|---:|---|
| 1 | Generic pay/tax calculator head terms | 84 | **≈1,160,000** | 0 of 84 |
| 2 | **Public & school holidays / calendars** | 79 | **≈655,000** | 0 of 79 |
| 3 | Calculator verticals (missing or dormant) | 26 | ≈119,000 | 6 pages exist, none rank |
| 4 | ATO tax tables & FY rates | 21 | ≈85,000 | 5 pages exist, none rank on-target |
| 5 | Occupational / award / sector pay | 12 | ≈27,000 | 2 pages, positions 15 & 28 |
| 6 | Working-days & date-math evergreen | 11 | ≈22,000 | 0 |
| 7 | Gross vs net terminology | 11 | ≈20,000 | 1 page @ #25 |
| 8 | Average salary benchmarks | 5 | ≈17,800 | 1 page, off-target |

### 11.3 The holidays/calendar cluster — the largest low-difficulty pool found

Not previously on our radar. `payly.com.au` (**DR 22**, a payroll-software vendor) uses holiday calendars purely as a traffic magnet across 79 keywords at KD mostly 0–20:

| Keyword | Vol | Their pos |
|---|---:|---:|
| wa school holidays 2026 | 51,000 | 6 |
| qld school holidays 2025 | 44,000 | **1** |
| school holidays wa 2026 | 33,000 | 7 |
| wa school holidays | 16,000 | 10 |
| school holidays 2027 | 12,000 | **1** |
| wa public holidays 2025 | 5,900 | 10 |
| how many working days in a year | 4,200 | **1** |
| is today a public holiday | 4,000 | **1** |
| next public holiday | 3,000 | **1** |
| how many working weeks in a year | 1,600 | **1** |

Their winning page is **654 words, no tables, `WebPage` schema only**. The mechanism is an exact-match state×year URL and H1, a **dense sibling link mesh** (8 states × 2 years), and an embedded working-days calculator tying it back to payroll. This is a pure programmatic-template play and calc-boiler already generates exactly this shape.

It is defensibly adjacent to `/tax-calendar/`, `/annual-leave-guide/` and `/overtime-penalty-rates-guide/` (public-holiday penalty rates). Related: `fortnights in a year` (2,200, **KD 0**) and `financial year australia` (5,000, **KD 1**) — both wagecalculator top-10, both absent for us, and both connect to the `how many fortnights in a financial year` query already showing 240 impressions in our GSC.

### 11.4 HECS: consolidate or split? — reconciling two findings

Two agents reached opposite conclusions. Both are right, for different intents:

- **Threshold intent** (`hecs repayment threshold` 6,800, `hecs threshold` 3,600): the winners are *narrow* — AccessPay ranks #4 on **475 words**, taxly #9 on **309 words**, smartsalary #2 on **464 stale words**. Our 2,907-word omnibus sits at #40.
- **Calculator intent** (`hecs repayment calculator` 7,100): the winner is *consolidated* — `paycalculator.com.au/student-loan/` holds **#2**, and also #15/#16/#20 on the threshold terms, carrying **28,500 volume on one URL** with calculator + threshold table + all seven loan schemes (HELP/SFSS/VSL/SSL/ABSTUDY SSL/TSL/overseas).

**Synthesis:** consolidate `/hecs-help-calculator/` into the full tool + all-schemes reference (targeting calculator intent), and give thresholds a dedicated narrow evergreen page (targeting threshold intent) by promoting `/news/hecs-repayment-threshold-2026-27/`. Today we have **four** pages — `/hecs-help-calculator/`, `/hecs-help-guide/`, `/stsl-on-payslip/`, `/extra-super-vs-hecs-repayment/` — none ranking better than #34. That is cannibalisation on ~28,500 volume where our topical signal already exists.

### 11.5 The DR 0.1 proof — what a winning homepage looks like

`aussalarycalculator.com.au`, one page, DR 0.1:

- **Title:** `Australian Salary Calculator | Shift Work, Hospitality, Retail Pay & Take Home`
- **H1:** `What's your pay rate?` (conversational H1, keyword-dense title)
- **1,430 words**, 7 H2s, one table, 8 internal links
- Calculator with a **pay-type selector** — hourly / shift / casual / salary
- **19-question FAQ** in `FAQPage` schema, explicitly including *"What are the 2026-27 Australian tax rates?"*
- Schema: `WebPage` + `FAQPage` only

It ranks #4 for a 301,000-volume term. Our homepage is longer, has better schema (`Organization` + `Person` + `EducationalOccupationalCredential`) and a genuine CPA byline — and ranks nowhere, while its title still reads **"Pay Calculator Australia 2025-26"**.

For contrast, `paycalculator.com.au` (DR 52, #1) wins on *tool depth* not prose: 1,944 words, **20 H2s**, no FAQ at all, but inputs covering pro-rata hours, purchased leave, overtime, bonus, novated lease, reportable fringe benefits, family tax benefit, child care subsidy, student loans and inflation.

### 11.6 Weekly tax table — a like-for-like we lose

| | wagecalculator | Ours |
|---|---|---|
| Words | 858 | **601** |
| Table rows | 26 | **21** |
| FY labelled | FY 2026-27 | 2026-27 ✓ |
| NAT form number | `NAT 1005` in meta | **never mentioned** |

The top three results are all ato.gov.au pages titled with the NAT number, and #7/#9 are titled "FY26-27 Weekly Tax Table" and "2026-27 PAYG Tax Tables Australia" — the SERP is actively rewarding explicit FY and NAT labelling. **onestoptax.com.au ranks #4 at DR 2 with 10 backlinks.** `weekly tax table` is 16,000 volume at **KD 13**.

### 11.7 Cheapest wins — we already rank 14–29

| Keyword | Vol | Ours | Competitor |
|---|---:|---:|---|
| fortnightly tax table | 19,000 | #22 | — |
| low income tax offset | 11,000 | #23 | — |
| pay calculator nsw | 2,000 | #18 | aussalarycalc #4 |
| teacher salary | 1,800 | #28 | wagecalculator #1 |
| minimum wage australia yearly | 1,600 | #25 | — |
| annual salary calculator | 1,500 | #17 | aussalarycalc #3 |
| gross pay | 1,400 | #25 | wagecalculator #1 |
| tax tables 2025 | 1,400 | #25 | — |
| hourly rate calculator | 1,300 | #14 | aussalarycalc #1 |
| take home pay | 1,300 | #21 | aussalarycalc #5 |
| pay calculator hourly rate | 1,300 | #25 | aussalarycalc #1 |
| leave calculator | 1,300 | #29 | — |
| award rates | 1,200 | #15 | — |
| payg tax table | 1,100 | #21 | — |
| salary calculator nsw | 700 | #27 | aussalarycalc #4 |
| pay calculator qld | 700 | #26 | aussalarycalc #4 |

### 11.8 Dormant pages — we own the page and rank nowhere for its own term

| Our page | Its target term | Vol | KD | Ours |
|---|---|---:|---:|---|
| /medicare-levy/ | medicare levy calculator | 6,300 | **4** | ABSENT |
| /salary-sacrifice-calculator/ | salary sacrifice calculator | 4,700 | **7** | ABSENT |
| /weekly-tax-table/ | weekly tax table | 16,000 | **13** | ABSENT (unindexed) |
| /monthly-tax-table/ | monthly tax table | 2,900 | **3** | ABSENT (unindexed) |
| /payslip-generator/ | payslip generator | 1,700 | 16 | ABSENT (unindexed) |
| /redundancy-pay-calculator/ | redundancy payment calculator | 2,200 | **20** | ABSENT |
| /tax-return-calculator/ | tax return calculator | 131,000 | 31 | ABSENT |
| /hecs-help-calculator/ | hecs repayment calculator | 7,100 | 32 | ABSENT |

**This is the most actionable table in the document.** These are not missing pages — they exist, they are on-topic, and they rank for nothing. `medicare levy calculator` at KD 4 and `monthly tax table` at KD 3 are the clearest cases of a page underperforming its own difficulty.

---

## 12. Open items

- **`/leave-calculator/`** lost 62 clicks with a real position drop (6.4 → 7.3); `annual leave loading calculator` fell 6.3 → 12.2. Undiagnosed.
- **DR 0.8 against 367 referring domains** — abnormal ratio, caps everything above. Needs its own investigation.
- **`/centrelink-income-test/`** −56 clicks is impression collapse (−90%), position roughly unchanged. Seasonal; no action.
- **Holidays/calendar cluster** — 655,000 volume at low KD, but it is a *strategic* decision (adjacent traffic, not pay-calculator intent) rather than an obvious yes. Flagged for a call, not assumed.
