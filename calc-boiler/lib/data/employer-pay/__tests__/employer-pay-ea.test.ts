// 22 Oct 2026: "{Employer} enterprise agreement 2026" sections on the top
// employer pages. Pins the data shape the page renders, the FAQ pair the
// FAQPage schema picks up, the copy rules, and the facts read from the FWC
// approval decisions on 22 October 2026.

import assert from "node:assert/strict";
import { test } from "node:test";

import { getEmployerPay, roundCents, type EmployerPay, type EnterpriseAgreementFacts } from "../index";

const EA_SLUGS = ["woolworths", "coles", "bunnings", "mcdonalds", "kmart", "kfc", "big-w", "target"] as const;

function get(slug: string): EmployerPay {
  const e = getEmployerPay(slug);
  assert.ok(e, slug);
  return e;
}

function section(slug: string): { e: EmployerPay; ea: EnterpriseAgreementFacts } {
  const e = get(slug);
  assert.ok(e.enterpriseAgreement, `${slug}: no enterpriseAgreement`);
  return { e, ea: e.enterpriseAgreement };
}

/** Every string the section and the FAQ put on the page. */
function sectionText(e: EmployerPay, ea: EnterpriseAgreementFacts): string[] {
  return [
    ea.statusNote,
    ea.aboveAward,
    ...ea.whatItMeans,
    ...ea.payRises.flatMap((r) => [r.date, r.amount, r.source]),
    ea.decision.citation,
    ea.underlyingAward.title,
    ...e.faqs.flatMap((f) => [f.q, f.a]),
    e.nextIncrease?.date ?? "",
    e.nextIncrease?.detail ?? "",
  ];
}

/** Everything else a reader sees on the page, for the em-dash rule. */
function pageText(e: EmployerPay): string[] {
  return [
    e.instrument.coverage,
    e.instrument.approvedOn ?? "",
    e.instrument.nominalExpiry ?? "",
    e.juniorNote,
    e.casualRateNote ?? "",
    ...e.notices,
    ...e.unverified,
    ...e.penaltyNotes,
    ...e.penalties.flatMap((p) => [p.when, p.permanent, p.casual, p.note ?? ""]),
    ...e.overtime.flatMap((p) => [p.when, p.permanent, p.casual, p.note ?? ""]),
    ...e.rates.map((r) => `${r.level} ${r.description}`),
    ...e.sources.map((s) => s.title),
  ];
}

// brand-identity.md forbidden words, plus the AI-style phrases the brief bans.
const FORBIDDEN =
  /\b(guarantee|hack|guru|synergy|utili[sz]e|leverage|best-in-class|cutting-edge|revolutionary|disrupting|seamlessly|actionable|delve|navigate|landscape|unlock|comprehensive)\b|in today's|it's important to note|whether you're/i;

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

test("each of the eight top employer pages has a complete enterprise agreement section", () => {
  for (const slug of EA_SLUGS) {
    const { e, ea } = section(slug);
    assert.equal(ea.verifiedOn, "22 October 2026", slug);
    assert.match(ea.decision.url, /^https:\/\/www\.fwc\.gov\.au\//, `${slug}: decision must be on fwc.gov.au`);
    assert.ok(ea.decision.citation.length > 10, slug);
    assert.match(ea.underlyingAward.code, /^MA\d{6}$/, slug);
    assert.match(ea.underlyingAward.url, /^https:\/\/awards\.fairwork\.gov\.au\/MA\d{6}\.html$/, slug);
    assert.ok(ea.statusNote.length > 40, slug);
    assert.ok(ea.aboveAward.length > 80, slug);
    assert.ok(ea.whatItMeans.length >= 2 && ea.whatItMeans.length <= 4, `${slug}: 2 to 4 sentences`);
    for (const s of ea.whatItMeans) assert.match(s, /\.$/, `${slug}: "${s}" should be a sentence`);
    for (const r of ea.payRises) {
      assert.ok(r.date.length > 5 && r.amount.length > 1 && r.source.length > 5, `${slug}: ${r.date}`);
    }
    // Paid rises come first, in date order; nothing paid sits after a future rise.
    const firstUnpaid = ea.payRises.findIndex((r) => !r.paid);
    if (firstUnpaid >= 0) {
      assert.ok(ea.payRises.slice(firstUnpaid).every((r) => !r.paid), `${slug}: paid rise listed after a future one`);
    }
    // The section's "next pay rise" row reads e.nextIncrease, so it must exist unless nothing is scheduled.
    const future = ea.payRises.filter((r) => !r.paid);
    if (future.length > 0) assert.ok(e.nextIncrease, `${slug}: future rises but nextIncrease is null`);
    assert.ok(e.sources.some((s) => s.url === ea.decision.url), `${slug}: decision must be listed in sources`);
  }
});

test("status matches the instrument", () => {
  for (const slug of EA_SLUGS) {
    const { e, ea } = section(slug);
    if (ea.status === "no-agreement") {
      assert.equal(e.instrument.kind, "modern-award", slug);
      assert.equal(ea.commencedOn, undefined, slug);
      assert.equal(ea.underlyingAward.code, e.instrument.reference, slug);
      assert.equal(e.awardHref, undefined, `${slug}: the instrument is the award`);
    } else {
      assert.equal(e.instrument.kind, "enterprise-agreement", slug);
      assert.ok(ea.commencedOn, slug);
      assert.ok(e.instrument.approvedOn, slug);
      assert.ok(e.instrument.nominalExpiry, slug);
      assert.match(e.instrument.reference, /AG\d{4}\/\d+, AE\d{6}/, slug);
    }
    if (ea.status === "past-nominal-expiry" || ea.status === "replacement-before-fwc") {
      assert.match(e.instrument.nominalExpiry ?? "", /passed/, `${slug}: expiry must say it has passed`);
    }
    if (ea.status === "in-term") {
      assert.doesNotMatch(e.instrument.nominalExpiry ?? "", /passed/, slug);
    }
    // The underlying award matches the on-site award page the data already links.
    if (e.awardHref === "/retail-award-rates/") assert.equal(ea.underlyingAward.code, "MA000004", slug);
    if (e.awardHref === "/fast-food-award-rates/") assert.equal(ea.underlyingAward.code, "MA000003", slug);
  }
});

// ---------------------------------------------------------------------------
// FAQ pair for the FAQPage schema
// ---------------------------------------------------------------------------

test("each page answers the two agreement questions once, and the old wording is gone", () => {
  for (const slug of EA_SLUGS) {
    const { e } = section(slug);
    const questions = e.faqs.map((f) => f.q);
    assert.equal(new Set(questions).size, questions.length, `${slug}: duplicate FAQ question`);
    assert.ok(questions.includes(`Is ${e.name} paid above the award?`), `${slug}: above-award FAQ`);
    assert.ok(questions.includes(`When is the next ${e.name} pay rise?`), `${slug}: next-rise FAQ`);
    assert.ok(!questions.some((q) => /pay more than the award/i.test(q)), `${slug}: old above-award FAQ should be renamed, not duplicated`);
    for (const f of e.faqs) assert.ok(f.a.length > 60, `${slug}: thin answer to "${f.q}"`);
  }
});

// ---------------------------------------------------------------------------
// Copy rules
// ---------------------------------------------------------------------------

test("no em dashes or forbidden words in the section, the FAQ or the rest of the page copy", () => {
  for (const slug of EA_SLUGS) {
    const { e, ea } = section(slug);
    for (const s of [...sectionText(e, ea), ...pageText(e)]) {
      assert.ok(!s.includes("—"), `${slug}: em dash in "${s.slice(0, 80)}"`);
    }
    for (const s of sectionText(e, ea)) {
      assert.doesNotMatch(s, FORBIDDEN, `${slug}: forbidden word in "${s.slice(0, 80)}"`);
      // brand-identity.md: no "always"/"never" in advice copy.
      assert.doesNotMatch(s, /\b(always|never)\b/i, `${slug}: "${s.slice(0, 80)}"`);
    }
  }
});

// ---------------------------------------------------------------------------
// Facts read from the FWC on 22 October 2026
// ---------------------------------------------------------------------------

const EXPECTED: Record<(typeof EA_SLUGS)[number], { reference: string; commencedOn?: string; expiry: string; status: EnterpriseAgreementFacts["status"]; citation: string; award: string }> = {
  woolworths: { reference: "AG2024/2300, AE525523", commencedOn: "21 October 2024", expiry: "17 April 2028", status: "in-term", citation: "[2024] FWCFB 314", award: "MA000004" },
  coles: { reference: "AG2024/1124, AE524516", commencedOn: "7 October 2024", expiry: "3 May 2028", status: "in-term", citation: "[2024] FWCFB 250", award: "MA000004" },
  bunnings: { reference: "AG2023/1996, AE520766", commencedOn: "13 November 2023", expiry: "31 August 2026", status: "replacement-before-fwc", citation: "[2023] FWCFB 125", award: "MA000004" },
  mcdonalds: { reference: "MA000003", expiry: "", status: "no-agreement", citation: "[2019] FWCA 8563", award: "MA000003" },
  kmart: { reference: "AG2024/3872, AE526796", commencedOn: "10 March 2025", expiry: "17 November 2028", status: "in-term", citation: "[2024] FWCA 4020", award: "MA000004" },
  kfc: { reference: "AG2019/4042, AE507798", commencedOn: "29 April 2020", expiry: "29 April 2024", status: "past-nominal-expiry", citation: "[2020] FWCA 2020", award: "MA000003" },
  "big-w": { reference: "AG2023/5064, AE523762", commencedOn: "20 May 2024", expiry: "1 October 2027", status: "in-term", citation: "[2024] FWCA 849", award: "MA000004" },
  target: { reference: "AG2022/5310, AE519106", commencedOn: "15 February 2023", expiry: "7 February 2027", status: "in-term", citation: "PR750306", award: "MA000004" },
};

test("agreement codes, dates, status and decision match the FWC record", () => {
  for (const slug of EA_SLUGS) {
    const { e, ea } = section(slug);
    const x = EXPECTED[slug];
    assert.equal(e.instrument.reference, x.reference, slug);
    assert.equal(ea.commencedOn, x.commencedOn, slug);
    if (x.expiry) assert.ok((e.instrument.nominalExpiry ?? "").startsWith(x.expiry), `${slug}: expiry ${e.instrument.nominalExpiry}`);
    assert.equal(ea.status, x.status, slug);
    assert.ok(ea.decision.citation.includes(x.citation), `${slug}: ${ea.decision.citation}`);
    assert.ok(ea.aboveAward.includes(x.citation), `${slug}: aboveAward should cite the decision`);
    assert.equal(ea.underlyingAward.code, x.award, slug);
  }
});

test("FWC above-award findings are quoted where the decision states them", () => {
  assert.match(section("woolworths").ea.aboveAward, /only marginally in excess of those in the Award/);
  assert.match(section("coles").ea.aboveAward, /a relatively small one/);
  assert.match(section("bunnings").ea.aboveAward, /14\.67 per cent to 20\.4 per cent/);
  assert.match(section("big-w").ea.aboveAward, /0\.44% and 1\.87% above the Award/);
  assert.match(section("kfc").ea.aboveAward, /0\.25% over the award rate/);
  // Kmart and Target decisions state no margin, so the section gives the agreement's formula instead.
  assert.match(section("kmart").ea.aboveAward, /plus 15 cents an hour/);
  assert.match(section("target").ea.aboveAward, /plus 5 cents an hour/);
  assert.match(section("mcdonalds").ea.aboveAward, /no above-award margin/);
});

test("Bunnings: the 2023 agreement stays on the page while the voted-up 2026 agreement is before the FWC", () => {
  const { e, ea } = section("bunnings");
  // Rate table is still the 2023 agreement's September 2025 column.
  assert.equal(e.rates[0].hourly, 28.64);
  assert.equal(e.instrument.title, "Bunnings Retail Enterprise Agreement 2023");
  // The proposed first rise is 4.25% on the Team Member rate, as Appendix 2 prints it.
  assert.equal(roundCents(28.64 * 1.0425), 29.86);
  assert.equal(roundCents(29.86 * 1.225), 36.58);
  assert.ok(e.nextIncrease, "nextIncrease");
  assert.match(e.nextIncrease.date, /26 October 2026/);
  assert.match(e.nextIncrease.detail, /\$29\.86/);
  assert.match(e.nextIncrease.detail, /approv/i);
  const first = ea.payRises.find((r) => r.date.includes("26 October 2026"));
  assert.ok(first && !first.paid, "proposed rise is not marked paid");
  assert.match(first.amount, /4\.25%/);
  assert.match(first.source, /subject to Fair Work Commission approval/);
  const later = ea.payRises.filter((r) => /1 July 202[78]/.test(r.date));
  assert.equal(later.length, 2);
  for (const r of later) assert.equal(r.amount, "3.25%");
  assert.match(ea.statusNote, /68% yes/);
  assert.match(ea.statusNote, /31 July 2029/);
  // The stale "we could not confirm" line is gone and the notice points to the section.
  assert.ok(!e.unverified.some((u) => /could not confirm/.test(u)));
  assert.ok(e.notices.some((n) => /Bunnings Retail Enterprise Agreement 2026/.test(n)));
});

test("McDonald's: no agreement, award rises only, bargaining status dated", () => {
  const { e, ea } = section("mcdonalds");
  assert.equal(ea.status, "no-agreement");
  assert.ok(ea.payRises.some((r) => r.date.includes("1 December 2026") && /75%, 85% and 95%/.test(r.amount)));
  assert.match(ea.statusNote, /\[2026\] FCAFC 93/);
  assert.match(ea.statusNote, /22 October 2026/);
  assert.ok(!e.instrument.coverage.includes("by September 2026"), "coverage was re-dated");
  assert.ok(!e.faqs.some((f) => f.a.includes("by September 2026")), "FAQ was re-dated");
});

test("KFC: still on the 2020 agreement, replacement check dated 22 October 2026", () => {
  const { e, ea } = section("kfc");
  assert.equal(ea.status, "past-nominal-expiry");
  assert.match(ea.statusNote, /22 October 2026/);
  assert.ok(!e.notices.some((n) => /as at September 2026/.test(n)), "notice was re-dated");
  assert.ok(!e.faqs.some((f) => /by September 2026/.test(f.a)), "FAQ was re-dated");
});
