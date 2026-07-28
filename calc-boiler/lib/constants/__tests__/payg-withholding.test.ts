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
  SCHEDULE_5_WITHHOLDING_LIMIT,
  calculateSchedule5MethodB,
} from "../payg-withholding";

import {
  TAX_BRACKETS,
  LITO,
  HECS_HELP,
  MEDICARE_LEVY,
  calculateHECS,
} from "../australian-tax";
import {
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
  QUALIFYING_EARNINGS,
  GENERAL_INTEREST_CHARGE,
  PAYDAY_SUPER_CAP_RELIEF,
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
// Anchor: ATO "Weekly tax table" (NAT 1005) worked example, read from
// ato.gov.au/tax-rates-and-codes/tax-table-weekly on 28 July 2026.
// "A payee has weekly earnings of $563.60. ... claiming the tax-free threshold,
//  use column 2 ($33). ... not claiming the tax-free threshold, use column 3
//  ($108)."
// -----------------------------------------------------------------------------
test("ATO NAT 1005 worked example: $563.60 weekly", () => {
  assert.equal(
    calculatePAYGWithholding(563.60, "weekly").paygWithheld,
    33,
    "claiming the tax-free threshold (ATO column 2)"
  );
  assert.equal(
    calculatePAYGWithholding(563.60, "weekly", { claimsTaxFreeThreshold: false }).paygWithheld,
    108,
    "not claiming the tax-free threshold (ATO column 3)"
  );
});

// -----------------------------------------------------------------------------
// Anchor: ATO "Monthly tax table" (NAT 1007) worked example, read from
// ato.gov.au/tax-rates-and-codes/tax-table-monthly on 28 July 2026.
// "A payee has monthly earnings of $4,311.68. ... claiming the tax-free
//  threshold, use column 2 ($589). ... not claiming the tax-free threshold, use
//  column 3 ($1,070)."
//
// This one exercises the monthly x3/13 conversion and the 13/3 conversion back,
// which no other anchor covers.
// -----------------------------------------------------------------------------
test("ATO NAT 1007 worked example: $4,311.68 monthly", () => {
  assert.equal(
    calculatePAYGWithholding(4_311.68, "monthly").paygWithheld,
    589,
    "claiming the tax-free threshold (ATO column 2)"
  );
  assert.equal(
    calculatePAYGWithholding(4_311.68, "monthly", { claimsTaxFreeThreshold: false }).paygWithheld,
    1_070,
    "not claiming the tax-free threshold (ATO column 3)"
  );
});

// -----------------------------------------------------------------------------
// Anchor: ATO foreign resident (Scale 3) rate bands, printed on each tax-table
// page and read on 28 July 2026.
//   Weekly:  0–2,595 = 30c/$; 2,596–3,652 = $779 + 37c over $2,595;
//            3,653 & over = $1,170 + 45c over $3,652.
// The published band descriptions round to the dollar, so the engine is checked
// to within $1 of them rather than for exact equality.
// -----------------------------------------------------------------------------
test("Scale 3 reproduces the ATO's published foreign resident weekly bands", () => {
  const cases: [number, number][] = [
    [1_000, 300],                                  // flat 30c band
    [2_595, 779],                                  // top of the 30c band
    [3_000, 779 + (3_000 - 2_595) * 0.37],         // 37c band
    [4_000, 1_170 + (4_000 - 3_652) * 0.45],       // 45c band
  ];
  for (const [gross, expected] of cases) {
    const actual = withholdingForPeriod(gross, "weekly", "foreignResident");
    assert.ok(
      Math.abs(actual - expected) <= 1,
      `foreign resident at $${gross}/week: expected about $${expected.toFixed(2)}, got $${actual}`
    );
  }
});

test("foreign residents are withheld more than residents on the same pay", () => {
  for (const frequency of ["weekly", "fortnightly", "monthly"] as const) {
    for (const gross of [500, 1_000, 2_000, 5_000]) {
      const resident = withholdingForPeriod(gross, frequency, "tft");
      const foreign = withholdingForPeriod(gross, frequency, "foreignResident");
      assert.ok(
        foreign > resident,
        `${frequency} $${gross}: foreign $${foreign} should exceed resident $${resident}`
      );
    }
  }
});

test("every fortnightly foreign resident amount is an even dollar figure", () => {
  // Same weekly-then-double derivation as the resident scales.
  for (let gross = 0; gross <= 20_000; gross += 100) {
    const amount = withholdingForPeriod(gross, "fortnightly", "foreignResident");
    assert.equal(amount % 2, 0, `$${gross} foreign resident withheld $${amount}, which is odd`);
  }
});

// -----------------------------------------------------------------------------
// The tax-table pages render 30 rows each from their own earnings arrays in
// modules/tax-tables/ato-schedules.ts. Those arrays are inputs only, but the
// even-dollar property must hold across the whole rendered fortnightly range,
// in every column the page shows.
// -----------------------------------------------------------------------------
test("fortnightly page rows are even in every rendered column", () => {
  const renderedRows = [
    600, 800, 1_000, 1_200, 1_400, 1_600, 1_800, 2_000, 2_200, 2_400,
    2_600, 2_800, 3_000, 3_200, 3_400, 3_600, 3_800, 4_000, 4_200, 4_400,
    4_800, 5_200, 5_600, 6_000, 6_500, 7_000, 7_500, 8_000, 9_000, 10_000,
  ];
  assert.ok(renderedRows.length >= 26, "the page must render at least 26 rows");

  const columns = [
    { label: "tft", options: { claimsTaxFreeThreshold: true } },
    { label: "tft+stsl", options: { claimsTaxFreeThreshold: true, hasSTSL: true } },
    { label: "no tft", options: { claimsTaxFreeThreshold: false } },
    { label: "foreign", options: { foreignResident: true } },
    { label: "foreign+stsl", options: { foreignResident: true, hasSTSL: true } },
  ];

  for (const gross of renderedRows) {
    for (const column of columns) {
      const total = calculatePAYGWithholding(gross, "fortnightly", column.options).totalWithheld;
      assert.equal(total % 2, 0, `$${gross} column "${column.label}" gave an odd $${total}`);
    }
  }
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

// =============================================================================
// Payday Super / SGC — guards on the three facts most often published wrong.
// Verified at ato.gov.au 28 July 2026 (QC105848, QC105843, QC16145).
// =============================================================================

test("the SGC has four components and the late payment penalty is not one", () => {
  const c = SUPER_GUARANTEE_CHARGE.current;
  assert.equal(c.components.length, 4);
  for (const comp of c.components) {
    assert.ok(!/late payment/i.test(comp), "late payment penalty is a separate penalty");
  }
  // It exists, but nested separately, and only after a Notice to Pay.
  assert.equal(c.latePayment.penalty, 0.25);
  assert.equal(c.latePayment.penaltyRepeatWithin24Months, 0.5);
  // Never write "no way out" — there is a 0% pathway.
  assert.equal(c.latePayment.exceptionalCircumstances, true);
});

test("the administrative uplift is two stacking reductions, not one test", () => {
  const s = SUPER_GUARANTEE_CHARGE.current.upliftSchedule;
  assert.equal(s.length, 5);
  // Disclosing within 30 days with a clean record reaches nil.
  const fast = s.find((r) => r.disclosure === "Within 30 days")!;
  assert.equal(fast.noPriorAssessment, 0);
  // A prior assessment costs exactly 20 points at every disclosure speed.
  for (const row of s) {
    assert.equal(row.priorAssessment - row.noPriorAssessment, 20, row.disclosure);
  }
  // The uplift only ever worsens as disclosure is delayed.
  for (let i = 1; i < s.length; i++) {
    assert.ok(s[i].noPriorAssessment >= s[i - 1].noPriorAssessment);
  }
  // Doing neither leaves you at the headline 60%.
  assert.equal(s[s.length - 1].priorAssessment, SUPER_GUARANTEE_CHARGE.current.administrativeUpliftMax * 100);
});

test("the choice loading cap is per notice period, on contributions", () => {
  const c = SUPER_GUARANTEE_CHARGE.current;
  assert.equal(c.choiceLoadingCap, 1_200);
  assert.equal(c.choiceLoadingCapBasis, "notice period");
  assert.equal(c.choiceLoadingBasis, "value of contributions");
});

test("qualifying earnings added exactly one payment type — overtime is still out", () => {
  assert.match(QUALIFYING_EARNINGS.onlyChangeFromOTE, /commissions/);
  assert.match(QUALIFYING_EARNINGS.onlyChangeFromOTE, /outside ordinary hours/);
  const overtime = QUALIFYING_EARNINGS.stillExcluded.find((x) => x.startsWith("overtime"));
  assert.ok(overtime, "overtime must remain listed as excluded");
  for (const inc of QUALIFYING_EARNINGS.stillIncluded) {
    assert.ok(!/^overtime/.test(inc), "overtime must never appear in the included list");
  }
});

test("the SGC is deductible, but three attached amounts are not", () => {
  const c = SUPER_GUARANTEE_CHARGE.current;
  assert.equal(c.taxDeductible, true);
  assert.equal(SUPER_GUARANTEE_CHARGE.legacy.taxDeductible, false);
  assert.equal(c.deductibleComponents.length, 4);
  assert.equal(c.nonDeductible.length, 3);
  assert.ok(c.nonDeductible.some((x) => /late payment penalty/.test(x)));
});

test("the GIC rate carries the quarter it belongs to, so staleness is visible", () => {
  // This resets quarterly and is the fastest-staling figure on the site.
  assert.ok(GENERAL_INTEREST_CHARGE.quarter.length > 0);
  assert.equal(GENERAL_INTEREST_CHARGE.resetsQuarterly, true);
  assert.equal(GENERAL_INTEREST_CHARGE.annualRate, 0.1143);
  // The ATO publishes the daily rate; deriving it lands on a different digit.
  assert.equal(GENERAL_INTEREST_CHARGE.dailyRatePercent, 0.03131507);
  assert.ok(GENERAL_INTEREST_CHARGE.annualRate > GENERAL_INTEREST_CHARGE.previousQuarter.annualRate);
});

test("Payday Super concessional cap relief is not presented as law", () => {
  assert.equal(PAYDAY_SUPER_CAP_RELIEF.announced, true);
  assert.equal(PAYDAY_SUPER_CAP_RELIEF.isLaw, false);
  assert.match(PAYDAY_SUPER_CAP_RELIEF.atoWording, /not yet law/i);
});

test("the maximum contribution base is annual and derives from the concessional cap", () => {
  // $32,500 x 100 / 12, rounded down to the nearest $10.
  const derived = Math.floor((SUPER_GUARANTEE.concessionalCap * 100) / 12 / 10) * 10;
  assert.equal(derived, SUPER_GUARANTEE.maxContributionBaseAnnual);
  assert.equal(SUPER_GUARANTEE.maxContributionBaseAnnual, 270_830);
  assert.equal(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026, 62_500);
});

// =============================================================================
// Schedule 5 withholding limit — the 47% cap.
//
// Found 28 July 2026 by a tax-table audit and confirmed verbatim at ato.gov.au
// QC107123: "If the withholding amount calculated (including a study and
// training support loan component) using Method A or Method B(ii) exceeds 47%
// of the additional payment being made, then the amount is reduced to be equal
// to 47% of that payment."
//
// The engine previously capped at 100% of the payment, so a high regular wage
// plus STSL could withhold ~57% of a bonus. This feeds /bonus-tax-calculator/,
// the site's highest-traffic page.
// =============================================================================

test("Schedule 5 withholding never exceeds 47% of the additional payment", () => {
  const cases: { gross: number; bonus: number; freq: "weekly" | "fortnightly" | "monthly"; stsl: boolean }[] = [
    { gross: 8_000, bonus: 1_000, freq: "fortnightly", stsl: true },
    { gross: 8_000, bonus: 1_000, freq: "fortnightly", stsl: false },
    { gross: 12_000, bonus: 500, freq: "monthly", stsl: true },
    { gross: 4_000, bonus: 250, freq: "weekly", stsl: true },
    { gross: 2_000, bonus: 20_000, freq: "fortnightly", stsl: true },
    { gross: 500, bonus: 100, freq: "weekly", stsl: false },
  ];
  for (const c of cases) {
    const r = calculateSchedule5MethodB(c.gross, c.bonus, c.freq, {
      claimsTaxFreeThreshold: true,
      hasSTSL: c.stsl,
    });
    assert.ok(
      r.effectiveRate <= SCHEDULE_5_WITHHOLDING_LIMIT + 1e-9,
      `${c.freq} ${c.gross}+${c.bonus} stsl=${c.stsl} withheld ${(r.effectiveRate * 100).toFixed(1)}%`,
    );
    assert.ok(r.withheldFromAdditionalPayment <= r.withholdingLimit);
  }
});

test("the 47% limit binds on the case that exposed the defect", () => {
  // $8,000/fortnight + $1,000 bonus + STSL reached 57.2% before the fix.
  const r = calculateSchedule5MethodB(8_000, 1_000, "fortnightly", {
    claimsTaxFreeThreshold: true,
    hasSTSL: true,
  });
  assert.equal(r.withholdingLimitApplied, true, "the limit should bind here");
  assert.equal(r.withholdingLimit, 470);
  assert.equal(r.withheldFromAdditionalPayment, 470);
  assert.ok(r.uncappedWithholding > 470, "uncapped figure should exceed the cap");
});

test("the limit does not bind on ordinary bonuses, and is reported honestly", () => {
  // A modest bonus on a modest wage sits well under the ceiling; the cap must
  // not silently inflate withholding up to 47%.
  const r = calculateSchedule5MethodB(2_000, 1_000, "fortnightly", {
    claimsTaxFreeThreshold: true,
  });
  assert.equal(r.withholdingLimitApplied, false);
  assert.ok(r.withheldFromAdditionalPayment < r.withholdingLimit);
  assert.equal(r.withheldFromAdditionalPayment, r.uncappedWithholding);
});

test("the limit applies to the additional payment only, not to normal earnings", () => {
  // Regular withholding must be untouched by the cap.
  const r = calculateSchedule5MethodB(8_000, 1_000, "fortnightly", {
    claimsTaxFreeThreshold: true,
    hasSTSL: true,
  });
  const regular = calculatePAYGWithholding(8_000, "fortnightly", {
    claimsTaxFreeThreshold: true,
    hasSTSL: true,
  });
  assert.equal(r.regularWithholding, regular.totalWithheld);
});

test("Schedule 5 withholding is a whole number of dollars", () => {
  // The ATO says "ignore any cents" at the limit step.
  for (const bonus of [333, 1_000, 7_777, 12_345]) {
    const r = calculateSchedule5MethodB(3_000, bonus, "fortnightly", { claimsTaxFreeThreshold: true });
    assert.equal(r.withheldFromAdditionalPayment % 1, 0, `bonus ${bonus}`);
  }
});
