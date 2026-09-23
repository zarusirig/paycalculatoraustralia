// Dental assistant — Health Professionals and Support Services Award 2020 [MA000027].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000027.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799308 and PR799465)". Read 23 September 2026.
//
// ⚠️ DENTAL ASSISTANTS HAVE THEIR OWN TABLE UNTIL 31 DECEMBER 2026.
// PR795400 (ppc 1 April 2026) reclassified dental assistants. Clause 16.2(a)
// sets the Support Services rates for everyone EXCEPT dental assistants at
// Levels 3, 5, 6 and 7, who are paid from clause 16.2(b), headed "Dental
// assistants—until 31 December 2026". Those rates are lower than the ordinary
// Level 5/6/7 rates in 16.2(a). Quoting the 16.2(a) rates for a dental
// assistant would OVERSTATE the minimum until the end of 2026.
//   - Weekly and hourly: cl 16.2(b) (varied by PR799308 ppc 01Jul26).
//   - Casual: Schedule C.1.8 "Casual support service employees—dental
//     assistants—ordinary hours" (125%).
//   - Penalties: Schedule C.1.2 / C.1.8. Overtime: cl 25.2.
//   - Translation of existing employees: Schedule J (J.1, J.3).
//
// What replaces the 16.2(b) table on 1 January 2027 is not stated in the
// consolidated text we read, so the page does not predict it.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4232",
  anzscoTitle: "Dental Assistants",
  medianWeekly: 1_211,
  medianHourly: 33,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4232-dental-assistants"),
};

export const DENTAL_ASSISTANT: Occupation = {
  slug: "dental-assistant",
  name: "Dental Assistant",
  plural: "dental assistants",
  award: {
    name: "Health Professionals and Support Services Award 2020",
    code: "MA000027",
    url: awardTextUrl("MA000027"),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "dental-assistants",
    label: "Level 6 — Certificate III or 4+ years' experience",
    why: "a dental assistant who holds a Certificate III (or has 4+ years' experience)",
  },
  coverage: [
    "Dental assistants in private dental practices are covered by the Health Professionals and Support Services Award 2020 [MA000027], in its Support Services stream. Since 1 April 2026 the award classifies dental assistants by qualification and experience rather than lumping them in with general support staff.",
    "An unqualified dental assistant with less than 12 months' industry experience is Level 3. With 12 months to under 4 years' experience they are Level 5. A Certificate III (or 4+ years' experience, or experience the employer assesses as equivalent to a Certificate III) is Level 6, and a Certificate IV (or equivalent experience) is Level 7 (award Schedule A, A.1.3–A.1.7).",
    "Dental assistants who were already employed on 31 March 2026 were moved to the new levels under Schedule J, and keep the higher of their old rate and the new rate (clause J.3).",
  ],
  tables: [
    {
      id: "dental-assistants",
      title: "Dental assistant minimum pay rates (until 31 December 2026)",
      intro:
        "Clause 16.2(b) of the award, which the Fair Work Commission headed \"Dental assistants—until 31 December 2026\". Casual rates are from the award's Schedule C.1.8.",
      rows: [
        { label: "Level 3 — unqualified, under 12 months' experience", weekly: 1106.2, hourly: 29.11, casualHourly: 36.39 },
        { label: "Level 5 — unqualified, 12 months to under 4 years' experience", weekly: 1107.8, hourly: 29.15, casualHourly: 36.44 },
        { label: "Level 6 — Certificate III or 4+ years' experience", weekly: 1163.9, hourly: 30.63, casualHourly: 38.29 },
        { label: "Level 7 — Certificate IV or equivalent experience", weekly: 1203.5, hourly: 31.67, casualHourly: 39.59 },
      ],
    },
  ],
  penalties: [
    { when: "Saturday and Sunday (midnight Friday to midnight Sunday)", permanent: "150%", casual: "175%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
    { when: "Shiftwork (shift starts 6 pm–6 am or finishes 6 pm–8 am)", permanent: "115%", casual: "140%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate, from the award's Schedule C.1.2 and C.1.8. Casual percentages include the 25% casual loading.",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200% (cl 25.2).",
    "Sunday: 200%. Public holiday: 250%.",
    "Full-time staff are on overtime once they pass their ordinary hours or 10 hours in a shift. Overtime rates replace, rather than add to, weekend and shift penalties.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "The dental assistant table in the award is labelled \"until 31 December 2026\". Check the award again from 1 January 2027 — we will update this page when the replacement rates are published.",
    "Dental assistants employed by state public dental services are generally paid under state public-sector arrangements rather than this award.",
  ],
  notShown: [
    "The rates that replace the dental assistant table from 1 January 2027, which we could not confirm from the consolidated award.",
    "Junior and trainee rates, which the award handles through separate provisions.",
    "Allowances such as laundry, uniform and on-call, which depend on the employer's arrangements.",
  ],
  faqs: [
    {
      q: "What is the award rate for a dental assistant in 2026?",
      a: "A dental assistant with a Certificate III (Level 6) must be paid at least $30.63 an hour, or $1,163.90 for a full-time week, under the Health Professionals and Support Services Award. That is $60,523 a year before tax. An unqualified assistant with under 12 months' experience starts at $29.11 an hour.",
    },
    {
      q: "What is the casual rate for a dental assistant?",
      a: "A casual Level 6 dental assistant earns at least $38.29 an hour for ordinary hours, which includes the 25% casual loading. On a Saturday or Sunday the casual rate is 175% of the minimum hourly rate.",
    },
    {
      q: "Does a Certificate III increase a dental assistant's pay?",
      a: "Yes. Holding a Certificate III or equivalent qualification (or having 4+ years' experience) puts you at Level 6, $30.63 an hour, compared with $29.15 at Level 5. A Certificate IV moves you to Level 7, $31.67 an hour.",
    },
    {
      q: "Why is the dental assistant rate lower than the normal Level 6 rate?",
      a: "The award has a separate dental assistant table that applies until 31 December 2026. Level 6 in that table is $1,163.90 a week, while the general Support Services Level 6 rate is $1,219.50. Use the dental assistant table if that is your job.",
    },
    {
      q: "What do dental assistants actually earn?",
      a: "Jobs and Skills Australia reports a median of $1,211 a week for full-time dental assistants (ABS, May 2025). That is only about $47 a week above the Level 6 award minimum.",
    },
  ],
  sources: [
    { title: "Health Professionals and Support Services Award 2020 [MA000027] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000027") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/medical-receptionist/", label: "Medical Receptionist Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/award-rates/", label: "Award Rates" },
  ],
};
