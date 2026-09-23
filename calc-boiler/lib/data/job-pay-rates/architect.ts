// Architect — Architects Award 2020 [MA000079] (G3, wave 4).
// Keywords (DataForSEO, AU, 24 Sep 2026): architect salary 2,400, architectural
// salary 2,400, architect and salary 2,400, architect salary australia 390 —
// all KD 0.
//
// Source: awards.fairwork.gov.au/MA000079.html, "incorporates all amendments up
// to and including 1 July 2026 (PR799359 and PR799514)". Read 24 September
// 2026 (Firecrawl scrape).
//   - cl 13.1 minimum rates (annual / weekly / hourly): Graduate of
//     Architecture Entry $68,191 / $1,307.20 / $34.40; 1st pay point $71,798 /
//     $1,376.30 / $36.22; 2nd $75,401 / $1,445.40 / $38.04; Level 2(a)
//     Experienced Graduate $78,838 / $1,511.30 / $39.77; Level 2(b) Registered
//     Architect Entry $78,838 / $1,511.30 / $39.77; 1st $81,276 / $1,558.00 /
//     $41.00; 2nd $83,716 / $1,604.80 / $42.23. Weekly = annual × 6 / 313
//     (cl 13.2(a)).
//   - Schedule B.2 casual (125%): $43.00, $45.28, $47.55, $49.71, $49.71,
//     $51.25, $52.79.
//   - cl 4.2: "Architect means an employee registered as an architect under
//     any Australian legislation." cl 13.3–13.4: annual review and progression.
//   - cl 17.1: all time worked in excess of or outside the spread of ordinary
//     hours paid at 150% of the minimum hourly rate (or another agreed
//     arrangement that is fair and recorded); cl 23.3: all public holiday work
//     is overtime. cl 10.2: the casual loading isn't paid for overtime hours.
//     cl 17.3: time off instead of overtime equals the overtime payment
//     (2 hours at 150% = 3 hours off). Schedule C.1: no wage-related allowances.
//
// Median: Jobs and Skills Australia, ANZSCO 2321 Architects and Landscape
// Architects, $2,308 a week / $61 an hour (ABS SEEH May 2025), read 24 Sep 2026.

import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, awardTextUrl, jsaSource, jsaUrl } from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2321",
  anzscoTitle: "Architects and Landscape Architects",
  medianWeekly: 2_308,
  medianHourly: 61,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2321-architects-and-landscape-architects"),
};

function arch(label: string, annual: number, weekly: number, hourly: number, casualHourly: number, note?: string): RateRow {
  return { label, annual, weekly, hourly, casualHourly, ...(note ? { note } : {}) };
}

export const ARCHITECT: Occupation = {
  slug: "architect",
  name: "Architect",
  plural: "architects",
  metaTitle: "Architect Salary Australia 2026 — $39.77/hr Award Minimum",
  award: {
    name: "Architects Award 2020",
    code: "MA000079",
    url: awardTextUrl("MA000079"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "architects",
    label: "Level 2(b) Registered Architect — Entry",
    why: "a newly registered architect; in the award, \"architect\" means an employee registered as an architect (cl 4.2). Graduates of architecture who are not yet registered start lower, at $34.40 an hour",
  },
  coverage: [
    "Architects and graduates of architecture employed by architectural practices and other employers of architects are covered by the Architects Award 2020 [MA000079], an occupational award that applies whatever industry the employer is in.",
    "Under the award, an architect is an employee registered as an architect under Australian legislation. Before registration you are a Graduate of Architecture (Level 1, entry to 2nd pay point), then an Experienced Graduate of Architecture (Level 2(a)). A Registered Architect enters Level 2(b) and moves up two pay points as they show the National Competency Standards in Architecture.",
    "Employers must run an annual review of a graduate's progress towards registration, and confirm progression to the next pay point in writing once the objectives are reasonably met (cl 13.3).",
    "The award sets annual salaries; the weekly rate is annual × 6 ÷ 313 (cl 13.2), which clause 13.1 prints to the nearest 10 cents. Most architects are paid a contract salary above these figures, but an award-covered employee can't be paid less.",
  ],
  tables: [
    {
      id: "architects",
      title: "Architect pay rates by level, 2026–27",
      intro: "Annual, weekly and hourly minimums exactly as clause 13.1 publishes them; casual rates from Schedule B.2 (hourly rate plus 25%).",
      rows: [
        arch("Level 1 Graduate of Architecture — Entry", 68_191, 1307.2, 34.4, 43.0, "Graduate, not yet registered"),
        arch("Level 1 Graduate of Architecture — 1st pay point", 71_798, 1376.3, 36.22, 45.28),
        arch("Level 1 Graduate of Architecture — 2nd pay point", 75_401, 1445.4, 38.04, 47.55),
        arch("Level 2(a) Experienced Graduate of Architecture", 78_838, 1511.3, 39.77, 49.71),
        arch("Level 2(b) Registered Architect — Entry", 78_838, 1511.3, 39.77, 49.71, "Newly registered architect"),
        arch("Level 2(b) Registered Architect — 1st pay point", 81_276, 1558.0, 41.0, 51.25),
        arch("Level 2(b) Registered Architect — 2nd pay point", 83_716, 1604.8, 42.23, 52.79),
      ],
    },
  ],
  penalties: [
    { when: "Overtime, including all work on a public holiday", permanent: "150%", casual: "No casual loading on overtime (cl 10.2)" },
  ],
  penaltiesNote:
    "The Architects Award has no weekend or evening penalty rates. Work outside or beyond ordinary hours, and all public holiday work, is overtime (cl 17.1, 23.3).",
  overtime: [
    "All time worked in excess of or outside the spread of ordinary hours is paid at 150% of the minimum hourly rate, or under another agreed arrangement that doesn't avoid award obligations, isn't unfair to you and is recorded (cl 17.1).",
    "Time off instead of overtime pay must equal the overtime payment: 2 hours at 150% buys 3 hours off, taken within 6 months (cl 17.3).",
    "Casuals aren't paid the 25% loading on overtime hours (cl 10.2).",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Graduates of architecture get paid leave to study for and sit the Architectural Practice Examination (cl 13.6).",
  ],
  notShown: [
    "Student of Architecture rates (cl 13.5), which are percentages of the graduate entry rate by years of service.",
    "Enterprise agreement and public sector architect scales.",
  ],
  faqs: [
    {
      q: "What is the minimum salary for an architect in Australia?",
      a: "A newly registered architect must be paid at least $78,838 a year ($39.77 an hour) under the Architects Award from the first full pay period on or after 1 July 2026, rising to $83,716 at the 2nd pay point. A graduate of architecture who isn't yet registered starts at $68,191.",
    },
    {
      q: "How much does a graduate architect earn?",
      a: "A Graduate of Architecture starts at $68,191 a year ($34.40 an hour), then $71,798 and $75,401 at the 1st and 2nd pay points. An Experienced Graduate of Architecture is $78,838.",
    },
    {
      q: "Do architects get paid overtime?",
      a: "Yes. The award requires all time worked beyond or outside ordinary hours to be paid at 150% of the minimum hourly rate, unless another fair arrangement is agreed and recorded. Public holiday work counts as overtime.",
    },
    {
      q: "What is the casual rate for an architect?",
      a: "A casual registered architect at entry level earns at least $49.71 an hour, and a casual graduate of architecture $43.00, including the 25% casual loading (Schedule B.2).",
    },
    {
      q: "What do architects actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,308 a week ($61 an hour) for architects and landscape architects (ABS, May 2025), about $120,016 a year, well above the award minimum.",
    },
  ],
  sources: [
    { title: "Architects Award 2020 [MA000079] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000079") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: "24 September 2026",
  related: [
    { href: "/job-pay-rates/engineer/", label: "Engineer Pay Rates" },
    { href: "/time-in-lieu/", label: "Time in Lieu (TOIL)" },
    { href: "/salary-vs-hourly/", label: "Salary vs Hourly" },
  ],
};
