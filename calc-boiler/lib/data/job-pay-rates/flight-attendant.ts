// Flight attendant — Aircraft Cabin Crew Award 2020 [MA000047] (F4, 5 Oct 2026).
//
// Read from the consolidated award text on awards.fairwork.gov.au on 5 October
// 2026 ("incorporates all amendments up to and including 1 July 2026 (PR799327
// and PR799484)"):
//   cl 14.2 — Cabin crew member $1,097.40 a week / $28.88 an hour; Cabin crew
//     supervisor (narrow-bodied aircraft, 4 or more crew) $1,280.40 / $33.69;
//     Cabin crew manager (wide-bodied aircraft) $1,495.50 / $39.36.
//   Schedule D.1.1 — overtime for domestic and international flying is 200% of
//     the minimum hourly rate ($57.76, $67.38, $78.72) for time worked beyond
//     1,872 hours in a year or beyond the roster cycle maximum.
//   Schedule D.2.1 — casual ordinary rates $36.10, $42.11, $49.20 (125%).
//   cl 9 — a full-time employee is rostered between 1,716 and 1,872 hours a year.
//   cl 10.4 / 11.2 — part-time minimum 4 consecutive hours; casual minimum 4 hours.
//   cl 4.3(b) — the award does NOT cover employees who are covered by a modern
//     enterprise award or an enterprise instrument.
//   Schedule A.1.7 — domestic flying: a flying allowance of $18.40 per scheduled
//     block hour, in addition to the minimum weekly rate and instead of the DTA,
//     uniform, hose, shoe and MER allowances; the DTA component is $6.88 an hour.
//   Schedule B.2.9 / E.1.1 — regional flying: working on a designated day off
//     $153.09 a day.
//
// QANTAS AND VIRGIN: cabin crew at the major airlines are typically covered by
// enterprise agreements, which this award does not cover (cl 4.3(b)). We tried to
// verify current Qantas and Virgin Australia cabin crew agreement rates against
// primary sources (the Fair Work Commission's approved agreement text) on
// 5 October 2026 and could not, so NO agreement figure is published here.
//
// Jobs and Skills Australia publishes NO median for ANZSCO 451711 Flight
// Attendants (the profile prints N/A), so none is shown.

import { ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, awardTextUrl } from "./common";
import type { Occupation, RateRow } from "./types";

/** cl 14.2 and Schedule D.2.1 (casual ordinary), transcribed. */
const CREW: RateRow = { label: "Cabin crew member", weekly: 1097.4, hourly: 28.88, casualHourly: 36.1, note: "The flight attendant classification" };
const SUPERVISOR: RateRow = {
  label: "Cabin crew supervisor",
  weekly: 1280.4,
  hourly: 33.69,
  casualHourly: 42.11,
  note: "Narrow-bodied aircraft, 4 or more crew",
};
const MANAGER: RateRow = { label: "Cabin crew manager", weekly: 1495.5, hourly: 39.36, casualHourly: 49.2, note: "Wide-bodied aircraft" };

const money = (x: number) => `$${x.toFixed(2)}`;

export const FLIGHT_ATTENDANT: Occupation = {
  slug: "flight-attendant",
  name: "Flight Attendant",
  plural: "flight attendants",
  award: {
    name: "Aircraft Cabin Crew Award 2020",
    code: "MA000047",
    url: awardTextUrl("MA000047"),
    consolidatedTo: "1 July 2026",
  },
  headline: {
    tableId: "cabin-crew",
    label: "Cabin crew member",
    why: "a flight attendant, the award's only non-supervisory cabin crew classification",
  },
  coverage: [
    "Flight attendants (cabin crew) are covered by the Aircraft Cabin Crew Award 2020 [MA000047], which covers employers of aircraft cabin crew throughout Australia. It has three classifications: cabin crew member, cabin crew supervisor on narrow-bodied aircraft with 4 or more crew, and cabin crew manager on wide-bodied aircraft.",
    "Where an enterprise agreement applies to a cabin crew member, its terms apply instead of the award, and the agreement has to leave employees better off overall than the award. Cabin crew at the major airlines are generally employed under enterprise agreements. We could not verify the current Qantas or Virgin Australia agreement rates against the Fair Work Commission's approved text, so we do not publish them here.",
    "The award is the minimum for cabin crew whose employer has no agreement, and the benchmark an agreement has to beat overall. Domestic crew also get a flying allowance for each scheduled block hour on top of the weekly rate.",
  ],
  tables: [
    {
      id: "cabin-crew",
      title: "Flight attendant pay rates — Aircraft Cabin Crew Award, 2026–27",
      intro:
        "Aircraft Cabin Crew Award cl 14.2, from the first full pay period on or after 1 July 2026. Casual rates are the award's Schedule D.2.1 ordinary rates (125% of the minimum hourly rate). These rates exclude the flying allowance and other allowances below.",
      rows: [CREW, SUPERVISOR, MANAGER],
    },
  ],
  penalties: [
    { when: "Ordinary hours (rostered, any day)", permanent: "100%", casual: "125%" },
    { when: "Overtime: hours beyond 1,872 a year or the roster cycle maximum (domestic and international flying)", permanent: "200%", casual: "—" },
  ],
  penaltiesNote:
    "Schedule D lists ordinary rates and overtime only, with no separate weekend or public holiday percentage for cabin crew. Overtime applies to time worked beyond 1,872 hours in a year or beyond the crew member's roster cycle maximum, at 100% additional to the minimum hourly rate. Schedule D publishes no casual overtime rate.",
  overtime: [
    "Domestic and international flying: time worked in excess of 1,872 hours in a year, or beyond the roster cycle maximum, is paid at a penalty of 100% additional to the minimum hourly rate (Schedules A.6.1 and C.6.1), which is $57.76 an hour for a cabin crew member.",
    "Full-time cabin crew are rostered between 1,716 and 1,872 hours a year (cl 9), so the 38-hour week used to convert the weekly rate to hourly is a pay convention, not the rostered week.",
    "Part-time cabin crew must be rostered for at least 4 consecutive hours a shift (cl 10.4), and a casual cabin crew member has a minimum payment of 4 hours (cl 11.2).",
  ],
  allowances: [
    {
      name: "Flying allowance (domestic flying)",
      amount: "$18.40 per scheduled block hour",
      note: "In addition to the minimum weekly rate, for crew whose rostered flying is predominantly domestic. It is instead of the daily travelling allowance, uniform and grooming, hose, shoe and miscellaneous expense allowances; the meals and incidentals component is $6.88 an hour at June 2026 (Schedule A.1.7).",
    },
    { name: "Working on a designated day off (regional flying)", amount: "$153.09 per day", note: "Regional flying (Schedule B.2.9(a)(ii), Schedule E.1.1)." },
  ],
  median: null,
  notices: [
    "Jobs and Skills Australia publishes no median earnings figure for flight attendants (the profile is marked N/A), and we have not verified current airline enterprise agreement rates, so this page shows the award minimum only. Real pay at the major airlines is set by their agreements and depends on base, aircraft type, hours flown and allowances.",
    "The annual figure on this page is the weekly rate times 52 and excludes allowances. Cabin crew are rostered 1,716 to 1,872 hours a year, and the domestic flying allowance is paid on top for each scheduled block hour.",
  ],
  notShown: [
    "Qantas, Jetstar and Virgin Australia cabin crew agreement rates, which we could not verify against the approved agreements.",
    "International flying and regional flying allowances beyond those listed, and hours-of-work and duty limits in Schedules A to C.",
  ],
  faqs: [
    {
      q: "What is the award rate for a flight attendant in 2026?",
      a: `A cabin crew member under the Aircraft Cabin Crew Award is paid at least ${money(CREW.hourly)} an hour or ${money(CREW.weekly)} a week from the first full pay period on or after 1 July 2026, about $${Math.round(CREW.weekly * 52).toLocaleString("en-AU")} a year before tax and before allowances. A cabin crew supervisor is paid at least ${money(SUPERVISOR.hourly)} an hour and a cabin crew manager on a wide-bodied aircraft ${money(MANAGER.hourly)}.`,
    },
    {
      q: "How much do Qantas and Virgin flight attendants earn?",
      a: "Cabin crew at the major airlines are generally paid under enterprise agreements, which apply instead of the award. We could not verify the current Qantas or Virgin Australia agreement rates against the Fair Work Commission's approved agreement text, so we do not publish a figure. The award rate on this page is the floor for cabin crew without an agreement.",
    },
    {
      q: "Do flight attendants get paid extra for flying?",
      a: "Under the award, domestic cabin crew receive a flying allowance of $18.40 for every scheduled block hour, in addition to the weekly rate. It is paid instead of the daily travelling, uniform and several other expense allowances. In the award's own example, about 90 block hours in a roster period adds roughly $1,656 a month.",
    },
    {
      q: "What is the casual rate for a flight attendant?",
      a: `A casual cabin crew member is paid at least ${money(CREW.casualHourly ?? 0)} an hour, which is the ${money(CREW.hourly)} minimum plus the 25% casual loading, with a minimum payment of 4 hours.`,
    },
    {
      q: "Is a flight attendant's weekly rate based on a 38-hour week?",
      a: "The award states a minimum weekly rate and an hourly rate, and the hourly rate is the weekly rate divided by 38. Full-time cabin crew, however, are rostered between 1,716 and 1,872 hours a year under clause 9, so the rostered week does not follow the usual 38 hours.",
    },
  ],
  sources: [
    { title: "Aircraft Cabin Crew Award 2020 [MA000047] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000047") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
  ],
  verifiedOn: "5 October 2026",
  related: [
    { href: "/pilot-salary/", label: "Pilot Salary" },
    { href: "/air-traffic-controller-salary/", label: "Air Traffic Controller Salary" },
    { href: "/enterprise-agreement/", label: "Enterprise Agreements Explained" },
  ],
};
