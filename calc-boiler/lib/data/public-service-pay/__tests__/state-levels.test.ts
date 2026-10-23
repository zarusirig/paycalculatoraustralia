import { strict as assert } from "node:assert";
import test from "node:test";

import {
  STATE_LEVEL_CONFIG,
  levelSteps,
  stateLevelData,
  stateLevelFaqs,
  stateLevelHref,
  stateLevelMeta,
  stateLevelParams,
  withArticle,
} from "../state-levels";
import {
  LEVEL_DESCRIPTORS,
  LEVEL_FACT_SOURCES,
  ORDINARY_HOURS,
  VPS_GRADE_HEADCOUNT,
  WEEKS_PER_YEAR,
  actCounterpart,
  headcountSentence,
  hourlyRate,
  levelFactFaqs,
  levelFactSources,
  levelHeadcount,
} from "../state-level-facts";

const AI_PHRASES = /states plainly|a real difference|it's worth noting|it is worth noting|delve|in today's|navigate the|crucial|robust|seamless|landscape/i;
const splitSentences = (t: string) => t.split(/(?<=\.)\s+/).filter(Boolean);

test("state levels: 20 pages, VPS 2-7, AO2-AO8, ASO-2 to ASO-8", () => {
  const params = stateLevelParams();
  assert.equal(params.length, 20);
  assert.equal(new Set(params.map((p) => `${p.jurisdiction}/${p.grade}`)).size, 20);
  assert.deepEqual(STATE_LEVEL_CONFIG.vic.levels, ["vps-2", "vps-3", "vps-4", "vps-5", "vps-6", "vps-7"]);
});

test("state levels: every page resolves to verified pay points that match its range", () => {
  for (const { jurisdiction, grade } of stateLevelParams()) {
    const d = stateLevelData(jurisdiction, grade);
    assert.ok(d, `${jurisdiction}/${grade} resolves`);
    assert.ok(d.points.length >= 3, `${grade} has pay points`);
    const values = d.points.map((p) => p.annual);
    assert.equal(Math.min(...values), d.section.range.min);
    assert.equal(Math.max(...values), d.section.range.max);
    assert.deepEqual([...values].sort((a, b) => a - b), values, `${grade} points ascend`);
    assert.ok(d.siblings.some((s) => s.id === grade));
  }
});

test("state levels: figures spot-checked against the instruments", () => {
  assert.equal(stateLevelData("vic", "vps-5")!.section.range.min, 116413);
  assert.equal(stateLevelData("vic", "vps-5")!.section.range.max, 140849);
  assert.equal(stateLevelData("qld", "ao5")!.section.range.min, 109704);
  assert.equal(stateLevelData("sa", "aso-4")!.section.range.max, 86180);
});

test("state levels: unknown or unbuilt levels do not resolve", () => {
  assert.equal(stateLevelData("vic", "vps-1"), undefined);
  assert.equal(stateLevelData("qld", "ao1"), undefined);
  assert.equal(stateLevelData("sa", "sso-1"), undefined);
  assert.equal(stateLevelData("nsw", "clerk-5"), undefined);
  assert.equal(stateLevelHref("vic", "vps-1"), undefined);
  assert.equal(stateLevelHref("qld", "ao3"), "/public-service-pay-scales/qld/ao3/");
});

test("state levels: titles, descriptions and FAQs read correctly", () => {
  assert.equal(withArticle("AO5"), "an AO5");
  assert.equal(withArticle("VPS 5"), "a VPS 5");
  for (const { jurisdiction, grade } of stateLevelParams()) {
    const d = stateLevelData(jurisdiction, grade)!;
    const { title, description } = stateLevelMeta(d);
    assert.ok(title.length <= 60, `${title} is ${title.length} chars`);
    assert.ok(description.length >= 100 && description.length <= 160, `${grade} description is ${description.length} chars`);
    const faqs = stateLevelFaqs(d);
    assert.ok(faqs.length >= 3);
    for (const f of faqs) {
      assert.ok(!/\ba [AEIOU]/.test(f.q), f.q);
      assert.ok(!f.a.includes("NaN") && !f.a.includes("undefined"), f.a);
      assert.ok(!f.a.includes("—"), "no em dashes");
    }
  }
  assert.ok(stateLevelFaqs(stateLevelData("qld", "ao3")!).some((f) => f.q.includes("every Queensland department")));
  // 23 Oct 2026: AO and ASO codes are shared with NT and the ACT, so those titles name the state.
  assert.equal(stateLevelMeta(stateLevelData("qld", "ao7")!).title, "AO7 Salary QLD Government 2026 - Pay Points and After Tax");
  assert.equal(stateLevelMeta(stateLevelData("sa", "aso-6")!).title, "ASO-6 Salary SA Government 2026 - Pay Points and After Tax");
  assert.equal(stateLevelMeta(stateLevelData("vic", "vps-5")!).title, "VPS 5 Salary 2026 - Pay Points and Take-Home Pay");
});

test("state levels: ladder maths", () => {
  const vps4 = levelSteps(stateLevelData("vic", "vps-4")!);
  assert.equal(vps4.moves, 6);
  assert.equal(vps4.spread, 114476 - 100894);
  for (const { jurisdiction, grade } of stateLevelParams()) {
    const l = levelSteps(stateLevelData(jurisdiction, grade)!);
    assert.ok(l.spread > 0 && l.largest.gain > 0 && l.largest.gain <= l.spread, grade);
  }
});

test("state level facts: every built level has a plain-words descriptor from a named source", () => {
  for (const { jurisdiction, grade } of stateLevelParams()) {
    const desc = LEVEL_DESCRIPTORS[grade];
    assert.ok(desc, `${grade} has a descriptor`);
    const n = splitSentences(desc.text).length;
    assert.ok(n >= 2 && n <= 4, `${grade} descriptor is ${n} sentences`);
    const expected = jurisdiction === "vic" ? "vpsAgreement" : jurisdiction === "qld" ? "qldAward" : "saAsoStandards";
    assert.equal(desc.sourceId, expected, grade);
    const d = stateLevelData(jurisdiction, grade)!;
    const cited = levelFactSources(d).map((s) => s.url);
    assert.ok(cited.includes(LEVEL_FACT_SOURCES[desc.sourceId].url), `${grade} cites its descriptor source`);
    assert.ok(cited.includes(LEVEL_FACT_SOURCES[ORDINARY_HOURS[jurisdiction].sourceId].url), `${grade} cites its hours source`);
    for (const text of [desc.text, desc.titles ?? "", desc.valueRanges ?? ""]) {
      assert.ok(!text.includes("—"), `${grade}: no em dashes`);
      assert.ok(!AI_PHRASES.test(text), `${grade}: no AI phrases`);
      for (const s of splitSentences(text)) assert.ok(s.split(" ").length <= 40, `${grade}: long sentence: ${s}`);
    }
  }
  // Job titles only where the instrument names them (VPS agreement Table 4).
  assert.ok(LEVEL_DESCRIPTORS["vps-5"].titles!.includes("Senior Solicitor"));
  assert.equal(LEVEL_DESCRIPTORS.ao5.titles, undefined);
  assert.equal(LEVEL_DESCRIPTORS["aso-5"].titles, undefined);
});

test("state level facts: hourly = annual / (ordinary weekly hours x 52.1429)", () => {
  assert.equal(WEEKS_PER_YEAR, 52.1429);
  assert.equal(ORDINARY_HOURS.vic.weekly, 38);
  assert.equal(ORDINARY_HOURS.qld.weekly, 36.25);
  assert.equal(ORDINARY_HOURS.sa.weekly, 37.5);
  for (const { jurisdiction, grade } of stateLevelParams()) {
    const d = stateLevelData(jurisdiction, grade)!;
    const hours = ORDINARY_HOURS[jurisdiction].weekly;
    for (const p of d.points) assert.equal(hourlyRate(p.annual, hours), p.annual / (hours * 52.1429));
  }
  assert.equal(hourlyRate(116413, 38).toFixed(2), "58.75");
  assert.equal(hourlyRate(81032, 36.25).toFixed(2), "42.87");
  // ASO-4 increment 1 ($82,212): within 3 cents of the Department for Education's
  // published $42.03, which is its fortnightly rate divided by 75 hours.
  assert.ok(Math.abs(hourlyRate(82212, 37.5) - 42.03) < 0.03);
});

test("state level facts: headcount only where published by level (VPSC, June 2025)", () => {
  const total = Object.values(VPS_GRADE_HEADCOUNT.byGrade).reduce((a, b) => a + b, 0);
  assert.equal(total, 42181);
  const vps5 = levelHeadcount("vps-5")!;
  assert.equal(vps5.count, 12768);
  assert.equal(vps5.rank, 1);
  assert.ok(headcountSentence("VPS 5", vps5).includes("the largest grade"));
  assert.equal(levelHeadcount("vps-7")!.count, 1275);
  assert.equal(levelHeadcount("ao5"), undefined);
  assert.equal(levelHeadcount("aso-5"), undefined);
});

test("state level facts: level-specific FAQs from GSC queries", () => {
  const q = (j: string, g: string) => levelFactFaqs(stateLevelData(j, g)!).map((f) => f.q);
  assert.ok(q("vic", "vps-5").includes("What is the difference between VPS 5.1 and 5.2?"));
  assert.ok(q("vic", "vps-7").includes("What is the difference between VPS 7.1, 7.2 and 7.3?"));
  assert.ok(q("vic", "vps-4").includes("What does the 4.1 in VPS 4.1 mean?"));
  assert.ok(q("qld", "ao3").includes("What is the AO3 hourly rate?"));
  assert.ok(q("qld", "ao3").some((x) => x.includes("Queensland Health")));
  assert.ok(!q("qld", "ao5").some((x) => x.includes("Queensland Health")));
  assert.ok(q("qld", "ao5").some((x) => x.includes("PDF")));
  assert.ok(q("sa", "aso-4").includes("Is ASO-4 in South Australia the same as ASO 4 in the ACT?"));
  assert.equal(actCounterpart("aso-7"), undefined, "the ACT has ASO 1 to 6 only");
  assert.equal(actCounterpart("aso-4")!.band.min, 86750);
  for (const { jurisdiction, grade } of stateLevelParams()) {
    const d = stateLevelData(jurisdiction, grade)!;
    const extra = levelFactFaqs(d);
    assert.ok(extra.length >= 1 && extra.length <= 2, `${grade} has ${extra.length} level questions`);
    const all = stateLevelFaqs(d);
    for (const f of extra) {
      assert.ok(all.some((x) => x.q === f.q), "level questions are in the page FAQ");
      assert.ok(!f.q.includes("—") && !f.a.includes("—"), "no em dashes");
      assert.ok(!AI_PHRASES.test(f.a), f.a);
      assert.ok(!f.a.includes("NaN") && !f.a.includes("undefined"), f.a);
    }
    assert.equal(new Set(all.map((f) => f.q)).size, all.length, `${grade} questions are unique`);
  }
});
