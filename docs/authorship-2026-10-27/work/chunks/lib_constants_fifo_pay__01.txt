// =============================================================================
// FIFO (fly-in fly-out) pay — roster maths, allowances and tax treatment.
//
// The pay model is arithmetic on the user's own inputs (hourly rate, shift
// length, roster, loadings, allowances). Tax, Medicare and HECS come from the
// site-wide engine (calculatePayBreakdown, FY2026-27). No award or enterprise
// agreement rate is asserted: FIFO pay is set by EAs that differ by employer.
//
// TAX TREATMENT SOURCES (read 24 September 2026)
//   ATO, "Living-away-from-home allowance fringe benefits" (QC 71150, last
//   updated 6 March 2025): a LAFHA is a fringe benefit (FBT, the employer's
//   tax). The taxable value can be reduced by exempt accommodation and food
//   components for FIFO/DIDO employees (with the right declaration). "An
//   allowance paid to an employee for travelling for work is a travel
//   allowance. It is assessable to an employee and doesn't incur FBT."
//   ATO, FBT guide for employers ch. 11 (11.4 taxable value, 11.6 statutory
//   food amount $42 a week per adult and $21 per child, 11.9 FIFO/DIDO
//   definition, 11.11 LAFHA vs travelling allowance: "LAFHAs are a fringe
//   benefit, whereas travelling allowances are part of the employee's
//   assessable income").
//   ATO, "Zone tax offset" (last updated 8 June 2026): eligibility is based on
//   your usual place of residence; "You're not eligible if you work in a
//   qualifying remote or isolated area but don't live there. For example, if
//   you're a fly-in-fly-out worker." (A FIFO worker whose home is itself in a
//   zone — the ATO's Darwin example — can still claim.)
//   ATO, "Trips you can and can't claim" (last updated 4 May 2026): travel
//   between home and your regular place of work is private, even if you live
//   a long way from it (the ATO's North Queensland → Sydney fly-in example).
//
// SUPER: SG is estimated on ordinary hours pay, shift loadings and site
// allowances (ordinary time earnings); overtime is excluded (ATO SGR 2009/2).
// Capped at the maximum contribution base.
// =============================================================================

import { calculatePayBreakdown, SUPER_GUARANTEE, type PayBreakdown } from "./australian-tax";

export const FIFO_SOURCES = {
  lafha:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/accommodation-and-location-related-fringe-benefits/living-away-from-home-allowance-fringe-benefits",
  fbtGuideLafha: "https://www.ato.gov.au/law/view/document?DocID=SAV/FBTGEMP/00012&PiT=99991231235958",
  zoneOffset:
    "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/zone-or-overseas-forces-tax-offsets/zone-tax-offset",
  trips:
    "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/cars-transport-and-travel/trips-you-can-and-can-t-claim",
  ote: "https://www.ato.gov.au/law/view/document?docid=SGR/SGR20092/NAT/ATO/00001",
} as const;

export const FIFO_VERIFIED_ON = "24 September 2026";

/** FBT guide 11.6: statutory food amount per week. */
export const LAFHA_STATUTORY_FOOD = { adultWeekly: 42, childWeekly: 21 } as const;

export interface RosterPreset {
  id: string;
  label: string;
  daysOn: number;
  daysOff: number;
}

export const ROSTER_PRESETS: readonly RosterPreset[] = [
  { id: "2-1", label: "2:1 (14 on, 7 off)", daysOn: 14, daysOff: 7 },
  { id: "8-6", label: "8:6 (8 on, 6 off)", daysOn: 8, daysOff: 6 },
  { id: "7-7", label: "Even time 7:7", daysOn: 7, daysOff: 7 },
  { id: "14-14", label: "Even time 14:14", daysOn: 14, daysOff: 14 },
  { id: "9-5", label: "9:5 (9 on, 5 off)", daysOn: 9, daysOff: 5 },
  { id: "3-1", label: "3:1 (21 on, 7 off)", daysOn: 21, daysOff: 7 },
  { id: "4-1", label: "4:1 (28 on, 7 off)", daysOn: 28, daysOff: 7 },
];

/** 52 weeks, the site-wide convention (lib/constants/australian-tax.ts EMPLOYMENT.weeksPerYear). */
export const FIFO_DAYS_PER_YEAR = 364;

export interface FifoInput {
  daysOn: number;
  daysOff: number;
  shiftHours: number;
  hourlyRate: number;
  /** Ordinary hours per week before overtime, averaged over the roster cycle. */
  ordinaryHoursPerWeek: number;
  overtimeMultiplier: number;
  /** Average shift loading on ordinary hours, per cent (e.g. night shifts). */
  shiftLoadingPct: number;
  /** Taxable site / remote / district allowance per day on site. */
  siteAllowancePerDay: number;
  /** Living-away-from-home allowance per week, if paid (not taxed as your income). */
  lafhaPerWeek: number;
  includeHECS: boolean;
  hasPrivateHealth: boolean;
}

export const FIFO_DEFAULTS: FifoInput = {
  daysOn: 14,
  daysOff: 7,
  shiftHours: 12,
  hourlyRate: 55,
  ordinaryHoursPerWeek: 38,
  overtimeMultiplier: 1.5,
  shiftLoadingPct: 0,
  siteAllowancePerDay: 0,
  lafhaPerWeek: 0,
  includeHECS: false,
  hasPrivateHealth: true,
};

export interface FifoResult {
  cycleDays: number;
  cyclesPerYear: number;
  daysOnSitePerYear: number;
  hoursPerCycle: number;
  ordinaryHoursPerCycle: number;
  overtimeHoursPerCycle: number;
  perCycle: { ordinary: number; loading: number; overtime: number; allowances: number; gross: number };
  annual: { ordinary: number; loading: number; overtime: number; allowances: number; gross: number; hours: number };
  tax: PayBreakdown;
  /** Take-home per roster cycle (swing plus break). */
  takeHomePerCycle: number;
  takeHomePerFortnight: number;
  employerSuper: number;
  superCapped: boolean;
  lafhaAnnual: number;
  /** Gross ÷ every hour worked. */
  effectiveHourly: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateFifoPay(input: FifoInput): FifoResult {
  const daysOn = Math.max(1, Math.round(input.daysOn));
  const daysOff = Math.max(0, Math.round(input.daysOff));
  const cycleDays = daysOn + daysOff;
  const cyclesPerYear = FIFO_DAYS_PER_YEAR / cycleDays;
  const rate = Math.max(0, input.hourlyRate);

  const hoursPerCycle = daysOn * Math.max(0, input.shiftHours);
  const ordinaryCap = Math.max(0, input.ordinaryHoursPerWeek) * (cycleDays / 7);
  const ordinaryHoursPerCycle = Math.min(hoursPerCycle, ordinaryCap);
  const overtimeHoursPerCycle = hoursPerCycle - ordinaryHoursPerCycle;

  const ordinary = ordinaryHoursPerCycle * rate;
  const loading = ordinary * (Math.max(0, input.shiftLoadingPct) / 100);
  const overtime = overtimeHoursPerCycle * rate * Math.max(1, input.overtimeMultiplier);
  const allowances = daysOn * Math.max(0, input.siteAllowancePerDay);
  const gross = ordinary + loading + overtime + allowances;

  const annual = {
    ordinary: Math.round(ordinary * cyclesPerYear),
    loading: Math.round(loading * cyclesPerYear),
    overtime: Math.round(overtime * cyclesPerYear),
    allowances: Math.round(allowances * cyclesPerYear),
    gross: Math.round(gross * cyclesPerYear),
    hours: Math.round(hoursPerCycle * cyclesPerYear),
  };

  const tax = calculatePayBreakdown({
    grossSalary: annual.gross,
    includeHECS: input.includeHECS,
    hasPrivateHealth: input.hasPrivateHealth,
  });

  const ote = annual.ordinary + annual.loading + annual.allowances;
  const uncappedSuper = ote * SUPER_GUARANTEE.rate;
  const superCapped = ote > SUPER_GUARANTEE.maxContributionBaseAnnual;
  const employerSuper = Math.round(superCapped ? SUPER_GUARANTEE.maxSGAnnual : uncappedSuper);

  return {
    cycleDays,
    cyclesPerYear,
    daysOnSitePerYear: Math.round(daysOn * cyclesPerYear),
    hoursPerCycle,
    ordinaryHoursPerCycle: round2(ordinaryHoursPerCycle),
    overtimeHoursPerCycle: round2(overtimeHoursPerCycle),
    perCycle: { ordinary: round2(ordinary), loading: round2(loading), overtime: round2(overtime), allowances: round2(allowances), gross: round2(gross) },
    annual,
    tax,
    takeHomePerCycle: round2(tax.takeHomePay / cyclesPerYear),
    takeHomePerFortnight: round2(tax.takeHomePay / 26),
    employerSuper,
    superCapped,
    lafhaAnnual: Math.round(Math.max(0, input.lafhaPerWeek) * 52),
    effectiveHourly: annual.hours > 0 ? round2(annual.gross / annual.hours) : 0,
  };
}
