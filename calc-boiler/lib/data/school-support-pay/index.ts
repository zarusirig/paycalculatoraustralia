// =============================================================================
// School support staff pay by state (J6, wave 4): teacher aides, School
// Learning Support Officers, Education Support staff, education assistants and
// School Services Officers in GOVERNMENT schools. Private and Catholic school
// teacher aides are on the Educational Services (Schools) General Staff Award,
// covered at /job-pay-rates/teacher-aide/.
//
// Every figure was read on 24 September 2026 from the instrument named in each
// state's `sources`, except South Australia, which re-uses the School Services
// Officer schedule already verified in lib/data/public-service-pay/sa.ts.
//
// PUBLISHED vs DERIVED annual salaries: VIC, QLD and SA publish annual
// salaries, used as printed. NSW and WA publish hourly rates only; their annual
// figure is a full-time equivalent we derive as hourly × the agreement's
// full-time weekly hours × 52, and it is labelled as derived wherever shown.
// Most school support staff work part-time or term-time, so the pages lead
// with the hourly rate for those two states.
//
// Not built (not verified): TAS, ACT and NT.
// =============================================================================

import { SA } from "../public-service-pay/sa";
import type { PayFaq, PaySource } from "../public-service-pay/types";
import { formatSalary } from "../public-service-pay/types";

export type SchoolSupportStateSlug = "nsw" | "vic" | "qld" | "wa" | "sa";

export const SCHOOL_SUPPORT_VERIFIED_ON = "24 September 2026";

export interface SupportRow {
  /** As the instrument labels it: "SLSO 1", "ES 2-4", "OO2 pay point 1". */
  label: string;
  hourly?: number;
  /** Full-time annual salary (published, or derived — see the table's `annualBasis`). */
  annual: number;
  note?: string;
}

export interface SupportTable {
  id: string;
  title: string;
  /** "current" = in force now; "upcoming" = approved, starts later; "proposed" = not yet approved. */
  status: "current" | "upcoming" | "proposed";
  effectiveFrom: string;
  annualBasis: "published" | "derived";
  /** Plain-English line under the table. */
  caption: string;
  sourceId: string;
  rows: readonly SupportRow[];
  /** Show the hourly column. */
  showHourly: boolean;
}

export interface SchoolSupportState {
  slug: SchoolSupportStateSlug;
  code: string;
  stateName: string;
  /** What the job is called in this state's government schools. */
  roleName: string;
  /** Short forms people search: "SLSO", "ES", "EA", "SSO". */
  roleShort: string;
  employer: string;
  instrument: string;
  headline: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Full-time ordinary hours a week, where the instrument states them. */
  fullTimeHours: number | null;
  hoursNote: string;
  /** Where a new teacher aide starts, as the instrument says. */
  startingPoint: string;
  /** The row used for the hub comparison: the usual entry point for a teacher aide. */
  entry: { label: string; hourly?: number; annual: number; annualBasis: "published" | "derived" };
  tables: readonly SupportTable[];
  notes: readonly string[];
  sources: readonly PaySource[];
  faqs: readonly PayFaq[];
  verifiedOn: string;
  /** Teacher pay page for the same state. */
  teacherPayHref: string;
}

const derive = (hourly: number, hours: number) => Math.round(hourly * hours * 52);

// ---------------------------------------------------------------------------
// NSW — Crown Employees (School Administrative and Support Staff) Award 2024
// ---------------------------------------------------------------------------

const NSW_HOURS = 31.25;
const NSW_RATES: [string, number, string?][] = [
  ["SLSO 1", 38.33, "New SLSOs start here (cl 4.5.1)"],
  ["SLSO 2", 39.01],
  ["SLSO 3", 41.77],
  ["SLSO 4", 44.53],
  ["SLSO (Specialist Health Support)", 46.06],
  ["School Administrative Officer (SAO)", 41.86],
];
const NSW_TEMP: [string, number][] = [
  ["SLSO 1", 44.09],
  ["SLSO 2", 44.87],
  ["SLSO 3", 48.02],
  ["SLSO 4", 51.22],
  ["SLSO (Specialist Health Support)", 52.97],
  ["School Administrative Officer (SAO)", 48.15],
];

const NSW: SchoolSupportState = {
  slug: "nsw",
  code: "NSW",
  stateName: "New South Wales",
  roleName: "School Learning Support Officer",
  roleShort: "SLSO",
  employer: "NSW Department of Education",
  instrument: "Crown Employees (School Administrative and Support Staff) Award 2024, made by the Industrial Relations Commission of NSW. It runs from 1 July 2024 to 30 June 2027 (cl 33.2) and covers SLSOs, School Administrative Officers and Managers, Aboriginal Education Officers and Business Managers in NSW public schools.",
  headline: `From the first pay period starting on or after 1 July 2026, a School Learning Support Officer in a NSW public school is paid $38.33 an hour at SLSO 1, rising to $44.53 at SLSO 4. A full-time SLSO works 31.25 hours a week, so SLSO 1 is ${formatSalary(derive(38.33, NSW_HOURS))} a year full-time equivalent. Short-term temporary SLSOs get a 15% loading instead of recreation leave: $44.09 an hour at SLSO 1.`,
  metaTitle: "SLSO Pay Rates NSW 2026 — School Support Staff Pay from 1 July",
  metaDescription: "NSW SLSO pay from 1 July 2026: $38.33 to $44.53 an hour (SLSO 1–4), SAO, AEO and SAM rates, short-term temporary rates, full-time salary and take-home pay.",
  h1: "SLSO Pay Rates NSW 2026: School Learning Support Officer and SAS Staff Pay",
  fullTimeHours: NSW_HOURS,
  hoursNote: "Full-time is 31 hours 15 minutes a week, worked between 7.30am and 6pm on school days (cl 8.1). School Administrative Managers work 33 hours 20 minutes and Business Managers 35 hours.",
  startingPoint: "A new SLSO starts at SLSO 1 (cl 4.5.1) and moves up the levels under the award's progression rules.",
  entry: { label: "SLSO 1", hourly: 38.33, annual: derive(38.33, NSW_HOURS), annualBasis: "derived" },
  tables: [
    {
      id: "nsw-2026",
      title: "Permanent and long-term temporary staff, from 1 July 2026",
      status: "current",
      effectiveFrom: "the first pay period commencing on or after 1 July 2026",
      annualBasis: "derived",
      caption: "Schedule 1, 1.1 of the award, after the 3% increase from the first pay period commencing on or after 1 July 2026 (cl 5.2). Annual = hourly rate × 31.25 hours × 52 weeks, our full-time equivalent; the award publishes hourly rates only. SLSO (Personal Support) levels 1–4 are paid the same as SLSO 1–4.",
      sourceId: "nsw-award",
      showHourly: true,
      rows: NSW_RATES.map(([label, hourly, note]) => ({ label, hourly, annual: derive(hourly, NSW_HOURS), ...(note ? { note } : {}) })),
    },
    {
      id: "nsw-temp-2026",
      title: "Short-term temporary staff, from 1 July 2026",
      status: "current",
      effectiveFrom: "the first pay period commencing on or after 1 July 2026",
      annualBasis: "derived",
      caption: "Schedule 1, 1.2: the permanent rate plus a 15% loading paid instead of recreation leave (cl 5.7). Annual = hourly × 31.25 × 52.",
      sourceId: "nsw-award",
      showHourly: true,
      rows: NSW_TEMP.map(([label, hourly]) => ({ label, hourly, annual: derive(hourly, NSW_HOURS) })),
    },
  ],
  notes: [
    "Other staff on the same award, hourly from 1 July 2026: Aboriginal Education Officer 1 to 4 $45.78, $47.11, $48.44 and $49.82; School Administrative Manager 1 to 4 $48.42, $49.74, $51.15 and $52.71 (SAMs work 33 hours 20 minutes a week full-time).",
    "Pay rose 4% from 1 July 2024, 3% from 1 July 2025 and 3% from the first pay period commencing on or after 1 July 2026 (cl 5.2). The award runs to 30 June 2027 and no later rate is set.",
    "Permanent staff are paid in 26 equal fortnightly pays across the year (cl 5.3), and long-term temporary staff are paid in school vacations at the same rate as in term (cl 5.4).",
    "The Department of Education's public rates page still shows 2022 rates and says it is under review, so the rates here are read from the award itself.",
  ],
  sources: [
    {
      id: "nsw-award",
      title: "Crown Employees (School Administrative and Support Staff) Award 2024 — Schedule 1, rates of pay",
      publisher: "Industrial Relations Commission of NSW (copy published by the Public Service Association of NSW)",
      url: "https://psa.asn.au/wp-content/uploads/2026/06/Crown-Employees-School-Administrative-And-Support-Staff-Award-2024.pdf",
      effectiveFrom: "first pay period commencing on or after 1 July 2026",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
      note: "Clauses 4.5.1, 5.2–5.7, 8.1 and 33.2; Schedule 1, 1.1 and 1.2.",
    },
  ],
  faqs: [
    {
      q: "What is the SLSO pay rate in NSW?",
      a: "From the first pay period starting on or after 1 July 2026, SLSO 1 is $38.33 an hour, SLSO 2 $39.01, SLSO 3 $41.77 and SLSO 4 $44.53, under the Crown Employees (School Administrative and Support Staff) Award 2024. A Specialist Health Support SLSO is paid $46.06 an hour.",
    },
    {
      q: "How much does a full-time SLSO earn a year?",
      a: `Full-time for an SLSO is 31.25 hours a week, so SLSO 1 at $38.33 an hour works out to about ${formatSalary(derive(38.33, NSW_HOURS))} a year and SLSO 4 to about ${formatSalary(derive(44.53, NSW_HOURS))} (hourly × 31.25 × 52). Many SLSOs work fewer hours, so multiply the hourly rate by your own hours.`,
    },
    {
      q: "What do temporary SLSOs get paid?",
      a: "Short-term temporary SLSOs get a 15% loading on the permanent rate instead of recreation leave: $44.09 an hour at SLSO 1 and $51.22 at SLSO 4 from 1 July 2026. Long-term temporary staff are paid the permanent rate, including in school holidays.",
    },
    {
      q: "When is the next SLSO pay rise?",
      a: "The 2024 award sets its last increase, 3%, from the first pay period starting on or after 1 July 2026 and runs until 30 June 2027. Any later rise depends on a new award or variation, which has not been published.",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
  teacherPayHref: "/teacher-pay-australia/nsw/",
};

// ---------------------------------------------------------------------------
// VIC — Education Support Class, Victorian Government Schools Agreement 2022
// ---------------------------------------------------------------------------

type VicRow = [string, number, number, number]; // subdivision, current 1/07/25, proposed 10/8/2026, proposed 1/10/2026
const VIC_ROWS: VicRow[] = [
  ["1-1", 51_622, 53_171, 58_355],
  ["1-2", 53_850, 55_466, 60_873],
  ["2-1", 56_580, 58_277, 63_959],
  ["2-2", 58_770, 60_533, 66_435],
  ["2-3", 60_933, 62_761, 68_880],
  ["2-4", 63_096, 64_989, 71_325],
  ["2-5", 65_259, 67_217, 73_770],
  ["2-6", 67_422, 69_445, 76_216],
  ["2-7", 70_289, 72_398, 79_456],
  ["2-8", 72_460, 74_634, 81_911],
  ["3-1", 73_467, 75_671, 83_049],
  ["3-2", 76_134, 78_418, 86_064],
  ["3-3", 78_672, 81_032, 88_933],
  ["3-4", 81_307, 83_746, 91_911],
  ["3-5", 85_405, 87_967, 96_544],
  ["3-6", 89_335, 92_015, 100_987],
  ["4-1", 93_265, 96_063, 105_429],
  ["4-2", 96_389, 99_281, 108_961],
  ["4-3", 99_619, 102_608, 112_612],
  ["4-4", 102_955, 106_044, 116_383],
  ["4-5", 106_404, 109_596, 120_282],
  ["4-6", 109_967, 113_266, 124_309],
  ["5-1", 113_652, 117_062, 128_475],
  ["5-2", 117_460, 120_984, 132_780],
  ["5-3", 121_395, 125_037, 137_228],
  ["5-4", 125_464, 129_228, 141_828],
  ["5-5", 129_760, 133_653, 146_684],
  ["5-6", 134_057, 138_079, 151_541],
  ["6-1", 134_108, 138_131, 151_599],
  ["6-2", 139_069, 143_241, 157_207],
  ["6-3", 144_216, 148_542, 163_025],
  ["6-4", 149_551, 154_038, 169_056],
  ["6-5", 155_033, 159_684, 175_253],
];
const vicRange = (sub: string) => (sub.startsWith("6") ? "Level 2 Range 6" : `Level 1 Range ${sub[0]}`);

const VIC: SchoolSupportState = {
  slug: "vic",
  code: "VIC",
  stateName: "Victoria",
  roleName: "Education Support (ES) staff",
  roleShort: "ES",
  employer: "Victorian Department of Education",
  instrument: "Victorian Government Schools Agreement 2022, Education Support Class. A replacement Victorian Government Schools Agreement 2026 was approved by staff in September 2026 and lodged with the Fair Work Commission; its rates apply only once the Commission approves it.",
  headline: "Education Support staff in Victorian government schools are paid from $51,622 a year (ES Level 1 Range 1, subdivision 1-1) to $72,460 at the top of Range 2 and $89,335 at the top of Range 3, under the Victorian Government Schools Agreement 2022 rates from the first pay period on or after 1 July 2025. These are full-time (52/52) salaries; part-time and term-time staff are paid a proportion. The proposed 2026 agreement would lift 1-1 to $53,171 from 10 August 2026 and $58,355 from 1 October 2026 once approved.",
  metaTitle: "Education Support Pay Rates VIC 2026 — ES Salary Ranges 1 to 6",
  metaDescription: "Victorian Education Support (ES) salaries: every range 1-1 to 6-5 from $51,622, proposed VGSA 2026 rates from 10 Aug and 1 Oct 2026, and take-home pay.",
  h1: "Education Support Pay Rates Victoria 2026: ES Salary by Range",
  fullTimeHours: null,
  hoursNote: "The tables are full-time salaries on a 52/52 basis. ES staff who work part-time or only during term are paid a proportion of the full-time salary for their time fraction; the agreement sets how that fraction is worked out.",
  startingPoint: "Under the proposed 2026 agreement (cl 18(4)(c)), an ES role that requires an AQF certificate, or involves coordination, specialised student or teacher support or technical tasks, starts at Range 2 subdivision 2-4, and a role requiring an AQF diploma starts at 2-5.",
  entry: { label: "ES 1-1", annual: 51_622, annualBasis: "published" },
  tables: [
    {
      id: "vic-2025",
      title: "Education Support Class, from the first pay period on or after 1 July 2025 (in force)",
      status: "current",
      effectiveFrom: "the first pay period on or after 1 July 2025",
      annualBasis: "published",
      caption: "Victorian Government Schools Agreement 2022, Education Support Class salary schedule, column 1/07/25 — the last increase that agreement makes. Full-time (52/52) annual salaries.",
      sourceId: "vic-es-2022",
      showHourly: false,
      rows: VIC_ROWS.map(([sub, cur]) => ({ label: `${vicRange(sub)}, ${sub}`, annual: cur })),
    },
    {
      id: "vic-2026-proposed",
      title: "Proposed Victorian Government Schools Agreement 2026 — not yet approved",
      status: "proposed",
      effectiveFrom: "the first pay period on or after 10 August 2026, then 1 October 2026",
      annualBasis: "published",
      caption: "Schedule 1 of the proposed agreement, The salary column is the 1 October 2026 rate; the 10 August 2026 rate is in the note. Further increases are set for 1 November 2027, 2028 and 2029. These rates are not payable until the Fair Work Commission approves the agreement.",
      sourceId: "vic-vgsa-2026",
      showHourly: false,
      rows: VIC_ROWS.map(([sub, , aug, oct]) => ({ label: `${vicRange(sub)}, ${sub}`, annual: oct, note: `${formatSalary(aug)} from 10 Aug 2026` })),
    },
  ],
  notes: [
    "The 1 July 2025 column is the final increase in the 2022 agreement, so it is still the rate in force until the 2026 agreement is approved.",
    "The proposed 2026 agreement also introduces a mandatory AQF qualification framework for ES staff no earlier than 1 February 2029 (cl 18(1)(c)).",
    "Casual Education Support rates are set on a separate departmental schedule that we have not reproduced.",
  ],
  sources: [
    {
      id: "vic-es-2022",
      title: "Education Support Class salaries in Victorian government schools (Victorian Government Schools Agreement 2022)",
      publisher: "Department of Education (Victoria)",
      url: "https://content.sdp.education.vic.gov.au/media/salary-educationsupportclass-pdf-1717",
      effectiveFrom: "first pay period on or after 1 July 2025",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
      note: "Listed on the department's salary rates overview page.",
    },
    {
      id: "vic-vgsa-2026",
      title: "Proposed Victorian Government Schools Agreement 2026 — Schedule 1, salary rates",
      publisher: "Department of Education (Victoria)",
      url: "https://content.sdp.education.vic.gov.au/media/proposed-vgsa-2026-3615",
      effectiveFrom: "10 August 2026 (proposed)",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
      note: "Clause 18 (ES classification and commencement); Schedule 1 Education Support Class.",
    },
  ],
  faqs: [
    {
      q: "How much do Education Support staff earn in Victoria?",
      a: "Under the Victorian Government Schools Agreement 2022 rates from 1 July 2025, full-time ES salaries run from $51,622 (Level 1 Range 1, 1-1) to $72,460 at the top of Range 2, $89,335 at the top of Range 3 and $155,033 at the top of Level 2 Range 6. Part-time and term-time staff are paid a proportion.",
    },
    {
      q: "What is the ES pay rise in the new Victorian schools agreement?",
      a: "The proposed Victorian Government Schools Agreement 2026 would lift every ES rate from the first pay period on or after 10 August 2026 and again from 1 October 2026, then each 1 November from 2027 to 2029. For example, 1-1 goes from $51,622 to $53,171 and then $58,355, and 2-4 from $63,096 to $64,989 and then $71,325. The rates apply once the Fair Work Commission approves the agreement.",
    },
    {
      q: "What range does an integration aide start on in Victoria?",
      a: "Under the proposed 2026 agreement, an ES role that needs an AQF certificate or involves specialised student support starts at Range 2 subdivision 2-4 ($63,096 full-time on the current rates), and a role that needs a diploma starts at 2-5 ($65,259).",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
  teacherPayHref: "/teacher-pay-australia/vic/",
};

// ---------------------------------------------------------------------------
// QLD — Department of Education Teacher Aides' Certified Agreement 2025
// ---------------------------------------------------------------------------

type QldRow = [string, number, number]; // label, hourly, annual (38 h)
const QLD_2025: QldRow[] = [
  ["OO2 pay point 1", 31.6921, 62_839],
  ["OO2 pay point 2", 32.4461, 64_334],
  ["OO2 pay point 3", 33.2158, 65_860],
  ["OO2 pay point 4", 33.9579, 67_331],
  ["OO3 pay point 1", 34.4105, 68_229],
  ["OO3 pay point 2", 34.9829, 69_364],
  ["OO3 pay point 3", 35.6013, 70_590],
  ["OO3 pay point 4", 36.2355, 71_847],
  ["OO4 pay point 1", 37.6395, 74_631],
  ["OO4 pay point 2", 38.8171, 76_966],
  ["OO4 pay point 3", 40.0408, 79_392],
  ["OO4 pay point 4", 41.1882, 81_667],
  ["OO4 Auslan/interpreter/Braille pay point 1", 42.5447, 84_357],
  ["OO4 Auslan/interpreter/Braille pay point 2", 43.8789, 87_003],
  ["OO4 Auslan/interpreter/Braille pay point 3", 45.2803, 89_781],
  ["OO4 Auslan/interpreter/Braille pay point 4", 46.6276, 92_453],
];
const QLD_2026: QldRow[] = [
  ["OO2 pay point 1", 32.4842, 64_409],
  ["OO2 pay point 2", 33.2566, 65_941],
  ["OO2 pay point 3", 34.0461, 67_506],
  ["OO2 pay point 4", 34.8066, 69_014],
  ["OO3 pay point 1", 35.2711, 69_935],
  ["OO3 pay point 2", 35.8579, 71_099],
  ["OO3 pay point 3", 36.4908, 72_353],
  ["OO3 pay point 4", 37.1408, 73_642],
  ["OO4 pay point 1", 38.5803, 76_496],
  ["OO4 pay point 2", 39.7882, 78_891],
  ["OO4 pay point 3", 41.0421, 81_378],
  ["OO4 pay point 4", 42.2184, 83_710],
];
const QLD_30H: [string, number][] = [
  ["OO2 pay point 1", 49_609],
  ["OO2 pay point 4", 53_157],
  ["OO3 pay point 1", 53_864],
  ["OO3 pay point 4", 56_721],
  ["OO4 pay point 1", 58_920],
  ["OO4 pay point 4", 64_474],
];

const QLD: SchoolSupportState = {
  slug: "qld",
  code: "QLD",
  stateName: "Queensland",
  roleName: "Teacher Aide",
  roleShort: "teacher aide",
  employer: "Queensland Department of Education",
  instrument: "Department of Education Teacher Aides' Certified Agreement 2025, certified by the Queensland Industrial Relations Commission on 17 April 2026 (CB/2026/36), nominal expiry 31 October 2028. Teacher aides are classified as Operational Officers at levels OO2, OO3 and OO4.",
  headline: "A teacher aide in a Queensland state school is paid $31.69 an hour at OO2 pay point 1 and up to $41.19 an hour at OO4 pay point 4, from 1 November 2025 under the Teacher Aides' Certified Agreement 2025. That is $62,839 to $81,667 a year full-time (38 hours), or $49,609 to $64,474 on the department's standard 30-hour teacher aide job. The next increase, 2.5%, is due from 1 November 2026.",
  metaTitle: "Teacher Aide Pay QLD 2026 — OO2 to OO4 Rates and Salary",
  metaDescription: "Queensland teacher aide pay: $31.69 to $41.19 an hour (OO2–OO4) from 1 Nov 2025, the 2.5% rise from 1 Nov 2026, 30-hour salaries and take-home pay.",
  h1: "Teacher Aide Pay Queensland 2026: OO2, OO3 and OO4 Rates",
  fullTimeHours: 38,
  hoursNote: "Full-time is 38 ordinary hours a week and part-time is paid pro rata. The agreement's standard job model for teacher aides is 30 ordinary hours a week, and Schedule 1 tabulates annual pay at 30 hours as well.",
  startingPoint: "Teacher aides are classified at OO2, OO3 or OO4 depending on the role, and move up the pay points within their level; OO4 also has a higher scale for Auslan, interpreter and Braille roles.",
  entry: { label: "OO2 pay point 1", hourly: 31.6921, annual: 62_839, annualBasis: "published" },
  tables: [
    {
      id: "qld-2025",
      title: "Teacher aides from 1 November 2025 (in force)",
      status: "current",
      effectiveFrom: "1 November 2025",
      annualBasis: "published",
      caption: "Schedule 1 of the agreement, after the 3% increase from 1 November 2025 (cl 6.1). Annual salaries are full-time at 38 hours as printed. These Schedule 1 rates do not include any CPI uplift adjustment (see below).",
      sourceId: "qld-ta-2025",
      showHourly: true,
      rows: QLD_2025.map(([label, hourly, annual]) => ({ label, hourly, annual })),
    },
    {
      id: "qld-30h-2025",
      title: "The 30-hour standard teacher aide job, from 1 November 2025",
      status: "current",
      effectiveFrom: "1 November 2025",
      annualBasis: "published",
      caption: "Schedule 1 annual pay at 30 ordinary hours a week, as printed for the first and last pay point of each level.",
      sourceId: "qld-ta-2025",
      showHourly: false,
      rows: QLD_30H.map(([label, annual]) => ({ label, annual })),
    },
    {
      id: "qld-2026",
      title: "Teacher aides from 1 November 2026 (2.5% increase)",
      status: "upcoming",
      effectiveFrom: "1 November 2026",
      annualBasis: "published",
      caption: "Schedule 1, rates effective 1 November 2026 (cl 6.1). Full-time at 38 hours.",
      sourceId: "qld-ta-2025",
      showHourly: true,
      rows: QLD_2026.map(([label, hourly, annual]) => ({ label, hourly, annual })),
    },
  ],
  notes: [
    "The agreement adds a CPI uplift adjustment when Brisbane's March-quarter inflation is higher than the scheduled increase, capped at 0.5% for the first period (cl 6.1(b)). The Schedule 1 tables exclude it. The ABS reported Brisbane annual inflation of 4.2% for March 2026, above the 3% increase, but we have not found the department's table with the uplift applied, so the rates shown are before any uplift.",
    "Casual teacher aides are paid the hourly rate plus a 25% loading; at OO2 pay point 1 that is $39.62 an hour from 1 November 2025 ($39.6151 as printed).",
    "Pay rises under the agreement: 3% from 1 November 2025, 2.5% from 1 November 2026 and 2.5% from 1 November 2027, each with the capped CPI uplift where it applies.",
  ],
  sources: [
    {
      id: "qld-ta-2025",
      title: "Department of Education Teacher Aides' Certified Agreement 2025 (CB/2026/36)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-04/2026_cb36.pdf",
      effectiveFrom: "1 November 2025",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
      note: "Clause 6.1 (wage increases and CPI uplift adjustment), Part 8 (standard job model), Schedule 1 (rates).",
    },
    {
      id: "qld-cpi",
      title: "QFleet Certified Agreement 2025 wage increases and CPI uplift adjustment (Brisbane March 2026 CPI)",
      publisher: "Queensland Department of Housing and Public Works",
      url: "https://www.housing.qld.gov.au/about/work/qfleet-certified-agreement-2025-wage-increases-and-cpi-uplift-adjustment",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
      note: "Source for the 4.2% All Groups Brisbane figure announced by the ABS on 29 April 2026.",
    },
  ],
  faqs: [
    {
      q: "How much does a teacher aide earn in Queensland?",
      a: "From 1 November 2025, a Queensland state school teacher aide is paid $31.6921 an hour at OO2 pay point 1, $34.4105 at OO3 pay point 1 and $41.1882 at OO4 pay point 4. Full-time (38 hours) that is $62,839 to $81,667 a year; on the standard 30-hour teacher aide job it is $49,609 to $64,474.",
    },
    {
      q: "When do Queensland teacher aides get a pay rise?",
      a: "The Teacher Aides' Certified Agreement 2025 gives 2.5% from 1 November 2026, taking OO2 pay point 1 to $32.4842 an hour ($64,409 full-time), and another 2.5% from 1 November 2027. A capped CPI uplift adjustment can be added when Brisbane inflation is higher than the increase.",
    },
    {
      q: "What is the casual teacher aide rate in Queensland?",
      a: "Casual teacher aides get the hourly rate plus a 25% loading. At OO2 pay point 1 the casual rate is $39.6151 an hour from 1 November 2025, before any CPI uplift adjustment.",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
  teacherPayHref: "/teacher-pay-australia/qld/",
};

// ---------------------------------------------------------------------------
// WA — Education Assistants' (Government) General Agreement 2025
// ---------------------------------------------------------------------------

const WA_HOURS = 32.5;
const WA_RATES: [string, number, string?][] = [
  ["EA (Mainstream) 1.1", 34.75, "New mainstream EAs start here (cl 25.1)"],
  ["EA (Mainstream) 1.2", 35.41],
  ["EA 2.1", 36.87],
  ["EA 2.2", 37.40],
  ["EA 2.3", 38.15],
  ["EA (Mainstream) 2.4", 39.05],
  ["EA (Special Needs) 3.1", 39.78, "Also AIEO (start point, cl 29.1), EA (EAL/D)"],
  ["EA (Special Needs) 3.2", 40.55],
  ["EA (Special Needs) 3.3", 41.37],
  ["EA Specialist (Auslan, Braille, Advanced EA, EA Lead)", 43.28],
  ["Aboriginal Cultural Advisor", 44.26],
];

const WA: SchoolSupportState = {
  slug: "wa",
  code: "WA",
  stateName: "Western Australia",
  roleName: "Education Assistant",
  roleShort: "EA",
  employer: "WA Department of Education",
  instrument: "Education Assistants' (Government) General Agreement 2025, registered by the Western Australian Industrial Relations Commission ([2025] WAIRC 00036). It operates from 1 January 2025 and expires on 31 December 2026 (cl 6.1).",
  headline: `An Education Assistant in a WA public school is paid $34.75 an hour at level 1.1 from 1 January 2026, rising to $39.05 at mainstream level 2.4 and $41.37 at Special Needs level 3.3. Full-time is 32.5 hours a week, so level 1.1 is ${formatSalary(derive(34.75, WA_HOURS))} a year full-time equivalent. Each rate went up by $65 a week on 1 January 2026.`,
  metaTitle: "Education Assistant Pay WA 2026 — EA Hourly Rates and Salary",
  metaDescription: "WA Education Assistant pay from 1 January 2026: $34.75 to $43.28 an hour, Special Needs and AIEO rates, 32.5-hour full-time salary and take-home pay.",
  h1: "Education Assistant Pay WA 2026: EA and AIEO Hourly Rates",
  fullTimeHours: WA_HOURS,
  hoursNote: "Full-time ordinary hours are 32.5 a week (cl 22.1). Most EAs are paid for the hours they are rostered, so multiply the hourly rate by your own hours.",
  startingPoint: "A new mainstream EA starts at level 1.1 and moves to level 2.1 on the increment date unless the principal decides otherwise (cl 25.1–25.3). Special Needs positions start at level 2 or 3 depending on the students' needs, and Aboriginal and Islander Education Officers start at 3.1 (cl 26, 29.1).",
  entry: { label: "EA 1.1", hourly: 34.75, annual: derive(34.75, WA_HOURS), annualBasis: "derived" },
  tables: [
    {
      id: "wa-2026",
      title: "Education Assistants from 1 January 2026",
      status: "current",
      effectiveFrom: "1 January 2026",
      annualBasis: "derived",
      caption: "Schedule 2 – Wages, 1 January 2026 column. Level 2.1–2.3 rates apply to mainstream and Special Needs EAs alike. Annual = hourly rate × 32.5 hours × 52 weeks, our full-time equivalent; the agreement publishes hourly rates.",
      sourceId: "wa-ea-2025",
      showHourly: true,
      rows: WA_RATES.map(([label, hourly, note]) => ({ label, hourly, annual: derive(hourly, WA_HOURS), ...(note ? { note } : {}) })),
    },
  ],
  notes: [
    "The agreement added $65 a week to every rate from 1 January 2025 and again from 1 January 2026. It expires on 31 December 2026 and no later rate has been published.",
    "Casual EAs get a 25% loading instead of personal leave and paid student vacation time (cl 13.2).",
  ],
  sources: [
    {
      id: "wa-ea-2025",
      title: "Education Assistants' (Government) General Agreement 2025 — Schedule 2, wages",
      publisher: "Western Australian Industrial Relations Commission",
      url: "https://downloads.wairc.wa.gov.au/agreements/edu018.pdf",
      effectiveFrom: "1 January 2026",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
      note: "Clauses 6.1, 13.2, 22.1, 25, 26 and 29.1; Schedule 2.",
    },
  ],
  faqs: [
    {
      q: "How much does an Education Assistant earn in WA?",
      a: "From 1 January 2026, a WA public school Education Assistant earns $34.75 an hour at level 1.1, $36.87 at level 2.1, $39.05 at mainstream level 2.4 and $39.78 to $41.37 at Special Needs level 3. EA Specialists (Auslan, Braille, Advanced EA and EA Lead) earn $43.28 an hour.",
    },
    {
      q: "What is a full-time Education Assistant salary in WA?",
      a: `Full-time is 32.5 hours a week, so level 1.1 at $34.75 an hour is about ${formatSalary(derive(34.75, WA_HOURS))} a year and level 3.3 at $41.37 about ${formatSalary(derive(41.37, WA_HOURS))} (hourly × 32.5 × 52).`,
    },
    {
      q: "What do casual Education Assistants get paid in WA?",
      a: "Casual EAs get the hourly rate plus a 25% loading in place of personal leave and student vacation time, under clause 13.2 of the Education Assistants' (Government) General Agreement 2025.",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON,
  teacherPayHref: "/teacher-pay-australia/wa/",
};

// ---------------------------------------------------------------------------
// SA — School Services Officers (re-uses lib/data/public-service-pay/sa.ts)
// ---------------------------------------------------------------------------

const SA_SSO_SCHEDULE = SA.schedules.find((s) => s.id === "sa-sso-2026");
if (!SA_SSO_SCHEDULE) throw new Error("school-support-pay: sa-sso-2026 schedule missing from sa.ts");
const SA_SSO_BANDS = SA_SSO_SCHEDULE.streams.flatMap((s) => s.bands);
const SSO1 = SA_SSO_BANDS.find((b) => b.code === "SSO-1")!;
const SSO2 = SA_SSO_BANDS.find((b) => b.code === "SSO-2")!;

const SA_SSO: SchoolSupportState = {
  slug: "sa",
  code: "SA",
  stateName: "South Australia",
  roleName: "School Services Officer",
  roleShort: "SSO",
  employer: "SA Department for Education",
  instrument: "South Australian School and Preschool Education Staff Enterprise Agreement 2024, Schedule 1.6 (School Services Officers), approved by the South Australian Employment Tribunal on 25 March 2024.",
  headline: `A School Services Officer in a South Australian government school or preschool is paid ${formatSalary(SSO1.min)} to ${formatSalary(SSO1.max)} a year at SSO-1 and ${formatSalary(SSO2.min)} to ${formatSalary(SSO2.max)} at SSO-2, from the first full pay period on or after 1 May 2026. These are the standard annual rates; the top increment of each level is only paid after the top tier increment process.`,
  metaTitle: "SSO Pay Rates SA 2026 — School Services Officer SSO1 to SSO6",
  metaDescription: `SA School Services Officer pay from May 2026: SSO-1 ${formatSalary(SSO1.min)} to ${formatSalary(SSO1.max)}, every SSO-1 to SSO-6 increment, the top tier and take-home pay.`,
  h1: "SSO Pay Rates South Australia 2026: School Services Officer Salaries",
  fullTimeHours: null,
  hoursNote: "The rates are standard annual salaries for SSOs with leave conditions. The department also publishes a version with a 16% loading, the same spread over 52 weeks, and casual rates, which are not reproduced here.",
  startingPoint: "SSOs move through numbered increments within their level. The top increment of every level is criteria-based: the department's rate sheet says it is only for staff with relevant qualifications who have completed the top tier increment process.",
  entry: { label: "SSO-1 increment 1", annual: SSO1.min, annualBasis: "published" },
  tables: [
    {
      id: "sa-sso-2026",
      title: "School Services Officers from the first full pay period on or after 1 May 2026",
      status: "current",
      effectiveFrom: "the first full pay period on or after 1 May 2026",
      annualBasis: "published",
      caption: "Schedule 1.6 of the 2024 agreement, column 1.5.2026, cross-checked against the Department for Education's rate sheet effective 8 May 2026. This is the last increase in that agreement.",
      sourceId: "sa-education-2024",
      showHourly: false,
      rows: SA_SSO_BANDS.flatMap((b) => (b.payPoints ?? []).map((p) => ({ label: p.label, annual: p.annual }))),
    },
  ],
  notes: [
    "The 1 May 2026 increase is the last one in the 2024 agreement, and no later SSO rate has been published.",
    "Administrative staff in schools who are not SSOs may be on the Salaried 2026 agreement instead; see the South Australian public service pay scales.",
  ],
  sources: SA.sources.filter((s) => s.id === "sa-education-2024" || s.id === "sa-education-rates"),
  faqs: [
    {
      q: "What is the SSO pay rate in South Australia?",
      a: `From the first full pay period on or after 1 May 2026, SSO-1 is ${formatSalary(SSO1.min)} to ${formatSalary(SSO1.max)} a year across seven increments, and SSO-2 is ${formatSalary(SSO2.min)} to ${formatSalary(SSO2.max)} across four, under the South Australian School and Preschool Education Staff Enterprise Agreement 2024.`,
    },
    {
      q: "What is the SSO top tier increment?",
      a: "The highest increment of each SSO level is not automatic. The Department for Education's rate sheet says it only applies to staff with relevant qualifications who have completed the top tier increment process.",
    },
    {
      q: "When is the next SSO pay rise in SA?",
      a: "The 1 May 2026 increase was the last in the 2024 education staff agreement. A later rise depends on a new agreement, and no new SSO rates have been published.",
    },
  ],
  verifiedOn: SA.verifiedOn,
  teacherPayHref: "/teacher-pay-australia/sa/",
};

// ---------------------------------------------------------------------------

export const SCHOOL_SUPPORT_STATES: readonly SchoolSupportState[] = [NSW, VIC, QLD, WA, SA_SSO];
export const SCHOOL_SUPPORT_SLUGS: readonly SchoolSupportStateSlug[] = SCHOOL_SUPPORT_STATES.map((s) => s.slug);

/** States we looked for and could not verify, listed on the hub. */
export const SCHOOL_SUPPORT_NOT_BUILT = ["Tasmania", "ACT", "Northern Territory"] as const;

export function getSchoolSupportState(slug: string): SchoolSupportState | undefined {
  return SCHOOL_SUPPORT_STATES.find((s) => s.slug === slug);
}

export { derive as deriveFullTimeAnnual };

export const SCHOOL_SUPPORT_HUB_FAQS: readonly PayFaq[] = [
  {
    q: "How much do teacher aides get paid in Australia?",
    a: `It depends on the state and whether the school is government or non-government. In government schools the entry rate is $38.33 an hour for an SLSO 1 in NSW (from 1 July 2026), $31.6921 for a Queensland OO2 teacher aide (from 1 November 2025), $34.75 for a WA Education Assistant (from 1 January 2026), ${formatSalary(SSO1.min)} a year for a South Australian SSO-1 (from May 2026) and $51,622 a year full-time for Victorian ES 1-1. Private and Catholic schools use the Educational Services (Schools) General Staff Award.`,
  },
  {
    q: "Are teacher aides paid during school holidays?",
    a: "It depends on the state and the contract. NSW permanent SLSOs are paid in 26 equal fortnightly pays across the year, and long-term temporaries are paid in school vacations; short-term temporaries get a 15% loading instead of recreation leave. Casual Education Assistants in WA get a 25% loading instead of personal leave and paid student vacation time. Victorian ES staff on a term-time fraction are paid a proportion of the full-time salary.",
  },
  {
    q: "What is a teacher aide called in each state?",
    a: "School Learning Support Officer (SLSO) in NSW, Education Support (ES) staff in Victoria, teacher aide in Queensland, Education Assistant (EA) in Western Australia and School Services Officer (SSO) in South Australia.",
  },
];
