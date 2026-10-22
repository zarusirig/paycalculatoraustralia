// Boilermaker — Manufacturing and Associated Industries and Occupations Award
// 2020 [MA000010] (F4, 5 Oct 2026). Sourcing notes are in metal-trades-common.ts.

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

const TRADE = metalRow("C10 / V5", "C10 — Tradesperson Level I", "Trade certificate; the trade rate");
const ADV = metalRow("C5 / V10", "C5 — Advanced Tradesperson Level II", "Advanced Engineering Tradesperson");
const money = (x: number) => `$${x.toFixed(2)}`;

export const BOILERMAKER: Occupation = {
  slug: "boilermaker",
  name: "Boilermaker",
  plural: "boilermakers",
  award: {
    name: MANUFACTURING_AWARD.meta.name,
    code: MANUFACTURING_AWARD.meta.code,
    url: awardTextUrl(MANUFACTURING_AWARD.meta.code),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/manufacturing-award-rates/",
  },
  headline: {
    tableId: "boilermaker",
    label: TRADE.label,
    why: "a trade-qualified boilermaker (Certificate III in Engineering — Fabrication Trade), paid the award's trade rate",
  },
  coverage: [
    "Boilermakers in manufacturing and metal fabrication workshops are covered by the Manufacturing and Associated Industries and Occupations Award 2020 [MA000010]. The award itself defines a boilermaker as a tradesperson who develops work from drawings or makes templates in the fabrication, erection and repair of steel or iron ships, boilers and pressure vessels, including incidental marking off, welding and oxy burning.",
    "A tradesperson who holds a trade certificate in fabrication (Certificate III in Engineering — Fabrication Trade, or equivalent) is an Engineering/Manufacturing Tradesperson Level I, wage group C10, the award's trade rate. C9 and C8 are the higher trade levels (Tradesperson Level II and Special Class), and C6 and C5 are Advanced Engineering Tradesperson levels.",
    "Which award applies depends on the employer's industry, not the trade. A boilermaker employed on a building site by a builder or contractor, in mining, or in vehicle manufacturing may be under a different award or an enterprise agreement, and enterprise agreements can pay more than these minimums.",
  ],
  tables: [
    {
      id: "boilermaker",
      title: "Boilermaker pay rates by classification, 2026–27",
      intro:
        "Manufacturing Award cl 20.1(a), from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% loading (cl 11.1). Higher classifications depend on skills, competence and training, not job title.",
      rows: [
        TRADE,
        metalRow("C9 / V6", "C9 — Tradesperson Level II", "Higher trade skills"),
        metalRow("C8 / V7", "C8 — Special Class Level I", "Special class tradesperson"),
        metalRow("C7", "C7 — Special Class Level II", "Special class tradesperson"),
        metalRow("C6 / V9", "C6 — Advanced Tradesperson Level I", "Advanced engineering tradesperson"),
        ADV,
      ],
    },
  ],
  penalties: METAL_PENALTIES,
  penaltiesNote: METAL_PENALTIES_NOTE,
  overtime: METAL_OVERTIME,
  allowances: METAL_ALLOWANCES,
  median: METAL_MEDIAN,
  notices: [
    "Jobs and Skills Australia publishes no separate median for boilermakers. The $1,688 a week figure is for the group of structural steel and welding trades workers, which includes metal fabricators, pressure welders and first-class welders.",
    "Fabrication work on construction sites, in mining or in shipbuilding may be paid under an enterprise agreement or another award, so the minimums on this page may not be what applies to you.",
  ],
  notShown: METAL_NOT_SHOWN,
  lede: `A trade-qualified boilermaker is a C10 Engineering/Manufacturing Tradesperson Level I under the Manufacturing Award: at least ${money(TRADE.hourly)} an hour or ${money(TRADE.weekly)} a week from 1 July 2026, with C9 and C8 above it for higher trade skills and C6 and C5 for advanced tradespeople. The award is one of the few that defines the job itself: a tradesperson who works from drawings or templates on ships, boilers and pressure vessels.`,
  sections: [
    {
      id: "definition",
      heading: "What the award means by boilermaker, and who else does the work",
      paragraphs: [
        "Schedule B of the Manufacturing and Associated Industries and Occupations Award 2020 defines a boilermaker as a tradesperson required to develop work from drawings or prints, or to make templates, or to apply general trade experience in the fabrication, erection and repairing of steel or iron ships, boilers or other vessels subject to greater pressure than the weight of their contents, including iron and steel receivers or retorts. The definition goes on to include riveting by hand or machine, caulking, chipping and operating all machines used in that work other than stationary drilling machines, and such marking off, welding or oxy burning as is incidental to it. That last phrase matters on a payslip: welding is part of a boilermaker's trade, not a separate classification.",
        "The same schedule defines the neighbouring trade. A structural steel tradesperson assembles, plates, bolts, rivets, caulks, chips, stays, reams and drills, with marking off, welding and oxy burning incidental to it, and operates punching and shearing, rolling, bending, angle and plate straightening machines, hydraulic presses and nipping and notching machines in making and repairing tanks, water locks and towers. Both sit in the award's fabrication stream, which clause 3 describes as fabrication in all materials, forging, carpentry, plumbing, founding, structural steel erection, electroplating, metal spinning, metal polishing and sheet metal work. Both are paid the C10 trade rate once qualified, and the award names the Certificate III in Engineering, Fabrication Trade, as a C10 qualification (Schedule A.3.1).",
      ],
    },
    {
      id: "workforce",
      heading: "How many boilermakers there are, and where they work",
      paragraphs: [
        "Jobs and Skills Australia counts boilermakers within unit group 3223, Structural Steel and Welding Trades Workers, which it describes as people who cut, shape, join and repair metal components of iron and steel structures, boilers, pressure vessels and pipes, ships and other vessels. The group had 79,100 people employed on the ABS Labour Force Survey's 2025 four-quarter average, with annual employment growth of about 1,100. It is almost entirely full-time and male: 96% work full-time hours, the part-time share is 4%, women are 1% of the workforce and the median age is 39. The average full-time week is 46 hours against 44 for all occupations, and the median hourly rate on the May 2025 Survey of Employee Earnings and Hours was $44, a dollar below the all-occupations $47.",
        "Three occupations make up the group: metal fabricators (322311), pressure welders (322312) and first-class welders (322313). Boilermaking sits with metal fabrication, which is why the $1,688 a week median above is for the whole group. The main industries are manufacturing, construction and mining, in that order, and the work is spread across New South Wales (23.1%), Queensland (23.0%) and Victoria (18.6%), with South Australia at 8.7%. Which of those industries employs you decides the award: the Manufacturing Award in a workshop, the Building and Construction General On-site Award for a boilermaker or structural steel tradesperson on a building site, and usually an enterprise agreement on a mine site or in shipbuilding.",
      ],
    },
  ],
  faqs: [
    {
      q: "Is a boilermaker the same as a structural steel tradesperson?",
      a: "Not under the Manufacturing Award, which defines each separately in Schedule B. A boilermaker fabricates, erects and repairs ships, boilers and pressure vessels from drawings or templates; a structural steel tradesperson assembles, plates, bolts and rivets tanks, water locks and towers and operates the punching, shearing, rolling and bending machines for that work. Both are trades in the fabrication stream and both are paid the C10 trade rate once qualified.",
    },
    {
      q: "How many boilermakers work in Australia?",
      a: "Jobs and Skills Australia does not count boilermakers separately. Its unit group 3223, Structural Steel and Welding Trades Workers, which covers metal fabricators, pressure welders and first-class welders, had 79,100 people employed on the 2025 four-quarter average of the ABS Labour Force Survey, 96% of them full-time, with a median age of 39 and main industries of manufacturing, construction and mining.",
    },
    {
      q: "What is the award rate for a boilermaker in 2026?",
      a: `A trade-qualified boilermaker is an Engineering/Manufacturing Tradesperson Level I (C10) under the Manufacturing Award: at least ${money(TRADE.hourly)} an hour or ${money(TRADE.weekly)} a week from the first full pay period on or after 1 July 2026, about $${Math.round(TRADE.weekly * 52).toLocaleString("en-AU")} a year before tax. Higher levels run up to ${money(ADV.hourly)} an hour at C5.`,
    },
    {
      q: "What is the casual rate for a boilermaker?",
      a: `A casual C10 tradesperson earns at least ${money(TRADE.casualHourly ?? 0)} an hour, the ${money(TRADE.hourly)} minimum plus the 25% casual loading. Casual penalty rates compound under this award, so a casual Saturday at 150% is paid on the casual rate, not the base rate.`,
    },
    {
      q: "Does the Manufacturing Award define a boilermaker?",
      a: "Yes. The award's definitions describe a boilermaker as a tradesperson who works from drawings or templates in the fabrication, erection and repair of steel or iron ships, boilers and pressure vessels, including incidental marking off, welding and oxy burning.",
    },
    {
      q: "Do boilermakers get tool and confined space allowances?",
      a: "Yes, under the award: a $17.90 a week tool allowance for tradespeople who supply their own tools, $1.12 an hour for work in confined spaces such as inside boilers and tanks, and $0.85 an hour for dirty work. A leading hand in charge of 3 to 10 employees gets $48.98 a week.",
    },
    {
      q: "What do boilermakers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,688 a week for structural steel and welding trades workers (ABS, May 2025), about $87,776 a year before tax. That group includes metal fabricators and welders, and it reflects the many people paid under enterprise agreements and with overtime.",
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
    { href: "/job-pay-rates/welder/", label: "Welder Pay Rates" },
    { href: "/construction-trades-pay/", label: "Construction & Trades Pay" },
  ],
};
