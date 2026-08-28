// Queensland — state school teacher salaries.
//
// Source of every figure: the Department of Education's own Salary Schedule
// workbook (salaryschedule.xls), "Teachers" sheet, downloaded and read on
// 28 August 2026. The workbook's cover sheet reads "Department of Education
// Salary Schedule (Updated 1 September 2026)".
//
// That schedule dates its columns individually, and this file reproduces those
// dates per table rather than flattening them:
//   - Classroom Teaching (Stream 1) and supply teachers: 1 September 2025.
//   - Promotional Teaching Positions (Stream 2), Deputy Principals and
//     Principals (School Leaders Stream 3): 1 July 2024.
// Both dates are the department's own, read from the column headers.
//
// Queensland is the one state in this cluster whose agreement is in dispute.
// The Department of Education State School Teachers' Certified Agreement 2022
// (CB/2022/135) EXPIRED on 30 June 2025 and was referred to arbitration on
// 31 December 2025. It remains the instrument in force.
//
// That expiry explains the two column dates. The agreement's own increases were
// 4% on 1 July 2022, 4% on 1 July 2023 and 3% on 1 July 2024 (clause 6.1.2) —
// which is why promotional and school leader rates still sit at 1 July 2024.
// The classroom teacher column moved again on 1 September 2025, but from the
// QIRC's 2025 State Wage Case general ruling rather than from the agreement.
//
// A 3% interim increase IS ordered, operative 7 September 2026, by State of
// Queensland (Department of Education) v Queensland Teachers' Union of
// Employees [2026] QIRC 267. Its base is "the higher of the final rate under
// the Agreement or the relevant Award rate at the nominal expiry date
// (30 June 2025)" — which is NOT the 1 September 2025 column below. No
// resulting dollar figure has been published, so this file computes none.
//
// Paypoint 1 is published as "--" (no rate) for Promotional Levels 1 and 2, for
// Deputy Principals and for Principal Levels 1 to 7. Those rows are omitted
// rather than guessed.

import type { TeacherPayState } from "./types";

export const QLD_TEACHER_PAY: TeacherPayState = {
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  nameInSentence: "Queensland",
  employer: "the Queensland Department of Education",
  agreementName:
    "Department of Education State School Teachers' Certified Agreement 2022 (expired 30 June 2025, now in arbitration)",
  agreementUrl:
    "https://qed.qld.gov.au/workingwithus/induction/centralandregionaloffices/Documents/salaryschedule.xls",
  ratesEffectiveFrom:
    "1 September 2025 for classroom teachers and 1 July 2024 for promotional and school leader positions",
  nextIncrease: {
    date: "7 September 2026",
    detail:
      "The Queensland Industrial Relations Commission has ordered a 3% interim salary increase operative from 7 September 2026 ([2026] QIRC 267). Its base is the higher of the final agreement rate or the relevant award rate as at 30 June 2025 — not the 1 September 2025 rates below — and no resulting schedule has been published, so we do not calculate the new figures here.",
  },
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers — Stream 1",
      intro:
        "The main scale. A beginning teacher with a four-year degree starts at Band 2, Step 1; Band 1 is for teachers on a Permission to Teach or working as an intern.",
      stepHeading: "Classification and step",
      effectiveFrom: "1 September 2025",
      steps: [
        { label: "Band 1, Step 1", salary: 76_963, note: "Permission to Teach or intern" },
        { label: "Band 1, Step 2", salary: 79_519, note: "Permission to Teach or intern" },
        { label: "Band 2, Step 1", salary: 86_068, note: "Four-year degree entry point" },
        { label: "Band 2, Step 2", salary: 90_320 },
        { label: "Band 2, Step 3", salary: 94_729 },
        { label: "Band 2, Step 4", salary: 99_086 },
        { label: "Band 3, Step 1", salary: 102_765 },
        { label: "Band 3, Step 2", salary: 106_417 },
        { label: "Band 3, Step 3", salary: 110_043 },
        { label: "Band 3, Step 4", salary: 113_957, note: "Top of the incremental scale" },
        { label: "Senior Teacher (4 year trained)", salary: 118_940, note: "By application" },
        { label: "Experienced Senior Teacher (ES401)", salary: 121_757, note: "By application" },
        { label: "Experienced Senior Teacher (ES402)", salary: 123_102 },
        { label: "Highly Accomplished Teacher", salary: 130_770, note: "National certification" },
        { label: "Lead Teacher", salary: 142_766, note: "National certification" },
      ],
    },
    {
      id: "heads-of-program",
      title: "Promotional teaching positions — Heads of Program (Stream 2)",
      intro:
        "Head of Department, Head of Department (Curriculum), Guidance Officer, Senior Guidance Officer and Head of Special Education Services.",
      stepHeading: "Level and pay point",
      effectiveFrom: "1 July 2024",
      steps: [
        { label: "Level 1, Paypoint 2", salary: 141_088, note: "HODC, HOD, GO, HOSES 2" },
        { label: "Level 1, Paypoint 3", salary: 143_582, note: "HODC, HOD, GO, HOSES 2" },
        { label: "Level 2, Paypoint 2", salary: 148_205, note: "SGO, HOSES 3" },
        { label: "Level 2, Paypoint 3", salary: 150_827, note: "SGO, HOSES 3" },
      ],
    },
    {
      id: "deputy-principals",
      title: "Deputy principals (School Leaders Stream 3)",
      intro: "Deputy principals, including Head of Special Education Services 4.",
      stepHeading: "Pay point",
      effectiveFrom: "1 July 2024",
      steps: [
        { label: "Paypoint 2", salary: 157_034 },
        { label: "Paypoint 3", salary: 159_810 },
      ],
    },
    {
      id: "principals",
      title: "Principals (School Leaders Stream 3)",
      intro:
        "Ten principal levels, each with published pay points. The bracketed labels are the previous band and school leader numbering, which still appears on some payslips.",
      stepHeading: "Level and pay point",
      effectiveFrom: "1 July 2024",
      steps: [
        { label: "Level 1, Paypoint 2", salary: 142_500, note: "Previously Band 5, SL1" },
        { label: "Level 1, Paypoint 3", salary: 145_020, note: "Previously Band 5, SL1" },
        { label: "Level 2, Paypoint 2", salary: 150_334, note: "Previously Band 6, SL2" },
        { label: "Level 2, Paypoint 3", salary: 152_995, note: "Previously Band 6, SL2" },
        { label: "Level 3, Paypoint 2", salary: 158_605, note: "Previously Band 7, SL3" },
        { label: "Level 3, Paypoint 3", salary: 161_407, note: "Previously Band 7, SL3" },
        { label: "Level 4, Paypoint 2", salary: 167_326, note: "Previously Band 8, SL4" },
        { label: "Level 4, Paypoint 3", salary: 170_287, note: "Previously Band 8, SL4" },
        { label: "Level 5, Paypoint 2", salary: 176_531, note: "Previously Band 9, SL5" },
        { label: "Level 5, Paypoint 3", salary: 179_651, note: "Previously Band 9, SL5" },
        { label: "Level 6, Paypoint 2", salary: 186_241, note: "Previously Band 10, SL6" },
        { label: "Level 6, Paypoint 3", salary: 189_534, note: "Previously Band 10, SL6" },
        { label: "Level 7, Paypoint 2", salary: 196_484, note: "Previously Band 11, SL7" },
        { label: "Level 7, Paypoint 3", salary: 199_956, note: "Previously Band 11, SL7" },
        { label: "Level 8, Paypoint 1", salary: 207_225 },
        { label: "Level 8, Paypoint 2", salary: 210_953 },
        { label: "Level 9, Paypoint 1", salary: 218_623 },
        { label: "Level 9, Paypoint 2", salary: 222_557 },
        { label: "Level 10, Paypoint 1", salary: 230_645 },
        { label: "Level 10, Paypoint 2", salary: 235_508, note: "Top of the principal scale" },
      ],
    },
    {
      id: "assistant-and-community-teachers",
      title: "Assistant teachers and community teachers",
      intro:
        "Separate classifications used in Aboriginal and Torres Strait Islander community schools.",
      stepHeading: "Classification and step",
      effectiveFrom: "1 September 2025",
      steps: [
        { label: "Assistant Teacher, Step 1", salary: 61_100 },
        { label: "Assistant Teacher, Step 2", salary: 62_457 },
        { label: "Assistant Teacher, Step 3", salary: 63_892 },
        { label: "Assistant Teacher, Step 4", salary: 65_170 },
        { label: "Community Teacher, Step 1", salary: 74_083 },
        { label: "Community Teacher, Step 2", salary: 76_870 },
        { label: "Community Teacher, Step 3", salary: 79_653 },
        { label: "Community Teacher, Step 4", salary: 82_440 },
        { label: "Senior Community Teacher", salary: 89_126 },
      ],
    },
  ],

  casual: [
    {
      label: "Supply (relief) teacher",
      rate: 98.475,
      unit: "hour",
      note: "Band 3 Step 1 classification, including 25% casual loading",
    },
    {
      label: "Supply (relief) teacher — daily",
      rate: 492.38,
      unit: "day",
      note: "Including 25% casual loading",
    },
  ],

  progression: [
    {
      heading: "Where you start",
      body: [
        "The department sets your starting salary from your years of service, your qualifications, and prior teaching or industry experience. A beginning teacher with a four-year degree starts on Band 2, Step 1.",
        "Band 1 is not the graduate band. It is for people teaching on a Permission to Teach, or working as an intern, and has only two steps.",
      ],
    },
    {
      heading: "Bands 2 and 3 are the incremental part",
      body: [
        "Band 2 has four steps and Band 3 has four steps, so there are eight incremental steps between the four-year-degree entry point and the top of the incremental scale at Band 3, Step 4.",
      ],
    },
    {
      heading: "Above Band 3 you apply — and you stay in the classroom",
      body: [
        "Senior Teacher, Experienced Senior Teacher, and Highly Accomplished and Lead Teacher are all things you apply for rather than age into, and all of them keep you teaching. That is the distinguishing feature of the Queensland structure: there are four paid classifications above the incremental scale that do not require leaving the classroom.",
        "If you want a leadership role instead, the pathway runs from Head of Department (Curriculum) through to Principal, on the separate Stream 2 and Stream 3 scales above.",
      ],
    },
    {
      heading: "What the agreement says about increments",
      body: [
        "Clause 5.11.2: progression from one salary step to the next by increment is subject to satisfactory performance. Clause 5.11.1 adds something part-timers should know — incremental progression is not affected by your part-time employment fraction, so a 0.5 load still moves you a step a year.",
        "Clause 5.11.3 is the exception: an employee subject to a Managing Unsatisfactory Performance process at Stage 2 or beyond at the time of their increment does not progress.",
      ],
    },
    {
      heading: "Senior Teacher, Experienced Senior Teacher and certification",
      body: [
        "Clause 5.4.3.1: three months before becoming eligible for Senior Teacher you complete an undertaking and personal action plan as part of the annual performance review process.",
        "Clause 5.4.4.1: Experienced Senior Teacher is available to any teacher with two or more years of satisfactory service as a Senior Teacher.",
        "Clause 5.5.5.1 sets the gate for Highly Accomplished and Lead Teacher: full teacher registration, a minimum of five years of registered recognised teaching experience at the next portfolio submission date, and at least two completed annual performance reviews in the preceding two years for HAT, or three in three years for Lead. Certification has to be renewed every five years.",
      ],
    },
    {
      heading: "The deferred salary scheme",
      body: [
        "Permanent state school teachers can defer part of their annual salary over four years, then be paid that deferred salary during a fifth year while taking a pre-approved period of leave. It changes what your payslip shows for four years, so it is worth knowing about when you are reconciling gross pay against the scale.",
      ],
    },
  ],

  notices: [
    "Queensland's certified agreement expired on 30 June 2025 and the replacement went to arbitration on 31 December 2025. It is still the instrument in force, and the rates below are what the department's own salary schedule publishes as at 28 August 2026.",
    "A 3% interim increase takes effect on 7 September 2026 under [2026] QIRC 267. Its base is the higher of the final agreement rate or the award rate as at 30 June 2025, which is not the same as the 1 September 2025 column, and no resulting schedule has been published — so the figures below are correct up to 6 September 2026 and should be re-checked after that.",
    "The department's schedule dates its columns differently: classroom teacher rates from 1 September 2025 (a QIRC State Wage Case general ruling, not the agreement), and promotional, deputy principal and principal rates from 1 July 2024 (the agreement's final increase). Each table below says which applies.",
  ],

  unverified: [
    "The dollar amounts that will apply from 7 September 2026 after the ordered 3% interim increase. The order defines the base as the higher of the final agreement rate or the relevant award rate at 30 June 2025, and no department schedule of the resulting amounts has been published, so we will not compute them.",
    "Rates under the Teaching in State Education Award - State 2016, which clause 5.11.2 defers to for the underlying increment mechanics and which forms one limb of the interim increase base.",
    "Paypoint 1 for Promotional Levels 1 and 2, for deputy principals, and for Principal Levels 1 to 7 — the department publishes those cells as \"--\" with no rate, so they are not shown.",
    "Coach classifications (Pedagogy, Literacy and Numeracy Coaches engaged before 1 July 2019), which the department directs to separate transition arrangements.",
    "Community Education Counsellor and school-based trainee scales, which are separate classifications.",
    "Rural and remote incentives and locality allowances, which vary by school and are not a salary rate.",
  ],

  sources: [
    {
      title: "Department of Education Salary Schedule (updated 1 September 2026) — Teachers sheet",
      publisher: "Queensland Department of Education",
      url: "https://qed.qld.gov.au/workingwithus/induction/centralandregionaloffices/Documents/salaryschedule.xls",
    },
    {
      title: "Pay and benefits — teaching in Queensland state schools",
      publisher: "Teach Queensland, Queensland Department of Education",
      url: "https://teach.qld.gov.au/teach-in-state-schools/pay-and-benefits",
    },
    {
      title: "Public service agreements (Department of Education State School Teachers' CA 2022)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/agreements/public-service-agreements",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in Queensland?",
      a: "A beginning teacher with a four-year degree starts at Band 2, Step 1, $86,068 a year on the department's salary schedule dated 1 September 2025. Band 1, at $76,963, is not the graduate band — it is for teachers on a Permission to Teach or working as an intern.",
    },
    {
      q: "What is the top of the QLD teacher pay scale?",
      a: "Band 3, Step 4 at $113,957 is the top of the incremental scale. Above it, and still in the classroom, Senior Teacher pays $118,940, Experienced Senior Teacher $121,757 to $123,102, Highly Accomplished Teacher $130,770 and Lead Teacher $142,766.",
    },
    {
      q: "How many steps are there in the Queensland teacher pay scale?",
      a: "Eight incremental steps between the four-year-degree entry point and the top: four in Band 2 and four in Band 3. Everything above Band 3 Step 4 is applied for rather than incremented into.",
    },
    {
      q: "What is a principal paid in Queensland?",
      a: "Principal salaries run from $142,500 at Level 1 to $235,508 at Level 10 on the department's schedule dated 1 July 2024. Deputy principals are paid $157,034 to $159,810 and heads of department $141,088 to $150,827.",
    },
    {
      q: "What is the supply teacher rate in Queensland?",
      a: "Supply teachers are paid at the Band 3 Step 1 classification: $98.48 an hour or $492.38 a day, both including the 25% casual loading, on the schedule dated 1 September 2025.",
    },
    {
      q: "Are Queensland teachers getting a pay rise?",
      a: "Yes. The Queensland Industrial Relations Commission has ordered a 3% interim salary increase operative from 7 September 2026 while the replacement agreement is arbitrated. The order sets the base as the higher of the final agreement rate or the relevant award rate at 30 June 2025, and no schedule of the resulting amounts has been published yet, so the figures on this page are the ones in force up to 6 September 2026.",
    },
  ],
};
