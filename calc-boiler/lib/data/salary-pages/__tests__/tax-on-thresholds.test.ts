import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DIV293_SALARY_EQUIVALENT,
  THRESHOLD_WINDOW,
  allThresholds,
  distanceText,
  thresholdsBetweenNeighbours,
  thresholdsNear,
} from "../tax-on-thresholds";
import { CO_CONTRIBUTION } from "../../../constants/super-contributions";
import { LISTO_CURRENT } from "../../../constants/listo";
import { FTB_B } from "../../../constants/centrelink-family-payments";
import { PPL_INCOME_TEST } from "../../../constants/paid-parental-leave";
import { TAX_ON_SALARIES } from "../index";
import {
  HECS_HELP,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  calculateIncomeTax,
  calculateLITO,
} from "../../../constants/australian-tax";
import { DIVISION_293 } from "../../../constants/super-contributions";

const byId = (id: string) => {
  const t = allThresholds().find((x) => x.id === id);
  assert.ok(t, id);
  return t;
};

test("amounts come from the verified constants", () => {
  assert.equal(byId("bracket-30").at, 45_000);
  assert.equal(byId("bracket-37").at, 135_000);
  assert.equal(byId("bracket-45").at, 190_000);
  assert.equal(byId("mls-1").at, MEDICARE_LEVY.surcharge.tier1.min - 1);
  assert.equal(byId("mls-3").at, 164_000);
  assert.equal(byId("hecs-start").at, HECS_HELP.minimumThreshold);
  assert.equal(byId("hecs-17").at, 129_717);
  assert.equal(byId("hecs-flat").at, 186_050);
  assert.equal(byId("super-max-base").at, SUPER_GUARANTEE.maxContributionBaseAnnual);
  assert.equal(byId("lito-nil").at, 66_667);
});

test("LITO tax-free point: nil tax at the threshold, tax payable one dollar above", () => {
  const at = byId("lito-nil-tax").at;
  assert.equal(at, 22_866);
  assert.ok(calculateIncomeTax(at) - calculateLITO(at) <= 0);
  assert.ok(calculateIncomeTax(at + 1) - calculateLITO(at + 1) > 0);
});

test("Division 293 salary equivalent: salary + 12% SG crosses $250,000 one dollar above", () => {
  const s = DIV293_SALARY_EQUIVALENT;
  assert.equal(s, 223_214);
  assert.ok(s * (1 + SUPER_GUARANTEE.rate) <= DIVISION_293.threshold);
  assert.ok((s + 1) * (1 + SUPER_GUARANTEE.rate) > DIVISION_293.threshold);
});

test("each threshold is labelled with its income year; Medicare low-income figures and the PPL test year lag a year", () => {
  for (const t of allThresholds()) {
    if (t.kind === "medicare" || t.id.startsWith("ppl-")) assert.equal(t.incomeYear, SITE_CONFIG.previousFinancialYear, t.id);
    else assert.equal(t.incomeYear, SITE_CONFIG.financialYear, t.id);
    assert.ok(t.href.startsWith("/") && t.href.endsWith("/"), t.href);
  }
});

test("the list is sorted and ids are unique", () => {
  const all = allThresholds();
  for (let i = 1; i < all.length; i++) assert.ok(all[i].at >= all[i - 1].at);
  assert.equal(new Set(all.map((t) => t.id)).size, all.length);
});

test("near = within ±$15,000; status and distance are right", () => {
  const n = thresholdsNear(120_000);
  assert.deepEqual(
    n.near.map((t) => t.id),
    ["mls-1", "mls-2", "ftb-b", "hecs-17", "bracket-37"],
  );
  const mls1 = n.near[0];
  assert.equal(mls1.status, "passed");
  assert.equal(mls1.distance, 15_000);
  assert.equal(n.near[1].status, "ahead");
  assert.equal(n.near[1].distance, 3_000);
  assert.equal(distanceText(n.near[1], 120_000), "$3,000 above $120,000");
  for (const t of n.near) assert.ok(t.distance <= THRESHOLD_WINDOW);
});

test("a salary sitting on a threshold reads 'at'", () => {
  const t = thresholdsNear(45_000).near.find((x) => x.id === "bracket-30");
  assert.ok(t);
  assert.equal(t.status, "at");
  assert.equal(t.distance, 0);
});

test("with nothing near, the next and last thresholds are named", () => {
  const n = thresholdsNear(85_000);
  assert.equal(n.near.length, 0);
  assert.equal(n.nextBeyond?.id, "mls-1");
  assert.equal(n.lastBefore?.id, "hecs-start");
  const top = thresholdsNear(500_000);
  assert.equal(top.near.length, 0);
  assert.equal(top.nextBeyond, null);
  assert.equal(top.lastBefore?.id, "ppl-family");
});

test("every kept tax-on salary gets either a near threshold or a next/last one", () => {
  for (const s of TAX_ON_SALARIES) {
    const n = thresholdsNear(s);
    assert.ok(n.near.length > 0 || n.nextBeyond || n.lastBefore, `${s}`);
  }
});

test("second-pass thresholds are read from their constants", () => {
  assert.equal(byId("listo").at, LISTO_CURRENT.incomeThreshold);
  assert.equal(byId("co-contribution-lower").at, CO_CONTRIBUTION.lowerThreshold);
  assert.equal(byId("co-contribution-higher").at, CO_CONTRIBUTION.higherThreshold);
  assert.equal(byId("ftb-b").at, FTB_B.primaryEarnerLimit);
  assert.equal(byId("ppl-individual").at, PPL_INCOME_TEST["2025-26"].individual);
  assert.equal(byId("ppl-family").at, PPL_INCOME_TEST["2025-26"].family);
  assert.equal(byId("mls-family-1").at, MEDICARE_LEVY.surcharge.familyTier1.min - 1);
  assert.equal(byId("mls-family-3").at, MEDICARE_LEVY.surcharge.familyTier3.min - 1);
});

test("between neighbours: the previous page's salary to the next one's", () => {
  const mid = thresholdsBetweenNeighbours(100_000, TAX_ON_SALARIES);
  assert.equal(mid.lo, 95_000);
  assert.equal(mid.hi, 105_000);
  assert.deepEqual(mid.near.map((t) => t.id), ["mls-1"]);
  const tail = thresholdsBetweenNeighbours(400_000, TAX_ON_SALARIES);
  assert.equal(tail.lo, 300_000);
  assert.equal(tail.hi, 500_000);
  assert.deepEqual(tail.near.map((t) => t.id), ["mls-family-3", "ppl-family"]);
  const first = thresholdsBetweenNeighbours(TAX_ON_SALARIES[0], TAX_ON_SALARIES);
  assert.equal(first.lo, TAX_ON_SALARIES[0]);
  assert.equal(thresholdsBetweenNeighbours(500_000, TAX_ON_SALARIES).hi, 500_000);
  for (const t of mid.near) assert.ok(t.at >= mid.lo && t.at <= mid.hi);
});
