import assert from "node:assert/strict";
import { test } from "node:test";

import {
  GRADUATE_PROFESSIONS,
  NMW_INTERN_AWARD_MINIMUM,
  QILT_MEDIANS_2025,
  graduateTakeHome,
  nurseStarts,
  teacherStarts,
} from "../index";

// QILT figures are the 2025 Graduate Outcomes Survey National Report, Figure 24,
// read 5 October 2026.

test("QILT medians match the 2025 GOS undergraduate study-area table", () => {
  assert.equal(QILT_MEDIANS_2025.all, 77_000);
  assert.equal(QILT_MEDIANS_2025.law, 80_000);
  assert.equal(QILT_MEDIANS_2025.nursing, 75_100);
  assert.equal(QILT_MEDIANS_2025.engineering, 82_500);
  assert.equal(QILT_MEDIANS_2025.teaching, 82_100);
  assert.equal(QILT_MEDIANS_2025.medicine, 85_900);
  assert.equal(QILT_MEDIANS_2025.business, 74_000);
});

test("six graduate professions, each with a QILT median", () => {
  assert.deepEqual(
    GRADUATE_PROFESSIONS.map((p) => p.slug).sort(),
    ["accountant", "doctor", "engineer", "lawyer", "nurse", "teacher"],
  );
  for (const p of GRADUATE_PROFESSIONS) assert.ok(p.qiltMedian > 60_000);
});

test("published starting figures come from the award or bulletin", () => {
  const eng = GRADUATE_PROFESSIONS.find((p) => p.slug === "engineer")!;
  assert.equal(eng.published?.annual, 68_538); // Professional Employees Award cl 14.1, pay point 1.1 (4 or 5 year degree)
  const law = GRADUATE_PROFESSIONS.find((p) => p.slug === "lawyer")!;
  assert.equal(law.published?.annual, Math.round(1291.8 * 52)); // Legal Services Award Level 5, weekly x 52
  const doc = GRADUATE_PROFESSIONS.find((p) => p.slug === "doctor")!;
  assert.equal(doc.published?.annual, 80_638); // NSW Health IB2026_007
  assert.equal(NMW_INTERN_AWARD_MINIMUM.annual, 66_432); // Medical Practitioners Award intern minimum
  // accountants are award-free: nothing published to show
  assert.equal(GRADUATE_PROFESSIONS.find((p) => p.slug === "accountant")!.published, null);
});

test("every state has a published graduate teacher step", () => {
  const t = teacherStarts();
  assert.equal(t.length, 8);
  for (const s of t) {
    assert.ok(s.annual > 60_000 && s.annual < 120_000, `${s.code} ${s.annual}`);
    assert.ok(s.effectiveFrom.length > 0);
  }
});

test("nurse starts are read from each state's base registered nurse scale", () => {
  const n = nurseStarts();
  assert.ok(n.length >= 6);
  for (const s of n) assert.ok(s.annual > 60_000 && s.annual < 110_000, `${s.code} ${s.annual}`);
});

test("take-home: net is gross less tax and Medicare; HELP reduces it", () => {
  const t = graduateTakeHome(80_000);
  assert.ok(t.net < 80_000 && t.net > 55_000);
  assert.ok(t.helpRepayment > 0);
  assert.equal(Math.round(t.net - t.helpRepayment), Math.round(t.netAfterHelp));
  // FY2026-27: tax 4,020 + 30% x 35,000 = 14,520; Medicare 1,600; no LITO at $80,000
  assert.equal(t.net, 80_000 - 14_520 - 1_600);
});
