import assert from "node:assert/strict";
import { test } from "node:test";

import {
  MW_STATES,
  MW_STATE_SLUGS,
  basesFor,
  fullTimeAdultTakeHome,
  getMwState,
  holidaysInMinimumWageYear,
  minimumWageHeadcountAtThreshold,
  minimumWageTakeHome,
  mwStateDescription,
  mwStateFaqs,
  mwStateH1,
  mwStateTitle,
} from "../index";
import { NMW } from "../../../constants/minimum-wage";
import { PAYROLL_TAX_STATES } from "../../../constants/payroll-tax";

test("eight states, each with its own data", () => {
  assert.equal(MW_STATE_SLUGS.length, 8);
  for (const slug of MW_STATE_SLUGS) {
    const s = getMwState(slug);
    assert.ok(s, slug);
    assert.equal(MW_STATES[slug].slug, slug);
    assert.ok(s.stateWage.length >= 2, `${slug} state wage copy`);
    assert.ok(s.regulators.length >= 1, `${slug} regulators`);
  }
  assert.equal(getMwState("xx"), undefined);
});

test("titles, descriptions and H1s are unique per state and fit search snippets", () => {
  const titles = new Set<string>();
  const descs = new Set<string>();
  const h1s = new Set<string>();
  for (const slug of MW_STATE_SLUGS) {
    const s = MW_STATES[slug];
    titles.add(mwStateTitle(s));
    descs.add(mwStateDescription(s));
    h1s.add(mwStateH1(s));
    assert.ok(mwStateDescription(s).length <= 165, `${slug} description length ${mwStateDescription(s).length}`);
    assert.ok(mwStateTitle(s).length <= 65, `${slug} title length ${mwStateTitle(s).length}`);
    assert.doesNotMatch(mwStateDescription(s), /…$/);
  }
  assert.equal(titles.size, 8);
  assert.equal(descs.size, 8);
  assert.equal(h1s.size, 8);
});

test("full-time adult take-home at the NMW matches the engine and is state-independent", () => {
  const nsw = fullTimeAdultTakeHome("nsw");
  assert.equal(nsw.hourly, NMW.hourly);
  assert.equal(nsw.weeklyGross, NMW.weekly);
  assert.equal(nsw.annualGross, Math.round(NMW.weekly * 52));
  for (const slug of MW_STATE_SLUGS) {
    const t = fullTimeAdultTakeHome(slug);
    assert.equal(t.annualNet, nsw.annualNet, `${slug} net`);
    assert.ok(t.annualNet < t.annualGross);
    assert.equal(t.annualGross - t.incomeTax - t.medicareLevy, t.annualNet);
  }
});

test("casual adds the 25% loading to the published casual rate", () => {
  const casual = minimumWageTakeHome({ basis: "nmw", state: "vic", age: "21 and over", employment: "casual", hoursPerWeek: 20 });
  assert.equal(casual.hourly, NMW.casualHourly);
  assert.equal(casual.lslValuePerYear, 0);
  assert.equal(casual.publicHolidayDayPay, 0);
  assert.equal(casual.weeklyGross, Math.round(NMW.casualHourly * 20 * 100) / 100);
});

test("junior rates reproduce the Fair Work published hourly dollars", () => {
  const hourly = (age: string, employment: "permanent" | "casual") =>
    minimumWageTakeHome({ basis: "nmw", state: "nsw", age, employment, hoursPerWeek: 10 }).hourly;
  assert.equal(hourly("Under 16", "permanent"), 9.73);
  assert.equal(hourly("17", "permanent"), 15.29);
  assert.equal(hourly("19", "permanent"), 21.82);
  assert.equal(hourly("19", "casual"), 27.28);
  assert.equal(hourly("20", "permanent"), 25.84);
});

test("WA and QLD offer their own state minimum; other states offer the national one only", () => {
  assert.deepEqual(basesFor("nsw").map((b) => b.key), ["nmw"]);
  assert.deepEqual(basesFor("wa").map((b) => b.key), ["nmw", "wa-state"]);
  assert.deepEqual(basesFor("qld").map((b) => b.key), ["nmw", "qld-state"]);
  const wa = basesFor("wa")[1];
  assert.equal(wa.weekly, 998.3);
  assert.equal(wa.hourly, 26.27);
  const qld = basesFor("qld")[1];
  assert.equal(qld.weekly, 1004.9);
  assert.equal(qld.adultOnly, true);
});

test("WA state minimum take-home is lower than the NMW take-home, and age is ignored for it", () => {
  const nmw = minimumWageTakeHome({ basis: "nmw", state: "wa", age: "21 and over", employment: "permanent", hoursPerWeek: 38 });
  const wa = minimumWageTakeHome({ basis: "wa-state", state: "wa", age: "17", employment: "permanent", hoursPerWeek: 38 });
  assert.equal(wa.hourly, 26.27);
  assert.ok(wa.annualNet < nmw.annualNet);
});

test("hours are clamped and zero hours give zero pay", () => {
  const zero = minimumWageTakeHome({ basis: "nmw", state: "act", age: "21 and over", employment: "permanent", hoursPerWeek: 0 });
  assert.equal(zero.weeklyGross, 0);
  assert.equal(zero.annualNet, 0);
  const big = minimumWageTakeHome({ basis: "nmw", state: "act", age: "21 and over", employment: "permanent", hoursPerWeek: 500 });
  const eighty = minimumWageTakeHome({ basis: "nmw", state: "act", age: "21 and over", employment: "permanent", hoursPerWeek: 80 });
  assert.equal(big.weeklyGross, eighty.weeklyGross);
});

test("long service leave accrual is state-specific and comes from the LSL dataset", () => {
  const sa = fullTimeAdultTakeHome("sa");
  const nsw = fullTimeAdultTakeHome("nsw");
  assert.equal(sa.lslWeeksPerYear, 1.3);
  assert.ok(nsw.lslWeeksPerYear < 1);
  assert.equal(Math.round(sa.lslValuePerYear * 100), Math.round(1.3 * NMW.weekly * 100));
});

test("public holidays in the 2026-27 minimum wage year are inside the window, sorted and non-empty", () => {
  for (const slug of MW_STATE_SLUGS) {
    const days = holidaysInMinimumWageYear(slug);
    assert.ok(days.length >= 8, `${slug}: ${days.length}`);
    for (const d of days) assert.ok(d.date >= "2026-07-01" && d.date <= "2027-06-30", `${slug} ${d.date}`);
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    assert.deepEqual(days, sorted);
  }
});

test("headcount at the payroll tax threshold is threshold / annual NMW, rounded up", () => {
  assert.equal(minimumWageHeadcountAtThreshold("nsw"), Math.ceil(1_200_000 / NMW.annual));
  assert.equal(minimumWageHeadcountAtThreshold("nt"), Math.ceil(PAYROLL_TAX_STATES.nt.annualThreshold / NMW.annual));
  assert.ok(minimumWageHeadcountAtThreshold("nt") > minimumWageHeadcountAtThreshold("nsw"));
});

test("every state's FAQ set is complete and has no unfilled placeholders", () => {
  for (const slug of MW_STATE_SLUGS) {
    const faqs = mwStateFaqs(MW_STATES[slug]);
    assert.equal(faqs.length, 6);
    for (const f of faqs) {
      assert.ok(f.q.length > 10 && f.a.length > 40);
      assert.doesNotMatch(f.a, /undefined|NaN|\[object/);
    }
  }
});

test("WA and QLD copy carries the verified state figures", () => {
  const wa = MW_STATES.wa.stateWage.join(" ");
  assert.match(wa, /\$998\.30/);
  assert.match(wa, /26\.27/);
  const qld = MW_STATES.qld.stateWage.join(" ");
  assert.match(qld, /\$1004\.90/);
  assert.match(qld, /\[2026\] QIRC 280/);
  const nsw = MW_STATES.nsw.stateWage.join(" ");
  assert.match(nsw, /\[2026\] NSWIRComm 16/);
  assert.match(nsw, /4\.75%/);
});
