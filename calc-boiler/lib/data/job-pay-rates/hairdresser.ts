// Hairdresser — Hair and Beauty Industry Award 2020 [MA000005] (T5, wave 3).
//
// TODO(after T4 merge): T4 is adding MA000005 to lib/constants/modern-awards.ts.
// Once merged, switch these rows to rowFromModernAward().
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000005.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799286 and PR799444)". Read 23 September 2026.
//   - Weekly and hourly: cl 17.1, Table 4.
//   - Classifications: Schedule A.1–A.6. A hairdresser with a Certificate III
//     in Hairdressing is level 3; with a Certificate IV, level 5.
//   - Graduates: cl 18.6, Table 12 — a full-time hairdressing graduate is paid
//     92.5% of the standard rate ($1,035.17 / $27.24) for the first 12 months.
//     The award sets no casual graduate rate, so casual is null.
//   - Casual: cl 11.2 — +25% only for ordinary hours 7 am–9 pm Mon–Fri;
//     other times use cl 23.2, Table 15.
//   - Penalties: cl 23.1 Table 14 (full-time/part-time), cl 23.2 Table 15
//     (casual). Overtime: cl 22.5.
//   - Juniors: cl 17.2, Table 5 — 50% under 17, 75% at 17, 100% from 18.
//
// Median: Jobs and Skills Australia, ANZSCO 3911 Hairdressers, $1,209 a week /
// $32 an hour (ABS SEEH May 2025), read 23 September 2026.

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

const CODE = "MA000005";

const MEDIAN: MedianEarnings = {
  anzscoCode: "3911",
  anzscoTitle: "Hairdressers",
  medianWeekly: 1_209,
  medianHourly: 32,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3911-hairdressers"),
};

function r(label: string, weekly: number, hourly: number, note?: string): RateRow {
  return { label, weekly, hourly, casualHourly: casualFromHourly(hourly), ...(note ? { note } : {}) };
}

export const HAIR_BEAUTY_ROWS: RateRow[] = [
  r("Level 1", 1056.8, 27.81, "Receptionist or salon assistant"),
  r("Level 2", 1081.0, 28.45, "Make-up artist or nail technician (Cert II), unqualified beautician"),
  r("Level 3", 1119.1, 29.45, "Hairdresser with Certificate III in Hairdressing; beautician (Cert III)"),
  r("Level 4", 1139.9, 30.0, "Beauty therapist with Certificate IV"),
  r("Level 5", 1174.0, 30.89, "Hairdresser with Certificate IV; trichologist"),
  r("Level 6", 1215.9, 32.0, "Beauty therapist with a Diploma"),
];

export const HAIRDRESSER: Occupation = {
  slug: "hairdresser",
  name: "Hairdresser",
  plural: "hairdressers",
  award: {
    name: "Hair and Beauty Industry Award 2020",
    code: CODE,
    url: awardTextUrl(CODE),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "hair-beauty",
    label: "Level 3",
    why: "a qualified hairdresser holding a Certificate III in Hairdressing, which the award places at level 3",
  },
  coverage: [
    "Hairdressers, barbers, beauty therapists, nail technicians and salon staff working in hair and beauty salons are covered by the Hair and Beauty Industry Award 2020 [MA000005].",
    "A hairdresser who holds a Certificate III in Hairdressing (or equivalent) is Hair and beauty employee level 3. A hairdresser with a Certificate IV is level 5. Salon assistants and receptionists are level 1 (Schedule A).",
    "The award also sets a rate for a full-time hairdressing graduate in their first 12 months: 92.5% of the standard rate — $27.24 an hour, $1,035.17 a week (cl 18.6, Table 12). After those 12 months the full level 3 rate applies.",
    "Juniors are paid 50% of the adult rate under 17 and 75% at 17; from 18 the full adult rate applies (cl 17.2).",
  ],
  tables: [
    {
      id: "hair-beauty",
      title: "Hairdresser and salon pay rates by level, 2026–27",
      intro:
        "Hair and Beauty Industry Award cl 17.1, Table 4, from the first full pay period on or after 1 July 2026. The casual column is the rate for ordinary hours between 7 am and 9 pm Monday to Friday (cl 11.2).",
      rows: HAIR_BEAUTY_ROWS,
    },
    {
      id: "graduate",
      title: "Hairdressing graduate rate — first 12 months",
      intro: "Clause 18.6, Table 12: 92.5% of the standard rate for a full-time graduate. The award sets this rate for full-time graduates only, so no casual figure is shown.",
      rows: [{ label: "Hairdressing graduate — first 12 months", weekly: 1035.17, hourly: 27.24, casualHourly: null }],
    },
  ],
  penalties: [
    { when: "Monday–Friday, 7 am to 9 pm", permanent: "100%", casual: "125%" },
    { when: "Monday–Friday, before 7 am or after 9 pm", permanent: "Overtime (outside span)", casual: "150%" },
    { when: "Saturday, 7 am to 6 pm", permanent: "133%", casual: "158%" },
    { when: "Saturday, before 7 am or after 6 pm", permanent: "Overtime (outside span)", casual: "150%" },
    { when: "Sunday", permanent: "200% (10 am to 5 pm)", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "250%" },
  ],
  penaltiesNote:
    "Full-time and part-time rates are cl 23.1, Table 14; casual rates are cl 23.2, Table 15, and are percentages of the minimum hourly rate. The casual Saturday (7 am–6 pm) and Sunday rates include the casual loading; the casual public holiday rate is 250%, the same as for permanent staff. A rostered day off worked by agreement is paid at 200%.",
  overtime: [
    "Full-time and part-time: 150% for the first 3 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250% (cl 22.5).",
    "Casual: 175% for the first 3 hours Monday to Saturday, then 225%; Sunday 225%; public holiday 250%.",
  ],
  allowances: [
    { name: "Tool allowance", amount: "$10.52 per week", note: "If the employer requires you to provide and use your own tools, including scissors (cl 20.8(a))." },
    { name: "Manager's allowance", amount: "$55.96 per week", note: "For a week in charge of a hair or beauty establishment (cl 20.2)." },
    { name: "First aid allowance", amount: "$14.55 per week", note: "If you hold a current first aid qualification and are appointed to perform first aid duty (cl 20.3)." },
    { name: "Meal allowance", amount: "$24.72", note: "Full-time and part-time staff working overtime in the circumstances in cl 20.5(a); a further $24.72 if the overtime exceeds 4 hours." },
    { name: "Motor vehicle allowance", amount: "$1.00 per km", note: "If asked to use your own vehicle for work (cl 20.6)." },
  ],
  median: MEDIAN,
  notices: [
    "Barbers are covered too: the award's industry definition includes shaving and beard trimming (cl 4.2(b)).",
  ],
  notShown: [
    "Hairdressing apprentice rates (cl 18.1, Tables 6 and 7) and trainee rates.",
    "Beauty therapy graduate and apprentice rates.",
  ],
  faqs: [
    {
      q: "What is the award rate for a hairdresser in 2026?",
      a: "A qualified hairdresser with a Certificate III (Hair and beauty employee level 3) must be paid at least $29.45 an hour, or $1,119.10 a week, under the Hair and Beauty Industry Award from the first full pay period on or after 1 July 2026 — $58,193 a year full-time before tax. A hairdresser with a Certificate IV (level 5) gets $30.89 an hour.",
    },
    {
      q: "What is the casual rate for a hairdresser?",
      a: "A casual qualified hairdresser earns at least $36.81 an hour between 7 am and 9 pm Monday to Friday, the $29.45 rate plus the 25% casual loading. On Saturday between 7 am and 6 pm a casual gets 158% ($46.53), and on Sunday 225% ($66.26).",
    },
    {
      q: "How much do hairdressers get paid on a Saturday?",
      a: "Full-time and part-time hairdressers get 133% of the minimum hourly rate for Saturday ordinary hours between 7 am and 6 pm — $39.17 an hour at level 3. Casuals get 158%, $46.53 an hour.",
    },
    {
      q: "What is a hairdressing graduate paid?",
      a: "A full-time hairdressing graduate can be paid 92.5% of the standard rate for their first 12 months — $27.24 an hour or $1,035.17 a week from 1 July 2026 (cl 18.6). After that, the level 3 rate of $29.45 applies.",
    },
    {
      q: "What do hairdressers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,209 a week for hairdressers (ABS Survey of Employee Earnings and Hours, May 2025), about $62,868 a year.",
    },
  ],
  sources: [
    { title: "Hair and Beauty Industry Award 2020 [MA000005] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl(CODE) },
    { title: "Pay Guide — Hair and Beauty Industry Award [MA000005], published 24 June 2026", publisher: "Fair Work Ombudsman", url: "https://calculate.fairwork.gov.au/ArticleDocuments/872/hair-and-beauty-industry-award-ma000005-pay-guide.pdf.aspx" },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/retail-worker/", label: "Retail Worker Pay Rates" },
    { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
    { href: "/commission-tax-calculator/", label: "Commission Tax Calculator" },
    { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  ],
};
