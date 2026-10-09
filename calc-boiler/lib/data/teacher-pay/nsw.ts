// New South Wales — public school teacher salaries.
//
// Source of every figure: Crown Employees (Teachers in Schools and Related
// Employees) Salaries and Conditions Award 2024, published in the NSW
// Industrial Gazette as Serial C9868 (Vol 397, Part 1, p.50, 29 November 2024).
// Read in full on 28 August 2026.
//
// The award publishes three salary columns — rates from the first full pay
// period on or after 9 October 2024, 9 October 2025 and 9 October 2026, each a
// 3% rise.
//
// ROLLED 9 October 2026: every figure below is now the award's own
// "9.10.2026" column (Schedules 1A, 1B, 2A, 2B Table 2, 3 and 4 Table 1),
// re-read on 9 October 2026 from the IRC gazette copy:
//   http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9868
// It is the last column the award prints; the award remains in force until
// 8 October 2027. Nothing here is computed from the 3%.
//
// Earlier cross-check (28 August 2026): the NSW Department of Education's
// "Salary of a teacher" page quoted $90,177 and $129,536, matching the award's
// 9 October 2025 Step 1 and Step 7 exactly.

import type { TeacherPayState } from "./types";

export const NSW_TEACHER_PAY: TeacherPayState = {
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  nameInSentence: "New South Wales",
  topClassroomStep: "Step 7",
  h1: "NSW Teacher Salary 2026 — Classroom Teacher Pay Scale, Step 1 to Step 7",
  classificationNote:
    "NSW writes the classroom teacher scale as Step 1 to Step 7 (Schedule 1A of the award). Steps 1 and 2 carry Graduate accreditation and Steps 3 to 7 Proficient accreditation; Highly Accomplished and Lead Teacher certification is paid above Step 7.",
  principalScaleIds: ["principals"],
  employer: "NSW Department of Education",
  agreementName:
    "Crown Employees (Teachers in Schools and Related Employees) Salaries and Conditions Award 2024",
  agreementUrl: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9868",
  ratesEffectiveFrom: "the first full pay period on or after 9 October 2026",
  // 9 October 2026 is the award's last salary column; none is published after it.
  nextIncrease: null,
  verifiedOn: "9 October 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers (Schedule 1A)",
      intro:
        "The standards-based salary scale that covers every classroom teacher in a NSW public school, primary and secondary alike. There is one scale — a primary teacher and a secondary teacher on the same step are paid the same.",
      stepHeading: "Step",
      steps: [
        { label: "Step 1", salary: 92_882, note: "Graduate accreditation" },
        { label: "Step 2", salary: 99_889, note: "Graduate accreditation" },
        { label: "Step 3", salary: 104_156, note: "Proficient accreditation" },
        { label: "Step 4", salary: 108_421, note: "Proficient accreditation" },
        { label: "Step 5", salary: 115_972, note: "Proficient accreditation" },
        { label: "Step 6", salary: 124_696, note: "Proficient accreditation" },
        { label: "Step 7", salary: 133_422, note: "Proficient accreditation — top of scale" },
        {
          label: "Highly Accomplished / Lead Teacher",
          salary: 141_997,
          note: "Voluntary higher accreditation",
        },
      ],
    },
    {
      id: "head-teachers-and-executive",
      title: "Head teachers, assistant principals and deputy principals (Schedule 3)",
      intro:
        "School-based promotion positions. Head teacher and assistant principal sit on the same rate; deputy principal is a single rate regardless of primary, secondary or central school.",
      stepHeading: "Position",
      steps: [
        { label: "Head Teacher, high school", salary: 153_531 },
        { label: "Head Teacher, central school", salary: 153_531 },
        { label: "Assistant Principal, primary school", salary: 153_531 },
        { label: "Assistant Principal, central school", salary: 153_531 },
        { label: "Deputy Principal, high school", salary: 179_255 },
        { label: "Deputy Principal, primary school", salary: 179_255 },
        { label: "Deputy Principal (Secondary), central school", salary: 179_255 },
        { label: "Deputy Principal (Primary), central school", salary: 179_255 },
      ],
    },
    {
      id: "principals",
      title: "Principals (Schedule 2A)",
      intro:
        "The principal classification structure. A principal's classification is derived from their school's funding allocation, and P2 to P5 include a complexity loading on top of the base principal salary.",
      stepHeading: "Classification",
      steps: [
        { label: "Teaching Principal 1 (TP1) / Associate Principal", salary: 153_531 },
        { label: "Teaching Principal 2 (TP2) / Associate Principal", salary: 179_255 },
        { label: "Principal 1 (P1)", salary: 184_175 },
        { label: "Principal 2 (P2)", salary: 198_235, note: "Base + $14,060 complexity loading" },
        { label: "Principal 3 (P3)", salary: 219_681, note: "Base + $35,506 complexity loading" },
        { label: "Principal 4 (P4)", salary: 229_288, note: "Base + $45,113 complexity loading" },
        { label: "Principal 5 (P5)", salary: 236_318, note: "Base + $52,143 complexity loading" },
        {
          label: "Executive Principal, Connected Communities",
          salary: 253_369,
          note: "Plus a $50,000 allowance under clause 5.9",
        },
      ],
    },
    {
      id: "school-counsellors",
      title: "School counsellors (Schedule 1B)",
      intro:
        "School counsellors are paid on their own standards-based scale, which tops out well above the classroom teacher scale.",
      stepHeading: "Step",
      steps: [
        { label: "SC1", salary: 104_156 },
        { label: "SC2", salary: 108_421 },
        { label: "SC3", salary: 115_972 },
        { label: "SC4", salary: 124_696 },
        { label: "SC5", salary: 153_531 },
        { label: "School Counsellor Advanced Certification", salary: 165_812 },
      ],
    },
  ],

  casual: [
    { label: "Casual Teacher 1 (CT1)", rate: 480.43, unit: "day", note: "Graduate accreditation" },
    { label: "Casual Teacher 2 (CT2)", rate: 538.73, unit: "day" },
    { label: "Casual Teacher 3 (CT3)", rate: 599.85, unit: "day" },
  ],

  progression: [
    {
      heading: "Where you start",
      body: [
        "Your starting step is set by your level of accreditation on the day you are employed, not by your degree. A teacher accredited at Graduate starts on Step 1. A teacher accredited at Proficient starts on Step 3. A teacher accredited at Highly Accomplished or Lead starts on the Highly Accomplished / Lead Teacher salary.",
      ],
    },
    {
      heading: "Step 1 to Step 2",
      body: [
        "Takes effect from the first full pay period after you complete one year of full-time service at Step 1, subject to satisfactory performance of your duties through the annual performance and development process.",
      ],
    },
    {
      heading: "Step 2 to Step 3 — the accreditation gate",
      body: [
        "This is the one step that is not just time served. It takes effect from the first full pay period after the Teacher Accreditation Authority confirms your Proficient accreditation, provided you have been employed for at least one year full-time at Step 2.",
        "If your Proficient accreditation is confirmed before you have a full year at Step 2, you move up from the first full pay period after you complete that year of full-time service instead.",
      ],
    },
    {
      heading: "Step 3 through Step 7",
      body: [
        "One step a year. Each of Step 3 to 4, 4 to 5, 5 to 6 and 6 to 7 takes effect from the first full pay period after you complete one year of full-time service on that step, provided you keep meeting the requirements of Proficient accreditation (including maintenance) and your performance is satisfactory.",
      ],
    },
    {
      heading: "Step 7 to Highly Accomplished / Lead",
      body: [
        "Not automatic and not time-served — you have to gain the higher accreditation. It takes effect from the first full pay period after the Teacher Accreditation Authority confirms your Highly Accomplished or Lead accreditation, provided you have been paid at Step 7 for at least one year full-time.",
      ],
    },
    {
      heading: "What counts as a year",
      body: [
        "For salary progression, the award defines one year of full-time service as 203 days. Part-time and casual service accrues pro rata, so a 0.5 load takes roughly twice as long to earn a step.",
        "Payment at any step is conditional on maintaining the appropriate level of accreditation.",
      ],
    },
  ],

  notices: [
    "The rates below are the award's 9 October 2026 column, the last 3% rise it schedules, paid from the first full pay period on or after 9 October 2026 — so the first pay with the new rate can fall a little after that date. The award remains in force until 8 October 2027.",
  ],

  unverified: [
    "Locality allowances for rural and remote schools (Schedule 8) — these vary by school and are not a salary rate, so they are not tabled here.",
    "Non-school-based teaching service classifications (education officers, senior education officers) beyond those shown.",
  ],

  sources: [
    {
      title:
        "Crown Employees (Teachers in Schools and Related Employees) Salaries and Conditions Award 2024 (Serial C9868)",
      publisher: "Industrial Relations Commission of New South Wales",
      url: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9868",
    },
    {
      title: "Salary of a teacher",
      publisher: "NSW Department of Education",
      url: "https://education.nsw.gov.au/teach-nsw/explore-teaching/salary-of-a-teacher",
    },
    {
      title: "Awards and determinations",
      publisher: "NSW Department of Education",
      url: "https://education.nsw.gov.au/about-us/careers-at-education/salary-and-benefits/salary-and-awards/awards-and-determinations",
    },
  ],

  faqs: [
    {
      q: "When do NSW teachers get a pay rise?",
      a: "The latest is 3% from the first pay period commencing on or after 9 October 2026 (clause 3 of the Crown Employees (Teachers in Schools and Related Employees) Salaries and Conditions Award 2024), which took Step 1 to $92,882 and Step 7 to $133,422. The previous 3% applied from the first pay period commencing on or after 9 October 2025, and the one before that from 9 October 2024. The 9 October 2026 rise is the last in the award's three-year schedule, and the award remains in force until 8 October 2027, so any further rise depends on a new award. Because it applies from the first pay period on or after 9 October, it shows on your pay a little after that date rather than on the day itself.",
    },
    {
      q: "What is the graduate teacher salary in NSW?",
      a: "A new graduate teacher in a NSW public school starts on Step 1 of the classroom teacher scale, $92,882 a year from the first full pay period on or after 9 October 2026. It was $90,177 under the award's previous column, from 9 October 2025.",
    },
    {
      q: "What is the top of the NSW teacher pay scale?",
      a: "Step 7, $133,422 a year, is the top of the classroom teacher scale. Above that, Highly Accomplished / Lead Teacher accreditation pays $141,997, and moving into a promotion position such as head teacher pays $153,531.",
    },
    {
      q: "How long does it take to reach the top of the NSW teacher scale?",
      a: "Seven years of full-time service is the fastest realistic path: one year at Step 1, one year at Step 2 plus confirmation of Proficient accreditation, then one year on each of Steps 3 to 6. The award counts 203 days as one year of full-time service, so part-time teachers take proportionately longer.",
    },
    {
      q: "How much is a head teacher paid in NSW?",
      a: "A head teacher in a NSW high school or central school is paid $153,531 a year, the same rate as an assistant principal in a primary or central school. A deputy principal is paid $179,255.",
    },
    {
      q: "Do primary and secondary teachers get paid the same in NSW?",
      a: "Yes. Schedule 1A of the award sets a single classroom teacher scale that applies to all teachers in NSW public schools regardless of the stage they teach. Pay differs by step and accreditation, not by primary or secondary.",
    },
    {
      q: "What is the casual teacher daily rate in NSW?",
      a: "Casual teachers are paid a daily rate: $480.43 at CT1 (graduate accreditation), $538.73 at CT2 and $599.85 at CT3, for rates commencing on or after 9 October 2026.",
    },
  ],
};
