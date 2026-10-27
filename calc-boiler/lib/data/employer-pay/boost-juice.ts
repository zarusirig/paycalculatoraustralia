// Boost Juice — team members, shift supervisors and store managers in
// Australian Boost Juice stores (Retail Zoo).
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Rates, juniors,
// penalties and overtime are imported from subway.ts (the same award
// transcription as mcdonalds.ts) so the fast food pages cannot drift apart.
//
// Coverage evidence (researched 22 October 2026) — STRONG:
//   - Fair Work Ombudsman, "Retail Zoo Group Pty Ltd Compliance Partnership
//     Report" (November 2018): "Across the Retail Zoo Group network, two awards
//     cover the majority of employees depending on the primary nature of the
//     business: Restaurant Industry Award 2010 ... Fast Food Industry Award
//     2010". The Fast Food Award section describes "businesses that sell
//     meals, snacks and/or beverages primarily consumed away from the
//     point-of-sale" and "businesses in food courts, shopping centres and
//     retail complexes"; the Restaurant Award section is about cafes (Cibo).
//     The report also says "a low number of individual franchisees across the
//     Retail Zoo Group network had enterprise agreements in place", that
//     94% of businesses were franchised at the end of the partnership, and
//     that Retail Zoo had 260 Boost Juice stores in Australia.
//   - Fast Food Industry Award cl 4.2(a) to (c): beverages sold primarily to
//     be consumed away from the point of sale; food courts and shopping
//     centres. Read from awards.fairwork.gov.au on 22 October 2026.
//   - Retail Zoo Holdings Pty Ltd, Modern Slavery Statement FY2024 (Australian
//     Government register): Boost Juice Pty Ltd ACN 092 165 681 and Boost
//     Juice Franchises Pty Ltd ACN 096 966 193; "more than 360 franchise
//     stores and 70 company-owned stores in Australia as at 30 June 2024"
//     across four brands; about 3,500 employees in company-owned stores;
//     "each franchisee ... contractually responsible for the employment of
//     those persons in their own operations".
//   - FWO media release 16 November 2018: proactive compliance deed signed
//     2014; self-audit of 60 stores and 196 employees found 19 breaches and
//     recovered $29,224; $16,337 more for nine employees through requests
//     for assistance; employee hotline introduced.
//   - Limits: the FWC's agreement register could only be searched by title
//     through a web search, which found no Boost Juice-wide agreement; a
//     franchisee's agreement is filed under its own company name.

import type { EmployerPay } from "./types";
import { SUBWAY_PAY } from "./subway";

const FWO_REPORT_URL =
  "https://www.fairwork.gov.au/sites/default/files/migration/1221/retail-zoo-group-compliance-partnership-report-november-2018.docx";
const FWO_RELEASE_URL =
  "https://www.fairwork.gov.au/newsroom/media-releases/2018-media-releases/november-2018/20181116-retail-zoo-pcd-report-media-release";
const MSA_URL = "https://modernslaveryregister.gov.au/statements/QGxLWhetdBhRAMp/";

export const BOOST_JUICE_PAY: EmployerPay = {
  ...SUBWAY_PAY,
  slug: "boost-juice",
  name: "Boost Juice",
  employerEntity:
    "The franchisee that owns your store, or Boost Juice Pty Ltd (Retail Zoo) at a company-owned store. Most Boost Juice stores are franchised.",
  industry: "juice bar and fast food",
  instrument: {
    ...SUBWAY_PAY.instrument,
    coverage:
      "Boost Juice stores sell drinks and snacks to take away, mostly from shopping centre kiosks, which is the fast food industry as the award defines it (cl 4.2). The Fair Work Ombudsman's 2018 report on its compliance partnership with Retail Zoo, Boost Juice's parent, names the Fast Food Industry Award as the award covering the group's takeaway stores. Your employer is usually the franchisee that owns your store. A franchisee with its own approved agreement pays under that instead, but it cannot pay a base rate below the award.",
  },
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Determination PR813654 lifts the junior percentages for 18- to 20-year-olds who have been with their employer for more than 6 months. 18-year-olds go from 70% to 75% of the adult rate, 19-year-olds from 80% to 85% and 20-year-olds from 90% to 95%. At Level 1 that is $20.86, $23.64 and $26.42 an hour. Under-18 rates stay the same, and adult rates next move with the 2027 Annual Wage Review.",
  },
  verifiedOn: "22 October 2026",
  rates: SUBWAY_PAY.rates.map((r, i) => {
    if (i === 0) {
      return { ...r, description: "Team member: taking orders, making juices and smoothies, serving, washing up and incidental cleaning" };
    }
    if (i === 1) {
      return { ...r, description: "Shift supervisor or trainer: has day-to-day responsibility for supervising or training Level 1 staff" };
    }
    return r;
  }),
  penaltyNotes: SUBWAY_PAY.penaltyNotes.map((n) => n.replace("Level 1 sandwich artist", "Level 1 team member")),
  notices: [
    "These are the Fast Food Industry Award minimums. Your employer is usually the franchisee that owns your store. The Fair Work Ombudsman found 94% of Retail Zoo's stores were franchised in 2018, and Retail Zoo runs the rest itself. Either can pay more than the award; neither can pay less.",
    "Retail Zoo signed a proactive compliance deed with the Fair Work Ombudsman in 2014. Its self-audit of 60 stores found 19 breaches and returned $29,224 to staff, and the group set up an employee hotline for pay questions. The Ombudsman's 2018 report also noted a small number of franchisees had their own enterprise agreements.",
    "If your payslip names an enterprise agreement, that agreement sets your penalties and conditions, but its base rates cannot fall below these award rates (Fair Work Act s 206).",
  ],
  unverified: [
    "Whether your particular franchisee has its own enterprise agreement. The Fair Work Commission files agreements under the franchisee's company name, not the Boost Juice brand, so we could only search by title.",
    "Which stores Retail Zoo runs itself: its 2024 modern slavery statement counts 70 company-owned stores across its four brands but does not list them.",
    "Store manager salaries, set by each franchisee or by Retail Zoo by contract.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: SUBWAY_PAY.instrument.url },
    { title: "Retail Zoo Group Pty Ltd Compliance Partnership Report, November 2018 (awards covering the network)", publisher: "Fair Work Ombudsman", url: FWO_REPORT_URL },
    { title: "Improved compliance for food franchisor (16 November 2018)", publisher: "Fair Work Ombudsman", url: FWO_RELEASE_URL },
    { title: "Retail Zoo Holdings Pty Ltd Modern Slavery Statement FY2024 (store numbers and employing entities)", publisher: "Australian Government Modern Slavery Statements Register", url: MSA_URL },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Boost Juice pay an hour in 2026?",
      a: "Boost Juice staff fall under the Fast Food Industry Award. From the first full pay period on or after 1 July 2026, an adult team member (Level 1) must get at least $27.81 an hour, or $34.76 as a casual. A shift supervisor who trains or supervises others (Level 2) must get at least $29.45, and someone put in charge of a store (Level 3) $29.91 or $30.27.",
    },
    {
      q: "Which award covers Boost Juice?",
      a: "Boost Juice staff are covered by the Fast Food Industry Award 2020 (MA000003). Juices and smoothies sold from a kiosk to drink elsewhere are fast food as the award defines it. The Fair Work Ombudsman's 2018 report on Retail Zoo named this award as covering the group's takeaway brands. The Retail Award does not apply, because it excludes fast food operations.",
    },
    {
      q: "Does Boost Juice have an enterprise agreement?",
      a: "We found no Boost Juice-wide agreement. The Fair Work Ombudsman reported in 2018 that only a small number of Retail Zoo franchisees had their own agreements. Your payslip must name the award or agreement you are paid under; if it names an agreement, that agreement still cannot pay a base rate below the Fast Food Award.",
    },
    {
      q: "How much does Boost Juice pay a 15 or 16 year old?",
      a: "A Boost Juice team member under 16 must get at least $11.12 an hour ($13.90 casual), a 16-year-old $13.91 ($17.39 casual) and a 17-year-old $16.69 ($20.86 casual). These are the Fast Food Award's printed junior rates for Level 1. Every shift must be at least 3 hours, including for school students, and the adult rate applies from 21.",
    },
    {
      q: "What does Boost Juice pay on weekends and public holidays?",
      a: "A Level 1 team member gets 125% on Saturdays and Sundays, which is $34.76 an hour for a permanent and $41.72 for a casual. Levels 2 and 3 get 150% on Sundays (casual 175%). Public holidays pay 225%, or $62.57 at Level 1, and $69.53 for a casual.",
    },
  ],
};
