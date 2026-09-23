// Hoyts — cinema crew (candy bar, box office, ushering, LUX food and drink).
//
// Instrument: Broadcasting, Recorded Entertainment and Cinemas Award 2020
// (MA000091), Part 10 — Cinemas. Rates cl 13.4 (varied PR799371, from the first
// full pay period on or after 1 July 2026); juniors cl 13.5(b); casual loading
// cl 57.4(b); ordinary hours and early-morning rate cl 58.1; overtime cl 61.1–
// 61.2; public holidays cl 61.4. The FWO pay guide (effective 1 July 2026,
// published 30 July 2026) prints the same hourly, casual and junior dollars,
// so every figure here is printed — none is our arithmetic.
//
// Cinema rates include an 8% "penalty averaging" component, paid on every hour
// instead of Sunday penalties and as compensation for reduced public holiday
// penalties (cl 13.4 Note 1): there is NO Saturday, Sunday or evening penalty.
// cl 56: cinema employers are not covered by the Hospitality or Restaurant
// awards, so LUX kitchen and bar crew are on this award too.
//
// Coverage evidence (researched 24 September 2026) — MODERATE, stated on the
// page: Hoyts' own current job advertisements say crew roles are "classified
// under the Broadcasting, Recorded Entertainment and Cinemas Award as a Cinema
// Worker Level 2", and searches found no current Hoyts enterprise agreement.
// The FWC register could not be queried directly. Other chains (e.g. Event
// Cinemas) are separate employers — do not reuse this file for them.
//
// Juniors are a percentage of the Cinema Worker LEVEL 4 rate, not Level 1
// (cl 13.5(b)), hence juniorBaseLabel and the FWO's published dollars.

import type { EmployerPay } from "./types";

const AWARD_URL = "https://awards.fairwork.gov.au/MA000091.html";
const PAY_GUIDE_URL = "https://calculate.fairwork.gov.au/payguides/fairwork/ma000091/pdf";
const SCHEDULE_D = "Higher cinema classification — the award's Schedule D lists the duties at each level";

export const HOYTS_PAY: EmployerPay = {
  slug: "hoyts",
  name: "Hoyts",
  employerEntity: "The Hoyts cinema company that employs you (HOYTS Group)",
  industry: "cinema",
  instrument: {
    kind: "modern-award",
    title: "Broadcasting, Recorded Entertainment and Cinemas Award 2020",
    reference: "MA000091",
    url: AWARD_URL,
    coverage:
      "Hoyts advertises its cinema crew roles as classified under this award (Part 10 — Cinemas), and we found no current Hoyts enterprise agreement. Cinema employers are not covered by the Hospitality or Restaurant awards, so food and bar crew at Hoyts LUX are paid under this award too.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Cinema Worker Level 1", description: "Induction and training level; no cash handling except supervised training. Moves to Level 2 after cash training and competency (Schedule D.1.1)", weekly: 1085.29, hourly: 28.56, casualHourly: 35.7 },
    { level: "Cinema Worker Level 2", description: "The level Hoyts advertises for its crew roles", weekly: 1111.43, hourly: 29.25, casualHourly: 36.56 },
    { level: "Cinema Worker Level 3", description: SCHEDULE_D, weekly: 1147.93, hourly: 30.21, casualHourly: 37.76 },
    { level: "Cinema Worker Level 4", description: SCHEDULE_D, weekly: 1208.63, hourly: 31.81, casualHourly: 39.76 },
    { level: "Cinema Worker Level 5", description: SCHEDULE_D, weekly: 1284.55, hourly: 33.8, casualHourly: 42.25 },
    { level: "Cinema Worker Level 6", description: SCHEDULE_D, weekly: 1318.79, hourly: 34.71, casualHourly: 43.39 },
    { level: "Cinema Worker Level 7", description: SCHEDULE_D, weekly: 1355.83, hourly: 35.68, casualHourly: 44.6 },
  ],
  juniorScale: [
    { age: "16 and under", percentage: 0.45 },
    { age: "17", percentage: 0.55 },
    { age: "18", percentage: 0.65 },
    { age: "19", percentage: 0.75 },
    { age: "20", percentage: 0.85 },
    { age: "21 and over", percentage: 1 },
  ],
  juniorBaseLabel: "Cinema Worker Level 4",
  juniorNote:
    "In cinemas the junior percentages apply to the Cinema Worker Level 4 rate, whatever level the junior works at (award cl 13.5(b)). The dollar figures are printed in the Fair Work Ombudsman's pay guide. Adults (21 and over) are paid the rate for their own level.",
  publishedJuniorRates: [
    { age: "16 and under", hourly: 14.31, casualHourly: 17.89 },
    { age: "17", hourly: 17.5, casualHourly: 21.88 },
    { age: "18", hourly: 20.68, casualHourly: 25.85 },
    { age: "19", hourly: 23.86, casualHourly: 29.83 },
    { age: "20", hourly: 27.04, casualHourly: 33.8 },
    { age: "21 and over", hourly: 28.56, casualHourly: 35.7 },
  ],
  penalties: [
    { when: "Any day, 8am to 1am (including weekends)", permanent: "100%", casual: "125%", note: "The rate already includes the 8% penalty averaging loading" },
    { when: "Any day, 1am to 8am", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "200%", casual: "200%", note: "Casuals get 200% of the minimum hourly rate, with no extra loading (cl 61.4(c))" },
  ],
  penaltyNotes: [
    "There is no Saturday, Sunday or evening penalty for cinema workers. Instead every cinema rate includes an 8% penalty averaging loading, paid on all hours (award cl 13.4 Note 1 and cl 58.1).",
    "For a Level 2 crew member that is $29.25 an hour at any time between 8am and 1am, $58.50 an hour between 1am and 8am or on a public holiday.",
    "A roster changed on short notice for non-operational reasons, or a meal break not given after 5 hours, is paid at 200% for the affected time, or 225% for casuals (cl 59.3, cl 60.2; FWO pay guide).",
  ],
  overtime: [
    { when: "First 2 hours", permanent: "150%", casual: "187.5%" },
    { when: "After 2 hours", permanent: "200%", casual: "250%" },
    { when: "Less than a 10-hour break between shifts", permanent: "200% until released", casual: "250% until released" },
  ],
  notices: [
    "These are the award minimums for cinema workers. Hoyts' own job advertisements classify crew at Cinema Worker Level 2 ($29.25 an hour, $36.56 casual). Hoyts may pay more; it cannot pay less.",
    "Juniors under 21 are paid a percentage of the Level 4 rate rather than Level 1, so the junior table below uses Level 4 as its base.",
  ],
  unverified: [
    "We could not search the Fair Work Commission's agreement register directly for every Hoyts entity; the award finding rests on Hoyts' own job advertisements and a search that found no current Hoyts agreement.",
    "The legal name of the Hoyts company that employs cinema staff.",
    "Whether Hoyts pays above the award for any role.",
  ],
  sources: [
    { title: "Broadcasting, Recorded Entertainment and Cinemas Award 2020 (MA000091), consolidated to 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "Pay guide — Broadcasting, Recorded Entertainment and Cinemas Award, effective 1 July 2026", publisher: "Fair Work Ombudsman", url: PAY_GUIDE_URL },
    { title: "LUX Crew Member — HOYTS Broadway (job advertisement stating the award and Cinema Worker Level 2)", publisher: "Hoyts, via Talent.com", url: "https://au.talent.com/view?id=635476876508865008" },
  ],
  faqs: [
    {
      q: "How much does Hoyts pay an hour in 2026?",
      a: "Hoyts advertises its crew roles at Cinema Worker Level 2 under the Broadcasting, Recorded Entertainment and Cinemas Award, which pays at least $29.25 an hour, or $36.56 as a casual, from the first full pay period on or after 1 July 2026. Level 1 trainees get at least $28.56 ($35.70 casual).",
    },
    {
      q: "Does Hoyts pay weekend penalty rates?",
      a: "No separate Saturday or Sunday penalty applies to cinema workers. Instead every cinema rate includes an 8% penalty averaging loading on all hours. Ordinary hours between 1am and 8am are paid at 200%.",
    },
    {
      q: "How much does Hoyts pay a 16 or 17 year old?",
      a: "Cinema juniors get a percentage of the Level 4 rate: 45% at 16 and under ($14.31 an hour, $17.89 casual) and 55% at 17 ($17.50, $21.88 casual). It is 65% at 18, 75% at 19 and 85% at 20 ($27.04).",
    },
    {
      q: "What does Hoyts pay on public holidays?",
      a: "200% of the minimum hourly rate for both permanent and casual staff — $58.50 an hour for a Level 2 crew member. Casuals do not get an extra loading on top.",
    },
    {
      q: "Does Hoyts have an enterprise agreement?",
      a: "We found no current Hoyts enterprise agreement, and Hoyts' own job ads classify crew under the Broadcasting, Recorded Entertainment and Cinemas Award. Other cinema chains are separate employers and may have their own agreements.",
    },
  ],
};
