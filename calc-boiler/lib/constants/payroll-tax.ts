// =============================================================================
// State and territory payroll tax — 2026-27 (1 July 2026 to 30 June 2027)
//
// One engine for /payroll-tax-calculator/ and the eight /payroll-tax/{state}/
// pages. Every rate, threshold, phase-out and surcharge below was read from the
// state or territory revenue office on 23 September 2026 (via Firecrawl); the
// source URL sits next to each figure. Where a revenue office publishes a
// worked example, lib/constants/__tests__/payroll-tax.test.ts pins it.
//
// Scope of the engine (said on every page that uses it):
//   - a full financial year of wages (no part-year apportionment);
//   - the threshold / deduction is claimed in full by the employer, or by the
//     designated group employer for a group, against the group's wages;
//   - "state wages" are taxable wages in that state; "Australian wages" are the
//     employer's (or group's) taxable wages in every state and territory,
//     including this one. Exempt wages must already be excluded.
// Monthly returns, part-year employers, split group returns and exemptions are
// left to the revenue office's own portal.
// =============================================================================

export type PayrollTaxStateCode = "nsw" | "vic" | "qld" | "wa" | "sa" | "tas" | "act" | "nt";

export const PAYROLL_TAX_STATE_CODES: readonly PayrollTaxStateCode[] = [
  "nsw",
  "vic",
  "qld",
  "wa",
  "sa",
  "tas",
  "act",
  "nt",
] as const;

export function isPayrollTaxStateCode(v: string): v is PayrollTaxStateCode {
  return (PAYROLL_TAX_STATE_CODES as readonly string[]).includes(v);
}

export const PAYROLL_TAX_FY = "2026-27";
export const PAYROLL_TAX_VERIFIED_ON = "23 September 2026";

// -----------------------------------------------------------------------------
// Parameters
// -----------------------------------------------------------------------------

/**
 * NSW — flat 5.45% above a $1.2m threshold, apportioned by NSW share of
 * Australian wages. No phase-out, no surcharge.
 * Source: revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/lodge-and-pay-returns/thresholds-and-rates
 * ("1 July 2026 – 30 June 2027 | $1,200,000 | 5.45%"; monthly 28/30/31 days:
 * $92,055 / $98,630 / $101,918; last updated 1 July 2026).
 */
export const NSW_PAYROLL_TAX = {
  rate: 0.0545,
  threshold: 1_200_000,
  monthlyThresholds: { days28: 92_055, days30: 98_630, days31: 101_918 },
} as const;

/**
 * VIC — 4.85% (regional employers 1.2125%) above a $1m threshold. The
 * threshold phases out at 50% of Australian wages between $3m and $5m (nil
 * from $5m). Two surcharges (mental health and wellbeing + COVID-19 debt)
 * add a combined 1% on Victorian wages above an apportioned $10m threshold,
 * and a further combined 1% above an apportioned $100m threshold.
 * Sources: sro.vic.gov.au/about-us/rates-and-statistics/current-rates/payroll-tax-current-rates
 * (updated 10 July 2026); .../thresholds-and-grouping/threshold-and-phase-out-rate
 * (updated 19 June 2026); .../thresholds-and-grouping/payroll-tax-surcharges
 * (updated 24 August 2026); .../industries-and-locations/regional-employers.
 */
export const VIC_PAYROLL_TAX = {
  rate: 0.0485,
  regionalRate: 0.012125,
  threshold: 1_000_000,
  monthlyThreshold: 83_333,
  phaseOutStart: 3_000_000,
  phaseOutRate: 0.5,
  surcharge: {
    firstThreshold: 10_000_000,
    firstRate: 0.01,
    secondThreshold: 100_000_000,
    secondRate: 0.01,
    covidSurchargeEnds: "30 June 2033",
  },
} as const;

/**
 * QLD — 4.75% where Australian wages are $6.5m or less, 4.95% above $6.5m.
 * $1.3m deduction, reduced by $1 for every $7 of Australian wages above
 * $1.3m (nil at $10.4m). Regional employers: rate discounted by 1 percentage
 * point (3.75% / 3.95%) until 30 June 2030, not available above $350m.
 * Mental health levy: 0.25% on Queensland wages above an apportioned $10m,
 * plus 0.5% above an apportioned $100m.
 * Sources: qro.qld.gov.au/payroll-tax/calculate/rates-thresholds/ ;
 * .../calculate/deductions/ ; .../calculate/regional-discount/ (updated
 * 7 Sep 2026) ; qro.qld.gov.au/payroll-tax/mental-health-levy/calculating/.
 */
export const QLD_PAYROLL_TAX = {
  rate: 0.0475,
  higherRate: 0.0495,
  higherRateFrom: 6_500_000, // "more than $6.5 million"
  threshold: 1_300_000,
  monthlyThreshold: 108_333,
  weeklyRegistrationThreshold: 25_000,
  deductionTaper: 1 / 7,
  deductionNilAt: 10_400_000,
  regionalDiscount: 0.01,
  regionalDiscountMaxWages: 350_000_000,
  regionalDiscountEnds: "30 June 2030",
  mentalHealthLevy: {
    firstThreshold: 10_000_000,
    firstRate: 0.0025,
    secondThreshold: 100_000_000,
    secondRate: 0.005,
  },
} as const;

/**
 * WA — 5.5% with a diminishing threshold: deductable amount =
 * $1m − (Australian wages − $1m) × 2/13, nil at $7.5m; apportioned by WA
 * share of Australian wages.
 * Sources: wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/calculation-payroll-tax-employer-guide
 * and its local-non-group / interstate-non-group sub-pages (updated 2 June 2026).
 * Note: the 6%/6.5% large-employer tiers listed there are "previous rates"
 * (1 July 2020 – 30 June 2023); the current table is 5.5% at every level.
 */
export const WA_PAYROLL_TAX = {
  rate: 0.055,
  threshold: 1_000_000,
  monthlyThreshold: 83_333,
  upperThreshold: 7_500_000,
  taper: 2 / 13,
} as const;

/**
 * SA — nil where Australian wages are $1.5m or less; a variable rate from 0%
 * to 4.95% between $1.5m and $1.7m; 4.95% above $1.7m. The rate is applied
 * to SA wages less a $600,000 deduction (apportioned by SA share).
 * Variable rate: R = 4.95% × (TARW − $1.5m) ÷ $200,000 (Payroll Tax Act 2009
 * (SA) Sch 2 cl 5(1a)(b)(i)); cross-checked against RevenueSA's rate table
 * (e.g. $1.6m → 2.47%, $1.65m → 3.71%, displayed truncated to 2 dp).
 * Sources: revenuesa.sa.gov.au/payrolltax/rates-and-thresholds ;
 * revenuesa.sa.gov.au/payrolltax/how-is-payroll-tax-calculated.
 */
export const SA_PAYROLL_TAX = {
  rate: 0.0495,
  threshold: 1_500_000,
  fullRateFrom: 1_700_000,
  monthlyThreshold: 125_000,
  weeklyThreshold: 28_846,
  deduction: 600_000,
  monthlyDeduction: 50_000,
} as const;

/**
 * TAS — two thresholds and two rates: 4% on wages between $1.25m and $2m,
 * 6.1% above $2m, each threshold apportioned by Tasmanian share.
 * Sources: sro.tas.gov.au/payroll-tax/rates-thresholds ("2026-27 financial
 * year": 0–1 250 000 nil; 1 250 001–2 000 000 4%; 2 000 001+ 6.1%);
 * sro.tas.gov.au/payroll-tax ("$24 038 per week during a month");
 * Annual Adjustment Return Guideline 2025-26 (worked examples).
 */
export const TAS_PAYROLL_TAX = {
  lowerRate: 0.04,
  upperRate: 0.061,
  threshold: 1_250_000,
  upperThreshold: 2_000_000,
  weeklyThreshold: 24_038,
} as const;

/**
 * ACT — $1.75m threshold (cut from $2m on 1 July 2026), apportioned by ACT
 * share. The general rate depends on the employer's or group's Australia-wide
 * wages and applies to all ACT wages above the threshold amount.
 * Sources: revenue.act.gov.au/business-taxes-and-levies/payroll-tax/about-payroll-tax
 * (Table 1: 1 July 2026 to 30 June 2027); .../payroll-tax/calculating-payroll-tax
 * (steps 1–3). Eligible universities are capped at 6.85% (not modelled).
 */
export const ACT_PAYROLL_TAX = {
  threshold: 1_750_000,
  monthlyThreshold: 145_833.33,
  bands: [
    { upTo: 20_000_000, rate: 0.0675 },
    { upTo: 50_000_000, rate: 0.0685 },
    { upTo: 100_000_000, rate: 0.0735 },
    { upTo: 150_000_000, rate: 0.0785 },
    { upTo: Infinity, rate: 0.0875 },
  ],
} as const;

/**
 * NT — 5.5% (6.5% from 1 July 2026 where Australia-wide wages are $100m or
 * more). $2.5m tax-free amount, reduced by $1 for every $2 of Australian wages
 * above $2.5m (nil from $7.5m), then apportioned by NT share.
 * Sources: treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax/payroll-tax-rates-and-thresholds
 * ("July 2026 to June 2027 | $2,500,000 | $208,333 | 6.5%/5.5%");
 * Payroll tax guide for NT employers (I-PRT-001), "Calculating your payroll
 * tax" and worked examples 1–5.
 */
export const NT_PAYROLL_TAX = {
  rate: 0.055,
  largeEmployerRate: 0.065,
  largeEmployerFrom: 100_000_000, // "$100 million or more"
  threshold: 2_500_000,
  monthlyThreshold: 208_333,
  taper: 0.5,
  nilAt: 7_500_000,
} as const;

// -----------------------------------------------------------------------------
// Engine
// -----------------------------------------------------------------------------

export interface PayrollTaxInput {
  state: PayrollTaxStateCode;
  /** Taxable wages paid in this state for the year (the group's, for a group). */
  stateWages: number;
  /** Taxable wages paid Australia-wide, including this state. Defaults to stateWages. */
  australianWages?: number;
  /** VIC regional employer rate, or the QLD regional discount. Ignored elsewhere. */
  regional?: boolean;
}

export interface PayrollTaxLine {
  label: string;
  amount: number;
}

export interface PayrollTaxResult {
  state: PayrollTaxStateCode;
  stateWages: number;
  australianWages: number;
  /** stateWages ÷ australianWages. */
  share: number;
  /** Tax-free threshold / deduction actually available in this state. */
  deduction: number;
  /** Wages the headline rate is charged on (after the deduction). */
  taxableWages: number;
  /** Headline rate applied to taxableWages (TAS: the top rate reached). */
  rate: number;
  /** Payroll tax before any surcharge or levy. */
  payrollTax: number;
  /** VIC surcharges or QLD mental health levy. 0 elsewhere. */
  surcharge: number;
  surchargeLabel: string | null;
  total: number;
  /** total ÷ stateWages (0 when no state wages). */
  effectiveRate: number;
  /** True when Australian wages exceed the annual threshold. */
  overThreshold: boolean;
  /** Human-readable working, in order. */
  lines: PayrollTaxLine[];
}

const clamp0 = (n: number) => (n > 0 ? n : 0);
const sane = (n: number | undefined) => (typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0);

/** Round to cents for display; the engine itself stays unrounded. */
export function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}

function surchargeOver(stateWages: number, share: number, threshold: number, rate: number): number {
  return clamp0(stateWages - threshold * share) * rate;
}

export function calculatePayrollTax(input: PayrollTaxInput): PayrollTaxResult {
  const W = sane(input.stateWages);
  // Australian wages can never be below the state's own wages.
  const A = Math.max(W, sane(input.australianWages ?? W));
  const s = A > 0 ? W / A : 0;
  const regional = Boolean(input.regional);

  let deduction = 0;
  let rate = 0;
  let payrollTax = 0;
  let surcharge = 0;
  let surchargeLabel: string | null = null;
  let annualThreshold = 0;
  const lines: PayrollTaxLine[] = [];

  switch (input.state) {
    case "nsw": {
      const p = NSW_PAYROLL_TAX;
      annualThreshold = p.threshold;
      deduction = p.threshold * s;
      rate = p.rate;
      payrollTax = clamp0(W - deduction) * rate;
      break;
    }
    case "vic": {
      const p = VIC_PAYROLL_TAX;
      annualThreshold = p.threshold;
      const full = p.threshold * s;
      const reduced = full - p.phaseOutRate * clamp0(W - p.phaseOutStart * s);
      deduction = Math.min(full, clamp0(reduced));
      rate = regional ? p.regionalRate : p.rate;
      payrollTax = clamp0(W - deduction) * rate;
      surcharge =
        surchargeOver(W, s, p.surcharge.firstThreshold, p.surcharge.firstRate) +
        surchargeOver(W, s, p.surcharge.secondThreshold, p.surcharge.secondRate);
      surchargeLabel = "Mental health and COVID-19 debt surcharges";
      break;
    }
    case "qld": {
      const p = QLD_PAYROLL_TAX;
      annualThreshold = p.threshold;
      const groupDeduction = clamp0(p.threshold - clamp0(A - p.threshold) * p.deductionTaper);
      deduction = Math.min(p.threshold, groupDeduction) * s;
      const base = A > p.higherRateFrom ? p.higherRate : p.rate;
      rate = regional && A <= p.regionalDiscountMaxWages ? base - p.regionalDiscount : base;
      payrollTax = clamp0(W - deduction) * rate;
      const l = p.mentalHealthLevy;
      surcharge =
        surchargeOver(W, s, l.firstThreshold, l.firstRate) + surchargeOver(W, s, l.secondThreshold, l.secondRate);
      surchargeLabel = "Mental health levy";
      break;
    }
    case "wa": {
      const p = WA_PAYROLL_TAX;
      annualThreshold = p.threshold;
      const groupDeduction = clamp0(p.threshold - clamp0(A - p.threshold) * p.taper);
      deduction = Math.min(p.threshold, groupDeduction) * s;
      rate = p.rate;
      payrollTax = clamp0(W - deduction) * rate;
      break;
    }
    case "sa": {
      const p = SA_PAYROLL_TAX;
      annualThreshold = p.threshold;
      deduction = p.deduction * s;
      rate = saRate(A);
      payrollTax = clamp0(W - deduction) * rate;
      break;
    }
    case "tas": {
      const p = TAS_PAYROLL_TAX;
      annualThreshold = p.threshold;
      const t1 = p.threshold * s;
      const t2 = p.upperThreshold * s;
      if (A <= p.threshold) {
        deduction = W;
        rate = 0;
        payrollTax = 0;
      } else if (A <= p.upperThreshold) {
        deduction = t1;
        rate = p.lowerRate;
        payrollTax = clamp0(W - t1) * p.lowerRate;
      } else {
        // TAS Annual Adjustment Return Guideline: 4% on (t2 − t1) plus 6.1% on
        // (W − t2). With A > $2m, W − t2 = s × (A − $2m) is always positive.
        deduction = t1;
        rate = p.upperRate;
        payrollTax = (t2 - t1) * p.lowerRate + (W - t2) * p.upperRate;
      }
      break;
    }
    case "act": {
      const p = ACT_PAYROLL_TAX;
      annualThreshold = p.threshold;
      deduction = p.threshold * s;
      rate = A > p.threshold ? actRate(A) : 0;
      payrollTax = clamp0(W - deduction) * rate;
      break;
    }
    case "nt": {
      const p = NT_PAYROLL_TAX;
      annualThreshold = p.threshold;
      const groupDeduction = clamp0(p.threshold - clamp0(A - p.threshold) * p.taper);
      deduction = Math.min(p.threshold, groupDeduction) * s;
      rate = A >= p.largeEmployerFrom ? p.largeEmployerRate : p.rate;
      payrollTax = clamp0(W - deduction) * rate;
      break;
    }
  }

  const overThreshold = A > annualThreshold;
  if (!overThreshold) {
    payrollTax = 0;
    surcharge = 0;
  }
  deduction = Math.min(deduction, W);
  const taxableWages = clamp0(W - deduction);
  const total = payrollTax + surcharge;

  lines.push({ label: "Taxable wages in the state", amount: W });
  lines.push({ label: "Less: threshold / deduction", amount: -deduction });
  lines.push({ label: "Wages taxed", amount: taxableWages });
  lines.push({ label: "Payroll tax", amount: payrollTax });
  if (surchargeLabel && surcharge > 0) lines.push({ label: surchargeLabel, amount: surcharge });

  return {
    state: input.state,
    stateWages: W,
    australianWages: A,
    share: s,
    deduction,
    taxableWages,
    rate: overThreshold ? rate : 0,
    payrollTax,
    surcharge,
    surchargeLabel,
    total,
    effectiveRate: W > 0 ? total / W : 0,
    overThreshold,
    lines,
  };
}

/** SA rate for a given total Australian (group) wage bill. */
export function saRate(australianWages: number): number {
  const p = SA_PAYROLL_TAX;
  if (australianWages <= p.threshold) return 0;
  if (australianWages > p.fullRateFrom) return p.rate;
  return (p.rate * (australianWages - p.threshold)) / (p.fullRateFrom - p.threshold);
}

/** ACT general rate for a given total Australian (group) wage bill. */
export function actRate(australianWages: number): number {
  for (const b of ACT_PAYROLL_TAX.bands) {
    if (australianWages <= b.upTo) return b.rate;
  }
  return ACT_PAYROLL_TAX.bands[ACT_PAYROLL_TAX.bands.length - 1].rate;
}

// -----------------------------------------------------------------------------
// Page content: per-state facts (all from the sources cited above)
// -----------------------------------------------------------------------------

export interface PayrollTaxStateInfo {
  code: PayrollTaxStateCode;
  abbr: string;
  name: string;
  /** Short headline rate string, e.g. "5.45%". */
  headlineRate: string;
  /** Annual tax-free threshold used for the registration / liability test. */
  annualThreshold: number;
  /** How the monthly / weekly test reads, in the revenue office's own terms. */
  monthlyThresholdText: string;
  /** One-paragraph summary of the rate structure. */
  rateSummary: string;
  /** One-paragraph summary of how the threshold or deduction works. */
  thresholdSummary: string;
  /** Surcharges, levies or discounts, or null. */
  extras: string | null;
  /** When the employer has to register. */
  registration: string;
  /** Monthly return and annual reconciliation due dates. */
  monthlyDue: string;
  annualDue: string;
  /** Change from 2025-26, if any. */
  changeFrom2025_26: string | null;
  revenueOffice: string;
  revenueOfficeUrl: string;
  ratesUrl: string;
  /** The URL of the page on this site for this state's employee take-home pay. */
  payCalculatorPath: string;
  /** Workers compensation scheme / regulator name, for the employer on-cost note. */
  workersComp: string;
}

export const PAYROLL_TAX_STATES: Record<PayrollTaxStateCode, PayrollTaxStateInfo> = {
  nsw: {
    code: "nsw",
    abbr: "NSW",
    name: "New South Wales",
    headlineRate: "5.45%",
    annualThreshold: NSW_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$92,055 (28-day month), $98,630 (30-day month) or $101,918 (31-day month)",
    rateSummary:
      "A flat 5.45% on NSW taxable wages above the tax-free threshold. There is no higher rate for large employers and no surcharge.",
    thresholdSummary:
      "The $1.2 million annual threshold does not phase out, however large the payroll. An employer that also pays wages interstate gets the NSW share of it: $1.2m × NSW wages ÷ Australian wages. In a group, only one member (the designated group employer) claims it.",
    extras: null,
    registration:
      "Register within 7 days after the end of the month in which your total Australian wages (including your group's) exceed the monthly threshold, if you pay any wages in NSW.",
    monthlyDue:
      "7th of the following month (the next business day if the 7th is a weekend or public holiday); the December return is due 14 January. For 2026-27: 7 Aug, 7 Sep, 7 Oct, 9 Nov, 7 Dec 2026, 14 Jan, 8 Feb, 8 Mar, 7 Apr, 7 May, 7 Jun 2027.",
    annualDue: "28 July 2027 (the June month is included in the annual return)",
    changeFrom2025_26: null,
    revenueOffice: "Revenue NSW",
    revenueOfficeUrl: "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax",
    ratesUrl:
      "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax/lodge-and-pay-returns/thresholds-and-rates",
    payCalculatorPath: "/pay-calculator-nsw/",
    workersComp: "icare NSW",
  },
  vic: {
    code: "vic",
    abbr: "VIC",
    name: "Victoria",
    headlineRate: "4.85%",
    annualThreshold: VIC_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$83,333",
    rateSummary:
      "4.85% on Victorian taxable wages above the threshold. Regional employers (at least 85% of Victorian wages paid to regional employees) pay 1.2125%.",
    thresholdSummary:
      "The $1 million threshold applies in full up to $3 million of Australian wages. Between $3 million and $5 million it is reduced by 50 cents for every dollar over $3 million, and above $5 million there is no threshold at all. Interstate employers get the Victorian share.",
    extras:
      "Two surcharges apply once Australian wages pass $10 million: the mental health and wellbeing surcharge and the COVID-19 debt temporary surcharge (to 30 June 2033). Together they add 1% on Victorian wages above the (apportioned) $10 million threshold, and another 1% above $100 million.",
    registration:
      "Register once you pay wages in Victoria and your taxable Australian wages (including your group's) exceed the threshold — $83,333 in a month.",
    monthlyDue: "7th of the following month (next business day if the 7th is a weekend or public holiday).",
    annualDue: "21 July 2027",
    changeFrom2025_26: null,
    revenueOffice: "State Revenue Office Victoria",
    revenueOfficeUrl: "https://www.sro.vic.gov.au/businesses-and-organisations/payroll-tax",
    ratesUrl: "https://www.sro.vic.gov.au/about-us/rates-and-statistics/current-rates/payroll-tax-current-rates",
    payCalculatorPath: "/pay-calculator-vic/",
    workersComp: "WorkSafe Victoria",
  },
  qld: {
    code: "qld",
    abbr: "QLD",
    name: "Queensland",
    headlineRate: "4.75%",
    annualThreshold: QLD_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$108,333 a month (registration test: $25,000 a week)",
    rateSummary:
      "4.75% where Australian taxable wages are $6.5 million or less, and 4.95% where they are more than $6.5 million. Eligible regional employers get a 1 percentage point discount (3.75% / 3.95%) until 30 June 2030, except above $350 million.",
    thresholdSummary:
      "The $1.3 million deduction shrinks by $1 for every $7 of Australian wages above $1.3 million, reaching zero at $10.4 million. Interstate employers get the Queensland share of what is left.",
    extras:
      "The mental health levy adds 0.25% on Queensland wages above an apportioned $10 million, plus a further 0.5% above an apportioned $100 million.",
    registration:
      "Register within 7 days of the end of the first month in which your (or your group's) Australian wages exceed $25,000 a week — even if you expect to stay under $1.3 million for the year.",
    monthlyDue:
      "7 days after the end of the return period. For 2026-27: 7 Aug, 7 Sep, 7 Oct, 9 Nov, 7 Dec 2026, 14 Jan, 8 Feb, 8 Mar, 7 Apr, 7 May, 7 Jun 2027.",
    annualDue: "21 July 2027 (includes June)",
    changeFrom2025_26: null,
    revenueOffice: "Queensland Revenue Office",
    revenueOfficeUrl: "https://qro.qld.gov.au/payroll-tax/",
    ratesUrl: "https://qro.qld.gov.au/payroll-tax/calculate/rates-thresholds/",
    payCalculatorPath: "/pay-calculator-qld/",
    workersComp: "WorkCover Queensland",
  },
  wa: {
    code: "wa",
    abbr: "WA",
    name: "Western Australia",
    headlineRate: "5.5%",
    annualThreshold: WA_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$83,333",
    rateSummary: "A flat 5.5% on WA taxable wages above the deductable amount. There is no higher tier for large employers in 2026-27.",
    thresholdSummary:
      "WA uses a diminishing threshold: the $1 million deductable amount falls by $2 for every $13 of Australian wages above $1 million, and disappears at $7.5 million. Interstate employers get the WA share.",
    extras: null,
    registration:
      "Register within seven days after the end of the month in which you pay wages in WA and your total Australian taxable wages exceed $83,333.",
    monthlyDue: "7th of the following month (next business day if the 7th is a weekend or public holiday).",
    annualDue: "21 July 2027",
    changeFrom2025_26: null,
    revenueOffice: "RevenueWA (Department of Treasury and Finance)",
    revenueOfficeUrl:
      "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide",
    ratesUrl:
      "https://www.wa.gov.au/government/multi-step-guides/payroll-tax-employer-guide/calculation-payroll-tax-employer-guide",
    payCalculatorPath: "/pay-calculator-wa/",
    workersComp: "WorkCover WA",
  },
  sa: {
    code: "sa",
    abbr: "SA",
    name: "South Australia",
    headlineRate: "4.95%",
    annualThreshold: SA_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$125,000 a month ($28,846 a week)",
    rateSummary:
      "Nil up to $1.5 million of Australian wages. Between $1.5 million and $1.7 million the rate rises in a straight line from 0% to 4.95%; above $1.7 million it is 4.95%.",
    thresholdSummary:
      "Once the rate applies, it is charged on SA wages less a deduction of up to $600,000 a year ($50,000 a month). Interstate employers get the SA share of the $600,000.",
    extras: null,
    registration:
      "Register once your Australia-wide wages (or your group's) exceed $1.5 million a year — $125,000 a month or $28,846 a week.",
    monthlyDue: "7th of the following month (next business day if the 7th is a weekend or public holiday).",
    annualDue: "28 July 2027",
    changeFrom2025_26: null,
    revenueOffice: "RevenueSA",
    revenueOfficeUrl: "https://www.revenuesa.sa.gov.au/payrolltax",
    ratesUrl: "https://www.revenuesa.sa.gov.au/payrolltax/rates-and-thresholds",
    payCalculatorPath: "/pay-calculator-sa/",
    workersComp: "ReturnToWorkSA",
  },
  tas: {
    code: "tas",
    abbr: "TAS",
    name: "Tasmania",
    headlineRate: "4% / 6.1%",
    annualThreshold: TAS_PAYROLL_TAX.threshold,
    monthlyThresholdText: "days in the month ÷ days in the year × $1.25 million ($24,038 a week)",
    rateSummary:
      "Two rates: 4% on wages between $1.25 million and $2 million, and 6.1% on wages above $2 million.",
    thresholdSummary:
      "Both thresholds ($1.25 million and $2 million) are apportioned by the Tasmanian share of Australian wages. An employer that chooses not to claim the threshold pays 6.1% on all Tasmanian wages.",
    extras: null,
    registration:
      "You are liable (and must register) when your — or your group's — Australian wages exceed $1.25 million a year, or $24,038 a week during a month, and you pay wages in Tasmania.",
    monthlyDue: "7th of the following month (for example, the September return is due 7 October).",
    annualDue: "21 July 2027 (the annual adjustment return replaces the June monthly return)",
    changeFrom2025_26: null,
    revenueOffice: "State Revenue Office Tasmania",
    revenueOfficeUrl: "https://www.sro.tas.gov.au/payroll-tax",
    ratesUrl: "https://www.sro.tas.gov.au/payroll-tax/rates-thresholds",
    payCalculatorPath: "/pay-calculator-tas/",
    workersComp: "WorkSafe Tasmania",
  },
  act: {
    code: "act",
    abbr: "ACT",
    name: "Australian Capital Territory",
    headlineRate: "6.75%",
    annualThreshold: ACT_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$145,833.33",
    rateSummary:
      "6.75% where Australia-wide wages are over $1.75 million and up to $20 million; 6.85% to $50 million; 7.35% to $100 million; 7.85% to $150 million; 8.75% above $150 million. The rate for your band applies to all ACT wages above the threshold amount.",
    thresholdSummary:
      "The threshold is $1.75 million a year (it was $2 million until 30 June 2026), apportioned by the ACT share of Australian wages. It does not phase out.",
    extras: "Eligible universities are capped at 6.85%.",
    registration:
      "Apply to register within seven days after the end of the month in which your (or your group's) wages go over the threshold.",
    monthlyDue:
      "7th of the following month for July–November and January–May; the December return is due 14 January (next working day if a weekend or public holiday).",
    annualDue: "28 July 2027 (June wages go in the annual reconciliation)",
    changeFrom2025_26:
      "From 1 July 2026 the threshold fell from $2 million to $1.75 million and the general rate moved from a flat 6.85% (plus surcharges for $50m+ employers) to the banded 6.75%–8.75% scale.",
    revenueOffice: "ACT Revenue Office",
    revenueOfficeUrl: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax",
    ratesUrl: "https://www.revenue.act.gov.au/business-taxes-and-levies/payroll-tax/about-payroll-tax",
    payCalculatorPath: "/pay-calculator-act/",
    workersComp: "WorkSafe ACT",
  },
  nt: {
    code: "nt",
    abbr: "NT",
    name: "Northern Territory",
    headlineRate: "5.5%",
    annualThreshold: NT_PAYROLL_TAX.threshold,
    monthlyThresholdText: "$208,333",
    rateSummary:
      "5.5% on NT taxable wages above the tax-free amount. From 1 July 2026, employers and groups with Australia-wide wages of $100 million or more pay 6.5%.",
    thresholdSummary:
      "The $2.5 million tax-free amount is reduced by $1 for every $2 of Australian wages above $2.5 million, so it disappears at $7.5 million. Interstate employers get the NT share of what is left.",
    extras: null,
    registration:
      "Register within 21 days of the end of the first month in which you pay NT wages and your total Australian taxable wages (including your group's) exceed $208,333.",
    monthlyDue: "21st of the following month (next business day if the 21st is a weekend or public holiday).",
    annualDue: "21 July 2027",
    changeFrom2025_26: "A 6.5% rate for employers and groups with $100 million or more of Australia-wide wages starts on 1 July 2026. The $2.5 million threshold and the 5.5% general rate are unchanged.",
    revenueOffice: "Territory Revenue Office",
    revenueOfficeUrl: "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax",
    ratesUrl:
      "https://treasury.nt.gov.au/dtf/territory-revenue-office/payroll-tax/payroll-tax-rates-and-thresholds",
    payCalculatorPath: "/pay-calculator-nt/",
    workersComp: "NT WorkSafe",
  },
};

/** Payroll Tax Australia — harmonised lodgement rules (monthly by the 7th; annual 21 July, or 28 July in NSW, ACT, SA). */
export const PAYROLL_TAX_AUSTRALIA_URL = "https://www.payrolltax.gov.au/lodging";

/** Worked example salary bill used on the state pages (a mid-sized employer). */
export const EXAMPLE_WAGE_BILLS = [1_500_000, 3_000_000, 5_000_000, 10_000_000] as const;
