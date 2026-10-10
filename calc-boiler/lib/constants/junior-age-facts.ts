// =============================================================================
// Age-specific junior pay facts for the /minimum-wage-by-age/[age]/ spokes.
//
// Everything a spoke says that differs by age is derived here, so the seven
// pages carry facts that genuinely belong to one age rather than one template
// with the numbers swapped.
//
// AWARD SCALES. Read from the site's verified award constants only; nothing is
// re-keyed:
//   - General Retail (MA000004) cl 17.2 Table 5 and Hospitality (MA000009)
//     Table 5 from hospitality-award.ts (verified 28 July 2026);
//   - every MODERN_AWARDS entry with a junior scale from modern-awards.ts
//     (+ -oct, -oct2), each transcribed from the consolidated award text.
// A band label is matched exactly as the award prints it: "Under 16",
// "17", "20 and over". Retail's 20-year-old band splits on service and is
// handled explicitly.
//
// 18–20 PHASE-IN. [2026] FWCFB 222 (26 August 2026) and determinations
// PR813655 (Retail), PR813654 (Fast Food) and PR813656 (Pharmacy). Schedules
// live in junior-rates.ts (JUNIOR_TRANSITION_SCHEDULES); this file only reads
// them. It is a FOUR-YEAR PHASE-IN for employees with MORE than 6 months with
// their employer, not a jump to the adult rate, and PENDING_JUNIOR_CHANGE.inForce
// stays false until the first full pay period on or after 1 December 2026.
//
// STATE CHILD-EMPLOYMENT RULES (ages 14 and 15) are transcribed below from
// each state's own government page via Firecrawl on 10 October 2026, with the
// URL on every entry. There is no national minimum working age (Fair Work
// Ombudsman: "The minimum age for working depends on the state or territory
// you're working in."); nothing here claims one.
// =============================================================================

import { MODERN_AWARDS } from "./modern-awards";
import { HOSPITALITY_JUNIOR_SCALE, RETAIL_JUNIOR_SCALE } from "./hospitality-award";
import { JUNIOR_BANDS, JUNIOR_TRANSITION_SCHEDULES, PENDING_JUNIOR_CHANGE } from "./junior-rates";

export type SpokeAge = 14 | 15 | 16 | 17 | 18 | 19 | 20;

export interface ScaleBand {
  age: string;
  percentage: number;
}

/**
 * The band in a junior scale that covers an age, matched on the award's own
 * labels: "Under N", "N", "N and over". Labels with a service qualifier
 * ("20 (6 months or less)") match on the age, first row wins.
 */
export function bandForAge(scale: readonly ScaleBand[], age: number): ScaleBand | null {
  for (const b of scale) {
    const under = /^Under (\d+)$/.exec(b.age);
    if (under && age < Number(under[1])) return b;
    const over = /^(\d+) and over$/.exec(b.age);
    if (over && age >= Number(over[1])) return b;
    const exact = /^(\d+)(?: \(.+\))?$/.exec(b.age);
    if (exact && Number(exact[1]) === age) return b;
  }
  return null;
}

export interface JuniorScaleAward {
  /** Short name for prose, e.g. "Fast Food Award". */
  name: string;
  code: string;
  href: string;
  clause: string;
  /** Who the percentages apply to, where the award limits them; null = every classification. */
  scope: string | null;
  scale: readonly ScaleBand[];
  /** True for the awards most junior workers are on; shown first and in full. */
  main: boolean;
}

/** Scope notes kept short for a table cell. Read from each award's `appliesTo`. */
const SHORT_SCOPE: Record<string, string> = {
  MA000004: "levels 1–3 only",
  MA000012: "pharmacy assistant levels 1–2 only",
  MA000010: "a % of the C13 rate; not foundry juniors",
  MA000022: "trolley collectors only",
  MA000119: "not liquor service (adult rate)",
  MA000009: "not liquor service (adult rate)",
  MA000038: "adult rate for an 18+ driver in sole charge",
};

const MAIN_CODES = ["MA000004", "MA000003", "MA000009", "MA000119", "MA000012", "MA000005"];

function buildJuniorScaleAwards(): JuniorScaleAward[] {
  const out: JuniorScaleAward[] = [
    {
      name: "Retail Award",
      code: "MA000004",
      href: "/retail-award-rates/",
      clause: "cl 17.2, Table 5",
      scope: SHORT_SCOPE.MA000004,
      scale: RETAIL_JUNIOR_SCALE,
      main: true,
    },
    {
      name: "Hospitality Award",
      code: "MA000009",
      href: "/hospitality-award-rates/",
      clause: "Table 5",
      scope: SHORT_SCOPE.MA000009,
      scale: HOSPITALITY_JUNIOR_SCALE,
      main: true,
    },
  ];
  for (const a of Object.values(MODERN_AWARDS)) {
    if (!a.junior) continue;
    out.push({
      name: a.meta.shortName,
      code: a.meta.code,
      href: a.meta.href,
      clause: a.junior.clause,
      scope: SHORT_SCOPE[a.meta.code] ?? null,
      scale: a.junior.scale,
      main: MAIN_CODES.includes(a.meta.code),
    });
  }
  return out.sort((x, y) => {
    const ix = MAIN_CODES.indexOf(x.code);
    const iy = MAIN_CODES.indexOf(y.code);
    return (ix < 0 ? 99 : ix) - (iy < 0 ? 99 : iy);
  });
}

export const JUNIOR_SCALE_AWARDS: readonly JuniorScaleAward[] = buildJuniorScaleAwards();

/** The National Minimum Wage junior scale (cl 8.2, Special NMW 3), for award-free jobs. */
export const NMW_SCALE: readonly ScaleBand[] = JUNIOR_BANDS.map((b) => ({ age: b.age, percentage: b.percentage }));

export interface AwardAtAge {
  award: JuniorScaleAward;
  band: ScaleBand;
}

/** Every award junior scale's band and percentage at an age. */
export function awardsAtAge(age: number): AwardAtAge[] {
  return JUNIOR_SCALE_AWARDS.map((award) => ({ award, band: bandForAge(award.scale, age)! }));
}

export interface PercentGroup {
  percentage: number;
  awards: AwardAtAge[];
}

/** Awards grouped by the percentage they pay at this age, highest first. */
export function awardsByPercentageAtAge(age: number): PercentGroup[] {
  const groups = new Map<number, AwardAtAge[]>();
  for (const row of awardsAtAge(age)) {
    const k = Math.round(row.band.percentage * 1000) / 1000;
    groups.set(k, [...(groups.get(k) ?? []), row]);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([percentage, awards]) => ({ percentage, awards }));
}

export interface BirthdayStep {
  award: JuniorScaleAward;
  from: ScaleBand;
  to: ScaleBand;
}

/**
 * What the next birthday does under each award: `rises` lists awards whose
 * band changes (with the old and new band), `unchanged` those whose current
 * band still covers the next age. Retail at 19 → 20 compares with the
 * 6-months-or-less band, the one a new 20-year-old starts on.
 */
export function nextBirthday(age: number): { rises: BirthdayStep[]; unchanged: BirthdayStep[] } {
  const rises: BirthdayStep[] = [];
  const unchanged: BirthdayStep[] = [];
  for (const award of JUNIOR_SCALE_AWARDS) {
    const from = bandForAge(award.scale, age)!;
    const to = bandForAge(award.scale, age + 1) ?? { age: `${age + 1} (adult)`, percentage: 1 };
    (to.percentage > from.percentage ? rises : unchanged).push({ award, from, to });
  }
  rises.sort((a, b) => b.to.percentage - b.from.percentage - (a.to.percentage - a.from.percentage));
  return { rises, unchanged };
}

/** The first later age at which this scale pays more than it does at `age`, or null if already 100%. */
export function nextRiseAge(scale: readonly ScaleBand[], age: number): number | null {
  const now = bandForAge(scale, age)!.percentage;
  for (let a = age + 1; a <= 21; a++) {
    const b = bandForAge(scale, a);
    if ((b ? b.percentage : 1) > now) return a;
  }
  return null;
}

/** NMW (award-free) band now and at the next birthday. */
export function nmwNextBirthday(age: number): { from: ScaleBand; to: ScaleBand } {
  return { from: bandForAge(NMW_SCALE, age)!, to: bandForAge(NMW_SCALE, age + 1)! };
}

// -----------------------------------------------------------------------------
// When the adult rate applies (18–20 spokes)
// -----------------------------------------------------------------------------

/** First age at which a scale pays 100% (21 when the scale stops at 20). */
export function adultAgeOf(scale: readonly ScaleBand[]): number {
  for (let a = 14; a <= 21; a++) {
    const b = bandForAge(scale, a);
    if (b && b.percentage >= 1 && !/\(6 months or less\)/.test(b.age)) return a;
  }
  return 21;
}

/**
 * Award-specific adult-rate rules that the percentage tables do not show,
 * each read from the award constants (the clause is the one those files cite).
 */
export const ADULT_RATE_RULES: readonly { fromAge: number; label: string; text: string; href: string; source: string }[] = [
  {
    fromAge: 18,
    label: "Road Transport drivers in sole charge of a vehicle",
    text: "Road Transport Award: a junior aged 18 or over who drives a vehicle in sole charge must be paid the adult rate for that class of driving",
    href: "/road-transport-award-rates/",
    source: "MA000038 cl 17.3(b)",
  },
  {
    fromAge: 18,
    label: "Mining, where juniors may lawfully work",
    text: "Mining Award: where the law lets juniors work in mining, the award pays 100% from 18",
    href: "/mining-award-rates/",
    source: "MA000011 cl 15.2",
  },
  {
    fromAge: 20,
    label: "Timber (unapprenticed juniors)",
    text: "Timber Award: unapprenticed juniors reach 100% of the Level 2 rate for their stream at 20",
    href: "/timber-award-rates/",
    source: "MA000071 cl 20.6",
  },
];

/** Awards with no junior scale at all: juniors get the adult rate at any age. */
export const NO_JUNIOR_SCALE_AWARDS: readonly { name: string; href: string }[] = [
  { name: "Security", href: "/security-award-rates/" },
  { name: "SCHADS", href: "/schads-award-pay-rates/" },
  { name: "Aged Care", href: "/aged-care-award-rates/" },
  { name: "Nurses", href: "/nurses-award-rates/" },
  { name: "Building and Construction", href: "/building-and-construction-award-rates/" },
  { name: "Electrical", href: "/electrical-award-rates/" },
  { name: "Plumbing", href: "/plumbing-award-rates/" },
];

export interface AdultRateStatus {
  /** Awards whose scale already pays 100% at this age. */
  adultNow: JuniorScaleAward[];
  /** Awards that reach 100% at a later birthday, with that age. */
  later: { award: JuniorScaleAward; adultAt: number }[];
  /** Extra rules that put this age on the adult rate. */
  rules: typeof ADULT_RATE_RULES[number][];
}

export function adultRateStatus(age: number): AdultRateStatus {
  const adultNow: JuniorScaleAward[] = [];
  const later: { award: JuniorScaleAward; adultAt: number }[] = [];
  for (const award of JUNIOR_SCALE_AWARDS) {
    const at = adultAgeOf(award.scale);
    if (at <= age) adultNow.push(award);
    else later.push({ award, adultAt: at });
  }
  later.sort((a, b) => a.adultAt - b.adultAt);
  return { adultNow, later, rules: ADULT_RATE_RULES.filter((r) => r.fromAge <= age) };
}

/** Retail at 20: 90% in the first 6 months with the employer, 100% after. */
export const RETAIL_TWENTY_SPLIT = {
  upTo6Months: RETAIL_JUNIOR_SCALE.find((b) => b.age === "20 (6 months or less)")!.percentage,
  after6Months: RETAIL_JUNIOR_SCALE.find((b) => b.age === "20 (more than 6 months)")!.percentage,
} as const;

// -----------------------------------------------------------------------------
// The 18–20 phase-in, by age
// -----------------------------------------------------------------------------

export interface PhaseInRowForAge {
  key: "retail" | "fastFood" | "pharmacy";
  award: string;
  determination: string;
  present: number;
  steps: { effective: string; percentage: number }[];
}

/**
 * The PR813654–PR813656 schedule for one age (18, 19 or 20), per award, for
 * employees with more than 6 months with the employer. Steps after the first
 * 100% are dropped. Awards already at 100% (retail at 20) are left out.
 */
export function phaseInForAge(age: 18 | 19 | 20): PhaseInRowForAge[] {
  const k = `age${age}` as const;
  const out: PhaseInRowForAge[] = [];
  for (const key of ["retail", "fastFood", "pharmacy"] as const) {
    const s = JUNIOR_TRANSITION_SCHEDULES[key];
    if (s.present[k] >= 100) continue;
    const steps: { effective: string; percentage: number }[] = [];
    for (const r of s.rows) {
      steps.push({ effective: r.effective, percentage: r[k] });
      if (r[k] >= 100) break;
    }
    out.push({ key, award: s.award, determination: s.determination, present: s.present[k], steps });
  }
  return out;
}

/**
 * Re-read 10 October 2026 from the determinations themselves (Firecrawl, raw
 * markdown): PR813655 cl 17.2 Table 5 prints the 18–20 columns exactly as in
 * JUNIOR_TRANSITION_SCHEDULES, splits each of 18, 19 and 20 into "employed by
 * the employer for 6 months or less" (unchanged 70/80/90) and "more than
 * 6 months", and its Schedule B.3.1 prints Level 1 at $20.86 (18, more than
 * 6 months) and $23.64 (19) from 1 December 2026 — the same dollars this site
 * derives from the current $1,056.80 Level 1 weekly rate.
 *
 * The Fair Work Ombudsman's "Junior wage changes" page (content last updated
 * 8 April 2026) still describes the provisional view, so it is NOT cited.
 */
export const PHASE_IN = {
  decision: PENDING_JUNIOR_CHANGE.implementationDecision,
  decidedOn: PENDING_JUNIOR_CHANGE.implementationDecidedOn,
  start: PENDING_JUNIOR_CHANGE.earliestStart,
  inForce: PENDING_JUNIOR_CHANGE.inForce,
  serviceQualifier: PENDING_JUNIOR_CHANGE.serviceQualifier,
  decisionUrl: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2026fwcfb222.pdf",
  determinationUrl: (pr: string) => `https://www.fwc.gov.au/documents/awardsandorders/pdf/${pr.toLowerCase()}.pdf`,
} as const;

// -----------------------------------------------------------------------------
// State child-employment rules (14 and 15 spokes)
// -----------------------------------------------------------------------------

export const STATE_RULES_VERIFIED_ON = "10 October 2026";

export interface ChildWorkRule {
  jurisdiction: string;
  /** Page title as the government publishes it, for the source list. */
  title: string;
  publisher: string;
  url: string;
  /** What the page says applies to a 14-year-old. */
  at14: string;
  /** What the page says changes, or does not, at 15. */
  at15: string;
  /** One-sentence version for the 14 FAQ, where the state has something to say. */
  faq14?: string;
  /** One-sentence version for the 15 FAQ. */
  faq15?: string;
}

/**
 * Each entry transcribed from the raw markdown of the government page at
 * `url`, read via Firecrawl on 10 October 2026. Quoted wording in comments.
 * No entry states or implies a national minimum working age.
 */
export const CHILD_WORK_RULES: readonly ChildWorkRule[] = [
  {
    // "Employing children under 15 years old"; "An employer usually needs a
    // licence to employ someone under 15"; "13 to deliver pharmaceutical
    // products or do other types of work, such as retail or hospitality";
    // "between 6 am and 9 pm"; "During a school term, children can work for a
    // maximum of 3 hours a day and 12 hours per week"; holidays "6 hours a day
    // and 30 hours per week"; "a 30-minute rest break after every 3 hours";
    // "at least 12 hours break between shifts"; written parental consent;
    // supervisor "at least 18 years old" with a Working with Children Clearance.
    jurisdiction: "VIC",
    title: "Employing children under 15 years old (Workforce Inspectorate Victoria)",
    publisher: "Victorian Government",
    url: "https://www.vic.gov.au/child-employment-licence",
    at14: "The employer usually needs a child employment licence for anyone under 15. Retail and hospitality need you to be at least 13. Work only between 6am and 9pm and outside school hours: at most 3 hours a day and 12 a week in term, 6 a day and 30 a week in holidays, a 30-minute break every 3 hours and 12 hours between shifts. A parent must consent in writing, and a supervisor aged 18 or over must hold a Working with Children Clearance.",
    at15: "The licence, hours, break, consent and supervision rules are written for children under 15, so none of them applies from the 15th birthday.",
    faq14: "In Victoria the employer usually needs a child employment licence for anyone under 15, and term-time work is capped at 3 hours a day and 12 hours a week.",
    faq15: "Victoria's child employment licence covers workers under 15 only.",
  },
  {
    // "Generally the minimum age for employment is 13"; "On a school day a
    // school-aged child can work a maximum of 4 hours"; table: school day 4,
    // non-school day 8, school week 12, non-school week 38; "must not allow a
    // school-aged or young child to work between the hours of 10pm and 6am";
    // "not ... more than 1 shift on a single day"; one-hour break after the
    // fourth hour; 12-hour break between shifts. Rules apply to "school-aged
    // and young children", not to an age.
    jurisdiction: "QLD",
    title: "Restrictions on children working in Queensland (Business Queensland)",
    publisher: "Queensland Government",
    url: "https://www.business.qld.gov.au/running-business/employing/hiring-recruitment/employing-children/restrictions",
    at14: "The general minimum age is 13. A school-aged child can work at most 4 hours on a school day and 8 on other days, 12 hours in a school week and 38 in a non-school week, one shift a day, never between 10pm and 6am, with a 1-hour break after the fourth hour and 12 hours between shifts.",
    at15: "Nothing changes at 15. The limits follow school age, not a birthday: a 15-year-old still at school keeps the 4-hour school-day and 12-hour school-week caps and the 10pm to 6am ban.",
    faq14: "Queensland's general minimum age is 13, and a school-aged child can work at most 4 hours on a school day and 12 hours in a school week.",
    faq15: "In Queensland what still applies is hours: a school-aged 15-year-old can work at most 4 hours on a school day and 12 hours in a school week.",
  },
  {
    // "Children aged 13 and 14 ... Are allowed to: deliver newspapers ...; work
    // in a shop, fast food outlet, cafe, restaurant; or collect shopping
    // trolleys ... as long as: they have written permission from a parent; the
    // job is outside school hours; and they do not start work before 6am or
    // finish after 10pm." "Children aged 15 or older (of compulsory school
    // age): Cannot work during school hours without appropriate approvals ...
    // and do not require written permission from a parent." Perth Royal Show:
    // "15 years old to work on an amusement ride".
    jurisdiction: "WA",
    title: "When children can work in Western Australia",
    publisher: "Government of Western Australia",
    url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/when-children-can-work-western-australia",
    at14: "A 13 or 14-year-old may deliver newspapers or advertising, work in a shop, fast food outlet, cafe or restaurant, or collect shopping trolleys, only with a parent's written permission, outside school hours and between 6am and 10pm. Family businesses, professional performing and charity work are allowed at any age.",
    at15: "A parent's written permission is no longer needed, and the under-15 job list no longer applies. A 15-year-old of compulsory school age still cannot work in school hours without approval. At the Perth Royal Show, 15 is the minimum age to work on an amusement ride.",
    faq14: "In Western Australia a 14-year-old may work in a shop, fast food outlet, cafe or restaurant, collect trolleys or deliver newspapers, with a parent's written permission, between 6am and 10pm.",
    faq15: "Western Australia requires a parent's written permission only for 13 and 14-year-olds.",
  },
  {
    // "Hours for employees under 15 must be no more than 10 hours a week in
    // total"; "up to 6 hours a day for children aged 12 to 15"; one shift a
    // day; "outside of school hours"; consent of the child and "the written
    // consent of their parent or guardian"; high-risk work includes "service
    // of alcohol" and "gaming or gambling"; "People under 15 generally cannot
    // start apprenticeships or do work experience"; "There are no restrictions
    // on the hours people aged 15 to 17 can work."
    jurisdiction: "ACT",
    title: "Employing young people (ACT Government)",
    publisher: "ACT Government",
    url: "https://www.act.gov.au/community/youth/employing-young-people",
    at14: "Light work only, nothing high risk (no serving alcohol, gaming, dangerous machinery or heights), at most 10 hours a week and one shift a day of up to 6 hours, outside school hours. The employer needs your consent and a parent's written consent. Under-15s generally cannot start an apprenticeship or do work experience.",
    at15: "The ACT sets no limit on the hours people aged 15 to 17 can work. Work still must not get in the way of school or fall in school hours, and the employment standards apply until 18.",
    faq14: "The ACT allows under-15s at most 10 hours of light work a week, with a parent's written consent.",
    faq15: "The ACT's 10-hour weekly cap and parental-consent rule are for under-15s; it sets no hour limit from 15 to 17.",
  },
  {
    // "Children under 15 can only work in limited roles that are safe and
    // age-appropriate, such as: babysitting; helping in family businesses;
    // delivering newspapers." "Children aged 15 and over can work in a wider
    // range of roles ..." "against the law for children under 15 to work
    // between 10pm and 6am"; school-based apprenticeships and traineeships.
    jurisdiction: "NT",
    title: "School-age children in jobs (NT Government)",
    publisher: "Northern Territory Government",
    url: "https://nt.gov.au/learning/student-wellbeing-and-inclusion/school-attendance/school-age-children-in-jobs",
    at14: "Under-15s can work only in limited, safe roles such as babysitting, helping in a family business or delivering newspapers, never in school hours and never between 10pm and 6am.",
    at15: "From 15 a wider range of jobs is allowed if the work is safe, suits your age and does not interfere with school, and a school-based apprenticeship or traineeship is an option. School-age children still cannot work in school hours.",
    faq14: "The Northern Territory limits under-15s to roles such as babysitting, a family business or delivering newspapers.",
    faq15: "The Northern Territory opens a wider range of jobs from 15.",
  },
  {
    // "There are no minimum age restrictions for work in NSW." Office of the
    // Children's Guardian rules for "child employees (those under the age of
    // 16)" cover "still photography, modelling work, promotional work,
    // performance art and public speaking" and do "not apply ... in retail or
    // hospitality"; hours in those jobs "are limited by compulsory schooling
    // requirements".
    jurisdiction: "NSW",
    title: "Starting work: minimum age and requirements (NSW Government)",
    publisher: "NSW Government",
    url: "https://www.nsw.gov.au/employment/rights-responsibilities/starting-work",
    at14: "No minimum age. The Office of the Children's Guardian rules for under-16s cover modelling, photography, promotional work, performance and public speaking, not retail or hospitality, where hours are limited only by compulsory schooling.",
    at15: "Same as at 14: no minimum age, and the under-16 Children's Guardian rules still do not reach retail or hospitality jobs.",
  },
  {
    // "There is no minimum working age in South Australia." "a child of
    // compulsory school age (between 6 and 16 years of age) cannot be employed
    // during the hours that they are required to attend school"; not at a time
    // "likely to render them unfit to attend school"; "a fast food outlet may
    // choose not to employ children under the age of 14"; "Students aged 15
    // and 16 can apply for a permanent exemption from school for employment
    // reasons."
    jurisdiction: "SA",
    title: "Minimum working age (SafeWork SA)",
    publisher: "SafeWork SA",
    url: "https://safework.sa.gov.au/workers/wages-and-conditions/minimum-working-age",
    at14: "No minimum working age, but a child of compulsory school age (6 to 16) cannot work in school hours or at times, such as late at night, that leave them unfit for school. Some businesses set their own minimum age.",
    at15: "Still no minimum age and still no work in school hours, but at 15 a student can apply for a permanent exemption from school for employment reasons, to be discussed with the school principal.",
    faq15: "South Australia has no minimum working age, and from 15 a student can apply for an exemption from school to work.",
  },
  {
    // "Generally there is no minimum age to start casual or part-time work in
    // Tasmania but there are age restrictions for certain types of work." No
    // work "during school hours" without an approved part-time attendance or
    // exemption application. "From Year 10, you can undertake an Australian
    // School-based Apprenticeship."
    jurisdiction: "TAS",
    title: "Employment while studying (Tasmanian Department for Education, Children and Young People)",
    publisher: "Tasmanian Government",
    url: "https://www.decyp.tas.gov.au/learning/primary-school-to-year-12/employment-while-studying/",
    at14: "Generally no minimum age for casual or part-time work, though some types of work have age limits. No work in school hours unless a part-time attendance or exemption application is approved first.",
    at15: "No age-based change at 15; school hours stay off limits without an approved application. From Year 10 a school-based apprenticeship is possible.",
  },
];

/**
 * School and work at 16 and 17: only what the same government pages (read
 * 10 October 2026) say about these ages. Jurisdictions whose page says
 * nothing age-specific for 16 or 17 are left out rather than guessed.
 */
export const SCHOOL_AGE_RULES: readonly { jurisdiction: string; url: string; at16?: string; at17?: string; at18?: string }[] = [
  {
    // "Compulsory schooling requirements for a child under 17 years of age are
    // set out in the Education Act 1990 (NSW)"; hours in hospitality and retail
    // "are limited by compulsory schooling requirements and attendance";
    // "If you're under the age of 17 and wish to seek full-time work, with the
    // intention of leaving school, talk to the Career Adviser at your school".
    // Children's Guardian rules: "child employees (those under the age of 16)".
    jurisdiction: "NSW",
    url: "https://www.nsw.gov.au/employment/rights-responsibilities/starting-work",
    at16: "The Children's Guardian rules for child employees stop at 16. Compulsory schooling still limits hours in retail and hospitality, because the Education Act 1990 sets those requirements for children under 17; anyone under 17 who wants to leave school for full-time work is told to talk to the school's career adviser about applying to leave.",
    at17: "NSW Industrial Relations says the compulsory schooling requirements that limit a junior's retail and hospitality hours are set for children under 17 (Education Act 1990).",
  },
  {
    // "a child of compulsory school age (between 6 and 16 years of age) cannot
    // be employed during the hours that they are required to attend school";
    // "Students aged 15 and 16 can apply for a permanent exemption from school
    // for employment reasons."
    jurisdiction: "SA",
    url: "https://safework.sa.gov.au/workers/wages-and-conditions/minimum-working-age",
    at16: "SafeWork SA describes compulsory school age as between 6 and 16, and students aged 15 and 16 can apply for a permanent exemption from school for employment reasons, to be discussed with the principal.",
  },
  {
    // "There are no restrictions on the hours people aged 15 to 17 can work."
    // Work for under 18s must not "get in the way of their education" or "be
    // during school hours if they are attending school". Standards apply to
    // anyone "under 18".
    jurisdiction: "ACT",
    url: "https://www.act.gov.au/community/youth/employing-young-people",
    at16: "No limit on the hours a 16-year-old can work, but not in school hours while attending school.",
    at17: "Still no hour limit at 17. The Children and Young People Employment Standards apply until 18, so the work must not get in the way of education.",
    at18: "The Children and Young People Employment Standards cover workers under 18, so from 18 an ACT employer no longer has to meet them (they cover working hours, supervision, the type of work and risk levels).",
  },
  {
    // "All Tasmanian students must participate in education and training until
    // they complete Year 12, attain a Certificate III, or turn 18"; leaving for
    // work needs an exemption showing "full-time employment ... a minimum of
    // 35 hours a week"; "If you are 17 years old or older and plan to
    // undertake part-time study and employment, you need to complete and have
    // approved an Application for Part-time Attendance".
    jurisdiction: "TAS",
    url: "https://www.decyp.tas.gov.au/learning/primary-school-to-year-12/employment-while-studying/",
    at16: "Students must stay in education or training until they finish Year 12, gain a Certificate III or turn 18. Leaving early for work needs an approved exemption showing full-time employment of at least 35 hours a week.",
    at17: "From 17, combining part-time study with work needs an approved Application for Part-time Attendance. The education-or-training requirement still runs to Year 12, a Certificate III or 18.",
    at18: "The requirement to stay in education or training ends at 18 at the latest (or earlier, on finishing Year 12 or a Certificate III), so no exemption is needed to work full time.",
  },
  {
    // "Such a notice can be issued in relation to the employment of any child
    // under the age of 18 years." "There are restrictions on the serving of
    // alcohol by people under 18 years of age."
    jurisdiction: "WA",
    url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/when-children-can-work-western-australia",
    at17: "The Department of Communities can still limit the work of any child under 18 if it is harmful, and serving alcohol is restricted for under-18s.",
    at18: "The Department of Communities' power to limit a child's work covers under-18s only, and so do the restrictions on serving alcohol.",
  },
  {
    // Restrictions apply to "school-aged and young children": 4 hours on a
    // school day, 12 in a school week, no work 10pm to 6am.
    jurisdiction: "QLD",
    url: "https://www.business.qld.gov.au/running-business/employing/hiring-recruitment/employing-children/restrictions",
    at16: "While a 16-year-old is still school-aged, the 4-hour school-day and 12-hour school-week limits and the 10pm to 6am ban still apply.",
  },
];

// -----------------------------------------------------------------------------
// Apprentices and trainees (18–20 spokes)
// -----------------------------------------------------------------------------

/**
 * Fair Work Ombudsman, read 10 October 2026:
 *  - Junior pay rates page: "Junior pay rates are different to apprentice
 *    rates, which can apply in some awards for apprentices that start their
 *    apprenticeship before they turn 21."
 *  - Apprentice and trainee pay rates page: an adult apprentice is "an
 *    apprentice who is 21 years or older when they start their
 *    apprenticeship"; "Most trainees get their pay and conditions related to
 *    their training from Schedule E in the Miscellaneous Award"; "an employee
 *    completing a diploma gets paid the relevant adult or junior rate in their
 *    award"; apprentice rates need "a formal training contract".
 */
export const APPRENTICE_TRAINEE = {
  adultApprenticeStartAge: 21,
  fwoApprenticeUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/apprentice-and-trainee-pay-rates",
  fwoJuniorUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/junior-pay-rates",
} as const;
