// Childcare worker (early childhood educator) — Children's Services Award 2010
// [MA000120] (T5, wave 3).
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000120.html,
// "incorporates all amendments up to and including 1 July 2026 (PR810424,
// PR799280, PR799400, PR799555 and PR811403)". Read 23 September 2026.
//
// ⚠️ THE CLASSIFICATION STRUCTURE WAS REPLACED ON 1 MARCH 2026 (PR794818).
// The old CSE levels 1.1–6.9 are gone; clause 14.1 now has eight levels,
// Level 1—Introductory Educator to Level 8—Director, and Schedule I translates
// old levels to new ones. Anything quoting "Level 3.1" rates is out of date.
//   - Weekly and hourly: cl 14.1(b) (CSE) and cl 14.2 (Support Worker), varied
//     by PR799400 ppc 01Jul26.
//   - Casual: cl 10.5(a) — hourly + 25%. The dollars below match the FWO pay
//     guide (published 24 June 2026) casual tables to the cent.
//   - Penalties: cl 23.4 (shift loadings), cl 23.5 (weekend/public holiday).
//     The award and the FWO pay guide publish no casual Saturday, Sunday or
//     public holiday rate, so we do not publish one.
//   - Allowances: cl 15, dollar figures from the FWO pay guide allowance table.
//
// Worker Retention Payment: the WRP minimum hourly rates quoted in prose were
// read from the Department of Education's "Minimum rates you must pay workers"
// page (rates apply from 1 July 2026) on 23 September 2026. They are grant
// conditions, not award minimums, and apply only where the provider opts in.
//
// Median: Jobs and Skills Australia, ANZSCO 4211 Child Carers, $1,341 a week /
// $35 an hour (ABS SEEH May 2025), read 23 September 2026.

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
import type { MedianEarnings, Occupation, RateRow } from "./types";

const CODE = "MA000120";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4211",
  anzscoTitle: "Child Carers",
  medianWeekly: 1_341,
  medianHourly: 35,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4211-child-carers"),
};

function r(label: string, weekly: number, hourly: number, note?: string): RateRow {
  return { label, weekly, hourly, casualHourly: casualFromHourly(hourly), ...(note ? { note } : {}) };
}

/** cl 14.1(b), from the first full pay period on or after 1 July 2026. */
export const CHILDCARE_CSE_ROWS: RateRow[] = [
  r("Level 1 — Introductory Educator", 1094.8, 28.81, "Under 12 months' experience, working towards a qualification"),
  r("Level 2 — Educator", 1128.4, 29.69, "12 months' or more experience, no Certificate III yet"),
  r("Level 3 — Qualified Educator", 1233.9, 32.47, "Certificate III in Early Childhood Education and Care"),
  r("Level 4 — Experienced Educator", 1316.7, 34.65, "Certificate III plus 4 years at Level 3"),
  r("Level 5 — Advanced Educator", 1389.5, 36.57, "Diploma of Early Childhood Education and Care"),
  r("Level 6 — Room Leader", 1453.5, 38.25),
  r("Level 7 — Assistant Director", 1519.9, 40.0),
  r("Level 8 — Director", 1752.7, 46.12),
];

/** cl 14.2 — cooks (other than qualified cooks on the floor), cleaners, laundry, admin. */
const SUPPORT_ROWS: RateRow[] = [
  r("Support Worker Level 1.1 — on commencement", 1004.9, 26.44),
  r("Support Worker Level 2.1 — on commencement", 1023.4, 26.93),
  r("Support Worker Level 2.2 — after 1 year", 1057.0, 27.82),
  r("Support Worker Level 3.1 — on commencement", 1119.1, 29.45),
];

export const CHILDCARE_WORKER: Occupation = {
  slug: "childcare-worker",
  name: "Childcare Worker",
  plural: "childcare workers",
  award: {
    name: "Children's Services Award 2010",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "educators",
    label: "Level 3 — Qualified Educator",
    why: "an educator with the Certificate III that most long day care rooms require, which is where a qualified childcare worker starts",
  },
  coverage: [
    "Childcare workers in long day care, family day care, out-of-school hours care, occasional care and kindergartens run by national-system employers are covered by the Children's Services Award 2010 [MA000120]. University-qualified early childhood teachers are covered by a different award — see the early childhood teacher page.",
    "The award's classifications were rebuilt from 1 March 2026 (PR794818). Educators are now classified on eight levels by qualification and role: Level 1—Introductory Educator (under 12 months' experience), Level 2—Educator, Level 3—Qualified Educator (Certificate III), Level 4—Experienced Educator (Certificate III plus four years at Level 3), Level 5—Advanced Educator (Diploma), then Room Leader, Assistant Director and Director (Schedule B.1).",
    "Cooks, cleaners, laundry, gardening, driving and administrative staff are Support Workers under clause 14.2. A cook who must hold or be working towards an early childhood qualification and may be counted in educator-to-child ratios is paid as an educator at the level matching that qualification (cl 14.1(c)).",
    "Most centres pay more than this award. Providers that take the Australian Government's Worker Retention Payment must pay eligible staff at least the grant's minimum hourly rates — from 1 July 2026, $33.87 an hour for a Level 3 Qualified Educator and $38.14 for a Level 5 Advanced Educator. Those are grant conditions set by the Department of Education, not award minimums, and the program has been extended to 30 June 2028.",
  ],
  tables: [
    {
      id: "educators",
      title: "Childcare worker pay rates by level, 2026–27",
      intro:
        "Clause 14.1(b) of the Children's Services Award, from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% casual loading (cl 10.5(a)), matching the Fair Work Ombudsman pay guide.",
      rows: CHILDCARE_CSE_ROWS,
    },
    {
      id: "support-workers",
      title: "Childcare support worker pay rates (cooks, cleaners, admin)",
      intro: "Clause 14.2. Support Worker Level 3 holds an AQF Certificate III or equivalent skills (Schedule B.2.3).",
      rows: SUPPORT_ROWS,
    },
  ],
  penalties: [
    { when: "Early morning shift (starts 5.00–6.00 am)", permanent: "110%", casual: "135%" },
    { when: "Afternoon shift (finishes after 6.30 pm, by midnight)", permanent: "115%", casual: "140%" },
    { when: "Night shift, rotating", permanent: "117.5%", casual: "142.5%" },
    { when: "Night shift, non-rotating", permanent: "130%", casual: "155%" },
    { when: "Saturday — shiftworker ordinary hours", permanent: "150%", casual: "Not published" },
    { when: "Sunday — all time worked", permanent: "200%", casual: "Not published" },
    { when: "Public holiday — all time worked", permanent: "250%", casual: "Not published" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (cl 23.4 and 23.5). Ordinary hours are Monday to Friday between 6.00 am and 6.30 pm (cl 21.2–21.3), so Saturday work by a day worker is overtime (150% for 2 hours, then 200%). Weekend and public holiday work carries a 4-hour minimum payment (cl 23.5(e)). Casual shift figures are the pay guide's casual dollar rates; neither the award nor the pay guide sets a casual Saturday, Sunday or public holiday rate, so we show none.",
  overtime: [
    "Full-time and part-time: 150% for the first 2 hours, then 200%; each day stands alone (cl 23.2(a)).",
    "Casual: 175% for the first 2 hours, then 225% — the casual loading is included (cl 23.2(b)). Casuals get overtime after 8 hours in a day or 38 in a week (cl 10.5(e)).",
    "Up to one hour a week of genuine emergency overtime — such as a child needing urgent medical attention — is paid at the ordinary rate (cl 23.2(c)). A parent collecting a child late is not an emergency (cl 21.7(b)(iii)).",
  ],
  allowances: [
    { name: "Educational leader allowance", amount: "$4,784.28 per year", note: "If you are the service's educational leader under Regulation 118 of the National Regulations, pro rata for fewer than 5 days a week (cl 15.7)." },
    { name: "First aid allowance", amount: "$12.65 per day", note: "Level 1 and 2 employees required to administer first aid who hold a current first aid qualification; $1.68 an hour in out-of-school hours care (cl 15.4)." },
    { name: "Broken shift allowance", amount: "$21.38 per day", note: "For each day you work two separate shifts (cl 15.1)." },
    { name: "Laundry allowance", amount: "$9.74 per week", note: "If you must launder a required uniform; $1.95 a day for part-time and casual staff, or $6.14 a week where no ironing is needed (cl 15.2(b))." },
    { name: "Meal allowance", amount: "$16.12", note: "Overtime of more than 2 hours without notice the previous day (cl 15.5)." },
  ],
  median: MEDIAN,
  notices: [
    "If you were classified at the old Level 4A before 1 March 2026 and translated to Level 6—Room Leader, your minimum is set by the transitional rules in Schedule I rather than the table above; the Fair Work Ombudsman says to use its Pay and Conditions Tool for those rates.",
    "Junior educators at Level 1 or 2 may be paid 70% (under 17), 80% (under 18) or 90% (under 19) of the Level 2 rate (cl 14.3(b)). Qualified educators at Levels 3 to 5 must be paid the adult rate at any age (cl 14.3(a)).",
  ],
  notShown: [
    "Apprentice and trainee rates (cl 14.4–14.5 and the National Training Wage).",
    "Schedule I translation rates for employees who held a pre-March 2026 classification.",
    "Every Worker Retention Payment rate — only the Level 3 and Level 5 figures are quoted; the Department of Education publishes the full table.",
  ],
  faqs: [
    {
      q: "What is the award rate for a childcare worker in 2026?",
      a: "A qualified childcare worker with a Certificate III (Level 3—Qualified Educator) must be paid at least $32.47 an hour, or $1,233.90 a week, under the Children's Services Award from the first full pay period on or after 1 July 2026 — $64,163 a year full-time before tax. An unqualified Level 1 Introductory Educator gets $28.81 an hour, and a Diploma-qualified Level 5 Advanced Educator $36.57.",
    },
    {
      q: "What is the casual rate for a childcare worker?",
      a: "A casual Certificate III educator earns at least $40.59 an hour, the $32.47 rate plus the 25% casual loading. A casual Level 1 Introductory Educator earns $36.01 and a casual Diploma-qualified educator $45.71.",
    },
    {
      q: "What changed in the Children's Services Award in 2026?",
      a: "From 1 March 2026 the old classification levels (such as Level 3.1 to 3.4) were replaced by eight new levels, Level 1—Introductory Educator to Level 8—Director. Diploma-qualified educators became Level 5—Advanced Educator, and Certificate III educators with four years at Level 3 became Level 4—Experienced Educator. The 1 July 2026 Annual Wage Review increase then applied to the new rates.",
    },
    {
      q: "Do childcare workers get paid more than the award?",
      a: "Often, yes. Centres that take the Worker Retention Payment must pay eligible educators at least the grant's minimum rates — $33.87 an hour for a Level 3 Qualified Educator from 1 July 2026, against the award's $32.47. Jobs and Skills Australia reports a median of $1,341 a week for full-time child carers (ABS, May 2025).",
    },
    {
      q: "How much does a diploma-qualified educator earn?",
      a: "Under the award, a Level 5—Advanced Educator with a Diploma of Early Childhood Education and Care earns at least $36.57 an hour, $1,389.50 a week, or $72,254 a year full-time. A Room Leader (Level 6) earns at least $38.25 an hour.",
    },
  ],
  sources: [
    { title: "Children's Services Award 2010 [MA000120] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    { title: "Pay Guide — Children's Services Award [MA000120], published 24 June 2026", publisher: "Fair Work Ombudsman", url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/childrens-services-award-ma000120-pay-guide.pdf.aspx" },
    { title: "Worker retention payment — minimum rates you must pay workers", publisher: "Department of Education", url: "https://www.education.gov.au/early-childhood/providers/workforce/worker-retention-payment/minimum-rates" },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/early-childhood-teacher/", label: "Early Childhood Teacher Pay Rates" },
    { href: "/job-pay-rates/teacher-aide/", label: "Teacher Aide Pay Rates" },
    { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
    { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  ],
};
