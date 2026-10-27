// Server-safe data for the /minimum-wage-by-age/[age]/ spokes. Kept out of the
// page component so the route's metadata, JSON-LD and body all read the same
// figures. Every number derives from lib/constants/minimum-wage.ts and
// lib/constants/junior-age-facts.ts; the visible FAQ and the FAQPage JSON-LD
// are both built from spokeFaqs().

import { EMPLOYMENT, SITE_CONFIG, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import {
  FAST_FOOD_LEVEL_1,
  MIN_WAGE_AGES,
  SPOKE_HOURS,
  awardBandsForAge,
  awardJuniorHourly,
  nmwRowForAge,
  pendingChangeForAge,
  type AwardBandForAge,
  type MinWageAge,
} from "@/lib/constants/minimum-wage";
import { ADULT_AGE, NMW_ORDER } from "@/lib/constants/junior-rates";
import { HOSPITALITY_RATES, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import {
  CHILD_WORK_RULES,
  JUNIOR_SCALE_AWARDS,
  NMW_SCALE,
  PHASE_IN,
  RETAIL_TWENTY_SPLIT,
  SCHOOL_AGE_RULES,
  adultAgeOf,
  adultRateStatus,
  awardsByPercentageAtAge,
  bandForAge,
  nextBirthday,
  nextRiseAge,
  phaseInForAge,
  type JuniorScaleAward,
} from "@/lib/constants/junior-age-facts";
import { APPRENTICE_TRADES } from "@/lib/data/apprentice-pay";
import { MODERN_AWARDS } from "@/lib/constants/modern-awards";
import { fitDescription } from "@/lib/seo-title";

export const money = (v: number) => formatAUD(v, 2);
export const pctLabel = (v: number) => {
  const p = Math.round(v * 1000) / 10;
  return `${Number.isInteger(p) ? p : p.toFixed(1)}%`;
};

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
      label: "No award (National Minimum Wage)",
      sublabel: `band: ${nmw.age === "Under 16" ? "under 16" : `age ${nmw.age}`}`,
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
    label: short,
    sublabel: `Level 1, band: ${b.band.toLowerCase()}`,
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

/** "Retail Award" → "Retail". */
export const bare = (a: Pick<JuniorScaleAward, "name">) => a.name.replace(/ Award$/, "").replace(/ Industry$/, "");
const names = (list: Pick<JuniorScaleAward, "name">[]) => listJoin(list.map(bare));

/** Retail at 20 has two bands; everywhere else one. */
function retailText(s: AgeSummary): string {
  const after = s.lines.find((l) => l.key === "MA000004-20 (more than 6 months)");
  return after
    ? `${money(s.retail.hourly)} under the retail award in the first six months (${money(after.hourly)} after that)`
    : `${money(s.retail.hourly)} under the retail award`;
}

// ---------------------------------------------------------------------------
// Level 1 dollars for the three main awards at any age / percentage
// ---------------------------------------------------------------------------

const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!.weekly;
const HOSP_L1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!.weekly;

/** Level 1 hourly for Retail / Fast Food / Hospitality at a percentage, else null. */
export function mainLevel1Hourly(code: string, percentage: number): number | null {
  const weekly = code === "MA000004" ? RETAIL_L1 : code === "MA000003" ? FAST_FOOD_LEVEL_1.weekly : code === "MA000009" ? HOSP_L1 : null;
  return weekly == null ? null : awardJuniorHourly(weekly, percentage);
}

/** Award-free hourly at a National Minimum Wage junior percentage. */
export function nmwHourlyAt(percentage: number): number {
  return awardJuniorHourly(EMPLOYMENT.minimumWageWeekly, percentage);
}

// ---------------------------------------------------------------------------
// Age-specific blocks
// ---------------------------------------------------------------------------

/** The age-specific paragraph under the first heading. */
export function ageNote(age: MinWageAge): string {
  switch (age) {
    case 14:
      return "Fourteen is the bottom of every junior scale. The National Minimum Wage, Retail, Fast Food and Pharmacy awards use an under-16 band; Hospitality, Restaurant and Hair and Beauty an under-17 band; Road Transport, Real Estate and Commercial Sales an under-19 band. Whether a 14-year-old can be employed at all, in what job and for how many hours, is decided by the state, not by Fair Work, and most state limits are written for children under 15.";
    case 15:
      return "Fifteen pays exactly what fourteen pays: no award and no part of the National Minimum Wage has a separate band for 15. What changes on the 15th birthday is the state rules. Victoria's child employment licence, Western Australia's parental-permission rule, the ACT's 10-hour weekly cap and the Northern Territory's list of allowed jobs are all written for children under 15.";
    case 16:
      return "Sixteen is the first step up on the National Minimum Wage and on the Retail, Fast Food, Pharmacy and Clerks scales, and Pastoral and Horticulture move to 60%. Hospitality is the exception people notice: its junior table has no 16-year-old row, so a 16-year-old stays on the under-17 rate until turning 17, and Restaurant, Hair and Beauty, Fitness, Local Government and Meat Industry work the same way.";
    case 17:
      return "At 17 every under-17 band ends, so Hospitality and Restaurant finally move up, to 60%. Hair and Beauty pays 75% at 17, the highest of the award junior scales on this page, and Pastoral and Horticulture pay 70%. Only Road Transport, Real Estate and Commercial Sales still hold a 17-year-old in an under-19 band.";
    case 18:
      return "Eighteen is an adult for most legal purposes but still a junior for pay. The National Minimum Wage pays 68.3% of the adult rate and Retail, Fast Food and Hospitality pay 70%. Hair and Beauty is the main exception: it pays the full adult rate from 18. Eighteen is also the first age touched by the Fair Work Commission's phase-in, which lifts Retail, Fast Food and Pharmacy rates for 18-year-olds with more than six months' service from 1 December 2026.";
    case 19:
      return "At 19 the awards split. Hospitality, Restaurant, Fitness, Local Government and Meat Industry pay 85% of the adult rate, while Retail, Fast Food, Pharmacy and Clerks pay 80% and the National Minimum Wage 82.5%. Road Transport moves from its under-19 band to 80%, and Real Estate to 70%.";
    case 20:
      return "Twenty is where most awards reach the adult rate, but not all of them. Hospitality, Restaurant, Fitness, Meat Industry, Pastoral, Horticulture and Road Transport pay 100% at 20. Retail pays 90% in the first six months with the employer and 100% after that. Fast Food and Pharmacy pay 90% for now, rising for those with more than six months' service from 1 December 2026, and the National Minimum Wage pays 97.7% until 21.";
  }
}

export interface PercentRow {
  label: string;
  awards: { name: string; href: string; band: string; scope: string | null }[];
}

/** Every award junior scale at this age, grouped by percentage, highest first. */
export function awardPercentRows(age: MinWageAge): PercentRow[] {
  return awardsByPercentageAtAge(age).map((g) => ({
    label: pctLabel(g.percentage),
    // Road Transport's limit is an 18+ driver rule, so it is only starred from 18.
    awards: g.awards.map((a) => ({ name: a.award.name, href: a.award.href, band: a.band.age, scope: a.award.code === "MA000038" && age < 18 ? null : a.award.scope })),
  }));
}

/** The classification limits behind the starred awards, as one footnote. Road Transport's driver rule only from 18. */
export function scopeNotes(age: MinWageAge): string {
  const parts: string[] = [];
  const has = (code: string) => JUNIOR_SCALE_AWARDS.some((a) => a.code === code && a.scope);
  if (has("MA000004") && has("MA000012")) parts.push("Retail covers levels 1 to 3 and Pharmacy assistant levels 1 and 2 only; a junior above those levels gets the adult rate");
  if (has("MA000022")) parts.push("Cleaning's scale is for shopping trolley collectors only");
  if (has("MA000010")) parts.push("Manufacturing applies the percentage to the C13 rate and excludes foundry juniors");
  const adult = ["Juniors serving alcohol under Hospitality or Restaurant"];
  if (age >= 18) adult.push("a driver in sole charge of a vehicle under Road Transport");
  parts.push(`${listJoin(adult)} get the adult rate`);
  return `${parts.join(". ")}.`;
}

/** One sentence naming the best- and worst-paying junior scales at this age. */
export function awardSpreadText(age: MinWageAge): string {
  const groups = awardsByPercentageAtAge(age);
  const top = groups[0];
  const bottom = groups[groups.length - 1];
  const nmw = bandForAge(NMW_SCALE, age)!;
  const lead = aAge(age).replace(/^a/, "A");
  return `${lead}-year-old's percentage ranges from ${pctLabel(bottom.percentage)} under the ${names(bottom.awards.map((a) => a.award))} award${bottom.awards.length > 1 ? "s" : ""} to ${pctLabel(top.percentage)} under the ${names(top.awards.map((a) => a.award))} award${top.awards.length > 1 ? "s" : ""}, against ${pctLabel(nmw.percentage)} with no award at all.`;
}

export interface BirthdayBlock {
  heading: string;
  /** Rises grouped by the same from → to step. */
  rises: { step: string; awards: string }[];
  /** Award-free and Level 1 dollar changes, as one sentence. */
  dollars: string | null;
  /** Awards that do not move, grouped by the age they next rise. */
  waits: { at: number; awards: string }[];
  intro: string;
}

/** What the next birthday changes, per award. */
export function birthdayBlock(age: MinWageAge): BirthdayBlock {
  const next = age + 1;
  const { rises, unchanged } = nextBirthday(age);
  const byStep = new Map<string, JuniorScaleAward[]>();
  for (const r of rises) {
    const k = `${pctLabel(r.from.percentage)} → ${pctLabel(r.to.percentage)}`;
    byStep.set(k, [...(byStep.get(k) ?? []), r.award]);
  }
  const waitsMap = new Map<number, JuniorScaleAward[]>();
  for (const u of unchanged) {
    const at = nextRiseAge(u.award.scale, age);
    if (at == null) continue;
    waitsMap.set(at, [...(waitsMap.get(at) ?? []), u.award]);
  }
  const waits = [...waitsMap.entries()].sort((a, b) => a[0] - b[0]).map(([at, list]) => ({ at, awards: names(list) }));
  const adultAlready = unchanged.filter((u) => nextRiseAge(u.award.scale, age) == null).map((u) => u.award);

  const nmw = { from: bandForAge(NMW_SCALE, age)!, to: bandForAge(NMW_SCALE, next)! };
  let dollars: string | null = null;
  if (nmw.to.percentage > nmw.from.percentage) {
    const parts = [`with no award, ${money(nmwHourlyAt(nmw.from.percentage))} → ${money(nmwHourlyAt(nmw.to.percentage))} an hour`];
    for (const code of ["MA000004", "MA000003", "MA000009"]) {
      const r = rises.find((x) => x.award.code === code);
      if (!r) continue;
      parts.push(`${bare(r.award).toLowerCase()} ${money(mainLevel1Hourly(code, r.from.percentage)!)} → ${money(mainLevel1Hourly(code, r.to.percentage)!)}`);
    }
    dollars = `In dollars, at today's Level 1 rates: ${listJoin(parts)}.`;
  }

  let heading: string;
  let intro: string;
  if (age === 20) {
    heading = "Turning 21: The Adult Rate Under Every Scale";
    intro = `At ${ADULT_AGE} the National Minimum Wage junior scale ends and every award junior scale has run out, so the full adult rate applies whatever the job. The awards that still treat a 20-year-old as a junior move like this:`;
  } else if (rises.length === 0) {
    heading = `Turning ${next}: No Change to the Rate`;
    intro = `No award and no part of the National Minimum Wage has a band that starts at ${next}, so a ${next}-year-old is paid the same percentage as ${aAge(age)}-year-old. The first rise comes later, and when depends on the award:`;
  } else {
    heading = `What Changes When You Turn ${next}`;
    intro = `${rises.length} of the ${JUNIOR_SCALE_AWARDS.length} award scales${nmw.to.percentage > nmw.from.percentage ? " and the National Minimum Wage" : ""} pay more from the birthday itself (the Fair Work Ombudsman's example: a junior who turns 17 on 22 March is owed the 17-year-old rate from 22 March).${adultAlready.length > 0 ? ` ${names(adultAlready)} already pays the adult rate.` : ""}`;
  }

  return {
    heading,
    intro,
    rises: [...byStep.entries()].map(([step, list]) => ({ step, awards: names(list) })),
    dollars,
    waits,
  };
}

// ---------------------------------------------------------------------------
// Phase-in (17 to 20)
// ---------------------------------------------------------------------------

export interface PhaseInTable {
  dates: string[];
  columns: { award: string; determination: string; url: string; cells: (number | null)[] }[];
  /** Level 1 dollars at the first step, for awards with a base on this site. */
  firstStepDollars: string;
  /** Date the age band reaches 100% under each award. */
  fullFrom: string;
}

const AWARD_SHORT: Record<string, string> = {
  retail: "Retail",
  fastFood: "Fast Food",
  pharmacy: "Pharmacy",
};

/** The paragraph under each age's phase-in table: what the schedule means for someone that age now. */
export function phaseInMeaning(age: 18 | 19 | 20): string {
  const t = phaseInTable(age);
  if (age === 18) {
    return `${t.firstStepDollars} The 18-year-old column only reaches 100% from ${t.fullFrom}. A year at 18 spans at most one December step and one July step, so most 18-year-olds collect one or two of these steps and then move to the 19-year-old column on their birthday. The July 2027 wage review will also change the adult rate the percentages apply to.`;
  }
  if (age === 19) {
    return `${t.firstStepDollars} All three awards pay a 19-year-old with more than 6 months' service 100% from ${t.fullFrom}, a year before the 18-year-old column gets there. Pharmacy moves in bigger, yearly steps (85%, then 95%), Retail and Fast Food in five-point steps every December and July.`;
  }
  const gap = Math.round((mainLevel1Hourly("MA000003", 0.95)! - mainLevel1Hourly("MA000003", 0.9)!) * 100) / 100;
  return `${t.firstStepDollars} Twenty is the shortest phase-in: Fast Food and Pharmacy pay 95% from ${PHASE_IN.start} and 100% from ${t.fullFrom}. A 20-year-old with 6 months or less stays on 90%, so the 6-month mark is worth ${money(gap)} an hour at Fast Food Level 1 from December. Retail has no column because it already pays 100% after 6 months.`;
}

export function phaseInTable(age: 18 | 19 | 20): PhaseInTable {
  const rows = phaseInForAge(age);
  const dates: string[] = [];
  for (const r of rows) for (const st of r.steps) if (!dates.includes(st.effective)) dates.push(st.effective);
  const order = (d: string) => Date.parse(d);
  dates.sort((a, b) => order(a) - order(b));
  const columns = rows.map((r) => {
    let last = r.present;
    const cells = dates.map((d) => {
      const hit = r.steps.find((st) => st.effective === d);
      if (hit) last = hit.percentage;
      else if (last >= 100) return null;
      return hit ? hit.percentage : last;
    });
    return { award: AWARD_SHORT[r.key], determination: r.determination, url: PHASE_IN.determinationUrl(r.determination), cells };
  });
  const dollarParts: string[] = [];
  for (const r of rows) {
    const code = r.key === "retail" ? "MA000004" : r.key === "fastFood" ? "MA000003" : null;
    if (!code) continue;
    dollarParts.push(`${AWARD_SHORT[r.key].toLowerCase()} ${money(mainLevel1Hourly(code, r.present / 100)!)} → ${money(mainLevel1Hourly(code, r.steps[0].percentage / 100)!)}`);
  }
  const fullDates = [...new Set(rows.map((r) => r.steps[r.steps.length - 1].effective))];
  return {
    dates,
    columns,
    firstStepDollars: dollarParts.length ? `On Level 1 at today's adult rate the first step is ${listJoin(dollarParts)} an hour.` : "",
    fullFrom: listJoin(fullDates),
  };
}

// ---------------------------------------------------------------------------
// Adult rate (18 to 20)
// ---------------------------------------------------------------------------

export interface AdultRateBlock {
  /** Awards and rules that put this age on the adult rate for the first time. */
  newAt: string[];
  /** Adult-rate rules carried over from an earlier age, as one sentence, or null. */
  carried: string | null;
  /** Awards still paying a junior percentage, grouped by the age they reach 100%. */
  later: { at: number; awards: string }[];
}

const ruleText = (r: { text: string; source: string }) => `${r.text} (${r.source})`;

export function adultRateBlock(age: 18 | 19 | 20): AdultRateBlock {
  const st = adultRateStatus(age);
  const newAwards = st.adultNow.filter((a) => adultAgeOf(a.scale) === age);
  const oldAwards = st.adultNow.filter((a) => adultAgeOf(a.scale) < age);
  const newAt = newAwards.map((a) => `${a.name}: 100% from ${age} (${a.clause})`);
  if (age === 20) newAt.push(`Retail Award: ${pctLabel(RETAIL_TWENTY_SPLIT.after6Months)} once you have been with the employer more than 6 months, ${pctLabel(RETAIL_TWENTY_SPLIT.upTo6Months)} before that (cl 17.2 Table 5)`);
  for (const r of st.rules.filter((x) => x.fromAge === age)) newAt.push(ruleText(r));
  const oldRules = st.rules.filter((x) => x.fromAge < age);
  const carried =
    oldAwards.length + oldRules.length > 0
      ? `Already on the adult rate since 18: ${listJoin([...oldAwards.map((a) => `${bare(a)}`), ...oldRules.map((r) => `${r.label} (${r.source})`)])}.`
      : null;
  const laterMap = new Map<number, string[]>();
  for (const l of st.later) {
    const pct = pctLabel(bandForAge(l.award.scale, age)!.percentage);
    const note = age === 20 && l.award.code === "MA000004" ? `${pct} now with 6 months or less` : `${pct} now`;
    laterMap.set(l.adultAt, [...(laterMap.get(l.adultAt) ?? []), `${bare(l.award)} (${note})`]);
  }
  return {
    newAt,
    carried,
    later: [...laterMap.entries()].sort((a, b) => a[0] - b[0]).map(([at, list]) => ({ at, awards: listJoin(list) })),
  };
}

/** First-year junior (Year 12 completed) and adult apprentice rates, for trades with both on this site. */
export function apprenticeFirstYear(): { name: string; code: string; junior: number; adult: number }[] {
  return APPRENTICE_TRADES.filter((t) => t.adult)
    .map((t) => {
      const junior = t.junior.find((r) => r.stage === 1 && r.year12 === "completed") ?? t.junior.find((r) => r.stage === 1)!;
      return { name: t.name.split(" (")[0], code: t.award.code, junior: junior.hourly, adult: t.adult!.find((r) => r.stage === 1)!.hourly };
    })
    .slice(0, 3);
}

/** Award texts an 18–20 page relies on beyond the three main awards. */
export function extraAwardSources(age: 18 | 19 | 20): { title: string; url: string }[] {
  const byCode = (code: string) => Object.values(MODERN_AWARDS).find((a) => a.meta.code === code)!.meta;
  const codes = age === 18 ? ["MA000005", "MA000038", "MA000011"] : age === 19 ? ["MA000104"] : ["MA000119", "MA000094"];
  const out = codes.map((c) => {
    const m = byCode(c);
    return { title: `${m.name} (${m.code})${c === "MA000104" ? ", Schedule E" : ""}`, url: m.awardTextUrl };
  });
  if (age === 20) {
    for (const t of APPRENTICE_TRADES.filter((x) => x.adult).slice(0, 3)) {
      if (!out.some((o) => o.url === t.award.url)) out.push({ title: `${t.award.name} (${t.award.code}), ${t.award.clause}`, url: t.award.url });
    }
  }
  return out;
}

/** The age-specific apprentice / trainee paragraph for 18, 19 and 20. */
export function apprenticeText(age: 18 | 19 | 20): string {
  const s = ageSummary(age);
  const y1 = apprenticeFirstYear();
  if (age === 18) {
    return `Starting an apprenticeship at 18 puts you on the junior apprentice rate for your stage of training, not the age-based rate above, and it can be lower: in the first year, with Year 12 finished, ${listJoin(y1.map((t) => `${t.name.toLowerCase()} ${money(t.junior)}`))} an hour, against ${money(s.retail.hourly)} at retail Level 1 at 18. Apprentice rates need a registered training contract.`;
  }
  if (age === 19) {
    return `A 19-year-old trainee doing a certificate is usually paid under Schedule E of the Miscellaneous Award, with penalty rates and allowances from their industry award. Traineeships are limited to certificate-level training unless an award says otherwise, so a 19-year-old studying a diploma gets the normal junior rate for their award (${pctLabel(0.8)} or ${pctLabel(0.85)} at 19 under the main awards).`;
  }
  return `The Fair Work Ombudsman says apprentice rates "can apply in some awards for apprentices that start their apprenticeship before they turn 21", and an adult apprentice is one who is 21 or older at the start. So a 20-year-old who signs up starts on the junior apprentice scale. First-year rates: ${y1.map((t) => `${t.name.toLowerCase()} ${money(t.junior)} junior (Year 12) and ${money(t.adult)} adult (${t.code})`).join("; ")}.`;
}

// ---------------------------------------------------------------------------
// State rules (14 and 15)
// ---------------------------------------------------------------------------

export function workRulesForAge(age: 14 | 15) {
  return CHILD_WORK_RULES.map((r) => ({ jurisdiction: r.jurisdiction, text: age === 14 ? r.at14 : r.at15, url: r.url, publisher: r.publisher }));
}

/** What the state pages say specifically about 16, 17 or 18-year-olds. */
export function schoolRulesForAge(age: 16 | 17 | 18): { jurisdiction: string; text: string; url: string }[] {
  return SCHOOL_AGE_RULES.flatMap((r) => {
    const text = age === 16 ? r.at16 : age === 17 ? r.at17 : r.at18;
    return text ? [{ jurisdiction: r.jurisdiction, text, url: r.url }] : [];
  });
}

// ---------------------------------------------------------------------------
// Title, description, FAQ
// ---------------------------------------------------------------------------

export function spokeTitle(age: MinWageAge): string {
  return `Minimum Wage for ${aAge(age)} Year Old in Australia (${SITE_CONFIG.financialYear})`;
}

export function spokeDescription(age: MinWageAge): string {
  const s = ageSummary(age);
  const lead = aAge(age).replace(/^a/, "A");
  const rates = `${money(s.retail.hourly)} under the retail award${age === 20 ? " (first 6 months)" : ""}, ${money(s.fastFood.hourly)} in fast food and ${money(s.hospitality.hourly)} in hospitality`;
  return fitDescription(
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr (${money(s.nmw.casualHourly)} casual) with no award, ${rates}. Weekly pay at 10, 15 and 20 hours.`,
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr (${money(s.nmw.casualHourly)} casual) with no award, ${rates}.`,
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr with no award, ${rates}.`,
    `${lead}-year-old's minimum wage from ${NMW_ORDER.operativeFrom}: ${money(s.nmw.hourly)}/hr with no award, ${money(s.retail.hourly)} in retail${age === 20 ? " (first 6 months)" : ""}, ${money(s.fastFood.hourly)} in fast food, ${money(s.hospitality.hourly)} in hospitality.`,
  );
}

export interface Faq {
  q: string;
  a: string;
}

function phaseInFaq(age: 18 | 19 | 20): Faq {
  const rows = phaseInForAge(age);
  const first = rows[0];
  const full = listJoin([...new Set(rows.map((r) => r.steps[r.steps.length - 1].effective))]);
  return {
    q: `Is the minimum wage for ${age} year olds going up?`,
    a: `Yes, in stages, but only for ${age}-year-olds with ${PHASE_IN.serviceQualifier} under the ${listJoin(rows.map((r) => AWARD_SHORT[r.key]))} award${rows.length > 1 ? "s" : ""}: ${first.present}% becomes ${first.steps[0].percentage}% from the first full pay period starting on or after ${PHASE_IN.start}, and the ${age}-year-old band reaches 100% from ${full}. That follows ${PHASE_IN.decision}; it is not a one-step jump to the adult rate, ${age}-year-olds with 6 months or less stay on ${first.present}%, and nothing has changed yet.${age === 20 ? " Retail is not included because a 20-year-old with more than 6 months' service already gets the retail adult rate." : ""}`,
  };
}

export function spokeFaqs(age: MinWageAge): Faq[] {
  const s = ageSummary(age);
  const faqs: Faq[] = [
    {
      q: `What is the minimum wage for ${aAge(age)} year old in Australia?`,
      a: `${money(s.nmw.hourly)} an hour (${money(s.nmw.casualHourly)} casual) with no award, ${pctLabel(s.nmw.percentage)} of the adult ${money(EMPLOYMENT.minimumWageHourly)}, from ${NMW_ORDER.operativeFrom}. Most jobs fall under an award that pays more: ${retailText(s)}, ${money(s.fastFood.hourly)} in fast food and ${money(s.hospitality.hourly)} in hospitality at Level 1.`,
    },
  ];

  const b = birthdayBlock(age);
  switch (age) {
    case 14: {
      faqs.push({
        q: "Can a 14 year old work in Australia?",
        a: `There is no national minimum working age; each state and territory sets its own rules, and most of them are written for children under 15. ${CHILD_WORK_RULES.filter((r) => r.faq14).map((r) => r.faq14).join(" ")}`,
      });
      faqs.push({
        q: "Does a 14 year old get a pay rise at 15?",
        a: `No. No award and no part of the National Minimum Wage has a separate band for 15, so the percentage stays the same. With no award the first rise comes at 16. ${b.waits.map((w) => `At ${w.at}: ${w.awards}.`).join(" ")}`,
      });
      break;
    }
    case 15: {
      const nmwNext = nmwHourlyAt(bandForAge(NMW_SCALE, 16)!.percentage);
      const r16 = mainLevel1Hourly("MA000004", 0.5)!;
      const f16 = mainLevel1Hourly("MA000003", 0.5)!;
      faqs.push({
        q: "How much more does a 16 year old earn than a 15 year old?",
        a: `With no award the hourly rate goes from ${money(s.nmw.hourly)} to ${money(nmwNext)}. Under the retail award it goes from ${money(s.retail.hourly)} to ${money(r16)}, and under the fast food award from ${money(s.fastFood.hourly)} to ${money(f16)} (Level 1). Under the hospitality award nothing changes at 16: its under-17 band keeps a 16-year-old on ${money(s.hospitality.hourly)} until the 17th birthday.`,
      });
      faqs.push({
        q: "Does a 15 year old need a work permit?",
        a: `Not under the state rules on this page, which put licences, permits and parental consent on under-15s. ${CHILD_WORK_RULES.filter((r) => r.faq15).map((r) => r.faq15).join(" ")} To work during school hours you usually need to be of the minimum school leaving age or have finished the minimum year of schooling, according to the Fair Work Ombudsman.`,
      });
      break;
    }
    case 16: {
      const waited = birthdayBlock(15).waits;
      faqs.push({
        q: "Why does a 16 year old get the same hospitality rate as a 15 year old?",
        a: `Because the hospitality award's junior table starts with an under-17 band at 50%, so a 16-year-old is paid ${money(s.hospitality.hourly)} an hour at Level 1, the same as a 15-year-old, until turning 17. The retail award, by contrast, rises from 45% to 50% at 16 and the fast food award from 40% to 50%. ${waited.map((w) => `Awards that stay put until ${w.at}: ${w.awards}.`).join(" ")}`,
      });
      faqs.push({
        q: "How much will a 16 year old earn at 17?",
        a: `${b.dollars ?? ""} The biggest step is under the Hair and Beauty award, from 50% to 75% of the adult rate. Under the Road Transport, Real Estate and Commercial Sales awards nothing changes until 19.`.trim(),
      });
      break;
    }
    case 17: {
      const now = mainLevel1Hourly("MA000004", 0.7)!;
      const step = mainLevel1Hourly("MA000004", 0.75)!;
      const top = awardsByPercentageAtAge(17)[0];
      const second = awardsByPercentageAtAge(17)[1];
      faqs.push({
        q: "Will a 17 year old get a bigger pay rise at 18 after 1 December 2026?",
        a: `Under the Retail, Fast Food and Pharmacy awards, yes, if you have been with your employer more than 6 months when you turn 18. From the first full pay period starting on or after ${PHASE_IN.start}, an 18-year-old with more than 6 months' service is paid 75% of the adult rate instead of 70% (${PHASE_IN.decision}; determinations PR813655, PR813654 and PR813656). At retail or fast food Level 1 that is ${money(step)} instead of ${money(now)} an hour on today's adult rate. With 6 months or less the 18-year-old rate stays 70%, and rates for 17-year-olds do not change.`,
      });
      faqs.push({
        q: "Which award pays a 17 year old the most?",
        a: `The ${names(top.awards.map((a) => a.award))} award, at ${pctLabel(top.percentage)} of the adult rate. Next come the ${names(second.awards.map((a) => a.award))} awards at ${pctLabel(second.percentage)}. Retail, Fast Food and Hospitality pay 60%, and the National Minimum Wage 57.8%. A higher percentage of a lower adult rate can still pay less per hour, so compare the dollar figure for your classification.`,
      });
      break;
    }
    case 18: {
      faqs.push({
        q: "Does an 18 year old get the adult wage in Australia?",
        a: `Not with no award: the National Minimum Wage pays 68.3% until ${ADULT_AGE}. Under awards it depends on the award. The Hair and Beauty award pays the full adult rate from 18, the Road Transport award pays it to a junior aged 18 or over who drives a vehicle in sole charge, and awards with no junior scale, such as Security and SCHADS, pay it at any age. Most awards with a junior scale reach 100% at 20 (${names(adultRateStatus(18).later.filter((l) => l.adultAt === 20).map((l) => l.award))}) or at 21 (the rest, including Fast Food, Pharmacy and Retail, where a 20-year-old with more than 6 months' service already gets 100%).`,
      });
      faqs.push(phaseInFaq(18));
      break;
    }
    case 19: {
      const h = mainLevel1Hourly("MA000009", 0.85)!;
      const r = mainLevel1Hourly("MA000004", 0.8)!;
      faqs.push({
        q: "Why does a 19 year old earn more in hospitality than in retail?",
        a: `Because the scales differ at 19: Hospitality pays 85% of its adult rate and Retail pays 80% of its own. At Level 1 that is ${money(h)} an hour in hospitality and ${money(r)} in retail, even though retail's adult Level 1 rate is higher. Restaurant, Fitness, Local Government and Meat Industry also pay 85% at 19; Fast Food, Pharmacy and Clerks pay 80%. From ${PHASE_IN.start}, a 19-year-old with more than 6 months' service under Retail or Fast Food moves to 85%.`,
      });
      faqs.push({
        q: "Does a 19 year old with more than 6 months' service get paid more?",
        a: `Not yet: no award pays a 19-year-old more for length of service today. From the first full pay period starting on or after ${PHASE_IN.start}, the Retail, Fast Food and Pharmacy awards will: 85% of the adult rate instead of 80% once you have been with the employer more than 6 months, then 90% from 1 July 2027 under Retail and Fast Food, or 95% under Pharmacy, and 100% from 1 July 2028 under all three. With 6 months or less the 19-year-old rate stays 80%. Service with a previous owner of the business counts if the business was transferred.`,
      });
      break;
    }
    case 20: {
      faqs.push({
        q: "When does a 20 year old get the full adult wage?",
        a: `Already, under the ${names(adultRateStatus(20).adultNow)} awards. Under the Retail award, once you have been with the employer more than 6 months (90% before that). Under the Fast Food and Pharmacy awards, at 21, or from 1 July 2027 if you have more than 6 months' service, under the phase-in. With no award, the National Minimum Wage pays 97.7% until 21.`,
      });
      faqs.push({
        q: "Will 20 year olds in fast food get the adult rate in 2027?",
        a: `Yes, if they have been with the employer more than 6 months: 95% from the first full pay period starting on or after ${PHASE_IN.start}, then 100% from 1 July 2027, under both the Fast Food and Pharmacy awards (determinations PR813654 and PR813656). With 6 months or less the rate stays 90% until 21. Retail is different: a 20-year-old with more than 6 months' service already gets 100%.`,
      });
      break;
    }
  }

  return faqs;
}

export { MIN_WAGE_AGES, SPOKE_HOURS };
