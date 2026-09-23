import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DSP_ASSETS,
  DSP_CUT_OFFS_21_PLUS,
  DSP_RATES_21_PLUS,
  dspAfterBothTests,
  dspAssetsReduction,
  dspFortnightly,
} from "../disability-support-pension";
import { agePensionCutOff } from "../centrelink-income-test";

// G3 (wave 4). Figures from Services Australia's DSP pages, read 24 Sep 2026.

test("DSP 21+ rates equal the published DSP totals", () => {
  const m = DSP_RATES_21_PLUS.maxFortnightly;
  assert.equal(m.single.total, 1_237.7);
  assert.equal(m.coupleEach.total, 933.0);
  assert.equal(m.coupleCombined.total, 1_866.0);
  assert.equal(m.single.basic, 1_135.4);
  assert.equal(m.coupleEach.basic, 855.9);
});

test("components add up to the totals (the DSP page's $65.50 couple supplement does not)", () => {
  const m = DSP_RATES_21_PLUS.maxFortnightly;
  for (const r of [m.single, m.coupleEach, m.coupleCombined]) {
    assert.equal(Math.round((r.basic + r.supplement + r.energy) * 100) / 100, r.total);
  }
  assert.notEqual(Math.round((855.9 + 65.5 + 10.6) * 100) / 100, 933.0);
});

test("income test reproduces the published DSP cut-offs", () => {
  assert.equal(agePensionCutOff(DSP_RATES_21_PLUS.maxFortnightly.single.total, "single"), DSP_CUT_OFFS_21_PLUS.single);
  assert.equal(agePensionCutOff(DSP_RATES_21_PLUS.maxFortnightly.coupleEach.total, "coupleCombined"), DSP_CUT_OFFS_21_PLUS.coupleCombined);
  assert.equal(dspFortnightly(DSP_CUT_OFFS_21_PLUS.single, "single").pay, 0);
  assert.equal(dspFortnightly(226, "single").pay, 1_237.7);
  assert.equal(dspFortnightly(726, "single").pay, 987.7);
});

test("30 hours a week flags the suspension rule; 29 does not", () => {
  assert.equal(dspFortnightly(0, "single", 29).hoursStatus, "ok");
  assert.equal(dspFortnightly(0, "single", 30).hoursStatus, "over");
});

test("assets taper in $250 steps reproduces every published assets cut-off", () => {
  const cases: [number, "single" | "couple", boolean][] = [
    [DSP_ASSETS.cutOff.singleHomeowner, "single", true],
    [DSP_ASSETS.cutOff.singleNonHomeowner, "single", false],
    [DSP_ASSETS.cutOff.coupleHomeowner, "couple", true],
    [DSP_ASSETS.cutOff.coupleNonHomeowner, "couple", false],
  ];
  for (const [cut, sit, home] of cases) {
    const max = sit === "single" ? 1_237.7 : 933.0;
    assert.ok(dspAssetsReduction(cut, sit, home) >= max, `${sit} ${home} at cut-off`);
    assert.ok(dspAssetsReduction(cut - 250, sit, home) < max, `${sit} ${home} just below cut-off`);
  }
  assert.equal(dspAssetsReduction(343_000, "single", true), 30);
});

test("the lower of the income and assets tests is paid", () => {
  const r = dspAfterBothTests(726, 343_000, "single", true);
  assert.equal(r.incomeTest, 987.7);
  assert.equal(r.assetsTest, 1_207.7);
  assert.equal(r.pay, 987.7);
});
