// Guzman y Gomez (GYG) — crew in GYG restaurants, corporate and franchised.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Rates, juniors,
// penalties and overtime are imported from subway.ts.
//
// Coverage evidence (researched 24 September 2026) — STRONG:
//   - FWC terminated-agreements list: "Guzman Y Gomez Enterprise Agreement
//     2012" (AE898010) terminated under s 225 (AG2018/1449), order PR608308
//     signed 21 June 2018, termination date 15 November 2018.
//   - Franchise Executives, 11 Nov 2018: GYG withdrew its application to
//     approve a replacement agreement, "meaning that all workers employed by
//     the business will now move on to the award".
//   - FWC approved-agreement lists 2016 – 21 Sep 2026: no GYG agreement since.
//   - Limit: a franchisee agreement registered under a company name without
//     "Guzman" in the title would not show in a title search — stated on page.

import type { EmployerPay } from "./types";
import { SUBWAY_PAY } from "./subway";

const TERMINATED_URL = "https://www.fwc.gov.au/documents/agreements/resources/terminated_agreements_list.xlsx";

export const GUZMAN_Y_GOMEZ_PAY: EmployerPay = {
  ...SUBWAY_PAY,
  slug: "guzman-y-gomez",
  name: "Guzman y Gomez",
  employerEntity: "Guzman y Gomez for corporate restaurants, or the franchisee that owns your restaurant",
  industry: "fast food",
  instrument: {
    ...SUBWAY_PAY.instrument,
    coverage:
      "GYG crew are paid under the Fast Food Industry Award. GYG's old 2012 enterprise agreement was terminated by the Fair Work Commission with effect from 15 November 2018, GYG withdrew the replacement it had proposed, and we found no GYG agreement approved since.",
  },
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Crew aged 18 to 20 who have worked for their employer for more than 6 months move up: 18-year-olds from 70% to 75%, 19-year-olds from 80% to 85%, and 20-year-olds from 90% to 95% of the adult rate (determination PR813654). At Level 1 that is $20.86, $23.64 and $26.42 an hour. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "24 September 2026",
  rates: SUBWAY_PAY.rates.map((r, i) =>
    i === 0
      ? { ...r, description: "Crew: front counter, kitchen and drive-through — taking orders, preparing and serving food, and incidental cleaning" }
      : r,
  ),
  notices: [
    "These are the Fast Food Industry Award minimums, which apply to GYG crew in corporate and franchised restaurants. Some restaurants may pay more.",
    "If you work in a franchised restaurant, your employer is the franchisee. If that franchisee has its own approved agreement, it sets your pay instead — but it cannot pay a base rate below these award rates (Fair Work Act s 206). Your payslip must name the award or agreement you are paid under.",
  ],
  unverified: [
    "A franchisee agreement registered under a company name without \"Guzman\" in its title — our search was by title.",
    "Salaried restaurant manager pay — set by contract.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: SUBWAY_PAY.instrument.url },
    { title: "Terminated agreements list (Guzman Y Gomez Enterprise Agreement 2012, AE898010, terminated 15 November 2018)", publisher: "Fair Work Commission", url: TERMINATED_URL },
    { title: "Guzman Y Gomez drops \"totally unfair\" enterprise agreement (11 November 2018)", publisher: "Franchise Executives", url: "https://franchiseexecutives.com.au/guzman-y-gomez-drops-totally-unfair-enterprise-agreement/" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Guzman y Gomez pay an hour in 2026?",
      a: "GYG crew are paid under the Fast Food Industry Award. An adult crew member (Level 1) must get at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Staff who supervise or train others (Level 2) get $29.45, and a person in charge of a restaurant (Level 3) $29.91 or $30.27.",
    },
    {
      q: "Does GYG have an enterprise agreement?",
      a: "No. The Guzman Y Gomez Enterprise Agreement 2012 was terminated by the Fair Work Commission with effect from 15 November 2018 after workers applied, GYG withdrew the replacement agreement it had proposed, and its crew moved to the Fast Food Industry Award.",
    },
    {
      q: "How much does GYG pay a 15 or 16 year old?",
      a: "Under the Fast Food Award, crew under 16 get 40% of the adult rate ($11.12 an hour, or $13.90 as a casual) and 16-year-olds 50% ($13.91, casual $17.39). At 17 it is 60% ($16.69). The full adult rate applies from 21.",
    },
    {
      q: "What are GYG penalty rates?",
      a: "Saturday is 125% (casual 150%), or $34.76 an hour for an adult Level 1 crew member. Sunday is 125% for Level 1 and 150% for Levels 2 and 3. Public holidays are 225% ($62.57), or 250% for casuals. Weekday work from 10pm to midnight is 110% and from midnight to 6am 115%.",
    },
    {
      q: "Do GYG junior rates go up in December 2026?",
      a: "Yes, for crew aged 18 to 20 with more than 6 months' service. From the first full pay period on or after 1 December 2026, 18-year-olds move to 75% of the adult rate ($20.86 at Level 1), 19-year-olds to 85% ($23.64) and 20-year-olds to 95% ($26.42).",
    },
  ],
};
