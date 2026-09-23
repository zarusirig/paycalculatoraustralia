// Event Cinemas — cinema crew at Event Cinemas (EVT Limited), including candy
// bar, box office, ushering and Gold Class food and drink.
//
// Instrument: Broadcasting, Recorded Entertainment and Cinemas Award 2020
// (MA000091), Part 10 — Cinemas. Rates, juniors (printed FWO pay-guide
// dollars), penalties and overtime are imported from hoyts.ts — the same award
// transcription (cl 13.4 from 1 July 2026, varied PR799371) — so the cinema
// pages cannot drift apart. Every dollar is printed in the FWO pay guide.
//
// Coverage evidence (researched 24 September 2026):
//   - Event Cinemas Macquarie job advertisement (EVT careers site, posted
//     3 June 2026): "Cinema Employee Level 1 (Classification - Cinema Worker
//     Level 1 BREC Award)", reporting to Level 3–8 classified supervisors and
//     managers.
//   - FWC approved-agreement lists 2016 – 21 Sep 2026 and the terminated list:
//     no Event Cinemas, EVT, Greater Union or Birch Carroll & Coyle agreement.
//   - Limit: agreements before 2016 were not checked; the legal name of the
//     employing EVT subsidiary was not confirmed.

import type { EmployerPay } from "./types";
import { HOYTS_PAY } from "./hoyts";

const JOB_AD_URL = "https://jobs.dayforcehcm.com/evtelevate/EVT/jobs/22904";
const SCHEDULE_D = "Higher cinema classification — the award's Schedule D lists the duties at each level";

export const EVENT_CINEMAS_PAY: EmployerPay = {
  ...HOYTS_PAY,
  slug: "event-cinemas",
  name: "Event Cinemas",
  employerEntity: "The EVT Limited company that runs your cinema (Event Cinemas)",
  instrument: {
    ...HOYTS_PAY.instrument,
    coverage:
      "Event Cinemas advertises its crew roles under this award (\"Cinema Worker Level 1 BREC Award\"), and we found no Event Cinemas or EVT enterprise agreement on the Fair Work Commission's lists of agreements approved since 2016. Cinema employers are not covered by the Hospitality or Restaurant awards, so Gold Class food and bar staff are on this award too.",
  },
  verifiedOn: "24 September 2026",
  rates: HOYTS_PAY.rates.map((r, i) =>
    i === 0
      ? { ...r, description: "The level Event Cinemas advertises for new crew (\"Cinema Employee Level 1\"): cleaning, food and drink preparation, stock, ticket checks; cash handling only once trained" }
      : i === 1
        ? { ...r, description: "Cinema worker once trained and competent in cash handling (award Schedule D)" }
        : { ...r, description: SCHEDULE_D },
  ),
  penaltyNotes: [
    "There is no Saturday, Sunday or evening penalty for cinema workers. Instead every cinema rate includes an 8% penalty averaging loading, paid on all hours (award cl 13.4 Note 1 and cl 58.1).",
    "For a Level 1 crew member that is $28.56 an hour at any time between 8am and 1am, and $57.12 an hour between 1am and 8am or on a public holiday.",
    "A roster changed on short notice for non-operational reasons, or a meal break not given after 5 hours, is paid at 200% for the affected time, or 225% for casuals (cl 59.3, cl 60.2; FWO pay guide).",
  ],
  notices: [
    "These are the award minimums for cinema workers. Event Cinemas advertises new crew at Cinema Worker Level 1 ($28.56 an hour, $35.70 casual). It may pay more; it cannot pay less.",
    "Juniors under 21 are paid a percentage of the Level 4 rate rather than Level 1, so the junior table below uses Level 4 as its base.",
  ],
  unverified: [
    "Agreements approved before 2016 were not checked; none for Event Cinemas was found on the terminated-agreements list.",
    "The legal name of the EVT company that employs cinema staff.",
    "Whether Event Cinemas pays above the award for any role.",
  ],
  sources: [
    HOYTS_PAY.sources[0],
    HOYTS_PAY.sources[1],
    { title: "Event Cinemas Macquarie — Cinema Worker Junior (job advertisement: \"Cinema Worker Level 1 BREC Award\")", publisher: "EVT, via Dayforce", url: JOB_AD_URL },
    { title: "Lists of approved agreements 2016–2026 and terminated agreements list (no Event Cinemas agreement)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement" },
  ],
  faqs: [
    {
      q: "How much does Event Cinemas pay an hour in 2026?",
      a: "Event Cinemas advertises new crew at Cinema Worker Level 1 under the Broadcasting, Recorded Entertainment and Cinemas Award, which pays at least $28.56 an hour, or $35.70 as a casual, from the first full pay period on or after 1 July 2026. Level 2 pays $29.25 ($36.56 casual).",
    },
    {
      q: "Does Event Cinemas pay weekend penalty rates?",
      a: "No separate Saturday or Sunday penalty applies to cinema workers. Instead every cinema rate includes an 8% penalty averaging loading on all hours. Ordinary hours between 1am and 8am are paid at 200%.",
    },
    {
      q: "How much does Event Cinemas pay a 16 or 17 year old?",
      a: "Cinema juniors get a percentage of the Level 4 rate: 45% at 16 and under ($14.31 an hour, $17.89 casual) and 55% at 17 ($17.50, $21.88 casual). It is 65% at 18, 75% at 19 and 85% at 20 ($27.04).",
    },
    {
      q: "What does Event Cinemas pay on public holidays?",
      a: "200% of the minimum hourly rate for both permanent and casual staff — $57.12 an hour for a Level 1 crew member. Casuals do not get an extra loading on top.",
    },
    {
      q: "Does Event Cinemas have an enterprise agreement?",
      a: "We found none on the Fair Work Commission's lists of agreements approved since 2016, and Event Cinemas' own job ads classify crew under the Broadcasting, Recorded Entertainment and Cinemas Award.",
    },
  ],
};
