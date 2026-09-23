// JB Hi-Fi — retail store staff of JB Hi-Fi Group Pty Ltd.
//
// Instrument: General Retail Industry Award 2020 (MA000004). Rates, junior
// percentages, penalties and overtime are imported from iga.ts (the same
// award transcription, cl 17.1 Table 4 from 1 July 2026) so the two pages
// cannot drift apart.
//
// Coverage evidence (researched 24 September 2026):
//   - The FWC annual agreement lists 2019–2026 show only two JB Hi-Fi
//     agreements, both for the Victorian Home Delivery Centre, a warehouse:
//     AE521349 (2023) and AE533888 (operative 10 Sep 2026, "Storage services").
//     No store agreement, and none for The Good Guys.
//   - The FWO's Proactive Compliance Deed with JB Hi-Fi Group Pty Ltd (2015)
//     audits store staff "at each of the classification levels in the General
//     Retail Industry Award 2010 under which JB Group engages its employees".
//   - Limits: approvals from 2010–2018 were not checked one by one, and the
//     deed is 2015 evidence. JB's above-award pay and any sales incentives are
//     not public. The page says these are award MINIMUMS and does not assign a
//     level to any JB job title.

import type { EmployerPay } from "./types";
import { IGA_PAY } from "./iga";

const AWARD_URL = IGA_PAY.instrument.url;
const DEED_URL =
  "https://www.fairwork.gov.au/sites/default/files/migration/762/jb-hi-fi-group-pty-ltd-proactive-compliance-deed.pdf";

export const JB_HI_FI_PAY: EmployerPay = {
  ...IGA_PAY,
  slug: "jb-hi-fi",
  name: "JB Hi-Fi",
  employerEntity: "JB Hi-Fi Group Pty Ltd",
  industry: "electronics retail",
  instrument: {
    ...IGA_PAY.instrument,
    coverage:
      "We found no enterprise agreement for JB Hi-Fi stores: the only JB Hi-Fi agreements approved by the Fair Work Commission since 2019 cover its Victorian Home Delivery Centre, a warehouse. Store staff are engaged under the General Retail Industry Award, as the Fair Work Ombudsman's 2015 compliance deed with JB Hi-Fi records. The award is a minimum; JB Hi-Fi can pay more.",
  },
  verifiedOn: "24 September 2026",
  rates: IGA_PAY.rates.map((r, i) => ({
    ...r,
    description:
      i === 0
        ? "The award's entry level for retail employees. JB Hi-Fi does not publish which level each store role sits at"
        : "Higher retail classification — the award's Schedule A lists the duties at each level",
  })),
  notices: [
    "These are the General Retail Industry Award minimums that apply to JB Hi-Fi store staff. JB Hi-Fi's actual pay rates, and any sales incentives, are not published, so your pay may be higher — it cannot be lower.",
    "Your payslip must name the award or agreement you are paid under, and your classification level. If it says Retail Award, match your level to the table below.",
  ],
  unverified: [
    "JB Hi-Fi's actual hourly rates, above-award payments and sales incentives — not public.",
    "Which award level each JB Hi-Fi store role is classified at — JB Hi-Fi does not publish this.",
    "Agreements approved before 2019 were not checked one by one; none was found in searches.",
    "The Good Guys (owned by JB Hi-Fi) — no agreement found for it either, but not researched separately.",
  ],
  sources: [
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "JB Hi-Fi Group Pty Ltd — Proactive Compliance Deed (2015)", publisher: "Fair Work Ombudsman", url: DEED_URL },
    { title: "Find an enterprise agreement (JB Hi-Fi Home Delivery Centre Victoria agreements AE521349, AE533888)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
  ],
  faqs: [
    {
      q: "How much does JB Hi-Fi pay an hour in 2026?",
      a: "JB Hi-Fi store staff are covered by the General Retail Industry Award, so an adult must be paid at least $27.81 an hour at Level 1, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. JB Hi-Fi does not publish its own rates, and it can pay more than the award.",
    },
    {
      q: "Does JB Hi-Fi have an enterprise agreement?",
      a: "Not for its stores, as far as we could find. The only JB Hi-Fi agreements approved by the Fair Work Commission since 2019 cover its Victorian Home Delivery Centre. Store staff are engaged under the General Retail Industry Award.",
    },
    {
      q: "How much does JB Hi-Fi pay a 16 or 17 year old?",
      a: "Under the Retail Award, 16-year-olds at Levels 1 to 3 get at least 50% of the adult rate ($13.91 an hour, or $17.39 as a casual) and 17-year-olds 60% ($16.69, casual $20.86). These are our arithmetic from the award percentages.",
    },
    {
      q: "What does JB Hi-Fi pay on Sundays and public holidays?",
      a: "Under the Retail Award, permanent staff get at least 150% on Sundays ($41.72 an hour at Level 1) and 225% on public holidays ($62.57). Casuals get 175% ($48.67) and 250% ($69.53), including the casual loading.",
    },
    {
      q: "What is the casual rate at JB Hi-Fi?",
      a: "At least the Retail Award rate plus a 25% casual loading: $34.76 an hour at Level 1. Weekday evenings after 6pm and Saturdays pay casuals 150%, which is $41.72 an hour at Level 1.",
    },
  ],
};
