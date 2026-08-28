// South Australia — public school teacher salaries.
//
// Source of every figure: Schedule 1.1 (Teacher Classifications) and Schedule
// 1.3 (Leader Classifications) of the South Australian School and Preschool
// Education Staff Enterprise Agreement 2024, approved by the South Australian
// Employment Tribunal on 25 March 2024 (ET-24-00640), CROSS-CHECKED against the
// Department for Education's own "School teachers pay rates" schedule
// (School Teacher Web Rates, 08/05/2026). Read on 28 August 2026.
//
// The agreement's schedules run in dated dollar columns, ending at "1st fpp on
// or after 1.5.2026". That is the column in force and the one published here.
// The two independent sources agree exactly on every annual figure in it.
//
// Three corrections to common misconceptions about the SA scale, all from the
// instruments themselves:
//   - SA has no "Graduate Teacher" classification. Graduates enter at Step 1,
//     or Step 2 with a 4-year degree plus a Graduate Diploma in Education.
//   - Band A is Principals and Band B is Deputy Principals / Senior Leaders.
//     Neither is part of the classroom teacher scale.
//   - There is no AST1. Only AST2 exists, and clause 6.7.4 closed it to new
//     applications after Week 4, Term 1 of 2022 — it is grandfathered only.
//
// The agreement PDF is a scan, so its figures came through OCR. Everything
// published below is the intersection of the OCR and the department's own rate
// sheet; anything that did not match both is in `unverified` instead.

import type { TeacherPayState } from "./types";

export const SA_TEACHER_PAY: TeacherPayState = {
  slug: "sa",
  code: "SA",
  name: "South Australia",
  nameInSentence: "South Australia",
  employer: "the SA Department for Education",
  agreementName:
    "South Australian School and Preschool Education Staff Enterprise Agreement 2024",
  agreementUrl:
    "https://www.education.sa.gov.au/working-us/careers-education/working-conditions/pay-rates-forms-new-employees-and-enterprise-agreements",
  ratesEffectiveFrom: "the first full pay period on or after 1 May 2026",
  nextIncrease: null,
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Teachers — Step 1 to Step 9",
      intro:
        "The classroom teacher scale. Where you enter depends on your qualification, and Step 9 is the only step you have to apply for.",
      stepHeading: "Step",
      steps: [
        { label: "Special Authority", salary: 74_083, note: "Teaching without a full qualification" },
        { label: "Step 1", salary: 84_971, note: "Three or four year degree entry point" },
        { label: "Step 2", salary: 89_350, note: "Four year degree plus a Graduate Diploma in Education" },
        { label: "Step 3", salary: 93_735 },
        { label: "Step 4", salary: 98_113 },
        { label: "Step 5", salary: 102_509 },
        { label: "Step 6", salary: 106_890 },
        { label: "Step 7", salary: 111_269 },
        { label: "Step 8", salary: 117_198 },
        { label: "Step 9", salary: 123_236, note: "By application — top of the classroom scale" },
      ],
    },
    {
      id: "advanced-and-certified",
      title: "Advanced Skills, Highly Accomplished and Lead Teachers",
      intro:
        "Classifications above the classroom scale that keep you in the classroom. AST2 is closed to new applicants; HAT and Lead require national certification.",
      stepHeading: "Classification",
      steps: [
        {
          label: "Advanced Skills Teacher 2 (AST2)",
          salary: 127_798,
          note: "Closed to new applications since Term 1, 2022 — grandfathered",
        },
        {
          label: "Highly Accomplished Teacher (HAT)",
          salary: 133_736,
          note: "Requires national certification",
        },
        { label: "Lead Teacher (LT)", salary: 141_365, note: "Requires national certification" },
      ],
    },
    {
      id: "band-b-leaders",
      title: "Band B — deputy principals, senior leaders and coordinators",
      intro:
        "Band B covers school leadership below the principal, and is where most teachers first move off the classroom scale into a leadership role.",
      stepHeading: "Band",
      steps: [
        { label: "Band B-1", salary: 133_736 },
        { label: "Band B-2", salary: 136_872 },
        { label: "Band B-3", salary: 145_859 },
        { label: "Band B-4", salary: 154_852 },
        { label: "Band B-5", salary: 163_842 },
        { label: "Band B-6", salary: 172_842 },
      ],
    },
    {
      id: "band-a-principals",
      title: "Band A — principals and preschool directors",
      intro: "The principal scale. Band level follows the site, not length of service.",
      stepHeading: "Band",
      steps: [
        { label: "Band A-1", salary: 146_492 },
        { label: "Band A-2", salary: 156_111 },
        { label: "Band A-3", salary: 165_737 },
        { label: "Band A-4", salary: 175_359 },
        { label: "Band A-5", salary: 184_989 },
        { label: "Band A-6", salary: 194_607 },
        { label: "Band A-7", salary: 204_231 },
        { label: "Band A-8", salary: 213_855 },
        { label: "Band A-9", salary: 222_484, note: "Top of the principal scale" },
      ],
    },
  ],

  casual: [],

  progression: [
    {
      heading: "One step for every 207 duty days",
      body: [
        "Clause 4.2 of the Teachers Award: a teacher is entitled to progress to the next higher incremental step on completing each 207 duty days served. For a full-time teacher the next increment falls due on the anniversary of the date the current increment was paid, pushed out by any days of leave without pay.",
        "No teacher can advance more than one step for experience gained in any twelve calendar months, and excess days inside that period are disregarded. Part-time teachers accrue duty days pro rata, so a part-time load stretches the same step over more calendar time.",
      ],
    },
    {
      heading: "Your entry step is set by your qualification",
      body: [
        "A three-year degree, a Bachelor of Education, or a Bachelor of Teaching with a Graduate Diploma puts you on Step 1. A four-year, honours or higher degree also starts at Step 1.",
        "A four-year, honours or higher degree combined with a Graduate Diploma in Education starts at Step 2. Someone with a minimum of six classification units but no full qualification is paid on Special Authority.",
      ],
    },
    {
      heading: "Step 9 is the one you have to apply for",
      body: [
        "Every other step comes with duty days. Step 9 does not. Under the Step 9 Teacher Guidelines, teachers who have completed 207 duty days at Step 8 are entitled to apply and to have the application individually considered.",
        "You submit a Professional Development Plan. Importantly, the guidelines state there will be no quota of Step 9 teachers — meeting the requirements is the test, not competing against colleagues.",
      ],
    },
    {
      heading: "AST2 is closed; HAT and Lead are the live pathway",
      body: [
        "Clause 6.7.4 stopped accepting applications for AST2 after the end of Week 4, Term 1 in 2022. Teachers who held it keep it as their substantive classification, but nobody new can get it.",
        "The live route above the classroom scale is national certification at the Highly Accomplished or Lead career stage. The department determines how many HAT and Lead positions are made available, and appointments run for up to five years — so unlike a step, it is not permanent.",
      ],
    },
    {
      heading: "Provisional registration and leadership eligibility",
      body: [
        "A provisionally registered teacher still progresses one step per 207 duty days served at their current step.",
        "Clause 6.11.3(a) is a hard gate on leadership though: a teacher is not eligible to be appointed into a leadership position unless they have obtained full registration.",
      ],
    },
  ],

  notices: [
    "1 May 2026 is the last salary column the 2024 agreement makes, and the agreement's nominal life is three years from 25 March 2024. No successor agreement or further increase has been published, so there is no next scheduled rise to show.",
  ],

  unverified: [
    "Band B-0, the lowest Band B point. It appears only in the scanned agreement schedule and not on the department's rate sheet, so it is single-sourced OCR and is not published here.",
    "The next increase after 1 May 2026 — the agreement's schedules simply end there and no successor has been published.",
    "The percentage size of past increases — the agreement expresses them only as dated dollar columns and states no percentages anywhere.",
    "Contract teacher rates and the principal site classification levels (SC1-SC6), which appear on the department rate sheet but not in the agreement schedules, and which two independent readings of that PDF did not agree on.",
    "Seconded teacher rates, which appear only in the scanned agreement and were not corroborated by a second source.",
    "Fortnightly and daily columns from the department rate sheet — the annual figures above are double-sourced, those columns are not.",
    "Preschool and hourly-paid instructor classifications, which are separate scales.",
  ],

  sources: [
    {
      title: "School teachers pay rates (School Teacher Web Rates, 8 May 2026)",
      publisher: "SA Department for Education",
      url: "https://www.education.sa.gov.au/docs/p-and-c/employee-relations-awards-and-agreements/school-teachers-pay-rates.pdf",
    },
    {
      title:
        "South Australian School and Preschool Education Staff Enterprise Agreement 2024 — Schedules 1.1 and 1.3",
      publisher: "SA Attorney-General's Department",
      url: "https://www.agd.sa.gov.au/__data/assets/pdf_file/0006/809394/SA-School-and-Preschool-Education-Staff-Enterprise-Agreement-2024.pdf",
    },
    {
      title: "Teachers Award (South Australia), consolidated — clause 4.2 Incremental Progression",
      publisher: "South Australian Employment Tribunal",
      url: "https://www.saet.sa.gov.au/app/uploads/2024/04/451P-2.pdf",
    },
    {
      title: "Pay rates, forms for new employees and enterprise agreements",
      publisher: "SA Department for Education",
      url: "https://www.education.sa.gov.au/working-us/careers-education/working-conditions/pay-rates-forms-new-employees-and-enterprise-agreements",
    },
  ],

  faqs: [
    {
      q: "What is the starting teacher salary in South Australia?",
      a: "Step 1 pays $84,971 a year from the first full pay period on or after 1 May 2026. A teacher with a four-year, honours or higher degree plus a Graduate Diploma in Education starts a step higher, at Step 2, on $89,350. South Australia has no separate graduate teacher classification.",
    },
    {
      q: "What is the top of the SA teacher pay scale?",
      a: "Step 9, $123,236 a year. Above that, a Highly Accomplished Teacher is paid $133,736 and a Lead Teacher $141,365, both requiring national certification, and Band B leadership starts at $133,736.",
    },
    {
      q: "How do SA teachers move up a step?",
      a: "One step for every 207 duty days served, capped at one step per twelve calendar months. For a full-time teacher that is effectively the anniversary of your last increment, pushed out by any leave without pay.",
    },
    {
      q: "How do you get to Step 9 in South Australia?",
      a: "By applying. Once you have completed 207 duty days at Step 8 you are entitled to apply and to have your application individually considered, submitting a Professional Development Plan. The guidelines state there is no quota on the number of Step 9 teachers.",
    },
    {
      q: "Can you still become an Advanced Skills Teacher in SA?",
      a: "No. Clause 6.7.4 of the agreement closed AST2 to new applications after Week 4, Term 1 in 2022. Teachers who already held it keep it, but the live pathway above the classroom scale is now national certification as a Highly Accomplished or Lead Teacher.",
    },
    {
      q: "What is a principal paid in South Australia?",
      a: "Band A runs from $146,492 at Band A-1 to $222,484 at Band A-9. Deputy principals, senior leaders and coordinators sit in Band B, from $133,736 at Band B-1 to $172,842 at Band B-6.",
    },
  ],
};
