// Northern Territory — public school teacher salaries.
//
// Source of every figure: Schedule 4, item 4.1 (Classifications and Salaries)
// of the Northern Territory Public Sector Educators' 2024-2027 Enterprise
// Agreement, approved by the Fair Work Commission on 31 October 2024 with a
// nominal expiry of 31 December 2027. Read on 28 August 2026.
//
// Clause 33.3 makes three increases of 4.3%: 11 October 2024, 1 January 2026
// and 1 January 2027. On 28 August 2026 the column in force is 1 January 2026,
// which is what this file publishes.
//
// Cross-check: the Office of the Commissioner for Public Employment's own
// "Teachers and educators" rates page states "Rates effective 1 January 2026"
// and publishes the same numbers as the agreement's 1 January 2026 column.
//
// Two things deliberately NOT published here:
//   - There is no Assistant Principal or Deputy Principal salary classification
//     in the NT. "Assistant Principal" appears in the agreement only as a
//     workload rule (clause 95.11). NT leadership pay is Senior Teacher ST1-ST8
//     and Principal PLO1-PLO7.
//   - Executive contract principal (PLEC) figures are TOTAL REMUNERATION
//     PACKAGES including superannuation and vehicle, not base salaries, so they
//     are not mixed into the tables below.

import type { TeacherPayState } from "./types";

export const NT_TEACHER_PAY: TeacherPayState = {
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  nameInSentence: "the Northern Territory",
  employer: "the NT Department of Education",
  agreementName: "Northern Territory Public Sector Educators' 2024-2027 Enterprise Agreement",
  agreementUrl:
    "https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/teachers-and-educators",
  ratesEffectiveFrom: "the first full pay period on or after 1 January 2026",
  nextIncrease: {
    date: "1 January 2027",
    detail:
      "A further 4.3% from the first full pay period on or after 1 January 2027, already written into clause 33.3. That takes CT1 to $100,316 and CT9 to $142,888.",
  },
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers — CT1 to CT9",
      intro:
        "The main scale. Your entry classification is set by completed years of post-qualification service: less than 12 months starts at CT1, one year at CT2, and so on.",
      stepHeading: "Classification",
      steps: [
        { label: "CT1", salary: 96_180, note: "Under 12 months post-qualification experience" },
        { label: "CT2", salary: 100_777 },
        { label: "CT3", salary: 105_369 },
        { label: "CT4", salary: 109_962, note: "Target of the Rapid Incremental Progression scheme" },
        { label: "CT5", salary: 117_567 },
        { label: "CT6", salary: 122_162 },
        { label: "CT7", salary: 126_755 },
        { label: "CT8", salary: 131_349 },
        { label: "CT9", salary: 136_997, note: "Top of the classroom teacher scale" },
      ],
    },
    {
      id: "senior-teachers",
      title: "Senior teachers — ST1 to ST8",
      intro:
        "Promotion-based classifications, not steps you age into. Levels are set by the NTPS Job Evaluation System against the NTPS Capability Framework.",
      stepHeading: "Classification",
      steps: [
        { label: "ST1", salary: 145_286 },
        { label: "ST2", salary: 151_040 },
        { label: "ST3", salary: 160_531 },
        { label: "ST4", salary: 165_076 },
        { label: "ST5", salary: 176_487 },
        { label: "ST6", salary: 182_064 },
        { label: "ST7", salary: 188_515 },
        { label: "ST8", salary: 196_907 },
      ],
    },
    {
      id: "principals",
      title: "Principals — PLO1 to PLO7 (non-contract)",
      intro:
        "Each principal band has two pay points. Levels are promotion-based and set by the NTPS Job Evaluation System; movement between the two points within a band is by the pay progression scheme.",
      stepHeading: "Classification",
      steps: [
        { label: "PLO 1.1", salary: 147_068 },
        { label: "PLO 1.2", salary: 150_012 },
        { label: "PLO 2.1", salary: 151_040 },
        { label: "PLO 2.2", salary: 155_571 },
        { label: "PLO 3.1", salary: 160_531 },
        { label: "PLO 3.2", salary: 168_559 },
        { label: "PLO 4.1", salary: 174_548 },
        { label: "PLO 4.2", salary: 179_784 },
        { label: "PLO 5.1", salary: 185_925 },
        { label: "PLO 5.2", salary: 191_503 },
        { label: "PLO 6.1", salary: 197_286 },
        { label: "PLO 6.2", salary: 203_205 },
        { label: "PLO 7.1", salary: 208_126 },
        { label: "PLO 7.2", salary: 214_369, note: "Top of the non-contract principal scale" },
      ],
    },
    {
      id: "aboriginal-team-teachers",
      title: "Aboriginal team teachers — AT1 to AT7, and authorised persons",
      intro:
        "A separate NT classification structure with its own salary scale under the same agreement.",
      stepHeading: "Classification",
      steps: [
        { label: "AT1", salary: 61_415 },
        { label: "AT2", salary: 66_888 },
        { label: "AT3", salary: 71_646 },
        { label: "AT4", salary: 79_229 },
        { label: "AT5", salary: 85_408 },
        { label: "AT6", salary: 88_145 },
        { label: "AT7", salary: 90_881 },
        { label: "Authorised persons", salary: 91_587 },
      ],
    },
  ],

  casual: [],

  progression: [
    {
      heading: "You start at the classification your completed years buy",
      body: [
        "Clause 37.4: a teacher with less than 12 months of post-qualification experience commences as a CT1. A teacher with more than 12 months is appointed at a classification that recognises their completed years of service — one year of experience means CT2, and so on.",
        "The recognition is done under the Salary Assessment Procedure, and only completed years count.",
      ],
    },
    {
      heading: "One increment every 12 months, and it is hard to withhold",
      body: [
        "Clause 39.2: employees are entitled to increments within the scale for their substantive designation after completing 12 months service, continuous or broken. A second or subsequent increment is not payable until the previous one has been held for 12 months.",
        "The NT agreement goes further than most: the parties agree an annual increment for teachers will only be withheld as an outcome of inability or discipline procedures under the PSEM Act. It is not a performance-rating decision.",
      ],
    },
    {
      heading: "Rapid Incremental Progression can skip you to CT4",
      body: [
        "Clause 39.3 lets an early career teacher advance to CT4 at the start of their third year of teaching, instead of arriving at CT3. To qualify you must complete your first two years of service in NT Government schools within a four-year period, and successfully complete two semester units of study toward a postgraduate qualification within those first two years.",
        "Relief teaching in NT Government schools counts, where 180 days equals one year of service.",
      ],
    },
    {
      heading: "Senior teacher and principal are promotions, not steps",
      body: [
        "Clauses 37.5 and 37.6: the ST1-ST8 and PLO1-PLO7 levels are promotion-based classifications determined by the NTPS Job Evaluation System, with capability requirements set out in the NTPS Capability Framework. You do not increment into them.",
      ],
    },
    {
      heading: "Principals move within a band only on performance",
      body: [
        "Clause 40: pay progression for principals is based on high performance and is not automatic. Participation is not mandatory and applications are at the principal's discretion.",
        "To be eligible you need at least 12 months service at a principal classification, a 12-month performance agreement with satisfactory performance against it, and a submission made in advance of the annual assessment date demonstrating at least one of the progression criteria — sustained superior performance, successful increased duties, new projects with significant results, applied specialist expertise, or sustained leadership measured against the AITSL Professional Standard for Principals.",
      ],
    },
    {
      heading: "HALT and Lead certification are paid as allowances",
      body: [
        "Schedule 4 item 4.2 sets a highly accomplished teacher allowance of $13,938 and a lead teacher allowance of $29,184 from 1 January 2026. These sit on top of your classification salary rather than moving you up the scale.",
      ],
    },
  ],

  notices: [
    "The agreement runs to a nominal expiry of 31 December 2027, so the rates below are current and a further 4.3% is already locked in for 1 January 2027.",
  ],

  unverified: [
    "Assistant principal and deputy principal salaries — the NT has no such salary classification. The agreement mentions assistant principal only as a workload rule, and NT leadership pay runs Senior Teacher ST1-ST8 and Principal PLO1-PLO7.",
    "Executive contract principal (PLEC) rates — published as total remuneration packages including superannuation and a vehicle, not base salaries, so they are not comparable to the tables above and are not shown.",
    "Remote and district allowances, which are substantial in the NT but vary by location and are not a salary rate.",
  ],

  sources: [
    {
      title: "Rates of pay — teachers and educators (rates effective 1 January 2026)",
      publisher: "NT Office of the Commissioner for Public Employment",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/teachers-and-educators",
    },
    {
      title: "Northern Territory Public Sector Educators' 2024-2027 Enterprise Agreement",
      publisher: "NT Office of the Commissioner for Public Employment",
      url: "https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/northern-territory-public-sector-educators-2024-2027-enterprise-agreement.PDF",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in the NT?",
      a: "A teacher with less than 12 months of post-qualification experience starts at CT1, $96,180 a year, from the first full pay period on or after 1 January 2026. That rises to $100,316 on 1 January 2027 under the same agreement.",
    },
    {
      q: "What is the top of the NT teacher pay scale?",
      a: "CT9, $136,997 a year, is the top of the classroom teacher scale. Beyond it, senior teacher classifications ST1 to ST8 run from $145,286 to $196,907, and non-contract principals from $147,068 to $214,369.",
    },
    {
      q: "How do NT teachers move up the pay scale?",
      a: "One increment after each 12 months of service, continuous or broken, and each increment must be held for 12 months before the next. Unusually, the agreement says an annual increment will only be withheld as an outcome of inability or discipline procedures — not as a performance rating.",
    },
    {
      q: "What is Rapid Incremental Progression in the NT?",
      a: "A scheme that moves an early career teacher straight to CT4 at the start of their third year, skipping CT3. You need your first two years of service in NT Government schools within a four-year period, plus two semester units of postgraduate study completed in those two years. Relief teaching counts, at 180 days to the year.",
    },
    {
      q: "Is there an assistant principal salary in the NT?",
      a: "No. The NT has no assistant principal or deputy principal salary classification. Leadership pay runs through senior teacher ST1 to ST8 and principal PLO1 to PLO7, both promotion-based and set by the NTPS Job Evaluation System.",
    },
    {
      q: "Do NT teachers get paid more for HALT certification?",
      a: "Yes, as an allowance rather than a step. From 1 January 2026 the highly accomplished teacher allowance is $13,938 a year and the lead teacher allowance is $29,184, paid on top of your classification salary.",
    },
  ],
};
