import assert from "node:assert/strict";
import { test } from "node:test";

import { TEACHER_PAY_STATES } from "../../teacher-pay/index";
import { NURSING_PAY_BY_STATE, annualFor } from "../../nursing-pay/index";
import { publicPayPoints, payPointsRoundingTo } from "../tax-on-pay-points";

test("teacher steps are the verified scale salaries", () => {
  const all = publicPayPoints();
  const qld = TEACHER_PAY_STATES.find((s) => s.slug === "qld")!;
  const scale = qld.scales[0];
  const step = scale.steps[0];
  const hit = all.find((p) => p.id === `teacher-qld-${scale.id}-${step.label}`);
  assert.ok(hit);
  assert.equal(hit.annual, step.salary);
  assert.equal(hit.href, "/teacher-pay-australia/qld/");
});

test("nursing points use annualFor (published annual, else fortnightly × 26, else weekly × 52)", () => {
  const all = publicPayPoints().filter((p) => p.sector === "nurse");
  assert.ok(all.length > 0);
  for (const p of all) {
    const st = Object.values(NURSING_PAY_BY_STATE).find((s) => s && s.code === p.state)!;
    const found = st.scales
      .filter((s) => s.classification === p.scale)
      .some((s) => s.points.some((x) => x.label === p.step && annualFor(x) === p.annual));
    assert.ok(found, p.id);
    assert.ok(p.href.startsWith("/healthcare-worker-pay/"));
  }
});

test("rounding picks: right grid page, closest first, one per state scale, at most six", () => {
  for (const salary of [80_000, 100_000, 125_000]) {
    const picks = payPointsRoundingTo(salary);
    assert.ok(picks.length <= 6);
    const keys = new Set(picks.map((p) => `${p.sector}|${p.state}|${p.scale}`));
    assert.equal(keys.size, picks.length);
    for (const p of picks) assert.equal(Math.round(p.annual / 5_000) * 5_000, salary);
    for (let i = 1; i < picks.length; i++) assert.ok(picks[i].annual >= picks[i - 1].annual);
  }
  assert.deepEqual(payPointsRoundingTo(500_000), []);
});
