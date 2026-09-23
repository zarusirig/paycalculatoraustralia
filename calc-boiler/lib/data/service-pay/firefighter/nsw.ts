// New South Wales — Fire and Rescue NSW permanent (career) firefighter pay.
//
// Source of every figure: Crown Employees (Fire and Rescue NSW Permanent
// Firefighting Staff) Award 2024, made by the Full Bench of the Industrial
// Relations Commission of NSW (Taylor P, Chin VP, McDonald C) on 19 December
// 2025, published in the NSW Industrial Gazette as Serial C10121 (Vol 399,
// Part 1, p.1, 11 March 2026). Read in full (Word version) on 24 September 2026.
//
// The award runs from 26 February 2024 to 25 February 2027 (clause 4.2) and
// prints three columns in Schedule 1, Table 1: 26 Feb 2024 (+4%), 26 Feb 2025
// (+4%) and 26 Feb 2026 (+6%) (clause 13.4). On 24 September 2026 the column IN
// FORCE is 26 February 2026, which is what this file publishes.
//
// The award prints WEEKLY rates only (except Superintendent and above, which
// are per annum). Annual figures below are weekly × 52.143, rounded to the
// dollar, per the ServicePayStep rule; each `note` quotes the published weekly
// rate. Each weekly rate is a composite rate that already includes the basic
// wage, margin, loading, shift allowance, industry allowance and (except for
// Recruit Firefighter) the roster allowance (clause 13.2).

import type { ServicePayJurisdiction } from "../types";

export const NSW_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  nameInSentence: "New South Wales",
  employer: "Fire and Rescue NSW",
  agreementName: "Crown Employees (Fire and Rescue NSW Permanent Firefighting Staff) Award 2024",
  agreementUrl: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C10121",
  ratesEffectiveFrom: "26 February 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "firefighters",
      title: "Firefighters (Schedule 1, Table 1 — station based)",
      intro:
        "Permanent firefighters from recruit through to Senior Firefighter. Progression to Qualified Firefighter needs 24 months' service from starting as a recruit, and to Senior Firefighter at least 72 months, plus the required training at each step.",
      stepHeading: "Classification",
      steps: [
        { label: "Recruit Firefighter", salary: 81_118, note: "$1,555.69 per week" },
        { label: "Firefighter", salary: 93_597, note: "$1,795.01 per week" },
        { label: "Qualified Firefighter", salary: 103_997, note: "$1,994.45 per week" },
        { label: "Senior Firefighter", salary: 110_237, note: "$2,114.13 per week" },
      ],
    },
    {
      id: "leading-firefighters-and-officers",
      title: "Leading Firefighter and officers (Schedule 1, Table 1 — station based)",
      intro:
        "Leading Firefighter (reached by completing the Leading Firefighter Program) and the station-based officer ranks. Station Officer Team Member and Team Leader share one station-based rate.",
      stepHeading: "Classification",
      steps: [
        { label: "Leading Firefighter", salary: 116_476, note: "$2,233.78 per week" },
        { label: "Station Officer (Team Member)", salary: 132_076, note: "$2,532.95 per week" },
        { label: "Station Officer (Team Leader)", salary: 132_076, note: "$2,532.95 per week" },
        { label: "Leading Station Officer", salary: 135_196, note: "$2,592.79 per week" },
        { label: "Inspector", salary: 155_996, note: "$2,991.69 per week" },
        { label: "Superintendent", salary: 194_176, note: "Published as $194,176 per annum" },
        { label: "Chief Superintendent", salary: 209_798, note: "Published as $209,798 per annum" },
      ],
    },
  ],
  entryStep: "Recruit Firefighter",
  topStep: "Senior Firefighter",

  traineePay: [
    "Recruit Firefighters are paid $1,555.69 per week from 26 February 2026 (about $81,118 a year).",
    "Unlike every other rank, the Recruit Firefighter rate does not include the roster allowance (clause 13.2.2).",
    "A recruit moves to Firefighter ($1,795.01 per week) after satisfactorily completing the required training (clause 47.2), and stays on probation until six weeks after that progression (clause 47.1).",
  ],
  penalties: [
    "The weekly rates are composite: they already include shift allowance, weekend and public holiday loading, industry allowance and (except for recruits) a roster allowance for working a 42-hour week (clauses 13.2–13.3).",
    "Station-based firefighters work the Standard 10/14 roster — four platoons over an 8-week cycle, day shifts 0800–1800 and night shifts 1800–0800 (clause 21.3).",
    "Non-station-based team members are paid a 15% weekly allowance on top of their substantive rate, and team leaders 20% (clause 49.4.3).",
  ],
  notices: [
    "The award was made on 19 December 2025, after the 26 February 2024 and 26 February 2025 increases had already fallen due, and published in the Industrial Gazette on 11 March 2026. It sets increases of 4% (26 February 2024), 4% (26 February 2025) and 6% (26 February 2026).",
    "The award stays in force until 25 February 2027. No increase after 26 February 2026 is written into it; the award says Fire and Rescue NSW and the FBEU will start negotiating a new award nine months before it expires.",
  ],
  unverified: [
    "Retained (on-call) firefighters are covered by a separate award and are not shown here.",
    "Allowances such as Hazmat, aerial, rescue and service allowances are paid on top of the rates shown and are not included.",
  ],
  sources: [
    {
      title: "Crown Employees (Fire and Rescue NSW Permanent Firefighting Staff) Award 2024 (Serial C10121)",
      publisher: "Industrial Relations Commission of New South Wales — NSW Industrial Gazette",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C10121",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in NSW?",
      a: "Under the Fire and Rescue NSW permanent firefighting award, a Qualified Firefighter earns $1,994.45 a week (about $103,997 a year) and a Senior Firefighter $2,114.13 a week (about $110,237) from 26 February 2026. These are composite rates that already include shift and weekend loadings.",
    },
    {
      q: "What is a recruit firefighter's salary in NSW?",
      a: "A Recruit Firefighter with Fire and Rescue NSW is paid $1,555.69 a week from 26 February 2026, about $81,118 a year. After completing recruit training they move to Firefighter at $1,795.01 a week.",
    },
    {
      q: "How much does a station officer earn in NSW?",
      a: "A station-based Station Officer (Team Member or Team Leader) earns $2,532.95 a week, about $132,076 a year, and a Leading Station Officer $2,592.79 a week, about $135,196 a year, from 26 February 2026.",
    },
    {
      q: "When is the next pay rise for NSW firefighters?",
      a: "The current award's last increase was 6% on 26 February 2026. The award expires on 25 February 2027 and no further increase is written into it, so the next rise depends on a new award.",
    },
  ],
};
