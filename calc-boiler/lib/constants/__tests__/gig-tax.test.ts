import assert from "node:assert/strict";
import { test } from "node:test";

import { GST_REGISTRATION_THRESHOLD, gigTax, gstRegistrationStatus, gstTurnover } from "../gig-tax";

// Rules per the ATO pages cited in gig-tax.ts (read 5 October 2026).

test("rideshare drivers must register for GST from the first dollar", () => {
  const s = gstRegistrationStatus("rideshare", 1_000);
  assert.equal(s.mustRegister, true);
});

test("delivery work: GST registration only at $75,000 GST turnover", () => {
  assert.equal(GST_REGISTRATION_THRESHOLD, 75_000);
  assert.equal(gstRegistrationStatus("delivery", 40_000).mustRegister, false);
  // $82,500 including GST is $75,000 turnover
  assert.equal(gstTurnover(82_500), 75_000);
  assert.equal(gstRegistrationStatus("delivery", 82_500).mustRegister, true);
  assert.equal(gstRegistrationStatus("delivery", 82_499).mustRegister, false);
});

test("unregistered sole trader: profit is payments less expenses, no GST", () => {
  const r = gigTax({ grossPayments: 30_000, expenses: 10_000, expensesIncludeGst: true, gstRegistered: false });
  assert.equal(r.netBusinessIncome, 20_000);
  assert.equal(r.gstPayable, 0);
  // $20,000 is under the $28,011 Medicare low-income threshold and LITO wipes out the 15% band tax
  assert.equal(r.extraIncomeTax, 0);
  assert.equal(r.extraMedicare, 0);
  assert.equal(r.setAside, 0);
  assert.equal(r.inPocketAfterTax, 20_000);
});

test("FY2026-27 resident tax on $60,000 profit: scale + LITO + Medicare", () => {
  const r = gigTax({ grossPayments: 80_000, expenses: 20_000, expensesIncludeGst: false, gstRegistered: false });
  assert.equal(r.netBusinessIncome, 60_000);
  // 4,020 + 30% x 15,000 = 8,520. LITO: 700 - (45,000 - 37,500) x 0.05 = 325, then 325 - 15,000 x 0.015 = 100.
  assert.equal(r.extraIncomeTax, 8_520 - 100);
  assert.equal(r.extraMedicare, 1_200);
  assert.equal(r.setAside, 8_420 + 1_200);
  assert.equal(r.inPocketAfterTax, 80_000 - 20_000 - 9_620);
});

test("GST-registered: GST is taken out of income, credits out of expenses", () => {
  const r = gigTax({ grossPayments: 55_000, expenses: 11_000, expensesIncludeGst: true, gstRegistered: true });
  assert.equal(r.gstCollected, 5_000);
  assert.equal(r.gstCredits, 1_000);
  assert.equal(r.gstPayable, 4_000);
  assert.equal(r.assessableIncome, 50_000);
  assert.equal(r.deductibleExpenses, 10_000);
  assert.equal(r.netBusinessIncome, 40_000);
});

test("cash left = payments - expenses - GST payable - income tax - Medicare", () => {
  const r = gigTax({ grossPayments: 55_000, expenses: 11_000, expensesIncludeGst: true, gstRegistered: true });
  const expected = 55_000 - 11_000 - r.gstPayable - r.extraIncomeTax - r.extraMedicare - r.extraHelp;
  assert.ok(Math.abs(r.inPocketAfterTax - expected) < 0.01);
});

test("other income is taxed at the margin: extra tax is the difference", () => {
  const solo = gigTax({ grossPayments: 20_000, expenses: 0, expensesIncludeGst: false, gstRegistered: false });
  const withJob = gigTax({ grossPayments: 20_000, expenses: 0, expensesIncludeGst: false, gstRegistered: false, otherIncome: 60_000 });
  assert.ok(withJob.extraIncomeTax > solo.extraIncomeTax);
  // 20,000 on top of 60,000 sits in the 30% band entirely (45,001 to 135,000)
  assert.equal(withJob.extraIncomeTax, 6_000 + 100); // 30% x 20,000 plus the LITO that was still left at 60,000
  assert.equal(withJob.extraMedicare, 400);
});

test("a loss produces no extra tax and no negative set-aside", () => {
  const r = gigTax({ grossPayments: 5_000, expenses: 9_000, expensesIncludeGst: false, gstRegistered: false });
  assert.equal(r.netBusinessIncome, -4_000);
  assert.equal(r.extraIncomeTax, 0);
  assert.equal(r.setAside, 0);
});

test("HELP repayment is added when the person has a HELP debt", () => {
  const without = gigTax({ grossPayments: 90_000, expenses: 0, expensesIncludeGst: false, gstRegistered: false });
  const withDebt = gigTax({ grossPayments: 90_000, expenses: 0, expensesIncludeGst: false, gstRegistered: false, hasHelpDebt: true });
  assert.equal(without.extraHelp, 0);
  assert.ok(withDebt.extraHelp > 0);
});
