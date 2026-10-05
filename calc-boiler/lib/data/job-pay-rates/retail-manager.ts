// Retail manager / store manager — General Retail Industry Award 2020
// [MA000004] (F4, 5 Oct 2026).
//
// The award does not use the words "store manager" as a level; it classifies
// by Retail Employee Level 1 to 8 and lists indicative job titles in Schedule
// A. Read from the consolidated award text on awards.fairwork.gov.au on
// 5 October 2026 ("incorporates all amendments up to and including 1 July 2026
// (PR799280, PR799285 …)"):
//   Level 4 (A.4.3) — assistant, deputy or second-in-charge shop manager of a
//     shop without departments; shiftwork supervisor; department or section
//     manager with up to 2 employees (including self); service supervisor of up
//     to 15 employees; nightfill supervisor or leader.
//   Level 5 (A.5.2) — tradesperson in charge of other tradespersons within a
//     department or section; service supervisor (more than 15 employees).
//   Level 6 (A.6.2) — department or section manager with 5 or more employees
//     (including self); manager or duty manager in a shop without departments
//     or sections; assistant, deputy or second-in-charge to a shop manager of a
//     shop with departments or sections.
//   Level 7 (A.7.2) — visual merchandiser (Diploma); Clerical Officer Level 4.
//   Level 8 (A.8.3) — shop manager of a shop with departments or sections; a
//     Level 8 employee may have a Diploma (A.8.2).
//
// Rates, penalties and overtime come from lib/constants/hospitality-award.ts
// (RETAIL_RATES, RETAIL_PENALTIES, RETAIL_OVERTIME), the constants
// /retail-award-rates/ and /job-pay-rates/retail-worker/ render, and the weekly
// and hourly figures for Levels 5 to 8 were re-read in the award's cl 17.1
// Table 4 and Schedule B.1.1 on 5 October 2026 (Level 5 $1,165.10 / $30.66,
// Level 6 $1,182.10 / $31.11, Level 7 $1,241.40 / $32.67, Level 8 $1,291.80 /
// $33.99; casual ordinary $38.33, $38.89, $40.84, $42.49).
//
// Median: Jobs and Skills Australia, ANZSCO 1421 Retail Managers, $1,620 a week
// / $42 an hour (ABS SEEH May 2025), read 5 October 2026. JSA defines the
// median as full-time NON-MANAGERIAL pay, so the page flags it as a rough
// market guide for managers, not a minimum.

import {
  RETAIL_ALLOWANCES,
  RETAIL_AWARD,
  RETAIL_OVERTIME,
  RETAIL_PENALTIES,
} from "../../constants/hospitality-award";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import { retailRow } from "./retail-worker";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "1421",
  anzscoTitle: "Retail Managers",
  medianWeekly: 1_620,
  medianHourly: 42,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("1421-retail-managers"),
};

const NOTES: Record<string, string> = {
  "Level 4": "Assistant or deputy manager of a shop without departments; shift or nightfill supervisor; department manager with up to 2 staff",
  "Level 5": "Service supervisor of more than 15 employees; tradesperson in charge of other tradespersons",
  "Level 6": "Department manager with 5 or more staff; manager or duty manager of a shop without departments; assistant manager of a shop with departments",
  "Level 7": "Visual merchandiser (Diploma); Clerical Officer Level 4",
  "Level 8": "Shop manager of a shop with departments or sections; may hold a Diploma",
};

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
const money = (x: number) => `$${x.toFixed(2)}`;

const L4 = retailRow("Level 4");
const L6 = retailRow("Level 6");
const L8 = retailRow("Level 8");

export const RETAIL_MANAGER: Occupation = {
  slug: "retail-manager",
  name: "Retail Manager",
  plural: "retail managers",
  metaTitle: `Retail & Store Manager Pay 2026 — ${money(L6.hourly)}/hr Award Minimum`,
  award: {
    name: RETAIL_AWARD.name,
    code: RETAIL_AWARD.code,
    url: awardTextUrl(RETAIL_AWARD.code),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/retail-award-rates/",
  },
  headline: {
    tableId: "retail-manager",
    label: "Retail Employee Level 6",
    why: "a department manager with 5 or more staff, or the manager or duty manager of a shop without departments — the award's own indicative Level 6 titles",
  },
  coverage: [
    "Store managers, shop managers and department managers in shops, supermarkets and department stores are covered by the General Retail Industry Award 2020 [MA000004] unless a more specific award applies (pharmacies, fast food, motor vehicle retailing) or the employer pays under an enterprise agreement.",
    "The award has no level called store manager. It grades managers by what they run. A department or section manager with up to 2 employees (including themselves) is Retail Employee Level 4. A department or section manager with 5 or more employees, or the manager or duty manager of a shop without departments, is Level 6. The shop manager of a shop with departments or sections is Level 8, which may carry a Diploma.",
    "An assistant, deputy or second-in-charge manager is graded one step below the manager they assist: Level 4 in a shop without departments, Level 6 in a shop with departments.",
    "Many store managers are paid an annual salary. The figures below are the award's minimum for each level; an employer can pay more, and an enterprise agreement can replace the award as long as employees are better off overall. Large chains such as Coles, Woolworths, Kmart and Bunnings set their store manager salaries themselves, and we do not publish them.",
  ],
  tables: [
    {
      id: "retail-manager",
      title: "Retail manager pay rates by level, 2026–27",
      intro:
        "General Retail Industry Award cl 17.1, Table 4, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading (cl 11.1). Levels 1 to 3 are on the retail worker page.",
      rows: ["Level 4", "Level 5", "Level 6", "Level 7", "Level 8"].map((level) => retailRow(level, NOTES[level])),
    },
  ],
  penalties: [
    { when: "Monday–Friday after 6 pm", permanent: pct(RETAIL_PENALTIES.eveningAfter6pm), casual: pct(RETAIL_PENALTIES.casualEveningAfter6pm) },
    { when: "Saturday", permanent: pct(RETAIL_PENALTIES.saturday), casual: pct(RETAIL_PENALTIES.casualSaturday) },
    { when: "Sunday", permanent: pct(RETAIL_PENALTIES.sunday), casual: pct(RETAIL_PENALTIES.casualSunday) },
    { when: "Public holiday", permanent: pct(RETAIL_PENALTIES.publicHoliday), casual: pct(RETAIL_PENALTIES.casualPublicHoliday) },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate for ordinary hours (cl 22.1, Table 12). They apply to every level, managers included, for as long as the award covers the employee. Casual percentages include the 25% casual loading. Check your contract and the award for how penalties and overtime apply if you are paid an annual salary.",
  overtime: [
    `Full-time and part-time: ${pct(RETAIL_OVERTIME.weekdayFirst3Hours)} for the first 3 hours Monday to Saturday, then ${pct(RETAIL_OVERTIME.weekdayAfter3Hours)}; Sunday ${pct(RETAIL_OVERTIME.sunday)}; public holiday ${pct(RETAIL_OVERTIME.publicHoliday)} (cl 21.2(c), Table 11).`,
    `Casual: ${pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)} for the first 3 hours Monday to Saturday, then ${pct(RETAIL_OVERTIME.casualWeekdayAfter3Hours)}; Sunday ${pct(RETAIL_OVERTIME.casualSunday)}; public holiday ${pct(RETAIL_OVERTIME.casualPublicHoliday)}.`,
  ],
  allowances: RETAIL_ALLOWANCES.filter((a) => /Meal allowance \(|First aid|Liquor licence|Motor vehicle/.test(a.name)).map((a) => ({
    name: a.name,
    amount: `${money(a.amount)} ${a.unit}`,
    note: `${a.note ? `${a.note} ` : ""}(${a.clause})`,
  })),
  median: MEDIAN,
  notices: [
    "The Jobs and Skills Australia median is defined as the median pay of full-time non-managerial employees, so for managers treat it as a rough market guide only. Store manager salaries vary widely with store size, location and employer.",
    "Junior rates apply only to Retail Employee Levels 1 to 3 (cl 17.2), so they never apply to the manager levels on this page.",
  ],
  notShown: [
    "Store manager salaries and bonuses at the large retail chains, which the employers set and which are not published in the award.",
    "Shiftworker penalty rates and baking production early-morning rates.",
    "Whether a particular manager falls outside the award because of their earnings; that depends on the employee's guaranteed annual earnings and is not shown here.",
  ],
  faqs: [
    {
      q: "What is the award rate for a retail store manager in 2026?",
      a: `The General Retail Industry Award has no single store manager rate. A manager or duty manager of a shop without departments, or a department manager with 5 or more employees, is Retail Employee Level 6: at least ${money(L6.hourly)} an hour or ${money(L6.weekly)} a week from the first full pay period on or after 1 July 2026 (about $${Math.round(L6.weekly * 52).toLocaleString("en-AU")} a year). The shop manager of a shop with departments is Level 8: ${money(L8.hourly)} an hour, ${money(L8.weekly)} a week.`,
    },
    {
      q: "What is a department manager paid under the retail award?",
      a: `It depends on the size of the team. A department or section manager with up to 2 employees (including themselves) is Level 4, ${money(L4.hourly)} an hour. With 5 or more employees the award grades the role at Level 6, ${money(L6.hourly)} an hour.`,
    },
    {
      q: "Do retail managers get penalty rates?",
      a: "While the award covers them, yes. The weekend, evening and public holiday penalty rates in the General Retail Industry Award apply to every level, including managers, and overtime applies to time worked beyond ordinary hours. Managers on an enterprise agreement follow that agreement instead, and a manager paid a salary should check the contract and award for how penalties and overtime apply.",
    },
    {
      q: "How much do Coles, Woolworths and Kmart store managers earn?",
      a: "Large chains set store manager salaries themselves, and they are not published in a source we can verify. We publish the award minimum only; the employer pay pages cover the agreement rates for their shop-floor staff.",
    },
    {
      q: "What do retail managers actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $1,620 a week for retail managers (ABS Survey of Employee Earnings and Hours, May 2025), about $${(1620 * 52).toLocaleString("en-AU")} a year before tax. JSA defines its median as non-managerial full-time pay, so it is a market guide, not a minimum.`,
    },
  ],
  sources: [
    { title: "General Retail Industry Award 2020 [MA000004] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000004") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: "5 October 2026",
  related: [
    { href: "/retail-award-rates/", label: "Retail Award Rates" },
    { href: "/job-pay-rates/retail-worker/", label: "Retail Worker Pay Rates" },
    { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates Guide" },
  ],
};
