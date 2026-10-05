import assert from "node:assert/strict";
import { test } from "node:test";

import { payslipFromGross } from "../gross-vs-net";
import { WEEKS_PER_PERIOD, netPay } from "../net-pay";

test("net pay equals the payslip engine on the same gross: $40/h × 38 h, fortnightly", () => {
  const r = netPay({ hourlyRate: 40, hoursPerWeek: 38, frequency: "fortnightly" });
  assert.equal(r.gross, 3_040);
  const slip = payslipFromGross({ gross: 3_040, frequency: "fortnightly" });
  assert.equal(r.net, slip.net);
  assert.equal(r.paygWithheld, slip.paygWithheld);
  assert.equal(r.net, r.gross - r.paygWithheld - r.stslWithheld - r.postTaxDeductions);
});

test("net per hour is below the gross hourly rate", () => {
  const r = netPay({ hourlyRate: 40, hoursPerWeek: 38, frequency: "weekly" });
  assert.ok(r.netPerHour < 40);
  assert.ok(r.netPerHour > 25);
  assert.equal(r.hoursInPeriod, 38);
});

test("monthly pay uses 52/12 weeks", () => {
  assert.equal(WEEKS_PER_PERIOD.monthly, 52 / 12);
  const r = netPay({ hourlyRate: 30, hoursPerWeek: 38, frequency: "monthly" });
  assert.equal(r.gross, Math.round(30 * 38 * (52 / 12) * 100) / 100);
});

test("casual loading adds 25% to the base rate", () => {
  const r = netPay({ hourlyRate: 30, hoursPerWeek: 20, frequency: "weekly", casualLoading: true });
  assert.equal(r.paidHourlyRate, 37.5);
  assert.equal(r.gross, 750);
});

test("a HELP debt lowers net pay", () => {
  const a = netPay({ hourlyRate: 45, hoursPerWeek: 38, frequency: "fortnightly" });
  const b = netPay({ hourlyRate: 45, hoursPerWeek: 38, frequency: "fortnightly", options: { hasSTSL: true } });
  assert.ok(b.stslWithheld > 0);
  assert.ok(b.net < a.net);
});

test("after-tax deductions come off net pay dollar for dollar", () => {
  const a = netPay({ hourlyRate: 35, hoursPerWeek: 38, frequency: "fortnightly" });
  const b = netPay({ hourlyRate: 35, hoursPerWeek: 38, frequency: "fortnightly", postTaxDeductions: 25 });
  assert.equal(Math.round((a.net - b.net) * 100) / 100, 25);
});

test("zero hours gives zero everything without dividing by zero", () => {
  const r = netPay({ hourlyRate: 40, hoursPerWeek: 0, frequency: "weekly" });
  assert.equal(r.net, 0);
  assert.equal(r.netPerHour, 0);
});

test("comparison cycles agree to within withholding rounding", () => {
  const r = netPay({ hourlyRate: 40, hoursPerWeek: 38, frequency: "fortnightly" });
  assert.ok(Math.abs(r.netFortnightly - r.netWeekly * 2) < 5);
});
