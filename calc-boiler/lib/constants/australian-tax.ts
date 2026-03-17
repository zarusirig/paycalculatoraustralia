// =============================================================================
// Australian Tax Constants & Calculator Functions — FY2025-26
// Single Source of Truth — all values from ontology-and-eav-knowledge-base.md
// =============================================================================

// ---------- Income Tax Brackets (FY2025-26, Residents) ----------
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
  label: string;
}

export const TAX_BRACKETS_2025_26: readonly TaxBracket[] = [
  { min: 0, max: 18_200, rate: 0, base: 0, label: "Tax-free threshold" },
  { min: 18_201, max: 45_000, rate: 0.16, base: 0, label: "16c for each $1 over $18,200" },
  { min: 45_001, max: 135_000, rate: 0.30, base: 4_288, label: "30c for each $1 over $45,000" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 31_288, label: "37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 51_638, label: "45c for each $1 over $190,000" },
] as const;

export const TAX_FREE_THRESHOLD = 18_200;

// ---------- Non-Resident Tax Brackets (FY2025-26) ----------
export const NON_RESIDENT_TAX_BRACKETS: readonly TaxBracket[] = [
  { min: 0, max: 135_000, rate: 0.30, base: 0, label: "30c for each $1" },
  { min: 135_001, max: 190_000, rate: 0.37, base: 40_500, label: "37c for each $1 over $135,000" },
  { min: 190_001, max: Infinity, rate: 0.45, base: 60_850, label: "45c for each $1 over $190,000" },
] as const;

// ---------- Low Income Tax Offset (LITO) ----------
export const LITO = {
  maxOffset: 700,
  fullOffsetCeiling: 37_500,
  phaseOut1: { start: 37_501, end: 45_000, rate: 0.05 },
  phaseOut2: { start: 45_001, end: 66_667, rate: 0.015 },
  nilOffsetIncome: 66_667,
  effectiveTaxFreeThreshold: 22_575,
} as const;

// ---------- Medicare Levy ----------
export const MEDICARE_LEVY = {
  rate: 0.02,
  lowIncomeThreshold: 27_222,
  surcharge: {
    tier1: { min: 93_001, max: 108_000, rate: 0.01 },
    tier2: { min: 108_001, max: 144_000, rate: 0.0125 },
    tier3: { min: 144_001, max: Infinity, rate: 0.015 },
  },
} as const;

// ---------- Superannuation Guarantee ----------
export const SUPER_GUARANTEE = {
  rate: 0.12,
  effectiveDate: "1 July 2025",
  previousRate: 0.115,
  maxContributionBasePerQuarter: 62_500,
  maxSGPerQuarter: 7_500,
  concessionalCap: 30_000,
  nonConcessionalCap: 120_000,
} as const;

// ---------- HECS-HELP Repayment (FY2025-26 — New Marginal System) ----------
export interface HECSBand {
  min: number;
  max: number;
  marginalRate: number;
  base: number;
  label: string;
}

export const HECS_HELP = {
  minimumThreshold: 67_000,
  repaymentSystem: "Marginal" as const,
  previousThreshold: 54_435,
  bands: [
    { min: 0, max: 67_000, marginalRate: 0, base: 0, label: "Below threshold" },
    { min: 67_001, max: 125_000, marginalRate: 0.15, base: 0, label: "15c per $1 over $67,000" },
    { min: 125_001, max: 179_285, marginalRate: 0.17, base: 8_700, label: "$8,700 + 17c per $1 over $125,000" },
    { min: 179_286, max: Infinity, marginalRate: 0.10, base: 0, label: "10% of total repayment income" },
  ] as readonly HECSBand[],
} as const;

// ---------- Employment ----------
export const EMPLOYMENT = {
  minimumWageHourly: 24.10,
  minimumWageWeekly: 915.90,
  standardWeeklyHours: 38,
  casualLoading: 0.25,
  annualLeaveWeeks: 4,
  personalLeaveDays: 10,
  penaltyRates: {
    saturdayMin: 1.25,
    saturdayMax: 1.5,
    sundayMin: 1.5,
    sundayMax: 2.0,
    publicHolidayMin: 2.0,
    publicHolidayMax: 2.5,
  },
} as const;

// ---------- Redundancy Pay (NES) ----------
export const REDUNDANCY_WEEKS: readonly { years: string; weeks: number }[] = [
  { years: "1", weeks: 4 },
  { years: "2", weeks: 6 },
  { years: "3", weeks: 7 },
  { years: "4", weeks: 8 },
  { years: "5", weeks: 10 },
  { years: "6", weeks: 11 },
  { years: "7", weeks: 13 },
  { years: "8", weeks: 14 },
  { years: "9", weeks: 16 },
  { years: "10+", weeks: 12 },
] as const;

// ---------- Notice Period (NES) ----------
export const NOTICE_PERIODS: readonly { years: string; weeks: number }[] = [
  { years: "Up to 1 year", weeks: 1 },
  { years: "1–3 years", weeks: 2 },
  { years: "3–5 years", weeks: 3 },
  { years: "5+ years", weeks: 4 },
] as const;

// ---------- State Payroll Tax ----------
export const STATE_PAYROLL_TAX = {
  NSW: { rate: 0.0545, threshold: 1_200_000, name: "New South Wales" },
  VIC: { rate: 0.0485, threshold: 900_000, name: "Victoria" },
  QLD: { rate: 0.0475, threshold: 1_300_000, name: "Queensland" },
  WA: { rate: 0.055, threshold: 1_000_000, name: "Western Australia" },
} as const;

// ---------- Tax Year History (for Stage 3 context) ----------
export const TAX_HISTORY = {
  stage3TaxCuts: {
    effectiveDate: "1 July 2024",
    changes: [
      "Bracket 1 rate reduced from 19% to 16%",
      "Bracket 2 upper limit expanded from $120K to $135K",
    ],
  },
  upcomingFY2026_27: {
    changes: ["Bracket 1 rate reduces from 16% to 15%"],
    effectiveDate: "1 July 2026",
  },
} as const;

// ---------- SG Rate History ----------
export const SG_RATE_HISTORY: readonly { year: string; rate: number }[] = [
  { year: "FY2021-22", rate: 0.10 },
  { year: "FY2022-23", rate: 0.105 },
  { year: "FY2023-24", rate: 0.11 },
  { year: "FY2024-25", rate: 0.115 },
  { year: "FY2025-26", rate: 0.12 },
] as const;

// ---------- Institutional References ----------
export const SOURCES = {
  ato: { name: "Australian Taxation Office", url: "https://www.ato.gov.au", abbr: "ATO" },
  fwc: { name: "Fair Work Commission", url: "https://www.fwc.gov.au", abbr: "FWC" },
  fwo: { name: "Fair Work Ombudsman", url: "https://www.fairwork.gov.au", abbr: "FWO" },
  servicesAustralia: { name: "Services Australia", url: "https://www.servicesaustralia.gov.au" },
  abs: { name: "Australian Bureau of Statistics", url: "https://www.abs.gov.au", abbr: "ABS" },
} as const;

// ---------- Site Config ----------
export const SITE_CONFIG = {
  financialYear: "2025-26",
  financialYearStart: "1 July 2025",
  financialYearEnd: "30 June 2026",
  lastVerified: "14 March 2026",
  domain: "pay-calculator-australia.com",
  baseUrl: "https://pay-calculator-australia.com",
  email: "hello@pay-calculator-australia.com",
  name: "Pay Calculator Australia",
} as const;


// =============================================================================
// CALCULATOR FUNCTIONS
// =============================================================================

/**
 * Calculate income tax for a given taxable income (FY2025-26, resident).
 * Uses progressive marginal rates per EAV Knowledge Base.
 */
export function calculateIncomeTax(income: number, resident = true): number {
  if (income <= 0) return 0;
  const brackets = resident ? TAX_BRACKETS_2025_26 : NON_RESIDENT_TAX_BRACKETS;

  for (let i = brackets.length - 1; i >= 0; i--) {
    const bracket = brackets[i];
    if (income >= bracket.min) {
      return bracket.base + (income - (bracket.min - 1)) * bracket.rate;
    }
  }
  return 0;
}

/**
 * Calculate Low Income Tax Offset.
 * Non-refundable — can reduce tax to zero, not below.
 */
export function calculateLITO(income: number): number {
  if (income <= LITO.fullOffsetCeiling) return LITO.maxOffset;
  if (income <= LITO.phaseOut1.end) {
    return LITO.maxOffset - (income - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
  }
  if (income <= LITO.phaseOut2.end) {
    const reduction1 = (LITO.phaseOut1.end - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate;
    const reduction2 = (income - LITO.phaseOut1.end) * LITO.phaseOut2.rate;
    return Math.max(0, LITO.maxOffset - reduction1 - reduction2);
  }
  return 0;
}

/**
 * Calculate Medicare Levy (standard 2%).
 */
export function calculateMedicareLevy(income: number): number {
  if (income <= 0) return 0;
  // Simplified — low-income reduction not fully modelled
  return Math.round(income * MEDICARE_LEVY.rate);
}

/**
 * Calculate Medicare Levy Surcharge (if no private health insurance).
 */
export function calculateMedicareSurcharge(income: number, hasPrivateHealth: boolean): number {
  if (hasPrivateHealth || income <= MEDICARE_LEVY.surcharge.tier1.min - 1) return 0;
  if (income <= MEDICARE_LEVY.surcharge.tier1.max) return Math.round(income * MEDICARE_LEVY.surcharge.tier1.rate);
  if (income <= MEDICARE_LEVY.surcharge.tier2.max) return Math.round(income * MEDICARE_LEVY.surcharge.tier2.rate);
  return Math.round(income * MEDICARE_LEVY.surcharge.tier3.rate);
}

/**
 * Calculate HECS-HELP repayment under the NEW marginal system (FY2025-26).
 */
export function calculateHECS(income: number): number {
  if (income <= HECS_HELP.minimumThreshold) return 0;

  const bands = HECS_HELP.bands;

  // Band 3: 10% of total income
  if (income >= bands[3].min) {
    return Math.round(income * bands[3].marginalRate);
  }

  // Band 2: $8,700 + 17c per $1 over $125,000
  if (income >= bands[2].min) {
    return Math.round(bands[2].base + (income - 125_000) * bands[2].marginalRate);
  }

  // Band 1: 15c per $1 over $67,000
  if (income >= bands[1].min) {
    return Math.round((income - HECS_HELP.minimumThreshold) * bands[1].marginalRate);
  }

  return 0;
}

/**
 * Calculate employer superannuation contribution (SG).
 * This does NOT reduce take-home — it's paid ON TOP of salary.
 */
export function calculateSuper(income: number): number {
  if (income <= 0) return 0;
  return Math.round(income * SUPER_GUARANTEE.rate);
}

/**
 * Full pay breakdown — the core calculator.
 */
export interface PayBreakdown {
  grossSalary: number;
  taxableIncome: number;
  incomeTax: number;
  litoOffset: number;
  netIncomeTax: number;
  medicareLevy: number;
  medicareSurcharge: number;
  hecsRepayment: number;
  totalDeductions: number;
  takeHomePay: number;
  superContribution: number;
  totalPackage: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  daily: number;
  weekly: number;
  fortnightly: number;
  monthly: number;
  bonus: number;
  overtimeEarnings: number;
  novatedLease: number;
}

export interface CalculatorInputs {
  grossSalary: number;
  includeHECS?: boolean;
  hasPrivateHealth?: boolean;
  salarySacrifice?: number;
  resident?: boolean;
  superIncluded?: boolean;
  proRataHours?: number;
  bonus?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  novatedLease?: number;
  includeBonusInSG?: boolean;
  includeOvertimeInSG?: boolean;
}

export function calculatePayBreakdown(inputs: CalculatorInputs): PayBreakdown {
  const {
    grossSalary: rawGrossSalary,
    includeHECS = false,
    hasPrivateHealth = true,
    salarySacrifice = 0,
    resident = true,
    superIncluded = false,
    proRataHours,
    bonus = 0,
    overtimeHours = 0,
    overtimeRate = 1.5,
    novatedLease = 0,
    includeBonusInSG = false,
    includeOvertimeInSG = false,
  } = inputs;

  // Step 1: Handle super-inclusive salary
  const baseSalary = superIncluded
    ? Math.round(rawGrossSalary / (1 + SUPER_GUARANTEE.rate))
    : rawGrossSalary;

  // Step 2: Handle pro-rata / part-time
  const proRataMultiplier =
    proRataHours != null && proRataHours > 0 && proRataHours < EMPLOYMENT.standardWeeklyHours
      ? proRataHours / EMPLOYMENT.standardWeeklyHours
      : 1;
  const grossSalary = Math.round(baseSalary * proRataMultiplier);

  // Step 3: Calculate overtime earnings
  const baseHourlyRate = grossSalary / (52 * EMPLOYMENT.standardWeeklyHours);
  const overtimeEarnings = Math.round(overtimeHours * baseHourlyRate * overtimeRate * 52);

  // Step 4: Calculate taxable income
  const taxableIncome = Math.max(
    0,
    grossSalary + bonus + overtimeEarnings - salarySacrifice - novatedLease
  );

  // Income tax
  const rawTax = calculateIncomeTax(taxableIncome, resident);
  const litoOffset = resident ? calculateLITO(taxableIncome) : 0;
  const netIncomeTax = Math.max(0, Math.round(rawTax - litoOffset));

  // Medicare
  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const medicareSurcharge = calculateMedicareSurcharge(taxableIncome, hasPrivateHealth);

  // HECS
  const hecsRepayment = includeHECS ? calculateHECS(taxableIncome) : 0;

  // Totals
  const totalDeductions = netIncomeTax + medicareLevy + medicareSurcharge + hecsRepayment;
  const takeHomePay = taxableIncome - totalDeductions;

  // Super (employer-paid, not deducted from salary)
  let superBase = grossSalary;
  if (includeBonusInSG) superBase += bonus;
  if (includeOvertimeInSG) superBase += overtimeEarnings;
  const superContribution = superIncluded
    ? Math.round(rawGrossSalary - baseSalary) // super was embedded in the original figure
    : calculateSuper(superBase);
  const totalPackage = grossSalary + bonus + overtimeEarnings + superContribution;

  // Rates
  const effectiveTaxRate = taxableIncome > 0 ? totalDeductions / taxableIncome : 0;

  // Find marginal rate
  let marginalTaxRate = 0;
  for (const bracket of TAX_BRACKETS_2025_26) {
    if (taxableIncome >= bracket.min) {
      marginalTaxRate = bracket.rate + MEDICARE_LEVY.rate;
    }
  }

  return {
    grossSalary,
    taxableIncome,
    incomeTax: Math.round(rawTax),
    litoOffset: Math.round(litoOffset),
    netIncomeTax,
    medicareLevy,
    medicareSurcharge,
    hecsRepayment,
    totalDeductions,
    takeHomePay,
    superContribution,
    totalPackage,
    effectiveTaxRate,
    marginalTaxRate,
    daily: Math.round((takeHomePay / 260) * 100) / 100,
    weekly: Math.round((takeHomePay / 52) * 100) / 100,
    fortnightly: Math.round((takeHomePay / 26) * 100) / 100,
    monthly: Math.round((takeHomePay / 12) * 100) / 100,
    bonus,
    overtimeEarnings,
    novatedLease,
  };
}

// ---------- Formatting Utilities ----------
export function formatAUD(value: number, decimals = 0): string {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatAUDCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return formatAUD(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ---------- Salary Conversion Utilities ----------
export function annualToWeekly(annual: number): number {
  return Math.round((annual / 52) * 100) / 100;
}

export function annualToFortnightly(annual: number): number {
  return Math.round((annual / 26) * 100) / 100;
}

export function annualToMonthly(annual: number): number {
  return Math.round((annual / 12) * 100) / 100;
}

export function hourlyToAnnual(hourly: number, hoursPerWeek = 38): number {
  return Math.round(hourly * hoursPerWeek * 52);
}

export function weeklyToAnnual(weekly: number): number {
  return Math.round(weekly * 52);
}

export function fortnightlyToAnnual(fortnightly: number): number {
  return Math.round(fortnightly * 26);
}

export function monthlyToAnnual(monthly: number): number {
  return Math.round(monthly * 12);
}
