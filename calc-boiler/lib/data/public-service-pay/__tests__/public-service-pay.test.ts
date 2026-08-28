import { strict as assert } from "node:assert";
import test from "node:test";

import {
  JURISDICTIONS,
  JURISDICTION_SLUGS,
  PLANNED_JURISDICTIONS,
  allBands,
  bandMidpoint,
  findBand,
  formatBandRange,
  getJurisdiction,
  groupBands,
  groupRange,
  isBuiltSlug,
  nearestTakeHomeSalary,
  normaliseCode,
  takeHomeHref,
  TAKE_HOME_MAX,
  TAKE_HOME_MIN,
  TAKE_HOME_STEP,
} from "../index";

// ---------- take-home links ----------
// Only /take-home-pay-on/N/ for N = 30000..200000 step 5000 exists.

const PUBLISHED_TAKE_HOME: number[] = [];
for (let n = TAKE_HOME_MIN; n <= TAKE_HOME_MAX; n += TAKE_HOME_STEP) PUBLISHED_TAKE_HOME.push(n);

test("nearestTakeHomeSalary rounds to the nearest published page", () => {
  assert.equal(nearestTakeHomeSalary(82_906), 85_000);
  assert.equal(nearestTakeHomeSalary(108_092), 110_000);
  assert.equal(nearestTakeHomeSalary(77_354), 75_000);
  assert.equal(nearestTakeHomeSalary(82_500), 85_000, "ties round up");
});

test("nearestTakeHomeSalary clamps to the pages that exist", () => {
  assert.equal(nearestTakeHomeSalary(43_107), 45_000);
  assert.equal(nearestTakeHomeSalary(10_000), TAKE_HOME_MIN);
  assert.equal(nearestTakeHomeSalary(431_975), TAKE_HOME_MAX);
});

test("nearestTakeHomeSalary rejects non-numbers", () => {
  assert.throws(() => nearestTakeHomeSalary(Number.NaN));
});

test("takeHomeHref always points at a page that exists and ends in a slash", () => {
  for (const jurisdiction of JURISDICTIONS) {
    for (const band of allBands(jurisdiction)) {
      const target = nearestTakeHomeSalary(bandMidpoint(band));
      assert.ok(
        PUBLISHED_TAKE_HOME.includes(target),
        `${jurisdiction.slug} ${band.code} -> ${target} is not a published page`,
      );
      assert.equal(takeHomeHref(bandMidpoint(band)), `/take-home-pay-on/${target}/`);
    }
  }
});

test("bandMidpoint sits inside the band", () => {
  const mid = bandMidpoint({ min: 100_000, max: 110_001 });
  assert.equal(mid, 105_001);
});

// ---------- data integrity ----------

test("registry lists exactly the built jurisdictions", () => {
  assert.deepEqual([...JURISDICTION_SLUGS], ["aps", "vic", "qld"]);
  assert.ok(isBuiltSlug("aps"));
  assert.ok(!isBuiltSlug("nsw"));
  assert.equal(getJurisdiction("nsw"), undefined);
  assert.equal(getJurisdiction("qld")?.shortName, "Queensland");
});

test("planned jurisdictions never overlap the built ones", () => {
  for (const planned of PLANNED_JURISDICTIONS) {
    assert.ok(
      !JURISDICTION_SLUGS.includes(planned.slug),
      `${planned.slug} is both built and planned`,
    );
  }
  assert.equal(PLANNED_JURISDICTIONS.length, 6);
});

test("every band is a sane, whole-dollar range", () => {
  for (const jurisdiction of JURISDICTIONS) {
    for (const band of allBands(jurisdiction)) {
      const where = `${jurisdiction.slug} ${band.code}`;
      assert.ok(Number.isInteger(band.min), `${where} min is not whole dollars`);
      assert.ok(Number.isInteger(band.max), `${where} max is not whole dollars`);
      assert.ok(band.min > 0, `${where} min is not positive`);
      assert.ok(band.max >= band.min, `${where} max is below min`);
      assert.ok(band.max < 1_000_000, `${where} max looks like a transcription slip`);
    }
  }
});

test("published pay points ascend and match the band's min and max", () => {
  for (const jurisdiction of JURISDICTIONS) {
    for (const band of allBands(jurisdiction)) {
      if (!band.payPoints || band.payPoints.length === 0) continue;
      const values = band.payPoints.map((p) => p.annual);
      const where = `${jurisdiction.slug} ${band.code}`;
      assert.equal(values[0], band.min, `${where}: first pay point is not the band minimum`);
      assert.equal(
        values[values.length - 1],
        band.max,
        `${where}: last pay point is not the band maximum`,
      );
      for (let i = 1; i < values.length; i++) {
        assert.ok(values[i] > values[i - 1], `${where}: pay point ${i} does not increase`);
      }
    }
  }
});

test("survey figures sit inside their own band", () => {
  for (const jurisdiction of JURISDICTIONS) {
    for (const band of allBands(jurisdiction)) {
      if (band.median !== undefined) {
        assert.ok(
          band.median >= band.min && band.median <= band.max,
          `${jurisdiction.slug} ${band.code}: median outside the percentile range`,
        );
      }
      if (band.reportedMin !== undefined) {
        assert.ok(
          band.reportedMin <= band.min,
          `${jurisdiction.slug} ${band.code}: reported minimum above the 5th percentile`,
        );
      }
      if (band.headcount !== undefined) {
        assert.ok(band.headcount > 0, `${jurisdiction.slug} ${band.code}: empty headcount`);
      }
    }
  }
});

test("every schedule and superannuation note cites a source that exists", () => {
  for (const jurisdiction of JURISDICTIONS) {
    const ids = new Set(jurisdiction.sources.map((s) => s.id));
    for (const schedule of jurisdiction.schedules) {
      assert.ok(
        ids.has(schedule.sourceId),
        `${jurisdiction.slug}: schedule ${schedule.id} cites unknown source ${schedule.sourceId}`,
      );
      assert.ok(schedule.effectiveFrom.length > 0, `${jurisdiction.slug} ${schedule.id}: no date`);
      assert.ok(schedule.streams.length > 0, `${jurisdiction.slug} ${schedule.id}: no streams`);
    }
    assert.ok(
      ids.has(jurisdiction.superannuation.sourceId),
      `${jurisdiction.slug}: superannuation cites unknown source`,
    );
  }
});

test("every source carries an https url and a verification date", () => {
  for (const jurisdiction of JURISDICTIONS) {
    assert.ok(jurisdiction.sources.length > 0, `${jurisdiction.slug} has no sources`);
    for (const source of jurisdiction.sources) {
      assert.ok(source.url.startsWith("https://"), `${source.id}: ${source.url} is not https`);
      assert.ok(source.verifiedOn.length > 0, `${source.id}: no verification date`);
      assert.ok(source.publisher.length > 0, `${source.id}: no publisher`);
    }
  }
});

test("every jurisdiction says what it could not verify and answers real questions", () => {
  for (const jurisdiction of JURISDICTIONS) {
    assert.ok(jurisdiction.unverified.length > 0, `${jurisdiction.slug}: nothing listed unverified`);
    assert.ok(jurisdiction.faqs.length >= 5, `${jurisdiction.slug}: too few FAQs`);
    assert.ok(jurisdiction.progression.length >= 3, `${jurisdiction.slug}: thin progression section`);
    assert.ok(jurisdiction.headline.includes("$"), `${jurisdiction.slug}: headline has no figure`);
  }
});

test("aliases are lower case and unique within a jurisdiction", () => {
  for (const jurisdiction of JURISDICTIONS) {
    const seen = new Map<string, string>();
    for (const band of allBands(jurisdiction)) {
      for (const alias of band.aliases) {
        assert.equal(alias, alias.toLowerCase(), `${alias} is not lower case`);
        const key = normaliseCode(alias);
        assert.ok(
          !seen.has(key),
          `${jurisdiction.slug}: alias "${alias}" is on both ${seen.get(key)} and ${band.code}`,
        );
        seen.set(key, band.code);
      }
    }
  }
});

// ---------- lookup ----------

test("findBand answers the bare classification queries", () => {
  const aps6 = findBand("aps6");
  assert.equal(aps6?.jurisdiction.slug, "aps");
  assert.equal(aps6?.band.median, 108_092);
  assert.equal(findBand("APS 6")?.band.code, "APS 6");
  assert.equal(findBand("el1 salary")?.band.code, "EL 1");

  const po4 = findBand("po4");
  assert.equal(po4?.jurisdiction.slug, "qld");
  assert.equal(po4?.schedule.id, "award-2025", "the award floor wins over the agency example");
  assert.equal(po4?.band.min, 118_966);

  assert.equal(findBand("vps3")?.band.code, "VPS 3.1");
  assert.equal(findBand("ao3")?.band.max, 85_833);
  assert.equal(findBand("nothing-like-this"), undefined);
  assert.equal(findBand(""), undefined);
});

test("findBand can be pinned to one jurisdiction", () => {
  assert.equal(findBand("APS 6", "qld"), undefined);
  assert.equal(findBand("AO3", "qld")?.band.code, "AO3");
});

// ---------- grouping ----------

test("VPS value ranges group into grades", () => {
  const vic = getJurisdiction("vic");
  assert.ok(vic);
  const grades = groupBands(vic.schedules[0].streams[0].bands);
  const grade3 = grades.find((g) => g.label === "VPS Grade 3");
  assert.ok(grade3);
  assert.equal(grade3.bands.length, 2);
  assert.deepEqual(groupRange(grade3.bands), { min: 81_496, max: 98_955 });
  assert.equal(formatBandRange({ min: 81_496, max: 98_955 }), "$81,496 to $98,955");
});

test("bands without a group stay separate", () => {
  const qld = getJurisdiction("qld");
  assert.ok(qld);
  const groups = groupBands(qld.schedules[0].streams[0].bands);
  assert.equal(groups.length, qld.schedules[0].streams[0].bands.length);
});
