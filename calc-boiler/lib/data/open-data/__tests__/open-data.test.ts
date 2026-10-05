import { test } from "node:test";
import assert from "node:assert/strict";
import { DATA_FILES, JSON_FILE, allSources, dataCsv, dataJson, dataTable, fileContent, isDataFile, suggestedCitation } from "../index";
import { EMPLOYMENT, TAX_BRACKETS_2026_27 } from "../../../constants/australian-tax";

test("every CSV has a header and consistent column counts", () => {
  for (const f of DATA_FILES) {
    const t = dataTable(f.file);
    assert.ok(t.rows.length > 0, f.file);
    for (const r of t.rows) assert.equal(r.length, t.head.length, f.file);
    const lines = dataCsv(f.file).trimEnd().split("\n");
    assert.equal(lines.length, t.rows.length + 1, f.file);
  }
});

test("tax scale rows come from the single source", () => {
  const t = dataTable("resident-tax-rates.csv");
  const cur = t.rows.filter((r) => r[0] === "2026-27");
  assert.equal(cur.length, TAX_BRACKETS_2026_27.length);
  assert.deepEqual(cur[1], ["2026-27", "current", 18_200, 45_000, 0.15, 0]);
  assert.deepEqual(cur[4], ["2026-27", "current", 190_000, null, 0.45, 51_370]);
  assert.equal(t.rows.filter((r) => r[0] === "2025-26")[1][4], 0.16);
  const next = t.rows.filter((r) => r[0] === "2027-28");
  assert.equal(next[1][4], 0.14);
  assert.equal(next[1][1], "legislated_not_in_force");
});

test("NMW history ends on the current rate and matches EMPLOYMENT", () => {
  const rows = dataTable("national-minimum-wage-history.csv").rows;
  const last = rows[rows.length - 1];
  assert.equal(last[0], "2026-27");
  assert.equal(last[2], EMPLOYMENT.minimumWageHourly);
  assert.equal(last[3], EMPLOYMENT.minimumWageWeekly);
  assert.equal(last[4], "6.0%");
});

test("HECS 2026-27 first threshold is 69,528 and top band is on total income", () => {
  const rows = dataTable("hecs-help-repayment-thresholds.csv").rows.filter((r) => r[0] === "2026-27");
  assert.equal(rows[1][1], 69_528);
  assert.equal(rows[2][4], 9_028);
  assert.equal(rows[3][5], "rate_on_total_repayment_income");
});

test("SG history ends at 12%", () => {
  const rows = dataTable("super-guarantee-rates.csv").rows;
  assert.deepEqual(rows[rows.length - 1], ["2026-27", 0.12]);
});

test("JSON is valid and complete; file lookup is strict", () => {
  const j = JSON.parse(dataJson());
  assert.equal(j.datasets.length, DATA_FILES.length);
  assert.equal(j.license, "https://creativecommons.org/licenses/by/4.0/");
  assert.equal(fileContent(JSON_FILE)?.type.startsWith("application/json"), true);
  assert.equal(fileContent("nope.csv"), null);
  assert.equal(isDataFile("../x"), false);
});

test("citation and sources", () => {
  assert.match(suggestedCitation(), /australian-tax-and-pay-data/);
  assert.ok(allSources().every((s) => s.url.startsWith("https://")));
});
