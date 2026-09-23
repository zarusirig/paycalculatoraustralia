// Bus driver — Passenger Vehicle Transportation Award 2020 [MA000063].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000063.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799343 and PR799499)". Read 23 September 2026.
//   - Weekly and hourly: cl 15.1 (varied by PR799343 ppc 01Jul26).
//   - Casual: Schedule B.2.1 "Ordinary hours" (125%).
//   - Classifications: Schedule A (A.1–A.6).
//   - Penalties: cl 20.1 (employees other than two-driver operations).
//   - Overtime: cl 19.2 — 150% for the first 3 hours, 200% after.
//
// Drivers employed under an enterprise agreement (government operators and many
// contracted route operators) are paid under that agreement. The page says the
// award is the minimum and does not estimate agreement rates.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "7312",
  anzscoTitle: "Bus and Coach Drivers",
  medianWeekly: 1_795,
  medianHourly: 41,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("7312-bus-and-coach-drivers"),
};

export const BUS_DRIVER: Occupation = {
  slug: "bus-driver",
  name: "Bus Driver",
  plural: "bus drivers",
  award: {
    name: "Passenger Vehicle Transportation Award 2020",
    code: "MA000063",
    url: awardTextUrl("MA000063"),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "passenger-vehicle",
    label: "Grade 4",
    why: "a route bus driver on a bus carrying 25 or more passengers",
  },
  coverage: [
    "Bus and coach drivers employed by private operators are covered by the Passenger Vehicle Transportation Award 2020 [MA000063]. Your grade depends on the bus and the work, set out in Schedule A of the award.",
    "Grade 2 includes school bus drivers carrying fewer than 25 children. Grade 3 covers school buses carrying 25 or more children, route buses carrying fewer than 25 passengers, and charter or single-day tour work with a return distance under 650 km. Grade 4 covers route buses carrying 25 or more passengers and coach drivers on extended tours of 650 km or more.",
    "Grade 5 drivers instruct and induct other drivers and operate special services, and Grade 6 are supervisors and trainers who also drive.",
    "Route drivers employed by a state government operator, or by a contractor with a registered enterprise agreement, are paid under that agreement instead. The award is the legal minimum for employers it covers.",
  ],
  tables: [
    {
      id: "passenger-vehicle",
      title: "Bus driver pay rates by grade, 2026–27",
      intro: "Clause 15.1 of the award. Casual rates from the award's Schedule B.2.1.",
      rows: [
        { label: "Grade 1", weekly: 1038.8, hourly: 27.34, casualHourly: 34.18, note: "Non-driving: yard, cleaning, coach attendants" },
        { label: "Grade 2", weekly: 1062.9, hourly: 27.97, casualHourly: 34.96, note: "School bus under 25 children; hire car" },
        { label: "Grade 3", weekly: 1122.8, hourly: 29.55, casualHourly: 36.94, note: "School bus 25+; small route bus; charter under 650 km" },
        { label: "Grade 4", weekly: 1162.4, hourly: 30.59, casualHourly: 38.24, note: "Route bus 25+ passengers; extended coach tours" },
        { label: "Grade 5", weekly: 1226.3, hourly: 32.27, casualHourly: 40.34, note: "Driver who instructs and inducts others" },
        { label: "Grade 6", weekly: 1280.5, hourly: 33.7, casualHourly: 42.13, note: "Supervisor / trainer" },
      ],
    },
  ],
  penalties: [
    { when: "Early or late work (before 6 am or after 7 pm)", permanent: "115%", casual: "140%" },
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate for ordinary hours (cl 20.1). Casual percentages include the 25% loading. Penalty and overtime rates are not cumulative — you get whichever is higher. Two-driver operations have a different table (cl 20.2).",
  overtime: [
    "150% for the first 3 hours, then 200% (cl 19.2).",
    "Where overtime and a penalty both apply, you are paid the higher of the two, not both.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Junior drivers aged 18 or over who drive a passenger vehicle in sole charge must be paid the adult rate for that class of work (cl 15.2(b)).",
  ],
  notShown: [
    "Two-driver operation rates (cl 20.2), which use a different structure.",
    "Enterprise agreement rates for state government and contracted route operators.",
    "Allowances such as meal and first aid allowances.",
  ],
  faqs: [
    {
      q: "What is the award rate for a bus driver in 2026?",
      a: "A route bus driver on a bus carrying 25 or more passengers is Grade 4 under the Passenger Vehicle Transportation Award, with a minimum of $30.59 an hour or $1,162.40 a week from the first full pay period on or after 1 July 2026. That is $60,445 a year before tax.",
    },
    {
      q: "How much do school bus drivers get paid?",
      a: "A school bus driver carrying fewer than 25 children is Grade 2 ($27.97 an hour). Carrying 25 or more children is Grade 3 ($29.55 an hour). Casual rates are $34.96 and $36.94.",
    },
    {
      q: "What is the casual rate for a bus driver?",
      a: "A casual Grade 4 bus driver earns at least $38.24 an hour for ordinary hours. Early or late work is 140%, Saturday 175% and Sunday 225% of the minimum hourly rate for casuals.",
    },
    {
      q: "Do bus drivers get penalty rates for early starts?",
      a: "Yes. Ordinary hours worked before 6 am or after 7 pm are paid at 115% for permanent drivers and 140% for casuals.",
    },
    {
      q: "What do bus drivers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,795 a week for bus and coach drivers (ABS Survey of Employee Earnings and Hours, May 2025). That is about $630 a week above the Grade 4 award minimum; the median includes drivers paid under enterprise agreements.",
    },
  ],
  sources: [
    { title: "Passenger Vehicle Transportation Award 2020 [MA000063] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000063") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/truck-driver/", label: "Truck Driver Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
  ],
};
