import { strict as assert } from "node:assert";
import test from "node:test";

import {
  AGENCY_SCALES,
  APS_GRADES,
  APS_GRADE_SLUGS,
  agencySpread,
  apsGradeData,
  apsGradeFaqs,
  apsGradeHrefForLabel,
  getApsGrade,
} from "../aps-grades";

test("J6: six APS grade pages with unique slugs", () => {
  assert.deepEqual([...APS_GRADE_SLUGS], ["aps-3", "aps-4", "aps-5", "aps-6", "el1", "el2"]);
  assert.equal(new Set(APS_GRADE_SLUGS).size, APS_GRADE_SLUGS.length);
  assert.equal(getApsGrade("aps-7"), undefined);
});

test("J6: every grade resolves against the APS schedules in aps.ts", () => {
  for (const g of APS_GRADES) {
    const d = apsGradeData(g.slug);
    assert.equal(d.survey.code, g.code);
    assert.equal(d.threshold.code, g.code);
    assert.equal(d.treasury.code, g.code);
    assert.ok(d.survey.median && d.survey.median > d.survey.min && d.survey.median < d.survey.max);
    assert.equal(d.agencies.length, AGENCY_SCALES.length);
  }
});

test("J6: APS 6 figures match the agreements as read", () => {
  const d = apsGradeData("aps-6");
  assert.equal(d.threshold.min, 99_734);
  assert.equal(d.threshold.max, 111_701);
  const ato = d.agencies.find((a) => a.scale.id === "ato")!;
  assert.equal(ato.min, 101_142);
  assert.equal(ato.max, 116_131);
  assert.equal(ato.points.length, 5);
  const defence = d.agencies.find((a) => a.scale.id === "defence")!;
  assert.equal(defence.min, 99_733); // printed $1 under the threshold; flagged on the page
  assert.ok(defence.note?.includes("$99,733"));
  assert.deepEqual(agencySpread(d), { min: 99_733, max: 127_521 });
});

test("J6: agency figures are ordered and sit at or above the APS-wide thresholds (bar the flagged Defence APS 6 base)", () => {
  for (const g of APS_GRADES) {
    const d = apsGradeData(g.slug);
    for (const a of d.agencies) {
      const values = a.points.map((p) => p.annual);
      assert.deepEqual(values, [...values].sort((x, y) => x - y), `${a.scale.id} ${g.code} ascending`);
      const flagged = a.scale.id === "defence" && g.code === "APS 6";
      if (!flagged) assert.ok(a.min >= d.threshold.min, `${a.scale.id} ${g.code} min ${a.min} >= ${d.threshold.min}`);
      assert.ok(a.max >= d.threshold.max, `${a.scale.id} ${g.code} max ${a.max} >= ${d.threshold.max}`);
    }
  }
});

test("J6: /aps/ level sections link to grade pages only where one exists", () => {
  assert.equal(apsGradeHrefForLabel("APS 6"), "/public-service-pay-scales/aps/aps-6/");
  assert.equal(apsGradeHrefForLabel("EL 1"), "/public-service-pay-scales/aps/el1/");
  assert.equal(apsGradeHrefForLabel("APS 1"), undefined);
  assert.equal(apsGradeHrefForLabel("SES Band 1"), undefined);
});

test("J6: grade FAQs quote the data they are built from", () => {
  const d = apsGradeData("el1");
  const faqs = apsGradeFaqs(d);
  assert.ok(faqs.length >= 5);
  assert.ok(faqs[0].a.includes("$121,755"));
  assert.ok(faqs[0].a.includes("$135,701"));
  for (const f of faqs) assert.ok(!f.a.includes("NaN") && !f.a.includes("undefined"));
});
