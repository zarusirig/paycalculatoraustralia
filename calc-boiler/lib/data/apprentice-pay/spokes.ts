// =============================================================================
// /apprentice-pay/{trade}/ spokes: one page per trade, built on the rates in
// ./index.ts (the hub /apprentice-pay-rates/ uses the same data).
//
// A spoke points at a data trade (tradeSlug) for the award's percentage rates
// and adds only what is specific to that occupation: its own allowances, the
// Fair Work Ombudsman (FWO) pay guide figures where the pay guide prints a
// table for that trade, penalty rates where the award or pay guide prints them,
// the national qualification, and plain facts about coverage and progression.
//
// Sources, all read 9 October 2026 (re-check of the 5 October 2026 build):
//
//   Awards (Fair Work Commission consolidated text, awards.fairwork.gov.au):
//   Building      MA000020 cl 19.7(b), (c): apprentice = % of the CW3 standard rate PLUS the cl 21.1 tool allowance
//                 and the cl 22 industry allowance, "as part of the ordinary weekly rate for all purposes". The tool
//                 allowance is paid in full (no apprentice percentage). cl 21.1(a) carpenter/joiner $41.22,
//                 bricklayer/refractory bricklayer $29.26, signwriter/painter/glazier $9.89; cl 22.1 $67.15 general,
//                 $53.72 residential (varied ppc 01Jul26). Schedule A.2.1, A.2.3, A.2.4, A.2.5, A.2.8 classifications.
//   Automotive    MA000089 cl 19.6(b), (c) apprentice tool allowance; cl 16.9, 16.10; Schedule B.5.1 penalty rates.
//   Manufacturing MA000010 cl 30.2(c)(ii) $17.90 a week tradesperson tool allowance (varied ppc 01Jul24, not since),
//                 (iii), (iv), (v), (viii), (ix); cl 21.6, 21.7(b); Schedule C10 qualification.
//   Hair          MA000005 cl 18.1, 18.3 (pre-apprentices), 18.4, 17.1 (Level 1 $1,056.80), 20.8(a) $10.52 tool
//                 allowance, 23.1 Table 14 penalty rates.
//   Hospitality   MA000009 cl 19.3 proficiency pay, 19.5 adult apprentices, 26.5(a) $2.03 a day / $9.94 a week tools,
//                 29.2 Table 14 penalty rates; Table 3 Introductory level $978.10, Level 4 $1,119.10 / $29.45.
//   Meat          MA000059 cl 16.3, 16.4, 20.2(a) cold temperature allowance, 24.3 meat retail weekend rates.
//   Plumbing      MA000036 cl 18.2(c), 18.3(b), 21.3(a) industry allowance $41.41 a week, Schedule E.2.1(b) penalty rates.
//
//   FWO pay guides (https://calculate.fairwork.gov.au/payguides/fairwork/<code>/pdf, rates from the first full
//   pay period starting on or after 1 July 2026): MA000020 published 2 July 2026; MA000036 11 August 2026;
//   MA000089, MA000005, MA000009, MA000059 24 June 2026; MA000010 29 July 2026.
//
//   Qualifications (training.gov.au, usage recommendation as shown on 9 October 2026): CPC30326, CPC30220,
//   CPC33020, CPC30620, CPC32420, AUR30620, SHB30416, SIT30821, MEM31925, MEM31922, AMP30815.
//
// What we derive (and say so on the page): building allowance tables are wage + tool + industry allowance, which
// the tests check equal the FWO pay guide figure in every row; hourly = weekly / 38 rounded to the cent (the
// award's own weekly-to-hourly method, cl 19.3(b)); the boilermaker tool allowance in dollars a week is
// $17.90 x the cl 21.6 column 1 percentage (cl 30.2(c)(v)); penalty dollars are the hourly rate x the award
// percentage, rounded to the cent, and the tests check them against the pay guide.
//
// Deliberately left out (not verified, or outside the page's payslip-checking border): state licensing,
// Restaurant Industry Award cookery rates, sprinkler-fitting apprentices, building weekend overtime tables,
// meat-retail public holiday rates (cl 31.3 sets several different ones), and any trade not in a spoke.
// =============================================================================

import { APPRENTICE_RATES_FROM, type ApprenticeRate, type ApprenticeStage, apprenticeRate, getTrade, roundCent } from "./index";

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

/** Date the spoke pages were last checked against the awards, pay guides and training.gov.au. */
export const SPOKES_VERIFIED_ON = "9 October 2026";

export const payGuideUrl = (code: string) => `https://calculate.fairwork.gov.au/payguides/fairwork/${code.toLowerCase()}/pdf`;
const tgaUrl = (code: string) => `https://training.gov.au/training/details/${code}`;

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
  /** True when the award pays the allowance for all purposes, so an hourly equivalent is a real hourly rate. */
  allPurpose: boolean;
}

export interface SpokeFaq {
  q: string;
  a: string;
}

export interface Qualification {
  code: string;
  title: string;
  url: string;
  /** Verified detail from training.gov.au, in a sentence. */
  detail: string;
}

/** Weekend / public holiday percentages the award (and the FWO pay guide) applies to an apprentice's hourly rate. */
export interface PenaltyTable {
  heading: string;
  intro: string;
  columns: readonly { label: string; pct: number }[];
  caption: string;
}

/** FWO pay guide key: stages 1 and 2 split by Year 12, stages 3 and 4 do not. */
export type PayGuideKey = "1n" | "1y" | "2n" | "2y" | "3" | "4";
/** [weekly, hourly] dollars as the FWO pay guide prints them. */
export type PayGuideTable = Readonly<Record<PayGuideKey, readonly [number, number]>>;

/** FWO MA000020 pay guide apprentice tables for one tool-allowance group: wage + tool + industry allowance. */
export interface BuildingPayGuide {
  /** The pay guide's table name for the group. */
  group: string;
  /** Short name for sentences: "carpenter and joiner". */
  groupShort: string;
  /** cl 21.1(a) tool allowance for the group, dollars a week, paid in full to apprentices. */
  toolAllowance: number;
  /** "General building and construction - not residential work", 4-year apprentice, started after 1 Jan 2014. */
  general: PayGuideTable;
  /** "General building and construction - residential work". */
  residential: PayGuideTable;
  /** "Adult apprentice", all years/stages. */
  adult: { general: readonly [number, number]; residential: readonly [number, number] };
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
  /** Opening paragraph under the headline figures: what is specific to this trade's pay. */
  lead: string;
  /** Existing pages on the site for the same trade. */
  job?: { href: string; label: string };
  extraLinks: { href: string; label: string; blurb: string }[];
  allowances: readonly AllowanceScenario[];
  /** Building trades only: the FWO pay guide's all-in apprentice tables for the trade's tool allowance group. */
  payGuide?: BuildingPayGuide;
  penalty?: PenaltyTable;
  qualification: Qualification;
  /** Plain, verified facts: coverage, progression, what is not in the table. */
  facts: string[];
  /** Occupation-specific FAQs added to the shared ones. */
  faqs: SpokeFaq[];
  /** Other spokes that share this spoke's percentage table. */
  sharesTableWith?: SpokeSlug[];
}

const ST = (a: number): readonly [number, number, number, number] => [a, a, a, a];

// ---- Building (MA000020) ---------------------------------------------------
// cl 22.1: general building, civil and metal and engineering construction $67.15; residential $53.72.
export const INDUSTRY_ALLOWANCE = { general: 67.15, residential: 53.72 } as const;
const INDUSTRY_GENERAL: AllowanceLine = { label: "Industry allowance (general building, civil and engineering construction)", clause: "cl 22.1(a)", byStage: ST(INDUSTRY_ALLOWANCE.general) };
const INDUSTRY_RESIDENTIAL: AllowanceLine = { label: "Industry allowance (residential building)", clause: "cl 22.1(b)", byStage: ST(INDUSTRY_ALLOWANCE.residential) };

function buildingScenarios(toolLabel: string, tool: number): AllowanceScenario[] {
  const toolLine: AllowanceLine = { label: toolLabel, clause: "cl 21.1(a)", byStage: ST(tool) };
  return [
    { id: "general", label: "General building, civil or engineering construction site", lines: [toolLine, INDUSTRY_GENERAL], allPurpose: true },
    { id: "residential", label: "Residential building (single or dual occupancy, not multistorey)", lines: [toolLine, INDUSTRY_RESIDENTIAL], allPurpose: true },
  ];
}

const pg = (rows: Record<PayGuideKey, readonly [number, number]>): PayGuideTable => rows;

// FWO MA000020 pay guide, published 2 July 2026, "Apprentice - 4 years - General building and construction -
// [not] residential work - Started after 1 Jan 2014 - <group>" and "Adult apprentice - ... - All years/stages".
const CARPENTER_PG: BuildingPayGuide = {
  group: "Carpenter and/or joiner (including bridge and wharf), carver, floor sander, letter cutter, stonemason, artificial stoneworker, marble and slate worker or tilelayer",
  groupShort: "carpenter and joiner",
  toolAllowance: 41.22,
  general: pg({ "1n": [667.92, 17.58], "1y": [723.88, 19.05], "2n": [779.83, 20.52], "2y": [835.79, 21.99], "3": [947.7, 24.94], "4": [1115.56, 29.36] }),
  residential: pg({ "1n": [654.49, 17.22], "1y": [710.45, 18.7], "2n": [766.4, 20.17], "2y": [822.36, 21.64], "3": [934.27, 24.59], "4": [1102.13, 29.0] }),
  adult: { general: [1121.87, 29.52], residential: [1108.44, 29.17] },
};
const BRICKLAYER_PG: BuildingPayGuide = {
  group: "Bricklayer or refractory bricklayer",
  groupShort: "bricklayer and refractory bricklayer",
  toolAllowance: 29.26,
  general: pg({ "1n": [655.96, 17.26], "1y": [711.92, 18.73], "2n": [767.87, 20.21], "2y": [823.83, 21.68], "3": [935.74, 24.62], "4": [1103.6, 29.04] }),
  residential: pg({ "1n": [642.53, 16.91], "1y": [698.49, 18.38], "2n": [754.44, 19.85], "2y": [810.4, 21.33], "3": [922.31, 24.27], "4": [1090.17, 28.69] }),
  adult: { general: [1109.91, 29.21], residential: [1096.48, 28.85] },
};
const PAINTER_PG: BuildingPayGuide = {
  group: "Glazier, painter or signwriter",
  groupShort: "glazier, painter and signwriter",
  toolAllowance: 9.89,
  general: pg({ "1n": [636.59, 16.75], "1y": [692.55, 18.23], "2n": [748.5, 19.7], "2y": [804.46, 21.17], "3": [916.37, 24.12], "4": [1084.23, 28.53] }),
  residential: pg({ "1n": [623.16, 16.4], "1y": [679.12, 17.87], "2n": [735.07, 19.34], "2y": [791.03, 20.82], "3": [902.94, 23.76], "4": [1070.8, 28.18] }),
  adult: { general: [1090.54, 28.7], residential: [1077.11, 28.35] },
};
/** FWO MA000020 pay guide "All others" (no cl 21.1(a) tool allowance), general building, stage 1 with Year 12. */
export const BUILDING_ALL_OTHERS_1Y_GENERAL = [682.66, 17.96] as const;

export const payGuideKey = (stage: ApprenticeStage, year12: "completed" | "not-completed"): PayGuideKey =>
  stage >= 3 ? (String(stage) as PayGuideKey) : (`${stage}${year12 === "completed" ? "y" : "n"}` as PayGuideKey);

// ---- Manufacturing (MA000010) ----------------------------------------------
// cl 30.2(c)(ii) $17.90 a week x the cl 21.6 column 1 percentage (cl 30.2(c)(v)), rounded to the cent: our arithmetic.
// The FWO pay guide prints the same allowance per hour: $0.24, $0.28, $0.35, $0.41 (= these / 38, to the cent).
export const MANUFACTURING_TOOL_ALLOWANCE = 17.9;
export const MANUFACTURING_TOOL_PCT = [50, 60, 75, 88] as const;
export const MANUFACTURING_TOOL_HOURLY_PAY_GUIDE = [0.24, 0.28, 0.35, 0.41] as const;
const BOILERMAKER_TOOL: AllowanceLine = {
  label: "Tool allowance (apprentice share of $17.90, our calculation)",
  clause: "cl 30.2(c)(ii), (v)",
  byStage: MANUFACTURING_TOOL_PCT.map((p) => roundCent((MANUFACTURING_TOOL_ALLOWANCE * p) / 100)) as unknown as readonly [number, number, number, number],
};

export const APPRENTICE_SPOKES: readonly ApprenticeSpoke[] = [
  {
    slug: "carpenter",
    label: "Carpenter",
    trade: "carpentry",
    tradeSlug: "building",
    h1: "Apprentice Carpenter Pay",
    lead:
      "Carpentry apprentices carry the largest tool allowance in the Building and Construction General On-site Award: $41.22 a week, the amount clause 21.1(a) sets for a carpenter and/or joiner. The award pays it to apprentices in full, not as a percentage, together with the industry allowance, and both are part of the ordinary rate for all purposes (cl 19.7(c)). The minimums above already include both.",
    job: { href: "/job-pay-rates/carpenter/", label: "Carpenter pay rates (qualified)" },
    extraLinks: [{ href: "/building-and-construction-award-rates/", label: "Building and Construction Award rates", blurb: "Every level of the award the apprentice rates come from." }],
    allowances: buildingScenarios("Tool allowance (carpenter and/or joiner)", CARPENTER_PG.toolAllowance),
    payGuide: CARPENTER_PG,
    sharesTableWith: ["bricklayer", "painter"],
    qualification: {
      code: "CPC30326",
      title: "Certificate III in Carpentry",
      url: tgaUrl("CPC30326"),
      detail:
        "training.gov.au released CPC30326 on 23 September 2026 (34 units: 27 core and 7 elective) and marked the previous CPC30220 superseded from 22 September 2026, listing the two as equivalent.",
    },
    facts: [
      "The $41.22 is shared by everyone in the same line of clause 21.1(a): joiners, bridge and wharf carpenters, carpenter-divers, carvers, floor sanders, letter cutters, stonemasons, tilelayers and marble, slate and artificial stone workers. The Fair Work Ombudsman pay guide prints one apprentice table for that whole group, and the tables on this page are that table.",
      "A qualified carpenter or joiner is a CW/ECW 3 classification (Schedule A.2.3). The award places a joiner special class at CW/ECW 4 ($1,154.40 a week) and a carpenter-diver at CW/ECW 8 ($1,286.70), and a carpenter-diver also gets $1.33 an hour for all purposes (cl 23.5). Once the apprenticeship is complete, clause 19.7(a) sets the floor at the $1,119.10 standard rate, so with the tool and industry allowances a carpenter on a general building site is on at least $1,227.47 a week.",
      "The training plan that sets your stage dates is for the Certificate III in Carpentry. Apprentices who signed up under CPC30220 and those under its replacement CPC30326 progress the same way: stage 2 at 25% of the competencies in the training plan or 12 months after starting, stage 3 at 50% or 12 months after stage 2, stage 4 at 75% or 12 months after stage 3, whichever is earlier each time (cl 19.7(b)).",
    ],
    faqs: [
      {
        q: "Is the tool allowance included in the apprentice carpenter rate?",
        a: "Not in the percentage of the standard rate, but it is part of the minimum. Clause 19.7(b) and (c) of the Building and Construction General On-site Award make an apprentice's minimum the percentage rate plus the $41.22 carpenter tool allowance and the industry allowance, for all purposes. The Fair Work Ombudsman pay guide figures on this page, such as $19.05 an hour in first year with Year 12 on a general building site, already include both.",
      },
      {
        q: "Do apprentice carpenters get paid more on a commercial site than on a house?",
        a: "Yes, by $13.43 a week, which is the gap between the two industry allowances: $67.15 on general building, civil and engineering construction work and $53.72 on residential building (single or dual occupancy, not multistorey). In first year with Year 12 that is $19.05 an hour against $18.70.",
      },
    ],
  },
  {
    slug: "bricklayer",
    label: "Bricklayer",
    trade: "bricklaying",
    tradeSlug: "building",
    h1: "Apprentice Bricklayer Pay",
    lead:
      "A bricklaying apprentice's minimum includes a $29.26 a week tool allowance, the amount clause 21.1(a) of the Building and Construction General On-site Award sets for a bricklayer or refractory bricklayer. It is paid in full to apprentices with the industry allowance, for all purposes (cl 19.7(c)). That is $11.96 a week less than the carpentry tool allowance, about 31 cents an hour, and it is the only reason a bricklaying apprentice's minimum differs from a carpentry apprentice's.",
    extraLinks: [{ href: "/building-and-construction-award-rates/", label: "Building and Construction Award rates", blurb: "The levels and allowances behind the apprentice rates." }],
    allowances: buildingScenarios("Tool allowance (refractory bricklayer or bricklayer)", BRICKLAYER_PG.toolAllowance),
    payGuide: BRICKLAYER_PG,
    sharesTableWith: ["carpenter", "painter"],
    qualification: {
      code: "CPC33020",
      title: "Certificate III in Bricklaying and Blocklaying",
      url: tgaUrl("CPC33020"),
      detail:
        "It is current on training.gov.au and has three specialisations of 28 units each (20 core, 8 elective): traditional and heritage bricklaying, refractory bricklaying, and paving.",
    },
    facts: [
      "Only two classifications share the $29.26 rate: bricklayer and refractory bricklayer. The Fair Work Ombudsman pay guide prints one apprentice table for that pair, and the tables on this page are that table.",
      "Refractory work changes the qualified rate, not the apprentice rate. The award lists a bricklayer at CW/ECW 3 ($1,119.10 a week before allowances) and a refractory bricklayer at CW/ECW 5 ($1,189.60), $70.50 a week apart (Schedule A.2.3 and A.2.5). During the apprenticeship both are paid the same percentage of the standard rate and the same tool allowance.",
      "The paving specialisation lines up with a separate award classification, paviour (including segmental paving), which has no tool allowance in clause 21.1(a). If your employer classifies you as a paviour rather than a bricklayer, the pay guide's \"All others\" apprentice table applies instead: $682.66 a week ($17.96 an hour) in first year with Year 12 on a general building site, against $711.92 ($18.73) for a bricklayer.",
      "Stage progression counts the competencies in the training plan for your Certificate III: stage 2 at 25% or 12 months after starting, stage 3 at 50% or 12 months after stage 2, stage 4 at 75% or 12 months after stage 3, whichever comes first (cl 19.7(b)).",
    ],
    faqs: [
      {
        q: "How much is the bricklayer tool allowance for an apprentice?",
        a: "$29.26 a week from 1 July 2026, the clause 21.1(a) amount for a refractory bricklayer or bricklayer under the Building and Construction General On-site Award. Apprentices get the full amount, not a percentage, as part of the ordinary weekly rate for all purposes (cl 19.7(c)). It is already in the pay guide figures on this page.",
      },
      {
        q: "Is a refractory bricklaying apprentice paid more?",
        a: "Not during the apprenticeship. Bricklayers and refractory bricklayers share the same percentages and the same $29.26 tool allowance. The difference comes after qualifying: the award classifies a refractory bricklayer at CW/ECW 5 ($1,189.60 a week before allowances) and a bricklayer at CW/ECW 3 ($1,119.10).",
      },
    ],
  },
  {
    slug: "painter",
    label: "Painter",
    trade: "painting",
    tradeSlug: "building",
    h1: "Apprentice Painter Pay",
    lead:
      "Painting apprentices have the smallest trade tool allowance in the Building and Construction General On-site Award: $9.89 a week, shared with signwriters and glaziers (cl 21.1(a)). The award still pays it in full to apprentices with the industry allowance, for all purposes (cl 19.7(c)), so a painting apprentice's minimum sits $31.33 a week below a carpentry apprentice's in every year.",
    extraLinks: [{ href: "/building-and-construction-award-rates/", label: "Building and Construction Award rates", blurb: "The levels and allowances behind the apprentice rates." }],
    allowances: buildingScenarios("Tool allowance (signwriter, painter or glazier)", PAINTER_PG.toolAllowance),
    payGuide: PAINTER_PG,
    sharesTableWith: ["carpenter", "bricklayer"],
    qualification: {
      code: "CPC30620",
      title: "Certificate III in Painting and Decorating",
      url: tgaUrl("CPC30620"),
      detail: "It is current on training.gov.au: 29 units, 26 core and 3 elective.",
    },
    facts: [
      "The Fair Work Ombudsman pay guide prints one apprentice table for glaziers, painters and signwriters, and the tables on this page are that table. The award's painter classification includes artworkers, spray painters, shotblasters and sandblasters, all at CW/ECW 3 (Schedule A.2.3).",
      "Watch the classification once you qualify. The award also lists painter brush hand and spray painter among its CW/ECW 1 classifications (Schedule A.2.1), the lowest level, which starts at $1,013.50 a week. That level is not available to someone who has finished: clause 19.7(a) says a person who has completed a full apprenticeship must not be paid less than the $1,119.10 standard rate, before the $9.89 tool allowance and the industry allowance.",
      "Stage progression counts the competencies in your Certificate III training plan: stage 2 at 25% or 12 months after starting, stage 3 at 50% or 12 months after stage 2, and stage 4 at 75% or 12 months after stage 3, whichever is earlier each time (cl 19.7(b)).",
      "Coverage depends on the work your employer does and on any enterprise agreement, so check the award named on your contract before relying on these tables.",
    ],
    faqs: [
      {
        q: "Do apprentice painters get the industry allowance?",
        a: "On work covered by the Building and Construction General On-site Award, yes. The award adds the industry allowance ($67.15 a week for general building, civil and engineering construction, $53.72 for residential building) and the $9.89 painter tool allowance to the percentage rate, for all purposes. A painting employer who is not covered by this award may pay differently.",
      },
      {
        q: "Why is an apprentice painter paid less than an apprentice carpenter?",
        a: "Only because of the tool allowance: $9.89 a week for a painter against $41.22 for a carpenter (cl 21.1(a)). The percentage of the standard rate and the industry allowance are the same, so the gap is $31.33 a week in every year, for example $692.55 against $723.88 in first year with Year 12 on a general building site.",
      },
    ],
  },
  {
    slug: "plumber",
    label: "Plumber",
    trade: "plumbing",
    tradeSlug: "plumbing",
    h1: "Apprentice Plumber Pay",
    lead:
      "Plumbing apprentices are paid under the Plumbing and Fire Sprinklers Award 2020, which builds the allowances into the apprentice rate itself. The hourly rates in Schedule E.2.1 include the full industry allowance and the apprentice's percentage of the tool and plumbing trade allowances, all for all purposes, so there is nothing to add for those three when you check a payslip. The same schedule prints the weekend and public holiday rates.",
    job: { href: "/job-pay-rates/plumber/", label: "Plumber pay rates (qualified)" },
    extraLinks: [{ href: "/construction-trades-pay/", label: "Construction and Trades Pay Guide", blurb: "What tradies and apprentices earn, with allowances and take-home." }],
    allowances: [],
    penalty: {
      heading: "Weekend and Public Holiday Rates",
      intro:
        "Schedule E.2.1(b) of the Plumbing and Fire Sprinklers Award prints the apprentice's weekend and public holiday rates as a percentage of the apprentice hourly rate: Saturday 150% for the first 2 hours and 200% after that, Sunday 200% and public holidays 250%. Applied to the Year 12 rates in the first table:",
      columns: [
        { label: "Saturday first 2 hours", pct: 150 },
        { label: "Saturday after 2 hours", pct: 200 },
        { label: "Sunday", pct: 200 },
        { label: "Public holiday", pct: 250 },
      ],
      caption: "Hourly dollars, matching Schedule E.2.1(b) and the Fair Work Ombudsman pay guide. The allowances are already inside these rates.",
    },
    qualification: {
      code: "CPC32420",
      title: "Certificate III in Plumbing",
      url: tgaUrl("CPC32420"),
      detail:
        "It is current on training.gov.au, with two specialisations: general plumber, roofing and mechanical (77 units) and general plumber and mechanical (73 units).",
    },
    facts: [
      "Apprentice plumbers, mechanical services and irrigation installers are covered by the Plumbing and Fire Sprinklers Award 2020. Its apprentice hourly rate in Schedule E.2.1 already contains the allowances: the percentage of the tradesperson level 1 weekly rate plus the full industry allowance and the same percentage of the tool and plumbing trade allowances, all paid for all purposes.",
      "Compare like with like. Once the building award's allowances are counted, a first-year carpentry apprentice with Year 12 on a general building site must get $19.05 an hour, against $18.11 for a plumbing apprentice, both from the Fair Work Ombudsman pay guides. The bare building percentage rate of $16.20 leaves the allowances out.",
      "The weekly figures are the pay guide's, not the hourly rate times 38: $864.35 in 3rd year, for example, where $22.75 x 38 would give $864.50. The 4th-year rate is 90% of the tradesperson rate and allowances. Apprentice sprinkler fitters have their own rates in Schedule E.2.2 and are not shown here.",
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
    lead:
      "A motor mechanic apprentice is paid under the Vehicle Repair, Services and Retail Award 2020, which differs from most trade awards in three ways: the 4th-year junior rate is 88% of the tradesperson rate rather than 90%, adult apprentices are paid fixed classification rates, and the award prints Saturday, Sunday and public holiday rates for apprentices.",
    job: { href: "/job-pay-rates/mechanic/", label: "Mechanic pay rates (qualified)" },
    extraLinks: [{ href: "/manufacturing-award-rates/", label: "Manufacturing Award rates", blurb: "The award that covers many other mechanical and engineering trades." }],
    allowances: [
      {
        id: "tools",
        label: "If you supply your own hand tools",
        lines: [{ label: "Apprentice tool allowance", clause: "cl 19.6(b)", byStage: [5.88, 7.59, 10.46, 12.14] }],
        condition: "Payable only where the employer requires the apprentice to provide their own tools. Not subject to overtime, penalties or annual leave loading (cl 19.6(c))",
        allPurpose: false,
      },
    ],
    penalty: {
      heading: "Weekend and Public Holiday Rates",
      intro:
        "Schedule B.5.1 of the Vehicle Repair, Services and Retail Award prints the rates for a junior apprentice as a percentage of the ordinary hourly rate: Saturday 150%, Sunday 200% and public holidays 250%. Applied to the Year 12 rates in the first table:",
      columns: [
        { label: "Saturday", pct: 150 },
        { label: "Sunday", pct: 200 },
        { label: "Public holiday", pct: 250 },
      ],
      caption: "Hourly dollars, matching the Fair Work Ombudsman pay guide. The apprentice tool allowance is not subject to penalty additions (cl 19.6(c)).",
    },
    qualification: {
      code: "AUR30620",
      title: "Certificate III in Light Vehicle Mechanical Technology",
      url: tgaUrl("AUR30620"),
      detail: "It is current on training.gov.au: 36 units, 20 core and 16 elective.",
    },
    facts: [
      "A motor mechanic apprentice in a workshop, dealership or service centre is usually covered by the Vehicle Repair, Services and Retail Award 2020. The award splits apprentices at 21: a junior apprentice is under 21 (cl 16.9(a)) and an adult apprentice is over 21 when the apprenticeship starts (cl 16.10(a)). Junior rates are a percentage of the Level R6 tradesperson rate of $1,119.10 a week.",
      "Adult apprentices are paid by reference to award classification levels instead of percentages: 80% of R6 in first year, then Level 1, Level 2 and Level 3, and the full R6 rate after the apprenticeship (cl 16.10(b)). A person already employed in the vehicle industry before becoming an adult apprentice with that employer cannot have their pay cut by signing the contract (cl 16.10(c)).",
      "The tool allowance for apprentices rises by year, from $5.88 to $12.14 a week, against $13.86 for a tradesperson, and is payable only where the apprentice is required to provide their own tools (cl 19.6(a), (b)).",
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
    lead:
      "Hairdressing apprentices are paid under the Hair and Beauty Industry Award 2020, which has a 77% third year, a separate 30-month scale for pre-apprentices, a $10.52 weekly tool allowance when the salon makes you bring your own scissors, and a Saturday rate of 133% between 7am and 6pm.",
    job: { href: "/job-pay-rates/hairdresser/", label: "Hairdresser pay rates (qualified)" },
    extraLinks: [{ href: "/hair-and-beauty-award-rates/", label: "Hair and Beauty Award rates", blurb: "Every level, plus casual and weekend rates." }],
    allowances: [
      {
        id: "tools",
        label: "If the salon requires you to use your own tools",
        lines: [{ label: "Tool allowance", clause: "cl 20.8(a)", byStage: ST(10.52) }],
        condition: "Payable when the employer requires you to provide and use your own tools, including scissors and other cutting instruments. The same flat amount applies to apprentices and qualified staff",
        allPurpose: false,
      },
    ],
    penalty: {
      heading: "Saturday, Sunday and Public Holiday Rates",
      intro:
        "Table 14 in clause 23.1 of the Hair and Beauty Industry Award sets the rates for full-time and part-time employees, apprentices included: 133% of the hourly rate for ordinary hours on a Saturday between 7am and 6pm, 200% on a Sunday between 10am and 5pm, and 250% on a public holiday. Applied to the Year 12 rates in the first table:",
      columns: [
        { label: "Saturday 7am to 6pm", pct: 133 },
        { label: "Sunday 10am to 5pm", pct: 200 },
        { label: "Public holiday", pct: 250 },
      ],
      caption: "Hourly dollars, matching the Fair Work Ombudsman pay guide. Casual apprentices have different percentages that include the casual loading (cl 23.2).",
    },
    qualification: {
      code: "SHB30416",
      title: "Certificate III in Hairdressing",
      url: tgaUrl("SHB30416"),
      detail: "It is current on training.gov.au: 28 units, 21 core and 7 elective.",
    },
    facts: [
      "The junior rates come from Table 6 (has not completed Year 12) and Table 7 (has completed Year 12) in clause 18.1. The percentages apply to the Level 3 standard weekly rate of $1,119.10. The 3rd-year rate is 77% and the 4th-year rate is 90%, which makes hairdressing slightly different from the building trades (75% in 3rd year) and from beauty therapy (80%).",
      "Pre-apprentices have their own tables (cl 18.3, Tables 10 and 11), which the Fair Work Ombudsman pay guide applies to an apprentice who has completed a pre-apprenticeship. They step up every six months: 50%, 55%, 60% and then 77% for the last 12 months without Year 12, or 55%, 55%, 65% and 77% with Year 12, 30 months in all.",
      "If the salon requires you to provide and use your own tools, including scissors, it must pay $10.52 a week on top of the wage (cl 20.8(a)). Electrical equipment you have to buy for the job, such as a hair dryer, is reimbursed instead (cl 20.8(b)).",
    ],
    faqs: [
      {
        q: "How much does a first-year apprentice hairdresser earn?",
        a: "From 1 July 2026 the Hair and Beauty Industry Award 2020 sets a minimum of $14.73 an hour ($559.55 a week) in the first year for an apprentice who did not complete Year 12, and $16.20 an hour ($615.51 a week) for one who did. Many salons pay more.",
      },
      {
        q: "Do apprentice hairdressers get paid more on Saturdays?",
        a: "Yes. For ordinary hours on a Saturday between 7am and 6pm the award pays 133% of the hourly rate (cl 23.1), so a first-year apprentice with Year 12 gets $21.55 an hour instead of $16.20. Sunday work between 10am and 5pm is 200% and public holidays 250%.",
      },
      {
        q: "Do apprentice hairdressers get a tool allowance?",
        a: "Yes, if the employer requires them to provide and use their own tools, including scissors and other cutting instruments. Clause 20.8(a) of the Hair and Beauty Industry Award sets it at $10.52 a week, the same amount as for qualified staff. It is not in the hourly rates on this page.",
      },
    ],
  },
  {
    slug: "chef",
    label: "Chef",
    trade: "cookery",
    tradeSlug: "cookery",
    h1: "Apprentice Chef Pay",
    lead:
      "Cookery apprentices in hotels, pubs and clubs are paid under the Hospitality Industry (General) Award 2020, which does not split rates by Year 12, pays 95% of the standard rate in 4th year, adds a loading for evening and early-morning hours, and can lift a 4th-year apprentice to the full standard hourly rate early through proficiency pay.",
    job: { href: "/job-pay-rates/chef/", label: "Chef pay rates (qualified)" },
    extraLinks: [
      { href: "/hospitality-award-rates/", label: "Hospitality Award rates", blurb: "The award these cookery apprentice rates come from." },
      { href: "/restaurant-award-rates/", label: "Restaurant Award rates", blurb: "The separate award for many restaurants and cafes." },
    ],
    allowances: [
      {
        id: "tools",
        label: "If you must supply your own knives and tools",
        lines: [{ label: "Tool and equipment allowance (weekly maximum)", clause: "cl 26.5(a)", byStage: ST(9.94) }],
        condition: "$2.03 a day or part day, capped at $9.94 a week, so the cap is reached on the fifth day",
        allPurpose: false,
      },
    ],
    penalty: {
      heading: "Weekend, Public Holiday and Evening Rates",
      intro:
        "Table 14 in clause 29.2 of the Hospitality Industry (General) Award sets the rates for full-time and part-time employees, apprentices included: 125% of the hourly rate on a Saturday, 150% on a Sunday and 225% on a public holiday. Monday to Friday hours between 7pm and midnight attract an extra $2.95 an hour, and between midnight and 7am an extra $4.42 an hour. Applied to the rates in the first table:",
      columns: [
        { label: "Saturday", pct: 125 },
        { label: "Sunday", pct: 150 },
        { label: "Public holiday", pct: 225 },
      ],
      caption: "Hourly dollars, matching the Fair Work Ombudsman pay guide. Casual apprentices have different percentages that include the casual loading.",
    },
    qualification: {
      code: "SIT30821",
      title: "Certificate III in Commercial Cookery",
      url: tgaUrl("SIT30821"),
      detail: "It is current on training.gov.au: 25 units, 20 core and 5 elective.",
    },
    facts: [
      "The rates here come from the Hospitality Industry (General) Award 2020, which covers hotels, pubs, clubs and similar venues. An apprentice cook in a restaurant or cafe may instead be under the Restaurant Industry Award 2020, which has its own apprentice rates that are not tabulated on this page. Check which award your employer says applies.",
      "The hospitality award does not split cookery apprentice rates by Year 12. The first year is 55% of the $1,119.10 standard weekly rate, then 65%, 80% and 95%. That makes the first-year minimum the same for everyone and a little higher than the 50% some other trades pay a first-year apprentice who did not finish Year 12.",
      "Proficiency pay (cl 19.3) applies to an apprentice who has completed their schooling in a given year. Reaching the standard of proficiency on one occasion earns the standard hourly rate of $29.45 for the last 3 months of 4th year, on two occasions for the last 6 months, and on all three for the whole of 4th year, instead of $27.98.",
      "A cook or apprentice cook who has to supply their own tools is entitled to $2.03 a day, up to $9.94 a week (cl 26.5(a)). Knives, utensils and other items you must provide that this allowance does not cover are reimbursed (cl 26.5(b)).",
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
      {
        q: "What do apprentice chefs get paid on weekends and late nights?",
        a: "The award pays 125% of the hourly rate on a Saturday, 150% on a Sunday and 225% on a public holiday (cl 29.2). A first-year apprentice on $16.20 gets $20.25 on a Saturday and $24.30 on a Sunday. Monday to Friday work between 7pm and midnight adds $2.95 an hour, and between midnight and 7am $4.42 an hour.",
      },
    ],
  },
  {
    slug: "boilermaker",
    label: "Boilermaker",
    trade: "boilermaking and fabrication",
    tradeSlug: "manufacturing",
    h1: "Apprentice Boilermaker Pay",
    lead:
      "Boilermaking apprentices under the Manufacturing and Associated Industries and Occupations Award 2020 are the only apprentices on these pages whose 4th-year rate depends on Year 12: completing it moves the 4th year from 88% of the C10 trade rate to the C12 classification rate. Their tool allowance is a share of the tradesperson amount and is paid for all purposes.",
    job: { href: "/job-pay-rates/boilermaker/", label: "Boilermaker pay rates (qualified)" },
    extraLinks: [{ href: "/manufacturing-award-rates/", label: "Manufacturing Award rates", blurb: "Every C-level, from the trade rate upwards." }],
    allowances: [
      {
        id: "tools",
        label: "Unless your employer provides all your tools",
        lines: [BOILERMAKER_TOOL],
        condition:
          "Not payable where the employer has provided all tools since before 5 November 1979, or has agreed with you to provide all the tools you need (cl 30.2(c)(iii), (iv)). Tools from the Tools for your trade scheme do not count as the employer providing them (cl 30.2(c)(viii))",
        allPurpose: true,
      },
    ],
    qualification: {
      code: "MEM31925",
      title: "Certificate III in Engineering - Fabrication Trade",
      url: tgaUrl("MEM31925"),
      detail:
        "training.gov.au released it on 4 September 2025, superseding MEM31922 (listed as equivalent). It has a Boilermaking specialisation, and every version needs units worth 96 points.",
    },
    facts: [
      "A boilermaker apprentice is normally doing the Engineering / Vehicle Tradesperson (Fabrication) apprenticeship that clause 12.4 of the Manufacturing and Associated Industries and Occupations Award 2020 names. The rates come from clause 21.6 for apprentices who started on or after 1 January 2014. The finished tradesperson is C10, $1,119.10 a week or $29.45 an hour, and the award lists the Certificate III in Engineering - Fabrication Trade as a C10 qualification.",
      "Year 12 matters in the first two years and in the 4th. An apprentice who has not completed Year 12 is paid 88% of C10 in 4th year ($984.81), but one who has completed Year 12 is paid the C12/V3 rate of $1,029.10 a week, $44.29 a week more.",
      "Progression counts Competency Points (cl 21.7(b)): stage 2 at 25% of the points for the Certificate III in the training plan or 12 months after starting, stage 3 at 50% or 12 months after stage 2, stage 4 at 75% or 12 months after stage 3, whichever is earlier. On a 96-point fabrication plan that is 24, 48 and 72 points (our arithmetic). The probationary period cannot be more than three months (cl 12.10), and an apprentice under 18 does not have to work overtime or shiftwork (cl 12.15).",
      "The tool allowance is $17.90 a week for a tradesperson (cl 30.2(c)(ii)), and an apprentice gets the column 1 percentage of clause 21.6: 50%, 60%, 75% and 88% (cl 30.2(c)(v)). The weekly dollar amounts in the allowance table above are our arithmetic; the Fair Work Ombudsman pay guide shows the same allowance per hour as 24, 28, 35 and 41 cents. It is paid for all purposes (cl 30.2(c)(ix)), so it counts in overtime and penalty rates.",
      "Not every boilermaker is under this award. The Building and Construction General On-site Award 2020 names a boilermaker and/or structural steel tradesperson classification, so a boilermaker working on a building site may be covered by that award instead, with its own percentages and allowances. Check your contract or pay guide.",
    ],
    faqs: [
      {
        q: "Why is a 4th-year boilermaker apprentice paid more if they finished Year 12?",
        a: "Under clause 21.6 of the Manufacturing and Associated Industries and Occupations Award 2020, 4th-year pay for an apprentice who has completed Year 12 is the C12/V3 rate of $1,029.10 a week ($27.08 an hour). For one who has not, it is 88% of C10, which is $984.81 a week ($25.92 an hour).",
      },
      {
        q: "How much is the tool allowance for an apprentice boilermaker?",
        a: "Clause 30.2(c) pays a tradesperson $17.90 a week and an apprentice the same percentage as their wage column: 50% in stage 1, 60% in stage 2, 75% in stage 3 and 88% in stage 4. By our arithmetic that is $8.95, $10.74, $13.43 and $15.75 a week; the Fair Work Ombudsman pay guide shows it per hour as $0.24, $0.28, $0.35 and $0.41. It is paid for all purposes unless your employer provides all your tools.",
      },
    ],
  },
  {
    slug: "butcher",
    label: "Butcher",
    trade: "butchery",
    tradeSlug: "meat",
    h1: "Apprentice Butcher Pay",
    lead:
      "Butchery apprentices are paid under the Meat Industry Award 2020, which has the steepest third-year step of the trades on these pages: 85% of the MI 7 rate, against 70% to 80% in the others. In a butcher shop the award also sets its own Saturday and Sunday rates, and a cold temperature allowance applies to work in freezers.",
    extraLinks: [{ href: "/junior-pay-rates/", label: "Junior Pay Rates", blurb: "Age-based rates for workers who are not apprentices." }],
    allowances: [],
    penalty: {
      heading: "Weekend Rates in a Butcher Shop",
      intro:
        "Clause 24.3 of the Meat Industry Award sets the weekend rates for meat retail establishments: 125% of the minimum hourly rate for ordinary hours on a Saturday between 4am and 6pm, and 150% on a Sunday between 8am and 6pm. Applied to the Year 12 rates in the first table:",
      columns: [
        { label: "Saturday 4am to 6pm", pct: 125 },
        { label: "Sunday 8am to 6pm", pct: 150 },
      ],
      caption: "Hourly dollars, meat retail, matching the Fair Work Ombudsman pay guide. Public holiday rates depend on the day (cl 31.3) and are not shown.",
    },
    qualification: {
      code: "AMP30815",
      title: "Certificate III in Meat Processing (Retail Butcher)",
      url: tgaUrl("AMP30815"),
      detail: "It is current on training.gov.au: 44 units, 37 core and 7 elective.",
    },
    facts: [
      "Apprentice butchers in butcher shops (meat retail establishments), meat processing plants and meat manufacturing are covered by the Meat Industry Award 2020. The award pays apprentices a percentage of its MI 7 rate, which is $1,119.10 a week or $29.45 an hour. For an apprentice who started on or after 1 January 2014 the percentages are 50% (55% with Year 12), 60% (65%), 85% and 95% (cl 16.3(a)(ii)).",
      "At 85% of MI 7 a 3rd-year butchery apprentice earns $951.24 a week before any allowance, $111.91 more than the 75% third-year rate of $839.33 in the building, vehicle and manufacturing awards. By 4th year the figure is $1,063.15, the same as a cookery apprentice.",
      "Work in a temperature artificially reduced below zero attracts a cold temperature allowance for every hour or part of an hour (cl 20.2(a)): $0.77 below 0°C, $1.33 below -16°C, $1.88 below -18°C and $2.56 below -21°C. The Fair Work Ombudsman pay guide lists no tool allowance in this award.",
      "Some retail butchers are not under this award. It does not cover employees who are covered by the General Retail Industry Award 2020, so a butcher employed by a supermarket may be on different rates or an enterprise agreement. Check the award named on your contract.",
    ],
    faqs: [
      {
        q: "How much do apprentice butchers earn?",
        a: "From 1 July 2026 the Meat Industry Award 2020 sets a first-year minimum of $14.73 an hour ($559.55 a week) for an apprentice who did not complete Year 12 and $16.20 an hour ($615.51 a week) for one who did. By 4th year the minimum is $27.98 an hour ($1,063.15 a week). Many butchers are on an enterprise agreement that pays more.",
      },
      {
        q: "Do apprentice butchers get paid more on weekends?",
        a: "In a butcher shop, yes. Clause 24.3 of the Meat Industry Award pays 125% of the hourly rate for ordinary hours on a Saturday between 4am and 6pm and 150% on a Sunday between 8am and 6pm. A first-year apprentice with Year 12 on $16.20 gets $20.25 on a Saturday and $24.30 on a Sunday.",
      },
      {
        q: "Is there a cold allowance for apprentice butchers?",
        a: "Yes, for work in a temperature artificially reduced below zero. Clause 20.2(a) pays $0.77 an hour below 0°C, $1.33 below -16°C, $1.88 below -18°C and $2.56 below -21°C, for every hour or part of an hour spent in those conditions. It is on top of the wage.",
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

export interface HeadlineRate {
  weekly: number;
  hourly: number;
}

/**
 * The minimum a spoke leads with. Building trades: the FWO pay guide figure for the trade on a general
 * building site (wage + tool + industry allowance, cl 19.7(b), (c)) or on residential work. Every other trade:
 * the award rate in ./index.ts.
 */
export function headlineRate(
  spoke: ApprenticeSpoke,
  stage: ApprenticeStage,
  year12: "completed" | "not-completed",
  site: "general" | "residential" = "general",
): HeadlineRate {
  if (spoke.payGuide) {
    const [weekly, hourly] = spoke.payGuide[site][payGuideKey(stage, year12)];
    return { weekly, hourly };
  }
  const r = spokeRate(spoke, stage, year12);
  return { weekly: r.weekly, hourly: r.hourly };
}

/** Allowances a week in a scenario for a stage, dollars. */
export function scenarioAllowance(scenario: AllowanceScenario, stage: ApprenticeStage): number {
  return roundCent(scenario.lines.reduce((sum, l) => sum + l.byStage[stage - 1], 0));
}

export interface AllowanceRow {
  stage: ApprenticeStage;
  allowance: number;
  /** Wage plus allowances, a week, for an apprentice who has not completed Year 12 (null if the award has no split). */
  noYear12Weekly: number | null;
  noYear12Hourly: number | null;
  year12Weekly: number;
  year12Hourly: number;
}

/** Wage + allowances for each stage. Hourly = weekly / 38 rounded to the cent, the way the building award converts weekly to hourly. */
export function allowanceRows(spoke: ApprenticeSpoke, scenario: AllowanceScenario): AllowanceRow[] {
  return STAGES.map((stage) => {
    const y = spokeRate(spoke, stage, "completed");
    const n = spokeRate(spoke, stage, "not-completed");
    const allowance = scenarioAllowance(scenario, stage);
    const split = y.year12 !== "either";
    const nw = roundCent(n.weekly + allowance);
    const yw = roundCent(y.weekly + allowance);
    return {
      stage,
      allowance,
      noYear12Weekly: split ? nw : null,
      noYear12Hourly: split ? roundCent(nw / 38) : null,
      year12Weekly: yw,
      year12Hourly: roundCent(yw / 38),
    };
  });
}

/** Hourly rate x an award percentage, rounded half up to the cent (how the FWO pay guides print penalty rates). */
export function penaltyAt(hourly: number, pct: number): number {
  return roundCent((hourly * pct) / 100);
}

/** Junior apprentice penalty multiples printed in MA000089 Schedule B.5.1. */
export const AUTOMOTIVE_PENALTY_MULTIPLES = { saturday: 1.5, sunday: 2, publicHoliday: 2.5 } as const;

export function penaltyHourly(hourly: number, kind: keyof typeof AUTOMOTIVE_PENALTY_MULTIPLES): number {
  return penaltyAt(hourly, AUTOMOTIVE_PENALTY_MULTIPLES[kind] * 100);
}

const money = (n: number) => `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function buildingAdult(pgd: BuildingPayGuide, label: string): string {
  return `A person who starts as an adult apprentice and was not already employed by the same employer is paid the greater of the ordinary hourly rate for the lowest classification in clause 19.1 (Level 1 (a)) and the rate for their year (cl 19.8(d)). The award's ordinary hourly rate includes the industry allowance and any all-purpose allowance, so for ${label} it includes the ${money(pgd.toolAllowance)} tool allowance too. The Fair Work Ombudsman pay guide works this out at ${money(pgd.adult.general[1])} an hour (${money(pgd.adult.general[0])} a week) on general building sites and ${money(pgd.adult.residential[1])} (${money(pgd.adult.residential[0])}) on residential work, in every year, because even the 90% fourth-year rate is lower. A person who was employed by the employer for at least 6 months full-time or 12 months part-time or as a regular casual before starting keeps the hourly rate they were on (cl 19.8(a) to (c)).`;
}

function buildingAdultFaq(pgd: BuildingPayGuide, label: string): string {
  return `Yes. An adult apprentice ${label} who was not already working for the employer is paid at least the award's lowest ordinary hourly rate with the allowances included (cl 19.8(d)): ${money(pgd.adult.general[1])} an hour on general building sites and ${money(pgd.adult.residential[1])} on residential work, in every year, against ${money(pgd.general["1y"][1])} in first year for a junior with Year 12 on a general site.`;
}

/** Short answers for the adult-apprentice FAQ where the data has no adult table (the long version is in ADULT_NOTES). */
export const ADULT_FAQ_ANSWERS: Partial<Record<SpokeSlug, string>> = {
  carpenter: buildingAdultFaq(CARPENTER_PG, "carpenter"),
  bricklayer: buildingAdultFaq(BRICKLAYER_PG, "bricklayer"),
  painter: buildingAdultFaq(PAINTER_PG, "painter"),
  plumber:
    "In years 1 to 3, yes. An adult plumbing apprentice gets at least the national minimum wage plus the industry allowance, $27.53 an hour from 1 July 2026, against $18.11 for a first-year junior with Year 12. In 4th year both are on $28.93 (cl 18.3(b)).",
  hairdresser:
    "Yes. An adult apprentice who was not already an employee gets at least $23.56 an hour in first year and $27.81 from second year (cl 18.4), against $16.20 and $19.14 for a junior with Year 12.",
  chef:
    "Yes, until 4th year. An adult cookery apprentice gets at least $23.56 an hour in first year and $25.74 in second and third year (cl 19.5), against $16.20, $19.14 and $23.56 for a junior. In 4th year both are on $27.98.",
};

/** What a spoke says about adult starters where the data has no adult table. */
export const ADULT_NOTES: Partial<Record<SpokeSlug, string>> = {
  carpenter: buildingAdult(CARPENTER_PG, "a carpentry apprentice"),
  bricklayer: buildingAdult(BRICKLAYER_PG, "a bricklaying apprentice"),
  painter: buildingAdult(PAINTER_PG, "a painting apprentice"),
  plumber:
    "An adult plumbing apprentice is paid at least the greater of the federal minimum wage plus the full $41.41 a week industry allowance and the apprentice rate for their year (cl 18.3(b)). With the minimum wage at $1,004.90 a week from 1 July 2026, the Fair Work Ombudsman pay guide puts that at $1,046.31 a week ($27.53 an hour) in years 1 to 3; in 4th year the apprentice rate of $1,099.48 ($28.93) is higher. A person already employed by the employer keeps their previous rate, including all-purpose allowances.",
  hairdresser:
    "An adult apprentice, 21 or older at the start, who was not already an employee gets at least 80% of the $1,119.10 standard rate in first year ($895.28 a week, $23.56 an hour) and, from second year, at least the Level 1 rate in clause 17.1 ($1,056.80 a week, $27.81 an hour), unless the table rate for the year is higher, which it never is (cl 18.4(a), (b)). Those are the Fair Work Ombudsman pay guide figures. Someone employed by the salon for 6 months full-time or 12 months part-time or as a regular casual before starting keeps their previous rate (cl 18.4(c), (d)).",
  chef:
    "An adult cookery apprentice who started on or after 1 January 2014 gets at least 80% of the standard weekly rate in first year ($895.28, $23.56 an hour) and, from second year, at least the Introductory level rate ($978.10, $25.74 an hour) or the year rate if that is higher (cl 19.5(a), (b)). The Fair Work Ombudsman pay guide shows $23.56, $25.74, $25.74 and then $27.98 an hour in 4th year, where the 95% rate is higher. Someone already employed by the same employer cannot have their rate cut (cl 19.5(c)).",
};
