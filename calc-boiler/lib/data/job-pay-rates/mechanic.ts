// Mechanic (motor mechanic / automotive technician, incl. diesel) — Vehicle
// Repair, Services and Retail Award 2020 [MA000089] (T5, wave 3).
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000089.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799369 and PR799524)". Read 23 September 2026.
//   - Weekly and hourly: cl 16.2 (wage group levels R1–R7).
//   - "Motor mechanic/automotive technician" is listed in Schedule A.1.5
//     (tradesperson or equivalent Level I, R6). R7 needs a Certificate IV
//     automotive qualification and is the Master Technician level (A.1.6).
//   - Casual: cl 11.3(a) — the loading varies by time: 25% Mon–Fri 6 am–6 pm,
//     50% Mon–Fri 6 pm–6 am, 75% Saturday, 125% Sunday, 175% public holiday.
//     Loadings are not cumulative (cl 11.3(b)).
//   - Permanent weekend rates: cl 23.2. Shift rates: cl 25.2. Overtime: cl 24.
//   - No all-purpose allowance: cl 18.1(b) says wage-related allowances are
//     not subject to penalty additions. The tool allowance is expense-related
//     (cl 19.6).
// R1 ($978.10) is below the adult NMW because it is the AWR 2026 entry-level
// floor; it is not relevant to a mechanic and is not shown.
//
// Median: Jobs and Skills Australia, ANZSCO 3212 Motor Mechanics, $1,622 a
// week / $40 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  casualFromHourly,
  jsaSource,
  jsaUrl,
} from "./common";
import { MANUFACTURING_AWARD, findAwardRate } from "../../constants/modern-awards";
import { MINING_AWARD } from "../../constants/modern-awards-oct2";
import { money2 } from "./j8-common";
import type { MedianEarnings, Occupation, OccupationSection, RateRow } from "./types";

const CODE = "MA000089";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3212",
  anzscoTitle: "Motor Mechanics",
  medianWeekly: 1_622,
  medianHourly: 40,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3212-motor-mechanics"),
};

function r(label: string, weekly: number, hourly: number, note?: string): RateRow {
  return { label, weekly, hourly, casualHourly: casualFromHourly(hourly), ...(note ? { note } : {}) };
}

export const MECHANIC_ROWS: RateRow[] = [
  r("R6 — Tradesperson Level I (motor mechanic)", 1119.1, 29.45, "Qualified mechanic: trade certificate or Certificate III"),
  r("R7 — Tradesperson Level II (master technician)", 1224.4, 32.22, "Also holds a Certificate IV automotive qualification"),
];

const OTHER_ROWS: RateRow[] = [
  r("R3 — Vehicle RS&R industry employee Level 3", 1029.1, 27.08),
  r("R4 — Vehicle RS&R industry employee Level 4", 1062.9, 27.97),
  r("R5 — Vehicle RS&R industry employee Level 5", 1088.2, 28.64),
];

// ---------------------------------------------------------------------------
// J8 (9 Oct 2026): "diesel mechanic salary" (720 a month) is answered on this
// page, not a new URL. Read 9 October 2026:
//   - Vehicle Repair, Services and Retail Award cl 4.2(a) (above): repairing
//     and servicing trucks, agricultural machinery and other vehicles — R6.
//   - Mining Industry Award 2020 [MA000011] cl 4.2(d): "the servicing,
//     maintaining (including mechanical, electrical, fabricating or
//     engineering) or repairing of plant and equipment" used in mining "by
//     employees principally employed to perform work on an ongoing basis at a
//     location where those activities are being performed". Schedule A.3.4
//     Level 3—Competent: skills "acquired through the completion of a trade
//     certificate", applying to Mining Industry Maintenance Trades Employees.
//     Ordinary hourly $30.54 / casual $38.18 including the $41.41 all-purpose
//     industry allowance (Schedule B.1.3, B.2), from MINING_AWARD.
//   - Manufacturing Award C10 Engineering Tradesperson (Mechanical) Level I
//     (Schedule A.4.7), from MANUFACTURING_AWARD.
// ---------------------------------------------------------------------------

const MINING_TRADE = findAwardRate(MINING_AWARD, "Level 3 (Competent)");
const MANUFACTURING_TRADE = findAwardRate(MANUFACTURING_AWARD, "C10 / V5");

function dieselRow(where: string, award: string, hourly: number, weekly: number): string[] {
  return [where, award, money2(hourly), money2(weekly), money2(casualFromHourly(hourly))];
}

const DIESEL_MECHANIC_SECTION: OccupationSection = {
  id: "diesel-mechanic-pay",
  heading: "Diesel mechanic pay: which award applies",
  paragraphs: [
    "A diesel mechanic's minimum depends on who employs you, not on the engine. In a truck or machinery workshop or a dealership you are a motor mechanic under the Vehicle Repair, Services and Retail Award, at the R6 trade rate. A heavy diesel fitter maintaining plant on a mine site is usually covered by the Mining Industry Award, and a maintenance fitter in a factory by the Manufacturing Award.",
    "On a mine the award's trade level is Level 3—Competent for maintenance trades employees, and every rate includes a $41.41 a week industry allowance paid for all purposes, which is why the hourly rate is higher. Most large mining operations pay under enterprise agreements well above these minimums.",
  ],
  table: {
    caption: "Diesel mechanic minimum rates by award, 2026–27",
    head: ["Where you work", "Award and level", "Hourly", "Weekly", "Casual hourly"],
    rows: [
      dieselRow("Truck or machinery workshop; dealership", "Vehicle Repair, Services and Retail Award — R6", MECHANIC_ROWS[0].hourly, MECHANIC_ROWS[0].weekly),
      dieselRow("Factory or processing plant maintenance", "Manufacturing Award — C10 tradesperson", MANUFACTURING_TRADE.hourly, MANUFACTURING_TRADE.weekly),
      dieselRow("Maintaining plant on a mine site", "Mining Industry Award — Level 3 (maintenance trades)", MINING_TRADE.hourly, MINING_TRADE.weekly),
    ],
    note: "Minimums from the first full pay period on or after 1 July 2026. The mining row includes the all-purpose industry allowance (Schedule B.1.3). Casual is the hourly rate plus 25%; the Vehicle Repair Award's casual loading rises outside weekday daytime hours.",
  },
};

export const MECHANIC: Occupation = {
  slug: "mechanic",
  name: "Mechanic",
  plural: "mechanics",
  award: {
    name: "Vehicle Repair, Services and Retail Award 2020",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "mechanics",
    label: "R6 — Tradesperson Level I (motor mechanic)",
    why: "a qualified motor mechanic or automotive technician, whom the award lists at tradesperson Level I (R6)",
  },
  coverage: [
    "Mechanics working in car dealerships, service centres, independent workshops, tyre and auto-electrical businesses, and roadside service are covered by the Vehicle Repair, Services and Retail Award 2020 [MA000089]. The award covers repairing and servicing \"motor vehicles of all kinds, including motor cars, trucks, caravans, motorcycles, trailerable boats, agricultural machinery\" (cl 4.2(a)), so diesel and heavy vehicle mechanics in a truck workshop are covered too.",
    "A qualified mechanic — trade certificate or a Certificate III gained through an apprenticeship — is tradesperson or equivalent Level I (R6). The award lists motor mechanic/automotive technician, motorcycle mechanic, brake mechanic, automotive electrician, panel beater, painter and wheel aligner at this level (Schedule A.1.5).",
    "Level II (R7) is for a tradesperson who also holds a Certificate IV automotive qualification (for example Automotive Mechanical Diagnosis) and is required to perform technical duties above R6, such as diagnosing complex faults. Master Technician and Automotive Technical Advisor are R7 titles (Schedule A.1.6).",
    "A diesel fitter employed by a mine, a manufacturer or another business that is not principally in vehicle repair, services or retail may be covered by a different award, such as the Mining Industry Award or the Manufacturing Award. The employer's industry decides it (cl 4.1).",
  ],
  tables: [
    {
      id: "mechanics",
      title: "Mechanic pay rates, 2026–27",
      intro:
        "Vehicle Repair, Services and Retail Award cl 16.2, from the first full pay period on or after 1 July 2026. The casual column is the weekday daytime rate (25% loading); casual loadings are higher at other times (see below).",
      rows: MECHANIC_ROWS,
    },
    {
      id: "workshop",
      title: "Other workshop classifications (non-trade)",
      intro: "Clause 16.2. Workshop employees without a trade qualification are classified R2 to R5 by skill level and duties (Schedule A.1.1–A.1.4).",
      rows: OTHER_ROWS,
    },
  ],
  penalties: [
    { when: "Monday–Friday, 6 am to 6 pm", permanent: "100%", casual: "125%" },
    { when: "Monday–Friday, 6 pm to 6 am", permanent: "100% (shift rates may apply)", casual: "150%" },
    { when: "Afternoon shift only (starts after noon, by 6 pm)", permanent: "118%", casual: "—" },
    { when: "Night shift only (starts after 6 pm, by 4 am)", permanent: "130%", casual: "—" },
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Permanent weekend and public holiday rates are cl 23.2; shift rates are cl 25.2 and do not apply to casuals (cl 25.1(b)). Casuals are paid a time-based loading instead (cl 11.3(a)): 25% on weekday days, 50% on weekday evenings and nights, 75% on Saturday, 125% on Sunday and 175% on public holidays. Loadings are not cumulative — the highest applicable one is paid (cl 11.3(b)).",
  overtime: [
    "Monday to Saturday: 150% for the first 3 hours, then 200% until the overtime ends; Sunday 200%; public holiday 250% (cl 24.3).",
    "Casual overtime (more than 10 hours a day or an average of 38 a week): 75% loading for the first 3 hours, then 125% (cl 11.3(a)).",
    "A mechanic recalled for breakdown, accident or emergency work outside normal hours is paid 200%, with a minimum of 2 hours for the first call-back each day (cl 24.9).",
  ],
  allowances: [
    { name: "Tool allowance", amount: "$13.86 per week", note: "Tradespeople required to provide their own hand tools (cl 19.6(a)). Apprentices get a reduced amount by year." },
    { name: "Meal allowance", amount: "$18.67 per meal", note: "Overtime of more than 1.5 hours without notice the previous day (cl 19.2(a))." },
    { name: "First aid allowance", amount: "$22.38 per week", note: "If you hold a first aid qualification and are appointed to perform first aid duty (cl 18.3)." },
    { name: "Leading hand allowance", amount: "$48.57 per week", note: "In charge of 3 to 10 employees; $73.19 for 11–20 and $93.00 for more than 20 (cl 18.2)." },
    { name: "Dirty work allowance", amount: "$0.84 per hour", note: "Work the foreperson and employee agree is unusually dirty or offensive; minimum $3.30 a day (cl 18.6)." },
  ],
  median: MEDIAN,
  notices: [
    "Apprentice mechanics are paid a percentage of the R6 rate by year and Year 12 completion (cl 16.8). Those rates are not shown here.",
  ],
  notShown: [
    "Apprentice and adult apprentice rates (cl 16.8).",
    "Vehicle salesperson commission provisions (cl 28) and driveway attendant rates (cl 27).",
    "Unapprenticed junior rates (cl 16.6), which apply only to the non-trade classifications listed in that clause.",
  ],
  sections: [DIESEL_MECHANIC_SECTION],
  faqs: [
    {
      q: "What is the award rate for a mechanic in 2026?",
      a: "A qualified motor mechanic (tradesperson Level I, R6) must be paid at least $29.45 an hour, or $1,119.10 a week, under the Vehicle Repair, Services and Retail Award from the first full pay period on or after 1 July 2026 — $58,193 a year full-time before tax. A master technician with a Certificate IV (R7) gets at least $32.22 an hour.",
    },
    {
      q: "What is the casual rate for a mechanic?",
      a: "A casual R6 mechanic earns at least $36.81 an hour on weekdays between 6 am and 6 pm. The casual loading rises at other times: 50% on weekday evenings ($44.18), 75% on Saturday ($51.54), 125% on Sunday ($66.26) and 175% on public holidays ($80.99).",
    },
    {
      q: "What is the award rate for a diesel mechanic?",
      a: "A diesel mechanic in a truck or heavy vehicle workshop is covered by the same award and classification as a motor mechanic — R6, $29.45 an hour — because the award covers repairing trucks, agricultural machinery and other vehicles. A diesel fitter employed by a mine or a manufacturer may be under a different award.",
    },
    {
      q: "Is a diesel fitter on a mine site paid more than a workshop diesel mechanic?",
      a: `Under the awards, slightly. A trade-qualified maintenance fitter covered by the Mining Industry Award is at least Level 3—Competent: ${money2(MINING_TRADE.hourly)} an hour including the $41.41 a week industry allowance, against ${money2(MECHANIC_ROWS[0].hourly)} for an R6 mechanic in a vehicle workshop. In practice most mines pay under enterprise agreements well above both.`,
    },
    {
      q: "Do mechanics get a tool allowance?",
      a: "Yes. A tradesperson who is required to supply their own hand tools gets $13.86 a week (cl 19.6(a)). It is an expense allowance, not added to the hourly rate for penalties or overtime.",
    },
    {
      q: "What do mechanics actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,622 a week for motor mechanics (ABS Survey of Employee Earnings and Hours, May 2025), about $84,344 a year.",
    },
  ],
  sources: [
    { title: "Vehicle Repair, Services and Retail Award 2020 [MA000089] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    { title: "Pay Guide — Vehicle Repair, Services and Retail Award [MA000089], published 24 June 2026", publisher: "Fair Work Ombudsman", url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/vehicle-repair-services-and-retail-award-ma000089-pay-guide.pdf.aspx" },
    { title: "Mining Industry Award 2020 [MA000011] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000011") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/electrician/", label: "Electrician Pay Rates" },
    { href: "/construction-trades-pay/", label: "Construction Trades Pay" },
    { href: "/manufacturing-award-rates/", label: "Manufacturing Award Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/job-pay-rates/fitter-and-turner/", label: "Fitter and Turner Pay Rates" },
  ],
};
