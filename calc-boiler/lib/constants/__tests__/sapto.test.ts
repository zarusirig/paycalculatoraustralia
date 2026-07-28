// =============================================================================
// SAPTO — ATO conformance tests
//
// Run with: npm test
//
// Every anchor below is one of the ATO's own named worked examples from
// "Seniors and pensioners tax offset" (QC72197, last updated 8 June 2026).
// They exist mainly to pin the distinction the ATO wrote five examples to
// explain: a couple's ELIGIBILITY is tested on half their COMBINED rebate
// income, but the OFFSET AMOUNT is computed on the person's OWN.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SAPTO_BANDS,
  SAPTO_REDUCTION_RATE,
  calculateSAPTO,
  transferableSAPTO,
} from "../sapto";

// ---------------------------------------------------------------------------
// Published rates table
// ---------------------------------------------------------------------------

test("ATO rates table: maximum offsets", () => {
  assert.equal(SAPTO_BANDS.single.maxOffset, 2_230);
  assert.equal(SAPTO_BANDS.couple.maxOffset, 1_602);
  assert.equal(SAPTO_BANDS.illnessSeparated.maxOffset, 2_040);
});

test("ATO rates table: shading-out and cut-out thresholds", () => {
  assert.equal(SAPTO_BANDS.single.shadingOutThreshold, 34_919);
  assert.equal(SAPTO_BANDS.single.cutOutThreshold, 52_759);
  assert.equal(SAPTO_BANDS.couple.shadingOutThreshold, 30_994);
  assert.equal(SAPTO_BANDS.couple.cutOutThreshold, 43_810);
  assert.equal(SAPTO_BANDS.illnessSeparated.shadingOutThreshold, 33_732);
  assert.equal(SAPTO_BANDS.illnessSeparated.cutOutThreshold, 50_052);
});

test("reduction rate is 12.5 cents in the dollar", () => {
  assert.equal(SAPTO_REDUCTION_RATE, 0.125);
});

// ---------------------------------------------------------------------------
// ATO worked examples — singles
// ---------------------------------------------------------------------------

test("ATO 'Simon': single, rebate income $32,178 → full $2,230", () => {
  const r = calculateSAPTO({ status: "single", rebateIncome: 32_178 });
  assert.equal(r.offset, 2_230);
  assert.equal(r.eligible, true);
});

test("ATO 'José': single, rebate income $39,000 → $1,720", () => {
  // $39,000 − $34,919 = $4,081; × 0.125 = $510.125; $2,230 − $510.125 = $1,719.875
  // The ATO rounds UP to $1,720.
  const r = calculateSAPTO({ status: "single", rebateIncome: 39_000 });
  assert.equal(r.offset, 1_720);
});

test("ATO 'Marko': single, rebate income $85,690 → not entitled", () => {
  const r = calculateSAPTO({ status: "single", rebateIncome: 85_690 });
  assert.equal(r.offset, 0);
  assert.equal(r.eligible, false);
  assert.equal(r.reason, "combinedIncomeTooHigh");
});

// ---------------------------------------------------------------------------
// ATO worked examples — couples
// ---------------------------------------------------------------------------

test("ATO 'Clare and Roy': both below the shading-out threshold → $1,602 each", () => {
  const clare = calculateSAPTO({
    status: "couple",
    rebateIncome: 23_020,
    spouseRebateIncome: 25_677,
  });
  const roy = calculateSAPTO({
    status: "couple",
    rebateIncome: 25_677,
    spouseRebateIncome: 23_020,
  });
  assert.equal(clare.combinedRebateIncome, 48_697);
  assert.equal(clare.assessedRebateIncome, 24_348.5);
  assert.equal(clare.offset, 1_602);
  assert.equal(roy.offset, 1_602);
});

test("ATO 'Deb and Ivan': half of combined is above the cut-out → neither entitled", () => {
  // Combined $89,697; half = $44,848.50 > $43,810.
  const deb = calculateSAPTO({
    status: "couple",
    rebateIncome: 64_020,
    spouseRebateIncome: 25_677,
  });
  assert.equal(deb.assessedRebateIncome, 44_848.5);
  assert.equal(deb.eligible, false);
  assert.equal(deb.offset, 0);
});

test("ATO 'Ying and Li Jun': couple eligible, but only one receives an offset", () => {
  // Combined $79,697; half = $39,848.50 < $43,810, so the COUPLE qualifies.
  // Ying's own $54,020 wipes her offset out; Li Jun still gets the maximum.
  const ying = calculateSAPTO({
    status: "couple",
    rebateIncome: 54_020,
    spouseRebateIncome: 25_677,
  });
  const liJun = calculateSAPTO({
    status: "couple",
    rebateIncome: 25_677,
    spouseRebateIncome: 54_020,
  });
  assert.equal(ying.assessedRebateIncome, 39_848.5);
  assert.equal(ying.eligible, true, "the couple passes the eligibility test");
  assert.equal(ying.offset, 0, "but her own income leaves nothing");
  assert.equal(liJun.offset, 1_602);
});

test("ATO 'Keith': assessed on half the combined, but reduced on his own income", () => {
  // Combined $33,650; half = $16,825 < $43,810 → eligible.
  // Own $33,650 − $30,994 = $2,656; × 0.125 = $332; $1,602 − $332 = $1,270.
  const keith = calculateSAPTO({
    status: "couple",
    rebateIncome: 33_650,
    spouseRebateIncome: 0,
  });
  assert.equal(keith.assessedRebateIncome, 16_825);
  assert.equal(keith.eligible, true);
  assert.equal(keith.offset, 1_270);
});

test("ATO 'Vanh and Mai': $32,590 → $1,403 (rounded up), $26,780 → $1,602", () => {
  // Vanh: $32,590 − $30,994 = $1,596; × 0.125 = $199.50; $1,602 − $199.50 = $1,402.50 → $1,403
  const vanh = calculateSAPTO({
    status: "couple",
    rebateIncome: 32_590,
    spouseRebateIncome: 26_780,
  });
  const mai = calculateSAPTO({
    status: "couple",
    rebateIncome: 26_780,
    spouseRebateIncome: 32_590,
  });
  assert.equal(vanh.assessedRebateIncome, 29_685);
  assert.equal(vanh.offset, 1_403, "ATO rounds $1,402.50 up");
  assert.equal(mai.offset, 1_602);
});

// ---------------------------------------------------------------------------
// Structure and invariants
// ---------------------------------------------------------------------------

test("not meeting the pension condition means no offset at any income", () => {
  const r = calculateSAPTO({
    status: "single",
    rebateIncome: 10_000,
    eligibleForPension: false,
  });
  assert.equal(r.offset, 0);
  assert.equal(r.reason, "notPensionEligible");
});

test("the offset never goes negative and never exceeds the maximum", () => {
  for (const status of ["single", "couple", "illnessSeparated"] as const) {
    const band = SAPTO_BANDS[status];
    for (let income = 0; income <= 120_000; income += 250) {
      const r = calculateSAPTO({ status, rebateIncome: income });
      assert.ok(r.offset >= 0, `${status} at $${income} gave ${r.offset}`);
      assert.ok(r.offset <= band.maxOffset, `${status} at $${income} exceeded the max`);
    }
  }
});

test("the offset never rises as income rises", () => {
  for (const status of ["single", "couple", "illnessSeparated"] as const) {
    let previous = Infinity;
    for (let income = 0; income <= 120_000; income += 250) {
      const offset = calculateSAPTO({ status, rebateIncome: income }).offset;
      assert.ok(offset <= previous, `${status} offset rose at $${income}`);
      previous = offset;
    }
  }
});

test("the offset is nil at and above the cut-out threshold", () => {
  for (const status of ["single", "couple", "illnessSeparated"] as const) {
    const band = SAPTO_BANDS[status];
    assert.equal(calculateSAPTO({ status, rebateIncome: band.cutOutThreshold }).offset, 0);
    assert.ok(calculateSAPTO({ status, rebateIncome: band.shadingOutThreshold }).offset > 0);
  }
});

test("illness-separated is worth more than living together", () => {
  // The whole point of the separate band: higher maximum and higher thresholds.
  assert.ok(SAPTO_BANDS.illnessSeparated.maxOffset > SAPTO_BANDS.couple.maxOffset);
  const apart = calculateSAPTO({ status: "illnessSeparated", rebateIncome: 35_000 }).offset;
  const together = calculateSAPTO({ status: "couple", rebateIncome: 35_000 }).offset;
  assert.ok(apart > together, `${apart} should beat ${together}`);
});

// ---------------------------------------------------------------------------
// Transfer of a spouse's unused SAPTO
// ---------------------------------------------------------------------------

test("ATO transfer example: $2,040 offset, spouse taxable income $10,000 → $1,440", () => {
  // $2,040 − (($10,000 − $6,000) × 0.15) = $2,040 − $600 = $1,440
  assert.equal(transferableSAPTO(2_040, 10_000), 1_440);
});

test("a spouse earning $6,000 or less transfers the whole offset", () => {
  assert.equal(transferableSAPTO(2_040, 6_000), 2_040);
  assert.equal(transferableSAPTO(2_040, 0), 2_040);
});

test("transferable amount never goes negative", () => {
  assert.equal(transferableSAPTO(1_602, 200_000), 0);
});
