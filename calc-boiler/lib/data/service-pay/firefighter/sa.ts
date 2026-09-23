// South Australia — SA Metropolitan Fire Service (MFS) career firefighter pay.
//
// Source of every figure: South Australian Metropolitan Fire Service
// Enterprise Agreement 2025, approved by the South Australian Employment
// Tribunal (Commissioner Kaur, case ET-26-00004), in force from 19 February
// 2026 with a nominal expiry of 1 January 2028. Published by the SA
// Attorney-General's Department (the PDF's file name still says "2022", but
// the document is the 2025 agreement). Read in full on 24 September 2026.
//
// Appendix A "Total Wage Schedule Permanent Full Time Firefighters" prints
// WEEKLY total wages in columns: 1 Jan 2025 → public-holiday adjustment
// (1.8925%) and 4% from the first full pay period (FFPP) on or after 1 January
// 2026 → a $3,000 base uplift from the FFPP on or after 1 July 2026 (clause
// 15B) → 3.5% from 1 Jan 2027 → 3% from 1 Jan 2028. On 24 September 2026 the
// column IN FORCE is the 1 July 2026 uplift column, which is what this file
// publishes.
//
// "Total Wage" is the weekly wage entitlement at Appendix A (clause 6
// definitions; same meaning as clause 3.15 of the Award). Annual figures are
// weekly × 52.143, rounded to the dollar; each `note` quotes the weekly rate.

import type { ServicePayJurisdiction } from "../types";

export const SA_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "sa",
  code: "SA",
  name: "South Australia",
  nameInSentence: "South Australia",
  employer: "SA Metropolitan Fire Service (MFS)",
  agreementName: "South Australian Metropolitan Fire Service Enterprise Agreement 2025",
  agreementUrl:
    "https://www.agd.sa.gov.au/industrial-relations/current-agreements/SA-Metropolitan-Fire-Service-Enterprise-Agreement-2022.pdf",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: {
    date: "1 January 2027",
    detail:
      "A 3.5% increase from the first full pay period on or after 1 January 2027, already printed in Appendix A: Recruit Firefighter $1,715.19, First Class Firefighter Level 3 $2,413.58, Senior Firefighter Level 2B $2,672.47 and Station Officer Level 1 $2,828.46 per week. A further 3% follows from 1 January 2028.",
  },
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "firefighters",
      title: "Firefighters (Appendix A — total weekly wage)",
      intro:
        "Permanent full-time MFS firefighters from recruit through the Fourth, Third, Second and First Class ranks to Senior Firefighter.",
      stepHeading: "Rank",
      steps: [
        { label: "Recruit Firefighter", salary: 86_411, note: "$1,657.19 per week" },
        { label: "Fourth Class Firefighter", salary: 100_912, note: "$1,935.30 per week" },
        { label: "Third Class Firefighter", salary: 102_973, note: "$1,974.82 per week" },
        { label: "Second Class Firefighter", salary: 107_104, note: "$2,054.04 per week" },
        { label: "First Class Firefighter Level 1", salary: 111_263, note: "$2,133.81 per week" },
        { label: "First Class Firefighter Level 2", salary: 116_394, note: "$2,232.20 per week" },
        { label: "First Class Firefighter Level 3", salary: 121_595, note: "$2,331.96 per week" },
        { label: "Senior Firefighter Level 1", salary: 126_779, note: "$2,431.38 per week" },
        { label: "Senior Firefighter Level 2", salary: 129_400, note: "$2,481.63 per week" },
        { label: "Senior Firefighter Level 2A", salary: 132_019, note: "$2,531.87 per week" },
        { label: "Senior Firefighter Level 2B", salary: 134_638, note: "$2,582.10 per week" },
      ],
    },
    {
      id: "officers",
      title: "Officers (Appendix A — total weekly wage)",
      intro: "MFS Station Officers and Commanders.",
      stepHeading: "Rank",
      steps: [
        { label: "Station Officer Level 1", salary: 142_497, note: "$2,732.81 per week" },
        { label: "Station Officer Level 2", salary: 153_231, note: "$2,938.67 per week" },
        { label: "Station Officer Level 3", salary: 161_076, note: "$3,089.12 per week" },
        { label: "Commander Level 1", salary: 168_921, note: "$3,239.57 per week" },
        { label: "Commander Level 2", salary: 177_943, note: "$3,412.59 per week" },
        { label: "Commander Level 3", salary: 184_698, note: "$3,542.15 per week" },
      ],
    },
  ],
  entryStep: "Recruit Firefighter",
  topStep: "Senior Firefighter Level 2B",

  traineePay: [
    "Recruit Firefighters are paid $1,657.19 per week from 1 July 2026 (about $86,411 a year).",
    "Clause 15C lifted the Recruit Firefighter rate to 85% of the Fourth Class Firefighter rank from the first full pay period on or after 1 January 2026 — the recruit rate went from $1,187.12 per week (1 January 2025) to $1,575.97 per week (1 January 2026).",
  ],
  penalties: [
    "Rates are total weekly wages. The 1 January 2026 column also includes a 1.8925% public holiday adjustment, and from 1 July 2026 a $3,000-a-year base uplift reflecting rescue qualification and advanced skills (clause 15B).",
    "The normal hourly rate is the Appendix A total wage divided by 40 (clause 6 definitions).",
    "Senior Firefighter Level 2A employees who are eligible and willing to act up to Station Officer are paid an extra amount (set at $50.23 per week and increased in line with the agreement's wage increases) on top of their total wage (clause 31.4).",
  ],
  notices: [
    "The 2025 agreement came into force on 19 February 2026. Its first increases (4% plus the public holiday adjustment) were back-dated to the first full pay period on or after 1 January 2026 (clause 8.4).",
    "The agreement's nominal expiry date is 1 January 2028; negotiations for a new agreement must start at least six months before that.",
  ],
  unverified: [
    "Assistant Chief Fire Officer, marine and communications classifications are printed in Appendix A but are not shown here.",
    "Retained (part-time, on-call) firefighters are paid differently (an annual retainer plus hourly rates) and are not shown.",
  ],
  sources: [
    {
      title: "South Australian Metropolitan Fire Service Enterprise Agreement 2025 (SAET approval, case ET-26-00004)",
      publisher: "Attorney-General's Department (SA) / South Australian Employment Tribunal",
      url: "https://www.agd.sa.gov.au/industrial-relations/current-agreements/SA-Metropolitan-Fire-Service-Enterprise-Agreement-2022.pdf",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in South Australia?",
      a: "An MFS First Class Firefighter Level 3 earns $2,331.96 a week (about $121,595 a year) and a Senior Firefighter Level 2B $2,582.10 a week (about $134,638) from 1 July 2026. These are total weekly wages under the MFS Enterprise Agreement 2025.",
    },
    {
      q: "What is a recruit firefighter's salary in South Australia?",
      a: "A Recruit Firefighter with the SA Metropolitan Fire Service is paid $1,657.19 a week from 1 July 2026, about $86,411 a year. On graduating to Fourth Class Firefighter the rate is $1,935.30 a week.",
    },
    {
      q: "How much does a station officer earn in South Australia?",
      a: "MFS Station Officers earn from $2,732.81 a week (Level 1, about $142,497 a year) to $3,089.12 a week (Level 3, about $161,076 a year) from 1 July 2026.",
    },
    {
      q: "When is the next pay rise for SA firefighters?",
      a: "A 3.5% increase applies from the first full pay period on or after 1 January 2027, taking a Recruit Firefighter to $1,715.19 a week and a Senior Firefighter Level 2B to $2,672.47. A further 3% follows from 1 January 2028.",
    },
  ],
};
