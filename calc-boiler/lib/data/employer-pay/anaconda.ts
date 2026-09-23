// Anaconda — retail team members in Anaconda outdoor stores (Spotlight Retail
// Group).
//
// Instrument: General Retail Industry Award 2020 (MA000004). Rates, junior
// percentages, penalties and overtime are imported from iga.ts.
//
// Coverage evidence (researched 24 September 2026) — MODERATE, stated on the
// page:
//   - Spotlight Retail Group says it runs both the Spotlight and Anaconda
//     store chains (spotlightgroup.com/srg).
//   - FWC approved-agreement lists 2016 – 21 Sep 2026: no Anaconda retail
//     agreement (the only "Anaconda" title is an unrelated 2024 film-crew
//     agreement, AE526777). FWC terminated-agreements list: none.
//   - Limits: agreements before 2016 were not checked; the legal name of the
//     employing company was not confirmed. The page says "we found no
//     agreement", like the JB Hi-Fi page.

import type { EmployerPay } from "./types";
import { IGA_PAY } from "./iga";

export const ANACONDA_PAY: EmployerPay = {
  ...IGA_PAY,
  slug: "anaconda",
  name: "Anaconda",
  employerEntity: "The Spotlight Retail Group company that runs Anaconda stores",
  industry: "outdoor and camping retail",
  instrument: {
    ...IGA_PAY.instrument,
    coverage:
      "We found no enterprise agreement for Anaconda stores on the Fair Work Commission's lists of agreements approved since 2016, so store staff fall under the General Retail Industry Award. The award is a minimum; Anaconda can pay more.",
  },
  verifiedOn: "24 September 2026",
  rates: IGA_PAY.rates.map((r, i) => ({
    ...r,
    description:
      i === 0
        ? "The award's entry level for retail employees: customer service, checkouts and stock work. Anaconda does not publish which level each role sits at"
        : "Higher retail classification — the award's Schedule A lists the duties at each level",
  })),
  notices: [
    "These are the General Retail Industry Award minimums that apply to Anaconda store staff. Anaconda's actual pay rates are not published, so your pay may be higher — it cannot be lower.",
    "Your payslip must name the award or agreement you are paid under. If it names an agreement, that agreement sets your pay — but it cannot pay a base rate below these award rates (Fair Work Act s 206).",
  ],
  unverified: [
    "Anaconda's actual hourly rates and any above-award payments — not public.",
    "The legal name of the company that employs Anaconda store staff.",
    "Agreements approved before 2016 were not checked; none for Anaconda was found on the terminated-agreements list.",
  ],
  sources: [
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: IGA_PAY.instrument.url },
    { title: "Spotlight Retail Group (Spotlight and Anaconda stores)", publisher: "Spotlight Group Holdings", url: "https://spotlightgroup.com/srg/" },
    { title: "Lists of approved agreements 2016–2026 and terminated agreements list (no Anaconda retail agreement)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
  ],
  faqs: [
    {
      q: "How much does Anaconda pay an hour in 2026?",
      a: "Anaconda store staff fall under the General Retail Industry Award, so an adult must be paid at least $27.81 an hour at Level 1, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Anaconda can pay more than the award.",
    },
    {
      q: "Does Anaconda have an enterprise agreement?",
      a: "We found none. No Anaconda retail agreement appears on the Fair Work Commission's lists of agreements approved since 2016, so the General Retail Industry Award sets the minimum pay for store staff.",
    },
    {
      q: "How much does Anaconda pay a 16 or 17 year old?",
      a: "Under the Retail Award, 16-year-olds at Levels 1 to 3 get at least 50% of the adult rate ($13.91 an hour, or $17.39 as a casual) and 17-year-olds 60% ($16.69, casual $20.86). These are our arithmetic from the award percentages.",
    },
    {
      q: "What does Anaconda pay on Sundays and public holidays?",
      a: "Under the Retail Award, permanent staff get at least 150% on Sundays ($41.72 an hour at Level 1) and 225% on public holidays ($62.57). Casuals get 175% ($48.67) and 250% ($69.53), including the casual loading.",
    },
    {
      q: "Is Anaconda pay the same as Spotlight?",
      a: "Both chains belong to Spotlight Retail Group and neither has a store agreement we could find, so the same General Retail Industry Award minimums apply to both. Actual pay above the award can differ.",
    },
  ],
};
