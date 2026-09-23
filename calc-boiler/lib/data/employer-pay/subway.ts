// Subway — sandwich artists, shift leaders and store managers in Australian
// Subway restaurants, every one of which is run by an independent franchisee.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Each franchisee is the
// employer; there is no national Subway enterprise agreement. The Fair Work
// Ombudsman's 2019 compliance activity across 22 Subway franchisees assessed
// every one of them against the Fast Food Industry Award ("Section 45 –
// Contravening the Fast Food Industry Award 2010 (the Award)"; FWO Subway
// Compliance Activity Report, October 2019).
//
// ⚠️ NOT CONFIRMED ON THE FWC REGISTER. We could not search the Fair Work
// Commission's approved-agreement register for every Subway franchisee, and
// individual franchisees have applied for agreements in the past. The page
// therefore says the award applies UNLESS the franchisee has its own approved
// agreement — and that, either way, an agreement cannot pay a base rate below
// the award (Fair Work Act s 206), so these figures are the floor.
//
// Rates: award cl 15.1 Table 3 (varied PR799284, from the first full pay period
// on or after 1 July 2026), Schedule A for casual and junior dollars — the same
// transcription as mcdonalds.ts and lib/constants/modern-awards.ts, read from
// awards.fairwork.gov.au on 23 September 2026.
//
// Junior phase-in from 1 December 2026: determination PR813654 (18–20 year olds
// with more than 6 months' service). Re-verify the junior table after that date.

import type { EmployerPay } from "./types";

const AWARD_URL = "https://awards.fairwork.gov.au/MA000003.html";

export const SUBWAY_PAY: EmployerPay = {
  slug: "subway",
  name: "Subway",
  employerEntity: "The franchisee that owns your store — every Subway restaurant in Australia is independently owned and operated.",
  industry: "fast food",
  instrument: {
    kind: "modern-award",
    title: "Fast Food Industry Award 2020",
    reference: "MA000003",
    url: AWARD_URL,
    coverage:
      "Subway has no national enterprise agreement: each store is run by a franchisee who employs its own staff, and the Fast Food Industry Award covers them unless that franchisee has its own approved enterprise agreement. Even then, the agreement cannot pay a base rate below the award.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Staff aged 18 to 20 who have worked for their franchisee for more than 6 months move up: 18-year-olds from 70% to 75%, 19-year-olds from 80% to 85%, and 20-year-olds from 90% to 95% of the adult rate (determination PR813654). At Level 1 that is $20.86, $23.64 and $26.42 an hour. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Fast food employee level 1", description: "Sandwich artist: taking orders, preparing and serving food, and incidental cleaning", weekly: 1056.8, hourly: 27.81, casualHourly: 34.76 },
    { level: "Fast food employee level 2", description: "Has day-to-day responsibility for supervising Level 1 staff or training new staff (e.g. a shift leader or trainer)", weekly: 1119.1, hourly: 29.45, casualHourly: 36.81 },
    { level: "Fast food employee level 3 (in charge of one or no person)", description: "Appointed to be in charge of a store, supervising at most one other person", weekly: 1136.4, hourly: 29.91, casualHourly: 37.39 },
    { level: "Fast food employee level 3 (in charge of 2 or more people)", description: "Appointed to be in charge of a store, supervising two or more people", weekly: 1150.4, hourly: 30.27, casualHourly: 37.84 },
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
    "The Fast Food Award pays the full adult rate from 21 (cl 15.2). The dollar figures below are printed in the award's Schedule A for Level 1. Casual and part-time shifts must be at least 3 hours, including for school students.",
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
    "For an adult Level 1 sandwich artist that is $34.76 an hour on a Saturday or Sunday ($41.72 casual) and $62.57 on a public holiday ($69.53 casual).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 2 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "Your employer is the franchisee that owns your store, not Subway's head office. These are the Fast Food Industry Award minimums; some franchisees pay more.",
    "If your franchisee has its own approved enterprise agreement, that agreement sets your pay instead — but it cannot pay a base rate below these award rates (Fair Work Act s 206). Your payslip must name the award or agreement you are paid under.",
    "The Fair Work Ombudsman found 18 of 22 Subway franchisees it investigated in 2017–19 had breached workplace laws, including underpaying minimum wages, casual loadings and penalty rates. If your pay is below these figures, the Fair Work Infoline is 13 13 94.",
  ],
  unverified: [
    "Whether any individual Subway franchisee currently has its own approved enterprise agreement — we could not search the Fair Work Commission register store by store.",
    "Salaried store and area manager pay — set by individual contracts, not published.",
  ],
  awardHref: "/fast-food-award-rates/",
  awardLabel: "Fast Food Award rates 2026",
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Unpaid wages recovered for Subway employees (1 October 2019)", publisher: "Fair Work Ombudsman", url: "https://www.fairwork.gov.au/newsroom/media-releases/2019-media-releases/october-2019/20191001-subway-sica-media-release" },
    { title: "Subway Compliance Activity Report (assessed against the Fast Food Industry Award)", publisher: "Fair Work Ombudsman", url: "https://www.fairwork.gov.au/sites/default/files/migration/1151/subway-compliance-activity-report.docx" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Subway pay an hour in 2026?",
      a: "An adult Subway sandwich artist (Fast food employee level 1) must be paid at least $27.81 an hour, or $34.76 as a casual, from 1 July 2026. Staff who supervise or train others (Level 2) get $29.45, and a person put in charge of a store (Level 3) gets $29.91 or $30.27.",
    },
    {
      q: "How much does Subway pay a 15 year old?",
      a: "Staff under 16 are paid 40% of the adult rate: $11.12 an hour, or $13.90 as a casual. At 16 it is $13.91 ($17.39 casual) and at 17 $16.69 ($20.86 casual). The full adult rate applies from 21.",
    },
    {
      q: "Does Subway have an enterprise agreement?",
      a: "There is no national Subway agreement. Every Australian Subway store is owned by a franchisee who employs the staff, and the Fast Food Industry Award applies unless that franchisee has its own approved agreement. An agreement cannot pay a base rate below the award.",
    },
    {
      q: "What are Subway penalty rates on Sunday?",
      a: "Level 1 staff are paid 125% on Sundays ($34.76 an hour) and casuals 150% ($41.72). Levels 2 and 3 are paid 150% (casual 175%). Public holidays pay 225% (casual 250%).",
    },
    {
      q: "Do Subway junior rates go up in December 2026?",
      a: "Yes, for 18 to 20 year olds who have been with their franchisee for more than 6 months. From the first full pay period on or after 1 December 2026 they move five percentage points closer to the adult rate, reaching it in stages by July 2029. Under-18 rates do not change.",
    },
  ],
};
