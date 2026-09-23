import assert from "node:assert/strict";
import { test } from "node:test";

import { VIC_TEACHER_PAY } from "../vic";
import {
  VIC_2026_AGREEMENT,
  VIC_2026_EFFECTIVE_DATES,
  VIC_2026_SCALES,
  proposedRate,
} from "../vic-2026-agreement";

const current = (label: string) =>
  VIC_TEACHER_PAY.scales[0].steps.find((s) => s.label === label)!.salary;

test("proposed schedule matches the government's published headline figures", () => {
  // Premier, 17 Aug 2026: experienced teacher $118,063 → $151,419 by 2029, a $15,393 boost this year.
  assert.equal(current("2-6"), 118_063);
  assert.equal(proposedRate("classroom-teachers-2026", "2-6", 4), 151_419);
  assert.equal(proposedRate("classroom-teachers-2026", "2-6", 1)! - current("2-6"), 15_393);
  // Early career teacher +$13,293 by October 2026.
  assert.equal(proposedRate("classroom-teachers-2026", "1-1", 1)! - current("1-1"), 13_293);
});

test("increases match the department's Agreement Explanation percentages", () => {
  const pct = (a: number, b: number) => Math.round((b / a - 1) * 10_000) / 100;
  for (const scale of VIC_2026_SCALES) {
    for (const step of scale.steps) {
      const [aug, oct, , nov28, nov29] = step.rates;
      assert.ok(Math.abs(pct(aug, oct) - 9.75) <= 0.01, `${scale.id} ${step.label} Oct`);
      assert.ok(Math.abs(pct(step.rates[3 - 1], nov28) - 4) <= 0.01, `${step.label} Nov28`);
      assert.ok(Math.abs(pct(nov28, nov29) - 4.9) <= 0.01, `${step.label} Nov29`);
      const first = pct(current2022(step.label, scale.id), aug);
      if (!Number.isNaN(first)) assert.ok(first >= 2.99 && first <= 6.34, `${step.label} Aug ${first}`);
    }
  }
});

function current2022(label: string, scaleId: string): number {
  const id = scaleId.replace(/-2026$/, "");
  const scale = VIC_TEACHER_PAY.scales.find((s) => s.id === id);
  const step = scale?.steps.find((s) => s.label === label);
  return step ? step.salary : NaN;
}

test("top classroom teacher rises at least 28.3% over the agreement", () => {
  const rise = proposedRate("classroom-teachers-2026", "2-6", 4)! / current("2-6") - 1;
  assert.ok(rise >= 0.2825 && rise < 0.29, `rise ${rise}`);
});

test("every step rises monotonically across columns and up the scale", () => {
  for (const scale of VIC_2026_SCALES) {
    for (const step of scale.steps) {
      for (let i = 1; i < step.rates.length; i++) assert.ok(step.rates[i] > step.rates[i - 1]);
    }
    for (let i = 1; i < scale.steps.length; i++) {
      assert.ok(scale.steps[i].rates[1] > scale.steps[i - 1].rates[1]);
    }
  }
  assert.equal(VIC_2026_EFFECTIVE_DATES.length, 5);
});

test("status and ballot facts", () => {
  assert.equal(VIC_2026_AGREEMENT.status, "pending-fwc");
  assert.equal(VIC_2026_AGREEMENT.ballotYesPct, 93.1);
  assert.equal(proposedRate("nope", "2-6", 0), null);
  assert.equal(proposedRate("classroom-teachers-2026", "2-6", 5), null);
});
