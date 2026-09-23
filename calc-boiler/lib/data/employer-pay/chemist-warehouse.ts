// Chemist Warehouse — store staff (pharmacy assistants, dispensary assistants,
// students, interns, pharmacists).
//
// Instrument: Pharmacy Industry Award 2020 (MA000012). No Chemist Warehouse
// store-level enterprise agreement exists: the SDA SA/NT branch's 2024–25
// financial report (FR2025/52) describes a campaign for "the first ever
// Chemist Warehouse Agreement", and its 2 April 2026 release says the workers
// "currently earn Award minimums". A single interest employer authorisation
// (granted 2 Dec 2025, appeal dismissed 2026) covers six SA franchise
// employers (13 stores); no agreement has been approved.
//
// Rates: MA000012 cl 16.1 Table 3 and Schedule B, consolidated to 1 July 2026
// (PR799293), matching the FWO pay guide effective 1 July 2026 (published
// 24 June 2026). Read 23 September 2026. Pharmacist and intern rates include
// the second stage (30 June 2026) of the gender-undervaluation increase and the
// 4.75% Annual Wage Review; a third stage is due 30 June 2027.
//
// Junior percentages: cl 16.2 Table 4, pharmacy assistant levels 1 and 2 only.
// Junior dollars: FWO pay guide, Level 1.
//
// ⚠️ JUNIOR PHASE-IN IS NOW FINAL for this award: determination PR813656
// (26 Aug 2026, following [2026] FWCFB 222) lifts 18–20 year olds with more
// than 6 months' service from the first full pay period on or after
// 1 December 2026. Re-verify the junior table after that date.

import type { EmployerPay } from "./types";

const AWARD_URL = "https://awards.fairwork.gov.au/MA000012.html";

export const CHEMIST_WAREHOUSE_PAY: EmployerPay = {
  slug: "chemist-warehouse",
  name: "Chemist Warehouse",
  employerEntity:
    "Each Chemist Warehouse store is run by a franchise or owner-partner business, which is the employer. The network has been owned by Sigma Healthcare since February 2025.",
  industry: "pharmacy",
  instrument: {
    kind: "modern-award",
    title: "Pharmacy Industry Award 2020",
    reference: "MA000012",
    url: AWARD_URL,
    coverage:
      "The award covers community pharmacies to the exclusion of any other award (cl 4.2), so Chemist Warehouse store staff are paid under it rather than the retail award. There is no Chemist Warehouse store enterprise agreement; distribution centre workers have separate agreements.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Junior pharmacy assistants aged 18 to 20 with more than 6 months' service move up: 18-year-olds from 70% to 75%, 19-year-olds from 80% to 85%, and 20-year-olds from 90% to 95% of the adult rate (Fair Work Commission determination PR813656). Adult rates next change with the 2027 Annual Wage Review, and pharmacists and interns get the final stage of their gender-undervaluation increase on 30 June 2027.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Pharmacy assistant level 1", description: "Pharmacy assistant without a Community Pharmacy qualification; also 1st-year pharmacy students", weekly: 1056.8, hourly: 27.81, casualHourly: 34.76 },
    { level: "Pharmacy assistant level 2", description: "Certificate II in Community Pharmacy competencies; also 2nd-year pharmacy students", weekly: 1081.0, hourly: 28.45, casualHourly: 35.56 },
    { level: "Pharmacy assistant / dispensary assistant level 3", description: "Certificate III in Community Pharmacy competencies, required to work at this level; also 3rd-year students", weekly: 1119.1, hourly: 29.45, casualHourly: 36.81 },
    { level: "Pharmacy assistant level 4", description: "Certificate IV in Community Pharmacy competencies, required to work at this level; also 4th-year students", weekly: 1165.1, hourly: 30.66, casualHourly: 38.33 },
    { level: "Pharmacy intern (first half of training)", description: "Registered intern pharmacist, first half of the intern year", weekly: 1291.5, hourly: 33.99, casualHourly: 42.49 },
    { level: "Pharmacy intern (second half of training)", description: "Registered intern pharmacist, second half of the intern year", weekly: 1335.5, hourly: 35.14, casualHourly: 43.93 },
    { level: "Pharmacist", description: "Registered pharmacist", weekly: 1586.3, hourly: 41.74, casualHourly: 52.18 },
    { level: "Experienced pharmacist", description: "4 or more years full-time in community pharmacy", weekly: 1737.4, hourly: 45.72, casualHourly: 57.15 },
    { level: "Pharmacist in charge", description: "Pharmacist in charge of the pharmacy", weekly: 1778.4, hourly: 46.8, casualHourly: 58.5 },
    { level: "Pharmacist manager", description: "Responsible to the pharmacy owner for all aspects of the business", weekly: 1981.6, hourly: 52.15, casualHourly: 65.19 },
  ],
  juniorScale: [
    { age: "Under 16", percentage: 0.45 },
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20", percentage: 0.9 },
    { age: "21 and over", percentage: 1 },
  ],
  juniorNote:
    "Junior rates apply only to pharmacy assistant levels 1 and 2 (cl 16.2). From the first full pay period on or after 1 December 2026, 18- to 20-year-olds with more than 6 months' service move up five percentage points, reaching the adult rate in stages by July 2029.",
  publishedJuniorRates: [
    { age: "Under 16", hourly: 12.51, casualHourly: 15.64 },
    { age: "16", hourly: 13.91, casualHourly: 17.39 },
    { age: "17", hourly: 16.69, casualHourly: 20.86 },
    { age: "18", hourly: 19.47, casualHourly: 24.34 },
    { age: "19", hourly: 22.25, casualHourly: 27.81 },
    { age: "20", hourly: 25.03, casualHourly: 31.29 },
    { age: "21 and over", hourly: 27.81, casualHourly: 34.76 },
  ],
  penalties: [
    { when: "Monday to Friday, 8am to 7pm", permanent: "100%", casual: "125%" },
    { when: "Monday to Friday, 7am to 8am", permanent: "150%", casual: "175%" },
    { when: "Monday to Friday, 7pm to 9pm", permanent: "125%", casual: "150%" },
    { when: "Monday to Friday, 9pm to midnight", permanent: "150%", casual: "175%" },
    { when: "Saturday, 7am to 8am", permanent: "200%", casual: "225%" },
    { when: "Saturday, 8am to 6pm", permanent: "125%", casual: "150%" },
    { when: "Saturday, 6pm to 9pm", permanent: "150%", casual: "175%" },
    { when: "Saturday, 9pm to midnight", permanent: "175%", casual: "200%" },
    { when: "Sunday, 7am to 9pm", permanent: "150%", casual: "175%" },
    { when: "Sunday, before 7am or after 9pm", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltyNotes: [
    "Percentages are of the minimum hourly rate for your classification (award cl 22, Table 6). Casual figures include the 25% loading, added rather than multiplied: Saturday casual is 150%, not 156.25%.",
    "The weekday evening penalty starts at 7pm, not 6pm as in the retail award.",
    "Ordinary hours can be worked between 7am and midnight on any day.",
  ],
  overtime: [
    { when: "Monday to Saturday", permanent: "150% for the first 2 hours, then 200%", casual: "Same as full-time — casual loading is not paid on overtime (cl 21.4(c))" },
    { when: "Sunday", permanent: "200%", casual: "200%" },
    { when: "Public holiday", permanent: "250%", casual: "250%" },
  ],
  notices: [
    "Chemist Warehouse stores pay the Pharmacy Industry Award — there is no Chemist Warehouse store enterprise agreement. In South Australia, six franchise employers covering 13 stores have been ordered to bargain with the SDA for the network's first store agreement; none had been approved when we checked.",
  ],
  unverified: [
    "Distribution centre pay — covered by separate warehouse agreements whose current titles and IDs we could not confirm from the Fair Work Commission.",
    "Above-award pay — an individual store may pay more than the award; these are the legal minimums.",
  ],
  sources: [
    { title: "Pharmacy Industry Award 2020 (MA000012), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Pay guide — Pharmacy Industry Award, effective 1 July 2026", publisher: "Fair Work Ombudsman", url: "https://calculate.fairwork.gov.au/payguides/fairwork/ma000012/pdf" },
    { title: "Junior rates determination PR813656 (26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/sites/am2024-24/pr813656.pdf" },
    { title: "Changes to the Pharmacy Award (gender undervaluation)", publisher: "Fair Work Ombudsman", url: "https://www.fairwork.gov.au/about-us/workplace-laws/award-changes/major-award-changes/gender-undervaluation-priority-awards-review/changes-to-the-pharmacy-award" },
    { title: "Chemist Warehouse appeal dismissed (2 April 2026)", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/sa-nt/news/media-release-chemist-warehouse-appeal-dismissed/" },
  ],
  faqs: [
    {
      q: "How much does Chemist Warehouse pay an hour?",
      a: "Chemist Warehouse store staff are paid under the Pharmacy Industry Award. An adult pharmacy assistant level 1 earns at least $27.81 an hour, or $34.76 as a casual, from 1 July 2026. A registered pharmacist earns at least $41.74 an hour.",
    },
    {
      q: "Does Chemist Warehouse have an enterprise agreement?",
      a: "Not for store staff. Stores pay the Pharmacy Industry Award 2020. In South Australia the SDA union has an order requiring six Chemist Warehouse franchise employers to bargain for a first agreement, but none had been approved by September 2026.",
    },
    {
      q: "How much does Chemist Warehouse pay a 15 or 16 year old?",
      a: "A pharmacy assistant level 1 under 16 is paid 45% of the adult rate, $12.51 an hour ($15.64 casual). At 16 it is $13.91 ($17.39 casual) and at 17 $16.69 ($20.86 casual). The full adult rate applies from 21.",
    },
    {
      q: "What are Chemist Warehouse penalty rates on weekends?",
      a: "Saturday between 8am and 6pm pays 125% (casual 150%), rising to 150% after 6pm and 175% after 9pm. Sunday between 7am and 9pm pays 150% (casual 175%). Public holidays pay 225% (casual 250%).",
    },
    {
      q: "How much does a Chemist Warehouse pharmacist earn?",
      a: "The award minimum for a pharmacist is $1,586.30 a week ($41.74 an hour) from 1 July 2026. An experienced pharmacist earns at least $45.72, a pharmacist in charge $46.80 and a pharmacist manager $52.15 an hour.",
    },
  ],
};
