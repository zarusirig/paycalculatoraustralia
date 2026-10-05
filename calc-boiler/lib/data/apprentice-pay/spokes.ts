// =============================================================================
// /apprentice-pay/{trade}/ spokes: one page per trade, built on the rates in
// ./index.ts (the hub /apprentice-pay-rates/ uses the same data).
//
// Rates are NOT repeated here. A spoke points at a data trade (tradeSlug) and
// adds only what is specific to that occupation: the allowances the award adds
// to the wage, penalty rates where the award prints them, and plain facts about
// coverage and progression. Everything below was read from the Fair Work
// Commission's consolidated awards on 5 October 2026 (awards.fairwork.gov.au):
//
//   Building      MA000020 cl 21.1(a) tool allowance by classification, cl 22.1 industry allowance,
//                 cl 19.7(c) (apprentices are paid both, for all purposes). Allowances varied ppc 01Jul26.
//   Automotive    MA000089 cl 19.6(b) apprentice tool allowance by year (5.88 / 7.59 / 10.46 / 12.14),
//                 B.5.1 penalty rates (Sat 150%, Sun 200%, public holiday 250% of the junior hourly rate).
//   Manufacturing MA000010 cl 30.2(c)(ii) $17.90 a week tradesperson tool allowance; (v) apprentices get it on
//                 the column 1 percentage basis of cl 21.6 (50 / 60 / 75 / 88).
//
// Not verified, deliberately left out: hairdressing and beauty tool allowances,
// meat industry allowances, cookery adult rules, and any trade not in a spoke.
// =============================================================================

import { APPRENTICE_RATES_FROM, type ApprenticeRate, type ApprenticeStage, apprenticeRate, getTrade } from "./index";

export type SpokeSlug =
  | "carpenter"
  | "plumber"
  | "mechanic"
  | "hairdresser"
  | "chef"
  | "bricklayer"
  | "painter"
  | "boilermaker"
  | "butcher";

export const STAGES = [1, 2, 3, 4] as const satisfies readonly ApprenticeStage[];

export interface AllowanceLine {
  label: string;
  clause: string;
  /** Dollars a week for stage 1 to 4. */
  byStage: readonly [number, number, number, number];
}

export interface AllowanceScenario {
  id: string;
  label: string;
  lines: readonly AllowanceLine[];
  /** When the allowance is only payable in some cases. */
  condition?: string;
}

export interface SpokeFaq {
  q: string;
  a: string;
}

export interface ApprenticeSpoke {
  slug: SpokeSlug;
  /** "Carpenter" */
  label: string;
  /** Lower case noun used in sentences: "carpentry". */
  trade: string;
  /** Data trade in ./index.ts that supplies the rates. */
  tradeSlug: string;
  /** Page-specific H1 fragment. */
  h1: string;
  /** Existing pages on the site for the same trade. */
  job?: { href: string; label: string };
  extraLinks: { href: string; label: string; blurb: string }[];
  allowances: readonly AllowanceScenario[];
  /** Plain, verified facts: coverage, progression, what is not in the table. */
  facts: string[];
  /** Occupation-specific FAQs added to the shared ones. */
  faqs: SpokeFaq[];
  /** Other spokes that share this spoke's rate table. */
  sharesTableWith?: SpokeSlug[];
}

const ST = (a: number): readonly [number, number, number, number] => [a, a, a, a];

// MA000020 cl 22.1: general building, civil and metal and engineering construction $67.15; residential $53.72.
const INDUSTRY_GENERAL: AllowanceLine = { label: "Industry allowance (general building, civil and engineering construction)", clause: "cl 22.1(a)", byStage: ST(67.15) };
const INDUSTRY_RESIDENTIAL: AllowanceLine = { label: "Industry allowance (residential building)", clause: "cl 22.1(b)", byStage: ST(53.72) };

function buildingScenarios(toolLabel: string, tool: number): AllowanceScenario[] {
  const toolLine: AllowanceLine = { label: toolLabel, clause: "cl 21.1(a)", byStage: ST(tool) };
  return [
    { id: "general", label: "General building, civil or engineering construction site", lines: [toolLine, INDUSTRY_GENERAL] },
    { id: "residential", label: "Residential building (single or dual occupancy, not multi-storey)", lines: [toolLine, INDUSTRY_RESIDENTIAL] },
  ];
}

const BUILDING_SHARED_NOTE =
  "Carpenters, bricklayers and painters on site are all paid the same percentage of the $1,119.10 standard rate. The three differ only in the tool allowance the award adds.";

// MA000010 cl 30.2(c)(ii) and (v): $17.90 x the column 1 percentage (50, 60, 75, 88), rounded to the cent.
const r2 = (n: number) => Math.round(n * 100 + 1e-9) / 100;
export const MANUFACTURING_TOOL_ALLOWANCE = 17.9;
export const MANUFACTURING_TOOL_PCT = [50, 60, 75, 88] as const;
const BOILERMAKER_TOOL: AllowanceLine = {
  label: "Tool allowance (apprentice share of $17.90)",
  clause: "cl 30.2(c)(ii), (v)",
  byStage: MANUFACTURING_TOOL_PCT.map((p) => r2((MANUFACTURING_TOOL_ALLOWANCE * p) / 100)) as unknown as readonly [number, number, number, number],
};

export const APPRENTICE_SPOKES: readonly ApprenticeSpoke[] = [
  {
    slug: "carpenter",
    label: "Carpenter",
    trade: "carpentry",
    tradeSlug: "building",
    h1: "Apprentice Carpenter Pay",
    job: { href: "/job-pay-rates/carpenter/", label: "Carpenter pay rates (qualified)" },
    extraLinks: [{ href: "/building-and-construction-award-rates/", label: "Building and Construction Award rates", blurb: "Every level of the award the apprentice rates come from." }],
    allowances: buildingScenarios("Tool allowance (carpenter and/or joiner)", 41.22),
    sharesTableWith: ["bricklayer", "painter"],
    facts: [
      "An apprentice carpenter on a building site is covered by the Building and Construction General On-site Award 2020. The award pays an apprentice a percentage of its standard rate (the Level 3, CW/ECW 3 rate of $1,119.10 a week), and then adds the carpenter and/or joiner tool allowance and the industry allowance on top. Clause 19.7(c) says apprentices are paid the amounts in clause 21.1 and clause 22 as part of the ordinary weekly rate for all purposes.",
      "The percentages step up by stage, not strictly by calendar year. Stage 2 starts when the apprentice has reached 25% of the competencies in the Certificate III training plan or 12 months after starting, whichever is earlier. Stage 3 starts at 50% of the competencies or 12 months after stage 2 began, and stage 4 at 75% or 12 months after stage 3. A quick learner can be moved up early, and the pay moves with them.",
      "Once the apprenticeship is complete, the award says the person must not be paid less than the standard rate of $1,119.10 a week (cl 19.7(a)), and carpenters then also receive the tool and industry allowances.",
    ],
    faqs: [
      {
        q: "Is the tool allowance included in the apprentice carpenter rate?",
        a: "No. The table of percentages gives the wage only. Clause 19.7(c) of the Building and Construction General On-site Award adds the clause 21.1 tool allowance ($41.22 a week for a carpenter and/or joiner) and the clause 22 industry allowance ($67.15 a week on general building sites, $53.72 on residential building) on top, for all purposes.",
      },
      {
        q: "Do apprentice carpenters get paid more on a commercial site than on a house?",
        a: "Under the award, yes, by the industry allowance. General building, civil and engineering construction sites attract $67.15 a week and residential building (single or dual occupancy, not multi-storey) attracts $53.72 a week. The percentage of the standard rate is the same on both.",
      },
    ],
  },
  {
    slug: "bricklayer",
    label: "Bricklayer",
    trade: "bricklaying",
    tradeSlug: "building",
    h1: "Apprentice Bricklayer Pay",
    extraLinks: [{ href: "/building-and-construction-award-rates/", label: "Building and Construction Award rates", blurb: "The levels and allowances behind the apprentice rates." }],
    allowances: buildingScenarios("Tool allowance (refractory bricklayer or bricklayer)", 29.26),
    sharesTableWith: ["carpenter", "painter"],
    facts: [
      "Bricklayers are named in the classification list of the Building and Construction General On-site Award 2020, so a bricklaying apprentice on a building site is paid the award's apprentice percentages of the $1,119.10 standard rate. The table above is the same table every building trade uses.",
      BUILDING_SHARED_NOTE,
      "What makes this page different is the allowance. The award sets the bricklayer tool allowance at $29.26 a week (cl 21.1(a)), which is lower than the $41.22 for a carpenter and joiner, plus the same industry allowance. Clause 19.7(c) pays apprentices both as part of the ordinary weekly rate for all purposes.",
      "Progression follows the Certificate III training plan: stage 2 at 25% of competencies or 12 months, stage 3 at 50% of competencies or 12 months after stage 2, and stage 4 at 75% or 12 months after stage 3, whichever comes first in each case.",
    ],
    faqs: [
      {
        q: "How much is the bricklayer tool allowance for an apprentice?",
        a: "The Building and Construction General On-site Award sets the tool allowance for a refractory bricklayer or bricklayer at $29.26 a week from 1 July 2026 (cl 21.1(a)). Clause 19.7(c) says apprentices are paid the clause 21.1 amounts in addition to their percentage rate, for all purposes.",
      },
    ],
  },
  {
    slug: "painter",
    label: "Painter",
    trade: "painting",
    tradeSlug: "building",
    h1: "Apprentice Painter Pay",
    extraLinks: [{ href: "/building-and-construction-award-rates/", label: "Building and Construction Award rates", blurb: "The levels and allowances behind the apprentice rates." }],
    allowances: buildingScenarios("Tool allowance (signwriter, painter or glazier)", 9.89),
    sharesTableWith: ["carpenter", "bricklayer"],
    facts: [
      "Painters, including artworkers, spraypainters, shotblasters and sandblasters, are named in the classification list of the Building and Construction General On-site Award 2020. An apprentice painter working on a building site is paid the award's apprentice percentages of the $1,119.10 standard rate, the same percentages as every other building trade.",
      BUILDING_SHARED_NOTE,
      "The painter tool allowance is the smallest of the three: $9.89 a week (cl 21.1(a)), against $29.26 for a bricklayer and $41.22 for a carpenter and joiner. The industry allowance is the same for all three. Clause 19.7(c) pays apprentices both as part of the ordinary weekly rate for all purposes.",
      "Coverage depends on the work your employer does and on any enterprise agreement, so check the award named on your contract before relying on this table.",
    ],
    faqs: [
      {
        q: "Do apprentice painters get the industry allowance?",
        a: "On a building and construction site covered by the Building and Construction General On-site Award, yes. The award adds the industry allowance ($67.15 a week for general building, civil and engineering construction, $53.72 for residential building) and the painter tool allowance ($9.89 a week) on top of the percentage rate, for all purposes. A painting employer who is not covered by this award may pay differently.",
      },
    ],
  },
  {
    slug: "plumber",
    label: "Plumber",
    trade: "plumbing",
    tradeSlug: "plumbing",
    h1: "Apprentice Plumber Pay",
    job: { href: "/job-pay-rates/plumber/", label: "Plumber pay rates (qualified)" },
    extraLinks: [{ href: "/construction-trades-pay/", label: "Construction and Trades Pay Guide", blurb: "What tradies and apprentices earn, with allowances and take-home." }],
    allowances: [],
    facts: [
      "Apprentice plumbers, mechanical services and irrigation installers are covered by the Plumbing and Fire Sprinklers Award 2020. Unlike building, its apprentice hourly rate in Schedule E.2.1 already contains the allowances: it is the percentage of the tradesperson level 1 weekly rate plus the full industry allowance and the same percentage of the tool and plumbing trade allowances, all paid for all purposes. That is why a first-year plumbing apprentice's hourly minimum looks higher than a first-year carpenter's.",
      "Compare like with like. The plumbing rate is allowance-inclusive and the building and automotive percentage rates are not, so a plumber at $18.11 an hour in first year and a carpenter at $16.20 are not directly comparable until the carpenter's allowances are added.",
      "The 4th-year rate is 90% of the tradesperson rate and allowances. Apprentice sprinkler fitters have their own rates in Schedule E.2.2 and are not shown here.",
      "Adult apprentices are paid the greater of the federal minimum wage plus the industry allowance and the apprentice rate (cl 18.3(b)). Because that depends on the national minimum wage, this page does not tabulate adult rates.",
    ],
    faqs: [
      {
        q: "Are allowances included in the apprentice plumber rate?",
        a: "Yes. The hourly rates in Schedule E.2.1 of the Plumbing and Fire Sprinklers Award 2020 already include the full industry allowance and the relevant percentage of the tool and plumbing trade allowances, all paid for all purposes. You do not add them again on top.",
      },
      {
        q: "What do apprentice sprinkler fitters get paid?",
        a: "Sprinkler fitting apprentices have separate rates in Schedule E.2.2 of the Plumbing and Fire Sprinklers Award 2020. They are not shown on this page, which covers plumbing, mechanical services and irrigation apprentices.",
      },
    ],
  },
  {
    slug: "mechanic",
    label: "Mechanic",
    trade: "motor mechanic",
    tradeSlug: "automotive",
    h1: "Apprentice Mechanic Pay",
    job: { href: "/job-pay-rates/mechanic/", label: "Mechanic pay rates (qualified)" },
    extraLinks: [{ href: "/manufacturing-award-rates/", label: "Manufacturing Award rates", blurb: "The award that covers many other mechanical and engineering trades." }],
    allowances: [
      {
        id: "tools",
        label: "If you supply your own hand tools",
        lines: [{ label: "Apprentice tool allowance", clause: "cl 19.6(b)", byStage: [5.88, 7.59, 10.46, 12.14] }],
        condition: "Payable only where the employer requires the apprentice to provide their own tools",
      },
    ],
    facts: [
      "A motor mechanic apprentice in a workshop, dealership or service centre is usually covered by the Vehicle Repair, Services and Retail Award 2020. The award splits apprentices at 21: a junior apprentice is under 21 when they start, and an adult apprentice is over 21. Junior rates are a percentage of the Level R6 tradesperson rate of $1,119.10 a week, and the 4th-year percentage is 88%, not 90%.",
      "Adult apprentices are paid by reference to award classification levels instead of percentages: 80% of R6 in first year, then Level 1, Level 2 and Level 3, and the full R6 rate after the apprenticeship. A person already employed in the vehicle industry before becoming an adult apprentice cannot have their pay cut by signing the contract (cl 16.10(c)).",
      "The award prints penalty rates for junior apprentices as a percentage of the hourly rate: Saturday 150%, Sunday 200% and public holidays 250% (Schedule B.5.1). The table in the penalty section below applies those multiples to the rates above.",
      "The tool allowance for apprentices rises by year, from $5.88 to $12.14 a week, and is payable only where the apprentice is required to provide their own tools. The award says it is not subject to overtime, shift premium, other penalties or annual leave loading (cl 19.6(c)).",
    ],
    faqs: [
      {
        q: "What is the penalty rate for an apprentice mechanic on a Saturday?",
        a: "Under Schedule B.5.1 of the Vehicle Repair, Services and Retail Award 2020, a junior apprentice is paid 150% of their hourly rate on a Saturday, 200% on a Sunday and 250% on a public holiday. A first-year junior apprentice who completed Year 12 is on $16.20 an hour, so $24.30 on a Saturday.",
      },
      {
        q: "Do apprentice mechanics get a tool allowance?",
        a: "Yes, where the employer requires them to supply their own tools. Clause 19.6(b) sets it by year of apprenticeship at $5.88, $7.59, $10.46 and $12.14 a week. It is not subject to overtime, shift premium or other penalties, and it is not in the hourly minimums on this page.",
      },
    ],
  },
  {
    slug: "hairdresser",
    label: "Hairdresser",
    trade: "hairdressing",
    tradeSlug: "hairdressing",
    h1: "Apprentice Hairdresser Pay",
    job: { href: "/job-pay-rates/hairdresser/", label: "Hairdresser pay rates (qualified)" },
    extraLinks: [{ href: "/hair-and-beauty-award-rates/", label: "Hair and Beauty Award rates", blurb: "Every level, plus casual and weekend rates." }],
    allowances: [],
    facts: [
      "Apprentice hairdressers are covered by the Hair and Beauty Industry Award 2020 (Table 6 for junior apprentices who have not completed Year 12 and Table 7 for those who have). The percentages apply to the Level 3 standard weekly rate of $1,119.10. The 3rd-year rate is 77% and the 4th-year rate is 90%, which makes hairdressing slightly different from building trades (75% in 3rd year) and from beauty therapy (80%).",
      "A first-year adult apprentice who was not already an employee gets at least the greater of 80% of the standard rate and the first-year table rate (cl 18.4(a)). Later years depend on the award's lowest classification rate, so adult rates are not tabulated on this page.",
      "The figures here are the wage only. Allowances and weekend or evening penalty rates are not in the table, and the amounts for apprentices were not checked for this page, so ask your employer what is payable on top. The Hair and Beauty Award page covers the rates for qualified staff.",
    ],
    faqs: [
      {
        q: "How much does a first-year apprentice hairdresser earn?",
        a: "From 1 July 2026 the Hair and Beauty Industry Award 2020 sets a minimum of $14.73 an hour ($559.55 a week) in the first year for an apprentice who did not complete Year 12, and $16.20 an hour ($615.51 a week) for one who did. Many salons pay more.",
      },
    ],
  },
  {
    slug: "chef",
    label: "Chef",
    trade: "cookery",
    tradeSlug: "cookery",
    h1: "Apprentice Chef Pay",
    job: { href: "/job-pay-rates/chef/", label: "Chef pay rates (qualified)" },
    extraLinks: [
      { href: "/hospitality-award-rates/", label: "Hospitality Award rates", blurb: "The award these cookery apprentice rates come from." },
      { href: "/restaurant-award-rates/", label: "Restaurant Award rates", blurb: "The separate award for many restaurants and cafes." },
    ],
    allowances: [],
    facts: [
      "The rates here come from the Hospitality Industry (General) Award 2020, which covers hotels, pubs, clubs and similar venues. An apprentice cook in a restaurant or cafe may instead be under the Restaurant Industry Award 2020, which has its own apprentice rates that are not tabulated on this page. Check which award your employer says applies.",
      "The hospitality award does not split cookery apprentice rates by Year 12. The first year is 55% of the $1,119.10 standard weekly rate, then 65%, 80% and 95%. That makes the first-year minimum the same for everyone and a little higher than the 50% some other trades pay a first-year apprentice who did not finish Year 12.",
      "An apprentice who reaches the proficiency standard on all three occasions the award sets is paid the standard hourly rate for the whole of 4th year (cl 19.3).",
      "A cook or apprentice cook who has to supply their own knives and tools is entitled to $2.03 a day, up to $9.94 a week (cl 26.5(a)), which is not in the figures above.",
    ],
    faqs: [
      {
        q: "What does an apprentice chef earn in the first year?",
        a: "Under the Hospitality Industry (General) Award 2020, a first-year cookery apprentice earns at least $16.20 an hour, which is 55% of the standard rate, and $615.51 for a 38-hour week from 1 July 2026. Cooks in restaurants and cafes may be covered by the Restaurant Industry Award instead.",
      },
      {
        q: "Do apprentice chefs get a knife or tool allowance?",
        a: "A cook or apprentice cook who is required to supply their own tools gets $2.03 a day, up to $9.94 a week, under clause 26.5(a) of the Hospitality Industry (General) Award 2020. It is not included in the hourly rates on this page.",
      },
    ],
  },
  {
    slug: "boilermaker",
    label: "Boilermaker",
    trade: "boilermaking and fabrication",
    tradeSlug: "manufacturing",
    h1: "Apprentice Boilermaker Pay",
    job: { href: "/job-pay-rates/boilermaker/", label: "Boilermaker pay rates (qualified)" },
    extraLinks: [{ href: "/manufacturing-award-rates/", label: "Manufacturing Award rates", blurb: "Every C-level, from the trade rate upwards." }],
    allowances: [
      {
        id: "tools",
        label: "If you supply your own hand tools",
        lines: [BOILERMAKER_TOOL],
        condition: "Not payable where the employer provides all the tools you need, or you agree in writing that they will",
      },
    ],
    facts: [
      "A boilermaker apprentice is normally doing the Engineering Tradesperson (Fabrication) apprenticeship, which the Manufacturing and Associated Industries and Occupations Award 2020 names in clause 12.4. The rates come from clause 21.6 for apprentices who started on or after 1 January 2014. The award's trade rate for the finished tradesperson is C10, $1,119.10 a week or $29.45 an hour.",
      "Year 12 matters in the first two years only, and the 4th year is different. An apprentice who has not completed Year 12 is paid 88% of C10 in 4th year ($984.81), but one who has completed Year 12 is paid the C12/V3 rate of $1,029.10 a week. That is $44.29 a week more than the 88% figure for an apprentice without Year 12.",
      "Progression is competency-based. Stage 2 starts at 25% of the competency points for the Certificate III or 12 months after starting, whichever is earlier, and stage 3 at 50% or 12 months after stage 2. The probationary period is set by the training contract and cannot be more than three months, and an apprentice under 18 does not have to work overtime or shiftwork.",
      "Not every boilermaker is under this award. The Building and Construction General On-site Award 2020 names a Boilermaker and/or structural steel tradesperson classification, so a boilermaker working on a building site may be covered by that award instead, with its own percentages and allowances. Check your contract or pay guide.",
    ],
    faqs: [
      {
        q: "Why is a 4th-year boilermaker apprentice paid more if they finished Year 12?",
        a: "Under clause 21.6 of the Manufacturing and Associated Industries and Occupations Award 2020, 4th-year pay for an apprentice who has completed Year 12 is the C12/V3 rate of $1,029.10 a week ($27.08 an hour). For one who has not, it is 88% of C10, which is $984.81 a week ($25.92 an hour).",
      },
    ],
  },
  {
    slug: "butcher",
    label: "Butcher",
    trade: "butchery",
    tradeSlug: "meat",
    h1: "Apprentice Butcher Pay",
    extraLinks: [{ href: "/junior-pay-rates/", label: "Junior Pay Rates", blurb: "Age-based rates for workers who are not apprentices." }],
    allowances: [],
    facts: [
      "Apprentice butchers in butcher shops (meat retail establishments), meat processing plants and meat manufacturing are covered by the Meat Industry Award 2020. The award pays apprentices a percentage of its MI 7 rate, which is $1,119.10 a week or $29.45 an hour. For an apprentice who started on or after 1 January 2014 the percentages are 50% (55% with Year 12), 60% (65%), 85% and 95%.",
      "The step in 3rd year is bigger than in most trades. At 85% of MI 7, a 3rd-year butcher apprentice earns $951.24 a week, against $839.33 for a carpenter or $861.71 for a hairdresser in the same year. By 4th year the figure is $1,063.15, the same as a cookery apprentice.",
      "Some retail butchers are not under this award. It does not cover employees who are covered by the General Retail Industry Award 2020, so a butcher employed by a supermarket may be on different rates or an enterprise agreement. Check the award named on your contract.",
      "Allowances for work in cold environments or for tools were not tabulated for this page because the amounts were not verified. Ask your employer what is payable on top of the wage.",
    ],
    faqs: [
      {
        q: "How much do apprentice butchers earn?",
        a: "From 1 July 2026 the Meat Industry Award 2020 sets a first-year minimum of $14.73 an hour ($559.55 a week) for an apprentice who did not complete Year 12 and $16.20 an hour ($615.51 a week) for one who did. By 4th year the minimum is $27.98 an hour ($1,063.15 a week). Many butchers are on an enterprise agreement that pays more.",
      },
    ],
  },
];

export const APPRENTICE_SPOKE_SLUGS: readonly SpokeSlug[] = APPRENTICE_SPOKES.map((s) => s.slug);

export function getSpoke(slug: string): ApprenticeSpoke | undefined {
  return APPRENTICE_SPOKES.find((s) => s.slug === slug);
}

export const SPOKE_RATES_FROM = APPRENTICE_RATES_FROM;

/** Junior (or "either") rate list for a spoke, in stage order for a Year 12 status. */
export function spokeRate(spoke: ApprenticeSpoke, stage: ApprenticeStage, year12: "completed" | "not-completed"): ApprenticeRate {
  const trade = getTrade(spoke.tradeSlug);
  if (!trade) throw new Error(`No trade ${spoke.tradeSlug}`);
  const r = apprenticeRate(trade, "junior", stage, year12);
  if (!r) throw new Error(`No rate for ${spoke.tradeSlug} stage ${stage}`);
  return r;
}

export function spokeAdultRate(spoke: ApprenticeSpoke, stage: ApprenticeStage): ApprenticeRate | undefined {
  const trade = getTrade(spoke.tradeSlug);
  if (!trade) return undefined;
  return apprenticeRate(trade, "adult", stage, "completed");
}

/** Allowances a week in a scenario for a stage, dollars. */
export function scenarioAllowance(scenario: AllowanceScenario, stage: ApprenticeStage): number {
  return r2(scenario.lines.reduce((sum, l) => sum + l.byStage[stage - 1], 0));
}

export interface AllowanceRow {
  stage: ApprenticeStage;
  allowance: number;
  /** Wage plus allowances, a week, for an apprentice who has not completed Year 12 (null if the award has no split). */
  noYear12Weekly: number | null;
  year12Weekly: number;
  year12Hourly: number;
}

/** Wage + allowances for each stage. Hourly = weekly / 38, the way the building award converts weekly to hourly. */
export function allowanceRows(spoke: ApprenticeSpoke, scenario: AllowanceScenario): AllowanceRow[] {
  return STAGES.map((stage) => {
    const y = spokeRate(spoke, stage, "completed");
    const n = spokeRate(spoke, stage, "not-completed");
    const allowance = scenarioAllowance(scenario, stage);
    const split = y.year12 !== "either";
    return {
      stage,
      allowance,
      noYear12Weekly: split ? r2(n.weekly + allowance) : null,
      year12Weekly: r2(y.weekly + allowance),
      year12Hourly: r2((y.weekly + allowance) / 38),
    };
  });
}

/** Junior apprentice penalty multiples printed in MA000089 Schedule B.5.1. */
export const AUTOMOTIVE_PENALTY_MULTIPLES = { saturday: 1.5, sunday: 2, publicHoliday: 2.5 } as const;

export function penaltyHourly(hourly: number, kind: keyof typeof AUTOMOTIVE_PENALTY_MULTIPLES): number {
  return r2(hourly * AUTOMOTIVE_PENALTY_MULTIPLES[kind]);
}

const BUILDING_ADULT =
  "A person who starts as an adult apprentice and was not already employed by the same employer is paid the greater of the ordinary hourly rate for the lowest paid classification in clause 19.1 (Level 1 (a), $26.67 an hour) and the apprentice rate for their year (cl 19.8(d)). The highest percentage rate in the table is below $26.67, so in practice $26.67 an hour is the floor in every year before allowances. A person who was employed by the employer for at least 6 months full-time or 12 months part-time or regular casual before starting keeps the hourly rate they were on (cl 19.8(a) to (c)). Check which classification your employer has put you on.";

/** What a spoke says about adult starters where the data has no adult table. */
export const ADULT_NOTES: Partial<Record<SpokeSlug, string>> = {
  carpenter: BUILDING_ADULT,
  bricklayer: BUILDING_ADULT,
  painter: BUILDING_ADULT,
  plumber:
    "Adult apprentices in the Plumbing and Fire Sprinklers Award are paid the greater of the federal minimum wage plus the industry allowance and the apprentice rate (cl 18.3(b)). That depends on the national minimum wage in force, so this page does not tabulate it. Ask your employer which test they applied.",
  hairdresser:
    "A first-year adult apprentice who was not already an employee gets at least the greater of 80% of the $1,119.10 standard rate ($895.28 a week, $23.56 an hour) and the first-year table rate (cl 18.4(a)). Later years depend on the award's lowest classification rate, so they are not tabulated here.",
  chef:
    "The Hospitality Industry (General) Award has its own adult apprentice rules in clause 19.5 that depend on the employee's earlier pay, so adult cookery rates are not tabulated here. Ask your employer which rule applies to you.",
};
