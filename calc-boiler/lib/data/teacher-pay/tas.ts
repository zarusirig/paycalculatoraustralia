// Tasmania — public school teacher salaries.
//
// Source of every figure: Schedule 2 (Teacher Salary Scales) of the Teachers
// Agreement 2025, registered by the Tasmanian Industrial Commission as T15363
// of 2026 ([2026] TASIC 40), effective 20 September 2025 and in force until
// 19 September 2028. CROSS-CHECKED against the Department for Education,
// Children and Young People's own Salary Scales (version 1.14, 10 July 2026).
// Read on 28 August 2026. Every figure below matched both sources exactly.
//
// The column in force is "Base + 3% increase effective ffppcooa 1 March 2026".
// Note that Band 1 Level 13, Advanced Skills Teacher and Assistant Principal
// each received a flat structural adjustment BEFORE that 3% was applied
// (clauses 8.2 to 8.4), so those three rows are not a plain 3% on the old rate.
//
// Two traps this page exists to defuse, both real as at 28 August 2026:
//   - DECYP's own web summary table still shows the 1 March 2025 rates.
//   - The consolidated Teaching Service Award's salary table also still ends at
//     1 March 2025. Current rates live in the Agreement's Schedule 2, not the
//     Award.

import type { TeacherPayState } from "./types";

export const TAS_TEACHER_PAY: TeacherPayState = {
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  nameInSentence: "Tasmania",
  employer: "the Tasmanian Department for Education, Children and Young People",
  agreementName: "Teachers Agreement 2025",
  agreementUrl:
    "https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/903196/Teachers-Agreement-2025.pdf",
  ratesEffectiveFrom: "the first full pay period commencing on or after 1 March 2026",
  nextIncrease: {
    date: "1 March 2027",
    detail:
      "A further 3% from the first full pay period commencing on or after 1 March 2027, then 2.75% from 1 March 2028 — both already written into clause 8.1. The 2027 rise takes Band 1 Level 1 to $77,115 and Level 13 to $126,065.",
  },
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Teachers — Band 1, Levels 1 to 13",
      intro:
        "The classroom teacher scale. Four and five year trained teachers do not start at the bottom: the award sets their graduate entry level at Band 1 Level 5.",
      stepHeading: "Level",
      steps: [
        { label: "Band 1 Level 1", salary: 74_869, note: "Three year trained entry point" },
        { label: "Band 1 Level 2", salary: 77_167 },
        { label: "Band 1 Level 3", salary: 79_473 },
        { label: "Band 1 Level 4", salary: 81_762 },
        {
          label: "Band 1 Level 5",
          salary: 85_313,
          note: "Graduate entry for four and five year trained teachers",
        },
        { label: "Band 1 Level 6", salary: 89_651 },
        { label: "Band 1 Level 7", salary: 94_208 },
        { label: "Band 1 Level 8", salary: 99_010 },
        { label: "Band 1 Level 9", salary: 104_050 },
        { label: "Band 1 Level 10", salary: 109_287 },
        { label: "Band 1 Level 11", salary: 114_307 },
        { label: "Band 1 Level 12", salary: 119_989 },
        {
          label: "Band 1 Level 13",
          salary: 122_393,
          note: "Needs 12 months at Level 12 plus full TRB registration",
        },
      ],
    },
    {
      id: "advanced-and-school-leadership",
      title: "Advanced Skills Teacher, assistant principal and deputy principal",
      intro:
        "Everything above Band 1 Level 13 is a promotion: an advertised vacancy at Band 2 or above, filled on merit.",
      stepHeading: "Classification",
      steps: [
        { label: "Advanced Skills Teacher (Band 2)", salary: 129_640 },
        { label: "Assistant Principal (Band 3)", salary: 143_334 },
        { label: "Deputy Principal (Band 3A)", salary: 151_590 },
      ],
    },
    {
      id: "school-based-principals",
      title: "School-based principals — Levels 1 to 6",
      intro:
        "Each principal level has four progression points, and the top point of one level is the same salary as the first point of the next — that is where a promotion lands you.",
      stepHeading: "Level and point",
      steps: [
        { label: "Level 1-1", salary: 151_590 },
        { label: "Level 1-2", salary: 154_905 },
        { label: "Level 1-3", salary: 158_220 },
        { label: "Level 1-4", salary: 161_537 },
        { label: "Level 2-2", salary: 164_849 },
        { label: "Level 2-3", salary: 168_163 },
        { label: "Level 2-4", salary: 171_477 },
        { label: "Level 3-2", salary: 174_793 },
        { label: "Level 3-3", salary: 178_108 },
        { label: "Level 3-4", salary: 181_425 },
        { label: "Level 4-2", salary: 184_740 },
        { label: "Level 4-3", salary: 188_054 },
        { label: "Level 4-4", salary: 191_371 },
        { label: "Level 5-2", salary: 194_685 },
        { label: "Level 5-3", salary: 198_001 },
        { label: "Level 5-4", salary: 201_318 },
        { label: "Level 6-2", salary: 204_633 },
        { label: "Level 6-3", salary: 207_948 },
        { label: "Level 6-4", salary: 211_264, note: "Top of the school-based principal scale" },
      ],
    },
    {
      id: "non-school-based-principals",
      title: "Band 3 non-school-based principals and Band 4 education managers",
      intro: "Positions outside a school, on their own Band 3 and Band 4 scales.",
      stepHeading: "Classification",
      steps: [
        { label: "Band 3 Level 1", salary: 127_961 },
        { label: "Band 3 Level 2", salary: 136_064 },
        { label: "Band 3 Level 3", salary: 143_076 },
        { label: "Band 3 Level 4", salary: 153_632 },
        { label: "Band 3 Level 5", salary: 163_020 },
        { label: "Band 3 Level 6", salary: 168_952 },
        { label: "Band 3 Level 7", salary: 174_456 },
        { label: "Band 3 Level 8", salary: 181_103 },
        { label: "Band 4 Level 1", salary: 215_531 },
        { label: "Band 4 Level 2", salary: 226_251 },
      ],
    },
  ],

  casual: [],

  progression: [
    {
      heading: "You move on your anniversary, not on a common date",
      body: [
        "Progression within Band 1 occurs on the anniversary date of your appointment, based on an assessment against the requirements set in your performance management plan for the previous 12 months plus certification that performance has been satisfactory.",
        "Leave without pay, or a break in service of more than three months, does not count toward continuous service — so either will push your increment date out.",
      ],
    },
    {
      heading: "Your entry level depends on how long you trained",
      body: [
        "The award sets the graduate entry level for four and five year trained teachers at Band 1 Level 5, which is $85,313 — three levels and about $10,000 above where a three-year-trained teacher starts.",
        "Three year trained teachers enter at Band 1 Level 1 and work up through the same ladder.",
      ],
    },
    {
      heading: "The performance management plan is the mechanism",
      body: [
        "The plan must list the performance outcomes and specific requirements, be reviewed annually with at least one discussion between you and your principal, cover your training and development needs, and include a clear statement of outcomes.",
        "That plan is what your increment is assessed against — so it is worth knowing what is in yours before your anniversary.",
      ],
    },
    {
      heading: "An increment can be deferred, but only after a real process",
      body: [
        "The employer may defer or refuse to advance a teacher only if the principal has counselled the employee and clearly explained the criteria that must be met, has provided every opportunity through mentoring, guidance and support, and has allowed at least three months before the decision is taken.",
      ],
    },
    {
      heading: "Level 13 needs full registration",
      body: [
        "Clause 9 of the Teachers Agreement 2025: you are eligible for Band 1 Level 13 provided you have been at Level 12 for 12 months or more and hold full teacher registration certified by the Teachers Registration Board.",
        "If you have the 12 months at Level 12 but not yet full registration, progression happens from the date the TRB certifies it.",
      ],
    },
    {
      heading: "Above Level 13, it is promotion only",
      body: [
        "The award defines a promotable position as duties classified higher than Band 1 Level 13. Getting one means an advertised vacancy at Band 2 or above and selection on merit — there is no incremental path from Level 13 into Advanced Skills Teacher or Assistant Principal.",
      ],
    },
  ],

  notices: [
    "Check the date on any Tasmanian salary table you are shown. As at 28 August 2026 the department's own web summary table and the consolidated Teaching Service Award both still end at the 1 March 2025 rates. The current rates are in Schedule 2 of the Teachers Agreement 2025, and those are what is published below.",
    "Band 1 Level 13, Advanced Skills Teacher and Assistant Principal each received a flat structural adjustment ($500, $400 and $250) before the 3% rise was applied on 1 March 2026, so those three rows are not a straight 3% on the previous year.",
  ],

  unverified: [
    "Education Support Specialist, Specialist VET Teacher and Instrumental Musician scales — separate classifications rather than the teacher scale, so they are not shown here.",
    "The doubled Level 9 and Level 10 increments that apply to some three-year-trained teachers (shown as Year 1 / Year 2 on the department's scales), which are a transitional arrangement rather than a distinct salary.",
  ],

  sources: [
    {
      title: "Teachers Agreement 2025 — Schedule 2, Teacher Salary Scales",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/903196/Teachers-Agreement-2025.pdf",
    },
    {
      title: "Filing of the Teachers Agreement 2025 [2026] TASIC 40 (T15363 of 2026)",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0003/903198/2026-TASIC-40-T15363-of-2026-Filing-of-the-Teachers-Agreement-2025.pdf",
    },
    {
      title: "Salary Scales (version 1.14, 10 July 2026)",
      publisher: "Tasmanian Department for Education, Children and Young People",
      url: "https://publicdocumentcentre.education.tas.gov.au/library/Shared%20Documents/Salary-Scales.pdf",
    },
    {
      title:
        "Teaching Service (Tasmanian Public Sector) Award (S197), consolidated — Order No 5 of 2026",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0009/927630/T15364-No-5-of-2026-Consolidated-Teaching-Service-Tasmanian-Public-Sector-Award-S197.pdf",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in Tasmania?",
      a: "A four or five year trained graduate enters at Band 1 Level 5, $85,313 a year, from the first full pay period on or after 1 March 2026. A three year trained teacher enters at Band 1 Level 1, $74,869.",
    },
    {
      q: "What is the top of the Tasmanian teacher pay scale?",
      a: "Band 1 Level 13, $122,393 a year. Above it, an Advanced Skills Teacher is paid $129,640, an assistant principal $143,334 and a deputy principal $151,590 — all promotion positions rather than steps.",
    },
    {
      q: "How do Tasmanian teachers move up a level?",
      a: "On the anniversary of your appointment, assessed against the requirements in your performance management plan for the previous 12 months plus certification that your performance has been satisfactory. Leave without pay or a break in service over three months pushes the date out.",
    },
    {
      q: "How do you get to Band 1 Level 13 in Tasmania?",
      a: "You need 12 months or more at Level 12 and full teacher registration certified by the Teachers Registration Board. If you have the service but not the registration, you progress from the date the TRB certifies it.",
    },
    {
      q: "Are Tasmanian teachers getting another pay rise?",
      a: "Yes, two more are already locked in. Clause 8.1 of the Teachers Agreement 2025 provides 3% from the first full pay period on or after 1 March 2027 and 2.75% from 1 March 2028. The agreement runs until 19 September 2028.",
    },
    {
      q: "Why do Tasmanian teacher salary tables disagree?",
      a: "Because several official ones are out of date. As at August 2026 the department's web summary table and the consolidated Teaching Service Award both still show the 1 March 2025 rates. The current figures are in Schedule 2 of the Teachers Agreement 2025.",
    },
  ],
};
