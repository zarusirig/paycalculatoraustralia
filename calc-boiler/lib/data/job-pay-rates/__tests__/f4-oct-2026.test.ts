import assert from "node:assert/strict";
import { test } from "node:test";

import { getOccupation, headlineRow } from "../index";
import { SCHADS_SACS } from "../../../constants/schads-award";
import { MANUFACTURING_AWARD, findAwardRate } from "../../../constants/modern-awards";
import { RETAIL_RATES } from "../../../constants/hospitality-award";

// F4 (5 Oct 2026): awarded occupation pages. Figures were read from the
// consolidated award text on awards.fairwork.gov.au on that date.

const cents = (x: number) => Math.round(x * 100);
const rows = (slug: string) => getOccupation(slug)!.tables.flatMap((t) => t.rows);
const row = (slug: string, label: string) => {
  const r = rows(slug).find((x) => x.label === label);
  assert.ok(r, `${slug} / ${label}`);
  return r;
};

const F4 = ["retail-manager", "youth-worker", "boilermaker", "welder", "forklift-operator", "flight-attendant"] as const;

test("F4: every new occupation is registered, award-backed and has a resolvable headline", () => {
  for (const slug of F4) {
    const occ = getOccupation(slug);
    assert.ok(occ, slug);
    assert.ok(occ.award, `${slug} award`);
    assert.ok(headlineRow(occ), `${slug} headline`);
    assert.equal(occ.verifiedOn, "5 October 2026");
    assert.ok(occ.faqs.length >= 5, `${slug} faqs`);
  }
});

test("F4: retail manager Levels 4 to 8 are the General Retail Award figures, not copies", () => {
  for (const level of ["Level 4", "Level 5", "Level 6", "Level 7", "Level 8"]) {
    const shared = RETAIL_RATES.find((r) => r.level === level)!;
    const r = row("retail-manager", `Retail Employee ${level}`);
    assert.equal(r.weekly, shared.weekly, level);
    assert.equal(r.hourly, shared.hourly, level);
  }
  // Schedule B.1.1 / B.2.1 casual ordinary, read from the award text.
  assert.equal(row("retail-manager", "Retail Employee Level 5").casualHourly, 38.33);
  assert.equal(row("retail-manager", "Retail Employee Level 6").casualHourly, 38.89);
  assert.equal(row("retail-manager", "Retail Employee Level 7").casualHourly, 40.84);
  assert.equal(row("retail-manager", "Retail Employee Level 8").casualHourly, 42.49);
  assert.equal(headlineRow(getOccupation("retail-manager")!)!.label, "Retail Employee Level 6");
});

test("F4: youth worker rates are the SCHADS Schedule B constants for Levels 2 to 4", () => {
  const youth = getOccupation("youth-worker")!;
  const shared = SCHADS_SACS.filter((r) => /^Level [2-4] /.test(r.classification));
  assert.equal(youth.tables[0].rows.length, shared.length);
  for (const r of shared) {
    const got = row("youth-worker", r.classification);
    assert.equal(got.weekly, r.weekly);
    assert.equal(got.hourly, r.hourly);
  }
  assert.equal(row("youth-worker", "Level 2 pay point 2").weekly, 1419.79);
  assert.equal(youth.median, null); // JSA prints N/A for ANZSCO 411716
});

test("F4: boilermaker and welder rates come from the Manufacturing Award constants", () => {
  const c10 = findAwardRate(MANUFACTURING_AWARD, "C10 / V5");
  for (const slug of ["boilermaker", "welder"]) {
    const trade = rows(slug).find((r) => /^C10/.test(r.label))!;
    assert.equal(trade.weekly, c10.weekly);
    assert.equal(trade.hourly, c10.hourly);
    assert.equal(headlineRow(getOccupation(slug)!)!.hourly, 29.45);
    assert.equal(getOccupation(slug)!.median!.medianWeekly, 1_688);
  }
  const welder = getOccupation("welder")!;
  assert.equal(rows("welder").find((r) => /^C13/.test(r.label))!.hourly, 26.44);
  assert.equal(rows("welder").find((r) => /^C12/.test(r.label))!.hourly, 27.08);
  assert.ok(welder.penalties.some((p) => p.casual === "187.5%"), "casual Saturday compounds");
});

test("F4: forklift operator — Storage Services and Wholesale Award cl 15.1 and Schedule B", () => {
  const f = getOccupation("forklift-operator")!;
  assert.equal(f.award!.code, "MA000084");
  const g2 = row("forklift-operator", "Storeworker grade 2");
  assert.deepEqual([g2.weekly, g2.hourly, g2.casualHourly], [1062.8, 27.97, 34.96]);
  assert.deepEqual([row("forklift-operator", "Storeworker grade 3").hourly, row("forklift-operator", "Storeworker grade 4").hourly], [28.77, 29.61]);
  // Saturday 150%, Sunday 200%, public holiday 250% of the minimum hourly rate (Schedule B.1.1).
  assert.equal(cents(g2.hourly * 1.5), 4196);
  assert.equal(cents(g2.hourly * 2), 5594);
  assert.equal(cents(g2.hourly * 2.5), 6993);
  assert.equal(f.median!.medianWeekly, 1_340);
  assert.equal(f.tables.length, 2);
});

test("F4: flight attendant — Aircraft Cabin Crew Award cl 14.2 and Schedule D, no invented median or airline rates", () => {
  const fa = getOccupation("flight-attendant")!;
  assert.equal(fa.award!.code, "MA000047");
  const crew = row("flight-attendant", "Cabin crew member");
  assert.deepEqual([crew.weekly, crew.hourly, crew.casualHourly], [1097.4, 28.88, 36.1]);
  assert.deepEqual(
    [row("flight-attendant", "Cabin crew supervisor").hourly, row("flight-attendant", "Cabin crew manager").hourly],
    [33.69, 39.36],
  );
  // Schedule D.1.1 overtime is 200% of the minimum hourly rate.
  assert.equal(cents(crew.hourly * 2), 5776);
  assert.equal(fa.median, null);
  const text = JSON.stringify(fa);
  assert.match(text, /could not verify/i);
  assert.doesNotMatch(text, /\$\d{2,3},\d{3}[^,]*(Qantas|Virgin)/);
});
