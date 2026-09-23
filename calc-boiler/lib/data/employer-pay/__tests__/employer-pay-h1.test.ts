// H1 (24 Sep 2026) — employer pay round 4. Every formula-derived figure on the
// new employer pages is re-derived here from the instrument's own formula and
// the award rates it references, so a mistyped cent cannot slip in.

import assert from "node:assert/strict";
import { test } from "node:test";

import { getEmployerPay, juniorRates, roundCents } from "../index";

/** Fast Food Industry Award MA000003 hourly rates, cl 15.1 (varied PR799284). */
const FFIA_2025 = { L1: 26.55, L2: 28.12, L3a: 28.55, L3b: 28.9 } as const;
const FFIA_2026 = { L1: 27.81, L2: 29.45, L3a: 29.91, L3b: 30.27 } as const;

type Ffia = typeof FFIA_2026;

/** Half-up to the cent as on paper (toFixed(6) strips float noise like 69.52499…). */
const halfUp = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;

/** Hungry Jack's Schedule B (as varied by AG2026/295): [permanent, casual] per level. */
function hungryJacksScheduleB(a: Ffia | typeof FFIA_2025): [string, number, number][] {
  const teamLead = roundCents(a.L1 + 0.1);
  return [
    ["Crew Member", roundCents(a.L1 * 1.0075), roundCents(a.L1 * 1.2525)],
    ["Crew Member – Team Lead", roundCents(teamLead * 1.0075), roundCents(teamLead * 1.2525)],
    ["Crew Coach", roundCents(a.L2 * 1.0075), roundCents(a.L2 * 1.2525)],
    ["Shift Supervisor", a.L3a, roundCents(a.L3a * 1.25)],
    ["Assistant Manager", roundCents(a.L3b * 1.0075), roundCents(a.L3b * 1.2525)],
    ["Restaurant Manager", roundCents(a.L3b * 1.0075), roundCents(a.L3b * 1.2525)],
  ];
}

test("Hungry Jack's: the Schedule B formula reproduces the printed 2025 column", () => {
  // Schedule B (varied 20 March 2026) prints these 2025 dollars.
  const printed2025: [number, number][] = [
    [26.75, 33.25],
    [26.85, 33.38],
    [28.33, 35.22],
    [28.55, 35.69],
    [29.12, 36.2],
    [29.12, 36.2],
  ];
  assert.deepEqual(
    hungryJacksScheduleB(FFIA_2025).map(([, p, c]) => [p, c]),
    printed2025,
  );
});

test("Hungry Jack's: 2026 rates are the Schedule B formula on the 1 July 2026 award", () => {
  const hj = getEmployerPay("hungry-jacks");
  assert.ok(hj);
  assert.equal(hj.instrument.reference, "AG2025/3915, AE531466");
  assert.deepEqual(
    hj.rates.map((r) => [r.level, r.hourly, r.casualHourly]),
    hungryJacksScheduleB(FFIA_2026),
  );
  assert.ok(hj.casualRateNote?.includes("$35.03"), "cl 15.2 literal reading is disclosed");
  assert.equal(roundCents(hj.rates[0].hourly * 1.25), 35.03);
  // Never below the award (s 206): permanent and casual vs award Level 1.
  assert.ok(hj.rates[0].hourly > FFIA_2026.L1);
  assert.ok(hj.rates[0].casualHourly > roundCents(FFIA_2026.L1 * 1.25));
});

test("Hungry Jack's: junior dollars are cl 22.1 % of the Crew Member rates", () => {
  const hj = getEmployerPay("hungry-jacks");
  assert.ok(hj);
  const expected: Record<string, [number, number]> = {
    "15 and under": [11.21, 13.93],
    "16": [14.01, 17.42],
    "17": [16.81, 20.9],
    "18": [19.61, 24.38],
    "19": [22.42, 27.86],
    "20": [26.62, 33.09],
    "21 and over": [28.02, 34.83],
  };
  for (const row of juniorRates(hj)) {
    assert.equal(row.published, false, "juniors are derived, and labelled so");
    assert.deepEqual([row.hourly, row.casualHourly], expected[row.age], row.age);
  }
  assert.equal(hj.juniorScale.find((b) => b.age === "20")?.percentage, 0.95);
});

test("Hungry Jack's: penalty and FAQ dollars match the Level 1 formula", () => {
  const hj = getEmployerPay("hungry-jacks");
  assert.ok(hj);
  const L1 = FFIA_2026.L1;
  const dollars = (pct: number) => roundCents(L1 * pct).toFixed(2);
  const cells = hj.penalties.flatMap((p) => [p.permanent, p.casual]).join(" ");
  for (const pct of [1.1025, 1.3525, 1.1525, 1.4025, 1.2525, 1.5025, 2.2525, 2.5025]) {
    assert.ok(cells.includes(`$${dollars(pct)}`), `${pct}`);
  }
  const ot = hj.overtime.flatMap((p) => [p.permanent, p.casual]).join(" ");
  for (const pct of [1.5, 1.75, 2, 2.25]) assert.ok(ot.includes(`$${dollars(pct)}`), `OT ${pct}`);
  const faqText = hj.faqs.map((f) => f.a).join(" ");
  for (const v of ["$28.02", "$34.83", "$29.67", "$29.91", "$30.50", "$11.21", "$13.93", "$41.78", "$62.64", "$69.59"]) {
    assert.ok(faqText.includes(v), v);
  }
});

test("Liquorland: Coles agreement Levels 1 and 3, adult rates at any age", () => {
  const liquor = getEmployerPay("liquorland");
  const coles = getEmployerPay("coles");
  assert.ok(liquor && coles);
  assert.equal(liquor.instrument.reference, coles.instrument.reference);
  const colesByLevel = new Map(coles.rates.map((r) => [r.level, r]));
  assert.deepEqual(liquor.rates.map((r) => r.level), ["Level 1", "Level 3"]);
  for (const r of liquor.rates) {
    const c = colesByLevel.get(r.level);
    assert.ok(c);
    assert.equal(r.hourly, c.hourly);
    assert.equal(r.casualHourly, c.casualHourly);
  }
  // Appendix A3 (junior rates) is Coles Supermarkets only.
  assert.equal(liquor.juniorScale.length, 0);
  assert.equal(juniorRates(liquor).length, 0);
  // Legacy 2014 Liquor Agreement rates (A4.3.3(b)) are all overtaken in 2026.
  for (const r of liquor.rates) assert.ok(r.hourly > 27.93);
  const faqText = liquor.faqs.map((f) => f.a).join(" ");
  for (const r of liquor.rates) {
    assert.ok(faqText.includes(`$${r.hourly.toFixed(2)}`), r.level);
    assert.ok(faqText.includes(`$${r.casualHourly.toFixed(2)}`), r.level);
  }
});

test("Costco: printed cl 5.1 column C (24 months) and casual = rate x 1.25", () => {
  const costco = getEmployerPay("costco");
  assert.ok(costco);
  // cl 5.1.1–5.1.3, column "first full pay period 24 months after operation commences".
  const columnC: Record<string, number> = {
    "Service Assistant — first 980 hours": 30.02,
    "Service Assistant — 8th step (after 6,860 hours)": 33.49,
    "Service Clerk — first 980 hours": 31.27,
    "Service Clerk — 8th step (after 6,860 hours)": 34.77,
    "Supervisor (Service Assistant and Service Clerk)": 36.27,
    "Tradesperson — first 980 hours": 36.24,
    "Tradesperson — 8th step (after 6,860 hours)": 39.89,
    "Tradesperson supervisor": 41.39,
  };
  assert.equal(costco.rates.length, Object.keys(columnC).length);
  for (const r of costco.rates) {
    assert.equal(r.hourly, columnC[r.level], r.level);
    assert.equal(r.casualHourly, roundCents(r.hourly * 1.25), r.level);
  }
  // Printed supervisor row = Service Clerk top-out + $1.50 (cl 6.8).
  assert.equal(roundCents(34.77 + 1.5), 36.27);
  assert.equal(costco.juniorScale.length, 0);
  // Column D (next rise) examples in nextIncrease.
  for (const v of ["$30.92", "$32.21", "$37.33", "$37.32"]) assert.ok(costco.nextIncrease?.detail.includes(v), v);
  // Worked penalty dollars for Service Assistant step 1.
  const sa = 30.02;
  const text = [...costco.penaltyNotes, ...costco.faqs.map((f) => f.a)].join(" ");
  for (const pct of [1.25, 1.5, 1.75, 2.75]) {
    assert.ok(text.includes(`$${roundCents(sa * pct).toFixed(2)}`), `${pct}`);
  }
  // Above the Retail Award Level 4 ($29.45) at the entry step.
  assert.ok(costco.rates[0].hourly > 29.45);
});

test("Big W: cl 4.1.1 weekly x (AWR + Boosted Leave) each July, weekly prevails", () => {
  const bigw = getEmployerPay("big-w");
  assert.ok(bigw);
  // cl 4.1.1 weekly rates (July 2023) and cl 4.2.1 increases: AWR + Boosted, added not multiplied.
  const printed2023: Record<string, number> = {
    "Store Team Member Level 1": 944.18,
    "Store Team Member Level 2": 965.89,
    "Store Team Member Level 4": 1013.57,
    "Store Team Member Level 6": 1056.41,
  };
  const rises = [0.0375 + 0.0025, 0.035 + 0.005, 0.0475 + 0.005];
  for (const r of bigw.rates) {
    let weekly = printed2023[r.level];
    assert.ok(weekly, r.level);
    for (const rise of rises) weekly = roundCents(weekly * (1 + rise));
    assert.equal(r.weekly, weekly, r.level);
    assert.equal(r.hourly, roundCents(weekly / 38), r.level);
    assert.equal(r.casualHourly, halfUp(r.hourly * 1.25), r.level);
  }
  // Above the Retail Award equivalents (Levels 1, 2, 4, 6 from 1 July 2026).
  assert.deepEqual(
    bigw.rates.map((r, i) => r.hourly > [27.81, 28.45, 29.45, 31.11][i]),
    [true, true, true, true],
  );
  // Narrower reading disclosed on the page: every rise on the 2023 base.
  const narrowL1 = roundCents(roundCents(944.18 * (1 + 0.04 + 0.04 + 0.0525)) / 38);
  assert.equal(narrowL1, 28.14);
  assert.ok(bigw.notices.join(" ").includes("$28.14"));
  assert.ok(narrowL1 > 27.81, "above Retail Award Level 1 either way");
  // Junior dollars: % of the Level 1 weekly / 38.
  const juniors = Object.fromEntries(juniorRates(bigw).map((j) => [j.age, [j.hourly, j.casualHourly]]));
  assert.deepEqual(juniors["16 and under"], [14.14, 17.68]);
  assert.deepEqual(juniors["17"], [16.97, 21.21]);
  const text = [...bigw.penaltyNotes, ...bigw.faqs.map((f) => f.a)].join(" ");
  for (const pct of [1.25, 1.5, 1.75, 2.25, 2.5]) {
    assert.ok(text.includes(`$${halfUp(28.29 * pct).toFixed(2)}`), `${pct}`);
  }
});

test("Australia Post: Booklet Sept 2026 salaries via A / 313 x 6 / 36.75, casual +22.5%", () => {
  const ap = getEmployerPay("australia-post");
  assert.ok(ap);
  // Rates of Pay Booklet, "4% as at First Full Pay Period September 2026".
  const annual: Record<string, number> = {
    "Trainee Postal Delivery Officer (adult)": 56_075,
    "Postal Delivery Officer — pay point 1": 59_948,
    "Postal Delivery Officer — pay point 3": 64_138,
    "Postal Delivery Officer — pay point 5": 66_906,
    "Senior Postal Delivery Officer Grade 1": 69_302,
    "Trainee Postal Services Officer (adult)": 56_979,
    "Postal Services Officer — pay point 1": 60_903,
    "Postal Services Officer — pay point 5": 73_050,
  };
  // Sept 2025 column x 1.04, rounded to the dollar, gives the Sept 2026 column.
  const sept2025: Record<string, number> = {
    "Trainee Postal Delivery Officer (adult)": 53_918,
    "Postal Services Officer — pay point 5": 70_240,
  };
  for (const [level, a2025] of Object.entries(sept2025)) {
    assert.equal(Math.round(a2025 * 1.04), annual[level], level);
  }
  assert.equal(ap.rates.length, Object.keys(annual).length);
  for (const r of ap.rates) {
    const a = annual[r.level];
    assert.ok(a, r.level);
    assert.ok(r.description.includes(`$${a.toLocaleString("en-AU")}`), r.level);
    assert.equal(r.hourly, halfUp(((a / 313) * 6) / 36.75), r.level);
    assert.equal(r.casualHourly, halfUp(r.hourly * 1.225), r.level);
  }
  assert.equal(ap.casualLoading, 0.225);
  assert.equal(ap.juniorScale.length, 0, "permanent under-21s get adult rates (cl 11.6.1)");
  const text = [...ap.penaltyNotes, ...ap.faqs.map((f) => f.a)].join(" ");
  for (const pct of [1.5, 1.725, 2, 2.225]) {
    assert.ok(text.includes(`$${halfUp(29.25 * pct).toFixed(2)}`), `${pct}`);
  }
});

test("JB Hi-Fi: the same Retail Award figures as IGA, and FAQ dollars match", () => {
  const jb = getEmployerPay("jb-hi-fi");
  const iga = getEmployerPay("iga");
  assert.ok(jb && iga);
  assert.equal(jb.instrument.kind, "modern-award");
  assert.equal(jb.instrument.reference, "MA000004");
  assert.deepEqual(
    jb.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    iga.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
  );
  assert.deepEqual(juniorRates(jb), juniorRates(iga));
  assert.deepEqual(jb.penalties, iga.penalties);
  const text = jb.faqs.map((f) => f.a).join(" ");
  for (const v of ["$27.81", "$34.76", "$13.91", "$17.39", "$16.69", "$20.86", "$41.72", "$62.57", "$48.67", "$69.53"]) {
    assert.ok(text.includes(v), v);
  }
});

test("IGA: Retail Award 1 July 2026 Table 4, derived juniors and penalty dollars", () => {
  const iga = getEmployerPay("iga");
  assert.ok(iga);
  assert.equal(iga.instrument.kind, "modern-award");
  assert.equal(iga.instrument.reference, "MA000004");
  const table4: [number, number][] = [
    [1056.8, 27.81], [1081.0, 28.45], [1097.8, 28.89], [1119.1, 29.45],
    [1165.1, 30.66], [1182.1, 31.11], [1241.4, 32.67], [1291.8, 33.99],
  ];
  assert.deepEqual(iga.rates.map((r) => [r.weekly, r.hourly]), table4);
  for (const r of iga.rates) assert.equal(r.casualHourly, roundCents(r.hourly * 1.25), r.level);
  const juniors = Object.fromEntries(juniorRates(iga).map((j) => [j.age, [j.hourly, j.casualHourly]]));
  assert.deepEqual(juniors["Under 16"], [12.51, 15.64]);
  assert.deepEqual(juniors["16"], [13.91, 17.39]);
  assert.deepEqual(juniors["17"], [16.69, 20.86]);
  for (const j of juniorRates(iga)) assert.equal(j.published, false);
  const L1 = 27.81;
  const text = [...iga.penaltyNotes, ...iga.faqs.map((f) => f.a)].join(" ");
  for (const pct of [1.25, 1.5, 1.75, 2.25, 2.5]) {
    // Half-up on paper: 27.81 x 2.5 = 69.525 → $69.53 (float gives 69.52499…).
    assert.ok(text.includes(`$${halfUp(L1 * pct).toFixed(2)}`), `${pct}`);
  }
  // PR813655 phase-in dollars (weekly x % / 38).
  assert.equal(roundCents((1056.8 * 0.75) / 38), 20.86);
  assert.equal(roundCents((1056.8 * 0.85) / 38), 23.64);
  assert.ok(iga.nextIncrease?.detail.includes("$20.86") && iga.nextIncrease.detail.includes("$23.64"));
});
