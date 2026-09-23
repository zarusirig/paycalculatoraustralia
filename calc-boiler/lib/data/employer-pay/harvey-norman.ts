// Harvey Norman — sales and store staff in Harvey Norman (and Domayne, Joyce
// Mayne) stores in Australia.
//
// Instrument: General Retail Industry Award 2020 (MA000004). Rates, junior
// percentages, penalties and overtime are imported from iga.ts (cl 17.1 Table 4
// from 1 July 2026) so the Retail Award pages cannot drift apart.
//
// Coverage evidence (researched 24 September 2026):
//   - Harvey Norman Holdings, "The Franchise Operating Model in Australia": a
//     subsidiary "grants separate franchises to independent franchisees", and
//     "Each franchisee owns and controls the franchisee business". So the
//     employer of store staff is the franchisee, not Harvey Norman.
//   - FWC annual approved-agreement lists 2016 – 21 Sep 2026 and the FWC
//     terminated-agreements list: no agreement with "Harvey Norman" in its
//     title.
//   - Limits: agreements are registered under the franchisee's company name,
//     which we cannot search store by store. The page therefore says the award
//     applies UNLESS the franchisee has its own agreement (the IGA/Subway
//     pattern). Commission and incentive schemes are not public.

import type { EmployerPay } from "./types";
import { IGA_PAY } from "./iga";

const OVERVIEW_URL = "https://www.harveynormanholdings.com.au/pages/company-overview";

export const HARVEY_NORMAN_PAY: EmployerPay = {
  ...IGA_PAY,
  slug: "harvey-norman",
  name: "Harvey Norman",
  employerEntity:
    "The franchisee that owns your store — Harvey Norman, Domayne and Joyce Mayne stores in Australia are run by independent franchisees.",
  industry: "electrical and furniture retail",
  instrument: {
    ...IGA_PAY.instrument,
    coverage:
      "There is no Harvey Norman-wide enterprise agreement. Each Harvey Norman store in Australia is run by an independent franchisee who employs the staff, and the General Retail Industry Award covers them unless that franchisee has its own approved agreement — which still cannot pay a base rate below the award.",
  },
  verifiedOn: "24 September 2026",
  rates: IGA_PAY.rates.map((r, i) => ({
    ...r,
    description:
      i === 0
        ? "The award's entry level for retail employees, such as a sales assistant. Franchisees do not publish which level each role sits at"
        : "Higher retail classification — the award's Schedule A lists the duties at each level",
  })),
  notices: [
    "Your employer is the franchisee that owns your store, not Harvey Norman Holdings. These are the General Retail Industry Award minimums; franchisees can pay more, and many sales roles add commission on top.",
    "If your franchisee has its own approved enterprise agreement, that sets your pay instead — but it cannot pay a base rate below these award rates (Fair Work Act s 206). Your payslip must name the award or agreement you are paid under.",
    "Commission cannot replace the minimum: whatever the commission arrangement, your pay for each pay period must be at least the award rate for the hours you worked, including penalty rates.",
  ],
  unverified: [
    "Whether your particular franchisee has its own enterprise agreement — agreements are registered under the franchisee's company name, which we cannot search store by store.",
    "Commission rates and incentive schemes — set by each franchisee, not published.",
    "Which award level each Harvey Norman role is classified at.",
  ],
  sources: [
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: IGA_PAY.instrument.url },
    { title: "Company overview — The Franchise Operating Model in Australia", publisher: "Harvey Norman Holdings Ltd", url: OVERVIEW_URL },
    { title: "Lists of approved agreements 2016–2026 and terminated agreements list (no Harvey Norman agreement)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
    { title: "Junior rates determination PR813655 (Retail Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813655.pdf" },
  ],
  faqs: [
    {
      q: "How much does Harvey Norman pay an hour in 2026?",
      a: "Unless your franchisee has its own agreement, an adult Harvey Norman store employee at Retail Level 1 must be paid at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Commission, where offered, is on top of that minimum.",
    },
    {
      q: "Who is my employer at Harvey Norman?",
      a: "The franchisee that owns your store. Harvey Norman Holdings grants franchises to independent franchisees, and each franchisee owns and controls its own business, including employing the staff. Your payslip names your employer.",
    },
    {
      q: "Does Harvey Norman have an enterprise agreement?",
      a: "We found no Harvey Norman agreement on the Fair Work Commission's lists of agreements approved since 2016. Store staff are covered by the General Retail Industry Award unless their franchisee has its own agreement.",
    },
    {
      q: "How much does Harvey Norman pay a 16 or 17 year old?",
      a: "Under the Retail Award, 16-year-olds at Levels 1 to 3 get at least 50% of the adult rate ($13.91 an hour, or $17.39 as a casual) and 17-year-olds 60% ($16.69, casual $20.86). These are our arithmetic from the award percentages.",
    },
    {
      q: "What does Harvey Norman pay on Sundays and public holidays?",
      a: "Under the Retail Award, permanent staff get at least 150% on Sundays ($41.72 an hour at Level 1) and 225% on public holidays ($62.57). Casuals get 175% ($48.67) and 250% ($69.53), including the casual loading.",
    },
  ],
};
