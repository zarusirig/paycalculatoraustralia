# Keyword Gap & Ranking Plan: Getting to 1,000 Visits a Day

**Date:** 23 Sep 2026 · **Data:** GSC export (last 28 days, 25 Aug – 21 Sep 2026) + DataForSEO Labs (AU, en) for us and 9 competitors, plus live SERPs and backlink summaries. Cost: about $6.30 in DataForSEO credit.
**Raw data:** `docs/seo/data/2026-09-23-dataforseo/` (`our-ranked-keywords.csv`, `competitor-gap.csv`). **Scripts:** `docs/seo/scripts/dataforseo/` (credentials come from the env vars `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`).

---

## 1. Where we are

| Metric | Aug baseline (28d to 27 Aug) | Now (28d to 21 Sep) |
|---|---|---|
| Clicks | 5,660 (~200/day) | **10,505 (~375/day avg; weekdays 450–590)** |
| Impressions | 582k | **1.01M** |
| CTR | 0.97% | 1.04% |
| Avg position | 8.35 | ~7 (improving: 8.0 → 6.0 over the window) |

The P1–P8 and G1–G6 releases worked: traffic nearly doubled in a month. Clicks per 28 days needed for **1,000/day are about 28,000**, so we need **roughly +17,500 clicks per 28 days**.

**DataForSEO rank distribution (5,296 keywords):** only 35 are in positions 1–3 and 257 in 4–10. Another **738 sit at 11–20 and 919 at 21–30**, so most of our visibility is on pages 2 and 3.

**Authority gap (DataForSEO backlinks summary):**

| Domain | Referring domains | Rank |
|---|---|---|
| **pay-calculator-australia.com** | **42** | 18 |
| paycalculator.com.au | 944 | 233 |
| paycal.com.au | 136 | 55 |
| wagecalculator.com.au | 194 | 0 |
| australiapaycalculator.com.au | 95 | 118 |

The head terms are why this gap matters. We are **#13 for "pay calculator"** (live SERP), and DataForSEO has no ranking for us on "tax calculator", "salary calculator" or "income tax calculator". paycalculator.com.au holds #1–3 on every one of them with 944 referring domains. On-page work alone won't move these terms.

---

## 2. The plan in four levers

These are conservative estimates, in clicks per 28 days.

| Lever | What | Est. gain / 28d | Time to effect |
|---|---|---|---|
| **A. CTR on page-one pages** | Retitle and rewrite snippets on ~15 high-impression pages already at pos 4–8 | **+3,000–4,000** | 2–4 weeks |
| **B. Push pages from 11–30 into the top 10** | Content depth, intent fixes, cannibalisation fixes and internal links on existing nodes | **+6,000–8,000** | 1–3 months |
| **C. New nodes inside the border** | Employer pay rates, occupation pay rates, more awards, Centrelink payments, ADF, pro-rata, minimum wage | **+7,000–10,000** | 2–5 months |
| **D. Authority** | Earn ~40–80 referring domains to open up the head terms | +3,000–10,000 (head terms) | 3–9 months |

**A+B+C together give about +16k–22k per 28 days, or roughly 950–1,150 visits a day.** Allow 3–5 months to get there, before the EOFY 2027 peak, which historically doubles June traffic. Lever D is the upside and the insurance.

---

## 3. Lever A: CTR fixes (fastest)

These pages already rank on page one but earn 0.3–0.9% CTR. At an average position of 5–7, 2–4% is normal. Before rewriting each title, check which queries it actually receives in GSC.

| Page | Impr/28d | CTR | Pos | Problem → fix |
|---|---|---|---|---|
| `/junior-pay-rates/` | 93k | 0.43% | 6.2 | Demand is **age-led** ("minimum wage for 15 year old australia" 2.1k impr at #9.9; 14/16/17-year-old variants). The title says "Junior Pay Rates". **Title:** "Minimum Wage by Age 2026-27: 14, 15, 16, 17 Year Olds (Australia)". Add an age table at the top and jump links. Consider `/minimum-wage-by-age/{14..20}/` spokes (fairworkmate ranks #3 with a 15-year-old page). |
| `/hourly-to-annual-salary-calculator/` | 66k | 0.59% | 6.6 | Put the answer in the snippet: "$30/hr = $62,400 a year". Add a "how many hours in a year (1,976 / 2,080 / 1,950)" box, since "how many hours in a year" has 12.1k volume at KD 4 and we sit at 48–62. |
| `/fortnightly-pay-calculator/` | 54k | 0.85% | 5.4 | "fortnightly" (12.1k) has us at #6. Title should promise the number: "Fortnightly Pay Calculator 2026-27: Take-Home Every 2 Weeks After Tax". Add "fortnights in a year" (2.4k volume, we're at 69). |
| `/weekly-pay-calculator/` | 35k | 0.48% | 5.7 | Same fix as fortnightly. |
| `/` (homepage) | 28k | 0.67% | 7.7 | Title variant built around "Pay Calculator Australia 2026-27 — Salary, Tax & Take-Home Pay". Test for 4 weeks. |
| `/take-home-pay-on/*` (all) | 132k | 0.61% | ~6 | The template title should lead with the answer: "$100,000 After Tax in Australia = $77,xxx (2026-27)". The queries are "110k after tax australia" and similar. |
| `/tax-on/*` (all) | 102k | 0.35% | ~6–7 | Same answer-first template: "Tax on $60,000 in Australia: $x,xxx (2026-27)". |
| `/superannuation-calculator/` | 15k | 0.31% | 6.2 | Title says "Super Guarantee Calculator". Check the GSC queries; searchers likely want "super calculator" / "how much super". |
| `/gross-pay-calculator/` | 14.5k | 0.57% | 8.5 | Same approach as above. |
| `/public-service-pay-scales/vic/` | 20k | 1.0% | 6.8 | "vps salary 2026" gets 1.3k impr at #4.9 but 0.85% CTR. Put the year and the "VPS 1–7 + STS" range in the title. |

**How to measure:** annotate the date and compare page CTR at matched positions 4 weeks later.

---

## 4. Lever B: move existing pages from 11–30 into the top 10

DataForSEO groups close variants under one volume, so the headline volumes below are cluster-level figures, not additive sums.

### B1. Tax tables: the biggest KD-0 prize (~60k/mo cluster)
- "fortnightly tax table" / "tax tables fortnightly" / "payg fortnightly tax tables": **27.1k, KD 0–2, we're at 15–28**. "weekly tax table": **27.1k, KD 0, we're at 28–34**. "tax table 2026": 6.6k at #20. "monthly tax table": 2.4k at 19–21.
- Live SERP: ATO holds 6 of the top 10. The rest are onestoptax, reckon, QuickBooks and taxbyte, all thin pages. **We're #17. wagecalculator is #13.**
- **Cannibalisation:** `/payg-withholding-tables/` ranks for "fortnightly tax table 2026" (#12) and "weekly tax table 2026" (#16), not the dedicated pages. Make `/payg-withholding-tables/` the hub and have it link out with exact-match anchors. Retarget its title so it stops competing.
- **Page upgrades:** start with an "enter your fortnightly earnings → tax withheld" lookup above the fold (answer first, not a PDF-style dump). Show both 2025-26 and 2026-27 (FY toggle). Include the full $1 step table in HTML, not an image. Add tax-free-threshold claimed / not-claimed columns, a FAQ and a "download CSV" option.
- Memory flags a **NAT 1006 accuracy defect**. Fix it and verify against the ATO before pushing this cluster.
- Target positions 5–8 → **+2,000–3,000/28d.**

### B2. Occupational pay clusters (all KD 0)
| Cluster | Volume signal | Us now | Competitor | Action |
|---|---|---|---|---|
| QLD nurse pay | 2.9k × 20+ variants; "qld health pay rates" 1.9k | `/healthcare-worker-pay/qld/` at 15–28 | wagecalculator `/nursing-salaries/qld` #3–8 | Rename the H1/title to "QLD Nurse Pay Rates 2026 (Nurse Grade 5, EB12)" and add a grade × pay-point table, EB12 increase dates, penalty rates and a link to take-home. |
| VIC teachers | "teacher salary in victoria" 9.9k cluster | `/teacher-pay-australia/vic/` at 32–42 | wagecalculator #7–9 | Add the range table (Graduate → Leading Teacher), 2026 increments and after-tax per band. |
| NSW teachers | 4.4k cluster | **not ranking** | wagecalculator #4–7 | Check `/teacher-pay-australia/nsw/` is indexed and linked; expand it to parity with QLD. |
| QLD teachers | 2.9k cluster | 16–26 | — | Already earns 313 clicks. Add the 2026 PDF-style table (queries include "pdf"). |
| Generic teacher salary | 4.4k × 6 | hub at 22–29 | wagecalculator /wa #14–20 | Hub: a state comparison table, then links to states. |
| VPS | 3.6k × 5 | 10–14 | — | Push onto page one with a VPS grade table, 2026 dates and "VPS 4/5/6" anchors (queries: "vps 5 salary", "vps4 salary 2026"). |
| APS | aps 6/5/4 salary 1.9k/1.6k/1k | 25–36 | wagecalculator #3–4 | Add an H2 per APS level with the dollar range, or `/public-service-pay-scales/aps/aps-6/` spokes. |
| NSW nurse | 1.9k | 26–27, 65 | — | Same template as QLD. |

**Estimated +2,000–3,000/28d.**

### B3. Calculators stuck on page 2–3
| Page | Keywords (vol, KD) | Us | Fix |
|---|---|---|---|
| `/hecs-help-calculator/` | "calculate hecs repayment" / "hecs repayment calculator" 6.6k KD 0–2; "hecs repayment thresholds" 3.6k | 15–47 | paycalculator `/student-loan/` is #2. Add a thresholds table (2026-27 marginal system) above the fold and an "HECS repayment calculator" H1 variant. Check that the P2 merge 301s landed and aren't split. |
| `/redundancy-pay-calculator/` | "redundancy pay calculator" 5.4k KD 0; "redundancy payment calculation table" 5.4k | 25–57 | fairworkmate #2 with a simple tool. Add the NES table (years of service → weeks) as an HTML table, a tax-free-limit 2026-27 box, and state variants ("qld redundancy calculator" 720). |
| `/medicare-levy/` | "medicare levy calculator" 4.4k; MLS calculator 2.9k | 26–29 | P4 from the August plan: make it calculator-first and move the URL to `/medicare-levy-calculator/` with a 301 (or retitle). |
| `/long-service-leave-calculator/` | LSL calculator 6.6k KD 2; NSW 2.9k; QLD 1.3k + "long service leave qld" 5.4k | 51–69 | wagecalculator ranks #2–6 with **state spokes**. Build `/long-service-leave-calculator/{nsw,qld,vic,wa,sa,tas,act,nt}/` with state rules pre-set. |
| `/hospitality-award-rates/` | "hospitality award" 5.4k; "award wage for hospitality" 3.6k | 14–56 | Title "Hospitality Award Pay Rates 2026-27 (MA000009)", a level × casual/PT/FT table and penalty rates. |
| `/schads-award-pay-rates/` | "schads award 2026" 4.4k; pay rates 3.6k | 14–22 | Add the year to the title and a "2026 pay guide" table. The "pdf" query variants suggest a printable version. |
| `/retail-award-rates/` | "retail award" 4.4k; "retail award rates" 3.6k | 50–58 | Same template. |
| `/award-rates/` | "award rates" 1.9k × 5 | 8–28 | Hub: an A–Z of awards with links. It becomes stronger as C3 adds awards. |
| `/austudy-youth-allowance-calculator/` | "youth allowance calculator" 2.4k | 18–20 | Add rates, eligibility and FAQ. See C4. |
| `/minimum-wage-history-australia/` | "what is the minimum wage in australia" 12.1k; "minimum wage australia 2026" 2.9k | 28 / none | Either a new `/minimum-wage-australia/` (the current rate, with history as a section) or a retitle. Recommend a new node; see C5. |
| `/sapto-calculator/` | "sapto" 2.4k; "sapto eligibility" 1.9k | 20–26 | Add an eligibility checker section. |

**Estimated +2,000–3,000/28d.**

---

## 5. Lever C: new nodes (competitor gap, border-checked)

Every row passes the three border rules in `contextual-borders-and-audience-map.md`: it links to a calculator, sits within 3 degrees of "Australian pay", and helps the reader check their next payslip. The verdict is shown per group.

### C1. Employer pay rates (KD 0, competitors at #1–2): **pass**
fairworkmate earns ~3,500 visits/mo from blog posts like these:

| Page | Top keyword (vol) | fairworkmate pos |
|---|---|---|
| `/pay-rates/coles/` | coles wages 2.9k; pay rate/penalty 1k each | #1 |
| `/pay-rates/woolworths/` | woolworths pay rate 1.6k × 6 | #2 |
| `/pay-rates/bunnings/` | bunnings pay rate 880; + EBA 1k | #1 |
| `/pay-rates/mcdonalds/` | mcdonald's pay 720 × 6 | #2–3 |
| `/pay-rates/kfc/`, `/chemist-warehouse/` | 320–590 × 6 | #1–2 |
| Also check volumes for Kmart, Aldi, Target, Hungry Jack's, Big W, JB Hi-Fi, Officeworks, Amazon AU | — | — |

Template: the rate by age (15–21+) and level from the relevant award/EA, penalty rates, then a CTA: "your weekly take-home at N hours" (link to the weekly calculator with a prefill). Pulls junior-rate demand through naturally. **+2,000–3,000/28d.**

### C2. Occupation pay rates (KD 0): **pass**
dental assistant (2.9k), pharmacist (4.4k), electrician (2.9k × 2), truck driver (1k), accountant (2.4k), disability support worker (1.6k), medical receptionist (880), real estate agent (1.6k), property manager (1.3k), bus driver (1k), security guard (720).
URL: `/pay-rates/job/{occupation}/`, showing the award rate, typical salary range and after-tax figures (link `/take-home-pay-on/N/`). **+1,500/28d.**

### C3. More award pages: **pass**
Fast food award (**8.1k**, KD 13; plus 3.6k), pharmacy award (2.4k × 4), manufacturing award (3.6k), security award (720 × 3), plus clerks, children's services and the nurses award (check volumes). Reuse the existing award template. **+1,000/28d.**

### C4. Centrelink payments (the sub-cluster approved in P5): **pass**
| Node | Keywords | Competitor |
|---|---|---|
| `/parenting-payment-calculator/` | parenting payment single 8.1k; parenting payment 6.6k; single parent payment calculator 2.4k (KD 0–3) | fairworkmate #2–8 |
| `/family-tax-benefit-calculator/` | FTB calculator 9.9k × 6 (KD 0–8) | fairworkmate #5–12 |
| `/rent-assistance-calculator/` | 3.6k × 3 | fairworkmate #9–13 |
| Upgrade the jobseeker page for head terms | "jobseeker payment" 14.8k; "jobseeker allowance" 6.6k; "centrelink payment calculator" 4.4k | fairworkmate #6–12 |
| Upgrade the youth allowance page | "youth allowance" 22.2k; eligibility 4.4k | fairworkmate #8 |

Border note: FTB is a *family* income test, not a pay test. It passes rule 3 ("how my pay affects my payments") but it's the furthest from the centre. **Decision needed.** Centrelink rates index on 20 Mar and 20 Sep, so re-verify rates on every one. **+2,000–3,000/28d.**

### C5. Smaller, cheap calculators: **pass**
- `/minimum-wage-australia/`: "what is the minimum wage in australia" 12.1k, state variants 1.9k each. **+600**
- `/pro-rata-salary-calculator/`: "pro rata" 9.9k; "salary checker pro rata" 880; "pro rata calculator" 720. **+400**
- `/casual-loading-calculator/`: 1k + 590. **+200**
- `/adf-pay-scales/` (+ army/navy/air force): ADF pay scales 2.9k, pay rates 1.3k × 4 (KD 0). The rank-structure queries are zero-value, so skip them. **+500**
- Public service: SA (SSO/ASO), WA, NSW Health spokes on the existing `[jurisdiction]` route. **+300**
- Percentage increase calculator (18.1k, KD 27): borderline. Only as a "pay rise %" angle on `/pay-rise-calculator/`, not a generic tool.

### Rejected: outside the border
GST calculator (110k), public holidays (49.5k), BSB lookup (40.5k), ATO contacts, exchange rates, invoice/quote generators, fuel tax credits, Div 7A, franking credits, land tax, stamp duty/rego, investment calculator, resignation letter, car depreciation. Their volume is large but they sit off the border; per the user's rule, don't build them. Public holidays is the one partial exception: cover it only as "public holiday pay rates" inside penalty-rate pages.

---

## 6. Lever D: authority (unlocks the head terms)

Keyword targets: "pay calculator" (#13), "salary calculator australia" (#12 in GSC), "income tax calculator", "tax calculator". Even position 6–8 on these adds thousands of visits.
- **Linkable data assets:** "2026-27 Australian take-home pay table", a public-sector pay comparison across states (teachers/nurses/APS), and "minimum wage by age history". Pitch them to journalists (news.com.au, finance newsletters), unions and uni careers pages.
- **Embeddable calculator widget** (take-home pay / junior wage) with a credit link, for payroll blogs, bookkeepers and HR sites.
- **Resource-page outreach:** university careers, TAFE, youth employment and migrant-support pages that link out to "pay calculators" (competitors' 944 domains are the prospect list; pull via the DataForSEO `backlinks/referring_domains` endpoint, ~$0.02).
- **Target:** 42 → 100+ referring domains in 6 months.

---

## 7. Order of work

| # | Task | Lever | Effort | Est. /28d |
|---|---|---|---|---|
| 1 | Titles/snippets on the 10 pages in §3 + programmatic templates (`take-home-pay-on`, `tax-on`, `salary-to-hourly`) | A | S | +3,000 |
| 2 | Tax-table cluster: fix NAT 1006, fix cannibalisation, add a lookup tool, FY toggle | B1 | M | +2,500 |
| 3 | Junior → age-led retitle + minimum-wage-by-age spokes + `/minimum-wage-australia/` | A/C5 | M | +1,500 |
| 4 | Employer pay-rate pages (8–12) | C1 | M | +2,500 |
| 5 | Nurse/teacher/VPS/APS page depth (B2) | B2 | M | +2,500 |
| 6 | HECS, redundancy, Medicare calc, LSL state spokes (B3) | B3 | M | +2,000 |
| 7 | Centrelink: parenting, FTB (decision), rent assistance; jobseeker/YA upgrades | C4 | M | +2,500 |
| 8 | Occupation pay rates + extra awards | C2/C3 | M | +2,500 |
| 9 | Pro-rata, casual loading, ADF, other public-service states | C5 | S | +1,400 |
| 10 | Authority programme (ongoing from week 1) | D | Ongoing | head terms |

**Re-measure** every 4 weeks against this baseline: **10,505 clicks / 1.01M impr / 28 days to 21 Sep 2026.**

## 8. Decisions needed
1. **Family Tax Benefit calculator:** it sits on the border. Recommend **yes**, framed as "how your pay changes your FTB".
2. **Employer pay-rate pages:** these carry brand names (Coles, Woolworths). Recommend **yes**: factual rates sourced from the award/EA, with no logos and no implied affiliation.
3. **Link building (lever D):** is budget or time available? Without it, the ceiling is about 1,000–1,100/day, with no head terms.
