import test from "node:test";
import assert from "node:assert/strict";
import {
  LSL_JURISDICTIONS,
  LSL_SOURCES,
  LSL_TAX,
  LSL_WORKED_EXAMPLES,
  JURISDICTION_CODES,
  QLD_CASUAL_EXAMPLES,
  accruedWeeks,
  entitlementOnEnding,
  lslWithholding,
  payableServiceYears,
  payoutValue,
  qldCasualLeaveHours,
  serviceBetween,
  serviceFromParts,
  splitLslComponents,
  takeableWeeks,
  type JurisdictionCode,
} from "../long-service-leave";

// =============================================================================
// The house standard: every jurisdiction's own published worked example is
// reconciled back to the formula. A rate change fails here, not on the page.
// =============================================================================

for (const ex of LSL_WORKED_EXAMPLES) {
  test(`${ex.code.toUpperCase()} published example reconciles: ${ex.label}`, () => {
    const weeks = accruedWeeks(ex.code, ex.service);
    assert.ok(
      Math.abs(weeks - ex.publishedWeeks) <= ex.tolerance,
      `${ex.code}: formula gives ${weeks.toFixed(4)} weeks, ${ex.sourceUrl} publishes ${ex.publishedWeeks} (tolerance ${ex.tolerance})`,
    );
  });
}

test("every worked example carries a primary-source URL on the jurisdiction's own domain", () => {
  for (const ex of LSL_WORKED_EXAMPLES) {
    assert.ok(ex.sourceUrl.startsWith("https://"), `${ex.code} example has no source URL`);
    assert.ok(
      /(nsw|vic|qld|wa|sa|tas|act|nt)\.gov\.au/.test(ex.sourceUrl),
      `${ex.code} example must cite a government source, got ${ex.sourceUrl}`,
    );
  }
});

// ---------- Queensland's separate casual / part-time hours formula ----------

for (const ex of QLD_CASUAL_EXAMPLES) {
  test(`QLD casual formula reconciles: ${ex.label}`, () => {
    const hours = qldCasualLeaveHours(ex.hours);
    assert.ok(
      Math.abs(hours - ex.publishedLeaveHours) < 0.001,
      `got ${hours.toFixed(4)} hours, Business Queensland publishes ${ex.publishedLeaveHours}`,
    );
  });
}

test("QLD's 15,600-hour example converts to 6.8421 weeks at 38 hours", () => {
  // Business Queensland: "260.001 hours may be taken as 6.8421 weeks based on
  // a 38 hour week (full-time equivalent)."
  const weeks = qldCasualLeaveHours(15_600) / 38;
  assert.ok(Math.abs(weeks - 6.8421) < 0.0002, `got ${weeks.toFixed(4)} weeks`);
});

// ---------- Victoria's payout example, end to end ----------

test("Victoria's Lissa example pays $10,450 at $1,100 a week", () => {
  const svc = serviceFromParts(11);
  const weeks = accruedWeeks("vic", svc);
  // Business Victoria rounds 9.5333 to 9.5 before multiplying.
  assert.equal(Math.round(weeks * 10) / 10, 9.5);
  assert.equal(payoutValue(9.5, 1_100), 10_450);
});

// =============================================================================
// The structural differences between the eight Acts
// =============================================================================

test("all eight jurisdictions are present and each names its Act and authority", () => {
  assert.equal(JURISDICTION_CODES.length, 8);
  for (const code of JURISDICTION_CODES) {
    const j = LSL_JURISDICTIONS[code];
    assert.ok(j, `${code} missing`);
    assert.match(j.act, /Act \d{4}/, `${code} must name its Act with a year`);
    assert.ok(j.actUrl.startsWith("https://"), `${code} Act has no URL`);
    assert.ok(j.agencyUrl.startsWith("https://"), `${code} agency has no URL`);
    assert.ok(j.sourceUrl.startsWith("https://"), `${code} figures have no source URL`);
  }
});

test("SA and the NT are the 13-week jurisdictions; the other six are 8.667", () => {
  assert.equal(LSL_JURISDICTIONS.sa.weeksPerYear, 1.3);
  assert.equal(LSL_JURISDICTIONS.nt.weeksPerYear, 1.3);
  assert.equal(accruedWeeks("sa", serviceFromParts(10)), 13);
  assert.equal(accruedWeeks("nt", serviceFromParts(10)), 13);

  for (const code of ["nsw", "vic", "qld", "wa", "tas", "act"] as JurisdictionCode[]) {
    const tenYears = accruedWeeks(code, serviceFromParts(10));
    assert.ok(
      Math.abs(tenYears - 8.667) < 0.001,
      `${code} should accrue about 8.667 weeks in 10 years, got ${tenYears.toFixed(4)}`,
    );
  }
});

test("Victoria and the ACT qualify at 7 years, everyone else at 10", () => {
  assert.equal(LSL_JURISDICTIONS.vic.takeAfterYears, 7);
  assert.equal(LSL_JURISDICTIONS.act.takeAfterYears, 7);
  for (const code of ["nsw", "qld", "wa", "sa", "tas", "nt"] as JurisdictionCode[]) {
    assert.equal(LSL_JURISDICTIONS[code].takeAfterYears, 10, `${code} qualifying period`);
  }
});

test("NSW and the ACT open the pro-rata window at 5 years, everyone else at 7", () => {
  assert.equal(LSL_JURISDICTIONS.nsw.proRataFromYears, 5);
  assert.equal(LSL_JURISDICTIONS.act.proRataFromYears, 5);
  for (const code of ["vic", "qld", "wa", "sa", "tas", "nt"] as JurisdictionCode[]) {
    assert.equal(LSL_JURISDICTIONS[code].proRataFromYears, 7, `${code} pro-rata trigger`);
  }
});

test("SA and the NT drop part years; the ACT drops the days; the rest keep them", () => {
  const svc = serviceFromParts(8, 6, 2, 3);
  assert.equal(payableServiceYears("sa", svc), 8);
  assert.equal(payableServiceYears("nt", svc), 8);
  assert.equal(payableServiceYears("act", svc), 8.5);
  assert.ok(payableServiceYears("nsw", svc) > 8.5, "NSW pays the part year including days");
  assert.ok(payableServiceYears("tas", svc) > 8.5, "Tasmania pays the part year including days");
});

test("SA's completed-year rule is why 8.5 years pays 10.4 weeks, not 11.05", () => {
  assert.equal(accruedWeeks("sa", serviceFromParts(8, 6)), 10.4);
  assert.notEqual(accruedWeeks("sa", serviceFromParts(8, 6)), 8.5 * 1.3);
});

// ---------- Taking leave: milestones vs continuous accrual ----------

test("NSW, WA and Tasmania hand over leave in blocks at 10 years and every 5 after", () => {
  for (const code of ["nsw", "wa", "tas"] as JurisdictionCode[]) {
    assert.equal(takeableWeeks(code, serviceFromParts(9, 11)), 0, `${code} at 9y11m`);
    const at10 = takeableWeeks(code, serviceFromParts(10));
    const at14 = takeableWeeks(code, serviceFromParts(14, 11));
    assert.equal(at10, at14, `${code}: nothing more is takeable between 10 and 15 years`);
    const at15 = takeableWeeks(code, serviceFromParts(15));
    assert.ok(Math.abs(at15 - 13) < 0.01, `${code} at 15 years should be about 13 weeks, got ${at15}`);
    const at20 = takeableWeeks(code, serviceFromParts(20));
    assert.ok(Math.abs(at20 - 17.33) < 0.01, `${code} at 20 years should be about 17.33 weeks, got ${at20}`);
  }
});

test("NSW publishes 8.67 weeks at 10 years and 17.33 at 20", () => {
  assert.equal(takeableWeeks("nsw", serviceFromParts(10)), 8.67);
  assert.equal(Math.round(takeableWeeks("nsw", serviceFromParts(20)) * 100) / 100, 17.33);
});

test("Queensland steps at 10 and 15 then accrues continuously", () => {
  assert.equal(takeableWeeks("qld", serviceFromParts(9, 11)), 0);
  assert.equal(takeableWeeks("qld", serviceFromParts(12)), 8.6667);
  const at15 = takeableWeeks("qld", serviceFromParts(15));
  assert.ok(Math.abs(at15 - 13) < 0.001, `15 years should be 13 weeks, got ${at15}`);
  const at16 = takeableWeeks("qld", serviceFromParts(16));
  assert.ok(at16 > at15, "past 15 years Queensland leave accrues as it is earned");
});

test("Victoria, the ACT, SA and the NT make the accrued balance takeable once qualified", () => {
  for (const code of ["vic", "act"] as JurisdictionCode[]) {
    assert.equal(takeableWeeks(code, serviceFromParts(6, 11)), 0, `${code} before 7 years`);
    assert.equal(takeableWeeks(code, serviceFromParts(9)), accruedWeeks(code, serviceFromParts(9)));
  }
  for (const code of ["sa", "nt"] as JurisdictionCode[]) {
    assert.equal(takeableWeeks(code, serviceFromParts(9, 11)), 0, `${code} before 10 years`);
    assert.ok(Math.abs(takeableWeeks(code, serviceFromParts(12)) - 15.6) < 1e-9, `${code} at 12 years`);
  }
});

test("the ACT reaches 6.0667 weeks at 7 years, which is what its guidance note prints", () => {
  const weeks = takeableWeeks("act", serviceFromParts(7));
  assert.ok(Math.abs(weeks - 6.0667) < 0.0001, `got ${weeks.toFixed(4)}`);
});

// ---------- Pro-rata on ending employment ----------

test("a plain resignation inside the conditional window pays nothing", () => {
  // NSW: 5-10 years is conditional. 7 years, resigning for a better job.
  const nsw = entitlementOnEnding("nsw", serviceFromParts(7), "resignation");
  assert.equal(nsw.payableOnEndingWeeks, 0);
  assert.equal(nsw.payableUnconditionally, false);

  // Queensland: 7-10 years is conditional.
  const qld = entitlementOnEnding("qld", serviceFromParts(8), "resignation");
  assert.equal(qld.payableOnEndingWeeks, 0);
});

test("the same resignation pays in full in Victoria and WA, which have no conditional window", () => {
  const vic = entitlementOnEnding("vic", serviceFromParts(8), "resignation");
  assert.ok(vic.payableOnEndingWeeks > 0);
  assert.equal(vic.payableUnconditionally, true);

  const wa = entitlementOnEnding("wa", serviceFromParts(8), "resignation");
  assert.ok(Math.abs(wa.payableOnEndingWeeks - 8 * 0.8667) < 0.0001);
  assert.equal(wa.payableUnconditionally, true);
});

test("redundancy inside the conditional window does pay", () => {
  const qld = entitlementOnEnding("qld", serviceFromParts(8), "redundancy");
  assert.ok(Math.abs(qld.payableOnEndingWeeks - 8 * 0.86667) < 0.0001);

  const nsw = entitlementOnEnding("nsw", serviceFromParts(6), "redundancy");
  assert.ok(nsw.payableOnEndingWeeks > 0);
});

test("below the pro-rata trigger nothing is payable however the job ends", () => {
  for (const code of JURISDICTION_CODES) {
    const j = LSL_JURISDICTIONS[code];
    const justUnder = serviceFromParts(j.proRataFromYears - 1, 11);
    for (const reason of ["redundancy", "death", "retirement", "resignation"] as const) {
      assert.equal(
        entitlementOnEnding(code, justUnder, reason).payableOnEndingWeeks,
        0,
        `${code} paid something below ${j.proRataFromYears} years`,
      );
    }
  }
});

test("WA and SA withhold pro-rata for serious misconduct; NSW and QLD still pay past 10 years", () => {
  assert.equal(entitlementOnEnding("wa", serviceFromParts(12), "serious-misconduct").payableOnEndingWeeks, 0);
  assert.equal(entitlementOnEnding("sa", serviceFromParts(12), "serious-misconduct").payableOnEndingWeeks, 0);
  assert.ok(entitlementOnEnding("nsw", serviceFromParts(12), "serious-misconduct").payableOnEndingWeeks > 0);
  assert.ok(entitlementOnEnding("qld", serviceFromParts(12), "serious-misconduct").payableOnEndingWeeks > 0);
});

test("Queensland pays the full continuous service at 12 years, which it prints as 10.4 weeks", () => {
  const e = entitlementOnEnding("qld", serviceFromParts(12), "resignation");
  assert.ok(Math.abs(e.payableOnEndingWeeks - 10.4) < 0.0001, `got ${e.payableOnEndingWeeks}`);
  assert.equal(e.payableUnconditionally, true);
});

// ---------- Date arithmetic ----------

test("serviceBetween splits calendar dates into years, months, weeks and days", () => {
  const svc = serviceBetween("2009-11-01", "2015-05-01");
  assert.equal(svc.years, 5);
  assert.equal(svc.months, 6);
  assert.equal(svc.weeks, 0);
  assert.equal(svc.days, 0);
  assert.equal(svc.totalDays, 2_007);
});

test("serviceBetween handles leap-day anniversaries and short-month borrows", () => {
  // A 29 February hire reaches their 10-year anniversary on 28 February in a
  // non-leap year — the clamping convention every payroll system uses.
  const svc = serviceBetween("2016-02-29", "2026-02-28");
  assert.equal(svc.years, 10);
  assert.equal(svc.months, 0);
  assert.equal(svc.days, 0);

  // One day short of that anniversary is not yet 10 years.
  const dayShort = serviceBetween("2016-02-29", "2026-02-27");
  assert.equal(dayShort.years, 9);
  assert.equal(dayShort.months, 11);
  assert.equal(takeableWeeks("nsw", dayShort), 0, "one day short of 10 years takes nothing");
  assert.ok(takeableWeeks("nsw", svc) > 0, "the anniversary itself unlocks the entitlement");
  // 31 January plus one month clamps to 29 February 2020, so 1 March is one
  // month and one day of service — not 30 loose days.
  const later = serviceBetween("2020-01-31", "2020-03-01");
  assert.equal(later.years, 0);
  assert.equal(later.months, 1);
  assert.equal(later.weeks, 0);
  assert.equal(later.days, 1);
});

test("an end date before the start date yields no service, not a negative entitlement", () => {
  const svc = serviceBetween("2026-01-01", "2020-01-01");
  assert.equal(svc.years, 0);
  assert.equal(svc.decimalYears, 0);
  assert.equal(accruedWeeks("nsw", svc), 0);
});

// =============================================================================
// Tax on an unused long service leave payout (ATO, QC19081)
// =============================================================================

test("service that began after 17 August 1993 falls wholly in the marginal-rate component", () => {
  const c = splitLslComponents(20_000, "2010-01-01", "2026-06-30");
  assert.equal(Math.round(c.pre1978), 0);
  assert.equal(Math.round(c.between1978And1993), 0);
  assert.equal(Math.round(c.post1993), 20_000);
});

test("the three components sum back to the payout for pre-1978 service", () => {
  const c = splitLslComponents(80_000, "1977-01-01", "2014-12-31");
  const total = c.pre1978 + c.between1978And1993 + c.post1993;
  assert.ok(Math.abs(total - 80_000) < 0.01);
  assert.ok(c.pre1978 > 0 && c.between1978And1993 > 0 && c.post1993 > 0);
});

test("a genuine redundancy withholds 32% of the whole post-1978 payout", () => {
  // ATO example 7: Robyn, $8,000 unused long service leave, all post-15 Aug
  // 1978 service, made redundant. Withholding = $8,000 x 32% = $2,560.
  const c = splitLslComponents(8_000, "2005-01-01", "2015-01-14");
  const w = lslWithholding(c, "redundancy-invalidity-early-retirement", 0.39);
  assert.equal(Math.round(w.total), 2_560);
  assert.equal(w.flatRateApplied, true);
});

test("resigning or retiring taxes post-1993 accrual at marginal rates, not 32%", () => {
  const c = splitLslComponents(20_000, "2010-01-01", "2026-06-30");
  const w = lslWithholding(c, "other", 0.39);
  assert.ok(Math.abs(w.total - 20_000 * 0.39) < 0.01);
  assert.equal(w.flatRateApplied, false);
  // The same payout on redundancy is withheld at the flat rate instead.
  const redundancy = lslWithholding(c, "redundancy-invalidity-early-retirement", 0.39);
  assert.ok(Math.abs(redundancy.total - 20_000 * 0.32) < 0.01);
});

test("only 5% of a pre-16 August 1978 component is taxed, at marginal rates", () => {
  const c = { pre1978: 10_000, between1978And1993: 0, post1993: 0 };
  const w = lslWithholding(c, "other", 0.39);
  assert.ok(Math.abs(w.total - 10_000 * 0.05 * 0.39) < 0.01);
});

test("the 1978-1993 component is withheld at a flat 32% whatever the reason", () => {
  const c = { pre1978: 0, between1978And1993: 10_000, post1993: 0 };
  assert.ok(Math.abs(lslWithholding(c, "other", 0.45).total - 3_200) < 0.01);
  assert.ok(
    Math.abs(lslWithholding(c, "redundancy-invalidity-early-retirement", 0.45).total - 3_200) < 0.01,
  );
});

test("a post-1993 component under $300 is withheld at 32%", () => {
  const c = { pre1978: 0, between1978And1993: 0, post1993: 250 };
  const w = lslWithholding(c, "other", 0.19);
  assert.equal(w.flatRateApplied, true);
  assert.ok(Math.abs(w.total - 80) < 0.01);
  assert.equal(LSL_TAX.smallPaymentThreshold, 300);
});

test("the ATO cut-over dates and rates are the ones the schedule publishes", () => {
  assert.equal(LSL_TAX.preAug1978Cutover, "16 August 1978");
  assert.equal(LSL_TAX.aug1993Cutover, "17 August 1993");
  assert.equal(LSL_TAX.flatRate, 0.32);
  assert.equal(LSL_TAX.pre1978IncludedProportion, 0.05);
  assert.equal(LSL_TAX.noTfnRate.resident, 0.47);
  assert.equal(LSL_TAX.noTfnRate.foreignResident, 0.45);
  assert.ok(LSL_TAX.atoUrl.startsWith("https://www.ato.gov.au/"));
});

// =============================================================================
// Source hygiene
// =============================================================================

test("every source URL is https and the verification date is recorded", () => {
  assert.equal(LSL_SOURCES.verifiedOn, "28 August 2026");
  for (const [key, value] of Object.entries(LSL_SOURCES)) {
    if (key === "verifiedOn") continue;
    assert.ok(String(value).startsWith("https://"), `${key} is not an https URL`);
  }
});

test("a jurisdiction with no verified cashing-out rule says so rather than guessing", () => {
  for (const code of JURISDICTION_CODES) {
    const j = LSL_JURISDICTIONS[code];
    if (j.cashingOut === null) {
      assert.match(j.cashingOutNote, /does not (state|address)/i, `${code} must explain the gap`);
      assert.match(j.cashingOutNote, /Check with/i, `${code} must point at the authority`);
    } else {
      assert.ok(j.cashingOutNote.length > 20, `${code} needs a cashing-out explanation`);
    }
  }
  // The two we could not verify on 28 August 2026.
  assert.equal(LSL_JURISDICTIONS.sa.cashingOut, null);
  assert.equal(LSL_JURISDICTIONS.act.cashingOut, null);
  // The ones we could.
  assert.equal(LSL_JURISDICTIONS.nsw.cashingOut, "prohibited");
  assert.equal(LSL_JURISDICTIONS.vic.cashingOut, "prohibited");
  assert.equal(LSL_JURISDICTIONS.nt.cashingOut, "prohibited");
  assert.equal(LSL_JURISDICTIONS.qld.cashingOut, "restricted");
  assert.equal(LSL_JURISDICTIONS.wa.cashingOut, "by-agreement");
  assert.equal(LSL_JURISDICTIONS.tas.cashingOut, "by-agreement");
});

test("every jurisdiction with a conditional pro-rata window lists its conditions", () => {
  for (const code of JURISDICTION_CODES) {
    const j = LSL_JURISDICTIONS[code];
    if (j.proRataUnconditionalFromYears > j.proRataFromYears) {
      assert.ok(
        j.proRataConditions.length >= 3,
        `${code} has a conditional window but lists ${j.proRataConditions.length} conditions`,
      );
    } else {
      assert.equal(j.proRataConditions.length, 0, `${code} has no conditional window`);
    }
  }
});

test("payout value is weeks times the ordinary weekly rate", () => {
  assert.ok(Math.abs(payoutValue(8.6667, 1_500) - 13_000.05) < 1e-6);
  assert.equal(payoutValue(0, 1_500), 0);
});
