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
// H3 (22 October 2026) added the three remaining jurisdictions, each read on
// that date from the instrument named in its `sources`:
//   TAS  Teacher Assistants, Tasmanian State Service Award General Stream Band 2
//        (DECYP Salary Scales as at 27 August 2026; PSUWA 2025 for later columns).
//   ACT  School Assistants, ACT Public Sector Administrative and Related
//        Classifications EA 2023-2026, Annex A. The agreement is past its nominal
//        expiry (31 March 2026) but still in force: employees voted down the
//        proposed 2026-2029 replacement on 8 September 2026.
//   NT   School-based Administrative Officers on the 92% and 96% arrangements,
//        NTPS 2025-2029 EA Schedule 11; the 100% figures are re-used from nt.ts.
// TAS, ACT and NT publish annual salaries (TAS an hourly rate too), used as printed.
// =============================================================================

import { SA } from "../public-service-pay/sa";
import { NT as NT_PUBLIC_SERVICE } from "../public-service-pay/nt";
import type { PayFaq, PaySource } from "../public-service-pay/types";
import { formatSalary } from "../public-service-pay/types";

export type SchoolSupportStateSlug = "nsw" | "vic" | "qld" | "wa" | "sa" | "tas" | "act" | "nt";

export const SCHOOL_SUPPORT_VERIFIED_ON = "24 September 2026";
/** The date the H3 jurisdictions (TAS, ACT, NT) were read. */
export const SCHOOL_SUPPORT_VERIFIED_ON_H3 = "22 October 2026";

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
  /** JSON-LD datePublished (YYYY-MM-DD) for pages added after the J6 launch. */
  publishedOn?: string;
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
  metaTitle: "SLSO Pay Rates NSW 2026 - School Support Staff Pay from 1 July",
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
      title: "Crown Employees (School Administrative and Support Staff) Award 2024, Schedule 1, rates of pay",
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
  metaTitle: "Education Support Pay Rates VIC 2026 - ES Salary Ranges 1 to 6",
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
      caption: "Victorian Government Schools Agreement 2022, Education Support Class salary schedule, column 1/07/25, the last increase that agreement makes. Full-time (52/52) annual salaries.",
      sourceId: "vic-es-2022",
      showHourly: false,
      rows: VIC_ROWS.map(([sub, cur]) => ({ label: `${vicRange(sub)}, ${sub}`, annual: cur })),
    },
    {
      id: "vic-2026-proposed",
      title: "Proposed Victorian Government Schools Agreement 2026, not yet approved",
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
      title: "Proposed Victorian Government Schools Agreement 2026, Schedule 1, salary rates",
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
  metaTitle: "Teacher Aide Pay QLD 2026 - OO2 to OO4 Rates and Salary",
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
  metaTitle: "Education Assistant Pay WA 2026 - EA Hourly Rates and Salary",
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
      title: "Education Assistants' (Government) General Agreement 2025, Schedule 2, wages",
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
  metaTitle: "SSO Pay Rates SA 2026 - School Services Officer SSO1 to SSO6",
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
// TAS: Teacher Assistants, Tasmanian State Service Award General Stream Band 2
// (DECYP Salary Scales as at 27 August 2026; PSUWA 2025 for the later columns)
// ---------------------------------------------------------------------------

/** Award ordinary hours (Part VI cl 1). DECYP prints hourly = annual ÷ (36.75 × 52.2). */
export const TAS_HOURS = 36.75;
export const TAS_PAID_WEEKS_DIVISOR = 52.2;
type TasRow = [string, number, number, number, number]; // level, DECYP hourly, 1 Dec 2025, 1 Dec 2026, 1 Sep 2027
const TAS_ROWS: TasRow[] = [
  ["Band 2 Range 1 Level 2", 36.27753, 69_593, 72_505, 74_499],
  ["Band 2 Range 1 Level 3", 36.919748, 70_825, 73_774, 75_802],
  ["Band 2 Range 1 Level 4", 37.59168, 72_114, 75_102, 77_167],
  ["Band 2 Range 1 Level 5", 38.47473, 73_808, 76_846, 78_959],
  ["Band 2 Range 1 Level 6", 39.011129, 74_837, 77_906, 80_048],
];

const TAS: SchoolSupportState = {
  slug: "tas",
  code: "TAS",
  stateName: "Tasmania",
  roleName: "Teacher Assistant",
  roleShort: "TA",
  employer: "Tasmanian Department for Education, Children and Young People (DECYP)",
  instrument:
    "Tasmanian State Service Award (Tasmanian Industrial Commission, consolidated as Order No 6 of 2026), General Stream Band 2, with the salaries set by the Public Sector Union Wages Agreement 2025, an industrial agreement under s55 of the Industrial Relations Act 1984 that runs from 1 July 2025 to 30 June 2028. Appendix 16 of the award holds the conditions that apply only to school support staff in the Department for Education, Children and Young People.",
  headline:
    "A Teacher Assistant in a Tasmanian government school is paid $36.2775 an hour at Band 2 Range 1 Level 2, rising to $39.0111 at Level 6, under the Tasmanian State Service Award rates in force from the first full pay period on or after 1 December 2025. The department prints those as $69,593 to $74,837 a year full-time, but Teacher Assistants are paid for school terms only, so a year is at most 43 working weeks plus leave. The next rise is $800 then 3% from the first full pay period on or after 1 December 2026.",
  metaTitle: "Teacher Assistant Pay Tasmania 2026 - Band 2 Hourly Rates",
  metaDescription:
    "Tasmanian Teacher Assistant pay: $36.28 to $39.01 an hour (Band 2 Levels 2 to 6) from 1 Dec 2025, term-time weeks, allowances, the Dec 2026 rise and take-home pay.",
  h1: "Teacher Assistant Pay Tasmania 2026: Band 2 Hourly Rates and Salary",
  fullTimeHours: TAS_HOURS,
  hoursNote:
    "Full-time ordinary hours under the award are 36 hours 45 minutes a week (Part VI, clause 1), and the department's hourly rate is the annual salary divided by 36.75 hours and 52.2 weeks. Teacher Assistants are school support staff under Appendix 16: they are paid to work during school terms and not during term breaks (clause 4). By agreement with the principal they can work up to three extra weeks, so employment is at most 43 weeks a year, plus one more week of hours spread across term time. Counting recreation leave, the award's own table comes to 47.42 paid weeks. Multiply the hourly rate by your hours and weeks, or elect in writing to annualise your salary evenly over 52 weeks (clause 2).",
  startingPoint:
    "A Teacher Assistant is classified at General Stream Band 2 and starts at Range 1 Level 2, the first salary point in the band; there is no Level 1 in Band 2. Each later level, up to Level 6, is a salary increment within the band. The DECYP schedule prints the same five rates for Teacher Assistant (MDT) and Bus Assistant positions, while Social Trainers run on from Band 2 into Band 3 ($77,850 to $84,084).",
  entry: { label: "Band 2 Range 1 Level 2", hourly: 36.27753, annual: 69_593, annualBasis: "published" },
  tables: [
    {
      id: "tas-2025",
      title: "Teacher Assistants from the first full pay period on or after 1 December 2025",
      status: "current",
      effectiveFrom: "the first full pay period on or after 1 December 2025",
      annualBasis: "published",
      caption:
        "DECYP Salary Scales as at 27 August 2026, Teacher Assistant rows (class code b2ta). The annual figures match Schedule 1 of the Public Sector Union Wages Agreement 2025, column for 1 December 2025. Hourly = annual ÷ (36.75 hours × 52.2 weeks), as the department prints it. Annual is the full-time, full-year rate; term-time staff are paid for the weeks they work.",
      sourceId: "tas-decyp-scales",
      showHourly: true,
      rows: TAS_ROWS.map(([label, hourly, annual], i) => ({ label, hourly, annual, ...(i === 0 ? { note: "New Teacher Assistants start here" } : {}) })),
    },
    {
      id: "tas-2026",
      title: "Teacher Assistants from the first full pay period on or after 1 December 2026",
      status: "upcoming",
      effectiveFrom: "the first full pay period on or after 1 December 2026",
      annualBasis: "published",
      caption:
        "Schedule 1 of the Public Sector Union Wages Agreement 2025, column for 1 December 2026: the 1 December 2025 salary plus the $800 structural adjustment (clause 7.5), then 3% (clause 7.1(ii)). The 1 September 2027 column (2.75%, clause 7.1(iii)) is in the note. The department has not yet published hourly rates for these columns.",
      sourceId: "tas-psuwa-2025",
      showHourly: false,
      rows: TAS_ROWS.map(([label, , , dec2026, sep2027]) => ({ label, annual: dec2026, note: `${formatSalary(sep2027)} from 1 Sep 2027` })),
    },
  ],
  notes: [
    "Pay rises under the agreement: $800 added to base then 3% from the first full pay period on or after 1 December 2025, $800 then 3% from 1 December 2026, and 2.75% from 1 September 2027 (clauses 7.1 to 7.5). The agreement runs to 30 June 2028.",
    "Appendix 16 allowances for Teacher Assistants: toileting and showering support $33.38 a week (clause 5), meal management plan $44.51 a week (clause 7), specialist programs in speech and language, Auslan or physiotherapy $44.51 a week (clause 8), credentialled health care procedures $44.51 a week (clause 9), aquatic support $10 for each day in the water with a student (clause 12), and 1.35% of base salary while working at a Support School or Tier Four site (clause 10).",
    "Public holidays that fall in a school holiday are still paid at the normal rate, up to 10 a year, and term-only staff are paid for Christmas Day, Boxing Day and New Year's Day when they fall on days they would ordinarily work (clause 4(d) and (g)).",
    "From 2027 a Teacher Assistant can elect two paid training days in the holidays before the school year starts, at the normal rate of pay (clause 11). Every day at work includes a 15 minute paid recess break (clause 6).",
    "Extra hours the employer asks for can be banked by written agreement and paid at ordinary time during the school holidays (clause 3).",
  ],
  sources: [
    {
      id: "tas-decyp-scales",
      title: "DECYP Salary Scales as at 27 August 2026",
      publisher: "Department for Education, Children and Young People (Tasmania)",
      url: "https://publicdocumentcentre.education.tas.gov.au/library/Shared%20Documents/Salary-Scales.pdf",
      effectiveFrom: "first full pay period on or after 1 December 2025",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "Tasmanian State Service Award General Stream table, Teacher Assistant rows (class codes b2ta and b2tat), annual salary and hourly rate.",
    },
    {
      id: "tas-psuwa-2025",
      title: "Public Sector Union Wages Agreement 2025, Schedule 1, Salaries for Tasmanian State Service Award",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/855154/Public-Sector-Union-Wages-Agreement-2025.pdf",
      effectiveFrom: "first full pay period on or after 1 December 2025",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "Rows B2-R1-2 to B2-R1-6, columns for 1 December 2025, 1 December 2026 and 1 September 2027. Clause 7 sets the increases and clause 4.2 the term.",
    },
    {
      id: "tas-tss-award",
      title: "Tasmanian State Service Award, consolidated Order No 6 of 2026 (T15379), Appendix 16",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0007/929041/T15379-No-6-of-2026-Consolidated-Tasmanian-State-Service-Award-S085.pdf",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "Part VI clause 1 (36 hours 45 minutes); Appendix 16, Department for Education, Children and Young People, clauses 2 to 12.",
    },
  ],
  faqs: [
    {
      q: "How much does a teacher assistant earn in Tasmania?",
      a: "From the first full pay period on or after 1 December 2025, a Teacher Assistant in a Tasmanian government school is paid $36.2775 an hour at Band 2 Range 1 Level 2 and $39.0111 at Level 6. The department prints those as $69,593 to $74,837 a year full-time. Most Teacher Assistants are paid for school terms only, so a year's pay is the hourly rate times the hours and weeks actually worked.",
    },
    {
      q: "Are Tasmanian teacher assistants paid in the school holidays?",
      a: "Not for the term breaks themselves. Appendix 16 of the Tasmanian State Service Award says school support staff are paid to work during school terms only, with the option of up to three extra weeks a year agreed with the principal (43 weeks at most) and one more week of hours in term time. Recreation leave and public holidays that fall in the breaks are still paid, which is how the award's table reaches 47.42 paid weeks. You can also elect in writing to spread your pay evenly over 52 weeks.",
    },
    {
      q: "When is the next pay rise for Tasmanian teacher assistants?",
      a: "From the first full pay period on or after 1 December 2026: $800 is added to the base salary, then 3%. Level 2 goes from $69,593 to $72,505 a year full-time and Level 6 from $74,837 to $77,906. A further 2.75% applies from 1 September 2027, taking Level 2 to $74,499.",
    },
    {
      q: "What allowances can a Tasmanian teacher assistant get?",
      a: "Appendix 16 pays $33.38 a week for regular toileting or showering support, $44.51 a week each for meal management plans, specialist programs (speech and language, Auslan or physiotherapy) and credentialled health care procedures, $10 for each day spent in the water with a student, and 1.35% of base salary at a Support School or Tier Four site.",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
  teacherPayHref: "/teacher-pay-australia/tas/",
  publishedOn: "2026-10-22",
};

// ---------------------------------------------------------------------------
// ACT: School Assistants, ACT Public Sector Administrative and Related
// Classifications Enterprise Agreement 2023-2026, Annex A (4 December 2025 column)
// ---------------------------------------------------------------------------

/**
 * Annex A labels the rows "School Assistant 2/3 (85.034% of ASO2/ASO3 Broadband)" and
 * "School Assistant 4 (91.836% of ASO4)": clause R16.6's 62.5/73.5 and 67.5/73.5, as the
 * annex rounds them. The printed salaries follow the rounded percentages.
 */
export const ACT_SA_PERCENT = 0.85034;
export const ACT_SA4_PERCENT = 0.91836;
const ACT_SA23: number[] = [59_725, 61_158, 62_564, 63_988, 65_400, 66_968, 68_511, 70_049, 71_670];
const ACT_SA3: number[] = [66_968, 68_511, 70_049, 71_670];
const ACT_SA4: number[] = [79_668, 81_934, 83_849, 85_789];
const actRows = (prefix: string, values: number[], firstNote?: string) =>
  values.map((annual, i) => ({ label: `${prefix} pay point ${i + 1}`, annual, ...(i === 0 && firstNote ? { note: firstNote } : {}) }));

const ACT: SchoolSupportState = {
  slug: "act",
  code: "ACT",
  stateName: "Australian Capital Territory",
  roleName: "School Assistant",
  roleShort: "school assistant",
  employer: "ACT Education Directorate",
  instrument:
    "ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023 to 2026, approved by the Fair Work Commission on 13 September 2023 (AG2023/2959). Section R holds the Education Directorate conditions for School Assistants and Annex A prints their pay. The agreement passed its nominal expiry date on 31 March 2026 but keeps applying: the proposed 2026 to 2029 replacement was not approved by employees when voting closed on 8 September 2026, so the 4 December 2025 rates below are the rates in force.",
  headline:
    "A School Assistant in an ACT public school is paid $59,725 to $71,670 a year at School Assistant 2/3, $66,968 to $71,670 at School Assistant 3 and $79,668 to $85,789 at School Assistant 4, under the ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023 to 2026, rates from 4 December 2025. These are full annual salaries for the school-year pattern: 31.25 hours a week in term time for levels 1 to 3 and 33.75 for level 4, with paid stand-down between terms. A flat $1,500 a year School Support Allowance is paid on top. The agreement has passed its nominal expiry and no later rate is set.",
  metaTitle: "School Assistant Pay ACT 2026 - SA 2/3, 3 and 4 Salaries",
  metaDescription:
    "ACT School Assistant pay from 4 Dec 2025: SA 2/3 $59,725 to $71,670, SA 4 to $85,789, term-time hours, paid stand-down, the $1,500 allowance and take-home pay.",
  h1: "School Assistant Pay ACT 2026: Learning Support Assistant and School Assistant Salaries",
  fullTimeHours: 31.25,
  hoursNote:
    "Full-time School Assistants 1, 2, 2/3 and 3 work 125 hours over four weeks, an average of 31 hours 15 minutes a week and usually 6 hours 15 minutes a day; a School Assistant 4 works 67 hours 30 minutes a fortnight, or 33 hours 45 minutes a week (clauses R2.2 and R2.3). The annual salary is the ASO rate scaled to those hours: the ASO 1 to 3 salary times 62.5/73.5, and the ASO 4 salary times 67.5/73.5 (clause R16.6). It is not reduced again for stand-down (clause R16.7), so a full-time School Assistant who works the whole school year receives the printed figure. Part-time staff are paid for their designated hours.",
  startingPoint:
    "Your level follows your job title. Learning Support Assistants and administrative, library, technology, food technology and general assistants start at School Assistant 2/3, a broadband of nine pay points; preschool, bilingual, vision support and hearing support assistants and Aboriginal and Torres Strait Islander Education Workers start at School Assistant 3; administrative coordinators, wellbeing support workers, youth support workers and Aboriginal and Torres Strait Islander Education Officers start at School Assistant 4 (clause R16.2). School Assistant 1 ($55,378 to $58,501) is only used for trainees in ACTPS vocational employment programs (clause R16.3).",
  entry: { label: "School Assistant 2/3 pay point 1", annual: 59_725, annualBasis: "published" },
  tables: [
    {
      id: "act-2025",
      title: "School Assistants from 4 December 2025",
      status: "current",
      effectiveFrom: "4 December 2025",
      annualBasis: "published",
      caption:
        "Annex A of the agreement, School Assistant rows, column '1% + $1,000 from 04/12/2025'. Each figure is 85.034% of the matching ASO pay point (91.836% for School Assistant 4), which is how the annex labels them. The agreement prints no hourly rate for School Assistants.",
      sourceId: "act-admin-ea-2023",
      showHourly: false,
      rows: [
        ...actRows("School Assistant 2/3", ACT_SA23, "Learning Support Assistants start here (cl R16.2)"),
        ...actRows("School Assistant 3", ACT_SA3, "Preschool, bilingual, vision and hearing support assistants start here"),
        ...actRows("School Assistant 4", ACT_SA4, "Wellbeing and youth support workers, administrative coordinators start here"),
      ],
    },
  ],
  notes: [
    "The agreement's last increase was 1% plus $1,000 from the first full pay period on or after 1 December 2025 (4 December 2025), and it passed its nominal expiry on 31 March 2026. Employees voted down the proposed Administrative and Related Classifications Enterprise Agreement 2026 to 2029 in a ballot that closed on 8 September 2026, so no further increase is scheduled until a new agreement is made and approved by the Fair Work Commission.",
    "A temporary School Support Allowance of $1,500 a year is paid to every School Assistant 1 to 4 in equal fortnightly instalments for the life of the agreement (clause R16.8 and Annex C). It is a flat amount, paid once a pay period, and not paid for a full pay period of unpaid leave.",
    "The working days between published school terms are paid stand-down (clause R3.3). A School Assistant 4 works six extra days during those breaks, usually two in each, plus four professional learning days (clause R3.4). Annual leave of four weeks is taken in the block from the end of Term 4 to the last working day before Australia Day (clause R7.4).",
    "A temporary School Assistant moves up a pay point after 12 months of continuous service, or after 200 days worked at their ordinary hours if the service is broken; earlier service, including casual work, counts (clause R15). Casual School Assistants are engaged through the Directorate's casual register (clause R14.2).",
    "Every School Assistant does at least four days (25 hours) of professional learning a year, preferably in the stand-down periods (clause R13.5).",
  ],
  sources: [
    {
      id: "act-admin-ea-2023",
      title: "ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023 to 2026 (AG2023/2959), Section R and Annex A",
      publisher: "ACT Government (Chief Minister, Treasury and Economic Development Directorate)",
      url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0004/2287633/ACT-Public-Sector-Administrative-and-Related-Classifications-Enterprise-Agreement-2023-2026.pdf",
      effectiveFrom: "4 December 2025",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "Clauses R2.2, R2.3, R3, R7, R13.5, R14, R15, R16.2 to R16.8 and R17; Annex A School Assistant rows, column '1% + $1,000 from 04/12/2025'; Annex C School Support Allowance.",
    },
    {
      id: "act-agreements-portal",
      title: "Enterprise Agreements, ACTPS Employment Portal",
      publisher: "ACT Government",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "States that the proposed 2026 to 2029 agreement was not approved by employees (vote closed 8 September 2026) and that the 2023 to 2026 agreement continues to apply. Page dated 8 October 2026.",
    },
  ],
  faqs: [
    {
      q: "How much does a school assistant earn in the ACT?",
      a: "From 4 December 2025 a School Assistant 2/3 in an ACT public school is paid $59,725 to $71,670 a year across nine pay points, a School Assistant 3 $66,968 to $71,670 and a School Assistant 4 $79,668 to $85,789, plus the $1,500 a year School Support Allowance. These are the Annex A rates of the ACT Public Sector Administrative and Related Classifications Enterprise Agreement 2023 to 2026.",
    },
    {
      q: "What level does a Learning Support Assistant start on in the ACT?",
      a: "School Assistant 2/3, pay point 1, at $59,725 a year. The 2/3 broadband was created when the agreement started: every School Assistant 2 moved into it at the matching pay point and the old competency barrier between levels 2 and 3 was removed (clause R17).",
    },
    {
      q: "Why is an ACT school assistant paid less than an ASO at the same level?",
      a: "Because the salary is pro rata to the hours. A School Assistant 2/3 works 62.5 hours a fortnight against 73.5 for a full-time ASO, so the pay is the ASO rate times 62.5/73.5 (85.034%); a School Assistant 4 works 67.5 hours and gets 91.836% (clause R16.6). ASO 2 pay point 1 is $70,236, which becomes $59,725 for a School Assistant 2/3.",
    },
    {
      q: "When is the next ACT school assistant pay rise?",
      a: "None is set. The agreement's last rise was 1% plus $1,000 from 4 December 2025 and it passed its nominal expiry on 31 March 2026. The proposed 2026 to 2029 replacement was voted down in September 2026, so the next increase depends on a new agreement being made and approved by the Fair Work Commission.",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
  teacherPayHref: "/teacher-pay-australia/act/",
  publishedOn: "2026-10-22",
};

// ---------------------------------------------------------------------------
// NT: School-based Administrative Officers (92% and 96% arrangements),
// Northern Territory Public Sector 2025-2029 Enterprise Agreement, Schedule 11
// ---------------------------------------------------------------------------

type NtRow = [string, number, number, number]; // designation, 92% from 13 Aug 2026, 96% from 13 Aug 2026, 92% from 12 Aug 2027
const NT_ROWS: NtRow[] = [
  ["AO2 pay point 1", 58_817, 61_374, 60_875],
  ["AO2 pay point 2", 60_231, 62_849, 62_338],
  ["AO2 pay point 3", 61_361, 64_029, 63_509],
  ["AO2 pay point 4", 62_509, 65_227, 64_697],
  ["AO2 pay point 5", 63_688, 66_457, 65_917],
  ["AO3 pay point 1", 65_172, 68_005, 67_453],
  ["AO3 pay point 2", 66_358, 69_243, 68_680],
  ["AO3 pay point 3", 67_566, 70_503, 69_930],
  ["AO3 pay point 4", 70_026, 73_070, 72_477],
  ["AO4 pay point 1", 73_291, 76_477, 75_856],
  ["AO4 pay point 2", 74_576, 77_819, 77_186],
  ["AO4 pay point 3", 76_786, 80_124, 79_473],
  ["AO4 pay point 4", 78_998, 82_432, 81_762],
  ["AO4 pay point 5", 81_206, 84_736, 84_048],
  ["AO4 pay point 6", 83_558, 87_191, 86_483],
];

/** The 100% (full) AO rates already verified in lib/data/public-service-pay/nt.ts. */
const NT_AO_BANDS = NT_PUBLIC_SERVICE.schedules.find((s) => s.id === "nt-ea-2026")?.streams.flatMap((s) => s.bands) ?? [];
function ntFullRate(code: string): number {
  const band = NT_AO_BANDS.find((b) => b.code === code);
  if (!band) throw new Error(`school-support-pay: ${code} missing from nt.ts`);
  return band.min;
}
export const NT_FULL_AO_PAY_POINTS = NT_AO_BANDS.filter((b) => ["AO2", "AO3", "AO4"].includes(b.code)).flatMap((b) => b.payPoints ?? []);

const NT: SchoolSupportState = {
  slug: "nt",
  code: "NT",
  stateName: "Northern Territory",
  roleName: "School-based Administrative Officer",
  roleShort: "school-based AO",
  employer: "NT Department of Education and Training",
  instrument:
    "Northern Territory Public Sector 2025 to 2029 Enterprise Agreement, approved by the Fair Work Commission on 30 January 2026 (AG2025/4592) and operating from 6 February 2026. School-based administrative employees have their own set of conditions inside the agreement, with three employment arrangements (92%, 96% and 100%) at AO2 to AO4, and Schedule 11 prints a separate salary table for the 92% and 96% arrangements.",
  headline: `A school-based Administrative Officer in a Northern Territory government school is paid $58,817 a year at AO2 pay point 1 on the 92% arrangement (6 hours 15 minutes each school day), $61,374 on the 96% arrangement (7 hours 21 minutes) and ${formatSalary(ntFullRate("AO2"))} at 100%, from 13 August 2026 under the NTPS 2025 to 2029 Enterprise Agreement. The school-based scale runs to $83,558 (92%) or $87,191 (96%) at the top of AO4. Staff on 92% and 96% are paid at ordinary rates for the days the school is closed and do not attend. The next rise is 3.5% from 12 August 2027.`,
  metaTitle: "NT School Support Staff Pay 2026 - School-Based AO2 to AO4",
  metaDescription:
    "NT school support staff pay from 13 Aug 2026: school-based AO2 to AO4 at 92% ($58,817 to $83,558) and 96%, hours, holiday pay, the 2027 rise and take-home pay.",
  h1: "NT School Support Staff Pay 2026: School-Based AO2 to AO4 Rates",
  fullTimeHours: 36.75,
  hoursNote:
    "The nominal hours of duty for a school-based administrative employee are 36.75 a week, worked between 7.30am and 5.30pm Monday to Friday (clause 7.1 of the school-based conditions). The three arrangements in clause 7.2 decide the pay: 92% means 6 hours 15 minutes each school day, 96% means 7 hours 21 minutes each school day, and 100% means 7 hours 21 minutes every working day, school holidays included. The tables show the annual salary for each arrangement, as printed; the agreement has no separate hourly rate. Overtime starts after 7 hours 21 minutes in a day (clause 7.4).",
  startingPoint:
    "School-based positions are created at AO2, AO3 or AO4 on a 92%, 96% or 100% arrangement, and a filled position can be converted between them on a proposal from the employee or the CEO (clause 7.9, which calls them School Assistant positions). A new employee starts at pay point 1 of the designation and moves up one pay point after 12 months at a point, or 12 months of broken service in the preceding 24 months (clause 36.2). Part-time staff progress on the same calendar time (clause 36.3).",
  entry: { label: "AO2 pay point 1 (92%)", annual: 58_817, annualBasis: "published" },
  tables: [
    {
      id: "nt-92-2026",
      title: "School-based Administrative Officers on the 92% arrangement, from 13 August 2026",
      status: "current",
      effectiveFrom: "13 August 2026",
      annualBasis: "published",
      caption:
        "Schedule 11 of the agreement, table 'School-Based Administrative Officers (92%)', column 'salary rates effective 13.08.26'. Each figure is 92% of the full AO rate on our NT public service page, rounded to the dollar.",
      sourceId: "nt-ea-2025",
      showHourly: false,
      rows: NT_ROWS.map(([label, a92], i) => ({ label, annual: a92, ...(i === 0 ? { note: "New school-based AO2s start here" } : {}) })),
    },
    {
      id: "nt-96pc-2026",
      title: "School-based Administrative Officers on the 96% arrangement, from 13 August 2026",
      status: "current",
      effectiveFrom: "13 August 2026",
      annualBasis: "published",
      caption:
        "Schedule 11, table 'School-Based Administrative Officers (96%)', column 'salary rates effective 13.08.26': 96% of the full AO rate. The 100% arrangement is paid at the full rate, listed on our NT public service page.",
      sourceId: "nt-ea-2025",
      showHourly: false,
      rows: NT_ROWS.map(([label, , a96]) => ({ label, annual: a96 })),
    },
    {
      id: "nt-92-2027",
      title: "92% arrangement from 12 August 2027 (3.5% increase)",
      status: "upcoming",
      effectiveFrom: "12 August 2027",
      annualBasis: "published",
      caption:
        "Schedule 11, 92% table, column 'salary rates effective 12.08.27': the 3.5% increase from the first full pay period on or after 10 August 2027 (clause 35.3). A further 3.5% follows from 10 August 2028, with any Darwin CPI above 3.5% added.",
      sourceId: "nt-ea-2025",
      showHourly: false,
      rows: NT_ROWS.map(([label, , , a92next]) => ({ label, annual: a92next })),
    },
  ],
  notes: [
    `The 100% arrangement is paid at the standard NTPS rate: ${formatSalary(ntFullRate("AO2"))} at AO2 pay point 1, ${formatSalary(ntFullRate("AO3"))} at AO3 and ${formatSalary(ntFullRate("AO4"))} at AO4 from 13 August 2026, with every pay point on the NT public service pay scales page. The school vacation, extra duty and leave loading clauses below do not apply to 100% staff (clause 7.2).`,
    "Staff on 92% and 96% are not required to attend on days the school is closed, apart from the two working days before the school year starts, and are paid at ordinary rates for those days (clause 7.3). Recreation leave is taken in the December and January holidays. If the principal needs you on a non-school day you are paid an extra half of normal time on top of salary, or time and a half on a public holiday (clause 7.3(e)).",
    "Recreation leave loading is paid automatically in the last pay before 25 December each year (clause 7.5). Someone employed for less than the full school year is paid for the term and end-of-year holidays pro rata, for each completed month of service (clause 7.3(f)).",
    "Pay rises under the agreement: 3% from 17 November 2025, 3% from 13 August 2026, 3.5% from 12 August 2027 and 3.5% from 10 August 2028, plus any Darwin CPI above 3.5% in the final year (clause 35.3).",
    "Assistant Teachers in NT schools (AT1 to AT7) are on the teachers' agreement, not this one; their rates are on the NT teacher pay page.",
  ],
  sources: [
    {
      id: "nt-ea-2025",
      title: "Northern Territory Public Sector 2025 to 2029 Enterprise Agreement (AG2025/4592), School-Based Administrative Employees conditions and Schedule 11",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/__data/assets/pdf_file/0008/1590713/ntps-2025-2029-enterprise-agreement.pdf",
      effectiveFrom: "13 August 2026",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "Clauses 7.1 to 7.9 of the School-Based Administrative Employees conditions; Schedule 11 tables 'School-Based Administrative Officers (92%)' and '(96%)', columns 13.08.26 and 12.08.27; clauses 35.3, 36.2 and 36.3.",
    },
    {
      id: "nt-ocpe-admin-rates",
      title: "General NTPS, administrative stream, rates of pay (rates effective 13 August 2026)",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/general-ntps-administrative-stream",
      effectiveFrom: "13 August 2026",
      verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
      note: "The full (100%) AO2 to AO4 rates that the 92% and 96% figures are scaled from.",
    },
  ],
  faqs: [
    {
      q: "How much does a school support officer earn in the NT?",
      a: `From 13 August 2026 a school-based Administrative Officer at AO2 pay point 1 is paid $58,817 a year on the 92% arrangement, $61,374 on 96% and ${formatSalary(ntFullRate("AO2"))} on 100%. AO3 starts at $65,172 (92%) or $68,005 (96%), and AO4 at $73,291 (92%) or $76,477 (96%), under the NTPS 2025 to 2029 Enterprise Agreement.`,
    },
    {
      q: "What is the difference between a 92% and a 96% school-based AO in the NT?",
      a: `Hours per school day. A 92% employee works 6 hours 15 minutes each school day and a 96% employee 7 hours 21 minutes, against 36.75 hours a week for a 100% employee, who also works through the school holidays (clause 7.2). Pay is scaled the same way: AO2 pay point 1 is $58,817, $61,374 or ${formatSalary(ntFullRate("AO2"))}.`,
    },
    {
      q: "Are NT school-based AOs paid during school holidays?",
      a: "Yes. On the 92% and 96% arrangements you are not required to attend when the school is closed, apart from two working days before the school year, and you are paid at ordinary rates for those days (clause 7.3). The lower percentage is what pays for that time. Recreation leave is taken in the December and January break.",
    },
    {
      q: "When is the next pay rise for NT school support staff?",
      a: "3.5% from the first full pay period on or after 10 August 2027 (12 August 2027), taking AO2 pay point 1 on the 92% arrangement from $58,817 to $60,875. Another 3.5% follows from 10 August 2028, with any Darwin CPI above 3.5% added on.",
    },
  ],
  verifiedOn: SCHOOL_SUPPORT_VERIFIED_ON_H3,
  teacherPayHref: "/teacher-pay-australia/nt/",
  publishedOn: "2026-10-22",
};

// ---------------------------------------------------------------------------

export const SCHOOL_SUPPORT_STATES: readonly SchoolSupportState[] = [NSW, VIC, QLD, WA, SA_SSO, TAS, ACT, NT];
export const SCHOOL_SUPPORT_SLUGS: readonly SchoolSupportStateSlug[] = SCHOOL_SUPPORT_STATES.map((s) => s.slug);

/** States we looked for and could not verify, listed on the hub. Empty since H3 (22 October 2026). */
export const SCHOOL_SUPPORT_NOT_BUILT: readonly string[] = [];

export function getSchoolSupportState(slug: string): SchoolSupportState | undefined {
  return SCHOOL_SUPPORT_STATES.find((s) => s.slug === slug);
}

export { derive as deriveFullTimeAnnual };

export const SCHOOL_SUPPORT_HUB_FAQS: readonly PayFaq[] = [
  {
    q: "How much do teacher aides get paid in Australia?",
    a: `It depends on the state and whether the school is government or non-government. In government schools the entry rate is $38.33 an hour for an SLSO 1 in NSW (from 1 July 2026), $36.2775 for a Tasmanian Teacher Assistant at Band 2 Level 2 (from 1 December 2025), $31.6921 for a Queensland OO2 teacher aide (from 1 November 2025), $34.75 for a WA Education Assistant (from 1 January 2026), ${formatSalary(SSO1.min)} a year for a South Australian SSO-1 (from May 2026), $51,622 a year full-time for Victorian ES 1-1, $59,725 for an ACT School Assistant 2/3 (from 4 December 2025) and $58,817 for an NT school-based AO2 on the 92% arrangement (from 13 August 2026). Private and Catholic schools use the Educational Services (Schools) General Staff Award.`,
  },
  {
    q: "Are teacher aides paid during school holidays?",
    a: "It depends on the state and the contract. NSW permanent SLSOs are paid in 26 equal fortnightly pays across the year, and long-term temporaries are paid in school vacations; short-term temporaries get a 15% loading instead of recreation leave. Casual Education Assistants in WA get a 25% loading instead of personal leave and paid student vacation time. Victorian ES staff on a term-time fraction are paid a proportion of the full-time salary. Tasmanian Teacher Assistants are paid for school terms only unless they elect to annualise their pay over 52 weeks. ACT School Assistants are on paid stand-down between terms, with annual leave in the December to January block. NT school-based AOs on the 92% or 96% arrangement are paid at ordinary rates for the days the school is closed.",
  },
  {
    q: "What is a teacher aide called in each state?",
    a: "School Learning Support Officer (SLSO) in NSW, Education Support (ES) staff in Victoria, teacher aide in Queensland, Education Assistant (EA) in Western Australia, School Services Officer (SSO) in South Australia, Teacher Assistant in Tasmania, School Assistant (most often a Learning Support Assistant) in the ACT, and school-based Administrative Officer (AO2 to AO4) in the Northern Territory.",
  },
  {
    q: "Which states pay teacher aides across the school holidays?",
    a: "NSW permanent SLSOs, Victorian ES staff on a 52/52 basis, Queensland teacher aides, SA SSOs with leave conditions, ACT School Assistants and NT school-based AOs on 92% or 96% all receive their annual salary across the year, with the school holidays covered by paid stand-down or recreation leave. WA Education Assistants and Tasmanian Teacher Assistants are paid for the weeks they work, with recreation leave and public holidays paid on top, unless they choose to annualise.",
  },
];
