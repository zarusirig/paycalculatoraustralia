import assert from "node:assert/strict";
import { test } from "node:test";

import { afterTax, getOccupation, headlineRow } from "../index";
import { takeHomeWeekly } from "../j8-common";
import { enrolledNurseStateRows } from "../nurse";
import { entrySalary, getServicePay, topSalary, verifiedJurisdictions } from "../../service-pay";

// J8 (9 Oct 2026): awarded occupation pages and targeted sections. Every
// figure below was read on 9 October 2026 from the consolidated award text on
// awards.fairwork.gov.au (and, for MA000118 and MA000101, the FWO pay guide),
// or from the state instrument named in lib/data/service-pay/prison-officer/.

const rows = (slug: string) => getOccupation(slug)!.tables.flatMap((t) => t.rows);
const row = (slug: string, label: string) => {
  const r = rows(slug).find((x) => x.label === label);
  assert.ok(r, `${slug} / ${label}`);
  return r;
};
const triple = (slug: string, label: string) => {
  const r = row(slug, label);
  return [r.weekly, r.hourly, r.casualHourly];
};

const J8 = ["vet-nurse", "bricklayer", "fitter-and-turner", "landscaper", "personal-trainer", "payroll-officer", "excavator-operator"] as const;

test("J8: every new occupation is registered, award-backed and has a resolvable headline", () => {
  for (const slug of J8) {
    const occ = getOccupation(slug);
    assert.ok(occ, slug);
    assert.ok(occ.award, `${slug} award`);
    assert.ok(headlineRow(occ), `${slug} headline`);
    assert.equal(occ.verifiedOn, "9 October 2026");
    assert.ok(occ.faqs.length >= 5, `${slug} faqs`);
  }
});

test("J8: vet nurse — Animal Care and Veterinary Services Award cl 15.2 and Schedule B", () => {
  const vn = getOccupation("vet-nurse")!;
  assert.equal(vn.award!.code, "MA000118");
  assert.deepEqual(triple("vet-nurse", "Level 1"), [1004.9, 26.44, 33.05]);
  assert.deepEqual(triple("vet-nurse", "Level 2"), [1073.1, 28.24, 35.3]);
  assert.deepEqual(triple("vet-nurse", "Level 3"), [1119.1, 29.45, 36.81]);
  assert.deepEqual(triple("vet-nurse", "Level 4"), [1221.1, 32.13, 40.16]);
  assert.deepEqual(triple("vet-nurse", "Level 5 — Practice manager"), [1283.1, 33.77, 42.21]);
  assert.equal(headlineRow(vn)!.label, "Level 4");
  // Schedule B.1.4 at Level 4: Saturday after 1 pm $48.20, Sunday $64.26, public holiday $80.33.
  const faq = vn.faqs.find((f) => /weekends/.test(f.q))!.a;
  for (const dollars of ["$48.20", "$64.26", "$80.33"]) assert.ok(faq.includes(dollars), dollars);
  assert.equal(vn.median!.medianWeekly, 1_667);
});

test("J8: landscaper — Gardening and Landscaping Services Award cl 15.1 and Schedule B.3.1, no median", () => {
  const ls = getOccupation("landscaper")!;
  assert.equal(ls.award!.code, "MA000101");
  assert.deepEqual(triple("landscaper", "Level 3"), [1074.7, 28.28, 35.35]);
  assert.deepEqual(triple("landscaper", "Level 4"), [1119.1, 29.45, 36.81]);
  assert.deepEqual(triple("landscaper", "Level 5"), [1154.3, 30.38, 37.98]);
  assert.equal(ls.median, null); // JSA prints N/A for ANZSCO 3622 Gardeners
  assert.ok(ls.penalties.some((p) => /Saturday 6 am–12 noon/.test(p.when) && p.permanent === "100%"));
});

test("J8: bricklayer — CW3 + industry allowance + $29.26 tool allowance, and the daily hire loading", () => {
  assert.equal(getOccupation("bricklayer")!.award!.code, "MA000020");
  assert.deepEqual(triple("bricklayer", "Bricklayer (CW3) — general building and construction"), [1215.51, 31.99, 39.99]);
  assert.deepEqual(triple("bricklayer", "Bricklayer (CW3) — residential building"), [1202.08, 31.63, 39.54]);
  assert.deepEqual(triple("bricklayer", "Refractory bricklayer (CW5) — general building"), [1286.01, 33.84, 42.3]);
  const daily = row("bricklayer", "Daily hire bricklayer — general building");
  assert.deepEqual([daily.weekly, daily.hourly, daily.casualHourly], [1254.1, 33, null]);
  assert.equal(getOccupation("bricklayer")!.median!.medianWeekly, 2_317);
});

test("J8: excavator operator — civil stream CW4/CW5/CW6 with the industry allowance and in charge of plant", () => {
  const ex = "excavator-operator";
  assert.deepEqual(triple(ex, "Excavator up to 0.5 m³ — civil and general building (CW/ECW 4)"), [1221.55, 32.15, 40.19]);
  assert.deepEqual(triple(ex, "Excavator above 0.5 m³ — civil and general building (CW/ECW 5)"), [1256.75, 33.07, 41.34]);
  assert.deepEqual(triple(ex, "Dragline or shovel excavator from 3 m³ (CW/ECW 6)"), [1288.45, 33.91, 42.39]);
  assert.deepEqual(triple(ex, "Excavator up to 0.5 m³ — residential (CW/ECW 4)"), [1208.12, 31.79, 39.74]);
  assert.deepEqual(triple(ex, "Excavator above 0.5 m³ — in charge of plant"), [1309.35, 34.46, 43.08]);
  assert.equal(getOccupation(ex)!.median!.medianWeekly, 1_900);
});

test("J8: fitter and turner — Manufacturing C10 to C5, Mining Level 3 and construction ECW3", () => {
  const ft = "fitter-and-turner";
  const hourly = rows(ft).filter((r) => /^C\d/.test(r.label)).map((r) => r.hourly);
  assert.deepEqual(hourly, [29.45, 30.38, 31.3, 32.13, 33.77, 34.46]);
  assert.deepEqual(triple(ft, "Mining Industry Award — Level 3 (Competent), maintenance trades"), [1160.51, 30.54, 38.18]);
  assert.deepEqual(triple(ft, "Building and Construction Award — Fitter (CW/ECW 3)"), [1207.84, 31.79, 39.74]);
  assert.equal(getOccupation(ft)!.median!.medianWeekly, 2_606);
});

test("J8: personal trainer — Fitness Industry Award Level 4A headline and weekend casual loading", () => {
  const pt = getOccupation("personal-trainer")!;
  assert.equal(headlineRow(pt)!.label, "Level 4A");
  assert.deepEqual(triple("personal-trainer", "Level 3A"), [1119.1, 29.45, 36.81]);
  assert.deepEqual(triple("personal-trainer", "Level 4A"), [1221.1, 32.13, 40.16]);
  assert.deepEqual(triple("personal-trainer", "Level 5"), [1287.2, 33.87, 42.34]);
  // Schedule B.2: 130% at 4A is $41.77; B.1.1: Saturday $40.16, Sunday $48.20.
  const casualFaq = pt.faqs.find((f) => /casual rate/.test(f.q))!.a;
  assert.ok(casualFaq.includes("$41.77"));
  const weekendFaq = pt.faqs.find((f) => /weekend/.test(f.q))!.a;
  assert.ok(weekendFaq.includes("$40.16") && weekendFaq.includes("$48.20"));
  assert.equal(pt.median!.medianWeekly, 1_500);
});

test("J8: payroll officer — Clerks Award Levels 2 to 5", () => {
  assert.deepEqual(triple("payroll-officer", "Level 3"), [1182.1, 31.11, 38.89]);
  assert.equal(row("payroll-officer", "Level 2 — Year 1").hourly, 29.45);
  assert.equal(row("payroll-officer", "Level 4").hourly, 32.67);
  assert.equal(row("payroll-officer", "Level 5").hourly, 33.99);
  assert.equal(getOccupation("payroll-officer")!.median!.medianWeekly, 1_606);
});

test("J8: owner pages carry a targeted section and an FAQ for the query they own", () => {
  const owners: [string, string, RegExp][] = [
    ["nurse", "enrolled-nurse-pay", /enrolled nurse/i],
    ["disability-support-worker", "support-worker-pay", /support worker\?/i],
    ["retail-manager", "store-manager-pay", /store manager/i],
    ["mechanic", "diesel-mechanic-pay", /diesel/i],
    ["childcare-worker", "early-childhood-educator-pay", /early childhood educator/i],
    ["forklift-operator", "forklift-driver-pay", /forklift driver/i],
  ];
  for (const [slug, sectionId, faq] of owners) {
    const occ = getOccupation(slug)!;
    const section = occ.sections?.find((s) => s.id === sectionId);
    assert.ok(section, `${slug} section ${sectionId}`);
    assert.ok(section.table && section.table.rows.length >= 2, `${slug} section table`);
    for (const r of section.table.rows) assert.equal(r.length, section.table.head.length, `${slug} row width`);
    assert.ok(occ.faqs.some((f) => faq.test(f.q)), `${slug} FAQ for ${faq}`);
  }
});

test("J8: enrolled nurse rows come from the verified state files", () => {
  const states = enrolledNurseStateRows();
  assert.equal(states.length, 8);
  const nsw = states.find((s) => s.code === "NSW")!;
  assert.deepEqual([nsw.classification, nsw.entry, nsw.top], ["Enrolled Nurse", 74_755, 83_715]);
  const qld = states.find((s) => s.code === "QLD")!;
  assert.deepEqual([qld.entry, qld.top], [75_573, 80_204]);
});

test("J8: section take-home uses the same engine as afterTax", () => {
  for (const annual of [55_265, 61_469, 63_497, 67_173]) {
    assert.equal(takeHomeWeekly(annual), afterTax(annual).netWeekly, String(annual));
  }
});

test("J8: prison officer pay — verified states and their headline figures", () => {
  assert.deepEqual(
    verifiedJurisdictions("prison-officer").map((j) => j.slug),
    ["nsw", "vic", "wa", "sa", "tas", "act", "nt"],
  );
  const qld = getServicePay("prison-officer", "qld")!;
  assert.equal(qld.scales.length, 0);
  const expect: [string, number, number][] = [
    ["nsw", 77_406, 97_285],
    ["vic", 65_373, 83_950],
    ["wa", 78_881, 89_823],
    ["sa", 59_406, 84_000],
    ["tas", 71_290, 83_260],
    ["act", 79_546, 93_658],
    ["nt", 69_074, 78_888],
  ];
  for (const [slug, entry, top] of expect) {
    const j = getServicePay("prison-officer", slug)!;
    assert.equal(entrySalary(j), entry, `${slug} entry`);
    assert.equal(topSalary(j), top, `${slug} top`);
  }
  const wa = getServicePay("prison-officer", "wa")!;
  assert.equal(wa.scales.find((s) => s.id === "prison-officer-shift")!.steps[0].salary, 97_610);
  const tas = getServicePay("prison-officer", "tas")!;
  assert.equal(tas.scales.find((s) => s.id === "correctional-officer-shift")!.steps[0].salary, 92_677);
});
