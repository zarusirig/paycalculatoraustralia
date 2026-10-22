import { strict as assert } from "node:assert";
import test from "node:test";

import {
  STATE_LEVEL_CONFIG,
  stateLevelData,
  stateLevelFaqs,
  stateLevelHref,
  stateLevelMeta,
  stateLevelParams,
  withArticle,
} from "../state-levels";

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
});
