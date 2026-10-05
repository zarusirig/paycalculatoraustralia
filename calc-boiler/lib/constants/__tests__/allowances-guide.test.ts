import assert from "node:assert/strict";
import { test } from "node:test";

import { OCCUPATIONS } from "../../data/job-pay-rates";
import { ALLOWANCE_KINDS, allowanceRows, isPrintedAmount } from "../allowances-guide";

test("every kind has at least one verified award row", () => {
  for (const k of ALLOWANCE_KINDS) assert.ok(allowanceRows(k.id).length > 0, k.id);
});

test("every row carries a printed amount, an award code and a consolidation date", () => {
  for (const k of ALLOWANCE_KINDS) {
    for (const r of allowanceRows(k.id)) {
      assert.ok(isPrintedAmount(r.amount), `${r.allowance}: ${r.amount}`);
      assert.match(r.awardCode, /^MA\d{6}$/);
      assert.ok(r.consolidatedTo.length > 0);
      assert.ok(r.occupations.length > 0);
    }
  }
});

test("amounts are exactly those in the occupation data, nothing invented", () => {
  const known = new Set<string>();
  for (const o of OCCUPATIONS) for (const a of o.allowances) known.add(`${o.award?.code}|${a.name}|${a.amount}`);
  for (const k of ALLOWANCE_KINDS) {
    for (const r of allowanceRows(k.id)) assert.ok(known.has(`${r.awardCode}|${r.allowance}|${r.amount}`));
  }
});

test("no row is listed twice; shared awards merge their occupations", () => {
  const rows = allowanceRows("on-call");
  const keys = rows.map((r) => `${r.awardCode}|${r.allowance}|${r.amount}`);
  assert.equal(new Set(keys).size, keys.length);
  const health = rows.find((r) => r.awardCode === "MA000027" && r.allowance.startsWith("On-call allowance (Monday"));
  assert.ok(health && health.occupations.length > 1);
});

test("allowances without a printed amount are excluded (stand-by 'agreed in writing')", () => {
  assert.equal(isPrintedAmount("Agreed in writing"), false);
  assert.equal(isPrintedAmount("$13.43 per week"), true);
  assert.equal(isPrintedAmount("10% of the daily rate"), true);
  const all = ALLOWANCE_KINDS.flatMap((k) => allowanceRows(k.id));
  assert.ok(!all.some((r) => /stand-by/i.test(r.allowance)));
});

test("amounts quoted in the page FAQs still match the award data", () => {
  // modules/guide/allowances-guide-faqs.ts quotes these by hand; the first
  // five were re-read against the award text on 5 October 2026.
  const all = ALLOWANCE_KINDS.flatMap((k) => allowanceRows(k.id));
  const checks: [string, string, string][] = [
    ["MA000009", "First aid allowance", "$13.43 per week"],
    ["MA000004", "First aid allowance", "$14.55 per week"],
    ["MA000002", "First aid allowance", "$16.79 per week"],
    ["MA000009", "Split shift allowance", "$3.69 per day"],
    ["MA000119", "Split shift allowance", "$5.60"],
    ["MA000120", "Broken shift allowance", "$21.38 per day"],
  ];
  for (const [code, name, amount] of checks) {
    assert.ok(all.some((r) => r.awardCode === code && r.allowance === name && r.amount === amount), `${code} ${name} ${amount}`);
  }
});

test("a row never appears under two kinds", () => {
  const seen = new Map<string, string>();
  for (const k of ALLOWANCE_KINDS) {
    for (const r of allowanceRows(k.id)) {
      const key = `${r.awardCode}|${r.allowance}|${r.amount}`;
      assert.ok(!seen.has(key) || seen.get(key) === k.id, `${key} under ${seen.get(key)} and ${k.id}`);
      seen.set(key, k.id);
    }
  }
});
