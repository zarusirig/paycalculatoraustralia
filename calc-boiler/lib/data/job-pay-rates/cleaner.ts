// Cleaner — Cleaning Services Award 2020 [MA000022] (T5, wave 3).
//
// Rows are READ FROM lib/constants/modern-awards.ts (CLEANING_AWARD, added by
// T4), the same table /cleaning-award-rates/ renders.
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000022.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799303 and PR799460)". Read 23 September 2026.
//   - Weekly and hourly: cl 15.1, Table 2.
//   - Casual: cl 11.2 — hourly + 25%; matches the FWO pay guide (24 June 2026).
//   - ⚠️ PART-TIME EMPLOYEES GET A 15% ALLOWANCE on every ordinary hour
//     (cl 10.2), so a part-time Level 1 cleaner's ordinary rate is $31.14,
//     not $27.08. This is the award's own rule and the pay guide prints it.
//   - Penalties: cl 20.2, Table 7 (separate full-time / part-time / casual
//     columns). Overtime: cl 19.3, Table 5.
//   - Allowances: cl 17.
//
// Median: Jobs and Skills Australia, ANZSCO 8112 Commercial Cleaners, $1,254 a
// week / $33 an hour (ABS SEEH May 2025), read 23 September 2026.

import { CLEANING_AWARD } from "../../constants/modern-awards";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  rowFromModernAward,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const CODE = "MA000022";

const MEDIAN: MedianEarnings = {
  anzscoCode: "8112",
  anzscoTitle: "Commercial Cleaners",
  medianWeekly: 1_254,
  medianHourly: 33,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("8112-commercial-cleaners"),
};

const r = (level: string, note: string): RateRow => rowFromModernAward(CLEANING_AWARD, level, `Cleaning Services Employee ${level}`, note);

export const CLEANER_ROWS: RateRow[] = [
  r("Level 1", "General cleaning, vacuuming, toilets, rubbish, trolley collection"),
  r("Level 2", "Carpet cleaning, ride-on machinery, pressure washing, leading hand"),
  r("Level 3", "Building supervisor: coordinates Level 1 and 2 cleaners"),
];

export const CLEANER: Occupation = {
  slug: "cleaner",
  name: "Cleaner",
  plural: "cleaners",
  award: {
    name: "Cleaning Services Award 2020",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: CLEANING_AWARD.meta.href,
  },
  headline: {
    tableId: "cleaners",
    label: "Cleaning Services Employee Level 1",
    why: "a commercial cleaner doing general cleaning work",
  },
  coverage: [
    "Cleaners employed by cleaning contractors — the businesses that clean offices, shopping centres, schools, hospitals and other buildings under contract — are covered by the Cleaning Services Award 2020 [MA000022]. It also covers shopping trolley collection contractors.",
    "Cleaners employed directly by a hotel, hospital, aged care home, school or retailer are usually covered by that industry's own award instead (for example the Hospitality Award or the Aged Care Award general stream), which has different rates.",
    "Level 1 covers the tasks most cleaners do: sweeping, mopping, vacuuming, spot cleaning, toilet cleaning, rubbish collection, glass and dusting (Schedule A.1). Level 2 works from complex instructions and may do carpet cleaning, ride-on machinery, steam or pressure cleaning, exterior window cleaning from swing stages, or leading hand duties (Schedule A.2). Level 3 coordinates the work of Level 1 and 2 cleaners as a building supervisor or manager (Schedule A.3).",
    "Part-time cleaners are paid a 15% part-time allowance on top of the minimum hourly rate for every ordinary hour (cl 10.2). A part-time Level 1 cleaner's ordinary rate is therefore $31.14 an hour, not $27.08.",
  ],
  tables: [
    {
      id: "cleaners",
      title: "Cleaner pay rates by level, 2026–27",
      intro:
        "Clause 15.1, Table 2 of the Cleaning Services Award, from the first full pay period on or after 1 July 2026. The hourly column is the full-time rate; part-timers add 15% (cl 10.2) and casuals add 25% (cl 11.2).",
      rows: CLEANER_ROWS,
    },
  ],
  penalties: [
    { when: "Monday–Friday shift starting before 6 am or finishing after 6 pm", permanent: "115%", casual: "140%" },
    { when: "Non-rotating night shift finishing after midnight and by 8 am", permanent: "130%", casual: "155%" },
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (cl 20.2, Table 7). The \"permanent\" column is the full-time rate. Part-time cleaners have their own column that includes the 15% part-time allowance: 130% for early or late weekday shifts, 130% for non-rotating night shifts, 165% on Saturday, 215% on Sunday and 265% on public holidays. Casual rates include the 25% loading.",
  overtime: [
    "Full-time and part-time: 150% for the first 2 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250% (cl 19.3, Table 5).",
    "Casual: 175% for the first 2 hours Monday to Saturday, then 225%; Sunday 225%; public holiday 275% — the casual loading is included.",
    "Overtime on each day stands alone (cl 19.4).",
  ],
  allowances: [
    { name: "Toilet cleaning allowance", amount: "$3.69 per shift or $18.17 per week", note: "If you are employed for the major part of a day or shift to clean toilets (cl 17.9)." },
    { name: "Broken shift allowance", amount: "$4.71 per day", note: "Up to $23.56 a week (cl 17.2)." },
    { name: "First aid allowance", amount: "$16.87 per week", note: "If you hold a current first aid qualification and are appointed in writing to perform first aid duty (cl 17.6)." },
    { name: "Refuse collection allowance", amount: "$4.69 per shift", note: "If you spend most of a shift collecting, disposing of or sorting refuse, or feeding an incinerator or compactor (cl 17.8)." },
    { name: "Height allowance", amount: "$1.11 per hour", note: "Working from a swing scaffold, bosun's chair or similar up to the 22nd floor; $2.27 above it (cl 17.5)." },
    { name: "Leading hand allowance", amount: "$61.73 per week", note: "In charge of up to 10 employees; $79.43 for 11–20 and $97.13 for more than 20 (cl 17.7)." },
    { name: "Vehicle allowance", amount: "$1.01 per km", note: "If the employer requires you to use your own car; $0.34 per km for a motorcycle (cl 17.11)." },
  ],
  median: MEDIAN,
  notices: [
    "Many large cleaning contractors pay under an enterprise agreement. It must still leave you no worse off than this award overall.",
  ],
  notShown: [
    "Junior rates, which the award sets only for employees of shopping trolley collection contractors (cl 15.2).",
    "Cold and hot work allowances (cl 17.3–17.4) and travel time rules (cl 17.12).",
    "National Training Wage trainee rates (cl 15.5).",
  ],
  faqs: [
    {
      q: "What is the award rate for a cleaner in 2026?",
      a: "A Level 1 cleaner must be paid at least $27.08 an hour, or $1,028.90 a week full-time, under the Cleaning Services Award from the first full pay period on or after 1 July 2026 — $53,503 a year before tax. Level 2 is $27.97 and Level 3 $29.45 an hour.",
    },
    {
      q: "What is the casual rate for a cleaner?",
      a: "A casual Level 1 cleaner earns at least $33.85 an hour on weekdays, the $27.08 rate plus the 25% casual loading. Casuals get 175% on Saturday ($47.39), 225% on Sunday ($60.93) and 275% on public holidays ($74.47).",
    },
    {
      q: "Do part-time cleaners get paid more per hour?",
      a: "Yes. The Cleaning Services Award adds a 15% part-time allowance to every ordinary hour (cl 10.2), so a part-time Level 1 cleaner earns at least $31.14 an hour. In exchange the employer can roster up to 7.6 hours a day without paying overtime.",
    },
    {
      q: "How much do cleaners get paid on a Sunday?",
      a: "Full-time cleaners get 200% on Sunday — $54.16 an hour at Level 1. Part-time cleaners get 215% ($58.22) and casuals 225% ($60.93).",
    },
    {
      q: "What do cleaners actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,254 a week for commercial cleaners (ABS Survey of Employee Earnings and Hours, May 2025), about $65,208 a year.",
    },
  ],
  sources: [
    { title: "Cleaning Services Award 2020 [MA000022] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    { title: "Pay Guide — Cleaning Services Award [MA000022], published 24 June 2026", publisher: "Fair Work Ombudsman", url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/cleaning-services-award-ma000022-pay-guide.pdf.aspx" },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/cleaning-award-rates/", label: "Cleaning Award Pay Rates" },
    { href: "/job-pay-rates/aged-care-worker/", label: "Aged Care Worker Pay Rates" },
    { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates Guide" },
    { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
    { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  ],
};
