// Chef / cook — Hospitality Industry (General) Award 2020 [MA000009] and
// Restaurant Industry Award 2020 [MA000119] (T5, wave 3).
//
// Cook grades are defined identically in both awards (Hospitality Schedule
// A.2.2(d)–(h); Restaurant Schedule A.3): Cook grade 3 (tradesperson) is "a
// commi chef or equivalent", grade 4 "a demi chef", grade 5 "a chef de
// partie". Wage levels: cook grade 1 = Level 2, grade 2 = Level 3, grade 3 =
// Level 4, grade 4 = Level 5, grade 5 = Level 6 (Hospitality Table 3; Restaurant
// Table 3). See ./hospitality-common.ts for sources and the award differences.
//
// Median: Jobs and Skills Australia, ANZSCO 3513 Chefs, $1,423 a week / $37 an
// hour (ABS SEEH May 2025), read 23 September 2026. (ANZSCO 3514 Cooks: $1,432.)

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
  restaurantRow,
} from "./hospitality-common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3513",
  anzscoTitle: "Chefs",
  medianWeekly: 1_423,
  medianHourly: 37,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3513-chefs"),
};

export const CHEF: Occupation = {
  slug: "chef",
  name: "Chef",
  plural: "chefs",
  award: {
    name: HOSPITALITY_AWARD_REF.name,
    code: HOSPITALITY_AWARD_REF.code,
    url: awardTextUrl(HOSPITALITY_AWARD_REF.code),
    consolidatedTo: HOSPITALITY_AWARD_REF.consolidatedTo,
    awardPageHref: "/hospitality-award-rates/",
  },
  headline: {
    tableId: "cooks-hospitality",
    label: "Cook grade 3 (tradesperson) — commis chef",
    why: "a qualified chef who has finished an apprenticeship or passed the trade test — the award's \"commi chef or equivalent\"",
  },
  coverage: [
    "Which award covers a chef depends on where they work. Chefs in hotels, pubs, taverns, motels, resorts and casinos are covered by the Hospitality Industry (General) Award 2020 [MA000009]. Chefs in restaurants, cafés, reception centres and roadhouses are covered by the Restaurant Industry Award 2020 [MA000119]. A restaurant inside a hotel or licensed club stays under the Hospitality or Clubs award (Restaurant Award cl 4.2).",
    "Both awards use the same cook grades and pay the same minimum weekly and hourly rates at every level. A qualified chef — someone who has completed a commercial cookery apprenticeship or passed the trade test (the Restaurant Award also accepts the appropriate level of training) — starts at Cook grade 3 (tradesperson), which both awards describe as \"a commi chef or equivalent\". A demi chef is Cook grade 4 and a chef de partie Cook grade 5.",
    "Cook grades 1 and 2 cover unqualified cooks: grade 1 cooks breakfasts and snacks, grade 2 has the appropriate level of training. The awards differ on penalty rates — see the penalty section.",
    "Chefs in takeaway shops are usually under the Fast Food Award, and cooks in residential aged care under the Aged Care Award general stream. Head chefs and executive chefs are commonly paid salaries above the award.",
  ],
  tables: [
    {
      id: "cooks-hospitality",
      title: "Chef and cook pay rates — Hospitality Award, 2026–27",
      intro:
        "Hospitality Award cl 18.1, Table 3, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading.",
      rows: [
        hospitalityRow("Level 2", "Cook grade 1", "Breakfasts and snacks"),
        hospitalityRow("Level 3", "Cook grade 2", "Has the appropriate level of training"),
        hospitalityRow("Level 4", "Cook grade 3 (tradesperson) — commis chef", "Completed apprenticeship or trade test"),
        hospitalityRow("Level 5", "Cook grade 4 (tradesperson) — demi chef", "May supervise and train other cooks"),
        hospitalityRow("Level 6", "Cook grade 5 (tradesperson) — chef de partie", "Supervision, ordering and stock control"),
      ],
    },
    {
      id: "cooks-restaurant",
      title: "Chef and cook pay rates — Restaurant Award, 2026–27",
      intro:
        "Restaurant Award cl 18.1, Table 3, from the first full pay period on or after 1 July 2026. The minimums are the same dollars as the Hospitality Award; the penalty rates differ.",
      rows: [
        restaurantRow("Level 2", "Restaurant — Cook grade 1"),
        restaurantRow("Level 3", "Restaurant — Cook grade 2"),
        restaurantRow("Level 4", "Restaurant — Cook grade 3 (tradesperson)"),
        restaurantRow("Level 5", "Restaurant — Cook grade 4 (tradesperson)"),
        restaurantRow("Level 6", "Restaurant — Cook grade 5 (tradesperson)"),
      ],
    },
  ],
  penalties: HOSPITALITY_PENALTY_ROWS,
  penaltiesNote: `Hospitality Award cl 29.2, Table 14. ${HOSPITALITY_EVENING_NOTE} Under the Restaurant Award the $2.95 loading starts at 10 pm (not 7 pm), the $4.42 loading runs midnight to 6 am, and casual chefs at Cook grade 2 or above get 175% on Sunday (Table 8).`,
  overtime: HOSPITALITY_OVERTIME_LINES,
  allowances: [
    { name: "Tool and equipment allowance", amount: "$2.03 per day", note: "A cook or apprentice cook required to supply and use their own tools; up to $9.94 a week (Hospitality cl 26.5(a); the Restaurant Award pays the same)." },
    { name: "Meal allowance", amount: "$17.42", note: "Overtime of more than 2 hours without notice the previous day, unless a meal is supplied (Hospitality cl 26.4(b)(i); Restaurant cl 21)." },
    { name: "Split shift allowance", amount: "$3.69 per day", note: "Hospitality Award, 2 to 3 hours between shifts; $5.60 for more than 3 hours (cl 26.14)." },
  ],
  median: MEDIAN,
  notices: [
    "Many chefs are paid an annualised salary. Under both awards a written annualised wage agreement with a full-time employee must pay at least 25% more than the award minimum x 52 — $72,741.50 a year for a Cook grade 3 — and hours beyond the outer limits (an average of 18 penalty-rate ordinary hours or 12 overtime hours a week) must be paid on top (Hospitality cl 24.2; Restaurant cl 20.1).",
  ],
  notShown: [
    "Apprentice cook rates.",
    "Clubs award (Registered and Licensed Clubs Award) chef rates.",
    "Restaurant Award Schedule AA, a temporary classification schedule that operated from 11 August 2021.",
  ],
  faqs: [
    {
      q: "What is the award rate for a chef in 2026?",
      a: "A qualified chef (Cook grade 3, tradesperson) must be paid at least $29.45 an hour, or $1,119.10 a week, under both the Hospitality and Restaurant awards from the first full pay period on or after 1 July 2026 — $58,193 a year full-time before tax. A demi chef (grade 4) gets $31.30 and a chef de partie (grade 5) $32.13 an hour.",
    },
    {
      q: "What is the casual rate for a chef?",
      a: "A casual qualified chef earns at least $36.81 an hour, the $29.45 rate plus the 25% casual loading. On a Sunday a casual chef gets 175% of the minimum hourly rate, $51.54 an hour, under either award.",
    },
    {
      q: "Is a chef covered by the Hospitality Award or the Restaurant Award?",
      a: "It depends on the employer. Hotels, pubs, motels and resorts use the Hospitality Award; restaurants, cafés and reception centres use the Restaurant Award. The minimum hourly rates are identical; the evening loadings, casual Sunday rate for lower grades and Saturday overtime differ.",
    },
    {
      q: "How much is a chef paid on a Sunday?",
      a: "A full-time or part-time chef gets 150% of the minimum hourly rate on Sunday — $44.18 an hour for a Cook grade 3. Public holidays are 225%, $66.26 an hour.",
    },
    {
      q: "What do chefs actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,423 a week for chefs (ABS Survey of Employee Earnings and Hours, May 2025), about $73,996 a year.",
    },
  ],
  sources: [
    { title: "Hospitality Industry (General) Award 2020 [MA000009] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(HOSPITALITY_AWARD_REF.code) },
    { title: "Restaurant Industry Award 2020 [MA000119] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(RESTAURANT_AWARD_REF.code) },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/hospitality-award-rates/", label: "Hospitality Award Pay Rates" },
    { href: "/restaurant-award-rates/", label: "Restaurant Award Pay Rates" },
    { href: "/job-pay-rates/bartender/", label: "Bartender Pay Rates" },
    { href: "/job-pay-rates/barista/", label: "Barista Pay Rates" },
    { href: "/retail-hospitality-pay-guide/", label: "Retail & Hospitality Pay Guide" },
  ],
};
