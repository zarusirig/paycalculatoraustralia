// Barista — Restaurant Industry Award 2020 [MA000119], with the Hospitality
// and Fast Food awards where they apply instead (T5, wave 3).
//
// None of the three awards uses the word "barista" or "coffee" in a
// classification (searched the consolidated texts, 23 September 2026). Making
// and serving coffee is beverage service: Restaurant Schedule A.2.2 and
// Hospitality Schedule A.2.1(b) put "undertaking general waiting duties for
// food or beverages", "receiving money" and "attending a snack bar" at Food and
// beverage attendant grade 2 (wage level 2) — an employee who "has not achieved
// the appropriate level of training". Restaurant cl 2 NOTE 2: grade 3 requires
// a relevant AQF Certificate II; NOTE 1: a relevant Certificate III used on the
// job means at least Level 4.
//
// Which award: Restaurant cl 4.2 covers "restaurants, reception centres, night
// clubs, cafés or roadhouses". Fast Food cl 4.2(c) covers food and beverages in
// food courts and shopping centres "excluding coffee shops, cafes, bars and
// restaurants providing primarily a sit-down service", and 4.2(a)–(b) covers
// beverages sold primarily to take away. A café inside a hotel is Hospitality.
//
// Restaurant rows: ./hospitality-common.ts (cl 18.1, Table 3).
// Fast Food rows: FAST_FOOD_AWARD in lib/constants/modern-awards.ts.
// Junior percentages: Restaurant cl 18.2, Table 4.
//
// Median: Jobs and Skills Australia, ANZSCO 4311 Bar Attendants and Baristas,
// $1,500 a week / $37 an hour (ABS SEEH May 2025), read 23 September 2026.

import { FAST_FOOD_AWARD } from "../../constants/modern-awards";
import { BAR_ATTENDANTS_MEDIAN } from "./bartender";
import {
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  rowFromModernAward,
} from "./common";
import {
  HOSPITALITY_AWARD_REF,
  HOSPITALITY_EVENING_NOTE,
  RESTAURANT_AWARD_REF,
  RESTAURANT_PENALTY_ROWS,
  restaurantRow,
} from "./hospitality-common";
import type { Occupation } from "./types";

export const BARISTA: Occupation = {
  slug: "barista",
  name: "Barista",
  plural: "baristas",
  award: {
    name: RESTAURANT_AWARD_REF.name,
    code: RESTAURANT_AWARD_REF.code,
    url: awardTextUrl(RESTAURANT_AWARD_REF.code),
    consolidatedTo: RESTAURANT_AWARD_REF.consolidatedTo,
  },
  headline: {
    tableId: "cafe",
    label: "Food and beverage attendant grade 2",
    why: "a café barista doing beverage service who has not yet completed the Certificate II the Restaurant Award requires for grade 3",
  },
  coverage: [
    "Which award covers a barista depends on the business, not the coffee machine. Baristas in cafés and sit-down coffee shops are covered by the Restaurant Industry Award 2020 [MA000119], which covers \"restaurants, reception centres, night clubs, cafés or roadhouses\" (cl 4.2). A café run inside a hotel, motel or resort is covered by the Hospitality Industry (General) Award 2020 [MA000009] instead.",
    "A takeaway coffee kiosk or a coffee outlet in a food court is usually covered by the Fast Food Industry Award 2020 [MA000003]. That award covers beverages sold primarily to take away and food courts, but expressly excludes \"coffee shops, cafes, bars and restaurants providing primarily a sit-down service\" (cl 4.2).",
    "None of these awards has a \"barista\" classification. Making and serving coffee is beverage service. Under the Restaurant Award, a Food and beverage attendant grade 2 does general waiting for food or beverages, takes money and attends a snack bar but \"has not achieved the appropriate level of training\"; to be classified at grade 3 the employee must have completed a relevant AQF Certificate II (Schedule A.2.2–A.2.3 and cl 2, NOTE 2). Anyone with a relevant Certificate III who uses those skills must be paid at least Level 4 (cl 2, NOTE 1). Under the Fast Food Award every crew member making and serving food or drinks is Level 1.",
    "Someone new to the industry who cannot yet meet the Level 1 competencies can be paid the Introductory level — $25.74 an hour, $978.10 a week — for up to 3 months while trained and assessed (Restaurant Schedule A.1).",
    "Under the Restaurant and Hospitality awards the grade 2 rate ($27.08) is lower than the Fast Food Level 1 rate ($27.81), so the right award changes the minimum.",
  ],
  tables: [
    {
      id: "cafe",
      title: "Barista pay rates in a café — Restaurant Award, 2026–27",
      intro:
        "Restaurant Award cl 18.1, Table 3, from the first full pay period on or after 1 July 2026. The Hospitality Award pays the same dollars for the same grades. Casual is the hourly rate plus the 25% casual loading (cl 11.1).",
      rows: [
        restaurantRow("Level 1", "Food and beverage attendant grade 1", "Clearing and setting tables, receiving money"),
        restaurantRow("Level 2", "Food and beverage attendant grade 2", "Beverage and food service, not yet trained to grade 3"),
        restaurantRow("Level 3", "Food and beverage attendant grade 3", "Relevant Certificate II; may assist training lower grades"),
        restaurantRow("Level 4", "Food and beverage attendant grade 4 (tradesperson)", "Minimum level with a relevant Certificate III used on the job"),
      ],
    },
    {
      id: "takeaway",
      title: "Barista pay rates at a takeaway coffee outlet — Fast Food Award, 2026–27",
      intro: "Fast Food Award cl 15.1, Table 3, read from the same constants as the Fast Food Award page.",
      rows: [
        rowFromModernAward(FAST_FOOD_AWARD, "Level 1", "Fast Food Level 1", "Takes orders, prepares and serves food and drinks"),
        rowFromModernAward(FAST_FOOD_AWARD, "Level 2", "Fast Food Level 2", "Supervises or trains Level 1 staff"),
      ],
    },
  ],
  penalties: RESTAURANT_PENALTY_ROWS,
  penaltiesNote: `Restaurant Award cl 24.2, Table 8. ${HOSPITALITY_EVENING_NOTE} A casual barista at grade 1 or 2 gets 150% on Sunday, not 175%. Under the Fast Food Award a Level 1 employee gets 125% on Sunday (casual 150%) — see the fast food award page.`,
  overtime: [
    "Restaurant Award (cl 23.4, Table 7): Monday to Friday 150% for the first 2 hours, then 200%; Saturday 175% for the first 2 hours, then 200%; Sunday and rostered day off 200%.",
    "Fast Food Award (cl 20.6(a), Table 5): Monday to Saturday 150% for the first 2 hours, then 200%; Sunday 200%; public holiday 250%. Casual overtime adds the 25% loading.",
  ],
  allowances: [
    { name: "Meal allowance", amount: "$17.42", note: "Restaurant Award: overtime of more than 2 hours without notice the previous day, unless a meal is supplied (cl 21)." },
    { name: "Split shift allowance", amount: "$5.60", note: "Restaurant Award: for each separate work period of 2 hours or more on a split shift day (cl 21.3)." },
  ],
  median: BAR_ATTENDANTS_MEDIAN,
  notices: [
    "Junior baristas under the Restaurant Award are paid 50% of the adult rate under 17, 60% at 17, 70% at 18 and 85% at 19; at 20 the full adult rate applies (cl 18.2, Table 4).",
  ],
  notShown: [
    "Fast Food Award junior rates, which change from 1 December 2026 — see the fast food award page.",
    "Registered and Licensed Clubs Award rates for café staff in clubs.",
  ],
  faqs: [
    {
      q: "What is the award rate for a barista in 2026?",
      a: "A barista in a café (Food and beverage attendant grade 2 under the Restaurant Award) must be paid at least $27.08 an hour, or $1,029.10 a week, from the first full pay period on or after 1 July 2026. Once they complete a relevant Certificate II they move to grade 3, $27.97 an hour. At a takeaway coffee outlet covered by the Fast Food Award, the Level 1 minimum is $27.81 an hour.",
    },
    {
      q: "What is the casual rate for a barista?",
      a: "A casual café barista at grade 2 earns at least $33.85 an hour on weekdays, the $27.08 rate plus the 25% casual loading. On Saturday a casual gets 150% ($40.62) and on Sunday 150% ($40.62) under the Restaurant Award; a casual Fast Food Level 1 barista gets $34.76 an hour on weekdays.",
    },
    {
      q: "Which award covers baristas?",
      a: "It depends on the business. Cafés and sit-down coffee shops use the Restaurant Industry Award; cafés inside hotels use the Hospitality Award; takeaway coffee kiosks and food-court outlets usually use the Fast Food Award, which excludes cafés providing primarily sit-down service.",
    },
    {
      q: "How much do junior baristas get paid?",
      a: "Under the Restaurant Award, an 18-year-old barista at grade 2 must get at least 70% of $1,029.10 a week, rounded to the nearest 10 cents — $720.40 a week. At 20 the full adult rate applies.",
    },
    {
      q: "What do baristas actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,500 a week for bar attendants and baristas combined (ABS Survey of Employee Earnings and Hours, May 2025). Many baristas work part-time or casual, so weekly pay is often lower.",
    },
  ],
  sources: [
    { title: "Restaurant Industry Award 2020 [MA000119] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(RESTAURANT_AWARD_REF.code) },
    { title: "Hospitality Industry (General) Award 2020 [MA000009] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(HOSPITALITY_AWARD_REF.code) },
    { title: "Fast Food Industry Award 2020 [MA000003] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000003") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(BAR_ATTENDANTS_MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/fast-food-award-rates/", label: "Fast Food Award Pay Rates" },
    { href: "/hospitality-award-rates/", label: "Hospitality Award Pay Rates" },
    { href: "/job-pay-rates/bartender/", label: "Bartender Pay Rates" },
    { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
  ],
};
