// Real estate agent (salesperson) — Real Estate Industry Award 2020 [MA000106].
// Rates and sourcing notes: ./real-estate-common.ts.
//
// Commission-only (cl 16.7): only Level 2+ in property sales or commercial,
// industrial or retail leasing; not part-time, casual, junior, Level 1 or a
// trainee; at least 21; licensed/registered; 12 consecutive months at Level 2+
// in the prior 3 years (or ran their own real estate business); and, for
// agreements after 2 April 2018, proof of earning the Minimum Income Threshold
// Amount — 125% of the classification rate, annualised, excluding super —
// in a 12-month period in the prior 3 years.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  jsaSource,
  jsaUrl,
} from "./common";
import {
  REAL_ESTATE_AWARD,
  REAL_ESTATE_OVERTIME,
  REAL_ESTATE_PENALTIES,
  REAL_ESTATE_PENALTIES_NOTE,
  REAL_ESTATE_ROWS,
} from "./real-estate-common";
import type { MedianEarnings, Occupation } from "./types";

export const REAL_ESTATE_MEDIAN: MedianEarnings = {
  anzscoCode: "6121",
  anzscoTitle: "Real Estate Sales Agents",
  medianWeekly: 1_504,
  medianHourly: 40,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("6121-real-estate-sales-agents"),
};

export const REAL_ESTATE_AGENT: Occupation = {
  slug: "real-estate-agent",
  name: "Real Estate Agent",
  plural: "real estate agents",
  award: REAL_ESTATE_AWARD,
  headline: {
    tableId: "real-estate",
    label: "Level 2 (Representative)",
    why: "a salesperson responsible for listing and selling property",
  },
  coverage: [
    "Real estate salespeople employed by an agency are covered by the Real Estate Industry Award 2020 [MA000106]. The award has four levels. Level 1 (Associate) assists more senior staff and does not list or sell property. Level 2 (Representative) is responsible for listing and selling property or businesses, or helping clients buy. Levels 3 and 4 are supervisory and in-charge roles.",
    "The award allows a salesperson to be paid wages, wages plus commission, bonus or incentive payments (cl 16.1), or commission only (cl 16.7). The minimum weekly rates below apply to everyone except commission-only employees (cl 14.3). Commission-only is allowed only for Level 2 and above, and only if every condition in clause 16.7 is met.",
  ],
  tables: [
    {
      id: "real-estate",
      title: "Real estate agent minimum pay rates 2026–27",
      intro:
        "Weekly rates from clause 14.1 of the award. Hourly and casual rates from the award's Schedule B. These apply to salaried and retainer-plus-commission employees, not to commission-only agents.",
      rows: REAL_ESTATE_ROWS,
    },
  ],
  penalties: REAL_ESTATE_PENALTIES,
  penaltiesNote: REAL_ESTATE_PENALTIES_NOTE,
  overtime: REAL_ESTATE_OVERTIME,
  allowances: [],
  median: REAL_ESTATE_MEDIAN,
  notices: [
    "Commission-only agents are not paid the minimum weekly rate (cl 14.3). The award's objective is that a commission-only salesperson should earn 125% or more of the annual minimum wage for their level (cl 16.7(b)).",
  ],
  notShown: [
    "Commission percentages: the award leaves them to the written agreement between you and the agency.",
    "Junior rates, which apply to associates under 21 but never to commission-only agents.",
    "Vehicle and other expense allowances in clause 17.",
  ],
  faqs: [
    {
      q: "What is the minimum wage for a real estate agent in 2026?",
      a: "A Level 2 (Representative) real estate agent must be paid at least $1,119.10 a week, or $29.45 an hour, under the Real Estate Industry Award 2020 from the first full pay period on or after 1 July 2026. That is $58,193 a year before tax.",
    },
    {
      q: "Can a real estate agent be paid commission only?",
      a: "Only if every clause 16.7 condition is met: you are Level 2 or above in sales or leasing, full-time (not casual or part-time), at least 21, licensed or registered, have 12 consecutive months' experience at Level 2 or higher in the last 3 years (or ran your own real estate business), and can show you earned at least 125% of your classification's annual minimum in a 12-month period in those 3 years.",
    },
    {
      q: "Do real estate agents get weekend penalty rates?",
      a: "No. Ordinary hours under the Real Estate Industry Award can be worked on any day of the week, so Saturday and Sunday are paid at the normal rate. Public holidays are paid at 200% and overtime at 150% for the first 2 hours, then 200%.",
    },
    {
      q: "What is the casual rate for a real estate agent?",
      a: "A casual Level 2 agent earns at least $36.81 an hour, which includes the 25% casual loading. Casuals cannot be employed on a commission-only basis.",
    },
    {
      q: "What do real estate agents actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,504 a week for real estate sales agents, a group that also includes property managers (ABS Survey of Employee Earnings and Hours, May 2025). Individual earnings depend heavily on commission.",
    },
  ],
  sources: [
    { title: "Real Estate Industry Award 2020 [MA000106] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: REAL_ESTATE_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(REAL_ESTATE_MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/property-manager/", label: "Property Manager Pay Rates" },
    { href: "/commission-tax-calculator/", label: "Commission Tax Calculator" },
    { href: "/award-rates/", label: "Award Rates" },
  ],
};
