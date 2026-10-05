// Copy and configuration for the eight holiday-specific pay pages (Oct 2026):
// Christmas Day, Boxing Day, New Year, 2027 holidays, Melbourne Cup Day,
// Easter, Australia Day and the Christmas shutdown. One generic component
// (modules/guide/seasonal-holiday-page.tsx) renders every page from this file,
// so the dates, rates and examples all come from the same tested data.
//
// Rates are never typed here: they are read from the award data via
// getAwardPublicHolidayRate (which reads lib/constants). Dates come from
// ./seasonal (which picks them out of the eight state files).
//
// Sources read 5 Oct 2026 (Firecrawl): Fair Work Ombudsman "2026 public
// holidays" and "2027 public holidays", "Rules and entitlements during the
// end-of-year holiday season" (published 13 Oct 2025, updated 17 Dec 2025) and
// "Direction to take annual leave during a shutdown".

import { getAwardPublicHolidayRate } from "./award-rates";
import { pctLabel } from "./calc";
import { publicHolidayRateRange } from "./award-rates";
import { MODERN_AWARDS } from "../../constants/modern-awards";
import type { PhSource } from "./types";
import type { SeasonalTopic } from "./seasonal";

export const SEASONAL_VERIFIED_ON = "5 October 2026";

export const FW_2026: PhSource = {
  title: "2026 public holidays",
  url: "https://www.fairwork.gov.au/employment-conditions/public-holidays/2026-public-holidays",
  publisher: "Fair Work Ombudsman",
};
export const FW_2027: PhSource = {
  title: "2027 public holidays",
  url: "https://www.fairwork.gov.au/employment-conditions/public-holidays/2027-public-holidays",
  publisher: "Fair Work Ombudsman",
};
export const FW_END_OF_YEAR: PhSource = {
  title: "Rules and entitlements during the end-of-year holiday season",
  url: "https://www.fairwork.gov.au/newsroom/news/rules-and-entitlements-during-end-year-holiday-season",
  publisher: "Fair Work Ombudsman",
};
export const FW_SHUTDOWN: PhSource = {
  title: "Direction to take annual leave during a shutdown",
  url: "https://www.fairwork.gov.au/leave/annual-leave/directing-an-employee-to-take-annual-leave/direction-to-take-annual-leave-during-a-shut-down",
  publisher: "Fair Work Ombudsman",
};

export interface SeasonalSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
}

export interface SeasonalTopicBlock {
  topic: SeasonalTopic;
  id: string;
  heading: string;
  intro: string;
  footnote?: string;
}

export interface SeasonalPage {
  slug: string;
  /** Key in GUIDE_AUTHORSHIP. */
  guideKey: string;
  /** <title> forms, fullest first (lib/seo-title fitTitle). */
  titles: readonly string[];
  h1: string;
  /** Meta description forms, fullest first (lib/seo-title fitDescription). */
  descriptions: readonly string[];
  standfirst: string;
  directAnswer: string;
  /** Short label for breadcrumbs and "other holiday guides" links. */
  shortName: string;
  topics: readonly SeasonalTopicBlock[];
  /** Renders the 2027 matrix + state-only list instead of topic tables. */
  matrix2027?: boolean;
  /** Renders Victoria's regional Melbourne Cup replacement table. */
  vicRegional?: boolean;
  sectionsBeforeCalculator: readonly SeasonalSection[];
  calculator: { holidayName?: string; stateCode?: string; awardKey: string; employment: "permanent" | "casual"; hours: number; partDayNote?: string };
  example: { heading: string; intro: string; awardKeys: readonly string[]; hours: number; shiftNote: string };
  /** A shift that straddles a part-day holiday window. */
  partDayExample?: { heading: string; awardKey: string; employment: "permanent" | "casual"; shiftText: string; ordinaryHours: number; holidayHours: number; explanation: string };
  /** Renders the shutdown leave worked example. */
  shutdownExample?: boolean;
  sectionsAfterCalculator: readonly SeasonalSection[];
  faqs: readonly { q: string; a: string }[];
  /** Other pages to link to, beyond the standard set. */
  related: readonly { href: string; label: string }[];
  sources: readonly PhSource[];
}

function pc(awardKey: string, which: "permanent" | "casual"): string {
  const a = getAwardPublicHolidayRate(awardKey);
  if (!a) throw new Error(`unknown award ${awardKey}`);
  return pctLabel(a[which]);
}

const range = publicHolidayRateRange();
const RANGE_PERM = `${pctLabel(range.permanentMin)} to ${pctLabel(range.permanentMax)}`;
const RANGE_CASUAL = `${pctLabel(range.casualMin)} to ${pctLabel(range.casualMax)}`;
const RETAIL_P = pc("retail", "permanent");
const RETAIL_C = pc("retail", "casual");
const HOSP_P = pc("hospitality", "permanent");
const HOSP_C = pc("hospitality", "casual");

// Road Transport's Good Friday / Christmas Day rows, read from the award data.
const ROAD = MODERN_AWARDS["road-transport"];
const ROAD_GF_XMAS = ROAD.penalties.find((p) => /Good Friday and Christmas Day/.test(p.label));
if (!ROAD_GF_XMAS) throw new Error("road transport Good Friday/Christmas Day row missing");
// "paid in addition to the weekly wage" for full-time/part-time day workers: total = 1 + row.
const ROAD_GF_XMAS_PERM = pctLabel(1 + ROAD_GF_XMAS.fullTime);
const ROAD_GF_XMAS_CASUAL = pctLabel(ROAD_GF_XMAS.casual ?? 0);

const NOT_WORKING_ANSWER =
  "Yes, if you are full-time or part-time and the day falls on a day you would normally work. You are paid your base pay rate for the ordinary hours you would have worked, without penalty rates, loadings, overtime or allowances (Fair Work Act s 116). Casuals are not paid for a public holiday they don't work, and a part-timer who doesn't normally work that weekday gets nothing for it.";

export const SEASONAL_PAGES: readonly SeasonalPage[] = [
  // ---------------------------------------------------------------------------
  // Christmas Day
  // ---------------------------------------------------------------------------
  {
    slug: "christmas-day-pay-rates",
    guideKey: "christmas-day-pay-rates",
    shortName: "Christmas Day pay",
    titles: ["Christmas Day Pay Rates 2026: Public Holiday Rates by State", "Christmas Day Pay Rates 2026 by State & Award"],
    h1: "Christmas Day pay rates 2026 and 2027: what you earn by state and award",
    descriptions: [
      `Christmas Day is Friday 25 December 2026. Retail and hospitality pay ${RETAIL_P} (casual ${RETAIL_C}). Dates by state, Christmas Eve part-day rules and a pay calculator.`,
      `Christmas Day 2026 is Friday 25 December. Retail and hospitality pay ${RETAIL_P} (casual ${RETAIL_C}). Dates by state, Christmas Eve rules and a calculator.`,
    ],
    standfirst:
      "Christmas Day is a public holiday in every state and territory, so every hour you work is paid at your award's public holiday rate. The date, the extra weekday holidays and the Christmas Eve evening rules are what change from state to state.",
    directAnswer: `Christmas Day 2026 is Friday 25 December in every state and territory. Work it and your award pays ${RANGE_PERM} of your base rate (${RANGE_CASUAL} for casuals), which is ${RETAIL_P} (casual ${RETAIL_C}) under the General Retail and Hospitality awards. Stay home on a day you normally work and a full-time or part-time employee is still paid their base rate for their ordinary hours. In 2027 Christmas Day is a Saturday, so most states add Monday 27 December as an extra public holiday.`,
    topics: [
      {
        topic: "christmas",
        id: "dates",
        heading: "Christmas Eve and Christmas Day by state, 2026 and 2027",
        intro:
          "Christmas Day itself never moves, but what surrounds it does. Queensland, South Australia and the Northern Territory make the evening of Christmas Eve a part-day public holiday, and when Christmas Day lands on a weekend most states add the next weekday as an extra holiday. Every date below comes from the state government's own list and matches the Fair Work Ombudsman's 2026 and 2027 pages.",
        footnote:
          "Tasmania, 2027: WorkSafe Tasmania's table lists Monday 27 December as the Christmas Day holiday, while the Fair Work Ombudsman's 2027 list shows both Saturday 25 December and Monday 27 December. If you work in Tasmania on Saturday 25 December 2027, check your award or agreement, or ask the Fair Work Infoline on 13 13 94, before assuming the Saturday is an ordinary day.",
      },
    ],
    sectionsBeforeCalculator: [
      {
        id: "rates",
        heading: "What Christmas Day pays under the main awards",
        paragraphs: [
          `Christmas Day is paid at the same public holiday rate as any other public holiday under most awards. The General Retail Award and the Hospitality Award both pay ${RETAIL_P} of the minimum hourly rate to full-time and part-time staff and ${RETAIL_C} to casuals, and the casual figure already contains the 25% casual loading, so nothing more is added. Across the 14 awards this site publishes the permanent range is ${RANGE_PERM}, and the casual range ${RANGE_CASUAL}.`,
          `Two awards single Christmas Day out. The Road Transport and Distribution Award's day-work rates are higher on Good Friday and Christmas Day than on other public holidays: ${ROAD_GF_XMAS_PERM} of the weekly wage rate for full-time and part-time day workers and ${ROAD_GF_XMAS_CASUAL} for casual day workers. Under the Nurses Award, Christmas Day falling on a weekend adds an extra 50% in businesses that operate seven days a week (cl 28.2(b)), which is relevant in 2027 when Christmas Day is a Saturday.`,
          "If an enterprise agreement covers you, its rate replaces the award's. Pick the enterprise agreement option in the calculator and type in the percentage from your agreement. The full 14-award table is on the public holiday pay guide.",
        ],
      },
    ],
    calculator: { holidayName: "Christmas Day", awardKey: "hospitality", employment: "casual", hours: 8 },
    example: {
      heading: "Worked example: an 8-hour shift on Christmas Day 2026",
      intro:
        "The table uses each award's entry-level adult rate from 1 July 2026 as the base hourly rate, 8 hours worked, and compares the public holiday pay with the same hours on an ordinary weekday. Your own rate will differ, so use the calculator above for your payslip.",
      awardKeys: ["retail", "hospitality"],
      hours: 8,
      shiftNote: "Before tax. Excludes overtime, allowances and any minimum shift length your award sets.",
    },
    partDayExample: {
      heading: "Christmas Eve in SA, the NT and Queensland: a shift that changes rate",
      awardKey: "hospitality",
      employment: "casual",
      shiftText: "5pm to midnight on Thursday 24 December 2026 in Adelaide or Darwin",
      ordinaryHours: 2,
      holidayHours: 5,
      explanation:
        "South Australia and the Northern Territory make Christmas Eve a public holiday from 7pm to midnight, and Queensland from 6pm. Only the hours inside that window are paid at the public holiday rate, so a 5pm start has two ordinary hours followed by five public holiday hours. The two earlier hours are paid at whatever your award sets for that time on a weekday evening.",
    },
    sectionsAfterCalculator: [
      {
        id: "weekend",
        heading: "When Christmas Day falls on a weekend (2027)",
        paragraphs: [
          "Christmas Day 2027 is a Saturday and Boxing Day a Sunday. New South Wales, Victoria, Queensland, Western Australia, South Australia, the ACT and the Northern Territory keep Saturday 25 December as a public holiday and add Monday 27 December as an additional public holiday for Christmas Day, with Tuesday 28 December as the additional day for Boxing Day. Both extra days are real public holidays for pay: work either and the public holiday rate applies, and a full-time or part-time employee who normally works that Monday or Tuesday is paid for it if they have the day off.",
          "Tasmania handles it differently, and the Boxing Day side of that is covered in the Boxing Day guide. For Christmas Day, the practical point is to check which of the Saturday and the Monday your award or agreement treats as the public holiday if you work in Tasmania.",
        ],
      },
      {
        id: "not-working",
        heading: "Paid for Christmas Day when you don't work it",
        paragraphs: [
          "Every employee can be absent from work on a public holiday. A full-time or part-time employee whose roster includes Friday 25 December 2026 is paid their base rate for the ordinary hours they would have worked. Penalty rates, loadings, bonuses and overtime are not included, and your employer can't change your roster to avoid the payment. Casuals are not paid for Christmas Day if they don't work.",
          "If you are on annual leave over Christmas, a public holiday that falls on one of your normal working days is paid as a public holiday and is not deducted from your leave balance. The Christmas shutdown guide walks through exactly how many days of leave a shutdown costs.",
        ],
      },
      {
        id: "asked-to-work",
        heading: "Can you refuse to work Christmas Day?",
        paragraphs: [
          "Your employer can ask you to work, but the request must be reasonable, and you can refuse if the request is unreasonable or you have reasonable grounds. The Fair Work Ombudsman lists the relevant factors: the nature of the workplace and your role, your personal circumstances including family or caring responsibilities, how much notice you were given, whether you could expect to be asked, and any penalty rates or other payment on offer.",
          "The type of workplace is one of the factors, so a request to work Christmas Day can be more reasonable in a hospital, hotel or restaurant than in an office. If the request is reasonable and your refusal is not, you can be required to work, and the public holiday rate then applies to every hour.",
        ],
      },
      {
        id: "payslip",
        heading: "Checking your Christmas pay on the payslip",
        paragraphs: [
          "Hours worked on Christmas Day should appear as their own line, marked public holiday or paid at a multiple of your base rate such as 2.25 or 2.5 times, rather than inside ordinary hours. Multiply those hours by your base rate and the percentage for your award to check the line. Casuals should see a single rate with the loading already inside it. If the numbers don't match, raise it with payroll first, then use the back pay calculator to total what you are owed.",
          "Public holiday pay is ordinary income and is taxed through PAYG with the rest of your pay, so a big Christmas week can look smaller after tax than you expect. The take-home pay calculator shows the after-tax figure.",
        ],
      },
    ],
    faqs: [
      { q: "What is the Christmas Day pay rate in Australia?", a: `It depends on your award or agreement. Retail and hospitality workers are paid ${RETAIL_P} of the base rate on a public holiday if they are full-time or part-time and ${RETAIL_C} if they are casual. Across 14 modern awards the permanent range is ${RANGE_PERM}. Road Transport day workers get a higher rate on Christmas Day than on other public holidays.` },
      { q: "Is Christmas Eve a public holiday?", a: "Only in part, and only in some places. Queensland makes Christmas Eve a public holiday from 6pm to midnight, and South Australia and the Northern Territory from 7pm to midnight. In New South Wales, Victoria, Western Australia, Tasmania and the ACT Christmas Eve is an ordinary day, although your award may still pay evening or weekend rates." },
      { q: "Do I get paid if Christmas Day is a day I don't work?", a: NOT_WORKING_ANSWER },
      { q: "Do casuals get paid extra on Christmas Day?", a: `Casuals who work Christmas Day are paid the public holiday rate, ${RETAIL_C} of the base rate under the Retail and Hospitality awards, and that figure already includes the 25% casual loading. They are not paid for Christmas Day if they don't work.` },
      { q: "When is Christmas Day in 2027 and is there an extra public holiday?", a: "Christmas Day 2027 is Saturday 25 December. New South Wales, Victoria, Queensland, Western Australia, South Australia, the ACT and the Northern Territory add Monday 27 December as an additional public holiday for Christmas Day, and Tuesday 28 December for Boxing Day. Tasmania's list shows Monday 27 December and Tuesday 28 December." },
      { q: "Can my employer make me work on Christmas Day?", a: "Your employer can ask, but the request has to be reasonable, and you can refuse if the request is unreasonable or you have reasonable grounds. Factors include your role, your personal and caring circumstances, the notice you were given and the penalty rates on offer." },
    ],
    related: [
      { href: "/boxing-day-pay-rates/", label: "Boxing Day pay rates" },
      { href: "/new-years-day-pay-rates/", label: "New Year's Day and Eve pay" },
      { href: "/christmas-shutdown-annual-leave/", label: "Christmas shutdown and annual leave" },
      { href: "/public-holidays-2027/", label: "Public holidays 2027 with pay rates" },
    ],
    sources: [FW_2026, FW_2027, FW_END_OF_YEAR],
  },

  // ---------------------------------------------------------------------------
  // Boxing Day
  // ---------------------------------------------------------------------------
  {
    slug: "boxing-day-pay-rates",
    guideKey: "boxing-day-pay-rates",
    shortName: "Boxing Day pay",
    titles: ["Boxing Day Pay Rates 2026: Saturday 26 & Monday 28 December", "Boxing Day Pay Rates 2026: Dates and Rates by State"],
    h1: "Boxing Day pay rates 2026: Saturday 26 and Monday 28 December",
    descriptions: [
      `Boxing Day 2026 is Saturday 26 December, with an extra public holiday on Monday 28 December in most states. Pay is ${RETAIL_P} in retail (casual ${RETAIL_C}). Calculator inside.`,
      `Boxing Day 2026 is Saturday 26 December, with Monday 28 December added in most states. Retail pays ${RETAIL_P} (casual ${RETAIL_C}). Calculator inside.`,
    ],
    standfirst:
      "In 2026 Boxing Day falls on a Saturday, which gives most of the country two public holidays: the Saturday itself and an additional Monday. Tasmania is the exception, and South Australia calls its holiday Proclamation Day.",
    directAnswer: `Boxing Day 2026 is Saturday 26 December, and Monday 28 December is an additional public holiday in every state and territory except Tasmania, where only the Monday counts. Work either day and a retail or hospitality worker is paid ${RETAIL_P} of their base rate (casuals ${RETAIL_C}). In 2027 Boxing Day is a Sunday and the additional holiday is Tuesday 28 December.`,
    topics: [
      {
        topic: "boxing",
        id: "dates",
        heading: "Boxing Day public holiday dates by state, 2026 and 2027",
        intro:
          "Boxing Day is 26 December, but the day you actually get depends on the state. Most states keep the 26th as a public holiday and add a weekday when it lands on a weekend. South Australia observes the same holiday as Proclamation Day. Tasmania moves the public holiday to the weekday and does not treat the weekend day as one.",
      },
    ],
    sectionsBeforeCalculator: [
      {
        id: "which-day",
        heading: "Which Boxing Day gets the public holiday rate in 2026?",
        paragraphs: [
          "In New South Wales, Victoria, Queensland, Western Australia, South Australia, the ACT and the Northern Territory, Saturday 26 December 2026 is a public holiday and Monday 28 December is an additional public holiday. Both are public holidays for pay, so a shift on either is paid at the public holiday rate. You do not choose between them, and working the Saturday does not use up the Monday.",
          "Tasmania is different. WorkSafe Tasmania's list does not include Saturday 26 December 2026. The public holiday is Monday 28 December, so a Saturday shift in Tasmania is paid at the ordinary Saturday rate in your award and the public holiday rate applies on the Monday. In 2027, with Boxing Day on a Sunday, the Tuesday 28 December is the holiday there as well.",
        ],
      },
      {
        id: "rates",
        heading: "Boxing Day pay rates",
        paragraphs: [
          `The rate is your award's public holiday rate. Under the General Retail Award it is ${RETAIL_P} for full-time and part-time employees and ${RETAIL_C} for casuals, and the same under the Hospitality Award. Across the 14 awards on this site the permanent range is ${RANGE_PERM} and the casual range ${RANGE_CASUAL}. The Fair Work Ombudsman's own example is a retail store manager who agrees to work Boxing Day for a promotion: she is paid public holiday rates for every hour.`,
          "Boxing Day sales mean a lot of retail staff work it. Your award's public holiday row is the rate to check for hours worked on the day. SCHADS says in terms that public holiday pay replaces weekend rates and shift loadings (cl 34.2(b)); for any other award, read its public holiday clause if the Saturday and public holiday rates are close.",
        ],
      },
    ],
    calculator: { holidayName: "Boxing Day", awardKey: "retail", employment: "casual", hours: 8 },
    example: {
      heading: "Worked example: an 8-hour shift on Monday 28 December 2026",
      intro:
        "Entry-level adult rates from 1 July 2026, 8 hours, compared with the same hours on an ordinary weekday. The retail row is the typical Boxing Day sales shift.",
      awardKeys: ["retail", "hospitality"],
      hours: 8,
      shiftNote: "Before tax. Excludes overtime, allowances and minimum shift lengths.",
    },
    sectionsAfterCalculator: [
      {
        id: "not-working",
        heading: "If you don't work Boxing Day",
        paragraphs: [
          "A full-time or part-time employee who would normally work on the day is paid their base rate for their ordinary hours, whichever of the Saturday and the Monday applies to them. A Monday-to-Friday worker is paid for Monday 28 December 2026 even though they would not have worked the Saturday. A part-timer who works Tuesday to Thursday is paid for neither, and the Fair Work Ombudsman's example makes the same point for a Friday Boxing Day.",
          "Casuals are paid only for the hours they work, at the casual public holiday rate. Check your roster for the 28th as well as the 26th, because both are public holidays in most states.",
        ],
      },
      {
        id: "sa",
        heading: "South Australia: Proclamation Day",
        paragraphs: [
          "South Australia's holiday on 26 December is Proclamation Day, and it works for pay exactly as Boxing Day does elsewhere. In 2026 that is Saturday 26 December with an additional holiday on Monday 28 December. In 2027, with 26 December on a Sunday, the Sunday and Tuesday 28 December are both public holidays, and Monday 27 December is the additional day for Christmas Day.",
        ],
      },
      {
        id: "annual-leave",
        heading: "Boxing Day during annual leave",
        paragraphs: [
          "If you are on annual leave across Christmas, Boxing Day or its additional Monday is not deducted from your leave balance when it falls on a day you would normally work. You are paid the public holiday instead. A two-week break that includes both Monday 28 December 2026 and Friday 1 January 2027 costs 8 days of leave rather than 10 for someone who works Monday to Friday.",
        ],
      },
    ],
    faqs: [
      { q: "Is Boxing Day a public holiday in every state?", a: "Yes, in a form. New South Wales, Victoria, Queensland, Western Australia, the ACT and the Northern Territory observe Boxing Day on 26 December, South Australia observes Proclamation Day on 26 December, and Tasmania observes Boxing Day on the next weekday when the 26th falls on a weekend. In 2026 that means Saturday 26 December plus Monday 28 December, except in Tasmania, where only the Monday counts." },
      { q: "What is the Boxing Day pay rate?", a: `Your award's public holiday rate applies to every hour worked. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals. The permanent range across 14 awards is ${RANGE_PERM}.` },
      { q: "Are both Saturday 26 and Monday 28 December 2026 public holidays?", a: "In New South Wales, Victoria, Queensland, Western Australia, South Australia, the ACT and the Northern Territory, yes: the Saturday is Boxing Day and the Monday is an additional public holiday. In Tasmania only Monday 28 December is a public holiday." },
      { q: "Do I get paid for Boxing Day if I don't work?", a: NOT_WORKING_ANSWER },
      { q: "When is Boxing Day in 2027?", a: "Sunday 26 December 2027, with Tuesday 28 December as an additional public holiday in New South Wales, Victoria, Queensland, Western Australia, South Australia, the ACT and the Northern Territory. Tasmania's public holiday is the Tuesday 28 December. Monday 27 December is the additional day for Christmas Day." },
      { q: "Can I refuse to work on Boxing Day?", a: "You can refuse if the request is unreasonable or you have reasonable grounds. Relevant factors include your role, your family and caring responsibilities, the notice you were given, whether you could expect to be asked and the penalty rates on offer. In retail, being asked to work Boxing Day is often reasonable." },
    ],
    related: [
      { href: "/christmas-day-pay-rates/", label: "Christmas Day pay rates" },
      { href: "/new-years-day-pay-rates/", label: "New Year's Day and Eve pay" },
      { href: "/retail-award-rates/", label: "Retail award rates" },
      { href: "/christmas-shutdown-annual-leave/", label: "Christmas shutdown and annual leave" },
    ],
    sources: [FW_2026, FW_2027, FW_END_OF_YEAR],
  },

  // ---------------------------------------------------------------------------
  // New Year
  // ---------------------------------------------------------------------------
  {
    slug: "new-years-day-pay-rates",
    guideKey: "new-years-day-pay-rates",
    shortName: "New Year's Day and Eve pay",
    titles: ["New Year's Day & New Year's Eve Pay Rates 2026-27", "New Year's Day and Eve Pay Rates 2026-27"],
    h1: "New Year's Day and New Year's Eve pay rates 2026-27",
    descriptions: [
      `New Year's Day is Friday 1 January 2027 in every state. SA and NT add a 7pm to midnight New Year's Eve holiday. Retail pays ${RETAIL_P}, casual ${RETAIL_C}. Calculator inside.`,
      `New Year's Day is Friday 1 January 2027. SA and NT add a 7pm New Year's Eve holiday. Retail pays ${RETAIL_P} (casual ${RETAIL_C}). Calculator inside.`,
    ],
    standfirst:
      "New Year's Day is a public holiday everywhere, and in South Australia and the Northern Territory so is the evening before. That makes a midnight shift an unusual case: the hours after midnight are a full public holiday.",
    directAnswer: `New Year's Day 2027 is Friday 1 January in every state and territory, so every hour worked is paid at your award's public holiday rate: ${RETAIL_P} for retail and hospitality staff, ${RETAIL_C} for casuals. New Year's Eve (Thursday 31 December 2026) is a public holiday only from 7pm to midnight, and only in South Australia and the Northern Territory.`,
    topics: [
      {
        topic: "new-year",
        id: "dates",
        heading: "New Year's Eve and New Year's Day by state",
        intro:
          "New Year's Day 2027 falls on a Friday, so no state needs an extra weekday. The only state-by-state difference is the evening. South Australia and the Northern Territory make New Year's Eve a part-day public holiday from 7pm to midnight, in 2026 and again in 2027.",
        footnote:
          "This page covers New Year's Eve 2026 and 2027 and New Year's Day 2027. New Year's Day 2028 is not covered here.",
      },
    ],
    sectionsBeforeCalculator: [
      {
        id: "rates",
        heading: "What New Year's Day pays",
        paragraphs: [
          `New Year's Day carries the same public holiday rate as any other public holiday under your award: ${RETAIL_P} of the base rate for full-time and part-time retail and hospitality staff and ${RETAIL_C} for casuals, with the 25% casual loading already inside the casual figure. The permanent range across the 14 awards on this site is ${RANGE_PERM}; the casual range is ${RANGE_CASUAL}.`,
          "Because 1 January 2027 is a Friday, it is the ordinary working day for most full-time employees who work Monday to Friday. If you are one of them and you have the day off, you are paid your base rate for your ordinary hours (Fair Work Act s 116), and if you are on annual leave around the holiday it is not deducted from your balance.",
        ],
      },
      {
        id: "nye",
        heading: "New Year's Eve: who gets a public holiday and from when",
        paragraphs: [
          "Only two jurisdictions treat New Year's Eve as a public holiday, and only for the evening: South Australia and the Northern Territory, from 7pm to midnight. In the other six states and territories, New Year's Eve is an ordinary day, so a late shift is paid at whatever your award sets for a weekday evening (Thursday 31 December 2026, Friday 31 December 2027) and the public holiday rate starts at midnight when 1 January begins.",
          "That midnight boundary is the part people miss. A hospitality worker in Adelaide who finishes at 1am is paid public holiday rates for the whole stretch from 7pm: five hours before midnight under the New Year's Eve rule and one hour after midnight under the New Year's Day rule. A worker in Sydney with the same roster is paid public holiday rates only for the hour after midnight.",
        ],
      },
    ],
    calculator: {
      holidayName: "New Year's Day",
      awardKey: "hospitality",
      employment: "casual",
      hours: 8,
      partDayNote:
        "For New Year's Eve in SA and the NT, enter only the hours worked from 7pm to midnight plus any hours after midnight; earlier hours are paid at your usual rate for that time.",
    },
    example: {
      heading: "Worked example: an 8-hour shift on New Year's Day 2027",
      intro: "Entry-level adult rates from 1 July 2026, 8 hours worked on Friday 1 January 2027, compared with the same hours on an ordinary weekday.",
      awardKeys: ["retail", "hospitality"],
      hours: 8,
      shiftNote: "Before tax. Excludes overtime, allowances and minimum shift lengths.",
    },
    partDayExample: {
      heading: "A New Year's Eve shift in South Australia or the NT: 6pm to 1am",
      awardKey: "hospitality",
      employment: "casual",
      shiftText: "6pm Thursday 31 December 2026 to 1am Friday 1 January 2027 in Adelaide or Darwin",
      ordinaryHours: 1,
      holidayHours: 6,
      explanation:
        "The hour from 6pm to 7pm is outside the New Year's Eve window, so it is paid at the usual weekday evening rate. The five hours from 7pm to midnight are public holiday hours, and the hour from midnight to 1am is on New Year's Day, a full public holiday, so six hours in total are paid at the public holiday rate.",
    },
    sectionsAfterCalculator: [
      {
        id: "other-states",
        heading: "New Year's Eve in the other states",
        paragraphs: [
          "In New South Wales, Victoria, Queensland, Western Australia, Tasmania and the ACT there is no New Year's Eve public holiday. Queensland's part-day holiday is on Christmas Eve, not New Year's Eve. Your pay for a New Year's Eve shift is whatever your award or agreement sets for that day and time, for example a Friday night rate in 2027 or a late-night loading, and the public holiday rate only starts at midnight.",
          "Hospitality, venue and event staff are the people most likely to work across midnight, so it is worth checking the rate on the payslip line that covers the first hour of January separately from the rest of the shift.",
        ],
      },
      {
        id: "casuals",
        heading: "Casuals and New Year",
        paragraphs: [
          "A casual who works New Year's Day is paid the casual public holiday rate, which already includes the 25% casual loading. A casual who is not rostered on is not paid for the day. Whether you can refuse a request to work depends on the Fair Work Ombudsman's reasonableness factors, which include whether you are full-time, part-time or casual, your personal circumstances and the notice you were given.",
        ],
      },
      {
        id: "not-working",
        heading: "Paid for New Year's Day when you don't work",
        paragraphs: [
          "A full-time or part-time employee whose normal week includes Friday is paid their base rate for their ordinary hours on Friday 1 January 2027. Your employer can't change your roster to avoid paying it. Part-timers who don't normally work Fridays get nothing for it. Overtime, penalty rates and allowances are not part of the base rate that is paid.",
        ],
      },
    ],
    faqs: [
      { q: "What is the New Year's Day pay rate?", a: `Your award's public holiday rate. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals, which already includes the 25% casual loading. The permanent range across 14 awards is ${RANGE_PERM}.` },
      { q: "Is New Year's Eve a public holiday?", a: "Only in South Australia and the Northern Territory, and only from 7pm to midnight. In every other state and territory New Year's Eve is an ordinary day, and the public holiday rate starts at midnight when New Year's Day begins." },
      { q: "When is New Year's Day in 2027?", a: "Friday 1 January 2027, a public holiday in every state and territory. Because it is a weekday, no state needs to add an extra holiday." },
      { q: "How is a shift across midnight on New Year's Eve paid?", a: "Only the hours inside a public holiday are paid at the public holiday rate. In South Australia and the Northern Territory that is 7pm to midnight and then all of New Year's Day, so a 6pm to 1am shift has one ordinary hour and six public holiday hours. In the other states only the hours after midnight are public holiday hours." },
      { q: "Do I get paid for New Year's Day if I don't work?", a: NOT_WORKING_ANSWER },
    ],
    related: [
      { href: "/christmas-day-pay-rates/", label: "Christmas Day pay rates" },
      { href: "/boxing-day-pay-rates/", label: "Boxing Day pay rates" },
      { href: "/public-holidays-2027/", label: "Public holidays 2027 with pay rates" },
      { href: "/hospitality-award-rates/", label: "Hospitality award rates" },
    ],
    sources: [FW_2026, FW_2027, FW_END_OF_YEAR],
  },

  // ---------------------------------------------------------------------------
  // Public holidays 2027
  // ---------------------------------------------------------------------------
  {
    slug: "public-holidays-2027",
    guideKey: "public-holidays-2027",
    shortName: "Public holidays 2027",
    titles: ["Public Holidays 2027 by State: Dates and What You Get Paid", "Public Holidays 2027 by State: Dates + Pay Rates"],
    h1: "Public holidays 2027 by state, with what each one pays",
    descriptions: [
      `Public holidays 2027 for every state and territory, with the pay rate you earn working one: ${RETAIL_P} in retail, casual ${RETAIL_C}. Easter, Christmas and a calculator.`,
      `Public holidays 2027 by state, plus the pay rate for working one: ${RETAIL_P} in retail, casual ${RETAIL_C}. Easter, Christmas and a calculator.`,
    ],
    standfirst:
      "The dates are one half of the question and the pay is the other. This guide lays out the 2027 holidays that most workers are paid for, state by state, then shows what each costs an employer and pays a worker.",
    directAnswer: `In 2027 Good Friday is 26 March, Easter Monday 29 March, Australia Day Tuesday 26 January and Christmas Day a Saturday, which brings extra weekday holidays on Monday 27 and Tuesday 28 December in most states. Work any of them and your award pays ${RANGE_PERM} of your base rate (${RANGE_CASUAL} for casuals): ${RETAIL_P} (casual ${RETAIL_C}) in retail and hospitality.`,
    topics: [],
    matrix2027: true,
    sectionsBeforeCalculator: [
      {
        id: "how-pay-works",
        heading: "How a 2027 public holiday is paid",
        paragraphs: [
          `Each state and territory sets its own list, but the pay rules are national. If you work a public holiday your award or agreement decides the rate. Retail and hospitality pay ${RETAIL_P} (casual ${RETAIL_C}), and across the 14 awards this site publishes the permanent range is ${RANGE_PERM} and the casual range ${RANGE_CASUAL}. If you are a full-time or part-time employee and the holiday falls on a day you would normally work, you are paid your base rate for your ordinary hours even when you don't work.`,
          "The Fair Work Ombudsman's 2027 list is based on each state and territory's own published list, includes state-wide holidays, capital-city holidays and some regional holidays, and notes that some states add or substitute holidays when one falls on a weekend and others don't. That is why the tables below are split by state rather than shown as one national list.",
        ],
      },
    ],
    calculator: { awardKey: "retail", employment: "permanent", hours: 8 },
    example: {
      heading: "Worked example: an 8-hour shift on a 2027 public holiday",
      intro:
        "Entry-level adult rates from 1 July 2026, 8 hours worked on a public holiday, compared with the same hours on an ordinary weekday. Award rates are reviewed each year, so these 2026-27 figures can change after the next annual wage review.",
      awardKeys: ["retail", "hospitality"],
      hours: 8,
      shiftNote: "Before tax. Excludes overtime, allowances and minimum shift lengths.",
    },
    sectionsAfterCalculator: [
      {
        id: "quirks",
        heading: "What is different about 2027",
        paragraphs: [
          "Christmas Day falls on a Saturday and Boxing Day on a Sunday, so most states hold the weekend days and add Monday 27 and Tuesday 28 December. Anzac Day is a Sunday (25 April), which is why the Anzac row in the table differs most: New South Wales, Western Australia and the ACT keep the Sunday and add Monday 26 April, Queensland and the Northern Territory list Monday 26 April as Anzac Day, and Victoria, South Australia and Tasmania have no replacement day. Check the row for your state. Australia Day, Tuesday 26 January, falls mid-week with no replacement day needed.",
          "A few 2027 dates are not published yet. Victoria's Friday before the AFL Grand Final depends on the AFL fixture, and most regional and show-day holidays are announced later in the year. The state pages list what each government has published so far and mark the rest as not yet confirmed.",
        ],
      },
      {
        id: "holiday-guides",
        heading: "Pay guides for the big 2027 holidays",
        paragraphs: [
          "Easter, Australia Day, Christmas Day and Boxing Day have their own pay guides, each with the state dates, the part-day rules where they apply, and a worked example. The pay rules above apply to all of them, so the guides concentrate on what is specific to each day.",
        ],
      },
    ],
    faqs: [
      { q: "What are the public holidays in 2027?", a: "Common to every state: New Year's Day (Friday 1 January), Australia Day (Tuesday 26 January), Good Friday (26 March), Easter Monday (29 March), Christmas Day (Saturday 25 December) and Boxing Day (Sunday 26 December) with additional weekdays in most states. Anzac Day is Sunday 25 April, with a Monday holiday in some states. Each state also has its own days such as Labour Day and the King's Birthday." },
      { q: "How much do you get paid on a public holiday in 2027?", a: `Your award or agreement sets the rate. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals. Across 14 awards the permanent range is ${RANGE_PERM} and the casual range is ${RANGE_CASUAL}.` },
      { q: "Do I get paid for a public holiday I don't work in 2027?", a: NOT_WORKING_ANSWER },
      { q: "When is Easter in 2027?", a: "Good Friday is 26 March 2027, Easter Saturday 27 March, Easter Sunday 28 March and Easter Monday 29 March. Which of the four days are public holidays depends on the state: Western Australia has no Easter Saturday and Tasmania has only Good Friday and Easter Monday." },
      { q: "Is Christmas Day 2027 on a weekend, and is there an extra public holiday?", a: "Yes. Christmas Day is Saturday 25 December 2027 and Boxing Day is Sunday 26 December. New South Wales, Victoria, Queensland, Western Australia, South Australia, the ACT and the Northern Territory add Monday 27 December for Christmas Day and Tuesday 28 December for Boxing Day. Tasmania's list shows Monday 27 and Tuesday 28 December." },
      { q: "Which state's public holidays apply if I work interstate?", a: "The public holidays of the place your job is based, not where you happen to work that day. The Fair Work Ombudsman's example is a Melbourne-based employee working in Sydney on Melbourne Cup Day, who still gets the Victorian holiday entitlement." },
    ],
    related: [
      { href: "/easter-public-holiday-pay/", label: "Easter 2027 pay" },
      { href: "/australia-day-public-holiday-pay/", label: "Australia Day 2027 pay" },
      { href: "/christmas-day-pay-rates/", label: "Christmas Day pay rates" },
      { href: "/boxing-day-pay-rates/", label: "Boxing Day pay rates" },
    ],
    sources: [FW_2027],
  },

  // ---------------------------------------------------------------------------
  // Melbourne Cup Day
  // ---------------------------------------------------------------------------
  {
    slug: "melbourne-cup-day-pay",
    guideKey: "melbourne-cup-day-pay",
    shortName: "Melbourne Cup Day pay",
    titles: ["Melbourne Cup Day 2026 Pay: Public Holiday Rates in Victoria", "Melbourne Cup Day Pay 2026: Public Holiday Rates"],
    h1: "Melbourne Cup Day 2026 pay: Tuesday 3 November public holiday rates",
    descriptions: [
      `Melbourne Cup Day is Tuesday 3 November 2026. Hospitality and retail pay ${HOSP_P} (casual ${HOSP_C}). Regional Victoria swaps, interstate workers and a calculator.`,
      `Melbourne Cup Day is Tuesday 3 November 2026. Retail and hospitality pay ${HOSP_P} (casual ${HOSP_C}). Regional swaps and a calculator.`,
    ],
    standfirst:
      "Melbourne Cup Day is a Victorian public holiday, with a twist: some non-metropolitan councils swap it for a local holiday, so for part of regional Victoria the day your public holiday rate applies is not the first Tuesday in November.",
    directAnswer: `Melbourne Cup Day 2026 is Tuesday 3 November, a public holiday across Victoria except in council areas that have arranged a local holiday instead. Work it and a hospitality or retail worker is paid ${HOSP_P} of the base rate (casuals ${HOSP_C}). If you are full-time or part-time and Tuesday is a normal working day, you are paid your base rate for the day even when you don't work.`,
    topics: [
      {
        topic: "melbourne-cup",
        id: "dates",
        heading: "Melbourne Cup Day date, 2026 and 2027",
        intro:
          "Melbourne Cup Day is the first Tuesday in November. It is a Victorian public holiday only. No other state or territory has it, and Business Victoria lists it as statewide unless a non-metropolitan council has arranged a local holiday instead.",
      },
    ],
    vicRegional: true,
    sectionsBeforeCalculator: [
      {
        id: "who-gets-it",
        heading: "Who gets the Melbourne Cup Day public holiday",
        paragraphs: [
          "The test is where your job is based. If you work in metropolitan Melbourne or in a Victorian council area that hasn't swapped, Tuesday 3 November 2026 is a public holiday for you. If your job is based in an area that has a replacement local holiday, that local day is your public holiday and Melbourne Cup Day is an ordinary working day.",
          "It does not depend on where you are standing that day. The Fair Work Ombudsman's example is a Melbourne-based employee working in Sydney on Melbourne Cup Day, who still gets the Victorian public holiday entitlement. A Sydney-based employee working in Melbourne that day does not.",
        ],
      },
      {
        id: "rates",
        heading: "Melbourne Cup Day pay rates",
        paragraphs: [
          `It is a full public holiday under Victoria's Public Holidays Act, so the award public holiday rate applies to every hour worked. Hospitality and retail workers earn ${HOSP_P} of the base rate if full-time or part-time and ${HOSP_C} if casual, the casual figure already containing the 25% loading. Across the 14 awards on this site the permanent range is ${RANGE_PERM}.`,
          "Many Melbourne Cup Day workers are in hospitality: pubs, clubs and restaurants run big days around the race. If you are casual, remember you are paid only for the hours you work, and a permanent employee who normally works Tuesdays but is not rostered still gets the day's base pay.",
        ],
      },
    ],
    calculator: { holidayName: "Melbourne Cup Day", stateCode: "VIC", awardKey: "hospitality", employment: "casual", hours: 6 },
    example: {
      heading: "Worked example: a 6-hour hospitality shift on Melbourne Cup Day",
      intro:
        "Entry-level adult hospitality and retail rates from 1 July 2026, 6 hours worked on Tuesday 3 November 2026, compared with the same hours on an ordinary Tuesday.",
      awardKeys: ["hospitality", "retail"],
      hours: 6,
      shiftNote: "Before tax. Excludes overtime, allowances and minimum shift lengths such as the hospitality minimum engagement.",
    },
    sectionsAfterCalculator: [
      {
        id: "not-working",
        heading: "If you have Melbourne Cup Day off",
        paragraphs: [
          "A full-time or part-time employee whose normal week includes Tuesday is paid their base rate for the ordinary hours they would have worked on 3 November. Penalty rates, loadings, allowances and overtime are not included. Your employer can't change your roster to avoid the payment, and a part-timer who doesn't normally work Tuesdays is not paid for it.",
          "In an area where the council has swapped the holiday, the same rule applies on the local day instead, and Tuesday 3 November is paid as an ordinary day.",
        ],
      },
      {
        id: "annual-leave",
        heading: "Cup Day and annual leave",
        paragraphs: [
          "A common arrangement is a long weekend built by taking Monday 2 November as annual leave. Only the Monday costs a day of leave: Tuesday 3 November is a public holiday for a Victorian-based employee who normally works Tuesdays and is paid as one, not deducted from the leave balance.",
        ],
      },
      {
        id: "2027",
        heading: "Melbourne Cup Day 2027",
        paragraphs: [
          "Melbourne Cup Day 2027 is Tuesday 2 November. Business Victoria's 2027 list shows it as a statewide public holiday. The non-metropolitan council swaps for 2027 have not been published yet, so the regional table above covers 2026 only. Check Business Victoria's non-metropolitan page again once it is updated.",
        ],
      },
    ],
    faqs: [
      { q: "When is Melbourne Cup Day in 2026?", a: "Tuesday 3 November 2026. Melbourne Cup Day 2027 is Tuesday 2 November. It is the first Tuesday in November and a public holiday in Victoria only." },
      { q: "Is Melbourne Cup Day a public holiday everywhere in Victoria?", a: "No. It is statewide unless a non-metropolitan council has arranged a local holiday instead. In 2026 that includes Geelong (Wednesday 21 October), Warrnambool and Moyne (Thursday 7 May) and Wodonga (Friday 27 November). In those areas the local day is the public holiday and Tuesday 3 November is an ordinary working day." },
      { q: "How much do you get paid on Melbourne Cup Day?", a: `Your award's public holiday rate. Hospitality and retail workers earn ${HOSP_P} of the base rate if full-time or part-time and ${HOSP_C} if casual. Across the 14 awards on this site the permanent range is ${RANGE_PERM}.` },
      { q: "Do I get paid for Melbourne Cup Day if I don't work?", a: NOT_WORKING_ANSWER },
      { q: "Do I get Melbourne Cup Day off if I work in Victoria but live interstate, or the other way round?", a: "Your public holiday entitlement follows where your job is based, not where you live or where you happen to be that day. A Melbourne-based employee working in Sydney on Melbourne Cup Day still gets the Victorian holiday entitlement." },
    ],
    related: [
      { href: "/public-holiday-pay/vic/", label: "VIC public holidays 2026 and 2027" },
      { href: "/pay-calculator-vic/", label: "Victoria pay calculator" },
      { href: "/hospitality-award-rates/", label: "Hospitality award rates" },
      { href: "/christmas-day-pay-rates/", label: "Christmas Day pay rates" },
    ],
    sources: [
      FW_2026,
      FW_2027,
      {
        title: "Victorian public holidays 2026",
        url: "https://business.vic.gov.au/business-information/public-holidays/victorian-public-holidays-2026",
        publisher: "Business Victoria",
      },
      {
        title: "Victorian non-metropolitan public holidays 2026",
        url: "https://business.vic.gov.au/business-information/public-holidays/victorian-non-metropolitan-public-holidays-2026",
        publisher: "Business Victoria",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Easter
  // ---------------------------------------------------------------------------
  {
    slug: "easter-public-holiday-pay",
    guideKey: "easter-public-holiday-pay",
    shortName: "Easter public holiday pay",
    titles: ["Easter 2027 Public Holiday Pay: Good Friday to Easter Monday", "Easter 2027 Public Holiday Pay: Rates and Dates"],
    h1: "Easter 2027 public holiday pay: Good Friday to Easter Monday",
    descriptions: [
      `Easter 2027: Good Friday 26 March to Easter Monday 29 March. Which days are public holidays in your state, plus pay rates (retail ${RETAIL_P}, casual ${RETAIL_C}) and a calculator.`,
      `Easter 2027 runs 26 to 29 March. Which days are public holidays by state, and the pay (retail ${RETAIL_P}, casual ${RETAIL_C}). Calculator inside.`,
    ],
    standfirst:
      "Easter is four days long on the calendar, but the number that are public holidays depends on where you work. Good Friday and Easter Monday are public holidays nearly everywhere; Easter Saturday and Easter Sunday are not.",
    directAnswer: `Easter 2027 is Good Friday 26 March, Easter Saturday 27 March, Easter Sunday 28 March and Easter Monday 29 March. Good Friday and Easter Monday are public holidays in every state, and every hour worked is paid at your award's public holiday rate: ${RETAIL_P} for retail and hospitality staff, ${RETAIL_C} for casuals. Easter Saturday is a holiday in NSW, VIC, QLD, SA, the ACT and the NT, and Easter Sunday in every state except Tasmania.`,
    topics: [
      {
        topic: "easter",
        id: "dates",
        heading: "Easter 2027 public holidays by state",
        intro:
          "Easter Sunday 2027 is 28 March, so Good Friday is 26 March and Easter Monday 29 March. Each row below lists the Easter days that state treats as public holidays. Victoria calls the Saturday the Saturday before Easter Sunday and Queensland the day after Good Friday.",
        footnote:
          "Tasmania also lists Easter Tuesday (30 March), but generally only for the Tasmanian Public Service, so it is left out of the table. Most Tasmanian private-sector workers work it at ordinary rates unless their award or agreement says otherwise.",
      },
    ],
    sectionsBeforeCalculator: [
      {
        id: "rates",
        heading: "Easter pay rates",
        paragraphs: [
          `On each Easter day that is a public holiday in your state, your award's public holiday rate applies to every hour worked. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals. Across the 14 awards on this site the permanent range is ${RANGE_PERM} and the casual range ${RANGE_CASUAL}.`,
          `Road Transport day workers get a higher rate on Good Friday than on other public holidays: ${ROAD_GF_XMAS_PERM} of the weekly wage rate for full-time and part-time day workers and ${ROAD_GF_XMAS_CASUAL} for casuals, the same as on Christmas Day. If your award singles out Good Friday or Easter Sunday, the clause is in the award's public holiday section.`,
          "Where Easter Saturday or Easter Sunday is a public holiday in your state, your award's public holiday row is the rate to check for hours worked that day. SCHADS says in terms that public holiday pay replaces weekend rates and shift loadings (cl 34.2(b)); for any other award, read its public holiday clause.",
        ],
      },
    ],
    calculator: { holidayName: "Good Friday", awardKey: "retail", employment: "permanent", hours: 8 },
    example: {
      heading: "Worked example: an 8-hour shift on Good Friday 2027",
      intro:
        "Entry-level adult rates from 1 July 2026, 8 hours worked on Friday 26 March 2027, compared with the same hours on an ordinary weekday. Any increase from the next annual wage review will lift both columns.",
      awardKeys: ["retail", "hospitality"],
      hours: 8,
      shiftNote: "Before tax. Excludes overtime, allowances and minimum shift lengths.",
    },
    sectionsAfterCalculator: [
      {
        id: "not-working",
        heading: "Paid for Easter days you don't work",
        paragraphs: [
          "A full-time or part-time employee is paid their base rate for the ordinary hours they would have worked on any Easter public holiday that falls on a day they normally work. For a Monday-to-Friday worker that means Good Friday and Easter Monday. For someone who normally works Saturdays or Sundays it also covers Easter Saturday or Easter Sunday in the states where those are public holidays, and nothing in the states where they are not.",
          "Casuals are not paid for Easter public holidays they don't work, so a four-day Easter weekend can be a four-day drop in pay for a casual who isn't rostered. If you are a casual, check your roster early.",
        ],
      },
      {
        id: "refuse",
        heading: "Refusing Easter shifts",
        paragraphs: [
          "Employers can ask you to work an Easter public holiday, but the request has to be reasonable and you can refuse if you have reasonable grounds. The Fair Work Ombudsman's factors are the nature of the workplace and your role, your personal circumstances, including caring responsibilities, whether you could expect to be asked, how much notice you were given, and any penalty rates or other payments on offer.",
        ],
      },
      {
        id: "annual-leave",
        heading: "Taking annual leave around Easter",
        paragraphs: [
          "Annual leave over Easter costs fewer days than it looks. The public holidays are paid as public holidays and are not deducted from your balance when they fall on a day you would normally work. Taking Tuesday 30 March to Friday 2 April 2027 off gives a ten-day break from Good Friday to Sunday 4 April. It costs four days of leave for a Monday-to-Friday worker (Tuesday to Friday), and the Good Friday and Easter Monday public holidays cost nothing.",
        ],
      },
    ],
    faqs: [
      { q: "When is Easter in 2027?", a: "Good Friday is Friday 26 March 2027, Easter Saturday is 27 March, Easter Sunday is 28 March and Easter Monday is 29 March." },
      { q: "Which Easter days are public holidays?", a: "Good Friday and Easter Monday are public holidays in every state and territory. Easter Saturday is a public holiday in New South Wales, Victoria, Queensland, South Australia, the ACT and the Northern Territory but not in Western Australia or Tasmania. Easter Sunday is a public holiday everywhere except Tasmania. Tasmania also lists Easter Tuesday, generally for the Tasmanian Public Service only." },
      { q: "How much do you get paid on Good Friday?", a: `Your award's public holiday rate. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals. Road Transport day workers get a higher rate on Good Friday than on other public holidays.` },
      { q: "Do I get paid for Easter public holidays if I don't work?", a: NOT_WORKING_ANSWER },
      { q: "Is Easter Sunday paid at public holiday rates?", a: `Where it is a public holiday in your state, yes. Easter Sunday is a public holiday in every state and territory except Tasmania, so an hour worked is paid at your award's public holiday rate (${RETAIL_P} in retail and hospitality, ${RETAIL_C} for casuals).` },
    ],
    related: [
      { href: "/public-holidays-2027/", label: "Public holidays 2027 with pay rates" },
      { href: "/australia-day-public-holiday-pay/", label: "Australia Day 2027 pay" },
      { href: "/overtime-penalty-rates-guide/", label: "Penalty rates guide" },
      { href: "/retail-award-rates/", label: "Retail award rates" },
    ],
    sources: [FW_2027],
  },

  // ---------------------------------------------------------------------------
  // Australia Day
  // ---------------------------------------------------------------------------
  {
    slug: "australia-day-public-holiday-pay",
    guideKey: "australia-day-public-holiday-pay",
    shortName: "Australia Day pay",
    titles: ["Australia Day 2027 Public Holiday Pay: Tuesday 26 January", "Australia Day 2027 Public Holiday Pay and Rates"],
    h1: "Australia Day 2027 public holiday pay: Tuesday 26 January",
    descriptions: [
      `Australia Day 2027 is Tuesday 26 January, a public holiday in every state with no extra day. Retail and hospitality pay ${RETAIL_P} (casual ${RETAIL_C}). Calculator inside.`,
      `Australia Day 2027 is Tuesday 26 January in every state. Retail and hospitality pay ${RETAIL_P} (casual ${RETAIL_C}). Calculator inside.`,
    ],
    standfirst:
      "Australia Day 2027 falls in the middle of the week, on a Tuesday. Nothing moves and no state adds an extra day, so the questions are about the pay on the day, and what taking the Monday off does to your leave.",
    directAnswer: `Australia Day 2027 is Tuesday 26 January in every state and territory. Work it and your award pays the public holiday rate: ${RETAIL_P} of the base rate for full-time and part-time retail and hospitality staff, ${RETAIL_C} for casuals. If it falls on a day you normally work and you are not rostered, a full-time or part-time employee is still paid their base rate for their ordinary hours.`,
    topics: [
      {
        topic: "australia-day",
        id: "dates",
        heading: "Australia Day 2027 by state",
        intro:
          "Australia Day is 26 January. In 2027 that is a Tuesday, so there is no weekend substitute to work out. Every state and territory observes it on the day.",
      },
    ],
    sectionsBeforeCalculator: [
      {
        id: "rates",
        heading: "What Australia Day pays",
        paragraphs: [
          `Australia Day is paid at your award's public holiday rate, the same as any other public holiday. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals, with the 25% casual loading already in the casual figure. Across the 14 awards on this site the permanent range is ${RANGE_PERM} and the casual range ${RANGE_CASUAL}.`,
          "An enterprise agreement's rate replaces the award rate. Pick the enterprise agreement option in the calculator below and enter your own percentage.",
        ],
      },
      {
        id: "refusing",
        heading: "Working or refusing to work on Australia Day",
        paragraphs: [
          "Every employee can be absent from work on a public holiday, but an employer can ask you to work it if the request is reasonable and you can refuse if the request is unreasonable or you have reasonable grounds. The Fair Work Ombudsman's factors include the nature of your workplace and role, your personal circumstances, the penalty rates on offer and the notice given.",
          "You and your employer can also agree to substitute another day for Australia Day where your award or agreement allows it, or, if you are award and agreement free, by agreement. The substitute day is then paid as the public holiday and the original day as an ordinary day.",
        ],
      },
    ],
    calculator: { holidayName: "Australia Day", awardKey: "retail", employment: "permanent", hours: 8 },
    example: {
      heading: "Worked example: an 8-hour shift on Australia Day 2027",
      intro: "Entry-level adult rates from 1 July 2026, 8 hours worked on Tuesday 26 January 2027, compared with the same hours on an ordinary weekday.",
      awardKeys: ["retail", "hospitality"],
      hours: 8,
      shiftNote: "Before tax. Excludes overtime, allowances and minimum shift lengths.",
    },
    sectionsAfterCalculator: [
      {
        id: "not-working",
        heading: "If you have Australia Day off",
        paragraphs: [
          "A full-time or part-time employee who normally works Tuesdays is paid their base rate for the ordinary hours they would have worked on 26 January 2027, without any penalty rates, loadings, overtime or allowances. Your employer can't change your roster to avoid it. A part-timer who doesn't normally work Tuesdays gets nothing for it, and casuals are not paid for a public holiday they don't work.",
        ],
      },
      {
        id: "long-weekend",
        heading: "No long weekend in 2027, but a cheap one",
        paragraphs: [
          "Because 26 January 2027 is a Tuesday there is no automatic long weekend. If you want one, you can take Monday 25 January as annual leave. That costs one day of leave: the Tuesday public holiday is paid as a public holiday and is not taken out of your balance when it falls on a day you would normally work. Check with your employer that the Monday leave is approved before you book.",
          "In 2026 Australia Day was a Monday, so the long weekend came with the date.",
        ],
      },
      {
        id: "other",
        heading: "Australia Day and other holiday questions",
        paragraphs: [
          "If you work in Western Australia, Tasmania or any other state, the Australia Day rules above are the same, because the day, the rate and the right to be paid for a normal working day are all national. What differs between states is the other holidays around it, covered in the 2027 public holiday guide.",
        ],
      },
    ],
    faqs: [
      { q: "When is Australia Day in 2027?", a: "Tuesday 26 January 2027, a public holiday in every state and territory. Because it falls on a weekday, no state adds an extra holiday." },
      { q: "How much do you get paid on Australia Day?", a: `Your award's public holiday rate. Retail and hospitality pay ${RETAIL_P} of the base rate to full-time and part-time staff and ${RETAIL_C} to casuals. Across 14 awards the permanent range is ${RANGE_PERM}.` },
      { q: "Do I get paid for Australia Day if I don't work?", a: NOT_WORKING_ANSWER },
      { q: "Can I refuse to work on Australia Day?", a: "You can refuse if the request is unreasonable or you have reasonable grounds. Relevant factors include your role, your personal circumstances, the notice you were given and the penalty rates on offer. Employers and employees can also agree to swap the public holiday for another day where the award or agreement allows." },
      { q: "If I take Monday 25 January 2027 off, how much leave do I use?", a: "One day. The public holiday on Tuesday 26 January is paid as a public holiday and is not deducted from your annual leave balance when it falls on a day you would normally work." },
    ],
    related: [
      { href: "/public-holidays-2027/", label: "Public holidays 2027 with pay rates" },
      { href: "/easter-public-holiday-pay/", label: "Easter 2027 pay" },
      { href: "/annual-leave-guide/", label: "Annual leave guide" },
      { href: "/casual-loading-calculator/", label: "Casual loading calculator" },
    ],
    sources: [FW_2027],
  },

  // ---------------------------------------------------------------------------
  // Christmas shutdown
  // ---------------------------------------------------------------------------
  {
    slug: "christmas-shutdown-annual-leave",
    guideKey: "christmas-shutdown-annual-leave",
    shortName: "Christmas shutdown and annual leave",
    titles: ["Christmas Shutdown: Annual Leave, Pay and Your Rights", "Christmas Shutdown and Annual Leave: Your Rights"],
    h1: "Christmas shutdown and annual leave: can your employer make you take it?",
    descriptions: [
      "Can your employer make you take annual leave over a Christmas closedown? What the award must allow, how much leave it uses, public holidays and a worked example.",
      "Can your employer direct annual leave over a Christmas closedown? What the award must allow, how much leave it uses, and a worked example.",
    ],
    standfirst:
      "A Christmas shutdown is when the business closes for the holiday period. Whether you can be made to use annual leave for it depends on your award or agreement, and the public holidays inside the shutdown are not taken out of your leave.",
    directAnswer:
      "An employer can direct you to take annual leave during a shutdown only if your award or enterprise agreement allows it, and in most cases the direction must be reasonable, in writing and given with the notice period the award requires. If no award or agreement applies, the direction only has to be reasonable. Public holidays inside the shutdown are paid as public holidays, not deducted from your annual leave.",
    topics: [],
    sectionsBeforeCalculator: [
      {
        id: "can-they",
        heading: "Can your employer make you take annual leave over Christmas?",
        paragraphs: [
          "It depends on what covers you. If an award or enterprise agreement applies, your employer can direct you to take annual leave during a shutdown only if that award or agreement allows it. Most awards have rules about how and when, and in most cases the direction must be reasonable, in writing and given to the affected employees within the required notice period. An award may also restrict a shutdown to certain times, such as the end-of-year period.",
          "If your award or agreement has no rules allowing the direction, your employer can't direct you to take annual leave, although you and your employer can agree that you take annual leave, including before you have accrued it, or unpaid leave during the shutdown. If no award or agreement applies to you, your employer can require you to take paid annual leave if the requirement is reasonable. The Fair Work Ombudsman says this includes a temporary shutdown between Christmas and New Year.",
        ],
        bullets: [
          "Check your award's closedown or annual leave clause for the notice period: some awards allow a shorter notice period if the employer and a majority of affected employees agree.",
          "The Fair Work Ombudsman's example is a food manufacturer whose award requires a reasonable, written direction with at least 28 days' notice. Notice periods differ between awards, so the 28 days is not a general rule.",
          "If an enterprise agreement covers you, search for it on the Fair Work Commission's agreement database and read its shutdown clause: the agreement's rules replace the award's.",
        ],
      },
      {
        id: "pay-during",
        heading: "How you are paid during a shutdown",
        paragraphs: [
          "If you are directed to take annual leave, you are paid for it as annual leave at your base rate for the hours you would have worked, plus any leave loading your award provides. Leave loading is not part of the National Employment Standards. It comes from your award or agreement: under the Hospitality Award, for example, it is a flat 17.5%. The leave loading calculator shows the figure for your award.",
          "If you continue to work while the business shuts down, you should receive your normal pay. If there is a public holiday during the shutdown, you should be given the day off without loss of pay, or be paid the public holiday rate under your award or agreement if you work.",
        ],
      },
    ],
    calculator: { awardKey: "hospitality", employment: "permanent", hours: 8 },
    example: {
      heading: "Worked example: a Monday 28 December 2026 to Friday 8 January 2027 shutdown",
      intro:
        "A full-time employee who works Monday to Friday, 7.6 hours a day, in any state or territory, where Monday 28 December 2026 and Friday 1 January 2027 are both public holidays.",
      awardKeys: [],
      hours: 0,
      shiftNote: "",
    },
    shutdownExample: true,
    sectionsAfterCalculator: [
      {
        id: "public-holidays",
        heading: "Public holidays during the shutdown",
        paragraphs: [
          "A public holiday that falls on a day you would normally work is paid as a public holiday, even when you are on paid annual leave during a shutdown. The Fair Work Ombudsman says an employee's base pay rate for their ordinary hours applies, and employers should check whether they need to adjust payroll so that annual leave isn't incorrectly deducted for the public holiday.",
          "That is why the example above uses 8 days of leave, not 10. Christmas Day and Boxing Day fall before the shutdown in 2026, but the additional Boxing Day holiday on Monday 28 December and New Year's Day on Friday 1 January do fall inside it, and neither is charged to your leave balance. Public holidays in unpaid leave are not paid.",
        ],
      },
      {
        id: "not-enough-leave",
        heading: "What if you don't have enough annual leave?",
        paragraphs: [
          "If the shutdown is longer than your leave balance, the Fair Work Ombudsman says that, if your award or agreement allows it, you can agree with your employer to take annual leave before you have accrued it, or unpaid leave. This is by agreement, not a direction. Get any such agreement in writing.",
          "Part-time employees use leave only for the days they would have worked. A part-timer who works Tuesday to Thursday is charged for those days in the shutdown, not for Monday or Friday.",
        ],
      },
      {
        id: "casuals",
        heading: "Casual employees and shutdowns",
        paragraphs: [
          "Casual employees are not entitled to paid annual leave under the National Employment Standards (Fair Work Act s 86), so a shutdown means no work and no pay unless your employer offers shifts. Casuals have no paid annual leave to be directed to take.",
        ],
      },
      {
        id: "stand-down",
        heading: "A shutdown is not a stand down",
        paragraphs: [
          "A shutdown is a planned closure, such as over Christmas and New Year. A stand down is when an employer tells employees not to work because they can't be usefully employed for a reason outside the employer's control, such as an equipment breakdown that isn't the employer's fault or a natural disaster. Different rules apply: see the Fair Work Ombudsman's stand down page. A planned Christmas closure is a shutdown, so the annual leave rules above are the ones to check.",
        ],
      },
      {
        id: "disconnect",
        heading: "Contact and right to disconnect",
        paragraphs: [
          "Before shutting down, employers and employees should discuss whether you are required to be contactable or on call. The Fair Work Ombudsman points to the right to disconnect as relevant here, so get any expectation to be reachable over the break settled in writing.",
        ],
      },
    ],
    faqs: [
      { q: "Can my employer make me take annual leave over Christmas?", a: "Only if your award or enterprise agreement allows it. Most awards require the direction to be reasonable, in writing and given within a set notice period. If no award or agreement applies to you, the direction only has to be reasonable. If your award has no rules allowing the direction, you can agree to take annual leave or unpaid leave, but you can't be directed." },
      { q: "Do public holidays come out of my annual leave during a shutdown?", a: "No. A public holiday on a day you would normally work is paid as a public holiday and is not deducted from your annual leave, even during a shutdown. A Monday to Friday worker on leave from Monday 28 December 2026 to Friday 8 January 2027 uses 8 days, not 10, in a state where 28 December and 1 January are both public holidays." },
      { q: "What if I don't have enough annual leave for the shutdown?", a: "If your award or agreement allows it, you can agree with your employer to take annual leave before you have accrued it, or unpaid leave. It is by agreement: your employer can't make you." },
      { q: "Do casuals get paid during a Christmas shutdown?", a: "No. Casual employees are not entitled to paid annual leave, so if the business is closed and you aren't rostered, you aren't paid. If the business stays open and you work, you are paid for the hours worked, and public holidays you work are paid at the casual public holiday rate." },
      { q: "How much notice must my employer give for a shutdown?", a: "It depends on your award or agreement. Most awards require the direction to be reasonable, in writing and given within a notice period, and some allow a shorter period if the employer and most affected employees agree. The Fair Work Ombudsman's example, a food manufacturer's award, requires at least 28 days' written notice, but that is one award's rule, not a general one." },
      { q: "Is a shutdown the same as a stand down?", a: "No. A shutdown is a temporary planned closure such as over Christmas and New Year, when you can be directed to take annual leave if your award or agreement allows it. A stand down is when an employer can't usefully employ you for a reason outside their control, such as a natural disaster." },
    ],
    related: [
      { href: "/annual-leave-guide/", label: "Annual leave guide" },
      { href: "/leave-loading-calculator/", label: "Leave loading calculator" },
      { href: "/christmas-day-pay-rates/", label: "Christmas Day pay rates" },
      { href: "/boxing-day-pay-rates/", label: "Boxing Day pay rates" },
    ],
    sources: [FW_END_OF_YEAR, FW_SHUTDOWN, FW_2026],
  },
];

export function getSeasonalPage(slug: string): SeasonalPage | undefined {
  return SEASONAL_PAGES.find((p) => p.slug === slug);
}

export function seasonalPath(slug: string): string {
  return `/${slug}/`;
}
