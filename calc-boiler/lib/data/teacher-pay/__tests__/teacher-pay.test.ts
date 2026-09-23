import assert from "node:assert/strict";
import { test } from "node:test";

import {
  TAKE_HOME_MAX,
  TAKE_HOME_MIN,
  TAKE_HOME_STEP,
  TEACHER_PAY_BY_STATE,
  TEACHER_PAY_STATES,
  TEACHER_STATE_SLUGS,
  getTeacherPayState,
  graduateSalary,
  highestPublishedSalary,
  isExactTakeHomeAmount,
  isTeacherStateSlug,
  lowestPublishedSalary,
  nearestTakeHomeAmount,
  scaleRanges,
  takeHomeHref,
  teacherRatesYear,
  topOfClassroomScale,
} from "../index";

// ---------------------------------------------------------------------------
// The take-home link resolver. app/sitemap.ts generates /take-home-pay-on/N/
// for N from 30,000 to 200,000 in steps of 5,000; linking outside that set is a
// 404, and linking to the wrong amount misstates someone's net pay.
// ---------------------------------------------------------------------------

/** Exactly what app/sitemap.ts generates. */
function generatedTakeHomeAmounts(): Set<number> {
  const set = new Set<number>();
  for (let salary = 30_000; salary <= 200_000; salary += 5_000) set.add(salary);
  return set;
}

test("nearestTakeHomeAmount rounds to the nearest published step", () => {
  assert.equal(nearestTakeHomeAmount(90_000), 90_000);
  assert.equal(nearestTakeHomeAmount(90_177), 90_000);
  assert.equal(nearestTakeHomeAmount(92_400), 90_000);
  assert.equal(nearestTakeHomeAmount(92_600), 95_000);
  assert.equal(nearestTakeHomeAmount(129_536), 130_000);
  assert.equal(nearestTakeHomeAmount(79_589), 80_000);
});

test("nearestTakeHomeAmount rounds an exact halfway point up", () => {
  assert.equal(nearestTakeHomeAmount(92_500), 95_000);
  assert.equal(nearestTakeHomeAmount(97_500), 100_000);
});

test("nearestTakeHomeAmount clamps to the generated range", () => {
  assert.equal(nearestTakeHomeAmount(1_000), TAKE_HOME_MIN);
  assert.equal(nearestTakeHomeAmount(29_999), TAKE_HOME_MIN);
  assert.equal(nearestTakeHomeAmount(238_676), TAKE_HOME_MAX);
  assert.equal(nearestTakeHomeAmount(1_000_000), TAKE_HOME_MAX);
});

test("nearestTakeHomeAmount rejects a non-finite salary", () => {
  assert.throws(() => nearestTakeHomeAmount(Number.NaN), /finite salary/);
  assert.throws(() => nearestTakeHomeAmount(Number.POSITIVE_INFINITY), /finite salary/);
});

test("isExactTakeHomeAmount only claims exactness for a real round step", () => {
  assert.equal(isExactTakeHomeAmount(90_000), true);
  assert.equal(isExactTakeHomeAmount(90_177), false);
  // Clamped values are not the salary, so they must not claim exactness.
  assert.equal(isExactTakeHomeAmount(238_676), false);
  assert.equal(isExactTakeHomeAmount(1_000), false);
});

test("takeHomeHref always has a trailing slash and a generated amount", () => {
  const href = takeHomeHref(90_177);
  assert.equal(href, "/take-home-pay-on/90000/");
  assert.ok(href.endsWith("/"));
});

test("every published salary links to a take-home page that actually exists", () => {
  const generated = generatedTakeHomeAmounts();
  for (const state of TEACHER_PAY_STATES) {
    for (const scale of state.scales) {
      for (const step of scale.steps) {
        const target = nearestTakeHomeAmount(step.salary);
        assert.ok(
          generated.has(target),
          `${state.code} ${scale.id} ${step.label}: ${step.salary} resolved to ${target}, which app/sitemap.ts does not generate`,
        );
        assert.ok(takeHomeHref(step.salary).startsWith("/take-home-pay-on/"));
      }
    }
  }
});

test("the step size the resolver uses matches the sitemap's step size", () => {
  assert.equal(TAKE_HOME_STEP, 5_000);
  assert.equal(TAKE_HOME_MIN, 30_000);
  assert.equal(TAKE_HOME_MAX, 200_000);
});

// ---------------------------------------------------------------------------
// Registry integrity.
// ---------------------------------------------------------------------------

test("the registry covers exactly the eight routed slugs", () => {
  assert.deepEqual([...TEACHER_STATE_SLUGS], ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"]);
  assert.equal(TEACHER_PAY_STATES.length, TEACHER_STATE_SLUGS.length);
  for (const slug of TEACHER_STATE_SLUGS) {
    assert.ok(TEACHER_PAY_BY_STATE[slug], `no data registered for ${slug}`);
    assert.equal(TEACHER_PAY_BY_STATE[slug].slug, slug, `${slug} data has a mismatched slug`);
  }
});

test("slug lookup accepts routed slugs and rejects anything else", () => {
  assert.equal(isTeacherStateSlug("vic"), true);
  assert.equal(isTeacherStateSlug("VIC"), false);
  assert.equal(isTeacherStateSlug("victoria"), false);
  assert.ok(getTeacherPayState("nsw"));
  assert.equal(getTeacherPayState("nsw")?.code, "NSW");
  assert.equal(getTeacherPayState("nowhere"), undefined);
});

test("every state carries the provenance a YMYL page needs", () => {
  for (const state of TEACHER_PAY_STATES) {
    assert.ok(state.code.length > 0, `${state.slug}: missing code`);
    assert.ok(state.name.length > 0, `${state.slug}: missing name`);
    assert.ok(state.nameInSentence.length > 0, `${state.slug}: missing nameInSentence`);
    assert.ok(state.agreementName.length > 0, `${state.slug}: missing agreement name`);
    assert.ok(
      state.agreementUrl.startsWith("http"),
      `${state.slug}: agreement URL is not a URL`,
    );
    assert.ok(state.ratesEffectiveFrom.length > 0, `${state.slug}: missing effective date`);
    assert.ok(state.verifiedOn.length > 0, `${state.slug}: missing verification date`);
    assert.ok(state.sources.length > 0, `${state.slug}: published with no sources`);
    for (const source of state.sources) {
      assert.ok(source.url.startsWith("http"), `${state.slug}: source URL is not a URL`);
      assert.ok(source.publisher.length > 0, `${state.slug}: source has no publisher`);
    }
  }
});

test("every published salary is a whole positive dollar amount", () => {
  for (const state of TEACHER_PAY_STATES) {
    for (const scale of state.scales) {
      assert.ok(scale.steps.length > 0, `${state.code} ${scale.id}: empty scale`);
      for (const step of scale.steps) {
        assert.ok(
          Number.isInteger(step.salary),
          `${state.code} ${scale.id} ${step.label}: ${step.salary} is not a whole dollar amount`,
        );
        assert.ok(
          step.salary > 0 && step.salary < 1_000_000,
          `${state.code} ${scale.id} ${step.label}: ${step.salary} is out of plausible range`,
        );
      }
    }
  }
});

test("scale ids and step labels are unique, so anchors and table keys do not collide", () => {
  for (const state of TEACHER_PAY_STATES) {
    const scaleIds = state.scales.map((s) => s.id);
    assert.equal(
      new Set(scaleIds).size,
      scaleIds.length,
      `${state.code}: duplicate scale id in ${scaleIds.join(", ")}`,
    );
    for (const scale of state.scales) {
      const labels = scale.steps.map((s) => s.label);
      assert.equal(
        new Set(labels).size,
        labels.length,
        `${state.code} ${scale.id}: duplicate step label`,
      );
    }
  }
});

test("a state with no verified scale still says so rather than showing nothing", () => {
  for (const state of TEACHER_PAY_STATES) {
    if (state.scales.length === 0) {
      assert.ok(
        state.unverified.length > 0,
        `${state.code}: publishes no scale and does not explain why`,
      );
    }
  }
});

test("summary helpers agree with the underlying data", () => {
  for (const state of TEACHER_PAY_STATES) {
    const grad = graduateSalary(state);
    const top = topOfClassroomScale(state);
    const lowest = lowestPublishedSalary(state);
    const highest = highestPublishedSalary(state);

    if (state.scales.length === 0) {
      assert.equal(grad, null);
      assert.equal(top, null);
      assert.equal(lowest, null);
      assert.equal(highest, null);
      continue;
    }

    const first = state.scales[0];
    const gradRow = state.graduateStep
      ? first.steps.find((s) => s.label === state.graduateStep)
      : first.steps[0];
    const topRow = state.topClassroomStep
      ? first.steps.find((s) => s.label === state.topClassroomStep)
      : first.steps[first.steps.length - 1];
    assert.ok(gradRow, `${state.code}: graduateStep "${state.graduateStep}" is not a row of the first scale`);
    assert.ok(topRow, `${state.code}: topClassroomStep "${state.topClassroomStep}" is not a row of the first scale`);
    assert.equal(grad, gradRow!.salary);
    assert.equal(top, topRow!.salary);
    assert.ok(lowest !== null && highest !== null);
    assert.ok(lowest <= (grad as number), `${state.code}: graduate below the lowest published`);
    assert.ok(highest >= (top as number), `${state.code}: top above the highest published`);
  }
});

test("the first scale of each state runs graduate-low to top-high", () => {
  for (const state of TEACHER_PAY_STATES) {
    if (state.scales.length === 0) continue;
    const grad = graduateSalary(state) as number;
    const top = topOfClassroomScale(state) as number;
    assert.ok(
      top > grad,
      `${state.code}: top of the classroom scale (${top}) is not above the graduate step (${grad})`,
    );
  }
});

test("graduate and top figures are the qualified-graduate and incremental-top rows", () => {
  assert.equal(graduateSalary(getTeacherPayState("qld")!), 86_068, "QLD Band 2 Step 1, not the intern band");
  assert.equal(topOfClassroomScale(getTeacherPayState("qld")!), 113_957, "QLD Band 3 Step 4");
  assert.equal(graduateSalary(getTeacherPayState("sa")!), 84_971, "SA Step 1, not Special Authority");
  assert.equal(graduateSalary(getTeacherPayState("tas")!), 85_313, "TAS four-year-trained entry");
  assert.equal(graduateSalary(getTeacherPayState("nsw")!), 90_177);
  assert.equal(graduateSalary(getTeacherPayState("vic")!), 79_589);
});

test("scaleRanges summarises every published scale", () => {
  for (const state of TEACHER_PAY_STATES) {
    const rows = scaleRanges(state);
    assert.equal(rows.length, state.scales.filter((s) => s.steps.length > 0).length);
    for (const row of rows) {
      const scale = state.scales.find((s) => s.id === row.id)!;
      const salaries = scale.steps.map((s) => s.salary);
      assert.equal(row.low, Math.min(...salaries));
      assert.equal(row.high, Math.max(...salaries));
    }
  }
});

test("state titles lead with the searched phrase and the year", () => {
  assert.equal(getTeacherPayState("vic")!.metaTitle?.startsWith("Teacher Salary Victoria 2026"), true);
  assert.equal(getTeacherPayState("nsw")!.metaTitle?.startsWith("NSW Teacher Salary 2026"), true);
  assert.equal(getTeacherPayState("qld")!.metaTitle?.startsWith("QLD Teacher Salary 2026"), true);
  for (const state of TEACHER_PAY_STATES) assert.ok(teacherRatesYear(state).length === 4, state.code);
});
