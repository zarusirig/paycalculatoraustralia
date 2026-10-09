// Config for the 6 year-locked tax-table pages: /{weekly,fortnightly,monthly}-tax-table/{fy}/
//
// Each page is one pay cycle x one ATO edition, keyed by financial year:
// 2026-27, and 2025-26, whose page also covers 2024-25 because the ATO issued
// one edition for 1 July 2024 to 30 June 2026. The old /…/2024-25/ URLs 301 to
// /…/2025-26/ (firebase.json). The cycle landing pages (/weekly-tax-table/
// etc.) stay the canonical page for the generic head terms; these pages answer
// "which table applies to a payment made in year X" and are year-locked.

import {
  PAYG_TABLE_YEARS,
  PAYG_YEAR_INFO,
  type PayFrequency,
  type PaygFinancialYear,
} from "@/lib/constants/payg-withholding";
import {
  ATO_FORTNIGHTLY,
  ATO_MONTHLY,
  ATO_WEEKLY,
  type AtoScheduleDoc,
} from "./ato-schedules";

export interface FyCycleConfig {
  readonly frequency: PayFrequency;
  /** Route segment of the cycle landing page, also the GUIDE_AUTHORSHIP key. */
  readonly slug: string;
  readonly label: string; // "Fortnightly"
  readonly period: string; // "fortnight"
  readonly pays: number; // pays a year the table assumes
  readonly ato: AtoScheduleDoc;
  /** Gross per period for the worked example. */
  readonly exampleGross: number;
  readonly calculatorHref: string;
  readonly calculatorLabel: string;
}

export const FY_CYCLES: Record<PayFrequency, FyCycleConfig> = {
  weekly: {
    frequency: "weekly",
    slug: "weekly-tax-table",
    label: "Weekly",
    period: "week",
    pays: 52,
    ato: ATO_WEEKLY,
    exampleGross: 1_500,
    calculatorHref: "/weekly-pay-calculator/",
    calculatorLabel: "Weekly pay calculator",
  },
  fortnightly: {
    frequency: "fortnightly",
    slug: "fortnightly-tax-table",
    label: "Fortnightly",
    period: "fortnight",
    pays: 26,
    ato: ATO_FORTNIGHTLY,
    exampleGross: 3_000,
    calculatorHref: "/fortnightly-pay-calculator/",
    calculatorLabel: "Fortnightly pay calculator",
  },
  monthly: {
    frequency: "monthly",
    slug: "monthly-tax-table",
    label: "Monthly",
    period: "month",
    pays: 12,
    ato: ATO_MONTHLY,
    exampleGross: 6_500,
    calculatorHref: "/monthly-pay-calculator/",
    calculatorLabel: "Monthly pay calculator",
  },
};

export const FY_CYCLE_ORDER: readonly PayFrequency[] = ["weekly", "fortnightly", "monthly"];

/** Static params for a cycle's [fy] route. */
export function fyStaticParams(): { fy: string }[] {
  return PAYG_TABLE_YEARS.map((fy) => ({ fy }));
}

export function parseFy(raw: string): PaygFinancialYear | null {
  return (PAYG_TABLE_YEARS as readonly string[]).includes(raw) ? (raw as PaygFinancialYear) : null;
}

export function fyPath(frequency: PayFrequency, fy: PaygFinancialYear): string {
  return `/${FY_CYCLES[frequency].slug}/${fy}/`;
}

/** "1 July 2024" style dates for the year's pay-date window. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function fyWindow(fy: PaygFinancialYear): string {
  const info = PAYG_YEAR_INFO[fy];
  return `${longDate(info.payDatesFrom)} to ${longDate(info.payDatesTo)}`;
}

/** "2026-27" or "2024-25 and 2025-26": every financial year the table covers. */
export function fyLabel(fy: PaygFinancialYear): string {
  return PAYG_YEAR_INFO[fy].label;
}

/** "2026-27" or "2024-25 or 2025-26", for "a payment made in …". */
export function fyLabelOr(fy: PaygFinancialYear): string {
  return PAYG_YEAR_INFO[fy].coversYears.join(" or ");
}

/** The year before / after, within the years the site carries. */
export function adjacentFys(fy: PaygFinancialYear): { newer: PaygFinancialYear | null; older: PaygFinancialYear | null } {
  const i = PAYG_TABLE_YEARS.indexOf(fy);
  return { newer: PAYG_TABLE_YEARS[i - 1] ?? null, older: PAYG_TABLE_YEARS[i + 1] ?? null };
}
