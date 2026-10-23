// <title> and meta description templates for /job-pay-rates/[occupation]/.
//
// Meta intent pass, 23 Oct 2026. Search Console (24 Sep to 21 Oct) showed
// these pages searched as "<job> pay rate", "<job> award rate", "<job> salary"
// and "<job> hourly rate", ranking 6 to 9 with CTR mostly under 1%. The title
// now leads with the singular search term and answers both the hourly and the
// yearly question; the description adds take-home pay, which the job-board
// results above us do not show. Every figure is read from the occupation data
// and the same tax engine the page hero uses (afterTax on rowAnnual).

import { formatAUD } from "../../constants";
import { DESCRIPTION_MAX, fitDescription, fitTitle } from "../../seo-title";
import { afterTax, headlineRow, rowAnnual } from "./index";
import type { Occupation } from "./types";

const money = (n: number) => formatAUD(n, 2);

/**
 * Pages whose September title already earned at or above a normal CTR for
 * their position (engineer 2.19% at 6.3, medical receptionist 1.96% at 5.9):
 * kept in that form rather than churned.
 */
const KEEP_SEPTEMBER_FORM = new Set<string>(["engineer", "medical-receptionist"]);

function septemberTitle(occ: Occupation, hourly: string): string {
  const forms = [
    `${occ.name} Pay Rates Australia 2026 - ${hourly} Award Minimum`,
    `${occ.name} Pay Rates Australia 2026 - ${hourly} Minimum`,
    `${occ.name} Pay Rates 2026 - ${hourly} Award Minimum`,
    `${occ.name} Pay Rates 2026 - ${hourly} Minimum`,
  ];
  return forms.find((t) => t.length <= 65) ?? forms[forms.length - 1];
}

function septemberDescription(occ: Occupation): string {
  const r = headlineRow(occ)!;
  const award = occ.award!;
  const rates = `${money(r.hourly)}/hr, ${money(r.weekly)}/wk${r.casualHourly !== null ? `, casual ${money(r.casualHourly)}/hr` : ""}`;
  return fitDescription(
    `${occ.name} award pay rates for 2026–27 under the ${award.name} [${award.code}]: ${rates}. Every classification, penalty rates, overtime and take-home pay. Verified ${occ.verifiedOn}.`,
    `${occ.name} award pay rates for 2026–27 under the ${award.name} [${award.code}]: ${rates}. Every classification, penalty rates and take-home pay.`,
    `${occ.name} award pay rates for 2026–27: ${rates} under the ${award.name}. Penalty rates and take-home pay.`,
    `${occ.name} award pay rates for 2026–27: ${rates} under ${award.code}. Every classification, penalty rates and take-home pay.`,
    `${occ.name} award pay rates for 2026–27: ${rates} under ${award.code}. Penalty rates and take-home pay.`,
  );
}

/** The <title>, or null when the page has neither an award row nor a median (the caller falls back to the H1). */
export function occupationMetaTitle(occ: Occupation): string | null {
  if (occ.metaTitle) return occ.metaTitle;
  const r = headlineRow(occ);
  if (r) {
    const hourly = `${money(r.hourly)}/hr`;
    if (KEEP_SEPTEMBER_FORM.has(occ.slug)) return septemberTitle(occ, hourly);
    const head = `${occ.name} ${occ.metaTerm === "salary" ? "Salary" : "Pay Rate"}`;
    const annual = formatAUD(rowAnnual(r));
    // Fullest form that fits: "Australia" goes first, then "Award", then the annual figure.
    return fitTitle(
      `${head} Australia 2026-27: ${hourly} Award, ${annual} a Year`,
      `${head} 2026-27: ${hourly} Award, ${annual} a Year`,
      `${head} 2026-27: ${hourly}, ${annual} a Year`,
      `${head} 2026-27: ${hourly}, ${annual}/yr`,
      `${head} 2026-27: ${hourly} Award Minimum`,
      `${head} 2026-27: ${hourly} Minimum`,
    );
  }
  if (occ.median) {
    const median = `${formatAUD(occ.median.medianWeekly)}/wk Median`;
    return fitTitle(
      `${occ.name} Pay Rates Australia 2026 - No Award, ${median}`,
      `${occ.name} Pay Rates 2026 - No Award, ${median}`,
      `${occ.name} Pay Rates 2026 - ${median}`,
    );
  }
  return null;
}

export function occupationMetaDescription(occ: Occupation): string {
  if (occ.metaDescription) return occ.metaDescription;
  const r = headlineRow(occ);
  if (r && occ.award) {
    if (KEEP_SEPTEMBER_FORM.has(occ.slug)) return septemberDescription(occ);
    // Answer first: the hourly and yearly minimum and what it leaves after tax
    // (the hero's own figure), then what the page lists.
    const annual = rowAnnual(r);
    const net = formatAUD(afterTax(annual).netWeekly);
    const lead = `${occ.name} ${occ.metaTerm ?? "pay rate"} 2026-27: ${money(r.hourly)} an hour or ${formatAUD(annual)} a year`;
    const tail = `about ${net} a week after tax.`;
    const leads = [`${lead} full-time, ${tail}`, `${lead}, ${tail}`];
    const rest =
      r.casualHourly !== null
        ? [
            ` See the casual rate (${money(r.casualHourly)}/hr), every award level and penalty rates.`,
            ` See the casual rate (${money(r.casualHourly)}/hr) and every award level.`,
            ` See the casual rate (${money(r.casualHourly)}/hr).`,
          ]
        : [` See every award level, penalty rates and overtime.`, ` See every award level and penalty rates.`, ""];
    const forms = [...rest.flatMap((x) => leads.map((l) => `${l}${x}`)), leads[1]];
    // Aim for 140 to 160 characters (what most snippets show); 165 is the hard limit.
    return (
      forms.find((d) => d.length >= 140 && d.length <= 160) ??
      forms.find((d) => d.length <= DESCRIPTION_MAX) ??
      fitDescription(...forms)
    );
  }
  return fitDescription(
    `Is there an award for ${occ.plural}? What the law requires (the National Minimum Wage), the ${occ.median ? `${formatAUD(occ.median.medianWeekly)} a week median` : "market median"}, and take-home pay. Verified ${occ.verifiedOn}.`,
    `Is there an award for ${occ.plural}? What the law requires (the National Minimum Wage), the ${occ.median ? `${formatAUD(occ.median.medianWeekly)} a week median` : "market median"}, and take-home pay.`,
  );
}
