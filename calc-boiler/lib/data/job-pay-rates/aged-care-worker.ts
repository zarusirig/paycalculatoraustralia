// Aged care worker (personal care worker / assistant in nursing) — Aged Care
// Award 2010 [MA000018] (T5, wave 3).
//
// TODO(after T4 merge): T4 is adding MA000018 to lib/constants/modern-awards.ts.
// Once merged, switch these rows to rowFromModernAward() so this page and the
// award page read one table.
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000018.html,
// "incorporates all amendments up to and including 1 September 2026
// (PR813673)". PR813673 only inserts a temporary vehicle allowance
// (cl 15.7(aa)); wages are the 1 July 2026 figures (PR799299). Read
// 23 September 2026.
//   - Direct care weekly: cl 14.3 (Aged care employee—direct care levels 1–6,
//     the post-work-value structure introduced by PR779150 ppc 01Jan25).
//   - General weekly: cl 14.1. Hourly = weekly / 38 (cl 10.4(b)), matching
//     the FWO pay guide (published 31 August 2026) to the cent.
//   - Casual: cl 10.4(b) hourly + 25%, matching the pay guide casual tables.
//   - Weekends: cl 23.1 (150% / 175%), casuals cl 23.2 (175% / 200%, in
//     substitution for the casual loading, cl 23.3). Public holiday 250% /
//     casual 275% per the pay guide. Shift loadings cl 26.1.
//   - Overtime: cl 25.1.
//   - The consolidated text contains no further scheduled work-value
//     increase for these classifications.
//
// Median: Jobs and Skills Australia, ANZSCO 4231 Aged and Disabled Carers,
// $1,761 a week / $46 an hour (ABS SEEH May 2025), read 23 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  casualFromHourly,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const CODE = "MA000018";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4231",
  anzscoTitle: "Aged and Disabled Carers",
  medianWeekly: 1_761,
  medianHourly: 46,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4231-aged-and-disabled-carers"),
};

function r(label: string, weekly: number, hourly: number, note?: string): RateRow {
  return { label, weekly, hourly, casualHourly: casualFromHourly(hourly), ...(note ? { note } : {}) };
}

export const AGED_CARE_DIRECT_CARE_ROWS: RateRow[] = [
  r("Direct care level 1 — Introductory", 1239.0, 32.61, "Less than 3 months' aged care experience"),
  r("Direct care level 2 — Direct Carer", 1307.8, 34.42, "3 months' or more experience"),
  r("Direct care level 3 — Qualified", 1376.7, 36.23, "Certificate III in Individual Support (Ageing) or equivalent"),
  r("Direct care level 4 — Senior", 1431.8, 37.68, "Certificate III plus 4 years at level 3 since 1 January 2025"),
  r("Direct care level 5 — Specialist", 1486.8, 39.13, "Certificate IV in Ageing Support required by the employer"),
  r("Direct care level 6 — Team Leader", 1541.9, 40.58, "Certificate IV, supervises and trains direct carers"),
];

const GENERAL_ROWS: RateRow[] = [
  r("General level 1", 1055.4, 27.77, "Entry level: cleaner, laundry hand, food services assistant"),
  r("General level 2", 1097.2, 28.87),
  r("General level 3", 1139.4, 29.98, "Includes cook, receptionist, experienced cleaner"),
  r("General level 4", 1152.8, 30.34),
  r("General level 5", 1191.8, 31.36),
  r("General level 6", 1256.0, 33.05),
  r("General level 7", 1278.6, 33.65),
];

export const AGED_CARE_WORKER: Occupation = {
  slug: "aged-care-worker",
  name: "Aged Care Worker",
  plural: "aged care workers",
  award: {
    name: "Aged Care Award 2010",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: "1 September 2026",
  },
  headline: {
    tableId: "direct-care",
    label: "Direct care level 3 — Qualified",
    why: "a personal care worker with a Certificate III in Individual Support (Ageing), the standard qualification for direct care in residential aged care",
  },
  coverage: [
    "Aged care workers employed in residential aged care — nursing homes, hostels, aged care serviced apartments and similar facilities — are covered by the Aged Care Award 2010 [MA000018]. The award defines the aged care industry as accommodation and care services for aged persons in residential facilities.",
    "Personal care workers, assistants in nursing and other staff whose primary role is to provide direct care to residents are classified under the direct care stream (Schedule B.2): level 1 on starting, level 2 after 3 months, level 3 with a Certificate III in Individual Support (Ageing), and levels 4 to 6 for senior, specialist and team leader roles.",
    "Cleaners, laundry hands, kitchen staff, cooks, gardeners, drivers and administrative staff are on the general stream (Schedule B.1), which pays less than direct care.",
    "Home care workers — including those caring for older people in their own homes — are not covered by this award. They are paid under the SCHADS Award home care stream; see the disability support worker page. Registered and enrolled nurses in aged care are paid under the Nurses Award aged care stream.",
    "These rates include the increases from the Fair Work Commission's aged care work value case, which introduced the direct care classifications from 1 January 2025. The award text sets no further scheduled work-value increase.",
  ],
  tables: [
    {
      id: "direct-care",
      title: "Aged care worker pay rates — direct care stream, 2026–27",
      intro:
        "Clause 14.3 of the Aged Care Award, from the first full pay period on or after 1 July 2026. Hourly is the weekly rate divided by 38; casual adds the 25% loading (cl 10.4(b)), matching the Fair Work Ombudsman pay guide.",
      rows: AGED_CARE_DIRECT_CARE_ROWS,
    },
    {
      id: "general",
      title: "Aged care general stream — cleaning, laundry, kitchen and admin",
      intro:
        "Clause 14.1. The single most senior food services employee at a facility is paid a higher rate at levels 4 to 7 (cl 14.2), not shown here.",
      rows: GENERAL_ROWS,
    },
  ],
  penalties: [
    { when: "Afternoon shift starting 10 am to before 1 pm", permanent: "110%", casual: "135%" },
    { when: "Afternoon shift starting 1 pm to before 4 pm", permanent: "112.5%", casual: "137.5%" },
    { when: "Night shift starting 4 pm to before 4 am", permanent: "115%", casual: "140%" },
    { when: "Night shift starting 4 am to before 6 am", permanent: "110%", casual: "135%" },
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "175%", casual: "200%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate. Weekend rates come from cl 23.1 (permanent) and cl 23.2 (casual), and replace both the shift loadings and, for casuals, the 25% loading rather than stacking on them. Shift loadings are cl 26.1; the public holiday figures are the Fair Work Ombudsman pay guide's. Part-time and casual staff get shift loadings only when the shift starts before 6 am or finishes after 6 pm (cl 26.1).",
  overtime: [
    "Full-time: 150% for the first 2 hours Monday to Friday, then 200%; Saturday and Sunday 200%; public holiday 250% (cl 25.1(a)).",
    "Part-time: the same rates for hours over 38 a week (76 a fortnight), and for hours over 10 in a day (cl 25.1(b)).",
    "Overtime rates replace the shift loadings rather than adding to them (cl 25.1(a)(ii)).",
  ],
  allowances: [
    { name: "Meal allowance", amount: "$17.30", note: "Overtime of more than an hour after the usual finishing time, unless a meal is supplied; a further $15.60 if overtime exceeds 4 hours (cl 15.4)." },
    { name: "Uniform allowance", amount: "$1.26 per shift or $6.41 per week", note: "Only where the employer agrees to pay it instead of supplying uniforms, whichever is less (cl 15.2(b))." },
    { name: "Tool allowance (chefs and cooks)", amount: "$13.41 per week", note: "Where the employer does not supply all necessary tools (cl 15.6)." },
    { name: "Vehicle allowance", amount: "$1.05 per km", note: "Temporary rate from 1 September 2026 to 28 February 2027 (cl 15.7(aa)); $1.01 per km otherwise." },
  ],
  median: MEDIAN,
  notices: [
    "Many aged care providers pay under an enterprise agreement rather than the award. An agreement must still pay at least the award rate.",
  ],
  notShown: [
    "Transitional rates in Schedule I for employees classified in direct care on or before 31 December 2024, or who moved from the Nurses Award.",
    "Most senior food services employee rates (cl 14.2), apprentice and trainee rates.",
    "Leading hand allowances, which are a percentage of the standard rate (cl 15.3).",
  ],
  faqs: [
    {
      q: "What is the award rate for an aged care worker in 2026?",
      a: "A personal care worker with a Certificate III (direct care level 3—Qualified) must be paid at least $36.23 an hour, or $1,376.70 a week, under the Aged Care Award from the first full pay period on or after 1 July 2026 — $71,588 a year full-time before tax. A new starter on direct care level 1 gets $32.61 an hour.",
    },
    {
      q: "What is the casual rate for an aged care worker?",
      a: "A casual Certificate III direct carer earns at least $45.29 an hour on weekdays. On a Saturday a casual is paid 175% of the minimum hourly rate ($63.40) and on a Sunday 200% ($72.46), which replace the casual loading rather than adding to it.",
    },
    {
      q: "How much do aged care workers get on weekends?",
      a: "Full-time and part-time aged care workers get 150% on Saturday and 175% on Sunday (cl 23.1). For a direct care level 3 employee that is $54.35 and $63.40 an hour. Public holidays are 250%.",
    },
    {
      q: "Is a home care worker paid under the Aged Care Award?",
      a: "No. The Aged Care Award covers residential aged care. Home care workers, including those supporting older people at home, are covered by the SCHADS Award home care stream, which has its own rates.",
    },
    {
      q: "What do aged care workers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,761 a week for aged and disabled carers (ABS Survey of Employee Earnings and Hours, May 2025). That group includes disability support workers as well as aged care workers.",
    },
  ],
  sources: [
    { title: "Aged Care Award 2010 [MA000018] — consolidated to 1 September 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    { title: "Pay Guide — Aged Care Award [MA000018], published 31 August 2026", publisher: "Fair Work Ombudsman", url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/aged-care-award-ma000018-pay-guide.pdf.aspx" },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/disability-support-worker/", label: "Disability Support Worker Pay Rates" },
    { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
    { href: "/job-pay-rates/nurse/", label: "Nurse Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  ],
};
