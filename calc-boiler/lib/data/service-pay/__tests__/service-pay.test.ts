import assert from "node:assert/strict";
import { test } from "node:test";

import {
  SERVICE_OCCUPATIONS,
  SERVICE_PAY,
  SERVICE_STATE_SLUGS,
  entrySalary,
  getServicePay,
  isExactTakeHome,
  isVerified,
  nearestTakeHome,
  occupationSummary,
  serviceJurisdictions,
  takeHomeHref,
  toIsoDate,
  topSalary,
  verifiedJurisdictions,
} from "../index";
import { TAKE_HOME_SALARIES } from "../../salary-pages";
import type { ServicePayJurisdiction } from "../types";
import { SERVICE_PAY_BUILT } from "../built";

const ALL: ServicePayJurisdiction[] = SERVICE_OCCUPATIONS.flatMap((o) => serviceJurisdictions(o));
const VERIFIED = ALL.filter(isVerified);
const id = (j: ServicePayJurisdiction) => `${j.occupation}/${j.slug}`;
// The NSW Industrial Gazette is served over plain http only; every other source must be https.
const isOfficialUrl = (url: string) => /^https:\/\//.test(url) || url.startsWith("http://www.ircgazette.justice.nsw.gov.au/");

test("every occupation registers all eight jurisdictions under the right key", () => {
  for (const occupation of SERVICE_OCCUPATIONS) {
    for (const slug of SERVICE_STATE_SLUGS) {
      const j = SERVICE_PAY[occupation][slug];
      assert.ok(j, `${occupation}/${slug} missing`);
      assert.equal(j.occupation, occupation, `${occupation}/${slug} has occupation ${j.occupation}`);
      assert.equal(j.slug, slug, `${occupation}/${slug} has slug ${j.slug}`);
    }
  }
});

test("getServicePay rejects unknown slugs", () => {
  assert.equal(getServicePay("police", "nz"), undefined);
  assert.equal(getServicePay("police", "nsw")?.slug, "nsw");
});

test("at least one jurisdiction per occupation is verified (the state route cannot export zero pages)", () => {
  for (const occupation of SERVICE_OCCUPATIONS) {
    assert.ok(verifiedJurisdictions(occupation).length > 0, `${occupation} has no verified state`);
  }
});

test("every jurisdiction states when it was checked and points at an official https source", () => {
  for (const j of ALL) {
    assert.ok(toIsoDate(j.verifiedOn), `${id(j)} verifiedOn "${j.verifiedOn}" is not "D Month YYYY"`);
    assert.ok(isOfficialUrl(j.agreementUrl), `${id(j)} agreementUrl ${j.agreementUrl}`);
    assert.ok(j.sources.length > 0, `${id(j)} has no sources`);
    for (const s of j.sources) {
      // The NSW Industrial Gazette is served over plain http only; every other source must be https.
      assert.ok(isOfficialUrl(s.url), `${id(j)} source ${s.title} is not https (${s.url})`);
    }
  }
});

test("unverified jurisdictions publish no figures and say why", () => {
  for (const j of ALL.filter((x) => !isVerified(x))) {
    assert.equal(j.scales.length, 0, `${id(j)} unverified but has scales`);
    assert.equal(j.faqs.length, 0, `${id(j)} unverified but has FAQs`);
    assert.ok(j.unverified.length > 0, `${id(j)} unverified with no explanation`);
  }
});

test("verified jurisdictions carry a dated, well-formed table", () => {
  for (const j of VERIFIED) {
    assert.ok(j.ratesEffectiveFrom.length > 0, `${id(j)} has no ratesEffectiveFrom`);
    const scaleIds = new Set<string>();
    for (const scale of j.scales) {
      assert.match(scale.id, /^[a-z0-9-]+$/, `${id(j)} scale id "${scale.id}" is not anchor-safe`);
      assert.ok(!scaleIds.has(scale.id), `${id(j)} duplicate scale id ${scale.id}`);
      scaleIds.add(scale.id);
      assert.ok(scale.steps.length > 0, `${id(j)} ${scale.id} is empty`);
      const labels = new Set<string>();
      for (const step of scale.steps) {
        assert.ok(!labels.has(step.label), `${id(j)} ${scale.id} duplicate row ${step.label}`);
        labels.add(step.label);
        assert.ok(Number.isInteger(step.salary), `${id(j)} ${step.label} salary ${step.salary} is not whole dollars`);
        // Base salaries for these jobs sit well inside this band; anything
        // outside it is a transcription error (a weekly rate, a missing digit).
        assert.ok(step.salary >= 30_000 && step.salary <= 300_000, `${id(j)} ${step.label} salary ${step.salary} implausible`);
      }
    }
  }
});

test("named entry and top rows exist in the first table, and entry does not exceed top", () => {
  for (const j of VERIFIED) {
    const labels = j.scales[0].steps.map((s) => s.label);
    if (j.entryStep) assert.ok(labels.includes(j.entryStep), `${id(j)} entryStep "${j.entryStep}" not in scales[0]`);
    if (j.topStep) assert.ok(labels.includes(j.topStep), `${id(j)} topStep "${j.topStep}" not in scales[0]`);
    const entry = entrySalary(j)!;
    const top = topSalary(j)!;
    assert.ok(entry <= top, `${id(j)} entry ${entry} > top ${top}`);
  }
});

test("every dollar figure in an FAQ answer appears in that jurisdiction's own data", () => {
  for (const j of VERIFIED) {
    const salaries = new Set(j.scales.flatMap((s) => s.steps.map((st) => st.salary)));
    const prose = [...j.traineePay, ...j.penalties, ...j.notices, j.nextIncrease?.detail ?? "", ...j.scales.flatMap((s) => s.steps.map((st) => st.note ?? ""))].join(" ");
    for (const faq of j.faqs) {
      for (const m of faq.a.matchAll(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/g)) {
        const value = Number(m[1].replace(/,/g, ""));
        const inProse = prose.includes(m[0]) || prose.includes(m[1]);
        assert.ok(salaries.has(value) || inProse, `${id(j)} FAQ "${faq.q}" quotes ${m[0]}, which is not in the tables or notes`);
      }
    }
  }
});

test("take-home links resolve to a page that is actually built", () => {
  const grid = new Set(TAKE_HOME_SALARIES);
  for (const j of VERIFIED) {
    for (const scale of j.scales) {
      for (const step of scale.steps) {
        const n = nearestTakeHome(step.salary);
        assert.ok(grid.has(n), `${id(j)} ${step.label} links to missing /take-home-pay-on/${n}/`);
        assert.equal(takeHomeHref(step.salary), `/take-home-pay-on/${n}/`);
      }
    }
  }
});

test("take-home resolver uses the $1,000 grid", () => {
  assert.equal(nearestTakeHome(85_000), 85_000);
  assert.equal(isExactTakeHome(85_000), true);
  assert.equal(nearestTakeHome(85_420), 85_000);
  assert.equal(nearestTakeHome(85_600), 86_000);
  assert.equal(isExactTakeHome(85_600), false);
  assert.equal(nearestTakeHome(152_000), 150_000);
  assert.throws(() => nearestTakeHome(Number.NaN));
});

test("toIsoDate parses plain-English dates", () => {
  assert.equal(toIsoDate("24 September 2026"), "2026-09-24");
  assert.equal(toIsoDate("1 July 2025"), "2025-07-01");
  assert.equal(toIsoDate("July 2025"), null);
});

test("occupation summary orders its extremes", () => {
  for (const occupation of SERVICE_OCCUPATIONS) {
    const s = occupationSummary(occupation);
    assert.ok(s, `${occupation} summary`);
    assert.ok(s.lowestEntry.entry <= s.highestEntry.entry);
    assert.ok(s.lowestTop.top <= s.highestTop.top);
  }
});

test("the client-side built-page list matches the verified jurisdictions", () => {
  for (const occupation of SERVICE_OCCUPATIONS) {
    assert.deepEqual(
      [...SERVICE_PAY_BUILT[occupation]],
      verifiedJurisdictions(occupation).map((j) => j.slug),
      `update lib/data/service-pay/built.ts for ${occupation}`,
    );
  }
});
