// =============================================================================
// PAYG withholding regression tests — ATO Schedule 1 (NAT 1004) conformance
//
// Run with: npm test
//
// These guard the defect fixed in July 2026: the withholding engine used to
// annualise earnings and subtract the FULL Low Income Tax Offset, which
// under-withheld by roughly 2x at the low end ($18 against the ATO's $40 at
// $1,000 a fortnight). The ATO scales deliberately do not deliver the whole
// LITO through withholding.
//
// The anchor cases below are the ATO's OWN published worked examples. If they
// fail, the tax-table pages are lying to employers — do not ship.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  calculatePAYGWithholding,
  withholdingForPeriod,
  stslForPeriod,
  FORTNIGHTLY_TABLE_AMOUNTS,
  WEEKLY_TABLE_AMOUNTS,
} from "../payg-withholding";

import {
  TAX_BRACKETS,
  LITO,
  HECS_HELP,
  MEDICARE_LEVY,
  calculateHECS,
} from "../australian-tax";

// -----------------------------------------------------------------------------
// Anchor: ATO "Fortnightly tax table" (NAT 1006) worked example.
// "A payee has fortnightly earnings of $989.80. ... claiming the tax-free
//  threshold, use column 2 to find the correct amount to withhold ($40).
//  ... not claiming the tax-free threshold, use column 3 ($176)."
// -----------------------------------------------------------------------------
test("ATO NAT 1006 worked example: $989.80 fortnightly", () => {
  assert.equal(
    calculatePAYGWithholding(989.80, "fortnightly").paygWithheld,
    40,
    "claiming the tax-free threshold (ATO column 2)"
  );
  assert.equal(
    calculatePAYGWithholding(989.80, "fortnightly", { claimsTaxFreeThreshold: false }).paygWithheld,
    176,
    "not claiming the tax-free threshold (ATO column 3)"
  );
});

test("NAT 1006 lookup: $1,000 fortnightly withholds $42, not $18", () => {
  // $18 was the old annualise-and-subtract-full-LITO answer.
  assert.equal(calculatePAYGWithholding(1_000, "fortnightly").paygWithheld, 42);
});

// -----------------------------------------------------------------------------
// Structural property: the ATO derives fortnightly amounts by halving earnings,
// applying the WEEKLY coefficients, rounding to the dollar, then doubling. So
// every published fortnightly amount is necessarily an EVEN number of dollars.
// Odd values are a reliable tell that the schedule is not being applied.
// -----------------------------------------------------------------------------
test("every fortnightly withholding amount is an even dollar figure", () => {
  for (const gross of FORTNIGHTLY_TABLE_AMOUNTS) {
    for (const claimsTaxFreeThreshold of [true, false]) {
      const amount = calculatePAYGWithholding(gross, "fortnightly", { claimsTaxFreeThreshold }).paygWithheld;
      assert.equal(amount % 2, 0, `$${gross} (TFT=${claimsTaxFreeThreshold}) withheld $${amount}, which is odd`);
    }
  }
});

test("withholding is monotonic in gross pay", () => {
  for (const frequency of ["weekly", "fortnightly", "monthly"] as const) {
    let previous = -1;
    for (const gross of [200, 500, 800, 1_200, 2_000, 3_500, 6_000, 12_000]) {
      const amount = withholdingForPeriod(gross, frequency);
      assert.ok(amount >= previous, `${frequency} withholding fell between steps at $${gross}`);
      previous = amount;
    }
  }
});

test("no withholding below the Scale 2 nil band", () => {
  // Scale 2 withholds nothing below $362 of weekly-equivalent earnings.
  assert.equal(withholdingForPeriod(300, "weekly"), 0);
  assert.equal(withholdingForPeriod(700, "fortnightly"), 0);
});

test("weekly table amounts never withhold more than the gross", () => {
  for (const gross of WEEKLY_TABLE_AMOUNTS) {
    assert.ok(withholdingForPeriod(gross, "weekly") < gross, `$${gross} weekly withheld its whole pay`);
  }
});

// -----------------------------------------------------------------------------
// FY2026-27 constants — arithmetic self-consistency.
// -----------------------------------------------------------------------------
test("FY2026-27 bracket accumulators follow from the rates", () => {
  const [, second, third, fourth, fifth] = TAX_BRACKETS;
  assert.equal(second.rate, 0.15, "second bracket is 15% from 1 July 2026");
  assert.equal(third.base, Math.round((45_000 - 18_200) * 0.15));           // 4,020
  assert.equal(fourth.base, Math.round(third.base + 90_000 * 0.30));        // 31,020
  assert.equal(fifth.base, Math.round(fourth.base + 55_000 * 0.37));        // 51,370
});

test("LITO effective tax-free threshold is derived, not hardcoded", () => {
  // 18,200 + 700/0.15 = 22,867. Under the old 16% rate it was 22,575.
  assert.equal(LITO.effectiveTaxFreeThreshold, 22_867);
});

test("Medicare levy shades in rather than applying from the first dollar", () => {
  assert.equal(MEDICARE_LEVY.lowIncomeThreshold, 28_011);
  assert.equal(MEDICARE_LEVY.shadeInThreshold, 35_013);
});

// -----------------------------------------------------------------------------
// Anchor: ATO "Study and training loan repayment thresholds and rates",
// Example 2 — repayment income $137,064 gives $10,276.99.
// -----------------------------------------------------------------------------
test("ATO HECS worked example: $137,064 repayment income", () => {
  assert.equal(HECS_HELP.minimumThreshold, 69_528, "FY2026-27 minimum threshold");
  const expected = 9_028 + (137_064 - 129_717) * 0.17; // 10,276.99
  assert.ok(
    Math.abs(calculateHECS(137_064) - expected) <= 1,
    `expected about $${expected.toFixed(2)}, got $${calculateHECS(137_064)}`
  );
});

test("no HECS repayment below the FY2026-27 threshold", () => {
  assert.equal(calculateHECS(69_528), 0);
  assert.ok(calculateHECS(69_529) >= 0);
});

// -----------------------------------------------------------------------------
// Anchor: ATO Schedule 8 (NAT 3539) — study and training support loans.
//
// Published 17 June 2026, applies from 1 July 2026. y = ax − b on the WEEKLY
// equivalent, then converted back to the pay period.
//
// These guard the second annualise-and-divide defect, found 28 July 2026 while
// verifying the deployed fortnightly table. The STSL component was computed as
// round(annualHECS / periods), which is neither the ATO's formula nor its
// rounding, and produced odd-dollar fortnightly figures the ATO never publishes.
// -----------------------------------------------------------------------------

test("Schedule 8 example 1: weekly $2,608.36 with threshold claimed → $193", () => {
  // x = 2,608.99; y = (0.1700 × 2,608.99) − 250.4527 = 193.0756 → $193
  assert.equal(stslForPeriod(2_608.36, "weekly", "tft"), 193);
});

test("Schedule 8 example 2: fortnightly $4,409.75 with threshold claimed → $260", () => {
  // weekly equivalent 2,204.99; y = (0.1500 × 2,204.99) − 200.5615 = 130.187
  // → $130, doubled to $260
  assert.equal(stslForPeriod(4_409.75, "fortnightly", "tft"), 260);
});

test("Schedule 8 example 3: monthly $10,627.88 without threshold → $979", () => {
  // weekly equivalent 2,452.99; y = (0.1700 × 2,452.99) − 190.9527 = 226.0556
  // → $226, × 13 ÷ 3 = 979.33 → $979
  assert.equal(stslForPeriod(10_627.88, "monthly", "noTft"), 979);
});

test("Schedule 8: no component below the ATO's stated thresholds", () => {
  // The ATO thresholds ($1,337 weekly with the threshold claimed, $987 without)
  // are where you START applying the formula, not where the result turns
  // positive — at the very bottom of the band y rounds to zero. At $1,337
  // exactly, y = (0.15 × 1,337.99) − 200.5615 = $0.14, which rounds to $0.
  assert.equal(stslForPeriod(1_336, "weekly", "tft"), 0, "below threshold");
  assert.equal(stslForPeriod(2_672, "fortnightly", "tft"), 0, "below threshold");
  assert.equal(stslForPeriod(1_337, "weekly", "tft"), 0, "at threshold, rounds to nil");
  assert.ok(stslForPeriod(1_400, "weekly", "tft") > 0, "positive above the band floor");

  assert.equal(stslForPeriod(986, "weekly", "noTft"), 0, "below threshold");
  assert.ok(stslForPeriod(1_100, "weekly", "noTft") > 0, "positive above the band floor");
});

test("Schedule 8: foreign residents use the threshold-claimed STSL table", () => {
  assert.equal(
    stslForPeriod(4_409.75, "fortnightly", "foreignResident"),
    stslForPeriod(4_409.75, "fortnightly", "tft"),
  );
});

test("every fortnightly STSL component is an even dollar amount", () => {
  // The ATO derives a rounded WEEKLY component and doubles it, so a fortnightly
  // figure can never be odd. This is the assertion that would have caught the
  // annualise-and-divide defect.
  for (const scale of ["tft", "noTft", "foreignResident"] as const) {
    for (let gross = 0; gross <= 12_000; gross += 20) {
      const stsl = stslForPeriod(gross, "fortnightly", scale);
      assert.equal(stsl % 2, 0, `${scale} at $${gross} gave an odd $${stsl}`);
    }
  }
});

test("every fortnightly TOTAL withheld is an even dollar amount, with STSL on", () => {
  for (const gross of FORTNIGHTLY_TABLE_AMOUNTS) {
    for (const claimsTaxFreeThreshold of [true, false]) {
      const r = calculatePAYGWithholding(gross, "fortnightly", {
        claimsTaxFreeThreshold,
        hasSTSL: true,
      });
      assert.equal(
        r.totalWithheld % 2,
        0,
        `$${gross} tft=${claimsTaxFreeThreshold} gave an odd total $${r.totalWithheld}`,
      );
    }
  }
});

test("STSL rises monotonically with earnings", () => {
  let previous = 0;
  for (let gross = 0; gross <= 15_000; gross += 50) {
    const stsl = stslForPeriod(gross, "fortnightly", "tft");
    assert.ok(stsl >= previous, `STSL fell from $${previous} to $${stsl} at $${gross}`);
    previous = stsl;
  }
});
