// =============================================================================
// ATO tax-table publication metadata — FY2026-27
//
// Everything in this file was read directly from ato.gov.au on 28 July 2026 and
// is *publication* metadata (NAT numbers, document URLs, the ATO's own printed
// lookup bands). It deliberately contains NO withholding amounts: every dollar
// figure rendered on the tax-table pages is computed at render time by
// lib/constants/payg-withholding.ts, which implements the ATO Schedule 1
// coefficient method and is regression-tested against the ATO's worked
// examples.
//
// Verification, 28 July 2026:
//   - Tax tables index (QC16945) confirmed NAT 1005 / 1006 / 1007 / 3348.
//   - Each PDF and XLSX URL below returned HTTP 200. The PDFs self-identify as
//     "Pay as you go (PAYG) withholding - NAT 100x - ... tax table"; the XLSX
//     files open on sheets named "NAT1005 Lookup" / "NAT1006 Lookup" /
//     "NAT1007 Lookup".
//   - The XLSX lookup tools publish the Schedule 1 coefficients. SCALE 1,
//     SCALE 2, SCALE 3 and the stand-alone HELP scales in those files match
//     SCALE_1_NO_TFT, SCALE_2_TFT, SCALE_3_FOREIGN, STSL_TFT and STSL_NO_TFT in
//     lib/constants/payg-withholding.ts digit for digit.
// =============================================================================

export interface AtoScheduleDoc {
  /** ATO form number, e.g. "NAT 1005". */
  readonly nat: string;
  /** Full title as published by the ATO. */
  readonly title: string;
  /** Landing page on ato.gov.au. */
  readonly pageUrl: string;
  /** Printable look-up table (PDF), where the ATO publishes one. */
  readonly pdfUrl?: string;
  readonly pdfLabel?: string;
  /** Withholding look-up tool (XLSX), where the ATO publishes one. */
  readonly xlsxUrl?: string;
  readonly xlsxLabel?: string;
  /** Date the ATO published the current edition. */
  readonly published: string;
  /** ATO quick code for the page. */
  readonly qc: string;
}

export const ATO_WEEKLY: AtoScheduleDoc = {
  nat: "NAT 1005",
  title: "Weekly tax table",
  pageUrl: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly",
  pdfUrl: "https://www.ato.gov.au/api/public/content/9356e28f9fba4e61b4082bf60172c6fe?v=f4ff8f6b",
  pdfLabel: "Weekly tax table look-up (PDF, 1.2MB)",
  xlsxUrl: "https://www.ato.gov.au/api/public/content/9f1eef6f5ed8415e8e9da14004e094a2?v=5526fbcd",
  xlsxLabel: "Weekly withholding look-up tool (XLSX, 26KB)",
  published: "17 June 2026",
  qc: "QC107134",
};

export const ATO_FORTNIGHTLY: AtoScheduleDoc = {
  nat: "NAT 1006",
  title: "Fortnightly tax table",
  pageUrl: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-fortnightly",
  pdfUrl: "https://www.ato.gov.au/api/public/content/c8f672e3421f4c018fccfdf0591ec619?v=d970ded4",
  pdfLabel: "Fortnightly tax table look-up (PDF, 1.2MB)",
  xlsxUrl: "https://www.ato.gov.au/api/public/content/c9281076d816416580fde626c61def30?v=cf61e5ed",
  xlsxLabel: "Fortnightly withholding look-up tool (XLSX, 26KB)",
  published: "17 June 2026",
  qc: "QC107135",
};

export const ATO_MONTHLY: AtoScheduleDoc = {
  nat: "NAT 1007",
  title: "Monthly tax table",
  pageUrl: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-monthly",
  pdfUrl: "https://www.ato.gov.au/api/public/content/9113e54234e4495b81a8081481ff8856?v=0dddd56f",
  pdfLabel: "Monthly tax table look-up (PDF, 1.1MB)",
  xlsxUrl: "https://www.ato.gov.au/api/public/content/fce02c910c3641f18a132e729954708d?v=52c3afac",
  xlsxLabel: "Monthly withholding look-up tool (XLSX, 26KB)",
  published: "17 June 2026",
  qc: "QC107136",
};

export const ATO_SCHEDULE_5: AtoScheduleDoc = {
  nat: "NAT 3348",
  title: "Schedule 5 – Tax table for back payments, commissions, bonuses and similar payments",
  pageUrl:
    "https://www.ato.gov.au/tax-rates-and-codes/schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments",
  // The ATO publishes Schedule 5 as web content only for 2026-27 — it is not in
  // the asterisked "downloadable look-up table" list on the tax tables index.
  published: "17 June 2026",
  qc: "QC107123",
};

export const ATO_SCHEDULE_1: AtoScheduleDoc = {
  nat: "NAT 1004",
  title: "Schedule 1 – Statement of formulas for calculating amounts to be withheld",
  pageUrl:
    "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld",
  published: "17 June 2026",
  qc: "QC107122",
};

export const ATO_SCHEDULE_8: AtoScheduleDoc = {
  nat: "NAT 3539",
  title:
    "Schedule 8 – Statement of formulas for calculating study and training support loans components",
  pageUrl:
    "https://www.ato.gov.au/tax-rates-and-codes/schedule-8-statement-of-formulas-for-calculating-study-and-training-support-loans-components",
  published: "17 June 2026",
  qc: "QC107128",
};

export const ATO_TAX_TABLES_INDEX =
  "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview";

export const ATO_TFN_DECLARATION =
  "https://www.ato.gov.au/forms-and-instructions/tfn-declaration";

export const ATO_WITHHOLDING_DECLARATION =
  "https://www.ato.gov.au/forms-and-instructions/withholding-declaration";

export const ATO_TAX_WITHHELD_CALCULATOR =
  "https://www.ato.gov.au/calculators-and-tools/tax-withheld-calculator";

// -----------------------------------------------------------------------------
// Extra-pay-period additional withholding.
//
// A financial year occasionally contains 53 weekly or 27 fortnightly pay days.
// The published tables assume 52 and 26, so the extra pay leaves the payee
// under-withheld. The ATO prints an optional amount the payee can ASK the
// employer to withhold from each pay to cover the shortfall. These bands are
// ATO lookup values — they are not derivable from the Schedule 1 coefficients,
// so they are transcribed here with their source.
//
// Source: ato.gov.au/tax-rates-and-codes/tax-table-weekly, "When there are 53
// pays in a financial year"; .../tax-table-fortnightly, "When there are 27 pays
// in a financial year". Both read 28 July 2026.
// -----------------------------------------------------------------------------
export interface ExtraPayBand {
  /** Lower bound of the earnings band, inclusive. */
  readonly from: number;
  /** Upper bound, inclusive. `null` means "and over". */
  readonly to: number | null;
  /** Additional amount to withhold from each pay. */
  readonly additional: number;
}

export interface ExtraPaySchedule {
  /** Number of pay days in the unusual year (53 weekly / 27 fortnightly). */
  readonly extraPayCount: number;
  /** Number of pay days the printed table assumes. */
  readonly standardPayCount: number;
  readonly bands: readonly ExtraPayBand[];
  readonly sourceUrl: string;
}

export const WEEKLY_EXTRA_PAY: ExtraPaySchedule = {
  extraPayCount: 53,
  standardPayCount: 52,
  bands: [
    { from: 875, to: 2_574, additional: 3 },
    { from: 2_575, to: 3_649, additional: 7 },
    { from: 3_650, to: null, additional: 12 },
  ],
  sourceUrl: ATO_WEEKLY.pageUrl,
};

export const FORTNIGHTLY_EXTRA_PAY: ExtraPaySchedule = {
  extraPayCount: 27,
  standardPayCount: 26,
  bands: [
    { from: 1_700, to: 5_199, additional: 12 },
    { from: 5_200, to: 7_249, additional: 27 },
    { from: 7_250, to: null, additional: 48 },
  ],
  sourceUrl: ATO_FORTNIGHTLY.pageUrl,
};

// -----------------------------------------------------------------------------
// Foreign resident (Scale 3) rate bands, exactly as the ATO prints them on each
// tax-table page. The withholding AMOUNTS shown on our pages are computed from
// SCALE_3_FOREIGN in the engine; these strings only reproduce the ATO's own
// plain-English band descriptions so employers can check they match.
// -----------------------------------------------------------------------------
export interface ForeignResidentBand {
  readonly earnings: string;
  readonly rate: string;
}

export const WEEKLY_FOREIGN_BANDS: readonly ForeignResidentBand[] = [
  { earnings: "0 to 2,595", rate: "30 cents for each dollar of earnings" },
  { earnings: "2,596 to 3,652", rate: "$779 plus 37 cents for each $1 over $2,595" },
  { earnings: "3,653 and over", rate: "$1,170 plus 45 cents for each $1 over $3,652" },
];

export const FORTNIGHTLY_FOREIGN_BANDS: readonly ForeignResidentBand[] = [
  { earnings: "0 to 5,191", rate: "30 cents for each dollar of earnings" },
  { earnings: "5,192 to 7,305", rate: "$1,557 plus 37 cents for each $1 over $5,191" },
  { earnings: "7,306 and over", rate: "$2,339 plus 45 cents for each $1 over $7,305" },
];

export const MONTHLY_FOREIGN_BANDS: readonly ForeignResidentBand[] = [
  { earnings: "0 to 11,248", rate: "30 cents for each dollar of earnings" },
  { earnings: "11,249 to 15,829", rate: "$3,374 plus 37 cents for each $1 over $11,248" },
  { earnings: "15,830 and over", rate: "$5,069 plus 45 cents for each $1 over $15,829" },
];

// -----------------------------------------------------------------------------
// The ATO's own worked examples, reproduced so readers can check this page
// against the source. Our engine returns exactly these numbers — see
// lib/constants/__tests__/payg-withholding.test.ts.
// -----------------------------------------------------------------------------
export const ATO_WORKED_EXAMPLES = {
  weekly: { earnings: 563.60, lookup: 563, withTFT: 33, noTFT: 108 },
  fortnightly: { earnings: 989.80, lookup: 989, withTFT: 40, noTFT: 176 },
  monthly: { earnings: 4_311.68, lookup: 4_311.68, withTFT: 589, noTFT: 1_070 },
} as const;

/** ATO Schedule 5 cap: withholding on an additional payment cannot exceed this share of it. */
export const SCHEDULE_5_WITHHOLDING_LIMIT = 0.47;

// -----------------------------------------------------------------------------
// Earnings rows rendered on each page.
//
// These are INPUTS only — the withholding shown against each row is computed by
// the engine at render time. 30 rows each, spanning roughly the 25th to the 99th
// percentile of Australian full-time earnings for that pay cycle.
// -----------------------------------------------------------------------------
export const WEEKLY_TABLE_ROWS: readonly number[] = [
  300, 400, 500, 600, 700, 800, 900, 1_000, 1_100, 1_200,
  1_300, 1_400, 1_500, 1_600, 1_700, 1_800, 1_900, 2_000, 2_100, 2_200,
  2_400, 2_600, 2_800, 3_000, 3_250, 3_500, 3_750, 4_000, 4_500, 5_000,
];

export const FORTNIGHTLY_TABLE_ROWS: readonly number[] = [
  600, 800, 1_000, 1_200, 1_400, 1_600, 1_800, 2_000, 2_200, 2_400,
  2_600, 2_800, 3_000, 3_200, 3_400, 3_600, 3_800, 4_000, 4_200, 4_400,
  4_800, 5_200, 5_600, 6_000, 6_500, 7_000, 7_500, 8_000, 9_000, 10_000,
];

export const MONTHLY_TABLE_ROWS: readonly number[] = [
  1_500, 2_000, 2_500, 3_000, 3_500, 4_000, 4_500, 5_000, 5_500, 6_000,
  6_500, 7_000, 7_500, 8_000, 8_500, 9_000, 9_500, 10_000, 11_000, 12_000,
  13_000, 14_000, 15_000, 16_000, 17_000, 18_000, 20_000, 22_000, 25_000, 30_000,
];

/** Additional-payment amounts for the Schedule 5 ready-reckoner table. */
export const SCHEDULE_5_BONUS_ROWS: readonly number[] = [
  500, 1_000, 1_500, 2_000, 2_500, 3_000, 3_500, 4_000, 4_500, 5_000,
  6_000, 7_000, 8_000, 9_000, 10_000, 12_000, 14_000, 16_000, 18_000, 20_000,
  25_000, 30_000, 35_000, 40_000, 45_000, 50_000, 60_000, 70_000, 85_000, 100_000,
];
