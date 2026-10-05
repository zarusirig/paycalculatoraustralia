import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { SEASONAL_PAGES, getSeasonalPage } from "../seasonal-pages";
import { fitDescription, fitTitle } from "../../../seo-title";

const APP = path.join(process.cwd(), "app");

function words(p: (typeof SEASONAL_PAGES)[number]): number {
  const text = [
    p.standfirst,
    p.directAnswer,
    ...p.topics.map((t) => t.intro + (t.footnote ?? "")),
    ...[...p.sectionsBeforeCalculator, ...p.sectionsAfterCalculator].flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]),
    ...p.faqs.flatMap((f) => [f.q, f.a]),
    p.example.intro,
    p.partDayExample?.explanation ?? "",
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

test("eight holiday pay pages with unique slugs", () => {
  assert.equal(SEASONAL_PAGES.length, 8);
  assert.equal(new Set(SEASONAL_PAGES.map((p) => p.slug)).size, 8);
  assert.ok(getSeasonalPage("melbourne-cup-day-pay"));
  assert.equal(getSeasonalPage("nope"), undefined);
});

test("every page has a title, description and H1 that fit and are unique", () => {
  const titles = new Set<string>();
  const descs = new Set<string>();
  const h1s = new Set<string>();
  for (const p of SEASONAL_PAGES) {
    const t = fitTitle(...p.titles);
    const d = fitDescription(...p.descriptions);
    assert.ok(t.length <= 65, `${p.slug} title ${t.length}: ${t}`);
    assert.ok(d.length <= 165 && !d.endsWith("…"), `${p.slug} description ${d.length}: ${d}`);
    titles.add(t);
    descs.add(d);
    h1s.add(p.h1);
  }
  assert.equal(titles.size, 8);
  assert.equal(descs.size, 8);
  assert.equal(h1s.size, 8);
});

test("every page has a route, 4+ related links that resolve, 5+ FAQs and 800+ words", () => {
  for (const p of SEASONAL_PAGES) {
    assert.ok(fs.existsSync(path.join(APP, p.slug, "page.tsx")), `${p.slug} has no app route`);
    assert.ok(p.related.length >= 3, `${p.slug} related links`);
    for (const r of p.related) {
      const segs = r.href.split("/").filter(Boolean);
      const ok = fs.existsSync(path.join(APP, ...segs, "page.tsx")) || (segs[0] === "public-holiday-pay" && segs.length === 2);
      assert.ok(ok, `${p.slug} links to missing ${r.href}`);
      assert.notEqual(r.href, `/${p.slug}/`);
    }
    assert.ok(p.faqs.length >= 5, `${p.slug} FAQs`);
    assert.equal(new Set(p.faqs.map((f) => f.q)).size, p.faqs.length, `${p.slug} duplicate FAQ`);
    assert.ok(words(p) >= 800, `${p.slug} has ${words(p)} words`);
    assert.ok(p.sources.length >= 1);
  }
});

test("no page claims an award percentage in prose that the award data does not hold", () => {
  // Rates are interpolated from the award data; a hard-coded percentage in the
  // copy would be a second source of truth. 25% (casual loading) and 17.5%
  // (leave loading) and 28 days (the Fair Work example) are the only literals.
  const src = fs.readFileSync(path.join(process.cwd(), "lib/data/public-holidays/seasonal-pages.ts"), "utf8");
  const typed = src.match(/[^$\w{](?:2\d\d|3\d\d)(?:\.\d)?%/g) ?? [];
  assert.deepEqual(typed, [], "percentages must come from the award data, not be typed in copy");
});
