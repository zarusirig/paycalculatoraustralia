import assert from "node:assert/strict";
import { test } from "node:test";

import { parseMoneyInput } from "../money-input";

const ok = (raw: string) => {
  const r = parseMoneyInput(raw);
  assert.equal(r.error, null, `${JSON.stringify(raw)} should parse, got ${r.message}`);
  return r.value;
};
const err = (raw: string) => parseMoneyInput(raw).error;

test("plain, comma-grouped and decimal amounts", () => {
  assert.equal(ok("2000000"), 2_000_000);
  assert.equal(ok("2,000,000"), 2_000_000);
  assert.equal(ok("1,234.56"), 1234.56);
  assert.equal(ok("1234.5"), 1234.5);
  assert.equal(ok("1500."), 1500);
  assert.equal(ok(".5"), 0.5);
  assert.equal(ok("0"), 0);
  assert.equal(ok("999"), 999);
});

test("dollar signs, AUD and spaces are accepted", () => {
  assert.equal(ok("$1,500,000"), 1_500_000);
  assert.equal(ok(" $ 1 500 000 "), 1_500_000);
  assert.equal(ok("1 500 000"), 1_500_000);
  assert.equal(ok("A$2,500,000"), 2_500_000);
  assert.equal(ok("AUD 2,500,000.50"), 2_500_000.5);
  assert.equal(ok("2500000 AUD"), 2_500_000);
  assert.equal(ok("+85,000"), 85_000);
});

test("empty is not an error and reads as 0", () => {
  for (const raw of ["", "   ", "\t"]) {
    const r = parseMoneyInput(raw);
    assert.equal(r.empty, true);
    assert.equal(r.error, null);
    assert.equal(r.value, 0);
  }
});

test("scientific notation is flagged, not read as 1.56 (the old bug)", () => {
  for (const raw of ["1.5e6", "1.5E6", "2e+6", "$1e6", "1,5e6"]) {
    const r = parseMoneyInput(raw);
    assert.equal(r.error, "scientific", raw);
    assert.equal(r.value, 0);
    assert.match(r.message ?? "", /scientific notation/);
  }
});

test("negatives are flagged, not read as positive (the old bug)", () => {
  for (const raw of ["-500000", "-$500,000", "$-500,000", "−500000", "(500,000)", " - 500000"]) {
    const r = parseMoneyInput(raw);
    assert.equal(r.error, "negative", raw);
    assert.equal(r.value, 0);
  }
});

test("malformed input is flagged", () => {
  for (const raw of ["abc", "85k", "1.500.000", "1,50,000", "1,5", "12abc", "$", ",", "1..5", "e6", "1e"]) {
    assert.equal(err(raw), "invalid", raw);
  }
});

test("amounts over the max are flagged; default max is $100 billion", () => {
  assert.equal(err("99999999999"), null);
  assert.equal(err("100000000001"), "too-large");
  const r = parseMoneyInput("5,000", { max: 1_000 });
  assert.equal(r.error, "too-large");
  assert.equal(r.message, "Enter an amount up to $1,000.");
});
