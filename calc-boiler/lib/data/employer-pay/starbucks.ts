// Starbucks — baristas, shift supervisors and store managers in Australian
// Starbucks stores.
//
// Instrument: Fast Food Industry Award 2020 (MA000003). Rates, juniors,
// penalties and overtime are imported from subway.ts (the same award
// transcription as mcdonalds.ts) so the fast food pages cannot drift apart.
//
// Coverage evidence (researched 24 September 2026) — STRONG:
//   - Fair Work Ombudsman enforceable undertaking, Starbucks Coffee Australia
//     Pty Ltd (2023): "from 2014 all Australian 'Starbucks' branded stores have
//     been operated as company owned and operated stores"; the underpayments
//     were under "the Fast Food Industry Award 2010" and, from 1 July 2020,
//     "the Fast Food Industry Award 2020"; Starbucks committed to comply with
//     the 2020 Award.
//   - FWC approved-agreement lists 2016 – 21 Sep 2026 and the terminated list:
//     no Starbucks agreement.

import type { EmployerPay } from "./types";
import { SUBWAY_PAY } from "./subway";

const EU_URL = "https://www.fairwork.gov.au/sites/default/files/2023-09/starbucks-coffee-australia-pty-ltd-eu-redacted.pdf";

export const STARBUCKS_PAY: EmployerPay = {
  ...SUBWAY_PAY,
  slug: "starbucks",
  name: "Starbucks",
  employerEntity: "Starbucks Coffee Australia Pty Ltd — every Australian Starbucks store is company owned and operated",
  industry: "coffee and fast food",
  instrument: {
    ...SUBWAY_PAY.instrument,
    coverage:
      "Starbucks staff in Australia are paid under the Fast Food Industry Award. Starbucks Coffee Australia runs every Australian store itself, and its 2023 enforceable undertaking with the Fair Work Ombudsman was about applying this award. We found no Starbucks enterprise agreement approved since 2016.",
  },
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026",
    detail:
      "Staff aged 18 to 20 who have worked for Starbucks for more than 6 months move up: 18-year-olds from 70% to 75%, 19-year-olds from 80% to 85%, and 20-year-olds from 90% to 95% of the adult rate (determination PR813654). At Level 1 that is $20.86, $23.64 and $26.42 an hour. Adult rates next change with the 2027 Annual Wage Review.",
  },
  verifiedOn: "24 September 2026",
  rates: SUBWAY_PAY.rates.map((r, i) =>
    i === 0
      ? { ...r, description: "Barista: taking orders, making coffee, preparing and serving food and drinks, and incidental cleaning" }
      : r,
  ),
  notices: [
    "These are the Fast Food Industry Award minimums, which apply to Starbucks Coffee Australia's stores. Starbucks may pay more; it cannot pay less.",
    "In 2023 Starbucks gave the Fair Work Ombudsman an enforceable undertaking after finding it had underpaid 2,427 current and former staff $4.34 million (before superannuation and interest) between 2014 and 2020, mostly through the award's part-time and rostering rules. It concerns past pay, not current rates.",
  ],
  unverified: [
    "Whether Starbucks pays above the award for any role — its own rates are not published.",
    "Salaried store manager pay — set by contract.",
  ],
  sources: [
    { title: "Fast Food Industry Award 2020 (MA000003), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: SUBWAY_PAY.instrument.url },
    { title: "Enforceable undertaking — Starbucks Coffee Australia Pty Ltd (2023)", publisher: "Fair Work Ombudsman", url: EU_URL },
    { title: "Lists of approved agreements 2016–2026 and terminated agreements list (no Starbucks agreement)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
    { title: "Junior rates determination PR813654 (Fast Food Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813654.pdf" },
  ],
  faqs: [
    {
      q: "How much does Starbucks pay an hour in 2026?",
      a: "Starbucks staff are paid under the Fast Food Industry Award. An adult barista (Level 1) must get at least $27.81 an hour, or $34.76 as a casual, from the first full pay period on or after 1 July 2026. Staff who supervise or train others (Level 2) get at least $29.45.",
    },
    {
      q: "Does Starbucks Australia have an enterprise agreement?",
      a: "We found none approved since 2016. The Fair Work Ombudsman's 2023 enforceable undertaking with Starbucks Coffee Australia dealt with its obligations under the Fast Food Industry Award, which sets the minimum pay for its staff.",
    },
    {
      q: "How much does Starbucks pay a 16 or 17 year old?",
      a: "Under the Fast Food Award, 16-year-olds get 50% of the adult rate ($13.91 an hour, or $17.39 as a casual) and 17-year-olds 60% ($16.69, casual $20.86). Staff under 16 get 40% ($11.12). The full adult rate applies from 21.",
    },
    {
      q: "What does Starbucks pay on weekends and public holidays?",
      a: "Saturday is 125% ($34.76 an hour for an adult Level 1 barista) or 150% for casuals. Sunday is 125% at Level 1 and 150% at Levels 2 and 3. Public holidays are 225% ($62.57), or 250% for casuals.",
    },
    {
      q: "Was Starbucks Australia fined for underpaying staff?",
      a: "Starbucks calculated that it underpaid 2,427 staff $4.34 million (before superannuation and interest) between 2014 and 2020, and signed an enforceable undertaking with the Fair Work Ombudsman in 2023, which requires it to fix its payroll and rostering processes under the Fast Food Award.",
    },
  ],
};
