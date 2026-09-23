// Veterinarian — Animal Care and Veterinary Services Award 2020 [MA000118]
// (G3, wave 4). Keywords (DataForSEO, AU, 24 Sep 2026): vet salary 1,900,
// veterinarian salary australia 720, vet salary australia 720, salary
// veterinarian australia 720 — all KD 0.
//
// Source: awards.fairwork.gov.au/MA000118.html, "incorporates all amendments up
// to and including 1 July 2026 (PR799280, PR799398 and PR799553)". Read 24
// September 2026 (Firecrawl scrape).
//   - cl 15.3 Veterinary surgeons (varied by PR799398 ppc 01Jul26), minimum
//     annual salary / hourly: Level 1A $67,582 / $34.20; 1B $71,300 / $36.08;
//     Level 2 $77,032 / $38.98; Level 3 $84,628 / $42.83; Level 4 $95,593 /
//     $48.38. NOTE to cl 15.3: hourly = annual ÷ 52, rounded to the nearest
//     $0.10, ÷ 38. We store that rounded weekly figure; tests assert the chain.
//   - Schedule B.2.5 casual (125%): $42.75, $45.10, $48.73, $53.54, $60.48;
//     public holiday casual 225%. B.1.7 / cl 27.3: public holiday 200% for
//     full-time and part-time associates. No weekend penalty rates for
//     veterinary surgeons (cl 21 applies to "employees other than veterinary
//     surgeons").
//   - Schedule A.3: Level 1A is the commencement level for a graduate
//     veterinary surgeon, progressing to 1B within 6 months; 1B can expect to
//     reach Level 2 no later than 2 years after commencement.
//   - cl 20.2: time worked beyond 38 hours a week (except on call) is paid at
//     the ordinary time rate, or time off hour for hour if agreed; an agreed
//     allowance can replace it if not less.
//   - cl 16.3(a): on-call allowance at least $56.63 per period of on-call
//     duty (a new period each 24 hours); active on-call work paid at no less
//     than the hourly rate.
//   - cl 13.3(c): associates other than casuals should receive at least 3 full
//     days off per fortnight; untaken days paid out after 6 weeks.
//
// Median: Jobs and Skills Australia, ANZSCO 2347 Veterinarians, $2,413 a week
// / $64 an hour (ABS SEEH May 2025), read 24 September 2026.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  FWO_PAY_GUIDES,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation, RateRow } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2347",
  anzscoTitle: "Veterinarians",
  medianWeekly: 2_413,
  medianHourly: 64,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2347-veterinarians"),
};

/** Cl 15.3 NOTE: weekly = annual ÷ 52 rounded to the nearest $0.10. */
export function vetWeekly(annual: number): number {
  return Math.round((annual / 52) * 10) / 10;
}

function vet(label: string, annual: number, hourly: number, casualHourly: number, note?: string): RateRow {
  return { label, annual, weekly: vetWeekly(annual), hourly, casualHourly, ...(note ? { note } : {}) };
}

export const VETERINARIAN: Occupation = {
  slug: "veterinarian",
  name: "Veterinarian",
  plural: "veterinarians",
  metaTitle: "Vet Salary Australia 2026 — $34.20/hr Award Minimum",
  award: {
    name: "Animal Care and Veterinary Services Award 2020",
    code: "MA000118",
    url: awardTextUrl("MA000118"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "veterinary-surgeons",
    label: "Level 1A",
    why: "a graduate veterinary surgeon, who starts at Level 1A and moves to Level 1B within 6 months",
  },
  coverage: [
    "Veterinarians employed in the veterinary surgery industry are covered by the Animal Care and Veterinary Services Award 2020 [MA000118], which calls them veterinary surgeons (or associates) and sets annual salaries for them in clause 15.3.",
    "Level 1A is the commencement level for a graduate veterinary surgeon, working under supervision; the award requires progression to Level 1B no later than 6 months after starting, and a competent Level 1B associate can expect Level 2 within 2 years (Schedule A.3).",
    "Level 2 works without detailed supervision, Level 3 is an experienced vet handling more difficult work, and Level 4 is a senior vet with supervisory or practice management responsibilities.",
    "Vets employed by government, universities or under an enterprise agreement may be paid under other instruments. A vet working as a genuine contractor (locum on an ABN) has no award minimum.",
  ],
  tables: [
    {
      id: "veterinary-surgeons",
      title: "Vet pay rates by level, 2026–27",
      intro:
        "Annual salaries from clause 15.3. Weekly is annual ÷ 52 rounded to the nearest 10 cents, the award's own method; hourly and casual rates are exactly as the award and Schedule B.2.5 publish them.",
      rows: [
        vet("Level 1A", 67_582, 34.2, 42.75, "Graduate veterinary surgeon"),
        vet("Level 1B", 71_300, 36.08, 45.1, "Within 6 months of starting"),
        vet("Level 2", 77_032, 38.98, 48.73),
        vet("Level 3", 84_628, 42.83, 53.54, "Experienced veterinary surgeon"),
        vet("Level 4", 95_593, 48.38, 60.48, "Senior veterinary surgeon"),
      ],
    },
  ],
  penalties: [
    { when: "Public holiday", permanent: "200%", casual: "225%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (cl 27.3, Schedule B.1.7 and B.2.5). The award's weekend and evening penalty rates (cl 21) apply to employees other than veterinary surgeons, so vets have no Saturday or Sunday penalty under the award.",
  overtime: [
    "Time worked beyond 38 hours a week, other than on call, is paid at the ordinary time rate, or taken as time off hour for hour if you agree (cl 20.2(a)). There is no time and a half.",
    "An agreed allowance can replace payment for extra hours, but must not be less than what cl 20.2(a) would pay, and the agreement must be in writing (cl 20.2(b)–(c)).",
    "Full-time and part-time vets should get at least 3 full days off per fortnight; days off not given accumulate and must be paid out at the ordinary rate if not used within 6 weeks (cl 13.3(c)).",
  ],
  allowances: [
    { name: "On-call allowance", amount: "$56.63 per period of on-call duty", note: "A new period starts every 24 hours of continuous on-call; active on-call work is paid at no less than the hourly rate (cl 16.3(a))." },
  ],
  median: MEDIAN,
  notices: [
    "The award pays vets' overtime at the ordinary rate, not time and a half, and has no weekend penalty rates for veterinary surgeons. Check whether your contract or agreement pays more.",
  ],
  notShown: [
    "Veterinary nurse, receptionist, animal attendant and practice manager rates (cl 15.2), which are on a separate weekly scale.",
    "Animal care industry inspector rates (cl 15.1).",
    "Enterprise agreement and government veterinary officer scales.",
  ],
  faqs: [
    {
      q: "What is the minimum salary for a graduate vet in Australia?",
      a: "A graduate veterinary surgeon must be paid at least $67,582 a year ($34.20 an hour) at Level 1A under the Animal Care and Veterinary Services Award from the first full pay period on or after 1 July 2026. The award requires a move to Level 1B, $71,300, within 6 months.",
    },
    {
      q: "How much does an experienced vet earn under the award?",
      a: "Level 2 is $77,032 a year, Level 3 (experienced veterinary surgeon) $84,628 and Level 4 (senior veterinary surgeon) $95,593. These are minimums; most vets are paid more.",
    },
    {
      q: "Do vets get paid overtime?",
      a: "Yes, but at the ordinary rate. Hours beyond 38 a week, other than on call, are paid at the ordinary time rate or taken as time off hour for hour by agreement. The award has no time-and-a-half overtime for veterinary surgeons.",
    },
    {
      q: "Do vets get weekend penalty rates?",
      a: "Not under the award. Its weekend and evening penalties apply to employees other than veterinary surgeons. Vets get 200% of the minimum hourly rate for public holidays (225% for casuals), and an on-call allowance of at least $56.63 per period.",
    },
    {
      q: "What do vets actually earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,413 a week ($64 an hour) for veterinarians (ABS, May 2025), about $125,476 a year, well above the award minimum. Vets working full-time average 45 hours a week.",
    },
  ],
  sources: [
    { title: "Animal Care and Veterinary Services Award 2020 [MA000118] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000118") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: "24 September 2026",
  related: [
    { href: "/time-in-lieu/", label: "Time in Lieu (TOIL)" },
    { href: "/salary-vs-hourly/", label: "Salary vs Hourly" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
};

