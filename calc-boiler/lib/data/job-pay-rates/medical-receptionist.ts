// Medical receptionist — Health Professionals and Support Services Award 2020 [MA000027].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000027.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799308 and PR799465)". Read 23 September 2026.
//   - Weekly and hourly: cl 16.2(a), Support Services employees other than
//     dental assistants and pathology collectors (varied by PR799308 ppc 01Jul26).
//   - Casual: Schedule C.1.7 "Ordinary hours" (125%).
//   - Classification: Schedule A. "Receptionist" is an indicative Level 3
//     role (A.1.3(c)). A.1.5(a)(iv) says a Level 5 administrative/clerical
//     employee "requires a comprehensive knowledge of medical terminology
//     and/or a working knowledge of health insurance schemes".
//   - Penalties: Schedule C.1.1 / C.1.7. Overtime: cl 25.2.
//
// Level 3 is the headline because it is the level the award names for a
// receptionist. The page explains when Level 5 may apply and does not assign
// anyone to it — that depends on the duties actually performed.

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
  anzscoCode: "5421",
  anzscoTitle: "Receptionists",
  medianWeekly: 1_229,
  medianHourly: 32,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("5421-receptionists"),
};

export const MEDICAL_RECEPTIONIST: Occupation = {
  slug: "medical-receptionist",
  name: "Medical Receptionist",
  plural: "medical receptionists",
  award: {
    name: "Health Professionals and Support Services Award 2020",
    code: "MA000027",
    url: awardTextUrl("MA000027"),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "support-services",
    label: "Level 3",
    why: "a medical receptionist",
  },
  coverage: [
    "Receptionists in medical practices, dental practices and other private health businesses are covered by the Health Professionals and Support Services Award 2020 [MA000027], in its Support Services stream. The award names \"Receptionist\" as an indicative Level 3 role.",
    "Level depends on duties, not job title. A general clerk with less than 3 months' experience is Level 1 and a clerk with 3 months to under a year's service is Level 2. A clerk in a ward, casualty or medical records role is Level 4.",
    "Level 5 applies to administrative and clerical employees who need a comprehensive knowledge of medical terminology and/or a working knowledge of health insurance schemes, among other skills (A.1.5). A receptionist whose job genuinely requires that knowledge may be classified higher than Level 3. Check the full Level 5 definition against your duties.",
  ],
  tables: [
    {
      id: "support-services",
      title: "Medical receptionist pay rates 2026–27",
      intro:
        "Clause 16.2(a) of the award, Support Services Levels 1 to 5. Casual rates are from the award's Schedule C.1.7.",
      rows: [
        { label: "Level 1", weekly: 1024.7, hourly: 26.97, casualHourly: 33.71, note: "General clerk, under 3 months' experience" },
        { label: "Level 2", weekly: 1065.2, hourly: 28.03, casualHourly: 35.04, note: "General clerk/typist, 3 months to under 1 year" },
        { label: "Level 3", weekly: 1106.2, hourly: 29.11, casualHourly: 36.39, note: "Receptionist" },
        { label: "Level 4", weekly: 1119.1, hourly: 29.45, casualHourly: 36.81, note: "Clerk (ward, casualty, medical records)" },
        { label: "Level 5", weekly: 1157.2, hourly: 30.45, casualHourly: 38.06, note: "Medical terminology / health insurance knowledge required" },
      ],
    },
  ],
  penalties: [
    { when: "Saturday and Sunday (midnight Friday to midnight Sunday)", permanent: "150%", casual: "175%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
    { when: "Shiftwork (shift starts 6 pm–6 am or finishes 6 pm–8 am)", permanent: "115%", casual: "140%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate, from the award's Schedule C.1.1 and C.1.7. Casual percentages include the 25% casual loading.",
  overtime: [
    "Monday to Saturday: 150% for the first 2 hours, then 200% (cl 25.2).",
    "Sunday: 200%. Public holiday: 250%.",
    "Full-time staff are on overtime once they pass their ordinary hours or 10 hours in a shift. Overtime rates replace, rather than add to, weekend and shift penalties.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Receptionists in public hospitals are generally paid under state public-sector health agreements rather than this award.",
  ],
  notShown: [
    "Junior rates for receptionists under 21.",
    "Levels 6 to 9 of the Support Services stream, which cover senior and specialist roles rather than reception.",
  ],
  faqs: [
    {
      q: "What is the award rate for a medical receptionist in 2026?",
      a: "A medical receptionist is Level 3 under the Health Professionals and Support Services Award, with a minimum of $29.11 an hour or $1,106.20 a week from the first full pay period on or after 1 July 2026. That is $57,522 a year before tax.",
    },
    {
      q: "What is the casual rate for a medical receptionist?",
      a: "A casual Level 3 receptionist earns at least $36.39 an hour for ordinary hours, which includes the 25% casual loading. Weekend hours are 175% and public holidays 275% of the minimum hourly rate for casuals.",
    },
    {
      q: "Is a medical receptionist covered by the Clerks Award?",
      a: "Generally not. The Health Professionals and Support Services Award covers employers in the health industry — businesses delivering health care, medical services and dental services — and their employees in its classifications \"to the exclusion of any other modern award\" (cl 4.1). \"Receptionist\" is one of those classifications, at Level 3.",
    },
    {
      q: "Can a medical receptionist be paid at Level 5?",
      a: "Yes, if the job requires it. Level 5 covers administrative and clerical staff who need a comprehensive knowledge of medical terminology and/or a working knowledge of health insurance schemes. The Level 5 minimum is $30.45 an hour.",
    },
    {
      q: "What do medical receptionists actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,229 a week for receptionists, a group that includes medical, hotel and general receptionists (ABS, May 2025). No separate medical receptionist median is published.",
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
    { href: "/job-pay-rates/dental-assistant/", label: "Dental Assistant Pay Rates" },
    { href: "/clerks-award-rates/", label: "Clerks Award Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  ],
};
