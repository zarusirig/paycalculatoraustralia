# Wave 4 — Keyword Opportunities (24 Sep 2026)

**Method.** DataForSEO Labs, AU (2036), en. `keyword_ideas/live` ×2 (26 seeds from our strongest clusters: award rates, pay rates by job, Centrelink, salary after tax, payslip, leave, overtime, super, tax offsets, state and public-sector pay; filters vol ≥ 300, KD ≤ 25; 1,270 ideas returned), `ranked_keywords/live` for fairworkmate.com.au and wagecalculator.com.au (1,000 each, ordered by ETV, aggregated by URL), then `keyword_overview/live` on 71 shortlisted terms. Each candidate was checked against the live route list (`app/`, `lib/data/*` slug registries) and against Wave 2 (`2026-09-23-wave2-trending-pages.md`) and Wave 3 (`2026-09-23-wave3-topical-authority.md`) so nothing duplicates. Excluded by brief: public holiday date pages, hourly-after-tax programmatic, news.

**Border check** (contextual-borders-and-audience-map.md): R1 links organically to a calculator; R2 ≤ 3 degrees from "Australian pay calculation"; R3 the reader can use it to check a payslip or payment. **Traffic estimate** = monthly volume × ~8% (a top-5 position on KD 0–12 SERPs), rounded; treat as a ceiling for month 3–6.

**Spend.** My calls: keyword_ideas $0.132 + $0.044, ranked_keywords $0.132 × 2, keyword_overview $0.020 = **$0.46**. (Account balance went $22.84 → $22.00 over the session; the difference includes other agents' concurrent calls.)

## Ranked opportunities

| # | Page (status) | Target keywords (AU vol, KD) | Border R1 / R2 / R3 | Est. clicks/mo |
|---|---|---|---|---|
| 1 | `/sick-leave-calculator/` **BUILT** | sick leave 8.1k (5), carer leave 5.4k (12), personal leave 2.9k (0), personal/carer's leave 1k (0), sick leave calculator 720 (0), sick leave calculator 38-hour week 590 (0) | Accrual calculator / leave → pay / sick leave balance and pay on payslip | ~1,500 |
| 2 | `/job-pay-rates/{radiographer, sonographer, speech-pathologist, audiologist, podiatrist, dietitian}/` **BUILT** (6 pages) | radiographer salary 3.6k + …australia 1k; sonographer salary 3.6k + sonographer pay 3.6k + …australia 1.3k; speech pathologist salary 3.6k; podiatrist salary 1k; audiologist salary 880; dietitian salary 720 (all KD 0) | Take-home links / award → pay / award minimum vs payslip | ~1,300 |
| 3 | `/disability-support-pension-calculator/` **BUILT ON MAIN BY H3** (this branch built one in parallel; dropped at merge in favour of main's) | disability pension 8.1k (4), centrelink disability pension 2.9k (5), dsp rates 1.3k (0), disability pension amount 390, assets test 390 | Calculator / income test on wages / payment amount each fortnight | ~900 |
| 4 | `/compassionate-leave/` **BUILT** | compassionate leave 9.9k (0), family and domestic violence leave 720 (2) | Leave-pay calculator / NES leave → pay / paid or unpaid on payslip | ~850 |
| 5 | `/ote-salary/` **BUILT** | ote meaning salary 3.6k, ote definition salary 3.6k, what is ote 1.3k, what does ote mean (in) salary 720 ×2, ote salary 480 (all 0) | OTE calculator + take-home / super on commission / checks commission, SG on payslip | ~700 |
| 6 | `/job-pay-rates/veterinarian/` **BUILT** | vet salary 1.9k, veterinarian salary australia 720, vet salary australia 720, salary veterinarian australia 720 (all 0) | Take-home / award → pay / award minimum | ~250 |
| 7 | `/job-pay-rates/architect/` **BUILT** | architect salary 2.4k, architectural salary 2.4k, architect and salary 2.4k (one SERP), architect salary australia 390 (all 0) | Take-home / award → pay / award minimum | ~250 |
| 8 | `/jury-duty-pay/` **BUILT** | jury duty pay 1.3k (0), community service leave 390 (0) | Make-up pay calculator / NES leave → pay / employer make-up pay on payslip | ~130 |
| 9 | APS classification pages (`/public-service-pay-scales/aps/aps-6/` etc.) — backlog | aps 6 pay rate / aps 6 salary / aps6 salary 1.9k each, aps 5 salary 1.3k, aps4 salary 1k, el1 salary 880, el2 590, aps3 480 | Pass (take-home per band) | ~600 — **check first** whether `/public-service-pay-scales/aps/` already ranks for these (wagecalculator earns 1,875 ETV from its one APS page, so a single strong page may be enough) |
| 10 | Public service NT / TAS / ACT (`public-service-pay-scales/{nt,tas,act}`) — backlog | nt government pay scales 480, ntg pay scales 480 (TAS/ACT under 100) | Pass | ~70 — `JurisdictionSlug` already reserves the slugs; needs EA scraping |
| 11 | Flight attendant, train driver occupations — backlog | flight attendant salary 2.4k, qantas flight attendant salary 720, train driver salary 1.6k, tram driver salary melbourne 720 (all 0) | Pass | ~300 — cabin crew rates sit in airline EAs, and train drivers in state rail EAs, so the award minimum alone would mislead; needs EA work |
| 12 | School support staff pay by state — backlog | education support salary 1.3k (7), slso pay rate nsw 480 ×4 variants, sso pay rate 480 ×2 | Pass | ~150 — `/job-pay-rates/teacher-aide/` covers the award; state EAs (VIC ES, NSW SLSO, SA SSO) not built |
| 13 | Employers batch (KFC, Hungry Jack's, Big W) — **built on main by H1** (17 employer pages); Aldi still open | aldi pay rates 320 | Pass | ~25 |
| 14 | Notice period — backlog | notice period fair work 1.3k (4), notice period calculator 70 | Pass | ~100 — the NES table already lives on `/final-pay-calculator/`; a standalone page risks cannibalising it. Better: retitle a section there |
| 15 | Super on overtime / casual super — sections, not pages | is super paid on overtime 590, do casual employees/workers get super 480 ×2 | Pass | add to `/superannuation-guide/` FAQs |

## Competitor clusters we still lack (from ranked_keywords)

- **fairworkmate.com.au** (21,230 ranked keywords): top URLs by ETV are Centrelink tools (parenting payment, family tax benefit, youth allowance, jobseeker — we have all), `/wiki/centrelink-payment-rates` (2,686 ETV; "how much is jobseeker payment" 2.9k, "centrelink payment rates" 2.9k KD 14 — our per-payment calculators cover the rates, but there is no single rates table; worth a hub after the 1 Jan student-rate indexation), employer blogs (McDonald's, Coles, Woolworths, Bunnings, Kmart, Chemist Warehouse, Subway — we have; **KFC and Big W** now built on main by H1; **Guzman y Gomez** still open), job pay rates (we cover all but warehouse worker and delivery driver, 260 each), public holidays (excluded).
- **wagecalculator.com.au** (8,708): 62% of ETV is the homepage. In-border URL clusters: teacher/nursing/public-service salaries by state (we have, except **public service NT**, #10), LSL calculator by state (we have), ADF pay by service (we have), `/salary/{n}` (we have). Its stamp duty and land tax calculators are off-border.

## Rejected (fail a border rule)

- Politician and celebrity salaries ("prime minister salary" 1.9k × 8 variants, governor-general, sports stars) — R3: not the reader's pay.
- Job boards and hiring ("nsw government jobs" 12.1k, "work from home jobs" 22.2k, "services australia jobs", "work at coles") — navigational, R1/R3 fail.
- "unfair dismissal" 5.4k — employment law, not pay (R3); only the high income threshold angle is in-border and it is on `/ote-salary/`.
- Workers compensation acts, statutory declarations, NDIS support coordination, Linkt tolls, stamp duty, land tax, overseas salaries (UK, Japan, India) — outside the border.

## What was built (commits on this branch)

Note: a DSP calculator was also built here (commit 7ff256d) but H3 merged its own `/disability-support-pension-calculator/` to main first, so this branch takes main's page at merge. (Both versions independently flagged the same Services Australia typo: the DSP rates page's $65.50 couple Pension Supplement contradicts its own $933.00 total; $66.50 is correct.)

| URL | Title | Sources (read 24 Sep 2026) |
|---|---|---|
| /job-pay-rates/radiographer/ … /dietitian/ (6) | "{Job} Salary Australia 2026 — $32.09/hr Award Minimum" | HPSS Award MA000027 Schedule B + cl 17.2–17.5, Schedule C.2.3; JSA medians (podiatrist N/A) |
| /sick-leave-calculator/ | Sick Leave Calculator Australia: Personal & Carer's Leave | FWO paid sick and carer's leave, payment, evidence, unpaid carer's leave, cashing out, final pay, fact sheet |
| /compassionate-leave/ | Compassionate Leave Australia: 2 Days Paid Bereavement Leave | FWO compassionate leave, fact sheet, FDV leave |
| /ote-salary/ | OTE Salary Meaning: On-Target Earnings + Calculator | ATO ordinary time earnings list, FWC high income threshold ($190,100), FWO commission payments |
| /jury-duty-pay/ | Jury Duty Pay Australia: Make-Up Pay Calculator | FWO jury duty (worked examples are unit tests) |
| /job-pay-rates/veterinarian/ | Vet Salary Australia 2026 — $34.20/hr Award Minimum | Animal Care and Veterinary Services Award MA000118 cl 15.3, 16.3, 20.2, 27.3, Sched B; JSA 2347 |
| /job-pay-rates/architect/ | Architect Salary Australia 2026 — $39.77/hr Award Minimum | Architects Award MA000079 cl 4.2, 13, 17, 23.3, Sched B; JSA 2321 |
