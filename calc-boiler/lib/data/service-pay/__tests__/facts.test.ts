import assert from "node:assert/strict";
import { test } from "node:test";

import { SERVICE_OCCUPATIONS, entrySalary, topSalary, verifiedJurisdictions } from "../index";
import { allRows, entryRow, serviceKeyFacts, topRow } from "../facts";
import type { ServicePayJurisdiction } from "../types";

const VERIFIED: ServicePayJurisdiction[] = SERVICE_OCCUPATIONS.flatMap((o) => verifiedJurisdictions(o));
const id = (j: ServicePayJurisdiction) => `${j.occupation}/${j.slug}`;
const labels = (j: ServicePayJurisdiction) => serviceKeyFacts(j).map((f) => f.label);

test("entry and top rows are the rows the headline salaries come from", () => {
  for (const j of VERIFIED) {
    assert.equal(entryRow(j)?.salary, entrySalary(j), `${id(j)} entry row`);
    assert.equal(topRow(j)?.salary, topSalary(j), `${id(j)} top row`);
    if (j.entryStep) assert.equal(entryRow(j)?.label, j.entryStep, `${id(j)} entryStep`);
    if (j.topStep) assert.equal(topRow(j)?.label, j.topStep, `${id(j)} topStep`);
  }
});

test("key facts lead with the state's own instrument, linked to its source", () => {
  for (const j of VERIFIED) {
    const [first] = serviceKeyFacts(j);
    assert.equal(first.label, "Pay instrument", id(j));
    assert.equal(first.value, j.agreementName, id(j));
    assert.equal(first.href, j.agreementUrl, id(j));
  }
});

test("a fact row appears only when the state's data has it", () => {
  for (const j of VERIFIED) {
    const facts = serviceKeyFacts(j);
    const next = facts.find((f) => f.label === "Next scheduled increase");
    assert.equal(Boolean(next), Boolean(j.nextIncrease), `${id(j)} next-increase row`);
    if (next) assert.equal(next.value, j.nextIncrease!.date, id(j));
    const includes = facts.find((f) => f.label === "What the salary includes");
    assert.equal(includes?.value, j.hubNote, `${id(j)} hub-note row`);
    assert.equal(labels(j).includes("Rates in force from"), j.ratesEffectiveFrom.length > 0, `${id(j)} rates row`);
    for (const f of facts) assert.ok(f.value.trim().length > 0, `${id(j)} empty ${f.label}`);
  }
});

test("the classification row spans the published rows and counts them", () => {
  for (const j of VERIFIED) {
    const rows = allRows(j);
    const fact = serviceKeyFacts(j).find((f) => f.label === "Classifications shown");
    assert.ok(fact, `${id(j)} has no classification row`);
    assert.ok(fact.value.startsWith(`${rows[0].label} to ${rows[rows.length - 1].label} (${rows.length} rows`), `${id(j)}: ${fact.value}`);
  }
});

test("states differ in which fact rows they show (no fixed template of rows)", () => {
  const shapes = new Set(VERIFIED.map((j) => labels(j).join("|")));
  assert.ok(shapes.size > 1, "every verified state shows the same fact rows");
});
