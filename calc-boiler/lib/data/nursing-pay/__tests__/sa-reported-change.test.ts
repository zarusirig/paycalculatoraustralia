// SA nurses: the further 2% from October 2026 as REPORTED by the union, added
// 23 October 2026 at the owner's request. ANMF (SA Branch) "Your EBA and Pay
// Rates" page, read 23 October 2026 with Firecrawl (raw markdown), lists
// "Nursing/Midwifery (South Australian Public Sector) Enterprise Agreement 2022
// - 2% Interim Administrative Increase effective ffpp on or after 1 October
// 2026". SA Health had published no date or table, so nothing official moves.

import assert from "node:assert/strict";
import { test } from "node:test";

import { NURSING_PAY_BY_STATE, annualFor, getNursingPay, registeredNurseRange, reportedChangeSentence } from "../index";

const sa = getNursingPay("sa")!;

test("SA reported change is attributed to the ANMF (SA Branch) and marked not official", () => {
  const r = sa.reportedChange!;
  assert.ok(r, "SA carries a reportedChange");
  assert.equal(r.official, false);
  assert.equal(r.reportedBy, "ANMF (SA Branch)");
  assert.equal(r.source.publisher, "ANMF (SA Branch)");
  assert.equal(r.source.url, "https://www.anmfsa.org.au/Web/membership/Your_EBA_and_Pay_Rates.aspx");
  assert.equal(r.readOn, "23 October 2026");
  assert.match(r.quote, /2% Interim Administrative Increase effective ffpp on or after 1 October 2026$/);
  assert.match(r.quote, /^Nursing\/Midwifery \(South Australian Public Sector\) Enterprise Agreement 2022 - /);
});

test("the page sentence names the union, states SA Health's position and prints no figure", () => {
  const sentence = reportedChangeSentence(sa)!;
  assert.equal(
    sentence,
    "The nurses' union, ANMF (SA Branch), reports that the further 2% applies from the first full pay period on or after 1 October 2026. SA Health has not published new tables, so the figures on this page stay on the last official column.",
  );
  assert.doesNotMatch(sentence, /\$/);
  assert.doesNotMatch(sentence, /—/, "no em dash in reader copy");
  assert.doesNotMatch(sa.reportedChange!.quote, /—/);
});

test("the union report changes no SA figure and keeps the 'at least 4%' hedge", () => {
  // Still the 1/1/2025 column of the 2022 agreement, the range SA Health quotes.
  const rn = registeredNurseRange(sa)!;
  assert.equal(rn.entry, 74_831);
  const top = Math.max(...sa.scales.flatMap((s) => s.points.map((p) => annualFor(p) ?? 0)));
  assert.equal(top, 211_200);
  assert.equal(sa.upcoming, undefined, "no upcoming table built from the union report");
  const hedge = sa.highlights.findIndex((h) => h.startsWith("Current pay is at least 4% above the table"));
  assert.equal(hedge, sa.highlights.length - 1, "hedge is the last highlight, so the attributed note sits under it");
  assert.match(sa.instruments[0].note!, /at least 4% above these figures/);
});

test("only SA carries a reported change, and states without one render nothing", () => {
  for (const [slug, state] of Object.entries(NURSING_PAY_BY_STATE)) {
    if (slug === "sa") continue;
    assert.equal(state!.reportedChange, undefined, slug);
    assert.equal(reportedChangeSentence(state!), null, slug);
  }
});
