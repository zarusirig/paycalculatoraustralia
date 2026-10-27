// FAQ copy for /hourly-to-salary/[rate]/ (second pass, 10 Oct 2026). The page
// renders this array as its "Quick Answers" list and as FAQPage JSON-LD, so
// the two cannot drift.
//
// Three or four questions, chosen by what applies at the rate: whether it is
// legal (under $26.44), which award minimums sit near it, whether it is a
// casual award rate, weekend and overtime dollars at typical award rates, the
// published pay scale points at the salary (or, with none, that it is above
// every award) and contractor value from $60. Where fewer than three apply, the
// after-tax week and then the rate as a casual fill the list. Every figure
// comes from the same helpers as the sections the answers summarise.

import { EMPLOYMENT, formatAUD } from "@/lib/constants/australian-tax";
import { AFTER_TAX_PART_TIME_HOURS, casualAfterTax, hourlyAfterTax } from "@/lib/constants/hourly-rates";
import { NMW, NMW_DECISION } from "@/lib/constants/minimum-wage";
import { CASUAL_LOADING } from "@/lib/constants/junior-rates";
import { AWR_2026_FLOORS } from "@/lib/constants/hospitality-award";
import { contractorRateToEquivalentSalary, salaryToContractorDayRate } from "@/lib/constants/contractor-rate";
import { AWARD_RATE_MAX, AWARD_RATE_MIN, awardLabel } from "@/lib/data/award-rate-index";
import { payScaleFaq } from "@/modules/programmatic/pay-scale-faq";
import {
  CONTRACTOR_CONTEXT_FROM,
  HOURLY_PAGE_HALF_WINDOW,
  apprenticeRatesNear,
  hourlyPageAwardRates,
  hourlyPageCasualEquivalents,
  hourlyPagePayScalePoints,
  juniorFloors,
  nearestAwardRates,
  penaltyContext,
} from "@/lib/data/hourly-rate-context";
import { awardRatesFaqAnswer } from "@/modules/programmatic/award-rates-near";
import type { FaqItem } from "@/lib/faq";

const money = (n: number) => formatAUD(n, 2);
const cents = (n: number) => Math.round(n * 100) / 100;
const pct = (m: number) => `${Number((m * 100).toFixed(1))}%`;
const HOURS = EMPLOYMENT.standardWeeklyHours;
const ORDINAL = ["", "1st", "2nd", "3rd", "4th"] as const;

/** "$35" for whole-dollar rates, "$26.44" otherwise. */
function rateLabel(r: number): string {
  return Number.isInteger(r) ? formatAUD(r) : formatAUD(r, 2);
}

function weekAfterTax(rate: number, label: string): FaqItem {
  const ft = hourlyAfterTax(rate);
  return {
    q: `${label} an hour is how much a week after tax?`,
    a: `${money(ft.perWeek)} a week after tax on a ${HOURS}-hour week, or ${money(ft.perFortnight)} a fortnight and ${money(ft.perMonth)} a month. At ${AFTER_TAX_PART_TIME_HOURS.map((h) => `${h} hours it is ${money(hourlyAfterTax(rate, h).perWeek)}`).join(" and at ")} a week.`,
  };
}

/**
 * Under the adult minimum: is it lawful, and as what. Also asked on
 * /salary-to-hourly/ pages whose full-time hourly figure is under it.
 */
export function legality(rate: number, label: string): FaqItem {
  const { met } = juniorFloors(rate);
  const oldest = met[met.length - 1];
  const apprentice = [...apprenticeRatesNear(rate)].sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0];
  const parts: string[] = [];
  if (oldest) {
    parts.push(
      `it meets the national junior minimum for employees aged ${oldest.age === "Under 16" ? "under 16" : `${oldest.age} and under`} (${money(oldest.hourly)} at ${oldest.age === "Under 16" ? "under 16" : oldest.age})`,
    );
  }
  if (apprentice) {
    const y12 = apprentice.year12 === "either" ? "" : `, Year 12 ${apprentice.year12 === "completed" ? "completed" : "not completed"}`;
    parts.push(
      `it is within 50c of the ${money(apprentice.hourly)} minimum for a ${ORDINAL[apprentice.stage]}-year ${apprentice.track} apprentice${y12} (${apprentice.trades.map((t) => t.name).join("; ")})`,
    );
  }
  if (rate >= AWR_2026_FLOORS.entryLevelHourly) {
    parts.push(`it clears the ${money(AWR_2026_FLOORS.entryLevelHourly)} floor for award entry-level rates in the first 6 months`);
  } else {
    parts.push(`it is under every adult award minimum we track (the lowest is ${money(AWARD_RATE_MIN.hourly)})`);
  }
  return {
    q: `Is ${label} an hour legal in Australia?`,
    a: `Not as an adult's ordinary pay: ${label} is ${money(cents(NMW.hourly - rate))} under the ${money(NMW.hourly)} national minimum wage for adults from ${NMW_DECISION.operativeFrom}. ${parts.map((p, i) => (i === 0 ? p[0].toUpperCase() + p.slice(1) : p)).join("; ")}.`,
  };
}

/** Award rows within 50c, the nearest either side, or above every award. */
function awardQuestion(rate: number, label: string): FaqItem | null {
  const near = hourlyPageAwardRates(rate);
  if (near.matches.length > 0) {
    return { q: `Which award jobs have a minimum rate of about ${label} an hour?`, a: awardRatesFaqAnswer(near, label) };
  }
  if (rate < AWARD_RATE_MIN.hourly || rate > AWARD_RATE_MAX.hourly) return null;
  const { below, above } = nearestAwardRates(rate);
  const side = (m: NonNullable<typeof below>, word: string) =>
    `the nearest ${word} is ${money(m.hourly)} (${awardLabel(m)}, ${m.classifications.join(" and ")})`;
  const sides = [below && side(below, "below"), above && side(above, "above")].filter(Boolean).join("; ");
  return {
    q: `Which award minimums are closest to ${label} an hour?`,
    a: `No adult award minimum we track is within 50c of ${label}: ${sides}. Award minimums are legal floors for ordinary hours, not typical pay.`,
  };
}

/** Above every award minimum (asked only where no pay scale point answers it better). */
function aboveAwardsQuestion(rate: number, label: string): FaqItem | null {
  if (rate <= AWARD_RATE_MAX.hourly) return null;
  return {
    q: `Is ${label} an hour above award rates?`,
    a: `Yes. The highest adult award minimum we track is ${money(AWARD_RATE_MAX.hourly)} an hour (${awardLabel(AWARD_RATE_MAX)}, ${AWARD_RATE_MAX.classification}, from ${AWARD_RATE_MAX.effectiveLabel}), ${money(rate - AWARD_RATE_MAX.hourly)} under ${label}. Pay at this level is set by an enterprise agreement, a contract or an individual salary rather than an award minimum.`,
  };
}

/** Award classifications whose casual minimum is this rate; null where there are none. */
function casualEquivalentQuestion(rate: number, label: string): FaqItem | null {
  const rows = hourlyPageCasualEquivalents(rate);
  if (rows.length === 0) return null;
  const list = rows
    .map(({ match: m, casual }) => `${awardLabel(m)} ${m.classifications.join(" and ")} (${money(casual)} casual, ${money(m.hourly)} permanent)`)
    .join("; ");
  return {
    q: `Is ${label} an hour a casual award rate?`,
    a: `${label} is within 50c of the casual minimum for: ${list}. A casual rate includes a ${Math.round(CASUAL_LOADING * 100)}% loading paid instead of leave, so the permanent base of ${label} as a casual rate is ${money(cents(rate / (1 + CASUAL_LOADING)))}.`,
  };
}

/** The fallback for a page with fewer than three rate-specific questions: the rate as a casual. */
function casualAfterTaxQuestion(rate: number, label: string): FaqItem {
  const casual = casualAfterTax(rate);
  return {
    q: `What is ${label} an hour casual after tax?`,
    a: `With a ${Math.round(CASUAL_LOADING * 100)}% casual loading the rate becomes ${money(casual.rate)} an hour, which is ${money(casual.perWeek)} a week after tax for ${HOURS} hours. The loading replaces paid leave, and some awards and agreements set it differently.`,
  };
}

function contractorQuestion(rate: number, label: string): FaqItem {
  const c = contractorRateToEquivalentSalary(rate, "hour");
  const reverse = salaryToContractorDayRate(rate * EMPLOYMENT.hoursPerYear);
  return {
    q: `What is ${label} an hour as a contractor worth?`,
    a: `As a contract rate excluding GST, ${label} an hour for ${HOURS / 5} hours on ${c.billableDays} billable days is ${formatAUD(c.billedIncome)} a year. After ${formatAUD(c.insurance + c.admin)} of insurance and admin and funding your own super, it matches an employee salary of about ${formatAUD(c.equivalentSalary)} (${money(c.employeeHourly)} an hour). Matching ${label} an hour as an employee takes about ${formatAUD(reverse.dayRate)} a day as a contractor.`,
  };
}

function penaltyQuestion(rate: number, label: string): FaqItem | null {
  const ctx = penaltyContext(rate);
  if (!ctx) return null;
  const weekend = ctx.lines.filter((l) => l.kind === "penalty" && /saturday|sunday|public holiday/i.test(l.label));
  const picked = [...(weekend.length > 0 ? weekend : ctx.lines.filter((l) => l.kind === "penalty")).slice(0, 3), ...ctx.lines.filter((l) => l.kind === "overtime").slice(0, 1)];
  const list = picked
    .map((l) => `${l.kind === "overtime" ? "overtime, " : ""}${l.label}: ${l.flatPerHour > 0 ? `${pct(l.multiplier)} + ${money(l.flatPerHour)}` : pct(l.multiplier)}, ${money(l.hourly)}`)
    .join("; ");
  return {
    q: `What are weekend and overtime rates near ${label} an hour?`,
    a: `On the ${ctx.award.meta.shortName} ${ctx.classification} minimum of ${money(ctx.match.hourly)} (from ${ctx.match.effectiveLabel}), a full-time or part-time employee gets ${list}. Casuals and other classifications are paid differently.`,
  };
}

export function hourlyToSalaryFaqs(rate: number): FaqItem[] {
  const label = rateLabel(rate);
  const scales = payScaleFaq(hourlyPagePayScalePoints(rate), rate * EMPLOYMENT.hoursPerYear, HOURLY_PAGE_HALF_WINDOW);
  const items = [
    rate < NMW.hourly ? legality(rate, label) : null,
    awardQuestion(rate, label),
    casualEquivalentQuestion(rate, label),
    penaltyQuestion(rate, label),
    scales,
    scales ? null : aboveAwardsQuestion(rate, label),
    rate >= CONTRACTOR_CONTEXT_FROM ? contractorQuestion(rate, label) : null,
  ]
    .filter((f): f is FaqItem => f !== null)
    .slice(0, 4);
  // At least three questions. Where fewer facts apply (under $26, and from
  // about $86 where pay points and casual equivalents thin out), the after-tax
  // week the hero and table already give, then the rate as a casual.
  for (const fill of [weekAfterTax(rate, label), casualAfterTaxQuestion(rate, label)]) {
    if (items.length < 3) items.push(fill);
  }
  return items;
}
