// Welder — Manufacturing and Associated Industries and Occupations Award 2020
// [MA000010] (F4, 5 Oct 2026). Sourcing notes are in metal-trades-common.ts.
//
// The award has no single "welder" rate. It grades welding by skill:
//   C13 (A.5.2) — "basic soldering or butt and spot welding skills";
//   C12 (A.5.3) — "welding which requires the exercise of knowledge and skills
//                 above level C13";
//   C10 (A.4.7) — a trade-certificate Engineering Tradesperson (Fabrication),
//                 which is the trade-qualified welder or fabricator.

import { MANUFACTURING_AWARD } from "../../constants/modern-awards";
import { ANNUAL_WAGE_REVIEW_2026, CONSOLIDATED_TO, FWO_PAY_GUIDES, awardTextUrl, jsaSource } from "./common";
import {
  METAL_ALLOWANCES,
  METAL_MEDIAN,
  METAL_NOT_SHOWN,
  METAL_OVERTIME,
  METAL_PENALTIES,
  METAL_PENALTIES_NOTE,
  metalRow,
} from "./metal-trades-common";
import type { Occupation } from "./types";

const BASIC = metalRow("C13 / V2", "C13 — Employee Level II", "Basic soldering, butt and spot welding");
const SKILLED = metalRow("C12 / V3", "C12 — Employee Level III", "Welding that needs skills above C13");
const TRADE = metalRow("C10 / V5", "C10 — Tradesperson Level I", "Trade-certificate welder or fabricator");
const money = (x: number) => `$${x.toFixed(2)}`;

export const WELDER: Occupation = {
  slug: "welder",
  name: "Welder",
  plural: "welders",
  award: {
    name: MANUFACTURING_AWARD.meta.name,
    code: MANUFACTURING_AWARD.meta.code,
    url: awardTextUrl(MANUFACTURING_AWARD.meta.code),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/manufacturing-award-rates/",
  },
  headline: {
    tableId: "welder",
    label: TRADE.label,
    why: "a trade-qualified welder or fabricator (Certificate III in Engineering, Fabrication Trade), paid the award's trade rate",
  },
  coverage: [
    "Welders in manufacturing and metal fabrication workshops are covered by the Manufacturing and Associated Industries and Occupations Award 2020 [MA000010]. The award has no single welder rate. It grades welding by the skill the job needs.",
    "Basic soldering and butt and spot welding skills are an indicative task for C13 (Employee Level II). Welding that needs knowledge and skills above C13 is an indicative C12 task (Employee Level III). A welder who holds a trade certificate in fabrication is an Engineering/Manufacturing Tradesperson Level I at C10, the award's trade rate, with higher trade levels at C9 and C8.",
    "Which award applies depends on the employer's industry. A welder employed on a building site by a builder, in mining, in shipbuilding or in vehicle manufacturing may be under a different award or an enterprise agreement, and enterprise agreements can pay more than these minimums.",
  ],
  tables: [
    {
      id: "welder",
      title: "Welder pay rates by classification, 2026–27",
      intro:
        "These are the Manufacturing Award minimum rates in cl 20.1(a), from the first full pay period on or after 1 July 2026. The casual rate is the hourly rate plus the 25% casual loading (cl 11.1). A welder's level depends on skills, competence and training, not job title.",
      rows: [
        BASIC,
        SKILLED,
        TRADE,
        metalRow("C9 / V6", "C9 — Tradesperson Level II", "Higher trade skills"),
        metalRow("C8 / V7", "C8 — Special Class Level I", "Special class tradesperson"),
      ],
    },
  ],
  penalties: METAL_PENALTIES,
  penaltiesNote: METAL_PENALTIES_NOTE,
  overtime: METAL_OVERTIME,
  allowances: METAL_ALLOWANCES,
  median: METAL_MEDIAN,
  notices: [
    "Jobs and Skills Australia's profile for first-class welders prints no median earnings (N/A), so the $1,688 a week figure is for the wider group of structural steel and welding trades workers, which includes metal fabricators and pressure welders.",
    "Welding on construction sites or in mining may be paid under an enterprise agreement or another award, so the Manufacturing Award minimums on this page may not be the rates that apply to you.",
  ],
  notShown: METAL_NOT_SHOWN,
  lede: `The Manufacturing Award has no single welder rate. It grades welding by the skill the job needs: basic spot and butt welding is C13 at ${money(BASIC.hourly)} an hour, welding that needs more than that is C12 at ${money(SKILLED.hourly)}, and a welder with a fabrication trade certificate is a C10 tradesperson at ${money(TRADE.hourly)} an hour or ${money(TRADE.weekly)} a week from 1 July 2026. Which of the three you are is decided by the work you are required to do and your training, not your job title.`,
  sections: [
    {
      id: "grading",
      heading: "How the award grades welding work",
      paragraphs: [
        "Schedule A of the Manufacturing and Associated Industries and Occupations Award 2020 lists indicative tasks for each wage group, and welding appears at three of them. At C13 (Employee Level II) the indicative task is basic soldering or butt and spot welding skills, or cutting scrap with an oxyacetylene blow pipe (A.5.2). At C12 (Employee Level III) it is welding which requires the exercise of knowledge and skills above level C13 (A.5.3). At C10 the employee is an Engineering/Manufacturing Tradesperson Level I who holds a recognised trade certificate. The award names the Certificate III in Engineering, Fabrication Trade, among the C10 qualifications (A.3.1). The C13 and C12 levels are production classifications. A process worker who welds on a line is paid for the skill the welding needs, and moves up a level only when the work, and the training behind it, moves up.",
        "The award's vehicle manufacturing stream in Schedule B grades the same way with V levels. Welder, electric spot and buff, is a V2 classification, and welding which requires the exercise of knowledge and skills above Level V2 is an indicative task of a V3 employee. A vehicle industry tradesperson Level 1 (V5) holds a trade certificate in the electrical, mechanical or fabrication vehicle industry stream. The dollar figures for the V levels match the C levels alongside them in the rate table, so the same test applies in a car plant as in a fabrication shop: certificate, or production skill level.",
      ],
    },
    {
      id: "trade-route",
      heading: "The trade certificate, and the apprenticeship that leads to it",
      paragraphs: [
        "The route to the C10 rate is a fabrication trade apprenticeship. The Vehicle Repair, Services and Retail Award lists welder, tradesperson, among its 21 apprenticeship trades (cl 13.2). The Manufacturing Award's own apprentices are paid the clause 21.6 percentages of the C10 rate while they train, with the Certificate III in Engineering, Fabrication Trade as the qualification. A welder who holds that certificate is a C10 tradesperson from the first day in a new workshop, whatever the job advertisement called the role.",
        "Jobs and Skills Australia separates first-class welders (322313) from pressure welders (322312) and metal fabricators (322311) inside its unit group 3223, and lists the group's tasks as studying blueprints, drawings and specifications, selecting and preparing metal stock, cutting marked-out sections with hand tools, flame cutting torches and cutting machines, aligning parts with measuring instruments, joining sections by welding, bolting and riveting, examining welds for width of bead, penetration and precision, and cleaning and smoothing welds by filing, chiselling and grinding. Reading blueprints and checking penetration are tradesperson tasks; repetition spot welding on set-up equipment is the C13 task the award describes. The gap between them in 2026-27 is the gap between a C13 and a C10 wage.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is spot welding paid at the trade rate?",
      a: "No. Under the Manufacturing Award, basic soldering or butt and spot welding skills are an indicative task of the C13 classification (Schedule A.5.2), and welding that needs knowledge and skills above C13 is an indicative task of C12. The C10 trade rate is for a tradesperson with a recognised trade certificate, such as the Certificate III in Engineering, Fabrication Trade.",
    },
    {
      q: "Do I need a trade certificate to be paid the C10 welder rate?",
      a: "Yes, or an equivalent qualification. The Manufacturing Award's C10 classification is an Engineering/Manufacturing Tradesperson Level I who holds a recognised trade certificate or an equivalent qualification, including the Certificate III in Engineering, Fabrication Trade. Welders without a trade certificate are classified by the skill their welding needs, at C13 or C12 in the general stream or V2 and V3 in vehicle manufacturing.",
    },
    {
      q: "What is the award rate for a welder in 2026?",
      a: `A trade-qualified welder or fabricator is an Engineering/Manufacturing Tradesperson Level I (C10) under the Manufacturing Award: at least ${money(TRADE.hourly)} an hour or ${money(TRADE.weekly)} a week from the first full pay period on or after 1 July 2026, about $${Math.round(TRADE.weekly * 52).toLocaleString("en-AU")} a year before tax. Welding that needs skills above C13 is C12, ${money(SKILLED.hourly)} an hour, and basic spot and butt welding is C13, ${money(BASIC.hourly)} an hour.`,
    },
    {
      q: "What is the casual rate for a welder?",
      a: `A casual C10 tradesperson earns at least ${money(TRADE.casualHourly ?? 0)} an hour, the ${money(TRADE.hourly)} minimum plus the 25% casual loading. Casual penalty rates compound under this award, so a casual Saturday at 150% is paid on the casual rate, not the base rate.`,
    },
    {
      q: "Is there a welder classification in the Manufacturing Award?",
      a: "Not as a single level. The award grades welding by skill: basic soldering and butt and spot welding is a C13 task, welding that needs skills above C13 is a C12 task, and a trade-certificate fabrication tradesperson is C10. Which level applies depends on your skills, competence and training and the work you are required to perform.",
    },
    {
      q: "Do welders get tool and confined space allowances?",
      a: "Yes, under the award: a $17.90 a week tool allowance for tradespeople who supply their own tools, $1.12 an hour for work in confined spaces, and $0.85 an hour for dirty work. A leading hand in charge of 3 to 10 employees gets $48.98 a week.",
    },
    {
      q: "What do welders actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,688 a week for structural steel and welding trades workers (ABS, May 2025), about $87,776 a year before tax. That group includes welders and metal fabricators, and it reflects the many people paid under enterprise agreements and with overtime.",
    },
  ],
  sources: [
    { title: "Manufacturing and Associated Industries and Occupations Award 2020 [MA000010], consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000010") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(METAL_MEDIAN),
  ],
  verifiedOn: "5 October 2026",
  related: [
    { href: "/manufacturing-award-rates/", label: "Manufacturing Award Rates" },
    { href: "/job-pay-rates/boilermaker/", label: "Boilermaker Pay Rates" },
    { href: "/job-pay-rates/carpenter/", label: "Carpenter Pay Rates" },
  ],
};
