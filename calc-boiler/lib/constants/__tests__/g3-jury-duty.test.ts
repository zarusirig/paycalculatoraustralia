import assert from "node:assert/strict";
import { test } from "node:test";

import { juryDutyPay } from "../jury-duty";

// The Fair Work Ombudsman's own worked examples ("Jury duty", read 24 Sep 2026).

test("FWO example — Julie, full-time: $210/day make-up pay for 10 days, court $90 x 15", () => {
  const r = juryDutyPay({ employment: "permanent", baseDailyPay: 300, courtPerDay: 90, juryDays: 15, workdaysMissed: 15, evidence: "requested-given" });
  assert.equal(r.employerPerDay, 210);
  assert.equal(r.employerPaidDays, 10);
  assert.equal(r.employerTotal, 2100);
  assert.equal(r.courtTotal, 1350);
});

test("FWO example — Samuel, part-time Mon–Wed: $160/day for all 9 missed days", () => {
  const r = juryDutyPay({ employment: "permanent", baseDailyPay: 250, courtPerDay: 90, juryDays: 15, workdaysMissed: 9, evidence: "requested-given" });
  assert.equal(r.employerPerDay, 160);
  assert.equal(r.employerPaidDays, 9);
  assert.equal(r.employerTotal, 1440);
  assert.equal(r.courtTotal, 1350);
});

test("evidence requested but not given: no employer pay", () => {
  const r = juryDutyPay({ employment: "permanent", baseDailyPay: 300, courtPerDay: 90, juryDays: 5, workdaysMissed: 5, evidence: "requested-not-given" });
  assert.equal(r.employerTotal, 0);
});

test("evidence not requested: full base pay for up to 10 days", () => {
  const r = juryDutyPay({ employment: "permanent", baseDailyPay: 300, courtPerDay: 90, juryDays: 12, workdaysMissed: 12, evidence: "not-requested" });
  assert.equal(r.employerTotal, 3000);
});

test("casuals get no NES jury duty pay from the employer", () => {
  const r = juryDutyPay({ employment: "casual", baseDailyPay: 300, courtPerDay: 90, juryDays: 3, workdaysMissed: 3, evidence: "not-requested" });
  assert.equal(r.employerTotal, 0);
  assert.equal(r.courtTotal, 270);
});
