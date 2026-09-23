import assert from "node:assert/strict";
import { test } from "node:test";

import { calculatePayBreakdown } from "../../../constants/australian-tax";
import { AWARD_DIRECTORY } from "../../../constants/award-directory";
import {
  REPORT_CSV_FILES,
  awardRanking,
  hoursToEarn,
  keyFindings,
  maxTaxCutGain,
  publicSectorRows,
  reportCsv,
  takeHomeRows,
  wageBenchmarks,
} from "../index";

test("2026-27 take-home equals the site engine at every report salary", () => {
  for (const r of takeHomeRows()) {
    assert.equal(r.takeHome2026, calculatePayBreakdown({ grossSalary: r.salary }).takeHomePay, `salary ${r.salary}`);
  }
});

test("the 1 July 2026 cut is $268 a year at $45,000 and above, less below", () => {
  const cut = maxTaxCutGain();
  assert.equal(cut.perYear, 268);
  assert.equal(cut.fromIncome, 45_000);
  for (const r of takeHomeRows()) {
    if (r.salary >= 45_000) assert.equal(r.gainYear, 268, `salary ${r.salary}`);
    else assert.ok(r.gainYear >= 0 && r.gainYear < 268, `salary ${r.salary}`);
    // 2027-28 legislated 14% doubles the gain at and above $45,000.
    if (r.salary >= 45_000) assert.equal(r.gainBy2027, 536, `salary ${r.salary}`);
  }
  // Below the effective tax-free threshold nobody pays tax in either year.
  assert.equal(takeHomeRows([20_000])[0].gainYear, 0);
});

test("wage benchmarks are sorted and start at the National Minimum Wage", () => {
  const b = wageBenchmarks();
  assert.equal(b[0].id, "nmw");
  assert.equal(b[0].annual, 52_255);
  for (let i = 1; i < b.length; i++) assert.ok(b[i].annual >= b[i - 1].annual);
  assert.equal(b.find((x) => x.id === "average-ft")!.shareOfAverage, 1);
});

test("award ranking covers every directory award, highest first, only C14 below the NMW", () => {
  const a = awardRanking();
  assert.equal(a.length, AWARD_DIRECTORY.length);
  assert.equal(a.length, 14);
  for (let i = 1; i < a.length; i++) assert.ok(a[i].hourly <= a[i - 1].hourly);
  // Only the Manufacturing C14 induction rate (first 38 hours) sits below the NMW.
  const below = a.filter((row) => row.premiumOverNmw < -1e-9).map((row) => row.classification);
  assert.deepEqual(below, ["C14 / V1"]);
});

test("public sector rows resolve for teachers, nurses and six public services", () => {
  const rows = publicSectorRows();
  assert.equal(rows.filter((r) => r.group === "Public service").length, 6);
  assert.ok(rows.filter((r) => r.group === "Teachers").length >= 6);
  assert.ok(rows.filter((r) => r.group === "Registered nurses").length >= 6);
  for (const r of rows) assert.ok(r.top >= r.entry && r.entry > 40_000, `${r.group} ${r.code}`);
});

test("hours to earn: higher pay needs fewer hours", () => {
  const h = hoursToEarn();
  const nmw = h.find((x) => x.id === "nmw")!;
  const avg = h.find((x) => x.id === "average-ft")!;
  assert.ok(nmw.hoursFor1000Net > avg.hoursFor1000Net);
  assert.ok(nmw.netHourly < nmw.grossHourly);
});

test("every CSV starts with its header and has one line per table row", () => {
  for (const { file } of REPORT_CSV_FILES) {
    const lines = reportCsv(file).trim().split("\n");
    assert.match(lines[0], /^[a-z_0-9,]+$/, `${file} header`);
    assert.ok(lines.length >= 5, file);
  }
  assert.equal(reportCsv("take-home-pay-by-salary-2025-26-vs-2026-27.csv").trim().split("\n").length, takeHomeRows().length + 1);
});

test("key findings quote computed numbers", () => {
  const f = keyFindings();
  assert.ok(f[0].includes("$268 a year"));
  assert.ok(f.length >= 5);
});
