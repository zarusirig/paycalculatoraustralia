// =============================================================================
// 2027-28 resident tax settings and the Working Australians Tax Offset (WATO)
// Run tests with: npm test
//
// Why this file exists: lib/constants/australian-tax.ts is the CURRENT year
// (2026-27). Two laws already passed change the next one:
//  1. The second marginal rate falls from 15% to 14% on 1 July 2027.
//     ATO, "Personal income tax - new tax cuts for every Australian taxpayer"
//     (QC104015, last updated 13 May 2026, read 5 Oct 2026): "From 1 July
//     2026, the 16 per cent rate will be reduced to 15 per cent. From 1 July
//     2027, the 15 per cent rate will be reduced further to 14 per cent. ...
//     This measure is now law." The $18,200 / $45,000 / $135,000 / $190,000
//     thresholds and the 30% / 37% / 45% rates are unchanged, so the 2027-28
//     scale is derived from TAX_BRACKETS_2026_27 below rather than re-keyed.
//  2. The Working Australians Tax Offset. ATO, "Working Australians tax
//     offset" (QC107797, published 23 Jul 2026, read 5 Oct 2026): "This
//     measure is now law. The WATO is available from the 2027-28 income year
//     for individuals who are Australian residents for tax purposes during that
//     income year [and] have net labour income (labour amounts less labour
//     deductions) which exceeds the tax-free threshold. The WATO provides a
//     maximum benefit of $250 for eligible individuals if their income tax
//     payable on their net labour income is above $250. ... non-refundable ...
//     can only reduce an individual's tax payable to nil. Any unused amount
//     will not be refunded and it cannot be transferred or carried forward."
//     Royal Assent 26 June 2026 (Treasury Laws Amendment (Tax Reform No. 1)
//     Act 2026, ATO "latest news on tax law and policy").
//     Treasury, Budget 2026-27 tax system changes: "a $250 Working Australians
//     Tax Offset ... an ongoing annual tax cut for more than 13 million workers".
//
// MODELLING CHOICES (stated on the page):
//  - All income is treated as labour income (salary). Other income, such as
//    interest or rent, would not count towards "net labour income".
//  - WATO is capped at tax payable AFTER LITO, the conservative reading of
//    "can only reduce tax payable to nil". It only changes the result for
//    incomes just above the tax-free threshold.
//  - LITO ($700) and the Medicare levy rules are held at their 2026-27 settings.
//    No change to either is modelled; the Medicare levy low-income thresholds
//    in particular are re-set by the Budget each year.
//  - Salary is the same in both years, so the difference is purely the law.
// =============================================================================

import {
  LITO,
  MEDICARE_LEVY,
  TAX_BRACKETS_2026_27,
  TAX_FREE_THRESHOLD,
  calculateLITO,
  calculateMedicareLevy,
  type TaxBracket,
} from "./australian-tax";

export const RATE_2027_28 = 0.14;
export const RATE_CUT_EFFECTIVE = "1 July 2027";

export const WATO = {
  maxOffset: 250,
  firstIncomeYear: "2027-28",
  /** Royal Assent date of Treasury Laws Amendment (Tax Reform No. 1) Act 2026. */
  royalAssent: "26 June 2026",
  /** Net labour income must exceed this for any offset. */
  incomeThreshold: TAX_FREE_THRESHOLD,
} as const;

export const WATO_SOURCES = {
  ato: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/working-australians-tax-offset",
  atoCuts: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer",
  treasury: "https://treasury.gov.au/policy-topics/taxation/budget2026-27",
  atoLegislation: "https://www.ato.gov.au/about-ato/new-legislation/latest-news-on-tax-law-and-policy",
  budget: "https://budget.gov.au/content/04-tax-reform.htm",
} as const;

/** 2027-28 resident scale: the 2026-27 thresholds with the second rate at 14%. */
function buildBrackets(): readonly TaxBracket[] {
  const out: TaxBracket[] = [];
  let base = 0;
  for (const b of TAX_BRACKETS_2026_27) {
    const rate = b.rate === 0.15 ? RATE_2027_28 : b.rate;
    out.push({ ...b, rate, base, label: `${Math.round(rate * 100)}c for each $1 over $${(b.min === 0 ? 0 : b.min - 1).toLocaleString("en-AU")}` });
    if (Number.isFinite(b.max)) base += (b.max - (b.min === 0 ? 0 : b.min - 1)) * rate;
  }
  return out;
}

export const TAX_BRACKETS_2027_28: readonly TaxBracket[] = buildBrackets();

/** Income tax (before offsets and Medicare) on a taxable income under a given scale. */
export function taxOnScale(income: number, brackets: readonly TaxBracket[]): number {
  if (income <= 0) return 0;
  for (let i = brackets.length - 1; i >= 0; i--) {
    const b = brackets[i];
    if (income >= b.min) return b.base + (income - (b.min === 0 ? 0 : b.min - 1)) * b.rate;
  }
  return 0;
}

export function incomeTax2027_28(income: number): number {
  return taxOnScale(income, TAX_BRACKETS_2027_28);
}

/** WATO for a resident whose income is all labour income, after LITO. */
export function wato(income: number): number {
  if (income <= WATO.incomeThreshold) return 0;
  const payable = Math.max(0, incomeTax2027_28(income) - calculateLITO(income));
  return Math.round(Math.min(WATO.maxOffset, payable) * 100) / 100;
}

export interface YearTakeHome {
  taxBeforeOffsets: number;
  lito: number;
  wato: number;
  incomeTaxPayable: number;
  medicare: number;
  totalTax: number;
  takeHome: number;
}

function yearResult(salary: number, scale: readonly TaxBracket[], withWato: boolean): YearTakeHome {
  const s = Math.max(0, salary);
  const taxBeforeOffsets = taxOnScale(s, scale);
  const lito = Math.min(taxBeforeOffsets, calculateLITO(s));
  const w = withWato ? wato(s) : 0;
  const incomeTaxPayable = Math.max(0, taxBeforeOffsets - lito - w);
  const medicare = calculateMedicareLevy(s);
  const totalTax = incomeTaxPayable + medicare;
  return { taxBeforeOffsets, lito, wato: w, incomeTaxPayable, medicare, totalTax, takeHome: s - totalTax };
}

export interface TakeHomeComparison {
  salary: number;
  y2026_27: YearTakeHome;
  y2027_28: YearTakeHome;
  /** Extra take-home a year in 2027-28. */
  gainPerYear: number;
  /** Part of the gain from the 15% to 14% rate cut. */
  fromRateCut: number;
  /** Part of the gain from the WATO. */
  fromWato: number;
}

/** Same salary, 2026-27 law vs 2027-28 law. */
export function compareTakeHome(salary: number): TakeHomeComparison {
  const a = yearResult(salary, TAX_BRACKETS_2026_27, false);
  const b = yearResult(salary, TAX_BRACKETS_2027_28, true);
  const gainPerYear = Math.round((b.takeHome - a.takeHome) * 100) / 100;
  const fromWato = b.wato;
  return {
    salary: Math.max(0, salary),
    y2026_27: a,
    y2027_28: b,
    gainPerYear,
    fromWato,
    fromRateCut: Math.round((gainPerYear - fromWato) * 100) / 100,
  };
}

/** Largest possible gain: the full rate cut on the 15% band plus the full offset. */
export const MAX_RATE_CUT_SAVING = Math.round((45_000 - TAX_FREE_THRESHOLD) * (0.15 - RATE_2027_28));
export const MAX_COMBINED_GAIN = MAX_RATE_CUT_SAVING + WATO.maxOffset;

// Medicare levy settings are referenced so a future change to the engine's
// thresholds surfaces here; the comparison deliberately holds them constant.
export const COMPARISON_HOLDS_CONSTANT = {
  litoMax: LITO.maxOffset,
  medicareLowIncomeThreshold: MEDICARE_LEVY.lowIncomeThreshold,
  medicareRate: MEDICARE_LEVY.rate,
} as const;
