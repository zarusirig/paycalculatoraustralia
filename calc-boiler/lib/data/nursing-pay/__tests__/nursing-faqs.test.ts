import assert from "node:assert/strict";
import { test } from "node:test";

import { NURSING_PAY_BY_STATE, NURSING_PAY_STATES } from "../index";
import { nursingStateFaqs } from "../faqs";
import type { NursingStateData } from "../types";

const STATES: NursingStateData[] = NURSING_PAY_STATES.map((s) => NURSING_PAY_BY_STATE[s]!);

test("every state page has FAQs, each naming the state, its employer or its instrument", () => {
  for (const state of STATES) {
    const faqs = nursingStateFaqs(state);
    assert.ok(faqs.length >= 3, `${state.slug} has ${faqs.length} FAQs`);
    const ids = [state.name, state.shortName, state.employer.split(" (")[0], ...state.instruments.map((i) => i.name)];
    for (const f of faqs) {
      assert.ok(ids.some((x) => f.q.includes(x) || f.a.includes(x)), `${state.slug} FAQ "${f.q}" is not tied to the state`);
    }
  }
});

test("questions that read the same in every state are not asked per state", () => {
  for (const state of STATES) {
    for (const f of nursingStateFaqs(state)) {
      assert.doesNotMatch(f.q, /Nurses Award 2020|salary packaging/i, `${state.slug}: ${f.q}`);
    }
  }
});

test("a penalty FAQ appears only when the state's penalty clause was transcribed", () => {
  for (const state of STATES) {
    const hasFaq = nursingStateFaqs(state).some((f) => /penalty rates/i.test(f.q));
    assert.equal(hasFaq, state.penalties.length > 0, state.slug);
  }
});

test("only Tasmania, whose data gates its steps, gets a progression FAQ", () => {
  for (const state of STATES) {
    const hasFaq = nursingStateFaqs(state).some((f) => /move up/i.test(f.q));
    assert.equal(hasFaq, state.slug === "tas", state.slug);
  }
});

test("FAQ questions are unique within a page", () => {
  for (const state of STATES) {
    const qs = nursingStateFaqs(state).map((f) => f.q);
    assert.equal(new Set(qs).size, qs.length, state.slug);
  }
});

// ---------- 23 Oct 2026: query-shaped FAQs for QLD, NSW and VIC ----------

const faqsFor = (slug: string) => nursingStateFaqs(NURSING_PAY_BY_STATE[slug as "qld"]!);

test("the QLD RN answer starts at pay point 1, not the re-entry rate", () => {
  const rn = faqsFor("qld").find((f) => /registered nurse earn in Queensland/.test(f.q))!;
  assert.match(rn.a, /Pay point 1 step is paid \$87,790/);
  assert.doesNotMatch(rn.a, /Re-entry/);
});

test("QLD, NSW and VIC answer midwife, next pay rise and grade questions", () => {
  for (const slug of ["qld", "nsw", "vic"]) {
    const qs = faqsFor(slug).map((f) => f.q);
    assert.ok(qs.some((q) => /midwife earn/.test(q)), `${slug}: midwife FAQ`);
    assert.ok(qs.some((q) => /next nurse pay rise/.test(q)), `${slug}: pay rise FAQ`);
    assert.ok(qs.some((q) => /enrolled nurse earn/.test(q)), `${slug}: EN FAQ`);
    assert.ok(qs.some((q) => /unit manager earn/.test(q)), `${slug}: NUM FAQ`);
    assert.ok(faqsFor(slug).length <= 12, `${slug}: keep the FAQ short`);
  }
  const nswRn8 = faqsFor("nsw").find((f) => f.q === "What does an RN year 8 earn in NSW?")!;
  assert.match(nswRn8.a, /\$114,379 a year, the weekly rate x 52 \(\$57\.88 an hour, \$4,399\.20 a fortnight, \$2,199\.60 a week\)/);
  const vicRise = faqsFor("vic").find((f) => /next nurse pay rise/.test(f.q))!;
  assert.match(vicRise.a, /30 November 2026/);
  const qldRise = faqsFor("qld").find((f) => /next nurse pay rise/.test(f.q))!;
  assert.match(qldRise.a, /1 April 2027.*\$89,985 a year/);
  assert.match(qldRise.a, /1 December 2027/);
  const ruson = faqsFor("vic").find((f) => /RUSON/.test(f.q))!;
  assert.match(ruson.a, /\$34\.72 an hour/);
});

test("FAQ copy has no em dashes", () => {
  for (const slug of ["qld", "nsw", "vic"]) {
    for (const f of faqsFor(slug)) {
      assert.doesNotMatch(f.q + f.a, /—/, `${slug}: ${f.q}`);
    }
  }
});
