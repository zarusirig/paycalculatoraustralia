// Bartender — Hospitality Industry (General) Award 2020 [MA000009] (T5, wave 3).
//
// Classification: Hospitality Schedule A.2.1. "Supplying, dispensing and
// mixing liquor" is a Food and beverage attendant grade 2 (wage level 2) task;
// grade 3 (level 3) adds "mixing a range of sophisticated drinks", full control
// of a cellar or liquor store, gaming terminals, and training or supervising
// lower grades. Food and beverage supervisor is level 5; there is no F&B
// grade 5. Rows come from HOSPITALITY_RATES via ./hospitality-common.ts.
//
// Juniors: Hospitality cl 13.5 — "Junior employees working as liquor service
// employees must be paid as an adult". Restaurant Award bar staff: same F&B
// grades and dollars (Table 3); see ./hospitality-common.ts.
//
// Median: Jobs and Skills Australia, ANZSCO 4311 Bar Attendants and Baristas,
// $1,500 a week / $37 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import {
  HOSPITALITY_AWARD_REF,
  HOSPITALITY_EVENING_NOTE,
  HOSPITALITY_OVERTIME_LINES,
  HOSPITALITY_PENALTY_ROWS,
  RESTAURANT_AWARD_REF,
  hospitalityRow,
} from "./hospitality-common";
import { HOSPITALITY_ALLOWANCES, HOSPITALITY_PENALTIES } from "../../constants/hospitality-award";
import { RESTAURANT_AWARD } from "../../constants/modern-awards";
import { formatAUD } from "../../constants/australian-tax";
import { annual52, atPercent, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation } from "./types";

export const BAR_ATTENDANTS_MEDIAN: MedianEarnings = {
  anzscoCode: "4311",
  anzscoTitle: "Bar Attendants and Baristas",
  medianWeekly: 1_500,
  medianHourly: 37,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4311-bar-attendants-and-baristas"),
};

const GRADE_2 = hospitalityRow("Level 2", "Food and beverage attendant grade 2");
const GRADE_3 = hospitalityRow("Level 3", "Food and beverage attendant grade 3");
const P = HOSPITALITY_PENALTIES;

function hospAllowance(name: string): number {
  const a = HOSPITALITY_ALLOWANCES.find((x) => x.name === name);
  if (!a) throw new Error(`bartender: no Hospitality allowance ${name}`);
  return a.amount;
}

function restaurantFlat(labelStart: string): number {
  const r = RESTAURANT_AWARD.penalties.find((x) => x.label.startsWith(labelStart));
  if (!r || r.flatPerHour === undefined) throw new Error(`bartender: no Restaurant flat loading ${labelStart}`);
  return r.flatPerHour;
}

const MEAL = hospAllowance("Meal allowance (overtime of more than 2 hours, not advised the previous day)");
const SPLIT_2_3 = hospAllowance("Split shift allowance (2 to 3 hours between shifts)");
const SPLIT_3_PLUS = hospAllowance("Split shift allowance (more than 3 hours between shifts)");
const FIRST_AID_FT = hospAllowance("First aid allowance (full-time)");
const FIRST_AID_DAY = hospAllowance("First aid allowance (part-time or casual)");
const REST_EVENING = restaurantFlat("Monday to Friday — 10.00 pm to midnight");
const REST_NIGHT = restaurantFlat("Monday to Friday — midnight to 6.00 am");

export const BARTENDER: Occupation = {
  slug: "bartender",
  name: "Bartender",
  plural: "bartenders",
  award: {
    name: HOSPITALITY_AWARD_REF.name,
    code: HOSPITALITY_AWARD_REF.code,
    url: awardTextUrl(HOSPITALITY_AWARD_REF.code),
    consolidatedTo: HOSPITALITY_AWARD_REF.consolidatedTo,
    awardPageHref: "/hospitality-award-rates/",
  },
  headline: {
    tableId: "bar-staff",
    label: "Food and beverage attendant grade 2",
    why: "a bartender pouring, dispensing and mixing drinks, work the award lists at Food and beverage attendant grade 2",
  },
  coverage: [
    "Bartenders in pubs, hotels, taverns, wine bars, resorts and casinos are covered by the Hospitality Industry (General) Award 2020 [MA000009]. Bar staff in restaurants, cafés and nightclubs are covered by the Restaurant Industry Award 2020 [MA000119], which uses the same food and beverage grades and pays the same minimum rates. Bar staff in registered clubs (RSLs, leagues and bowling clubs) are covered by the Registered and Licensed Clubs Award, which this page does not show.",
    "The Hospitality Award has no \"bartender\" title. Bar work sits in the food and beverage attendant stream (Schedule A.2.1). Supplying, dispensing and mixing liquor, including selling from the bottle shop, is a grade 2 task. Grade 3 adds mixing a range of sophisticated drinks (cocktail bartending) as well as full control of a cellar or liquor store, attending gaming terminals, and training or supervising lower grades. Grade 1 is glass collecting and table clearing with no service to customers.",
    "Under the Hospitality Award, an employee who has completed a relevant AQF Certificate III and uses those skills must be classified at least at Level 4 (cl 2, definition of appropriate level of training, NOTE 1). Under the Restaurant Award a grade 2 attendant needs a relevant Certificate II to move to grade 3.",
    "A bar supervisor responsible for supervising food and beverage staff or for stock control of one or more bars is a Food and beverage supervisor (level 5).",
    "A junior working as a liquor service employee must be paid the adult rate (cl 13.5).",
  ],
  tables: [
    {
      id: "bar-staff",
      title: "Bartender pay rates, Hospitality Award, 2026–27",
      intro:
        "These are the bartender minimum rates in Hospitality Award cl 18.1, Table 3, from the first full pay period on or after 1 July 2026. The casual rate is the hourly rate plus the 25% casual loading. The Restaurant Award pays the same dollars for the same grades.",
      rows: [
        hospitalityRow("Level 1", "Food and beverage attendant grade 1", "Glass collecting, clearing tables, no customer service"),
        hospitalityRow("Level 2", "Food and beverage attendant grade 2", "Pouring and mixing drinks, bottle shop, taking payment"),
        hospitalityRow("Level 3", "Food and beverage attendant grade 3", "Sophisticated drinks, cellar control, gaming, training"),
        hospitalityRow("Level 4", "Food and beverage attendant (tradesperson) grade 4", "Apprenticeship in waiting or trade test"),
        hospitalityRow("Level 5", "Food and beverage supervisor", "Supervises bar staff or controls bar stock"),
      ],
    },
  ],
  penalties: HOSPITALITY_PENALTY_ROWS,
  penaltiesNote: `The bartender penalty rates above come from Hospitality Award cl 29.2, Table 14. ${HOSPITALITY_EVENING_NOTE} Under the Restaurant Award the ${money2(REST_EVENING)} loading starts at 10 pm, the ${money2(REST_NIGHT)} loading runs midnight to 6 am, and a casual at grade 1 or 2 gets 150% (not 175%) on Sunday (Table 8).`,
  overtime: HOSPITALITY_OVERTIME_LINES,
  allowances: [
    { name: "Meal allowance", amount: money2(MEAL), note: "Overtime of more than 2 hours without notice the previous day, unless a meal is supplied (cl 26.4(b)(i))." },
    { name: "Split shift allowance", amount: `${money2(SPLIT_2_3)} per day`, note: `2 to 3 hours between shifts; ${money2(SPLIT_3_PLUS)} for more than 3 hours (cl 26.14).` },
    { name: "First aid allowance", amount: `${money2(FIRST_AID_FT)} per week`, note: `Full-time; ${money2(FIRST_AID_DAY)} a day for part-time and casual staff, up to ${money2(FIRST_AID_FT)} a week (cl 26.12).` },
  ],
  median: BAR_ATTENDANTS_MEDIAN,
  notices: [
    "If you work behind the bar at an RSL, leagues, bowling or other registered club, your minimum comes from the Registered and Licensed Clubs Award, not the table above.",
  ],
  notShown: [
    "Registered and Licensed Clubs Award bar rates.",
    "Casino gaming stream rates.",
    "Liquor licensee and managerial staff (hotels) rates.",
  ],
  faqs: [
    {
      q: "What is the award rate for a bartender in 2026?",
      a: `A bartender (Food and beverage attendant grade 2) must be paid at least ${money2(GRADE_2.hourly)} an hour, or ${formatAUD(GRADE_2.weekly, 2)} a week, under the Hospitality Award from the first full pay period on or after 1 July 2026: ${money0(annual52(GRADE_2.weekly))} a year full-time before tax. A cocktail bartender or cellar hand at grade 3 gets ${money2(GRADE_3.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a bartender?",
      a: `A casual grade 2 bartender earns at least ${money2(GRADE_2.casualHourly ?? 0)} an hour on weekdays before 7 pm, the ${money2(GRADE_2.hourly)} rate plus the 25% casual loading. Casuals get ${Math.round(P.casualSaturday * 100)}% on Saturday (${money2(atPercent(GRADE_2.hourly, P.casualSaturday))}), ${Math.round(P.casualSunday * 100)}% on Sunday (${money2(atPercent(GRADE_2.hourly, P.casualSunday))}) and ${Math.round(P.casualPublicHoliday * 100)}% on public holidays (${money2(atPercent(GRADE_2.hourly, P.casualPublicHoliday))}).`,
    },
    {
      q: "How much do bartenders get paid at night?",
      a: `Under the Hospitality Award, hours between 7 pm and midnight on a weekday earn an extra ${money2(P.eveningPerHour)} an hour, and hours between midnight and 7 am an extra ${money2(P.nightPerHour)} an hour, on top of the ordinary (or casual) rate. They are flat amounts, not percentages.`,
    },
    {
      q: "Do junior bartenders get paid less?",
      a: "No. The Hospitality Award says junior employees working as liquor service employees must be paid as an adult (cl 13.5), so an 18-year-old pouring drinks gets the full adult rate.",
    },
    {
      q: "What do bartenders actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of ${money0(BAR_ATTENDANTS_MEDIAN.medianWeekly)} a week for bar attendants and baristas (ABS Survey of Employee Earnings and Hours, May 2025). The group combines bar staff and baristas and includes above-award pay.`,
    },
  ],
  sources: [
    { title: "Hospitality Industry (General) Award 2020 [MA000009], consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(HOSPITALITY_AWARD_REF.code) },
    { title: "Restaurant Industry Award 2020 [MA000119], consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(RESTAURANT_AWARD_REF.code) },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(BAR_ATTENDANTS_MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/hospitality-award-rates/", label: "Hospitality Award Pay Rates" },
    { href: "/restaurant-award-rates/", label: "Restaurant Award Pay Rates" },
    { href: "/job-pay-rates/barista/", label: "Barista Pay Rates" },
    { href: "/job-pay-rates/chef/", label: "Chef Pay Rates" },
    { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
  ],
};
