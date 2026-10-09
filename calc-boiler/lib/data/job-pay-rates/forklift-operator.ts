// Forklift operator — Storage Services and Wholesale Award 2020 [MA000084]
// (F4, 5 Oct 2026).
//
// Read from the consolidated award text on awards.fairwork.gov.au on 5 October
// 2026 ("incorporates all amendments up to and including 1 July 2026
// (PR799280, PR799364 and PR799519)"):
//   cl 15.1 minimum rates — Storeworker grade 1 on commencement $1,029.10 /
//     $27.08, after 3 months $1,041.60 / $27.41, after 12 months $1,053.50 /
//     $27.72, grade 2 $1,062.80 / $27.97, grade 3 $1,093.10 / $28.77, grade 4
//     $1,125.30 / $29.61 (Wholesale employee levels 1 to 4 are the same dollars).
//   Schedule A.6.2 — Wholesale employee level 2 indicative job titles include
//     "Fork-lift operator" and "Ride-on equipment operator".
//   Schedule A.2.2(e)(i) — Storeworker grade 2: "licensed operation of all
//     appropriate materials handling equipment". A.3.2(f)(ii) — grade 3:
//     "operation of all materials handling equipment under licence".
//   Schedule B.1.1 / B.2.1 — day-worker penalty rates and the casual column
//     (casual ordinary $34.96 at grade 2, $35.96 at grade 3, $37.01 at grade 4).
//   cl 13.1 — day workers' ordinary hours 7.00 am to 5.30 pm Monday to Friday.
//   cl 21.1(b), (d) — overtime 150% for 2 hours then 200%; casual 175% / 225%.
//   cl 11.1 — a casual is guaranteed at least 4 hours each start.
//   Schedule C.1.1 — first aid allowance $16.88 a week; cold-room allowances.
//
// Other awards that grade forklift work, shown in a second table:
//   Retail Employee Level 2 (General Retail Industry Award, A.2: "forklift and
//     ride-on equipment operators" — see retail-worker.ts);
//   Manufacturing C12 (A.5.3: "operation of mobile equipment including
//     fork-lifts") and C11 (A.5.4: "licensed and certified for fork-lift …
//     operations to a level higher than level C12");
//   Road Transport Transport Worker Grade 3 (forklift up to 5 t — see
//     truck-driver.ts).
//
// Median: Jobs and Skills Australia, ANZSCO 7213 Forklift Drivers, $1,340 a
// week / $35 an hour (ABS SEEH May 2025), read 5 October 2026.

import { MANUFACTURING_AWARD } from "../../constants/modern-awards";
import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  awardTextUrl,
  jsaSource,
  jsaUrl,
  rowFromModernAward,
} from "./common";
import { retailRow } from "./retail-worker";
import { annual52, money0, takeHomeWeekly } from "./j8-common";
import type { MedianEarnings, Occupation, OccupationSection, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "7213",
  anzscoTitle: "Forklift Drivers",
  medianWeekly: 1_340,
  medianHourly: 35,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("7213-forklift-drivers"),
};

/** cl 15.1 / Schedule B.2.1, transcribed. Casual figures are the award's own Schedule B.2.1 column. */
function storeRow(label: string, weekly: number, hourly: number, casualHourly: number, note?: string): RateRow {
  return { label, weekly, hourly, casualHourly, ...(note ? { note } : {}) };
}

const GRADE_2 = storeRow("Storeworker grade 2", 1062.8, 27.97, 34.96, "Licensed forklift and ride-on equipment operator (Wholesale employee level 2)");
const GRADE_3 = storeRow("Storeworker grade 3", 1093.1, 28.77, 35.96, "Operation of all materials handling equipment under licence; supervising up to 10");
const GRADE_4 = storeRow("Storeworker grade 4", 1125.3, 29.61, 37.01, "Warehouse or large section; leading hand over 10 storeworkers");

const money = (x: number) => `$${x.toFixed(2)}`;

// J8 (9 Oct 2026): "forklift driver salary" (480 a month) is answered on this
// page. Rows are GRADE_2 to GRADE_4 above and the Road Transport Grade 3 row in
// the second table; annual is weekly x 52 and take-home is the site's tax
// engine (j8-common.ts).
const TRANSPORT_GRADE_3 = { hourly: 27.83, weekly: 1057.6 };

function driverRow(label: string, r: { hourly: number; weekly: number }): string[] {
  const annual = annual52(r.weekly);
  return [label, money(r.hourly), money(r.weekly), money0(annual), money0(takeHomeWeekly(annual))];
}

const FORKLIFT_DRIVER_SECTION: OccupationSection = {
  id: "forklift-driver-pay",
  heading: "Forklift driver pay per year and after tax",
  paragraphs: [
    "Forklift driver and forklift operator are the same job as far as the award is concerned: the classification turns on licensed operation of materials handling equipment, not the job title. These are the full-time minimums turned into a yearly figure and an after-tax weekly amount, so you can compare them with what lands in your account.",
    "Jobs and Skills Australia's median for forklift drivers is $1,340 a week before tax (ABS, May 2025), above every award grade here, because many distribution centres pay under enterprise agreements and drivers often work overtime.",
  ],
  table: {
    caption: "Forklift driver minimum pay per year and take-home, 2026–27",
    head: ["Classification", "Hourly", "Weekly", "Annual", "Take-home a week"],
    rows: [
      driverRow("Road Transport — Transport Worker Grade 3", TRANSPORT_GRADE_3),
      driverRow("Storeworker grade 2 (licensed forklift driver)", GRADE_2),
      driverRow("Storeworker grade 3", GRADE_3),
      driverRow("Storeworker grade 4", GRADE_4),
    ],
    note: "Full-time minimums from the first full pay period on or after 1 July 2026. Annual is weekly x 52. Take-home uses 2026–27 resident tax rates, the low income tax offset and the 2% Medicare levy, with no HECS.",
  },
};

export const FORKLIFT_OPERATOR: Occupation = {
  slug: "forklift-operator",
  name: "Forklift Operator",
  plural: "forklift operators",
  award: {
    name: "Storage Services and Wholesale Award 2020",
    code: "MA000084",
    url: awardTextUrl("MA000084"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "storage",
    label: "Storeworker grade 2",
    why: "a licensed forklift operator in a warehouse or wholesale business, the award's own Wholesale employee level 2 job title",
  },
  coverage: [
    "Forklift operators in warehouses, distribution centres and wholesale businesses are usually covered by the Storage Services and Wholesale Award 2020 [MA000084]. The award covers the receiving, handling, storing, packing, sorting, loading and dispatch of goods in the storage services and wholesale industry.",
    "A licensed forklift or ride-on equipment operator is a Storeworker grade 2 (the award's Schedule A lists forklift operator as an indicative job title for the equivalent Wholesale employee level 2). Grade 3 covers operation of all materials handling equipment under licence and supervision of up to 10 employees; grade 4 covers responsibility for a warehouse or large section.",
    "Which award applies depends on the employer's industry, not the machine. A forklift driver in a shop is Retail Employee Level 2, in a factory is generally C12 or C11 under the Manufacturing Award, and in a transport business may be a Transport Worker Grade 3 under the Road Transport Award. Those rates are in the second table.",
  ],
  tables: [
    {
      id: "storage",
      title: "Forklift operator pay rates — Storage Services and Wholesale Award, 2026–27",
      intro:
        "Storage Services and Wholesale Award cl 15.1, from the first full pay period on or after 1 July 2026. Casual rates are the award's Schedule B.2.1 column: the hourly rate plus the 25% casual loading (cl 11.2). Grade 1 is entry level; a licensed forklift operator starts at grade 2.",
      rows: [
        storeRow("Storeworker grade 1 — on commencement", 1029.1, 27.08, 33.85, "Entry level"),
        storeRow("Storeworker grade 1 — after 3 months", 1041.6, 27.41, 34.26),
        storeRow("Storeworker grade 1 — after 12 months", 1053.5, 27.72, 34.65),
        GRADE_2,
        GRADE_3,
        GRADE_4,
      ],
    },
    {
      id: "other-awards",
      title: "Forklift operator pay rates — retail, manufacturing and transport awards",
      intro:
        "The same job under other awards, from the first full pay period on or after 1 July 2026. Retail and Manufacturing from the shared award data on this site; Transport Worker Grade 3 from the Road Transport and Distribution Award.",
      rows: [
        rowFromModernAward(MANUFACTURING_AWARD, "C12 / V3", "Manufacturing C12 — Employee Level III", "Operation of mobile equipment including fork-lifts"),
        storeRow("Road Transport — Transport Worker Grade 3", TRANSPORT_GRADE_3.weekly, TRANSPORT_GRADE_3.hourly, 34.79, "Forklift up to 5 tonnes"),
        rowFromModernAward(MANUFACTURING_AWARD, "C11 / V4", "Manufacturing C11 — Employee Level IV", "Licensed and certified above C12 level"),
        retailRow("Level 2", "Forklift or ride-on equipment operator"),
      ],
    },
  ],
  penalties: [
    { when: "Monday–Friday, 7 am–5:30 pm (ordinary hours)", permanent: "100%", casual: "125%" },
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  penaltiesNote:
    "Day workers, from the award's Schedule B.1.1 and B.2.1: percentages of the minimum hourly rate, with the casual percentages including the 25% loading. Shiftworkers have separate loadings: 112.5% early morning, 115% afternoon and 130% night for full-time and part-time employees (Schedule B.1.2).",
  overtime: [
    "Full-time and part-time: 150% of the minimum hourly rate for the first 2 hours, then 200% (cl 21.1(b)). Sunday overtime is 200% and public holiday overtime 250%.",
    "Casual: 175% for the first 2 hours, then 225% (cl 21.1(d)), because the 25% casual loading is added to the overtime percentages.",
    "A casual is guaranteed at least 4 hours' engagement each time they start (cl 11.1). A part-time employee must be rostered for at least 3 consecutive hours a shift (cl 10.5).",
  ],
  allowances: [
    { name: "First aid allowance", amount: "$16.88 per week", note: "1.5% of the standard rate, for employees appointed to give first aid (cl 17.2(a)(i))." },
    { name: "Cold temperatures allowance", amount: "$1.13 to $2.25 per hour", note: "Working in cold stores from -15.6°C down to below -23.3°C, by temperature band (cl 17.2(b))." },
  ],
  median: MEDIAN,
  notices: [
    "Employers can pay more than the award, and many large distribution centres pay under enterprise agreements. The Jobs and Skills Australia median shows what forklift drivers actually earn.",
    "Junior rates under this award apply as a percentage of Storeworker grade 1 or Wholesale employee level 1 (cl 15.2): 40% under 16, 50% at 16, 60% at 17 and 70% at 18, with the adult rate from 19.",
  ],
  notShown: [
    "Shiftworker rates in dollars, junior rates in dollars, and trainee rates.",
    "Rates under enterprise agreements at individual distribution centres.",
    "Licence costs and the High Risk Work Licence rules, which are a work health and safety matter, not a pay matter.",
  ],
  sections: [FORKLIFT_DRIVER_SECTION],
  faqs: [
    {
      q: "What is the award rate for a forklift operator in 2026?",
      a: `A licensed forklift operator in a warehouse or wholesale business is a Storeworker grade 2 under the Storage Services and Wholesale Award: at least ${money(GRADE_2.hourly)} an hour or ${money(GRADE_2.weekly)} a week from the first full pay period on or after 1 July 2026, about $${Math.round(GRADE_2.weekly * 52).toLocaleString("en-AU")} a year before tax. Grade 3 is ${money(GRADE_3.hourly)} an hour and grade 4 is ${money(GRADE_4.hourly)}.`,
    },
    {
      q: "What is the casual rate for a forklift operator?",
      a: `A casual grade 2 forklift operator earns at least ${money(GRADE_2.casualHourly ?? 0)} an hour, the ${money(GRADE_2.hourly)} rate plus the 25% casual loading. On Saturday it is $48.95 an hour, on Sunday $62.93 and on a public holiday $76.92, and a casual must be engaged for at least 4 hours each start.`,
    },
    {
      q: "What do forklift operators get paid on weekends?",
      a: `Full-time and part-time grade 2 forklift operators get 150% on Saturday ($41.96 an hour), 200% on Sunday ($55.94) and 250% on a public holiday ($69.93) under the Storage Services and Wholesale Award. Casuals get 175%, 225% and 275% of the minimum hourly rate.`,
    },
    {
      q: "Is the forklift operator rate the same in retail and manufacturing?",
      a: `No. The rate depends on the award that covers the employer. A forklift operator in a shop is Retail Employee Level 2 (${money(retailRow("Level 2").hourly)} an hour), in a factory generally Manufacturing C12 or C11, and in a transport business a Transport Worker Grade 3. The second table shows each.`,
    },
    {
      q: "How much does a forklift driver earn a year?",
      a: `On the award minimum, a full-time licensed forklift driver in a warehouse (Storeworker grade 2) earns ${money0(annual52(GRADE_2.weekly))} a year before tax and takes home about ${money0(takeHomeWeekly(annual52(GRADE_2.weekly)))} a week. At grade 4 it is ${money0(annual52(GRADE_4.weekly))} a year. Overtime, shift loadings and enterprise agreements lift what many drivers actually earn.`,
    },
    {
      q: "What do forklift operators actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,340 a week for forklift drivers (ABS Survey of Employee Earnings and Hours, May 2025), about $69,680 a year before tax, which includes overtime and agreement rates above the award.",
    },
  ],
  sources: [
    { title: "Storage Services and Wholesale Award 2020 [MA000084] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000084") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: "5 October 2026",
  related: [
    { href: "/job-pay-rates/truck-driver/", label: "Truck Driver Pay Rates" },
    { href: "/job-pay-rates/retail-worker/", label: "Retail Worker Pay Rates" },
    { href: "/manufacturing-award-rates/", label: "Manufacturing Award Rates" },
  ],
};
