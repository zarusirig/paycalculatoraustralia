// New South Wales — NSW Police Force salaries (sworn non-commissioned officers).
//
// Source of every figure: Crown Employees (Police Officers - 2024) Award, made
// by the IRC NSW on 19 December 2024 (effective 1 July 2024) and published in
// the NSW Industrial Gazette as Serial C9945 (Vol 397, p.1238, 9 May 2025),
// Part B, Monetary Rates, Table 1b. Read in full (Word version) on 24 September
// 2026.
//
// The award prints three Table 1b columns — from the first full pay period on
// or after 1 July 2024 (4%), 1 July 2025 (4%) and 1 July 2026 (5%). On
// 24 September 2026 the column IN FORCE is 1 July 2026, which is what this file
// publishes. The award runs to 30 June 2027 (clause 95.2) and prints no later
// column, so there is no scheduled next increase in the instrument.
//
// Row labels: the award as published wrote "Senior Constable Year 1",
// "Sergeant 1st Year" etc. The variation published as Serial C10037 (Vol 398,
// p.421, 28 October 2025, made 12 September 2025) deleted "Year" and inserted
// "Level" under Rank/Incremental Level in Table 1b (and wrote "Sergeant Level
// 5" in clause 50.2), so the labels below use "Level". C10037 did not change any
// Table 1b dollar amount. The IRC NSW awards index (checked 24 September 2026)
// lists no later variation.
//
// `salary` is the award's "Base Salary" column. The award also prints a
// "Loaded Salary" (base + the 11.5% clause 40 loading); that figure is quoted in
// each row's note. NSW Police recruitment quotes loaded salaries — its
// salary page still showed the 1 July 2025 loaded figures when read.

import type { ServicePayJurisdiction } from "../types";

export const NSW_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  nameInSentence: "New South Wales",
  employer: "NSW Police Force",
  agreementName: "Crown Employees (Police Officers - 2024) Award",
  agreementUrl: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9945",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "constable-to-senior-constable",
      title: "Probationary Constable to Senior Constable (Table 1b)",
      intro:
        "Non-commissioned officers other than detectives and police prosecutors, from the first full pay period on or after 1 July 2026 (a 5% increase).",
      stepHeading: "Rank / incremental level",
      steps: [
        { label: "Probationary Constable (Level 1)", salary: 83_028, note: "Loaded salary (base + 11.5%): $92,576" },
        { label: "Constable Level 2", salary: 86_162, note: "Loaded salary: $96,071" },
        { label: "Constable Level 3", salary: 89_292, note: "Loaded salary: $99,561" },
        { label: "Constable Level 4", salary: 92_422, note: "Loaded salary: $103,051" },
        { label: "Constable Level 5", salary: 93_993, note: "Loaded salary: $104,802" },
        { label: "Senior Constable Level 1", salary: 103_399, note: "Loaded salary: $115,290" },
        { label: "Senior Constable Level 2", salary: 109_661, note: "Loaded salary: $122,272" },
        { label: "Senior Constable Level 3", salary: 115_928, note: "Loaded salary: $129,260" },
        { label: "Senior Constable Level 4", salary: 119_058, note: "Loaded salary: $132,750" },
        { label: "Senior Constable Level 5", salary: 125_281, note: "Loaded salary: $139,688 — top of the constable ranks" },
      ],
    },
    {
      id: "sergeant",
      title: "Sergeant (Table 1b)",
      intro: "Sergeants other than detectives and police prosecutors, from the first full pay period on or after 1 July 2026.",
      stepHeading: "Rank / incremental level",
      steps: [
        { label: "Sergeant Level 1", salary: 128_457, note: "Loaded salary: $143,230" },
        { label: "Sergeant Level 2", salary: 133_154, note: "Loaded salary: $148,467" },
        { label: "Sergeant Level 3", salary: 136_290, note: "Loaded salary: $151,963" },
        { label: "Sergeant Level 4", salary: 139_426, note: "Loaded salary: $155,460" },
        { label: "Sergeant Level 5", salary: 140_989, note: "Loaded salary: $157,203" },
      ],
    },
    {
      id: "senior-sergeant",
      title: "Senior Sergeant (Table 1b)",
      intro: "Senior sergeants other than detectives and police prosecutors, from the first full pay period on or after 1 July 2026.",
      stepHeading: "Rank / incremental level",
      steps: [
        { label: "Senior Sergeant Level 1", salary: 144_118, note: "Loaded salary: $160,692" },
        { label: "Senior Sergeant Level 2", salary: 146_411, note: "Loaded salary: $163,248" },
        { label: "Senior Sergeant Level 3", salary: 148_703, note: "Loaded salary: $165,804" },
      ],
    },
  ],
  entryStep: "Probationary Constable (Level 1)",
  topStep: "Senior Constable Level 5",

  traineePay: [
    "NSW Police Force recruitment says Student Police Officers are not employed during Session 1 of the Constable Education Program, which is delivered by distance education.",
    "For Session 2 (16 weeks at the Academy), the recruitment page says Student Police Officers are employed on a temporary fixed-term arrangement and paid a salary of $1,360 per week plus superannuation and allowances. The page introduces this arrangement \"from March 2024\" and does not say whether the weekly rate has since been increased.",
  ],
  penalties: [
    "Clause 40 loading: non-commissioned officers are paid an extra 11.5% of salary as a loading for weekend work, shift work, recall to duty and other incidents of employment, which also replaces annual leave loading. The award's \"Loaded Salary\" column is base salary plus this 11.5%.",
    "Clause 50 shift allowance, per full shift worked: 10% for shifts starting from 10am to before 1pm or from 4am to before 6am (\"C\" shift), 15% from 1pm to before 4pm (\"A\" shift), 17.5% from 4pm to before 4am (\"B\" shift); day shifts starting 6am to before 10am attract 0%. The percentage is applied to a formula based on the Sergeant Level 5 salary, not the officer's own salary.",
  ],
  notices: [
    "The award's final pay increase is the 5% from the first full pay period on or after 1 July 2026, and the award runs until 30 June 2027. The NSW Government's November 2024 announcement of the deal said the loaded Probationary Constable salary would rise to $97,206 by 2027, but no 2027 rate is written into the award yet — it is not published here as a scheduled increase.",
    "Leading Senior Constable is no longer an open classification under the 2024 award. Officers already appointed have their higher rate preserved under Table 1a; those preserved rates are not reproduced here.",
    "Detectives (Table 2b) and police prosecutors (Table 3b) are paid on separate scales that include a special duties allowance component, and commissioned officers (Inspector and above) are on Tables 4a–4b. They are not reproduced here.",
  ],
  unverified: [
    "Student Police Officer pay is quoted from the NSW Police Force recruitment page, not from the award, and the page does not date the $1,360 weekly rate.",
    "Allowances beyond the clause 40 loading and clause 50 shift allowance (special duties, field training, on-call, remote area, detectives' and prosecutors' allowances) are not listed here.",
  ],
  sources: [
    {
      title: "Crown Employees (Police Officers - 2024) Award, Serial C9945 (397 I.G. 1238, 9 May 2025) — Part B, Table 1b",
      publisher: "NSW Industrial Relations Commission (Industrial Gazette)",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9945",
    },
    {
      title: "Crown Employees (Police Officers - 2024) Award — variation, Serial C10037 (398 I.G. 421, 28 October 2025)",
      publisher: "NSW Industrial Relations Commission (Industrial Gazette)",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C10037",
    },
    {
      title: "Index to awards: C — Crown Employees (Police Officers - 2024) Award",
      publisher: "NSW Industrial Relations Commission",
      url: "https://irc.nsw.gov.au/industrial-instruments/awards/IRC_procedures_legislation_awards_index_C.html",
    },
    {
      title: "Salary and benefits",
      publisher: "NSW Police Force Recruitment",
      url: "https://www.police.nsw.gov.au/recruitment/careers_and_salary/salary_and_benefits",
    },
    {
      title: "Historic award agreement accepted by NSW Police officers",
      publisher: "NSW Government",
      url: "https://www.nsw.gov.au/media-releases/historic-award-agreement-accepted-by-nsw-police-officers",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in NSW?",
      a: "Under the Crown Employees (Police Officers - 2024) Award, from the first full pay period on or after 1 July 2026 a Probationary Constable's base salary is $83,028 and a Senior Constable Level 5 earns $125,281. Non-commissioned officers are also paid an 11.5% loading on top, which makes those figures $92,576 and $139,688.",
    },
    {
      q: "How much does a senior constable earn in NSW?",
      a: "A Senior Constable's base salary runs from $103,399 at Level 1 to $125,281 at Level 5 from 1 July 2026. With the 11.5% loading that is $115,290 to $139,688.",
    },
    {
      q: "What does a sergeant earn in the NSW Police Force?",
      a: "Sergeants earn a base salary of $128,457 at Level 1 rising to $140,989 at Level 5, and Senior Sergeants $144,118 to $148,703, from the first full pay period on or after 1 July 2026.",
    },
    {
      q: "Are NSW student police officers paid?",
      a: "Not during Session 1 of the Constable Education Program, which is studied by distance. NSW Police Force recruitment says students are employed for Session 2 at the Academy and paid $1,360 a week plus superannuation and allowances; the page does not say whether that weekly rate has been updated since it was introduced in March 2024.",
    },
  ],
};
