// =============================================================================
// APS grade pages (J6, wave 4): /public-service-pay-scales/aps/{aps-3,...,el2}/.
//
// The APS-wide figures (APSC percentiles at 31 Dec 2025 and the service-wide
// salary thresholds from 12 March 2026) and the Treasury example are NOT
// retyped here: they are read from ./aps.ts. This file adds four more agency
// enterprise agreements as worked examples, each read directly from the
// agreement's own "from 12 March 2026" column on 24 September 2026:
//
//   - ATO Enterprise Agreement 2024, Attachment A, Schedule 1 (pay points —
//     the table does not number them, so they are labelled 1..n in order);
//   - Services Australia Enterprise Agreement 2024–2027, Table C1 (min/max);
//   - Department of Home Affairs Enterprise Agreement 2024–27, Attachment A
//     general salary table (min/max, with Australian Border Force titles);
//   - Defence Enterprise Collective Agreement 2024, Annex A Table 1 (base/top).
//
// Sanity checks run at research time (and asserted in the tests where they are
// structural): every ATO figure is its 13 March 2025 figure × 1.034 within
// rounding; the min/max agencies' figures either follow the same rule or equal
// the APS-wide threshold exactly (the pay fragmentation mechanism lifting them).
// One printed exception is kept as printed and flagged on the page: Defence's
// APS 6 base of $99,733 is $1 under the $99,734 threshold.
// =============================================================================

import { APS } from "./aps";
import type { ClassificationBand, PayFaq, PayPoint, PaySource } from "./types";
import { formatSalary } from "./types";

export type ApsGradeSlug = "aps-3" | "aps-4" | "aps-5" | "aps-6" | "el1" | "el2";
export type ApsGradeCode = "APS 3" | "APS 4" | "APS 5" | "APS 6" | "EL 1" | "EL 2";

export interface ApsGrade {
  slug: ApsGradeSlug;
  code: ApsGradeCode;
  /** As searched: "APS 6", "EL1". */
  label: string;
  /** Common alternative spellings, used once in the intro. */
  alsoCalled: string;
  /** Job titles commonly attached to the level (from the agreements quoted). */
  typicalTitle?: string;
}

export const APS_GRADES: readonly ApsGrade[] = [
  { slug: "aps-3", code: "APS 3", label: "APS 3", alsoCalled: "APS3 or APS Level 3" },
  { slug: "aps-4", code: "APS 4", label: "APS 4", alsoCalled: "APS4 or APS Level 4" },
  { slug: "aps-5", code: "APS 5", label: "APS 5", alsoCalled: "APS5 or APS Level 5" },
  { slug: "aps-6", code: "APS 6", label: "APS 6", alsoCalled: "APS6 or APS Level 6" },
  { slug: "el1", code: "EL 1", label: "EL1", alsoCalled: "EL 1 or Executive Level 1", typicalTitle: "Assistant Director" },
  { slug: "el2", code: "EL 2", label: "EL2", alsoCalled: "EL 2 or Executive Level 2", typicalTitle: "Director" },
];

export const APS_GRADE_SLUGS: readonly ApsGradeSlug[] = APS_GRADES.map((g) => g.slug);

export const APS_GRADES_VERIFIED_ON = "24 September 2026";

export interface AgencyScale {
  id: string;
  agency: string;
  agreement: string;
  /** "points" = every pay point listed; "range" = the agreement gives only a min and max. */
  kind: "points" | "range";
  effectiveFrom: string;
  source: PaySource;
  levels: Record<ApsGradeCode, readonly PayPoint[]>;
  /** Extra line under the agency's row for a specific level. */
  levelNotes?: Partial<Record<ApsGradeCode, string>>;
}

const pts = (prefix: string, values: number[]): PayPoint[] =>
  values.map((annual, i) => ({ label: `${prefix} pay point ${i + 1}`, annual }));
const range = (min: number, max: number): PayPoint[] => [
  { label: "Minimum", annual: min },
  { label: "Maximum", annual: max },
];

export const AGENCY_SCALES: readonly AgencyScale[] = [
  {
    id: "ato",
    agency: "Australian Taxation Office",
    agreement: "ATO Enterprise Agreement 2024",
    kind: "points",
    effectiveFrom: "12 March 2026",
    source: {
      id: "ato-ea",
      title: "ATO Enterprise Agreement 2024 — Attachment A, Schedule 1: Pay rates",
      publisher: "Australian Taxation Office",
      url: "https://www.ato.gov.au/careers/why-join-us/salary-leave-and-conditions/ato-enterprise-agreement-2024/attachments/attachment-a",
      effectiveFrom: "12 March 2026",
      verifiedOn: APS_GRADES_VERIFIED_ON,
      note: "Column \"3.4% salary increase: From 12 March 2026\". Pay points are unnumbered rows in the table and are labelled here in order.",
    },
    levels: {
      "APS 3": pts("APS 3", [75_431, 77_380, 79_337, 81_381]),
      "APS 4": pts("APS 4", [84_028, 86_683, 88_933, 91_199]),
      "APS 5": pts("APS 5", [93_676, 96_596, 99_307]),
      "APS 6": pts("APS 6", [101_142, 103_648, 106_477, 111_815, 116_131]),
      "EL 1": pts("EL 1", [129_551, 135_396, 141_239]),
      "EL 2": pts("EL 2", [155_911, 161_109, 166_313, 171_516, 176_717, 181_216, 185_713]),
    },
  },
  {
    id: "services-australia",
    agency: "Services Australia",
    agreement: "Services Australia Enterprise Agreement 2024–2027",
    kind: "range",
    effectiveFrom: "12 March 2026",
    source: {
      id: "services-australia-ea",
      title: "Services Australia Enterprise Agreement 2024–2027 — Table C1, General Employment Stream",
      publisher: "Services Australia",
      url: "https://www.servicesaustralia.gov.au/sites/default/files/2024-04/services-australia-agreement-2024-2027.pdf",
      effectiveFrom: "12 March 2026",
      verifiedOn: APS_GRADES_VERIFIED_ON,
      note: "Column \"Salary bands from 12 March 2026\". The agreement sets a minimum and maximum for each level; new starters are paid the minimum unless the Agency Head decides otherwise (cl C2.1).",
    },
    levels: {
      "APS 3": range(71_170, 79_320),
      "APS 4": range(79_322, 87_886),
      "APS 5": range(88_834, 96_829),
      "APS 6": range(99_734, 113_242),
      "EL 1": range(122_493, 135_731),
      "EL 2": range(141_751, 168_571),
    },
  },
  {
    id: "home-affairs",
    agency: "Department of Home Affairs",
    agreement: "Department of Home Affairs Enterprise Agreement 2024–27",
    kind: "range",
    effectiveFrom: "12 March 2026",
    source: {
      id: "home-affairs-ea",
      title: "Department of Home Affairs Enterprise Agreement 2024–27 — Attachment A, general salary table",
      publisher: "Department of Home Affairs",
      url: "https://www.homeaffairs.gov.au/ea/Documents/enterprise-agreement-2024-27.pdf",
      effectiveFrom: "12 March 2026",
      verifiedOn: APS_GRADES_VERIFIED_ON,
      note: "Column \"From 12 March 2026\". Minimum and maximum for each level; the same table covers the Australian Border Force equivalents.",
    },
    levels: {
      "APS 3": range(70_477, 79_403),
      "APS 4": range(79_476, 86_246),
      "APS 5": range(88_834, 96_829),
      "APS 6": range(99_734, 111_701),
      "EL 1": range(121_755, 139_450),
      "EL 2": range(140_893, 183_347),
    },
    levelNotes: {
      "APS 3": "Also Border Force Officer.",
      "APS 4": "Also Leading Border Force Officer.",
      "APS 5": "Also Senior Border Force Officer.",
      "APS 6": "Also Border Force Supervisor.",
      "EL 1": "Also Border Force Inspector.",
      "EL 2": "Also Border Force Superintendent.",
    },
  },
  {
    id: "defence",
    agency: "Department of Defence",
    agreement: "Defence Enterprise Collective Agreement 2024",
    kind: "range",
    effectiveFrom: "12 March 2026",
    source: {
      id: "defence-deca",
      title: "Defence Enterprise Collective Agreement 2024 — Annex A, Table 1: Standard classifications",
      publisher: "Department of Defence",
      url: "https://www.defence.gov.au/sites/default/files/2024-04/Defence-Enterprise-Collective-Agreement-2024.pdf",
      effectiveFrom: "12 March 2026",
      verifiedOn: APS_GRADES_VERIFIED_ON,
      note: "Column \"From 12 March 2026\" (base and top of each range). Clause C7.4 sets a 15.4% employer superannuation contribution for PSSap and other accumulation-fund members.",
    },
    levels: {
      "APS 3": range(72_275, 79_635),
      "APS 4": range(81_868, 89_377),
      "APS 5": range(89_841, 96_829),
      // As printed: $1 under the APS 6 threshold minimum of $99,734.
      "APS 6": range(99_733, 112_431),
      "EL 1": range(124_393, 140_315),
      "EL 2": range(144_430, 173_359),
    },
    levelNotes: {
      "APS 6": "The agreement prints the APS 6 base as $99,733, $1 below the APS-wide threshold of $99,734. We show it as printed.",
      "EL 2": "Defence also has two higher EL 2 bands: EL 2.1 at $173,360 to $206,309 and EL 2.2 at $206,310 to $232,096.",
    },
  },
];

/** Clause C7.4 of the Defence agreement, the agency-level confirmation of 15.4%. */
export const DEFENCE_SUPER_CLAUSE =
  "Defence will provide an employer contribution of 15.4% of the employee's Ordinary Time Earnings (OTE) for employees who are members of the Public Sector Superannuation Accumulation Plan (PSSap) and employees in other accumulation funds.";

// ---------- lookups over ./aps.ts ----------

function bandIn(scheduleId: string, code: ApsGradeCode): ClassificationBand {
  const schedule = APS.schedules.find((s) => s.id === scheduleId);
  const band = schedule?.streams.flatMap((s) => s.bands).find((b) => b.code === code);
  if (!band) throw new Error(`aps-grades: ${code} missing from APS schedule ${scheduleId}`);
  return band;
}

export function getApsGrade(slug: string): ApsGrade | undefined {
  return APS_GRADES.find((g) => g.slug === slug);
}

/** "APS 6" / "EL 1" (a level-section label on /aps/) -> the grade page, if one exists. */
export function apsGradeHrefForLabel(label: string): string | undefined {
  const grade = APS_GRADES.find((g) => g.code === label);
  return grade ? `/public-service-pay-scales/aps/${grade.slug}/` : undefined;
}

export interface AgencyRow {
  scale: AgencyScale;
  points: readonly PayPoint[];
  min: number;
  max: number;
  note?: string;
}

export interface ApsGradeData {
  grade: ApsGrade;
  /** APSC percentiles at 31 Dec 2025 (min = 5th, max = 95th). */
  survey: ClassificationBand;
  /** Service-wide salary thresholds from 12 March 2026. */
  threshold: ClassificationBand;
  /** Treasury Enterprise Agreement 2024, from ./aps.ts. */
  treasury: ClassificationBand;
  agencies: AgencyRow[];
  /** The grade below and above, for the "other levels" links. */
  previous?: ApsGrade;
  next?: ApsGrade;
}

export function apsGradeData(slug: ApsGradeSlug): ApsGradeData {
  const index = APS_GRADES.findIndex((g) => g.slug === slug);
  const grade = APS_GRADES[index];
  const agencies = AGENCY_SCALES.map((scale) => {
    const points = scale.levels[grade.code];
    const values = points.map((p) => p.annual);
    return {
      scale,
      points,
      min: Math.min(...values),
      max: Math.max(...values),
      note: scale.levelNotes?.[grade.code],
    };
  });
  return {
    grade,
    survey: bandIn("apsc-2025", grade.code),
    threshold: bandIn("aps-thresholds-2026", grade.code),
    treasury: bandIn("treasury-2026", grade.code),
    agencies,
    previous: index > 0 ? APS_GRADES[index - 1] : undefined,
    next: index < APS_GRADES.length - 1 ? APS_GRADES[index + 1] : undefined,
  };
}

/** Lowest and highest figure across the agency examples, Treasury included. */
export function agencySpread(d: ApsGradeData): { min: number; max: number } {
  const mins = [...d.agencies.map((a) => a.min), d.treasury.min];
  const maxs = [...d.agencies.map((a) => a.max), d.treasury.max];
  return { min: Math.min(...mins), max: Math.max(...maxs) };
}

/** APS median employer super rate (APSC, every classification, 2025). */
export const APS_SUPER_RATE = APS.superannuation.rate ?? 15.4;

/**
 * Grade-page questions. Pure strings from the data above, so the visible
 * accordion and the FAQPage JSON-LD read the same array.
 */
export function apsGradeFaqs(d: ApsGradeData): PayFaq[] {
  const { grade, survey, threshold, treasury } = d;
  const ato = d.agencies.find((a) => a.scale.id === "ato")!;
  const sa = d.agencies.find((a) => a.scale.id === "services-australia")!;
  const spread = agencySpread(d);
  const faqs: PayFaq[] = [
    {
      q: `What is the ${grade.label} salary in 2026?`,
      a: `There is no single ${grade.label} salary because each APS agency has its own enterprise agreement. From 12 March 2026 every agency's ${grade.label} range must start at no less than ${formatSalary(threshold.min)} and reach at least ${formatSalary(threshold.max)}. Across the APS at 31 December 2025 the median ${grade.label} base salary was ${formatSalary(survey.median ?? 0)}, with 90% of ${grade.label} employees paid between ${formatSalary(survey.min)} and ${formatSalary(survey.max)}.`,
    },
    {
      q: `What is the ${grade.label} pay rate at the ATO?`,
      a: `Under the ATO Enterprise Agreement 2024, ${grade.label} has ${ato.points.length} pay points from 12 March 2026, from ${formatSalary(ato.min)} to ${formatSalary(ato.max)} a year. How you move between pay points is set by the agreement's salary progression rules.`,
    },
    {
      q: `How much does Services Australia pay an ${grade.label}?`,
      a: `The Services Australia Enterprise Agreement 2024–2027 sets a ${grade.label} salary band of ${formatSalary(sa.min)} to ${formatSalary(sa.max)} a year from 12 March 2026. New starters are paid the minimum unless the Agency Head decides on a higher point.`,
    },
    {
      q: `Which agency pays ${grade.label} the most?`,
      a: `Among the five agreements on this page (ATO, Services Australia, Home Affairs, Defence and Treasury), ${grade.label} ranges run from ${formatSalary(spread.min)} to ${formatSalary(spread.max)} from 12 March 2026. Treasury pays ${grade.label} from ${formatSalary(treasury.min)} to ${formatSalary(treasury.max)}. The ranges overlap, so where you start in the range matters as much as the agency.`,
    },
    {
      q: `How much super does an ${grade.label} get?`,
      a: `The median APS employer superannuation contribution was ${APS_SUPER_RATE}% of base salary at every classification in 2025, well above the 12% Superannuation Guarantee. On the ${grade.label} threshold minimum of ${formatSalary(threshold.min)}, 15.4% is ${formatSalary(threshold.min * 0.154)} a year on top of salary.`,
    },
  ];
  return faqs;
}
