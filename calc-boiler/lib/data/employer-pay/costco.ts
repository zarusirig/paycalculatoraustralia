// Costco — warehouse (store) staff of Costco Wholesale Australia.
//
// Instrument: Costco Wholesale Australia Enterprise Agreement 2023-2027,
// AG2023/2769, AE522205 (print PR768050), approved 8 November 2023 (Easton DP),
// operative 15 November 2023, nominal expiry 8 September 2027. Replaced the
// 2019-2023 agreement (AE506170). No replacement on the FWC agreement lists to
// 21 September 2026. Read in full, with the s 190 undertakings, from the FWC
// PDF on 24 September 2026.
//
// PRINTED DOLLARS. cl 5.1 prints four columns: (A) from operation, (B) first
// full pay period 12 months after operation commences, (C) 24 months after,
// (D) 36 months after. Operation commenced 15 November 2023, so column C —
// from the first full pay period on or after 15 November 2025 — applies on
// 24 September 2026, and column D is the next rise (~ mid-November 2026).
// Rates step up every 980 hours worked (cl 6.9, full-time and part-time).
//
// Casual rates are OUR ARITHMETIC: printed rate x 1.25 (cl 4.2.3 casual
// loading), rounded to the cent. Casual weekend/evening "premium" rates in the
// cl 4.2.3 table replace the loading, not stack on it. Undertaking 3(b) sets
// the casual public holiday rate at 275% (the printed table says 150%).
//
// Supervisor rate: cl 6.8 says top-out + $1.50 for "the relevant
// classification"; the printed Service Assistant/Clerk row ($36.27) is the
// Service CLERK top-out + $1.50. We publish the printed figure.
//
// No junior rates anywhere in the agreement: every age gets the adult rate.
// Award check (MA000004 from 1 July 2026): Service Assistant step 1 $30.02 is
// above Retail Award Levels 1–4 ($27.81–$29.45).

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae522205.pdf";

export const COSTCO_PAY: EmployerPay = {
  slug: "costco",
  name: "Costco",
  employerEntity: "Costco Wholesale Australia Pty Ltd",
  industry: "warehouse retail",
  instrument: {
    kind: "enterprise-agreement",
    title: "Costco Wholesale Australia Enterprise Agreement 2023-2027",
    reference: "AG2023/2769, AE522205",
    url: EA_URL,
    approvedOn: "8 November 2023 (PR768050), operating from 15 November 2023",
    nominalExpiry: "8 September 2027",
    coverage:
      "It covers Costco employees in every state and territory: warehouse (store) staff, depots, the optical lab, home office and member care. Salaried managers are paid under separate salary minimums set in Costco's undertakings to the Commission.",
  },
  ratesEffectiveFrom: "the first full pay period 24 months after the agreement began (on or after 15 November 2025)",
  nextIncrease: {
    date: "First full pay period 36 months after the agreement began (on or after about 15 November 2026)",
    detail:
      "The final printed column of cl 5.1: Service Assistant first step $30.02 → $30.92, Service Clerk first step $31.27 → $32.21, Tradesperson first step $36.24 → $37.33, and the Supervisor rate $36.27 → $37.32.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Service Assistant — first 980 hours", description: "Entry rate for stockers, cashier assistants, meat, bakery and deli assistants, and member service, liquor and fuel assistants", hourly: 30.02, casualHourly: 37.53 },
    { level: "Service Assistant — 8th step (after 6,860 hours)", description: "Top of the Service Assistant scale; the rate rises every 980 hours worked", hourly: 33.49, casualHourly: 41.86 },
    { level: "Service Clerk — first 980 hours", description: "Cashiers, forklift operators, front-end supervisors, receiving and membership clerks, tyre installers, optical dispensers", hourly: 31.27, casualHourly: 39.09 },
    { level: "Service Clerk — 8th step (after 6,860 hours)", description: "Top of the Service Clerk scale", hourly: 34.77, casualHourly: 43.46 },
    { level: "Supervisor (Service Assistant and Service Clerk)", description: "The printed Supervisor Rate for these two scales (Service Clerk top rate + $1.50)", hourly: 36.27, casualHourly: 45.34 },
    { level: "Tradesperson — first 980 hours", description: "Qualified butcher or baker", hourly: 36.24, casualHourly: 45.3 },
    { level: "Tradesperson — 8th step (after 6,860 hours)", description: "Top of the Tradesperson scale", hourly: 39.89, casualHourly: 49.86 },
    { level: "Tradesperson supervisor", description: "The printed Supervisor Rate for the Tradesperson scale", hourly: 41.39, casualHourly: 51.74 },
  ],
  juniorScale: [],
  juniorNote:
    "The Costco agreement has no junior rates, so employees of any age are paid the adult rate for their classification and step.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Ordinary rate", casual: "Ordinary rate + 25% loading" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "125%", casual: "150%" },
    { when: "Monday to Friday, 11pm to 7am", permanent: "150%", casual: "175%" },
    { when: "Saturday, 7am to 11pm", permanent: "125%", casual: "150%" },
    { when: "Saturday, 11pm to 7am", permanent: "150%", casual: "175%" },
    { when: "Sunday, all hours", permanent: "175%", casual: "175%" },
    { when: "Public holiday", permanent: "150% for each hour worked, plus ordinary pay for the day", casual: "275%", note: "Casual 275% is from Costco's undertaking to the Commission, replacing the 150% printed in the table" },
  ],
  penaltyNotes: [
    "Percentages are of your ordinary hourly rate (cl 6.6.1 for permanent staff, cl 4.2.3 for casuals). The casual percentages replace the 25% loading rather than adding to it, so casual Sunday is 175% — the same as permanent staff.",
    "Premiums and overtime do not stack: \"There is no duplication of overtime and/or premium rates\" (cl 6.6).",
    "For a Service Assistant on the first step ($30.02), that is $37.53 an hour on a weekday evening or Saturday (casual $45.03), $52.54 on a Sunday and $82.56 for a casual on a public holiday — our arithmetic.",
    "Operating a forklift or electric pallet jack adds $1.00 an hour for that time, but is not counted in the rate penalties are worked out from (cl 5.1.8).",
  ],
  overtime: [
    { when: "Over 8 hours a day or 38 a week (Monday to Saturday)", permanent: "150%", casual: "150%" },
    { when: "Consecutive hours over 11 in a day, and the 8th and later consecutive days", permanent: "200%", casual: "200%" },
  ],
  notices: [
    "Costco's rates are printed in the agreement and rise with hours worked, not just the calendar: you move up a step every 980 hours. Only the first and top steps of each scale are shown here; the agreement lists all eight.",
    "Costco pays long-serving hourly staff an \"Extra Cheque\" twice a year ($2,000 to $3,000 each, depending on hours worked; next pay date 19 November 2026 — cl 5.2). It is not included in the hourly rates.",
    "Casual rates in the table are the printed rate plus the 25% loading, worked out by us to the cent.",
  ],
  unverified: [
    "The exact date each rate column starts — it is the first full pay period 12, 24 or 36 months after 15 November 2023, and Costco's pay cycle dates are not printed.",
    "Whether casual employees move up the 980-hour steps — cl 6.9 mentions only full-time and part-time employees.",
    "Which Retail Award level each Costco classification matches — the agreement does not map them.",
    "Depot, home office and member care rates (separate scales in cl 5.1.4–5.1.7) are not shown here.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Costco Wholesale Australia Enterprise Agreement 2023-2027 (AE522205), with approval decision and undertakings", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Your pay and conditions at Costco", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/your-rights/agreements/costco-agreement/your-pay-and-conditions-at-costco/" },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
  ],
  faqs: [
    {
      q: "How much does Costco pay an hour in 2026?",
      a: "A new Costco Service Assistant is paid at least $30.02 an hour, rising every 980 hours worked to $33.49. Service Clerks such as cashiers and forklift operators start at $31.27 and reach $34.77, and qualified butchers and bakers start at $36.24. These are the agreement's printed rates from the first full pay period on or after 15 November 2025.",
    },
    {
      q: "What is the Costco casual rate?",
      a: "Casuals get a 25% loading on the ordinary rate: $37.53 an hour for a Service Assistant on the first step, or $39.09 for a Service Clerk. On Saturdays and weekday evenings the casual rate is 150%, and on Sundays 175%.",
    },
    {
      q: "Does Costco pay junior rates?",
      a: "No. The Costco agreement has no junior rates, so a 16 or 17 year old is paid the same adult rate as anyone else in the same classification and step.",
    },
    {
      q: "What does Costco pay on Sundays and public holidays?",
      a: "Sundays pay 175% for permanent and casual staff ($52.54 an hour for a first-step Service Assistant). Permanent staff working a public holiday get 150% for each hour on top of their ordinary pay for the day, and casuals get 275%.",
    },
    {
      q: "When is the next Costco pay rise?",
      a: "From the first full pay period 36 months after the agreement began, around mid-November 2026. The first Service Assistant step goes from $30.02 to $30.92 and the first Service Clerk step from $31.27 to $32.21. The agreement's nominal expiry date is 8 September 2027.",
    },
  ],
};
