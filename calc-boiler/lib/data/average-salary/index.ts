// =============================================================================
// Average and median earnings in Australia — ABS figures only.
//
// Every number in this file was read on 23 September 2026 from one of three
// Australian Bureau of Statistics releases, named in AVERAGE_SALARY_SOURCES:
//
//   AWE  Average Weekly Earnings, Australia, May 2026 (released 13 Aug 2026).
//        The mean. Employer survey. The headline "average salary" figure.
//   EE   Employee Earnings, August 2025 (released 12 Dec 2025). The median and
//        the percentiles. Household survey, earnings in the main job.
//   EEH  Employee Earnings and Hours, Australia, May 2025 (released 23 Jan
//        2026). Biennial employer survey; used for its full-time quartiles.
//
// Nothing here is estimated, projected forward or taken from a job board. Weekly
// figures are exactly as the ABS publishes them; annual figures are weekly × 52
// and are the ONLY derived numbers (plus the cumulative shares computed from
// the published EE distribution counts). Re-verify when the next AWE release
// lands (November 2026 reference period, due 25 February 2027).
// =============================================================================

export const WEEKS_PER_YEAR = 52;

/** Weekly → annual, whole dollars. The only transformation applied to ABS figures. */
export function annualise(weekly: number): number {
  return Math.round(weekly * WEEKS_PER_YEAR);
}

export interface AbsRelease {
  id: "awe" | "ee" | "eeh";
  title: string;
  referencePeriod: string;
  released: string;
  url: string;
}

export const AWE_RELEASE: AbsRelease = {
  id: "awe",
  title: "Average Weekly Earnings, Australia",
  referencePeriod: "May 2026",
  released: "13 August 2026",
  url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia/may-2026",
};

export const EE_RELEASE: AbsRelease = {
  id: "ee",
  title: "Employee Earnings",
  referencePeriod: "August 2025",
  released: "12 December 2025",
  url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings/aug-2025",
};

export const EEH_RELEASE: AbsRelease = {
  id: "eeh",
  title: "Employee Earnings and Hours, Australia",
  referencePeriod: "May 2025",
  released: "23 January 2026",
  url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings-and-hours-australia/may-2025",
};

export const AVERAGE_SALARY_RELEASES: AbsRelease[] = [AWE_RELEASE, EE_RELEASE, EEH_RELEASE];

/** Date the figures below were read from the releases. */
export const AVERAGE_SALARY_VERIFIED_ON = "23 September 2026";
export const AVERAGE_SALARY_VERIFIED_ISO = "2026-09-23";
/** The next release that will change the headline. */
export const NEXT_AWE_RELEASE = { referencePeriod: "November 2026", date: "25 February 2027" };

// ---------------------------------------------------------------------------
// AWE — the mean (May 2026)
// ---------------------------------------------------------------------------

/** Seasonally adjusted national headline figures, May 2026. */
export const AWE_HEADLINE = {
  /** Full-time adult average weekly ordinary time earnings (AWOTE). THE average salary figure. */
  fullTimeOrdinaryWeekly: 2083.7,
  /** Year-on-year change in AWOTE, per cent. */
  fullTimeOrdinaryAnnualChangePct: 3.7,
  /** Full-time adult average weekly total earnings (ordinary time + overtime). */
  fullTimeTotalWeekly: 2160.0,
  /** All employees (full-time + part-time, any age) average weekly total earnings. */
  allEmployeesTotalWeekly: 1579.2,
  /** AWOTE for males and females, seasonally adjusted. */
  maleFullTimeOrdinaryWeekly: 2181.0,
  femaleFullTimeOrdinaryWeekly: 1934.5,
} as const;

/** AWOTE by sector, original series, May 2026. */
export const AWE_BY_SECTOR = {
  private: 2034.1,
  public: 2263.1,
} as const;

export interface WeeklyRow {
  label: string;
  /** Short code, e.g. "NSW". */
  code?: string;
  weekly: number;
  male?: number;
  female?: number;
}

/** AWOTE by state and territory, original series, May 2026. Order as published. */
export const AWE_BY_STATE: WeeklyRow[] = [
  { label: "New South Wales", code: "NSW", weekly: 2108.8, male: 2204.5, female: 1970.7 },
  { label: "Victoria", code: "VIC", weekly: 2041.1, male: 2140.9, female: 1889.6 },
  { label: "Queensland", code: "QLD", weekly: 2039.7, male: 2122.0, female: 1908.2 },
  { label: "South Australia", code: "SA", weekly: 1970.2, male: 2043.2, female: 1858.0 },
  { label: "Western Australia", code: "WA", weekly: 2227.4, male: 2378.7, female: 1945.1 },
  { label: "Tasmania", code: "TAS", weekly: 1846.3, male: 1854.9, female: 1830.2 },
  { label: "Northern Territory", code: "NT", weekly: 1984.1, male: 2095.3, female: 1853.5 },
  { label: "Australian Capital Territory", code: "ACT", weekly: 2290.2, male: 2331.9, female: 2244.2 },
];

/** AWOTE by industry (ANZSIC division), original series, May 2026. Order as published. */
export const AWE_BY_INDUSTRY: WeeklyRow[] = [
  { label: "Mining", weekly: 3224.2, male: 3321.4, female: 2848.9 },
  { label: "Manufacturing", weekly: 1843.1, male: 1884.6, female: 1702.1 },
  { label: "Electricity, gas, water & waste services", weekly: 2546.0, male: 2640.8, female: 2263.5 },
  { label: "Construction", weekly: 1985.3, male: 1994.2, female: 1932.2 },
  { label: "Wholesale trade", weekly: 1982.9, male: 2041.7, female: 1840.1 },
  { label: "Retail trade", weekly: 1581.6, male: 1629.6, female: 1505.9 },
  { label: "Accommodation & food services", weekly: 1509.9, male: 1580.0, female: 1413.5 },
  { label: "Transport, postal & warehousing", weekly: 2032.3, male: 2073.1, female: 1886.1 },
  { label: "Information media & telecommunications", weekly: 2714.1, male: 2911.7, female: 2324.4 },
  { label: "Financial & insurance services", weekly: 2341.3, male: 2569.6, female: 2083.0 },
  { label: "Rental, hiring & real estate services", weekly: 1979.6, male: 2090.9, female: 1816.7 },
  { label: "Professional, scientific & technical services", weekly: 2389.6, male: 2570.8, female: 2082.0 },
  { label: "Administrative & support services", weekly: 1950.0, male: 2137.4, female: 1618.1 },
  { label: "Public administration & safety", weekly: 2179.8, male: 2219.1, female: 2133.0 },
  { label: "Education & training", weekly: 2197.9, male: 2306.8, female: 2140.1 },
  { label: "Health care & social assistance", weekly: 2037.2, male: 2474.1, female: 1875.5 },
  { label: "Arts & recreation services", weekly: 1877.4, male: 2020.8, female: 1680.8 },
  { label: "Other services", weekly: 1621.7, male: 1599.3, female: 1660.1 },
];

// ---------------------------------------------------------------------------
// EE — the median (August 2025)
// ---------------------------------------------------------------------------

/** Median weekly earnings in main job, August 2025. */
export const EE_MEDIAN = {
  allEmployees: 1425,
  allEmployeesPrevYear: 1399,
  fullTime: 1741,
  fullTimePrevYear: 1700,
  /** Table 1 of the release (701.01, shown rounded). */
  partTime: 701,
  maleAll: 1600,
  femaleAll: 1250,
  maleFullTime: 1841,
  femaleFullTime: 1631,
  /** Median hourly earnings in main job, all employees. */
  hourlyAll: 42.9,
} as const;

/** Published percentiles of weekly earnings in main job, all employees, August 2025. */
export const EE_PERCENTILES_ALL: { percentile: number; weekly: number }[] = [
  { percentile: 10, weekly: 450 },
  { percentile: 25, weekly: 900 },
  { percentile: 50, weekly: 1425 },
  { percentile: 75, weekly: 2127 },
  { percentile: 90, weekly: 3000 },
];

export interface MedianByStateRow {
  label: string;
  code: string;
  /** All employees (full-time and part-time). */
  all: number;
  /** Full-time employees. */
  fullTime: number;
}

/**
 * Median weekly earnings in main job by state, August 2025. "all" is as the
 * release page publishes it; "fullTime" is Table 1 of the release (ACT 1,817.92
 * shown rounded).
 */
export const EE_MEDIAN_BY_STATE: MedianByStateRow[] = [
  { label: "New South Wales", code: "NSW", all: 1464, fullTime: 1750 },
  { label: "Victoria", code: "VIC", all: 1380, fullTime: 1700 },
  { label: "Queensland", code: "QLD", all: 1439, fullTime: 1710 },
  { label: "South Australia", code: "SA", all: 1300, fullTime: 1600 },
  { label: "Western Australia", code: "WA", all: 1500, fullTime: 1900 },
  { label: "Tasmania", code: "TAS", all: 1300, fullTime: 1600 },
  { label: "Northern Territory", code: "NT", all: 1510, fullTime: 1750 },
  { label: "Australian Capital Territory", code: "ACT", all: 1600, fullTime: 1818 },
];

/** Median weekly earnings in main job by industry, all employees, August 2025. Order as published (highest first). */
export const EE_MEDIAN_BY_INDUSTRY: { label: string; weekly: number }[] = [
  { label: "Mining", weekly: 2761 },
  { label: "Electricity, gas, water & waste services", weekly: 2000 },
  { label: "Financial & insurance services", weekly: 2000 },
  { label: "Professional, scientific & technical services", weekly: 1897 },
  { label: "Public administration & safety", weekly: 1837 },
  { label: "Information media & telecommunications", weekly: 1567 },
  { label: "Construction", weekly: 1500 },
  { label: "Education & training", weekly: 1500 },
  { label: "Manufacturing", weekly: 1500 },
  { label: "Rental, hiring & real estate services", weekly: 1500 },
  { label: "Transport, postal & warehousing", weekly: 1470 },
  { label: "Wholesale trade", weekly: 1440 },
  { label: "Health care & social assistance", weekly: 1300 },
  { label: "Administrative & support services", weekly: 1200 },
  { label: "Agriculture, forestry & fishing", weekly: 1200 },
  { label: "Other services", weekly: 1200 },
  { label: "Arts & recreation services", weekly: 1150 },
  { label: "Retail trade", weekly: 900 },
  { label: "Accommodation & food services", weekly: 700 },
];

export interface MedianByAgeRow {
  label: string;
  /** Full-time employees, persons. */
  fullTime: number;
  /** All employees, persons. */
  all: number;
  maleFullTime: number;
  femaleFullTime: number;
}

/**
 * Median weekly earnings in main job by age, August 2025 — Table 2 of the
 * release (Data 2, Australia). Fractional published values shown rounded to
 * the dollar.
 */
export const EE_MEDIAN_BY_AGE: MedianByAgeRow[] = [
  { label: "15–19", fullTime: 854, all: 300, maleFullTime: 840, femaleFullTime: 900 },
  { label: "20–24", fullTime: 1200, all: 950, maleFullTime: 1200, femaleFullTime: 1219 },
  { label: "25–34", fullTime: 1648, all: 1500, maleFullTime: 1700, femaleFullTime: 1600 },
  { label: "35–44", fullTime: 1950, all: 1700, maleFullTime: 2093, femaleFullTime: 1750 },
  { label: "45–54", fullTime: 2000, all: 1750, maleFullTime: 2137, femaleFullTime: 1853 },
  { label: "55–59", fullTime: 1850, all: 1575, maleFullTime: 2000, femaleFullTime: 1650 },
  { label: "60–64", fullTime: 1750, all: 1399, maleFullTime: 1909, femaleFullTime: 1600 },
  { label: "65 and over", fullTime: 1620, all: 1124, maleFullTime: 1800, femaleFullTime: 1500 },
];

// ---------------------------------------------------------------------------
// EEH — full-time quartiles (May 2025)
// ---------------------------------------------------------------------------

/** Weekly total cash earnings, all employees population, May 2025. */
export const EEH_QUARTILES = {
  fullTime: { q1: 1424, median: 1887, q3: 2560 },
  all: { q1: 878, median: 1436, q3: 2122 },
  /** Average weekly total cash earnings. */
  averageFullTime: 2130.6,
  averageAll: 1611.1,
} as const;

// ---------------------------------------------------------------------------
// EE distribution — for the "is my salary above average?" checker
// ---------------------------------------------------------------------------

/**
 * Employees ('000) by weekly earnings in main job, August 2025, Australia,
 * total employees — Table 7 of the EE release (Data 7). Index i is the band
 * $100i to $100i+99 (the first band is $1–$99); the last entry is "$5,000 and
 * over". Sums: full-time 8,450.0 thousand, all employees 12,257.6 thousand,
 * matching the table's published totals.
 */
export const EE_DISTRIBUTION_FULL_TIME: readonly number[] = [
  5.495, 8.794, 14.816, 15.504, 44.768, 60.15, 69.297, 135.38, 148.542, 303.17, 405.824, 464.819,
  468.424, 505.482, 387.443, 575.635, 351.148, 468.431, 286.646, 344.856, 381.476, 221.975, 354.652,
  202.733, 155.675, 245.806, 123.397, 261.319, 99.331, 75.589, 138.914, 64.754, 153.555, 53.931,
  62.04, 74.826, 55.002, 35.846, 37.116, 35.983, 48.472, 27.682, 26.476, 22.516, 19.141, 27.327,
  16.988, 9.744, 112.557, 9.941, 230.656,
];

export const EE_DISTRIBUTION_ALL: readonly number[] = [
  142.013, 342.441, 239.358, 236.202, 365.053, 321.005, 350.539, 491.713, 378.199, 569.773, 627.562,
  633.561, 614.269, 611.841, 454.777, 674.768, 401.723, 526.388, 311.719, 377.075, 416.656, 243.915,
  381.079, 216.074, 169.975, 263.679, 136.889, 276.127, 102.243, 78.263, 143.611, 66.397, 155.563,
  55.561, 64.423, 76.362, 55.774, 36.648, 38.213, 36.853, 50.752, 28.762, 27.087, 23.882, 19.141,
  27.769, 18.451, 9.888, 118.534, 10.803, 238.297,
];

export const DISTRIBUTION_BAND_WIDTH = 100;
export const DISTRIBUTION_TOP_BAND_FLOOR = 5000;

export type Population = "fullTime" | "all";

/** Share (0–1) of employees in the population earning less than `weeklyFloor`, which must be a multiple of $100. */
export function shareEarningBelow(weeklyFloor: number, population: Population): number {
  const counts = population === "fullTime" ? EE_DISTRIBUTION_FULL_TIME : EE_DISTRIBUTION_ALL;
  if (weeklyFloor % DISTRIBUTION_BAND_WIDTH !== 0 || weeklyFloor < 0) {
    throw new Error(`shareEarningBelow: floor must be a non-negative multiple of $100, got ${weeklyFloor}`);
  }
  const total = counts.reduce((a, b) => a + b, 0);
  const bandsBelow = Math.min(weeklyFloor / DISTRIBUTION_BAND_WIDTH, counts.length);
  let below = 0;
  for (let i = 0; i < bandsBelow; i++) below += counts[i];
  return below / total;
}

export interface PercentileResult {
  weekly: number;
  /** Lower edge of the ABS $100 band the salary falls in. */
  bandFloor: number;
  /** Upper edge (exclusive), or null for the open-ended $5,000+ band. */
  bandCeiling: number | null;
  /** Share (0–1) earning less than bandFloor — the salary beats at least this many. */
  shareBelowFloor: number;
  /** Share (0–1) earning less than bandCeiling — the salary beats at most this many. */
  shareBelowCeiling: number;
}

/**
 * Where an annual salary sits in the August 2025 earnings distribution.
 *
 * The ABS publishes counts in $100-a-week bands, so the answer is a range: the
 * salary is above everyone in lower bands and somewhere inside its own band.
 * Nothing is interpolated.
 */
export function salaryPercentile(annualSalary: number, population: Population): PercentileResult {
  if (!Number.isFinite(annualSalary) || annualSalary < 0) {
    throw new Error(`salaryPercentile: expected a non-negative salary, got ${annualSalary}`);
  }
  const weekly = annualSalary / WEEKS_PER_YEAR;
  const floor = Math.min(
    Math.floor(weekly / DISTRIBUTION_BAND_WIDTH) * DISTRIBUTION_BAND_WIDTH,
    DISTRIBUTION_TOP_BAND_FLOOR,
  );
  const ceiling = floor >= DISTRIBUTION_TOP_BAND_FLOOR ? null : floor + DISTRIBUTION_BAND_WIDTH;
  return {
    weekly,
    bandFloor: floor,
    bandCeiling: ceiling,
    shareBelowFloor: shareEarningBelow(floor, population),
    shareBelowCeiling: ceiling === null ? 1 : shareEarningBelow(ceiling, population),
  };
}

// ---------------------------------------------------------------------------
// Headline numbers — everything the title, H1, meta and FAQ quote
// ---------------------------------------------------------------------------

export const HEADLINE = {
  /** Average full-time salary (AWOTE × 52). */
  averageAnnual: annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly),
  /** Median full-time salary (EE full-time median × 52). */
  medianFullTimeAnnual: annualise(EE_MEDIAN.fullTime),
  /** Median for all employees, including part-time (EE × 52). */
  medianAllAnnual: annualise(EE_MEDIAN.allEmployees),
  /** Average for all employees including part-time, total earnings (AWE × 52). */
  averageAllEmployeesAnnual: annualise(AWE_HEADLINE.allEmployeesTotalWeekly),
  /** Average full-time total earnings including overtime (AWE × 52). */
  averageFullTimeTotalAnnual: annualise(AWE_HEADLINE.fullTimeTotalWeekly),
} as const;

/** "$108,352" — plain en-AU dollar formatting, no Intl dependency differences. */
export function dollars(value: number): string {
  return `$${Math.round(value).toLocaleString("en-AU")}`;
}

/** "$2,083.70" — two-decimal weekly figures as ABS prints them. */
export function dollarsCents(value: number): string {
  return `$${value.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Year label for the title: the year the latest AWE release was published. */
export const HEADLINE_YEAR = "2026";

export function averageSalaryTitle(): string {
  return `Average Salary in Australia ${HEADLINE_YEAR}: ${dollars(HEADLINE.averageAnnual)} a Year (Median ${dollars(HEADLINE.medianFullTimeAnnual)})`;
}

export function averageSalaryDescription(): string {
  return `The average full-time salary in Australia is ${dollars(HEADLINE.averageAnnual)} a year (${dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)} a week, ABS ${AWE_RELEASE.referencePeriod}). The median is ${dollars(HEADLINE.medianFullTimeAnnual)} full-time and ${dollars(HEADLINE.medianAllAnnual)} across all employees. By state, industry, age and gender, with take-home pay.`;
}
