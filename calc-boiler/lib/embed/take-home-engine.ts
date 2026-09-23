// =============================================================================
// Embeddable take-home pay widget — engine and data (F8, Lever D).
//
// The widget at /embed/take-home-pay/ is a standalone HTML document served by
// a route handler, so it can run inside third-party iframes without the site
// layout, ads or popunder. Its calculator is plain ES5 in EMBED_ENGINE_JS,
// fed by EMBED_DATA, which is built from australian-tax.ts at build time.
//
// The test (lib/embed/__tests__/take-home-engine.test.ts) evaluates this exact
// string and proves it matches calculatePayBreakdown to the dollar across the
// income range, with and without HECS and super-inclusive packages — so the
// widget cannot drift from the site's own calculator.
// =============================================================================

import {
  EMPLOYMENT,
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS_2026_27,
} from "../constants/australian-tax";

const finite = (n: number) => (Number.isFinite(n) ? n : null);

export const EMBED_DATA = {
  fy: SITE_CONFIG.financialYear,
  hoursPerWeek: EMPLOYMENT.standardWeeklyHours,
  brackets: TAX_BRACKETS_2026_27.map((b) => ({ min: b.min, rate: b.rate, base: b.base })),
  lito: {
    max: LITO.maxOffset,
    full: LITO.fullOffsetCeiling,
    p1End: LITO.phaseOut1.end,
    p1Rate: LITO.phaseOut1.rate,
    p2End: LITO.phaseOut2.end,
    p2Rate: LITO.phaseOut2.rate,
  },
  medicare: { rate: MEDICARE_LEVY.rate, low: MEDICARE_LEVY.lowIncomeThreshold, shade: MEDICARE_LEVY.shadeInRate },
  hecs: {
    min: HECS_HELP.minimumThreshold,
    bands: HECS_HELP.bands.map((b) => ({ min: b.min, max: finite(b.max), rate: b.marginalRate, base: b.base })),
  },
  sg: { rate: SUPER_GUARANTEE.rate, maxBase: SUPER_GUARANTEE.maxContributionBaseAnnual },
} as const;

export type EmbedData = typeof EMBED_DATA;

export interface EmbedResult {
  gross: number;
  taxable: number;
  incomeTax: number;
  medicare: number;
  hecs: number;
  takeHome: number;
  superAmount: number;
}

/**
 * pcaTakeHome(D, annualSalary, includeHecs, superIncluded) → EmbedResult.
 * Mirrors calculatePayBreakdown for a resident with private health cover
 * (no Medicare levy surcharge) and no salary sacrifice.
 */
export const EMBED_ENGINE_JS = `function pcaTakeHome(D, raw, hecsOn, superIn) {
  raw = Math.max(0, Number(raw) || 0);
  var r = D.sg.rate, cap = D.sg.maxBase;
  var base = raw;
  if (superIn) base = raw / (1 + r) > cap ? Math.round(raw - cap * r) : Math.round(raw / (1 + r));
  var gross = Math.round(base);
  var inc = Math.max(0, gross);
  var tax = 0, i, b;
  if (inc > 0) {
    for (i = D.brackets.length - 1; i >= 0; i--) {
      b = D.brackets[i];
      if (inc >= b.min) { tax = b.base + (inc - (b.min - 1)) * b.rate; break; }
    }
  }
  var L = D.lito, lito = 0;
  if (inc <= L.full) lito = L.max;
  else if (inc <= L.p1End) lito = L.max - (inc - L.full) * L.p1Rate;
  else if (inc <= L.p2End) lito = Math.max(0, L.max - (L.p1End - L.full) * L.p1Rate - (inc - L.p1End) * L.p2Rate);
  var netTax = Math.max(0, Math.round(tax - lito));
  var M = D.medicare, med = 0;
  if (inc > M.low) med = Math.round(Math.min(inc * M.rate, (inc - M.low) * M.shade));
  var hecs = 0, H = D.hecs;
  if (hecsOn && inc > H.min) {
    var top = H.bands[H.bands.length - 1];
    if (inc >= top.min) hecs = Math.round(inc * top.rate);
    else {
      for (i = H.bands.length - 2; i >= 1; i--) {
        b = H.bands[i];
        if (inc >= b.min) { hecs = Math.round(b.base + (inc - (b.min - 1)) * b.rate); break; }
      }
    }
  }
  var sup = superIn ? Math.round(raw - base) : (gross <= 0 ? 0 : Math.round(Math.min(gross, cap) * r));
  return { gross: gross, taxable: inc, incomeTax: netTax, medicare: med, hecs: hecs, takeHome: inc - netTax - med - hecs, superAmount: sup };
}`;
