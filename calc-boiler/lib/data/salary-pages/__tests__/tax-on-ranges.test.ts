import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BRACKET_EDGE_WINDOW,
  MAX_EMPLOYER_SUPER,
  bracketEdgeNear,
  div293Position,
  litoPosition,
  medicareReduction,
  mlsPosition,
  rangeSections,
  showsHecs,
  taxOnFaqIds,
} from "../tax-on-ranges";
import { DIV293_SALARY_EQUIVALENT, THRESHOLD_WINDOW } from "../tax-on-thresholds";
import { TAX_ON_SALARIES } from "../index";
import {
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  TAX_BRACKETS,
  calculateMedicareLevy,
} from "../../../constants/australian-tax";
import { DIVISION_293 } from "../../../constants/super-contributions";

test("LITO section only below the cut-out income", () => {
  for (const s of TAX_ON_SALARIES) {
    assert.equal(rangeSections(s).includes("lito"), s < LITO.nilOffsetIncome, String(s));
  }
  assert.equal(litoPosition(LITO.nilOffsetIncome), null);
});

test("LITO phases and the cost of the next dollar come from the constants", () => {
  assert.equal(litoPosition(20_000)!.phase, "cancels-tax");
  assert.equal(litoPosition(20_000)!.nextDollarRate, 0);
  assert.equal(litoPosition(30_000)!.phase, "full");
  assert.equal(litoPosition(30_000)!.nextDollarRate, TAX_BRACKETS[1].rate);

  const at40 = litoPosition(40_000)!;
  assert.equal(at40.phase, "phase-out-fast");
  assert.equal(at40.offset, LITO.maxOffset - (40_000 - LITO.fullOffsetCeiling) * LITO.phaseOut1.rate);
  assert.ok(Math.abs(at40.nextDollarRate - (TAX_BRACKETS[1].rate + LITO.phaseOut1.rate)) < 1e-9);

  const at50 = litoPosition(50_000)!;
  assert.equal(at50.phase, "phase-out-slow");
  assert.equal(at50.overPhaseStart, 50_000 - LITO.phaseOut1.end);
  assert.ok(Math.abs(at50.nextDollarRate - (TAX_BRACKETS[2].rate + LITO.phaseOut2.rate)) < 1e-9);
});

test("Medicare reduction section only where the levy is under the full 2%", () => {
  for (const s of TAX_ON_SALARIES) {
    const reduced = calculateMedicareLevy(s) < Math.round(s * MEDICARE_LEVY.rate);
    assert.equal(rangeSections(s).includes("medicare"), reduced, String(s));
    if (reduced) assert.ok(s <= MEDICARE_LEVY.shadeInThreshold, String(s));
  }
  assert.equal(medicareReduction(25_000)!.stage, "exempt");
  assert.equal(medicareReduction(30_000)!.stage, "shade-in");
  assert.equal(medicareReduction(30_000)!.levy, Math.round((30_000 - MEDICARE_LEVY.lowIncomeThreshold) * MEDICARE_LEVY.shadeInRate));
});

test("bracket-edge section only within $5,000 of the 30%, 37% and 45% edges", () => {
  const edges = TAX_BRACKETS.slice(2).map((b) => b.min - 1);
  assert.deepEqual(edges, [45_000, 135_000, 190_000]);
  for (const s of TAX_ON_SALARIES) {
    const near = edges.some((e) => Math.abs(s - e) <= BRACKET_EDGE_WINDOW);
    assert.equal(rangeSections(s).includes("edge"), near, String(s));
  }
  assert.equal(bracketEdgeNear(40_000)!.status, "below");
  assert.equal(bracketEdgeNear(135_000)!.status, "at");
  assert.equal(bracketEdgeNear(195_000)!.status, "above");
  assert.equal(bracketEdgeNear(195_000)!.upperRate, TAX_BRACKETS[4].rate);
  assert.equal(bracketEdgeNear(20_000), null);
  assert.equal(bracketEdgeNear(100_000), null);
});

test("surcharge section from $15,000 below tier 1; tiers match the constants", () => {
  const t = MEDICARE_LEVY.surcharge;
  for (const s of TAX_ON_SALARIES) {
    assert.equal(rangeSections(s).includes("mls"), s >= t.tier1.min - 1 - THRESHOLD_WINDOW, String(s));
  }
  assert.equal(mlsPosition(85_000), null);
  assert.equal(mlsPosition(105_000)!.tier, 0);
  assert.equal(mlsPosition(110_000)!.tier, 1);
  assert.equal(mlsPosition(110_000)!.amount, Math.round(110_000 * t.tier1.rate));
  assert.equal(mlsPosition(125_000)!.tier, 2);
  assert.equal(mlsPosition(165_000)!.tier, 3);
  assert.equal(mlsPosition(165_000)!.next, null);
  // Family tiers for a single-income family, from $15,000 below family tier 1.
  assert.equal(mlsPosition(190_000)!.family, null);
  assert.equal(mlsPosition(200_000)!.family!.tier, 0);
  assert.equal(mlsPosition(230_000)!.family!.tier, 1);
  assert.equal(mlsPosition(300_000)!.family!.tier, 2);
  assert.equal(mlsPosition(350_000)!.family!.tier, 3);
  assert.equal(mlsPosition(350_000)!.family!.amount, Math.round(350_000 * t.familyTier3.rate));
});

test("HECS-HELP section from $15,000 below the repayment threshold", () => {
  for (const s of TAX_ON_SALARIES) {
    assert.equal(showsHecs(s), s >= HECS_HELP.minimumThreshold - THRESHOLD_WINDOW, String(s));
  }
  assert.equal(showsHecs(50_000), false);
  assert.equal(showsHecs(55_000), true);
});

test("Division 293 section from $15,000 below the salary equivalent; amounts follow the ATO rule", () => {
  for (const s of TAX_ON_SALARIES) {
    assert.equal(rangeSections(s).includes("div293"), s >= DIV293_SALARY_EQUIVALENT - THRESHOLD_WINDOW, String(s));
  }
  assert.equal(div293Position(200_000), null);
  assert.equal(div293Position(220_000)!.stage, "below");
  assert.equal(div293Position(220_000)!.amount, 0);
  const part = div293Position(230_000)!;
  assert.equal(part.stage, "part");
  assert.equal(part.amount, Math.round((230_000 + part.employerSuper - DIVISION_293.threshold) * DIVISION_293.rate * 100) / 100);
  const full = div293Position(300_000)!;
  assert.equal(full.stage, "all");
  assert.ok(full.superCapped);
  assert.equal(full.employerSuper, MAX_EMPLOYER_SUPER);
  assert.equal(full.amount, Math.round(MAX_EMPLOYER_SUPER * DIVISION_293.rate * 100) / 100);
});

test("every page gets three FAQ questions, total first, only for rules that apply", () => {
  for (const s of TAX_ON_SALARIES) {
    const ids = taxOnFaqIds(s);
    assert.equal(ids.length, 3, String(s));
    assert.equal(ids[0], "total");
    assert.equal(new Set(ids).size, ids.length, String(s));
    const sections = rangeSections(s);
    for (const id of ids.slice(1)) {
      if (id !== "placement" && id !== "thresholds" && id !== "total") assert.ok(sections.includes(id), `${s} ${id}`);
    }
  }
  assert.deepEqual(taxOnFaqIds(20_000), ["total", "lito", "medicare"]);
  assert.ok(!taxOnFaqIds(60_000).includes("mls"));
});

test("page structure changes along the grid", () => {
  const sets = new Set(TAX_ON_SALARIES.map((s) => rangeSections(s).join(",")));
  assert.ok(sets.size >= 7, `only ${sets.size} distinct section sets`);
  // Within a set, the stage of each rule changes the wording too.
  const stage = (s: number) =>
    [
      rangeSections(s).join(","),
      litoPosition(s)?.phase,
      medicareReduction(s)?.stage,
      bracketEdgeNear(s)?.status,
      mlsPosition(s)?.tier,
      mlsPosition(s)?.family?.tier,
      div293Position(s)?.stage,
    ].join("|");
  const stages = new Set(TAX_ON_SALARIES.map(stage));
  assert.ok(stages.size >= 20, `only ${stages.size} distinct rule stages`);
});
