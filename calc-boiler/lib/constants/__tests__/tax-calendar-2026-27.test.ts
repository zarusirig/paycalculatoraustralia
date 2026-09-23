// =============================================================================
// Tax calendar 2026-27 — dates and next-business-day shifts
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FTL_MAX_INDIVIDUAL,
  LEGACY_SUPER_DATES,
  PENALTY_UNIT,
  QUARTERS_2026_27,
  RETURN_DATES_2026,
  TAX_CALENDAR_2026_27,
  isBusinessDay,
  longDateToIso,
  nextBusinessDay,
} from "../tax-calendar-2026-27";

test("return dates come from RETURN_2026 (the 2025-26 return, lodged in 2026)", () => {
  assert.equal(RETURN_DATES_2026.selfLodge.iso, "2026-10-31");
  assert.equal(RETURN_DATES_2026.agentMostPeople.iso, "2027-05-15");
  assert.equal(RETURN_DATES_2026.agentLargeLiability.iso, "2027-03-31");
  assert.equal(RETURN_DATES_2026.agentConcession.iso, "2027-06-05");
});

test("weekend and whole-of-state holiday shifts (ATO QC34577)", () => {
  // 31 Oct 2026 is a Saturday -> Monday 2 November.
  assert.equal(RETURN_DATES_2026.selfLodge.effectiveIso, "2026-11-02");
  // 28 Feb 2027 is a Sunday, 1 Mar is WA Labour Day -> Tuesday 2 March.
  assert.equal(QUARTERS_2026_27[1].effectiveIso, "2027-03-02");
  // 15 May 2027 is a Saturday -> Monday 17 May.
  assert.equal(RETURN_DATES_2026.agentMostPeople.effectiveIso, "2027-05-17");
  // 5 Jun 2027 is a Saturday, 7 Jun is WA Day -> Tuesday 8 June.
  assert.equal(RETURN_DATES_2026.agentConcession.effectiveIso, "2027-06-08");
  // Weekday due dates stay put.
  assert.equal(QUARTERS_2026_27[0].effectiveIso, "2026-10-28");
  assert.equal(nextBusinessDay("2026-11-03"), "2026-11-04"); // Melbourne Cup
  assert.equal(isBusinessDay("2026-10-21"), true);
});

test("quarterly BAS / PAYG instalment dates for 2026-27", () => {
  assert.deepEqual(
    QUARTERS_2026_27.map((q) => q.iso),
    ["2026-10-28", "2027-02-28", "2027-04-28", "2027-07-28"],
  );
});

test("last quarterly super dates come from SUPER_GUARANTEE_CHARGE.legacy", () => {
  assert.equal(LEGACY_SUPER_DATES.finalQuarterSG.iso, "2026-07-28");
  assert.equal(LEGACY_SUPER_DATES.finalQuarterStatement.iso, "2026-08-28");
});

test("no event is from the previous cycle, and events are in date order", () => {
  for (const e of TAX_CALENDAR_2026_27) {
    assert.ok(e.iso >= "2026-07-01" && e.iso <= "2027-07-31", e.iso);
    assert.ok(isBusinessDay(e.effectiveIso) || e.effectiveIso === e.iso, e.iso);
  }
  const isos = TAX_CALENDAR_2026_27.map((e) => e.iso);
  assert.deepEqual(isos, [...isos].sort());
  assert.equal(TAX_CALENDAR_2026_27.filter((e) => e.title.startsWith("Monthly BAS")).length, 13);
});

test("penalty unit and maximum failure-to-lodge penalty", () => {
  assert.equal(PENALTY_UNIT.amount, 364);
  assert.equal(FTL_MAX_INDIVIDUAL, 1_820);
});

test("longDateToIso rejects malformed input", () => {
  assert.equal(longDateToIso("1 July 2026"), "2026-07-01");
  assert.throws(() => longDateToIso("31 Oct 2026"));
  assert.throws(() => longDateToIso("2026-10-31"));
});
