// =============================================================================
// State public service level pages (23 Oct 2026):
//   /public-service-pay-scales/vic/vps-2/ ... vps-7/
//   /public-service-pay-scales/qld/ao2/   ... ao8/
//   /public-service-pay-scales/sa/aso-2/  ... aso-8/
//
// No salary is typed here. Every figure is read from levelSections() in
// ./index.ts, which regroups the verified schedules in vic.ts, qld.ts and
// sa.ts, so a level page cannot drift from its jurisdiction page.
//
// Why these pages (GSC 23 Sep to 20 Oct 2026, DataForSEO AU Sep 2026): the
// VPS family had 10,339 impressions landing on one page at 0.53% CTR; vps
// salary 3,600/mo, vps 6 salary 590, vps 5 390, vps 4 320; ao3 260, ao4 170,
// ao5 170; aso3 210, aso4 210, aso5 170. The APS level pages beat their hub on
// CTR (aps-5 1.23% vs 0.48%). VPS 1, AO1 and ASO-1 have no search volume and
// are left on the jurisdiction page.
// =============================================================================

import { getJurisdiction, levelSections, type LevelSection } from "./index";
import type { Jurisdiction, PayFaq } from "./types";
import { formatBandRange, formatSalary } from "./types";
import { levelFactFaqs } from "./state-level-facts";

export type StateLevelJurisdiction = "vic" | "qld" | "sa";

interface StateLevelConfig {
  /** Level section ids (from levelSections) that get their own page. */
  levels: readonly string[];
  /** Shown once in the intro: "VPS 5 (VPS Grade 5)". */
  alsoCalled: (label: string) => string;
  /** The date the figures apply from, as a sentence fragment. */
  effective: string;
  /** One or two sentences on the next scheduled change. */
  nextRise: string;
  /** Employer super as a number, or null when the instrument sets none. */
  superRate: number | null;
  /** Employer super, in this service's own terms (short, level-neutral). */
  superText: string;
  /** How you move between steps and levels (short, level-neutral). */
  progression: string;
  /** What a "step" is called in this structure. */
  stepWord: string;
  /** A caveat every page in this jurisdiction must carry, if any. */
  caveat?: string;
}

export const STATE_LEVEL_CONFIG: Record<StateLevelJurisdiction, StateLevelConfig> = {
  vic: {
    levels: ["vps-2", "vps-3", "vps-4", "vps-5", "vps-6", "vps-7"],
    alsoCalled: (label) => `${label.replace(" ", "")}, VPS Grade ${label.split(" ")[1]}`,
    effective: "1 May 2026",
    nextRise:
      "The Victorian Public Service Enterprise Agreement 2024 sets a further 3% increase from 1 May 2027, the last of its four 3% rises. Until then the 1 May 2026 rates on this page apply.",
    superRate: null,
    superText:
      "The VPS agreement sets no employer super rate above the legal minimum. Clause 41.2 only requires enough to avoid the superannuation guarantee charge, so the Superannuation Guarantee rate applies. APS agencies pay a median of 15.4%, so compare total pay, not just salary, if you are weighing a federal job.",
    progression:
      "Moving up a progression step is not automatic. Under clause 31 you are considered once a year, at the end of the performance cycle, if you have 12 months at your current step and a current performance and development plan. On the top step, a successful cycle pays a lump sum of 1.5% of salary instead. Moving from one value range to the next (3.1 to 3.2, say) needs a job resizing review, not time served.",
    stepWord: "progression step",
  },
  qld: {
    levels: ["ao2", "ao3", "ao4", "ao5", "ao6", "ao7", "ao8"],
    alsoCalled: (label) => `${label.replace("AO", "AO ")}, Administrative Officer Level ${label.slice(2)}`,
    effective: "1 September 2026",
    nextRise:
      "Award rates rose 4.75% from 1 September 2026 under the 2026 State Wage Case and next move when the Queensland Industrial Relations Commission decides the 2027 case. The State Government Entities Certified Agreement 2023 nominally expired on 30 June 2026 and keeps applying until a replacement is certified.",
    superRate: 12.75,
    superText:
      "The Queensland Government pays 12.75% employer super for employees under 75, above the Superannuation Guarantee. It is paid on ordinary time earnings, including paid leave and ordinary-time allowances such as shift and weekend penalties.",
    progression:
      "Queensland levels are written as level and pay point, so AO5/2 is the second pay point of AO5. You move up one pay point at a time under the certified agreement and public sector directives. A move to the next level is a promotion to a job classified at that level. AO7 and PO5 pay the same at every pay point, so a move between streams at the same level is not a pay rise.",
    stepWord: "pay point",
    caveat:
      "These are the award rates, the legal minimum. Most Queensland departments pay under the State Government Entities Certified Agreement 2023 (the core agreement). We have not reproduced its wage schedule, so check your department's schedule. The Department of Education rates further down are one agency's agreement, shown for comparison. Where any agreement rate is below the award, the award rate is paid.",
  },
  sa: {
    levels: ["aso-2", "aso-3", "aso-4", "aso-5", "aso-6", "aso-7", "aso-8"],
    alsoCalled: (label) => `${label.replace("-", "")}, ASO ${label.split("-")[1]}, Administrative Services Officer Level ${label.split("-")[1]}`,
    effective: "the first full pay period on or after 1 July 2026",
    nextRise:
      "The SA Public Sector Enterprise Agreement: Salaried 2026 sets one more increase, from the first full pay period on or after 1 July 2027 (clause 7.2). Until then the 1 July 2026 rates on this page apply.",
    superRate: null,
    superText:
      "The Salaried 2026 agreement does not state an employer super rate. Super is paid to Super SA by default, and you can choose your own fund. Treat the Superannuation Guarantee as the floor and check your agency's arrangement.",
    progression:
      "Each ASO level has a few numbered increments. You move up increments within your level; a move to the next level happens by appointment to a job classified at that level, not by time served. ASO levels do not overlap, so the top of one level is always below the bottom of the next.",
    stepWord: "increment",
  },
};

export const STATE_LEVEL_JURISDICTIONS = Object.keys(STATE_LEVEL_CONFIG) as StateLevelJurisdiction[];

export interface StateLevelData {
  jurisdiction: Jurisdiction;
  config: StateLevelConfig;
  section: LevelSection;
  /** Every pay point in the level, lowest first. */
  points: { label: string; annual: number; band: string }[];
  /** Neighbouring levels in the full structure, for the "moving up" text. */
  previous?: LevelSection;
  next?: LevelSection;
  /** The levels that have their own page, in order, for the level nav. */
  siblings: LevelSection[];
}

function sectionsFor(slug: StateLevelJurisdiction): { jurisdiction: Jurisdiction; sections: LevelSection[] } {
  const jurisdiction = getJurisdiction(slug);
  if (!jurisdiction) throw new Error(`No jurisdiction ${slug}`);
  // Only the main stream: SA's extra SSO schedule is a different workforce.
  const sections = levelSections(jurisdiction).filter((s) => s.schedule.id === jurisdiction.levelGuide?.scheduleId);
  return { jurisdiction, sections };
}

/** Every built level page as route params. */
export function stateLevelParams(): { jurisdiction: StateLevelJurisdiction; grade: string }[] {
  return STATE_LEVEL_JURISDICTIONS.flatMap((jurisdiction) =>
    STATE_LEVEL_CONFIG[jurisdiction].levels.map((grade) => ({ jurisdiction, grade })),
  );
}

export function isStateLevelJurisdiction(slug: string): slug is StateLevelJurisdiction {
  return slug in STATE_LEVEL_CONFIG;
}

export function stateLevelData(jurisdictionSlug: string, grade: string): StateLevelData | undefined {
  if (!isStateLevelJurisdiction(jurisdictionSlug)) return undefined;
  const config = STATE_LEVEL_CONFIG[jurisdictionSlug];
  if (!config.levels.includes(grade)) return undefined;
  const { jurisdiction, sections } = sectionsFor(jurisdictionSlug);
  const i = sections.findIndex((s) => s.id === grade);
  if (i < 0) return undefined;
  const section = sections[i];
  const points = section.bands
    .flatMap((band) =>
      (band.payPoints ?? []).map((p) => ({ label: p.label, annual: p.annual, band: band.code })),
    );
  return {
    jurisdiction,
    config,
    section,
    points,
    previous: sections[i - 1],
    next: sections[i + 1],
    siblings: sections.filter((s) => config.levels.includes(s.id)),
  };
}

/** The level page for a level label on a jurisdiction page ("VPS 5" -> /vic/vps-5/). */
export function stateLevelHref(jurisdictionSlug: string, sectionId: string): string | undefined {
  if (!isStateLevelJurisdiction(jurisdictionSlug)) return undefined;
  return STATE_LEVEL_CONFIG[jurisdictionSlug].levels.includes(sectionId)
    ? `/public-service-pay-scales/${jurisdictionSlug}/${sectionId}/`
    : undefined;
}

export function stateLevelPath(d: StateLevelData): string {
  return `/public-service-pay-scales/${d.jurisdiction.slug}/${d.section.id}/`;
}

export function stateLevelMeta(d: StateLevelData): { title: string; description: string } {
  const { label, range } = d.section;
  const title = `${label} Salary 2026 - Pay Points and Take-Home Pay`;
  const description = `${label} salary from ${d.config.effective}: ${formatBandRange(range)} across ${d.points.length} ${d.config.stepWord}s. Every ${d.config.stepWord}, pay per fortnight and after tax.`;
  return { title, description };
}

export interface LevelSteps {
  /** Moves from the first step to the top step. */
  moves: number;
  /** Top minus bottom, in dollars and as a % of the bottom. */
  spread: number;
  spreadPct: number;
  /** Average dollar gain per move. */
  averageStep: number;
  /** Largest single move between consecutive steps. */
  largest: { from: string; to: string; gain: number };
}

/** The shape of the ladder inside one level, computed from its pay points. */
export function levelSteps(d: StateLevelData): LevelSteps {
  const p = d.points;
  const spread = p[p.length - 1].annual - p[0].annual;
  let largest = { from: p[0].label, to: p[0].label, gain: 0 };
  for (let i = 1; i < p.length; i++) {
    const gain = p[i].annual - p[i - 1].annual;
    if (gain > largest.gain) largest = { from: p[i - 1].label, to: p[i].label, gain };
  }
  return {
    moves: p.length - 1,
    spread,
    spreadPct: (spread / p[0].annual) * 100,
    averageStep: spread / Math.max(1, p.length - 1),
    largest,
  };
}

/** "a VPS 5", "an AO5", "an ASO-5". */
export function withArticle(label: string): string {
  return `${/^[AEIOU]/i.test(label) ? "an" : "a"} ${label}`;
}

/** Per-level questions. Every number comes from the level's own data. */
export function stateLevelFaqs(d: StateLevelData): PayFaq[] {
  const { label, range } = d.section;
  const n = d.points.length;
  const first = d.points[0];
  const last = d.points[n - 1];
  const faqs: PayFaq[] = [
    {
      q: `How much does ${withArticle(label)} earn?`,
      a: `From ${d.config.effective}, ${label} pays ${formatSalary(range.min)} at the first ${d.config.stepWord} (${first.label}) and ${formatSalary(range.max)} at the top (${last.label}), across ${n} ${d.config.stepWord}s. That is a full-time annual salary before tax, with superannuation paid on top.`,
    },
    // Level-specific questions from real searches (state-level-facts.ts).
    ...levelFactFaqs(d),
    {
      q: `What is ${label} pay per fortnight?`,
      a: `Before tax, ${label} is about ${formatSalary(range.min / 26)} a fortnight at the bottom and ${formatSalary(range.max / 26)} at the top, dividing the annual salary by 26. Your payslip can differ slightly because ${d.jurisdiction.shortName} payroll uses its own fortnightly rate. The table on this page shows take-home pay for every ${d.config.stepWord}.`,
    },
  ];
  if (d.next) {
    const gap = d.next.range.min - range.max;
    faqs.push({
      q: `What is the difference between ${label} and ${d.next.label}?`,
      a:
        gap > 0
          ? `The top of ${label} is ${formatSalary(range.max)} and the bottom of ${d.next.label} is ${formatSalary(d.next.range.min)}, so a promotion from the top of ${label} is a rise of ${formatSalary(gap)} a year. ${d.next.label} runs to ${formatSalary(d.next.range.max)}.`
          : `The ranges overlap or touch: the top of ${label} is ${formatSalary(range.max)} and the bottom of ${d.next.label} is ${formatSalary(d.next.range.min)}. A promotion from the top of ${label} can pay little or no more at first; the gain comes from the higher ${d.config.stepWord}s of ${d.next.label}, which run to ${formatSalary(d.next.range.max)}.`,
    });
  }
  faqs.push({
    q: `When does ${label} pay go up next?`,
    a: d.config.nextRise,
  });
  if (d.config.caveat) {
    faqs.push({ q: `Is this what every ${d.jurisdiction.shortName} department pays ${withArticle(label)}?`, a: d.config.caveat });
  }
  return faqs;
}
