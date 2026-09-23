// Western Australia — WA Police Force salaries (sworn police officers).
//
// Source of every figure: Western Australia Police Force Industrial Agreement
// 2024, registered by the WAIRC on 13 May 2025 (AG 24 of 2025, [2025] WAIRC
// 00286), replacing the 2022 agreement. Clause 10.1 salary tables and clause 16
// shift allowance read in full on 24 September 2026.
//
// Clause 10.1 prints columns for the "Current salary" and for 1 July 2024,
// 1 July 2025 and 1 July 2026. On 24 September 2026 the column IN FORCE is
// 1 July 2026, which is what this file publishes. The agreement operates to
// 30 June 2027 (clause 4.1) and prints no later salary column, so there is no
// scheduled next increase in the instrument. It continues in force after
// 30 June 2027 until a party withdraws (clause 4.4).
//
// Row labels: the agreement lists constables under the heading "(l) Constable"
// with rows "1st year of service" etc.; "Constable" is prefixed here so the rows
// read on their own. Sergeant and senior sergeant tables also carry OIC and
// grandfathered Category A/B/C rows (clause 10.1(n)); only the standard
// "Sergeant – Base" and "Senior Sergeant Base" rows are reproduced.

import type { ServicePayJurisdiction } from "../types";

export const WA_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  nameInSentence: "Western Australia",
  employer: "WA Police Force",
  agreementName: "Western Australia Police Force Industrial Agreement 2024",
  agreementUrl: "https://downloads.wairc.wa.gov.au/agreements/wes338.pdf",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "constable-to-senior-constable",
      title: "Constable, First Class Constable and Senior Constable",
      intro: "Sworn constables to senior constables under clause 10.1, from 1 July 2026.",
      stepHeading: "Classification",
      steps: [
        {
          label: "Constable 1st year of service",
          salary: 94_651,
          note: "Constables move to the 3rd year increment on completing probation (clause 10.2(b))",
        },
        { label: "Constable 2nd year of service", salary: 94_651 },
        { label: "Constable 3rd year of service", salary: 97_542 },
        { label: "Constable 4th year of service", salary: 99_900 },
        { label: "Constable 5th year of service & thereafter", salary: 102_263 },
        { label: "First Class Constable Base Rate", salary: 107_977 },
        { label: "First Class Constable Increment I", salary: 109_553 },
        { label: "Senior Constable Base Rate", salary: 115_722 },
        { label: "Senior Constable Increment I", salary: 117_298 },
        { label: "Senior Constable Increment II", salary: 119_091 },
        { label: "Senior Constable Increment III", salary: 120_886 },
        { label: "Senior Constable Increment IV", salary: 122_712 },
        { label: "Senior Constable Increment V", salary: 124_558, note: "Top of the constable ranks" },
      ],
    },
    {
      id: "sergeant",
      title: "Sergeant (base rows)",
      intro:
        "Sergeants not in an officer-in-charge position, from 1 July 2026. Increments are reached after each two years of satisfactory service (clause 10.2(a)).",
      stepHeading: "Classification",
      steps: [
        { label: "Sergeant – Base Rate", salary: 127_619 },
        { label: "Sergeant – Base Increment I", salary: 129_289 },
        { label: "Sergeant – Base Increment II", salary: 131_194 },
        { label: "Sergeant – Base Increment III", salary: 133_099 },
        { label: "Sergeant – Base Increment IV", salary: 135_005 },
      ],
    },
    {
      id: "senior-sergeant",
      title: "Senior Sergeant (base rows)",
      intro: "Senior sergeants not in an officer-in-charge position, from 1 July 2026.",
      stepHeading: "Classification",
      steps: [
        { label: "Senior Sergeant Base Rate", salary: 142_174 },
        { label: "Senior Sergeant Base Increment I", salary: 144_123 },
        { label: "Senior Sergeant Base Increment II", salary: 146_635 },
        { label: "Senior Sergeant Base Increment III", salary: 149_146 },
        { label: "Senior Sergeant Base Increment IV", salary: 151_652 },
      ],
    },
    {
      id: "inspector",
      title: "Inspector",
      intro:
        "Commissioned officers at the rank of Inspector, from 1 July 2026. Commissioned officers' rates include an allowance for duty beyond 40 hours a week and for public holiday and weekend work (clause 10.1(b)).",
      stepHeading: "Classification",
      steps: [
        { label: "Inspector Base Rate", salary: 173_361 },
        { label: "Inspector Increment I", salary: 177_538 },
        { label: "Inspector Increment II", salary: 181_717 },
        { label: "Inspector Increment III", salary: 185_897 },
      ],
    },
  ],
  entryStep: "Constable 1st year of service",
  topStep: "Senior Constable Increment V",

  traineePay: [
    "Recruits-in-Training are paid $74,309 a year from 1 July 2026 under clause 10.1 of the agreement ($71,623 from 1 July 2025).",
  ],
  penalties: [
    "Shift allowance (clause 16.1), per ordinary eight-hour shift from 1 July 2026: $74.11 for a Saturday or Sunday day shift, $84.35 for an afternoon shift, $101.13 for an evening shift and $126.56 for a night shift. Shifts of other lengths are paid pro rata.",
    "Shift types (clause 11.7): afternoon shifts start 11am–4:30pm, evening shifts 5pm–7:30pm and night shifts 8pm–5:30am.",
    "Recruits-in-Training and commissioned officers are excluded from the clause 16.1 shift allowance except as the agreement provides.",
  ],
  notices: [
    "The 1 July 2026 salaries are the last increase written into the agreement, which operates to 30 June 2027. Any later rise depends on a replacement agreement; the parties are required to begin negotiating six months before expiry.",
    "Officers in charge of stations (Schedule H positions) and sergeants on the grandfathered Category A, B and C scales are paid from separate rows of clause 10.1 that are higher than the base rows shown here.",
  ],
  unverified: [
    "Officer-in-charge, Category A/B/C sergeant, Aboriginal Police Liaison Officer and Superintendent/Commander rows are in the agreement but not reproduced here.",
  ],
  sources: [
    {
      title: "Western Australia Police Force Industrial Agreement 2024 (AG 24 of 2025) — clause 10 Salaries and clause 16 Shift Allowance",
      publisher: "Western Australian Industrial Relations Commission",
      url: "https://downloads.wairc.wa.gov.au/agreements/wes338.pdf",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in WA?",
      a: "From 1 July 2026 a first-year WA Police Force constable earns $94,651 a year, and a Senior Constable at the top increment (Increment V) earns $124,558, under the Western Australia Police Force Industrial Agreement 2024.",
    },
    {
      q: "How much does a senior constable earn in Western Australia?",
      a: "Senior Constables earn $115,722 at the base rate rising to $124,558 at Increment V from 1 July 2026. First Class Constables earn $107,977 to $109,553.",
    },
    {
      q: "What are WA police recruits paid?",
      a: "Recruits-in-Training are paid $74,309 a year from 1 July 2026 under the agreement.",
    },
    {
      q: "What does a sergeant earn in WA Police?",
      a: "A sergeant on the standard scale earns $127,619 at the base rate rising to $135,005 at Base Increment IV from 1 July 2026. Sergeants in charge of stations are paid more.",
    },
  ],
};
