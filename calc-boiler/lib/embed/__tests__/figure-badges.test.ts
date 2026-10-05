import { test } from "node:test";
import assert from "node:assert/strict";
import { BADGE_URL, FIGURE_BADGES, badgeEmbedCode, badgeHtml, isBadgeId } from "../figure-badges";
import { EMPLOYMENT, HECS_HELP, SUPER_GUARANTEE, TAX_FREE_THRESHOLD } from "../../constants/australian-tax";

function badge(id: string) {
  return FIGURE_BADGES.find((b) => b.id === id)!;
}

test("badge values come from the single source", () => {
  assert.equal(badge("minimum-wage").value, `$${EMPLOYMENT.minimumWageHourly.toFixed(2)} an hour`);
  assert.match(badge("minimum-wage").detail, /\$1,004\.90/);
  assert.equal(badge("super-guarantee").value, `${SUPER_GUARANTEE.rate * 100}%`);
  assert.equal(badge("tax-free-threshold").value, `$${TAX_FREE_THRESHOLD.toLocaleString("en-AU")}`);
  assert.equal(badge("help-threshold").value, `$${HECS_HELP.minimumThreshold.toLocaleString("en-AU")}`);
});

test("document renders every badge with a credit link and is noindex", () => {
  const html = badgeHtml();
  for (const b of FIGURE_BADGES) {
    assert.ok(html.includes(`data-f="${b.id}"`), b.id);
    assert.ok(html.includes(`href="${b.href}"`), b.id);
  }
  assert.match(html, /noindex/);
  assert.equal(badgeHtml(), html);
});

test("embed code carries the iframe and a visible credit link", () => {
  const code = badgeEmbedCode("minimum-wage");
  assert.ok(code.includes(`${BADGE_URL}?figure=minimum-wage`));
  assert.ok(code.includes('<a href="https://pay-calculator-australia.com/minimum-wage-australia/">'));
});

test("isBadgeId is strict", () => {
  assert.equal(isBadgeId("minimum-wage"), true);
  assert.equal(isBadgeId("<script>"), false);
  assert.equal(isBadgeId(null), false);
});
