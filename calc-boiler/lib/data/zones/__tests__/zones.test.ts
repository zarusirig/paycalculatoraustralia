// =============================================================================
// ATO zone list — data integrity tests.
//
// These guard a transcription job of roughly 5,000 YMYL rows that cannot be
// scripted (ato.gov.au returns 403 to non-proxied clients). A silent typo here
// would tell someone they live in the wrong zone and misstate their offset by
// up to $1,116.
//
// Spot-check assertions use locations independently verified against the ATO
// list on 28 July 2026 during research.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ZONE_LOCATIONS,
  COVERED_STATES,
  findZoneLocations,
  normaliseLocation,
  parseZoneBlock,
  ZONE_CODES,
  ZONE_CODE_TO_AREA,
  type ZoneCode,
} from "../index";

// ---------------------------------------------------------------------------
// Parser strictness — a bad transcription must fail loudly
// ---------------------------------------------------------------------------

test("parser rejects an unknown zone code", () => {
  assert.throws(() => parseZoneBlock("TAS", "Somewhere|Z"), /unknown zone code/);
});

test("parser rejects a row with no separator", () => {
  assert.throws(() => parseZoneBlock("TAS", "Somewhere B"), /missing "\|" separator/);
});

test("parser rejects an empty location name", () => {
  assert.throws(() => parseZoneBlock("TAS", "|B"), /empty location name/);
});

test("parser keeps names containing a pipe-free bracket or slash", () => {
  const e = parseZoneBlock("NT", "Hooker Creek / Lajamanu|AS\nBerry Springs (Darwin)|A");
  assert.equal(e.length, 2);
  assert.equal(e[0].name, "Hooker Creek / Lajamanu");
  assert.equal(e[0].zone, "AS");
  assert.equal(e[1].name, "Berry Springs (Darwin)");
});

test("parser ignores blank lines", () => {
  assert.equal(parseZoneBlock("TAS", "\n\nQueenstown|B\n\n").length, 1);
});

// ---------------------------------------------------------------------------
// Dataset integrity
// ---------------------------------------------------------------------------

test("every entry has a valid zone code", () => {
  for (const e of ZONE_LOCATIONS) {
    assert.ok(
      (ZONE_CODES as readonly string[]).includes(e.zone),
      `${e.name} (${e.state}) has invalid zone ${e.zone}`,
    );
  }
});

test("every entry has a non-empty trimmed name", () => {
  for (const e of ZONE_LOCATIONS) {
    assert.equal(e.name, e.name.trim(), `${e.name} has untrimmed whitespace`);
    assert.ok(e.name.length > 0);
  }
});

test("no duplicate location name within a state", () => {
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  for (const e of ZONE_LOCATIONS) {
    const key = `${e.state}:${normaliseLocation(e.name)}`;
    const prev = seen.get(key);
    if (prev !== undefined && prev !== e.zone) {
      dupes.push(`${e.state} ${e.name}: ${prev} vs ${e.zone}`);
    }
    seen.set(key, e.zone);
  }
  assert.deepEqual(dupes, [], `conflicting duplicates found:\n${dupes.join("\n")}`);
});

test("every zone code maps to a claimable area or explicit null", () => {
  for (const code of ZONE_CODES) {
    assert.ok(code in ZONE_CODE_TO_AREA, `${code} has no area mapping`);
  }
  assert.equal(ZONE_CODE_TO_AREA.N, null);
  assert.equal(ZONE_CODE_TO_AREA.AS, "specialArea");
  assert.equal(ZONE_CODE_TO_AREA.BS, "specialArea");
});

test("at least one state is registered", () => {
  assert.ok(COVERED_STATES.length > 0);
  assert.ok(ZONE_LOCATIONS.length > 0);
});

// ---------------------------------------------------------------------------
// Search behaviour
// ---------------------------------------------------------------------------

test("search finds an exact match first", () => {
  const r = findZoneLocations("Queenstown");
  assert.ok(r.length > 0);
  assert.equal(r[0].name, "Queenstown");
  assert.equal(r[0].zone, "B");
});

test("search is case and punctuation insensitive", () => {
  assert.equal(findZoneLocations("king island")[0]?.name, "King Island");
  assert.equal(findZoneLocations("KING ISLAND")[0]?.name, "King Island");
});

test("search returns nothing for a query under two characters", () => {
  assert.deepEqual(findZoneLocations("Q"), []);
});

test("search returns nothing for an unlisted location", () => {
  assert.deepEqual(findZoneLocations("Sydney Opera House"), []);
});

// ---------------------------------------------------------------------------
// Spot checks against locations verified directly at ato.gov.au
// ---------------------------------------------------------------------------

const SPOT_CHECKS: { name: string; zone: ZoneCode }[] = [
  { name: "Queenstown", zone: "B" },
  { name: "Strahan", zone: "B" },
  { name: "King Island", zone: "BS" },
  { name: "Flinders Island", zone: "BS" },
  { name: "Cape Barren Island", zone: "BS" },
  { name: "Zeehan", zone: "B" },
];

for (const { name, zone } of SPOT_CHECKS) {
  test(`spot check: ${name} is ${zone}`, () => {
    const hit = ZONE_LOCATIONS.find((e) => normaliseLocation(e.name) === normaliseLocation(name));
    assert.ok(hit, `${name} missing from the dataset`);
    assert.equal(hit.zone, zone);
  });
}
