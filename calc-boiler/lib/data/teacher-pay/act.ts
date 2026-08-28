// Australian Capital Territory — public school teacher salaries.
//
// Source of every figure: Annex A (Classifications and Rates of Pay) of the
// ACT Public Sector Education Directorate (Teaching Staff) Enterprise Agreement
// 2023-2026, approved by the Fair Work Commission on 14 August 2023 and
// operative from 21 August 2023. Read on 28 August 2026.
//
// Annex A publishes five dated columns. The last one — "1% + $1,000 from
// 4 Dec 2025" — is what this file publishes, because clause C2.2.7 is the final
// increase the agreement makes.
//
// Cross-check: act.gov.au's "Careers in education — pay and benefits" page
// (last updated 20 May 2026) quotes "a starting salary of between $91,396 to
// $104,314 from December 2025", "$108,619 to $129,106" for experienced
// teachers, "$145,938 to $149,107" for school leader C, "$168,900 to $173,125"
// for school leader B and "$195,885 to $225,158" for school leader A. Every
// endpoint matches Annex A exactly.
//
// Structural note: the ACT abolished the old Classroom Teacher 1.1/2.1/3.1
// increment structure on 27 January 2024. The live scale is Permit to Teach
// plus Teacher Level 1-8, so that is what is published here. The superseded
// structure is not shown.

import type { TeacherPayState } from "./types";

export const ACT_TEACHER_PAY: TeacherPayState = {
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  nameInSentence: "the ACT",
  employer: "the ACT Education Directorate",
  agreementName:
    "ACT Public Sector Education Directorate (Teaching Staff) Enterprise Agreement 2023-2026",
  agreementUrl:
    "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0006/2269437/Education-Directorate-Teaching-Staff-Enterprise-Agreement-2023-2026.pdf",
  ratesEffectiveFrom: "the first full pay period on or after 4 December 2025",
  nextIncrease: null,
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "teacher-levels",
      title: "Teacher Level 1 to 8 — the classroom teacher scale",
      intro:
        "The scale every ACT public school teacher is paid on. Teacher Levels 1 to 3 are the New Educator stage and Levels 4 to 8 the Experienced Teacher stage — those are development stages, not separate pay classifications.",
      stepHeading: "Classification",
      steps: [
        { label: "Teacher Level 1", salary: 91_396, note: "New Educator — graduate entry point" },
        { label: "Teacher Level 2", salary: 100_006, note: "New Educator" },
        { label: "Teacher Level 3", salary: 104_314, note: "New Educator" },
        { label: "Teacher Level 4", salary: 108_619, note: "Experienced Teacher" },
        { label: "Teacher Level 5", salary: 112_924, note: "Experienced Teacher" },
        { label: "Teacher Level 6", salary: 120_102, note: "Experienced Teacher" },
        { label: "Teacher Level 7", salary: 127_276, note: "Experienced Teacher" },
        {
          label: "Teacher Level 8",
          salary: 129_106,
          note: "Experienced Teacher — top of the scale",
        },
      ],
    },
    {
      id: "permit-to-teach",
      title: "Permit to Teach",
      intro:
        "Paid to a person teaching under a permit rather than full registration. It sits below Teacher Level 1.",
      stepHeading: "Classification",
      steps: [{ label: "Permit to Teach", salary: 82_796 }],
    },
    {
      id: "school-leaders",
      title: "School leaders — executive teacher, deputy principal and principal",
      intro:
        "The agreement's local designations: School Leader C is an executive teacher, School Leader B a deputy principal, and School Leader A a principal.",
      stepHeading: "Classification",
      steps: [
        { label: "School Leader C1 (executive teacher)", salary: 145_938 },
        { label: "School Leader C2 (executive teacher)", salary: 149_107 },
        { label: "School Leader B1 (deputy principal)", salary: 168_900 },
        { label: "School Leader B2 (deputy principal)", salary: 173_125 },
        { label: "School Leader A Level 1 (principal)", salary: 195_885 },
        { label: "School Leader A Level 2 (principal)", salary: 210_521 },
        { label: "School Leader A Level 3 (principal)", salary: 225_158 },
        { label: "Director School Improvement", salary: 263_195 },
      ],
    },
  ],

  casual: [
    { label: "Casual Rate 1", rate: 451, unit: "day" },
    { label: "Casual Rate 2", rate: 558, unit: "day" },
    { label: "Permit to Teach casual", rate: 329, unit: "day" },
  ],

  progression: [
    {
      heading: "Everyone moves on the same day: 27 January",
      body: [
        "Annex A is explicit — all classroom teachers have a common increment date of 27 January each year. You do not move on your own start-date anniversary; the whole teaching service steps together.",
        "Periods of leave without pay can push your increment date out. The agreement delegates the detail to the Guidelines for Maintaining a Common Increment Date.",
      ],
    },
    {
      heading: "Where you start depends on prior experience, counted in full years",
      body: [
        "Clause Q1.8: teachers are placed on the Teacher Level Classification Structure based on recognition of qualifications and prior experience, including both teaching and other work experience. All prior experience is recognised in full years only.",
        "That means a career changer can start above Teacher Level 1 — but a part-year of experience counts for nothing until it becomes a full year.",
      ],
    },
    {
      heading: "New Educator and Experienced Teacher are stages, not pay grades",
      body: [
        "Clause N4.2 splits the scale into two stages for the purpose of targeting development and support: New Educators at Teacher Levels 1 to 3, Experienced Teachers at Teacher Levels 4 to 8.",
        "New Educators are expected to meet the Proficient Teacher career stage of the Standards to achieve full registration. Experienced Teachers continue developing within the Proficient stage. Neither stage is a separate salary line.",
      ],
    },
    {
      heading: "Highly Accomplished and Lead certification is paid, either way",
      body: [
        "Clause N6.3 requires the head of service to financially reward teachers who achieve certification at the Highly Accomplished or Lead career stage. The reward takes effect from 27 January each year.",
        "If you are not yet at the top of your structure, it is an additional salary increment. If you are already at the top of the Teacher Level structure or at the top of School Leader C, it is a HALT payment instead — $7,495 from December 2025, paid fortnightly for one calendar year.",
      ],
    },
    {
      heading: "Principals do not receive increments",
      body: [
        "Clause X3.2: principal classification levels are determined by the Schools Weighted Index (SWI) and incremental progression does not apply. A principal's School Leader A level follows the school, not their length of service.",
        "School Leader B and C do have two pay points each. The agreement provided for the transition to B1/C1 on 27 January 2024 and progression to B2/C2 on 27 January 2025.",
      ],
    },
  ],

  notices: [
    "The 4 December 2025 increase in clause C2.2.7 is the last one this agreement makes, and its nominal expiry date was 31 March 2026. The rates below remain payable until a replacement agreement is approved.",
    "The ACT Government made a formal pay offer on 9 December 2025 (3% in year one, 2.5% in year two, 2% in year three). That is an offer under negotiation, not an approved agreement for teaching staff, so no figure from it appears on this page.",
  ],

  unverified: [
    "Rates under any replacement agreement — bargaining is under way and nothing has been approved for teaching staff, so no future rate is shown.",
    "The superseded Classroom Teacher 1.1/2.1/3.1 structure, abolished on 27 January 2024.",
    "The detailed increment mechanics, which clause C5 delegates to the Guidelines for Incremental Salary Advancement, the Guidelines for Maintaining a Common Increment Date and the Teacher Performance and Development Guidelines — separate documents not published with the agreement.",
  ],

  sources: [
    {
      title:
        "ACT Public Sector Education Directorate (Teaching Staff) Enterprise Agreement 2023-2026 — Annex A",
      publisher: "ACT Chief Minister, Treasury and Economic Development Directorate",
      url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0006/2269437/Education-Directorate-Teaching-Staff-Enterprise-Agreement-2023-2026.pdf",
    },
    {
      title: "Careers in education — pay and benefits",
      publisher: "ACT Government",
      url: "https://www.act.gov.au/work-with-act-government/careers-in-education/pay-and-benefits",
    },
    {
      title: "ACTPS enterprise agreements",
      publisher: "ACT Chief Minister, Treasury and Economic Development Directorate",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in the ACT?",
      a: "A new teacher starts at Teacher Level 1, $91,396 a year, from the first full pay period on or after 4 December 2025. A teacher with recognised prior experience can start higher — the ACT recognises prior experience in full years only.",
    },
    {
      q: "What is the top of the ACT teacher pay scale?",
      a: "Teacher Level 8, $129,106 a year. Above that you move into a school leader classification: $145,938 at School Leader C1 (executive teacher), $168,900 at School Leader B1 (deputy principal) and $195,885 at School Leader A Level 1 (principal).",
    },
    {
      q: "When do ACT teachers get their pay increment?",
      a: "On 27 January. All classroom teachers share a common increment date, so the whole teaching service moves on the same day rather than on individual work anniversaries. Leave without pay can push your increment date out.",
    },
    {
      q: "Do ACT teachers get paid extra for HALT certification?",
      a: "Yes. The agreement requires a financial reward for teachers who certify as Highly Accomplished or Lead. Below the top of the scale it is an extra salary increment; at the top of the Teacher Level structure or School Leader C it is a HALT payment of $7,495 from December 2025, paid fortnightly for a year.",
    },
    {
      q: "How is an ACT principal's salary set?",
      a: "By the school, not by service. A principal's School Leader A level is determined by the Schools Weighted Index, and the agreement states that incremental progression does not apply to principals. The three levels pay $195,885, $210,521 and $225,158.",
    },
    {
      q: "Are ACT teachers due a pay rise?",
      a: "The 2023-2026 agreement's final increase was on 4 December 2025 and it passed its nominal expiry on 31 March 2026. A government pay offer was made on 9 December 2025 but has not been approved for teaching staff, so there is no scheduled increase currently in force.",
    },
  ],
};
