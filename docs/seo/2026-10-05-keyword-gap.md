# Keyword and Page Gap Report, 5 Oct 2026

**Data:** DataForSEO Labs, AU (2036), en, pulled 5 Oct 2026. Our ranked keywords (2,000 rows with vol >= 100, of 3,186), ranked keywords for paycalculator.com.au, wagecalculator.com.au, fairworkmate.com.au and paycal.com.au (top-15 positions, vol >= 100), keyword ideas, keyword overviews (about 420 candidate terms) and one `serp_competitors` pull across 30 core terms.
**Spend:** about $1.5 to $2.0. The MCP does not return a balance, so this is an estimate from row counts at the Sep rates of about $0.13 per 1,000 rows. It is well under the $5 cap.
**Raw data:** `docs/seo/data/2026-10-05-gap/` (CSVs listed at the bottom).
**Border test** (`contextual-borders-and-audience-map.md`): R1 links to one of our calculators, R2 is within 3 degrees of "Australian pay calculation", R3 helps the reader check their next payslip.
**Caveat on positions:** these are Labs snapshot ranks, which run 5 to 10 places worse than GSC for the same page (for example `/teacher-pay-australia/qld/` is Labs 13 to 31 and GSC 7.3). Use them for ranking pages against each other, not as absolute positions. Many pages built since 23 Sep (payday-super, time-in-lieu, enterprise-agreement, adf-pay-scales, centrelink-payment-rates, average-salary-australia) have no top-100 ranking in Labs yet. Section 2 treats that as a fix-or-wait item.

---

## 0. What the data says

1. **Our biggest leak is the wrong URL ranking, or a built page that does not rank at all.** Examples:
   - "tax withheld calculator" (27.1k, KD 38): the homepage ranks at 79 and `/tax-withheld-calculator/` has nothing in the top 100.
   - "minimum wage rate australia" (49.5k, KD 25): `/minimum-wage-history-australia/` ranks at 96 instead of `/minimum-wage-australia/`.
   - "annual leave calculator" (5.4k): the combined `/leave-calculator/` ranks at 49.
   - "teacher salary victoria" (9.9k, 8 variants): the hub `/teacher-pay-australia/` outranks `/teacher-pay-australia/vic/`.
   - "nurse salary" (3.6k, 7 variants): ranks at 75 to 78 via the VIC and NSW healthcare pages, because there is no national nurse page.
2. **The SERPs we target are weak.** Reddit, Facebook, YouTube, Indeed and PayScale sit at 3 to 30 on many of these terms. Many calculator sites sit at 30 to 70. Only ATO, Fair Work, MoneySmart and paycalculator.com.au hold the top 1 to 6 slots on the biggest terms. A position of 10 to 20 is realistic on most terms below.
3. **New competitor domains seen on our SERPs:** paycat.com.au, scalesuite.com.au, taxstore.com.au, atotaxcalculator.com.au, calcforlife.com, peninsulagrouplimited.com.au, sprintlaw.com.au, superguide.com.au, canstar.com.au, workcalc.com.au. None dominate. Peninsula, Sprintlaw and Fair Work hold the "public holiday" and "award" informational slots.
4. **Occupation × state is NOT a volume family.** 22 of the 100 occupation × state and apprentice terms I tested clear 100 searches a month, and most of those are apprentice terms or states we already have. The head terms carry the volume. Competitors (fairworkmate `/carpenter-vic`, `/plumber-wa`) win on the head term plus thin state pages. Do not build occupation × state pages.
5. **Amount-conversion families are dead.** "$80,000 a year is how much a week/fortnight/month" and "$25 an hour is how much a week" came back at 0 to 30 searches a month. Our 139 `/tax-on/`, 139 `/take-home-pay-on/`, 136 `/salary-to-hourly/` and 166 `/hourly-to-salary/` pages already cover the real demand ("100k after tax" is 720, "80k after tax" is 480). Do not add more amounts.

---

## 1. Top 30 new page opportunities (ranked)

Volumes are AU monthly. "KD -" means Labs returned no difficulty, which in this data is nearly always a low-competition SERP. "Best competitor" is the best-placed rival on the head term. "Volume" is the head term unless noted as a cluster.

| # | Page (type) | Head keyword · vol · KD | Cluster extras | Best competitor | Border |
|---|---|---|---|---|---|
| 1 | `/marginal-tax-rates/` (explainer + marginal vs average rate calculator on a raise or bonus) | marginal tax rates australia · 22.2k · 32 | "tax rate marginal" and "tax marginal rates" 6.6k each; "marginal tax rates" 6.6k; "what is marginal tax rate" 880 (about 40k cluster) | ATO 1, SuperGuide 2, MoneySmart 3, Canstar 5. We are 40 to 56 via `/tax-brackets/` | Pass. Links to the income-tax and pay-rise calculators. Checks tax withheld on a raise. Keep it distinct from `/tax-brackets/` or the two will cannibalise. |
| 2 | `/annual-leave-calculator/` (calculator: accrual + payout + 17.5% loading) | annual leave calculator · 5.4k · - | "annual leave calculation" 5.4k; accrual 1.3k ×2; "how much annual leave is accrued per week" 880 · KD 3; "annual leave payout tax" 210 | Fair Work calculator 1, Sprintlaw 7, WA gov 5. We are 49 to 74 via the combined `/leave-calculator/` | Pass. Direct payslip check (accrued leave, payout). |
| 3 | `/net-pay-calculator/` (calculator, thin wrapper on take-home with payslip-line breakdown) | net pay calculator · 5.4k · 3 | "net pay calculator australia" 1.9k · KD 4; "what is net pay" 880 · KD 8 | paycalculator.com.au 1, Industry Super 2, MoneySmart 3. We are 40 to 49 via `/gross-pay-calculator/` | Pass. Core entity. |
| 4 | `/highest-paying-jobs-australia/` (hub linking to the 50+ occupation pages) | highest paying jobs australia · 8.1k · - | "highest paying jobs in australia" 8.1k; "what is the highest paying job in australia" 1.3k; "what are the highest paying jobs" 880 ×2 | Reddit, SEEK, Indeed | **Conditional.** R3 is weak. Pass only as a link hub to the occupation pages and take-home calculator, with no investment or career advice. |
| 5 | `/miscellaneous-award-rates/` (award rate table, levels 1 to 6, casual and weekend columns) | miscellaneous award · 3.6k · - | "ma000104 pay rates" and "misc award pay rates" long-tail | fairworkmate `/tools/pay-rates/miscellaneous` (pos 15) | Pass. Award → pay, payslip check. |
| 6 | `/building-and-construction-award-rates/` (award table) | building and construction award · 2.9k · - | apprentice and trades tables | Fair Work (not an exact page); our `/construction-trades-pay/` is 29 | Pass. Convert `/construction-trades-pay/` into this page or split it. |
| 7 | `/flight-attendant-salary/` (occupation) | flight attendant salary · 2.4k · 0 | "qantas flight attendant salary" 720; "cabin crew salary" | wagecalculator (Qantas page), Indeed | Pass with a note. The rate sits in airline EAs, so use "EA + take-home" framing and not award minimums. Was backlog #11 in wave 4. |
| 8 | `/radiologist-salary/` + `/dentist-salary/` + `/anaesthetist-salary/` + `/optometrist-salary/` (4 occupation pages; see family F4) | radiologist salary · 2.9k · - | dentist 2.9k; anaesthetist 2.4k; optometrist 2.4k | Indeed, SEEK, PayScale | **Conditional.** No award, so use "take-home on this salary" only (R1 + R3 via take-home). |
| 9 | `/legal-services-award-rates/` | legal services award · 1.9k · - | paralegal salary 1.3k | fairworkmate `/tools/pay-rates/legal-services` (15) | Pass. |
| 10 | `/payment-in-lieu-of-notice/` (guide + calculator; NES weeks table) | payment in lieu of notice · 1.9k · - | "tax on termination pay" 260 · KD 2; "termination payment tax" 260 · KD 3; "notice period fair work" 1.3k (wave 4 #14) | Fair Work, Sprintlaw | Pass. Shows on the final payslip. `/final-pay-calculator/` holds the NES table, so this page must target the PILON and tax angle only. |
| 11 | `/super-contribution-tax/` (explainer: 15% contributions tax, Div 293, cap check) | super contribution tax · 3.6k · 7 | "concessional contributions cap" (we are 94) | MoneySmart, SuperGuide | **Conditional.** 2 degrees, link to the salary-sacrifice calculator. Fund-side tax, so keep the payslip angle (salary sacrifice reduces take-home). |
| 12 | `/casual-conversion/` (guide + casual loading calculator link) | casual employee rights · 880 · 4 | "casual conversion" 720; "permanent part time" 880 | Fair Work, Peninsula | Pass. Casual loading vs permanent pay. |
| 13 | `/electrical-award-rates/` + `/plumbing-award-rates/` (2 award pages) | electrical award · 1.3k · - | plumbing award 720; electrician pay rate 2.9k, plumber 1.6k (fairworkmate pos 8 and 10) | fairworkmate | Pass. The occupation pages exist but have no award page. |
| 14 | `/fitness-industry-award-rates/` | fitness industry award · 1.3k · - | personal trainer salary 480 | fairworkmate (not found) | Pass. |
| 15 | `/pastoral-and-horticulture-award-rates/` (2 awards, 1 page or 2) | pastoral award · 1.3k · - | horticulture award 1k; farm worker and fruit picker pay | fairworkmate (not found) | Pass. Check the horticulture piecework angle. |
| 16 | `/real-estate-award-rates/` | real estate award · 1k · - | property manager 1.3k (we have the occupation page) | fairworkmate `/tools/pay-rates/real-estate` | Pass. |
| 17 | `/data-analyst-salary/` + `/cyber-security-salary/` + `/business-analyst-salary/` + `/project-manager-salary/` (4 pages; F4) | project manager salary · 2.4k · - | data analyst 1.6k; cyber security 1.6k; BA 1.3k | PayScale, SEEK | **Conditional.** Take-home framing only. R3 is weak. |
| 18 | `/actuary-salary/` | actuary salary · 1.9k · 11 | | PayScale | Conditional (as #17). |
| 19 | `/gp-salary/` + `/surgeon-salary/` (extends `/job-pay-rates/doctor/`) | gp salary · 1.6k · - | surgeon 1k; "how much do gps earn" 1k | Indeed | Conditional. Doctor page exists, so check cannibalisation. Better as H2 sections on the doctor page. |
| 20 | `/enterprise-agreement-pay-rates/{bunnings,coles,woolworths}/` or one EA hub with 3 sections | bunnings enterprise agreement · 1k · - | coles EA 480; woolworths EA 260; "eba pay rates" 260; "bunnings eba" | fairworkmate `/blog/bunnings-enterprise-agreement` | Pass. Employer EA → pay rate check. We already have `/pay-rates/{employer}/`. Add an EA section there before building new URLs. |
| 21 | `/mortgage-broker-salary/` + `/surveyor-salary/` + `/boilermaker-salary/` + `/paralegal-salary/` (F4 batch) | mortgage broker salary · 1.3k · - | surveyor 1k; boilermaker 880 | | Conditional. |
| 22 | `/retail-manager-salary/` + `/store-manager-salary/` (1 page) | retail manager salary · 880 · - | store manager 880 | | Pass. Retail award manager levels. |
| 23 | `/local-government-award-rates/` | local government award · 720 · - | | | Pass. |
| 24 | `/live-performance-award-rates/` | live performance award · 720 · 1 | | | Pass. |
| 25 | `/principal-salary/` (teacher pay extension) | principal salary · 720 · 14 | | | Pass. Extends the teacher hub with state principal bands. |
| 26 | `/youth-worker-salary/` + `/prison-officer-salary/` | youth worker salary · 720 · - | prison officer 720 | | Pass (SCHADS and state EAs). |
| 27 | `/spouse-super-contribution/` | spouse super contribution · 1.9k · - | "spouse contribution tax offset" 590 (we are 61 via `/super-co-contribution/`) | MoneySmart | **Fails R3** (not a payslip item). Handle as a section on `/super-co-contribution/`. |
| 28 | `/carry-forward-concessional-contributions/` | carry forward concessional contributions · 1.6k · - | | MoneySmart, ATO | **Fails R3.** Add a section to `/concessional-contributions-cap/` (we hold "concessional contributions cap 2026" 2.4k at 94). |
| 29 | `/allowances-guide/` (laundry, first aid, tool, split shift, on-call, uniform) | laundry allowance · 260 · - | first aid 260; tool 210; split shift 210; on-call 140 | Fair Work | Pass. Total about 1.1k. Low volume, but each term is payslip-checkable. One page. |
| 30 | `/apprentice-pay/{trade}/` (10 pages; F3) | apprentice electrician pay · 1.9k · - | carpenter 880; plumber 720; mechanic 480; hairdresser 320; bricklayer 210; boilermaker 210; painter 170; chef 140; butcher 140 | Fair Work 1 (generic), Peninsula 19 | Pass. See family F3. Electrician already built at `/job-pay-rates/apprentice-electrician/`. |

Also noted, not a page: "army ranks" 5.4k, "navy ranks" 2.9k, "air force ranks" 1.9k, "raaf ranks" 2.4k. We have `/adf-pay-scales/{service}/` but no top-100 ranking for any rank keyword. Wagecalculator earns about 3.6k ETV from `/adf-pay/navy` alone. See quick-win Q11.

### Rejected or not-worth-it
- Off border: GST calculator (paycal.com.au 110k "gst cal"), vehicle rego (paycal), land tax NSW (wagecalculator 2.9k), employer health insurance, Employment Hero (brand), mortgage borrowing.
- Fails R3: "highest paying job in the world", politician and celebrity pay, "how much do AFL players get paid".
- Dead volume: amount-conversion pages (above), "per diem australia" 70, "uniform allowance" 70.

---

## 2. Top 10 quick-win fixes to existing pages

Positions are DataForSEO Labs, 5 Oct 2026.

| # | URL | Keyword (vol) | Current pos | Change |
|---|---|---|---|---|
| Q1 | `/fortnightly-tax-table/` and `/payg-withholding-tables/` (and weekly, monthly) | "tax tables fortnightly" 27.1k (15); "tax fortnightly table" 27.1k (16, ranked by the PAYG hub, not the fortnightly page); "payg fortnightly tax tables" 27.1k KD 2 (18); "fortnightly tax table 2026" 8.1k (12); "tax table 2026" 6.6k KD 10 (20) | 12 to 28 | The two URLs cannibalise each other: "tax fortnightly table" ranks the hub and "tax tables fortnightly" ranks the specific page. Make `/fortnightly-tax-table/` the only target for "fortnightly" in the title, H1 and internal anchors (remove "Fortnightly" from the hub title and anchors). Put a static ATO-style coefficient table and a PDF-style "download / print" link above the fold. Add "2025-26" and "2026-27" H2s (the ATO mid-FY rollover creates search for both). Total volume about 100k a month across about 12 variants. |
| Q2 | `/public-service-pay-scales/vic/` | "vps pay grades" 3.6k (10); "vps salary rates" (11); "vps pay rates" (12); "vps salaries/salary" (14); "vps pay scale" 1k (11) | 10 to 14 | Already page-1 adjacent. Add a VPS1–VPS6 grade × step table above the fold with the 2026 rates, make the H1 "VPS Pay Scale 2026 (VPS1–VPS6)", add jump links. Same table pattern as wagecalculator `/public-service-salaries/vic`, which has 3 to 5 positions. About 20k clicks of impressions already (GSC 200 clicks at pos 6.8). |
| Q3 | `/teacher-pay-australia/vic/` (hub: `/teacher-pay-australia/`) | "teacher salary victoria" family 9.9k ×8 (hub 38, VIC page 32 to 42); also QLD 2.9k ×15 (13 to 31), NSW 4.4k ×10 (22 to 34), WA 2.4k ×6 (44 to 52) | 13 to 52 | The hub outranks the state pages on state queries. Strip state-specific H2s and copy from the hub and link to each state with exact anchors ("Victorian teacher salary 2026"). On each state page: put the pay-scale table first, title it "{State} Teacher Salary 2026 (Scale and Step)", and add the classification and step language competitors use (VIC "Classroom teacher 1–13 / VGSA"). VIC is the largest unclaimed block: wagecalculator earns 30k ETV from `/teacher-salaries/vic`. |
| Q4 | `/healthcare-worker-pay/` or `/job-pay-rates/nurse/` | "nurse salary" and 6 variants 3.6k each (75 to 78, ranked via VIC and NSW state pages); "nurse wages australia" 2.4k (91); "registered nurse salary" 2.4k | 75 to 91 on generics; QLD page 14 to 27 on 2.9k ×25 | Generic nurse terms land on state pages by accident. Retarget `/healthcare-worker-pay/` root (or the nurse page) to "Nurse Salary Australia 2026 (RN, EN, NP)" with a state comparison table, and make the state pages target state terms only. For QLD: lead with the QHealth EA table and use "Queensland nurse pay rates" in H1. Wagecalculator earns 12.6k ETV from `/nursing-salaries/qld`. |
| Q5 | `/hecs-help-calculator/` + `/hecs-repayment-threshold/` | "hecs pay calculator" 6.6k (15); "calculate hecs repayment" 6.6k (29); "hecs repayment thresholds" 3.6k KD 5 (15, 16); "calculate hecs repayments" 6.6k (47) | 15 to 47 | Put the calculator above the fold on the threshold page and vice versa (they are splitting the vote). Add the new marginal-repayment table for 2026-27. paycalculator.com.au `/student-loan/` takes 2 on the same terms. Add "HECS repayment on $80,000" long-tail H2s. |
| Q6 | `/tax-withheld-calculator/` | "tax withheld calculator" 27.1k KD 38; "tax withholding estimator" 27.1k KD 11; "withholding tax calculator" 27.1k KD 10; "payg calculator" 22.2k KD 24; "payg withholding calculator" 2.9k KD 3 | homepage 79; page has no top-100 | The dedicated page is not ranking. Check indexing and the canonical in Search Console (it may be absorbed by the homepage). Link to it with the exact anchor "tax withheld calculator" from the homepage and from the nav. A KD-10 cluster at 27k searches per term, with paycal.com.au at 7 to 8 and taxstore at 3, is the single largest win in the whole data set. |
| Q7 | `/minimum-wage-australia/` vs `/minimum-wage-history-australia/` | "minimum wage rate australia" 49.5k KD 25 (96); "what is minimum wage in australia" 12.1k KD 25 (none); "minimum wage australia yearly/annual" 1.9k each (49 to 57) | 49 to 96, all on the history page | The history page ranks instead of the main page. Retitle the history page "Minimum Wage History Australia" and drop the "rate / yearly / annual" language from it. Point all internal "minimum wage" anchors at `/minimum-wage-australia/` and add "per hour, per week, per year, casual" blocks and the question headline "What is the minimum wage in Australia?" (12.1k). |
| Q8 | `/hospitality-award-rates/` | "hospitality award rates" 3.6k (14); "hospitality award" 5.4k (56); "award for hospitality" 5.4k and "hospitality industry awards" 5.4k (not ranked) | 14 to 56 | Add a Level 1–6 table with casual, Saturday, Sunday and public-holiday columns above the fold. Add H2s matching "award for hospitality" and "hospitality industry award". Fair Work holds 1 and fairworkmate 2 to 8 on the same page type. GSC already shows 14.6k impressions at pos 7.9, so a CTR fix on the title is worth testing too. |
| Q9 | `/redundancy-pay-calculator/` and `/redundancy-pay-guide/` | "redundancy payment calculator" 5.4k (28); "redundancy payment calculation table" 5.4k KD 3 (25); "redundancy calculator nsw" 1.3k (18); "redundancy payment" 8.1k (88 via the guide) | 18 to 88 | Put the NES weeks-by-years table (with the 4-week Over-45 bump) at the top of the calculator page, plus the "tax on redundancy" H2 ("is redundancy pay tax free" 720, "tax on redundancy payments" 1.3k). Link the guide to the calculator with the "redundancy payment calculator" anchor. Fair Work holds 1 on this page type. Add NSW and VIC sections for the state-labelled queries. |
| Q10 | `/pay-calculator-nsw/`, `-qld/`, `-vic/`, `-wa/` | "pay calculator nsw" 5.4k KD 15 (24); "wage calculator nsw" 5.4k KD 39 (21); "pay calculator qld" 1.9k (20); "vic salary calculator" 1.3k (20) | 20 to 27 | Make each state page a real state page, not a copy of the homepage: state payroll-tax threshold, public holidays, state minimum on state awards, long-service-leave state rule, WorkCover and TAFE links. Embed the calculator above the fold. These are the pages already on page 2 and are worth more than a new page. |

Next in line (not in the top 10):
- **Average salary.** `/average-salary-australia/` has no top-100 ranking. The cluster is "average wage australia" 27.1k KD 11, "average salary australia" 27.1k, "median salary australia" 8.1k and "what is the average salary in Australia" 6.6k KD 8. Retitle "Average Wage in Australia 2026 (ABS)", add a median table, and check indexation.
- **Seasonal.** `/centrelink-payment-dates/`: "centrelink christmas payment dates" 14.8k. Refresh by 15 Nov.
- **Time in lieu.** `/time-in-lieu/`: "toil" 4.4k. No ranking yet, so check indexation.
- **EBA search.** `/enterprise-agreement/`: "enterprise agreement search" 3.6k KD 5, "eba lookup" 3.6k. No ranking yet.
- **CTR fix.** `/junior-pay-rates/` has 93k impressions at pos 6.2 and a 0.43% CTR (GSC, 28d to 21 Sep). Test a new title and meta.
- **ADF ranks.** `/adf-pay-scales/`: "army ranks" 5.4k KD 11. No ranking for any rank term, so add a rank list table at the top.
- **Marginal-rate and tax-free-threshold terms.** "what is the tax free threshold" 3.6k ×2 and "tax free threshold 2026" 2.4k (38) are ranked by `/tax-brackets/` and not by `/tax-free-threshold/`. Resolve with the same cannibalisation fix as Q1.

---

## 3. Five programmatic families

| # | Family | Count | Combined volume (monthly) | Evidence and notes | Border |
|---|---|---|---|---|---|
| F1 | **Minimum wage by state** `/minimum-wage/{state}/` | 8 pages (NSW, VIC, WA, SA, TAS, QLD, ACT, NT) | about 5.8k | "minimum wage victoria" 1.9k KD 30, NSW 1.6k KD 26, WA 1k KD 23, SA 720 KD 22, TAS 260 KD 30, QLD 170, ACT 90. fairworkmate `/tools/minimum-wage` is 12 to 15. The national rate is the same everywhere, so each page must carry state specifics (state public holidays, state awards, apprentice and junior rates, payroll tax, LSL) or Google will treat them as duplicates. | Pass |
| F2 | **Award rate pages** `/{award}-award-rates/` | 17 awards: miscellaneous, building and construction, legal services, pastoral, fitness, electrical, plumbing, real estate, horticulture, health professionals, local government, live performance, mining, timber, meat industry, commercial sales, amusement | about 23.6k across the 17 heads | Volumes from the overview: 3.6k, 2.9k, 1.9k, 1.3k ×3, 1k ×4, 720 ×3, 590, 480 ×4. Each page can carry a level × (casual, Sat, Sun, PH) table. fairworkmate wins these at 8 to 15 with thin pages. Each award adds a long tail of "{award} level 3 pay rate" queries on the same page. | Pass |
| F3 | **Apprentice pay by trade** `/apprentice-pay/{trade}/` with year 1–4 tables | 10 pages (electrician built; carpenter, plumber, mechanic, hairdresser, bricklayer, boilermaker, painter, chef, butcher new) | about 6.2k (1.9k electrician already built, about 4.3k more) | "apprentice electrician pay" 1.9k, carpenter 880, plumber 720, mechanic 480, hairdresser 320, bricklayer 210, boilermaker 210, painter 170, chef 140, butcher 140. Fair Work holds 1 on the generic term, with Peninsula at 19. Currently we rank 29 to 39 for carpenter apprentice terms via `/construction-trades-pay/`. | Pass |
| F4 | **Unbuilt occupation salary pages** `/job-pay-rates/{occupation}/` | 50 pages with vol >= 300 | about 47k | Top terms: radiologist 2.9k, dentist 2.9k, project manager 2.4k, optometrist 2.4k, anaesthetist 2.4k, flight attendant 2.4k, actuary 1.9k, data analyst 1.6k, cyber security 1.6k, GP 1.6k, paralegal 1.3k, mortgage broker 1.3k, business analyst 1.3k, surveyor 1k, surgeon 1k. See `occupations-overview.csv`. Awarded occupations (retail manager, youth worker, prison officer, boilermaker, welder, forklift) pass cleanly. Professional-salary occupations are **conditional**: R3 only through take-home. Build the awarded ones first (Q: wave 4 flagged the same ones). | Pass for awarded, conditional for salaried |
| F5 | **PAYG tables by financial year** `/{weekly,fortnightly,monthly}-tax-table/{fy}/` | 9 pages (3 tables × FY 2024-25, 2025-26, 2026-27) | about 26k (weekly 2026 5.4k, fortnightly 2025 6.6k, fortnightly 2026 8.1k, "tax table 2026" 6.6k; plus smaller years) | The KD-0 prize flagged on 23 Sep. We rank 12 to 28 for the generic fortnightly terms on 2 URLs; FY-specific URLs separate them. Needs the older coefficient tables (NAT 1004 / 1006 for each year) and a clear "which table applies to my pay date" box because of the mid-FY rollover. Do this after Q1, not before, to avoid splitting the vote. | Pass |

Extra families worth a look but smaller:
- **Employer EA sections** on `/pay-rates/{employer}/` (Bunnings 1k, Coles 480, Woolworths 260, plus "eba pay rates" 260). Add a section to the existing pages first.
- **"How much do {occupation} get paid" question H2s** added to existing occupation pages (nurses 1.6k, lawyers 1.3k, firefighters 1k, electricians 1k, doctors 1k, GPs 1k, psychologists 880, dentists 880, pharmacists 720). No new URLs needed.
- **Police SA and firefighter WA state pages** (`police-pay` has no SA, `firefighter-pay` has no WA). WA police and firefighter volumes are about 260 and 140, so low priority.

---

## 4. Question and PAA-style queries (add as H2 or FAQ, no new URL needed)

Source: keyword_ideas on 25 question seeds, local filter for question stems and for keywords we do not already rank for. Volumes AU.

| Question | Vol · KD | Best home |
|---|---|---|
| what is minimum wage in australia | 12.1k · 25 | `/minimum-wage-australia/` (see Q7) |
| what is the average salary in australia | 6.6k · 8 | `/average-salary-australia/` |
| what is the tax free threshold (in australia) | 3.6k · 15 and 3.6k · 14 | `/tax-free-threshold/` |
| how much is parental leave pay | 1.6k · 2 (we are 46) | `/parental-leave-pay/` |
| what can i claim on tax / what can you claim on tax | 1.9k · 11, 1k · 11 | `/tax-deductions-guide/` |
| how long does a tax return take / how long does a tax refund take | 1.6k · 5, 1.3k · 1 | `/tax-refund-guide/` |
| how much do nurses get paid in australia | 1.6k | `/job-pay-rates/nurse/` |
| what is annual leave loading | 1.3k | `/leave-loading-calculator/` |
| what is marginal tax rate / marginal tax rates | 880 · 9, 880 · 18 | new `/marginal-tax-rates/` (#1) |
| how much annual leave is accrued per week | 880 · 3 | new `/annual-leave-calculator/` (#2) |
| what is a net pay | 880 · 5 | new `/net-pay-calculator/` (#3) |
| is redundancy pay tax free | 720 | `/redundancy-pay-calculator/` (Q9) |
| does sick leave roll over | 720 | `/sick-leave-calculator/` |
| what tax withheld means | 720 · 10 | `/tax-withheld-calculator/` |
| how much tax will i get back | 1.3k · 17 | `/tax-return-calculator/` |
| what is ytd on payslip | 480 | `/ytd-income-calculator/` (we are 32 to 33 for "what does ytd mean on payslip") |
| do you pay tax on super | 720 · 5 | `/superannuation-guide/` (border check: R3 weak) |

Rejected question stems: retirement age (4.4k, we have `/pension-age-australia/`), how much is the age pension (8.1k, covered by pension calculators), capital gains tax (out of border), stamp duty, GST, negative gearing.

---

## 5. Order of work (traffic per effort)

1. Q6 tax-withheld, Q7 minimum-wage URL swap, Q1 tax table cannibalisation. All are fixes to existing pages with 27k to 100k of search volume each.
2. New pages #1, #2, #3 (marginal-tax-rates, annual-leave-calculator, net-pay-calculator). About 55k combined, all core entity, KD 3 to 32.
3. Q3 teacher VIC and Q4 national nurse page, then Q2, Q5, Q8, Q9, Q10.
4. Family F5 (PAYG tables by FY) and F2 (awards, starting with miscellaneous and building and construction).
5. F3 apprentice pages, F1 minimum wage by state, F4 awarded occupations.
6. Re-measure about 20 Oct. The pages built after 23 Sep (payday-super, toil, EBA, ADF, Centrelink rates, average-salary) need a re-pull before concluding they are failing.

## Raw data (`docs/seo/data/2026-10-05-gap/`)

- `our-ranked-now.csv`: our ranked keywords (2,000 rows, vol >= 100 of 3,186 total).
- `our-ranked-raw.json`, `our-ranked-vol400.csv`: first pull (vol >= 400).
- `comp-paycalculator.csv`, `comp-wagecalculator.csv`, `comp-fairworkmate.csv`, `comp-paycal.csv`: competitor ranked keywords (top 15, vol >= 100).
- `awards-overview.csv`, `occupations-overview.csv`, `occ-state-overview.csv`, `patterns-overview.csv`, `candidates-overview.csv`: keyword overview checks.
- `ideas1.csv`, `ideas-questions.csv`: keyword ideas (1,000 rows each).
