// Queensland — state school teacher salaries.
//
// Source of every figure: the Department of Education's own Salary Schedule
// workbook (salaryschedule.xls), "Teachers" sheet, read on 14 October 2026.
// The department re-published the workbook with the post-7 September 2026
// rates between 24 September and 14 October 2026; its cover sheet still reads
// "Department of Education Salary Schedule (Updated 1 September 2026)", and
// the sheet no longer prints a date on each column. (The 28 August 2026 read
// dated classroom columns 1 September 2025 and leadership columns 1 July 2024.)
//
// Queensland is the one state in this cluster whose agreement is in dispute.
// The Department of Education State School Teachers' Certified Agreement 2022
// (CB/2022/135) EXPIRED on 30 June 2025 and was referred to arbitration on
// 31 December 2025. It remains the instrument in force: the QIRC's public
// service agreements page (updated 2 October 2026) lists no replacement.
//
// Two QIRC instruments explain the new figures, and supply the dates this file
// uses because the workbook no longer prints them:
//   - [2026] QIRC 267, order 1: "an interim salary increase of 3% applied to
//     the higher of the final rate under the Agreement or the relevant Award
//     rate at the nominal expiry date of the Agreement (i.e. 30 June 2025)";
//     order 2: "The operative date of the interim salary increase is
//     7 September 2026".
//   - The Teaching in State Education Award - State 2016 reprint, "Operative
//     date of the modern award reprint: 1 September 2026" (the 4.75% 2026 State
//     Wage Case, [2026] QIRC 280).
// Where the award rate is higher the workbook prints it. These workbook
// figures are printed identically in clause 12.6 of that reprint, so they are
// dated 1 September 2026: classroom Bands 1 to 3, Senior Teacher ($4,776 a
// fortnight), Experienced Senior Teacher ($4,889), assistant teachers, the
// supply rate (Band 3 Step 1) and Head of Program Level 1 Paypoint 3
// ($148,003). Every other row (Highly Accomplished and Lead Teacher, the other
// Heads of Program rows, deputy principals, principals and community teachers)
// is 3% above the department's previous figure, the interim increase, and is
// dated 7 September 2026. Nothing here is computed: every salary is the
// workbook's own.
//
// Teach Queensland's summary page (updated 1 October 2026) quotes a lower
// "approximately $86,601" for a beginning teacher. This file follows the
// salary schedule ($90,164 for Band 2 Step 1), whose classroom figures match
// the award reprint's rates.
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
  graduateStep: "Band 2, Step 1",
  topClassroomStep: "Band 3, Step 4",
  h1: "QLD Teacher Salary 2026: Queensland State School Pay Scale by Band and Step",
  classificationNote:
    "Queensland labels classroom teacher pay as Band and Step, from Band 1 Step 1 to Band 3 Step 4. Senior Teacher, Experienced Senior Teacher, Highly Accomplished Teacher and Lead Teacher are paid above Band 3 Step 4. Four-year-trained graduates enter at Band 2 Step 1.",
  principalScaleIds: ["principals"],
  employer: "the Queensland Department of Education",
  agreementName:
    "Department of Education State School Teachers' Certified Agreement 2022 (expired 30 June 2025, now in arbitration)",
  agreementUrl:
    "https://qed.qld.gov.au/workingwithus/induction/centralandregionaloffices/Documents/salaryschedule.xls",
  ratesEffectiveFrom:
    "1 September 2026 for classroom teachers and 7 September 2026 for promotional and school leader positions",
  // The 3% interim increase runs "until determination of the proceedings or
  // earlier order" ([2026] QIRC 267 at [24]); no further increase has a date.
  nextIncrease: null,
  verifiedOn: "14 October 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers — Stream 1",
      intro:
        "This is the main Queensland classroom teacher scale. A beginning teacher with a four-year degree starts at Band 2, Step 1; Band 1 is for teachers on a Permission to Teach or working as an intern.",
      stepHeading: "Classification and step",
      effectiveFrom: "1 September 2026 (Highly Accomplished and Lead Teacher: 7 September 2026)",
      steps: [
        { label: "Band 1, Step 1", salary: 80_615, note: "Permission to Teach or intern" },
        { label: "Band 1, Step 2", salary: 83_302, note: "Permission to Teach or intern" },
        { label: "Band 2, Step 1", salary: 90_164, note: "Four-year degree entry point" },
        { label: "Band 2, Step 2", salary: 94_599 },
        { label: "Band 2, Step 3", salary: 99_216 },
        { label: "Band 2, Step 4", salary: 103_782 },
        { label: "Band 3, Step 1", salary: 107_643 },
        { label: "Band 3, Step 2", salary: 111_478 },
        { label: "Band 3, Step 3", salary: 115_261 },
        { label: "Band 3, Step 4", salary: 119_357, note: "Top of the incremental scale" },
        { label: "Senior Teacher (4 year trained)", salary: 124_601, note: "By application" },
        { label: "Experienced Senior Teacher (ES401)", salary: 127_549, note: "By application" },
        { label: "Experienced Senior Teacher (ES402)", salary: 127_549 },
        { label: "Highly Accomplished Teacher", salary: 134_694, note: "National certification" },
        { label: "Lead Teacher", salary: 147_050, note: "National certification" },
      ],
    },
    {
      id: "heads-of-program",
      title: "Promotional teaching positions: Heads of Program (Stream 2)",
      intro:
        "The Heads of Program scale covers Head of Department, Head of Department (Curriculum), Guidance Officer, Senior Guidance Officer and Head of Special Education Services.",
      stepHeading: "Level and pay point",
      effectiveFrom: "7 September 2026 (Level 1, Paypoint 3: 1 September 2026)",
      steps: [
        { label: "Level 1, Paypoint 2", salary: 145_320, note: "HODC, HOD, GO, HOSES 2" },
        { label: "Level 1, Paypoint 3", salary: 148_003, note: "HODC, HOD, GO, HOSES 2" },
        { label: "Level 2, Paypoint 2", salary: 152_651, note: "SGO, HOSES 3" },
        { label: "Level 2, Paypoint 3", salary: 155_351, note: "SGO, HOSES 3" },
      ],
    },
    {
      id: "deputy-principals",
      title: "Deputy principals (School Leaders Stream 3)",
      intro: "The Queensland deputy principal scale covers deputy principals, including Head of Special Education Services 4.",
      stepHeading: "Pay point",
      effectiveFrom: "7 September 2026",
      steps: [
        { label: "Paypoint 2", salary: 161_746 },
        { label: "Paypoint 3", salary: 164_605 },
      ],
    },
    {
      id: "principals",
      title: "Principals (School Leaders Stream 3)",
      intro:
        "The Queensland principal scale has ten levels, each with published pay points. The bracketed labels are the previous band and school leader numbering, which still appears on some payslips.",
      stepHeading: "Level and pay point",
      effectiveFrom: "7 September 2026",
      steps: [
        { label: "Level 1, Paypoint 2", salary: 146_776, note: "Previously Band 5, SL1" },
        { label: "Level 1, Paypoint 3", salary: 149_372, note: "Previously Band 5, SL1" },
        { label: "Level 2, Paypoint 2", salary: 154_845, note: "Previously Band 6, SL2" },
        { label: "Level 2, Paypoint 3", salary: 157_585, note: "Previously Band 6, SL2" },
        { label: "Level 3, Paypoint 2", salary: 163_363, note: "Previously Band 7, SL3" },
        { label: "Level 3, Paypoint 3", salary: 166_249, note: "Previously Band 7, SL3" },
        { label: "Level 4, Paypoint 2", salary: 172_346, note: "Previously Band 8, SL4" },
        { label: "Level 4, Paypoint 3", salary: 175_396, note: "Previously Band 8, SL4" },
        { label: "Level 5, Paypoint 2", salary: 181_827, note: "Previously Band 9, SL5" },
        { label: "Level 5, Paypoint 3", salary: 185_041, note: "Previously Band 9, SL5" },
        { label: "Level 6, Paypoint 2", salary: 191_829, note: "Previously Band 10, SL6" },
        { label: "Level 6, Paypoint 3", salary: 195_218, note: "Previously Band 10, SL6" },
        { label: "Level 7, Paypoint 2", salary: 202_377, note: "Previously Band 11, SL7" },
        { label: "Level 7, Paypoint 3", salary: 205_954, note: "Previously Band 11, SL7" },
        { label: "Level 8, Paypoint 1", salary: 213_442 },
        { label: "Level 8, Paypoint 2", salary: 217_282 },
        { label: "Level 9, Paypoint 1", salary: 225_182 },
        { label: "Level 9, Paypoint 2", salary: 229_234 },
        { label: "Level 10, Paypoint 1", salary: 237_564 },
        { label: "Level 10, Paypoint 2", salary: 242_573, note: "Top of the principal scale" },
      ],
    },
    {
      id: "assistant-and-community-teachers",
      title: "Assistant teachers and community teachers",
      intro:
        "Assistant teacher and community teacher are separate classifications used in Aboriginal and Torres Strait Islander community schools.",
      stepHeading: "Classification and step",
      effectiveFrom: "1 September 2026 (community teachers: 7 September 2026)",
      steps: [
        { label: "Assistant Teacher, Step 1", salary: 63_996 },
        { label: "Assistant Teacher, Step 2", salary: 65_431 },
        { label: "Assistant Teacher, Step 3", salary: 66_918 },
        { label: "Assistant Teacher, Step 4", salary: 68_275 },
        { label: "Community Teacher, Step 1", salary: 76_306 },
        { label: "Community Teacher, Step 2", salary: 79_176 },
        { label: "Community Teacher, Step 3", salary: 82_043 },
        { label: "Community Teacher, Step 4", salary: 84_913 },
        { label: "Senior Community Teacher", salary: 91_800 },
      ],
    },
  ],

  casual: [
    {
      label: "Supply (relief) teacher",
      rate: 103.15,
      unit: "hour",
      note: "Band 3 Step 1 classification, including 25% casual loading",
    },
    {
      label: "Supply (relief) teacher, daily",
      rate: 515.75,
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
      heading: "Above Band 3 you apply, and you stay in the classroom",
      body: [
        "Senior Teacher, Experienced Senior Teacher, and Highly Accomplished and Lead Teacher are classifications you apply for rather than reach by annual increment, and all of them keep you teaching. In the Queensland structure, four paid classifications sit above the incremental scale and none of them requires leaving the classroom.",
        "If you want a leadership role instead, the pathway runs from Head of Department (Curriculum) through to Principal, on the separate Stream 2 and Stream 3 scales above.",
      ],
    },
    {
      heading: "What the agreement says about increments",
      body: [
        "Clause 5.11.2 of the certified agreement makes progression from one salary step to the next by increment subject to satisfactory performance. Clause 5.11.1 covers part-time teachers: incremental progression is not affected by your part-time employment fraction, so a 0.5 load still moves you a step a year.",
        "Clause 5.11.3 is the exception: an employee subject to a Managing Unsatisfactory Performance process at Stage 2 or beyond at the time of their increment does not progress.",
      ],
    },
    {
      heading: "Senior Teacher, Experienced Senior Teacher and certification",
      body: [
        "Under clause 5.4.3.1, you complete an undertaking and personal action plan three months before becoming eligible for Senior Teacher, as part of the annual performance review process.",
        "Under clause 5.4.4.1, Experienced Senior Teacher is available to any teacher with two or more years of satisfactory service as a Senior Teacher.",
        "Clause 5.5.5.1 sets the gate for Highly Accomplished and Lead Teacher: full teacher registration, a minimum of five years of registered recognised teaching experience at the next portfolio submission date, and at least two completed annual performance reviews in the preceding two years for HAT, or three in three years for Lead. Certification has to be renewed every five years.",
      ],
    },
    {
      heading: "The deferred salary scheme",
      body: [
        "Permanent state school teachers can defer part of their annual salary over four years, then be paid that deferred salary during a fifth year while taking a pre-approved period of leave. It changes what your payslip shows for those four years, so allow for the deferral when you reconcile your gross pay against the scale.",
      ],
    },
  ],

  notices: [
    "Queensland's certified agreement expired on 30 June 2025 and the replacement went to arbitration on 31 December 2025. No new agreement has been certified: the Queensland Industrial Relations Commission's agreements page (updated 2 October 2026) still lists the 2022 agreement, so it remains the instrument in force. The rates below are what the department's own salary schedule publishes, read on 14 October 2026.",
    "The department's salary schedule includes the September 2026 increases. From 7 September 2026 teachers are paid a 3% interim increase ([2026] QIRC 267) or the award rate where that is higher, and award rates rose 4.75% from 1 September 2026 under the 2026 State Wage Case ([2026] QIRC 280). Classroom teacher Bands 1 to 3, Senior Teacher, Experienced Senior Teacher, assistant teachers, supply teachers and Head of Program Level 1 Paypoint 3 are on the award rate, the same figures as the QIRC's award reprint operative 1 September 2026. Highly Accomplished and Lead Teacher, the other Head of Program rows, deputy principals, principals and community teachers are on the 3% interim rate.",
    "The department's workbook no longer dates its columns, and its cover still reads \"Updated 1 September 2026\". Each table below gives the date its rates apply from: 1 September 2026 for award rates, and 7 September 2026, the operative date of the interim order, for the rest.",
    "Teach Queensland's summary pay page (updated 1 October 2026) quotes a beginning-teacher salary of \"approximately $86,601\", below the $90,164 the department's salary schedule prints for Band 2 Step 1. This page follows the salary schedule.",
  ],

  unverified: [
    "The final arbitrated rates. The replacement agreement is still before the QIRC, and the 3% interim increase applies until the proceedings are determined, so no later increase or date is published yet.",
    "Paypoint 1 for Promotional Levels 1 and 2, for deputy principals, and for Principal Levels 1 to 7. The department publishes those cells as \"--\" with no rate, so they are not shown.",
    "Coach classifications (Pedagogy, Literacy and Numeracy Coaches engaged before 1 July 2019), which the department directs to separate transition arrangements.",
    "Community Education Counsellor and school-based trainee scales, which are separate classifications.",
    "Rural and remote incentives and locality allowances, which vary by school and are not a salary rate.",
  ],

  sources: [
    {
      title: "Department of Education Salary Schedule, Teachers sheet (re-published with the 7 September 2026 rates; cover reads \"Updated 1 September 2026\")",
      publisher: "Queensland Department of Education",
      url: "https://qed.qld.gov.au/workingwithus/induction/centralandregionaloffices/Documents/salaryschedule.xls",
    },
    {
      title: "State of Queensland (Department of Education) v Queensland Teachers' Union of Employees [2026] QIRC 267, 3% interim increase operative 7 September 2026",
      publisher: "Queensland Industrial Relations Commission (Supreme Court Library Queensland)",
      url: "https://archive.sclqld.org.au/qjudgment/2026/QIRC26-267.pdf",
    },
    {
      title: "Teaching in State Education Award - State 2016, reprint operative 1 September 2026 (clause 12.6)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/teaching_state_ed_010926.pdf",
    },
    {
      title: "Declaration of General Ruling (State Wage Case 2026) [2026] QIRC 280, 4.75% from 1 September 2026",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/2026_b59_b60_decision.pdf",
    },
    {
      title: "Public service agreements (Department of Education State School Teachers' CA 2022; updated 2 October 2026)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/agreements/public-service-agreements",
    },
    {
      title: "Pay and benefits, teaching in Queensland state schools (updated 1 October 2026)",
      publisher: "Teach Queensland, Queensland Department of Education",
      url: "https://teach.qld.gov.au/teach-in-state-schools/pay-and-benefits",
    },
    {
      title: "Salaries, Teachers CA 2022: updated salary schedule from 7 September 2026",
      publisher: "Queensland Teachers' Union",
      url: "https://www.qtu.asn.au/salaries-CA2022",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in Queensland?",
      a: "A beginning teacher with a four-year degree starts at Band 2, Step 1, $90,164 a year on the department's salary schedule, the award rate in force from 1 September 2026. Band 1, at $80,615, is not the graduate band. It is for teachers on a Permission to Teach or working as an intern.",
    },
    {
      q: "What is the top of the QLD teacher pay scale?",
      a: "Band 3, Step 4 at $119,357 is the top of the incremental scale. Above it, and still in the classroom, Senior Teacher pays $124,601, Experienced Senior Teacher $127,549, Highly Accomplished Teacher $134,694 and Lead Teacher $147,050.",
    },
    {
      q: "How many steps are there in the Queensland teacher pay scale?",
      a: "The Queensland teacher pay scale has eight incremental steps between the four-year-degree entry point and the top: four in Band 2 and four in Band 3. Everything above Band 3 Step 4 is applied for rather than incremented into.",
    },
    {
      q: "What is a principal paid in Queensland?",
      a: "Principal salaries run from $146,776 at Level 1 to $242,573 at Level 10 from 7 September 2026, on the department's salary schedule. Deputy principals are paid $161,746 to $164,605 and heads of department $145,320 to $148,003.",
    },
    {
      q: "What is the supply teacher rate in Queensland?",
      a: "Supply teachers are paid at the Band 3 Step 1 classification: $103.15 an hour or $515.75 a day, both including the 25% casual loading, the award rate from 1 September 2026.",
    },
    {
      q: "When do Queensland teachers get a pay rise?",
      a: "Queensland state school teachers have already been paid the latest rise. From 7 September 2026 they are paid a 3% interim increase ordered by the Queensland Industrial Relations Commission ([2026] QIRC 267), or the award rate where that is higher; award rates rose 4.75% from 1 September 2026 under the 2026 State Wage Case. The department's salary schedule now prints those rates, and this page tables them. The interim increase applies until the QIRC decides the replacement agreement, which is still in arbitration, so no further rise has a date yet.",
    },
  ],
};
