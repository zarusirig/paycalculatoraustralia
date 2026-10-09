// Fitter and turner — Manufacturing and Associated Industries and Occupations
// Award 2020 [MA000010] (J8, 9 Oct 2026). Search demand: "fitter and turner
// salary" 390 a month (AU). Penalties, overtime and allowances are the shared
// Manufacturing Award blocks in metal-trades-common.ts.
//
// Award text re-read 9 October 2026 (awards.fairwork.gov.au/MA000010.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280 …)"):
//   - Schedule A.3.1 table: C10 "Engineering/Manufacturing Tradesperson—Level
//     I | Recognised Trade Certificate, or Certificate III in Engineering—
//     Mechanical Trade …"; C9 "C10 + 20% towards a Diploma of Engineering";
//     C8 "C10 + 40% towards a Diploma of Engineering"; C7 "Certificate IV in
//     Engineering, or C10 + 60% towards a Diploma of Engineering"; C6 Advanced
//     Engineering Tradesperson Level 1 "C10 + 80% towards a Diploma of
//     Engineering—Advanced Trade"; C5 Advanced Engineering Tradesperson Level
//     II "Diploma of Engineering—Advanced Trade".
//   - A.4.7–A.4.12 name the Mechanical stream at each of those levels
//     ("Engineering Tradesperson (Mechanical)— Level I" … "Advanced
//     Engineering Tradesperson (Mechanical)— Level II").
//   - Schedule B.6.3: "Classifications at Level V5: … Fitter and turner …".
//   Rates from MANUFACTURING_AWARD (cl 20.1(a)), the data /manufacturing-
//   award-rates/ renders.
//
// Other awards, second table:
//   - Mining Industry Award 2020 [MA000011], read 9 October 2026: cl 4.2(d)
//     covers "the servicing, maintaining (including mechanical, electrical,
//     fabricating or engineering) or repairing of plant and equipment" used in
//     mining "by employees principally employed to perform work on an ongoing
//     basis at a location where those activities are being performed".
//     Schedule A.3.4 Level 3—Competent: skills "acquired through the completion
//     of a trade certificate"; applies to Mining Industry Maintenance Trades
//     Employees. Schedule B.1.3 ordinary hourly $30.54 and B.2 casual $38.18,
//     both including the $41.41 all-purpose industry allowance (MINING_AWARD).
//   - Building and Construction General On-site Award 2020 [MA000020], read
//     9 October 2026: Schedule A CW/ECW3 lists "Fitter"; cl 21.1(a) tool
//     allowance for "tradespersons in the metals and engineering construction
//     sector" $21.59 a week, all purposes; cl 22.1(a) industry allowance $67.15.
//
// Median: Jobs and Skills Australia, ANZSCO 3232 Metal Fitters and Machinists,
// $2,606 a week / $60 an hour (ABS SEEH May 2025); the same profile reports
// 50 average full-time hours a week (2021 Census). Read 9 October 2026.

import { findAwardRate } from "../../constants/modern-awards";
import { MINING_AWARD } from "../../constants/modern-awards-oct2";
import { INDUSTRY_ALLOWANCE, buildingRow } from "./building-construction-common";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  awardTextUrl,
  casualFromHourly,
  jsaSource,
  jsaUrl,
} from "./common";
import { annual52, atPercent, money0, money2 } from "./j8-common";
import {
  METAL_ALLOWANCES,
  METAL_NOT_SHOWN,
  METAL_OVERTIME,
  METAL_PENALTIES,
  METAL_PENALTIES_NOTE,
  metalRow,
} from "./metal-trades-common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const FITTER_MEDIAN: MedianEarnings = {
  anzscoCode: "3232",
  anzscoTitle: "Metal Fitters and Machinists",
  medianWeekly: 2_606,
  medianHourly: 60,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("3232-metal-fitters-and-machinists"),
};

/** cl 21.1(a) MA000020: tool allowance for tradespersons in the metals and engineering construction sector. */
const ENGINEERING_CONSTRUCTION_TOOL_ALLOWANCE = 21.59;

export const FT_C10 = metalRow("C10 / V5", "C10 — Engineering Tradesperson (Mechanical) Level I", "Trade certificate or Certificate III in Engineering — Mechanical Trade");
export const FT_C9 = metalRow("C9 / V6", "C9 — Engineering Tradesperson (Mechanical) Level II", "C10 + 20% towards a Diploma of Engineering");
export const FT_C8 = metalRow("C8 / V7", "C8 — Special Class Tradesperson (Mechanical) Level I", "C10 + 40% towards a Diploma of Engineering");
export const FT_C7 = metalRow("C7", "C7 — Special Class Tradesperson (Mechanical) Level II", "Certificate IV in Engineering, or C10 + 60% towards a Diploma");
export const FT_C6 = metalRow("C6 / V9", "C6 — Advanced Engineering Tradesperson (Mechanical) Level I", "C10 + 80% towards a Diploma of Engineering — Advanced Trade");
export const FT_C5 = metalRow("C5 / V10", "C5 — Advanced Engineering Tradesperson (Mechanical) Level II", "Diploma of Engineering — Advanced Trade");

const mining = findAwardRate(MINING_AWARD, "Level 3 (Competent)");
export const FT_MINING: RateRow = {
  label: "Mining Industry Award — Level 3 (Competent), maintenance trades",
  weekly: mining.weekly,
  hourly: mining.hourly,
  casualHourly: casualFromHourly(mining.hourly),
  note: "Trade certificate; includes the $41.41 all-purpose industry allowance",
};
export const FT_CONSTRUCTION = buildingRow(
  "Building and Construction Award — Fitter (CW/ECW 3)",
  "CW/ECW 3",
  [INDUSTRY_ALLOWANCE.general, ENGINEERING_CONSTRUCTION_TOOL_ALLOWANCE],
  "Metal and engineering construction; includes industry and tool allowances",
);

const CASUAL_SATURDAY = atPercent(FT_C10.casualHourly ?? 0, 1.5);

export const FITTER_AND_TURNER: Occupation = {
  slug: "fitter-and-turner",
  name: "Fitter and Turner",
  plural: "fitters and turners",
  metaTitle: `Fitter and Turner Salary Australia 2026 — ${money2(FT_C10.hourly)}/hr Award`,
  award: {
    name: "Manufacturing and Associated Industries and Occupations Award 2020",
    code: "MA000010",
    url: awardTextUrl("MA000010"),
    consolidatedTo: CONSOLIDATED_TO,
    awardPageHref: "/manufacturing-award-rates/",
  },
  headline: {
    tableId: "fitter-and-turner",
    label: FT_C10.label,
    why: "a trade-qualified fitter and turner (Certificate III in Engineering — Mechanical Trade), paid the award's C10 trade rate",
  },
  coverage: [
    "Fitters and turners employed in manufacturing and engineering workshops are covered by the Manufacturing and Associated Industries and Occupations Award 2020 [MA000010]. A tradesperson with a trade certificate or a Certificate III in Engineering — Mechanical Trade is an Engineering Tradesperson (Mechanical) Level I at wage group C10, the award's trade rate (Schedule A.3.1, A.4.7). The award's vehicle manufacturing stream lists \"Fitter and turner\" by name at Level V5, which is paid the same as C10 (Schedule B.6.3).",
    "Above C10 the mechanical trade has its own ladder, and each step is tied to post-trade study: C9 needs C10 plus 20% of a Diploma of Engineering, C8 40%, C7 a Certificate IV in Engineering or 60%, C6 (Advanced Engineering Tradesperson Level I) 80% of a Diploma of Engineering — Advanced Trade, and C5 the Diploma itself (Schedule A.3.1). The level depends on the training you hold and the work you are required to do, not on years of service.",
    "The employer's industry decides the award. The Mining Industry Award covers servicing and maintaining mining plant by employees principally working where the mining is done (cl 4.2(d)); a trade-qualified maintenance fitter there is at least Level 3—Competent (Schedule A.3.4). A fitter employed in the metal and engineering construction sector is under the Building and Construction General On-site Award, which lists Fitter at CW/ECW3. Both are in the second table.",
  ],
  tables: [
    {
      id: "fitter-and-turner",
      title: "Fitter and turner pay rates by classification, 2026–27",
      intro:
        "Manufacturing Award cl 20.1(a), from the first full pay period on or after 1 July 2026. Casual is the hourly rate plus the 25% loading (cl 11.1). The training shown is the minimum Schedule A.3.1 sets for each level.",
      rows: [FT_C10, FT_C9, FT_C8, FT_C7, FT_C6, FT_C5],
    },
    {
      id: "other-awards",
      title: "Fitter pay rates on mine sites and engineering construction, 2026–27",
      intro:
        "The same trade under the Mining Industry Award and the Building and Construction General On-site Award, from the first full pay period on or after 1 July 2026. Both rows are ordinary rates that already include the award's all-purpose allowances.",
      rows: [FT_MINING, FT_CONSTRUCTION],
    },
  ],
  penalties: METAL_PENALTIES,
  penaltiesNote: METAL_PENALTIES_NOTE,
  overtime: METAL_OVERTIME,
  allowances: METAL_ALLOWANCES,
  median: FITTER_MEDIAN,
  notices: [
    "Jobs and Skills Australia's $2,606 a week median is for all metal fitters and machinists, a group that includes mining maintenance fitters, and the same profile reports an average of 50 hours a week for full-time workers. It reflects overtime and enterprise agreements, not the award minimum.",
    "The penalty and overtime rules below are the Manufacturing Award's. A fitter on a mine site or a construction project follows that award's rules instead.",
  ],
  notShown: [
    ...METAL_NOT_SHOWN,
    "Mining Industry Award and Building and Construction Award penalty, overtime and allowance rules, which differ from the Manufacturing Award's.",
  ],
  faqs: [
    {
      q: "What is the award rate for a fitter and turner in 2026?",
      a: `A trade-qualified fitter and turner is an Engineering Tradesperson (Mechanical) Level I (C10) under the Manufacturing Award: at least ${money2(FT_C10.hourly)} an hour or ${money2(FT_C10.weekly)} a week from the first full pay period on or after 1 July 2026, about ${money0(annual52(FT_C10.weekly))} a year full-time before tax.`,
    },
    {
      q: "What is the casual rate for a fitter and turner?",
      a: `A casual C10 fitter and turner earns at least ${money2(FT_C10.casualHourly ?? 0)} an hour, the ${money2(FT_C10.hourly)} rate plus the 25% casual loading. Casual penalties compound under this award, so an agreed casual Saturday at 150% is paid on the casual rate: ${money2(CASUAL_SATURDAY)} an hour.`,
    },
    {
      q: "How does a fitter and turner move above the trade rate?",
      a: `By post-trade training the job uses. C9 (${money2(FT_C9.hourly)} an hour) needs C10 plus 20% of a Diploma of Engineering, C7 (${money2(FT_C7.hourly)}) a Certificate IV in Engineering or 60%, and C5 (${money2(FT_C5.hourly)}), Advanced Engineering Tradesperson Level II, the Diploma of Engineering — Advanced Trade (Schedule A.3.1).`,
    },
    {
      q: "What is a mine site fitter paid under the award?",
      a: `A trade-qualified maintenance fitter covered by the Mining Industry Award is at least Level 3—Competent: ${money2(FT_MINING.hourly)} an hour (${money2(FT_MINING.weekly)} a week), which includes the $41.41 a week industry allowance, or ${money2(FT_MINING.casualHourly ?? 0)} as a casual. Most large mines pay under enterprise agreements well above that.`,
    },
    {
      q: "What do fitters and turners actually earn?",
      a: `Jobs and Skills Australia reports median full-time earnings of $2,606 a week for metal fitters and machinists (ABS, May 2025), about ${money0(annual52(2_606))} a year before tax. Full-time workers in the group average 50 hours a week, so the median includes a lot of overtime and mining agreement pay.`,
    },
  ],
  sources: [
    { title: "Manufacturing and Associated Industries and Occupations Award 2020 [MA000010] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000010") },
    { title: "Mining Industry Award 2020 [MA000011] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000011") },
    { title: "Building and Construction General On-site Award 2020 [MA000020] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000020") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(FITTER_MEDIAN),
  ],
  verifiedOn: "9 October 2026",
  related: [
    { href: "/manufacturing-award-rates/", label: "Manufacturing Award Rates" },
    { href: "/mining-award-rates/", label: "Mining Award Rates" },
    { href: "/job-pay-rates/boilermaker/", label: "Boilermaker Pay Rates" },
    { href: "/fifo-pay-calculator/", label: "FIFO Pay Calculator" },
  ],
};
