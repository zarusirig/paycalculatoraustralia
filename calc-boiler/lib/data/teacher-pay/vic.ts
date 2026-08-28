// Victoria — public school teacher salaries.
//
// Source of every figure: the Department of Education's own salary schedules
// under the Victorian Government Schools Agreement 2022 —
//   Teacher Class Salaries in Victorian Government Schools (last updated
//   17 August 2022), and
//   Principal Class Remuneration in Victorian Government Schools (last updated
//   19 September 2022).
// Both read in full on 28 August 2026.
//
// Those schedules publish nine dated columns, from 24/12/21 through to
// "1/07/25". 1 July 2025 is the LAST column the VGSA 2022 makes, and it is what
// this file publishes. The agreement's nominal expiry date was 31 December 2025
// (VGSA 2022 clause 5), and on 28 August 2026 the department's Industrial
// Agreements resources page still lists the VGSA 2022 as the agreement in
// force, with no newer salary schedule published.
//
// A replacement was announced in-principle on 17 August 2026. Its rates are NOT
// published as a schedule yet, so nothing from it is tabled here. The one
// figure the government itself published — an experienced teacher going from
// $118,063 to $151,419 by 2029 — is quoted on the page as an announcement, and
// $118,063 matches subdivision 2-6 below exactly.

import type { TeacherPayState } from "./types";

export const VIC_TEACHER_PAY: TeacherPayState = {
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  nameInSentence: "Victoria",
  employer: "Victorian Department of Education",
  agreementName: "Victorian Government Schools Agreement 2022 (VGSA 2022)",
  agreementUrl: "https://www2.education.vic.gov.au/pal/salary-rates/overview",
  ratesEffectiveFrom: "the first pay period on or after 1 July 2025",
  nextIncrease: {
    date: "not yet published",
    detail:
      "1 July 2025 is the final salary column the VGSA 2022 makes. A replacement agreement was announced in-principle on 17 August 2026, but no new salary schedule has been published, so this page does not show one.",
  },
  verifiedOn: "28 August 2026",

  scales: [
    {
      id: "classroom-teachers",
      title: "Classroom teachers — Range 1 and Range 2",
      intro:
        "The classroom teacher classification has two salary ranges, each divided into subdivisions. This is the scale every Victorian government school teacher starts on, primary and secondary alike.",
      stepHeading: "Subdivision",
      steps: [
        { label: "1-1", salary: 79_589, note: "Graduate entry point" },
        { label: "1-2", salary: 81_676 },
        { label: "1-3", salary: 84_690 },
        { label: "1-4", salary: 87_814 },
        { label: "1-5", salary: 91_056, note: "Top of Range 1" },
        { label: "2-1", salary: 94_415 },
        { label: "2-2", salary: 97_899 },
        { label: "2-3", salary: 101_512 },
        { label: "2-4", salary: 105_258 },
        { label: "2-5", salary: 109_142 },
        { label: "2-6", salary: 118_063, note: "Top of the classroom teacher scale" },
      ],
    },
    {
      id: "leading-teacher-learning-specialist",
      title: "Leading teachers and learning specialists — Range 3",
      intro:
        "Both classifications sit in Range 3 and are paid identically. They are fixed-term appointments made by the principal, not a step you age into.",
      stepHeading: "Subdivision",
      steps: [
        { label: "3-1", salary: 123_966 },
        { label: "3-2", salary: 129_544 },
      ],
    },
    {
      id: "assistant-principals",
      title: "Assistant principals — Range 1 to Range 4",
      intro:
        "The principal, having regard to the duties and the funding available in the school, determines how many assistant principal positions there are and which range each sits in.",
      stepHeading: "Range and subdivision",
      steps: [
        { label: "1-1", salary: 136_022 },
        { label: "1-2", salary: 138_782 },
        { label: "1-3", salary: 142_806 },
        { label: "1-4", salary: 147_347 },
        { label: "2-1", salary: 148_890 },
        { label: "2-2", salary: 152_165 },
        { label: "2-3", salary: 155_514 },
        { label: "2-4", salary: 161_584 },
        { label: "3-1", salary: 165_139 },
        { label: "3-2", salary: 168_772 },
        { label: "3-3", salary: 172_485 },
        { label: "3-4", salary: 175_820 },
        { label: "4-1", salary: 179_688 },
        { label: "4-2", salary: 183_642 },
        { label: "4-3", salary: 187_682 },
        { label: "4-4", salary: 191_811 },
      ],
    },
    {
      id: "principals",
      title: "Principals — Range 2 to Range 6",
      intro:
        "A principal position's salary range is set by the school's Student Resource Package budget: Range 2 at the bottom, Range 6 for schools with a budget above $15,526,127 (2025 threshold).",
      stepHeading: "Range and subdivision",
      steps: [
        { label: "2-1", salary: 156_335 },
        { label: "2-2", salary: 159_773 },
        { label: "2-3", salary: 163_289 },
        { label: "2-4", salary: 169_664 },
        { label: "3-1", salary: 173_396 },
        { label: "3-2", salary: 177_211 },
        { label: "3-3", salary: 181_109 },
        { label: "3-4", salary: 184_611 },
        { label: "4-1", salary: 188_672 },
        { label: "4-2", salary: 192_824 },
        { label: "4-3", salary: 197_066 },
        { label: "4-4", salary: 201_401 },
        { label: "5-1", salary: 207_782 },
        { label: "5-2", salary: 211_937 },
        { label: "5-3", salary: 216_176 },
        { label: "5-4", salary: 220_499 },
        { label: "6-1", salary: 224_910 },
        { label: "6-2", salary: 229_408 },
        { label: "6-3", salary: 233_996 },
        { label: "6-4", salary: 238_676, note: "Top of the principal class" },
      ],
    },
  ],

  casual: [],

  progression: [
    {
      heading: "Progression happens once a year, on 1 May",
      body: [
        "Within every teaching service classification, salary progression is available on 1 May each year, up to the maximum subdivision of your salary range. The progression cycle runs 1 May to 30 April, and a performance review is done at the end of each school year.",
        "It is not automatic. Progression is based on the annual assessment of your performance under the performance and development process. The VGSA 2022 does, however, forbid the employer from imposing a quota on how many staff can progress in a year — the decision rests solely on each person's own assessment.",
      ],
    },
    {
      heading: "You need six months of eligible service",
      body: [
        "An employee with six or more months of eligible service at or above a subdivision in a progression cycle is eligible to move up. Eligible service includes duty (including time on higher duties), paid leave, and unpaid leave that has been approved to count as service.",
        "If you were promoted in the six months before 1 May you are not eligible to progress that year — unless you had been on higher duties at or above the promotion level earlier in the same cycle, which does count.",
      ],
    },
    {
      heading: "Range 1 to Range 2 is not a time-served step",
      body: [
        "VGSA 2022 clause 16(3): advancement from classroom teacher salary range 1 to classroom teacher salary range 2 is subject to the teacher satisfying the requirements of salary range 2. Reaching 1-5 does not roll you into 2-1 on the calendar.",
        "Range 2 classroom teachers are expected to play a significant role in improving student performance across the school and to build other staff's knowledge of high quality instruction — that is what the requirements test.",
      ],
    },
    {
      heading: "Leading teacher and learning specialist are appointments",
      body: [
        "Range 3 is not the next rung of the classroom teacher scale. Leading teacher and learning specialist are positions the principal creates and fills for a fixed term, and both are paid on the same Range 3 rates.",
        "When a leading teacher or learning specialist appointment expires without renewal, transfer or promotion, the employee becomes a classroom teacher at subdivision 2-6.",
      ],
    },
    {
      heading: "If you are told you will not progress",
      body: [
        "A teacher assessed as not meeting the requirements does not progress that year — but only if they were told in writing before 1 March what standard was expected, where their performance fell short, what the consequences are, and were given the chance to improve.",
        "Progression for everyone else is processed centrally on the payroll.",
      ],
    },
    {
      heading: "Accelerated progression exists but is rare",
      body: [
        "Where a principal considers a teacher is performing well above normal expectations, or where retention is a concern, they can approve accelerated progression within a salary range. It takes effect from 1 May of that cycle and can only come out of the performance and development process.",
        "It is confined to the school that granted it: change schools and your salary reverts to what it would have been without the acceleration, unless the new principal determines otherwise.",
      ],
    },
  ],

  notices: [
    "The VGSA 2022's nominal expiry date was 31 December 2025 and 1 July 2025 is the last salary column it makes. The department has not published a newer schedule, so the rates below are what is published and payable.",
    "An in-principle replacement agreement was announced on 17 August 2026, promising increases of 28.3% to 32.4% over four years and taking an experienced teacher from $118,063 to $151,419 by 2029. No new salary schedule has been published, so no figure from it is tabled here — this page will not estimate one.",
  ],

  unverified: [
    "The rates under the in-principle 2026 agreement — announced but not published as a salary schedule, and not tabled here.",
    "Casual relief teacher (CRT) rates — published on a separate departmental schedule not read for this page.",
    "Paraprofessional and education support class scales, which are separate classifications.",
    "Liaison principal rates, which mirror the principal ranges but are a distinct classification.",
  ],

  sources: [
    {
      title: "Salary Rates: Overview (teacher and principal class salary schedules)",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/salary-rates/overview",
    },
    {
      title: "Victorian Government Schools Agreement 2022",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/industrial-agreements/resources",
    },
    {
      title: "Remuneration — Teaching Service: Annual progression",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/remuneration-teaching-service/policy-and-guidelines/annual-progression",
    },
    {
      title: "Career Structure — Teaching Service: Policy and Guidelines",
      publisher: "Victorian Department of Education",
      url: "https://www2.education.vic.gov.au/pal/career-structure-teaching-service/policy-and-guidelines",
    },
    {
      title: "Labor Is Giving Education Workers A Payrise (17 August 2026)",
      publisher: "Premier of Victoria",
      url: "https://www.premier.vic.gov.au/labor-giving-education-workers-payrise",
    },
  ],

  faqs: [
    {
      q: "What is the graduate teacher salary in Victoria?",
      a: "A graduate teacher starts at classroom teacher subdivision 1-1, $79,589 a year, under the Victorian Government Schools Agreement 2022 schedule effective from the first pay period on or after 1 July 2025.",
    },
    {
      q: "What is the top of the Victorian teacher pay scale?",
      a: "Subdivision 2-6, $118,063 a year, is the top of the classroom teacher scale. Above it, leading teachers and learning specialists are paid $123,966 at 3-1 and $129,544 at 3-2, but those are fixed-term appointments rather than steps.",
    },
    {
      q: "When do Victorian teachers move up a pay step?",
      a: "On 1 May each year, subject to the annual performance and development assessment and at least six months of eligible service at or above your current subdivision. The employer cannot impose a quota on how many teachers progress.",
    },
    {
      q: "How do you get from Range 1 to Range 2 in Victoria?",
      a: "Not by waiting. VGSA 2022 clause 16(3) makes advancement from classroom teacher Range 1 to Range 2 subject to satisfying the requirements of Range 2 — a role expectation about improving student performance across the school and building other staff's practice, not a length-of-service test.",
    },
    {
      q: "What is a principal paid in Victoria?",
      a: "Principal salaries run from $156,335 at Range 2 subdivision 2-1 to $238,676 at Range 6 subdivision 6-4. The range a principal position sits in is set by the school's Student Resource Package budget and reviewed each year.",
    },
    {
      q: "Are Victorian teachers getting a pay rise?",
      a: "An in-principle replacement for the VGSA 2022 was announced on 17 August 2026, promising 28.3% to 32.4% over four years and taking an experienced teacher from $118,063 to $151,419 by 2029. No new salary schedule has been published yet, so the rates on this page are the ones currently published and payable.",
    },
  ],
};
