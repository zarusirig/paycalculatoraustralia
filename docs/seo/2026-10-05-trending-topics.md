# Trending and Seasonal Topics, Oct 2026 to Mar 2027 (5 Oct 2026)

**Method.** DataForSEO `keyword_overview` (AU 2036; about 290 keywords in 3 calls, volume plus 12-month history, KD where returned), Google Trends `explore` rising queries (6 seeds, past 30 days), then every dated fact checked on an official source via Firecrawl. Spend about $0.35 (limit $3). Every candidate was checked against `routes.txt`, `subroutes.txt`, `lib/news.ts` slugs and the Wave 2/3/4 docs, so nothing below already exists as a route. Pages that exist but need a seasonal refresh are in the second table.

**Reading the numbers.** "Vol" is the current monthly AU average. "Trend" gives the last 12 months, newest first, and shows the seasonal peak. The big seasonal terms are high-KD date queries (Boxing Day, Christmas Eve), so the plan targets the pay long-tails (KD 1 to 5) and lets the date head terms come second. KD "-" means DataForSEO did not return one.

## A. New pages, ranked

| # | Topic | Target keyword | AU vol and trend | KD | Publish by | Type | Border | Source for the fact |
|---|---|---|---|---|---|---|---|---|
| 1 | On-demand delivery worker minimum pay ($31.30/hr, first FWC Minimum Standards Order, in force 17 Aug 2026) | delivery driver pay rate; doordash pay; uber eats pay | 260 / 390 / 320. Rising: delivery driver pay 880 in Aug vs 170 in Jul (+418%), doordash +84%, uber eats +50% | Uber Eats 8 | 12 Oct | Guide plus calculator (hourly floor vs your payout) | PASS. Links to hourly and gross-pay calculators; the reader checks a payout against the legal floor | https://www.fairwork.gov.au/newsroom/media-releases/2026-media-releases/august-2026/20260817-minimum-standards-for-delivery-drivers-media-release |
| 2 | Christmas Day, Boxing Day and New Year's Eve/Day pay, one page per day plus state table. 2026: Fri 25 Dec, Sat 26 Dec, additional holiday Mon 28 Dec, Thu 1 Jan 2027. Part-day Christmas Eve and NYE (6 or 7 pm to midnight) by state | christmas day pay rates; christmas penalty rates; public holiday rates; boxing day public holiday | 210 / 70 / 1.6k / 880. Dec 2025 peaks: 1,600 / 590 / 2,900 / 8,100 | 1 (penalty rates), 2 (public holiday pay), 66 (Boxing Day head term) | 15 Nov | Calculator pages (extend `/public-holiday-pay/`) | PASS. Public-holiday pay calculator; payslip check on casual and penalty loading | https://www.fairwork.gov.au/employment-conditions/public-holidays/2026-public-holidays |
| 3 | Public holidays 2027 with pay (dates plus rate by state). 2027: Sat 25 Dec with additional Mon 27 Dec; Good Friday 26 Mar; Easter Monday 29 Mar | public holidays 2027 | 6.6k, rising: 22.2k Aug vs 1.0k a year ago | 17 | 25 Oct | Guide plus calculator. Pay-framed, not a bare date list | PASS only if each holiday carries the pay-rate calculator (Wave 4 excluded bare date pages) | https://www.fairwork.gov.au/employment-conditions/public-holidays/2027-public-holidays |
| 4 | $250 Working Australians Tax Offset from 2027-28, plus the 15% to 14% rate cut on 1 Jul 2027 (law: Royal Assent 26 Jun 2026) | working australians tax offset; tax cuts 2027 | 260 and 10, fading from a May Budget spike (1,600 to 320). Will re-spike each Budget and Jul 2027 | 13 | 31 Oct | Calculator (take-home 2027-28 vs 2026-27) | PASS. Tax-changes and income-tax calculators; shows next year's payslip. Only a news mention exists, no calculator page | https://treasury.gov.au/policy-topics/taxation/budget2026-27 ; https://www.ato.gov.au/about-ato/new-legislation/latest-news-on-tax-law-and-policy |
| 5 | Late tax return penalty and the 31 Oct deadline | late tax return penalty; tax return penalty | 390 and 140. Oct 2025 peak 1,600 and 720. Trends rising: "ato tax return prosecutions fines" | 11 | 10 Oct | Guide plus failure-to-lodge penalty calculator | CONDITIONAL PASS. Light-touch ATO territory; passes only if it links to the tax return calculator and refund estimate. Verify the penalty-unit value before building | Deadline per existing `/tax-return-2026/`; confirm penalty unit at https://www.ato.gov.au |
| 6 | Apprentice pay rates by year, plus the Jan to Feb intake | apprentice pay rates / apprentice wages / apprenticeship wages (one SERP); apprentice wages calculator | 880 each (1 SERP); calculator 110; electrician apprentice wages 1.9k (page exists). Flat all year, step up Jan to Feb | 9 (calculator) | 15 Jan | Calculator plus rate table | PASS. Award minimum vs payslip; links to weekly and hourly calculators. The 2026-08-28 GSC note flags apprentice constants as `_UNVERIFIED`, so verify against the award first | Award rates via https://www.fairwork.gov.au/pay-and-wages/minimum-wages |
| 7 | Graduate salary hub (law, nursing, engineering, accounting, teaching, intern doctor) | graduate lawyer salary; graduate nurse salary; graduate engineer salary; graduate accountant salary; graduate teacher salary | 320 / 260 / 260 / 210 / 210 (cluster about 1.7k with intern doctor 140). Flat | 6 to 7 (teacher) | 31 Jan | Guide plus take-home links | PASS. First-payslip framing; links to take-home pay, HECS and first-job guide. Graduate programs open Mar to May | JSA and award data, not yet fetched |
| 8 | WPI release 18 Nov 2026 (Sep qtr) and 17 Feb 2027 | wage price index | 1.0k (peak 1.6k). Flat, release-day spikes | 2 | 18 Nov | News (same day) plus pay-rise calculator link | PASS. Is your rise above WPI; pay-rise calculator | https://www.treasury.act.gov.au/__data/assets/pdf_file/0006/399993/WPI.pdf (quotes ABS: "Next Release Date: 18 November 2026"). Confirm Feb date on abs.gov.au |
| 9 | Melbourne Cup Day pay (Tue 3 Nov 2026, VIC, regional variations) | melbourne cup day 2026 | 1.6k (Aug 5.4k, climbing to Nov) | - | 20 Oct | Guide plus VIC public-holiday calculator | PASS. State public holiday pay; reuses the 2026 VIC data | https://www.fairwork.gov.au/employment-conditions/public-holidays/2026-public-holidays |
| 10 | Low Income Super Tax Offset (LISTO), boosted from 1 Jul 2027 | listo; low income super tax offset; lmito | 880 / 590 / 110. Oct 2025 peak 2,400 | - | 20 Oct | Calculator | PASS. Super on payslip; superannuation calculator. No LISTO page exists | https://www.ato.gov.au/about-ato/new-legislation/latest-news-on-tax-law-and-policy (LISTO boost 1 Jul 2027, Royal Assent 13 Mar 2026). Check eligibility details before building |
| 11 | Easter 2027 pay (Good Fri 26 Mar, Sat 27 Mar, Easter Sunday 28 Mar, Mon 29 Mar) and Australia Day (Tue 26 Jan 2027) | public holiday rates; easter public holiday pay; australia day 2027 public holiday | Public holiday rates spiked 5,400 in Apr 2026. Easter 2027 50 (growing 170 in Aug). Australia Day 2027 480 (Aug 1,300) | 33 (both date terms) | 1 Mar (Easter); 5 Jan (Aus Day) | Guide plus calculator (extend #2 template) | PASS. Same public-holiday pay calculator | https://www.fairwork.gov.au/employment-conditions/public-holidays/2027-public-holidays |
| 12 | Carry-forward concessional contributions (unused cap from 5 prior years) | carry forward concessional contributions | 1.6k. Seasonal: 4,400 in Jun, 1,300 in Aug | - | 31 Mar (before the Jun peak) | Calculator | PASS. Salary-sacrifice and super calculators; ties to `/concessional-contributions-cap/` | https://www.ato.gov.au/about-ato/new-legislation/latest-news-on-tax-law-and-policy (caps). Cap figures already in `lib/news.ts` |
| 13 | Christmas and New Year shutdown leave: employer-directed annual leave | christmas leave; christmas closedown; annual leave on public holiday | 260 / 30 / 90. Dec 2025 peaks 1,000 / 90 / 170 | 17 / 45 / - | 15 Nov | Guide | PASS. Leave to pay conversion; leave calculator. Low volume, cheap to ship with #2 | https://www.fairwork.gov.au/employment-conditions/public-holidays/2026-public-holidays |
| 14 | Termination and redundancy tax (ETP, genuine redundancy cap) | redundancy tax; termination payment tax; lump sum tax; genuine redundancy tax free | 480 / 260 / 110 / 70. Flat | 3 (termination) | Any time | Calculator (tax on payout) | PASS. Extends the redundancy and final-pay calculators. Evergreen filler, not seasonal | ATO: https://www.ato.gov.au/tax-rates-and-codes (verify cap before building) |
| 15 | Delivery rider and gig earnings bundle: ride-share earnings after tax (spillover from #1) | uber driver earnings | 590, rising to 880 in Aug (+49%) | - | 25 Oct | Guide plus calculator | CONDITIONAL. Passes only as the contractor tax and GST calculator; fails if it becomes an income-claim page | https://www.fairwork.gov.au/newsroom/media-releases/2026-media-releases/august-2026/20260817-minimum-standards-for-delivery-drivers-media-release |

## B. Existing pages that need a seasonal refresh (do not create new routes)

| Existing route | Why and when | Evidence |
|---|---|---|
| `/centrelink-payment-dates/` | "centrelink christmas payment dates" is 14.8k average and 165,000 in Dec 2025 (720 in Jan). Add a Christmas and New Year 2026 table the day Services Australia publishes it (early Dec). Services Australia only published the 2025 media release (8 Dec 2025), so the 2026 dates are not out yet. Border is light-touch, but the sub-cluster is already approved | https://www.servicesaustralia.gov.au/public-holiday-reporting-and-payment-dates |
| `/junior-pay-rates/` and `/news/junior-pay-rates-december-2026` | FWO says changes "could start from 1 December 2026", gradual, further hearings pending. The FWC page lists a timetable; one third-party post claims "first full pay period on or after 1 Dec 2026". Confirm on the FWC page before stating a start date. Terms: junior pay rates 390 (Mar 2026 peak 1,900) | https://www.fairwork.gov.au/about-us/workplace-laws/award-changes/major-award-changes/junior-wage-changes-to-retail-fast-food-and-pharmacy-awards ; https://www.fwc.gov.au/hearings-decisions/major-cases/junior-rates-application-am202424 |
| `/schads-award-pay-rates/` | "schads award 2026" 4.4k avg, 18.1k in Jun to Jul, 9.9k in Aug, decaying. A Dec 2026 SCHADS rise news page already exists; link the two | DFS history |
| `/bonus-tax-calculator/` | "christmas bonus" 390 (3,600 in Dec 2025, KD 5). Intent is partly the Centrelink bonus, so disambiguate in an H2 | DFS history |
| `/tax-return-2026/` | Add "do i need to lodge a tax return" (880, 2,400 in Oct 2025, KD 5) and "how to lodge a tax return" (1.6k, 6,600 in Jul). Rising Trends: "when do i have to lodge my tax return" | Trends rising list |
| `/teacher-pay-australia/{state}/` | Trends rising: "when do teachers get a pay rise" (+182,650%), plus nsw/qld/vic teacher pay rise. "teacher salary victoria" 9.9k, nsw 4.4k, qld 2.9k. Add a "when does the rise land" FAQ with dates | Trends rising list |
| `/hecs-help-calculator/` | "hecs repayment table" 320 (KD 4), "is hecs interest free" 210, "how much hecs do i have to pay" 170. Trends rising on hecs repayment table, stsl component | Trends rising list |
| `/news/age-pension-increase-march-2027` (new news slug; the Sep 2026 one exists) | Indexation 20 Mar 2027. Rates from 20 Sep 2026 run to 19 Mar 2027. Publish about 1 Mar. "age pension rates" 12.1k flat; "age pension increase" 1.3k | https://www.servicesaustralia.gov.au/some-payment-rates-are-increasing-20-september-2026 ; https://www.dss.gov.au/income-support-payments/social-security-indexation |

## C. Considered and rejected

| Topic | Volume | Reason |
|---|---|---|
| Negative gearing, CGT discount change | 40.5k / 110 | Fails R2 and R3 (property and investment tax; the border lists CGT as light-touch only). The reform date (1 Jul 2027) is real, per Treasury |
| Division 296 calculator | 210 | Wealth-tier ($3m+), not a payslip check (R3). News pages exist already |
| PAYG instalments | 1.6k | Business tax (out of scope) |
| Back to school payment | 0 | No volume, not pay |
| Summer and Christmas casual job pay | about 50 | Too small; covered inside #2 |
| RBA / interest rate rise, CPI, "wages of fear", Pauline Hanson super policy (Trends rising) | n/a | Off-border or noise |
| Super 12% | 30 | Rate is static; covered by the SG rate pages |
| Medicare levy | 18.1k | Page exists (`/medicare-levy/`) and the thresholds news page exists |

## Verification log

| Fact | Status |
|---|---|
| 2026 holidays (25 Dec, 26 Dec, 28 Dec, 1 Jan 2027, 26 Jan 2027, 3 Nov Melbourne Cup) | Verified, Fair Work 2026 page |
| 2027 holidays (Christmas Sat 25 Dec with Mon 27 Dec, Good Fri 26 Mar, Easter Mon 29 Mar) | Verified, Fair Work 2027 page |
| $31.30/hr delivery minimum, in force 17 Aug 2026 | Verified, FWO media release |
| $250 WATO (2027-28), 14% rate from 1 Jul 2027, Royal Assent 26 Jun 2026 | Verified, Treasury plus ATO legislation list |
| LISTO boost 1 Jul 2027 | Verified in the ATO legislation list. Eligibility detail not read |
| Junior pay start 1 Dec 2026 | Official wording is "could start". Not confirmed as a fixed date |
| WPI next release 18 Nov 2026 | Secondary (ACT Treasury quoting ABS). Confirm on abs.gov.au before publishing |
| Age pension period 20 Sep 2026 to 19 Mar 2027 | Services Australia and DSS indexation pages; March 2027 rates not yet announced |
| NCC cap $130,000 (2026-27) | Seen only on UniSuper, not an official source. Not used |

## Suggested build order

1. This week: #5 (late lodgement, deadline 31 Oct), #1 (delivery minimum, momentum), #4 (WATO and 2027 tax cuts).
2. Late Oct to mid Nov: #3, #9, #2, #13, #10.
3. 18 Nov: #8 (WPI). Early Dec: Centrelink Christmas refresh (table B).
4. Jan to Mar: #6, #7, #11, #12, and the age pension March news slug.
