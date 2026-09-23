import assert from "node:assert/strict";
import { test } from "node:test";

import {
  EMPLOYERS,
  EMPLOYER_PAY_BY_SLUG,
  EMPLOYER_SLUGS,
  EXAMPLE_HOURS,
  annualFullTime,
  deriveJuniorHourly,
  entryRate,
  formatPct,
  getEmployerPay,
  hourlyToSalaryLink,
  isEmployerSlug,
  juniorRates,
  roundCents,
  takeHomeHrefForHourly,
  topRate,
  weeklyExamples,
} from "../index";
import { HOURLY_RATE_PAGES } from "../../../constants/hourly-rates";

// ---------------------------------------------------------------------------
// Registry integrity
// ---------------------------------------------------------------------------

test("every slug is registered, and registered under its own slug", () => {
  assert.equal(EMPLOYERS.length, EMPLOYER_SLUGS.length);
  for (const slug of EMPLOYER_SLUGS) {
    assert.equal(EMPLOYER_PAY_BY_SLUG[slug].slug, slug);
    assert.equal(getEmployerPay(slug)?.slug, slug);
    assert.ok(isEmployerSlug(slug));
  }
  assert.equal(getEmployerPay("not-an-employer"), undefined);
  assert.equal(isEmployerSlug("coles/"), false);
});

test("slugs are URL-safe and unique", () => {
  assert.equal(new Set(EMPLOYER_SLUGS).size, EMPLOYER_SLUGS.length);
  for (const slug of EMPLOYER_SLUGS) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

// ---------------------------------------------------------------------------
// Data sanity — catches transcription slips, not policy.
// ---------------------------------------------------------------------------

/** 1 July 2026 adult National Minimum Wage, NMW Order 2026 (PR799279). */
const NMW_ADULT_HOURLY = 26.44;

for (const e of EMPLOYERS) {
  test(`${e.slug}: provenance fields are filled in`, () => {
    assert.ok(e.instrument.title.length > 5);
    assert.ok(e.instrument.reference.length > 3);
    assert.match(e.instrument.url, /^https:\/\//);
    assert.match(e.verifiedOn, /2026$/);
    assert.ok(e.ratesEffectiveFrom.length > 0);
    assert.ok(e.sources.length >= 1, "at least one source");
    for (const s of e.sources) assert.match(s.url, /^https?:\/\//);
    if (e.instrument.kind === "modern-award") {
      assert.match(e.instrument.reference, /MA\d{6}/);
    } else {
      assert.match(e.instrument.reference, /AG\d{4}\/\d+|AE\d{6}/);
    }
  });

  test(`${e.slug}: adult rates are at or above the adult National Minimum Wage`, () => {
    assert.ok(e.rates.length >= 1);
    for (const r of e.rates) {
      assert.ok(r.hourly >= NMW_ADULT_HOURLY, `${r.level} ${r.hourly} below NMW`);
      assert.ok(r.hourly < 100, `${r.level} ${r.hourly} implausible`);
    }
  });

  test(`${e.slug}: the entry rate is the lowest rate and levels are unique`, () => {
    const min = Math.min(...e.rates.map((r) => r.hourly));
    assert.equal(e.rates[0].hourly, min);
    assert.equal(new Set(e.rates.map((r) => r.level)).size, e.rates.length);
    assert.equal(entryRate(e), e.rates[0]);
    assert.ok(topRate(e).hourly >= entryRate(e).hourly);
  });

  test(`${e.slug}: casual rate equals base plus the stated loading, to the cent`, () => {
    // H1: instruments with their own casual formula are re-derived in their own test.
    if (e.casualRateNote) return;
    for (const r of e.rates) {
      const expected = roundCents(r.hourly * (1 + e.casualLoading));
      assert.ok(
        // Integer cents: publishers (e.g. the SDA) apply the loading to the
        // unrounded base, so allow one cent of drift.
        Math.abs(Math.round(r.casualHourly * 100) - Math.round(expected * 100)) <= 1,
        `${r.level}: casual ${r.casualHourly} vs ${expected}`,
      );
    }
  });

  test(`${e.slug}: weekly rate, where published, divides back to the hourly rate`, () => {
    for (const r of e.rates) {
      if (r.weekly === undefined) continue;
      // J7: salaried cabin crew divide by their own full-time hours.
      const cents = Math.round(roundCents(r.weekly / (e.fullTimeWeeklyHours ?? 38)) * 100) - Math.round(r.hourly * 100);
      assert.ok(Math.abs(cents) <= 1, `${r.level}`);
    }
  });

  test(`${e.slug}: junior scale is ascending and ends at 100%`, () => {
    if (e.juniorScale.length === 0) return;
    for (let i = 1; i < e.juniorScale.length; i++) {
      assert.ok(e.juniorScale[i].percentage >= e.juniorScale[i - 1].percentage);
    }
    assert.equal(e.juniorScale[e.juniorScale.length - 1].percentage, 1);
    for (const b of e.juniorScale) assert.ok(b.percentage > 0 && b.percentage <= 1);
  });

  test(`${e.slug}: FAQs and penalties are present`, () => {
    assert.ok(e.faqs.length >= 3);
    assert.ok(e.penalties.length >= 3);
    for (const f of e.faqs) {
      assert.ok(f.q.endsWith("?"), f.q);
      assert.ok(f.a.length > 20);
    }
  });
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

test("junior derivation applies the percentage to the weekly rate when there is one", () => {
  // Fast Food Level 1 style: weekly 1,004.90 → 26.44/hr. 57.8% via weekly = 15.29.
  const row = { level: "L1", description: "", hourly: 26.44, casualHourly: 33.05, weekly: 1004.9 };
  assert.equal(deriveJuniorHourly(row, 0.578), 15.29);
  const hourlyOnly = { level: "L1", description: "", hourly: 26.44, casualHourly: 33.05 };
  assert.equal(deriveJuniorHourly(hourlyOnly, 0.5), 13.22);
});

test("junior rows prefer published dollars and mark derived ones", () => {
  for (const e of EMPLOYERS) {
    const rows = juniorRates(e);
    assert.equal(rows.length, e.juniorScale.length);
    for (const row of rows) {
      const pub = e.publishedJuniorRates?.find((p) => p.age === row.age);
      assert.equal(row.published, Boolean(pub));
      if (pub) {
        assert.equal(row.hourly, pub.hourly);
      } else if (e.derivedJuniorRates?.some((d) => d.age === row.age)) {
        // H1: employer-specific derivation, re-derived in employer-pay-h1.test.ts.
        assert.equal(row.hourly, e.derivedJuniorRates.find((d) => d.age === row.age)?.hourly);
      } else if (e.juniorCasualFromAdultCasual) {
        // H1: junior % applied to the adult casual rate.
        assert.equal(row.casualHourly, roundCents(entryRate(e).casualHourly * row.percentage));
      } else {
        assert.equal(row.casualHourly, roundCents(row.hourly * (1 + e.casualLoading)));
      }
      assert.ok(row.hourly <= entryRate(e).hourly + 0.001);
    }
  }
});

test("weekly examples multiply the entry rate by the example hours", () => {
  for (const e of EMPLOYERS) {
    const xs = weeklyExamples(e);
    assert.deepEqual(xs.map((x) => x.hours), [...EXAMPLE_HOURS]);
    for (const x of xs) {
      assert.equal(x.permanentWeekly, roundCents(entryRate(e).hourly * x.hours));
      assert.ok(x.casualWeekly > x.permanentWeekly);
    }
  }
});

test("annualFullTime is 38 hours x 52 weeks", () => {
  assert.equal(annualFullTime(30), 59_280);
  assert.equal(annualFullTime(26.44), 52_245.44);
});

test("take-home link targets a generated /take-home-pay-on/ page", () => {
  const { href, amount } = takeHomeHrefForHourly(30);
  assert.equal(amount, 60_000);
  assert.equal(href, "/take-home-pay-on/60000/");
  for (const e of EMPLOYERS) {
    const t = takeHomeHrefForHourly(entryRate(e).hourly);
    assert.equal(t.amount % 5_000, 0);
    assert.ok(t.amount >= 30_000 && t.amount <= 200_000);
  }
});

test("hourly-to-salary link always targets a generated page", () => {
  for (const e of EMPLOYERS) {
    for (const r of e.rates) {
      const link = hourlyToSalaryLink(r.hourly);
      assert.ok(HOURLY_RATE_PAGES.includes(link.rate), `${link.rate} not generated`);
      assert.ok(Math.abs(link.rate - r.hourly) <= 0.5);
      assert.match(link.href, /^\/hourly-to-salary\/\d+(-\d{1,2})?\/$/);
    }
  }
  assert.equal(hourlyToSalaryLink(27.81).exact, true); // Retail Level 1 has its own page
});

test("formatPct", () => {
  assert.equal(formatPct(0.25), "25%");
  assert.equal(formatPct(0.578), "57.8%");
  assert.equal(formatPct(1), "100%");
});

// ---------------------------------------------------------------------------
// Agreement formulas. Coles and Woolworths print older rates and index them to
// the Annual Wage Review; Bunnings adds fixed 3% rises. These tests re-derive
// the published figures from the agreements' own tables so a mistyped cent
// cannot slip in.
// ---------------------------------------------------------------------------

const AWR_2025 = 1.035;
const AWR_2026 = 1.0475;

test("Woolworths: 2024 weekly x 1.035 x 1.0475, then / 38", () => {
  const printed2024Weekly: Record<string, number> = {
    "Store Team Member Level 1": 990.56,
    "Store Team Member Level 2": 1012.95,
    "Store Team Member Level 3": 1028.86,
    "Store Team Member Level 4": 1049.01,
    "Store Team Member Level 5": 1091.64,
    "Store Team Member Level 6": 1113.67,
    "Clerical Assistant Level 1": 990.56,
    "Clerical Officer Level 2": 1043.39,
    "Clerical Officer Level 3": 1094.46,
    "Tradesperson Level 4": 1090.25,
    "Tradesperson Level 5": 1108.52,
  };
  const woolworths = getEmployerPay("woolworths");
  assert.ok(woolworths);
  for (const row of woolworths.rates) {
    const w2024 = printed2024Weekly[row.level];
    assert.ok(w2024, row.level);
    const w2026 = roundCents(roundCents(w2024 * AWR_2025) * AWR_2026);
    assert.equal(row.weekly, w2026, row.level);
    assert.equal(row.hourly, roundCents(w2026 / 38), row.level);
  }
});

test("Coles: 2025 rate x 1.0475 (cl 3.4.1, Retail Award Level 1 percentage)", () => {
  const rates2025 = [27.14, 27.79, 28.22, 28.78, 29.95, 30.4];
  const coles = getEmployerPay("coles");
  assert.ok(coles);
  assert.deepEqual(
    coles.rates.map((r) => r.hourly),
    rates2025.map((r) => roundCents(r * AWR_2026)),
  );
});

test("Bunnings: Sep 2023 rate x 1.03 x 1.03 (cl 1.5)", () => {
  const rates2023 = [27.0, 27.43, 28.15, 28.42, 29.01];
  const bunnings = getEmployerPay("bunnings");
  assert.ok(bunnings);
  assert.deepEqual(
    bunnings.rates.map((r) => r.hourly),
    rates2023.map((r) => roundCents(roundCents(r * 1.03) * 1.03)),
  );
  assert.equal(bunnings.casualLoading, 0.225);
});

test("Kmart: Retail Award 1 July 2026 rate for the equivalent level + 15c (cl 8.1.2)", () => {
  // Retail Award MA000004 from 1 July 2026: Level 1, 2, 4, 4, 6.
  const awardEquivalent = [27.81, 28.45, 29.45, 29.45, 31.11];
  const kmart = getEmployerPay("kmart");
  assert.ok(kmart);
  assert.deepEqual(
    kmart.rates.map((r) => r.hourly),
    awardEquivalent.map((r) => roundCents(r + 0.15)),
  );
  // Junior limb (b) — award % on the Kmart base — beats limb (c), award junior + 1c.
  for (const row of juniorRates(kmart)) {
    const awardJuniorPlusCent = roundCents(roundCents((1056.8 * row.percentage) / 38) + 0.01);
    assert.ok(row.hourly >= awardJuniorPlusCent, `${row.age}`);
  }
});

test("award-covered employers match the 1 July 2026 award tables", () => {
  const mcd = getEmployerPay("mcdonalds");
  const cw = getEmployerPay("chemist-warehouse");
  assert.ok(mcd && cw);
  // Fast Food Award cl 15.1 and Pharmacy Award cl 16.1 Level 1 both equal the
  // Retail Award Level 1 weekly rate from 1 July 2026.
  assert.equal(mcd.rates[0].weekly, 1056.8);
  assert.equal(mcd.rates[0].hourly, 27.81);
  assert.equal(cw.rates[0].weekly, 1056.8);
  // Published junior dollars agree with the weekly-then-divide derivation.
  for (const e of [mcd, cw]) {
    for (const band of e.juniorScale) {
      const pub = e.publishedJuniorRates?.find((p) => p.age === band.age);
      assert.ok(pub, `${e.slug} ${band.age}`);
      assert.equal(pub.hourly, deriveJuniorHourly(e.rates[0], band.percentage), `${e.slug} ${band.age}`);
    }
  }
});

// --- T4 (23 Sep 2026): Subway — Fast Food Award, same figures as McDonald's ---
test("Subway pays the Fast Food Award: identical rates, juniors and penalties to McDonald's", () => {
  const subway = getEmployerPay("subway");
  const mcd = getEmployerPay("mcdonalds");
  assert.ok(subway && mcd);
  assert.equal(subway.instrument.kind, "modern-award");
  assert.equal(subway.instrument.reference, "MA000003");
  assert.deepEqual(
    subway.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
    mcd.rates.map((r) => [r.weekly, r.hourly, r.casualHourly]),
  );
  assert.deepEqual(subway.publishedJuniorRates, mcd.publishedJuniorRates);
  assert.deepEqual(
    subway.penalties.map((p) => [p.permanent, p.casual]),
    mcd.penalties.map((p) => [p.permanent, p.casual]),
  );
  assert.equal(subway.awardHref, "/fast-food-award-rates/");
});
// --- end T4 ---
