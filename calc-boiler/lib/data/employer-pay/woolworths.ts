// Woolworths — supermarket, metro, eStore and customer fulfilment centre staff.
//
// Instrument: Woolworths Australian Food Group Agreement 2024, AG2024/2300,
// AE525523, approved [2024] FWCFB 314 (Full Bench, 22 July 2024), operative
// from 21 October 2024, nominal expiry 17 April 2028. Read in full from the
// FWC PDF on 23 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE NOT PRINTED ANYWHERE. The agreement prints 2024
// rates (cl 4.1) and then, by cl 4.3, lifts base rates each July by the same
// percentage the Annual Wage Review gives the General Retail Industry Award.
// So the rates in force are the agreement's own formula applied to its own
// table:
//
//   2025: 2024 weekly x 1.035   ([2025] FWCFB 3500, 3.5%)
//   2026: 2025 weekly x 1.0475  ([2026] FWCFB 3500, 4.75%)
//   hourly = weekly / 38 (the weekly rate prevails), casual = hourly x 1.25
//
// Cross-check: the SDA's July 2025 Woolworths wage sheet matches every 2025
// weekly figure below except Tradesperson Level 5 ($1,147.26 on the SDA's
// hourly-first method vs $1,147.32 here). Expect cent-level rounding drift.
//
// No award-floor clause for base rates: s 206 FW Act does that job. In 2026
// every store level sits about 1.6% above the matching Retail Award level
// (Level 1 $28.26 vs award $27.81).

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae525523.pdf";

export const WOOLWORTHS_PAY: EmployerPay = {
  slug: "woolworths",
  name: "Woolworths",
  employerEntity:
    "Woolworths Group Limited and Woolworths (South Australia) Pty Ltd",
  industry: "supermarket",
  instrument: {
    kind: "enterprise-agreement",
    title: "Woolworths Australian Food Group Agreement 2024",
    reference: "AG2024/2300, AE525523",
    url: EA_URL,
    approvedOn: "22 July 2024 ([2024] FWCFB 314), operating from 21 October 2024",
    nominalExpiry: "17 April 2028",
    coverage:
      "It is one national agreement covering Woolworths supermarkets, Metro stores, eStores, customer fulfilment centres and online and home delivery in every state and territory. It does not cover Big W, BWS (a separate company, Endeavour Group), distribution centres, support office or salaried managers.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "Base rates rise by the same percentage the Fair Work Commission's 2027 Annual Wage Review gives the General Retail Industry Award (agreement cl 4.3). No dollar figure exists until that decision is made, usually in June.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Store Team Member Level 1", description: "Store team, trolley, personal shopper, driver, cleaner", weekly: 1073.93, hourly: 28.26, casualHourly: 35.33 },
    { level: "Store Team Member Level 2", description: "Forklift or ride-on equipment operator", weekly: 1098.2, hourly: 28.9, casualHourly: 36.13 },
    { level: "Store Team Member Level 3", description: "Skilled non-trades work, bakery cadet, assistant department manager, stocktake team leader", weekly: 1115.45, hourly: 29.35, casualHourly: 36.69 },
    { level: "Store Team Member Level 4", description: "Service supervisor of up to 15 staff; online or nightfill supervisor", weekly: 1137.3, hourly: 29.93, casualHourly: 37.41 },
    { level: "Store Team Member Level 5", description: "Service supervisor of more than 15 staff", weekly: 1183.52, hourly: 31.15, casualHourly: 38.94 },
    { level: "Store Team Member Level 6", description: "Department manager; leading the store", weekly: 1207.4, hourly: 31.77, casualHourly: 39.71 },
    { level: "Clerical Assistant Level 1", description: "Routine clerical work", weekly: 1073.93, hourly: 28.26, casualHourly: 35.33 },
    { level: "Clerical Officer Level 2", description: "Store services assistant", weekly: 1131.21, hourly: 29.77, casualHourly: 37.21 },
    { level: "Clerical Officer Level 3", description: "Store services and compliance officer; CFC workforce planner", weekly: 1186.58, hourly: 31.23, casualHourly: 39.04 },
    { level: "Tradesperson Level 4", description: "Qualified butcher or baker", weekly: 1182.01, hourly: 31.11, casualHourly: 38.89 },
    { level: "Tradesperson Level 5", description: "Tradesperson in charge of other tradespeople; qualified department manager", weekly: 1201.82, hourly: 31.63, casualHourly: 39.54 },
  ],
  juniorScale: [
    { age: "16 and under", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "Under cl 4.4 the junior percentages apply only to Store Team Member Level 1 and Clerical Assistant Level 1. At Level 2 and above you are paid the adult rate at any age, and from 20 you are paid the full adult rate — a year earlier than the national minimum wage.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Base rate", casual: "Base + 25%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Saturday, 7am to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Monday to Saturday, 11pm to 7am", permanent: "Base + 50% for the first 3 hours, then + 100%", casual: "Base + 75% for the first 3 hours, then + 125%" },
    { when: "Sunday, 9am to 11pm", permanent: "Base + 50%", casual: "Base + 75%" },
    { when: "Sunday, midnight to 9am and 11pm to midnight", permanent: "Base + 100%", casual: "Base + 125%" },
    { when: "Public holiday", permanent: "Base + 125%", casual: "Base + 150%" },
  ],
  penaltyNotes: [
    "For casuals the penalty and the 25% casual loading are added together, not multiplied: the agreement says there is no penalty on a penalty (cl 4.1(c)). Sunday is base + 75% for a casual, not 150% × 1.25.",
    "Ordinary hours run Monday to Saturday 7am–11pm and Sunday 9am–11pm (cl 6.1).",
    "Shiftworkers have their own loadings: + 30% Sunday to Friday, + 50% Saturday, + 75% Sunday (casuals + 55%, + 75%, + 100%).",
    "By agreement a permanent employee can take base + 25% plus a day off in lieu instead of the public holiday rate (cl 19.3).",
  ],
  overtime: [
    { when: "Monday to Saturday", permanent: "150% for the first 3 hours, then 200%", casual: "175% for the first 3 hours, then 225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "The agreement prints its 2024 rates and then lifts them each July by the percentage the Annual Wage Review gives the Retail Award (cl 4.3): 3.5% in 2025 and 4.75% in 2026. The 2026 figures on this page are that formula applied to the agreement's own table. Woolworths has not published a 2026 table, so your payslip may differ by a cent or two.",
    "Junior rates under the Retail Award rise from the first full pay period on or after 1 December 2026 for 18- to 20-year-olds with more than 6 months' service ([2026] FWCFB 222). An agreement can never pay a base rate below the award, so if the award rate for your age overtakes the Woolworths junior rate, you must be paid at least the award rate.",
  ],
  unverified: [
    "Distribution centre rates — distribution centres are outside this agreement and we have not identified which agreement covers them.",
    "Salaried store manager pay — excluded from the agreement.",
    "Allowances (first aid, meal, vehicle and others) — see the agreement itself.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Woolworths Australian Food Group Agreement 2024 (AE525523)", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Approval decision [2024] FWCFB 314", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2024fwcfb314.pdf" },
    { title: "Annual Wage Review 2025–26 decision [2026] FWCFB 3500 (4.75%)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews" },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does Woolworths pay an hour in 2026?",
      a: "An adult Store Team Member Level 1 at Woolworths is paid $28.26 an hour as a permanent employee and $35.33 as a casual, from the first full pay period on or after 1 July 2026. Department managers at Level 6 are paid $31.77 an hour.",
    },
    {
      q: "How much does Woolworths pay a 15 or 16 year old?",
      a: "A Store Team Member Level 1 aged 16 or under is paid 50% of the adult rate: about $14.13 an hour, or $17.66 as a casual. At 17 it is 60% (about $16.96), at 18 70%, at 19 80%, and from 20 the full adult rate.",
    },
    {
      q: "What are Woolworths Sunday penalty rates?",
      a: "Between 9am and 11pm on a Sunday, permanent staff are paid base + 50% and casuals base + 75%. For an adult Level 1 that is about $42.39 and $49.46 an hour. Sunday hours before 9am or after 11pm attract base + 100% (casual + 125%).",
    },
    {
      q: "What is the Woolworths EBA?",
      a: "The Woolworths Australian Food Group Agreement 2024 (AE525523), approved by the Fair Work Commission on 22 July 2024. It covers supermarket, Metro, eStore and fulfilment centre staff nationally and nominally expires on 17 April 2028.",
    },
    {
      q: "Does Woolworths pay more than the award?",
      a: "Yes, slightly. In 2026 the Level 1 rate is $28.26 against $27.81 under the General Retail Industry Award, and because both rise by the same annual wage review percentage the gap stays at about 1.6%.",
    },
  ],
};
