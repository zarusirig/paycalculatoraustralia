// Zambrero — crew in Zambrero restaurants.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Rates, juniors,
// penalties and overtime are imported from subway.ts.
//
// Coverage evidence (researched 24 September 2026) — MODERATE, stated on the
// page:
//   - FWC approved-agreement lists 2016 – 21 Sep 2026 and the FWC terminated-
//     agreements list: no agreement with "Zambrero" in its title.
//   - Zambrero restaurants take orders and prepare and serve food for takeaway
//     or eat-in, the work the award's Level 1 describes (cl 12.4 / Sch A).
//   - Limits: an agreement registered under a restaurant owner's company name
//     would not show in a title search, and agreements before 2016 were not
//     checked. We did not confirm how many restaurants are franchised, so the
//     page does not say; it says "your employer is the business named on your
//     payslip".

import type { EmployerPay } from "./types";
import { SUBWAY_PAY } from "./subway";

export const ZAMBRERO_PAY: EmployerPay = {
  ...SUBWAY_PAY,
  slug: "zambrero",
  name: "Zambrero",
  employerEntity: "The business that runs your restaurant — for a franchised restaurant, the franchisee, not Zambrero head office",
  industry: "fast food",
  instrument: {
    ...SUBWAY_PAY.instrument,
    coverage:
      "We found no Zambrero enterprise agreement on the Fair Work Commission's lists of agreements approved since 2016, so crew fall under the Fast Food Industry Award unless the business that runs their restaurant has its own agreement — which still cannot pay a base rate below the award.",
  },
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Crew aged 18 to 20 who have worked for their employer for more than 6 months move up: 18-year-olds from 70% to 75%, 19-year-olds from 80% to 85%, and 20-year-olds from 90% to 95% of the adult rate (determination PR813654). At Level 1 that is $20.86, $23.64 and $26.42 an hour. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "24 September 2026",
  rates: SUBWAY_PAY.rates.map((r, i) =>
    i === 0
      ? { ...r, description: "Crew: taking orders, preparing burritos and bowls, serving food, and incidental cleaning" }
      : r,
  ),
  notices: [
    "These are the Fast Food Industry Award minimums for Zambrero crew. Some restaurants may pay more; none can pay less.",
    "Your employer is the business named on your payslip. If it has its own approved enterprise agreement, that agreement sets your pay instead — but it cannot pay a base rate below these award rates (Fair Work Act s 206).",
  ],
  unverified: [
    "Whether any individual Zambrero restaurant owner has its own enterprise agreement — agreements are registered under the owner's company name, which we cannot search restaurant by restaurant.",
    "Agreements approved before 2016 were not checked.",
    "Salaried restaurant manager pay — set by contract.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: SUBWAY_PAY.instrument.url },
    { title: "Lists of approved agreements 2016–2026 and terminated agreements list (no Zambrero agreement)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Zambrero pay an hour in 2026?",
      a: "Zambrero crew fall under the Fast Food Industry Award, so an adult crew member (Level 1) must get at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Staff who supervise or train others (Level 2) get at least $29.45.",
    },
    {
      q: "Does Zambrero have an enterprise agreement?",
      a: "We found none on the Fair Work Commission's lists of agreements approved since 2016. Unless the business that runs your restaurant has its own agreement, the Fast Food Industry Award sets your minimum pay.",
    },
    {
      q: "How much does Zambrero pay a 15 or 16 year old?",
      a: "Under the Fast Food Award, crew under 16 get 40% of the adult rate ($11.12 an hour, or $13.90 as a casual) and 16-year-olds 50% ($13.91, casual $17.39). At 17 it is 60% ($16.69). The full adult rate applies from 21.",
    },
    {
      q: "What are Zambrero penalty rates?",
      a: "Saturday is 125% (casual 150%), or $34.76 an hour for an adult Level 1 crew member. Sunday is 125% for Level 1 and 150% for Levels 2 and 3. Public holidays are 225% ($62.57), or 250% for casuals.",
    },
    {
      q: "Who is my employer at Zambrero?",
      a: "The business named on your payslip. If your restaurant is franchised, that is the franchisee who owns it, not Zambrero head office, and the franchisee is responsible for paying you at least the award.",
    },
  ],
};
