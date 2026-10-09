// Landscaper — Gardening and Landscaping Services Award 2020 [MA000101]
// (J8, 9 Oct 2026). Search demand: "landscaper salary" 390 a month (AU).
//
// Source: awards.fairwork.gov.au/MA000101.html, "incorporates all amendments up
// to and including 1 July 2026 (PR799280 …)", read 9 October 2026, and the
// Fair Work Ombudsman pay guide for MA000101 (published 28 August 2026, rates
// from the first full pay period starting on or after 1 July 2026), read the
// same day. The two agree to the cent.
//   - cl 15.1 (varied by PR799381 ppc 01Jul26): Introductory $978.10 / $25.74;
//     Level 1 $1,004.90 / $26.44; Level 2 $1,029.10 / $27.08; Level 3 $1,074.70
//     / $28.28; Level 4 $1,119.10 / $29.45; Level 5 $1,154.30 / $30.38.
//   - Schedule B.3.1 casual (125%): $33.05, $33.85, $35.35, $36.81, $37.98.
//   - Schedule A.5.1 Level 4: completed an apprenticeship in horticulture with a
//     recognised trade qualification; or "a Parks and Gardens Certificate III, a
//     Landscaping Certificate III, a Greenkeeping Certificate III or
//     equivalent"; or not less than 3 years' practical horticulture experience.
//     A.6 Level 5: trades qualified plus post-trade Certificate IV or Diploma;
//     "may be in charge of gardens". A.4 Level 3: completed a course in
//     horticulture.
//   - cl 4.2 industry definition; cl 4.3 excludes employers covered by, among
//     others, the Building and Construction General On-site Award and the
//     Local Government Industry Award.
//   - cl 13.2: ordinary hours Monday to Friday 6.00 am–6.00 pm and Saturday
//     6.00 am–12.00 noon. cl 13.5: ordinary hours moved outside that span by
//     water restrictions paid at 150%.
//   - cl 19.1–19.2: overtime (over 38 a week, outside the span, or over 10 a
//     day) 150% for 2 hours then 200%; casual 175% / 225%. cl 19.4(c) 200%
//     without a 10-hour break; cl 19.6 call-back minimum 4 hours.
//   - cl 25.2: public holiday 250% with a 4-hour minimum; casual 275%
//     (Schedule B.3.1). cl 14.1(b): working through a meal break 150%.
//   - cl 17: leading hand $22.38–$78.34/wk and tool allowance $15.83/wk are all
//     purposes (17.2); vehicle/plant $6.71/day; first aid $22.38/wk; meal
//     $19.61; own vehicle $1.00/km. The pay guide shows the tool allowance as
//     $0.42 an hour for "Level 4 & 5 tradespersons only".
//   - cl 15.2 junior rates: 70% under 18, 80% at 18, 90% at 19, 100% at 20.
//   - cl 11.1: casual minimum engagement 3 hours.
//
// Median: Jobs and Skills Australia's ANZSCO 3622 Gardeners profile (which
// includes landscape gardeners) prints N/A for median earnings, read 9 October
// 2026, so no median is published.

import { ANNUAL_WAGE_REVIEW_2026, CONSOLIDATED_TO, FWO_PAY_GUIDES, awardTextUrl } from "./common";
import { annual52, money0, money2 } from "./j8-common";
import type { Occupation, RateRow } from "./types";

const CODE = "MA000101";

/** cl 15.1 weekly and hourly; casual from Schedule B.3.1, transcribed. */
function gl(label: string, weekly: number, hourly: number, casualHourly: number, note: string): RateRow {
  return { label, weekly, hourly, casualHourly, note };
}

export const LS_L1 = gl("Level 1", 1004.9, 26.44, 33.05, "General gardening and landscaping under direct supervision");
export const LS_L2 = gl("Level 2", 1029.1, 27.08, 33.85, "Works to standard procedures; maintains garden tools and equipment");
export const LS_L3 = gl("Level 3", 1074.7, 28.28, 35.35, "Completed a horticulture course; plant, lawn, tree and shrub work");
export const LS_L4 = gl("Level 4", 1119.1, 29.45, 36.81, "Certificate III in Landscaping, Parks and Gardens or Greenkeeping, a horticulture trade, or 3 years' experience");
export const LS_L5 = gl("Level 5", 1154.3, 30.38, 37.98, "Trade plus Certificate IV or Diploma; may be in charge of gardens");

/** Schedule B.2.2 overtime at Level 4, as the award and pay guide print them. */
const L4_OT_FIRST_2 = 44.18;
const L4_OT_AFTER_2 = 58.9;

export const LANDSCAPER: Occupation = {
  slug: "landscaper",
  name: "Landscaper",
  plural: "landscapers",
  metaTitle: `Landscaper Salary Australia 2026 — ${money2(LS_L4.hourly)}/hr Award Minimum`,
  award: {
    name: "Gardening and Landscaping Services Award 2020",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "landscaper",
    label: LS_L4.label,
    why: "a qualified landscaper with a Certificate III in Landscaping or a horticulture trade, whom the award grades at Level 4",
  },
  coverage: [
    "Landscapers and gardeners employed by gardening and landscaping businesses are covered by the Gardening and Landscaping Services Award 2020 [MA000101]. The award covers designing, preparing and installing pavements, landscape features, lawns and gardens; maintenance after practical completion; gardens at private houses; landscape rehabilitation; and sports field turf work (cl 4.2).",
    "A Level 4 employee has completed a horticulture apprenticeship with a trade qualification, holds a Landscaping, Parks and Gardens or Greenkeeping Certificate III (or equivalent), or has at least 3 years' practical horticulture experience with the skills for the level (Schedule A.5.1). That is where a qualified landscaper sits. Level 5 is a trade-qualified employee with post-trade training at Certificate IV or Diploma level, who may be in charge of gardens or specialised horticultural construction work (A.6).",
    "Level 3 needs a completed horticulture course and demonstrated competence in plant and lawn maintenance, tree and shrub identification and the use of mowers, edgers and rotary hoes (A.4). Levels 1 and 2 are general gardening and landscaping work under direct supervision.",
    "The award does not apply where the employer is covered by one of the awards listed in clause 4.3, which include the Building and Construction General On-site Award and the Local Government Industry Award. A landscaper employed by a builder or a council is paid under that award or the council's enterprise agreement instead.",
  ],
  tables: [
    {
      id: "landscaper",
      title: "Landscaper pay rates by level, 2026–27",
      intro:
        "Gardening and Landscaping Services Award cl 15.1, from the first full pay period on or after 1 July 2026. Casual rates are the award's Schedule B.3.1 column: the hourly rate plus the 25% casual loading (cl 11.2). A tradesperson who supplies their own tools also gets the all-purpose tool allowance, which is not included here.",
      rows: [LS_L1, LS_L2, LS_L3, LS_L4, LS_L5],
    },
  ],
  penalties: [
    { when: "Monday–Friday 6 am–6 pm, and Saturday 6 am–12 noon (ordinary hours)", permanent: "100%", casual: "125%" },
    { when: "Outside those hours, incl. Saturday afternoon and Sunday — first 2 hours", permanent: "150%", casual: "175%" },
    { when: "Outside those hours — after 2 hours", permanent: "200%", casual: "225%" },
    { when: "Public holiday (minimum 4 hours)", permanent: "250%", casual: "275%" },
    { when: "Ordinary hours moved outside the span by water restrictions", permanent: "150%", casual: "175%" },
    { when: "Working through a meal break", permanent: "150%", casual: "175%" },
  ],
  penaltiesNote:
    "Percentages of the ordinary hourly rate (cl 13.2, 13.5, 14.1, 19 and 25.2; Schedule B.2–B.3). This award has no separate weekend penalty: Saturday between 6 am and noon is ordinary time, and work outside the span of ordinary hours — Saturday afternoon, Sunday, or before 6 am or after 6 pm on a weekday — is overtime. An all-purpose allowance such as the tool or leading hand allowance is added to the hourly rate before these percentages apply (Schedule B.1.1).",
  overtime: [
    "Full-time and part-time: 150% for the first 2 hours, then 200%, for time over 38 ordinary hours a week, over 10 hours a day, or outside the span of ordinary hours (cl 19.1).",
    "Casual: 175% for the first 2 hours, then 225% — the casual loading is included (cl 19.2).",
    "Recalled to work after leaving: at least 4 hours' pay at the appropriate rate (cl 19.6). Required to start again without a 10-hour break after overtime: 200% until released (cl 19.4(c)).",
  ],
  allowances: [
    { name: "Tool allowance", amount: "$15.83 per week", note: "Level 4 and 5 tradespersons unless the employer supplies all the tools; paid for all purposes, which the pay guide shows as $0.42 an hour (cl 17.2, 17.4(a))." },
    { name: "Leading hand allowance", amount: "$22.38 to $78.34 per week", note: "In charge of 1–2 employees $22.38, 3–6 $44.76, 7–9 $55.96, 10 or more $78.34; paid for all purposes (cl 17.3(a))." },
    { name: "Vehicle and plant allowance", amount: "$6.71 per day", note: "Driving a work vehicle that needs a truck or tractor licence, or operating plant, but not just assisting a fitter (cl 17.3(b))." },
    { name: "First aid allowance", amount: "$22.38 per week", note: "Holding a first aid qualification and appointed to first aid duties (cl 17.3(c))." },
    { name: "Meal allowance", amount: "$19.61 per occasion", note: "Overtime of 1.5 hours or more straight after ordinary hours on a weekday, or after 8 hours' work on a weekend or public holiday (cl 17.4(c))." },
    { name: "Vehicle allowance", amount: "$1.00 per km", note: "Directed to use your own vehicle; travel time is paid at ordinary rates (cl 17.4(b))." },
  ],
  median: null,
  notices: [
    "Saturday mornings are ordinary hours under this award: there is no penalty between 6 am and noon on a Saturday. Saturday afternoons and Sundays are paid as overtime.",
    "New employees can be paid the Introductory level — $978.10 a week, $25.74 an hour — for no more than 3 months of training (cl 15.1, Schedule A.1). Juniors get 70% of the adult rate under 18, 80% at 18 and 90% at 19 (cl 15.2).",
  ],
  notShown: [
    "Apprentice and adult apprentice rates (cl 15.3–15.4) and junior rates in dollars.",
    "A median salary: Jobs and Skills Australia prints no median earnings for gardeners (ANZSCO 3622), the group that includes landscape gardeners.",
    "Rates for landscapers employed by builders (Building and Construction General On-site Award) or councils (Local Government Industry Award or the council's agreement).",
  ],
  faqs: [
    {
      q: "What is the award rate for a landscaper in 2026?",
      a: `A qualified landscaper — Certificate III in Landscaping, a horticulture trade, or 3 years' practical experience — is Level 4 under the Gardening and Landscaping Services Award: at least ${money2(LS_L4.hourly)} an hour or ${money2(LS_L4.weekly)} a week from the first full pay period on or after 1 July 2026, about ${money0(annual52(LS_L4.weekly))} a year full-time before tax. Level 5, with post-trade training, is ${money2(LS_L5.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a landscaper?",
      a: `A casual Level 4 landscaper earns at least ${money2(LS_L4.casualHourly ?? 0)} an hour, the ${money2(LS_L4.hourly)} rate plus the 25% casual loading, and must be paid for at least 3 hours each time they start (cl 11.1).`,
    },
    {
      q: "Do landscapers get weekend penalty rates?",
      a: `Not on Saturday mornings, which are ordinary hours from 6 am to noon. Saturday afternoon and Sunday work is overtime: a full-time Level 4 landscaper gets 150% for the first 2 hours (${money2(L4_OT_FIRST_2)} an hour) and 200% after that (${money2(L4_OT_AFTER_2)}). A public holiday is 250%, with a 4-hour minimum.`,
    },
    {
      q: "Do landscapers get a tool allowance?",
      a: "Yes, if you are a Level 4 or 5 tradesperson and your employer does not supply all your tools: $15.83 a week, paid for all purposes, which the Fair Work pay guide shows as an extra $0.42 an hour. It is added before overtime and penalties are worked out.",
    },
    {
      q: "What is the average salary for a landscaper?",
      a: "Jobs and Skills Australia does not publish a median earnings figure for gardeners (ANZSCO 3622), the group that includes landscape gardeners, so we do not quote one. The award minimum for a qualified landscaper is the reliable floor; check your payslip against it.",
    },
  ],
  sources: [
    { title: "Gardening and Landscaping Services Award 2020 [MA000101] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    {
      title: "Pay Guide — Gardening and Landscaping Services Award [MA000101], published 28 August 2026",
      publisher: "Fair Work Ombudsman",
      url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/gardening-and-landscaping-services-award-ma000101-pay-guide.pdf.aspx",
    },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/horticulture-award-rates/", label: "Horticulture Award Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/job-pay-rates/carpenter/", label: "Carpenter Pay Rates" },
  ],
};
