// Officeworks — team members in Officeworks stores and Print Hubs.
//
// Instrument: Officeworks Store Operations Agreement 2024, AG2024/3078,
// AE526143, approved 30 September 2024 (Wilson C, PR779508), operative
// 7 October 2024, nominal expiry 7 October 2028. Employer Officeworks Ltd.
// Customer Fulfilment Centre staff have a separate agreement (AE528025) and are
// not covered here. Read from the FWC PDF on 24 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA, NOT A PRINTED TABLE.
// cl 10.1 prints rates from the first full pay period on or after 1 July 2024
// (Level 1 $26.16, Level 2 $27.46, Level 3 $28.76). cl 10.2 lifts them each
// year by the Annual Wage Review percentage "plus 0.25%" (the Note ties it to
// the Retail Award Level 1 increase), from the first full pay period on or
// after 1 July (cl 10.3):
//   2025: 3.5% + 0.25% = 3.75%   2026: 4.75% + 0.25% = 5.00%
//   Level 1: 26.16 → 27.14 → $28.50; casual x 1.25 = $35.63
//
// Juniors (cl 10.4): % of the Level 1 rate — under 18 60%, 18 70%, 19 85%;
// no band is printed for 20, so 20-year-olds are treated as adult. Not paid at
// Levels 2 or 3. From 1 Dec 2026 the Retail Award phase-in (PR813655) pays
// 18-year-olds with >6 months' service 75% of award L1 ($20.86), above
// Officeworks' $19.95 — s 206 floor, flagged on the page.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae526143.pdf";

export const OFFICEWORKS_PAY: EmployerPay = {
  slug: "officeworks",
  name: "Officeworks",
  employerEntity: "Officeworks Ltd",
  industry: "office supplies retail",
  instrument: {
    kind: "enterprise-agreement",
    title: "Officeworks Store Operations Agreement 2024",
    reference: "AG2024/3078, AE526143",
    url: EA_URL,
    approvedOn: "30 September 2024 (PR779508), operating from 7 October 2024",
    nominalExpiry: "7 October 2028",
    coverage:
      "It covers team members in Officeworks stores and Print Hubs, except salaried positions. Customer Fulfilment Centre staff have their own separate agreement.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "Every level rises by the 2027 Annual Wage Review percentage plus 0.25% (cl 10.2). The agreement does not print the dollar figure.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Team Member Level 1", description: "Customer service, stock replenishment, point of sale, despatch, asset protection, returns and repairs, product assembly, customer orders", hourly: 28.5, casualHourly: 35.63 },
    { level: "Team Member Level 2", description: "Licensed forklift operator, or a Specialist appointed for a specialised product category", hourly: 29.91, casualHourly: 37.39 },
    { level: "Team Member Level 3", description: "Supervisory assistance, leading the team, allocating tasks, opening and closing the store and cash security", hourly: 31.33, casualHourly: 39.16 },
  ],
  juniorScale: [
    { age: "Under 18", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.85 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "Junior rates (cl 10.4) apply only at Level 1; juniors appointed to Level 2 or 3 get the adult rate. The agreement prints no band for 20-year-olds, so they are paid the adult rate.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Base rate", casual: "Base + 25%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Saturday, 7am to 11pm", permanent: "Base + 25%", casual: "Base + 50%" },
    { when: "Sunday, 9am to 11pm", permanent: "Base + 50%", casual: "Base + 75%" },
    { when: "Public holiday", permanent: "250% (total)", casual: "250% (total)", note: "Minimum 3 hours; public holiday work is voluntary (cl 27.10)" },
  ],
  penaltyNotes: [
    "Casual rates include the 25% loading (cl 22.3.2). On public holidays casuals and permanent staff get the same 250%.",
    "For an adult Level 1 team member ($28.50) that is about $35.63 an hour on a weeknight or Saturday ($42.75 casual), $42.75 on a Sunday ($49.88 casual) and $71.25 on a public holiday — our arithmetic on the formula rate.",
    "Staff employed specifically as shiftworkers (shifts starting from 6pm and ending before 5am) get 130% Sunday night to Friday, 150% Saturday and 175% Sunday (casual 155%, 175%, 200%).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 2 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "The Officeworks agreement prints its July 2024 rates and lifts them each July by the Annual Wage Review percentage plus 0.25% — 3.75% in 2025 and 5% in 2026. The 2026 figures here are our calculation from that rule, rounded to the cent; your payslip may differ by a cent.",
    "From the first full pay period on or after 1 December 2026, the Retail Award pays 18-year-olds with more than 6 months' service 75% of the award rate ($20.86). That is more than Officeworks' 70% of $28.50 ($19.95), and an agreement cannot pay a base rate below the award, so those staff must get at least the award figure.",
  ],
  unverified: [
    "Officeworks' own 2026 pay table — not public; the dollars are the agreement's formula.",
    "Pay for 20-year-olds — the agreement prints no band for age 20; we treat them as adult.",
    "Customer Fulfilment Centre pay (separate agreement AE528025) and salaried roles.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Officeworks Store Operations Agreement 2024 (AE526143), with approval decision PR779508 and undertakings", publisher: "Fair Work Commission", url: EA_URL },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does Officeworks pay an hour in 2026?",
      a: "An adult Team Member Level 1 at Officeworks is paid about $28.50 an hour, or $35.63 as a casual, from the first full pay period on or after 1 July 2026. Level 2 (forklift operators and Specialists) gets about $29.91 and Level 3 about $31.33. These apply the agreement's Annual Wage Review plus 0.25% rule to its printed 2024 rates.",
    },
    {
      q: "What agreement covers Officeworks staff?",
      a: "The Officeworks Store Operations Agreement 2024 (AE526143). It covers team members in Officeworks stores and Print Hubs, started on 7 October 2024 and has a nominal expiry date of 7 October 2028.",
    },
    {
      q: "How much does Officeworks pay a 16 or 17 year old?",
      a: "At Level 1, staff under 18 get 60% of the adult rate: about $17.10 an hour. At 18 it is 70% ($19.95) and at 19 it is 85%. Juniors at Level 2 or 3 get the adult rate.",
    },
    {
      q: "What does Officeworks pay on Sundays and public holidays?",
      a: "Sundays from 9am pay base + 50% for permanent staff and base + 75% for casuals (about $42.75 and $49.88 an hour at Level 1). Every public holiday hour is paid at 250%, about $71.25 at Level 1, with a 3-hour minimum.",
    },
    {
      q: "When is the next Officeworks pay rise?",
      a: "From the first full pay period on or after 1 July 2027, by the 2027 Annual Wage Review percentage plus 0.25%.",
    },
  ],
};
