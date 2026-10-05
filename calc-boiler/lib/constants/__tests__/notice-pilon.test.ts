import assert from "node:assert/strict";
import { test } from "node:test";

import { NES_NOTICE_BANDS, WHOLE_OF_INCOME_CAP, nesNoticeWeeks, paymentInLieu } from "../notice-pilon";

// NES notice table: Fair Work Ombudsman "Dismissal", content last updated 28
// August 2026. Joan's example (5 years 3 months, age 35) = 4 weeks.

test("NES notice weeks at the band boundaries", () => {
  assert.equal(nesNoticeWeeks(0.5, false), 1);
  assert.equal(nesNoticeWeeks(1, false), 1); // "1 year or less"
  assert.equal(nesNoticeWeeks(1.01, false), 2);
  assert.equal(nesNoticeWeeks(3, false), 2); // "not more than 3 years"
  assert.equal(nesNoticeWeeks(3.01, false), 3);
  assert.equal(nesNoticeWeeks(5, false), 3); // "not more than 5 years"
  assert.equal(nesNoticeWeeks(5.01, false), 4);
  assert.equal(nesNoticeWeeks(20, false), 4);
});

test("FWO example: 5 years 3 months, age 35, is 4 weeks", () => {
  assert.equal(nesNoticeWeeks(5.25, false), 4);
});

test("extra week for over 45 only with at least 2 years' service", () => {
  assert.equal(nesNoticeWeeks(1.5, true), 2); // under 2 years: no extra
  assert.equal(nesNoticeWeeks(2, true), 3); // 2 weeks + 1
  assert.equal(nesNoticeWeeks(6, true), 5);
  assert.equal(nesNoticeWeeks(6, false), 4);
});

test("table has four bands, ascending", () => {
  assert.equal(NES_NOTICE_BANDS.length, 4);
  assert.deepEqual(NES_NOTICE_BANDS.map((b) => b.weeks), [1, 2, 3, 4]);
});

test("PILON is weeks x weekly pay, with super on top at 12% (ATO example: $10,000 x 12% = $1,200)", () => {
  const r = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 2_500 });
  assert.equal(r.noticeWeeks, 4);
  assert.equal(r.gross, 10_000);
  assert.equal(r.superGuarantee, 1_200);
});

test("ETP tax: 32% under preservation age, 17% at or over, within the caps", () => {
  const under = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 2_500, otherTaxableIncome: 90_000 });
  assert.equal(under.concessionalCap, WHOLE_OF_INCOME_CAP - 90_000);
  assert.equal(under.tax, 3_200);
  assert.equal(under.net, 6_800);
  const over = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 2_500, otherTaxableIncome: 90_000, reachedPreservationAge: true });
  assert.equal(over.tax, 1_700);
});

test("the whole-of-income cap pushes the excess to 47%", () => {
  // $170,000 other income leaves $10,000 of cap; $20,000 PILON: $10,000 at 32%, $10,000 at 47%
  const r = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 5_000, otherTaxableIncome: 170_000 });
  assert.equal(r.gross, 20_000);
  assert.equal(r.taxedConcessionally, 10_000);
  assert.equal(r.taxedAtTop, 10_000);
  assert.equal(r.tax, 3_200 + 4_700);
});

test("weeks paid out cannot exceed the notice period; a worked part reduces the payment", () => {
  const r = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 2_000, weeksPaidOut: 10 });
  assert.equal(r.weeksPaidOut, 4);
  const part = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 2_000, weeksPaidOut: 1.5 });
  assert.equal(part.gross, 3_000);
});

test("other income above the cap leaves nothing concessional", () => {
  const r = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 1_000, otherTaxableIncome: 250_000 });
  assert.equal(r.concessionalCap, 0);
  assert.equal(r.tax, 1_880); // $4,000 at 47%
});
