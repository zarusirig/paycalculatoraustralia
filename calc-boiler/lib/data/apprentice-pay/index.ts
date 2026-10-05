// =============================================================================
// Apprentice minimum pay rates, by trade, from the modern awards.
//
// Every figure below was read from the Fair Work Commission's consolidated
// award text on 5 October 2026 (awards.fairwork.gov.au, via Firecrawl) and is
// the rate in force from the first full pay period starting on or after
// 1 July 2026 (Annual Wage Review 2025-26, [2026] FWCFB 3500):
//
//   Electrical      MA000025  cl 16.4 + Schedule B.4   (reused from lib/data/job-pay-rates/apprentice-electrician.ts, read 23 Sep 2026)
//   Plumbing        MA000036  cl 18.2(c) + Schedule E.2.1 (award consolidated to 16 Sep 2026)
//   Building        MA000020  cl 19.7(b)(i)            percentage of the CW3 "standard rate" ($1,119.10), ALLOWANCES EXTRA
//   Automotive      MA000089  cl 16.9(b), 16.10(b) + Schedule B.5, B.6 (RS&R)
//   Hair and beauty MA000005  cl 18.1, 18.2 (Tables 6 to 9)
//   Cookery         MA000009  cl 19.1(b) (Table 7), junior apprentices in a trade other than waiting
//
// Scope: apprentices who started on or after 1 January 2014 under a standard
// 4-year term (the vast majority now in training). Not modelled, because they
// were not verified or are set by other instruments: pre-2014 apprentices,
// 3-year terms, trainees, school-based apprentices (each award's schedule),
// adult-apprentice rules for plumbing, building, hair and beauty and cookery
// (the awards set them as "greater of" tests that depend on an employee's prior
// pay), waiting (food and beverage) apprentices, enterprise agreements, and
// every trade whose award we did not read (e.g. metal fabrication, bricklayers
// beyond the building award, roof tilers, horticulture).
//
// "Hourly" is the award's published hourly figure (Schedule B/E/RS&R, Tables
// 6-9, Table 7) or, where the award prints only a weekly rate, weekly / 38.
// =============================================================================

import { APPRENTICE_ELECTRICIAN } from "../job-pay-rates/apprentice-electrician";

export const APPRENTICE_PAY_VERIFIED_ON = "5 October 2026";
export const APPRENTICE_RATES_FROM = "the first full pay period starting on or after 1 July 2026";

export type ApprenticeTrack = "junior" | "adult";
export type ApprenticeStage = 1 | 2 | 3 | 4;
export type Year12 = "completed" | "not-completed" | "either";

export interface ApprenticeRate {
  stage: ApprenticeStage;
  year12: Year12;
  /** Percentage of the award's reference rate, where the award states one. */
  pct?: number;
  /** Full-time weekly minimum, dollars (38-hour week). */
  weekly: number;
  /** Hourly minimum, dollars. */
  hourly: number;
}

export interface ApprenticeTrade {
  slug: string;
  name: string;
  /** Who the rates cover, in the award's terms. */
  coverage: string;
  award: { name: string; code: string; url: string; clause: string };
  /** What "weekly" and "hourly" contain, so trades are not compared like for like by mistake. */
  rateIncludes: string;
  /** True when the published hourly rate already contains the all-purpose allowances. */
  includesAllowances: boolean;
  junior: ApprenticeRate[];
  adult: ApprenticeRate[] | null;
  /** Plain facts about progression, allowances and what is not modelled. */
  notes: string[];
  /** Existing page on this site for the trade, if any. */
  tradePageHref?: string;
}

/** Cl 19.1 CW3 "standard rate" in the Building and Construction award; also the R6 / hair level 3 / cookery grade 3 base. */
export const STANDARD_WEEKLY_RATE = 1119.1;
export const FULL_TIME_HOURS = 38;

const awardUrl = (code: string) => `https://awards.fairwork.gov.au/${code}.html`;

// ---- Electrical (reused) ---------------------------------------------------
function electricalRows(): { junior: ApprenticeRate[]; adult: ApprenticeRate[] } {
  const t = (id: string) => {
    const table = APPRENTICE_ELECTRICIAN.tables.find((x) => x.id === id);
    if (!table) throw new Error(`Missing electrician table ${id}`);
    return table.rows;
  };
  const y12 = t("junior-year-12");
  const no12 = t("junior-no-year-12");
  const adult = t("adult");
  const stages: ApprenticeStage[] = [1, 2, 3, 4];
  const junior: ApprenticeRate[] = [];
  const pctYes = [55, 65, 70, 82];
  const pctNo = [50, 60, 70, 82];
  stages.forEach((s, i) => {
    junior.push({ stage: s, year12: "not-completed", pct: pctNo[i], weekly: no12[i].weekly, hourly: no12[i].hourly });
    junior.push({ stage: s, year12: "completed", pct: pctYes[i], weekly: y12[i].weekly, hourly: y12[i].hourly });
  });
  const adultRows: ApprenticeRate[] = [
    { stage: 1, year12: "either", pct: 80, weekly: adult[0].weekly, hourly: adult[0].hourly },
    { stage: 2, year12: "either", weekly: adult[1].weekly, hourly: adult[1].hourly },
    { stage: 3, year12: "either", weekly: adult[1].weekly, hourly: adult[1].hourly },
    { stage: 4, year12: "either", weekly: adult[1].weekly, hourly: adult[1].hourly },
  ];
  return { junior, adult: adultRows };
}

const electrical = electricalRows();

// ---- Plumbing: Schedule E.2.1 hourly rates, weekly = hourly x 38 ------------
const plumbHourly = {
  "not-completed": [16.56, 19.65, 22.75, 28.93],
  completed: [18.11, 21.2, 22.75, 28.93],
} as const;
const plumbPct = {
  "not-completed": [50, 60, 70, 90],
  completed: [55, 65, 70, 90],
} as const;

function plumbingRows(): ApprenticeRate[] {
  const out: ApprenticeRate[] = [];
  ([1, 2, 3, 4] as const).forEach((s, i) => {
    (["not-completed", "completed"] as const).forEach((y) => {
      const hourly = plumbHourly[y][i];
      out.push({ stage: s, year12: y, pct: plumbPct[y][i], weekly: Math.round(hourly * FULL_TIME_HOURS * 100) / 100, hourly });
    });
  });
  return out;
}

// ---- Percentage-of-standard-rate trades ------------------------------------
interface PctRow {
  stage: ApprenticeStage;
  year12: Year12;
  pct: number;
  weekly: number;
  hourly: number;
}

/** Weekly and hourly as the award (or the arithmetic on its reference rate) gives them. */
function rows(spec: readonly (readonly [ApprenticeStage, Year12, number, number, number])[]): PctRow[] {
  return spec.map(([stage, year12, pct, weekly, hourly]) => ({ stage, year12, pct, weekly, hourly }));
}

// MA000020 cl 19.7(b)(i)(A): 50/60/75/90 (not Year 12), 55/65/75/90 (Year 12) of $1,119.10; hourly = weekly / 38.
const BUILDING = rows([
  [1, "not-completed", 50, 559.55, 14.73],
  [1, "completed", 55, 615.51, 16.2],
  [2, "not-completed", 60, 671.46, 17.67],
  [2, "completed", 65, 727.42, 19.14],
  [3, "not-completed", 75, 839.33, 22.09],
  [3, "completed", 75, 839.33, 22.09],
  [4, "not-completed", 90, 1007.19, 26.51],
  [4, "completed", 90, 1007.19, 26.51],
]);

// MA000089 cl 16.9(b) + Schedule B.5.1 (junior), B.6.1 (adult). 4th year junior is 88%.
const AUTOMOTIVE_JUNIOR = rows([
  [1, "not-completed", 50, 559.55, 14.73],
  [1, "completed", 55, 615.51, 16.2],
  [2, "not-completed", 60, 671.46, 17.67],
  [2, "completed", 65, 727.42, 19.14],
  [3, "not-completed", 75, 839.33, 22.09],
  [3, "completed", 75, 839.33, 22.09],
  [4, "not-completed", 88, 984.81, 25.92],
  [4, "completed", 88, 984.81, 25.92],
]);
const AUTOMOTIVE_ADULT: ApprenticeRate[] = [
  { stage: 1, year12: "either", pct: 80, weekly: 895.28, hourly: 23.56 },
  { stage: 2, year12: "either", weekly: 978.1, hourly: 25.74 },
  { stage: 3, year12: "either", weekly: 1004.9, hourly: 26.44 },
  { stage: 4, year12: "either", weekly: 1029.1, hourly: 27.08 },
];

// MA000005 Tables 6 and 7 (hairdressing).
const HAIRDRESSING = rows([
  [1, "not-completed", 50, 559.55, 14.73],
  [1, "completed", 55, 615.51, 16.2],
  [2, "not-completed", 60, 671.46, 17.67],
  [2, "completed", 65, 727.42, 19.14],
  [3, "not-completed", 77, 861.71, 22.68],
  [3, "completed", 77, 861.71, 22.68],
  [4, "not-completed", 90, 1007.19, 26.51],
  [4, "completed", 90, 1007.19, 26.51],
]);

// MA000005 Tables 8 and 9 (beauty therapy).
const BEAUTY = rows([
  [1, "not-completed", 50, 559.55, 14.73],
  [1, "completed", 55, 615.51, 16.2],
  [2, "not-completed", 60, 671.46, 17.67],
  [2, "completed", 65, 727.42, 19.14],
  [3, "not-completed", 80, 895.28, 23.56],
  [3, "completed", 80, 895.28, 23.56],
  [4, "not-completed", 90, 1007.19, 26.51],
  [4, "completed", 90, 1007.19, 26.51],
]);

// MA000009 Table 7: no Year 12 split; 55/65/80/95% of the standard weekly rate.
const COOKERY = rows([
  [1, "either", 55, 615.51, 16.2],
  [2, "either", 65, 727.42, 19.14],
  [3, "either", 80, 895.28, 23.56],
  [4, "either", 95, 1063.15, 27.98],
]);

const SCHOOL_BASED_NOTE =
  "School-based apprentices, trainees and apprentices who started before 1 January 2014 are paid under separate award schedules that are not modelled here.";

export const APPRENTICE_TRADES: readonly ApprenticeTrade[] = [
  {
    slug: "electrical",
    name: "Electrical (apprentice electrician)",
    coverage: "Apprentice electricians employed by electrical contractors under the Electrical, Electronic and Communications Contracting Award 2020.",
    award: {
      name: "Electrical, Electronic and Communications Contracting Award 2020",
      code: "MA000025",
      url: awardUrl("MA000025"),
      clause: "cl 16.4 and Schedule B.4",
    },
    rateIncludes:
      "Percentage of the grade 5 wage plus the full tool allowance and the same percentage of the industry and electrician's licence allowances (all purposes). The hourly rate is Schedule B.4 exactly.",
    includesAllowances: true,
    junior: electrical.junior,
    adult: electrical.adult,
    notes: [
      "Adult apprentices who started on or after 1 January 2014: 80% of grade 5 in year 1, then at least the grade 1 rate (cl 16.4(b)).",
      SCHOOL_BASED_NOTE,
    ],
    tradePageHref: "/job-pay-rates/apprentice-electrician/",
  },
  {
    slug: "plumbing",
    name: "Plumbing and mechanical services",
    coverage: "Apprentice plumbers, mechanical services and irrigation installers under the Plumbing and Fire Sprinklers Award 2020 (sprinkler fitting apprentices have their own Schedule E.2.2 rates, not shown).",
    award: {
      name: "Plumbing and Fire Sprinklers Award 2020",
      code: "MA000036",
      url: awardUrl("MA000036"),
      clause: "cl 18.2(c) and Schedule E.2.1",
    },
    rateIncludes:
      "Percentage of the tradesperson level 1 weekly rate plus the full industry allowance and the relevant percentage of the tool and plumbing trade allowances (all purposes). Hourly is Schedule E.2.1 exactly; weekly is hourly x 38.",
    includesAllowances: true,
    junior: plumbingRows(),
    adult: null,
    notes: [
      "The 1st-year rate is 50% (55% if the apprentice completed Year 12) of the tradesperson rate and allowances; 4th year is 90%.",
      "Adult apprentice rates in this award are the greater of the federal minimum wage plus the industry allowance and the apprentice rate (cl 18.3(b)), so they are not tabulated.",
      SCHOOL_BASED_NOTE,
    ],
    tradePageHref: "/job-pay-rates/plumber/",
  },
  {
    slug: "building",
    name: "Building and construction (carpentry and other on-site trades)",
    coverage: "Apprentices working on building and construction sites under the Building and Construction General On-site Award 2020, which includes carpentry apprentices.",
    award: {
      name: "Building and Construction General On-site Award 2020",
      code: "MA000020",
      url: awardUrl("MA000020"),
      clause: "cl 19.7(b)(i)",
    },
    rateIncludes:
      "Percentage of the cl 19.1 CW3 standard rate ($1,119.10 a week) only. The award adds the tool allowance (cl 21.1), the industry allowance (cl 22) and any other applicable allowance on top, for all purposes (cl 19.7(c)), so the real minimum is higher than the figure shown.",
    includesAllowances: false,
    junior: BUILDING,
    adult: null,
    notes: [
      "Four-year term, started on or after 1 January 2014. A three-year term uses 55%, 75% and 90% (cl 19.7(b)(i)(B)) and is not tabulated.",
      "Stage 2 to 4 can start earlier than 12 months if the apprentice completes the training plan competencies sooner (competency-based progression, cl 19.7(b)(i)(A)).",
      "Weekly-hire employees. Daily-hire employees get a loaded hourly rate (cl 19.3).",
      SCHOOL_BASED_NOTE,
    ],
    tradePageHref: "/job-pay-rates/carpenter/",
  },
  {
    slug: "automotive",
    name: "Automotive repair (motor mechanic)",
    coverage: "Apprentices in the vehicle repair, services and retail (RS&R) sector under the Vehicle Repair, Services and Retail Award 2020, including motor mechanics.",
    award: {
      name: "Vehicle Repair, Services and Retail Award 2020",
      code: "MA000089",
      url: awardUrl("MA000089"),
      clause: "cl 16.9(b), 16.10(b) and Schedule B.5 to B.6",
    },
    rateIncludes:
      "Percentage of the RS&R Level R6 (tradesperson) weekly rate of $1,119.10, before allowances. Junior apprentices are under 21 when they start; adult apprentices are over 21 (cl 16.9, 16.10).",
    includesAllowances: false,
    junior: AUTOMOTIVE_JUNIOR,
    adult: AUTOMOTIVE_ADULT,
    notes: [
      "A tool allowance applies to tradespeople and is reduced for apprentices (cl 19.6); it is not in these figures.",
      "Adult apprentices cannot have their pay cut if they were already employed in the vehicle industry before starting (cl 16.10(c)).",
      SCHOOL_BASED_NOTE,
    ],
    tradePageHref: "/job-pay-rates/mechanic/",
  },
  {
    slug: "hairdressing",
    name: "Hairdressing",
    coverage: "Hairdressing apprentices under the Hair and Beauty Industry Award 2020 (Table 6 and Table 7).",
    award: {
      name: "Hair and Beauty Industry Award 2020",
      code: "MA000005",
      url: awardUrl("MA000005"),
      clause: "cl 18.1 (Tables 6 and 7)",
    },
    rateIncludes: "Percentage of the level 3 standard weekly rate ($1,119.10). Weekly and hourly are as the award prints them.",
    includesAllowances: false,
    junior: HAIRDRESSING,
    adult: null,
    notes: [
      "A first-year adult apprentice (not an existing employee) gets at least the greater of 80% of the standard rate and the first-year table rate (cl 18.4(a)); later years depend on the award's lowest classification rate, so adult rates are not tabulated.",
      SCHOOL_BASED_NOTE,
    ],
    tradePageHref: "/hair-and-beauty-award-rates/",
  },
  {
    slug: "beauty-therapy",
    name: "Beauty therapy",
    coverage: "Beauty therapy apprentices under the Hair and Beauty Industry Award 2020 (Table 8 and Table 9).",
    award: {
      name: "Hair and Beauty Industry Award 2020",
      code: "MA000005",
      url: awardUrl("MA000005"),
      clause: "cl 18.2 (Tables 8 and 9)",
    },
    rateIncludes: "Percentage of the level 3 standard weekly rate ($1,119.10). Weekly and hourly are as the award prints them.",
    includesAllowances: false,
    junior: BEAUTY,
    adult: null,
    notes: [SCHOOL_BASED_NOTE],
    tradePageHref: "/hair-and-beauty-award-rates/",
  },
  {
    slug: "cookery",
    name: "Commercial cookery (apprentice chef)",
    coverage: "Apprentice cooks in hotels, pubs, clubs and similar venues under the Hospitality Industry (General) Award 2020 (junior apprentices in a trade other than the waiting trade).",
    award: {
      name: "Hospitality Industry (General) Award 2020",
      code: "MA000009",
      url: awardUrl("MA000009"),
      clause: "cl 19.1(b) (Table 7)",
    },
    rateIncludes:
      "Percentage of the standard weekly rate ($1,119.10; the award divides by 38 for the hourly rate). The award does not split rates by Year 12 completion.",
    includesAllowances: false,
    junior: COOKERY,
    adult: null,
    notes: [
      "A cook or apprentice cook who must supply their own tools gets $2.03 a day (up to $9.94 a week), which is not in these figures (cl 26.5(a)).",
      "Apprentices who reach the proficiency standard on all three occasions are paid the standard hourly rate for the whole of 4th year (cl 19.3).",
      "Adult apprentice rules (cl 19.5) and the Restaurant Industry Award's equivalent rates are not tabulated.",
      SCHOOL_BASED_NOTE,
    ],
    tradePageHref: "/hospitality-award-rates/",
  },
];

export function getTrade(slug: string): ApprenticeTrade | undefined {
  return APPRENTICE_TRADES.find((t) => t.slug === slug);
}

/** The award minimum for a trade at a stage. Falls back to "either" rows (cookery, adult rates). */
export function apprenticeRate(
  trade: ApprenticeTrade,
  track: ApprenticeTrack,
  stage: ApprenticeStage,
  year12: Exclude<Year12, "either">,
): ApprenticeRate | undefined {
  const list = track === "adult" ? trade.adult : trade.junior;
  if (!list) return undefined;
  return list.find((r) => r.stage === stage && r.year12 === year12) ?? list.find((r) => r.stage === stage && r.year12 === "either");
}

export const STAGE_LABELS: Record<ApprenticeStage, string> = {
  1: "1st year (stage 1)",
  2: "2nd year (stage 2)",
  3: "3rd year (stage 3)",
  4: "4th year (stage 4)",
};

export interface ApprenticePayInput {
  tradeSlug: string;
  track: ApprenticeTrack;
  stage: ApprenticeStage;
  year12: Exclude<Year12, "either">;
  hoursPerWeek: number;
  /** What the employer actually pays per hour, if the reader wants a comparison. */
  actualHourly?: number;
}

export interface ApprenticePayResult {
  trade: ApprenticeTrade;
  rate: ApprenticeRate;
  minHourly: number;
  /** Award minimum for the hours entered (hourly x hours). */
  minWeekly: number;
  /** Minimum weekly x 52, for a full year at the same stage and hours. */
  minAnnual: number;
  /** Positive when the employer pays above the minimum. */
  hourlyDifference: number | null;
  belowAward: boolean | null;
  /** Back pay owed for the hours entered each week, per week, if below the award. */
  weeklyShortfall: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function apprenticePay(input: ApprenticePayInput): ApprenticePayResult | null {
  const trade = getTrade(input.tradeSlug);
  if (!trade) return null;
  const rate = apprenticeRate(trade, input.track, input.stage, input.year12);
  if (!rate) return null;
  const hours = Math.max(0, input.hoursPerWeek);
  const minWeekly = r2(rate.hourly * hours);
  const hasActual = typeof input.actualHourly === "number" && input.actualHourly > 0;
  const diff = hasActual ? r2((input.actualHourly as number) - rate.hourly) : null;
  return {
    trade,
    rate,
    minHourly: rate.hourly,
    minWeekly,
    minAnnual: r2(minWeekly * 52),
    hourlyDifference: diff,
    belowAward: diff === null ? null : diff < 0,
    weeklyShortfall: diff !== null && diff < 0 ? r2(-diff * hours) : 0,
  };
}
