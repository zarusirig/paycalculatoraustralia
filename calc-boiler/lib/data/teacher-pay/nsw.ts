// New South Wales — public school teacher salaries.
//
// Source of every figure: Crown Employees (Teachers in Schools and Related
// Employees) Salaries and Conditions Award 2024, published in the NSW
// Industrial Gazette as Serial C9868 (Vol 397, Part 1, p.50, 29 November 2024).
// Read in full on 28 August 2026.
//
// The award publishes three salary columns — rates from the first full pay
// period on or after 9 October 2024, 9 October 2025 and 9 October 2026, each a
// 3% rise. On 28 August 2026 the column IN FORCE is 9 October 2025, which is
// why that is what this file publishes. The 9 October 2026 column is already
// made and appears on the page as the next scheduled increase.
//
// Cross-check: the NSW Department of Education's own "Salary of a teacher" page
// quotes $90,177 for a new graduate and $129,536 at the top of the 7-step
// scale, matching the award's 9 October 2025 Step 1 and Step 7 exactly.

import type { TeacherPayState } from "./types";

export const NSW_TEACHER_PAY: TeacherPayState = {
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  nameInSentence: "New South Wales",
  employer: "NSW Department of Education",
  agreementName:
    "Crown Employees (Teachers in Schools and Related Employees) Salaries and Conditions Award 2024",
  agreementUrl: "http://www.ircgazette.justice.nsw.gov.au/irc/ircgazette.nsf/webviewdate/C9868",
  ratesEffectiveFrom: "9 October 2025",
  nextIncrease: {
    date: "9 October 2026",
    detail:
      "A further 3% from the first full pay period on or after 9 October 2026, already written into the award. That takes Step 1 to $92,882 and Step 7 to $133,422.",
  },
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers (Schedule 1A)",
      intro:
        "The standards-based salary scale that covers every classroom teacher in a NSW public school, primary and secondary alike. There is one scale — a primary teacher and a secondary teacher on the same step are paid the same.",
      stepHeading: "Step",
      steps: [
        { label: "Step 1", salary: 90_177, note: "Graduate accreditation" },
        { label: "Step 2", salary: 96_980, note: "Graduate accreditation" },
        { label: "Step 3", salary: 101_122, note: "Proficient accreditation" },
        { label: "Step 4", salary: 105_263, note: "Proficient accreditation" },
        { label: "Step 5", salary: 112_594, note: "Proficient accreditation" },
        { label: "Step 6", salary: 121_064, note: "Proficient accreditation" },
        { label: "Step 7", salary: 129_536, note: "Proficient accreditation — top of scale" },
        {
          label: "Highly Accomplished / Lead Teacher",
          salary: 137_861,
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
        { label: "Head Teacher, high school", salary: 149_059 },
        { label: "Head Teacher, central school", salary: 149_059 },
        { label: "Assistant Principal, primary school", salary: 149_059 },
        { label: "Assistant Principal, central school", salary: 149_059 },
        { label: "Deputy Principal, high school", salary: 174_034 },
        { label: "Deputy Principal, primary school", salary: 174_034 },
        { label: "Deputy Principal (Secondary), central school", salary: 174_034 },
        { label: "Deputy Principal (Primary), central school", salary: 174_034 },
      ],
    },
    {
      id: "principals",
      title: "Principals (Schedule 2A)",
      intro:
        "The principal classification structure. A principal's classification is derived from their school's funding allocation, and P2 to P5 include a complexity loading on top of the base principal salary.",
      stepHeading: "Classification",
      steps: [
        { label: "Teaching Principal 1 (TP1) / Associate Principal", salary: 149_059 },
        { label: "Teaching Principal 2 (TP2) / Associate Principal", salary: 174_034 },
        { label: "Principal 1 (P1)", salary: 178_811 },
        { label: "Principal 2 (P2)", salary: 192_461, note: "Base + $13,650 complexity loading" },
        { label: "Principal 3 (P3)", salary: 213_283, note: "Base + $34,472 complexity loading" },
        { label: "Principal 4 (P4)", salary: 222_610, note: "Base + $43,799 complexity loading" },
        { label: "Principal 5 (P5)", salary: 229_435, note: "Base + $50,624 complexity loading" },
        {
          label: "Executive Principal, Connected Communities",
          salary: 245_989,
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
        { label: "SC1", salary: 101_122 },
        { label: "SC2", salary: 105_263 },
        { label: "SC3", salary: 112_594 },
        { label: "SC4", salary: 121_064 },
        { label: "SC5", salary: 149_059 },
        { label: "School Counsellor Advanced Certification", salary: 160_983 },
      ],
    },
  ],

  casual: [
    { label: "Casual Teacher 1 (CT1)", rate: 466.44, unit: "day", note: "Graduate accreditation" },
    { label: "Casual Teacher 2 (CT2)", rate: 523.04, unit: "day" },
    { label: "Casual Teacher 3 (CT3)", rate: 582.38, unit: "day" },
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
    "The award commenced on 9 October 2024 and remains in force until 8 October 2027, so the rates below are current and a further 3% is already locked in for 9 October 2026.",
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
      q: "What is the graduate teacher salary in NSW?",
      a: "A new graduate teacher in a NSW public school starts on Step 1 of the classroom teacher scale, $90,177 a year, from the first full pay period on or after 9 October 2025. That rises to $92,882 from 9 October 2026 under the same award.",
    },
    {
      q: "What is the top of the NSW teacher pay scale?",
      a: "Step 7, $129,536 a year, is the top of the classroom teacher scale. Above that, Highly Accomplished / Lead Teacher accreditation pays $137,861, and moving into a promotion position such as head teacher pays $149,059.",
    },
    {
      q: "How long does it take to reach the top of the NSW teacher scale?",
      a: "Seven years of full-time service is the fastest realistic path: one year at Step 1, one year at Step 2 plus confirmation of Proficient accreditation, then one year on each of Steps 3 to 6. The award counts 203 days as one year of full-time service, so part-time teachers take proportionately longer.",
    },
    {
      q: "How much is a head teacher paid in NSW?",
      a: "A head teacher in a NSW high school or central school is paid $149,059 a year, the same rate as an assistant principal in a primary or central school. A deputy principal is paid $174,034.",
    },
    {
      q: "Do primary and secondary teachers get paid the same in NSW?",
      a: "Yes. Schedule 1A of the award sets a single classroom teacher scale that applies to all teachers in NSW public schools regardless of the stage they teach. Pay differs by step and accreditation, not by primary or secondary.",
    },
    {
      q: "What is the casual teacher daily rate in NSW?",
      a: "Casual teachers are paid a daily rate: $466.44 at CT1 (graduate accreditation), $523.04 at CT2 and $582.38 at CT3, from the first full pay period on or after 9 October 2025.",
    },
  ],
};
