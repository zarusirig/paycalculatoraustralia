// David Jones — store team members (sales, beauty, logistics, visual
// merchandising, loss prevention, supervisors up to Level 4).
//
// Instrument: David Jones Enterprise Agreement 2024, AG2024/991, AE524326,
// approved 22 April 2024 (O'Neill DP, PR773746), operative 29 April 2024,
// nominal expiry 22 April 2028. Replaced the 2018 agreement. Read from the FWC
// PDF (agreement + decision) on 24 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA APPLIED TO THE AWARD. cl 8.2(c)
// sets each level at a named General Retail Industry Award (GRIA) level plus a
// fixed number of cents, rising each year. From the first full pay period on or
// after 1 July 2026:
//   Level 1 = GRIA Level 1 + 17c = 27.81 + 0.17 = $27.98
//   Level 2 = GRIA Level 3 + 17c = 28.89 + 0.17 = $29.06
//   Level 3 = GRIA Level 4 + 20c = 29.45 + 0.20 = $29.65
//   Level 4 = GRIA Level 5 + 20c = 30.66 + 0.20 = $30.86
// Casual = (GRIA + cents) "plus casual loading" of 25% (cl 8.2(a)).
// GRIA 2026 hourly rates: RETAIL_RATES (lib/constants/hospitality-award.ts).
//
// Juniors (cl 8.4): Level 1 only — under 17 50%, 17 60%, 18 70%, 19 80%,
// 20 and over 100%. From 1 Dec 2026 the Retail Award phase-in (PR813655) pays
// 18/19-year-olds with >6 months' service 75%/85% of award L1 ($20.86/$23.64),
// above DJ's $19.59/$22.38 — s 206 floor, flagged on the page.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae524326.pdf";

export const DAVID_JONES_PAY: EmployerPay = {
  slug: "david-jones",
  name: "David Jones",
  employerEntity: "David Jones Pty Limited",
  industry: "department store",
  instrument: {
    kind: "enterprise-agreement",
    title: "David Jones Enterprise Agreement 2024",
    reference: "AG2024/991, AE524326",
    url: EA_URL,
    approvedOn: "22 April 2024 (PR773746), operating from 29 April 2024",
    nominalExpiry: "22 April 2028",
    coverage:
      "It covers David Jones team members in the agreement's four store classification levels — sales and customer service, beauty, logistics, visual merchandising, loss prevention and supervisors. Salaried managers above Level 4 fall outside its classification structure.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "The margin over the award rises to 24 cents (Levels 1 and 2) and 28 cents (Levels 3 and 4) on top of the 2027 Annual Wage Review rates (cl 8.2(c)).",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Level 1", description: "Customer Service Assistant, Sales Professional, Beauty Consultant, Logistics Assistant (Retail Award Level 1 + 17c)", hourly: 27.98, casualHourly: 34.98 },
    { level: "Level 2", description: "Stylist, Concierge, Sales Expert, Loss Prevention Officer, Counter Manager (Specialist) (Retail Award Level 3 + 17c)", hourly: 29.06, casualHourly: 36.33 },
    { level: "Level 3", description: "Beauty Therapist, Makeup Artist, Counter Manager (Qualified); may supervise up to 3 Level 2 or 15 Level 1 staff (Retail Award Level 4 + 20c)", hourly: 29.65, casualHourly: 37.06 },
    { level: "Level 4", description: "Supervises more than 15 Level 1 or more than 3 Level 2 or 3 staff (Retail Award Level 5 + 20c)", hourly: 30.86, casualHourly: 38.58 },
  ],
  juniorScale: [
    { age: "Under 17", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "Junior rates apply only at Level 1 (cl 8.4); juniors at Level 2 and above get the adult rate. David Jones pays the full adult rate from 20.",
  penalties: [
    { when: "Monday to Friday, 6pm to 11pm", permanent: "+ 25%", casual: "+ 50%" },
    { when: "Saturday, 7am to 11pm", permanent: "+ 25%", casual: "+ 50%" },
    { when: "Sunday", permanent: "+ 50%", casual: "+ 75%" },
    { when: "Public holiday", permanent: "+ 125%", casual: "+ 150%", note: "Public holiday work is voluntary for every team member (cl 30.4)" },
  ],
  penaltyNotes: [
    "Penalties are added to your base hourly rate (cl 8.3). Casual figures include the 25% loading: casual Sunday is base + 75%, not 150% × 1.25.",
    "Work from 11pm to midnight on weekdays and Saturdays is paid at overtime rates. Ordinary hours run 7am to 11pm Monday to Saturday and 9am to 11pm Sunday.",
    "For an adult Level 1 team member ($27.98) that is about $34.98 an hour on a weeknight or Saturday, $41.97 on a Sunday and $62.96 on a public holiday — our arithmetic.",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "David Jones' agreement sets each level a fixed number of cents above a General Retail Industry Award rate, so the 2026 dollars here are the 1 July 2026 award rates plus the agreement's margins (17 or 20 cents). The agreement does not print a 2026 dollar table.",
    "From the first full pay period on or after 1 December 2026, the Retail Award pays 18- and 19-year-olds with more than 6 months' service 75% and 85% of the award rate ($20.86 and $23.64). That is more than David Jones' 70% and 80% of $27.98 ($19.59 and $22.38), and an agreement cannot pay a base rate below the award, so those staff must get at least the award figure.",
  ],
  unverified: [
    "David Jones' own 2026 pay table — not public; the dollars are the agreement's formula.",
    "Current dollar amounts of allowances that are indexed to the award (meal, first aid, laundry).",
    "Salaried manager pay above Level 4.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "David Jones Enterprise Agreement 2024 (AE524326), with approval decision PR773746", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Your pay and conditions at David Jones", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/your-rights/agreements/david-jones-agreement/your-pay-and-conditions-at-david-jones/" },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does David Jones pay an hour in 2026?",
      a: "A Level 1 team member at David Jones gets the Retail Award Level 1 rate plus 17 cents: $27.98 an hour, or about $34.98 as a casual, from the first full pay period on or after 1 July 2026. Level 2 (for example stylists and sales experts) gets $29.06, Level 3 (beauty therapists, makeup artists) $29.65 and Level 4 supervisors $30.86.",
    },
    {
      q: "What is the David Jones enterprise agreement?",
      a: "The David Jones Enterprise Agreement 2024 (AE524326), approved by the Fair Work Commission on 22 April 2024 and operating from 29 April 2024. It runs to a nominal expiry of 22 April 2028 and ties pay to the Retail Award plus a margin that grows each July.",
    },
    {
      q: "How much does David Jones pay a 16 or 17 year old?",
      a: "At Level 1, David Jones pays 50% of the adult rate under 17 ($13.99 an hour) and 60% at 17 ($16.79). It is 70% at 18, 80% at 19 and the full adult rate from 20. Juniors at Level 2 or above get the adult rate.",
    },
    {
      q: "What does David Jones pay on Sundays and public holidays?",
      a: "Sundays pay base + 50% (casuals + 75%), about $41.97 an hour for a permanent Level 1 team member. Public holidays pay base + 125% (casuals + 150%), and public holiday work is voluntary.",
    },
    {
      q: "Does David Jones pay more than the award?",
      a: "Yes, by a small fixed margin: 17 cents an hour above the matching Retail Award level at Levels 1 and 2, and 20 cents at Levels 3 and 4, from July 2026. It also pays the adult rate from 20, where the award can pay 90% at that age.",
    },
  ],
};
