// McDonald's — crew and managers paid hourly, company-owned and licensee
// (franchise) restaurants alike.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). The McDonald's
// Australia Enterprise Agreement 2013 (AE402596) was terminated by
// [2019] FWCA 8563 (Colman DP, 19 Dec 2019), operative 3 February 2020. The
// 2019 replacement application was discontinued. [2025] FWCFB 130 at [81]
// records that McDonald's and its licensees "are content to continue to apply
// the FFI Award" and that "No individual licensee has ever entered into an
// enterprise agreement under the FW Act." No McDonald's agreement appears in
// the FWC's approved-agreement lists to September 2026.
//
// Rates: award cl 15.1 Table 3 (varied PR799284, from the first full pay period
// on or after 1 July 2026), Schedule A for casual and junior dollars. Read from
// awards.fairwork.gov.au on 23 September 2026.
//
// Penalties: cl 21 Table 6. Casual = FT/PT % + 25 points (Note 1), additive.
// Sunday is 125% at Level 1 but 150% at Levels 2 and 3.
//
// ⚠️ JUNIOR PHASE-IN IS FINAL: determination PR813654 (26 Aug 2026, following
// [2026] FWCFB 222) lifts 18–20 year olds with more than 6 months' service from
// the first full pay period on or after 1 December 2026 (Level 1 FT/PT: 18
// $20.86, 19 $23.64, 20 $26.42). Re-verify the junior table after that date.

import type { EmployerPay } from "./types";

const AWARD_URL = "https://awards.fairwork.gov.au/MA000003.html";

export const MCDONALDS_PAY: EmployerPay = {
  slug: "mcdonalds",
  name: "McDonald's",
  employerEntity:
    "McDonald's Australia for company-owned restaurants; each licensee (franchisee) business for its own restaurants.",
  industry: "fast food",
  instrument: {
    kind: "modern-award",
    title: "Fast Food Industry Award 2020",
    reference: "MA000003",
    url: AWARD_URL,
    coverage:
      "McDonald's has no enterprise agreement: its 2013 agreement was terminated from 3 February 2020, and company restaurants and licensees have applied the Fast Food Industry Award since. The Fair Work Commission has authorised the SDA union to bargain with McDonald's licensees, but no agreement had been approved by September 2026.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Crew aged 18 to 20 who have worked for their employer for more than 6 months move up: 18-year-olds from 70% to 75%, 19-year-olds from 80% to 85%, and 20-year-olds from 90% to 95% of the adult rate (determination PR813654). At Level 1 that is $20.86, $23.64 and $26.42 an hour. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Fast food employee level 1", description: "Crew: taking orders, preparing, cooking, selling and serving food, plus incidental cleaning", weekly: 1056.8, hourly: 27.81, casualHourly: 34.76 },
    { level: "Fast food employee level 2", description: "Has day-to-day responsibility for supervising Level 1 crew or training new staff, or uses trade skills", weekly: 1119.1, hourly: 29.45, casualHourly: 36.81 },
    { level: "Fast food employee level 3 (in charge of one or no person)", description: "Appointed to be in charge of a restaurant, supervising at most one other person", weekly: 1136.4, hourly: 29.91, casualHourly: 37.39 },
    { level: "Fast food employee level 3 (in charge of 2 or more people)", description: "Appointed to be in charge of a restaurant, supervising two or more people", weekly: 1150.4, hourly: 30.27, casualHourly: 37.84 },
  ],
  juniorScale: [
    { age: "Under 16", percentage: 0.4 },
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20", percentage: 0.9 },
    { age: "21 and over", percentage: 1 },
  ],
  juniorNote:
    "The Fast Food Award pays the full adult rate from 21 (cl 15.2). The dollar figures below are printed in the award's Schedule A for Level 1. There is no shorter minimum shift for school students in this award: casual and part-time shifts must be at least 3 hours.",
  publishedJuniorRates: [
    { age: "Under 16", hourly: 11.12, casualHourly: 13.9 },
    { age: "16", hourly: 13.91, casualHourly: 17.39 },
    { age: "17", hourly: 16.69, casualHourly: 20.86 },
    { age: "18", hourly: 19.47, casualHourly: 24.34 },
    { age: "19", hourly: 22.25, casualHourly: 27.81 },
    { age: "20", hourly: 25.03, casualHourly: 31.29 },
    { age: "21 and over", hourly: 27.81, casualHourly: 34.76 },
  ],
  penalties: [
    { when: "Monday to Friday, 6am to 10pm", permanent: "100%", casual: "125%" },
    { when: "Monday to Friday, 10pm to midnight", permanent: "110%", casual: "135%" },
    { when: "Monday to Friday, midnight to 6am", permanent: "115%", casual: "140%" },
    { when: "Saturday", permanent: "125%", casual: "150%" },
    { when: "Sunday — Level 1", permanent: "125%", casual: "150%" },
    { when: "Sunday — Levels 2 and 3", permanent: "150%", casual: "175%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltyNotes: [
    "Percentages are of the minimum hourly rate for your level (award cl 21, Table 6). Casual figures add the 25% loading rather than multiply it: Saturday casual is 150%, not 156.25%.",
    "There is no evening penalty before 10pm on weekdays.",
    "For an adult Level 1 crew member that is $34.76 an hour on a Saturday or Sunday ($41.72 casual) and $62.57 on a public holiday ($69.53 casual).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 2 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "McDonald's crew are paid under the Fast Food Industry Award, not an enterprise agreement. Some licensees pay above it; these are the legal minimums.",
    "A class action over paid rest breaks at McDonald's, filed in the Federal Court in December 2021, was still running when we checked. It does not change the rates on this page.",
  ],
  unverified: [
    "Salaried restaurant and area manager pay — set by individual contracts, not published.",
    "The Fair Work Commission citation for the 2026 national bargaining authorisation — reported by the SDA; we could not retrieve the decision itself.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Termination of the McDonald's Australia Enterprise Agreement 2013, [2019] FWCA 8563", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/decisionssigned/html/2019fwca8563.htm" },
    { title: "Supported bargaining authorisation, [2025] FWCFB 130", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/sites/b2024-992/2025fwcfb130.pdf" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does McDonald's pay an hour in 2026?",
      a: "An adult McDonald's crew member (Fast food employee level 1) is paid at least $27.81 an hour, or $34.76 as a casual, from 1 July 2026. Crew who supervise or train others (Level 2) get $29.45, and employees put in charge of a restaurant (Level 3) get $29.91 or $30.27.",
    },
    {
      q: "How much does McDonald's pay a 15 year old?",
      a: "Crew under 16 are paid 40% of the adult rate: $11.12 an hour, or $13.90 as a casual. At 16 it is $13.91 ($17.39 casual) and at 17 $16.69 ($20.86 casual). The full adult rate applies from 21.",
    },
    {
      q: "Does McDonald's have an enterprise agreement?",
      a: "No. The McDonald's Australia Enterprise Agreement 2013 was terminated from 3 February 2020, and McDonald's and its licensees have paid under the Fast Food Industry Award since. Union bargaining for a new agreement has been authorised but nothing had been approved by September 2026.",
    },
    {
      q: "What are McDonald's penalty rates on Sunday?",
      a: "Level 1 crew are paid 125% on Sundays ($34.76 an hour) and casual crew 150% ($41.72). Levels 2 and 3 are paid 150% (casual 175%). Public holidays pay 225% (casual 250%).",
    },
    {
      q: "Do McDonald's junior rates go up in December 2026?",
      a: "Yes, for 18 to 20 year olds who have been with their employer for more than 6 months. From the first full pay period on or after 1 December 2026 they move five percentage points closer to the adult rate, reaching it in stages by July 2029. Under-18 rates do not change.",
    },
  ],
};
