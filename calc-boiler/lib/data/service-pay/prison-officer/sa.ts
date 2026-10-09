// South Australia — Department for Correctional Services correctional officers
// (J8, 9 Oct 2026).
//
// Source: South Australian Public Sector Enterprise Agreement: Salaried 2026
// (SAET case ET-26-00776), Schedule 1.12: Correctional Officers. "This
// Agreement shall come into force on and from 4 March 2026". Read in full on
// 9 October 2026 from the Attorney-General's Department PDF (the file name
// still says 2021; the content is the 2026 agreement). Schedule 1.12 prints
// columns "Current", "First full pay period on or after 1 August 2025", "First
// full pay period on or after 1 July 2026" and "… 1 July 2027". The column IN
// FORCE is 1 July 2026, published here; 1 July 2027 is the next increase.
//   1 July 2026: CO-1 1st–6th year adult $59,406, $61,125, $62,156, $63,273,
//   $64,218, $65,247; CO-2 increments 1–5 $67,993, $69,807, $71,057, $73,658,
//   $75,134; CO-3 increments 1–4 $76,500, $78,151, $80,349, $84,000; CO-4
//   increments 1–5 $86,274, $88,162, $90,012, $92,230, $93,290. 1 July 2027:
//   CO-1 1st year adult $61,853.
// Schedule descriptors: CO-1 works "under close direction … Training is a
// predominant feature of this level"; CO-2 applies skills from "successful
// completion of Certificate III in Correctional Practice"; CO-3 includes
// Advanced Correctional Officers (Certificate IV in Correctional Practice and
// 12 months at the top of CO-2); CO-4 "may provide supervision and leadership
// to a small team of Correctional Officers".
//
// Shift and weekend penalties sit in Part 9 of the SA Public Sector Salaried
// Employees Interim Award, which was not read, so none are published.

import type { ServicePayJurisdiction } from "../types";

const SA_EA = "https://www.agd.sa.gov.au/industrial-relations/current-agreements/SA-Public-Sector-Enterprise-Agreement-Salaried-2021.pdf";

export const SA_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "sa",
  code: "SA",
  name: "South Australia",
  nameInSentence: "South Australia",
  employer: "Department for Correctional Services (SA)",
  agreementName: "South Australian Public Sector Enterprise Agreement: Salaried 2026",
  agreementUrl: SA_EA,
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: {
    date: "1 July 2027",
    detail: "The agreement already prints the next column, from the first full pay period on or after 1 July 2027: CO-1 1st year adult goes to $61,853.",
  },
  verifiedOn: "9 October 2026",

  scales: [
    {
      id: "correctional-officer-co1-co3",
      title: "Correctional Officer CO-1 to CO-3",
      intro:
        "Schedule 1.12, from the first full pay period on or after 1 July 2026. CO-1 is the training level, CO-2 follows the Certificate III in Correctional Practice, and CO-3 includes Advanced Correctional Officers with a Certificate IV.",
      stepHeading: "Level and increment",
      steps: [
        { label: "CO-1 1st year adult", salary: 59_406 },
        { label: "CO-1 2nd year adult", salary: 61_125 },
        { label: "CO-1 3rd year adult", salary: 62_156 },
        { label: "CO-1 4th year adult", salary: 63_273 },
        { label: "CO-1 5th year adult", salary: 64_218 },
        { label: "CO-1 6th year adult", salary: 65_247 },
        { label: "CO-2 increment 1", salary: 67_993 },
        { label: "CO-2 increment 2", salary: 69_807 },
        { label: "CO-2 increment 3", salary: 71_057 },
        { label: "CO-2 increment 4", salary: 73_658 },
        { label: "CO-2 increment 5", salary: 75_134 },
        { label: "CO-3 increment 1", salary: 76_500 },
        { label: "CO-3 increment 2", salary: 78_151 },
        { label: "CO-3 increment 3", salary: 80_349 },
        { label: "CO-3 increment 4", salary: 84_000 },
      ],
    },
    {
      id: "correctional-officer-co4",
      title: "Correctional Officer CO-4 (team supervision)",
      intro: "Schedule 1.12, from the first full pay period on or after 1 July 2026. CO-4 may supervise and lead a small team of correctional officers.",
      stepHeading: "Increment",
      steps: [
        { label: "CO-4 increment 1", salary: 86_274 },
        { label: "CO-4 increment 2", salary: 88_162 },
        { label: "CO-4 increment 3", salary: 90_012 },
        { label: "CO-4 increment 4", salary: 92_230 },
        { label: "CO-4 increment 5", salary: 93_290 },
      ],
    },
  ],
  entryStep: "CO-1 1st year adult",
  topStep: "CO-3 increment 4",

  traineePay: [
    "New officers start at CO-1, a level where \"training is a predominant feature\". An adult CO-1 in the first year is paid $59,406 from the first full pay period on or after 1 July 2026; the agreement also has junior CO-1 rates for officers aged 20 and under.",
  ],
  penalties: [],
  notices: [
    "These are base salaries. Shift, weekend and public holiday penalties for correctional officers are set by Part 9 of the SA Public Sector Salaried Employees Interim Award, which we have not reproduced.",
  ],
  unverified: [
    "Shift, weekend and public holiday penalties (Part 9 of the SA Public Sector Salaried Employees Interim Award).",
    "CO-5 to CO-7 management levels and junior CO-1 rates, which are in Schedule 1.12 but not reproduced here.",
  ],
  sources: [
    {
      title: "South Australian Public Sector Enterprise Agreement: Salaried 2026 (ET-26-00776) — Schedule 1.12 Correctional Officers",
      publisher: "Attorney-General's Department (SA)",
      url: SA_EA,
    },
  ],
  faqs: [
    {
      q: "How much does a correctional officer earn in South Australia?",
      a: "From the first full pay period on or after 1 July 2026, an adult CO-1 starts on $59,406 a year. After the Certificate III, CO-2 runs from $67,993 to $75,134, and an Advanced Correctional Officer at CO-3 earns $76,500 to $84,000. These are base salaries before shift penalties.",
    },
    {
      q: "When is the next pay rise for SA correctional officers?",
      a: "From the first full pay period on or after 1 July 2027, when CO-1 1st year adult rises to $61,853 under the agreement's next column.",
    },
  ],
};
