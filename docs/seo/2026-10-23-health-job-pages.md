# Health job pages: public hospital pay by state (23 Oct 2026)

Goal: win "{job} salary australia" for pharmacist, radiographer, physiotherapist and psychologist (plus occupational therapist and sonographer, which use the same state rows). Same URLs, no new URLs, sitemap untouched.

Rivals on page 1 (Indeed, Glassdoor, jobsandskills.gov.au) show one average. These pages now show the real, sourced pay scale for the employer most of these people work for: the state public hospital system, grade by grade, in five states.

## What changed

- New data module `calc-boiler/lib/data/public-health-allied-pay/` (types, nsw, vic, qld, wa, sa, index, tests). One table per state per profession, copied from each instrument's published pay table, each with its source column, operative date, verified date (23 October 2026), next scheduled rise (only SA has one) and a proof quote.
- New page pieces in `calc-boiler/modules/guide/job-pay-public-hospital.tsx`, wired into the shared occupation template (`job-pay-rates-occupation.tsx`). They render only when an occupation sets `publicHospital`, so the other 74 job pages are unchanged.
  - **Answer box** under the H1: "How much does a {job} earn in Australia?" with the JSA median, the ATO average taxable income (2023-24, Table 15A), the private-sector award minimum, and the public hospital range in each verified state, each linked to its table.
  - **"Public hospital {job} pay by state"** section, first in the article: one table per state with weekly (where set), fortnightly (published, or weekly x 2), yearly (published, or weekly x 52), after-tax a year and after-tax a fortnight (site tax engine, `afterTax`), plus SA's printed May 2027 column. Entry rules, profession notes, instrument status and a "states not shown yet" list.
  - Sidebar line with the hospital range; sources and methodology list the state instruments.
- Each page now sets `ato` (Table 15A rows), so it uses the salary-page layout (ATO income, median, take-home on each figure) before the award tables. Award notices moved down to sit with the award tables.
- Salary-led `<title>`, H1, meta description and lede, all built from the data (`lib/data/job-pay-rates/public-hospital-common.ts`), so no figure is typed into copy.
- Query-led FAQs first (from GSC), award FAQs kept after them. FAQ figures are read from the tables by label; a test fails if a lede or FAQ quotes a dollar figure the data does not hold.
- `dateModified` 2026-10-23 on all six pages.

### Titles

| Page | Before | After |
|---|---|---|
| pharmacist | Pharmacist Pay Rates Australia 2026 - $41.74/hr Award Minimum | Pharmacist Salary Australia 2026: $101,712 Median, Pay by State |
| radiographer | Radiographer Salary Australia 2026 - $34.44/hr Award Minimum | Radiographer Salary Australia 2026: $122,720 Median, Pay by State |
| physiotherapist | Physiotherapist Pay Rates Australia 2026 - $34.44/hr Minimum | Physiotherapist Salary Australia 2026: Hospital Pay by State |
| psychologist | Psychologist Pay Rates Australia 2026 - $38.02/hr Award Minimum | Psychologist Salary Australia 2026: $114,608 Median, Pay by State |
| occupational-therapist | Occupational Therapist Pay Rates 2026 - $34.44/hr Award Minimum | Occupational Therapist Salary Australia 2026: Pay by State |
| sonographer | Sonographer Salary Australia 2026 - $35.19/hr Award Minimum | Sonographer Salary Australia 2026: $122,720 Median, Pay by State |

All titles are 65 characters or fewer (tested). The median is the JSA weekly median x 52.

## Source table

All read 23 October 2026 with Firecrawl (raw markdown and PDF text, no structured extraction). Figures copied, not computed, except weekly x 52 and weekly x 2, which the pages label.

| State | Instrument | Covers | URL | Rates used | Next rise in the instrument | Proof quote |
|---|---|---|---|---|---|---|
| NSW | Health Employees' Pharmacists (State) Award 2025 (IRC NSW) | pharmacists | https://www.health.nsw.gov.au/careers/conditions/Awards/hsu-he-pharmacists.pdf | 4th column, ffppoa 1 July 2026 (weekly) | None (award runs 2 years from 1 July 2025) | cl 8(i): "the rates in the fourth column in Table 1 of Part B – Monetary Rates shall apply from the first full pay period on or after (ffppoa) 1 July 2026." Table 1: "1st Year \| Weekly \| 1604.76 \| 1668.95" |
| NSW | Health Employees' Medical Radiation Scientists (State) Award 2025 (IRC NSW) | radiographers (35-hour week) | https://www.health.nsw.gov.au/careers/conditions/Awards/hsu-he-medical-radiation-scientist.pdf | 4th column, ffppoa 1 July 2026 (weekly) | None | cl 7(i), same wording. "Radiographer \| Level1(35hrs) \| Year1 \| Weekly \| 1463.71 \| 1522.26". Determination 25 of 2023: new fully registered graduates start at "Level 2 Year 1"; "remains in force until 30 October 2026 unless rescinded or replaced earlier" |
| NSW | NSW Health Service Health Professionals (State) Award 2025 (IRC NSW) | physiotherapists, occupational therapists | https://www.health.nsw.gov.au/careers/conditions/Awards/health-professional.pdf | 4th column, ffppoa 1 July 2026 (annual) | None | cl 14.1, same wording. "Level 1 \| Year 1 \| Annual \| 76364 \| 79419". Schedule A lists Occupational Therapist and Physiotherapist (not psychologists or sonographers) |
| NSW | Health and Community Employees Psychologists (State) Award 2025 (IRC NSW) | psychologists | https://www.health.nsw.gov.au/careers/conditions/Awards/hsu-hc-psychologists.pdf | 4th column, ffppoa 1 July 2026 (annual) | None | cl 9(i), same wording. "1st year of service \| Annual \| 80452 \| 83670". Full registration starts at year 3 |
| VIC | Allied Health Professionals (Victorian Public Sector) (Single Interest Employers) EA 2021-2026, AE518146 (FWC) | physios, OTs, radiographers, sonographers | https://westernhealth.org.au/sites/default/files/2025-08/Health%20Professionals%20VPS%20Agreement%202021%20-%202026.pdf (FWC-approved text hosted by Western Health) | Appendix 2 Part A, "1-MAR-25" (weekly) | None. Nominal expiry 28 Feb 2026, still operating | FWC [6]: "will operate from 18 November 2022. The nominal expiry date of the Agreement is 28 February 2026." cl 28.1(d): "2% effective from FFPPOA 1 March 2025." |
| VIC | Medical Scientists, Pharmacists and Psychologists Victorian Public Sector (Single Interest Employers) EA 2021-2025, AE518208 (FWC) | pharmacists, psychologists | https://westernhealth.org.au/sites/default/files/2026-02/Medical%20Scientist%20Pharmacists%20%20Psychologists%20Enterprise%20Agreement%202021-25.pdf | Schedule 2, "FFPPOA 1-Dec-24" (weekly) | None. Nominal expiry 30 Nov 2025, still operating | FWC [5]: "will operate from 28 November 2022. The nominal expiry date of the Agreement is 30 November 2025." cl 51.1(e)(iv): "2% effective first full pay period on or after (FFPPOA) 1 December 2024." Row "SW5 \| Pharmacists \| 1 \| 1 \| ... \| $1,312.40" |
| VIC | (status) FWC approved-agreement lists | | https://www.fwc.gov.au/documents/agreements/resources/agreements2022.xlsx and .../agreements2026.xlsx | | | 2022 list has AE518146 and AE518208. 2026 list (generated 19 Oct 2026) has no replacement for either. Premier of Victoria, 20 Aug 2026: new HSU Vic No. 4 deal "covers medical scientists, hospital pharmacists, psychologists..." (not approved, so not shown) |
| QLD | Health Practitioners and Dental Officers (Queensland Health) Award – State 2015, reprint as at 1 Sept 2026 (QIRC) | all six professions, HP3 to HP8 | https://www.qirc.qld.gov.au/sites/default/files/2026-09/health_practitioners_010926.pdf | cl 12.3(a), fortnightly and reference annual (fortnightly x 26.089) | None. HPDO5 in QIRC arbitration since June 2026 | "Following the general ruling made by the Commission in the 2026 State Wage Case ... reprinted ... as at 1 September 2026." Note 1: "Includes the arbitrated wage adjustment payable under the 1 September 2026 Declaration of General Ruling." Row "HP3 \| 0 \| \| 3,213 \| 83,824" |
| QLD | (why the award, not HPDO4) HPDO Certified Agreement (No. 4) 2022 | | https://www.qirc.qld.gov.au/sites/default/files/2024-11/2023_cb43_reprint_230924.pdf | | | HPDO4's last rates (17 Oct 2024) are below the 1 Sept 2026 award at all 24 pay points HP3.0 to HP8.5 (checked one by one; HP3.0 $3,030.00 vs $3,213). Queensland Health's wage-rate page (Firecrawl search result; site not scrapable) lists "Wage rates from 1 September 2026 ; HP1 At age 21 · 4, $2,736.00", matching the award |
| WA | WA Health System - HSUWA - PACTS Industrial Agreement 2024 (WAIRC, AG 23 of 2025, [2025] WAIRC 00175) | all six professions, P-1.1 to P-9 | https://downloads.wairc.wa.gov.au/agreements/wah043.pdf | Schedule 2, "On and from 1 July 2026" (3.75%, annual) | None. Expires 30 June 2027 (cl 6.2) | Schedule 2 header "On and from 1 July 2024 \| On and from 1 July 2025 \| On and from 1 July 2026" / "5% \| 4% \| 3.75%"; "P-1.1 \| $80,963 \| $85,011 \| $88,411 \| $91,726". cl 21.5 lists Pharmacist, Physiotherapist, Psychologist, Medical Imaging Technologist, Sonographer, Occupational Therapist |
| SA | Allied Health Professionals, Assistants and Psychologists Enterprise Agreement 2025 (SAET ET-25-02906; varied ET-26-00567, parties only) | all six professions, AHP-1 to AHP-6 | https://www.saet.sa.gov.au/app/uploads/2025/08/2906AHPEAOrderUndertaking.pdf | Schedule 2.1, "First full pay period on or after 1/5/2026" (annual) | ffpp on or after 1 May 2027 (printed, shown as a column) | cl 19.1: dates "1 May 2025 ... 1 May 2026 ... 1 May 2027 ... 1 May 2028". "AHP-1 \| 3 year degree \| $68,478 \| $71,217 \| $73,710 \| $76,290 \| $78,197" |
| All | ATO Taxation statistics 2023-24, Individuals Table 15A, Total rows | | https://data.gov.au/data/dataset/taxation-statistics-2023-24/resource/3286e287-ee87-4be4-87b2-56c5c6602009 | 251511, 251512, 251513, 251211, 251214, 252411, 252511, 272311 to 272314, 272399 | | e.g. "2515 Pharmacist \| 251511 Hospital pharmacist \| Total \| 6,939 \| 97,458 \| 96,680 \| 92,327 \| 94,928" |

Raw source text is in the agent scratchpad (`src/*.md`), not committed.

## Not verified / not shown

- **NSW sonographers**: sonographer is not a classification in either NSW Health award read (medical radiation scientists; health professionals). Shown as "not shown yet" on the sonographer page.
- **Tasmania, ACT, NT**: not checked in this pass.
- **Victorian radiographer interns**: the agreement prints intern rates, but an FWC undertaking ties 3-year-degree radiographers to the federal HPSS award, which was restructured on 1 October 2026, so the printed intern figure may not be the rate paid. Left out.
- **Victoria vs the federal award floor**: VIC rates have not moved since March 2025 / December 2024. Some steps (for example the pharmacist Grade 1 year 2 rate, $1,388.00 a week, against the HPSS AQF 7 2nd to 3rd year rate of $1,409.00) may now sit below the award minimum. The page says the higher award minimum applies where it covers you; it does not try to map steps.
- **QLD Health page itself** could not be scraped (Firecrawl does not support health.qld.gov.au); confirmed via search result text only. Figures come from the QIRC award.

## Watch list (dates that can change these tables)

- **30 Oct 2026**: NSW MRS Determination 25 of 2023 (graduate start at Level 2, year 1) expires unless replaced. The page states the expiry.
- **Victoria**: when the HSU Vic No. 4 agreement (pharmacists, psychologists) is approved by the FWC, replace the MSPP columns; same for the allied health replacement (VAHPA bargaining).
- **Queensland**: HPDO5 arbitration outcome.
- **WA**: agreement expires 30 June 2027. **SA**: next column 1 May 2027 is already in the data (`nextAnnual`).

## GSC baselines (28 days to 21 Oct 2026) for the re-measure around 20 Nov 2026

| Page | Impressions | Clicks | CTR | Avg position | Head term (monthly searches) |
|---|---|---|---|---|---|
| /job-pay-rates/pharmacist/ | 4,142 | 37 | 0.89% | 7.0 | pharmacist salary 4,400 |
| /job-pay-rates/radiographer/ | 3,393 | 38 | 1.12% | 6.8 | radiographer salary 3,600 |
| /job-pay-rates/physiotherapist/ | 1,052 | 8 | 0.76% | 8.1 | physiotherapist salary 3,600 |
| /job-pay-rates/psychologist/ | 384 | 11 | 2.86% | 5.6 | psychologist salary 2,900 |
| /job-pay-rates/occupational-therapist/ | 2,096 | 47 | 2.24% | 7.8 | |
| /job-pay-rates/sonographer/ | 1,886 | 11 | 0.58% | 7.7 | |

Query positions to watch (GSC, same window): "pharmacist salary" 19.0, "radiographer salary" 11.2, "radiographer salary australia" 9.1, "physiotherapist salary" 38.0, "physiotherapist salary australia" 39.0, "occupational therapist salary" 21.9, "sonographer salary" 14.7, "sonographer salary australia" 10.8.

FAQs were written from these queries: "how much do pharmacists make in australia", "1st year pharmacist salary", "hospital pharmacist award rate", "nsw health pharmacist award 2026", "pharmacist salary perth", "pharmacist salary in australia after tax", "graduate radiographer salary", "level 2 radiographer salary", "senior radiographer salary", "radiographer salary nsw / victoria", "salary of physiotherapist in australia per hour", "how much do physiotherapists earn in australia", "average physiotherapist salary australia", "how much do psychologists earn in australia", "hourly rate for psychologist", "starting salary", "graduate occupational therapist salary australia", "ot hourly rate", "graduate sonographer salary", "entry level sonographer salary australia".

## Checks

`npx tsc --noEmit`, `npm test` (new file `lib/data/public-health-allied-pay/__tests__/public-health-allied-pay.test.ts` added to the test list), `npx next build --webpack`, `npm run check:nav`. Results are in the commit message.
