// Doctor — Medical Practitioners Award 2020 [MA000031].
//
// Source: awards.fairwork.gov.au/MA000031.html, "incorporates all amendments
// up to and including 1 July 2026 (PR799312)". Read 23 September 2026.
// Clause 16.1 prints annual, weekly and hourly minimums for every
// classification; all three are transcribed verbatim below. The award has no
// casual summary schedule, so casual = hourly + 25% (cl 11.1(a)), computed in
// integer cents.
//
// ⚠️ SCOPE: the award covers doctors employed in hospitals, day procedure
// centres, community health and similar settings by NATIONAL-SYSTEM employers
// (cl 4.2) — private hospitals, Aboriginal health services, the Red Cross
// Blood Service. Doctors in state public hospitals (the majority of junior
// doctors) are paid under state awards and enterprise agreements that pay far
// more; the page says so and links our healthcare and public sector pages
// rather than re-deriving state medical officer scales. GPs who are
// contractors or practice owners have no award minimum.
//
// Median: Jobs and Skills Australia, ANZSCO 2531 General Practitioners and
// Resident Medical Officers, $2,446 a week / $60 an hour (ABS SEEH May 2025),
// read 23 September 2026.

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

const MEDIAN: MedianEarnings = {
  anzscoCode: "2531",
  anzscoTitle: "General Practitioners and Resident Medical Officers",
  medianWeekly: 2_446,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2531-general-practitioners-and-resident-medical-officers"),
};

function dr(label: string, annual: number, weekly: number, hourly: number, note?: string): RateRow {
  return { label, annual, weekly, hourly, casualHourly: casualFromHourly(hourly), ...(note ? { note } : {}) };
}

export const DOCTOR: Occupation = {
  slug: "doctor",
  name: "Doctor",
  plural: "doctors",
  award: {
    name: "Medical Practitioners Award 2020",
    code: "MA000031",
    url: awardTextUrl("MA000031"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "doctors-in-training",
    label: "Intern",
    why: "a first-year doctor (intern) employed by a private hospital or other national-system employer",
  },
  coverage: [
    "The Medical Practitioners Award 2020 [MA000031] covers doctors employed in hospitals, hospices, day procedure centres, Aboriginal health services, community health centres and similar settings (cl 4.2), where the employer is in the national workplace relations system — for example private hospitals.",
    "Most junior doctors work in state public hospitals, and they are not paid under this award: each state has its own medical officers' award or enterprise agreement, which pays well above these minimums. See our healthcare worker pay and public service pay scale pages for the state picture.",
    "The award's classifications follow a doctor's career: intern (first postgraduate year), resident medical practitioner, registrar (in an accredited specialist training program), senior registrar, career and senior career medical practitioner, community medical practitioner and specialist levels (cl 12).",
    "Self-employed GPs and doctors engaged as contractors — including GPs who contract to a practice rather than being employed by it — are not employees and have no award minimum.",
  ],
  tables: [
    {
      id: "doctors-in-training",
      title: "Doctors in training — intern, resident, registrar",
      intro: "Clause 16.1(a)–(d): annual, weekly and hourly minimums exactly as published. Casual is the hourly rate plus the 25% loading (cl 11.1).",
      rows: [
        dr("Intern", 66_432, 1277.54, 33.62, "First postgraduate year"),
        dr("Resident medical practitioner pay point 1", 70_529, 1356.33, 35.69, "Second postgraduate year onwards"),
        dr("Resident medical practitioner pay point 2", 73_370, 1410.96, 37.13),
        dr("Resident medical practitioner pay point 3", 74_083, 1424.67, 37.49),
        dr("Registrar pay point 1", 80_248, 1543.23, 40.61, "In an accredited specialist training program"),
        dr("Registrar pay point 2", 83_539, 1606.52, 42.28),
        dr("Registrar pay point 3", 87_349, 1679.79, 44.21),
        dr("Registrar pay point 4", 90_018, 1731.12, 45.56),
        dr("Senior registrar pay point 1", 104_874, 2016.81, 53.07, "Passed college exams, awaiting fellowship"),
        dr("Senior registrar pay point 2", 109_010, 2096.35, 55.17),
      ],
    },
    {
      id: "career",
      title: "Career medical practitioners",
      intro: "Clause 16.1(e)–(f). A career medical practitioner has at least 4 years' postgraduate clinical experience; a senior career medical practitioner at least 10 (cl 12.5–12.6).",
      rows: [
        dr("Career medical practitioner pay point 1", 105_951, 2037.52, 53.62),
        dr("Career medical practitioner pay point 2", 109_884, 2113.15, 55.61),
        dr("Career medical practitioner pay point 3", 112_064, 2155.08, 56.71),
        dr("Career medical practitioner pay point 4", 116_188, 2234.38, 58.8),
        dr("Senior career medical practitioner pay point 1", 119_852, 2304.85, 60.65),
        dr("Senior career medical practitioner pay point 2", 123_665, 2378.17, 62.58),
        dr("Senior career medical practitioner pay point 3", 127_818, 2458.04, 64.69),
        dr("Senior career medical practitioner pay point 4", 131_704, 2532.77, 66.65),
      ],
    },
    {
      id: "specialists",
      title: "Specialists",
      intro: "Clause 16.1(h)–(k). A specialist has completed a recognised specialist training program and been admitted as a fellow of the college (cl 12.8).",
      rows: [
        dr("Specialist", 121_535, 2337.21, 61.51),
        dr("Senior specialist pay point 1", 129_953, 2499.1, 65.77),
        dr("Senior specialist pay point 2", 134_416, 2584.92, 68.02),
        dr("Senior specialist pay point 3", 139_016, 2673.38, 70.35),
        dr("Senior specialist pay point 4", 148_869, 2862.87, 75.34),
        dr("Senior specialist pay point 5", 150_985, 2903.56, 76.41),
        dr("Principal specialist", 154_062, 2962.73, 77.97),
        dr("Senior principal specialist", 159_515, 3067.6, 80.73),
      ],
    },
  ],
  penalties: [
    { when: "Career MPs: Monday–Friday 6 pm to midnight", permanent: "112.5%", casual: "137.5%" },
    { when: "Career MPs: Monday–Friday midnight to 8 am", permanent: "125%", casual: "150%" },
    { when: "Career MPs: Saturday", permanent: "150%", casual: "175%" },
    { when: "Career MPs: Sunday", permanent: "175%", casual: "200%" },
    { when: "Senior doctors: public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Penalty rates differ by classification (cl 21.1). Doctors in training instead get 2.5% of their minimum weekly rate for each rostered ordinary shift that starts or ends between 9 pm and 6 am. Only the higher penalty applies where two overlap, including overtime (cl 21.1(e)).",
  overtime: [
    "All doctors except senior doctors: hours beyond 38 a week are overtime — 150% for the first 2 hours Monday to Saturday, then 200%; Sunday 200%; public holiday 250%. Casuals: 175%, 225% and 275% (cl 20.2).",
    "On-call: 10% of the daily rate for each day on call (cl 20.3(a)). Recall: one hour's pay for travel plus at least 3 hours at 150% (weekdays) or 200% (weekends and public holidays) (cl 20.4).",
    "Sleepover for doctors in training: $103.96 per sleepover, covering up to an hour of work (cl 20.5).",
  ],
  allowances: [
    { name: "Sleepover allowance (doctors in training)", amount: "$103.96 per sleepover", note: "Includes up to one hour of work; more than 5 call-outs makes the whole period active duty (cl 20.5)." },
    { name: "On-call allowance", amount: "10% of the daily rate", note: "Per day on call, doctors other than senior doctors (cl 20.3(a))." },
  ],
  median: MEDIAN,
  notices: [
    "Work in a state public hospital? These award rates are not your pay scale — state medical officer agreements pay considerably more. The award applies to private hospitals and other national-system employers.",
  ],
  notShown: [
    "State public hospital medical officer scales (NSW, Victoria, Queensland, WA, SA, Tasmania, ACT, NT), which are set by state instruments.",
    "Community medical practitioner and director of medical services scales (cl 16.1(g), (l), (m)).",
    "Visiting medical officer and contractor arrangements, which are not employment.",
  ],
  faqs: [
    {
      q: "What is the award rate for a doctor in Australia in 2026?",
      a: "Under the Medical Practitioners Award, an intern must be paid at least $66,432 a year ($1,277.54 a week, $33.62 an hour) from the first full pay period on or after 1 July 2026. A registrar starts at $80,248 and a specialist at $121,535. These minimums apply to national-system employers such as private hospitals, not state public hospitals.",
    },
    {
      q: "Are public hospital doctors paid under the Medical Practitioners Award?",
      a: "Generally no. Doctors employed by state public health services are covered by state medical officer awards or enterprise agreements, which pay well above the federal award. Check your state agreement for your actual rate.",
    },
    {
      q: "What is the casual rate for a doctor?",
      a: "A casual doctor gets the minimum hourly rate plus the 25% casual loading and must be engaged for at least 2 hours (cl 11). For an intern that is $42.03 an hour; for a specialist $76.89.",
    },
    {
      q: "Do doctors get overtime?",
      a: "Yes, except senior doctors. Hours beyond 38 a week are paid at 150% for the first 2 hours and 200% after that Monday to Saturday, 200% on Sundays and 250% on public holidays.",
    },
    {
      q: "What do doctors actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,446 a week for general practitioners and resident medical officers (ABS, May 2025), about $127,192 a year. Specialists, and doctors who are contractors or practice owners, are not captured by that employee median.",
    },
  ],
  sources: [
    { title: "Medical Practitioners Award 2020 [MA000031] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000031") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
  ],
};
