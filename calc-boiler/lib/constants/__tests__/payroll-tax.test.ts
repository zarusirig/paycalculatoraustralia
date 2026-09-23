// =============================================================================
// State payroll tax 2026-27 — tests
//
// Every "published" case below is a worked example printed by the state or
// territory revenue office (read 23 Sep 2026). Where the office's example is
// for 2025-26, the parameters it uses are the same in 2026-27 (checked in the
// rate tables cited in lib/constants/payroll-tax.ts).
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  calculatePayrollTax,
  saRate,
  actRate,
  PAYROLL_TAX_STATE_CODES,
  PAYROLL_TAX_STATES,
  isPayrollTaxStateCode,
  NSW_PAYROLL_TAX,
  VIC_PAYROLL_TAX,
  QLD_PAYROLL_TAX,
  WA_PAYROLL_TAX,
  SA_PAYROLL_TAX,
  TAS_PAYROLL_TAX,
  ACT_PAYROLL_TAX,
  NT_PAYROLL_TAX,
} from "../payroll-tax";
import { STATE_PAYROLL_TAX } from "../australian-tax";

const near = (actual: number, expected: number, tol = 0.01, msg?: string) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${msg ?? ""} expected ${expected}, got ${actual}`);

// ---------------------------------------------------------------- NSW
test("NSW: published example — $1.5m NSW-only wages, tax on $300,000", () => {
  const r = calculatePayrollTax({ state: "nsw", stateWages: 1_500_000 });
  near(r.deduction, 1_200_000);
  near(r.taxableWages, 300_000);
  near(r.total, 300_000 * 0.0545); // $16,350
});

test("NSW: published interstate example — $900k NSW of $3m Australian → threshold $360,000, tax on $540,000", () => {
  const r = calculatePayrollTax({ state: "nsw", stateWages: 900_000, australianWages: 3_000_000 });
  near(r.deduction, 360_000);
  near(r.taxableWages, 540_000);
  near(r.total, 29_430);
});

test("NSW: under the threshold pays nothing; monthly thresholds match Revenue NSW", () => {
  assert.equal(calculatePayrollTax({ state: "nsw", stateWages: 1_200_000 }).total, 0);
  // 1.2m × days / 365, rounded as published
  assert.equal(Math.round((NSW_PAYROLL_TAX.threshold * 28) / 365), NSW_PAYROLL_TAX.monthlyThresholds.days28);
  assert.equal(Math.round((NSW_PAYROLL_TAX.threshold * 30) / 365), NSW_PAYROLL_TAX.monthlyThresholds.days30);
  // Revenue NSW prints $101,918 for 31 days (101,917.81 rounded up).
  near((NSW_PAYROLL_TAX.threshold * 31) / 365, NSW_PAYROLL_TAX.monthlyThresholds.days31, 0.5);
});

// ---------------------------------------------------------------- VIC
test("VIC: phase-out — SRO shortcut (5m − wages) × 50% for a VIC-only full-year employer", () => {
  // SRO Example 1 uses the 2024-25 parameters ($900k, 45%): $4.2m → $360,000.
  // Its shortcut "$5 million minus the wage bill multiplied by the phase-out
  // rate" holds for 2026-27 at 50%: $4.2m → $400,000.
  const r = calculatePayrollTax({ state: "vic", stateWages: 4_200_000 });
  near(r.deduction, 400_000);
  near(r.total, (4_200_000 - 400_000) * 0.0485);
});

test("VIC: full $1m threshold below $3m, none from $5m", () => {
  near(calculatePayrollTax({ state: "vic", stateWages: 2_500_000 }).deduction, 1_000_000);
  near(calculatePayrollTax({ state: "vic", stateWages: 3_000_000 }).deduction, 1_000_000);
  near(calculatePayrollTax({ state: "vic", stateWages: 5_000_000 }).deduction, 0);
  near(calculatePayrollTax({ state: "vic", stateWages: 6_000_000 }).deduction, 0);
  assert.equal(calculatePayrollTax({ state: "vic", stateWages: 999_999 }).total, 0);
});

test("VIC: surcharge thresholds apportioned as in SRO Example 2 ($80m VIC of $150m)", () => {
  const r = calculatePayrollTax({ state: "vic", stateWages: 80_000_000, australianWages: 150_000_000 });
  const t1 = 10_000_000 * (80 / 150); // $5,333,333.33 (published)
  const t2 = 100_000_000 * (80 / 150); // $53,333,333.33 (published)
  near(t1, 5_333_333.33);
  near(t2, 53_333_333.33);
  near(r.surcharge, (80_000_000 - t1) * 0.01 + (80_000_000 - t2) * 0.01);
  near(r.deduction, 0);
});

test("VIC: regional employer rate 1.2125%", () => {
  const r = calculatePayrollTax({ state: "vic", stateWages: 2_000_000, regional: true });
  near(r.total, 1_000_000 * VIC_PAYROLL_TAX.regionalRate);
});

// ---------------------------------------------------------------- QLD
test("QLD: mental health levy — published QRO examples", () => {
  // Company A: QLD-only, $112m → primary $255,000 + additional $60,000 = $315,000
  near(calculatePayrollTax({ state: "qld", stateWages: 112_000_000 }).surcharge, 315_000);
  // Company C: $4m QLD of $16m → adjusted threshold $2.5m → $3,750
  near(calculatePayrollTax({ state: "qld", stateWages: 4_000_000, australianWages: 16_000_000 }).surcharge, 3_750);
  // Group: $27m QLD of $36m → adjusted threshold $7.5m → $48,750
  near(calculatePayrollTax({ state: "qld", stateWages: 27_000_000, australianWages: 36_000_000 }).surcharge, 48_750);
});

test("QLD: deduction falls $1 per $7 above $1.3m and is nil at $10.4m", () => {
  near(calculatePayrollTax({ state: "qld", stateWages: 1_300_000 }).total, 0);
  near(calculatePayrollTax({ state: "qld", stateWages: 2_000_000 }).deduction, 1_300_000 - 700_000 / 7);
  near(calculatePayrollTax({ state: "qld", stateWages: 10_400_000 }).deduction, 0);
  near(QLD_PAYROLL_TAX.threshold - (QLD_PAYROLL_TAX.deductionNilAt - QLD_PAYROLL_TAX.threshold) / 7, 0);
});

test("QLD: 4.75% to $6.5m, 4.95% above; regional discount 1 point", () => {
  assert.equal(calculatePayrollTax({ state: "qld", stateWages: 6_500_000 }).rate, 0.0475);
  assert.equal(calculatePayrollTax({ state: "qld", stateWages: 6_500_001 }).rate, 0.0495);
  near(calculatePayrollTax({ state: "qld", stateWages: 3_000_000, regional: true }).rate, 0.0375, 1e-9);
  near(calculatePayrollTax({ state: "qld", stateWages: 7_000_000, regional: true }).rate, 0.0395, 1e-9);
  assert.equal(calculatePayrollTax({ state: "qld", stateWages: 400_000_000, regional: true }).rate, 0.0495);
});

// ---------------------------------------------------------------- WA
test("WA: published local example — $1.2m for the year → deductable $969,231, tax $12,692.30", () => {
  const r = calculatePayrollTax({ state: "wa", stateWages: 1_200_000 });
  near(r.deduction, 969_231, 0.5);
  near(r.total, 12_692.3, 0.05);
});

test("WA: published example — $1,104,000 a year → $6,600", () => {
  near(calculatePayrollTax({ state: "wa", stateWages: 1_104_000 }).total, 6_600, 0.01);
});

test("WA: published interstate example — $1m WA of $4m → deductable $134,616, tax $47,596.12", () => {
  const r = calculatePayrollTax({ state: "wa", stateWages: 1_000_000, australianWages: 4_000_000 });
  near(r.deduction, 134_616, 1);
  near(r.total, 47_596.12, 0.05);
});

test("WA: no deduction at $7.5m, flat 5.5%", () => {
  near(calculatePayrollTax({ state: "wa", stateWages: 7_500_000 }).deduction, 0);
  near(calculatePayrollTax({ state: "wa", stateWages: 8_000_000 }).total, 8_000_000 * WA_PAYROLL_TAX.rate);
});

// ---------------------------------------------------------------- SA
test("SA: RevenueSA example — $1.6m SA-only, deduction $600,000, tax on $1m", () => {
  const r = calculatePayrollTax({ state: "sa", stateWages: 1_600_000 });
  near(r.deduction, 600_000);
  near(r.taxableWages, 1_000_000);
  near(r.rate, 0.02475, 1e-9);
  near(r.total, 24_750);
});

test("SA: RevenueSA deduction example — $700k SA of $2.1m → $200,000", () => {
  near(calculatePayrollTax({ state: "sa", stateWages: 700_000, australianWages: 2_100_000 }).deduction, 200_000);
});

test("SA: variable rate matches the RevenueSA rate table (2 dp, truncated)", () => {
  const table: [number, number][] = [
    [1_500_000, 0],
    [1_525_000, 0.61],
    [1_550_000, 1.23],
    [1_575_000, 1.85],
    [1_600_000, 2.47],
    [1_625_000, 3.09],
    [1_650_000, 3.71],
    [1_675_000, 4.33],
  ];
  for (const [w, pct] of table) {
    assert.equal(Math.floor(saRate(w) * 10000 + 1e-9) / 100, pct, `rate at ${w}`);
  }
  assert.equal(saRate(1_700_001), SA_PAYROLL_TAX.rate);
});

// ---------------------------------------------------------------- TAS
test("TAS: published example 1 — $2.4m Tasmania only → $54,400", () => {
  near(calculatePayrollTax({ state: "tas", stateWages: 2_400_000 }).total, 54_400);
});

test("TAS: published example 2 — $2.4m TAS of $3m Australian → $72,800", () => {
  near(calculatePayrollTax({ state: "tas", stateWages: 2_400_000, australianWages: 3_000_000 }).total, 72_800);
});

test("TAS: published example 3 — group $1.475m TAS of $3m → DGE $516.67 + members $44,225", () => {
  const r = calculatePayrollTax({ state: "tas", stateWages: 1_475_000, australianWages: 3_000_000 });
  near(r.total, 14_750 - 14_233.33 + 44_225, 0.01);
});

test("TAS: 4% band only, between $1.25m and $2m", () => {
  near(calculatePayrollTax({ state: "tas", stateWages: 1_500_000 }).total, 250_000 * TAS_PAYROLL_TAX.lowerRate);
  near(calculatePayrollTax({ state: "tas", stateWages: 2_000_000 }).total, 30_000);
  assert.equal(calculatePayrollTax({ state: "tas", stateWages: 1_250_000 }).total, 0);
});

// ---------------------------------------------------------------- ACT
test("ACT: $1.75m threshold, band rate by Australian wages", () => {
  assert.equal(calculatePayrollTax({ state: "act", stateWages: 1_750_000 }).total, 0);
  near(calculatePayrollTax({ state: "act", stateWages: 2_000_000 }).total, 250_000 * 0.0675);
  assert.equal(actRate(20_000_000), 0.0675);
  assert.equal(actRate(20_000_001), 0.0685);
  assert.equal(actRate(50_000_001), 0.0735);
  assert.equal(actRate(100_000_001), 0.0785);
  assert.equal(actRate(150_000_001), 0.0875);
  // ACT steps 2–3: threshold × ACT/Australian wages, then band rate on the rest.
  const r = calculatePayrollTax({ state: "act", stateWages: 5_000_000, australianWages: 25_000_000 });
  near(r.deduction, 1_750_000 * 0.2);
  near(r.total, (5_000_000 - 350_000) * 0.0685);
  assert.equal(ACT_PAYROLL_TAX.monthlyThreshold, 145_833.33);
});

// ---------------------------------------------------------------- NT
test("NT: published examples from the NT payroll tax guide", () => {
  // Example 1: $2.4m → nil
  assert.equal(calculatePayrollTax({ state: "nt", stateWages: 2_400_000 }).total, 0);
  // Example 2: $2.9m → ADA $2.3m, tax $33,000
  const e2 = calculatePayrollTax({ state: "nt", stateWages: 2_900_000 });
  near(e2.deduction, 2_300_000);
  near(e2.total, 33_000);
  // Example 3: group $4.5m NT-only → ADA $1.5m; total $110,000 + $22,000 + $33,000
  near(calculatePayrollTax({ state: "nt", stateWages: 4_500_000 }).total, 165_000);
  // Example 4: $3.9m NT of $5.7m → ADA $615,789; $125,632 + $22,000 + $33,000
  const e4 = calculatePayrollTax({ state: "nt", stateWages: 3_900_000, australianWages: 5_700_000 });
  near(e4.deduction, 615_789, 0.5);
  near(e4.total, 125_632 + 22_000 + 33_000, 1);
  // Example 5: $2.7m NT of $10.4m → no tax-free amount, $148,500
  near(calculatePayrollTax({ state: "nt", stateWages: 2_700_000, australianWages: 10_400_000 }).total, 148_500);
});

test("NT: 6.5% from $100m Australia-wide wages", () => {
  assert.equal(calculatePayrollTax({ state: "nt", stateWages: 5_000_000, australianWages: 100_000_000 }).rate, 0.065);
  assert.equal(calculatePayrollTax({ state: "nt", stateWages: 5_000_000, australianWages: 99_999_999 }).rate, 0.055);
  assert.equal(NT_PAYROLL_TAX.threshold - (NT_PAYROLL_TAX.nilAt - NT_PAYROLL_TAX.threshold) * NT_PAYROLL_TAX.taper, 0);
});

// ---------------------------------------------------------------- shared
test("engine guards: negatives, Australian < state, zero wages", () => {
  const r = calculatePayrollTax({ state: "nsw", stateWages: -5, australianWages: -1 });
  assert.equal(r.total, 0);
  assert.equal(r.effectiveRate, 0);
  const r2 = calculatePayrollTax({ state: "nsw", stateWages: 2_000_000, australianWages: 1_000_000 });
  assert.equal(r2.australianWages, 2_000_000);
});

test("every state has content and a code guard", () => {
  assert.equal(PAYROLL_TAX_STATE_CODES.length, 8);
  for (const c of PAYROLL_TAX_STATE_CODES) {
    assert.ok(isPayrollTaxStateCode(c));
    assert.equal(PAYROLL_TAX_STATES[c].code, c);
    assert.ok(PAYROLL_TAX_STATES[c].ratesUrl.startsWith("https://"));
  }
  assert.ok(!isPayrollTaxStateCode("xyz"));
});

test("legacy STATE_PAYROLL_TAX (home page, employer cost calculator) agrees with the 2026-27 engine", () => {
  const map: Record<string, { rate: number; threshold: number }> = {
    NSW: { rate: NSW_PAYROLL_TAX.rate, threshold: NSW_PAYROLL_TAX.threshold },
    VIC: { rate: VIC_PAYROLL_TAX.rate, threshold: VIC_PAYROLL_TAX.threshold },
    QLD: { rate: QLD_PAYROLL_TAX.rate, threshold: QLD_PAYROLL_TAX.threshold },
    WA: { rate: WA_PAYROLL_TAX.rate, threshold: WA_PAYROLL_TAX.threshold },
    SA: { rate: SA_PAYROLL_TAX.rate, threshold: SA_PAYROLL_TAX.threshold },
    TAS: { rate: TAS_PAYROLL_TAX.lowerRate, threshold: TAS_PAYROLL_TAX.threshold },
    ACT: { rate: ACT_PAYROLL_TAX.bands[0].rate, threshold: ACT_PAYROLL_TAX.threshold },
    NT: { rate: NT_PAYROLL_TAX.rate, threshold: NT_PAYROLL_TAX.threshold },
  };
  for (const [code, v] of Object.entries(map)) {
    assert.equal(STATE_PAYROLL_TAX[code].rate, v.rate, `${code} rate`);
    assert.equal(STATE_PAYROLL_TAX[code].threshold, v.threshold, `${code} threshold`);
  }
});
