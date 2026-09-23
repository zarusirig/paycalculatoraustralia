// Domino's — in-store team members and delivery drivers at Domino's stores,
// corporate and franchised.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Rates, juniors,
// penalties and overtime are imported from subway.ts (the same award
// transcription as mcdonalds.ts) so the fast food pages cannot drift apart.
//
// Coverage evidence (researched 24 September 2026):
//   - FWC terminated-agreements list (generated 3 Sep 2026): the SDA–Domino's
//     Pizza agreements were terminated on the SDA's applications (orders of
//     1 Nov 2017), the last with effect from 24 January 2018.
//   - Domino's newsroom, 26 March 2018: "Domino's team members to stay on Fast
//     Food Industry Award" rather than pursue a new agreement.
//   - Domino's ASX announcement, 23 July 2026 (class action judgment): it relied
//     on certified agreements only until 23 January 2018.
//   - No "Domino" agreement on the FWC approved lists 2011 – 21 Sep 2026.
//   - Caveat: five 2010 franchisee-specific agreements (AE878036, AE878066–
//     AE878069) are not on the terminated list; their rates would be below the
//     award, so the award base rate is the floor for them anyway.
// Delivery drivers who are employees are Level 1 (cl 12.4 includes "delivery")
// and get $0.53/km for their own car (cl 17.8(a), from 1 July 2026). Platform
// contractors are not employees and are not covered by this page.

import type { EmployerPay } from "./types";
import { SUBWAY_PAY } from "./subway";

const AWARD_URL = SUBWAY_PAY.instrument.url;

export const DOMINOS_PAY: EmployerPay = {
  ...SUBWAY_PAY,
  slug: "dominos",
  name: "Domino's",
  employerEntity:
    "Domino's Pizza Enterprises Ltd for corporate stores, or the franchisee that owns your store",
  instrument: {
    ...SUBWAY_PAY.instrument,
    coverage:
      "Domino's has had no enterprise agreement since its SDA agreements were terminated with effect from 24 January 2018; in March 2018 it said its team members would stay on the Fast Food Industry Award. The award covers in-store staff and employee delivery drivers at corporate and franchised stores.",
  },
  verifiedOn: "24 September 2026",
  rates: SUBWAY_PAY.rates.map((r, i) =>
    i === 0
      ? { ...r, description: "In-store crew and pizza makers, and delivery drivers — the award's Level 1 includes preparing, serving and delivering food" }
      : r,
  ),
  penaltyNotes: [
    ...SUBWAY_PAY.penaltyNotes,
    "Delivery drivers who use their own car are also paid $0.53 a kilometre (award cl 17.8(a), from 1 July 2026).",
  ],
  notices: [
    "These are the Fast Food Industry Award minimums, which apply to Domino's corporate and franchised stores. Some stores may pay more.",
    "Domino's delivery drivers who are employees are paid the Level 1 rate — the same as in-store crew — plus a per-kilometre allowance for using their own car. People delivering through app platforms as contractors are not covered by these rates.",
    "In July 2026 the Federal Court gave judgment in a class action about Domino's use of old agreements between 2013 and January 2018. It concerns past pay, not current rates.",
  ],
  unverified: [
    "Five Domino's franchisee agreements from 2010 are not on the Fair Work Commission's terminated list. If one still applies to your store, it still cannot pay a base rate below these award rates.",
    "A franchisee agreement registered under a company name without \"Domino's\" in its title — our search was by title.",
    "Salaried store manager pay — set by contract.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Domino's team members to stay on Fast Food Industry Award (26 March 2018)", publisher: "Domino's Pizza Enterprises", url: "https://newsroom.dominos.com.au/media/2018/3/25/dominos-team-members-to-stay-on-fast-food-industry-award" },
    { title: "Terminated agreements list (SDA–Domino's Pizza agreements)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/agreements/resources/terminated_agreements_list.xlsx" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Domino's pay an hour in 2026?",
      a: "Domino's staff are paid under the Fast Food Industry Award. An adult in-store team member or delivery driver (Level 1) must get at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Supervisors (Level 2) get $29.45, and staff in charge of a store (Level 3) $29.91 or $30.27.",
    },
    {
      q: "How much does a Domino's delivery driver earn?",
      a: "An employee delivery driver is Level 1 under the Fast Food Award: at least $27.81 an hour, or $34.76 as a casual, plus $0.53 a kilometre when using their own car.",
    },
    {
      q: "Does Domino's have an enterprise agreement?",
      a: "No. The old SDA–Domino's agreements were terminated with effect from 24 January 2018, and in March 2018 Domino's said its team members would stay on the Fast Food Industry Award rather than seek a new agreement.",
    },
    {
      q: "How much does Domino's pay a 15 or 16 year old?",
      a: "Under the Fast Food Award, staff under 16 get 40% of the adult rate ($11.12 an hour, or $13.90 as a casual) and 16-year-olds 50% ($13.91, casual $17.39). At 17 it is 60% ($16.69). The full adult rate applies from 21.",
    },
    {
      q: "What are Domino's penalty rates?",
      a: "Saturday is 125% (casual 150%), or $34.76 an hour for an adult Level 1. Sunday is 125% for Level 1 and 150% for Levels 2 and 3. Public holidays are 225% ($62.57), or 250% for casuals. Weekday work from 10pm to midnight is 110% and from midnight to 6am 115%.",
    },
  ],
};
