import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ADF_SERVICE_LIST,
  ADF_SERVICE_SLUGS,
  OFFICER_SALARIES,
  OTHER_RANK_PAY_GRADES,
  OTHER_RANK_SALARIES,
  SERVICE_WARRANT_OFFICER_SALARY,
  TRAINEE_SALARIES,
  WO1_SALARIES,
  adfTakeHome,
  categoriesAtPayGrade,
  getAdfService,
  salaryRange,
  tablesForService,
} from "../index";

const ALL_TABLES = [...OTHER_RANK_SALARIES, WO1_SALARIES, ...OFFICER_SALARIES];

test("every salary table has 10 pay-grade columns", () => {
  for (const t of ALL_TABLES) {
    for (const r of t.rows) assert.equal(r.salaries.length, 10, `${t.id} ${r.increment}`);
  }
});

test("salaries rise with pay grade across every row", () => {
  for (const t of ALL_TABLES) {
    for (const r of t.rows) {
      const vals = r.salaries.filter((x): x is number => x !== null);
      for (let i = 1; i < vals.length; i += 1) assert.ok(vals[i] > vals[i - 1], `${t.id} ${r.increment}`);
    }
  }
});

test("within a rank, a higher increment pays more at every pay grade", () => {
  for (const t of [...OTHER_RANK_SALARIES, ...OFFICER_SALARIES]) {
    for (let i = 1; i < t.rows.length; i += 1) {
      t.rows[i].salaries.forEach((v, g) => {
        const above = t.rows[i - 1].salaries[g];
        if (v !== null && above !== null) assert.ok(above > v, `${t.id} pg${g + 1}`);
      });
    }
  }
});

test("ranks are ordered senior first and never overlap downwards at increment 0, pay grade 1", () => {
  const floor = (id: string, tables: typeof OTHER_RANK_SALARIES) => {
    const t = tables.find((x) => x.id === id)!;
    return t.rows[t.rows.length - 1].salaries[0]!;
  };
  const ors = ["wo2", "ssgt", "sgt", "cpl", "lcpl", "pte-p", "pte"];
  for (let i = 1; i < ors.length; i += 1) {
    assert.ok(floor(ors[i - 1], OTHER_RANK_SALARIES) > floor(ors[i], OTHER_RANK_SALARIES), ors[i]);
  }
  const offs = ["o6", "o5", "o4", "o3", "o2", "o1"];
  for (let i = 1; i < offs.length; i += 1) {
    assert.ok(floor(offs[i - 1], OFFICER_SALARIES) > floor(offs[i], OFFICER_SALARIES), offs[i]);
  }
});

// Spot checks against PACMAN as read on 23 Sep 2026 (6 Nov 2025 rates).
test("spot checks: PACMAN published figures", () => {
  const pte = OTHER_RANK_SALARIES.find((t) => t.id === "pte")!;
  assert.deepEqual(pte.rows[0].salaries.slice(0, 2), [79_096, 82_322]);
  assert.equal(pte.rows[0].salaries[9], 126_292);
  const sgt = OTHER_RANK_SALARIES.find((t) => t.id === "sgt")!;
  assert.equal(sgt.rows[0].increment, "2");
  assert.equal(sgt.rows[0].salaries[0], 100_898);
  const o2 = OFFICER_SALARIES.find((t) => t.id === "o2")!;
  // PACMAN's own worked checksum: Lieutenant, pay grade 4, increment 1 = $111,517.
  assert.equal(o2.rows.find((r) => r.increment === "O2-1")!.salaries[3], 111_517);
  const o6 = OFFICER_SALARIES.find((t) => t.id === "o6")!;
  assert.equal(salaryRange(o6).max, 248_376);
  assert.equal(SERVICE_WARRANT_OFFICER_SALARY, 169_795);
  assert.equal(WO1_SALARIES.rows[0].salaries[9], SERVICE_WARRANT_OFFICER_SALARY);
  assert.equal(TRAINEE_SALARIES[0].salary, 60_517);
});

test("rank names: Army-only ranks are hidden from Navy and Air Force", () => {
  const navy = tablesForService(OTHER_RANK_SALARIES, "navy").map((t) => t.id);
  assert.ok(!navy.includes("ssgt") && !navy.includes("lcpl"));
  const army = tablesForService(OTHER_RANK_SALARIES, "army").map((t) => t.id);
  assert.ok(army.includes("ssgt") && army.includes("lcpl"));
  const o3 = OFFICER_SALARIES.find((t) => t.id === "o3")!;
  assert.equal(o3.names.army, "Captain");
  assert.equal(o3.names.navy, "Lieutenant");
  assert.equal(o3.names.airForce, "Flight Lieutenant");
});

test("services resolve and each has pay-grade listings 1 to 10", () => {
  assert.equal(ADF_SERVICE_LIST.length, ADF_SERVICE_SLUGS.length);
  for (const s of ADF_SERVICE_LIST) {
    assert.equal(getAdfService(s.slug), s);
    for (let pg = 1; pg <= 10; pg += 1) {
      assert.ok(categoriesAtPayGrade(s.key, pg).length > 0, `${s.slug} pg${pg}`);
    }
  }
  assert.equal(getAdfService("marines"), undefined);
});

test("pay-grade spot checks: Rifleman grades 1-3 sit at pay grades 1-3", () => {
  for (const pg of [1, 2, 3]) {
    assert.ok(
      OTHER_RANK_PAY_GRADES.army[pg].some((e) => e.category === "Rifleman" && e.grade === `Grade ${pg}`),
      `pg${pg}`,
    );
  }
  assert.ok(categoriesAtPayGrade("navy", 1).some((e) => e.category === "General Mariner"));
});

test("take-home is below gross and the levy-exempt figure adds back exactly the levy", () => {
  for (const salary of [60_517, 79_096, 111_517, 248_376]) {
    const t = adfTakeHome(salary);
    assert.ok(t.net < salary && t.net > salary * 0.55, `${salary}`);
    assert.equal(t.netIfLevyExempt - t.net, t.medicareLevy);
    assert.ok(t.medicareLevy > 0);
  }
});
