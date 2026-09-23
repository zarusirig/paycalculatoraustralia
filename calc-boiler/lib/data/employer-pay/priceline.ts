// Priceline — retail staff in the Priceline (and atomica) stores that Priceline
// Pty Ltd owns and runs itself.
//
// Instrument: Priceline Retail Employees Enterprise Agreement 2026, AG2026/2365,
// AE534063, approved 10 September 2026 (Yilmaz C, PR814230), operative
// 17 September 2026, nominal expiry 30 June 2030. Employer Priceline Pty Ltd
// t/as Priceline or atomica. Replaces the 2021 agreement (AE514278, nominal
// expiry 30 June 2025). Read from the FWC PDF on 24 September 2026.
//
// COVERAGE IS NARROW (cl 3.3, 4.2): retail employees in stores "owned and
// operated by Priceline" — Retail Employee / Glow Assistant and Specialist Sales
// Assistant / Glow Advisor, mapped to Retail Award Level 1; not assistant or
// store managers. Wesfarmers Health says Priceline Pharmacies are "operated
// through franchise partnerships with community pharmacists" and it runs 68
// non-pharmacy Priceline stores. Franchised Priceline Pharmacy staff are
// employed by the franchisee pharmacist and are NOT covered.
//
// Every dollar is PRINTED: cl 18.1 (base) and Appendix A (loadings and adult
// dollars from the first full pay period on or after 1 July 2026). Checked:
//   29.57 x 1.25 = 36.96, x 1.18 = 34.89, x 1.415 = 41.84, x 2.41 = 71.26,
//   x 2.60 = 76.88; 31.05 = 105% of 29.57 (cl 19.1) and the same multipliers.
//   Sunday: 179% of 29.57 = 52.93 < the $53.07 floor (cl 14.2, 14.6), so $53.07.
// The table is headed 1 July 2026 but the agreement operates from 17 Sep 2026
// and contains no back-pay clause — stated on the page.
//
// Juniors (cl 26.1): % of the cl 18 rates, stepping up each Dec/Jul to 2029.
// Current: 16 and younger 50%, 17 60%, 18 70%, 19 80%, 20 100%. From the first
// pay period after 1 Dec 2026: 18 75%, 19 85%. Junior dollars are OUR
// derivation (percentage x $29.57, rounded; casual = junior x 1.25).

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/AE534063.pdf";

export const PRICELINE_PAY: EmployerPay = {
  slug: "priceline",
  name: "Priceline",
  employerEntity: "Priceline Pty Ltd (company-owned Priceline and atomica stores)",
  industry: "health and beauty retail",
  instrument: {
    kind: "enterprise-agreement",
    title: "Priceline Retail Employees Enterprise Agreement 2026",
    reference: "AG2026/2365, AE534063",
    url: EA_URL,
    approvedOn: "10 September 2026 (PR814230), operating from 17 September 2026",
    nominalExpiry: "30 June 2030",
    coverage:
      "It covers retail staff in the Priceline and atomica stores that Priceline Pty Ltd owns and runs itself — Wesfarmers Health operates 68 such non-pharmacy stores. Most Priceline Pharmacy stores are franchises run by community pharmacists, who employ their own staff; they are not covered by this agreement. Assistant managers and store managers are not covered either.",
  },
  ratesEffectiveFrom:
    "the agreement's start on 17 September 2026 (its rate table is headed \"first full pay period on or after 1 July 2026\")",
  nextIncrease: {
    date: "First full pay period after 1 December 2026 (juniors aged 18 and 19)",
    detail:
      "The agreement's own junior table steps up: 18-year-olds from 70% to 75% of the adult rate and 19-year-olds from 80% to 85% (cl 26.1), about $22.18 and $25.13 an hour. Adult base rates next rise by the Retail Award's 2027 Annual Wage Review percentage, at the same time as the award (cl 18.1).",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Retail Employee / Glow Assistant", description: "Sales assistant in a company-owned Priceline or atomica store — mapped to Retail Award Level 1", hourly: 29.57, casualHourly: 36.96 },
    { level: "Specialist Sales Assistant / Glow Advisor", description: "A sales assistant appointed to a key category such as cosmetics or wellness — 105% of the Retail Employee rate (cl 19.1)", hourly: 31.05, casualHourly: 38.81 },
  ],
  juniorScale: [
    { age: "16 and younger", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  // Rounded half-up on paper (17.74 x 1.25 = 22.175 → $22.18; binary floats give 22.17).
  derivedJuniorRates: [
    { age: "16 and younger", hourly: 14.79, casualHourly: 18.49 },
    { age: "17", hourly: 17.74, casualHourly: 22.18 },
    { age: "18", hourly: 20.7, casualHourly: 25.88 },
    { age: "19", hourly: 23.66, casualHourly: 29.58 },
    { age: "20 and over", hourly: 29.57, casualHourly: 36.96 },
  ],
  juniorNote:
    "The junior percentages (cl 26.1) apply to both classifications and rise in steps every December and July until 18- and 19-year-olds reach the adult rate on 1 July 2029 (19-year-olds on 1 July 2028). The table shows the percentages in force now; 20-year-olds are already paid the adult rate.",
  penalties: [
    { when: "Monday to Friday, before 6pm", permanent: "100%", casual: "125%" },
    { when: "Monday to Friday, 6pm to close", permanent: "118%", casual: "141.5%" },
    { when: "Saturday", permanent: "125%", casual: "141.5%" },
    { when: "Sunday", permanent: "179%, at least $53.07/hr", casual: "179%, at least $53.07/hr", note: "Adult Retail Employee floor; $55.72 for a Specialist Sales Assistant (cl 14.2, 14.6)" },
    { when: "Public holiday", permanent: "241%", casual: "260%" },
  ],
  penaltyNotes: [
    "Casual percentages already include the casual loading (Appendix A). For an adult Retail Employee the agreement prints $34.89 an hour on a weeknight after 6pm, $36.96 on a Saturday ($41.84 casual for either), $53.07 on a Sunday and $71.26 on a public holiday ($76.88 casual).",
    "Sunday pay has a dollar floor: 179% of $29.57 is $52.93, so the $53.07 minimum applies. The Sunday percentage falls each July to 150% by 2030 (casual 175% from 2027), but the $53.07 and $55.72 floors stay for the life of the agreement.",
    "Part-time staff who agree to extra hours in the same 4-week cycle (flex-up) get 111% ($32.82 an hour) for those hours, falling to 100% by July 2029 (cl 16.3). A retail employee doing supervisor duties gets an extra 10% (cl 20).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 2 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "This agreement only covers the Priceline and atomica stores Priceline owns itself. If you work in a franchised Priceline Pharmacy, your employer is the pharmacist who owns the store, and you are usually paid under the Pharmacy Industry Award (or that owner's own agreement) — check the award or agreement named on your payslip.",
    "The agreement began on 17 September 2026. Its rate table is headed from the first full pay period on or after 1 July 2026, but it contains no back-pay clause, so pay before 17 September was set by the previous agreement.",
  ],
  unverified: [
    "Whether Priceline back-paid the new rates to July 2026 — the agreement is silent.",
    "Assistant manager and store manager pay — not covered by the agreement.",
    "Pay in franchised Priceline Pharmacy stores — each pharmacist franchisee is a separate employer.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Priceline Retail Employees Enterprise Agreement 2026 (AE534063), with approval decision PR814230", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Wesfarmers Health (Priceline Pharmacy franchise partnerships; 68 non-pharmacy Priceline stores)", publisher: "Wesfarmers", url: "https://www.wesfarmers.com.au/our-businesses/wesfarmers-health" },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does Priceline pay an hour in 2026?",
      a: "In company-owned Priceline stores, an adult Retail Employee / Glow Assistant is paid $29.57 an hour, or $36.96 as a casual, under the Priceline Retail Employees Enterprise Agreement 2026. A Specialist Sales Assistant / Glow Advisor gets $31.05 ($38.81 casual).",
    },
    {
      q: "What does Priceline pay on a Sunday?",
      a: "179% of the base rate, but never less than $53.07 an hour for an adult Retail Employee or $55.72 for a Specialist Sales Assistant — casual or permanent. Because 179% of $29.57 is only $52.93, the $53.07 floor is what adults get.",
    },
    {
      q: "How much does Priceline pay a 16 or 17 year old?",
      a: "Staff aged 16 and younger get 50% of the adult rate, about $14.79 an hour ($18.49 casual), and 17-year-olds 60%, about $17.74 ($22.18 casual). These are our arithmetic from the agreement's percentages.",
    },
    {
      q: "Does the Priceline agreement cover Priceline Pharmacy?",
      a: "Only stores Priceline owns itself. Most Priceline Pharmacy stores are franchises owned by community pharmacists, who employ their own staff and are usually covered by the Pharmacy Industry Award or their own agreement.",
    },
    {
      q: "When do Priceline junior rates go up?",
      a: "From the first pay period after 1 December 2026, 18-year-olds move to 75% of the adult rate (about $22.18) and 19-year-olds to 85% (about $25.13). They keep rising each December and July until both reach the adult rate.",
    },
  ],
};
