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
  fortnightlyFor,
  keyGradeRows,
  registeredNurseLadder,
  resolveKeyGrade,
  getNursingPay,
  hourlyFor,
  instrumentFor,
  nearestTakeHomeSalary,
  nursingPageH1,
  nursingPageTitle,
  ratesYear,
  registeredNurseRange,
  scaleAnchor,
  scaleSummaries,
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

test("all eight spoke states and territories are registered and self-consistent", () => {
  assert.equal(STATES.length, 8);
  for (const state of STATES) {
    assert.equal(getNursingPay(state.slug), state);
    assert.equal(state.code, state.code.toUpperCase());
    assert.ok(state.scales.length > 0, `${state.slug} has scales`);
    assert.ok(state.instruments.length > 0, `${state.slug} has an instrument`);
  }
});

test("ACT and NT are built (H2), and an unknown slug returns undefined", () => {
  assert.equal(getNursingPay("act")?.code, "ACT");
  assert.equal(getNursingPay("nt")?.code, "NT");
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
  for (const slug of ["wa", "sa", "tas", "act", "nt"] as const) {
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
    // Only Victoria and the ACT print a separately titled midwifery scale.
    if (state.slug !== "vic" && state.slug !== "act") assert.ok(!families.includes("midwife"));
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

// ---------- titles, anchors and the at-a-glance table ----------

test("every state page title leads with the state's nurse pay query and the year", () => {
  for (const state of STATES) {
    const title = nursingPageTitle(state);
    if (state.salaryTitle) {
      // 23 Oct 2026: QLD, NSW and VIC lead with "Nurse Salary <state> <year>"
      // and keep "Pay Rates" in the same title.
      assert.match(title, new RegExp(`^Nurse Salary (${state.shortName}|${state.name}) ${ratesYear(state)}`), title);
      assert.match(title, /Pay Rates/, title);
    } else {
      assert.ok(
        title.startsWith(`${state.shortName} Nurse Pay Rates ${ratesYear(state)}`),
        `${state.slug}: ${title}`,
      );
    }
    assert.ok(title.length <= 65, `${state.slug} title is ${title.length} chars`);
    assert.ok(nursingPageH1(state).includes(ratesYear(state)), `${state.slug} H1 has no year`);
    assert.doesNotMatch(title + nursingPageH1(state), /—/, `${state.slug}: no em dashes in title or H1`);
  }
});

test("salary titles carry the RN starting salary from the scale, not the re-entry rate", () => {
  assert.equal(nursingPageTitle(getNursingPay("qld")!), "Nurse Salary QLD 2026: QLD Health Pay Rates (RN from $87,790)");
  assert.equal(nursingPageTitle(getNursingPay("nsw")!), "Nurse Salary NSW 2026: NSW Health Pay Rates (RN from $81,468)");
  assert.equal(nursingPageTitle(getNursingPay("vic")!), "Nurse Salary Victoria 2026: VIC Nurse Pay Rates (RN from $84,188)");
});

test("registeredNurseLadder skips off-ladder rows; registeredNurseRange does not", () => {
  const qld = getNursingPay("qld")!;
  const ladder = registeredNurseLadder(qld)!;
  assert.equal(ladder.entry, 87_790);
  assert.equal(ladder.entryLabel, "Pay point 1");
  assert.equal(ladder.top, 112_607);
  assert.equal(registeredNurseRange(qld)!.entry, 83_872);
  for (const slug of ["nsw", "vic", "wa", "sa", "tas", "act", "nt"] as const) {
    assert.deepEqual(registeredNurseLadder(getNursingPay(slug)!), registeredNurseRange(getNursingPay(slug)!), slug);
  }
});

test("every answer-box row resolves to a real scale and step", () => {
  for (const state of STATES) {
    for (const grade of state.keyGrades ?? []) {
      assert.ok(resolveKeyGrade(state, grade), `${state.slug}: ${grade.label} does not resolve`);
    }
    assert.equal(keyGradeRows(state).length, (state.keyGrades ?? []).length, state.slug);
  }
  for (const slug of ["qld", "nsw", "vic"] as const) {
    assert.ok((getNursingPay(slug)!.keyGrades ?? []).length >= 5, `${slug} needs an answer box`);
  }
});

test("answer-box figures match the published rates", () => {
  const row = (slug: "qld" | "nsw" | "vic", label: string) => {
    const state = getNursingPay(slug)!;
    return resolveKeyGrade(state, state.keyGrades!.find((g) => g.label === label)!)!;
  };
  assert.equal(row("qld", "Registered nurse or midwife, first pay point").lowAnnual, 87_790);
  assert.equal(row("qld", "Enrolled nurse (Grade 3)").lowAnnual, 75_573);
  assert.equal(row("qld", "Enrolled nurse (Grade 3)").highAnnual, 80_204);
  assert.equal(row("nsw", "RN or midwife, 8th year and thereafter").low.weekly, 2199.6);
  assert.equal(row("nsw", "Nursing unit manager (NUM)").low.weekly, 2759.7);
  assert.equal(row("vic", "RN Grade 2 Year 8").low.hourly, 54.41);
  assert.equal(row("vic", "RUSON or RUSOM (student)").low.weekly, 1319.4);
});

test("fortnightly pay is published or weekly x 2, never cut from an annual salary", () => {
  const qld = baseRegisteredScale(getNursingPay("qld")!)!;
  assert.equal(fortnightlyFor(qld.points.find((p) => p.label === "Pay point 1")!), 3365.0);
  const nsw = baseRegisteredScale(getNursingPay("nsw")!)!;
  assert.equal(fortnightlyFor(nsw.points[0]), 3133.4);
  const sa = baseRegisteredScale(getNursingPay("sa")!)!;
  assert.equal(fortnightlyFor(sa.points[0]), null);
});

test("upcoming pay tables continue real rows and match the sources read 23 Oct 2026", () => {
  for (const state of STATES) {
    for (const table of state.upcoming ?? []) {
      for (const r of table.rows) {
        const scale = state.scales.find((s) => s.classification === r.classification);
        assert.ok(scale, `${state.slug} ${table.effectiveFrom}: no scale ${r.classification}`);
        assert.ok(scale!.points.some((p) => p.label === r.point), `${state.slug}: no step ${r.point}`);
        assert.ok(r.annual ?? r.weekly, `${state.slug} ${r.label} has no rate`);
      }
    }
  }
  const qld = getNursingPay("qld")!.upcoming!;
  assert.equal(qld[0].effectiveFrom, "1 April 2027");
  assert.equal(qld[0].rows[0].annual, 89_985);
  assert.equal(qld[1].effectiveFrom, "1 December 2027");
  assert.equal(qld[1].rows.find((r) => r.point === "Pay point 8")!.annual, 122_873);
  const nsw = getNursingPay("nsw")!.upcoming!;
  assert.equal(nsw[0].effectiveFrom, "1 July 2027");
  assert.equal(nsw[0].rows[0].weekly, 1613.7);
  assert.equal(nsw[0].rows[1].weekly, 2265.6);
  const vic = getNursingPay("vic")!.upcoming!;
  assert.equal(vic[0].effectiveFrom, "30 November 2026");
  assert.equal(vic[0].rows[0].weekly, 1619.0, "graduate year does not move on 30 Nov 2026");
  assert.equal(vic[0].rows.find((r) => r.label === "RN Grade 2 Year 8")!.weekly, 2089.4);
  assert.equal(vic[1].rows[0].weekly, 1667.6);
});

test("the three rebuilt states were re-verified on 23 October 2026", () => {
  for (const slug of ["qld", "nsw", "vic"] as const) {
    assert.equal(getNursingPay(slug)!.verifiedOn, "23 October 2026", slug);
  }
});

test("WA ANF rates are the clause 17 column from 12 October 2026", () => {
  const wa = getNursingPay("wa")!;
  const anf = wa.instruments.find((i) => i.id === "wa-anf-2024")!;
  assert.equal(anf.effectiveFrom, "12 October 2026");
  assert.equal(anf.nextIncrease, undefined, "clause 17 prints no later column");
  const point = (classification: string, label: string) =>
    wa.scales.find((s) => s.classification === classification)!.points.find((p) => p.label === label)!.annual;
  assert.equal(point("Registered Nurse/Midwife", "Level 1.1"), 85_848);
  assert.equal(point("Registered Nurse/Midwife", "Level 2.4"), 124_087);
  assert.equal(point("Senior Registered Nurse/Midwife", "Level 1"), 134_225);
  assert.equal(point("Senior Registered Nurse/Midwife", "Level 10"), 201_533);
  assert.equal(point("Enrolled Mental Health Nurse", "Pay point 1"), 75_453);
  assert.equal(point("Enrolled Nurse (Mothercraft Nursing only)", "Year 5"), 77_478);
  assert.equal(
    wa.scales.find((s) => s.classification === "Nurse Practitioner")!.points[0].annual,
    point("Senior Registered Nurse/Midwife", "Level 3"),
    "nurse practitioner floor is SRN/M Level 3",
  );
});

test("scale anchors are unique within each state and URL-safe", () => {
  for (const state of STATES) {
    const ids = state.scales.map((scale) => scaleAnchor(state, scale));
    assert.equal(new Set(ids).size, ids.length, `${state.slug}: duplicate anchors ${ids.join(", ")}`);
    for (const id of ids) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${state.slug}: bad anchor ${id}`);
  }
  assert.equal(scaleAnchor(getNursingPay("qld")!, getNursingPay("qld")!.scales[0]), "nurse-grade-5");
});

test("at-a-glance rows match the full tables they summarise", () => {
  for (const state of STATES) {
    const rows = scaleSummaries(state);
    assert.equal(rows.length, state.scales.length);
    for (const row of rows) {
      const priced = row.scale.points.map(annualFor).filter((a): a is number => a !== null);
      if (priced.length === 0) {
        assert.equal(row.low, null);
        continue;
      }
      assert.equal(row.low, Math.min(...priced), `${state.slug} ${row.scale.classification} low`);
      assert.equal(row.high, Math.max(...priced), `${state.slug} ${row.scale.classification} high`);
    }
  }
  const qldRn = scaleSummaries(getNursingPay("qld")!)[0];
  assert.equal(qldRn.low, 83_872, "QLD Nurse Grade 5 re-entry rate");
  assert.equal(qldRn.high, 112_607, "QLD Nurse Grade 5 pay point 7");
});

// ---------- H2 (24 Sep 2026): ACT and NT pinned to the published figures ----------

test("ACT figures match Schedule 1 of the ACTPS Nursing and Midwifery EA 2023-2026, 4 Dec 2025 column", () => {
  const act = getNursingPay("act")!;
  const rn = registeredNurseRange(act)!;
  assert.equal(rn.entry, 82_993, "RN Level 1 pay point 1");
  assert.equal(rn.top, 108_780, "RN Level 1 pay point 8");
  const byCode = (code: string) => act.scales.find((s) => s.gradeCode === code)!;
  assert.deepEqual(byCode("EN1").points.map(annualFor), [75_849, 77_041, 78_230, 79_421, 80_611]);
  assert.deepEqual(byCode("RN2").points.map(annualFor), [112_841, 114_970, 117_095, 119_223]);
  assert.deepEqual(byCode("RN5").points.map(annualFor), [144_410, 154_206, 163_994, 175_188, 194_780, 214_371]);
  assert.equal(annualFor(byCode("NP").points[0]), 154_206);
  // The midwife ladder mirrors the RN ladder exactly.
  assert.deepEqual(byCode("RM1").points.map(annualFor), byCode("RN1").points.map(annualFor));
  assert.equal(act.instruments[0].reference, "AG2024/2516");
});

test("NT figures match Table 1 of the NTPS Nurses and Midwives' 2022-2026 EA, 19 Aug 2025 column", () => {
  const nt = getNursingPay("nt")!;
  const rn = registeredNurseRange(nt)!;
  assert.equal(rn.entry, 80_665, "Nurse 2.1");
  assert.equal(rn.top, 107_800, "Nurse 2.8");
  const byCode = (code: string) => nt.scales.find((s) => s.gradeCode === code)!;
  assert.deepEqual(byCode("Nurse 1").points.map(annualFor), [71_359, 73_568, 75_854, 78_203, 80_665, 81_479]);
  assert.deepEqual(byCode("Nurse 6").points.map(annualFor), [149_765, 155_757, 157_329]);
  assert.deepEqual(byCode("Nurse 8").points.map(annualFor), [181_233, 187_306, 189_196]);
  assert.equal(nt.instruments[0].reference, "AG2023/2310");
});
