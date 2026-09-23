import assert from "node:assert/strict";
import { test } from "node:test";

import { calculatePayBreakdown } from "../../constants/australian-tax";
import { EMBED_DATA, EMBED_ENGINE_JS, type EmbedResult } from "../take-home-engine";
import { EMBED_CANONICAL, embedCode, takeHomeWidgetHtml } from "../take-home-widget-html";

// Evaluate the exact string the widget ships, with the exact JSON it ships.
const data = JSON.parse(JSON.stringify(EMBED_DATA));
const engine = new Function(`${EMBED_ENGINE_JS}; return pcaTakeHome;`)() as (
  d: unknown,
  salary: number,
  hecs: boolean,
  superIncluded: boolean,
) => EmbedResult;

const salaries: number[] = [];
for (let s = 0; s <= 400_000; s += 997) salaries.push(s);
salaries.push(18_200, 18_201, 22_866, 28_011, 35_013, 37_500, 45_000, 45_001, 66_667, 69_528, 69_529, 129_717, 129_718, 135_000, 186_050, 186_051, 190_000, 270_830, 303_330, 52_254.8, 26.44 * 1976);

test("embed engine matches calculatePayBreakdown to the dollar", () => {
  for (const s of salaries) {
    for (const hecs of [false, true]) {
      for (const superIncluded of [false, true]) {
        const site = calculatePayBreakdown({ grossSalary: s, includeHECS: hecs, superIncluded });
        const w = engine(data, s, hecs, superIncluded);
        const label = `${s} hecs=${hecs} super=${superIncluded}`;
        assert.equal(w.takeHome, site.takeHomePay, `take-home ${label}`);
        assert.equal(w.incomeTax, site.netIncomeTax, `tax ${label}`);
        assert.equal(w.medicare, site.medicareLevy, `medicare ${label}`);
        assert.equal(w.hecs, site.hecsRepayment, `hecs ${label}`);
        assert.equal(w.superAmount, site.superContribution, `super ${label}`);
        assert.equal(w.gross, site.grossSalary, `gross ${label}`);
      }
    }
  }
});

test("embed HTML is standalone, noindex, canonical to the calculator, and credits the site", () => {
  const html = takeHomeWidgetHtml();
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.ok(html.includes(`<link rel="canonical" href="${EMBED_CANONICAL}">`));
  assert.ok(html.includes(`href="${EMBED_CANONICAL}"`));
  // No third-party requests: no external scripts, stylesheets or ad origins.
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+stylesheet/);
  assert.doesNotMatch(html, /highperformanceformat|googletagmanager|adsterra/i);
  assert.ok(html.includes(`"fy":"${EMBED_DATA.fy}"`));
  // The inline script must at least parse.
  const script = html.split("<script>")[1].split("</script>")[0];
  assert.doesNotThrow(() => new Function(script));
});

test("embed code carries a visible credit link outside the iframe", () => {
  const code = embedCode();
  assert.match(code, /^<iframe [^>]*src="https:\/\/pay-calculator-australia\.com\/embed\/take-home-pay\/"/);
  const afterIframe = code.split("</iframe>")[1];
  assert.ok(afterIframe.includes(`<a href="${EMBED_CANONICAL}">`));
  assert.ok(!code.includes("?utm"), "credit link must stay a clean, crawlable URL");
  assert.ok(embedCode({ salary: 90000 }).includes("?salary=90000"));
});
