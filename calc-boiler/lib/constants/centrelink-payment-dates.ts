// =============================================================================
// Centrelink payment and reporting dates — how the fortnightly cycle works and
// the Christmas / New Year holiday changes.
//
// SOURCES
//   Services Australia, "Public holiday reporting and payment dates" (QC 26071).
//     Live page read 24 September 2026 (page last updated 23 April 2026): lists
//     the national holidays it closes for, but NO Christmas 2026 dates yet.
//     https://www.servicesaustralia.gov.au/public-holiday-reporting-and-payment-dates
//   The same page as it stood for Christmas 2025 (page last updated 27 October
//   2025), read from the Internet Archive capture of 12 December 2025:
//     https://web.archive.org/web/20251212152946/https://www.servicesaustralia.gov.au/public-holiday-reporting-and-payment-dates?context=64107
//     The four tables below are transcribed from it exactly.
//   Services Australia media release "Holiday changes to Centrelink, Medicare
//   and Child Support services" (QC 83477, 8 December 2025): early payment is
//   "your regular payment paid early", not an extra payment.
//   Services Australia, "When to report" (QC 53206, last updated 30 July 2026):
//   reporting period usually 14 days; report by 5 pm on your reporting date;
//   can't report early unless a public holiday intervenes; late reports up to
//   14 days online.
//
// ⚠️ REFRESH: Services Australia usually publishes the Christmas / New Year
// tables in the last quarter of the year (the 2025 tables were on a version of
// the page dated 27 October 2025). When the 2026-27 tables appear, add them as
// CHRISTMAS_2026_27 below, set CHRISTMAS_2026_27_PUBLISHED = true, and move the
// 2025-26 tables to a "last year" label. Re-check in October 2026.
// =============================================================================

export const CENTRELINK_DATES_SOURCES = {
  holidayPage: "https://www.servicesaustralia.gov.au/public-holiday-reporting-and-payment-dates",
  holidayPage2025Archive:
    "https://web.archive.org/web/20251212152946/https://www.servicesaustralia.gov.au/public-holiday-reporting-and-payment-dates?context=64107",
  mediaRelease2025: "https://www.servicesaustralia.gov.au/holiday-changes-to-centrelink-medicare-and-child-support-services",
  whenToReport: "https://www.servicesaustralia.gov.au/when-to-report-your-income-to-centrelink?context=22196",
  weeklyPaymentOption: "https://www.servicesaustralia.gov.au/weekly-payment-option",
  onlineAccount: "https://www.servicesaustralia.gov.au/centrelink-online-account",
} as const;

export const CENTRELINK_DATES_VERIFIED_ON = "24 September 2026";

/** Flip to true (and add the tables) once Services Australia publishes them. */
export const CHRISTMAS_2026_27_PUBLISHED = false;

/** National public holidays Services Australia closes for (QC 26071). */
export const SA_CLOSED_HOLIDAYS = [
  "New Year's Day",
  "Australia Day",
  "Good Friday",
  "Easter Monday",
  "Anzac Day",
  "Christmas Day",
  "Boxing Day",
] as const;

/**
 * Where those holidays fall in 2026-27 (calendar dates; Monday 28 December is
 * the additional Boxing Day holiday because 26 December 2026 is a Saturday, and
 * Anzac Day 2027 is a Sunday). Whether Services Australia also closes on any
 * other day around Christmas 2026 is not yet published: in 2025 it also closed
 * on Monday 29 December.
 */
export const HOLIDAYS_2026_27: readonly { name: string; iso: string }[] = [
  { name: "Christmas Day", iso: "2026-12-25" },
  { name: "Boxing Day", iso: "2026-12-26" },
  { name: "Boxing Day additional public holiday (most states)", iso: "2026-12-28" },
  { name: "New Year's Day", iso: "2027-01-01" },
  { name: "Australia Day", iso: "2027-01-26" },
  { name: "Good Friday", iso: "2027-03-26" },
  { name: "Easter Monday", iso: "2027-03-29" },
  { name: "Anzac Day", iso: "2027-04-25" },
];

/** The window the 2025 changes covered, applied to 2026-27 for flagging only. */
export const CHRISTMAS_2026_WINDOW = { from: "2026-12-17", to: "2027-01-08" } as const;

export interface ReportingChangeRow {
  normalReporting: string;
  newReporting: string;
  revisedPayment: string;
  nextPayment: string;
}

export interface PaymentChangeRow {
  normalPayment: string;
  revisedPayment: string;
  nextPayment: string;
}

export interface HolidaySchedule {
  label: string;
  /** Days service centres and most call centres closed. */
  closedDays: readonly string[];
  allowances: { report: readonly ReportingChangeRow[]; noReport: readonly PaymentChangeRow[] };
  pensions: { report: readonly ReportingChangeRow[]; noReport: readonly PaymentChangeRow[] };
  pageLastUpdated: string;
}

const r = (normalReporting: string, newReporting: string, revisedPayment: string, nextPayment: string): ReportingChangeRow => ({
  normalReporting,
  newReporting,
  revisedPayment,
  nextPayment,
});
const p = (normalPayment: string, revisedPayment: string, nextPayment: string): PaymentChangeRow => ({
  normalPayment,
  revisedPayment,
  nextPayment,
});

/** Payments covered by the "allowances" tables in 2025. */
export const ALLOWANCE_PAYMENTS = [
  "Austudy",
  "Farm Household Allowance",
  "JobSeeker Payment",
  "Special Benefit",
  "Status Resolution Support Services Payment",
  "Youth Allowance",
] as const;

/** Payments covered by the "pensions" tables in 2025. */
export const PENSION_PAYMENTS = [
  "Family payments",
  "ABSTUDY",
  "Age Pension",
  "Assistance for Isolated Children",
  "Carer Allowance",
  "Carer Payment",
  "Disability Support Pension",
  "Double Orphan Pension",
  "Parenting Payment",
  "Pensioner Education Supplement",
] as const;

/** Christmas 2025 – New Year 2026, exactly as Services Australia published it. */
export const CHRISTMAS_2025_26: HolidaySchedule = {
  label: "Christmas 2025 and New Year 2026",
  closedDays: ["2025-12-25", "2025-12-26", "2025-12-29", "2026-01-01"],
  pageLastUpdated: "27 October 2025",
  allowances: {
    report: [
      r("2025-12-18", "2025-12-18", "2025-12-19", "2026-01-02"),
      r("2025-12-19", "2025-12-19", "2025-12-22", "2026-01-05"),
      r("2025-12-22", "2025-12-19", "2025-12-22", "2026-01-06"),
      r("2025-12-23", "2025-12-22", "2025-12-23", "2026-01-07"),
      r("2025-12-24", "2025-12-22", "2025-12-23", "2026-01-08"),
      r("2025-12-25", "2025-12-23", "2025-12-24", "2026-01-09"),
      r("2025-12-26", "2025-12-23", "2025-12-24", "2026-01-12"),
      r("2025-12-29", "2025-12-24", "2025-12-29", "2026-01-13"),
      r("2025-12-30", "2025-12-24", "2025-12-29", "2026-01-14"),
      r("2025-12-31", "2025-12-30", "2025-12-31", "2026-01-15"),
      r("2026-01-01", "2025-12-31", "2026-01-02", "2026-01-16"),
      r("2026-01-02", "2026-01-02", "2026-01-05", "2026-01-19"),
    ],
    noReport: [
      p("2025-12-19", "2025-12-19", "2026-01-02"),
      p("2025-12-22", "2025-12-22", "2026-01-05"),
      p("2025-12-23", "2025-12-22", "2026-01-06"),
      p("2025-12-24", "2025-12-23", "2026-01-07"),
      p("2025-12-25", "2025-12-23", "2026-01-08"),
      p("2025-12-26", "2025-12-24", "2026-01-09"),
      p("2025-12-29", "2025-12-24", "2026-01-12"),
      p("2025-12-30", "2025-12-29", "2026-01-13"),
      p("2025-12-31", "2025-12-29", "2026-01-14"),
      p("2026-01-01", "2025-12-31", "2026-01-15"),
      p("2026-01-02", "2026-01-02", "2026-01-16"),
      p("2026-01-05", "2026-01-05", "2026-01-19"),
    ],
  },
  pensions: {
    report: [
      r("2025-12-18", "2025-12-18", "2025-12-22", "2026-01-05"),
      r("2025-12-19", "2025-12-19", "2025-12-23", "2026-01-06"),
      r("2025-12-22", "2025-12-19", "2025-12-23", "2026-01-07"),
      r("2025-12-23", "2025-12-22", "2025-12-24", "2026-01-08"),
      r("2025-12-24", "2025-12-22", "2025-12-24", "2026-01-09"),
      r("2025-12-25", "2025-12-23", "2025-12-29", "2026-01-12"),
      r("2025-12-26", "2025-12-23", "2025-12-29", "2026-01-13"),
      r("2025-12-29", "2025-12-24", "2025-12-30", "2026-01-14"),
      r("2025-12-30", "2025-12-24", "2025-12-30", "2026-01-15"),
      r("2025-12-31", "2025-12-30", "2026-01-02", "2026-01-16"),
      r("2026-01-01", "2025-12-31", "2026-01-05", "2026-01-19"),
      r("2026-01-02", "2026-01-02", "2026-01-06", "2026-01-20"),
    ],
    noReport: [
      p("2025-12-22", "2025-12-22", "2026-01-05"),
      p("2025-12-23", "2025-12-23", "2026-01-06"),
      p("2025-12-24", "2025-12-23", "2026-01-07"),
      p("2025-12-25", "2025-12-24", "2026-01-08"),
      p("2025-12-26", "2025-12-24", "2026-01-09"),
      p("2025-12-29", "2025-12-29", "2026-01-12"),
      p("2025-12-30", "2025-12-29", "2026-01-13"),
      p("2025-12-31", "2025-12-30", "2026-01-14"),
      p("2026-01-01", "2025-12-30", "2026-01-15"),
      p("2026-01-02", "2026-01-02", "2026-01-16"),
      p("2026-01-05", "2026-01-05", "2026-01-19"),
      p("2026-01-06", "2026-01-06", "2026-01-20"),
    ],
  },
};

// ---------------------------------------------------------------------------
// The fortnightly cycle
// ---------------------------------------------------------------------------

function toUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysIso(iso: string, days: number): string {
  const d = toUtc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export type DateFlag = "holiday" | "christmas-window" | null;

export interface ProjectedDate {
  iso: string;
  flag: DateFlag;
  holidayName?: string;
}

/**
 * Normal fortnightly dates from one known date (a payment or reporting date),
 * `count` of them starting at the first on or after `from`. Flags dates that
 * land on a 2026-27 national holiday or inside the Christmas window, where
 * Services Australia may move the date EARLIER (it doesn't delay payments).
 * These are the dates your cycle would fall on with no holiday changes — the
 * dates in your Centrelink online account are the ones that count.
 */
export function projectFortnightlyDates(known: string, from: string, count: number): ProjectedDate[] {
  const diff = Math.round((toUtc(from).getTime() - toUtc(known).getTime()) / 86_400_000);
  let d = addDaysIso(known, Math.ceil(diff / 14) * 14);
  const out: ProjectedDate[] = [];
  for (let i = 0; i < count; i++) {
    const holiday = HOLIDAYS_2026_27.find((h) => h.iso === d);
    const inWindow = d >= CHRISTMAS_2026_WINDOW.from && d <= CHRISTMAS_2026_WINDOW.to;
    out.push({ iso: d, flag: holiday ? "holiday" : inWindow ? "christmas-window" : null, holidayName: holiday?.name });
    d = addDaysIso(d, 14);
  }
  return out;
}

/** Days a 2025 early payment came forward (normal → revised), for the "how early" summary. */
export function daysEarly(row: PaymentChangeRow | ReportingChangeRow): number {
  const normal = "normalPayment" in row ? row.normalPayment : row.normalReporting;
  const revised = "normalPayment" in row ? row.revisedPayment : row.newReporting;
  return Math.round((toUtc(normal).getTime() - toUtc(revised).getTime()) / 86_400_000);
}
