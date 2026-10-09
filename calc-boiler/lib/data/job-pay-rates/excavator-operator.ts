// Excavator operator — Building and Construction General On-site Award 2020
// [MA000020], civil construction stream (J8, 9 Oct 2026). Search demand:
// "excavator operator salary" 320 a month (AU). See
// building-construction-common.ts for the all-purpose allowance rule.
//
// Award text read 9 October 2026 (awards.fairwork.gov.au/MA000020.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799301 …)"):
//   - Schedule A.1.2: "Civil construction stream includes all related skills
//     involved in earthmoving, plant operation and associated activity".
//   - Schedule A broadbanded lists: CW/ECW 4 "Excavator up to and including 0.5
//     cubic metre capacity"; CW/ECW5 "Excavator above 0.5 cubic metres",
//     "Excavator—hydraulic telescopic boom type", "Dragline/shovel excavator—
//     up to but not exceeding 3.0 metre capacity"; CW/ECW6 "Operator
//     (dragline/shovel excavator—from 3cubic metres …)".
//   - cl 19.1(a): CW4 $1,154.40, CW5 $1,189.60, CW6 $1,221.30. cl 22.1(a):
//     "General building and construction industry, civil construction industry
//     and metal and engineering construction industry—an allowance of $67.15
//     per week"; (b) residential $53.72; all purposes (cl 22.3).
//   - cl 23.9(b): "An employee who is in charge of plant must be paid an
//     additional $52.60 per week"; cl 19.3(b) adds it to the weekly hire
//     hourly rate. cl 2 defines in charge of plant, including "when an employee
//     is the only person of their class employed on the plant, the employee
//     who does the general repair work of the plant in addition to the work of
//     operating".
//   - cl 19.3(a): daily hire hourly = (sum x 52/50.4, to the cent) / 38.
//   - cl 12.3: casual minimum 4 hours per engagement. cl 24.1: inclement
//     weather provisions apply to general building and civil construction.
//   - cl 25.3(a)(i): living away from home $102.92 a day or full reimbursement.
//
// Median: Jobs and Skills Australia, ANZSCO 7212 Earthmoving Plant Operators,
// $1,900 a week / $45 an hour (ABS SEEH May 2025); the profile reports an
// average of 50 hours a week for full-time workers. Read 9 October 2026.

import {
  BUILDING_AWARD,
  BUILDING_OVERTIME,
  BUILDING_PENALTIES,
  BUILDING_PENALTIES_NOTE,
  BUILDING_SOURCE_TITLE,
  INDUSTRY_ALLOWANCE,
  buildingRow,
  dailyHireHourly,
} from "./building-construction-common";
import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, jsaSource, jsaUrl } from "./common";
import { annual52, money0, money2 } from "./j8-common";
import type { MedianEarnings, Occupation } from "./types";

/** cl 23.9(b) in charge of plant, per week; part of the weekly hire hourly rate (cl 19.3(b)). */
export const IN_CHARGE_OF_PLANT = 52.6;

const EXCAVATOR_MEDIAN: MedianEarnings = {
  anzscoCode: "7212",
  anzscoTitle: "Earthmoving Plant Operators",
  medianWeekly: 1_900,
  medianHourly: 45,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("7212-earthmoving-plant-operators"),
};

const { general, residential } = INDUSTRY_ALLOWANCE;

export const EX_CW4_RESIDENTIAL = buildingRow("Excavator up to 0.5 m³ — residential (CW/ECW 4)", "CW/ECW 4", [residential], "Single or dual occupancy home sites");
export const EX_CW4 = buildingRow("Excavator up to 0.5 m³ — civil and general building (CW/ECW 4)", "CW/ECW 4", [general], "Bucket capacity up to and including 0.5 cubic metres");
export const EX_CW5 = buildingRow("Excavator above 0.5 m³ — civil and general building (CW/ECW 5)", "CW/ECW 5", [general], "Also telescopic boom excavators and dragline or shovel up to 3 m³");
export const EX_CW6 = buildingRow("Dragline or shovel excavator from 3 m³ (CW/ECW 6)", "CW/ECW 6", [general], "Civil and general building");

export const EX_CW4_PLANT = buildingRow("Excavator up to 0.5 m³ — in charge of plant", "CW/ECW 4", [general, IN_CHARGE_OF_PLANT], "Civil and general building, plus $52.60 a week");
export const EX_CW5_PLANT = buildingRow("Excavator above 0.5 m³ — in charge of plant", "CW/ECW 5", [general, IN_CHARGE_OF_PLANT], "Civil and general building, plus $52.60 a week");

const DAILY_CW4 = dailyHireHourly(EX_CW4.weekly);
const DAILY_CW5 = dailyHireHourly(EX_CW5.weekly);

export const EXCAVATOR_OPERATOR: Occupation = {
  slug: "excavator-operator",
  name: "Excavator Operator",
  plural: "excavator operators",
  metaTitle: `Excavator Operator Salary Australia 2026 — ${money2(EX_CW4.hourly)}/hr Award`,
  award: { ...BUILDING_AWARD, awardPageHref: "/building-and-construction-award-rates/" },
  headline: {
    tableId: "excavator",
    label: EX_CW4.label,
    why: "an excavator operator on a civil or general building site running a machine of up to 0.5 cubic metres, the lowest excavator grade (CW/ECW 4)",
  },
  coverage: [
    "Excavator operators employed by civil, building and earthmoving contractors are covered by the Building and Construction General On-site Award 2020 [MA000020]. Its civil construction stream \"includes all related skills involved in earthmoving, plant operation and associated activity\" (Schedule A.1.2).",
    "The award grades plant operators by machine and size, not by licence. An excavator up to and including 0.5 cubic metre capacity is CW/ECW 4. An excavator above 0.5 cubic metres, a hydraulic telescopic boom excavator, or a dragline or shovel excavator up to 3 cubic metres is CW/ECW 5. A dragline or shovel excavator from 3 cubic metres is CW/ECW 6 (Schedule A).",
    `Every operator also gets the industry allowance for all purposes — ${money2(general)} a week in general building and civil construction, ${money2(residential)} on single and dual occupancy residential work (cl 22.1) — so the bare clause 19.1 rate is never the minimum. An operator who is in charge of plant, such as the only operator on a machine who also does its general repair work, gets another ${money2(IN_CHARGE_OF_PLANT)} a week, which is part of a weekly hire employee's hourly rate (cl 2, 19.3(b), 23.9).`,
    "The employer's industry decides the award. An excavator operator working on a mine is covered by the Mining Industry Award, and one employed by a council is usually paid under the Local Government Industry Award or the council's enterprise agreement.",
  ],
  tables: [
    {
      id: "excavator",
      title: "Excavator operator pay rates by machine size, 2026–27 (weekly hire)",
      intro:
        "Weekly = the cl 19.1 classification rate + the all-purpose industry allowance. Hourly is that weekly amount over 38 hours; casual adds the 25% loading (cl 12.4). From the first full pay period on or after 1 July 2026.",
      rows: [EX_CW4_RESIDENTIAL, EX_CW4, EX_CW5, EX_CW6],
    },
    {
      id: "in-charge-of-plant",
      title: "Excavator operators in charge of plant, 2026–27 (weekly hire)",
      intro:
        "The same rows with the $52.60 a week in charge of plant allowance added, as cl 19.3(b) requires for the weekly hire hourly rate. Civil and general building industry allowance.",
      rows: [EX_CW4_PLANT, EX_CW5_PLANT],
    },
  ],
  penalties: BUILDING_PENALTIES,
  penaltiesNote: BUILDING_PENALTIES_NOTE,
  overtime: BUILDING_OVERTIME,
  allowances: [
    { name: "Industry allowance", amount: `${money2(general)} per week (residential ${money2(residential)})`, note: "All purposes, paid to every employee (cl 22.1); included in the tables." },
    { name: "In charge of plant", amount: `${money2(IN_CHARGE_OF_PLANT)} per week`, note: "When you are in charge of plant as clause 2 defines it (cl 23.9); included in the second table." },
    { name: "Living away from home", amount: "$102.92 per day", note: "Or full reimbursement of reasonable accommodation and meal costs if that is more, when the job is too far from home to return each night (cl 25.3(a))." },
  ],
  median: EXCAVATOR_MEDIAN,
  notices: [
    `A daily hire operator, engaged to follow the work from job to job, gets a higher hourly rate: ${money2(DAILY_CW4)} for an excavator up to 0.5 m³ and ${money2(DAILY_CW5)} above 0.5 m³ on civil and general building work (cl 19.3(a)).`,
    "A casual operator must be paid for at least 4 hours each engagement (cl 12.3). Time lost to inclement weather on general building and civil sites is paid at the ordinary rate, up to 32 hours in any 4-week period (cl 24).",
  ],
  notShown: [
    "Rates for other plant (graders, loaders, dozers, rollers), which the same Schedule A grades from CW/ECW 2 to CW/ECW 8.",
    "Mining Industry Award and Local Government Industry Award rates for operators employed by mines and councils.",
    "Enterprise agreement rates, which cover many large civil contractors.",
  ],
  faqs: [
    {
      q: "What is the award rate for an excavator operator in 2026?",
      a: `On a civil or general building site, an excavator up to 0.5 m³ (CW/ECW 4) pays at least ${money2(EX_CW4.hourly)} an hour or ${money2(EX_CW4.weekly)} a week under the Building and Construction General On-site Award, about ${money0(annual52(EX_CW4.weekly))} a year full-time. An excavator above 0.5 m³ (CW/ECW 5) pays at least ${money2(EX_CW5.hourly)} an hour, from the first full pay period on or after 1 July 2026. Both include the industry allowance.`,
    },
    {
      q: "What is the casual rate for an excavator operator?",
      a: `A casual operator on a civil or general building site earns at least ${money2(EX_CW4.casualHourly ?? 0)} an hour on an excavator up to 0.5 m³ and ${money2(EX_CW5.casualHourly ?? 0)} above 0.5 m³ — the ordinary rate plus the 25% casual loading — with a 4-hour minimum each engagement.`,
    },
    {
      q: "What does 'in charge of plant' mean for an excavator operator?",
      a: `It includes being the only operator on the machine who also does its general repair work, or supervising other employees on the plant (cl 2). It adds ${money2(IN_CHARGE_OF_PLANT)} a week, taking a weekly hire operator on an excavator above 0.5 m³ to ${money2(EX_CW5_PLANT.hourly)} an hour.`,
    },
    {
      q: "Do excavator operators get paid more on weekends?",
      a: "Yes. Ordinary hours are Monday to Friday, so Saturday work is overtime at 150% for the first 2 hours and 200% after that (200% after 12 noon), Sunday is 200% and a public holiday 250%. Casuals get 175%, 225% and 275%.",
    },
    {
      q: "What do excavator operators actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $1,900 a week for earthmoving plant operators (ABS, May 2025), about ${money0(annual52(1_900))} a year before tax. Full-time operators in the group average 50 hours a week, so the median includes overtime and agreement rates.`,
    },
  ],
  sources: [
    { title: BUILDING_SOURCE_TITLE, publisher: "Fair Work Commission", url: BUILDING_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(EXCAVATOR_MEDIAN),
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/building-and-construction-award-rates/", label: "Building & Construction Award Rates" },
    { href: "/job-pay-rates/crane-operator/", label: "Crane Operator Pay Rates" },
    { href: "/job-pay-rates/truck-driver/", label: "Truck Driver Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
  ],
};
