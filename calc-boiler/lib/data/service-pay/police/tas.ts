// Tasmania — Tasmania Police salaries (sworn police officers).
//
// Source of every figure: Police Award (S109), latest consolidation Order No 2
// of 2026 (T15311 of 2026), Tasmanian Industrial Commission. The award comes into
// operation from the first full pay period commencing on or after 1 December
// 2025 (clause 4.1). Clause 8.1.1 salary table and clause 19 shift and penalty
// allowances read in full on 24 September 2026.
//
// Clause 8.1.1 prints four columns, all from the first full pay period on or
// after (FFPPOOA) the date shown: "As At 1/12/2024", Column A 1/12/25 (3%),
// Column B 1/12/26 (3%) and Column C 1/12/27 (2.75%). On 24 September 2026 the
// column IN FORCE is Column A (1 December 2025), which is what this file
// publishes; Column B is the next scheduled increase.
//
// Cross-check: Tasmania Police Recruitment's "Benefits" page lists "Base Salary
// as at 1 December 2025" as Trainee $61,801, Level 1 $73,518 … Level 13(ii)
// $107,420 — Column A exactly.
//
// Tasmania has no separate Senior Constable pay scale: Senior Constable is a
// gazetted qualification that accelerates advancement by one level within the
// single Constable range (clause 8.5.2(d)). There is no Senior Sergeant rank in
// the award's salary table.

import type { ServicePayJurisdiction } from "../types";

export const TAS_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  nameInSentence: "Tasmania",
  employer: "Tasmania Police",
  agreementName: "Police Award (Order No 2 of 2026 consolidation)",
  agreementUrl: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0006/854988/T15311-No-2-of-2026-Police-S109.pdf",
  ratesEffectiveFrom: "1 December 2025",
  nextIncrease: {
    date: "1 December 2026",
    detail:
      "A 3% rise from the first full pay period on or after 1 December 2026 is already in the award (Column B): Constable Level 1 goes to $75,724, Level 13(ii) to $110,642 and Trainee to $63,655. A further 2.75% follows from 1 December 2027.",
  },
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "constable",
      title: "Constable (clause 8.1.1, Column A)",
      intro:
        "The single Constable salary range, from the first full pay period on or after 1 December 2025. Senior Constable is not a separate scale in Tasmania — gazettal as a Senior Constable advances an officer one level within this range.",
      stepHeading: "Constable level",
      steps: [
        { label: "Constable Level 1", salary: 73_518, note: "Starting point after graduating from the Trainee Course" },
        { label: "Constable Level 2", salary: 75_973 },
        { label: "Constable Level 3", salary: 78_426 },
        { label: "Constable Level 4", salary: 80_875 },
        { label: "Constable Level 5", salary: 83_326 },
        { label: "Constable Level 6", salary: 85_780 },
        { label: "Constable Level 7", salary: 88_227 },
        { label: "Constable Level 8", salary: 90_680 },
        { label: "Constable Level 9", salary: 93_143 },
        { label: "Constable Level 10", salary: 95_582 },
        { label: "Constable Level 11", salary: 98_027 },
        { label: "Constable Level 12", salary: 101_487 },
        {
          label: "Constable Level 13(i)",
          salary: 104_456,
          note: "After 12 months on Level 12 plus the Sergeant Professional Development Program or an approved tertiary qualification",
        },
        {
          label: "Constable Level 13(ii)",
          salary: 107_420,
          note: "After 12 months on Level 12 plus both the Sergeant Professional Development Program and an approved tertiary qualification",
        },
      ],
    },
    {
      id: "sergeant",
      title: "Sergeant (clause 8.1.1, Column A)",
      intro: "Sergeants, from the first full pay period on or after 1 December 2025.",
      stepHeading: "Sergeant level",
      steps: [
        { label: "Sergeant Level 1", salary: 108_929 },
        { label: "Sergeant Level 2", salary: 111_506 },
        { label: "Sergeant Level 3", salary: 114_079 },
        { label: "Sergeant Level 4", salary: 116_653 },
        { label: "Sergeant Level 5", salary: 120_422 },
        { label: "Sergeant Level 6(i)", salary: 123_022 },
        { label: "Sergeant Level 6(ii)", salary: 125_625 },
      ],
    },
    {
      id: "inspector",
      title: "Inspector (clause 8.1.1, Column A)",
      intro: "Commissioned officers at the rank of Inspector, from the first full pay period on or after 1 December 2025.",
      stepHeading: "Inspector level",
      steps: [
        { label: "Inspector Level 1", salary: 170_026 },
        { label: "Inspector Level 2", salary: 172_004 },
        { label: "Inspector Level 3", salary: 175_712 },
        { label: "Inspector Level 4(i)", salary: 179_684 },
        { label: "Inspector Level 4(ii)", salary: 181_869 },
      ],
    },
  ],
  entryStep: "Constable Level 1",
  topStep: "Constable Level 13(ii)",

  traineePay: [
    "Trainee constables are paid $61,801 a year from the first full pay period on or after 1 December 2025 (the award's \"Trainee\" rate), rising to $63,655 from 1 December 2026.",
    "The award allows the Controlling Authority to pay a Trainee Constable at a salary in the Constable's salary scale (clause 8.3.2).",
  ],
  penalties: [
    "24-hour rotational roster (clause 19.1): constables and sergeants are paid an annual allowance of 28% of normal salary in lieu of shift work and penalty payments, including afternoon, night, Saturday, Sunday and public holiday work.",
    "Non-24-hour rotational roster (clause 19.2): 21% of normal salary in lieu of shift and penalty payments.",
    "Other rosters (clause 19.3), mainly day work with occasional afternoon and weekend shifts: 15% of normal salary.",
    "Physical Surveillance, Police Technical Support (Surveillance) and Special Operations Group members not on a 24-hour roster: 26% of normal salary (clause 19.1(c)).",
  ],
  notices: [
    "Tasmania Police Recruitment says a first-year Constable on Level 1 ($73,518) with the 28% shift penalty allowance has a gross salary of $94,109.",
    "The award already sets rises of 3% from 1 December 2026 and 2.75% from 1 December 2027.",
  ],
  unverified: [
    "Commander and other allowances (specialist, forensic, detective, higher duties) are in the award but not reproduced here.",
  ],
  sources: [
    {
      title: "Police Award — Latest Consolidation, Order No 2 of 2026 (T15311 of 2026), clause 8.1 Salaries and clause 19 Shift and Penalty Allowance",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0006/854988/T15311-No-2-of-2026-Police-S109.pdf",
    },
    {
      title: "Police Award — award history",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/award_history/police",
    },
    {
      title: "Benefits — Salary",
      publisher: "Tasmania Police Recruitment",
      url: "https://recruitment.police.tas.gov.au/about-us/benefits/",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in Tasmania?",
      a: "Under the Police Award, from the first full pay period on or after 1 December 2025 a Constable starts on $73,518 (Level 1) and can reach $107,420 at Level 13(ii). Officers on a 24-hour rotational roster are also paid an allowance of 28% of salary in lieu of shift penalties.",
    },
    {
      q: "What do Tasmania Police trainees get paid?",
      a: "Trainee constables are paid $61,801 a year from 1 December 2025, rising to $63,655 from the first full pay period on or after 1 December 2026.",
    },
    {
      q: "How much does a senior constable earn in Tasmania?",
      a: "Tasmania has no separate Senior Constable pay scale. Being gazetted as a Senior Constable moves an officer up one level within the Constable range, which runs from $73,518 to $107,420 from 1 December 2025.",
    },
    {
      q: "What does a sergeant earn in Tasmania Police?",
      a: "Sergeants earn $108,929 at Level 1 rising to $125,625 at Level 6(ii) from the first full pay period on or after 1 December 2025.",
    },
  ],
};
