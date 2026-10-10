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
