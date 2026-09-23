// J7 (24 Sep 2026) — employer pay round 5. Every formula-derived figure on the
// new employer pages is re-derived here from the instrument's own formula (or
// matched to the instrument's printed table), so a mistyped cent cannot slip in.

import assert from "node:assert/strict";
import { test } from "node:test";

import { annualFor, getEmployerPay, juniorRates, type EmployerPay } from "../index";

/** Half-up to the cent as on paper (toFixed(6) strips float noise like 34.82499…). */
const halfUp = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;
const money = (v: number) => `$${halfUp(v).toFixed(2)}`;
/** "$1,038.39" — thousands separators, as the page prints salaries. */
const aud = (v: number) => `$${halfUp(v).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** General Retail Industry Award MA000004, cl 17.1 Table 4, from 1 July 2026. */
const GRIA_2026_L1 = 27.81;
const GRIA_2025_L1 = 26.55;
/** PR813655 phase-in from 1 Dec 2026: 75% / 85% of the Level 1 weekly rate, / 38. */
const GRIA_DEC_2026_18 = halfUp((1056.8 * 0.75) / 38);
const GRIA_DEC_2026_19 = halfUp((1056.8 * 0.85) / 38);

function pageText(e: EmployerPay): string {
  return [
    ...e.penaltyNotes,
    ...e.notices,
    ...e.faqs.map((f) => f.a),
    e.nextIncrease?.detail ?? "",
    e.casualRateNote ?? "",
    ...e.rates.map((r) => r.description),
  ].join(" ");
}

function get(slug: string): EmployerPay {
  const e = getEmployerPay(slug);
  assert.ok(e, slug);
  return e;
}

test("Target: cl 19.1 — CSA = Retail Award Level 1 + 5c, Team Leader = 112% of CSA", () => {
  const t = get("target");
  assert.equal(t.instrument.reference, "AG2022/5310, AE519106");
  // The same rule reproduces the SDA's July 2025 rate sheet (CSA $26.60, TL $29.79).
  assert.equal(halfUp(GRIA_2025_L1 + 0.05), 26.6);
  assert.equal(halfUp(26.6 * 1.12), 29.79);
  const csa = halfUp(GRIA_2026_L1 + 0.05);
  const tl = halfUp(csa * 1.12);
  assert.deepEqual(
    t.rates.map((r) => [r.level, r.hourly, r.casualHourly]),
    [
      ["Customer Service Assistant", csa, halfUp(csa * 1.25)],
      ["Team Leader", tl, halfUp(tl * 1.25)],
    ],
  );
  assert.deepEqual([csa, tl], [27.86, 31.2]);
  // Juniors: cl 17.1 percentages of the CSA rate, derived and labelled so.
  const juniors = Object.fromEntries(juniorRates(t).map((j) => [j.age, [j.hourly, j.casualHourly, j.published]]));
  assert.deepEqual(juniors["16 and under"], [13.93, 17.41, false]);
  assert.deepEqual(juniors["17"], [16.72, 20.9, false]);
  assert.deepEqual(juniors["18"], [19.5, 24.38, false]);
  assert.deepEqual(juniors["19"], [22.29, 27.86, false]);
  // Dec 2026 award phase-in overtakes Target's 18 and 19 rates (s 206 notice).
  assert.ok(GRIA_DEC_2026_18 > 19.5 && GRIA_DEC_2026_19 > 22.29);
  const text = pageText(t);
  for (const pct of [1.25, 1.5, 1.75, 2.25, 2.5]) assert.ok(text.includes(money(csa * pct)), `${pct}`);
  for (const v of ["$27.86", "$34.83", "$31.20", "$39.00", "$13.93", "$17.41", "$16.72", "$20.90", "$19.50", "$22.29", "$20.86", "$23.64"]) {
    assert.ok(text.includes(v), v);
  }
  assert.equal(money(GRIA_DEC_2026_18), "$20.86");
  assert.equal(money(GRIA_DEC_2026_19), "$23.64");
});

test("Priceline: printed cl 18.1 / Appendix A dollars and the agreement's multipliers", () => {
  const p = get("priceline");
  assert.equal(p.instrument.reference, "AG2026/2365, AE534063");
  const [re, ssa] = p.rates;
  assert.equal(re.hourly, 29.57);
  // cl 19.1: Specialist = 105% of Retail Employee.
  assert.equal(halfUp(re.hourly * 1.05), ssa.hourly);
  // Appendix A printed dollars, re-derived from the printed percentages.
  const printed: [number, number, number][] = [
    // [multiplier, Retail Employee, Specialist]
    [1.25, 36.96, 38.81],
    [1.11, 32.82, 34.47],
    [1.18, 34.89, 36.64],
    [1.415, 41.84, 43.94],
    [2.41, 71.26, 74.83],
    [2.6, 76.88, 80.73],
  ];
  for (const [m, a, b] of printed) {
    assert.equal(halfUp(re.hourly * m), a, `RE ${m}`);
    assert.equal(halfUp(ssa.hourly * m), b, `SSA ${m}`);
  }
  assert.equal(re.casualHourly, 36.96);
  assert.equal(ssa.casualHourly, 38.81);
  // Sunday: 179% is below the dollar floor, so the floor applies.
  assert.equal(halfUp(re.hourly * 1.79), 52.93);
  assert.ok(halfUp(ssa.hourly * 1.79) < 55.72);
  const juniors = Object.fromEntries(juniorRates(p).map((j) => [j.age, [j.hourly, j.casualHourly, j.published]]));
  assert.deepEqual(juniors["16 and younger"], [14.79, 18.49, false]);
  assert.deepEqual(juniors["17"], [17.74, 22.18, false]);
  assert.deepEqual(juniors["18"], [20.7, 25.88, false]);
  assert.deepEqual(juniors["19"], [23.66, 29.58, false]);
  for (const band of p.juniorScale) {
    const j = juniorRates(p).find((r) => r.age === band.age);
    assert.ok(j);
    assert.equal(j.hourly, halfUp(29.57 * band.percentage), band.age);
    assert.equal(j.casualHourly, halfUp(j.hourly * 1.25), band.age);
  }
  // Dec 2026 step in the agreement's own table (cl 26.1), and above the award phase-in.
  assert.equal(halfUp(29.57 * 0.75), 22.18);
  assert.equal(halfUp(29.57 * 0.85), 25.13);
  assert.ok(22.18 > GRIA_DEC_2026_18 && 25.13 > GRIA_DEC_2026_19);
  const text = pageText(p) + p.penalties.map((r) => `${r.permanent} ${r.note ?? ""}`).join(" ");
  for (const v of ["$29.57", "$36.96", "$31.05", "$38.81", "$34.89", "$41.84", "$53.07", "$55.72", "$52.93", "$71.26", "$76.88", "$32.82", "$14.79", "$18.49", "$17.74", "$22.18", "$25.13"]) {
    assert.ok(text.includes(v), v);
  }
});

test("Retail Award employers (Harvey Norman, Spotlight, Anaconda): same figures as IGA", () => {
  const iga = get("iga");
  for (const slug of ["harvey-norman", "spotlight", "anaconda"]) {
    const e = get(slug);
    assert.equal(e.instrument.kind, "modern-award", slug);
    assert.equal(e.instrument.reference, "MA000004", slug);
    assert.deepEqual(
      e.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
      iga.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    );
    assert.deepEqual(juniorRates(e), juniorRates(iga));
    assert.deepEqual(e.penalties, iga.penalties);
    assert.deepEqual(e.overtime, iga.overtime);
    const text = e.faqs.map((f) => f.a).join(" ");
    // L1 $27.81: casual x1.25, Sunday 150% / 175%, public holiday 225% / 250%.
    for (const pct of [1.25, 1.5, 1.75, 2.25, 2.5]) assert.ok(text.includes(money(27.81 * pct)), `${slug} ${pct}`);
    assert.ok(text.includes("$27.81"), slug);
  }
  // Junior FAQ dollars (award % of weekly $1,056.80, / 38; casual + 25%).
  for (const [pct, v] of [[0.45, 12.51], [0.5, 13.91], [0.6, 16.69]] as const) {
    assert.equal(halfUp((1056.8 * pct) / 38), v);
  }
});

test("Fast Food Award employers (Starbucks, GYG, Zambrero): same figures as Subway", () => {
  const subway = get("subway");
  for (const slug of ["starbucks", "guzman-y-gomez", "zambrero"]) {
    const e = get(slug);
    assert.equal(e.instrument.kind, "modern-award", slug);
    assert.equal(e.instrument.reference, "MA000003", slug);
    assert.deepEqual(
      e.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
      subway.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    );
    assert.deepEqual(e.publishedJuniorRates, subway.publishedJuniorRates);
    assert.deepEqual(e.penalties, subway.penalties);
    assert.deepEqual(e.overtime, subway.overtime);
    const text = e.faqs.map((f) => f.a).join(" ");
    for (const v of ["$27.81", "$34.76", "$29.45", "$11.12", "$13.91", "$16.69", "$62.57"]) assert.ok(text.includes(v), `${slug} ${v}`);
    // PR813654 Level 1 phase-in dollars in the next-increase note.
    for (const pct of [0.75, 0.85, 0.95]) {
      assert.ok(e.nextIncrease?.detail.includes(money((1056.8 * pct) / 38)), `${slug} ${pct}`);
    }
  }
  assert.equal(halfUp(27.81 * 1.25), 34.76);
  assert.equal(halfUp(27.81 * 2.25), 62.57);
});

test("Event Cinemas: same cinema award figures as Hoyts, Level 1 dollars quoted", () => {
  const ev = get("event-cinemas");
  const hoyts = get("hoyts");
  assert.equal(ev.instrument.reference, "MA000091");
  assert.deepEqual(
    ev.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    hoyts.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
  );
  assert.deepEqual(ev.publishedJuniorRates, hoyts.publishedJuniorRates);
  assert.deepEqual(ev.penalties, hoyts.penalties);
  assert.equal(ev.juniorBaseLabel, "Cinema Worker Level 4");
  const L1 = ev.rates[0];
  assert.deepEqual([L1.hourly, L1.casualHourly], [28.56, 35.7]);
  const text = pageText(ev);
  for (const v of [money(L1.hourly), money(L1.casualHourly), money(L1.hourly * 2), "$29.25", "$36.56", "$14.31", "$17.50", "$27.04"]) {
    assert.ok(text.includes(v), v);
  }
});

/** Aircraft Cabin Crew Award MA000047 cl 14.2 from 1 July 2026 (PR799327). */
const CABIN_CREW_AWARD_2026 = { weekly: 1097.4, hourly: 28.88 };

test("Qantas: Part G weekly salaries from 1 Jan 2026, single-time hourly = annual / 1,677", () => {
  const q = get("qantas");
  assert.equal(q.instrument.reference, "AG2023/978, AE519994");
  const printedWeekly = [1038.39, 1072.28, 1111.89, 1153.58, 1193.19, 1234.51, 1275.6, 1397.45, 1653.66, 1725.43, 1905.18, 1962.33];
  assert.deepEqual(q.rates.map((r) => r.weekly), printedWeekly);
  assert.equal(q.fullTimeWeeklyHours, 1677 / 52);
  for (const r of q.rates) {
    const w = r.weekly ?? 0;
    assert.equal(r.annualSalary, halfUp(w * 52), r.level);
    assert.equal(r.hourly, halfUp((w * 52) / 1677), r.level);
    assert.ok(r.description.includes(aud(w)) && r.description.includes(aud(w * 52)), r.level);
  }
  assert.equal(annualFor(q, q.rates[0]), 53996.28);
  // Only the entry row has a casual rate: the printed $47.29 (cl 18.2, Part G cl 2.2).
  assert.equal(q.rates[0].casualHourly, 47.29);
  assert.ok(!q.rates[0].noCasual);
  for (const r of q.rates.slice(1)) assert.deepEqual([r.noCasual, r.casualHourly], [true, 0], r.level);
  assert.ok(q.casualRateNote?.includes("$47.29"));
  // Award floor: years 1–4 printed weekly salaries are below the award's full-time weekly rate.
  assert.deepEqual(
    q.rates.filter((r) => (r.weekly ?? 0) < CABIN_CREW_AWARD_2026.weekly).map((r) => r.weekly),
    [1038.39, 1072.28],
  );
  assert.equal(halfUp(CABIN_CREW_AWARD_2026.weekly / 38), CABIN_CREW_AWARD_2026.hourly);
  // Bands: points x $3.03 (flight attendant, from 1 Jan 2026).
  const cells = q.penalties.map((p) => p.permanent).join(" ");
  for (const pts of [1, 5, 6, 7, 9, 18]) assert.ok(cells.includes(`${pts} point${pts > 1 ? "s" : ""} (${money(pts * 3.03)})`), `${pts}`);
  const text = pageText(q);
  for (const v of ["$1,038.39", "$53,996.28", "$1,397.45", "$72,667.40", "$1,653.66", "$1,962.33", "$32.20", "$47.29", "$1,097.40", "$28.88", "$1,072.28"]) {
    assert.ok(text.includes(v), v);
  }
});

test("Virgin Australia: Nov 2025 salaries (award protection 3.5% on CC1/CC2/SC1), Base Hourly Rate = salary / 52 / 36", () => {
  const v = get("virgin-australia");
  assert.equal(v.instrument.reference, "AG2024/723, AE523884");
  assert.equal(v.fullTimeWeeklyHours, 36);
  // Schedule A Part 1: Nov 2024 salaries for the protected levels, printed Nov 2025 for the rest.
  const nov2024 = { CC1: 54344, CC2: 56434, SC1: 58524 };
  const awr2025 = 1.035; // 2025 Annual Wage Review: greater than the printed 3%, under the 4% cap.
  const expected = [
    halfUp(nov2024.CC1 * awr2025),
    halfUp(nov2024.CC2 * awr2025),
    halfUp(nov2024.SC1 * awr2025),
    65664, 69995, 72162, 75142, 84955,
  ];
  assert.deepEqual(v.rates.map((r) => r.annualSalary), expected);
  // The printed Nov 2024 hourly table reproduces with salary / 1,872.
  assert.equal(halfUp(54344 / 1872), 29.03);
  assert.equal(halfUp(56434 / 1872), 30.15);
  for (const r of v.rates) assert.equal(r.hourly, halfUp((r.annualSalary ?? 0) / 52 / 36), r.level);
  assert.deepEqual(v.rates.map((r) => r.hourly), [30.05, 31.2, 32.36, 35.08, 37.39, 38.55, 40.14, 45.38]);
  // Casual: CC rate + 25% only.
  assert.equal(v.rates[0].casualHourly, halfUp(30.05 * 1.25));
  for (const r of v.rates.slice(1)) assert.deepEqual([r.noCasual, r.casualHourly], [true, 0], r.level);
  // Award floor: CC1 weekly below the award's full-time weekly rate; every hourly above.
  assert.equal(halfUp(expected[0] / 52), 1081.65);
  assert.ok(1081.65 < CABIN_CREW_AWARD_2026.weekly && halfUp(expected[1] / 52) > CABIN_CREW_AWARD_2026.weekly);
  for (const r of v.rates) assert.ok(r.hourly > CABIN_CREW_AWARD_2026.hourly);
  assert.equal(halfUp(CABIN_CREW_AWARD_2026.weekly * 52), 57064.8);
  const text = pageText(v);
  for (const v2 of ["$56,246.04", "$1,081.65", "$1,097.40", "$57,064.80", "$30.05", "$37.56", "$45.38", "$60,572.34", "$28.88"]) {
    assert.ok(text.includes(v2), v2);
  }
});

test("Rebel: Super Retail Group Appendix A cl 304 (from 5 July 2026) transcribed exactly", () => {
  const r = get("rebel");
  assert.equal(r.instrument.reference, "AG2024/952, AE524487");
  // [permanent base, casual base] for Levels 1, 2, 3 at 20 years and above.
  assert.deepEqual(
    r.rates.map((x) => [x.hourly, x.casualHourly]),
    [[28.2, 35.25], [28.83, 36.04], [30.39, 37.98]],
  );
  // Above the Retail Award 2026 base rates for the mapped levels (L1, L2, L3).
  const gria = [27.81, 28.45, 28.89];
  r.rates.forEach((x, i) => assert.ok(x.hourly > gria[i], x.level));
  // Printed junior rows = the stated percentage of the adult Level 1 rate.
  for (const j of juniorRates(r)) {
    assert.equal(j.published, true);
    assert.equal(j.hourly, halfUp(28.2 * j.percentage), j.age);
  }
  // Dec 2026 award phase-in overtakes the printed 18 and 19 rates.
  assert.ok(GRIA_DEC_2026_18 > 19.74 && GRIA_DEC_2026_19 > 22.56);
  // Printed Level 1 penalty and overtime dollars appear on the page.
  const cells = [...r.penalties, ...r.overtime].flatMap((p) => [p.permanent, p.casual]).join(" ");
  for (const v of ["$34.40", "$41.45", "$48.50", "$62.60", "$69.65", "$55.55", "$76.69"]) assert.ok(cells.includes(v), v);
  const text = pageText(r);
  for (const v of ["$28.20", "$35.25", "$28.83", "$30.39", "$14.10", "$17.62", "$16.92", "$21.15", "$19.74", "$22.56", "$20.86", "$23.64", "$35.18", "$42.39", "$64.01", "$37.07", "$44.67", "$67.46"]) {
    assert.ok(text.includes(v), v);
  }
});

test("noCasual rows: never the entry level, casual stored as 0, and only with a casual note", () => {
  for (const slug of ["qantas", "virgin-australia", "target", "priceline", "rebel"]) {
    const e = get(slug);
    assert.ok(!e.rates[0].noCasual, slug);
    for (const r of e.rates) if (r.noCasual) assert.equal(r.casualHourly, 0, `${slug} ${r.level}`);
    if (e.rates.some((r) => r.noCasual)) assert.ok(e.casualRateNote, slug);
  }
});
