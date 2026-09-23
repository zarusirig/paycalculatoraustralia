// Red Rooster — crew, shift leaders and store staff at Red Rooster restaurants
// (Craveable Brands), company-owned and franchised.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Rates, juniors,
// penalties and overtime are imported from subway.ts (the same award
// transcription as mcdonalds.ts).
//
// Coverage evidence (researched 24 September 2026):
//   - "Red Rooster Agreement 2009" (AE874691, approved 16 March 2010) was
//     terminated by the FWC on 31 May 2022 ([2022] FWCA 1791, AG2022/1043) —
//     FWC terminated-agreements list, generated 3 Sep 2026.
//   - The FWO found in 2014 that the 2009 agreement's rates were below the Fast
//     Food Award (media release 27 August 2014) — history only.
//   - No "Red Rooster" or "Craveable" agreement on the FWC approved lists
//     2010 – 21 Sep 2026, and no fast food agreement awaiting approval.
//   - Limit: title search only; a franchisee's agreement filed under its
//     company name cannot be ruled out. The page says so.

import type { EmployerPay } from "./types";
import { SUBWAY_PAY } from "./subway";

const AWARD_URL = SUBWAY_PAY.instrument.url;

export const RED_ROOSTER_PAY: EmployerPay = {
  ...SUBWAY_PAY,
  slug: "red-rooster",
  name: "Red Rooster",
  employerEntity: "Craveable Brands for company-owned restaurants, or the franchisee that owns your restaurant",
  instrument: {
    ...SUBWAY_PAY.instrument,
    coverage:
      "Red Rooster's old agreement (the Red Rooster Agreement 2009) was terminated by the Fair Work Commission on 31 May 2022, and no replacement has been approved. Staff at company-owned and franchised Red Rooster restaurants are paid under the Fast Food Industry Award unless their franchisee has its own agreement — which still cannot pay a base rate below the award.",
  },
  verifiedOn: "24 September 2026",
  rates: SUBWAY_PAY.rates.map((r, i) =>
    i === 0 ? { ...r, description: "Crew: taking orders, cooking, serving and delivering food, including cleaning" } : r,
  ),
  notices: [
    "These are the Fast Food Industry Award minimums. Your employer may be Craveable Brands or a franchisee; either way, these are the least you can be paid, and some restaurants pay more.",
    "If your franchisee has its own approved enterprise agreement, that agreement sets your pay instead — but it cannot pay a base rate below these award rates (Fair Work Act s 206). Your payslip must name the award or agreement you are paid under.",
  ],
  unverified: [
    "Whether any individual Red Rooster franchisee has its own agreement registered under its company name — our search of the Fair Work Commission's lists was by agreement title.",
    "Salaried restaurant manager pay — set by contract.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Terminated agreements list (Red Rooster Agreement 2009, AE874691, terminated 31 May 2022)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/agreements/resources/terminated_agreements_list.xlsx" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Red Rooster pay an hour in 2026?",
      a: "Red Rooster staff are paid under the Fast Food Industry Award. An adult crew member (Level 1) must get at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Shift supervisors and trainers (Level 2) get $29.45, and staff in charge of a restaurant (Level 3) $29.91 or $30.27.",
    },
    {
      q: "How much does Red Rooster pay a 15 or 16 year old?",
      a: "Staff under 16 get 40% of the adult rate: $11.12 an hour, or $13.90 as a casual. At 16 it is 50% ($13.91, casual $17.39) and at 17 it is 60% ($16.69). The full adult rate applies from 21.",
    },
    {
      q: "Does Red Rooster have an enterprise agreement?",
      a: "Not any more. The Red Rooster Agreement 2009 was terminated by the Fair Work Commission on 31 May 2022, and no replacement has been approved, so the Fast Food Industry Award applies unless a franchisee has its own agreement.",
    },
    {
      q: "What are Red Rooster penalty rates?",
      a: "Saturday is 125% ($34.76 an hour for an adult Level 1) and 150% for casuals. Sunday is 125% for Level 1 and 150% for Levels 2 and 3. Public holidays are 225% ($62.57), or 250% for casuals ($69.53).",
    },
    {
      q: "Do Red Rooster junior rates go up in December 2026?",
      a: "Yes, for 18 to 20 year olds who have worked for their employer for more than 6 months. From the first full pay period on or after 1 December 2026 they move to 75%, 85% and 95% of the adult rate ($20.86, $23.64 and $26.42 at Level 1), reaching the full rate in stages by July 2029.",
    },
  ],
};
