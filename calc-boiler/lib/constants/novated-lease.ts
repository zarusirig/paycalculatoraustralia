// =============================================================================
// Novated leases — FBT, the electric car exemption, and what a lease does to a
// payslip. FY2026-27 income year / FBT year ending 31 March 2027.
//
// Every figure below was read from the ATO page named next to it on
// 28 August 2026 (NOVATED_LEASE_SOURCES). Nothing here is estimated.
//
// THREE THINGS THAT ARE EASY TO GET WRONG, AND HOW THIS FILE HANDLES THEM:
//
//   1. THE FBT YEAR IS NOT THE INCOME YEAR. FBT runs 1 April to 31 March; the
//      income year runs 1 July to 30 June. The statutory formula apportions by
//      days in the FBT year, so a lease that starts mid-year is only ever a
//      part-year benefit. FBT.yearLabel is rendered wherever FBT figures are.
//
//   2. PLUG-IN HYBRIDS LOST THE EXEMPTION ON 1 APRIL 2025 — but a PHEV that
//      was already used, or available for use, before that date AND is under a
//      financially binding commitment to keep providing it can continue to be
//      exempt. The ATO has no discretion to extend the date, and any change to
//      the commitment (an optional extension, a change to lease payments or
//      the residual, a change of employer) ends the exemption from that point.
//      isFbtExempt() therefore refuses to treat a PHEV as exempt unless the
//      caller states the pre-1 April 2025 arrangement exists.
//
//   3. AN FBT-EXEMPT ELECTRIC CAR IS STILL A REPORTABLE FRINGE BENEFIT. The
//      notional taxable value, grossed up at the type 2 rate, lands in the
//      income tests for HECS-HELP repayment income, the Medicare levy
//      surcharge and Division 293 — even though no FBT is payable and the
//      amount is never taxed. reportableFringeBenefitsAmount() is applied to
//      exempt cars exactly as it is to taxable ones.
//
// Finance charges (interest) are NOT modelled anywhere in this file — see
// NOVATED_LEASE_UNVERIFIED. Every "cost" here is capital plus running costs.
// =============================================================================

import {
  calculateHECS,
  calculateMedicareSurcharge,
  calculatePayBreakdown,
} from "./australian-tax";

export const NOVATED_LEASE_SOURCES = {
  verifiedOn: "28 August 2026",
  /** FBT rate, gross-up rates, statutory formula rate, reportable thresholds. */
  fbtRatesAndThresholds:
    "https://www.ato.gov.au/tax-rates-and-codes/fringe-benefits-tax-rates-and-thresholds",
  /** Statutory formula: (A x B x C / D) - E, and what the base value includes. */
  taxableValueOfACarFringeBenefit:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/cars-and-fbt/taxable-value-of-a-car-fringe-benefit",
  /** Which cars are exempt, and the LCT condition. */
  electricCarsExemption:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/electric-cars-exemption",
  /** The 1 April 2025 PHEV cut-off and the transitional rule. */
  phevExemption:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/fbt-on-plug-in-hybrid-electric-vehicles",
  /** LCT thresholds, including the fuel-efficient threshold that caps the exemption. */
  lctThresholds: "https://www.ato.gov.au/tax-rates-and-codes/luxury-car-tax-rate-and-thresholds",
  /** What a fuel-efficient car is (definition changed 1 July 2025). */
  lctDefinitions:
    "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/luxury-car-tax/definitions-luxury-car-tax",
  /** RFBA: what it is, and that it is not taxed. */
  reportableFringeBenefits:
    "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/reportable-fringe-benefits-for-employees",
  /** The income tests an RFBA feeds: HELP repayment income, MLS, Division 293. */
  reportableConsequences:
    "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/reportable-fringe-benefits-for-employees/consequences-of-having-a-reportable-fringe-benefits-amount",
  /** TD 93/142 — minimum residual values as a percentage of cost. */
  residualValues: "https://www.ato.gov.au/law/view/document?docid=TXD/TD93142/NAT/ATO/00001",
  /** FBT guide ch 7.8 — statutory formula, including the one-third base value reduction. */
  fbtGuideStatutoryFormula:
    "https://www.ato.gov.au/law/view/document?DocID=SAV/FBTGEMP/00008&PiT=99991231235958",
} as const;

// ---------- FBT rates ----------
// ATO "Fringe benefits tax - rates and thresholds", last updated 20 May 2026.
// The 47% rate and both gross-up rates are fixed for the FBT years ending
// 31 March 2023 through 31 March 2027 — they do not move with the income tax
// cuts that took effect on 1 July 2026.
export const FBT = {
  /** FBT years ending 31 March 2023, 2024, 2025, 2026 and 2027. */
  rate: 0.47,
  /** Provider entitled to a GST credit — the normal novated lease case. */
  grossUpType1: 2.0802,
  /** Provider not entitled to GST credits; also used for ALL reportable amounts. */
  grossUpType2: 1.8868,
  /** Flat since 1 April 2014, regardless of kilometres travelled. */
  statutoryRate: 0.20,
  yearStart: "1 April",
  yearEnd: "31 March",
  yearLabel: "1 April 2026 to 31 March 2027",
  yearEnding: "31 March 2027",
  daysInYear: 365,
  /** Report on the income statement once taxable value EXCEEDS this. */
  reportableThreshold: 2_000,
  /** The ATO's own worked figure for a taxable value of $2,000.01. */
  reportableMinimumGrossedUp: 3_773,
  /** PCG 2024/2 shortcut, FBT year ending 31 March 2027 (4.20c before that). */
  evHomeChargingCentsPerKm: 5.47,
} as const;

/** Cost of $1 of taxable value: gross up at type 1, tax at 47%. */
export const FBT_COST_PER_DOLLAR = FBT.grossUpType1 * FBT.rate; // 0.977694

// ---------- Electric car exemption ----------
// ATO "Electric cars exemption", last updated 1 April 2026, and
// ATO "FBT on plug-in hybrid electric vehicles", last updated 14 March 2025.
export const EV_EXEMPTION = {
  /** A zero or low emissions vehicle for FBT is one of these two only. */
  eligibleTypes: ["battery electric vehicle", "hydrogen fuel cell electric vehicle"] as const,
  /** Must be a car under 1 tonne and fewer than 9 seats. Motorcycles never qualify. */
  firstHeldAndUsedFrom: "1 July 2022",
  /** PHEVs stopped being zero or low emissions vehicles on this date. */
  phevExcludedFrom: "1 April 2025",
  /**
   * The condition the ATO actually writes is "LCT has never been payable on
   * the importation or sale of the car" — which means the value must be below
   * the LCT threshold for FUEL-EFFICIENT vehicles at the first retail sale and
   * at every later sale. It is not the "other vehicles" threshold, and it is
   * not the income tax car limit.
   */
  lctTest: "LCT has never been payable on the importation or sale of the car",
  /** Government review of the exemption due by mid-2027. No sunset date in law. */
  reviewDue: "mid-2027",
} as const;

// ---------- Luxury car tax thresholds ----------
// ATO "Luxury car tax rate and thresholds", last updated 1 June 2026.
// Indexation factor for 2026-27: 1.003. From 1 July 2025 a fuel-efficient car
// is one with a combined fuel consumption of 3.5 L/100km or less (7 L/100km
// before that date) — Treasury Laws Amendment (Tax Incentives and Integrity)
// Act 2025.
export const LUXURY_CAR_TAX = {
  financialYear: "2026-27",
  rate: 0.33,
  fuelEfficientThreshold: 91_661,
  otherVehiclesThreshold: 80_809,
  fuelEfficientThresholdPrevious: 91_387,
  otherVehiclesThresholdPrevious: 80_567,
  fuelEfficientLitresPer100km: 3.5,
  fuelEfficientDefinitionFrom: "1 July 2025",
} as const;

// ---------- Minimum residual values ----------
// ATO Taxation Determination TD 93/142, table at paragraph 3A (leases entered
// into after 30 June 2018), 8-year effective life column — the column the
// determination's own worked example uses for a car. The percentages follow
// 75% - [(75% / 8) x years], which the test reproduces.
//
// These are MINIMUMS. A lease may be written with a higher residual, which
// lowers the payments and raises the balloon at the end.
export const RESIDUAL_MINIMUM_PCT: Readonly<Record<number, number>> = {
  1: 0.6563,
  2: 0.5625,
  3: 0.4688,
  4: 0.3750,
  5: 0.2813,
};

export const LEASE_TERMS = [1, 2, 3, 4, 5] as const;
export type LeaseTerm = (typeof LEASE_TERMS)[number];

/**
 * Not modelled, and not to be published as if it were:
 *  - Finance charges. The interest rate on a novated lease is set by the
 *    financier and quoted per deal; this site does not model, compare or
 *    recommend lease finance. Every figure here is capital plus running costs.
 *  - The GST credit the employer claims on lease payments and running costs.
 *    Whether it is passed into your packaging budget is a matter for your
 *    quote, so both sides of the comparison here are GST-inclusive.
 *  - GST payable by the employer on an employee contribution under ECM, which
 *    some providers gross the post-tax deduction up for.
 *  - The one-third base value reduction available from the FBT year beginning
 *    after the car's fourth anniversary (FBT guide ch 7.8.1) — it would lower
 *    FBT in a fifth year, so a 5-year statutory-method result here is the
 *    conservative one.
 *  - The operating cost (logbook) method of valuing the benefit.
 *  - Division 293 tax, which also counts a reportable fringe benefits amount.
 *  - Part-year leases: every figure is a full FBT year of availability.
 */
export const NOVATED_LEASE_UNVERIFIED = [
  "Lease finance charges (interest) — set per deal by the financier, and out of scope for this site",
  "The GST credit the employer claims on lease payments and running costs, and whether your provider passes it on",
  "GST payable by the employer on an ECM post-tax contribution",
  "The one-third base value reduction from the FBT year after the car's fourth anniversary",
  "The operating cost (logbook) method of valuing a car fringe benefit",
  "Division 293 tax, which also counts your reportable fringe benefits amount",
  "Part-year leases — every figure assumes a full FBT year of private availability",
] as const;

// =============================================================================
// FUNCTIONS
// =============================================================================

export type VehicleType = "bev" | "phev" | "other";
export type FbtMethod = "ecm" | "statutory";

/** Minimum residual under TD 93/142 for a car (8-year effective life). */
export function minimumResidual(basePrice: number, termYears: number): number {
  const pct = RESIDUAL_MINIMUM_PCT[termYears];
  if (!Number.isFinite(basePrice) || basePrice <= 0 || pct === undefined) return 0;
  return basePrice * pct;
}

/**
 * Statutory formula taxable value: (A x B x C / D) - E.
 * A = base value (GST-inclusive cost, excluding registration and stamp duty),
 * B = 20%, C = days available for private use, D = days in the FBT year,
 * E = employee contribution. Never negative.
 */
export function statutoryTaxableValue(
  baseValue: number,
  daysAvailable: number = FBT.daysInYear,
  employeeContribution = 0
): number {
  if (!Number.isFinite(baseValue) || baseValue <= 0) return 0;
  const gross = baseValue * FBT.statutoryRate * (daysAvailable / FBT.daysInYear);
  return Math.max(0, gross - Math.max(0, employeeContribution));
}

/** FBT payable on a taxable value where the employer can claim GST credits. */
export function fbtPayable(taxableValue: number): number {
  if (!Number.isFinite(taxableValue) || taxableValue <= 0) return 0;
  return taxableValue * FBT_COST_PER_DOLLAR;
}

/**
 * Reportable fringe benefits amount. Reported only where the taxable value
 * EXCEEDS $2,000, and always grossed up at the LOWER (type 2) rate — whether
 * the benefit is type 1 or type 2, and whether or not FBT was payable.
 */
export function reportableFringeBenefitsAmount(taxableValue: number): number {
  if (!Number.isFinite(taxableValue) || taxableValue <= FBT.reportableThreshold) return 0;
  return Math.floor(taxableValue * FBT.grossUpType2);
}

/**
 * Is the car exempt from FBT under the electric cars exemption?
 *
 * Battery electric and hydrogen fuel cell cars: yes, while the GST-inclusive
 * value is at or below the LCT fuel-efficient threshold (so LCT was never
 * payable) and the car was first held and used on or after 1 July 2022.
 *
 * Plug-in hybrids: only where the car was used, or available for use, before
 * 1 April 2025 AND a financially binding commitment continues to provide it.
 * The caller must assert that; there is no default yes.
 */
export function isFbtExempt(
  vehicleType: VehicleType,
  gstInclusiveValue: number,
  phevCommittedBefore1April2025 = false
): boolean {
  const underLctThreshold = gstInclusiveValue <= LUXURY_CAR_TAX.fuelEfficientThreshold;
  if (vehicleType === "bev") return underLctThreshold;
  if (vehicleType === "phev") return phevCommittedBefore1April2025 && underLctThreshold;
  return false;
}

/**
 * The marginal rate at which the employee contribution method stops paying.
 *
 * A dollar of post-tax contribution removes a dollar of taxable value, and so
 * removes FBT.grossUpType1 x FBT.rate of FBT — which, if the FBT is funded
 * from pre-tax salary, would itself have cost (1 - m) after tax. ECM wins
 * while 1 < (1 + grossUp1 x rate) x (1 - m).
 *
 * At the FY2026-27 rates this is 49.4%, above the 47% top marginal rate
 * including the Medicare levy — so ECM is the cheaper method at every rate an
 * Australian resident employee can face this year.
 */
export function ecmBreakEvenMarginalRate(): number {
  return 1 - 1 / (1 + FBT_COST_PER_DOLLAR);
}

export interface NovatedLeaseInputs {
  /** Annual base salary, excluding employer super. */
  salary: number;
  /** GST-inclusive purchase price, excluding registration and stamp duty. */
  vehiclePrice: number;
  termYears: number;
  /** Fuel or charging, insurance, rego, tyres, servicing — one year's worth. */
  annualRunningCosts: number;
  vehicleType: VehicleType;
  fbtMethod: FbtMethod;
  includeHECS?: boolean;
  /** Private hospital cover — false means the Medicare levy surcharge can apply. */
  privateHospitalCover?: boolean;
  /** PHEV in place and available for use before 1 April 2025 under a binding commitment. */
  phevCommittedBefore1April2025?: boolean;
}

export interface PayPosition {
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  medicareSurcharge: number;
  hecsRepayment: number;
  /** Taxable income + RFBA — what the HECS and MLS income tests actually use. */
  incomeTestIncome: number;
  takeHome: number;
}

export interface NovatedLeaseResult {
  exempt: boolean;
  /** The method actually applied — an exempt car has no FBT to offset. */
  methodApplied: FbtMethod | "exempt";
  baseValue: number;
  residualPct: number;
  residual: number;
  /** (price - residual) / term. Capital only: no finance charges. */
  annualCapital: number;
  annualLeaseCost: number;
  /** 20% of base value for a full FBT year, before any employee contribution. */
  statutoryValue: number;
  employeeContribution: number;
  taxableValueAfterContribution: number;
  fbt: number;
  reportableFringeBenefits: number;
  preTaxDeduction: number;
  postTaxDeduction: number;
  before: PayPosition;
  after: PayPosition;
  /** Fall in annual take-home pay — what the car costs you after tax, per year. */
  annualCostToYou: number;
  /** Take-home cost over the term plus the residual you pay to own the car. */
  leaseTotalCost: number;
  /** The same car bought outright from take-home pay, plus running costs. */
  buyTotalCost: number;
  /** buyTotalCost - leaseTotalCost. Positive means the lease costs less. */
  difference: number;
  /** True where the pre-tax deduction was capped at the salary. */
  exceedsSalary: boolean;
}

function position(
  salary: number,
  preTax: number,
  rfba: number,
  includeHECS: boolean,
  privateHospitalCover: boolean
): PayPosition {
  // hasPrivateHealth: true and includeHECS: false keep the shared engine out of
  // the two income tests that an RFBA changes; both are added back below on the
  // RFBA-inclusive income instead of on taxable income.
  const pay = calculatePayBreakdown({
    grossSalary: salary,
    salarySacrifice: preTax,
    includeHECS: false,
    hasPrivateHealth: true,
  });
  const incomeTestIncome = pay.taxableIncome + rfba;
  const hecsRepayment = includeHECS ? calculateHECS(incomeTestIncome) : 0;
  const medicareSurcharge = calculateMedicareSurcharge(incomeTestIncome, privateHospitalCover);
  return {
    taxableIncome: pay.taxableIncome,
    incomeTax: pay.netIncomeTax,
    medicareLevy: pay.medicareLevy,
    medicareSurcharge,
    hecsRepayment,
    incomeTestIncome,
    takeHome: pay.takeHomePay - hecsRepayment - medicareSurcharge,
  };
}

/**
 * The whole model, in the order a payroll system applies it:
 *   1. Work out the year's lease cost (capital + running costs).
 *   2. Work out the FBT taxable value under the statutory formula.
 *   3. Apply the chosen FBT method — ECM takes the taxable value out of
 *      post-tax pay; the statutory method leaves FBT payable, funded from the
 *      pre-tax deduction.
 *   4. Gross up whatever taxable value is left for reporting, and run the HECS
 *      and Medicare levy surcharge tests on taxable income PLUS that amount.
 */
export function calculateNovatedLease(inputs: NovatedLeaseInputs): NovatedLeaseResult {
  const {
    salary,
    vehiclePrice,
    termYears,
    annualRunningCosts,
    vehicleType,
    fbtMethod,
    includeHECS = false,
    privateHospitalCover = true,
    phevCommittedBefore1April2025 = false,
  } = inputs;

  const baseValue = Math.max(0, vehiclePrice);
  const running = Math.max(0, annualRunningCosts);
  const residualPct = RESIDUAL_MINIMUM_PCT[termYears] ?? 0;
  const residual = minimumResidual(baseValue, termYears);
  const annualCapital = termYears > 0 ? (baseValue - residual) / termYears : 0;
  const annualLeaseCost = annualCapital + running;

  const exempt = isFbtExempt(vehicleType, baseValue, phevCommittedBefore1April2025);
  const statutoryValue = statutoryTaxableValue(baseValue);

  // An exempt car has no FBT to offset, so nobody makes an employee
  // contribution — but the notional taxable value is still reportable.
  const useEcm = !exempt && fbtMethod === "ecm";
  const employeeContribution = useEcm ? Math.min(statutoryValue, annualLeaseCost) : 0;
  const taxableValueAfterContribution = exempt
    ? statutoryValue // notional: what it would be if the exemption did not apply
    : Math.max(0, statutoryValue - employeeContribution);
  const fbt = exempt ? 0 : fbtPayable(Math.max(0, statutoryValue - employeeContribution));
  const reportableFringeBenefits = reportableFringeBenefitsAmount(taxableValueAfterContribution);

  const rawPreTax = annualLeaseCost - employeeContribution + fbt;
  const preTaxDeduction = Math.min(Math.max(0, rawPreTax), Math.max(0, salary));
  const exceedsSalary = rawPreTax > salary;
  const postTaxDeduction = employeeContribution;

  const before = position(salary, 0, 0, includeHECS, privateHospitalCover);
  const withSacrifice = position(
    salary,
    preTaxDeduction,
    reportableFringeBenefits,
    includeHECS,
    privateHospitalCover
  );
  const after: PayPosition = {
    ...withSacrifice,
    takeHome: withSacrifice.takeHome - postTaxDeduction,
  };

  const annualCostToYou = before.takeHome - after.takeHome;
  const leaseTotalCost = annualCostToYou * termYears + residual;
  const buyTotalCost = baseValue + running * termYears;

  return {
    exempt,
    methodApplied: exempt ? "exempt" : fbtMethod,
    baseValue,
    residualPct,
    residual,
    annualCapital,
    annualLeaseCost,
    statutoryValue,
    employeeContribution,
    taxableValueAfterContribution,
    fbt,
    reportableFringeBenefits,
    preTaxDeduction,
    postTaxDeduction,
    before,
    after,
    annualCostToYou,
    leaseTotalCost,
    buyTotalCost,
    difference: buyTotalCost - leaseTotalCost,
    exceedsSalary,
  };
}
