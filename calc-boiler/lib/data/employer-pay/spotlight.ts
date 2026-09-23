// Spotlight — retail team members in Spotlight stores (Spotlight Pty Ltd,
// Spotlight Retail Group).
//
// Instrument: General Retail Industry Award 2020 (MA000004). Rates, junior
// percentages, penalties and overtime are imported from iga.ts.
//
// Coverage evidence (researched 24 September 2026):
//   - FWC terminated-agreements list: "Spotlight Pty Ltd Australian Stores
//     Enterprise Agreement 2009" (AE872815) terminated under s 225 on an
//     application after its nominal expiry, order PR552537 of 27 June 2014,
//     effective 27 June 2014. Workplace Express reported the FWC found staff
//     "better off under award" and they returned to award conditions.
//   - FWC approved-agreement lists 2016 – 21 Sep 2026: the only Spotlight
//     agreements are for its distribution centre (AE507077, 2019; AE526901,
//     2024, "Spotlight Distribution Centre Enterprise Agreement"). No store
//     agreement.
//   - Limits: approvals between mid-2014 and 2015 were not checked one by one.

import type { EmployerPay } from "./types";
import { IGA_PAY } from "./iga";

const TERMINATED_URL = "https://www.fwc.gov.au/documents/agreements/resources/terminated_agreements_list.xlsx";

export const SPOTLIGHT_PAY: EmployerPay = {
  ...IGA_PAY,
  slug: "spotlight",
  name: "Spotlight",
  employerEntity: "Spotlight Pty Ltd (Spotlight Retail Group)",
  industry: "fabric and craft retail",
  instrument: {
    ...IGA_PAY.instrument,
    coverage:
      "Spotlight store staff are paid under the General Retail Industry Award. Spotlight's stores agreement was terminated by the Fair Work Commission in June 2014, and the only Spotlight agreements approved since 2016 cover its distribution centre. The award is a minimum; Spotlight can pay more.",
  },
  verifiedOn: "24 September 2026",
  rates: IGA_PAY.rates.map((r, i) => ({
    ...r,
    description:
      i === 0
        ? "The award's entry level for retail employees: customer service, cutting counter, checkouts and stock work. Spotlight does not publish which level each role sits at"
        : "Higher retail classification — the award's Schedule A lists the duties at each level",
  })),
  notices: [
    "These are the General Retail Industry Award minimums that apply to Spotlight store staff. Spotlight's actual pay rates are not published, so your pay may be higher — it cannot be lower.",
    "Distribution centre staff are covered by the separate Spotlight Distribution Centre Enterprise Agreement 2024, not by these rates.",
  ],
  unverified: [
    "Spotlight's actual hourly rates and any above-award payments — not public.",
    "Which award level each Spotlight store role is classified at.",
    "Agreements approved between mid-2014 and 2015 were not checked one by one; none for Spotlight stores was found.",
  ],
  sources: [
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: IGA_PAY.instrument.url },
    { title: "Terminated agreements list (Spotlight Pty Ltd Australian Stores Enterprise Agreement 2009, AE872815, terminated 27 June 2014)", publisher: "Fair Work Commission", url: TERMINATED_URL },
    { title: "Spotlight employees better off under award, FWC finds", publisher: "Workplace Express", url: "https://www.workplaceexpress.com.au/news/spotlight-employees-better-off-under-award-fwc-finds-52466" },
    { title: "Lists of approved agreements 2016–2026 (Spotlight Distribution Centre agreements AE507077, AE526901)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
  ],
  faqs: [
    {
      q: "How much does Spotlight pay an hour in 2026?",
      a: "Spotlight store staff are covered by the General Retail Industry Award, so an adult must be paid at least $27.81 an hour at Level 1, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Spotlight can pay more than the award.",
    },
    {
      q: "Does Spotlight have an enterprise agreement?",
      a: "Not for its stores. The Spotlight Australian Stores Enterprise Agreement 2009 was terminated by the Fair Work Commission on 27 June 2014, and the only Spotlight agreements approved since 2016 cover its distribution centre.",
    },
    {
      q: "How much does Spotlight pay a 15 or 16 year old?",
      a: "Under the Retail Award, staff under 16 at Levels 1 to 3 get at least 45% of the adult rate ($12.51 an hour, or $15.64 as a casual) and 16-year-olds 50% ($13.91, casual $17.39). These are our arithmetic from the award percentages.",
    },
    {
      q: "What does Spotlight pay on Sundays and public holidays?",
      a: "Under the Retail Award, permanent staff get at least 150% on Sundays ($41.72 an hour at Level 1) and 225% on public holidays ($62.57). Casuals get 175% ($48.67) and 250% ($69.53), including the casual loading.",
    },
    {
      q: "What is the casual rate at Spotlight?",
      a: "At least the Retail Award rate plus a 25% casual loading: $34.76 an hour at Level 1. Weekday evenings after 6pm and Saturdays pay casuals 150%, which is $41.72 an hour at Level 1.",
    },
  ],
};
