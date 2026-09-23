import assert from "node:assert/strict";
import { test } from "node:test";

import { formatAUD, formatNegAUD } from "../australian-tax";

test("a positive deduction gets a leading minus", () => {
  assert.equal(formatNegAUD(1234), "-$1,234");
  assert.equal(formatNegAUD(1234.5, 2), "-$1,234.50");
  assert.equal(formatNegAUD(2_000, 0, "−"), "−$2,000");
});

test("zero never shows a minus", () => {
  assert.equal(formatNegAUD(0), "$0");
  assert.equal(formatNegAUD(0, 2), "$0.00");
  assert.equal(formatNegAUD(-0, 2), "$0.00");
  assert.equal(formatNegAUD(0, 0, "−"), "$0");
});

test("values that round to zero at the display precision show no minus", () => {
  assert.equal(formatNegAUD(0.004, 2), "$0.00");
  assert.equal(formatNegAUD(0.4), "$0");
  assert.equal(formatNegAUD(-0.004, 2), "$0.00");
  // …but a value that rounds up to a cent keeps it.
  assert.equal(formatNegAUD(0.005, 2), "-$0.01");
  assert.equal(formatNegAUD(0.6), "-$1");
});

test("the digits match formatAUD exactly", () => {
  for (const v of [1, 12.345, 999.995, 45_678.9, 1_000_000]) {
    for (const d of [0, 2]) {
      assert.equal(formatNegAUD(v, d), `-${formatAUD(v, d)}`);
    }
  }
});

test("a negative value (a credit) is shown unsigned, never as --$", () => {
  assert.equal(formatNegAUD(-5), "$5");
  assert.equal(formatNegAUD(-5.25, 2), "$5.25");
});

test("NaN and Infinity render as $0 rather than leaking into the page", () => {
  assert.equal(formatNegAUD(Number.NaN, 2), "$0.00");
  assert.equal(formatNegAUD(Number.POSITIVE_INFINITY), "$0");
});
