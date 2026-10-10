import assert from "node:assert/strict";
import { test } from "node:test";

import { payBand, publishedPay, publishedPayNear } from "../tax-on-published-pay";
import { TAX_ON_SALARIES } from "../index";
import { APS } from "../../public-service-pay/aps";
import { ATO_15A, ATO_15B } from "../../health-salary/ato-2023-24";
import { STAFF_SPECIALIST_SCALES } from "../../health-salary/staff-specialists";
import { JUNIOR_BANDS, juniorWeeklyRate } from "../../../constants/junior-rates";
import { APPRENTICE_TRADES } from "../../apprentice-pay/index";

test("bands tile the grid: each page owns the stretch halfway to its neighbours", () => {
  for (let i = 1; i < TAX_ON_SALARIES.length; i++) {
    assert.equal(payBand(TAX_ON_SALARIES[i - 1])!.hi, payBand(TAX_ON_SALARIES[i])!.lo);
  }
  // On the $5,000 part of the grid the band is the same as rounding to the nearest $5,000.
  assert.deepEqual(payBand(100_000), { lo: 97_500, hi: 102_500 });
  assert.deepEqual(payBand(350_000), { lo: 325_000, hi: 375_000 });
  assert.equal(payBand(123_456), null);
});

test("every figure in range lands on exactly one page", () => {
  const first = payBand(TAX_ON_SALARIES[0])!.lo;
  const last = payBand(TAX_ON_SALARIES[TAX_ON_SALARIES.length - 1])!.hi;
  for (const p of publishedPay()) {
    const pages = TAX_ON_SALARIES.filter((s) => publishedPayNear(s).some((x) => x.id === p.id));
    assert.equal(pages.length, p.annual >= first && p.annual < last ? 1 : 0, `${p.id} ${p.annual}`);
  }
});

test("figures are read from the verified source files", () => {
  const aps6 = APS.schedules.find((s) => s.id === "apsc-2025")!.streams[0].bands.find((b) => b.code === "APS 6")!;
  assert.equal(publishedPay().find((p) => p.id === "aps-APS 6")!.annual, aps6.median);
  assert.equal(publishedPay().find((p) => p.id === "ato-msw-Radiologists")!.annual, ATO_15A.radiologist[0].medianSalaryOrWages);
  assert.equal(publishedPay().find((p) => p.id === "ato-ati-Surgeons, all specialties")!.annual, ATO_15B.surgeon[0].averageTaxableIncome);
  const nsw = STAFF_SPECIALIST_SCALES.find((s) => s.state === "NSW")!;
  assert.ok(publishedPay().some((p) => p.annual === nsw.steps[0].annual && p.who.startsWith("NSW")));
  assert.ok(publishedPay().every((p) => p.href.startsWith("/") && p.href.endsWith("/") && p.ref.url.startsWith("https://")));
});

test("the high-salary pages now have published pay to compare against", () => {
  for (const s of [250_000, 300_000, 350_000, 400_000, 500_000]) {
    assert.ok(publishedPayNear(s).length > 0, String(s));
  }
});

test("junior and apprentice minimums are weekly rates × 52 from the source files", () => {
  const age17 = JUNIOR_BANDS.find((b) => b.years === 17)!;
  assert.equal(publishedPay().find((p) => p.id === "junior-17")!.annual, Math.round(juniorWeeklyRate(age17.percentage) * 52));
  assert.ok(!publishedPay().some((p) => p.id === "junior-21"), "the adult rate is not a junior figure");
  const electrical = APPRENTICE_TRADES.find((t) => t.slug === "electrical")!;
  const y1 = Math.round(electrical.junior[0].weekly * 52);
  assert.ok(publishedPay().some((p) => p.id.startsWith("apprentice-") && p.annual === y1 && p.who.includes("electrical")));
  // Low pages now have something to compare against.
  for (const s of [20_000, 25_000, 30_000, 35_000, 40_000, 45_000]) {
    assert.ok(publishedPayNear(s).length > 0, String(s));
  }
});
