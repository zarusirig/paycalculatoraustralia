// =============================================================================
// Age Pension age and preservation age by date of birth
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  addYearsMonths,
  earliestClaimDate,
  pensionAgeBand,
  pensionAgeDate,
  preservationAgeBand,
  preservationAgeDate,
  yearsMonthsBetween,
} from "../pension-age";

const d = (s: string) => new Date(`${s}T00:00:00Z`);
const iso = (x: Date | null) => (x ? x.toISOString().slice(0, 10) : null);

test("pension age is 67 for anyone born on or after 1 January 1957", () => {
  assert.equal(pensionAgeBand(d("1957-01-01"))?.years, 67);
  assert.equal(iso(pensionAgeDate(d("1970-05-15"))), "2037-05-15");
  assert.equal(iso(pensionAgeDate(d("1990-01-01"))), "2057-01-01");
});

test("transition bands match Social Security Guide 3.4.1.10", () => {
  assert.equal(pensionAgeBand(d("1956-12-31"))?.label, "66 years 6 months");
  assert.equal(pensionAgeBand(d("1955-06-30"))?.label, "66 years");
  // DSS worked example: born 31 October 1953 → earliest qualification 1 May 2019.
  assert.equal(iso(pensionAgeDate(d("1953-10-31"))), "2019-05-01");
  assert.equal(pensionAgeBand(d("1952-06-30")), null);
});

test("no corresponding day rolls to the 1st of the next month", () => {
  assert.equal(iso(addYearsMonths(d("1956-03-31"), 66, 6)), "2022-10-01");
  assert.equal(iso(addYearsMonths(d("1960-02-29"), 67, 0)), "2027-03-01");
  assert.equal(iso(addYearsMonths(d("1964-02-29"), 60, 0)), "2024-02-29");
});

test("preservation age table matches the ATO", () => {
  assert.equal(preservationAgeBand(d("1960-06-30")).years, 55);
  assert.equal(preservationAgeBand(d("1960-07-01")).years, 56);
  assert.equal(preservationAgeBand(d("1962-12-01")).years, 58);
  assert.equal(preservationAgeBand(d("1964-06-30")).years, 59);
  assert.equal(preservationAgeBand(d("1964-07-01")).years, 60);
  assert.equal(iso(preservationAgeDate(d("1985-09-23"))), "2045-09-23");
});

test("claims open 13 weeks (91 days) before pension age", () => {
  assert.equal(iso(earliestClaimDate(d("2037-05-15"))), "2037-02-13");
});

test("years and months to go", () => {
  assert.deepEqual(yearsMonthsBetween(d("2026-09-23"), d("2037-05-15")), { years: 10, months: 7, passed: false });
  assert.equal(yearsMonthsBetween(d("2026-09-23"), d("2020-01-01")).passed, true);
});
