// =============================================================================
// Failure-to-lodge penalty for an individual (ATO QC33410, penalty units)
// Run with: npm test
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { daysBetween, ftlPenalty, ftlPenaltyUnits, penaltyUnitAmountOn } from "../late-lodgement";

test("one penalty unit per 28 days or part, maximum 5", () => {
  assert.equal(ftlPenaltyUnits(0), 0);
  assert.equal(ftlPenaltyUnits(-3), 0);
  assert.equal(ftlPenaltyUnits(1), 1);
  assert.equal(ftlPenaltyUnits(28), 1);
  assert.equal(ftlPenaltyUnits(29), 2);
  assert.equal(ftlPenaltyUnits(56), 2);
  assert.equal(ftlPenaltyUnits(57), 3);
  assert.equal(ftlPenaltyUnits(84), 3);
  assert.equal(ftlPenaltyUnits(85), 4);
  assert.equal(ftlPenaltyUnits(112), 4);
  assert.equal(ftlPenaltyUnits(113), 5);
  assert.equal(ftlPenaltyUnits(1_000), 5);
});

test("penalty unit value by date (ATO penalty units page)", () => {
  assert.equal(penaltyUnitAmountOn("2026-07-01"), 364);
  assert.equal(penaltyUnitAmountOn("2026-11-02"), 364);
  assert.equal(penaltyUnitAmountOn("2026-06-30"), 330);
  assert.equal(penaltyUnitAmountOn("2024-11-07"), 330);
  assert.equal(penaltyUnitAmountOn("2024-11-06"), null);
});

test("2025-26 return: 31 Oct 2026 is a Saturday so the effective due date is Mon 2 Nov", () => {
  const onTime = ftlPenalty({ dueIso: "2026-10-31", lodgedIso: "2026-11-02" });
  assert.equal(onTime.effectiveDueIso, "2026-11-02");
  assert.equal(onTime.daysOverdue, 0);
  assert.equal(onTime.penalty, 0);

  const oneDay = ftlPenalty({ dueIso: "2026-10-31", lodgedIso: "2026-11-03" });
  assert.equal(oneDay.daysOverdue, 1);
  assert.equal(oneDay.units, 1);
  assert.equal(oneDay.penalty, 364);

  const lodgedEarly = ftlPenalty({ dueIso: "2026-10-31", lodgedIso: "2026-09-01" });
  assert.equal(lodgedEarly.daysOverdue, 0);
  assert.equal(lodgedEarly.penalty, 0);
});

test("maximum penalty is 5 units = $1,820 and is reached 113 days after the due date", () => {
  const r = ftlPenalty({ dueIso: "2026-10-31", lodgedIso: "2027-03-31" });
  assert.equal(r.units, 5);
  assert.equal(r.penalty, 1_820);
  assert.equal(r.atMaximum, true);
  assert.equal(r.maximumReachedIso, "2027-02-23"); // 2 Nov 2026 + 113 days
  assert.equal(daysBetween("2026-11-02", "2027-02-23"), 113);
  assert.equal(ftlPenalty({ dueIso: "2026-10-31", lodgedIso: "2027-02-22" }).units, 4);
  assert.equal(ftlPenalty({ dueIso: "2026-10-31", lodgedIso: "2027-02-23" }).units, 5);
});

test("an older return uses the earlier penalty unit and an unsupported date returns null", () => {
  const r = ftlPenalty({ dueIso: "2025-10-31", lodgedIso: "2025-12-15" });
  assert.equal(r.unitAmount, 330);
  assert.equal(r.units, 2);
  assert.equal(r.penalty, 660);
  assert.equal(ftlPenalty({ dueIso: "2024-10-31", lodgedIso: "2024-12-15" }).penalty, null);
});
