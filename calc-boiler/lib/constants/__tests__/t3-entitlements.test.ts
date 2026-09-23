// =============================================================================
// T3 workplace entitlement pages — conformance tests.
//
// Anchors (all read 23 September 2026):
//   TOIL        award text at awards.fairwork.gov.au: Retail cl 21.3(b), Fast
//               Food cl 20.7(b), Pharmacy cl 21.5(b) "equivalent to the overtime
//               payment" (2 h at 150% → 3 h); Clerks cl 23.4, Hospitality
//               cl 28.5(d) etc. hour for hour (2 h → 2 h); SCHADS 3 months.
//   Loading     17.5%; Retail cl 28.3 greater-of; Hospitality cl 30.3 flat.
//   TD 2026/4   Tables 1-3 daily totals; Example 2 (Sale, Table 2: meals
//               $172.20 + incidentals $36.30 = $208.50); Example 4 (China,
//               Table 7, cost group 5: $290 + $50 = $340); overtime meal $40.
//   Cents/km    91c 2026-27, 88c 2025-26, 5,000 km; ATO example Johan
//               2,514 km × 0.88 = $2,212 (2025-26).
//   Working     DSS 3.1.11.30 example: $300 pay, $150 free area, 500 credits
//   credit      → deplete 150, 350 left; accrual $48 − income; max 1,000.
//   Withholding ATO worked example fortnightly $989.80 → $40 withheld.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { TOIL_AWARD_RULES, compareToil, toilRuleByCode } from "../time-in-lieu";
import { COMMON_LEAVE_LOADING, LEAVE_LOADING_RULES, leaveLoading } from "../leave-loading";
import {
  CAPITAL_CITIES,
  DOMESTIC_TABLES,
  HIGH_COST_CENTRES,
  OVERSEAS_COST_GROUP,
  OVERTIME_MEAL_REASONABLE,
  PUBLISHED_DAILY_TOTALS,
  dailyReasonableAmount,
  salaryBand,
  tripReasonableAmount,
} from "../travel-allowance";
import {
  CENTS_PER_KM_RATES,
  CPK_KM_CAP,
  CURRENT_CPK_RATE,
  carAllowanceWithholding,
  centsPerKmDeduction,
} from "../cents-per-km";
import {
  WORKING_CREDIT,
  accrueWorkingCredit,
  depleteWorkingCredit,
  fortnightsToMaxBalance,
  projectJobseekerWithCredit,
  workingCreditAccrual,
} from "../working-credit";
import { JOBSEEKER_RATES } from "../centrelink-income-test";
import { grossFromNet, payslipFromGross } from "../gross-vs-net";

// ---------------------------------------------------------------- TOIL ------

test("TOIL: eight awards, two bases, SCHADS is the 3-month outlier", () => {
  assert.equal(TOIL_AWARD_RULES.length, 8);
  const equiv = TOIL_AWARD_RULES.filter((r) => r.basis === "overtime-equivalent").map((r) => r.code).sort();
  assert.deepEqual(equiv, ["MA000003", "MA000004", "MA000012"]);
  for (const r of TOIL_AWARD_RULES) assert.equal(r.windowMonths, r.code === "MA000100" ? 3 : 6, r.code);
  assert.equal(toilRuleByCode("MA000002")?.basis, "hour-for-hour");
});

test("TOIL: the awards' own examples (2 h at 150%)", () => {
  const hourly = 30;
  const equiv = compareToil(hourly, [{ hours: 2, multiplier: 1.5 }], "overtime-equivalent");
  assert.equal(equiv.toilHours, 3);
  assert.equal(equiv.overtimePay, 90);
  assert.equal(equiv.valueGivenUp, 0);
  const h4h = compareToil(hourly, [{ hours: 2, multiplier: 1.5 }], "hour-for-hour");
  assert.equal(h4h.toilHours, 2);
  assert.equal(h4h.toilValueAtOrdinaryRate, 60);
  assert.equal(h4h.valueGivenUp, 30);
  assert.equal(h4h.payoutIfUntaken, 90);
});

test("TOIL: mixed blocks", () => {
  const r = compareToil(25, [{ hours: 2, multiplier: 1.5 }, { hours: 1, multiplier: 2 }], "overtime-equivalent");
  assert.equal(r.overtimeHours, 3);
  assert.equal(r.toilHours, 5);
  assert.equal(r.overtimePay, 125);
});

// --------------------------------------------------------- Leave loading ----

test("leave loading: 17.5%, and every rule cites a clause", () => {
  assert.equal(COMMON_LEAVE_LOADING, 0.175);
  assert.equal(LEAVE_LOADING_RULES.length, 8);
  for (const r of LEAVE_LOADING_RULES) assert.match(r.clause, /^cl \d/);
  assert.equal(LEAVE_LOADING_RULES.find((r) => r.code === "MA000009")?.dayWork, "flat");
  assert.equal(LEAVE_LOADING_RULES.find((r) => r.code === "MA000004")?.dayWork, "greater-of-penalties");
});

test("leave loading: 4 weeks at $30 x 38 h", () => {
  const r = leaveLoading({ hourlyRate: 30, weeklyHours: 38, weeks: 4, method: "flat" });
  assert.equal(r.basePay, 4560);
  assert.equal(r.flatLoading, 798);
  assert.equal(r.totalLeavePay, 5358);
});

test("leave loading: penalties win when they are higher, never both", () => {
  // Saturday + Sunday worker: $250 a week of penalty premium vs 17.5% of $1,140 = $199.50.
  const r = leaveLoading({ hourlyRate: 30, weeklyHours: 38, weeks: 2, method: "greater-of-penalties", weeklyPenaltyPremium: 250 });
  assert.equal(r.flatLoading, 399);
  assert.equal(r.penaltyAlternative, 500);
  assert.equal(r.loadingPaid, 500);
  assert.equal(r.paidAs, "penalty rates");
  const flat = leaveLoading({ hourlyRate: 30, weeklyHours: 38, weeks: 2, method: "flat", weeklyPenaltyPremium: 250 });
  assert.equal(flat.loadingPaid, 399);
});

// ------------------------------------------------------- Travel allowance ---

test("TD 2026/4: bands", () => {
  assert.equal(salaryBand(153_210), 1);
  assert.equal(salaryBand(153_211), 2);
  assert.equal(salaryBand(272_680), 2);
  assert.equal(salaryBand(272_681), 3);
  assert.equal(OVERTIME_MEAL_REASONABLE, 40);
});

test("TD 2026/4: parts add to the published daily totals", () => {
  for (const band of [1, 2, 3] as const) {
    for (const city of CAPITAL_CITIES) {
      const d = dailyReasonableAmount(band === 1 ? 100_000 : band === 2 ? 200_000 : 300_000, { kind: "capital", city });
      assert.equal(d.total, PUBLISHED_DAILY_TOTALS[band][city], `${band} ${city}`);
    }
    const other = PUBLISHED_DAILY_TOTALS[band]["Other country centres"];
    if (other !== null) {
      const d = dailyReasonableAmount(band === 1 ? 100_000 : 200_000, { kind: "other-country" });
      assert.equal(d.total, other, `${band} other`);
    }
  }
});

test("TD 2026/4 Example 2: Sale, Table 2 meals + incidentals = $208.50", () => {
  const d = dailyReasonableAmount(170_000, { kind: "high-cost", centre: "Sale (Vic)" });
  assert.equal(d.mealsTotal, 172.2);
  assert.equal(d.incidentals, 36.3);
  assert.equal(d.mealsTotal + d.incidentals, 208.5);
  assert.equal(d.accommodation, 207);
});

test("TD 2026/4 Example 4: China, Table 7, cost group 5 = $340", () => {
  assert.equal(OVERSEAS_COST_GROUP["China"], 5);
  const d = dailyReasonableAmount(191_000, { kind: "overseas", country: "China" });
  assert.equal(d.total, 340);
  assert.equal(d.accommodation, null);
});

test("TD 2026/4: table sizes, Table 3 country floor, unlisted countries", () => {
  assert.equal(Object.keys(HIGH_COST_CENTRES).length, 117);
  assert.equal(Object.keys(OVERSEAS_COST_GROUP).length, 140);
  assert.equal(HIGH_COST_CENTRES["Yulara (NT)"], 570);
  assert.equal(dailyReasonableAmount(300_000, { kind: "other-country" }).accommodation, 207);
  assert.equal(dailyReasonableAmount(300_000, { kind: "high-cost", centre: "Yulara (NT)" }).accommodation, 570);
  assert.equal(dailyReasonableAmount(300_000, { kind: "high-cost", centre: "Ararat (Vic)" }).accommodation, 207);
  assert.equal(dailyReasonableAmount(100_000, { kind: "overseas", country: "Atlantis" }).total, 185);
  assert.equal(DOMESTIC_TABLES[3].otherCountry, null);
});

test("travel: trip total and the withheld excess", () => {
  const r = tripReasonableAmount({ salary: 90_000, destination: { kind: "capital", city: "Sydney" }, nights: 3, allowancePaid: 1_700 });
  // 3 × 230 + 4 × (145.45 + 25.40)
  assert.equal(r.accommodation, 690);
  assert.equal(r.days, 4);
  assert.equal(r.total, 1_373.4);
  assert.equal(r.excessOverReasonable, Math.round((1_700 - r.total) * 100) / 100);
});

// -------------------------------------------------------------- Cents/km ----

test("cents per km: rates and cap", () => {
  assert.equal(CURRENT_CPK_RATE, 0.91);
  assert.equal(CENTS_PER_KM_RATES["2025-26"], 0.88);
  assert.equal(CPK_KM_CAP, 5_000);
  assert.equal(centsPerKmDeduction(5_000), 4_550);
  assert.equal(centsPerKmDeduction(9_000), 4_550);
  assert.equal(centsPerKmDeduction(2_514, "2025-26"), 2_212.32); // ATO "Johan" rounds down to $2,212
});

test("car allowance withholding: ATO Table 2", () => {
  const atRate = carAllowanceWithholding({ km: 4_000, ratePerKm: 0.91 });
  assert.equal(atRate.subjectToWithholding, 0);
  assert.equal(atRate.notWithheld, 3_640);
  const aboveRate = carAllowanceWithholding({ km: 1_000, ratePerKm: 1.0 });
  assert.equal(aboveRate.fromExcessRate, 90);
  assert.equal(aboveRate.subjectToWithholding, 90);
  const overCap = carAllowanceWithholding({ km: 6_000, ratePerKm: 0.91 });
  assert.equal(overCap.fromExcessKm, 910);
  assert.equal(overCap.notWithheld, 4_550);
  const commute = carAllowanceWithholding({ km: 1_000, ratePerKm: 0.91, deductibleTravel: false });
  assert.equal(commute.subjectToWithholding, 910);
  assert.equal(commute.reporting, "gross payments");
});

// --------------------------------------------------------- Working credit ---

test("working credit: accrual and maximums", () => {
  assert.equal(WORKING_CREDIT.maxBalance, 1_000);
  assert.equal(WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker, 3_500);
  assert.equal(workingCreditAccrual(0), 48);
  assert.equal(workingCreditAccrual(20), 28);
  assert.equal(workingCreditAccrual(48), 0);
  assert.equal(accrueWorkingCredit(0, 0, 100), 1_000);
  assert.equal(accrueWorkingCredit(0, 0, 10), 480);
  assert.equal(fortnightsToMaxBalance(), 21);
  assert.equal(fortnightsToMaxBalance(3_500), 73);
});

test("working credit: DSS 3.1.11.30 worked example", () => {
  const d = depleteWorkingCredit({ balance: 500, employmentIncome: 300 });
  assert.equal(d.depleted, 150);
  assert.equal(d.balanceAfter, 350);
  assert.equal(d.assessableIncome, 150);
  // Only employment income can use credits.
  assert.equal(depleteWorkingCredit({ balance: 500, employmentIncome: 0, otherIncome: 400 }).depleted, 0);
});

test("working credit: JobSeeker keeps paying at the max rate while credits last", () => {
  const rate = JOBSEEKER_RATES["2026-09-20"].maxFortnightly.single;
  const p = projectJobseekerWithCredit(1_000, 600, rate, 4);
  assert.equal(p[0].depleted, 450);
  assert.equal(p[0].paymentWithCredit, rate);
  assert.equal(p[1].depleted, 450);
  assert.equal(p[2].depleted, 100);
  assert.equal(p[2].balanceEnd, 0);
  assert.ok(p[3].paymentWithCredit < rate);
  assert.equal(p[3].paymentWithCredit, p[3].paymentWithoutCredit);
});

// ----------------------------------------------------------- Gross vs net ---

test("gross vs net: ATO fortnightly example ($989.80 → $40 withheld)", () => {
  const s = payslipFromGross({ gross: 989.8, frequency: "fortnightly" });
  assert.equal(s.paygWithheld, 40);
  assert.equal(s.net, 949.8);
  assert.equal(s.employerSuper, 118.78);
});

test("gross vs net: net → gross inverts gross → net", () => {
  for (const target of [800, 1_500, 2_345.67, 4_000]) {
    const g = grossFromNet(target, "fortnightly");
    assert.ok(payslipFromGross({ gross: g, frequency: "fortnightly" }).net >= target, `${target}`);
    assert.ok(payslipFromGross({ gross: g - 0.01, frequency: "fortnightly" }).net < target, `${target} boundary`);
  }
});
