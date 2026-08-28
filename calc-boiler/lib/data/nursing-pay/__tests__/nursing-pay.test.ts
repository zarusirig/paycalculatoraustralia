// Tests for the only arithmetic the nursing-pay pages perform, plus the data
// invariants that keep a wrong figure off a YMYL page.
//
// Run:
//   npx tsc lib/data/nursing-pay/index.ts \
//     lib/data/nursing-pay/__tests__/nursing-pay.test.ts \
//     --outDir .tmp-test-g5 --module commonjs --target es2022 \
//     --moduleResolution node --esModuleInterop --skipLibCheck \
//     && node --test '.tmp-test-g5/**/*.test.js'; rm -rf .tmp-test-g5

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  NURSING_PAY_BY_STATE,
  NURSING_PAY_STATES,
  annualFor,
  annualIsPublished,
  baseRegisteredScale,
  familiesPresent,
  getNursingPay,
  hourlyFor,
  instrumentFor,
  nearestTakeHomeSalary,
  registeredNurseRange,
  takeHomeHref,
  SCALE_FAMILY_ORDER,
  TAKE_HOME_MAX,
  TAKE_HOME_MIN,
  NURSES_AWARD_GENERAL,
  NURSES_AWARD_AGED_CARE,
  NURSES_AWARD,
} from "../index";
import type { NursingStateData } from "../types";

const STATES: NursingStateData[] = NURSING_PAY_STATES.map((slug) => {
  const s = NURSING_PAY_BY_STATE[slug];
  assert.ok(s, `${slug} must be registered`);
  return s;
});

// ---------- registry ----------

test("all six spoke states are registered and self-consistent", () => {
  assert.equal(STATES.length, 6);
  for (const state of STATES) {
    assert.equal(getNursingPay(state.slug), state);
    assert.equal(state.code, state.code.toUpperCase());
    assert.ok(state.scales.length > 0, `${state.slug} has scales`);
    assert.ok(state.instruments.length > 0, `${state.slug} has an instrument`);
  }
});

test("ACT and NT are not built, and asking for them returns undefined", () => {
  assert.equal(getNursingPay("act"), undefined);
  assert.equal(getNursingPay("nt"), undefined);
  assert.equal(getNursingPay("nowhere"), undefined);
});

// ---------- provenance invariants ----------

test("every scale points at an instrument that exists", () => {
  for (const state of STATES) {
    for (const scale of state.scales) {
      assert.ok(
        instrumentFor(state, scale.instrumentId),
        `${state.slug}: ${scale.classification} cites unknown instrument ${scale.instrumentId}`,
      );
    }
    for (const set of state.penalties) {
      assert.ok(
        instrumentFor(state, set.instrumentId),
        `${state.slug}: penalty set cites unknown instrument ${set.instrumentId}`,
      );
    }
  }
});

test("every instrument carries a source URL and an effective date", () => {
  for (const state of STATES) {
    for (const inst of state.instruments) {
      assert.match(inst.source.url, /^https:\/\//, `${state.slug}/${inst.id} source must be https`);
      assert.ok(inst.source.publisher.length > 0);
      assert.ok(inst.effectiveFrom.length > 0);
      assert.ok(inst.tribunal.length > 0);
    }
    assert.match(state.verifiedOn, /^\d{1,2} \w+ \d{4}$/, `${state.slug} verifiedOn must be a readable date`);
  }
});

test("a pay point with no rate in any unit carries a note saying why", () => {
  for (const state of STATES) {
    for (const scale of state.scales) {
      for (const point of scale.points) {
        if (annualFor(point) === null) {
          assert.ok(
            point.note && point.note.length > 0,
            `${state.slug}: ${scale.classification} / ${point.label} has no rate and no explanation`,
          );
        }
      }
    }
  }
});

test("no state publishes an implausible nursing rate", () => {
  for (const state of STATES) {
    for (const scale of state.scales) {
      for (const point of scale.points) {
        const annual = annualFor(point);
        if (annual === null) continue;
        assert.ok(
          annual > 45_000 && annual < 400_000,
          `${state.slug}: ${scale.classification} / ${point.label} = ${annual} is outside any believable range`,
        );
      }
    }
  }
});

// ---------- annualFor ----------

test("annualFor prefers a published annual over any conversion", () => {
  assert.equal(annualFor({ label: "x", annual: 87790, fortnightly: 3365, hourly: 44.2763 }), 87790);
  assert.equal(annualIsPublished({ label: "x", annual: 87790 }), true);
  assert.equal(annualIsPublished({ label: "x", weekly: 1566.7 }), false);
});

test("annualFor falls back to fortnightly x 26, then weekly x 52", () => {
  assert.equal(annualFor({ label: "x", fortnightly: 1000 }), 26_000);
  assert.equal(annualFor({ label: "x", weekly: 1000 }), 52_000);
  assert.equal(annualFor({ label: "x" }), null);
});

test("NSW RN 1st year annualises to weekly x 52", () => {
  const nsw = NURSING_PAY_BY_STATE.nsw!;
  const rn = baseRegisteredScale(nsw)!;
  const first = rn.points[0];
  assert.equal(first.weekly, 1566.7);
  assert.equal(annualFor(first), Math.round(1566.7 * 52));
  assert.equal(annualIsPublished(first), false);
});

// ---------- hourlyFor ----------

test("hourlyFor returns the published hourly rate untouched where there is one", () => {
  const qld = NURSING_PAY_BY_STATE.qld!;
  const rn = baseRegisteredScale(qld)!;
  const pp1 = rn.points.find((p) => p.label === "Pay point 1")!;
  assert.equal(hourlyFor(pp1, qld), 44.2763);
});

test("NSW hourly is weekly divided by 38, the award's own part-time divisor", () => {
  const nsw = NURSING_PAY_BY_STATE.nsw!;
  const rn = baseRegisteredScale(nsw)!;
  assert.equal(hourlyFor(rn.points[0], nsw), Math.round((1566.7 / 38) * 100) / 100);
  assert.equal(hourlyFor(rn.points[0], nsw), 41.23);
});

test("states whose source publishes no hourly rate return null rather than a guess", () => {
  for (const slug of ["wa", "sa", "tas"] as const) {
    const state = NURSING_PAY_BY_STATE[slug]!;
    const rn = baseRegisteredScale(state)!;
    assert.equal(hourlyFor(rn.points[0], state), null, `${slug} must not invent an hourly rate`);
    assert.ok(state.derivation.hourly?.startsWith("not shown"), `${slug} must say why`);
  }
});

// ---------- take-home linking ----------

test("nearestTakeHomeSalary snaps to the published 5k grid and clamps at both ends", () => {
  assert.equal(nearestTakeHomeSalary(87_790), 90_000);
  assert.equal(nearestTakeHomeSalary(82_400), 80_000);
  assert.equal(nearestTakeHomeSalary(82_500), 85_000);
  assert.equal(nearestTakeHomeSalary(10_000), TAKE_HOME_MIN);
  assert.equal(nearestTakeHomeSalary(900_000), TAKE_HOME_MAX);
});

test("every take-home target actually exists on the published grid", () => {
  for (const state of STATES) {
    for (const scale of state.scales) {
      for (const point of scale.points) {
        const annual = annualFor(point);
        if (annual === null) continue;
        const target = nearestTakeHomeSalary(annual);
        assert.equal(target % 5_000, 0);
        assert.ok(target >= TAKE_HOME_MIN && target <= TAKE_HOME_MAX);
      }
    }
  }
});

test("takeHomeHref keeps the site's trailing slash", () => {
  assert.equal(takeHomeHref(87_790), "/take-home-pay-on/90000/");
  assert.match(takeHomeHref(120_000), /\/$/);
});

// ---------- scale lookups ----------

test("registeredNurseRange reports the real low and high of the RN scale", () => {
  const qld = registeredNurseRange(NURSING_PAY_BY_STATE.qld!)!;
  // "Re-entry" is the lowest paid row on the Queensland RN scale, below pay point 1.
  assert.equal(qld.entry, 83_872);
  assert.equal(qld.entryLabel, "Re-entry");
  // Pay point 8 has no rate yet, so pay point 7 is the top.
  assert.equal(qld.top, 112_607);
  assert.equal(qld.topLabel, "Pay point 7");

  const tas = registeredNurseRange(NURSING_PAY_BY_STATE.tas!)!;
  assert.equal(tas.entry, 80_524);
  assert.equal(tas.top, 102_295);
});

test("every state has a registered nurse scale with a priced range", () => {
  for (const state of STATES) {
    const range = registeredNurseRange(state);
    assert.ok(range, `${state.slug} must have a priced registered nurse scale`);
    assert.ok(range.top >= range.entry);
  }
});

test("familiesPresent only lists families the state actually has", () => {
  for (const state of STATES) {
    const families = familiesPresent(state, SCALE_FAMILY_ORDER);
    assert.ok(families.includes("registered"));
    for (const family of families) {
      assert.ok(state.scales.some((s) => s.family === family));
    }
    // Only Victoria runs a separately titled midwifery scale.
    if (state.slug !== "vic") assert.ok(!families.includes("midwife"));
  }
});

// ---------- Nurses Award 2020 ----------

test("the award's published hourly rate equals weekly / 38 to the cent", () => {
  for (const scale of [...NURSES_AWARD_GENERAL, ...NURSES_AWARD_AGED_CARE]) {
    for (const point of scale.points) {
      const derived = Math.round((point.weekly / NURSES_AWARD.standardWeeklyHours) * 100) / 100;
      assert.ok(
        Math.abs(derived - point.hourly) <= 0.01,
        `${scale.classification} / ${point.label}: award prints ${point.hourly}, weekly/38 is ${derived}`,
      );
    }
  }
});

test("the award floor sits below every state's registered nurse entry rate", () => {
  const awardRn1 = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;
  const awardEntryAnnual = awardRn1.points[0].weekly * 52;
  for (const state of STATES) {
    const range = registeredNurseRange(state)!;
    assert.ok(
      range.entry > awardEntryAnnual,
      `${state.slug} entry ${range.entry} should exceed the award floor ${awardEntryAnnual}`,
    );
  }
});

test("aged care award rates are higher than the general award rates at level 1", () => {
  const general = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;
  const agedCare = NURSES_AWARD_AGED_CARE.find((s) => s.classification === "Registered nurse — aged care level 1")!;
  assert.ok(agedCare.points[0].weekly > general.points[0].weekly);
});
