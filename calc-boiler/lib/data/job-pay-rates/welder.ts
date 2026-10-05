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
    why: "a trade-qualified welder or fabricator (Certificate III in Engineering — Fabrication Trade), paid the award's trade rate",
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
        "Manufacturing Award cl 20.1(a), from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% loading (cl 11.1). The level depends on skills, competence and training, not job title.",
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
    "Welding on construction sites or in mining may be paid under an enterprise agreement or another award, so the minimums on this page may not be what applies to you.",
  ],
  notShown: METAL_NOT_SHOWN,
  faqs: [
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
    { title: "Manufacturing and Associated Industries and Occupations Award 2020 [MA000010] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000010") },
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
