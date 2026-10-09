// =============================================================================
// Health professional salary pages (/job-pay-rates/{slug}/) for jobs where no
// modern award sets most people's pay: dentist, radiologist, anaesthetist,
// optometrist, GP and surgeon.
//
// These are not award pages. The occupation pay-rate pages in
// lib/data/job-pay-rates/ lead with an award minimum; these lead with what the
// ATO's tax-return statistics and Jobs and Skills Australia say people in the
// job are actually paid, then show what that pay looks like after tax and on a
// payslip. The doctor award page (/job-pay-rates/doctor/) stays the hub for
// the Medical Practitioners Award; every page here links up to it.
//
// NOTHING here is estimated. Every dollar figure was read from the source
// named beside it, and a figure we could not read from a primary source is
// listed in `notShown` rather than filled in.
// =============================================================================

export const HEALTH_SALARY_SLUGS = ["dentist", "radiologist", "anaesthetist", "optometrist", "gp", "surgeon"] as const;

export type HealthSalarySlug = (typeof HEALTH_SALARY_SLUGS)[number];

/**
 * One row of ATO Taxation statistics 2023–24, Individuals Table 15, exactly as
 * published (whole dollars). Averages and medians of taxable income and total
 * income cover everyone who reported at that label; salary or wage figures
 * cover only people who reported a non-zero salary or wage (Table 15, note 5).
 */
export interface AtoRow {
  /** "Total", "Female", "Male", a state, or an occupation title. */
  label: string;
  individuals: number;
  averageTaxableIncome: number;
  medianTaxableIncome: number;
  averageSalaryOrWages: number;
  medianSalaryOrWages: number;
  averageTotalIncome: number;
  medianTotalIncome: number;
}

/** A table of ATO rows as the page shows it. */
export interface AtoTable {
  id: string;
  title: string;
  /** Which part of Table 15 the rows come from, e.g. "Table 15A". */
  part: "Table 15A" | "Table 15B" | "Table 15D" | "Tables 15A and 15B";
  /** One or two sentences: what the rows cover and any caveat. */
  intro: string;
  /** Row-label column heading, e.g. "Sex" or "State or territory". */
  rowHeading: string;
  rows: AtoRow[];
}

/** Jobs and Skills Australia occupation-profile median (ABS SEEH, May 2025). */
export interface JsaFigures {
  anzscoCode: string;
  anzscoTitle: string;
  /** Median full-time earnings per week, whole dollars. */
  medianWeekly: number;
  /** Median hourly earnings, whole dollars. */
  medianHourly: number;
  /** Share of workers who work full-time hours (ABS Labour Force Survey, 2025). */
  fullTimeShare: number;
  /** Average full-time hours worked per week (ABS 2021 Census). */
  averageFullTimeHours: number;
  url: string;
  /** When the ANZSCO unit group is wider than the job, say so. */
  caveat?: string;
}

/** One step of a public hospital staff specialist salary scale. */
export interface SpecialistStep {
  label: string;
  /** Annual base salary, exactly as the instrument prints it. */
  annual: number;
  /** The same step with a published all-purpose allowance added, where the instrument prints that figure. */
  withAllowance?: number;
}

export interface StaffSpecialistScale {
  state: "NSW" | "VIC" | "QLD";
  /** The instrument's name as published. */
  instrument: string;
  /** Official URL the rates were read from. */
  url: string;
  publisher: string;
  /** "Rates from …" exactly as the schedule dates them. */
  effectiveFrom: string;
  steps: SpecialistStep[];
  /** Column heading for `withAllowance`, when the scale has one. */
  allowanceColumn?: string;
  /** What the base salary does and does not include. */
  note: string;
}

/** An award minimum table, for the one job here with an award classification of its own (GP). */
export interface AwardMinimumTable {
  title: string;
  intro: string;
  rows: { label: string; annual: number; weekly: number; hourly: number }[];
  footnote: string;
}

/** A sentence with one internal link in it, rendered as before + <Link>anchor</Link> + after. */
export interface InlineLink {
  before: string;
  anchor: string;
  href: string;
  after: string;
}

/** A gross figure the after-tax table works through. */
export interface TakeHomeScenario {
  label: string;
  gross: number;
  /** Where the gross figure comes from, shown under the label. */
  source: string;
}

export interface HealthSalaryFaq {
  q: string;
  a: string;
}

export interface HealthSalarySource {
  title: string;
  publisher: string;
  url: string;
}

export interface HealthSalaryPage {
  slug: HealthSalarySlug;
  /** Singular, title case: "Dentist", "GP". */
  name: string;
  /** Plural, lower case, for mid-sentence use: "dentists", "GPs". */
  plural: string;
  /** <title>, which leads with the answer. */
  metaTitle: string;
  metaDescription: string;
  /** H1. */
  heading: string;
  /** ATO occupation the page is about, e.g. "252312 Dentist". */
  atoOccupation: string;
  /** The ATO 2023–24 "Total" row for that occupation; the page leads with it. */
  ato: AtoRow;
  /** Female and male rows for the same occupation (Table 15A). */
  atoBySex: AtoRow[];
  /** Further ATO tables unique to the job (by specialty, by state, a comparison). */
  atoTables: AtoTable[];
  jsa: JsaFigures | null;
  coverageHeading: string;
  coverage: string[];
  /** The link out of the coverage section: up to the doctor award page, or across to the award that does apply. */
  upLink: InlineLink;
  awardTable?: AwardMinimumTable;
  /** Show the public hospital staff specialist scales. */
  staffSpecialist: boolean;
  /** Extra paragraph under the staff specialist scales, specific to the job. */
  staffSpecialistNote?: string;
  scenarios: TakeHomeScenario[];
  /** "On your payslip" paragraphs. */
  payslip: string[];
  notices: string[];
  notShown: string[];
  faqs: HealthSalaryFaq[];
  sources: HealthSalarySource[];
  related: { href: string; label: string }[];
  /** Date every figure was read from its source. */
  verifiedOn: string;
  /** ISO date for JSON-LD. */
  dateModified: string;
}
