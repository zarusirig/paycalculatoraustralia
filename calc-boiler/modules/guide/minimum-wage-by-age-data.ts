// Server-safe data for the /minimum-wage-by-age/[age]/ spokes. Kept out of the
// page component so the route's metadata, JSON-LD and body all read the same
// figures. Every number derives from lib/constants/minimum-wage.ts.

import { EMPLOYMENT, SITE_CONFIG, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import {
  MIN_WAGE_AGES,
  SPOKE_HOURS,
  awardBandsForAge,
  nmwRowForAge,
  pendingChangeForAge,
  weeklyPay,
  type AwardBandForAge,
  type MinWageAge,
} from "@/lib/constants/minimum-wage";
import { ADULT_AGE, NMW_ORDER, PENDING_JUNIOR_CHANGE } from "@/lib/constants/junior-rates";
import { fitDescription } from "@/lib/seo-title";

export const money = (v: number) => formatAUD(v, 2);
export const pctLabel = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;

export interface RateLine {
  key: string;
  label: string;
  sublabel: string;
  href: string | null;
  percentage: number;
  hourly: number;
  casualHourly: number;
}

/** NMW row first, then retail (1 or 2 bands), fast food, hospitality. */
export function rateLinesForAge(age: MinWageAge): RateLine[] {
  const nmw = nmwRowForAge(age);
  const lines: RateLine[] = [
    {
      key: "nmw",
      label: "National Minimum Wage (no award)",
      sublabel: `${NMW_ORDER.citation}, band: ${nmw.age === "Under 16" ? "under 16" : `age ${nmw.age}`}`,
      href: "/junior-pay-rates/",
      percentage: nmw.percentage,
      hourly: nmw.hourly,
      casualHourly: nmw.casualHourly,
    },
  ];
  for (const b of awardBandsForAge(age)) {
    lines.push(awardLine(b));
  }
  return lines;
}

function awardLine(b: AwardBandForAge): RateLine {
  const short =
    b.code === "MA000004" ? "Retail award" : b.code === "MA000003" ? "Fast food award" : "Hospitality award";
  return {
    key: `${b.code}-${b.band}`,
    label: `${short} (${b.code})`,
    sublabel: `${b.adultLevel}, band: ${b.band.toLowerCase()}`,
    href: b.href,
    percentage: b.percentage,
    hourly: b.hourly!,
    casualHourly: b.casualHourly!,
  };
}

/** Annual income tax + Medicare on a gross figure, resident, tax-free threshold claimed. */
export function annualTaxOn(gross: number): number {
  return calculatePayBreakdown({ grossSalary: Math.round(gross) }).totalDeductions;
}

export interface AgeSummary {
  age: MinWageAge;
  nmw: ReturnType<typeof nmwRowForAge>;
  lines: RateLine[];
  retail: RateLine;
  fastFood: RateLine;
  hospitality: RateLine;
  /** Highest casual rate among the lines, for the "at most" tax example. */
  topCasual: RateLine;
  pending: ReturnType<typeof pendingChangeForAge>;
}

export function ageSummary(age: MinWageAge): AgeSummary {
  const lines = rateLinesForAge(age);
  const retail = lines.find((l) => l.key.startsWith("MA000004"))!;
  const fastFood = lines.find((l) => l.key.startsWith("MA000003"))!;
  const hospitality = lines.find((l) => l.key.startsWith("MA000009"))!;
  const topCasual = [...lines].sort((a, b) => b.casualHourly - a.casualHourly)[0];
  return { age, nmw: nmwRowForAge(age), lines, retail, fastFood, hospitality, topCasual, pending: pendingChangeForAge(age) };
}

/** "a 15" / "an 18". */
export function aAge(age: number): string {
  return `${age === 18 || age === 11 || age === 8 ? "an" : "a"} ${age}`;
}

/** "x", "x and y", "x, y and z". */
export function listJoin(items: string[]): string {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Retail at 20 has two bands; everywhere else one. */
function retailText(s: AgeSummary): string {
  const after = s.lines.find((l) => l.key === "MA000004-20 (more than 6 months)");
  return after
    ? `${money(s.retail.hourly)} under the retail award in the first six months (${money(after.hourly)} after that)`
    : `${money(s.retail.hourly)} under the retail award`;
}

export function spokeTitle(age: MinWageAge): string {
  return `Minimum Wage for ${aAge(age)} Year Old in Australia (${SITE_CONFIG.financialYear})`;
}

export function spokeDescription(age: MinWageAge): string {
  const s = ageSummary(age);
  const lead = aAge(age).replace(/^a/, "A");
  const rates = `${money(s.retail.hourly)} under the retail award${age === 20 ? " (first 6 months)" : ""}, ${money(s.fastFood.hourly)} in fast food and ${money(s.hospitality.hourly)} in hospitality`;
  return fitDescription(
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr (${money(s.nmw.casualHourly)} casual) with no award, ${rates}. Weekly pay at 10, 15 and 20 hours, and tax.`,
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr (${money(s.nmw.casualHourly)} casual) with no award, ${rates}.`,
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr with no award, ${rates}.`,
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr with no award, ${money(s.retail.hourly)} in retail${age === 20 ? " (first 6 months)" : ""}, ${money(s.fastFood.hourly)} in fast food, ${money(s.hospitality.hourly)} in hospitality.`,
  );
}

export interface Faq {
  q: string;
  a: string;
}

export function spokeFaqs(age: MinWageAge): Faq[] {
  const s = ageSummary(age);
  const w15 = weeklyPay(s.nmw.casualHourly, 15);
  const faqs: Faq[] = [
    {
      q: `What is the minimum wage for ${aAge(age)} year old in Australia?`,
      a: `If no award or agreement covers the job, ${aAge(age)}-year-old must be paid at least ${money(s.nmw.hourly)} an hour, or ${money(s.nmw.casualHourly)} as a casual, from the first full pay period starting on or after ${NMW_ORDER.operativeFrom}. That is ${pctLabel(s.nmw.percentage)} of the adult ${money(EMPLOYMENT.minimumWageHourly)}. Most ${age}-year-olds are covered by an award instead, which sets its own junior rate: ${retailText(s)}, ${money(s.fastFood.hourly)} under the fast food award and ${money(s.hospitality.hourly)} under the hospitality award (Level 1 in each award, before casual loading).`,
    },
    {
      q: `How much does ${aAge(age)} year old casual earn per week?`,
      a: `At the award-free casual rate of ${money(s.nmw.casualHourly)}, 15 hours a week is ${money(w15)} before tax. Under the retail award the same 15 hours is ${money(weeklyPay(s.retail.casualHourly, 15))}, and under the fast food award ${money(weeklyPay(s.fastFood.casualHourly, 15))}. Weekend, evening and public holiday penalty rates are extra.`,
    },
    {
      q: `Does ${aAge(age)} year old pay tax?`,
      a: `Only above the tax-free threshold. If you claim the ${formatAUD(18_200)} tax-free threshold with your employer, ${aAge(age)}-year-old working 15 hours a week as a casual at ${money(s.topCasual.casualHourly)} would earn about ${formatAUD(Math.round(weeklyPay(s.topCasual.casualHourly, 15) * 52))} a year and owe about ${formatAUD(annualTaxOn(weeklyPay(s.topCasual.casualHourly, 15) * 52))} in income tax and Medicare levy for the year. You still need a tax file number, and your employer must pay super on your wages.`,
    },
  ];
  if (s.pending && s.pending.length > 0) {
    const steps = s.pending
      .map((p) => `${p.award.replace(" Industry Award 2020", "").replace("General ", "")}: ${p.present}% to ${p.firstStep}%, reaching 100% from ${p.fullAdultFrom}`)
      .join("; ");
    faqs.push({
      q: `Is the minimum wage for ${age} year olds going up to the adult rate?`,
      a: `Yes, in stages, for ${age}-year-olds with ${PENDING_JUNIOR_CHANGE.serviceQualifier} under the ${listJoin(s.pending.map((p) => p.award.replace(" Industry Award 2020", "").replace("General ", "").toLowerCase()))} awards. The Fair Work Commission made the determinations on ${PENDING_JUNIOR_CHANGE.implementationDecidedOn}. From the first full pay period on or after ${PENDING_JUNIOR_CHANGE.earliestStart}: ${steps}. It is not a one-step jump to the adult rate, and ${age}-year-olds with 6 months or less with their employer stay on the current rate.${age === 20 ? " Under the retail award, a 20-year-old with more than 6 months' service already gets the adult rate." : ""}`,
    });
  } else {
    faqs.push({
      q: `When does ${aAge(age)} year old get the adult minimum wage?`,
      a: `Under the National Minimum Wage the adult rate starts at ${ADULT_AGE}. Awards differ: the hospitality award pays the adult rate from 20, the retail award from 20 with more than six months' service, and the fast food award from 21 (from 1 July 2027 for 20-year-olds with more than six months' service). Rates for under-18s are not changed by the Fair Work Commission's 2026 junior-rate decision, which moves only 18 to 20-year-olds towards the adult rate from ${PENDING_JUNIOR_CHANGE.earliestStart}.`,
    });
  }
  return faqs;
}

export { MIN_WAGE_AGES, SPOKE_HOURS };
