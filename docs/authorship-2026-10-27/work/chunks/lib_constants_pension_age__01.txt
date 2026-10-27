// =============================================================================
// Age Pension age and super preservation age, by date of birth
// Run tests with: npm test
//
// Verified 23 Sep 2026 via Firecrawl:
//
// AGE PENSION AGE
//  - https://www.servicesaustralia.gov.au/who-can-get-age-pension?context=22526
//    "Age Pension age is 67 years or older. There are no plans to change this."
//  - https://guides.dss.gov.au/social-security-guide/3/4/1/10 (Social Security
//    Guide 3.4.1.10, citing Social Security Act 1991 s 23(5A)–(5D)): pension
//    age for men and women born on or after 1 July 1952 rose 6 months every
//    2 years — 65½ (1/7/1952–31/12/1953), 66 (1/1/1954–30/6/1955),
//    66½ (1/7/1955–31/12/1956), 67 (on or after 1/1/1957, from 1 July 2023).
//    Where 6 months later has no corresponding day, pension age is reached
//    on the first day of the following month (31 Mar → 1 Oct, etc.).
//  - https://www.servicesaustralia.gov.au/how-to-prepare-to-claim-age-pension?context=22526
//    (updated 30 Mar 2026): "You can submit your claim in the 13 weeks before
//    you reach Age Pension age."
//
// PRESERVATION AGE
//  - https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/super-withdrawal-options
//    (updated 10 Jul 2026): table below; "You turn 65 years old, even if
//    you're still working" is a separate condition of release; and "Your
//    preservation age is not the same as your pension age."
//
// Everyone born before 1 July 1952 reached pension age before 1 July 2017
// under the older (sex-specific) rules. Those rules are not modelled — the
// calculator only needs to say "already reached" for them, which is true.
// =============================================================================

export const AGE_PENSION_AGE = 67;
export const AGE_PENSION_AGE_SINCE = "1 July 2023";
/** Claims can be lodged this many weeks before reaching pension age. */
export const AGE_PENSION_CLAIM_WEEKS_EARLY = 13;
/** Super can be accessed at this age even while still working. */
export const SUPER_ACCESS_AGE_WHILE_WORKING = 65;

export interface AgeBand {
  /** Inclusive, ISO date. null = open-ended. */
  bornFrom: string | null;
  bornTo: string | null;
  years: number;
  months: number;
  label: string;
}

/** Social Security Act 1991 s 23(5A)/(5D) — men and women born on or after 1 July 1952. */
export const PENSION_AGE_TABLE: readonly AgeBand[] = [
  { bornFrom: "1952-07-01", bornTo: "1953-12-31", years: 65, months: 6, label: "65 years 6 months" },
  { bornFrom: "1954-01-01", bornTo: "1955-06-30", years: 66, months: 0, label: "66 years" },
  { bornFrom: "1955-07-01", bornTo: "1956-12-31", years: 66, months: 6, label: "66 years 6 months" },
  { bornFrom: "1957-01-01", bornTo: null, years: 67, months: 0, label: "67 years" },
] as const;

/** ATO preservation age table (SIS Regulations). */
export const PRESERVATION_AGE_TABLE: readonly AgeBand[] = [
  { bornFrom: null, bornTo: "1960-06-30", years: 55, months: 0, label: "55" },
  { bornFrom: "1960-07-01", bornTo: "1961-06-30", years: 56, months: 0, label: "56" },
  { bornFrom: "1961-07-01", bornTo: "1962-06-30", years: 57, months: 0, label: "57" },
  { bornFrom: "1962-07-01", bornTo: "1963-06-30", years: 58, months: 0, label: "58" },
  { bornFrom: "1963-07-01", bornTo: "1964-06-30", years: 59, months: 0, label: "59" },
  { bornFrom: "1964-07-01", bornTo: null, years: 60, months: 0, label: "60" },
] as const;

export const PENSION_AGE_SOURCES = {
  whoCanGet: "https://www.servicesaustralia.gov.au/who-can-get-age-pension?context=22526",
  prepareToClaim: "https://www.servicesaustralia.gov.au/how-to-prepare-to-claim-age-pension?context=22526",
  dssGuide: "https://guides.dss.gov.au/social-security-guide/3/4/1/10",
  preservation:
    "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/super-withdrawal-options",
  ageDiscrimination:
    "https://humanrights.gov.au/know-your-rights/rights-of-individuals/age-discrimination/know-your-rights-about-age-discrimination",
} as const;

function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function findBand(table: readonly AgeBand[], dob: Date): AgeBand | null {
  const k = isoOf(dob);
  return (
    table.find((b) => (b.bornFrom === null || k >= b.bornFrom) && (b.bornTo === null || k <= b.bornTo)) ?? null
  );
}

/**
 * Add whole years and months to a UTC date. Where the target month has no
 * corresponding day (e.g. 31 March + 6 months, 29 February + 67 years), the
 * result is the first day of the following month — the DSS Social Security
 * Guide 3.4.1.10 convention.
 */
export function addYearsMonths(dob: Date, years: number, months: number): Date {
  const totalMonths = dob.getUTCMonth() + months;
  const y = dob.getUTCFullYear() + years + Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const day = dob.getUTCDate();
  const daysInTarget = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  if (day > daysInTarget) return new Date(Date.UTC(y, m + 1, 1));
  return new Date(Date.UTC(y, m, day));
}

/** Age Pension age band for a date of birth, or null if born before 1 July 1952. */
export function pensionAgeBand(dob: Date): AgeBand | null {
  return findBand(PENSION_AGE_TABLE, dob);
}

/** Date Age Pension age is reached, or null if born before 1 July 1952 (reached before 1 July 2017). */
export function pensionAgeDate(dob: Date): Date | null {
  const band = pensionAgeBand(dob);
  return band ? addYearsMonths(dob, band.years, band.months) : null;
}

export function preservationAgeBand(dob: Date): AgeBand {
  // The table is open-ended at both ends, so a band always matches.
  return findBand(PRESERVATION_AGE_TABLE, dob)!;
}

export function preservationAgeDate(dob: Date): Date {
  return addYearsMonths(dob, preservationAgeBand(dob).years, 0);
}

/** Earliest date a claim can be lodged: 13 weeks before pension age. */
export function earliestClaimDate(pensionDate: Date): Date {
  return new Date(pensionDate.getTime() - AGE_PENSION_CLAIM_WEEKS_EARLY * 7 * 86_400_000);
}

/** Whole years and remaining whole months from `from` to `to`; zero if already passed. */
export function yearsMonthsBetween(from: Date, to: Date): { years: number; months: number; passed: boolean } {
  if (to.getTime() <= from.getTime()) return { years: 0, months: 0, passed: true };
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  return { years: Math.floor(months / 12), months: months % 12, passed: false };
}
