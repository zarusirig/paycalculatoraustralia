// New South Wales — Corrective Services NSW correctional officers (J8, 9 Oct 2026).
//
// Salaries: Crown Employees (Public Sector - Salaries 2024) Award, NSW IRC Case
// No. 342428 of 2024 (Vice President Chin, 15 November 2024), Serial C9875,
// Part B Monetary Rates, table "Crown Employees (Correctional Officers,
// Department of Communities and Justice - Corrective Services NSW) Award".
// Read in full (Word version) on 9 October 2026. Clause 3(iii)(c): "a further 3%
// increases to salaries payable with effect from the first full pay period to
// commence on or after 1 July 2026". The award "takes effect from 1 July 2024,
// and remains in force until 30 June 2027" and prints no column after 1.7.26.
//   Table, 1.7.26 column (per annum): Probationary Correctional Officer 77,406;
//   Correctional Officer 1st year 78,821; 2nd year and thereafter 80,292;
//   Correctional Officer, First Class 1st year 84,799; 2nd year and thereafter
//   91,742; Senior Correctional Officer 97,285; Overseer 1st year 84,799, 2nd
//   year and thereafter 91,742; Senior Overseer 97,285. Incidental Allowance
//   (per annum): Probationary officer in training n/a, on graduation 1,272;
//   CO 1st year 1,865; CO 2nd year+ 2,552; First Class 3,816; Senior CO 6,362;
//   Overseers 3,816 / Senior Overseer 6,362. Industries and Maintenance
//   Allowance: Overseer 1st year 12,491; 2nd year+ 5,543; Senior Overseer 10,907.
//
// Conditions: Crown Employees (Correctional Officers, Department of Communities
// and Justice - Corrective Services NSW) Award, reprint Serial C9952, read
// 9 October 2026. Clause 11(ii) shift allowances: early morning 10%, afternoon
// (C or D watch) 15%, night (B watch) 17½%. Clause 16(ii) continuous shift
// workers: Saturday "half time extra", Sunday "three quarter time extra",
// rostered on and working a public holiday "half time extra", six weeks'
// recreation leave a year.

import type { ServicePayJurisdiction } from "../types";

const C9875 = "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/files/C9875.doc/$FILE/C9875.doc";
const C9952 = "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/files/C9952.doc/$FILE/C9952.doc";

export const NSW_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  nameInSentence: "New South Wales",
  employer: "Corrective Services NSW",
  agreementName: "Crown Employees (Public Sector - Salaries 2024) Award",
  agreementUrl: C9875,
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: null,
  verifiedOn: "9 October 2026",

  scales: [
    {
      id: "correctional-officer",
      title: "Correctional officer ranks",
      intro:
        "Crown Employees (Correctional Officers) Award salaries, from the first full pay period on or after 1 July 2026 (a 3% increase). The incidental allowance in each note is paid on top, per year.",
      stepHeading: "Classification",
      steps: [
        { label: "Probationary Correctional Officer", salary: 77_406, note: "Incidental allowance: not paid in training; $1,272 a year on graduation" },
        { label: "Correctional Officer 1st year", salary: 78_821, note: "Incidental allowance $1,865 a year" },
        { label: "Correctional Officer 2nd year and thereafter", salary: 80_292, note: "Incidental allowance $2,552 a year" },
        { label: "Correctional Officer, First Class 1st year", salary: 84_799, note: "Incidental allowance $3,816 a year" },
        { label: "Correctional Officer, First Class 2nd year and thereafter", salary: 91_742, note: "Incidental allowance $3,816 a year" },
        { label: "Senior Correctional Officer", salary: 97_285, note: "Incidental allowance $6,362 a year" },
      ],
    },
    {
      id: "overseer",
      title: "Overseers",
      intro: "The overseer classifications are on the same salary points as the officer ranks, plus the award's industries and maintenance allowance shown in each note.",
      stepHeading: "Classification",
      steps: [
        { label: "Overseer 1st year", salary: 84_799, note: "Industries and maintenance allowance $12,491 a year" },
        { label: "Overseer 2nd year and thereafter", salary: 91_742, note: "Industries and maintenance allowance $5,543 a year" },
        { label: "Senior Overseer", salary: 97_285, note: "Industries and maintenance allowance $10,907 a year" },
      ],
    },
  ],
  entryStep: "Probationary Correctional Officer",
  topStep: "Senior Correctional Officer",

  traineePay: [
    "A new recruit is a Probationary Correctional Officer, paid $77,406 a year from the first full pay period on or after 1 July 2026. The award table marks the incidental allowance as not applicable while the officer is in training; it is $1,272 a year once the officer graduates.",
  ],
  penalties: [
    "Shift allowances, other than at weekends or on public holidays: 10% for an early morning shift (starting before 6 am), 15% for an afternoon shift (C or D watch) and 17½% for a night shift (B watch) (clause 11(ii)).",
    "Continuous shift workers regularly rostered on Sundays and public holidays get half time extra for ordinary time on a Saturday, three quarter time extra on a Sunday, and half time extra when rostered on and working a public holiday, with six weeks' recreation leave a year (clause 16(ii)).",
  ],
  notices: [
    "The 1 July 2026 increase is the last one written into the Crown Employees (Public Sector - Salaries 2024) Award, which remains in force until 30 June 2027. No later rate is published yet.",
  ],
  unverified: [
    "Commissioned ranks (Assistant Superintendent and above), which are on a separate table in the same award.",
    "Overtime, on-call and other allowances in the Crown Employees (Correctional Officers) Award beyond the shift and weekend provisions summarised here.",
  ],
  sources: [
    {
      title: "Crown Employees (Public Sector - Salaries 2024) Award, Serial C9875 — Part B, Correctional Officers table",
      publisher: "NSW Industrial Relations Commission (Industrial Gazette)",
      url: C9875,
    },
    {
      title: "Crown Employees (Correctional Officers, Department of Communities and Justice - Corrective Services NSW) Award — reprint, Serial C9952",
      publisher: "NSW Industrial Relations Commission (Industrial Gazette)",
      url: C9952,
    },
  ],
  faqs: [
    {
      q: "How much does a prison officer earn in NSW?",
      a: "From the first full pay period on or after 1 July 2026, a Probationary Correctional Officer in NSW earns $77,406 a year and a Correctional Officer in their second year or later $80,292. A Senior Correctional Officer earns $97,285. Each also gets an incidental allowance, such as $2,552 a year for a Correctional Officer from the second year.",
    },
    {
      q: "What does a First Class Correctional Officer earn in NSW?",
      a: "$84,799 a year in the first year and $91,742 from the second year, plus an incidental allowance of $3,816 a year, from the first full pay period on or after 1 July 2026.",
    },
    {
      q: "Do NSW correctional officers get shift penalties?",
      a: "Yes. The award pays 10% for an early morning shift, 15% for an afternoon shift and 17½% for a night shift. Continuous shift workers also get half time extra on Saturdays and three quarter time extra on Sundays.",
    },
  ],
};
