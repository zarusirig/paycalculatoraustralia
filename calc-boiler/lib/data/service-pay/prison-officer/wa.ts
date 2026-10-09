// Western Australia — Department of Justice prison officers (J8, 9 Oct 2026).
//
// Source: Department of Justice Prison Officers' Industrial Agreement 2024
// (AG 22 of 2025, 2025 WAIRC 00321), Schedule A – Annualised Salaries. Read in
// full on 9 October 2026 from the WAIRC PDF. Schedule A prints three columns:
// first pay period on or after 11 June 2024, 11 June 2025 and 11 June 2026. The
// column IN FORCE is 11 June 2026, published here. Clause 5.1: the agreement
// runs until 10 June 2027 or until replaced; no later column is printed.
//   11 June 2026 (annualised / fortnightly): Trainee Prison Officer (38 Hours)
//   75,520 / 2,895.34. Prison Officer (Mon-Fri): 1st Year 78,881; 2nd Year
//   81,516; 3rd Year 84,836; 4-5 Year 86,785; 6-7 year 88,287; Thereafter
//   89,823. Prison Officer (Shift): 97,610; 100,871; 104,980; 107,391; 109,250;
//   111,150. ASO / First Class Officer (Mon-Fri) 1-2 years 90,330, Thereafter
//   91,903; (Shifts) 111,778, 113,724.
// Clause 39.5: the shift annualised salary "incorporates the Monday to Friday
// rate … and a component in lieu of shift penalty payments, Public Holidays and
// Accrued Days Off". Clause 18: trainees undergoing the entry-level training
// program work 38 hours a week, no overtime; work placement shifts attract 15%
// (weekday afternoon or night), 50% (Saturday) and 75% (Sunday); on completing
// training they are paid at least the Prison Officer 1st Year rate.

import type { ServicePayJurisdiction } from "../types";

const DEP180 = "https://downloads.wairc.wa.gov.au/agreements/dep180.pdf";

export const WA_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  nameInSentence: "Western Australia",
  employer: "Department of Justice (WA)",
  agreementName: "Department of Justice Prison Officers' Industrial Agreement 2024",
  agreementUrl: DEP180,
  ratesEffectiveFrom: "11 June 2026",
  nextIncrease: null,
  verifiedOn: "9 October 2026",
  hubNote: "Monday–Friday salary; shift officers are on a higher annualised salary that replaces shift penalties.",

  scales: [
    {
      id: "prison-officer-mon-fri",
      title: "Prison Officer (Monday to Friday)",
      intro: "Schedule A annualised salaries from the first pay period on or after 11 June 2026, for officers working Monday to Friday.",
      stepHeading: "Year of service",
      steps: [
        { label: "Prison Officer 1st Year (Mon–Fri)", salary: 78_881, note: "$3,024.17 a fortnight" },
        { label: "Prison Officer 2nd Year (Mon–Fri)", salary: 81_516 },
        { label: "Prison Officer 3rd Year (Mon–Fri)", salary: 84_836 },
        { label: "Prison Officer 4–5 Year (Mon–Fri)", salary: 86_785 },
        { label: "Prison Officer 6–7 Year (Mon–Fri)", salary: 88_287 },
        { label: "Prison Officer Thereafter (Mon–Fri)", salary: 89_823, note: "$3,443.68 a fortnight" },
      ],
    },
    {
      id: "prison-officer-shift",
      title: "Prison Officer (shift)",
      intro:
        "Annualised salaries for shift officers, which include a component in lieu of shift penalties, public holidays and accrued days off (clause 39.5).",
      stepHeading: "Year of service",
      steps: [
        { label: "Prison Officer 1st Year (Shift)", salary: 97_610, note: "$3,742.25 a fortnight" },
        { label: "Prison Officer 2nd Year (Shift)", salary: 100_871 },
        { label: "Prison Officer 3rd Year (Shift)", salary: 104_980 },
        { label: "Prison Officer 4–5 Year (Shift)", salary: 107_391 },
        { label: "Prison Officer 6–7 Year (Shift)", salary: 109_250 },
        { label: "Prison Officer Thereafter (Shift)", salary: 111_150, note: "$4,261.35 a fortnight" },
      ],
    },
    {
      id: "first-class-officer",
      title: "ASO / First Class Officer",
      intro: "Schedule A, from the first pay period on or after 11 June 2026.",
      stepHeading: "Classification",
      steps: [
        { label: "ASO / First Class Officer 1–2 years (Mon–Fri)", salary: 90_330 },
        { label: "ASO / First Class Officer thereafter (Mon–Fri)", salary: 91_903 },
        { label: "ASO / First Class Officer 1–2 years (Shift)", salary: 111_778 },
        { label: "ASO / First Class Officer thereafter (Shift)", salary: 113_724 },
      ],
    },
  ],
  entryStep: "Prison Officer 1st Year (Mon–Fri)",
  topStep: "Prison Officer Thereafter (Mon–Fri)",

  traineePay: [
    "A Trainee Prison Officer is paid an annualised salary of $75,520 ($2,895.34 a fortnight) on a 38-hour week from the first pay period on or after 11 June 2026, and is not required to work overtime while in the entry-level training program (clause 18.2).",
    "Work placement shifts during training attract 15% for weekday afternoon or night shifts, 50% on Saturdays and 75% on Sundays. After completing training, the officer is paid at least the Prison Officer 1st Year rate for the rest of probation (clause 18.4).",
  ],
  penalties: [
    "Shift officers are not paid separate shift, weekend or public holiday penalties for ordinary hours: their annualised salary already includes a component in lieu of shift penalty payments, public holidays and accrued days off (clause 39.5). That is why the shift scale sits about $18,700 a year above the Monday to Friday scale at the first year.",
  ],
  notices: [
    "The 11 June 2026 column is the last increase printed in the agreement, which runs until 10 June 2027 or until a replacement agreement is registered.",
  ],
  unverified: [
    "Senior Officer and Principal Officer rows, and casual rates, which are in the same Schedule A but not reproduced here.",
  ],
  sources: [
    {
      title: "Department of Justice Prison Officers' Industrial Agreement 2024 (AG 22 of 2025) — Schedule A, Annualised Salaries",
      publisher: "Western Australian Industrial Relations Commission",
      url: DEP180,
    },
  ],
  faqs: [
    {
      q: "How much does a prison officer earn in WA?",
      a: "From the first pay period on or after 11 June 2026, a WA prison officer on shift work earns $97,610 in the first year and $111,150 after 7 years, as an annualised salary that includes shift penalties and public holidays. On a Monday to Friday roster the salary is $78,881 rising to $89,823.",
    },
    {
      q: "What do trainee prison officers earn in WA?",
      a: "$75,520 a year ($2,895.34 a fortnight) on a 38-hour week while in the entry-level training program, then at least the Prison Officer 1st Year rate once training is complete.",
    },
    {
      q: "Do WA prison officers get shift penalties?",
      a: "Not as separate payments for ordinary hours. Shift officers are paid a higher annualised salary that replaces shift penalties, public holidays and accrued days off — $97,610 against $78,881 for a Monday to Friday officer in the first year.",
    },
  ],
};
