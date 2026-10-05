// =============================================================================
// Open data: Australian tax and pay tables as CSV + JSON.
// Powers /australian-tax-and-pay-data/ and its downloads.
//
// Defines NO figure of its own. Every row is read from the site's single
// sources of truth, so the page, the CSVs, the JSON and the Dataset JSON-LD
// can never disagree with the calculators:
//   constants/australian-tax.ts       resident scales, Medicare levy, SG, HECS
//   constants/tax-rates-reference.ts  the legislated 2027-28 resident scale
//   constants/minimum-wage.ts         National Minimum Wage and its history
//   constants/junior-rates.ts         NMW junior percentages
//
// Plain RFC 4180 CSV (header row first, no comment lines) so Excel, Sheets
// and pandas open it directly. Provenance travels in the JSON, the page's
// source list and the Dataset JSON-LD.
//
// Relative imports only, so `npm test` can compile it without path aliases.
// =============================================================================

import {
  HECS_HELP,
  HECS_HELP_2025_26,
  MEDICARE_LEVY,
  SG_RATE_HISTORY,
  SITE_CONFIG,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  type HECSBand,
  type TaxBracket,
} from "../../constants/australian-tax";
import { LEGISLATED_CUT_2027_28, TAX_BRACKETS_2027_28 } from "../../constants/tax-rates-reference";
import { NMW_DECISION, NMW_HISTORY, formatIncrease } from "../../constants/minimum-wage";
import { JUNIOR_RATES, NMW_ORDER } from "../../constants/junior-rates";

export const OPEN_DATA = {
  path: "/australian-tax-and-pay-data/",
  url: `${SITE_CONFIG.baseUrl}/australian-tax-and-pay-data/`,
  title: "Australian Tax and Pay Data",
  version: "1.0",
  publishedIso: "2026-10-05",
  publishedOn: "5 October 2026",
  updatedIso: "2026-10-05",
  updatedOn: "5 October 2026",
  license: "https://creativecommons.org/licenses/by/4.0/",
  licenseName: "CC BY 4.0",
} as const;

export interface DataSource {
  title: string;
  url: string;
  publisher: string;
}

const ATO = "Australian Taxation Office";
const FWC = "Fair Work Commission";

export const SRC = {
  taxRates: { title: "Tax rates: Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: ATO },
  taxCuts: { title: "Personal income tax: new tax cuts for every Australian taxpayer", url: LEGISLATED_CUT_2027_28.atoUrl, publisher: ATO },
  medicareReduction: { title: "Medicare levy reduction for low-income earners", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners", publisher: ATO },
  medicareSurcharge: { title: "Medicare levy surcharge income, thresholds and rates", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates", publisher: ATO },
  superGuarantee: { title: "Super guarantee: key rates and thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", publisher: ATO },
  hecs: { title: "Study and training loan repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: ATO },
  awr: { title: `${NMW_DECISION.name} (${NMW_DECISION.citation})`, url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: FWC },
  nmwOrder: { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: FWC },
} as const satisfies Record<string, DataSource>;

export const DATA_FILES = [
  {
    file: "resident-tax-rates.csv",
    title: "Resident income tax rates, 2025-26 to 2027-28",
    description: "Australian resident marginal tax scales for 2025-26 (historical), 2026-27 (current) and 2027-28 (legislated, not yet in force). Thresholds in dollars.",
    sources: [SRC.taxRates, SRC.taxCuts],
  },
  {
    file: "medicare-levy.csv",
    title: "Medicare levy and Medicare levy surcharge",
    description: "Medicare levy rate and low-income thresholds (2025-26 figures; the ATO had not published 2026-27 thresholds) and the 2026-27 Medicare levy surcharge tiers.",
    sources: [SRC.medicareReduction, SRC.medicareSurcharge],
  },
  {
    file: "super-guarantee-rates.csv",
    title: "Super guarantee rate by financial year, 2021-22 to 2026-27",
    description: "The employer super guarantee percentage by financial year.",
    sources: [SRC.superGuarantee],
  },
  {
    file: "hecs-help-repayment-thresholds.csv",
    title: "HECS-HELP repayment thresholds, 2025-26 and 2026-27",
    description: "Compulsory repayment bands for study and training loans under the marginal system, by repayment income.",
    sources: [SRC.hecs],
  },
  {
    file: "national-minimum-wage-history.csv",
    title: "National Minimum Wage by financial year, 2010-11 to 2026-27",
    description: "Adult National Minimum Wage per hour and per 38-hour week since 2010, with the increase as announced by the Fair Work Commission.",
    sources: [SRC.awr, SRC.nmwOrder],
  },
  {
    file: "junior-minimum-wage-rates.csv",
    title: "National Minimum Wage for juniors, 2026-27",
    description: "Junior National Minimum Wage as a percentage of the adult rate, with the hourly and casual hourly dollars, for employees not covered by an award or agreement.",
    sources: [SRC.nmwOrder],
  },
] as const;

export type DataFile = (typeof DATA_FILES)[number]["file"];
export const JSON_FILE = "australian-tax-and-pay-data.json";
export const ALL_FILES: readonly string[] = [...DATA_FILES.map((f) => f.file), JSON_FILE];

type Cell = string | number | null;
export type Table = { head: string[]; rows: Cell[][] };

function csvCell(v: Cell): string {
  if (v === null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(t: Table): string {
  return [t.head.map(csvCell).join(","), ...t.rows.map((r) => r.map(csvCell).join(","))].join("\n") + "\n";
}

const r4 = (n: number) => Math.round(n * 10_000) / 10_000;
const finite = (n: number): number | null => (Number.isFinite(n) ? n : null);

function scaleRows(year: string, status: string, scale: readonly TaxBracket[]): Cell[][] {
  return scale.map((b) => [year, status, b.min === 0 ? 0 : b.min - 1, finite(b.max), r4(b.rate), b.base]);
}

function hecsRows(year: string, bands: readonly HECSBand[]): Cell[][] {
  return bands.map((b, i) => [
    year,
    i === 0 ? 0 : b.min - 1,
    finite(b.max),
    r4(b.marginalRate),
    b.base,
    i === bands.length - 1 ? "rate_on_total_repayment_income" : "base_plus_marginal_rate_over_threshold",
  ]);
}

export function dataTable(file: DataFile): Table {
  switch (file) {
    case "resident-tax-rates.csv":
      return {
        head: ["income_year", "status", "taxable_income_over_aud", "up_to_aud", "marginal_rate", "base_tax_aud"],
        rows: [
          ...scaleRows("2025-26", "historical", TAX_BRACKETS_2025_26),
          ...scaleRows("2026-27", "current", TAX_BRACKETS_2026_27),
          ...scaleRows("2027-28", "legislated_not_in_force", TAX_BRACKETS_2027_28),
        ],
      };
    case "medicare-levy.csv": {
      const s = MEDICARE_LEVY.surcharge;
      return {
        head: ["item", "income_year", "value", "unit"],
        rows: [
          ["levy_rate", "all", r4(MEDICARE_LEVY.rate), "rate"],
          ["levy_low_income_threshold_singles", "2025-26", MEDICARE_LEVY.lowIncomeThreshold, "aud"],
          ["levy_shade_in_upper_limit_singles", "2025-26", MEDICARE_LEVY.shadeInThreshold, "aud"],
          ["levy_shade_in_rate", "2025-26", r4(MEDICARE_LEVY.shadeInRate), "rate"],
          ["levy_low_income_threshold_families", "2025-26", MEDICARE_LEVY.familyThreshold, "aud"],
          ["levy_threshold_per_additional_child", "2025-26", MEDICARE_LEVY.additionalChild, "aud"],
          ["surcharge_singles_tier1_income_over", "2026-27", s.tier1.min - 1, "aud"],
          ["surcharge_singles_tier1_rate", "2026-27", r4(s.tier1.rate), "rate"],
          ["surcharge_singles_tier2_income_over", "2026-27", s.tier2.min - 1, "aud"],
          ["surcharge_singles_tier2_rate", "2026-27", r4(s.tier2.rate), "rate"],
          ["surcharge_singles_tier3_income_over", "2026-27", s.tier3.min - 1, "aud"],
          ["surcharge_singles_tier3_rate", "2026-27", r4(s.tier3.rate), "rate"],
          ["surcharge_families_tier1_income_over", "2026-27", s.familyTier1.min - 1, "aud"],
          ["surcharge_families_tier1_rate", "2026-27", r4(s.familyTier1.rate), "rate"],
          ["surcharge_families_tier2_income_over", "2026-27", s.familyTier2.min - 1, "aud"],
          ["surcharge_families_tier2_rate", "2026-27", r4(s.familyTier2.rate), "rate"],
          ["surcharge_families_tier3_income_over", "2026-27", s.familyTier3.min - 1, "aud"],
          ["surcharge_families_tier3_rate", "2026-27", r4(s.familyTier3.rate), "rate"],
        ],
      };
    }
    case "super-guarantee-rates.csv":
      return {
        head: ["financial_year", "super_guarantee_rate"],
        rows: SG_RATE_HISTORY.map((r): Cell[] => [r.year.replace(/^FY/, ""), r4(r.rate)]),
      };
    case "hecs-help-repayment-thresholds.csv":
      return {
        head: ["income_year", "repayment_income_over_aud", "up_to_aud", "rate", "base_repayment_aud", "method"],
        rows: [...hecsRows("2025-26", HECS_HELP_2025_26.bands), ...hecsRows("2026-27", HECS_HELP.bands)],
      };
    case "national-minimum-wage-history.csv":
      return {
        head: ["financial_year", "operative_from", "hourly_aud", "weekly_38_hours_aud", "increase_as_announced", "increase_calculated_on_weekly"],
        rows: NMW_HISTORY.map((r) => [
          r.fy,
          r.operativeFrom,
          r.hourly,
          r.weekly,
          r.published,
          r.increase === null ? null : formatIncrease(r.increase),
        ]),
      };
    case "junior-minimum-wage-rates.csv":
      return {
        head: ["age", "percent_of_adult_rate", "hourly_aud", "casual_hourly_aud"],
        rows: JUNIOR_RATES.map((r) => [r.age, r.percentage, r.hourly, r.casualHourly]),
      };
  }
}

export function dataCsv(file: DataFile): string {
  return toCsv(dataTable(file));
}

export function isDataFile(value: string): value is DataFile {
  return DATA_FILES.some((f) => f.file === value);
}

export function dataHref(file: string): string {
  return `${OPEN_DATA.path}data/${file}`;
}

export function suggestedCitation(accessed: string = OPEN_DATA.updatedOn): string {
  return `${SITE_CONFIG.name} (2026). ${OPEN_DATA.title}: tax rates, Medicare levy, super guarantee, HECS-HELP and minimum wage tables (version ${OPEN_DATA.version}). Retrieved ${accessed}, from ${OPEN_DATA.url}`;
}

export function citationHtml(): string {
  return `<a href="${OPEN_DATA.url}">${OPEN_DATA.title}</a> (${SITE_CONFIG.name})`;
}

/** One JSON document with metadata and every table as an array of objects. */
export function dataJson(): string {
  const datasets = DATA_FILES.map((f) => {
    const t = dataTable(f.file);
    return {
      file: f.file,
      title: f.title,
      description: f.description,
      sources: f.sources,
      rows: t.rows.map((r) => Object.fromEntries(t.head.map((h, i) => [h, r[i]]))),
    };
  });
  return (
    JSON.stringify(
      {
        title: OPEN_DATA.title,
        publisher: SITE_CONFIG.name,
        url: OPEN_DATA.url,
        version: OPEN_DATA.version,
        published: OPEN_DATA.publishedIso,
        updated: OPEN_DATA.updatedIso,
        license: OPEN_DATA.license,
        attribution: suggestedCitation(),
        notes: [
          "Rates are for Australian residents unless stated. A null up_to_aud means there is no upper limit.",
          "2027-28 tax rates are legislated but not yet in force. Medicare levy low-income thresholds are the 2025-26 figures because the ATO had not published 2026-27 levy thresholds.",
          "General information, not tax or legal advice. Check the linked ATO and Fair Work sources for your situation.",
        ],
        datasets,
      },
      null,
      2,
    ) + "\n"
  );
}

export function fileContent(file: string): { body: string; type: string } | null {
  if (file === JSON_FILE) return { body: dataJson(), type: "application/json; charset=utf-8" };
  if (isDataFile(file)) return { body: dataCsv(file), type: "text/csv; charset=utf-8" };
  return null;
}

export function allSources(): DataSource[] {
  const seen = new Map<string, DataSource>();
  for (const f of DATA_FILES) for (const s of f.sources) seen.set(s.url, s);
  return [...seen.values()];
}
