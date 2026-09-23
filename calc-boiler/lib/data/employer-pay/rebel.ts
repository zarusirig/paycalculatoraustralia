// Rebel — waged team members in rebel stores (Rebel Sport Limited, part of
// Super Retail Group).
//
// Instrument: Super Retail Group Retail & CCC Enterprise Agreement 2024,
// AG2024/952, AE524487, approved 2 May 2024 (Slevin DP, PR774437; paragraph
// [15] corrected to operation from 14 July 2024), nominal expiry 30 June 2027.
// Parties: Macpac Retail, Super Cheap Auto, SRG Leisure Retail (BCF), Super
// Retail Group Services and Rebel Sport Limited, plus the SDA (cl 3). It does
// not cover store management or support office roles (cl 4). Replaced the
// Super Retail Group Enterprise Agreement 2018 (AE507015). Read from the FWC
// PDF on 24 September 2026.
//
// EVERY DOLLAR IS PRINTED: Appendix A cl 304, "from the first full pay cycle on
// or after 1 July 2026" (table headed "From 5 July 2026"), Retail Team Member
// Levels 1–3, permanent and casual, by age. Casual rates include the 25%
// loading (cl 15). Penalties and overtime are printed only as dollars, so the
// page shows the Level 1 dollars rather than percentages. Checked above the
// Retail Award 2026 base rates: L1 $28.20 > $27.81, L2 $28.83 > $28.45,
// L3 $30.39 > $28.89.
//
// Juniors: the printed tables start at 16 (50%), 17 60%, 18 70%, 19 80%, adult
// from 20. From 1 Dec 2026 the Retail Award phase-in (PR813655) pays 18- and
// 19-year-olds with >6 months' service $20.86 / $23.64 at award Level 1 —
// above the agreement's $19.74 / $22.56 — s 206 floor, flagged on the page.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/AE524487.pdf";

export const REBEL_PAY: EmployerPay = {
  slug: "rebel",
  name: "Rebel",
  employerEntity: "Rebel Sport Limited (Super Retail Group)",
  industry: "sporting goods retail",
  instrument: {
    kind: "enterprise-agreement",
    title: "Super Retail Group Retail & CCC Enterprise Agreement 2024",
    reference: "AG2024/952, AE524487",
    url: EA_URL,
    approvedOn: "2 May 2024 (PR774437), operating from 14 July 2024",
    nominalExpiry: "30 June 2027",
    coverage:
      "One agreement covers waged team members at rebel, Supercheap Auto, BCF and Macpac stores and Super Retail Group's customer care centre. It does not cover store managers or support office staff.",
  },
  ratesEffectiveFrom: "the first full pay cycle on or after 1 July 2026 (5 July 2026)",
  nextIncrease: null,
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Retail Team Member Level 1", description: "Sales assistant: customer service, point of sale, stock work, online orders, product fitting and assembly — equivalent to Retail Award Level 1", hourly: 28.2, casualHourly: 35.25 },
    { level: "Retail Team Member Level 2", description: "Level 1 duties plus operating a forklift or ride-on equipment — equivalent to Retail Award Level 2", hourly: 28.83, casualHourly: 36.04 },
    { level: "Supervisor / Shift Supervisor (Level 3)", description: "Helps management supervise the store and team, opens or closes the store — equivalent to Retail Award Level 3", hourly: 30.39, casualHourly: 37.98 },
  ],
  juniorScale: [
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "The agreement prints junior dollars for Levels 1 to 3 from age 16; the figures below are its Level 1 rates. A junior acting as a Supervisor at Level 4 gets the adult rate (undertaking, Annexure A).",
  publishedJuniorRates: [
    { age: "16", hourly: 14.1, casualHourly: 17.62 },
    { age: "17", hourly: 16.92, casualHourly: 21.15 },
    { age: "18", hourly: 19.74, casualHourly: 24.67 },
    { age: "19", hourly: 22.56, casualHourly: 28.2 },
    { age: "20 and over", hourly: 28.2, casualHourly: 35.25 },
  ],
  penalties: [
    { when: "Monday to Friday, before 6pm", permanent: "$28.20 (base rate)", casual: "$35.25" },
    { when: "Monday to Friday after 6pm (late night), and Saturday", permanent: "$34.40", casual: "$41.45" },
    { when: "Sunday", permanent: "$41.45", casual: "$48.50" },
    { when: "Public holiday", permanent: "$62.60", casual: "$69.65" },
  ],
  penaltyNotes: [
    "The agreement prints penalty rates as dollars for each level and age, not as percentages. The table shows the adult Level 1 figures from 5 July 2026; Level 2 is $35.18 late night or Saturday, $42.39 Sunday and $64.01 public holiday, and the Supervisor level $37.07, $44.67 and $67.46.",
    "Casual figures include the 25% casual loading.",
  ],
  overtime: [
    { when: "First 3 hours", permanent: "$41.45", casual: "$48.50" },
    { when: "After 3 hours", permanent: "$55.55", casual: "$62.60" },
    { when: "Public holiday", permanent: "$69.65", casual: "$76.69" },
  ],
  notices: [
    "The same agreement covers Supercheap Auto, BCF and Macpac stores, so their waged team members are paid these rates too.",
    "From the first full pay period on or after 1 December 2026, the Retail Award pays 18-year-olds with more than 6 months' service 75% of the award rate ($20.86) and 19-year-olds 85% ($23.64). That is more than rebel's printed $19.74 and $22.56, and an agreement cannot pay a base rate below the award, so those staff must get at least the award figures.",
    "The agreement prints no rates after July 2026. Its nominal expiry date is 30 June 2027, so the next rise depends on a new agreement.",
  ],
  unverified: [
    "Rates for team members under 16 — the agreement's tables start at 16.",
    "Store manager and assistant manager pay — not covered by the agreement.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Super Retail Group Retail & CCC Enterprise Agreement 2024 (AE524487), with approval decision PR774437, correction and undertakings", publisher: "Fair Work Commission", url: EA_URL },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
    { title: "Junior rates determination PR813655 (Retail Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813655.pdf" },
  ],
  faqs: [
    {
      q: "How much does Rebel pay an hour in 2026?",
      a: "An adult Retail Team Member Level 1 at rebel is paid $28.20 an hour, or $35.25 as a casual, from 5 July 2026 under the Super Retail Group Retail & CCC Enterprise Agreement 2024. Level 2 (forklift and ride-on operators) gets $28.83 and a Supervisor $30.39.",
    },
    {
      q: "What agreement covers Rebel staff?",
      a: "The Super Retail Group Retail & CCC Enterprise Agreement 2024 (AE524487). It covers rebel, Supercheap Auto, BCF and Macpac store team members, started on 14 July 2024 and has a nominal expiry date of 30 June 2027.",
    },
    {
      q: "How much does Rebel pay a 16 or 17 year old?",
      a: "The agreement prints $14.10 an hour for a 16-year-old Level 1 team member ($17.62 casual) and $16.92 for a 17-year-old ($21.15 casual). At 18 it is $19.74 and at 19 $22.56; adults are paid from 20.",
    },
    {
      q: "What does Rebel pay on Sundays and public holidays?",
      a: "An adult Level 1 team member gets $41.45 an hour on a Sunday ($48.50 casual) and $62.60 on a public holiday ($69.65 casual). Weeknights after 6pm and Saturdays pay $34.40 ($41.45 casual).",
    },
    {
      q: "Is Supercheap Auto or BCF pay the same as Rebel?",
      a: "Yes, for waged store team members. rebel, Supercheap Auto, BCF and Macpac are all parties to the same Super Retail Group agreement, with the same classifications and rates.",
    },
  ],
};
